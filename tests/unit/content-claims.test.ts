import { describe, expect, it } from "vitest";
import { id } from "@/content/id";
import * as pages from "@/content/pages";
import { buildWhatsAppUrl } from "@/content/settings";

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectStrings);
  return [];
}

describe("kepatuhan konten dan klaim M1 (rule 03)", () => {
  const texts = [...collectStrings(id), ...collectStrings(pages)];

  it("tidak memuat klaim terlarang tanpa penafian", () => {
    const forbidden = [
      /tahan\s+semua\s+kondisi/i,
      /stok\s+(?:pasti|tersedia\s+selalu)/i,
      /dijamin\s+(?:kirim|tiba|stok|tumbuh|cocok)/i,
      /afiliasi\s+brin/i,
      /sertifikat\s+pvt\s+(?:nomor|no\.?)\s*\d+/i,
      /\bberbunga\s+lebat\b/i,
    ];
    for (const t of texts) {
      for (const re of forbidden) {
        expect(t, `frasa dilarang ${re} di "${t}"`).not.toMatch(re);
      }
      // Hanya izinkan penyebutan "bebas virus" bila jelas dalam bentuk larangan/penafian ("bukan bukti kesehatan" / "bukan sertifikat bebas virus").
      if (/bebas\s+virus|terindeks\s+virus/i.test(t)) {
        expect(t).toMatch(/\b(?:bukan|tidak|tanpa|dilarang)\b/i);
      }
    }
  });

  it("tidak memuat emoji", () => {
    const emoji = /\p{Extended_Pictographic}/u;
    for (const t of texts) {
      expect(t).not.toMatch(emoji);
    }
  });

  it("menjaga catatan YIM_013 dan uji lokal pada varietas", () => {
    expect(pages.homeContent.varieties.caveat).toContain("YIM_013");
    expect(pages.homeContent.varieties.caveat).toContain("arah seleksi yang masih divalidasi uji lokal");
  });

  it("menandai draf perawatan di FAQ sebagai perlu konfirmasi (CLM-01)", () => {
    const care = pages.faqContent.items.find((i) => i.id === "perawatan-dasar");
    expect(care?.draft).toBe(true);
  });
});

describe("buildWhatsAppUrl", () => {
  it("mengembalikan null jika nomor belum diatur", () => {
    expect(buildWhatsAppUrl(null, "Halo")).toBeNull();
    expect(buildWhatsAppUrl("", "Halo")).toBeNull();
  });

  it("menyusun tautan wa.me dengan pesan ter-encode", () => {
    expect(buildWhatsAppUrl("+62 812-3456-7890", "Halo UPSB")).toBe(
      "https://wa.me/6281234567890?text=Halo%20UPSB",
    );
  });
});
