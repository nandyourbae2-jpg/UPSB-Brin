/**
 * Konten teks & data contoh untuk alur interaktif pratinjau demo:
 * /pesan, /kemitraan, /lacak, /trace/[slug], dan /admin.
 * Mematuhi .agents/rules/03-content-claims.md:
 * - Tidak ada klaim bebas virus, janji stok/tanggal, atau nomor sertifikat PVT fiktif.
 * - Transparan bahwa penyimpanan berjalan di browser perangkat ini (mode pratinjau tanpa DB produksi).
 */

export type OrderStatus =
  | "NEW"
  | "UNDER_REVIEW"
  | "NEED_INFORMATION"
  | "CONTACTED"
  | "QUOTED"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export type PartnershipStatus =
  | "NEW"
  | "UNDER_REVIEW"
  | "NEED_INFORMATION"
  | "CONTACTED"
  | "APPROVED"
  | "DECLINED";

export type PillTone = "neutral" | "info" | "success" | "warn" | "danger";

export interface StatusMeta {
  label: string;
  tone: PillTone;
}

export const ORDER_STATUS_META: Record<OrderStatus, StatusMeta> = {
  NEW: { label: "Baru", tone: "info" },
  UNDER_REVIEW: { label: "Ditinjau", tone: "warn" },
  NEED_INFORMATION: { label: "Perlu info", tone: "warn" },
  CONTACTED: { label: "Sudah dihubungi", tone: "info" },
  QUOTED: { label: "Penawaran terkirim", tone: "info" },
  CONFIRMED: { label: "Terkonfirmasi", tone: "success" },
  IN_PRODUCTION: { label: "Produksi", tone: "warn" },
  READY_TO_SHIP: { label: "Siap kirim", tone: "success" },
  SHIPPED: { label: "Terkirim", tone: "success" },
  COMPLETED: { label: "Selesai", tone: "success" },
  CANCELLED: { label: "Dibatalkan", tone: "neutral" },
  REJECTED: { label: "Ditolak", tone: "danger" },
};

export const PARTNERSHIP_STATUS_META: Record<PartnershipStatus, StatusMeta> = {
  NEW: { label: "Baru", tone: "info" },
  UNDER_REVIEW: { label: "Ditinjau", tone: "warn" },
  NEED_INFORMATION: { label: "Perlu info", tone: "warn" },
  CONTACTED: { label: "Sudah dihubungi", tone: "info" },
  APPROVED: { label: "Disetujui lanjut", tone: "success" },
  DECLINED: { label: "Belum sesuai", tone: "neutral" },
};

export interface StatusHistoryEntry {
  from: string | null;
  to: string;
  changedBy: string;
  changedAt: string;
  note: string;
}

export interface DemoOrder {
  id: string;
  productType: "pot" | "stek";
  varieties: readonly ("fabiola" | "claire")[];
  quantity: number;
  targetWeek: string;
  customerName: string;
  customerType: string;
  whatsapp: string;
  deliveryMethod: "delivery" | "pickup";
  locationSummary: string;
  address: string;
  notes: string;
  status: OrderStatus;
  createdAt: string;
  isDemoSample?: boolean;
  internalNote: string;
  history: readonly StatusHistoryEntry[];
}

export interface DemoPartnership {
  id: string;
  contactName: string;
  roleTitle: string;
  businessName: string;
  businessType: string;
  cityProvince: string;
  cooperationTypes: readonly string[];
  monthlyVolume: string;
  startWeek: string;
  experienceSummary: string;
  whatsapp: string;
  email: string;
  address: string;
  notes: string;
  status: PartnershipStatus;
  createdAt: string;
  isDemoSample?: boolean;
  internalNote: string;
}

