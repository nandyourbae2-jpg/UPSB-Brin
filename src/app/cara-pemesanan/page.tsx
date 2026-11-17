import { AppShell } from "@/components/shell/AppShell";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { howToOrderContent } from "@/content/pages";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: howToOrderContent.meta.title,
  description: howToOrderContent.meta.description,
  path: "/cara-pemesanan",
});

export default function CaraPemesananPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-3">
        <h1 className="text-title1 font-extrabold text-ink md:text-display">{howToOrderContent.title}</h1>
        <p className="max-w-[65ch] text-body text-ink-muted">{howToOrderContent.lead}</p>
      </div>

      <Card as="section" aria-labelledby="alur-pesan">
        <h2 id="alur-pesan" className="mb-4 text-title2 font-extrabold text-ink">
          Urutan alur permintaan
        </h2>
        <ol className="m-0 flex list-none flex-col gap-4 p-0">
          {howToOrderContent.steps.map((step, index) => (
            <li key={step.title} className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-primary text-body-sm font-bold text-on-primary"
              >
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <strong className="text-title3 font-bold text-ink">{step.title}</strong>
                <p className="max-w-[65ch] text-body-sm text-ink-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {howToOrderContent.notes.map((note) => (
          <Card key={note.title} elevation="flat" className="flex flex-col gap-2">
            <h2 className="text-title3 font-bold text-ink">{note.title}</h2>
            <p className="max-w-[65ch] text-body-sm text-ink-muted">{note.body}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/faq" variant="secondary">
          Baca tanya jawab
        </ButtonLink>
        <ButtonLink href="/kontak" variant="outline">
          Lihat kontak resmi
        </ButtonLink>
      </div>
    </AppShell>
  );
}
