import { navLabels } from "@/content/nav";
import { outageStrings } from "@/content/outage";

/**
 * Semua teks antarmuka bersama ada di sini. Tidak ada teks hardcode tersebar di komponen.
 * Nomor WhatsApp, harga tampil/sembunyi, dan kontak diambil dari getSiteSettings().
 */
export const id = {
  site: {
    name: "UPSB",
    fullName: "UPSB Digital Ecosystem",
    locationLine: "Baturraden, Banyumas",
    description:
      "Informasi, pemesanan awal, kemitraan, dan rencana ketertelusuran QR untuk Pacar Air Fabiola dan Claire dari Baturraden, Banyumas.",
  },
  nav: navLabels,
  footer: {
    navLabel: "Tautan informasi dan kebijakan",
    links: [
      { href: "/jelajah", label: "Jelajah bunga" },
      { href: "/produk", label: "Katalog produk" },
      { href: "/pesan", label: "Pesan produk" },
      { href: "/kemitraan", label: "Ajukan kemitraan" },
      { href: "/lacak", label: "Lacak batch QR" },
      { href: "/tentang", label: "Tentang UPSB" },
      { href: "/cara-pemesanan", label: "Cara pemesanan" },
      { href: "/faq", label: "Tanya jawab" },
      { href: "/kontak", label: "Kontak" },
      { href: "/privasi", label: "Kebijakan privasi" },
      { href: "/syarat", label: "Syarat dan ketentuan" },
      { href: "/gangguan", label: "Halaman gangguan" },
      { href: "/admin", label: "Demo dashboard admin" },
    ],
    accuracyNotice:
      "Status sistem: dalam tahap pembangunan bertahap. Penggunaan varietas Fabiola dan Claire bergantung pada persetujuan tertulis pemegang hak. Informasi lisensi, sertifikat PVT, dan hasil pemeriksaan kesehatan tanaman hanya ditampilkan setelah dokumen diverifikasi. Sertifikat PVT bukan bukti kesehatan tanaman.",
  },
  theme: {
    label: "Tema",
    toLight: "Pakai tema terang",
    toDark: "Pakai tema gelap",
  },
  status: {
    inProgress: "Dalam pembangunan",
    draftNotice: "Draf menunggu tinjauan tim UPSB",
    illustrative: "Ilustrasi, bukan foto tanaman UPSB",
  },
  whatsapp: {
    cta: "Hubungi via WhatsApp",
    unset: "Nomor WhatsApp resmi belum ditetapkan pengelola",
    defaultMessage: "Halo UPSB, saya ingin menanyakan informasi produk Fabiola dan Claire.",
    outageMessage: "Halo UPSB, halaman website sedang mengalami gangguan dan saya ingin mengajukan pertanyaan.",
  },
  form: {
    required: "wajib diisi",
    errorSummary: "Periksa isian berikut",
  },
  toast: {
    close: "Tutup pemberitahuan",
  },
  outage: outageStrings,
  a11y: {
    skipToContent: "Lewati ke konten",
    loading: "Memuat",
    heroPosterLabel: "Ilustrasi bunga pacar air lima kelopak, bukan foto tanaman UPSB",
    fabiolaPosterLabel: "Ilustrasi bunga varietas Fabiola berwarna pink tua, bukan foto tanaman UPSB",
    clairePosterLabel: "Ilustrasi bunga varietas Claire berwarna pink muda, bukan foto tanaman UPSB",
  },
} as const;