export interface DemoBatch {
  slug: string;
  active: boolean;
  varietyId: "fabiola" | "claire";
  varietyName: "Fabiola" | "Claire";
  productType: "pot" | "stek";
  productLabel: string;
  productionLocation: string;
  qcDateLabel: string;
  shipDateLabel: string;
  updatedAtLabel: string;
  healthChecks: {
    visualInspection: string;
    cmvTesting: string;
    pvtStatus: string;
    disclaimer: string;
  };
  careGuide: string;
}

export const CUSTOMER_TYPES = [
  "Kios tanaman hias",
  "Nursery",
  "Lanskap",
  "Hotel atau komersial",
  "Perorangan",
] as const;

export const BUSINESS_TYPES = [
  "Nursery",
  "Pembibitan",
  "Kios tanaman hias",
  "Distributor",
  "Lanskap",
  "Komersial / Instansi",
] as const;

export const COOPERATION_OPTIONS = [
  "Beli stek berakar",
  "Pembesaran tanaman",
  "Beli tanaman pot",
  "Distribusi regional",
  "Uji adaptasi lokal",
] as const;

export const MONTHLY_VOLUME_OPTIONS = [
  "< 200 unit per bulan",
  "200 - 1.000 unit per bulan",
  "1.000 - 5.000 unit per bulan",
  "> 5.000 unit per bulan",
] as const;

export const INITIAL_DEMO_ORDERS: readonly DemoOrder[] = [
  {
    id: "ORD-2026-00014",
    productType: "pot",
    varieties: ["fabiola"],
    quantity: 120,
    targetWeek: "23 Nov - 29 Nov 2026",
    customerName: "Kios Tani Asri",
    customerType: "Kios tanaman hias",
    whatsapp: "0812-0000-0014",
    deliveryMethod: "delivery",
    locationSummary: "Purwokerto",
    address: "Jl. Raya Baturraden KM 7, Purwokerto Utara, Banyumas",
    notes: "Mohon info jadwal pengiriman pagi jika tersedia.",
    status: "NEW",
    createdAt: "2026-11-17T09:15:00+07:00",
    isDemoSample: true,
    internalNote: "Data contoh demo proposal. Belum diverifikasi tim UPSB.",
    history: [
      {
        from: null,
        to: "NEW",
        changedBy: "Sistem Demo",
        changedAt: "2026-11-17T09:15:00+07:00",
        note: "Permintaan contoh tercatat untuk simulasi admin.",
      },
    ],
  },
  {
    id: "ORD-2026-00013",
    productType: "pot",
    varieties: ["claire"],
    quantity: 60,
    targetWeek: "30 Nov - 6 Des 2026",
    customerName: "Pengelola Lanskap Bukit Raya",
    customerType: "Hotel atau komersial",
    whatsapp: "0812-0000-0013",
    deliveryMethod: "delivery",
    locationSummary: "Baturraden",
    address: "Kawasan Wisata Baturraden, Banyumas",
    notes: "Memerlukan warna seragam untuk area taman resepsionis.",
    status: "NEED_INFORMATION",
    createdAt: "2026-11-16T14:20:00+07:00",
    isDemoSample: true,
    internalNote: "Menunggu konfirmasi detail akses kendaraan muat.",
    history: [
      {
        from: "NEW",
        to: "NEED_INFORMATION",
        changedBy: "Admin Demo",
        changedAt: "2026-11-16T16:10:00+07:00",
        note: "Menanyakan titik bongkar muat.",
      },
    ],
  },
  {
    id: "ORD-2026-00012",
    productType: "stek",
    varieties: ["claire"],
    quantity: 800,
    targetWeek: "7 Des - 13 Des 2026",
    customerName: "Nursery Sidareja",
    customerType: "Nursery",
    whatsapp: "0812-0000-0012",
    deliveryMethod: "pickup",
    locationSummary: "Cilacap",
    address: "Kecamatan Sidareja, Kabupaten Cilacap",
    notes: "Rencana pembesaran tahap awal di greenhouse naungan 50%.",
    status: "CONTACTED",
    createdAt: "2026-11-15T11:00:00+07:00",
    isDemoSample: true,
    internalNote: "Sudah dihubungi lewat WhatsApp untuk pencocokan jadwal stek.",
    history: [
      {
        from: "UNDER_REVIEW",
        to: "CONTACTED",
        changedBy: "Admin Demo",
        changedAt: "2026-11-15T15:30:00+07:00",
        note: "Kontak awal tersambung.",
      },
    ],
  },
  {
    id: "ORD-2026-00011",
    productType: "pot",
    varieties: ["fabiola", "claire"],
    quantity: 200,
    targetWeek: "7 Des - 13 Des 2026",
    customerName: "Lanskap Cipta Hijau",
    customerType: "Lanskap",
    whatsapp: "0812-0000-0011",
    deliveryMethod: "delivery",
    locationSummary: "Purbalingga",
    address: "Kabupaten Purbalingga, Jawa Tengah",
    notes: "Kombinasi seimbang Fabiola dan Claire.",
    status: "QUOTED",
    createdAt: "2026-11-14T10:30:00+07:00",
    isDemoSample: true,
    internalNote: "Penawaran indikatif & estimasi ongkir dikirim ke pemesan.",
    history: [
      {
        from: "CONTACTED",
        to: "QUOTED",
        changedBy: "Admin Demo",
        changedAt: "2026-11-14T16:45:00+07:00",
        note: "Rincian biaya dan jadwal dikirim.",
      },
    ],
  },
  {
    id: "ORD-2026-00010",
    productType: "stek",
    varieties: ["fabiola"],
    quantity: 400,
    targetWeek: "14 Des - 20 Des 2026",
    customerName: "Kios Mawar Kota",
    customerType: "Kios tanaman hias",
    whatsapp: "0812-0000-0010",
    deliveryMethod: "pickup",
    locationSummary: "Banjarnegara",
    address: "Banjarnegara, Jawa Tengah",
    notes: "Siap ambil langsung ke Baturraden sesuai pekan konfirmasi.",
    status: "CONFIRMED",
    createdAt: "2026-11-12T08:45:00+07:00",
    isDemoSample: true,
    internalNote: "Jadwal pengambilan dan jumlah telah disepakati.",
    history: [
      {
        from: "QUOTED",
        to: "CONFIRMED",
        changedBy: "Admin Demo",
        changedAt: "2026-11-13T10:00:00+07:00",
        note: "Kesepakatan tercatat.",
      },
    ],
  },
];

