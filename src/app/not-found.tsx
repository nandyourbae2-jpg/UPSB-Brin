import { AppShell } from "@/components/shell/AppShell";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { IconSearch } from "@/components/icons";
import { id } from "@/content/id";
import { notFoundContent } from "@/content/pages";
import { getSiteSettings } from "@/content/settings";

export default function NotFound() {
  const settings = getSiteSettings();

  return (
    <AppShell>
      <EmptyState
        headingAs="h1"
        icon={<IconSearch width={40} height={40} />}
        title={notFoundContent.title}
        body={notFoundContent.body}
        action={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/">{notFoundContent.backHome}</ButtonLink>
            <WhatsAppAction whatsappNumber={settings.whatsappNumber} message={id.whatsapp.defaultMessage} />
          </div>
        }
      />
    </AppShell>
  );
}
