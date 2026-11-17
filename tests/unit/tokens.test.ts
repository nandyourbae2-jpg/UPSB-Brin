import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import tokens from "../../data/design-tokens.json";

const css = readFileSync(resolve(import.meta.dirname, "../../src/styles/tokens.css"), "utf8");
const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

describe("tokens.css dihasilkan dari data/design-tokens.json", () => {
  it("memuat setiap warna terang dan gelap", () => {
    for (const [k, v] of Object.entries(tokens.color.light)) expect(css).toContain(`--c-${kebab(k)}: ${v};`);
    for (const [k, v] of Object.entries(tokens.color.dark)) expect(css).toContain(`--c-${kebab(k)}: ${v};`);
  });

  it("memuat skala spasi 4 px dan basis Tailwind 4px", () => {
    for (const [k, v] of Object.entries(tokens.space)) expect(css).toContain(`--space-${k}: ${v}px;`);
    expect(css).toContain("--spacing: 4px;");
  });

  it("semua nilai spasi adalah kelipatan 4", () => {
    for (const v of Object.values(tokens.space)) expect(v % 4).toBe(0);
  });

  it("memuat radius, bayangan, dan breakpoint", () => {
    for (const [k, v] of Object.entries(tokens.radius)) expect(css).toContain(`--radius-${k}: ${v}px;`);
    for (const k of Object.keys(tokens.shadow)) expect(css).toContain(`--shadow-${k}:`);
    for (const [k, v] of Object.entries(tokens.layout.breakpoints)) expect(css).toContain(`--breakpoint-${k}: ${v}px;`);
  });

  it("mematikan palet, radius, dan bayangan bawaan Tailwind", () => {
    expect(css).toContain("--color-*: initial;");
    expect(css).toContain("--radius-*: initial;");
    expect(css).toContain("--shadow-*: initial;");
  });

  it("menyiapkan mode gelap lewat media query dan [data-theme]", () => {
    expect(css).toContain("@media (prefers-color-scheme: dark)");
    expect(css).toContain(':root[data-theme="dark"]');
    expect(css).toContain(':root:not([data-theme="light"])');
  });

  it("menghormati prefers-reduced-motion", () => {
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