export const INITIAL_DEMO_PARTNERSHIPS: readonly DemoPartnership[] = [
  {
    id: "PRT-2026-00004",
    contactName: "Hendra Wijaya",
    roleTitle: "Kepala Produksi",
    businessName: "CV Hijau Lestari Nursery",
    businessType: "Nursery",
    cityProvince: "Bandung Barat, Jawa Barat",
    cooperationTypes: ["Beli stek berakar", "Pembesaran tanaman"],
    monthlyVolume: "1.000 - 5.000 unit per bulan",
    startWeek: "Desember 2026",
    experienceSummary: "Mengelola greenhouse tanaman hias semusim dataran tinggi selama 4 tahun.",
    whatsapp: "0813-0000-0004",
    email: "produksi@contoh-nursery.id",
    address: "Lembang, Kabupaten Bandung Barat, Jawa Barat",
    notes: "Tertarik skema uji coba pengiriman tray stek berakar.",
    status: "NEW",
    createdAt: "2026-11-17T08:30:00+07:00",
    isDemoSample: true,
    internalNote: "Pengajuan contoh demo untuk peninjauan kemitraan.",
  },
  {
    id: "PRT-2026-00003",
    contactName: "Siti Rahmawati",
    roleTitle: "Pemilik Usaha",
    businessName: "Kios Flora Serayu",
    businessType: "Kios tanaman hias",
    cityProvince: "Banyumas, Jawa Tengah",
    cooperationTypes: ["Beli tanaman pot", "Distribusi regional"],
    monthlyVolume: "200 - 1.000 unit per bulan",
    startWeek: "November 2026",
    experienceSummary: "Pemasaran ritel tanaman pot di koridor wisata Baturraden.",
    whatsapp: "0813-0000-0003",
    email: "",
    address: "Karanglewas, Kabupaten Banyumas, Jawa Tengah",
    notes: "Siap diskusi pasokan rutin akhir pekan.",
    status: "UNDER_REVIEW",
    createdAt: "2026-11-15T13:15:00+07:00",
    isDemoSample: true,
    internalNote: "Lokasi dekat dengan unit produksi Baturraden.",
  },
];

