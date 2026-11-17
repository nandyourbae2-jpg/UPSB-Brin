import { AppShell } from "@/components/shell/AppShell";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { aboutContent } from "@/content/pages";
import { id } from "@/content/id";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: aboutContent.meta.title,
  description: aboutContent.meta.description,
  path: "/tentang",
});

export default function TentangPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-3">
        <StatusPill tone="warn">{id.status.inProgress}</StatusPill>
        <h1 className="text-title1 font-extrabold text-ink md:text-display">{aboutContent.title}</h1>
        <p className="max-w-[65ch] text-body text-ink-muted">{aboutContent.lead}</p>
      </div>

      <div className="flex flex-col gap-4">
        {aboutContent.sections.map((section) => (
          <Card key={section.id} as="section" elevation="flat" className="flex flex-col gap-2">
            <h2 id={section.id} className="text-title2 font-extrabold text-ink">
              {section.title}
            </h2>
            <p className="max-w-[65ch] text-body text-ink-muted">{section.body}</p>
          </Card>
        ))}
      </div>

      <Card tone="alt" className="flex flex-col gap-3">
        <p className="max-w-[65ch] text-body-sm text-ink">{aboutContent.mediaNote}</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/cara-pemesanan" variant="secondary">
            Pelajari cara pemesanan
          </ButtonLink>
          <ButtonLink href="/kontak" variant="outline">
            Hubungi UPSB
          </ButtonLink>
        </div>
      </Card>
    </AppShell>
  );
}
