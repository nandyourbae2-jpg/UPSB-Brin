import { IconMapPin } from "@/components/icons";
import { AppShell } from "@/components/shell/AppShell";
import { Card } from "@/components/ui/Card";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { id } from "@/content/id";
import { contactContent } from "@/content/pages";
import { getSiteSettings } from "@/content/settings";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: contactContent.meta.title,
  description: contactContent.meta.description,
  path: "/kontak",
});

export default function KontakPage() {
  const settings = getSiteSettings();

  return (
    <AppShell>
      <div className="flex flex-col gap-3">
        <h1 className="text-title1 font-extrabold text-ink md:text-display">{contactContent.title}</h1>
        <p className="max-w-[65ch] text-body text-ink-muted">{contactContent.lead}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary">
            <IconMapPin width={22} height={22} />
            <h2 className="text-title3 font-bold text-ink">{contactContent.location.title}</h2>
          </div>
          <p className="text-body font-bold text-ink">{contactContent.location.area}</p>
          <p className="max-w-[65ch] text-body-sm text-ink-muted">{contactContent.location.addressNote}</p>
        </Card>

        <Card className="flex flex-col gap-3">
          <h2 className="text-title3 font-bold text-ink">{contactContent.hours.title}</h2>
          <p className="max-w-[65ch] text-body-sm text-ink-muted">{contactContent.hours.value}</p>
        </Card>
      </div>

      <Card tone="alt" className="flex flex-col items-start gap-3">
        <h2 className="text-title2 font-extrabold text-ink">{contactContent.whatsappSection.title}</h2>
        <p className="max-w-[65ch] text-body-sm text-ink-muted">
          {settings.whatsappNumber ? contactContent.whatsappSection.readyBody : contactContent.whatsappSection.unsetBody}
        </p>
        <WhatsAppAction
          whatsappNumber={settings.whatsappNumber}
          message={id.whatsapp.defaultMessage}
          showFallbackLink={false}
        />
      </Card>
    </AppShell>
  );
}
