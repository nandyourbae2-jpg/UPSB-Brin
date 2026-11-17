import { id } from "@/content/id";

/**
 * Konten halaman publik M1 (Beranda, Tentang, Cara Pemesanan, FAQ, Kontak, Privasi, Syarat, Gangguan, 404).
 * Mematuhi .agents/rules/03-content-claims.md:
 * - Tanpa klaim bebas virus, janji stok/tanggal, nomor PVT tanpa verifikasi, atau logo/afiliasi BRIN.
 * - Ciri varietas hanya dari materi YIM_013 dengan catatan uji lokal.
 * - Teks yang butuh persetujuan tim UPSB ditandai draft/TODO agar transparan.
 */

export const homeContent = {
  meta: {
    title: "Beranda",
    description:
      "Pengenalan awal produk Pacar Air Fabiola dan Claire dari Unit Produksi Stek Berakar Baturraden, cara pemesanan, dan informasi kemitraan.",
  },
  statusBanner:
    "Mode pratinjau demo proposal: seluruh halaman publik, katalog, Jelajah 3D, simulasi formulir pemesanan & kemitraan, pelacakan QR, serta demo Admin sudah dapat dicoba di browser tanpa koneksi database produksi.",
  searchPill: {
    label: "Butuh pot atau stek untuk pekan berapa?",
    href: "/pesan",
  },
  hero: {
    tag: "Rencana prapesan Fabiola & Claire",
    // CLM-02: headline netral untuk kedua varietas, tidak menggeneralisasi sifat salah satu varietas.
    title: "Pacar air Fabiola & Claire, direncanakan sesuai pekan kebutuhan Anda.",
    body: "Kirim permintaan produk. Tim UPSB memeriksa jadwal produksi dan ketersediaan sebelum menghubungi Anda lewat WhatsApp.",
    primaryCta: { label: "Pesan produk", href: "/pesan" },
    secondaryCta: { label: "Ajukan kemitraan", href: "/kemitraan" },
  },
  services: [
    { id: "pot", label: "Pot 12 cm", href: "/pesan?produk=pot" },
    { id: "stek", label: "Stek berakar", href: "/pesan?produk=stek" },
    { id: "kemitraan", label: "Kemitraan", href: "/kemitraan" },
    { id: "lacak", label: "Lacak batch", href: "/lacak" },
    { id: "harga", label: "Harga", href: "#harga" },
    { id: "cara", label: "Cara pesan", href: "/cara-pemesanan" },
    { id: "varietas", label: "Varietas", href: "#varietas" },
    { id: "faq", label: "Tanya jawab", href: "/faq" },
  ] as const,
  promoRail: {
    title: "Informasi layanan",
    action: { label: "Lihat semua", href: "/cara-pemesanan" },
    items: [
      {
        id: "pekan",
        tone: "tint" as const,
        title: "Rencanakan pekan kebutuhan lebih awal",
        body: "Jadwal produksi mingguan disusun setelah admin memeriksa permintaan masuk.",
        cta: { label: "Baca alur pesan", href: "/cara-pemesanan" },
      },
      {
        id: "nursery",
        tone: "leaf" as const,
        title: "Nursery? Lini stek berakar disiapkan untuk pembesaran",
        body: "Rencana lini stek berakar untuk mitra pembibitan dan nursery.",
        cta: { label: "Lihat info kemitraan", href: "/tentang#produk" },
      },
      {
        id: "batch",
        tone: "ink" as const,
        title: "Setiap kemasan direncanakan membawa kode batch QR",
        body: "Halaman lacak menampilkan identitas varietas serta dokumen yang sudah terverifikasi.",
        cta: { label: "Pelajari ketertelusuran", href: "/tentang#ketertelusuran" },
      },
    ],
  },
  varieties: {
    title: "Dua varietas, dua karakter",
    action: { label: "Lihat katalog", href: "/produk" },
    detailCta: "Detail varietas",
    items: [
      {
        id: "fabiola" as const,
        name: "Fabiola",
        traits: [
          { lead: "Rimbun", text: "dengan percabangan sekunder" },
          { lead: "Tunas dan bunga", text: "dalam jumlah tinggi" },
        ],
      },
      {
        id: "claire" as const,
        name: "Claire",
        traits: [
          { lead: "Bunga berukuran besar", text: "menjadi ciri utama" },
          { lead: "Mekar serempak", text: "dalam satu tanaman" },
        ],
      },
    ],
    caveat:
      "Karakter di atas mengacu pada materi teknologi YIM_013. Adaptasi dataran rendah merupakan arah seleksi yang masih divalidasi uji lokal.",
  },
  prices: {
    title: "Harga indikatif",
    hiddenNote:
      "Harga indikatif sedang disembunyikan sementara oleh pengelola. Hubungi admin untuk informasi harga terbaru.",
    items: [
      { name: "Tanaman pot berbunga 12 cm", price: "Rp11.000", unit: "per pot" },
      { name: "Stek berakar untuk nursery", price: "Rp2.800", unit: "per stek" },
    ],
    // CLM-03: penafian tegas bahwa angka tidak mengikat.
    disclaimer:
      "Harga indikatif di atas dapat berubah, belum termasuk ongkos kirim, dan bukan janji transaksi. Harga akhir dikonfirmasi admin lewat WhatsApp.",
  },
  steps: {
    title: "Dari formulir sampai kirim",
    action: { label: "Panduan lengkap", href: "/cara-pemesanan" },
    items: [
      { title: "Pilih produk", body: "Pot 12 cm atau stek berakar, varietas Fabiola atau Claire." },
      { title: "Kirim permintaan", body: "Isi jumlah, lokasi, dan preferensi pekan kebutuhan tanpa perlu akun." },
      { title: "Admin memeriksa", body: "Tim UPSB mengecek ketersediaan, jadwal produksi, dan ongkos kirim." },
      { title: "Konfirmasi lewat WhatsApp", body: "Pesanan baru sah setelah ada kesepakatan langsung dengan admin." },
      { title: "Pengemasan dengan kode batch", body: "Kemasan direncanakan membawa kode QR batch menuju halaman ketertelusuran." },
    ],
  },
  faqPreview: {
    title: "Tanya jawab ringkas",
    action: { label: "Semua tanya jawab", href: "/faq" },
    items: [
      {
        id: "permintaan-vs-pesanan",
        question: "Apakah mengirim formulir berarti pesanan sudah pasti?",
        answer:
          "Belum. Formulir hanya mencatat permintaan dengan status baru. Pesanan dianggap terkonfirmasi setelah admin memeriksa jadwal dan sepakat dengan Anda.",
        draft: false,
      },
      {
        id: "pembayaran",
        question: "Apakah ada pembayaran langsung di website?",
        answer:
          "Tidak. Website tidak memproses pembayaran. Harga akhir, ongkos kirim, dan cara pembayaran dibahas langsung dengan admin lewat WhatsApp.",
        draft: false,
      },
      {
        id: "isi-qr",
        question: "Apa yang ditampilkan di halaman QR batch?",
        answer:
          "Identitas varietas, kode batch, lokasi produksi, serta status pemeriksaan kesehatan atau dokumen PVT yang sudah terverifikasi. Data yang belum tersedia ditulis apa adanya tanpa data pribadi pelanggan.",
        draft: false,
      },
    ],
  },
} as const;

