import {
  DEMO_BATCHES,
  INITIAL_DEMO_ORDERS,
  INITIAL_DEMO_PARTNERSHIPS,
  type DemoBatch,
  type DemoOrder,
  type DemoPartnership,
  type OrderStatus,
  type PartnershipStatus,
} from "@/content/demo-flows";

const ORDERS_STORAGE_KEY = "upsb_demo_orders_v1";
const PARTNERSHIPS_STORAGE_KEY = "upsb_demo_partnerships_v1";

/** Normalisasi dan validasi nomor WhatsApp Indonesia (08... atau +628... atau 628...). */
export function isValidWhatsapp(raw: string): boolean {
  const cleaned = raw.replace(/[\s-]/g, "");
  return /^(\+?62|0)8\d{7,12}$/.test(cleaned);
}

/** Validasi format email sederhana jika diisi. */
export function isValidOptionalEmail(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/** Memformat rupiah tanpa desimal agar konsisten di seluruh aplikasi. */
export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

/** Menghasilkan daftar 8 pekan mendatang untuk preferensi pekan kebutuhan. */
export function generateOrderWeeks(referenceDate = new Date("2026-11-17T00:00:00+07:00")): string[] {
  const fmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const fmtShort = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" });
  const start = new Date(referenceDate);
  const offsetToMonday = (8 - start.getDay()) % 7 || 7;
  start.setDate(start.getDate() + offsetToMonday);

  const weeks: string[] = [];
  for (let i = 0; i < 8; i += 1) {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    weeks.push(`${fmtShort.format(start)} - ${fmt.format(end)}`);
    start.setDate(start.getDate() + 7);
  }
  return weeks;
}

/** Membuat nomor referensi permintaan acak yang terstruktur (ORD-YYYY-XXXXX). */
export function createOrderReference(): string {
  const year = 2026;
  const suffix = String(Math.floor(10000 + Math.random() * 89999));
  return `ORD-${year}-${suffix}`;
}

/** Membuat nomor referensi pengajuan mitra (PRT-YYYY-XXXXX). */
export function createPartnershipReference(): string {
  const year = 2026;
  const suffix = String(Math.floor(10000 + Math.random() * 89999));
  return `PRT-${year}-${suffix}`;
}

export function loadDemoOrders(): DemoOrder[] {
  if (typeof window === "undefined") return [...INITIAL_DEMO_ORDERS];
  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [...INITIAL_DEMO_ORDERS];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as DemoOrder[]) : [...INITIAL_DEMO_ORDERS];
  } catch {
    return [...INITIAL_DEMO_ORDERS];
  }
}

export function addDemoOrder(order: DemoOrder): DemoOrder[] {
  const next = [order, ...loadDemoOrders()];
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Abaikan jika penyimpanan browser penuh atau diblokir.
    }
  }
  return next;
}

export function updateDemoOrder(orderId: string, nextStatus: OrderStatus, internalNote: string): DemoOrder[] {
  const current = loadDemoOrders();
  const next = current.map((item) => {
    if (item.id !== orderId) return item;
    const statusChanged = item.status !== nextStatus;
    const history = statusChanged
      ? [
          ...item.history,
          {
            from: item.status,
            to: nextStatus,
            changedBy: "Admin Demo",
            changedAt: new Date().toISOString(),
            note: internalNote.trim() || "Pembaruan status pada pratinjau demo.",
          },
        ]
      : item.history;
    return {
      ...item,
      status: nextStatus,
      internalNote,
      history,
    };
  });
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Abaikan.
    }
  }
  return next;
}

export function loadDemoPartnerships(): DemoPartnership[] {
  if (typeof window === "undefined") return [...INITIAL_DEMO_PARTNERSHIPS];
  try {
    const raw = window.localStorage.getItem(PARTNERSHIPS_STORAGE_KEY);
    if (!raw) return [...INITIAL_DEMO_PARTNERSHIPS];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? (parsed as DemoPartnership[])
      : [...INITIAL_DEMO_PARTNERSHIPS];
  } catch {
    return [...INITIAL_DEMO_PARTNERSHIPS];
  }
}

