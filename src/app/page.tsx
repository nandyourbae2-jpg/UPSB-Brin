import { AppShell } from "@/components/shell/AppShell";
import { HeroBanner } from "@/components/home/HeroBanner";
import { SearchPill } from "@/components/home/SearchPill";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FlowerPoster } from "@/components/ui/FlowerPoster";
import { Rail, RailHeader } from "@/components/ui/Rail";
import { StatusPill } from "@/components/ui/StatusPill";
import { id } from "@/content/id";
import { homeContent } from "@/content/pages";
import { getSiteSettings } from "@/content/settings";
import { getEnv } from "@/env";
import { cn } from "@/lib/cn";
import { getVisibleFlowerParts } from "@/lib/flower-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: homeContent.meta.title,
  description: homeContent.meta.description,
  path: "/",
  absoluteTitle: true,
});

const promoToneClass = {
  tint: "bg-primary-tint text-primary-pressed",
  leaf: "bg-leaf-tint text-leaf",
  ink: "border border-line bg-surface-alt text-ink",
} as const;

export default function HomePage() {
  const settings = getSiteSettings();
  const flowerParts = getVisibleFlowerParts(getEnv().CONTENT_ENV);

  return (
    <AppShell>
      <div className="flex flex-col gap-2 rounded-lg bg-warn-bg p-4 text-warn-ink">
        <StatusPill tone="warn">{id.status.inProgress}</StatusPill>
        <p className="max-w-[65ch] text-body-sm font-bold">{homeContent.statusBanner}</p>
      </div>

      <SearchPill label={homeContent.searchPill.label} href={homeContent.searchPill.href} />

      <HeroBanner
        tag={homeContent.hero.tag}
        title={homeContent.hero.title}
        body={homeContent.hero.body}
        primaryCta={homeContent.hero.primaryCta}
        secondaryCta={homeContent.hero.secondaryCta}
        flowerParts={flowerParts}
      />

      <ServiceGrid items={homeContent.services} label="Layanan dan informasi UPSB" />

      <section aria-labelledby="sec-promo" className="flex flex-col gap-3">
        <RailHeader id="sec-promo" title={homeContent.promoRail.title} action={homeContent.promoRail.action} />
        <Rail>
          {homeContent.promoRail.items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rail-card flex snap-start flex-col justify-between gap-4 rounded-lg p-5",
                promoToneClass[item.tone],
              )}
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-title3 font-bold">{item.title}</h3>
                <p className="text-body-sm">{item.body}</p>
              </div>
              <div className="self-start">
                <ButtonLink href={item.cta.href} size="sm" variant={item.tone === "ink" ? "primary" : "outline"}>
                  {item.cta.label}
                </ButtonLink>
              </div>
            </div>
          ))}
        </Rail>
      </section>

      <section id="varietas" aria-labelledby="sec-varietas" className="flex flex-col gap-3">
        <RailHeader id="sec-varietas" title={homeContent.varieties.title} action={homeContent.varieties.action} />
        <div className="grid gap-4 md:grid-cols-2">
          {homeContent.varieties.items.map((v) => (
            <Card key={v.id} elevation="raised" className="grid grid-cols-[auto_1fr] items-center gap-4">
              <div className="flex flex-col items-center gap-1 rounded-lg bg-surface-alt p-3">
                <FlowerPoster
                  variant={v.id}
                  size="md"
                  label={v.id === "fabiola" ? id.a11y.fabiolaPosterLabel : id.a11y.clairePosterLabel}
                />
                <span className="text-caption text-ink-muted">Ilustrasi</span>
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <h3 className="text-title2 font-extrabold text-ink">{v.name}</h3>
                <ul className="m-0 flex list-none flex-col gap-1 p-0 text-body-sm text-ink">
                  {v.traits.map((t) => (
                    <li key={t.lead}>
                      <strong className="font-bold">{t.lead}</strong> {t.text}
                    </li>
                  ))}
                </ul>
                <div className="self-start pt-1">
                  <ButtonLink href={`/produk/${v.id}`} size="sm" variant="outline">
                    {homeContent.varieties.detailCta}
                  </ButtonLink>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <p className="max-w-[65ch] text-body-sm text-ink-muted">{homeContent.varieties.caveat}</p>
      </section>

      <section id="harga" aria-labelledby="sec-harga" className="flex flex-col gap-3">
        <RailHeader id="sec-harga" title={homeContent.prices.title} />
        {settings.showIndicativePrices ? (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {homeContent.prices.items.map((p) => (
                <Card key={p.name} elevation="flat" className="flex flex-col gap-1">
                  <span className="text-body-sm text-ink-muted">{p.name}</span>
                  <p className="text-title1 font-extrabold text-ink">
                    {p.price} <span className="text-body-sm font-bold text-ink-muted">{p.unit}</span>
                  </p>
                </Card>
              ))}
            </div>
            <p className="max-w-[65ch] text-body-sm text-ink-muted">{homeContent.prices.disclaimer}</p>
          </>
        ) : (
          <Card>
            <p className="max-w-[65ch] text-body-sm text-ink-muted">{homeContent.prices.hiddenNote}</p>
          </Card>
        )}
      </section>

      <section id="cara" aria-labelledby="sec-cara" className="flex flex-col gap-3">
        <RailHeader id="sec-cara" title={homeContent.steps.title} action={homeContent.steps.action} />
        <Card>
          <ol className="m-0 flex list-none flex-col gap-4 p-0">
            {homeContent.steps.items.map((step, index) => (
              <li key={step.title} className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-primary text-body-sm font-bold text-on-primary"
                >
                  {index + 1}
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <strong className="text-title3 font-bold text-ink">{step.title}</strong>
                  <p className="max-w-[65ch] text-body-sm text-ink-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <section id="faq" aria-labelledby="sec-faq" className="flex flex-col gap-3">
        <RailHeader id="sec-faq" title={homeContent.faqPreview.title} action={homeContent.faqPreview.action} />
        <Accordion items={homeContent.faqPreview.items} />
      </section>
    </AppShell>
  );
}
