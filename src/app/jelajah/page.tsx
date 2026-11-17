import { FlowerExplorer } from "@/components/flower/FlowerExplorer";
import { AppShell } from "@/components/shell/AppShell";
import { StatusPill } from "@/components/ui/StatusPill";
import { explorerStrings } from "@/content/explorer";
import { getEnv } from "@/env";
import { getVisibleFlowerParts } from "@/lib/flower-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: explorerStrings.meta.title,
  description: explorerStrings.meta.description,
  path: "/jelajah",
});

export default function JelajahPage() {
  const env = getEnv();
  const parts = getVisibleFlowerParts(env.CONTENT_ENV);

  return (
    <AppShell>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone="info">{explorerStrings.illustrativeBanner}</StatusPill>
          {env.CONTENT_ENV !== "production" ? (
            <StatusPill tone="warn">{explorerStrings.stagingSourceNote}</StatusPill>
          ) : null}
        </div>
        <h1 className="text-title1 font-extrabold text-ink md:text-display">{explorerStrings.title}</h1>
        <p className="max-w-[65ch] text-body text-ink-muted">{explorerStrings.subtitle}</p>
      </div>

      <FlowerExplorer variant="full" parts={parts} />
    </AppShell>
  );
}
