import { describe, expect, it } from "vitest";
import { filterCatalogProducts, getCatalogProducts, getVarietyProfile } from "@/content/catalog";
import { buildMeshToPartMap, getFlowerHotspots, getVisibleFlowerParts } from "@/lib/flower-data";

describe("data/flower-hotspots.json (kontrak dan gerbang verifikasi)", () => {
  it("memvalidasi 8 bagian bunga dan 2 varietas", () => {
    const data = getFlowerHotspots();
    expect(data.parts).toHaveLength(8);
    expect(data.varieties.map((v) => v.id)).toEqual(["fabiola", "claire"]);
    expect(data.$meta.model.illustrative).toBe(true);
  });

  it("memetakan seluruh 18 nama mesh kontrak ke 8 bagian", () => {
    const expectedMeshes = [
      "petal_upper",
      "petal_wing_l",
      "petal_wing_r",
      "sepal_spur",
      "sepal_lateral_l",
      "sepal_lateral_r",
      "anthers_cap",
      "pistil_ovary",
      "capsule",
      "leaf_a",
      "leaf_b",
      "leaf_c",
      "stem",
      "node_a",
      "node_b",
      "root_a",
      "root_b",
      "root_c",
    ];
    const map = buildMeshToPartMap();
    expect(map.size).toBe(expectedMeshes.length);
    for (const m of expectedMeshes) {
      expect(map.has(m), `mesh ${m} harus terpetakan`).toBe(true);
    }
  });

  it("menahan bagian verified:false di produksi dan menampilkannya di staging", () => {
    expect(getVisibleFlowerParts("staging")).toHaveLength(8);
    expect(getVisibleFlowerParts("production")).toHaveLength(0);
  });
});

describe("katalog dan filter produk M2", () => {
  const all = getCatalogProducts();

  it("menghasilkan 4 produk (2 jenis x 2 varietas)", () => {
    expect(all).toHaveLength(4);
    expect(getVarietyProfile("fabiola")?.name).toBe("Fabiola");
    expect(getVarietyProfile("claire")?.name).toBe("Claire");
    expect(getVarietyProfile("lain")).toBeNull();
  });

  it("menyaring berdasarkan jenis dan varietas", () => {
    expect(filterCatalogProducts(all, { type: "stek" }).every((p) => p.productType === "stek")).toBe(true);
    expect(filterCatalogProducts(all, { type: "stek" })).toHaveLength(2);
    expect(filterCatalogProducts(all, { variety: "claire" })).toHaveLength(2);
    expect(filterCatalogProducts(all, { type: "pot", variety: "fabiola" }).map((p) => p.id)).toEqual(["pot-fabiola"]);
  });
});
