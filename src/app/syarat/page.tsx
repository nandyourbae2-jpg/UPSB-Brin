import { AppShell } from "@/components/shell/AppShell";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { id } from "@/content/id";
import { termsContent } from "@/content/pages";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: termsContent.meta.title,
  description: termsContent.meta.description,
  path: "/syarat",
});

export default function SyaratPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-3">
        <StatusPill tone="warn">{id.status.draftNotice}</StatusPill>
        <h1 className="text-title1 font-extrabold text-ink md:text-display">{termsContent.title}</h1>
        <p className="max-w-[65ch] text-body text-ink-muted">{termsContent.lead}</p>
      </div>

      <div className="flex flex-col gap-4">
        {termsContent.sections.map((section) => (
          <Card key={section.title} as="section" className="flex flex-col gap-2">
            <h2 className="text-title3 font-bold text-ink">{section.title}</h2>
            <p className="max-w-[65ch] text-body-sm text-ink-muted">{section.body}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/privasi" variant="secondary">
          Baca kebijakan privasi
        </ButtonLink>
        <ButtonLink href="/" variant="outline">
          Kembali ke beranda
        </ButtonLink>
      </div>
    </AppShell>
  );
}
