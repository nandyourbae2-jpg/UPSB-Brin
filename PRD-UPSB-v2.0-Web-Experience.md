# PRD v2.0: UPSB Digital Ecosystem, Web Experience

**Produk:** Website pemesanan, kemitraan, dan ketertelusuran produk Pacar Air Fabiola & Claire, dengan pengalaman bunga 3D interaktif.
**Versi:** 2.0 (draft untuk pengembangan) | **Tanggal:** 17 November 2026
**Konteks:** Youth Innovation-to-Market Challenge (YIMC) 2026, teknologi BRIN YIM_013
**Hubungan dengan PRD v1.0:** v2.0 **memperluas** v1.0. Semua kebutuhan v1.0 tetap berlaku kecuali yang disebut di bagian 1.3. Dokumen ini menambahkan: (a) pengalaman bunga 3D, (b) design system berpola super-app, (c) penutupan kekurangan hasil audit prototipe, (d) rencana kerja untuk Google Antigravity.

> **Catatan status dan akurasi (wajib, diwarisi dari v1.0):** Sistem ini direncanakan. Website, dashboard, QR, operasional UPSB, dan lisensi tidak boleh digambarkan sudah berjalan sebelum benar-benar tersedia. Penggunaan varietas Fabiola dan Claire bergantung pada persetujuan tertulis pemegang hak. Informasi kesehatan tanaman hanya boleh menyatakan hasil pemeriksaan yang berbukti. Sertifikat PVT bukan sertifikat bebas virus. Model 3D adalah ilustrasi, bukan foto tanaman UPSB.

---

## 1. Ringkasan dan Perubahan dari v1.0

### 1.1 Ide inti
Pengunjung tidak hanya membaca katalog. Mereka **memutar bunga 3D, menyentuh bagiannya, dan membaca penjelasannya**: mahkota, taji, benang sari, putik, kapsul, daun, batang, akar. Dari bagian akar dan batang, pengunjung diarahkan ke produk stek berakar. Dari pengalaman itu mereka masuk ke alur pesan atau kemitraan yang sudah ada di v1.0.

### 1.2 Sasaran v2.0
1. Membuat pengalaman 3D yang ringan, akurat secara botani, dan tetap berguna tanpa WebGL.
2. Menerapkan design system berpola super-app (struktur, ritme, komponen) dengan identitas UPSB sendiri.
3. Menutup seluruh kekurangan hasil audit prototipe (bagian 2).
4. Menjaga semua batasan klaim v1.0 bagian 2.3.
5. Menyediakan paket instruksi yang bisa dijalankan Antigravity bertahap dan dapat diuji.

### 1.3 Perubahan terhadap v1.0
| Bagian v1.0 | Perubahan di v2.0 |
|---|---|
| 11.1 Arah visual (hijau/putih) | **Diganti:** warna utama pink bunga pacar air. Hijau daun hanya aksen pendamping. |
| 5.3 Struktur beranda | **Diperluas:** hero berisi pengalaman 3D dan grid layanan gaya super-app. |
| 5.1 Sitemap (hash route di prototipe) | **Dipertegas:** wajib route nyata dengan slug (lihat bagian 9). |
| 3.2 Out of scope | **Tetap.** Pembayaran, akun pelanggan, WhatsApp API tetap di luar MVP. |

---

## 2. Hasil Audit Prototipe (Backlog Penutupan)

Prototipe HTML tunggal sudah merender di ponsel 390 px dan desktop 1280 px tanpa error script. Kekurangannya menjadi backlog berikut. Kolom ID dipakai di bagian 14.

### 2.1 Bug tampilan
| ID | Temuan | Perbaikan |
|---|---|---|
| FIX-01 | Label hero memanjang penuh di desktop | Label selebar kontennya (`align-self:flex-start`) |
| FIX-02 | Bunga hero terpotong, terbaca seperti gumpalan | Diganti scene 3D utuh (bagian 5) dengan poster statis sebagai cadangan |
| FIX-03 | Ikon "Pot 12 cm" mirip kotak hadiah, "Varietas" memakai pin | Set ikon baru satu keluarga (garis 1.8 px) dengan makna benar |
| FIX-04 | Bilah ringkasan menutup teks bantuan di formulir | Beri `scroll-padding-bottom` dan ruang bawah setara tinggi bilah |
| FIX-05 | Pekan kebutuhan memakai tanggal tetap | Hitung dari tanggal server hari ini (zona waktu Asia/Jakarta) |
| FIX-06 | Lembar detail tanpa fokus terkunci dan tanpa pengembalian fokus | Focus trap, `aria-modal`, kembalikan fokus ke pemicu, tutup dengan Esc |
| FIX-07 | Error formulir tidak dibacakan pembaca layar | `aria-live="polite"`, `aria-describedby`, `aria-invalid` |

