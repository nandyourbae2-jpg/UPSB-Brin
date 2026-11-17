import { AppShell } from "@/components/shell/AppShell";
import { TraceBatchCard } from "@/components/trace/TraceBatchCard";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { DEMO_BATCHES, tracePageContent } from "@/content/demo-flows";
import { getSiteSettings } from "@/content/settings";
import { lookupDemoBatch } from "@/lib/demo-store";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return buildPageMetadata({
    title: `Lacak batch ${decodeURIComponent(slug)}`,
    description: tracePageContent.meta.description,
    path: `/trace/${slug}`,
    noIndex: true,
  });
}

export default async function TraceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const batch = lookupDemoBatch(decodedSlug);
  const settings = getSiteSettings();

  if (!batch) {
    return (
      <AppShell>
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
          <Card elevation="raised" className="flex flex-col gap-4 p-6">
            <StatusPill tone="warn">Kode tidak ditemukan</StatusPill>
            <h1 className="text-title1 font-extrabold text-ink">{tracePageContent.notFoundTitle}</h1>
            <p className="text-body text-ink-muted">
              Kode <span className="font-bold text-ink">{decodedSlug}</span> belum ada pada data contoh demo proposal.
              {` ${tracePageContent.notFoundBody}`}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {DEMO_BATCHES.map((sample) => (
                <ButtonLink key={sample.slug} href={`/trace/${sample.slug}`} variant="outline" size="sm">
                  {sample.slug}
                </ButtonLink>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <ButtonLink href="/lacak">Kembali ke pencarian batch</ButtonLink>
              <WhatsAppAction
                whatsappNumber={settings.whatsappNumber}
                message={`Halo UPSB, saya mencari informasi kode batch ${decodedSlug}.`}
              />
            </div>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TraceBatchCard batch={batch} whatsappNumber={settings.whatsappNumber} />
    </AppShell>
  );
}
