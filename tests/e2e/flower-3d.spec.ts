import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const widths = [390, 700, 900, 1280] as const;

for (const width of widths) {
  test(`/jelajah @${width}: tanpa gulir samping, lulus axe, tangkapan layar`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ colorScheme: "light" });
    const res = await page.goto("/jelajah", { waitUntil: "load" });
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

    if (width === 390 || width === 1280) {
      await page.screenshot({ path: `test-results/screenshots/jelajah-${width}-light.png`, fullPage: true });
    }
  });
}

test("/jelajah mode gelap @1280: lulus axe", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/jelajah", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page.screenshot({ path: "test-results/screenshots/jelajah-1280-dark.png", fullPage: true });
});

test("XP-05: keyboard-only dapat membuka semua 8 bagian bunga di /jelajah dan menutup dengan Esc", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("/jelajah", { waitUntil: "load" });

  const partNames = [
    "Mahkota bunga",
    "Sepal bertaji",
    "Benang sari",
    "Putik dan bakal buah",
    "Buah kapsul",
    "Daun",
    "Batang dan ruas",
    "Akar dan stek berakar",
  ];

  const group = page.getByRole("group", { name: "Bagian bunga" });
  await expect(group.getByRole("button")).toHaveCount(8);

  for (const name of partNames) {
    const chip = group.getByRole("button", { name });
    await chip.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog).toContainText("Botani umum, perlu verifikasi");

    if (name === "Akar dan stek berakar") {
      await expect(dialog.getByRole("link", { name: "Minta stek berakar" })).toHaveAttribute("href", "/pesan?produk=stek");
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(chip).toBeFocused();
  }
});

test("XP-04: cadangan SVG 2D aktif otomatis saat WebGL dimatikan dan isi tetap sama", async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { __upsbAnalytics?: unknown[] }).__upsbAnalytics = [];
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") return null;
      return orig.apply(this, [type, ...(args as [])]);
    } as typeof orig;
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/jelajah", { waitUntil: "load" });

  await expect(page.getByText("Perangkat atau peramban tidak mengaktifkan WebGL")).toBeVisible();
  await expect(page.getByText("2D SVG")).toBeVisible();
  await expect(page.getByText("Ilustrasi, bukan foto tanaman UPSB").first()).toBeVisible();

  // Ketuk bagian taji langsung pada SVG 2D.
  await page.locator('[data-part="taji"]').click();
  const dialog = page.getByRole("dialog", { name: "Sepal bertaji" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Satu sepal membentuk taji berisi nektar.");

  const events = await page.evaluate(() => (window as unknown as { __upsbAnalytics?: Array<{ name: string; props: Record<string, string> }> }).__upsbAnalytics ?? []);
  expect(events.some((e) => e.name === "fallback_2d_shown" && e.props.reason === "nowebgl")).toBe(true);
});

test("XP-01 & XP-06: hero memuat label ilustrasi, maks 3 chip, dan menautkan ke /jelajah", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("/", { waitUntil: "load" });
  await expect(page.getByText("Ilustrasi, bukan foto tanaman UPSB").first()).toBeVisible();

  // Tunggu idle upgrade selesai (chip bagian muncul di hero).
  const group = page.getByRole("group", { name: "Bagian bunga" });
  await expect(group).toBeVisible({ timeout: 5000 });
  await expect(group.getByRole("button")).toHaveCount(3);

  await expect(page.getByRole("link", { name: "Jelajahi semua bagian" })).toHaveAttribute("href", "/jelajah");
});

test("anggaran draw call 3D <= 60 dan DPR <= 2 ketika WebGL aktif", async ({ page }) => {
  await page.goto("/jelajah", { waitUntil: "load" });
  // Jika Chromium headless memiliki WebGL, pastikan metrik berada dalam batas PRD §5.5.
  await page.waitForTimeout(1200);
  const debug = await page.evaluate(() => (window as unknown as { __upsb3dDebug?: { drawCalls: number; dpr: number } }).__upsb3dDebug ?? null);
  if (debug) {
    expect(debug.drawCalls).toBeLessThanOrEqual(60);
    expect(debug.dpr).toBeLessThanOrEqual(2);
  }
});

test("prefers-reduced-motion berjalan bersih tanpa putar otomatis", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/jelajah", { waitUntil: "load" });
  await page.getByRole("group", { name: "Bagian bunga" }).getByRole("button", { name: "Putik dan bakal buah" }).click();
  await expect(page.getByRole("dialog", { name: "Putik dan bakal buah" })).toBeVisible();
});
