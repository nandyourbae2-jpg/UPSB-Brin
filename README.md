# UPSB Digital Ecosystem v2.0

Website pemesanan, kemitraan, dan ketertelusuran QR untuk Pacar Air Fabiola & Claire (Unit Produksi Stek Berakar, Baturraden, Banyumas), dengan pengalaman bunga 3D interaktif. Bahasa antarmuka: Indonesia.

Status saat ini: **Milestone M0 (Fondasi)** — token, komponen dasar, kerangka halaman, mode terang/gelap, pemeriksaan kontras, CI, dan endpoint kesehatan.

## Perintah pengembangan lokal

Prasyarat: Node.js `>= 20` (`.nvmrc` mencantumkan `24`), npm.

```bash
cp .env.example .env.local
npm install
npm run verify        # generate token CSS + typecheck + eslint + lint-rules + vitest
npm run build         # build produksi (webpack)
npm run check-bundle  # cek anggaran JS awal beranda <= 180 KB gzip
npm run e2e           # Playwright + axe + tangkapan layar 390/700/900/1280 (butuh chromium)
npm run dev           # server pengembangan lokal
```

> Catatan bundler: `build` dan `dev` memakai `--webpack` karena Turbopack pada Node.js `24.13+` masih memiliki isu koneksi `childProcesses` untuk evaluasi PostCSS pada beberapa lingkungan lokal.

## Unggah ke GitHub & deploy ke Vercel

1. **GitHub:** buat repo **privat** kosong (mis. `upsb-digital-ecosystem`), lalu tambahkan remote dan push cabang utama:
   ```bash
   git remote add origin <URL_REPO_GITHUB>
   git push -u origin main
   ```
   Lindungi cabang `main` agar wajib melalui Pull Request dan CI (`.github/workflows/ci.yml`) lulus.
2. **Vercel:** di dashboard Vercel pilih **Add New → Project → Import** repo GitHub tersebut.
   - Framework Preset: `Next.js` (otomatis)
   - Region fungsi: `sin1` (sudah diatur di `vercel.json`)
   - Build Command: `npm run build` (default)
   - Aktifkan **Deployment Protection** untuk Preview agar halaman contoh (`/kitchen-sink`) dan konten berstatus `verified:false` tidak terbuka ke publik.
3. **Environment Variable di Vercel:**
   - **Preview:** `NEXT_PUBLIC_SITE_URL` = URL preview, `CONTENT_ENV` = `staging`
   - **Production:** `NEXT_PUBLIC_SITE_URL` = domain produksi resmi, `CONTENT_ENV` = `production` (wajib; `src/env.ts` menolak selain `"production"` saat `VERCEL_ENV=production`).
4. **Verifikasi deploy:** buka `/api/health` dan pastikan mengembalikan HTTP 200 dengan `{"status":"ok",...}`.

## Isi paket Antigravity (rujukan)
- `PRD-UPSB-v2.0-Web-Experience.md` dokumen utama kebutuhan
- `GEMINI.md` identitas proyek
- `.agents/rules/01..04-*.md` aturan desain, 3D, konten/klaim, rekayasa
- `.agents/workflows/build-milestone.md` alur kerja per milestone
- `data/design-tokens.json`, `data/flower-hotspots.json` sumber kebenaran token dan data bunga
- `KICKOFF-PROMPT.md` prompt pembuka
- `upsb-prototype-reference.html` prototipe visual (rujukan saja)
- `docs/dependencies.md` daftar dependensi dan ukurannya