export const aboutContent = {
  meta: {
    title: "Tentang UPSB",
    description:
      "Profil Unit Produksi Stek Berakar (UPSB) Baturraden, konteks YIMC 2026, lini produk Fabiola & Claire, dan prinsip ketertelusuran QR.",
  },
  title: "Tentang UPSB",
  lead: "Unit Produksi Stek Berakar (UPSB) di Baturraden, Banyumas menyiapkan ekosistem pemesanan, kemitraan nursery, dan ketertelusuran QR untuk Pacar Air (Impatiens) varietas Fabiola dan Claire.",
  sections: [
    {
      id: "status",
      title: "Status sistem dan ruang lingkup",
      body: "Website ini dikembangkan secara bertahap pada konteks Youth Innovation-to-Market Challenge (YIMC) 2026 dengan rujukan materi teknologi YIM_013. Selama tahap pembangunan, operasional pemesanan daring, penerbitan kode QR batch, dan pencatatan kemitraan belum berjalan sebelum diluncurkan resmi oleh pengelola.",
    },
    {
      id: "produk",
      title: "Dua lini produk dan dua varietas",
      body: "Rencana layanan mencakup dua lini produk: tanaman pot berbunga ukuran 12 cm untuk kios, lanskap, hotel, maupun perorangan; serta stek berakar bagi mitra nursery untuk dibesarkan lebih lanjut. Fabiola memiliki karakter rimbun dengan percabangan sekunder serta jumlah tunas dan bunga tinggi, sedangkan Claire memiliki karakter bunga berukuran besar dan mekar serempak. Adaptasi dataran rendah merupakan arah seleksi yang masih divalidasi uji lokal, dan penggunaan kedua varietas bergantung pada persetujuan tertulis pemegang hak.",
    },
    {
      id: "ketertelusuran",
      title: "Prinsip ketertelusuran dan klaim dokumen",
      body: "Halaman lacak batch hanya menampilkan informasi varietas, riwayat produksi, serta status pemeriksaan yang memiliki dokumen berbukti dan telah diverifikasi pengelola. Status pengujian yang belum ada ditampilkan sebagai belum dilakukan pengujian, bukan negatif. Sertifikat Perlindungan Varietas Tanaman (PVT) hanya dicantumkan setelah dipetakan ke varietas terkait dan diverifikasi, dan sertifikat PVT bukan bukti kesehatan tanaman.",
    },
  ],
  mediaNote:
    "Catatan foto dan identitas (TODO-konfirmasi): logo final dan foto tanaman asli UPSB yang berizin sedang disiapkan pengelola. Seluruh gambar bunga pada tahap ini adalah ilustrasi, bukan foto tanaman UPSB.",
} as const;

