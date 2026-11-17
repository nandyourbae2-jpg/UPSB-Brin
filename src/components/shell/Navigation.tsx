"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLabels } from "@/content/nav";
import { cn } from "@/lib/cn";
import { navItems } from "@/components/shell/nav-items";

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Tab bawah, hanya di ponsel. Di lebar md ke atas navigasi pindah ke bar atas. */
export function BottomTabs() {
  const pathname = usePathname();
  return (
    <nav
      aria-label={navLabels.label}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="m-0 flex list-none p-0" style={{ height: "var(--layout-bottomnav-h)" }}>
        {navItems.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="min-w-0 flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full min-h-12 flex-col items-center justify-center gap-1 px-1 text-caption",
                  active ? "text-primary-pressed" : "text-ink-muted",
                )}
              >
                <Icon />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Navigasi bar atas, hanya di md ke atas. */
export function TopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label={navLabels.label} className="hidden md:block">
      <ul className="m-0 flex list-none gap-1 p-0">
        {navItems.map(({ href, label }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-12 items-center rounded-pill px-4 text-body-sm font-bold",
                  active ? "bg-primary-tint text-primary-pressed" : "text-ink hover:bg-surface-alt",
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