export const DEMO_BATCHES: readonly DemoBatch[] = [
  {
    slug: "FAB-POT-2026-001",
    active: true,
    varietyId: "fabiola",
    varietyName: "Fabiola",
    productType: "pot",
    productLabel: "Tanaman pot berbunga 12 cm",
    productionLocation: "Baturraden, Banyumas",
    qcDateLabel: "Belum tercatat (data ilustratif)",
    shipDateLabel: "Belum dikirim",
    updatedAtLabel: "17 Nov 2026",
    healthChecks: {
      visualInspection: "Belum tersedia",
      cmvTesting: "Belum dilakukan pengujian",
      pvtStatus: "Menunggu verifikasi dokumen",
      disclaimer:
        "Informasi hasil pemeriksaan kesehatan tanaman untuk batch ini belum tersedia pada sistem dan tidak memuat pernyataan kesehatan terverifikasi.",
    },
    careGuide:
      "Letakkan di tempat terang tanpa sinar langsung terik siang hari. Siram saat permukaan media mulai mengering dan hindari genangan air pada dasar pot.",
  },
  {
    slug: "CLA-STK-2026-002",
    active: true,
    varietyId: "claire",
    varietyName: "Claire",
    productType: "stek",
    productLabel: "Stek berakar untuk nursery",
    productionLocation: "Baturraden, Banyumas",
    qcDateLabel: "Belum tercatat (data ilustratif)",
    shipDateLabel: "Belum dikirim",
    updatedAtLabel: "17 Nov 2026",
    healthChecks: {
      visualInspection: "Belum tersedia",
      cmvTesting: "Belum dilakukan pengujian",
      pvtStatus: "Menunggu verifikasi dokumen",
      disclaimer:
        "Status pengujian laboratorium dan sertifikasi varietas hanya ditampilkan apabila dokumen resmi telah terverifikasi.",
    },
    careGuide:
      "Pindahkan stek berakar ke media tanam berdrainase baik segera setelah diterima. Jaga kelembapan awal di area ternaungi sebelum adaptasi cahaya bertahap.",
  },
  {
    slug: "FAB-POT-2026-OFF",
    active: false,
    varietyId: "fabiola",
    varietyName: "Fabiola",
    productType: "pot",
    productLabel: "Tanaman pot berbunga 12 cm",
    productionLocation: "Baturraden, Banyumas",
    qcDateLabel: "Nonaktif",
    shipDateLabel: "Nonaktif",
    updatedAtLabel: "17 Nov 2026",
    healthChecks: {
      visualInspection: "Belum tersedia",
      cmvTesting: "Belum dilakukan pengujian",
      pvtStatus: "Menunggu verifikasi dokumen",
      disclaimer: "Kode QR sedang dinonaktifkan.",
    },
    careGuide: "",
  },
];

