import { AdminDemoView } from "@/components/admin/AdminDemoView";
import { AppShell } from "@/components/shell/AppShell";
import { adminPageContent } from "@/content/demo-flows";
import { getSiteSettings } from "@/content/settings";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: adminPageContent.meta.title,
  description: adminPageContent.meta.description,
  path: "/admin",
  noIndex: true,
});

export default function AdminDemoPage() {
  const settings = getSiteSettings();
  return (
    <AppShell>
      <AdminDemoView whatsappNumber={settings.whatsappNumber} />
    </AppShell>
  );
}
