import Link from "next/link";
import { IconChevronRight, IconSearch } from "@/components/icons";

/** Kolom pencarian berbentuk pil di atas hero (PRD §4.2). Membuka halaman pemesanan. */
export function SearchPill({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-12 w-full items-center gap-3 rounded-pill border border-line bg-surface px-4 py-3 text-body-sm font-bold text-ink-muted shadow-e1 transition-colors duration-(--motion-fast) hover:border-ink-muted hover:text-ink"
    >
      <IconSearch className="shrink-0 text-primary" width={20} height={20} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <IconChevronRight className="shrink-0 text-ink-muted" width={20} height={20} />
    </Link>
  );
}
