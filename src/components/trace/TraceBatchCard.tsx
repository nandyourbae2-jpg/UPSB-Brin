import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FlowerPoster } from "@/components/ui/FlowerPoster";
import { StatusPill } from "@/components/ui/StatusPill";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { tracePageContent, type DemoBatch } from "@/content/demo-flows";
import { id } from "@/content/id";

export function TraceBatchCard({
  batch,
  whatsappNumber,
}: {
  batch: DemoBatch;
  whatsappNumber: string | null;
}) {
  if (!batch.active) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <Card elevation="raised" tone="alt" className="flex flex-col gap-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <StatusPill tone="warn">QR dinonaktifkan</StatusPill>
            <span className="text-body-sm font-bold tabular-nums text-ink-muted">{batch.slug}</span>
          </div>
          <h1 className="text-title1 font-extrabold text-ink">{tracePageContent.disabledTitle}</h1>
          <p className="text-body text-ink-muted">{tracePageContent.disabledBody}</p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <WhatsAppAction
              whatsappNumber={whatsappNumber}
              message={`Halo UPSB, saya memindai kode QR batch ${batch.slug} yang sedang tidak aktif.`}
            />
            <ButtonLink href="/lacak" variant="outline">
              Periksa kode batch lain
            </ButtonLink>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
      <section className="hero-surface flex flex-col gap-4 rounded-xl p-6 shadow-e2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="hero-tag inline-flex min-h-8 self-start items-center rounded-pill px-3 text-caption">
            {tracePageContent.detailTitlePrefix}
          </span>
          <h1 className="text-title1 font-extrabold tabular-nums">{batch.slug}</h1>
          <p className="text-body-sm">Kode batch ilustratif untuk demo ketertelusuran publik.</p>
        </div>
        <div className="self-start rounded-xl bg-surface-alt p-3 md:self-center">
          <FlowerPoster variant={batch.varietyId} label={id.a11y.heroPosterLabel} size="md" />
        </div>
      </section>

      <Card elevation="flat" className="flex flex-col gap-3 p-5">
        <h2 className="text-title3 font-bold text-ink">Identitas batch</h2>
        <dl className="m-0 flex flex-col divide-y divide-line text-body-sm">
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-ink-muted">Produk</dt>
            <dd className="m-0 text-right font-bold text-ink">{batch.productLabel}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-ink-muted">Varietas</dt>
            <dd className="m-0 text-right font-bold text-ink">{batch.varietyName}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-ink-muted">Lokasi produksi</dt>
            <dd className="m-0 text-right font-bold text-ink">{batch.productionLocation}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-ink-muted">Tanggal QC &amp; kemas</dt>
            <dd className="m-0 text-right font-bold text-ink">{batch.qcDateLabel}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-ink-muted">Tanggal kirim</dt>
            <dd className="m-0 text-right font-bold text-ink">{batch.shipDateLabel}</dd>
          </div>
        </dl>
      </Card>

      <Card elevation="flat" className="flex flex-col gap-3 p-5">
        <h2 className="text-title3 font-bold text-ink">Pemeriksaan kesehatan &amp; dokumen</h2>
        <dl className="m-0 flex flex-col divide-y divide-line text-body-sm">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-ink-muted">Inspeksi visual</dt>
            <dd className="m-0">
              <StatusPill tone="warn">{batch.healthChecks.visualInspection}</StatusPill>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-ink-muted">Pengujian CMV</dt>
            <dd className="m-0">
              <StatusPill tone="warn">{batch.healthChecks.cmvTesting}</StatusPill>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-ink-muted">Sertifikat PVT</dt>
            <dd className="m-0">
              <StatusPill tone="info">{batch.healthChecks.pvtStatus}</StatusPill>
            </dd>
          </div>
        </dl>
        <p className="text-body-sm text-ink-muted">{batch.healthChecks.disclaimer}</p>
      </Card>

      <Card elevation="flat" tone="alt" className="flex flex-col gap-2 p-5">
        <h2 className="text-title3 font-bold text-ink">Panduan perawatan dasar</h2>
        <p className="text-body-sm text-ink-muted">{batch.careGuide}</p>
      </Card>

      <p className="text-caption text-ink-muted">
        Diperbarui {batch.updatedAtLabel}. Halaman ini tidak pernah menampilkan nama pemesan, WhatsApp, alamat, atau
        nilai transaksi.
      </p>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href={`/pesan?produk=${batch.productType}&varietas=${batch.varietyId}`}>
          Pesan varietas {batch.varietyName}
        </ButtonLink>
        <ButtonLink href={`/produk/${batch.varietyId}`} variant="secondary">
          Detail varietas
        </ButtonLink>
        <ButtonLink href="/lacak" variant="outline">
          Lacak kode lain
        </ButtonLink>
      </div>
    </div>
  );
}
