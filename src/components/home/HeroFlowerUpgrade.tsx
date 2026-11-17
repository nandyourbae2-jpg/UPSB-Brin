"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { FlowerPartData } from "@/lib/flower-data";

const LazyHeroExplorer = lazy(() =>
  import("@/components/flower/FlowerExplorer").then((m) => ({ default: m.FlowerExplorer })),
);

/**
 * Menampilkan poster statis lebih dulu agar LCP cepat dan JS awal beranda <= 180 KB,
 * lalu memuat potongan 3D secara malas setelah hidrasi/idle (XP-01 & Rule 02).
 * Memakai React.lazy bawaan agar pembungkus next/dynamic tidak ikut membebani bundel awal beranda.
 */
export function HeroFlowerUpgrade({
  parts,
  poster,
}: {
  parts: readonly FlowerPartData[];
  poster: ReactNode;
}) {
  const [mount3d, setMount3d] = useState(false);

  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(() => setMount3d(true), { timeout: 600 });
      return () => win.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(() => setMount3d(true), 200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mount3d) return <>{poster}</>;
  return (
    <Suspense fallback={poster}>
      <LazyHeroExplorer variant="hero" parts={parts} />
    </Suspense>
  );
}
