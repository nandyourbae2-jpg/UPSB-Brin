import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { AppShell } from "@/components/shell/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusPill } from "@/components/ui/StatusPill";
import { catalogStrings, getCatalogProducts } from "@/content/catalog";
import { id } from "@/content/id";
import { getSiteSettings } from "@/content/settings";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: catalogStrings.meta.title,
  description: catalogStrings.meta.description,
  path: "/produk",
});

export default function ProdukPage() {
  const products = getCatalogProducts();
  const settings = getSiteSettings();

  return (
    <AppShell>
      <div className="flex flex-col gap-3">
        <StatusPill tone="warn">{id.status.inProgress}</StatusPill>
        <h1 className="text-title1 font-extrabold text-ink md:text-display">{catalogStrings.title}</h1>
        <p className="max-w-[65ch] text-body text-ink-muted">{catalogStrings.lead}</p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        }
      >
        <CatalogView products={products} showIndicativePrices={settings.showIndicativePrices} />
      </Suspense>

      <p className="max-w-[65ch] text-body-sm text-ink-muted">{catalogStrings.priceDisclaimer}</p>
    </AppShell>
  );
}