export const orderPageContent = {
  meta: {
    title: "Pesan produk",
    description:
      "Formulir pratinjau permintaan tanaman pot 12 cm dan stek berakar Pacar Air Fabiola serta Claire dari UPSB Baturraden.",
  },
  badge: "Pratinjau formulir permintaan (mode demo)",
  title: "Minta produk UPSB",
  subtitle:
    "Ini permintaan pemesanan awal, bukan transaksi otomatis. Tim UPSB memeriksa jadwal produksi, ketersediaan, dan ongkos kirim sebelum menghubungi Anda lewat WhatsApp.",
  demoNotice:
    "Mode pratinjau demo proposal: permintaan yang Anda kirim disimpan di browser perangkat ini dan langsung dapat diperiksa pada halaman Demo Admin.",
  steps: {
    fill: "1. Isi permintaan",
    review: "2. Tinjau ringkasan",
  },
  notesAsideTitle: "Ketentuan permintaan",
  notesAsideList: [
    "Tidak ada pembayaran otomatis di website.",
    "Harga indikatif Rp11.000/pot dan Rp2.800/stek belum termasuk ongkos kirim dan dapat berubah.",
    "Pekan kebutuhan merupakan preferensi Anda, bukan jaminan tanggal kirim.",
    "Pesanan baru sah setelah disepakati langsung bersama admin lewat WhatsApp.",
  ],
  labels: {
    productType: "Jenis produk",
    varieties: "Pilih varietas (bisa satu atau dua)",
    quantity: "Jumlah permintaan",
    targetWeek: "Perkiraan pekan kebutuhan",
    weekHint: "Preferensi awal untuk membantu perencanaan jadwal produksi mingguan.",
    customerName: "Nama lengkap atau penanggung jawab",
    customerType: "Jenis pelanggan",
    whatsapp: "Nomor WhatsApp aktif",
    whatsappHint: "Contoh: 0812 3456 7890 atau +62812...",
    deliveryMethod: "Metode penerimaan",
    address: "Alamat pengiriman atau daerah tujuan",
    pickupAddressHint: "Isi kota/kecamatan asal Anda untuk catatan pengambilan di kebun Baturraden.",
    notes: "Catatan tambahan (opsional)",
    consentPrefix: "Saya menyetujui pengolahan data permintaan ini oleh UPSB sesuai ",
    consentLink: "Kebijakan Privasi",
    reviewCta: "Tinjau ringkasan",
    backToEdit: "Ubah isian",
    submitCta: "Kirim permintaan",
    newRequestCta: "Buat permintaan lain",
    toAdminCta: "Lihat di Demo Admin",
  },
  errors: {
    varieties: "Pilih minimal satu varietas (Fabiola atau Claire).",
    quantity: "Isi jumlah minimal 1 unit.",
    customerName: "Tulis nama lengkap minimal 2 karakter.",
    whatsapp: "Masukkan nomor WhatsApp Indonesia yang valid (mis. 0812 3456 7890).",
    address: "Lengkapi alamat atau kecamatan/kota tujuan minimal 8 karakter.",
    consent: "Centang persetujuan agar permintaan dapat ditindaklanjuti.",
  },
  success: {
    title: "Permintaan demo telah dicatat",
    body: "Permintaan tercatat dengan status Baru (NEW). Pada implementasi penuh M4–M5, data ini masuk ke database UPSB untuk ditinjau admin sebelum konfirmasi lewat WhatsApp.",
    disclaimer: "Belum ada pesanan yang terkonfirmasi. Anda dapat menguji tindak lanjutnya di halaman Demo Admin.",
  },
} as const;

