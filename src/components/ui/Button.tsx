import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline";
type Size = "md" | "sm";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-pressed active:bg-primary-pressed",
  secondary: "bg-primary-tint text-primary-pressed hover:bg-surface-alt",
  outline: "border border-line bg-surface text-ink hover:bg-surface-alt",
};

// md = 48 px (target sentuh). sm = 40 px dengan area sentuh diperluas ke 48 px lewat ::before.
const sizes: Record<Size, string> = {
  md: "min-h-12 px-5 text-title3",
  sm: "relative min-h-10 px-4 text-body-sm font-bold before:absolute before:-inset-1 before:content-['']",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-bold transition-colors duration-(--motion-fast) disabled:cursor-not-allowed disabled:opacity-60";

interface StyleProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export type ButtonProps = StyleProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;
export type ButtonLinkProps = StyleProps & { href: string; onClick?: () => void };

function classesFor({ variant = "primary", size = "md", className }: StyleProps): string {
  return cn(base, variants[variant], sizes[size], className);
}

/** Tombol selalu bertuliskan teks. Nama tindakan konsisten, mis. "Kirim permintaan". */
export function Button({ variant, size, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={classesFor({ variant, size, className, children })} {...rest}>
      {children}
    </button>
  );
}

/** Tautan bergaya tombol, untuk navigasi. */
export function ButtonLink({ variant, size, className, children, href, onClick }: ButtonLinkProps) {
  return (
    <Link href={href} onClick={onClick} className={classesFor({ variant, size, className, children })}>
      {children}
    </Link>
  );
}
