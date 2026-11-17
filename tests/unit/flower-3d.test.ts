import { describe, expect, it } from "vitest";
import tokens from "../../data/design-tokens.json";
import { HERO_FEATURED_PARTS, PART_ANCHORS } from "@/3d/anchors";
import { getFlowerHotspots } from "@/lib/flower-data";
import { flower3dTokens, flowerMotionTokens } from "@/lib/flower-tokens";

describe("kontrak 3D M3 (data dan token)", () => {
  const data = getFlowerHotspots();

  it("setiap dari 8 bagian memiliki jangkar 3D dan kamera valid", () => {
    for (const part of data.parts) {
      expect(PART_ANCHORS[part.id], `jangkar ${part.id}`).toBeDefined();
      expect(part.camera.position).toHaveLength(3);
      expect(part.camera.target).toHaveLength(3);
    }
  });

  it("hero menampilkan maksimum 3 bagian unggulan", () => {
    expect(HERO_FEATURED_PARTS.length).toBeLessThanOrEqual(3);
    for (const id of HERO_FEATURED_PARTS) {
      expect(data.parts.some((p) => p.id === id)).toBe(true);
    }
  });

  it("token 3D dan durasi terbang kamera dibaca langsung dari design-tokens.json", () => {
    expect(flower3dTokens).toEqual(tokens.color.flower3d);
    expect(flowerMotionTokens.cameraFlyMs).toBe(tokens.motion.cameraFly);
  });

  it("bagian akar mengarah ke /pesan?produk=stek (XP-10)", () => {
    const akar = data.parts.find((p) => p.id === "akar");
    expect(akar?.cta?.href).toBe("/pesan?produk=stek");
  });
});
