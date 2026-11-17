import { describe, expect, it } from "vitest";
import * as demoFlows from "@/content/demo-flows";
import {
  buildOrderWhatsAppDraft,
  buildPartnershipWhatsAppDraft,
  computeAdminStats,
  generateOrderWeeks,
  isValidOptionalEmail,
  isValidWhatsapp,
  lookupDemoBatch,
} from "@/lib/demo-store";

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectStrings);
  return [];
}

describe("alur interaktif pratinjau demo (/pesan, /kemitraan, /lacak, /trace, /admin)", () => {
  it("mematuhi rule 03 tanpa klaim terlarang atau emoji", () => {
    const texts = collectStrings(demoFlows);
    const forbidden = [
      /terindeks\s+virus/i,
      /tahan\s+semua\s+kondisi/i,
      /stok\s+(?:pasti|tersedia\s+selalu)/i,
      /dijamin\s+(?:kirim|tiba|stok|tumbuh|cocok)/i,
      /afiliasi\s+brin/i,
      /sertifikat\s+pvt\s+(?:nomor|no\.?)\s*\d+/i,
    ];
    const emoji = /\p{Extended_Pictographic}/u;

    for (const text of texts) {
      expect(text).not.toMatch(emoji);
      for (const re of forbidden) {
        expect(text, `frasa dilarang ${re} di "${text}"`).not.toMatch(re);
      }
      if (/bebas\s+virus/i.test(text)) {
        expect(text).toMatch(/\b(?:bukan|tidak|tanpa|dilarang)\b/i);
      }
    }
  });

  it("menghasilkan 8 pekan mendatang untuk preferensi pengiriman", () => {
    const weeks = generateOrderWeeks(new Date("2026-11-17T00:00:00+07:00"));
    expect(weeks).toHaveLength(8);
    expect(weeks[0]).toContain("-");
  });

  it("memvalidasi format nomor WhatsApp Indonesia dan email opsional", () => {
    expect(isValidWhatsapp("0812 3456 7890")).toBe(true);
    expect(isValidWhatsapp("+6281234567890")).toBe(true);
    expect(isValidWhatsapp("12345")).toBe(false);

    expect(isValidOptionalEmail("")).toBe(true);
    expect(isValidOptionalEmail("mitra@contoh.id")).toBe(true);
    expect(isValidOptionalEmail("bukan-email")).toBe(false);
  });

  it("mencari batch aktif maupun nonaktif tanpa mengekspos data pribadi", () => {
    const active = lookupDemoBatch("fab-pot-2026-001");
    expect(active?.active).toBe(true);
    expect(active?.varietyId).toBe("fabiola");

    const disabled = lookupDemoBatch("FAB-POT-2026-OFF");
    expect(disabled?.active).toBe(false);

    const serializedBatches = JSON.stringify(demoFlows.DEMO_BATCHES);
    expect(serializedBatches).not.toContain("customerName");
    expect(serializedBatches).not.toContain("whatsapp");
    expect(serializedBatches).not.toContain("0812");
  });

  it("menghitung 8 metrik admin secara konsisten", () => {
    const stats = computeAdminStats(demoFlows.INITIAL_DEMO_ORDERS, demoFlows.INITIAL_DEMO_PARTNERSHIPS);
    expect(stats.totalOrders).toBe(5);
    expect(stats.newOrders).toBe(1);
    expect(stats.confirmedOrders).toBe(1);
    expect(stats.openPartnerships).toBe(2);
    expect(stats.activeQrBatches).toBe(2);
  });

  it("menyusun draf pesan WhatsApp untuk permintaan dan kemitraan", () => {
    const orderDraft = buildOrderWhatsAppDraft(demoFlows.INITIAL_DEMO_ORDERS[0]!);
    expect(orderDraft).toContain("ORD-2026-00014");
    expect(orderDraft).toContain("Fabiola");

    const partnerDraft = buildPartnershipWhatsAppDraft(demoFlows.INITIAL_DEMO_PARTNERSHIPS[0]!);
    expect(partnerDraft).toContain("PRT-2026-00004");
  });
});
