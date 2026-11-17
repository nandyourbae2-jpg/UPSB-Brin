"use client";

import { IconMoon, IconSun } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export const THEME_STORAGE_KEY = "upsb-theme";

/**
 * Tanpa state React: tema efektif dibaca dari DOM saat diklik, jadi tidak ada ketidakcocokan hidrasi.
 * Ikon diganti lewat CSS (.theme-icon-*) mengikuti [data-theme] dan prefers-color-scheme.
 */
export function ThemeToggle({ toLightLabel, toDarkLabel, text }: { toLightLabel: string; toDarkLabel: string; text: string }) {
  function toggle() {
    const root = document.documentElement;
    const current =
      root.dataset.theme === "dark" || root.dataset.theme === "light"
        ? root.dataset.theme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Penyimpanan diblokir: tema tetap berlaku untuk sesi ini.
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={toggle} aria-label={`${text}: ${toLightLabel} / ${toDarkLabel}`}>
      <IconSun className="theme-icon-for-dark" />
      <IconMoon className="theme-icon-for-light" />
      {text}
    </Button>
  );
}