export const partnershipPageContent = {
  meta: {
    title: "Ajukan kemitraan",
    description:
      "Formulir pengajuan awal kemitraan nursery, pembibitan, kios, dan distribusi Pacar Air Fabiola serta Claire bersama UPSB Baturraden.",
  },
  badge: "Pengajuan awal kemitraan (mode demo)",
  title: "Ajukan kemitraan UPSB",
  subtitle:
    "Sampaikan profil usaha dan minat kerja sama Anda. Pengajuan ini bersifat penjajakan awal dan belum merupakan persetujuan kemitraan atau hak perbanyakan.",
  demoNotice:
    "Mode pratinjau demo proposal: pengajuan disimpan sementara di browser Anda dan langsung tampil pada tab Kemitraan di Demo Admin.",
  rightsNote:
    "Catatan kepatuhan: penggunaan, perbanyakan, dan pengedaran varietas Fabiola serta Claire tetap bergantung pada persetujuan tertulis pemegang hak.",
  errors: {
    contactName: "Tulis nama penanggung jawab minimal 2 karakter.",
    businessName: "Tulis nama usaha atau organisasi minimal 2 karakter.",
    cityProvince: "Tulis kota/kabupaten dan provinsi lokasi usaha.",
    cooperationTypes: "Pilih minimal satu bentuk kerja sama yang diminati.",
    whatsapp: "Masukkan nomor WhatsApp Indonesia yang valid.",
    email: "Format email kurang tepat (kosongkan bila belum ada).",
    address: "Lengkapi alamat lokasi usaha minimal 8 karakter.",
    consent: "Centang persetujuan peninjauan pengajuan kemitraan.",
  },
  success: {
    title: "Pengajuan awal kemitraan dicatat",
    body: "Pengajuan tercatat dengan status Baru (NEW). Tim UPSB akan meninjau profil usaha terlebih dahulu sebelum menghubungi lewat WhatsApp.",
  },
} as const;

export const tracePageContent = {
  meta: {
    title: "Lacak batch QR",
    description:
      "Periksa informasi ketertelusuran batch produk Pacar Air Fabiola dan Claire tanpa menampilkan data pribadi pemesan.",
  },
  badge: "Rencana ketertelusuran batch (pratinjau)",
  title: "Lacak batch produk",
  subtitle:
    "Masukkan kode batch dari kemasan atau pilih salah satu contoh di bawah untuk melihat tampilan halaman QR publik `/trace/[slug]`.",
  searchPlaceholder: "Contoh: FAB-POT-2026-001",
  searchButton: "Buka halaman batch",
  privacyBoxTitle: "Prinsip privasi halaman QR",
  privacyBoxBody:
    "Halaman ketertelusuran publik tidak pernah menampilkan nama pemesan, nomor WhatsApp, alamat, maupun nilai transaksi. Pemeriksaan kesehatan dan PVT hanya tampil bila dokumennya sudah terverifikasi.",
  sampleTitle: "Contoh kode batch interaktif",
  detailTitlePrefix: "Informasi batch produk UPSB",
  disabledTitle: "Kode QR batch ini sedang tidak aktif",
  disabledBody:
    "Kode QR ini dinonaktifkan sementara oleh pengelola UPSB, misalnya karena pembaruan atau koreksi data kemasan. Hubungi UPSB lewat WhatsApp dengan menyebutkan kode yang tertera pada kemasan.",
  notFoundTitle: "Kode batch tidak ditemukan di contoh demo",
  notFoundBody:
    "Kode batch yang Anda masukkan belum terdaftar pada kumpulan data contoh demo proposal ini. Anda dapat memilih salah satu kode contoh di bawah atau menghubungi tim UPSB.",
} as const;

export const adminPageContent = {
  meta: {
    title: "Demo dashboard admin",
    description:
      "Pratinjau antarmuka pengelolaan permintaan produk, pengajuan kemitraan, dan batch QR untuk tim UPSB.",
  },
  badge: "Pratinjau antarmuka internal (tanpa login DB produksi)",
  title: "Dashboard admin (Demo)",
  subtitle:
    "Simulasi cara admin UPSB meninjau permintaan masuk, memperbarui status 12 tahap, menyiapkan pesan WhatsApp manual, dan memantau pengajuan mitra serta batch QR.",
  authNotice:
    "Catatan keamanan: pada sistem penuh M5, halaman /admin dilindungi autentikasi dan hak akses berbasis peran (RBAC). Di mode demo proposal ini, perubahan status hanya tersimpan di browser Anda.",
} as const;
