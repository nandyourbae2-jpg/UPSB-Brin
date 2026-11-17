"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { BottomSheet } from "@/components/ui/DialogAndSheet";
import { Select, Textarea, TextField } from "@/components/ui/Fields";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { StatusPill } from "@/components/ui/StatusPill";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { IconCutting, IconPartnership, IconPot, IconTrace } from "@/components/icons";
import {
  adminPageContent,
  DEMO_BATCHES,
  INITIAL_DEMO_ORDERS,
  INITIAL_DEMO_PARTNERSHIPS,
  ORDER_STATUS_META,
  PARTNERSHIP_STATUS_META,
  type DemoOrder,
  type DemoPartnership,
  type OrderStatus,
  type PartnershipStatus,
} from "@/content/demo-flows";
import {
  buildOrderWhatsAppDraft,
  buildPartnershipWhatsAppDraft,
  computeAdminStats,
  loadDemoOrders,
  loadDemoPartnerships,
  resetAllDemoData,
  updateDemoOrder,
  updateDemoPartnership,
} from "@/lib/demo-store";

type AdminTab = "orders" | "partnerships" | "batches";

const FILTER_ORDER_STATUSES: readonly ("ALL" | OrderStatus)[] = [
  "ALL",
  "NEW",
  "NEED_INFORMATION",
  "CONTACTED",
  "QUOTED",
  "CONFIRMED",
  "IN_PRODUCTION",
  "SHIPPED",
];