### 2.2 Kekurangan terhadap v1.0
| ID | Area | Kekurangan |
|---|---|---|
| GAP-PUB-01 | Publik | Halaman Tentang UPSB (PUB-04) |
| GAP-PUB-02 | Publik | Halaman katalog, detail varietas, filter (PUB-05/06/08) |
| GAP-PUB-03 | Publik | Halaman Kontak (PUB-10), Kebijakan Privasi dan Syarat (PUB-11) |
| GAP-PUB-04 | Publik | SEO dan route nyata (PUB-12), halaman gangguan (7.4), 404 |
| GAP-FRM-01 | Pemesanan | Nama usaha, email, metode penerimaan, catatan, dua varietas sekaligus |
| GAP-FRM-02 | Pemesanan | Langkah tinjau ringkasan sebelum kirim (6.2.3 poin 2) |
| GAP-FRM-03 | Pemesanan | Kondisi gagal simpan (6.2.3 poin 9), tombol WhatsApp di halaman sukses |
| GAP-FRM-04 | Kemitraan | 8 dari 13 kolom belum ada (email, alamat usaha, lama usaha, varietas, estimasi, kapasitas, profil, dst.) |
| GAP-ADM-01 | Admin | Login dan RBAC |
| GAP-ADM-02 | Admin | Pencarian, filter produk/varietas/tanggal, pengurutan, ekspor CSV/XLSX |
| GAP-ADM-03 | Admin | Daftar dan detail pengajuan kemitraan |
| GAP-ADM-04 | Admin | Manajemen katalog (harga indikatif, status ketersediaan) |
| GAP-ADM-05 | Admin | Modul batch: buat, pratinjau, unduh QR (PNG/SVG), aktif/nonaktif |
| GAP-ADM-06 | Admin | Dokumen: PVT dan kesehatan sebagai kategori terpisah, penanda boleh tampil publik |
| GAP-ADM-07 | Admin | Riwayat perubahan status (siapa, kapan), audit log, laporan, feed aktivitas |
| GAP-ADM-08 | Admin | Ringkasan baru 4 dari 8 angka (6.5.1) |
| GAP-ANA-01 | Analitik | 11 event bagian 12 v1.0 belum dipasang |
| GAP-INF-01 | Infrastruktur | Backend, database, penyimpanan file, pembuat QR, HTTPS, backup |

### 2.3 Risiko klaim yang harus diputuskan sebelum tayang
| ID | Risiko | Keputusan yang dibutuhkan |
|---|---|---|
| CLM-01 | Panduan perawatan dan FAQ pada prototipe ditulis pembuat prototipe, bukan dari sumber UPSB | Tim UPSB menyetujui atau mengganti teks |
| CLM-02 | Headline "berbunga lebat" berlaku untuk kedua varietas, sedangkan sifat itu terkait Fabiola | Pilih headline yang tidak melebih-lebihkan |
| CLM-03 | Ringkasan estimasi total harga dapat terbaca sebagai janji | Admin dapat mengganti estimasi menjadi "hubungi admin" |
| CLM-04 | Teks bagian 3D adalah botani umum, bukan data Fabiola/Claire | Tinjauan tim, label "ilustrasi dan botani umum" |

---

## 3. Konsep Pengalaman: "Jelajah Bunga"

### 3.1 Prinsip
- **Bunga adalah bintangnya.** Satu elemen yang diingat orang adalah bunga 3D. Elemen lain tenang dan disiplin.
- **Sentuh untuk belajar.** Setiap bagian bisa diketuk dan membuka penjelasan singkat.
- **Informasi lebih penting dari efek.** Bila 3D tidak bisa dimuat, isi yang sama tetap tersedia lewat diagram 2D dan daftar bagian.
- **Jujur.** Model ilustratif diberi label. Tidak ada klaim kesehatan atau lisensi di bagian ini.

### 3.2 Titik masuk
1. **Hero beranda:** scene 3D ringkas dengan 3 penanda berdenyut. Ketuk membuka lembar info. Tombol "Jelajahi semua bagian" menuju `/jelajah`.
2. **Halaman `/jelajah`:** layar penuh dengan 8 bagian, pemilih varietas (Fabiola/Claire), dan daftar bagian.
3. **Detail varietas `/produk/fabiola` dan `/produk/claire`:** pratinjau 3D kecil yang menyorot ciri varietas dari materi YIM_013.

