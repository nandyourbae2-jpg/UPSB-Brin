/**
 * Membaca data/design-tokens.json dan menulis src/styles/tokens.css.
 * Sumber kebenaran token adalah JSON. Jangan mengedit tokens.css dengan tangan.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

type Palette = Record<string, string>;
interface Tokens {
  space: Record<string, number>;
  layout: {
    screenPaddingX: number;
    sectionGap: number;
    tileGap: number;
    touchTargetMin: number;
    topBarHeight: number;
    bottomNavHeight: number;
    contentMaxWidth: number;
    breakpoints: Record<string, number>;
  };
  radius: Record<string, number>;
  color: {
    light: Palette;
    dark: Palette;
    flower3d: Record<string, string | Palette>;
  };
  type: {
    family: string;
    fallback: string;
    scale: Record<string, { size: number; line: number; weight: number; tracking?: string }>;
  };
  shadow: Record<string, string>;
  motion: Record<string, number | string>;
}

const root = resolve(import.meta.dirname, "..");
const tokens = JSON.parse(readFileSync(resolve(root, "data/design-tokens.json"), "utf8")) as Tokens;

const kebab = (s: string): string => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
const px = (n: number): string => `${n}px`;

function paletteVars(palette: Palette, indent: string): string {
  return Object.entries(palette)
    .map(([k, v]) => `${indent}--c-${kebab(k)}: ${v};`)
    .join("\n");
}

// Skala spasi: kelipatan 4 px. Hanya angka pada token yang sah (dijaga oleh lint-rules).
const spaceKeys = Object.keys(tokens.space).join(", ");

const colorTheme = Object.keys(tokens.color.light)
  .map((k) => `  --color-${kebab(k)}: var(--c-${kebab(k)});`)
  .join("\n");

const radiusTheme = Object.entries(tokens.radius)
  .map(([k, v]) => `  --radius-${k}: ${px(v)};`)
  .join("\n");

const textTheme = Object.entries(tokens.type.scale)
  .map(([k, v]) => {
    const name = kebab(k);
    const tracking = v.tracking ? `\n  --text-${name}--letter-spacing: ${v.tracking};` : "";
    return `  --text-${name}: ${px(v.size)};\n  --text-${name}--line-height: ${px(v.line)};\n  --text-${name}--font-weight: ${v.weight};${tracking}`;
  })
  .join("\n");

const shadowTheme = Object.entries(tokens.shadow)
  .map(([k, v]) => `  --shadow-${k}: ${v};`)
  .join("\n");

const breakpointTheme = Object.entries(tokens.layout.breakpoints)
  .map(([k, v]) => `  --breakpoint-${k}: ${px(v)};`)
  .join("\n");

const flowerVars: string[] = [];
for (const [k, v] of Object.entries(tokens.color.flower3d)) {
  if (typeof v === "string") flowerVars.push(`  --flower-${kebab(k)}: ${v};`);
  else for (const [k2, v2] of Object.entries(v)) flowerVars.push(`  --flower-${kebab(k)}-${kebab(k2)}: ${v2};`);
}

const spaceVars = Object.entries(tokens.space)
  .map(([k, v]) => `  --space-${k}: ${px(v)};`)
  .join("\n");

const m = tokens.motion;
const css = `/* BERKAS HASIL GENERATE. Sumber: data/design-tokens.json. Jalankan \`npm run tokens\`. */

:root {
${paletteVars(tokens.color.light, "  ")}
  color-scheme: light;

${spaceVars}

  --layout-screen-x: ${px(tokens.layout.screenPaddingX)};
  --layout-section-gap: ${px(tokens.layout.sectionGap)};
  --layout-tile-gap: ${px(tokens.layout.tileGap)};
  --layout-touch-min: ${px(tokens.layout.touchTargetMin)};
  --layout-topbar-h: ${px(tokens.layout.topBarHeight)};
  --layout-bottomnav-h: ${px(tokens.layout.bottomNavHeight)};
  --layout-content-max: ${px(tokens.layout.contentMaxWidth)};

  --motion-fast: ${m.fast}ms;
  --motion-base: ${m.base}ms;
  --motion-slow: ${m.slow}ms;
  --motion-camera-fly: ${m.cameraFly}ms;
  --motion-opacity: ${m.fast}ms;
  --ease-out: ${m.easeOut};
  --ease-in-out: ${m.easeInOut};

${flowerVars.join("\n")}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${paletteVars(tokens.color.dark, "    ")}
    color-scheme: dark;
  }
}

:root[data-theme="dark"] {
${paletteVars(tokens.color.dark, "  ")}
  color-scheme: dark;
}

/* ${String(m.reducedMotion)} */
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-fast: 0ms;
    --motion-base: 0ms;
    --motion-slow: 0ms;
    --motion-camera-fly: 0ms;
  }
}

/*
 * Tailwind v4. Palet bawaan, radius, bayangan, dan ukuran teks dimatikan supaya hanya token yang bisa dipakai.
 * Spasi: --spacing = 4px, jadi p-4 = 16px. Angka sah: ${spaceKeys}. Angka lain ditolak oleh scripts/lint-rules.ts.
 */
@theme {
  --color-*: initial;
  --color-transparent: transparent;
  --color-current: currentColor;
${colorTheme}

  --spacing: 4px;

  --radius-*: initial;
${radiusTheme}

  --text-*: initial;
${textTheme}

  --shadow-*: initial;
${shadowTheme}

  --breakpoint-*: initial;
${breakpointTheme}

  --font-sans: var(--font-plus-jakarta), ${tokens.type.fallback};
}
`;

const out = resolve(root, "src/styles/tokens.css");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, css);
console.log(`tokens.css ditulis (${css.length} byte)`);
