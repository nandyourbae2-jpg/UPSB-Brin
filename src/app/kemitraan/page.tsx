import { PartnershipFormView } from "@/components/forms/PartnershipFormView";
import { AppShell } from "@/components/shell/AppShell";
import { partnershipPageContent } from "@/content/demo-flows";
import { getSiteSettings } from "@/content/settings";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: partnershipPageContent.meta.title,
  description: partnershipPageContent.meta.description,
  path: "/kemitraan",
});

export default function PartnershipPage() {
  const settings = getSiteSettings();
  return (
    <AppShell>
      <PartnershipFormView whatsappNumber={settings.whatsappNumber} />
    </AppShell>
  );
}
