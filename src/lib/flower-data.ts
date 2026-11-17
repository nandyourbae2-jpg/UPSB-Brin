import { z } from "zod";
import rawHotspots from "../../data/flower-hotspots.json";

const vector3Schema = z.tuple([z.number(), z.number(), z.number()]);

export const flowerPartSchema = z.object({
  id: z.string(),
  order: z.number().int().positive(),
  meshNames: z.array(z.string()).min(1),
  title: z.string(),
  latin: z.string(),
  summary: z.string(),
  detail: z.string(),
  camera: z.object({
    position: vector3Schema,
    target: vector3Schema,
  }),
  source: z.string(),
  verified: z.boolean(),
  cta: z
    .object({
      label: z.string(),
      href: z.string(),
    })
    .nullable(),
  needsTeamConfirmation: z.string().optional(),
});

export const varietySchema = z.object({
  id: z.enum(["fabiola", "claire"]),
  name: z.string(),
  traits: z.array(z.string()).min(1),
  source: z.string(),
  verified: z.boolean(),
  caveat: z.string(),
});

export const flowerHotspotsSchema = z.object({
  $meta: z.object({
    version: z.string(),
    status: z.string(),
    note: z.string(),
    references: z.array(z.string()),
    model: z.object({
      illustrative: z.boolean(),
      disclaimer: z.string(),
    }),
  }),
  parts: z.array(flowerPartSchema).length(8),
  varieties: z.array(varietySchema).length(2),
  forbiddenClaims: z.array(z.string()),
});

export type FlowerHotspotsData = z.infer<typeof flowerHotspotsSchema>;
export type FlowerPartData = z.infer<typeof flowerPartSchema>;
export type VarietyData = z.infer<typeof varietySchema>;

let parsedCache: FlowerHotspotsData | undefined;

/** Membaca dan memvalidasi data/flower-hotspots.json. Sumber kebenaran teks botani dan varietas. */
export function getFlowerHotspots(): FlowerHotspotsData {
  if (!parsedCache) {
    parsedCache = flowerHotspotsSchema.parse(rawHotspots);
  }
  return parsedCache;
}

/**
 * Gerbang publikasi konten botani (PRD §8 & rule 03):
 * Di staging, bagian verified:false tampil dengan label perlu verifikasi.
 * Di produksi, hanya bagian verified:true yang dipublikasikan.
 */
export function getVisibleFlowerParts(contentEnv: "staging" | "production"): FlowerPartData[] {
  const parts = [...getFlowerHotspots().parts].sort((a, b) => a.order - b.order);
  return contentEnv === "production" ? parts.filter((p) => p.verified) : parts;
}

/** Peta balik dari nama mesh 3D (kontrak rule 02) ke id bagian bunga. */
export function buildMeshToPartMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const part of getFlowerHotspots().parts) {
    for (const meshName of part.meshNames) {
      map.set(meshName, part.id);
    }
  }
  return map;
}
