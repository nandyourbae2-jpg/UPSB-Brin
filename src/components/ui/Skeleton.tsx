import { id } from "@/content/id";
import { cn } from "@/lib/cn";

/** Placeholder saat memuat. Statis (tanpa animasi otomatis), dengan teks untuk pembaca layar. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div role="status" aria-busy="true" className={cn("rounded-md bg-surface-alt", className)}>
      <span className="sr-only">{id.a11y.loading}</span>
    </div>
  );
}
