import { IconChevronDown } from "@/components/icons";
import { StatusPill } from "@/components/ui/StatusPill";
import { id } from "@/content/id";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
  draft?: boolean;
}

/**
 * Daftar pertanyaan dengan elemen <details> bawaan HTML: aksesibel lewat keyboard
 * tanpa menambah ukuran bundel JS klien di beranda.
 */
export function Accordion({ items }: { items: readonly AccordionItem[] }) {
  return (
    <div className="divide-y divide-line rounded-lg border border-line bg-surface px-4">
      {items.map((item) => (
        <details key={item.id} className="py-2">
          <summary className="faq-summary flex min-h-12 cursor-pointer items-center justify-between gap-3 py-2 text-title3 font-bold text-ink">
            <span className="flex flex-col items-start gap-2">
              <span>{item.question}</span>
              {item.draft ? <StatusPill tone="warn">{id.status.draftNotice}</StatusPill> : null}
            </span>
            <IconChevronDown className="faq-chevron shrink-0 text-ink-muted transition-transform duration-(--motion-fast)" />
          </summary>
          <p className="max-w-[65ch] pb-4 text-body-sm text-ink-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
