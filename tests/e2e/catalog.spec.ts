import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/produk", "/produk/fabiola", "/produk/claire"] as const;
const widths = [390, 700, 900, 1280] as const;

for (const path of routes) {
  for (const width of widths) {
    test(`${path} @${width}: tanpa gulir samping, lulus axe`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.emulateMedia({ colorScheme: "light" });
      const res = await page.goto(path, { waitUntil: "load" });
      expect(res?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);

      const overflow = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(overflow.scroll).toBeLessThanOrEqual(overflow.client);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`)).toEqual([]);
    });
  }
}

test("filter desktop menyaring produk dan memperbarui query string", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("/produk", { waitUntil: "load" });
  await expect(page.getByRole("link", { name: "Minta produk" })).toHaveCount(4);

  await page.getByRole("button", { name: "Stek berakar" }).click();
  await expect(page).toHaveURL(/jenis=stek/);
  await expect(page.getByRole("link", { name: "Minta produk" })).toHaveCount(2);

  await page.getByRole("button", { name: "Claire" }).click();
  await expect(page).toHaveURL(/jenis=stek&varietas=claire/);
  await expect(page.getByRole("link", { name: "Minta produk" })).toHaveCount(1);

  // Deep-link mempertahankan hasil filter setelah muat ulang.
  await page.reload({ waitUntil: "load" });
  await expect(page.getByRole("link", { name: "Minta produk" })).toHaveCount(1);
});

test("FIX-06: BottomSheet filter ponsel memiliki aria-modal, tutup dengan Esc, dan mengembalikan fokus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/produk", { waitUntil: "load" });

  const trigger = page.getByRole("button", { name: "Filter katalog" });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Filter katalog" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("slug varietas tidak dikenal mengembalikan 404", async ({ page }) => {
  const res = await page.goto("/produk/tidak-ada", { waitUntil: "load" });
  expect(res?.status()).toBe(404);
});