### 3.3 Alur utama
```
Beranda → hero 3D → ketuk "Taji" → lembar info → "Bagian berikutnya"
        → "Jelajahi semua bagian" → /jelajah → pilih "Akar"
        → CTA "Minta stek berakar" → /pesan?produk=stek (prefill)
```

---

## 4. Design System (berpola super-app, identitas sendiri)

### 4.1 Rujukan dan batasannya (jujur)
- Rujukan publik: Gojek **Asphalt** (dokumentasi di asphalt.gojek.io). Yang terdokumentasi: sistem berbasis token untuk warna, tipografi, spasi, bayangan, motion; skala spasi **basis 4 px**; prinsip bahwa jarak membentuk relasi dan hierarki; ruang kosong disengaja; tujuan kepatuhan WCAG.
- Yang **tidak** tersedia publik dan **tidak boleh disalin**: nilai ukuran piksel aplikasi, font milik Gojek, ikon, ilustrasi, logo, warna merek hijau, dan salinan layar.
- Jadi "sama" di sini berarti **struktur, ritme, pola interaksi, dan disiplin token** yang sama. Angka dan aset adalah milik UPSB. Semua nilai ada di `data/design-tokens.json`. Hanya skala 4 px yang berasal dari prinsip Asphalt. Nilai lain adalah keputusan desain dokumen ini.
- Jangan memakai logo BRIN atau identitas institusi lain tanpa izin (v1.0 bagian 2.3).

### 4.2 Pola struktur yang diadopsi
| Pola | Penerapan di UPSB |
|---|---|
| Bilah atas dengan identitas dan lokasi | Logo bunga + "UPSB, Baturraden, Banyumas" |
| Kolom pencarian berbentuk pil | "Butuh pot atau stek untuk pekan berapa?" membuka `/pesan` |
| Banner utama | Hero 3D dengan dua CTA |
| Grid layanan 4 kolom, 2 baris | Pot 12 cm, Stek berakar, Kemitraan, Lacak batch, Harga, Cara pesan, Varietas, Tanya jawab |
| Rel horizontal dengan judul dan "Lihat semua" | Promo informasi, varietas, produk |
| Navigasi tab bawah (ponsel) / bar atas (desktop) | Beranda, Pesan, Kemitraan, Lacak, Admin (Admin hanya terlihat peran internal) |
| Lembar bawah (bottom sheet) | Info bagian bunga, detail permintaan admin, filter |
| CTA menempel di bawah | Ringkasan pesanan di formulir |
| Skeleton saat memuat, status vakum yang mengajak bertindak | Semua daftar dan 3D |

### 4.3 Token (ringkas, rinci di JSON)
- **Spasi:** 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Semua margin, padding, dan gap memakai token, tidak ada angka bebas.
- **Layout ponsel:** padding layar 16, jarak antarbagian 24, gap ubin 12, target sentuh minimum 48, tab bawah 64 + safe area.
- **Radius:** 4, 8, 12, 16, 24, pil. Radius **berjenjang menurut peran**, bukan satu radius untuk semua.
- **Warna:** pink bunga `#D6246E` (utama), `#C21660` (hero), tint `#FFE3EE`, hijau daun `#1F6B4A` aksen kecil, ink `#2B1420`. Mode gelap tersedia. Kontras teks minimal 4.5:1, teks besar 3:1.
- **Tipografi:** Plus Jakarta Sans (lisensi OFL), 7 tingkat, sentence case.
- **Bayangan:** 3 level, berwarna pink-gelap lembut, bukan abu generik.
- **Motion:** 120/200/320 ms, terbang kamera 600 ms, patuhi `prefers-reduced-motion`.

### 4.4 Aturan anti-slop (wajib)
1. Tidak ada emoji sebagai ikon. Satu set ikon garis, satu keluarga.
2. Tidak ada gradasi dekoratif, tidak ada "kartu identik semua dengan bayangan abu yang sama".
3. Tidak ada label huruf kapital berjarak di atas judul. Tidak ada angka urut kecuali isinya memang urutan.
4. Tidak menonjolkan satu kata dalam judul dengan warna lain.
5. Tidak ada animasi masuk di setiap bagian. Animasi otomatis hanya satu: bunga 3D mekar saat pertama dibuka. Animasi lain merespons tindakan pengguna.
6. Teks menjelaskan fungsi, bukan menjual. Tombol menyebut tindakan ("Kirim permintaan"), nama tindakan konsisten dari tombol sampai notifikasi.
7. Error menjelaskan masalah dan cara memperbaiki, tidak meminta maaf, tidak samar.
8. Foto asli lebih utama dari ilustrasi. Sampai foto berizin tersedia, pakai placeholder yang jelas bertanda.