function csvCell(value: string | number): string {
  const s = String(value).replace(/"/g, '""');
  return `"${s}"`;
}

export function AdminDemoView({ whatsappNumber }: { whatsappNumber: string | null }) {
  const { show: showToast } = useToast();
  const [tab, setTab] = useState<AdminTab>("orders");
  const [orders, setOrders] = useState<DemoOrder[]>([...INITIAL_DEMO_ORDERS]);
  const [partnerships, setPartnerships] = useState<DemoPartnership[]>([...INITIAL_DEMO_PARTNERSHIPS]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderStatusDraft, setOrderStatusDraft] = useState<OrderStatus>("NEW");
  const [orderNoteDraft, setOrderNoteDraft] = useState("");

  const [selectedPartnershipId, setSelectedPartnershipId] = useState<string | null>(null);
  const [partnershipStatusDraft, setPartnershipStatusDraft] = useState<PartnershipStatus>("NEW");
  const [partnershipNoteDraft, setPartnershipNoteDraft] = useState("");

  useEffect(() => {
    const syncId = window.requestAnimationFrame(() => {
      setOrders(loadDemoOrders());
      setPartnerships(loadDemoPartnerships());
    });
    return () => window.cancelAnimationFrame(syncId);
  }, []);

  const stats = computeAdminStats(orders, partnerships);
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null;
  const selectedPartnership = partnerships.find((p) => p.id === selectedPartnershipId) ?? null;

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.locationSummary.toLowerCase().includes(q) ||
      o.varieties.join(" ").toLowerCase().includes(q)
    );
  });

  function openOrderSheet(order: DemoOrder) {
    setSelectedOrderId(order.id);
    setOrderStatusDraft(order.status);
    setOrderNoteDraft(order.internalNote);
  }

  function handleSaveOrder() {
    if (!selectedOrder) return;
    const next = updateDemoOrder(selectedOrder.id, orderStatusDraft, orderNoteDraft);
    setOrders(next);
    setSelectedOrderId(null);
    showToast(`Status ${selectedOrder.id} diperbarui di browser.`, "success");
  }

  function openPartnershipSheet(p: DemoPartnership) {
    setSelectedPartnershipId(p.id);
    setPartnershipStatusDraft(p.status);
    setPartnershipNoteDraft(p.internalNote);
  }

  function handleSavePartnership() {
    if (!selectedPartnership) return;
    const next = updateDemoPartnership(selectedPartnership.id, partnershipStatusDraft, partnershipNoteDraft);
    setPartnerships(next);
    setSelectedPartnershipId(null);
    showToast(`Status ${selectedPartnership.id} diperbarui di browser.`, "success");
  }

  function handleExportCsv() {
    const header = ["Kode", "Pemesan", "Jenis Pelanggan", "Produk", "Varietas", "Jumlah", "Pekan", "Lokasi", "Status"];
    const rows = filteredOrders.map((o) =>
      [
        o.id,
        o.customerName,
        o.customerType,
        o.productType === "pot" ? "Pot 12 cm" : "Stek berakar",
        o.varieties.join("+"),
        o.quantity,
        o.targetWeek,
        o.locationSummary,
        ORDER_STATUS_META[o.status].label,
      ]
        .map(csvCell)
        .join(","),
    );
    const csv = [header.map(csvCell).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "upsb-permintaan-demo.csv";
    link.click();
    URL.revokeObjectURL(url);
    showToast("Berkas CSV demo diunduh.", "info");
  }

  async function handleCopyDraft(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Draf pesan WhatsApp disalin.", "success");
    } catch {
      showToast("Gagal menyalin otomatis; pilih teks secara manual.", "error");
    }
  }

  function handleResetDemo() {
    const restored = resetAllDemoData();
    setOrders(restored.orders);
    setPartnerships(restored.partnerships);
    setStatusFilter("ALL");
    setSearchQuery("");
    showToast("Data demo dikembalikan ke contoh awal.", "info");
  }

  const statCards = [
    { label: "Permintaan baru", value: stats.newOrders, highlight: true },
    { label: "Ditindaklanjuti", value: stats.inReviewOrders, highlight: false },
    { label: "Terkonfirmasi", value: stats.confirmedOrders, highlight: false },
    { label: "Produksi & kirim", value: stats.productionOrShippingOrders, highlight: false },
    { label: "Pengajuan mitra", value: stats.openPartnerships, highlight: false },
    { label: "Total permintaan", value: stats.totalOrders, highlight: false },
    { label: "Batch QR aktif", value: stats.activeQrBatches, highlight: false },
    { label: "Selesai / tutup", value: stats.completedOrClosedOrders, highlight: false },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <StatusPill tone="warn">{adminPageContent.badge}</StatusPill>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={handleExportCsv}>
              Unduh CSV
            </Button>
            <Button size="sm" variant="outline" onClick={handleResetDemo}>
              Reset data demo
            </Button>
          </div>
        </div>
        <h1 className="text-title1 font-extrabold text-ink">{adminPageContent.title}</h1>
        <p className="max-w-[65ch] text-body text-ink-muted">{adminPageContent.subtitle}</p>
        <div className="rounded-lg bg-warn-bg p-4 text-body-sm font-semibold text-warn-ink">
          {adminPageContent.authNotice}
        </div>
      </header>

      <section aria-label="Ringkasan 8 metrik admin" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {statCards.map((card) => (
          <Card
            key={card.label}
            elevation={card.highlight ? "raised" : "flat"}
            tone={card.highlight ? "surface" : "alt"}
            className={card.highlight ? "border-primary bg-primary-tint" : undefined}
          >
            <p className="text-display font-extrabold tabular-nums text-ink">{card.value}</p>
            <p className="text-body-sm font-bold text-ink-muted">{card.label}</p>
          </Card>
        ))}
      </section>

      <SegmentedControl
        legend="Area pengelolaan demo"
        name="adminTab"
        value={tab}
        onChange={(v) => setTab(v === "partnerships" ? "partnerships" : v === "batches" ? "batches" : "orders")}
        options={[
          { value: "orders", label: `Permintaan (${orders.length})` },
          { value: "partnerships", label: `Kemitraan (${partnerships.length})` },
          { value: "batches", label: `Batch QR (${DEMO_BATCHES.length})` },
        ]}
      />

      {tab === "orders" ? (
        <section aria-label="Daftar permintaan produk" className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <TextField
              label="Cari permintaan"
              placeholder="Cari kode ORD, pemesan, kota, atau varietas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter status permintaan">
              {FILTER_ORDER_STATUSES.map((key) => (
                <Chip key={key} selected={statusFilter === key} onClick={() => setStatusFilter(key)}>
                  {key === "ALL" ? "Semua" : ORDER_STATUS_META[key].label}
                </Chip>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <Card tone="alt" className="p-6 text-center text-body text-ink-muted">
              Tidak ada permintaan yang cocok dengan filter saat ini.
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredOrders.map((order) => {
                const statusMeta = ORDER_STATUS_META[order.status];
                const ProductIcon = order.productType === "pot" ? IconPot : IconCutting;
                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => openOrderSheet(order)}
                    className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-4 rounded-lg border border-line bg-surface p-4 text-left transition-colors duration-(--motion-fast) hover:bg-surface-alt"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary-pressed">
                        <ProductIcon width={24} height={24} />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-body-sm font-extrabold tabular-nums text-ink">{order.id}</span>
                          {!order.isDemoSample ? <StatusPill tone="success">Dikirim dari browser ini</StatusPill> : null}
                        </div>
                        <p className="truncate text-body font-bold text-ink">{order.customerName}</p>
                        <p className="text-body-sm text-ink-muted">
                          {order.quantity.toLocaleString("id-ID")} {order.productType === "pot" ? "pot" : "stek"}{" "}
                          {order.varieties.map((v) => (v === "fabiola" ? "Fabiola" : "Claire")).join(" & ")} ·{" "}
                          {order.locationSummary} · {order.targetWeek}
                        </p>
                      </div>
                    </div>
                    <StatusPill tone={statusMeta.tone}>{statusMeta.label}</StatusPill>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      ) : null}

      {tab === "partnerships" ? (
        <section aria-label="Daftar pengajuan kemitraan" className="flex flex-col gap-3">
          {partnerships.map((p) => {
            const statusMeta = PARTNERSHIP_STATUS_META[p.status];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => openPartnershipSheet(p)}
                className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-4 rounded-lg border border-line bg-surface p-4 text-left transition-colors duration-(--motion-fast) hover:bg-surface-alt"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-leaf-tint text-leaf">
                    <IconPartnership width={24} height={24} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-body-sm font-extrabold tabular-nums text-ink">{p.id}</span>
                      {!p.isDemoSample ? <StatusPill tone="success">Dikirim dari browser ini</StatusPill> : null}
                    </div>
                    <p className="truncate text-body font-bold text-ink">{p.businessName}</p>
                    <p className="text-body-sm text-ink-muted">
                      {p.contactName} · {p.businessType} · {p.cityProvince}
                    </p>
                  </div>
                </div>
                <StatusPill tone={statusMeta.tone}>{statusMeta.label}</StatusPill>
              </button>
            );
          })}
        </section>
      ) : null}

      {tab === "batches" ? (
        <section aria-label="Daftar batch QR demo" className="flex flex-col gap-3">
          {DEMO_BATCHES.map((batch) => (
            <Card key={batch.slug} elevation="flat" className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary-pressed">
                  <IconTrace width={24} height={24} />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-title3 font-extrabold tabular-nums text-ink">{batch.slug}</span>
                    <StatusPill tone={batch.active ? "success" : "warn"}>
                      {batch.active ? "QR aktif" : "Dinonaktifkan"}
                    </StatusPill>
                  </div>
                  <p className="text-body-sm text-ink-muted">
                    {batch.productLabel} · {batch.varietyName} · {batch.productionLocation}
                  </p>
                </div>
              </div>
              <ButtonLink href={`/trace/${batch.slug}`} size="sm" variant="secondary">
                Pratinjau halaman QR
              </ButtonLink>
            </Card>
          ))}
        </section>
      ) : null}

      <BottomSheet
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrderId(null)}
        title={selectedOrder ? `Detail ${selectedOrder.id}` : "Detail permintaan"}
        desktopMode="side-panel"
        tall
      >
        {selectedOrder ? (
          <div className="flex flex-col gap-4">
            <dl className="m-0 flex flex-col divide-y divide-line text-body-sm">
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-ink-muted">Pemesan</dt>
                <dd className="m-0 text-right font-bold text-ink">
                  {selectedOrder.customerName} ({selectedOrder.customerType})
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-ink-muted">WhatsApp</dt>
                <dd className="m-0 text-right font-bold tabular-nums text-ink">{selectedOrder.whatsapp}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-ink-muted">Produk</dt>
                <dd className="m-0 text-right font-bold text-ink">
                  {selectedOrder.quantity.toLocaleString("id-ID")}{" "}
                  {selectedOrder.productType === "pot" ? "pot" : "stek"}{" "}
                  {selectedOrder.varieties.map((v) => (v === "fabiola" ? "Fabiola" : "Claire")).join(" & ")}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-ink-muted">Pekan &amp; tujuan</dt>
                <dd className="m-0 text-right font-semibold text-ink">
                  {selectedOrder.targetWeek} · {selectedOrder.locationSummary}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-ink-muted">Alamat</dt>
                <dd className="m-0 max-w-[30ch] text-right text-ink">{selectedOrder.address}</dd>
              </div>
            </dl>

            <Select
              label="Ubah status"
              value={orderStatusDraft}
              onChange={(e) => setOrderStatusDraft(e.target.value as OrderStatus)}
            >
              {(Object.keys(ORDER_STATUS_META) as OrderStatus[]).map((statusKey) => (
                <option key={statusKey} value={statusKey}>
                  {ORDER_STATUS_META[statusKey].label} ({statusKey})
                </option>
              ))}
            </Select>

            <Textarea
              label="Catatan internal admin"
              value={orderNoteDraft}
              onChange={(e) => setOrderNoteDraft(e.target.value)}
            />

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSaveOrder}>Simpan perubahan (Demo)</Button>
              <Button
                variant="outline"
                onClick={() => handleCopyDraft(buildOrderWhatsAppDraft(selectedOrder))}
              >
                Salin draf WhatsApp
              </Button>
            </div>

            <WhatsAppAction
              whatsappNumber={whatsappNumber}
              message={buildOrderWhatsAppDraft(selectedOrder)}
              label="Buka WhatsApp dengan draf"
              showFallbackLink={false}
            />

            <div className="flex flex-col gap-2 border-t border-line pt-3">
              <h3 className="text-body-sm font-bold text-ink">Riwayat perubahan status</h3>
              <ul className="m-0 flex list-none flex-col gap-2 p-0 text-caption text-ink-muted">
                {selectedOrder.history.map((entry, idx) => (
                  <li key={`${entry.changedAt}-${idx}`} className="rounded-md bg-surface-alt p-2">
                    <span className="font-bold text-ink">
                      {entry.from ? `${entry.from} -> ${entry.to}` : entry.to}
                    </span>{" "}
                    oleh {entry.changedBy}: {entry.note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={Boolean(selectedPartnership)}
        onClose={() => setSelectedPartnershipId(null)}
        title={selectedPartnership ? `Kemitraan ${selectedPartnership.id}` : "Detail kemitraan"}
        desktopMode="side-panel"
        tall
      >
        {selectedPartnership ? (
          <div className="flex flex-col gap-4">
            <dl className="m-0 flex flex-col divide-y divide-line text-body-sm">
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-ink-muted">Usaha</dt>
                <dd className="m-0 text-right font-bold text-ink">{selectedPartnership.businessName}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-ink-muted">Penanggung jawab</dt>
                <dd className="m-0 text-right font-bold text-ink">
                  {selectedPartnership.contactName}
                  {selectedPartnership.roleTitle ? ` (${selectedPartnership.roleTitle})` : ""}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-ink-muted">Jenis &amp; wilayah</dt>
                <dd className="m-0 text-right font-semibold text-ink">
                  {selectedPartnership.businessType} · {selectedPartnership.cityProvince}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-ink-muted">Minat kerja sama</dt>
                <dd className="m-0 text-right font-semibold text-ink">
                  {selectedPartnership.cooperationTypes.join(", ")}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-ink-muted">Estimasi volume</dt>
                <dd className="m-0 text-right text-ink">{selectedPartnership.monthlyVolume}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-ink-muted">WhatsApp</dt>
                <dd className="m-0 text-right font-bold tabular-nums text-ink">{selectedPartnership.whatsapp}</dd>
              </div>
            </dl>

            <Select
              label="Status peninjauan"
              value={partnershipStatusDraft}
              onChange={(e) => setPartnershipStatusDraft(e.target.value as PartnershipStatus)}
            >
              {(Object.keys(PARTNERSHIP_STATUS_META) as PartnershipStatus[]).map((statusKey) => (
                <option key={statusKey} value={statusKey}>
                  {PARTNERSHIP_STATUS_META[statusKey].label} ({statusKey})
                </option>
              ))}
            </Select>

            <Textarea
              label="Catatan peninjauan"
              value={partnershipNoteDraft}
              onChange={(e) => setPartnershipNoteDraft(e.target.value)}
            />

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSavePartnership}>Simpan status (Demo)</Button>
              <Button
                variant="outline"
                onClick={() => handleCopyDraft(buildPartnershipWhatsAppDraft(selectedPartnership))}
              >
                Salin draf WhatsApp
              </Button>
            </div>

            <WhatsAppAction
              whatsappNumber={whatsappNumber}
              message={buildPartnershipWhatsAppDraft(selectedPartnership)}
              label="Buka WhatsApp dengan draf"
              showFallbackLink={false}
            />
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
