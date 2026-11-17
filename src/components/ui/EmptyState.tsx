import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
  headingAs?: "h1" | "h2";
}

/** Status kosong yang mengajak bertindak: apa yang terjadi dan langkah berikutnya. */
export function EmptyState({ icon, title, body, action, headingAs = "h2" }: EmptyStateProps) {
  const Heading = headingAs;
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-line bg-surface px-6 py-10 text-center">
      {icon ? <div className="text-primary">{icon}</div> : null}
      <Heading className="text-title3 font-bold text-ink">{title}</Heading>
      <p className="max-w-[65ch] text-body-sm text-ink-muted">{body}</p>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