### 4.5 Komponen yang harus ada
`AppShell`, `TopBar`, `BottomTabs`, `SearchPill`, `HeroBanner`, `ServiceGrid` + `ServiceTile`, `Rail` + `RailHeader`, `Card`, `StatusPill`, `Button` (utama, sekunder, garis, kecil), `SegmentedControl`, `Chip`, `Stepper`, `TextField`, `Select`, `Textarea`, `Checkbox`, `FieldError`, `BottomSheet`, `Dialog`, `Toast`, `Skeleton`, `EmptyState`, `StickyCtaBar`, `Timeline`, `DataTable` (admin), `FilterBar`, `FlowerCanvas`, `HotspotPin`, `PartInfoSheet`, `PartChips`.

---

## 5. Spesifikasi 3D

### 5.1 Teknologi
three.js dengan React Three Fiber dan drei, dimuat **malas** (lazy) hanya di route yang memakainya. Model v1 **prosedural** (dibuat dari geometri dalam kode) agar tidak menunggu aset. Model v2 diganti GLB bikinan modeler dengan nama mesh sama.

### 5.2 Anatomi dan penamaan mesh (kontrak antara 3D dan data)
| Hotspot | Nama mesh | Keterangan |
|---|---|---|
| mahkota | `petal_upper`, `petal_wing_l`, `petal_wing_r` | Satu kelopak atas, dua sayap samping (pasangan menyatu) |
| taji | `sepal_spur`, `sepal_lateral_l`, `sepal_lateral_r` | Sepal bertaji dan dua sepal samping kecil |
| benangsari | `anthers_cap` | Tudung kepala sari |
| putik | `pistil_ovary` | Putik dan bakal buah |
| kapsul | `capsule` | Buah, tampil di tangkai terpisah |
| daun | `leaf_a`, `leaf_b`, `leaf_c` | Daun |
| batang | `stem`, `node_a`, `node_b` | Batang dan ruas |
| akar | `root_a`, `root_b`, `root_c` | Akar (stek berakar) |

Isi teks tiap bagian ada di `data/flower-hotspots.json`, bukan di dalam kode 3D. Mesh hanya membawa `id` bagian.

### 5.3 Interaksi
- **Putar:** seret satu jari/mouse. **Zoom:** cubit/gulir dengan batas jarak min-maks. **Geser:** dinonaktifkan (cegah tersesat).
- **Putar otomatis pelan** saat diam, **berhenti permanen** begitu pengguna menyentuh.
- **Ketuk bagian:** bagian menyala (kontur/emisi), kamera terbang ke sudut yang ditentukan `camera` pada data (600 ms), `PartInfoSheet` terbuka.
- **Penanda (`HotspotPin`):** titik berdenyut dengan label teks. Maksimum 3 terlihat sekaligus di hero, 8 di `/jelajah`. Penanda tersembunyi bila terhalang bagian lain.
- **Lembar info:** ponsel = bottom sheet 40% tinggi, bisa ditarik ke 85%. Desktop = panel kanan 360 px. Isi: judul, nama latin, ringkasan satu kalimat, detail, label sumber ("Botani umum, perlu verifikasi" sampai terverifikasi), CTA bila ada, tombol "Sebelumnya/Berikutnya".
- **Pemilih varietas:** Fabiola atau Claire mengubah warna dan proporsi ilustrasi (Fabiola lebih banyak tunas dan cabang, Claire kelopak lebih besar). Diberi label "Ilustrasi".
- **Tahap hidup (Should):** penggeser Kuncup → Mekar → Fase jantan → Fase betina → Kapsul. Hanya mengubah tampilan model, teks mengacu data botani umum.
- **Tampilan terurai (Could):** bagian bunga bergeser terpisah.