export const howToOrderContent = {
  meta: {
    title: "Cara pemesanan",
    description:
      "Panduan langkah demi langkah mengajukan permintaan tanaman pot 12 cm atau stek berakar Pacar Air Fabiola dan Claire, serta pengajuan kemitraan.",
  },
  title: "Cara pemesanan dan kemitraan",
  lead: "Pengajuan permintaan tidak membutuhkan akun pelanggan. Semua permintaan dicatat lebih dulu lalu ditinjau oleh admin UPSB sebelum dikonfirmasi.",
  steps: homeContent.steps.items,
  notes: [
    {
      title: "Permintaan bukan janji stok atau tanggal",
      body: "Pilihan pekan kebutuhan adalah preferensi Anda, bukan jaminan tanggal kirim. Ketersediaan dan jadwal pengiriman dikonfirmasi oleh admin setelah meninjau kapasitas produksi.",
    },
    {
      title: "Satu atau dua varietas sekaligus",
      body: "Formulir pemesanan (tersedia pada tahap M4) dirancang untuk memilih produk pot 12 cm atau stek berakar, dengan satu atau dua varietas sekaligus, beserta ringkasan tinjauan sebelum dikirim.",
    },
    {
      title: "Alur pengajuan kemitraan",
      body: "Untuk nursery, pembibitan, distributor, atau lanskap, formulir kemitraan (M4) mencatat pengajuan awal beserta profil usaha. Pengajuan awal belum berarti persetujuan kemitraan sampai tim UPSB meninjau dan menghubungi Anda.",
    },
  ],
} as const;

export interface FaqEntry {
  id: string;
  category: "Pemesanan" | "Varietas & Perawatan" | "Kemitraan & Ketertelusuran";
  question: string;
  answer: string;
  draft: boolean;
}

