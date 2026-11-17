import { OrderFormView } from "@/components/forms/OrderFormView";
import { AppShell } from "@/components/shell/AppShell";
import { orderPageContent } from "@/content/demo-flows";
import { getSiteSettings } from "@/content/settings";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: orderPageContent.meta.title,
  description: orderPageContent.meta.description,
  path: "/pesan",
});

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawProduct = Array.isArray(params.produk) ? params.produk[0] : params.produk;
  const rawVariety = Array.isArray(params.varietas) ? params.varietas[0] : params.varietas;

  const initialProduct = rawProduct === "stek" ? "stek" : "pot";
  const initialVariety =
    rawVariety === "fabiola" || rawVariety === "claire" ? rawVariety : undefined;

  const settings = getSiteSettings();

  return (
    <AppShell>
      <OrderFormView
        initialProduct={initialProduct}
        initialVariety={initialVariety}
        whatsappNumber={settings.whatsappNumber}
        showIndicativePrices={settings.showIndicativePrices}
      />
    </AppShell>
  );
}
