# Catatan Dependensi (M0)

Sesuai `.agents/rules/04-engineering.md`, setiap dependensi dicatat beserta alasan dan ukurannya.

## Runtime (`dependencies`)
| Paket | Versi | Alasan | Perkiraan ukuran |
|---|---|---|---|
| `next` | `^16.4.6` | Kerangka kerja App Router & SSR/SSG (PRD §11) | Bagian dari runtime awal (~169 KB gzip bersama React + polyfills) |
| `react` / `react-dom` | `^19.3.1` | Pustaka antarmuka Next.js | Termasuk di atas |
| `zod` | `^4.6.7` | Validasi skema `env.ts` di server (nanti juga payload formulir M4+) | Server-only di M0 (0 KB di bundel klien `/`) |

## Pengembangan (`devDependencies`)
- `typescript`, `@types/node`, `@types/react`, `@types/react-dom`: pengecekan tipe ketat.
- `tailwindcss`, `@tailwindcss/postcss`, `postcss`: CSS utility dari variabel token (`src/styles/tokens.css`).
- `@fontsource-variable/plus-jakarta-sans`: sumber berkas woff2 `Plus Jakarta Sans` (SIL OFL) untuk dihosting sendiri via `next/font/local`.
- `eslint`, `eslint-config-next`: lint kode dan aturan aksesibilitas/Next.
- `vitest`, `tsx`: unit test dan runner skrip (`build-tokens.ts`, `lint-rules.ts`, `check-bundle.ts`).
- `@playwright/test`, `@axe-core/playwright`: uji e2e, tangkapan layar 4 lebar, dan audit aksesibilitas WCAG 2.2 AA.

## Tambahan M3 (Pengalaman 3D — dimuat lazy hanya di `/` dan `/jelajah`)
| Paket | Versi | Alasan | Perkiraan ukuran |
|---|---|---|---|
| `three` | `^0.187.0` | Mesin WebGL untuk model prosedural bunga Pacar Air (PRD §5.1) | Bagian dari potongan 3D lazy (`<= 500 KB gzip` total bersama R3F) |
| `@react-three/fiber` | `^9.8.2` | Renderer deklaratif React 19 untuk Three.js | Termasuk di potongan 3D lazy |
| `@react-three/drei` | `^10.7.9` | Hanya submodul `core/OrbitControls` (tanpa impor barrel penuh agar tree-shaking ringan) | ~3 KB di potongan 3D lazy |
| `@types/three` | `^0.187.0` | Tipe TypeScript ketat untuk Three.js (`devDependencies`) | 0 KB di runtime |
