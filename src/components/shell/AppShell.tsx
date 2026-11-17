import type { ReactNode } from "react";
import { BottomTabs } from "@/components/shell/Navigation";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { TopBar } from "@/components/shell/TopBar";
import { id } from "@/content/id";

/**
 * Kerangka halaman: TopBar, konten utama (maks 1040 px, padding 16), SiteFooter, dan BottomTabs di ponsel.
 * Ruang bawah ponsel ditangani pada SiteFooter agar footer tidak tertutup BottomTabs.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-on-primary"
      >
        {id.a11y.skipToContent}
      </a>
      <TopBar />
      <main
        id="konten"
        className="mx-auto flex w-full min-w-0 flex-1 flex-col gap-6 px-4 py-6"
        style={{ maxWidth: "var(--layout-content-max)" }}
      >
        {children}
      </main>
      <SiteFooter />
      <BottomTabs />
    </div>
  );
}
