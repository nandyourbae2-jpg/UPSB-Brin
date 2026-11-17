import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  selected?: boolean;
  children: ReactNode;
}

/** Chip pilihan (filter, bagian bunga). Toggle dengan aria-pressed. Target sentuh 48 px. */
export function Chip({ selected = false, className, children, type = "button", ...rest }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        "inline-flex min-h-12 items-center rounded-pill border px-4 text-body-sm font-bold transition-colors duration-(--motion-fast)",
        selected
          ? "border-primary bg-primary-tint text-primary-pressed"
          : "border-line bg-surface text-ink hover:bg-surface-alt",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
