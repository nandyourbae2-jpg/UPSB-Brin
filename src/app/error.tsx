"use client";

import Link from "next/link";
import { useEffect } from "react";
import { outageStrings } from "@/content/outage";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("app-error", error.digest ?? error.message);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen w-full flex-col justify-center gap-4 px-4 py-8" style={{ maxWidth: "var(--layout-content-max)" }}>
      <div className="flex flex-col items-start gap-4 rounded-lg border border-line bg-surface p-6">
        <h1 className="text-title1 font-extrabold text-ink">{outageStrings.title}</h1>
        <p className="max-w-[65ch] text-body text-ink-muted">{outageStrings.body}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-5 text-title3 font-bold text-on-primary"
          >
            {outageStrings.retryLabel}
          </button>
          <Link
            href="/gangguan"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary-tint px-5 text-title3 font-bold text-primary-pressed"
          >
            {outageStrings.whatsappLabel}
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-line bg-surface px-5 text-title3 font-bold text-ink"
          >
            {outageStrings.backHomeLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
