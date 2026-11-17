import Link from "next/link";
import { HeroFlowerUpgrade } from "@/components/home/HeroFlowerUpgrade";
import { FlowerPoster } from "@/components/ui/FlowerPoster";
import { id } from "@/content/id";
import type { FlowerPartData } from "@/lib/flower-data";

interface HeroBannerProps {
  tag: string;
  title: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  flowerParts: readonly FlowerPartData[];
}

/**
 * Banner utama beranda (XP-01, FIX-01, FIX-02):
 * Poster SVG tampil lebih dulu sebagai LCP, lalu meningkat menjadi 3D malas setelah idle.
 */
export function HeroBanner({ tag, title, body, primaryCta, secondaryCta, flowerParts }: HeroBannerProps) {
  const staticPoster = (
    <figure className="m-0 flex flex-col items-center gap-2 self-center">
      <div className="hero-flower-stage flex items-center justify-center rounded-xl bg-surface-alt p-4">
        <FlowerPoster variant="hero" label={id.a11y.heroPosterLabel} size="lg" />
      </div>
      <figcaption className="text-center text-caption">{id.status.illustrative}</figcaption>
    </figure>
  );

  return (
    <section
      aria-labelledby="hero-title"
      className="hero-surface grid gap-6 rounded-xl p-6 shadow-e2 md:grid-cols-[1fr_auto] md:items-center md:p-10"
    >
      <div className="flex min-w-0 flex-col gap-4">
        <span className="hero-tag inline-flex min-h-8 self-start items-center rounded-pill px-3 text-caption">
          {tag}
        </span>
        <h1 id="hero-title" className="max-w-[24ch] text-title1 font-extrabold md:text-display">
          {title}
        </h1>
        <p className="max-w-[52ch] text-body">{body}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href={primaryCta.href}
            className="hero-cta-primary inline-flex min-h-12 items-center justify-center rounded-pill px-5 text-title3 font-bold transition-colors duration-(--motion-fast)"
          >
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            className="hero-cta-secondary inline-flex min-h-12 items-center justify-center rounded-pill px-5 text-title3 font-bold transition-colors duration-(--motion-fast)"
          >
            {secondaryCta.label}
          </Link>
        </div>
      </div>

      <HeroFlowerUpgrade parts={flowerParts} poster={staticPoster} />
    </section>
  );
}
