import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { IconAlert, IconFlower, IconSearch } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Checkbox, Select, TextField, Textarea } from "@/components/ui/Fields";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatusPill } from "@/components/ui/StatusPill";
import { isProductionDeploy } from "@/env";
import { InteractiveDemo } from "./InteractiveDemo";

export const metadata: Metadata = { title: "Contoh komponen", robots: { index: false, follow: false } };

const swatches = [
  ["bg-bg", "bg"],
  ["bg-surface", "surface"],
  ["bg-surface-alt", "surface-alt"],
  ["bg-primary", "primary"],
  ["bg-primary-pressed", "primary-pressed"],
  ["bg-primary-tint", "primary-tint"],
  ["bg-hero", "hero"],
  ["bg-leaf", "leaf"],
  ["bg-leaf-tint", "leaf-tint"],
  ["bg-warn-bg", "warn-bg"],
  ["bg-danger", "danger"],
] as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  const headingId = `s-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h2 id={headingId} className="text-title2 font-extrabold text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Halaman contoh komponen M0. Hanya ada di luar produksi. */
export default function KitchenSinkPage() {
  if (isProductionDeploy()) notFound();

  return (
    <AppShell>
      <h1 className="text-display font-extrabold text-ink">Contoh komponen</h1>
      <p className="max-w-[65ch] text-body text-ink-muted">
        Halaman internal untuk memeriksa token dan komponen di empat lebar layar, mode terang dan gelap. Tidak tersedia di produksi.
      </p>

      <Section title="Warna">
        <ul className="m-0 grid list-none grid-cols-3 gap-3 p-0 md:grid-cols-6">
          {swatches.map(([cls, name]) => (
            <li key={name} className="flex flex-col gap-1">
              <span className={`${cls} h-12 rounded-md border border-line`} />
              <span className="text-caption text-ink-muted">{name}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Tipografi">
        <Card>
          <p className="text-display font-extrabold">Display 32</p>
          <p className="text-title1 font-extrabold">Title 1, 24</p>
          <p className="text-title2 font-extrabold">Title 2, 20</p>
          <p className="text-title3 font-bold">Title 3, 16</p>
          <p className="text-body">Body 16, panjang baris dibatasi 65 karakter agar nyaman dibaca.</p>
          <p className="text-body-sm">Body kecil 14</p>
          <p className="text-caption text-ink-muted">Caption 12</p>
        </Card>
      </Section>

      <Section title="Tombol">
        <div className="flex flex-wrap items-center gap-2">
          <Button>Kirim permintaan</Button>
          <Button variant="secondary">Lihat detail</Button>
          <Button variant="outline">Batal</Button>
          <Button size="sm">Tombol kecil</Button>
          <Button disabled>Tidak tersedia</Button>
          <ButtonLink href="/" variant="outline">
            Tautan bergaya tombol
          </ButtonLink>
        </div>
      </Section>

      <Section title="Kartu dan status">
        <div className="grid gap-3 md:grid-cols-3">
          <Card elevation="flat">
            <p className="text-title3 font-bold">Datar</p>
            <p className="text-body-sm text-ink-muted">Hanya garis tepi.</p>
          </Card>
          <Card elevation="raised">
            <p className="text-title3 font-bold">Terangkat</p>
            <p className="text-body-sm text-ink-muted">Bayangan level 1.</p>
          </Card>
          <Card elevation="floating" tone="alt">
            <p className="text-title3 font-bold">Melayang</p>
            <p className="text-body-sm text-ink-muted">Bayangan level 2.</p>
          </Card>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill>Belum dilakukan pengujian</StatusPill>
          <StatusPill tone="info">Baru</StatusPill>
          <StatusPill tone="success">Hasil tersedia</StatusPill>
          <StatusPill tone="warn">Perlu verifikasi</StatusPill>
          <StatusPill tone="danger">Tidak aktif</StatusPill>
        </div>
      </Section>

      <Section title="Pilihan">
        <InteractiveDemo />
      </Section>

      <Section title="Formulir">
        <form className="flex flex-col gap-4" noValidate>
          <TextField label="Nama usaha" hint="Sesuai nama yang dipakai saat transaksi." autoComplete="organization" />
          <TextField
            label="Email"
            type="email"
            defaultValue="contoh@"
            error="Alamat email belum lengkap. Tulis seperti nama@domain.id."
            autoComplete="email"
          />
          <Select label="Metode penerimaan" defaultValue="">
            <option value="" disabled>
              Pilih salah satu
            </option>
            <option value="ambil">Ambil di lokasi</option>
            <option value="kirim">Dikirim</option>
          </Select>
          <Textarea label="Catatan" hint="Opsional." />
          <Checkbox label="Saya menyetujui kebijakan privasi" error="Centang persetujuan sebelum mengirim permintaan." />
        </form>
      </Section>

      <Section title="Memuat dan kosong">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        <EmptyState
          icon={<IconSearch width={40} height={40} />}
          title="Belum ada permintaan"
          body="Permintaan yang masuk akan muncul di sini. Buat permintaan pertama untuk memulai."
          action={<ButtonLink href="/">Buat permintaan</ButtonLink>}
        />
      </Section>

      <Section title="Ikon">
        <div className="flex gap-4 text-ink">
          <IconFlower />
          <IconAlert />
          <IconSearch />
        </div>
      </Section>
    </AppShell>
  );
}
