import { AppShell } from "@/components/shell/AppShell";
import { TraceSearchView } from "@/components/trace/TraceSearchView";
import { tracePageContent } from "@/content/demo-flows";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: tracePageContent.meta.title,
  description: tracePageContent.meta.description,
  path: "/lacak",
});

export default function TraceLandingPage() {
  return (
    <AppShell>
      <TraceSearchView />
    </AppShell>
  );
}
