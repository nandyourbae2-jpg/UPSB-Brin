import Link from "next/link";
import type { ReactNode } from "react";
import { IconFlower } from "@/components/icons";
import { TopNav } from "@/components/shell/Navigation";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { id } from "@/content/id";

/** Bilah atas: identitas dan lokasi (PRD 4.2). Navigasi muncul di sini mulai lebar md. */
export function TopBar({ actions }: { actions?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <div
        className="mx-auto flex w-full items-center justify-between gap-3 px-4"
        style={{ height: "var(--layout-topbar-h)", maxWidth: "var(--layout-content-max)" }}
      >
        <Link href="/" className="flex min-h-12 min-w-0 items-center gap-2 text-ink">
          <IconFlower className="shrink-0 text-primary" />
          <span className="flex min-w-0 flex-col">
            <span className="text-title3 leading-5 font-extrabold">{id.site.name}</span>
            <span className="truncate text-caption text-ink-muted">{id.site.locationLine}</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <TopNav />
          {actions}
          <ThemeToggle toLightLabel={id.theme.toLight} toDarkLabel={id.theme.toDark} text={id.theme.label} />
        </div>
      </div>
    </header>
  );
}
