import type { ComponentType, SVGProps } from "react";
import { IconHome, IconOrder, IconPartnership, IconTrace } from "@/components/icons";
import { navLabels } from "@/content/nav";

export interface NavItem {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

/**
 * Tab navigasi utama (PRD 4.2).
 * Rute /pesan, /kemitraan, dan /lacak aktif sebagai halaman pratinjau interaktif demo proposal;
 * integrasi database penuh & RBAC /admin mengikuti kelengkapan backend pada tahap berikutnya.
 */
export const navItems: readonly NavItem[] = [
  { href: "/", label: navLabels.home, Icon: IconHome },
  { href: "/pesan", label: navLabels.order, Icon: IconOrder },
  { href: "/kemitraan", label: navLabels.partnership, Icon: IconPartnership },
  { href: "/lacak", label: navLabels.trace, Icon: IconTrace },
];