export const faqContent = {
  meta: {
    title: "Tanya jawab",
    description:
      "Pertanyaan umum mengenai permintaan produk, harga indikatif, kemitraan nursery, sifat varietas Fabiola & Claire, serta halaman QR batch.",
  },
  title: "Tanya jawab",
  lead: "Jawaban berikut merangkum aturan layanan sistem UPSB. Entri bertanda draf masih menunggu persetujuan akhir tim UPSB sebelum operasional dibuka.",
  // CLM-01: entri perawatan atau SLA operasional diberi penanda draft: true dan tidak mengarang klaim botani/kesehatan.
  items: [
    {
      id: "permintaan-vs-pesanan",
      category: "Pemesanan",
      question: "Apakah mengirim formulir berarti pesanan sudah terkonfirmasi?",
      answer:
        "Belum. Website mencatat permintaan dengan nomor rujukan unik dan status baru. Pesanan hanya sah setelah admin memeriksa ketersediaan serta harga akhir dan menyepakatinya bersama Anda lewat WhatsApp.",
      draft: false,
    },
    {
      id: "pembayaran",
      category: "Pemesanan",
      question: "Apakah ada pembayaran di website atau pembuatan akun?",
      answer:
        "Tidak ada pembayaran daring maupun akun pelanggan pada versi ini. Seluruh pembahasan biaya, ongkos kirim, dan pelunasan dilakukan langsung dengan admin.",
      draft: false,
    },
    {
      id: "harga-indikatif",
      category: "Pemesanan",
      question: "Mengapa harga disebut indikatif?",
      answer:
        "Angka yang ditampilkan (Rp11.000 per pot 12 cm atau Rp2.800 per stek berakar, jika diaktifkan pengelola) hanyalah patokan awal di luar ongkos kirim. Nilai akhir ditetapkan setelah peninjauan admin.",
      draft: false,
    },
    {
      id: "beda-fabiola-claire",
      category: "Varietas & Perawatan",
      question: "Apa perbedaan utama varietas Fabiola dan Claire?",
      answer:
        "Mengacu pada materi teknologi YIM_013, Fabiola menonjol pada kerimbunan, percabangan sekunder, serta jumlah tunas dan bunga tinggi. Claire menonjol pada ukuran bunga yang besar dan mekar serempak.",
      draft: false,
    },
    {
      id: "adaptasi-dataran-rendah",
      category: "Varietas & Perawatan",
      question: "Bagaimana kesesuaian kedua varietas di dataran rendah?",
      answer:
        "Tidak ada jaminan untuk semua kondisi. Adaptasi dataran rendah merupakan arah seleksi yang masih divalidasi melalui uji lokal di masing-masing lokasi.",
      draft: false,
    },
    {
      id: "perawatan-dasar",
      category: "Varietas & Perawatan",
      question: "Bagaimana panduan perawatan dasar setelah tanaman diterima?",
      answer:
        "TODO-konfirmasi tim UPSB (CLM-01): draf panduan perawatan spesifik untuk pot 12 cm dan aklimatisasi stek berakar sedang disiapkan oleh tim teknis UPSB agar sesuai dengan protokol kebun.",
      draft: true,
    },
    {
      id: "kemitraan",
      category: "Kemitraan & Ketertelusuran",
      question: "Apa syarat mengajukan kemitraan nursery?",
      answer:
        "Anda mengisi profil usaha, jenis kerja sama yang diminati, varietas, dan kapasitas rencana pada formulir kemitraan. Pengajuan dicatat untuk peninjauan dan belum menjadi persetujuan otomatis.",
      draft: false,
    },
    {
      id: "isi-qr-dan-uji",
      category: "Kemitraan & Ketertelusuran",
      question: "Apa saja yang tampil di halaman QR batch?",
      answer:
        "Identitas produk dan varietas, lokasi produksi Baturraden, tanggal pengemasan atau pengiriman jika tercatat, serta status pemeriksaan kesehatan atau dokumen PVT yang sudah terverifikasi. Data pelanggan (nama, nomor telepon, alamat, harga transaksi) tidak pernah ditampilkan. Bila uji belum ada, status tertulis belum dilakukan pengujian.",
      draft: false,
    },
  ] satisfies readonly FaqEntry[],
} as const;

export const contactContent = {
  meta: {
    title: "Kontak",
    description: "Informasi lokasi Unit Produksi Stek Berakar di Baturraden, Banyumas dan saluran komunikasi resmi WhatsApp.",
  },
  title: "Kontak UPSB",
  lead: "Komunikasi tindak lanjut permintaan pemesanan, pengajuan kemitraan, dan pelaporan QR batch tidak aktif dilakukan melalui saluran resmi UPSB.",
  location: {
    title: "Lokasi unit produksi",
    area: "Baturraden, Kabupaten Banyumas, Jawa Tengah",
    addressNote: "TODO-konfirmasi: alamat jalan lengkap dan titik temu pengambilan ditetapkan pengelola sebelum peluncuran.",
  },
  hours: {
    title: "Jam layanan admin",
    value: "TODO-konfirmasi: menunggu penetapan jam operasional resmi oleh pengelola UPSB (zona waktu WIB / Asia/Jakarta).",
  },
  whatsappSection: {
    title: "WhatsApp resmi",
    readyBody: "Gunakan tombol di bawah untuk membuka percakapan WhatsApp dengan pesan awal yang sudah terisi.",
    unsetBody:
      "Nomor WhatsApp resmi belum ditetapkan pada konfigurasi lingkungan. Pengelola perlu mengisi SITE_WHATSAPP_NUMBER (atau pengaturan admin di M4) sebelum layanan publik dibuka.",
  },
} as const;

