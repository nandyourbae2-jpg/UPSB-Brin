"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/Fields";
import { StatusPill } from "@/components/ui/StatusPill";
import { IconSearch, IconTrace } from "@/components/icons";
import { DEMO_BATCHES, tracePageContent } from "@/content/demo-flows";

export function TraceSearchView() {
  const router = useRouter();
  const [slugInput, setSlugInput] = useState("FAB-POT-2026-001");
  const [error, setError] = useState<string | undefined>(undefined);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = slugInput.trim();
    if (!trimmed) {
      setError("Masukkan kode batch untuk memeriksa halaman ketertelusuran.");
      return;
    }
    setError(undefined);
    router.push(`/trace/${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <StatusPill tone="info">{tracePageContent.badge}</StatusPill>
        </div>
        <h1 className="text-title1 font-extrabold text-ink">{tracePageContent.title}</h1>
        <p className="max-w-[65ch] text-body text-ink-muted">{tracePageContent.subtitle}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px] md:items-start">
        <div className="flex flex-col gap-5">
          <Card elevation="raised" className="flex flex-col gap-4 p-5">
            <form onSubmit={handleSearch} noValidate className="flex flex-col gap-3">
              <TextField
                label="Kode batch kemasan"
                placeholder={tracePageContent.searchPlaceholder}
                value={slugInput}
                onChange={(e) => {
                  setSlugInput(e.target.value);
                  if (error) setError(undefined);
                }}
                error={error}
              />
              <div className="flex flex-wrap gap-3">
                <Button type="submit">
                  <IconSearch width={20} height={20} />
                  <span>{tracePageContent.searchButton}</span>
                </Button>
              </div>
            </form>
          </Card>

          <section aria-labelledby="trace-samples-title" className="flex flex-col gap-3">
            <h2 id="trace-samples-title" className="text-title2 font-bold text-ink">
              {tracePageContent.sampleTitle}
            </h2>
            <div className="grid gap-3">
              {DEMO_BATCHES.map((batch) => (
                <Card key={batch.slug} elevation="flat" className="flex flex-wrap items-center justify-between gap-4 p-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <IconTrace width={20} height={20} className="text-primary" />
                      <span className="text-title3 font-extrabold tabular-nums text-ink">{batch.slug}</span>
                      <StatusPill tone={batch.active ? "success" : "warn"}>
                        {batch.active ? "QR aktif" : "QR dinonaktifkan"}
                      </StatusPill>
                    </div>
                    <p className="text-body-sm text-ink-muted">
                      {batch.productLabel} · Varietas {batch.varietyName} · {batch.productionLocation}
                    </p>
                  </div>
                  <ButtonLink href={`/trace/${batch.slug}`} variant="secondary" size="sm">
                    Buka detail batch
                  </ButtonLink>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          <Card tone="alt" className="flex flex-col gap-2 p-5">
            <h2 className="text-title3 font-bold text-ink">{tracePageContent.privacyBoxTitle}</h2>
            <p className="text-body-sm text-ink-muted">{tracePageContent.privacyBoxBody}</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
