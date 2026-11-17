import { AppShell } from "@/components/shell/AppShell";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { faqContent } from "@/content/pages";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: faqContent.meta.title,
  description: faqContent.meta.description,
  path: "/faq",
});

const categories = ["Pemesanan", "Varietas & Perawatan", "Kemitraan & Ketertelusuran"] as const;

export default function FaqPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-3">
        <h1 className="text-title1 font-extrabold text-ink md:text-display">{faqContent.title}</h1>
        <p className="max-w-[65ch] text-body text-ink-muted">{faqContent.lead}</p>
      </div>

      <div className="flex flex-col gap-6">
        {categories.map((cat) => {
          const group = faqContent.items.filter((item) => item.category === cat);
          return (
            <section key={cat} aria-labelledby={`faq-${cat}`} className="flex flex-col gap-3">
              <h2 id={`faq-${cat}`} className="text-title2 font-extrabold text-ink">
                {cat}
              </h2>
              <Accordion items={group} />
            </section>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/kontak" variant="secondary">
          Masih ada pertanyaan? Lihat kontak
        </ButtonLink>
        <ButtonLink href="/" variant="outline">
          Kembali ke beranda
        </ButtonLink>
      </div>
    </AppShell>
  );
}
