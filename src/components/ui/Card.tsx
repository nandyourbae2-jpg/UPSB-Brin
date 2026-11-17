import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Elevation = "flat" | "raised" | "floating";

// Bayangan berjenjang menurut peran, bukan satu bayangan identik di semua kartu.
const elevations: Record<Elevation, string> = {
  flat: "border border-line shadow-none",
  raised: "border border-line shadow-e1",
  floating: "border border-transparent shadow-e2",
};

interface CardProps {
  as?: ElementType;
  elevation?: Elevation;
  tone?: "surface" | "alt";
  className?: string;
  children: ReactNode;
}

export function Card({ as: Tag = "div", elevation = "flat", tone = "surface", className, children }: CardProps) {
  return (
    <Tag className={cn("rounded-lg p-4", tone === "surface" ? "bg-surface" : "bg-surface-alt", elevations[elevation], className)}>
      {children}
    </Tag>
  );
}
