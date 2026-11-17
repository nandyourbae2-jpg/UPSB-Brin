import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const widths = [390, 700, 900, 1280] as const;

const publicRoutes = [
  { path: "/", name: "beranda-m1", indexable: true },
  { path: "/tentang", name: "tentang", indexable: true },
  { path: "/cara-pemesanan", name: "cara-pemesanan", indexable: true },
  { path: "/faq", name: "faq", indexable: true },
  { path: "/kontak", name: "kontak", indexable: true },
  { path: "/privasi", name: "privasi", indexable: true },
  { path: "/syarat", name: "syarat", indexable: true },
  { path: "/gangguan", name: "gangguan", indexable: false },
] as const;

for (const route of publicRoutes) {
  for (const width of widths) {
    test(`${route.name} @${width}: tanpa gulir samping, lulus axe, metadata SEO`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
      const response = await page.goto(route.path, { waitUntil: "load" });
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);

      const overflow = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(overflow.scroll, `scrollWidth ${overflow.scroll} > clientWidth ${overflow.client}`).toBeLessThanOrEqual(
        overflow.client,
      );

      // Pastikan judul, deskripsi, OG, dan canonical tersedia di halaman indeksable.
      await expect(page).toHaveTitle(/UPSB/);
      const metaDesc = await page.locator('meta[name="description"]').getAttribute("content");
      expect(metaDesc?.trim().length).toBeGreaterThan(20);
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
      expect(ogTitle?.trim().length).toBeGreaterThan(3);
      if (route.indexable) {
        const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
        expect(canonical).toBeTruthy();
      }

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`)).toEqual([]);

      if (width === 390 || width === 1280) {
        await page.screenshot({ path: `test-results/screenshots/${route.name}-${width}-light.png`, fullPage: true });
      }
    });
  }

  test(`${route.name} mode gelap @390 & @1280: lulus axe`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    for (const width of [390, 1280] as const) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(route.path, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`)).toEqual([]);
      await page.screenshot({ path: `test-results/screenshots/${route.name}-${width}-dark.png`, fullPage: true });
    }
  });
}

test("FIX-01: badge hero tidak memanjang selebar penuh di desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("/", { waitUntil: "load" });
  const tag = page.locator(".hero-tag");
  const hero = page.locator(".hero-surface");
  const tagBox = await tag.boundingBox();
  const heroBox = await hero.boundingBox();
  expect(tagBox).toBeTruthy();
  expect(heroBox).toBeTruthy();
  expect(tagBox!.width).toBeLessThan(heroBox!.width * 0.5);
});

test("FAQ accordion bisa dibuka lewat keyboard", async ({ page }) => {
  await page.goto("/faq", { waitUntil: "load" });
  const summary = page.locator("summary").first();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
});

test("halaman 404 mengembalikan status 404 dan tautan kembali", async ({ page }) => {
  const res = await page.goto("/halaman-yang-tidak-ada", { waitUntil: "load" });
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Halaman tidak ditemukan" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Kembali ke beranda" })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
  expect(results.violations).toEqual([]);
});

test("sitemap.xml memuat semua rute publik M1", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const body = await res.text();
  for (const r of ["/tentang", "/cara-pemesanan", "/faq", "/kontak", "/privasi", "/syarat"]) {
    expect(body).toContain(r);
  }
});
