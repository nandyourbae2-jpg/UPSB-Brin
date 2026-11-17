import Link from "next/link";
import { IconFlower } from "@/components/icons";
import { id } from "@/content/id";

/** Footer publik: tautan informasi, kebijakan, halaman gangguan, dan pernyataan akurasi wajib. */
export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-line bg-surface">
      <div className="mx-auto flex w-full flex-col gap-6 px-4 py-8" style={{ maxWidth: "var(--layout-content-max)" }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-2 text-ink">
            <IconFlower className="shrink-0 text-primary" />
            <div className="flex flex-col">
              <span className="text-title3 font-extrabold">{id.site.fullName}</span>
              <span className="text-caption text-ink-muted">{id.site.locationLine}</span>
            </div>
          </div>

          <nav aria-label={id.footer.navLabel}>
            <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
              {id.footer.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-12 items-center text-body-sm font-bold text-ink-muted hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="max-w-[65ch] text-caption text-ink-muted">{id.footer.accuracyNotice}</p>
      </div>
    </footer>
  );
}
