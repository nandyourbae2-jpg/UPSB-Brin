import { getFlowerHotspots, type VarietyData } from "@/lib/flower-data";

export type ProductType = "pot" | "stek";
export type VarietySlug = "fabiola" | "claire";

export interface CatalogProduct {
  id: string;
  productType: ProductType;
  productLabel: string;
  variety: VarietySlug;
  varietyName: string;
  traits: string[];
  caveat: string;
  indicativePrice: string;
  unit: string;
  availabilityLabel: string;
  audience: string;
  orderHref: string;
  detailHref: string;
}

export const catalogStrings = {
  meta: {
    title: "Katalog produk",
    description:
      "Pilihan tanaman pot berbunga 12 cm dan stek berakar Pacar Air varietas Fabiola serta Claire dari UPSB Baturraden.",
  },
  title: "Katalog produk",
  lead: "Pilih produk pot berbunga 12 cm atau stek berakar untuk nursery. Semua pengajuan dicatat sebagai permintaan untuk ditinjau admin.",
  filter: {
    openMobile: "Filter katalog",
    sheetTitle: "Filter katalog",
    apply: "Terapkan filter",
    reset: "Reset filter",
    typeLegend: "Jenis produk",
    varietyLegend: "Varietas",
    all: "Semua",
    types: [
      { value: "all", label: "Semua jenis" },
      { value: "pot", label: "Pot 12 cm" },
      { value: "stek", label: "Stek berakar" },
    ] as const,
    varieties: [
      { value: "all", label: "Semua varietas" },
      { value: "fabiola", label: "Fabiola" },
      { value: "claire", label: "Claire" },
    ] as const,
  },
  card: {
    requestCta: "Minta produk",
    detailCta: "Detail varietas",
    priceHidden: "Harga dikonfirmasi oleh admin",
    indicativePrefix: "Harga indikatif",
  },
  empty: {
    title: "Tidak ada produk yang cocok",
    body: "Ubah pilihan jenis atau varietas untuk menampilkan produk yang tersedia dalam katalog.",
  },
  priceDisclaimer:
    "Harga indikatif belum termasuk ongkos kirim dan bukan janji transaksi. Status ketersediaan dikonfirmasi oleh admin lewat WhatsApp.",
  detail: {
    backToCatalog: "Semua produk",
    traitsHeading: "Ciri varietas (materi teknologi YIM_013)",
    caveatHeading: "Catatan validasi dan hak varietas",
    rightsNote:
      "Penggunaan varietas Fabiola dan Claire bergantung pada persetujuan tertulis pemegang hak. Adaptasi dataran rendah merupakan arah seleksi yang masih divalidasi uji lokal.",
    linesHeading: "Pilihan bentuk produk",
    exploreCta: "Jelajahi anatomi bunga 3D",
  },
} as const;

const productDefinitions: ReadonlyArray<{
  type: ProductType;
  label: string;
  price: string;
  unit: string;
  audience: string;
}> = [
  {
    type: "pot",
    label: "Tanaman pot berbunga 12 cm",
    price: "Rp11.000",
    unit: "per pot",
    audience: "Untuk kios tanaman hias, lanskap, hotel, atau perorangan.",
  },
  {
    type: "stek",
    label: "Stek berakar",
    price: "Rp2.800",
    unit: "per stek",
    audience: "Untuk mitra nursery dan pembibitan yang membesarkan tanaman.",
  },
];

export function getVarietyProfile(slug: string): VarietyData | null {
  const varieties = getFlowerHotspots().varieties;
  return varieties.find((v) => v.id === slug) ?? null;
}

export function getCatalogProducts(): CatalogProduct[] {
  const varieties = getFlowerHotspots().varieties;
  const items: CatalogProduct[] = [];
  for (const def of productDefinitions) {
    for (const v of varieties) {
      items.push({
        id: `${def.type}-${v.id}`,
        productType: def.type,
        productLabel: def.label,
        variety: v.id,
        varietyName: v.name,
        traits: v.traits,
        caveat: v.caveat,
        indicativePrice: def.price,
        unit: def.unit,
        availabilityLabel: "Peninjauan jadwal",
        audience: def.audience,
        orderHref: `/pesan?produk=${def.type}&varietas=${v.id}`,
        detailHref: `/produk/${v.id}`,
      });
    }
  }
  return items;
}

export function filterCatalogProducts(
  items: readonly CatalogProduct[],
  filters: { type?: string | null; variety?: string | null },
): CatalogProduct[] {
  return items.filter((item) => {
    if (filters.type && filters.type !== "all" && item.productType !== filters.type) return false;
    if (filters.variety && filters.variety !== "all" && item.variety !== filters.variety) return false;
    return true;
  });
}
