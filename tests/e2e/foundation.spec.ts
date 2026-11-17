import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const widths = [390, 700, 900, 1280] as const;
const schemes = ["light", "dark"] as const;
const pages = [
  { path: "/", name: "beranda" },
  { path: "/kitchen-sink", name: "kitchen-sink" },
] as const;

for (const p of pages) {
  for (const width of widths) {
    for (const scheme of schemes) {
      test(`${p.name} @${width} ${scheme}: tanpa gulir ke samping, lulus axe, tangkapan layar`, async ({ page }) => {
        await page.setViewportSize({ width, height: 844 });
        await page.emulateMedia({ colorScheme: scheme, reducedMotion: "no-preference" });
        await page.goto(p.path, { waitUntil: "load" });
        await page.evaluate(() => document.fonts.ready);

        const overflow = await page.evaluate(() => ({
          scroll: document.documentElement.scrollWidth,
          client: document.documentElement.clientWidth,
        }));
        expect(overflow.scroll, `scrollWidth ${overflow.scroll} > clientWidth ${overflow.client}`).toBeLessThanOrEqual(overflow.client);

        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
        expect(
          results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`),
          "pelanggaran axe",
        ).toEqual([]);

        await page.screenshot({ path: `test-results/screenshots/${p.name}-${width}-${scheme}.png`, fullPage: true });
      });
    }
  }
}

test("navigasi: tab bawah hanya di ponsel, bar atas di lebar md ke atas", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Navigasi utama" });
  await expect(nav.filter({ visible: true })).toHaveCount(1);
  await expect(page.locator("nav.fixed")).toBeVisible();

  await page.setViewportSize({ width: 900, height: 800 });
  await expect(page.locator("nav.fixed")).toBeHidden();
  await expect(nav.filter({ visible: true })).toHaveCount(1);
});

test("tombol tema mengganti data-theme dan menyimpan pilihan", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("button", { name: /Tema/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("kitchen-sink: toast dibacakan dan galat formulir terhubung ke kolom", async ({ page }) => {
  await page.goto("/kitchen-sink");
  await page.getByRole("button", { name: "Tampilkan sukses" }).click();
  await expect(page.getByText("Contoh tindakan berhasil.")).toBeVisible();

  const email = page.getByLabel("Email");
  await expect(email).toHaveAttribute("aria-invalid", "true");
  const describedBy = await email.getAttribute("aria-describedby");
  expect(describedBy).toBeTruthy();
  const errorId = describedBy!.split(" ").pop()!;
  await expect(page.locator(`[id="${errorId}"]`)).toContainText("Alamat email belum lengkap");
});

test("health check mengembalikan 200 dan header noindex di non-produksi", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.status()).toBe(200);
  expect((await res.json()).status).toBe("ok");
  expect(res.headers()["x-robots-tag"]).toContain("noindex");
});
