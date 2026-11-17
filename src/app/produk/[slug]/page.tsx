import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft } from "@/components/icons";
import { AppShell } from "@/components/shell/AppShell";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FlowerPoster } from "@/components/ui/FlowerPoster";
import { StatusPill } from "@/components/ui/StatusPill";
import { catalogStrings, filterCatalogProducts, getCatalogProducts, getVarietyProfile } from "@/content/catalog";
import { id } from "@/content/id";
import { getSiteSettings } from "@/content/settings";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return [{ slug: "fabiola" }, { slug: "claire" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const variety = getVarietyProfile(slug);
  if (!variety) return {};
  return buildPageMetadata({
    title: `Varietas ${variety.name}`,
    description: `Profil varietas Pacar Air ${variety.name}: ${variety.traits.join(", ")}. Pilihan pot 12 cm dan stek berakar.`,
    path: `/produk/${variety.id}`,
  });
}

export default async function VarietyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const variety = getVarietyProfile(slug);
  if (!variety) notFound();

  const settings = getSiteSettings();
  const products = filterCatalogProducts(getCatalogProducts(), { variety: variety.id });

  return (
    <AppShell>
      <div>
        <Link
          href="/produk"
          className="inline-flex min-h-12 items-center gap-2 rounded-pill px-3 text-body-sm font-bold text-primary hover:bg-primary-tint"
        >
          <IconArrowLeft width={16} height={16} />
          <span>{catalogStrings.detail.backToCatalog}</span>
        </Link>
      </div>

      <section className="grid gap-6 rounded-xl border border-line bg-surface p-6 md:grid-cols-[auto_1fr] md:items-center">
        <figure className="m-0 flex flex-col items-center gap-2 rounded-lg bg-surface-alt p-5">
          <FlowerPoster
            variant={variety.id}
            size="lg"
            label={variety.id === "fabiola" ? id.a11y.fabiolaPosterLabel : id.a11y.clairePosterLabel}
          />
          <figcaption className="text-center text-caption text-ink-muted">{id.status.illustrative}</figcaption>
        </figure>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="info">Pacar Air (Impatiens)</StatusPill>
            <StatusPill tone="warn">{variety.verified ? "Terverifikasi" : "Perlu verifikasi"}</StatusPill>
          </div>
          <h1 className="text-title1 font-extrabold text-ink md:text-display">{variety.name}</h1>
          <h2 className="text-title3 font-bold text-ink">{catalogStrings.detail.traitsHeading}</h2>
          <ul className="m-0 flex list-disc flex-col gap-1 pl-5 text-body text-ink">
            {variety.traits.map((trait) => (
              <li key={trait}>{trait}</li>
            ))}
          </ul>
          <p className="max-w-[65ch] text-body-sm text-ink-muted">
            Sumber: {variety.source}. {variety.caveat}
          </p>
          <div className="self-start pt-1">
            <ButtonLink href="/jelajah" variant="secondary" size="sm">
              {catalogStrings.detail.exploreCta}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="produk-varietas" className="flex flex-col gap-3">
        <h2 id="produk-varietas" className="text-title2 font-extrabold text-ink">
          {catalogStrings.detail.linesHeading}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <Card key={product.id} elevation="raised" className="flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <StatusPill tone={product.productType === "stek" ? "success" : "info"}>
                    {product.productLabel}
                  </StatusPill>
                  <StatusPill>{product.availabilityLabel}</StatusPill>
                </div>
                <p className="text-body-sm text-ink-muted">{product.audience}</p>
                {settings.showIndicativePrices ? (
                  <p className="text-title2 font-extrabold text-ink">
                    {product.indicativePrice}{" "}
                    <span className="text-body-sm font-bold text-ink-muted">{product.unit}</span>
                  </p>
                ) : (
                  <p className="text-body-sm font-bold text-ink-muted">{catalogStrings.card.priceHidden}</p>
                )}
              </div>
              <div className="self-start">
                <ButtonLink href={product.orderHref}>{catalogStrings.card.requestCta}</ButtonLink>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Card tone="alt" className="flex flex-col gap-2">
        <h2 className="text-title3 font-bold text-ink">{catalogStrings.detail.caveatHeading}</h2>
        <p className="max-w-[65ch] text-body-sm text-ink-muted">{catalogStrings.detail.rightsNote}</p>
      </Card>
    </AppShell>
  );
}
