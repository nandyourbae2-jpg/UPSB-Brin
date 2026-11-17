import { cn } from "@/lib/cn";

type FlowerVariant = "hero" | "fabiola" | "claire";

interface FlowerPosterProps {
  variant: FlowerVariant;
  label: string;
  size?: "md" | "lg";
  className?: string;
}

const angles = [0, 72, 144, 216, 288] as const;

const paletteByVariant: Record<FlowerVariant, { petal: string; edge: string; throat: string }> = {
  hero: {
    petal: "var(--flower-claire-petal)",
    edge: "var(--flower-claire-petal-edge)",
    throat: "var(--flower-fabiola-throat)",
  },
  fabiola: {
    petal: "var(--flower-fabiola-petal)",
    edge: "var(--flower-fabiola-petal-edge)",
    throat: "var(--flower-fabiola-throat)",
  },
  claire: {
    petal: "var(--flower-claire-petal)",
    edge: "var(--flower-claire-petal-edge)",
    throat: "var(--flower-claire-throat)",
  },
};

/**
 * Ilustrasi statis lima kelopak untuk hero (cadangan sebelum 3D di M3, FIX-02) dan kartu varietas.
 * Warna diambil dari variabel CSS token, bukan nilai hardcode. Tidak terpotong.
 */
export function FlowerPoster({ variant, label, size = "lg", className }: FlowerPosterProps) {
  const p = paletteByVariant[variant];
  const dim = size === "lg" ? 160 : 80;

  return (
    <svg
      viewBox="-92 -92 184 184"
      width={dim}
      height={dim}
      role="img"
      aria-label={label}
      className={cn("shrink-0 select-none", className)}
    >
      <g>
        {angles.map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <path
              d="M0 -8 C-26 -24 -36 -66 -14 -78 C-8 -81 -3 -75 0 -69 C3 -75 8 -81 14 -78 C36 -66 26 -24 0 -8 Z"
              fill={p.petal}
              stroke={p.edge}
              strokeWidth={2}
            />
            <path d="M0 -14 V-52" stroke={p.throat} strokeWidth={2.2} strokeLinecap="round" opacity={0.55} />
          </g>
        ))}
        <circle r={12} fill={p.throat} />
        <circle r={5} fill="var(--flower-pollen)" />
      </g>
    </svg>
  );
}
