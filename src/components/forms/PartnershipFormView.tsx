"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Checkbox, Select, Textarea, TextField } from "@/components/ui/Fields";
import { FlowerPoster } from "@/components/ui/FlowerPoster";
import { StatusPill } from "@/components/ui/StatusPill";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { IconCheck } from "@/components/icons";
import {
  BUSINESS_TYPES,
  COOPERATION_OPTIONS,
  MONTHLY_VOLUME_OPTIONS,
  PARTNERSHIP_STATUS_META,
  partnershipPageContent,
  type DemoPartnership,
} from "@/content/demo-flows";
import { id } from "@/content/id";
import {
  addDemoPartnership,
  buildPartnershipWhatsAppDraft,
  createPartnershipReference,
  generateOrderWeeks,
  isValidOptionalEmail,
  isValidWhatsapp,
} from "@/lib/demo-store";

type FieldErrors = Partial<
  Record<
    "contactName" | "businessName" | "cityProvince" | "cooperationTypes" | "whatsapp" | "email" | "address" | "consent",
    string
  >
>;

export function PartnershipFormView({ whatsappNumber }: { whatsappNumber: string | null }) {
  const { show: showToast } = useToast();
  const weeks = generateOrderWeeks();
  const alertRef = useRef<HTMLDivElement>(null);

  const [contactName, setContactName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState<string>(BUSINESS_TYPES[0]);
  const [cityProvince, setCityProvince] = useState("");
  const [cooperationTypes, setCooperationTypes] = useState<string[]>(["Beli stek berakar"]);
  const [monthlyVolume, setMonthlyVolume] = useState<string>(MONTHLY_VOLUME_OPTIONS[1]);
  const [startWeek, setStartWeek] = useState<string>(weeks[0] ?? "");
  const [experienceSummary, setExperienceSummary] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState<DemoPartnership | null>(null);

  function toggleCooperation(option: string) {
    setCooperationTypes((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
    );
    if (errors.cooperationTypes) {
      setErrors((prev) => ({ ...prev, cooperationTypes: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: FieldErrors = {};

    if (contactName.trim().length < 2) nextErrors.contactName = partnershipPageContent.errors.contactName;
    if (businessName.trim().length < 2) nextErrors.businessName = partnershipPageContent.errors.businessName;
    if (cityProvince.trim().length < 3) nextErrors.cityProvince = partnershipPageContent.errors.cityProvince;
    if (cooperationTypes.length === 0) nextErrors.cooperationTypes = partnershipPageContent.errors.cooperationTypes;
    if (!isValidWhatsapp(whatsapp)) nextErrors.whatsapp = partnershipPageContent.errors.whatsapp;
    if (!isValidOptionalEmail(email)) nextErrors.email = partnershipPageContent.errors.email;
    if (address.trim().length < 8) nextErrors.address = partnershipPageContent.errors.address;
    if (!consent) nextErrors.consent = partnershipPageContent.errors.consent;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => alertRef.current?.focus());
      return;
    }

    const record: DemoPartnership = {
      id: createPartnershipReference(),
      contactName: contactName.trim(),
      roleTitle: roleTitle.trim(),
      businessName: businessName.trim(),
      businessType,
      cityProvince: cityProvince.trim(),
      cooperationTypes: [...cooperationTypes],
      monthlyVolume,
      startWeek,
      experienceSummary: experienceSummary.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      address: address.trim(),
      notes: notes.trim(),
      status: "NEW",
      createdAt: new Date().toISOString(),
      isDemoSample: false,
      internalNote: "Pengajuan awal dari formulir demo browser.",
    };

    addDemoPartnership(record);
    setSubmitted(record);
    showToast(`Pengajuan ${record.id} dicatat (mode demo).`, "success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleReset() {
    setSubmitted(null);
    setContactName("");
    setRoleTitle("");
    setBusinessName("");
    setCityProvince("");
    setExperienceSummary("");
    setWhatsapp("");
    setEmail("");
    setAddress("");
    setNotes("");
    setConsent(false);
    setErrors({});
  }

  const errorList = Object.values(errors).filter(Boolean) as string[];

  if (submitted) {
    const meta = PARTNERSHIP_STATUS_META[submitted.status];
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <Card elevation="raised" className="flex flex-col items-center gap-4 p-6 text-center md:p-8">
          <FlowerPoster variant="fabiola" label={id.a11y.heroPosterLabel} size="md" />
          <div className="flex flex-wrap items-center justify-center gap-2">
            <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
            <StatusPill tone="neutral">{submitted.id}</StatusPill>
          </div>
          <h1 className="text-title1 font-extrabold text-ink">{partnershipPageContent.success.title}</h1>
          <p className="max-w-[52ch] text-body text-ink-muted">{partnershipPageContent.success.body}</p>
          <div className="w-full rounded-md bg-warn-bg p-4 text-left text-body-sm font-semibold text-warn-ink">
            {partnershipPageContent.rightsNote}
          </div>

          <div className="flex w-full flex-col gap-2 rounded-md border border-line bg-surface-alt p-4 text-left text-body-sm">
            <div className="flex justify-between gap-4">
              <span className="text-ink-muted">Usaha / Penanggung jawab</span>
              <span className="text-right font-bold text-ink">
                {submitted.businessName} ({submitted.contactName})
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-ink-muted">Wilayah &amp; jenis</span>
              <span className="text-right font-bold text-ink">
                {submitted.businessType} · {submitted.cityProvince}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-ink-muted">Minat kerja sama</span>
              <span className="text-right font-bold text-ink">{submitted.cooperationTypes.join(", ")}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <WhatsAppAction
              whatsappNumber={whatsappNumber}
              message={buildPartnershipWhatsAppDraft(submitted)}
              showFallbackLink={false}
            />
            <ButtonLink href="/admin" variant="secondary">
              Lihat di Demo Admin
            </ButtonLink>
            <Button variant="outline" onClick={handleReset}>
              Kirim pengajuan lain
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <StatusPill tone="info">{partnershipPageContent.badge}</StatusPill>
        </div>
        <h1 className="text-title1 font-extrabold text-ink">{partnershipPageContent.title}</h1>
        <p className="max-w-[65ch] text-body text-ink-muted">{partnershipPageContent.subtitle}</p>
        <div className="rounded-lg bg-warn-bg p-4 text-body-sm font-semibold text-warn-ink">
          {partnershipPageContent.demoNotice}
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px] md:items-start">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {errorList.length > 0 ? (
            <div
              ref={alertRef}
              role="alert"
              tabIndex={-1}
              className="flex flex-col gap-1 rounded-lg border border-danger bg-surface p-4 text-body-sm text-danger"
            >
              <p className="font-bold">{id.form.errorSummary}:</p>
              <ul className="m-0 list-disc pl-5">
                {errorList.map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <Card elevation="flat" className="flex flex-col gap-4 p-5">
            <h2 className="text-title3 font-bold text-ink">1. Profil penanggung jawab &amp; usaha</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Nama penanggung jawab"
                value={contactName}
                onChange={(e) => {
                  setContactName(e.target.value);
                  if (errors.contactName) setErrors((p) => ({ ...p, contactName: undefined }));
                }}
                placeholder="Nama lengkap"
                autoComplete="name"
                error={errors.contactName}
              />
              <TextField
                label="Jabatan atau peran (opsional)"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="Mis. Pemilik / Kepala Kebun"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Nama usaha atau instansi"
                value={businessName}
                onChange={(e) => {
                  setBusinessName(e.target.value);
                  if (errors.businessName) setErrors((p) => ({ ...p, businessName: undefined }));
                }}
                placeholder="Mis. Nursery Hijau Asri"
                error={errors.businessName}
              />
              <Select
                label="Jenis usaha"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              >
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>

            <TextField
              label="Kota / kabupaten &amp; provinsi"
              value={cityProvince}
              onChange={(e) => {
                setCityProvince(e.target.value);
                if (errors.cityProvince) setErrors((p) => ({ ...p, cityProvince: undefined }));
              }}
              placeholder="Contoh: Banyumas, Jawa Tengah"
              error={errors.cityProvince}
            />
          </Card>

          <Card elevation="flat" className="flex flex-col gap-4 p-5">
            <h2 className="text-title3 font-bold text-ink">2. Rencana kerja sama</h2>
            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
              <legend className="mb-2 text-body-sm font-bold text-ink">
                Kerja sama yang diminati (pilih minimal satu)
              </legend>
              <div className="flex flex-wrap gap-2">
                {COOPERATION_OPTIONS.map((option) => (
                  <Chip
                    key={option}
                    selected={cooperationTypes.includes(option)}
                    onClick={() => toggleCooperation(option)}
                  >
                    {option}
                  </Chip>
                ))}
              </div>
              {errors.cooperationTypes ? (
                <p className="text-body-sm font-semibold text-danger">{errors.cooperationTypes}</p>
              ) : null}
            </fieldset>

            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Perkiraan volume per bulan"
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(e.target.value)}
              >
                {MONTHLY_VOLUME_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>
              <Select
                label="Perkiraan mulai rencana"
                value={startWeek}
                onChange={(e) => setStartWeek(e.target.value)}
              >
                {weeks.map((week) => (
                  <option key={week} value={week}>
                    {week}
                  </option>
                ))}
              </Select>
            </div>

            <Textarea
              label="Pengalaman budidaya atau fasilitas nursery (opsional)"
              value={experienceSummary}
              onChange={(e) => setExperienceSummary(e.target.value)}
              placeholder="Mis. luas naungan / greenhouse, komoditas hias yang pernah dikelola"
            />
          </Card>

          <Card elevation="flat" className="flex flex-col gap-4 p-5">
            <h2 className="text-title3 font-bold text-ink">3. Kontak &amp; persetujuan</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Nomor WhatsApp aktif"
                type="tel"
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp(e.target.value);
                  if (errors.whatsapp) setErrors((p) => ({ ...p, whatsapp: undefined }));
                }}
                placeholder="0812 3456 7890"
                autoComplete="tel"
                error={errors.whatsapp}
              />
              <TextField
                label="Email usaha (opsional)"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="kontak@contoh-usaha.id"
                autoComplete="email"
                error={errors.email}
              />
            </div>

            <Textarea
              label="Alamat lokasi usaha atau kebun"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (errors.address) setErrors((p) => ({ ...p, address: undefined }));
              }}
              placeholder="Jalan / desa, kecamatan, kabupaten atau kota"
              error={errors.address}
            />

            <Textarea
              label="Catatan tambahan (opsional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Pertanyaan mengenai syarat mitra atau pengadaan awal"
            />

            <Checkbox
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (errors.consent) setErrors((p) => ({ ...p, consent: undefined }));
              }}
              error={errors.consent}
              label={
                <span>
                  Saya bersedia dihubungi UPSB dan menyetujui pengolahan data ini sesuai{" "}
                  <Link href="/privasi" className="font-bold text-primary-pressed underline underline-offset-4">
                    Kebijakan Privasi
                  </Link>
                  .
                </span>
              }
            />

            <div className="pt-2">
              <Button type="submit" className="w-full md:w-auto">
                <IconCheck width={20} height={20} />
                <span>Kirim pengajuan kemitraan</span>
              </Button>
            </div>
          </Card>
        </form>

        <aside className="flex flex-col gap-4">
          <Card tone="alt" className="flex flex-col gap-3 p-5">
            <h2 className="text-title3 font-bold text-ink">Prinsip kemitraan UPSB</h2>
            <p className="text-body-sm text-ink-muted">{partnershipPageContent.rightsNote}</p>
            <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-body-sm text-ink-muted">
              <li>Pengajuan dicatat sebagai penjajakan awal (status Baru).</li>
              <li>Diskusi teknis, harga mitra, dan kapasitas lahan dibahas langsung oleh tim UPSB.</li>
              <li>Tidak ada klaim jaminan hasil di luar uji lokasi setempat.</li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