export function addDemoPartnership(partnership: DemoPartnership): DemoPartnership[] {
  const next = [partnership, ...loadDemoPartnerships()];
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(PARTNERSHIPS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Abaikan.
    }
  }
  return next;
}

export function updateDemoPartnership(
  partnershipId: string,
  nextStatus: PartnershipStatus,
  internalNote: string,
): DemoPartnership[] {
  const next = loadDemoPartnerships().map((item) =>
    item.id === partnershipId ? { ...item, status: nextStatus, internalNote } : item,
  );
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(PARTNERSHIPS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Abaikan.
    }
  }
  return next;
}

export function resetAllDemoData(): { orders: DemoOrder[]; partnerships: DemoPartnership[] } {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(ORDERS_STORAGE_KEY);
      window.localStorage.removeItem(PARTNERSHIPS_STORAGE_KEY);
    } catch {
      // Abaikan.
    }
  }
  return {
    orders: [...INITIAL_DEMO_ORDERS],
    partnerships: [...INITIAL_DEMO_PARTNERSHIPS],
  };
}

/** Mencari batch QR demo berdasarkan slug (tidak peka huruf besar/kecil). */
export function lookupDemoBatch(slug: string): DemoBatch | null {
  const normalized = slug.trim().toUpperCase();
  if (!normalized) return null;
  return DEMO_BATCHES.find((b) => b.slug.toUpperCase() === normalized) ?? null;
}

export function buildOrderWhatsAppDraft(order: DemoOrder): string {
  const productLabel = order.productType === "pot" ? "Tanaman pot 12 cm" : "Stek berakar";
  const varietiesText = order.varieties.map((v) => (v === "fabiola" ? "Fabiola" : "Claire")).join(" & ");
  const unitLabel = order.productType === "pot" ? "pot" : "stek";
  return [
    `Halo Admin UPSB, saya ingin menindaklanjuti permintaan ${order.id}.`,
    `- Pemesan: ${order.customerName} (${order.customerType})`,
    `- Produk: ${productLabel} (${varietiesText})`,
    `- Jumlah: ${order.quantity} ${unitLabel}`,
    `- Perkiraan pekan: ${order.targetWeek}`,
    `- Tujuan: ${order.locationSummary}`,
    "Mohon informasi ketersediaan jadwal, total biaya, dan langkah selanjutnya.",
  ].join("\n");
}

export function buildPartnershipWhatsAppDraft(p: DemoPartnership): string {
  return [
    `Halo Admin UPSB, saya ${p.contactName} dari ${p.businessName} (${p.cityProvince}) mengirim pengajuan kemitraan ${p.id}.`,
    `- Kerja sama diminati: ${p.cooperationTypes.join(", ")}`,
    `- Perkiraan volume: ${p.monthlyVolume}`,
    "Mohon informasi penjadwalan diskusi peninjauan awal.",
  ].join("\n");
}

export interface AdminDashboardMetrics {
  newOrders: number;
  inReviewOrders: number;
  confirmedOrders: number;
  productionOrShippingOrders: number;
  completedOrClosedOrders: number;
  totalOrders: number;
  openPartnerships: number;
  activeQrBatches: number;
}

export function computeAdminStats(
  orders: readonly DemoOrder[],
  partnerships: readonly DemoPartnership[],
): AdminDashboardMetrics {
  const count = (statuses: readonly OrderStatus[]) => orders.filter((o) => statuses.includes(o.status)).length;
  return {
    newOrders: count(["NEW"]),
    inReviewOrders: count(["UNDER_REVIEW", "NEED_INFORMATION", "CONTACTED", "QUOTED"]),
    confirmedOrders: count(["CONFIRMED"]),
    productionOrShippingOrders: count(["IN_PRODUCTION", "READY_TO_SHIP", "SHIPPED"]),
    completedOrClosedOrders: count(["COMPLETED", "CANCELLED", "REJECTED"]),
    totalOrders: orders.length,
    openPartnerships: partnerships.filter((p) => p.status !== "DECLINED").length,
    activeQrBatches: DEMO_BATCHES.filter((b) => b.active).length,
  };
}
