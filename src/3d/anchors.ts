/**
 * Koordinat dunia 3D tiap bagian bunga untuk menempatkan penanda HotspotPin
 * serta menyelaraskan pusat geometri prosedural dengan camera.target di data/flower-hotspots.json.
 */
export const PART_ANCHORS: Record<string, readonly [number, number, number]> = {
  mahkota: [0, 0.72, 0.25],
  taji: [0.18, 0.12, -0.55],
  benangsari: [0, 0.34, 0.32],
  putik: [0, 0.18, 0.22],
  kapsul: [-0.42, -0.52, 0.18],
  daun: [-0.68, -0.82, 0.18],
  batang: [0, -1.15, 0.08],
  akar: [0, -2.05, 0.12],
};

/** Tiga penanda yang tampil di hero beranda (PRD §5.3: maksimum 3 di hero). */
export const HERO_FEATURED_PARTS = ["mahkota", "taji", "akar"] as const;