export const privacyContent = {
  meta: {
    title: "Kebijakan privasi",
    description:
      "Penjelasan pengumpulan, penggunaan, perlindungan, dan batasan data pribadi pada website UPSB Digital Ecosystem.",
  },
  title: "Kebijakan privasi",
  lead: "Draf kebijakan privasi untuk menindaklanjuti permintaan pemesanan dan pengajuan kemitraan (menunggu peninjauan final pengelola sebelum tayang produksi).",
  sections: [
    {
      title: "Data yang dikumpulkan",
      body: "Saat Anda mengirimkan formulir pemesanan atau kemitraan (aktif mulai tahap M4), sistem mencatat data yang Anda isi: nama atau penanggung jawab, nama usaha, nomor WhatsApp, alamat email, alamat pengiriman atau usaha, rincian produk/varietas, serta persetujuan privasi.",
    },
    {
      title: "Tujuan penggunaan",
      body: "Data hanya dipakai oleh peran internal berwenang di UPSB untuk memeriksa jadwal, menindaklanjuti permintaan lewat WhatsApp atau email, serta meninjau kelayakan kemitraan.",
    },
    {
      title: "Larangan tampil di halaman publik dan analitik",
      body: "Nama pemesan, nomor WhatsApp, email, alamat, harga transaksi, dan catatan internal tidak pernah ditampilkan di halaman ketertelusuran QR (/trace/*) maupun dikirim ke event analitik.",
    },
    {
      title: "Penyimpanan dan retensi data",
      body: "TODO-konfirmasi: jangka waktu retensi dan prosedur penghapusan data permintaan/kemitraan ditetapkan oleh pengelola UPSB sebelum sistem dibuka untuk umum.",
    },
    {
      title: "Permintaan koreksi atau penghapusan",
      body: "Anda dapat menghubungi admin melalui saluran resmi di halaman Kontak dengan menyertakan nomor rujukan permintaan untuk meminta pembaruan atau penghapusan data.",
    },
  ],
} as const;

export const termsContent = {
  meta: {
    title: "Syarat dan ketentuan",
    description:
      "Ketentuan penggunaan website UPSB, status permintaan pemesanan, harga indikatif, pengajuan kemitraan, dan informasi varietas.",
  },
  title: "Syarat dan ketentuan",
  lead: "Draf ketentuan penggunaan website UPSB Digital Ecosystem (menunggu persetujuan akhir pengelola).",
  sections: [
    {
      title: "Status permintaan pemesanan",
      body: "Pengiriman formulir hanya mencatat permintaan dengan nomor rujukan. Website ini tidak menyediakan pembayaran daring dan tidak menerbitkan pesanan terkonfirmasi otomatis. Kesepakatan jumlah, jadwal kirim, ongkos kirim, dan pembayaran dilakukan terpisah lewat admin.",
    },
    {
      title: "Ketersediaan, pekan kebutuhan, dan harga indikatif",
      body: "Pilihan pekan kebutuhan adalah preferensi pelanggan. Angka harga di website bersifat indikatif dan dapat berubah. UPSB tidak memberikan janji stok atau tanggal kirim sebelum konfirmasi tertulis/WhatsApp dari admin.",
    },
    {
      title: "Pengajuan kemitraan",
      body: "Formulir kemitraan merupakan pengajuan awal untuk peninjauan profil usaha dan tidak mengikat sebagai perjanjian kerja sama sampai ada persetujuan resmi.",
    },
    {
      title: "Hak varietas dan akurasi visual",
      body: "Penggunaan varietas Fabiola dan Claire bergantung pada persetujuan tertulis pemegang hak. Ilustrasi bunga 2D atau 3D pada website adalah alat bantu visual dan bukan foto tanaman nyata UPSB. Informasi kesehatan tanaman hanya merujuk dokumen uji yang terverifikasi.",
    },
  ],
} as const;

export const outageContent = {
  meta: {
    title: "Layanan terganggu sementara",
    description: "Informasi gangguan sementara website UPSB dan saluran alternatif melalui WhatsApp resmi.",
  },
  title: id.outage.title,
  body: id.outage.body,
  retryLabel: id.outage.retryLabel,
} as const;

export const notFoundContent = {
  meta: {
    title: "Halaman tidak ditemukan",
    description: "Alamat halaman tidak tersedia atau fitur berada pada tahap pembangunan berikutnya.",
  },
  title: "Halaman tidak ditemukan",
  body: "Alamat yang Anda buka tidak tersedia. Jika Anda membuka tautan Pesan, Kemitraan, atau Lacak batch, fitur tersebut dijadwalkan pada tahap pembangunan berikutnya.",
  backHome: "Kembali ke beranda",
  toContact: "Lihat kontak UPSB",
} as const;
