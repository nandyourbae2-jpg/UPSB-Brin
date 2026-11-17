"use client";

import type { FlowerPartData } from "@/lib/flower-data";
import { cn } from "@/lib/cn";
import type { Variety3D } from "@/3d/ProceduralFlower";

interface Flower2DFallbackProps {
  variety: Variety3D;
  parts: readonly FlowerPartData[];
  selectedPartId: string | null;
  label: string;
  onSelectPart: (partId: string, input: "mouse" | "touch") => void;
}

/**
 * Cadangan diagram SVG 2D lengkap saat WebGL tidak tersedia, memori rendah, Save-Data, atau error (XP-04).
 * Menyajikan 8 bagian bunga dan isi informasi yang sama dengan mode 3D.
 */
export function Flower2DFallback({ variety, parts, selectedPartId, label, onSelectPart }: Flower2DFallbackProps) {
  const isClaire = variety === "claire";
  const petal = isClaire ? "var(--flower-claire-petal)" : "var(--flower-fabiola-petal)";
  const edge = isClaire ? "var(--flower-claire-petal-edge)" : "var(--flower-fabiola-petal-edge)";
  const throat = isClaire ? "var(--flower-claire-throat)" : "var(--flower-fabiola-throat)";
  const partIds = new Set(parts.map((p) => p.id));
  const petalScale = isClaire ? 1.12 : 1;

  const partStroke = (id: string) => (selectedPartId === id ? "var(--c-focus)" : edge);
  const partStrokeWidth = (id: string) => (selectedPartId === id ? 3.5 : 1.8);
  const clickable = (id: string) =>
    partIds.has(id)
      ? {
          style: { cursor: "pointer" as const },
          onClick: () => onSelectPart(id, "mouse"),
        }
      : {};

  return (
    <div className="relative flex h-full w-full items-center justify-center rounded-xl bg-surface-alt p-3">
      <svg viewBox="-120 -110 240 275" className="h-full max-h-full w-auto select-none" role="img" aria-label={label}>
        {/* Akar stek berakar */}
        <g
          data-part="akar"
          stroke={selectedPartId === "akar" ? "var(--c-focus)" : "var(--flower-root)"}
          strokeWidth={selectedPartId === "akar" ? 5 : 4}
          strokeLinecap="round"
          fill="none"
          {...clickable("akar")}
        >
          <path d="M0 95 C-12 115 -22 132 -36 146" />
          <path d="M0 95 C2 118 4 136 6 154" />
          <path d="M0 95 C14 114 26 130 38 144" />
        </g>

        {/* Batang & ruas */}
        <g
          data-part="batang"
          stroke={selectedPartId === "batang" ? "var(--c-focus)" : "var(--flower-stem)"}
          strokeLinecap="round"
          fill="none"
          {...clickable("batang")}
        >
          <path d="M0 95 C-4 55 4 18 0 -22" strokeWidth={8} />
          <circle cx="-1" cy="24" r="5.5" fill="var(--flower-stem)" />
          <circle cx="-2" cy="58" r="5.5" fill="var(--flower-stem)" />
        </g>

        {/* Daun bergerigi */}
        <g data-part="daun" fill="var(--flower-leaf)" stroke={partStroke("daun")} strokeWidth={partStrokeWidth("daun")} {...clickable("daun")}>
          <path d="M-4 22 C-28 6 -56 12 -64 30 C-44 40 -18 36 -4 22 Z" />
          <path d="M4 38 C28 22 58 28 64 46 C44 56 18 52 4 38 Z" />
          <path d="M-3 56 C-24 44 -48 50 -54 66 C-36 74 -16 70 -3 56 Z" />
        </g>

        {/* Kapsul buah */}
        <g data-part="kapsul" {...clickable("kapsul")}>
          <path d="M-1 8 C-18 12 -32 20 -42 30" stroke="var(--flower-stem)" strokeWidth={2.5} fill="none" />
          <ellipse
            cx="-44"
            cy="38"
            rx="9"
            ry="15"
            transform="rotate(14 -44 38)"
            fill="var(--flower-stem)"
            stroke={selectedPartId === "kapsul" ? "var(--c-focus)" : "var(--flower-leaf)"}
            strokeWidth={partStrokeWidth("kapsul")}
          />
        </g>

        {/* Sepal bertaji */}
        <g data-part="taji" {...clickable("taji")}>
          <path
            d="M10 -32 C34 -26 52 -10 56 10 C42 6 30 -8 18 -18 Z"
            fill={edge}
            stroke={selectedPartId === "taji" ? "var(--c-focus)" : throat}
            strokeWidth={partStrokeWidth("taji")}
          />
        </g>

        {/* Mahkota bunga */}
        <g
          data-part="mahkota"
          transform={`translate(0 -46) scale(${petalScale})`}
          fill={petal}
          stroke={partStroke("mahkota")}
          strokeWidth={partStrokeWidth("mahkota")}
          {...clickable("mahkota")}
        >
          <path d="M0 -6 C-24 -22 -30 -56 -10 -62 C-4 -64 0 -58 0 -54 C0 -58 4 -64 10 -62 C30 -56 24 -22 0 -6 Z" />
          <path d="M-4 0 C-30 -18 -64 -8 -62 14 C-58 34 -24 30 -4 0 Z" />
          <path d="M4 0 C30 -18 64 -8 62 14 C58 34 24 30 4 0 Z" />
          {!isClaire ? (
            <>
              <circle cx="-46" cy="-28" r="9" />
              <circle cx="46" cy="-22" r="9" />
            </>
          ) : null}
        </g>

        {/* Putik & bakal buah */}
        <circle
          data-part="putik"
          cx="0"
          cy="-44"
          r="9"
          fill={throat}
          stroke={selectedPartId === "putik" ? "var(--c-focus)" : edge}
          strokeWidth={partStrokeWidth("putik")}
          {...clickable("putik")}
        />

        {/* Benang sari (tudung) */}
        <ellipse
          data-part="benangsari"
          cx="0"
          cy="-51"
          rx="8"
          ry="5.5"
          fill="var(--flower-pollen)"
          stroke={selectedPartId === "benangsari" ? "var(--c-focus)" : throat}
          strokeWidth={partStrokeWidth("benangsari")}
          {...clickable("benangsari")}
        />
      </svg>

      {/* Chip label cepat di dalam diagram agar bagian mudah ditemukan */}
      <div className={cn("pointer-events-none absolute top-2 right-2 rounded-pill bg-surface px-3 py-1 text-caption text-ink-muted shadow-e1")}>
        2D SVG
      </div>
    </div>
  );
}
