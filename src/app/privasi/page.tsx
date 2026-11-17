import { IconShield } from "@/components/icons";
import { AppShell } from "@/components/shell/AppShell";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { id } from "@/content/id";
import { privacyContent } from "@/content/pages";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: privacyContent.meta.title,
  description: privacyContent.meta.description,
  path: "/privasi",
});

export default function PrivasiPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-3">
        <StatusPill tone="warn">{id.status.draftNotice}</StatusPill>
        <div className="flex items-center gap-2 text-primary">
          <IconShield width={24} height={24} />
          <h1 className="text-title1 font-extrabold text-ink md:text-display">{privacyContent.title}</h1>
        </div>
        <p className="max-w-[65ch] text-body text-ink-muted">{privacyContent.lead}</p>
      </div>

      <div className="flex flex-col gap-4">
        {privacyContent.sections.map((section) => (
          <Card key={section.title} as="section" className="flex flex-col gap-2">
            <h2 className="text-title3 font-bold text-ink">{section.title}</h2>
            <p className="max-w-[65ch] text-body-sm text-ink-muted">{section.body}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/syarat" variant="secondary">
          Baca syarat dan ketentuan
        </ButtonLink>
        <ButtonLink href="/kontak" variant="outline">
          Hubungi admin
        </ButtonLink>
      </div>
    </AppShell>
  );
}
