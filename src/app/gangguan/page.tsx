import { IconAlert } from "@/components/icons";
import { AppShell } from "@/components/shell/AppShell";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { id } from "@/content/id";
import { outageContent } from "@/content/pages";
import { getSiteSettings } from "@/content/settings";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: outageContent.meta.title,
  description: outageContent.meta.description,
  path: "/gangguan",
  noIndex: true,
});

export default function GangguanPage() {
  const settings = getSiteSettings();

  return (
    <AppShell>
      <Card className="flex flex-col items-start gap-4 p-6">
        <IconAlert width={32} height={32} className="text-danger" />
        <h1 className="text-title1 font-extrabold text-ink">{outageContent.title}</h1>
        <p className="max-w-[65ch] text-body text-ink-muted">{outageContent.body}</p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <WhatsAppAction whatsappNumber={settings.whatsappNumber} message={id.whatsapp.outageMessage} />
          <ButtonLink href="/" variant="outline">
            {id.nav.backHome}
          </ButtonLink>
        </div>
      </Card>
    </AppShell>
  );
}
