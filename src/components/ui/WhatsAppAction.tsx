import { IconChat } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { id } from "@/content/id";
import { buildWhatsAppUrl } from "@/content/settings";

/**
 * Tautan WhatsApp resmi jika nomor sudah diatur pengelola, atau penanda status jujur jika belum.
 * Tidak pernah mencatat pesan sebagai terkirim dan tidak mengarang nomor palsu.
 */
export function WhatsAppAction({
  whatsappNumber,
  message,
  label = id.whatsapp.cta,
  showFallbackLink = true,
}: {
  whatsappNumber: string | null;
  message: string;
  label?: string;
  showFallbackLink?: boolean;
}) {
  const url = buildWhatsAppUrl(whatsappNumber, message);
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-title3 font-bold text-on-primary transition-colors duration-(--motion-fast) hover:bg-primary-pressed"
      >
        <IconChat width={20} height={20} />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <StatusPill tone="warn">{id.whatsapp.unset}</StatusPill>
      {showFallbackLink ? (
        <ButtonLink href="/kontak" variant="outline">
          {id.footer.links.find((l) => l.href === "/kontak")?.label ?? "Kontak"}
        </ButtonLink>
      ) : null}
    </div>
  );
}