### 5.4 Cadangan dan aksesibilitas
- **Tanpa WebGL / memori rendah / Save-Data:** tampilkan diagram SVG 2D bunga dengan hotspot yang sama dan konten sama. Jangan pernah menampilkan area kosong.
- **`prefers-reduced-motion`:** tanpa putar otomatis, tanpa terbang kamera (pindah instan), tanpa denyut.
- **Keyboard dan pembaca layar:** canvas ditandai `role="img"` dengan deskripsi. **Daftar bagian (`PartChips`) adalah alternatif penuh:** tiap chip adalah tombol yang membuka info yang sama. Fokus dikelola saat lembar terbuka/tutup.
- **Teks penting tidak ditanam di tekstur atau gambar.**

### 5.5 Anggaran performa
| Metrik | Batas |
|---|---|
| JS awal route beranda (tanpa 3D) | ≤ 180 KB gzip |
| Potongan 3D (lazy) | ≤ 500 KB gzip |
| GLB v2 | ≤ 600 KB (Draco/meshopt), tekstur total ≤ 1 MB (KTX2/WebP) |
| LCP beranda, 4G, Android menengah | ≤ 2.5 s (poster statis jadi LCP, 3D dimuat setelahnya) |
| CLS | < 0.1 |
| INP | < 200 ms |
| Frame rate | target 60 fps, minimum 30 fps pada perangkat menengah |
| DPR | maks 2 (1.5 bila perangkat lemah), turunkan otomatis bila fps jatuh |
| Draw call | ≤ 60, instancing untuk kelopak dan daun bila perlu |

### 5.6 Konten bagian bunga
Delapan bagian dengan teks lengkap ada di `data/flower-hotspots.json`. Ringkasan:
| Bagian | Inti informasi | Sumber |
|---|---|---|
| Mahkota | Lima kelopak, empat samping menyatu berpasangan sehingga tampak bersayap tiga | Botani umum |
| Sepal bertaji | Satu sepal membentuk taji berisi nektar | Botani umum |
| Benang sari | Lima benang sari, kepala sari menyatu jadi tudung, serbuk sari lebih dulu dilepas | Botani umum |
| Putik dan bakal buah | Reseptif setelah tudung gugur (protandri), bakal buah lima ruang | Botani umum |
| Buah kapsul | Pecah meletup melontarkan biji, julukan touch-me-not | Botani umum |
| Daun | Tunggal, tepi bergerigi halus, susunan beragam | Botani umum |
| Batang dan ruas | Lunak berair, ruas titik tumbuh, dasar perbanyakan stek | Botani umum |
| Akar | Stek berakar untuk mitra nursery, CTA ke pemesanan stek | Botani umum + rencana UPSB (perlu konfirmasi) |

Ciri varietas dari materi YIM_013: **Fabiola** rimbun, percabangan sekunder, tunas dan bunga tinggi. **Claire** bunga besar, mekar serempak. Wajib disertai catatan bahwa adaptasi dataran rendah masih perlu uji lokal.
Rujukan botani yang dipakai: Caris et al. 2006, *American Journal of Botany* 93(1):1-14; ringkasan morfologi genus *Impatiens*.

---

## 6. Kebutuhan Fungsional Baru (v2.0)

Prioritas: Must / Should / Could.

### 6.1 Pengalaman 3D
| ID | Prio | Kebutuhan | Kriteria penerimaan |
|---|---|---|---|
| XP-01 | Must | Scene 3D di hero beranda | Bunga tampil utuh, mekar sekali saat pertama, poster statis tampil lebih dulu |
| XP-02 | Must | Hotspot 8 bagian dapat diketuk | Ketuk membuka lembar dengan isi dari data JSON yang benar |
| XP-03 | Must | Putar dan zoom dengan batas | Tidak bisa zoom terlalu jauh/dekat, tidak bisa tersesat |
| XP-04 | Must | Cadangan tanpa WebGL | Diagram 2D dengan hotspot dan konten sama |
| XP-05 | Must | Aksesibilitas | Seluruh info dapat dijangkau lewat keyboard dan `PartChips` |
| XP-06 | Must | Label ilustrasi | Setiap tampilan 3D menandai "Ilustrasi, bukan foto tanaman UPSB" |
| XP-07 | Must | Halaman `/jelajah` | Layar penuh, daftar bagian, pemilih varietas |
| XP-08 | Should | Pratinjau 3D di detail varietas | Menyorot ciri varietas bersumber materi YIM_013 |
| XP-09 | Should | Tahap hidup bunga | Penggeser mengubah model dan teks tahap |
| XP-10 | Should | CTA konteks | Bagian akar dan batang mengarah ke `/pesan?produk=stek` dengan prefill |
| XP-11 | Could | Tampilan terurai | Bagian bergeser terpisah |
| XP-12 | Could | Berbagi bagian | Tautan `/jelajah#taji` membuka bagian itu |
| XP-13 | Should | Konten bagian dikelola admin | Teks, sumber, dan status verifikasi dapat diubah tanpa kode |

