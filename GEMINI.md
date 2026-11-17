# UPSB Digital Ecosystem

Website pemesanan, kemitraan, dan ketertelusuran QR untuk Pacar Air Fabiola & Claire (Unit Produksi Stek Berakar, Baturraden, Banyumas), dengan pengalaman bunga 3D interaktif. Bahasa antarmuka: Indonesia.

## Sumber kebenaran
- Kebutuhan: `PRD-UPSB-v2.0-Web-Experience.md` (memperluas PRD v1.0). Jika ada konflik, v2.0 menang pada visual dan 3D, v1.0 menang pada aturan bisnis.
- Token desain: `data/design-tokens.json`. Konten bunga: `data/flower-hotspots.json`. Jangan menulis ulang isinya di dalam kode.
- Prototipe visual: `upsb-prototype-reference.html` hanya rujukan arah, bukan basis kode.

## Stack
Next.js (App Router) + TypeScript, Tailwind dengan variabel CSS dari token, three + @react-three/fiber + drei (dimuat lazy), PostgreSQL + Prisma, Vitest + Playwright + axe.

## Cara kerja
- Kerjakan **satu milestone (M0-M7) per sesi**, berurutan, sesuai bagian 14 PRD. Mulai dengan rencana singkat, tunggu persetujuan, lalu bangun.
- Selesai bila kriteria milestone lulus dan diuji. Jangan mengklaim selesai tanpa menjalankan tes dan melampirkan hasilnya.
- Jangan menambah fitur di luar milestone. Out of scope MVP: pembayaran, akun pelanggan, WhatsApp API, aplikasi native, chatbot.

## Aturan keras (detail di `.agents/rules/`)
1. Desain: berpola super-app, identitas sendiri. Pink bunga utama, hijau daun aksen kecil. Skala spasi 4 px dari token. Jangan menyalin aset, font, ikon, atau warna merek lain.
2. Anti-slop: tanpa emoji sebagai ikon, tanpa gradasi dekoratif, tanpa label kapital berjarak, tanpa animasi masuk di tiap bagian.
3. 3D: ilustrasi berlabel, selalu ada cadangan 2D dan jalur keyboard, patuhi anggaran performa.
4. Klaim: dilarang "bebas virus", janji stok/tanggal, nomor PVT tanpa verifikasi, logo BRIN. Konten botani berstatus `verified:false` tidak boleh dipublikasikan di produksi.
5. Formulir hanya mencatat permintaan. Tidak ada pesanan terkonfirmasi otomatis. Data pelanggan tidak pernah muncul di halaman publik atau event analitik.
6. Semua teks pengguna lewat berkas konten, bukan hardcode tersebar. Nomor WhatsApp, harga, kontak diambil dari `SiteSetting`.
