import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const widths = [390, 700, 900, 1280] as const;

const interactiveRoutes = [
  { path: "/pesan", name: "pesan", noIndex: false },
  { path: "/kemitraan", name: "kemitraan", noIndex: false },
  { path: "/lacak", name: "lacak", noIndex: false },
  { path: "/trace/FAB-POT-2026-001", name: "trace-aktif", noIndex: true },
  { path: "/trace/FAB-POT-2026-OFF", name: "trace-nonaktif", noIndex: true },
  { path: "/admin", name: "admin", noIndex: true },
] as const;

for (const route of interactiveRoutes) {
  for (const width of widths) {
    test(`${route.name} @${width}: status 200, tanpa gulir samping, lulus axe`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
      const res = await page.goto(route.path, { waitUntil: "load" });
      expect(res?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);

      const overflow = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(overflow.scroll, `scrollWidth ${overflow.scroll} > clientWidth ${overflow.client}`).toBeLessThanOrEqual(
        overflow.client,
      );

      if (route.noIndex) {
        const robots = await page.locator('meta[name="robots"]').getAttribute("content");
        expect(robots).toContain("noindex");
      }

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);

      if ((route.name === "pesan" || route.name === "trace-aktif") && width === 390) {
        await page.screenshot({ path: `test-results/screenshots/${route.name}-390-light.png`, fullPage: true });
      }
      if ((route.name === "kemitraan" || route.name === "admin") && width === 1280) {
        await page.screenshot({ path: `test-results/screenshots/${route.name}-1280-light.png`, fullPage: true });
      }
    });
  }

  test(`${route.name} mode gelap @1280: lulus axe`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 844 });
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(route.path, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);

    if (route.name === "admin") {
      await page.screenshot({ path: "test-results/screenshots/admin-1280-dark.png", fullPage: true });
    }
  });
}

test("seluruh tautan navigasi dan CTA utama dari beranda tidak mengarah ke 404", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("/", { waitUntil: "load" });

  const ctaTargets = ["/pesan", "/kemitraan", "/lacak", "/produk", "/jelajah", "/cara-pemesanan", "/faq", "/kontak"];
  for (const href of ctaTargets) {
    const res = await page.goto(href, { waitUntil: "load" });
    expect(res?.status(), `rute ${href} harus mengembalikan 200`).toBe(200);
  }
});

test("alur lengkap /pesan -> tinjau -> simpan ke localStorage -> tampil di /admin", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("/pesan?produk=stek&varietas=claire", { waitUntil: "load" });

  await expect(page.getByRole("radio", { name: /Stek berakar/i })).toBeChecked();
  await expect(page.getByRole("button", { name: /Claire/i })).toHaveAttribute("aria-pressed", "true");

  await page.getByLabel("Nama lengkap atau penanggung jawab").fill("Nursery Proposal Demo");
  await page.getByLabel("Nomor WhatsApp aktif").fill("0812 3456 7899");
  await page.getByLabel("Alamat pengiriman atau daerah tujuan").fill("Jl. Raya Baturraden No. 10, Banyumas");
  await page.getByRole("checkbox").check();

  await page.getByRole("button", { name: "Tinjau ringkasan" }).click();
  await expect(page.getByRole("heading", { name: "Tinjau ringkasan permintaan" })).toBeVisible();
  await page.getByRole("button", { name: "Kirim permintaan" }).click();

  await expect(page.getByRole("heading", { name: "Permintaan demo telah dicatat" })).toBeVisible();
  await page.getByRole("link", { name: "Lihat di Demo Admin" }).click();
  await expect(page.getByText("Nursery Proposal Demo")).toBeVisible();
});

test("alur /lacak mencari batch dan /admin membuka panel detail", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("/lacak", { waitUntil: "load" });
  await page.getByRole("button", { name: "Buka halaman batch" }).click();
  await expect(page).toHaveURL(/\/trace\/FAB-POT-2026-001/);
  await expect(page.getByRole("heading", { name: "FAB-POT-2026-001" })).toBeVisible();

  await page.goto("/admin", { waitUntil: "load" });
  await page.getByRole("button", { name: /ORD-2026-00014/i }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