### 6.2 Penutupan kekurangan v1.0
Seluruh GAP-* pada bagian 2.2 berstatus **Must** kecuali: GAP-PUB-02 filter katalog (Should), GAP-ADM-07 laporan (Could), GAP-ANA-01 (Should).

---

## 7. Spesifikasi Layar

Semua layar mobile-first (390 px), lalu lebar (700, 900, 1280). Spasi memakai token.

| Layar | Isi dan perilaku |
|---|---|
| **Beranda** `/` | TopBar, SearchPill, Hero 3D (tinggi ±60% layar ponsel), ServiceGrid 8 ubin, rel promo informasi, rel varietas, harga indikatif, cara pesan (urutan nyata, boleh bernomor), FAQ ringkas, footer pernyataan akurasi |
| **Jelajah** `/jelajah` | Canvas layar penuh, `PartChips` di bawah (ponsel) atau kiri (desktop), pemilih varietas, lembar info |
| **Katalog** `/produk` | Dua kategori (pot 12 cm, stek berakar), filter jenis dan varietas, kartu produk dengan status ketersediaan dan harga indikatif |
| **Detail varietas** `/produk/{slug}` | Pratinjau 3D kecil, ciri dari materi YIM_013, catatan validasi lokal, CTA pesan |
| **Pesan** `/pesan` | Formulir bertahap: produk, varietas (satu atau dua), jumlah, pekan, data pemesan, alamat, metode penerimaan, catatan, persetujuan privasi (tautan ke kebijakan), **tinjau ringkasan**, kirim. Sukses: nomor `ORD-…`, status `NEW`, tombol WhatsApp opsional. Gagal: pesan jelas, data tidak diklaim tersimpan |
| **Kemitraan** `/kemitraan` | 13 kolom v1.0 bagian 6.3.2, status awal `NEW`, nomor `PRT-…` |
| **Lacak** `/trace/{slug}` | Halaman batch publik sesuai v1.0 bagian 6.6.4, status uji sesuai 6.6.6, keadaan QR nonaktif sesuai AC-11. Tanpa data pelanggan |
| **Tentang, Cara pesan, FAQ, Kontak, Privasi, Syarat** | Konten statis yang dikelola admin |
| **Gangguan, 404** | Ramah pengguna, tombol WhatsApp resmi tetap tampil |
| **Admin** `/admin/*` | Login, dashboard (8 angka v1.0 6.5.1), pesanan (cari, filter, urut, detail, ubah status + catatan + riwayat, WhatsApp handoff, ekspor), kemitraan, katalog, batch (buat/edit/pratinjau QR/unduh/nonaktifkan), dokumen, hotspot bunga, pengguna dan peran, laporan/ekspor, audit log, pengaturan |

---

## 8. Model Data (tambahan terhadap v1.0 bagian 9)

Entitas v1.0 tetap. Tambahan:

| Entitas | Field utama |
|---|---|
| `FlowerPart` | id (slug), order, title, latin, summary, detail, meshNames[], camera{position,target}, source, verified (bool), verifiedBy, verifiedAt, cta{label,href}, published (bool) |
| `VarietyProfile` | id, name, traits[], caveat, source, verified, photoAssetId (nullable) |
| `MediaAsset` | id, type (foto/model/dokumen), url, altText, licenseNote, approvedForPublic (bool) |
| `SiteSetting` | key, value (nomor WhatsApp, kontak, harga tampil/sembunyi, estimasi total tampil/sembunyi) |
| `StatusHistory` | entityType, entityId, from, to, changedBy, changedAt, note |

Aturan: bagian bunga dengan `verified=false` tampil dengan label "perlu verifikasi" di lingkungan staging dan **tidak boleh `published` di produksi** sebelum `verified=true`.

---

## 9. Route dan SEO

Route nyata, bukan hash: `/`, `/jelajah`, `/produk`, `/produk/fabiola`, `/produk/claire`, `/pesan`, `/kemitraan`, `/trace/{slug}`, `/tentang`, `/cara-pemesanan`, `/faq`, `/kontak`, `/privasi`, `/syarat`, `/admin/...`.
Setiap halaman publik punya `title`, `meta description`, slug, Open Graph, dan `alt` gambar. Halaman `/trace/*` dan `/admin/*` bertanda `noindex`. Slug batch tidak berurutan sederhana (v1.0 bagian 6.6.3).

