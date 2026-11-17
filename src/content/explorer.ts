/** Teks antarmuka pengalaman Jelajah Bunga 3D & cadangan 2D (PRD §3, §5, §6.1). */
export const explorerStrings = {
  meta: {
    title: "Jelajah bunga 3D",
    description:
      "Jelajahi anatomi ilustratif Pacar Air Fabiola dan Claire (mahkota, taji, benang sari, putik, kapsul, daun, batang, dan akar) secara interaktif 3D atau diagram 2D.",
  },
  title: "Jelajah bunga",
  subtitle: "Sentuh bagian bunga atau pilih tombol bagian di bawah untuk membaca penjelasan botani umum.",
  illustrativeBanner: "Ilustrasi, bukan foto tanaman UPSB",
  stagingSourceNote: "Botani umum, perlu verifikasi",
  verifiedSourceNote: "Terverifikasi tim UPSB",
  productionUnverifiedNotice:
    "Penjelasan bagian botani menunggu verifikasi tim UPSB sebelum dipublikasikan pada lingkungan produksi.",
  canvasDescription:
    "Ilustrasi interaktif bunga Pacar Air (Impatiens) dengan delapan bagian yang dapat diputar, diperbesar, dan diketuk. Gunakan daftar tombol bagian bunga sebagai alternatif keyboard penuh.",
  controls: {
    varietyLegend: "Varietas ilustrasi",
    switchTo2D: "Tampilan 2D",
    switchTo3D: "Tampilan 3D",
    resetView: "Atur ulang sudut",
    exploreAll: "Jelajahi semua bagian",
    partsHeading: "Bagian bunga",
    previousPart: "Sebelumnya",
    nextPart: "Berikutnya",
    expandSheet: "Perluas panel",
    collapseSheet: "Ringkas panel",
    closeSheet: "Tutup info",
  },
  fallbackNotice: {
    nowebgl: "Perangkat atau peramban tidak mengaktifkan WebGL. Menampilkan diagram interaktif 2D dengan informasi yang sama.",
    lowmem: "Memori perangkat terbatas. Menampilkan diagram interaktif 2D agar halaman tetap ringan.",
    savedata: "Mode hemat data aktif. Menampilkan diagram interaktif 2D dengan informasi yang sama.",
    error: "Tampilan 3D gagal dimuat. Menampilkan diagram interaktif 2D sebagai cadangan.",
    manual: "Mode diagram 2D aktif.",
  },
  heroHint: "Putar atau ketuk penanda pada bunga, atau buka halaman jelajah penuh.",
} as const;
