import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "info" | "success" | "warn" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-alt text-ink-muted border border-line",
  info: "bg-primary-tint text-primary-pressed border border-transparent",
  success: "bg-leaf-tint text-leaf border border-transparent",
  warn: "bg-warn-bg text-warn-ink border border-transparent",
  danger: "bg-surface text-danger border border-danger",
};

/** Status selalu berupa teks. Warna hanya penguat, bukan satu-satunya penanda. */
export function StatusPill({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cn("inline-flex min-h-6 self-start items-center rounded-pill px-3 text-caption", tones[tone])}>
      {children}
    </span>
  );
}
