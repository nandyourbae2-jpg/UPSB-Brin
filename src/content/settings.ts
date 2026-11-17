import { getEnv } from "@/env";

export interface SiteSettings {
  whatsappNumber: string | null;
  showIndicativePrices: boolean;
}

/**
 * Mengambil pengaturan situs (WhatsApp resmi, tampilan harga indikatif).
 * Di M1 bersumber dari variabel lingkungan; mulai M4 mengambil dari tabel SiteSetting di DB.
 */
export function getSiteSettings(): SiteSettings {
  const env = getEnv();
  const rawWa = env.SITE_WHATSAPP_NUMBER?.trim() ?? "";
  return {
    whatsappNumber: rawWa.length > 0 ? rawWa : null,
    showIndicativePrices: env.SHOW_INDICATIVE_PRICES === "true",
  };
}

/** Menghasilkan tautan wa.me yang ter-encode, atau null bila nomor resmi belum ditetapkan. */
export function buildWhatsAppUrl(number: string | null, message: string): string | null {
  if (!number) return null;
  const digits = number.replace(/\D/g, "");
  if (digits.length < 9) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
