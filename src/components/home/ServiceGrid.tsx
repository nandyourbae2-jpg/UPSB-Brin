import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  IconChat,
  IconCutting,
  IconHelp,
  IconPartnership,
  IconPot,
  IconTag,
  IconTrace,
  IconVariety,
} from "@/components/icons";
import { cn } from "@/lib/cn";

export type ServiceId = "pot" | "stek" | "kemitraan" | "lacak" | "harga" | "cara" | "varietas" | "faq";

export interface ServiceItem {
  id: ServiceId;
  label: string;
  href: string;
}

const iconMap: Record<ServiceId, ComponentType<SVGProps<SVGSVGElement>>> = {
  pot: IconPot,
  stek: IconCutting,
  kemitraan: IconPartnership,
  lacak: IconTrace,
  harga: IconTag,
  cara: IconChat,
  varietas: IconVariety,
  faq: IconHelp,
};

export function ServiceTile({ item, accent }: { item: ServiceItem; accent: "pink" | "leaf" }) {
  const Icon = iconMap[item.id];
  return (
    <Link
      href={item.href}
      className="group flex min-h-12 flex-col items-center gap-2 rounded-md p-1 text-center text-caption text-ink transition-colors duration-(--motion-fast) hover:bg-surface-alt"
    >
      <span
        className={cn(
          "flex size-16 items-center justify-center rounded-xl transition-colors duration-(--motion-fast)",
          accent === "leaf" ? "bg-leaf-tint text-leaf" : "bg-primary-tint text-primary-pressed",
        )}
      >
        <Icon width={28} height={28} />
      </span>
      <span className="leading-4">{item.label}</span>
    </Link>
  );
}

/** Grid layanan: 4 kolom × 2 baris di ponsel, 8 kolom sejajar di desktop lg (PRD §4.2 & FIX-03). */
export function ServiceGrid({ items, label }: { items: readonly ServiceItem[]; label: string }) {
  return (
    <section aria-label={label}>
      <div className="grid grid-cols-4 gap-3 lg:grid-cols-8">
        {items.map((item, idx) => (
          <ServiceTile key={item.id} item={item} accent={idx % 3 === 2 ? "leaf" : "pink"} />
        ))}
      </div>
    </section>
  );
}
