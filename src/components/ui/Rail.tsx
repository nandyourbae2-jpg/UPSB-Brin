import Link from "next/link";
import type { ReactNode } from "react";
import { IconChevronRight } from "@/components/icons";
import { cn } from "@/lib/cn";

export function RailHeader({
  id,
  title,
  action,
}: {
  id?: string;
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 id={id} className="text-title2 font-extrabold text-ink">
        {title}
      </h2>
      {action ? (
        <Link
          href={action.href}
          className="inline-flex min-h-12 shrink-0 items-center gap-1 rounded-pill px-3 text-body-sm font-bold text-primary hover:bg-primary-tint"
        >
          <span>{action.label}</span>
          <IconChevronRight width={16} height={16} />
        </Link>
      ) : null}
    </div>
  );
}

/** Rel horizontal dengan scroll-snap di ponsel; menjadi grid 3 kolom pada lebar md ke atas. */
export function Rail({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rail-scroll -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