---

## 10. Kebutuhan Non-Fungsional

- **Kinerja:** bagian 5.5.
- **Aksesibilitas:** WCAG 2.2 AA. Fokus terlihat, label pada semua input, target sentuh ≥ 48 px, tombol bukan hanya ikon, kontras sesuai 4.3, urutan fokus logis, tidak ada teks penting hanya di gambar.
- **Responsif:** 390, 700, 900, 1280 tanpa gulir ke samping.
- **Keamanan:** HTTPS, hash kata sandi kuat, sesi aman, proteksi CSRF, validasi di server, pembatasan laju pada formulir publik, tidak ada data pribadi di halaman publik atau di event analitik, unggahan file divalidasi tipe dan ukuran.
- **Privasi:** persetujuan eksplisit, kebijakan retensi, akses data sesuai peran (v1.0 bagian 10.3-10.4).
- **Keandalan:** backup database terjadwal, halaman gangguan, penerimaan manual `MANUAL_WHATSAPP` (v1.0 bagian 7.4).
- **i18n:** Bahasa Indonesia utama. Struktur teks disiapkan agar bahasa Inggris bisa ditambah (Could).

---

## 11. Arsitektur dan Teknologi (rekomendasi, bisa diganti dengan alasan)

| Lapisan | Pilihan |
|---|---|
| Aplikasi | Next.js (App Router) + TypeScript |
| Gaya | Tailwind dengan token dari `data/design-tokens.json` dijadikan variabel CSS |
| 3D | three + @react-three/fiber + @react-three/drei, dimuat dengan `dynamic import` |
| Basis data | PostgreSQL + Prisma |
| Autentikasi | Auth.js/NextAuth atau setara, RBAC 6 peran v1.0 bagian 4.2 |
| Penyimpanan file | Penyimpanan objek (S3 kompatibel) untuk foto, dokumen, QR |
| QR | Pustaka pembuat QR sisi server, keluaran PNG dan SVG |
| Ekspor | CSV dan XLSX sisi server |
| Pengujian | Vitest, Playwright (alur utama + tangkapan layar 4 lebar), axe untuk aksesibilitas |
| Penyebaran | HTTPS, lingkungan staging dan produksi terpisah, migrasi skema berversi |

Keputusan terbuka: penyedia hosting, penyedia penyimpanan, layanan email notifikasi (v1.0 bagian 13).

---

## 12. Analitik (tambahan terhadap v1.0 bagian 12)

Tanpa data pribadi dalam event.
| Event | Pemicu | Properti |
|---|---|---|
| `view_explorer` | `/jelajah` dibuka | entry (hero/jelajah/varietas) |
| `tap_flower_part` | Bagian diketuk | partId, input (touch/mouse/keyboard) |
| `change_variety_3d` | Pilihan varietas diubah | variety |
| `cta_from_part` | CTA di lembar bagian diklik | partId |
| `fallback_2d_shown` | Cadangan 2D tampil | reason (nowebgl/lowmem/savedata/error) |
| `fps_degrade` | Kualitas diturunkan otomatis | level |

Ditambah 11 event v1.0.

---

## 13. Tata Kelola Konten dan Klaim

Daftar larangan berikut berlaku untuk semua teks, termasuk metadata dan alt:
1. "Bebas virus" dan "terindeks virus" tanpa dokumen uji berlingkup dan bertanggal.
2. Menyimpulkan bebas semua virus dari satu uji CMV.
3. Nomor sertifikat PVT sebelum dipetakan ke varietas dan diverifikasi. PVT bukan bukti kesehatan.
4. Janji stok, tanggal kirim, atau persetujuan kemitraan.
5. Logo atau afiliasi BRIN/institusi lain tanpa izin.
6. Adaptasi dataran rendah sebagai jaminan. Harus berbunyi "arah seleksi yang masih divalidasi uji lokal".
7. Foto atau model digambarkan sebagai tanaman UPSB nyata bila bukan.

Register persetujuan: setiap blok konten publik punya pemilik, tanggal tinjau, dan status `verified`.

---

## 14. Rencana Kerja Bertahap untuk Antigravity

Setiap milestone selesai bila kriteria lulus dan diuji. Jalankan berurutan. Satu milestone per sesi agen.

