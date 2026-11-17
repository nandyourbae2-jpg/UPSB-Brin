import { describe, expect, it } from "vitest";
import tokens from "../../data/design-tokens.json";
import { contrastRatio } from "@/lib/contrast";

type Palette = Record<string, string>;
const palettes = { light: tokens.color.light as Palette, dark: tokens.color.dark as Palette };

/** [teks/ikon, latar, minimum, di mana dipakai] */
const pairs: ReadonlyArray<readonly [string, string, number, string]> = [
  ["ink", "bg", 4.5, "teks isi"],
  ["ink", "surface", 4.5, "teks di kartu"],
  ["ink", "surfaceAlt", 4.5, "teks di permukaan alternatif"],
  ["inkMuted", "bg", 4.5, "teks sekunder"],
  ["inkMuted", "surface", 4.5, "teks sekunder dan batas kolom isian (>= 3 untuk batas)"],
  ["inkMuted", "surfaceAlt", 4.5, "teks sekunder di permukaan alternatif"],
  ["onPrimary", "primary", 4.5, "teks tombol utama"],
  ["onPrimary", "primaryPressed", 4.5, "teks tombol utama saat ditekan"],
  ["primaryPressed", "primaryTint", 4.5, "chip terpilih, tombol sekunder, tab aktif"],
  ["primary", "bg", 4.5, "tautan dan ikon primer di latar"],
  ["primary", "surface", 4.5, "ikon primer di kartu"],
  ["leaf", "leafTint", 4.5, "status sukses"],
  ["leaf", "surface", 4.5, "aksen daun di kartu"],
  ["warnInk", "warnBg", 4.5, "status peringatan"],
  ["danger", "surface", 4.5, "teks galat dan status tidak aktif"],
  ["danger", "bg", 4.5, "teks galat di latar"],
  ["focus", "bg", 3, "indikator fokus (non-teks)"],
  ["focus", "surface", 3, "indikator fokus di kartu (non-teks)"],
];

describe("kontras warna token (WCAG 2.2 AA)", () => {
  for (const mode of ["light", "dark"] as const) {
    for (const [fg, bg, min, use] of pairs) {
      it(`${mode}: ${fg} di atas ${bg} >= ${min} (${use})`, () => {
        const p = palettes[mode];
        const ratio = contrastRatio(p[fg] as string, p[bg] as string);
        expect(ratio, `${p[fg]} di ${p[bg]} = ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(min);
      });
    }
  }

  it("teks putih di atas warna hero >= 4.5 (teks hero selalu putih di kedua mode)", () => {
    expect(contrastRatio("#FFFFFF", palettes.light.hero as string)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio("#FFFFFF", palettes.dark.hero as string)).toBeGreaterThanOrEqual(4.5);
  });
});