| M | Isi | Kriteria selesai |
|---|---|---|
| **M0** | Fondasi: repo, token dari JSON ke CSS, font, AppShell, TopBar, BottomTabs, komponen dasar, mode gelap | Halaman contoh merender di 4 lebar, lint dan tipe bersih, kontras lulus |
| **M1** | Halaman publik statis + SEO + route nyata: beranda (tanpa 3D), tentang, cara pesan, FAQ, kontak, privasi, syarat, gangguan, 404 (FIX-01/03, GAP-PUB-01/03/04) | Lighthouse a11y ≥ 95, tidak ada gulir ke samping |
| **M2** | Katalog dan detail varietas, filter (GAP-PUB-02) | AC-01 lulus |
| **M3** | **Pengalaman 3D:** FlowerCanvas prosedural, 8 hotspot, lembar info, `/jelajah`, hero 3D, cadangan 2D, anggaran performa (XP-01 sampai XP-07, FIX-02) | Semua XP Must lulus, anggaran bagian 5.5 terpenuhi, keyboard-only dapat membuka 8 bagian |
| **M4** | Formulir pemesanan dan kemitraan lengkap + backend + database + nomor unik (GAP-FRM-01..04, FIX-04..07) | AC-02, AC-03, AC-07 lulus, validasi server |
| **M5** | Admin: login, RBAC, dashboard, daftar/detail pesanan dan kemitraan, riwayat status, WhatsApp handoff, katalog, ekspor (GAP-ADM-01..04, 07, 08) | AC-04, AC-05, AC-06, AC-12 lulus |
| **M6** | Batch, dokumen, QR, halaman trace publik, nonaktif QR (GAP-ADM-05/06) | AC-08 sampai AC-11 lulus, uji pindai QR |
| **M7** | Analitik, konten hotspot di admin (XP-13), tahap hidup (XP-09), polesan, UAT | Event terpasang tanpa data pribadi, UAT disetujui pemilik produk |

Backlog Should/Could (XP-08, XP-11, XP-12, laporan lanjutan) masuk setelah M7.

---

## 15. Rencana Pengujian dan Definisi Selesai

- Semua AC-01..AC-12 dari v1.0 ditambah kriteria XP pada bagian 6.1.
- Uji otomatis: tipe, lint, unit, e2e alur pesan/kemitraan/admin/QR, axe, tangkapan layar di 390/700/900/1280.
- Uji manual: Android menengah dan iPhone, Chrome/Safari/Firefox/Edge, jaringan 4G terbatas, `prefers-reduced-motion`, mode gelap, WebGL dimatikan.
- Definisi selesai: v1.0 bagian 22 ditambah (a) anggaran performa terpenuhi, (b) konten tampil bersumber data bukan kode, (c) tidak ada klaim terlarang, (d) tidak ada bug kritis pada alur utama.

---

## 16. Risiko dan Keputusan Terbuka

| Risiko | Mitigasi |
|---|---|
| 3D berat di perangkat lemah | Anggaran performa, cadangan 2D, penurunan kualitas otomatis, lazy load |
| Model prosedural terlihat kurang meyakinkan | Rencana model GLB v2 dari modeler, nama mesh sudah dikontrak |
| Teks botani dianggap klaim varietas | Label "botani umum", verifikasi tim, daftar larangan |
| Menyalin tampilan merek lain | Batasan bagian 4.1, aset dan warna milik sendiri |
| Foto dan izin belum ada | Placeholder bertanda, `MediaAsset.approvedForPublic` |
| Lingkup membengkak | Milestone M0-M7, Should/Could ditunda |

**Keputusan yang masih harus ditetapkan oleh pemilik produk:** nama dan identitas final UPSB, logo, foto berizin, nomor WhatsApp resmi, penyedia hosting, apakah harga dan estimasi total tampil, teks panduan perawatan dan FAQ, verifikasi teks botani, siapa penanggung jawab data batch.

---

## 17. Lampiran

**A. Berkas paket:** `GEMINI.md`, `.agents/rules/*.md`, `.agents/workflows/build-milestone.md`, `data/design-tokens.json`, `data/flower-hotspots.json`, `KICKOFF-PROMPT.md`, `README.md`.
**B. Prototipe acuan visual:** `upsb.html` (hasil audit bagian 2). Dipakai sebagai referensi arah, bukan basis kode produksi.
**C. Sumber rujukan:** PRD v1.0; dokumentasi Gojek Asphalt (asphalt.gojek.io) untuk prinsip token dan skala 4 px; Caris et al. 2006 (*Am. J. Bot.* 93:1-14) untuk anatomi bunga.
