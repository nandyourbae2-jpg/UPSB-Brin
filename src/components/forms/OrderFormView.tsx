"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Select, Textarea, TextField, Checkbox } from "@/components/ui/Fields";
import { FlowerPoster } from "@/components/ui/FlowerPoster";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { StatusPill } from "@/components/ui/StatusPill";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { IconCheck, IconOrder } from "@/components/icons";
import {
  CUSTOMER_TYPES,
  ORDER_STATUS_META,
  orderPageContent,
  type DemoOrder,
} from "@/content/demo-flows";
import { id } from "@/content/id";
import {
  addDemoOrder,
  buildOrderWhatsAppDraft,
  createOrderReference,
  formatRupiah,
  generateOrderWeeks,
  isValidWhatsapp,
} from "@/lib/demo-store";

interface OrderFormViewProps {
  initialProduct: "pot" | "stek";
  initialVariety?: "fabiola" | "claire";
  whatsappNumber: string | null;
  showIndicativePrices: boolean;
}

type FieldErrors = Partial<
  Record<"varieties" | "quantity" | "customerName" | "whatsapp" | "address" | "consent", string>
>;

const UNIT_PRICE = {
  pot: 11000,
  stek: 2800,
} as const;

export function OrderFormView({
  initialProduct,
  initialVariety,
  whatsappNumber,
  showIndicativePrices,
}: OrderFormViewProps) {
  const { show: showToast } = useToast();
  const weeks = generateOrderWeeks();
  const summaryAlertRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<"fill" | "review" | "done">("fill");
  const [productType, setProductType] = useState<"pot" | "stek">(initialProduct);
  const [varieties, setVarieties] = useState<("fabiola" | "claire")[]>(
    initialVariety ? [initialVariety] : ["fabiola"],
  );
  const [quantity, setQuantity] = useState<number>(initialProduct === "stek" ? 200 : 50);
  const [targetWeek, setTargetWeek] = useState<string>(weeks[0] ?? "");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerType, setCustomerType] = useState<string>(CUSTOMER_TYPES[0]);
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submittedOrder, setSubmittedOrder] = useState<DemoOrder | null>(null);

  const unitLabel = productType === "pot" ? "pot" : "stek";
  const unitPrice = UNIT_PRICE[productType];
  const indicativeTotal = quantity > 0 ? quantity * unitPrice : 0;

  function toggleVariety(v: "fabiola" | "claire") {
    setVarieties((prev) => {
      const next = prev.includes(v) ? prev.filter((item) => item !== v) : [...prev, v];
      return next;
    });
    if (errors.varieties) {
      setErrors((e) => ({ ...e, varieties: undefined }));
    }
  }

  function validateForm(): boolean {
    const nextErrors: FieldErrors = {};
    if (varieties.length === 0) nextErrors.varieties = orderPageContent.errors.varieties;
    if (!Number.isFinite(quantity) || quantity < 1) nextErrors.quantity = orderPageContent.errors.quantity;
    if (customerName.trim().length < 2) nextErrors.customerName = orderPageContent.errors.customerName;
    if (!isValidWhatsapp(whatsapp)) nextErrors.whatsapp = orderPageContent.errors.whatsapp;
    if (address.trim().length < 8) nextErrors.address = orderPageContent.errors.address;
    if (!consent) nextErrors.consent = orderPageContent.errors.consent;

    setErrors(nextErrors);
    const hasErrors = Object.keys(nextErrors).length > 0;
    if (hasErrors) {
      window.requestAnimationFrame(() => summaryAlertRef.current?.focus());
      return false;
    }
    return true;
  }

  function handleReview(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleConfirmSubmit() {
    if (!validateForm()) {
      setStep("fill");
      return;
    }
    const cleanAddress = address.trim();
    const parts = cleanAddress.split(",").map((s) => s.trim()).filter(Boolean);
    const locationSummary = (parts.length >= 2 ? parts.at(-1) : undefined) ?? cleanAddress.slice(0, 32);

    const newOrder: DemoOrder = {
      id: createOrderReference(),
      productType,
      varieties: [...varieties],
      quantity,
      targetWeek,
      customerName: customerName.trim(),
      customerType,
      whatsapp: whatsapp.trim(),
      deliveryMethod,
      locationSummary,
      address: cleanAddress,
      notes: notes.trim(),
      status: "NEW",
      createdAt: new Date().toISOString(),
      isDemoSample: false,
      internalNote: "Dikirim dari pratinjau formulir pemesanan browser ini.",
      history: [
        {
          from: null,
          to: "NEW",
          changedBy: "Formulir Demo",
          changedAt: new Date().toISOString(),
          note: "Permintaan dicatat pada penyimpanan demo browser.",
        },
      ],
    };

    addDemoOrder(newOrder);
    setSubmittedOrder(newOrder);
    setStep("done");
    showToast(`Permintaan ${newOrder.id} dicatat (mode demo).`, "success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleReset() {
    setSubmittedOrder(null);
    setCustomerName("");
    setWhatsapp("");
    setAddress("");
    setNotes("");
    setConsent(false);
    setErrors({});
    setStep("fill");
  }

  const errorEntries = Object.values(errors).filter(Boolean) as string[];

  if (step === "done" && submittedOrder) {
    const waMessage = buildOrderWhatsAppDraft(submittedOrder);
    const statusMeta = ORDER_STATUS_META[submittedOrder.status];
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <Card elevation="raised" className="flex flex-col items-center gap-4 p-6 text-center md:p-8">
          <FlowerPoster variant={submittedOrder.varieties[0] ?? "hero"} label={id.a11y.heroPosterLabel} size="md" />
          <div className="flex flex-wrap items-center justify-center gap-2">
            <StatusPill tone={statusMeta.tone}>{statusMeta.label}</StatusPill>
            <StatusPill tone="neutral">{submittedOrder.id}</StatusPill>
          </div>
          <h1 className="text-title1 font-extrabold text-ink">{orderPageContent.success.title}</h1>
          <p className="max-w-[52ch] text-body text-ink-muted">{orderPageContent.success.body}</p>
          <div className="w-full rounded-md bg-warn-bg p-4 text-left text-body-sm font-semibold text-warn-ink">
            {orderPageContent.success.disclaimer}
          </div>

          <div className="flex w-full flex-col gap-3 rounded-md border border-line bg-surface-alt p-4 text-left text-body-sm">
            <div className="flex justify-between gap-4">
              <span className="text-ink-muted">Produk</span>
              <span className="font-bold text-ink">
                {submittedOrder.productType === "pot" ? "Tanaman pot 12 cm" : "Stek berakar"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-ink-muted">Varietas</span>
              <span className="font-bold text-ink">
                {submittedOrder.varieties.map((v) => (v === "fabiola" ? "Fabiola" : "Claire")).join(" & ")}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-ink-muted">Jumlah &amp; pekan</span>
              <span className="font-bold tabular-nums text-ink">
                {submittedOrder.quantity.toLocaleString("id-ID")} {unitLabel} ({submittedOrder.targetWeek})
              </span>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-3 pt-2">
            <WhatsAppAction whatsappNumber={whatsappNumber} message={waMessage} showFallbackLink={false} />
            <ButtonLink href="/admin" variant="secondary">
              {orderPageContent.labels.toAdminCta}
            </ButtonLink>
            <Button variant="outline" onClick={handleReset}>
              {orderPageContent.labels.newRequestCta}
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
          <StatusPill tone="info">{orderPageContent.badge}</StatusPill>
        </div>
        <h1 className="text-title1 font-extrabold text-ink">{orderPageContent.title}</h1>
        <p className="max-w-[65ch] text-body text-ink-muted">{orderPageContent.subtitle}</p>
        <div className="rounded-lg bg-warn-bg p-4 text-body-sm font-semibold text-warn-ink">
          {orderPageContent.demoNotice}
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2" aria-label="Tahap pengisian formulir">
        <StatusPill tone={step === "fill" ? "info" : "success"}>{orderPageContent.steps.fill}</StatusPill>
        <StatusPill tone={step === "review" ? "info" : "neutral"}>{orderPageContent.steps.review}</StatusPill>
      </div>

      {step === "review" ? (
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px] md:items-start">
          <Card elevation="raised" className="flex flex-col gap-5 p-6">
            <div className="flex items-center gap-2">
              <IconOrder className="text-primary" />
              <h2 className="text-title2 font-bold text-ink">Tinjau ringkasan permintaan</h2>
            </div>

            <dl className="m-0 flex flex-col divide-y divide-line text-body-sm">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-ink-muted">Jenis produk</dt>
                <dd className="m-0 text-right font-bold text-ink">
                  {productType === "pot" ? "Tanaman pot berbunga 12 cm" : "Stek berakar untuk nursery"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-ink-muted">Varietas</dt>
                <dd className="m-0 text-right font-bold text-ink">
                  {varieties.map((v) => (v === "fabiola" ? "Fabiola" : "Claire")).join(" & ")}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-ink-muted">Jumlah &amp; pekan target</dt>
                <dd className="m-0 text-right font-bold tabular-nums text-ink">
                  {quantity.toLocaleString("id-ID")} {unitLabel} — {targetWeek}
                </dd>
              </div>
              {showIndicativePrices ? (
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-ink-muted">Estimasi harga indikatif</dt>
                  <dd className="m-0 text-right font-extrabold tabular-nums text-primary-pressed">
                    Sekitar {formatRupiah(indicativeTotal)}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-ink-muted">Pemesan</dt>
                <dd className="m-0 text-right font-bold text-ink">
                  {customerName} ({customerType})
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-ink-muted">WhatsApp</dt>
                <dd className="m-0 text-right font-bold tabular-nums text-ink">{whatsapp}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-ink-muted">Metode penerimaan</dt>
                <dd className="m-0 text-right font-bold text-ink">
                  {deliveryMethod === "delivery" ? "Dikirim ke alamat" : "Ambil di kebun Baturraden"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-ink-muted">Alamat / tujuan</dt>
                <dd className="m-0 max-w-[36ch] text-right font-semibold text-ink">{address}</dd>
              </div>
              {notes.trim() ? (
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-ink-muted">Catatan</dt>
                  <dd className="m-0 max-w-[36ch] text-right text-ink">{notes}</dd>
                </div>
              ) : null}
            </dl>

            <div className="rounded-md bg-surface-alt p-4 text-body-sm text-ink-muted">
              Belum termasuk ongkos kirim dan bukan janji transaksi. Admin UPSB mengonfirmasi harga akhir,
              ketersediaan, dan jadwal lewat WhatsApp.
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleConfirmSubmit}>
                <IconCheck width={20} height={20} />
                <span>{orderPageContent.labels.submitCta}</span>
              </Button>
              <Button variant="outline" onClick={() => setStep("fill")}>
                {orderPageContent.labels.backToEdit}
              </Button>
            </div>
          </Card>

          <Card tone="alt" className="flex flex-col gap-3 p-5">
            <h2 className="text-title3 font-bold text-ink">{orderPageContent.notesAsideTitle}</h2>
            <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-body-sm text-ink-muted">
              {orderPageContent.notesAsideList.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px] md:items-start">
          <form onSubmit={handleReview} noValidate className="flex flex-col gap-5">
            {errorEntries.length > 0 ? (
              <div
                ref={summaryAlertRef}
                role="alert"
                tabIndex={-1}
                className="flex flex-col gap-1 rounded-lg border border-danger bg-surface p-4 text-body-sm text-danger"
              >
                <p className="font-bold">{id.form.errorSummary}:</p>
                <ul className="m-0 list-disc pl-5">
                  {errorEntries.map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Card elevation="flat" className="flex flex-col gap-5 p-5">
              <SegmentedControl
                legend={orderPageContent.labels.productType}
                name="productType"
                value={productType}
                onChange={(val) => {
                  const next = val === "stek" ? "stek" : "pot";
                  setProductType(next);
                  setQuantity((prev) => (next === "stek" && prev < 100 ? 200 : next === "pot" && prev === 200 ? 50 : prev));
                }}
                options={[
                  {
                    value: "pot",
                    label: showIndicativePrices ? "Pot 12 cm (Rp11.000)" : "Tanaman pot 12 cm",
                  },
                  {
                    value: "stek",
                    label: showIndicativePrices ? "Stek berakar (Rp2.800)" : "Stek berakar",
                  },
                ]}
              />

              <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
                <legend className="mb-2 text-body-sm font-bold text-ink">{orderPageContent.labels.varieties}</legend>
                <div className="flex flex-wrap gap-2">
                  <Chip selected={varieties.includes("fabiola")} onClick={() => toggleVariety("fabiola")}>
                    Fabiola (pink tua, rimbun)
                  </Chip>
                  <Chip selected={varieties.includes("claire")} onClick={() => toggleVariety("claire")}>
                    Claire (pink muda, bunga besar)
                  </Chip>
                </div>
                {errors.varieties ? <p className="text-body-sm font-semibold text-danger">{errors.varieties}</p> : null}
              </fieldset>

              <div className="flex flex-col gap-2">
                <label htmlFor="order-qty" className="text-body-sm font-bold text-ink">
                  {orderPageContent.labels.quantity}
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    aria-label="Kurangi 10"
                    onClick={() => setQuantity((q) => Math.max(1, q - 10))}
                  >
                    -10
                  </Button>
                  <input
                    id="order-qty"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={quantity}
                    onChange={(e) => {
                      const next = Number.parseInt(e.target.value, 10);
                      setQuantity(Number.isNaN(next) ? 0 : next);
                    }}
                    className="min-h-12 w-16 rounded-sm border border-ink-muted bg-surface px-2 text-center text-body font-bold tabular-nums text-ink"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    aria-label="Tambah 10"
                    onClick={() => setQuantity((q) => Math.max(1, q + 10))}
                  >
                    +10
                  </Button>
                  <span className="text-body-sm font-semibold text-ink-muted">{unitLabel}</span>
                </div>
                {errors.quantity ? <p className="text-body-sm font-semibold text-danger">{errors.quantity}</p> : null}
              </div>

              <Select
                label={orderPageContent.labels.targetWeek}
                hint={orderPageContent.labels.weekHint}
                value={targetWeek}
                onChange={(e) => setTargetWeek(e.target.value)}
              >
                {weeks.map((week) => (
                  <option key={week} value={week}>
                    {week}
                  </option>
                ))}
              </Select>
            </Card>

            <Card elevation="flat" className="flex flex-col gap-4 p-5">
              <TextField
                label={orderPageContent.labels.customerName}
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: undefined }));
                }}
                placeholder="Nama lengkap atau nama usaha"
                autoComplete="name"
                error={errors.customerName}
              />

              <Select
                label={orderPageContent.labels.customerType}
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
              >
                {CUSTOMER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>

              <TextField
                label={orderPageContent.labels.whatsapp}
                hint={orderPageContent.labels.whatsappHint}
                type="tel"
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp(e.target.value);
                  if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: undefined }));
                }}
                placeholder="0812 3456 7890"
                autoComplete="tel"
                error={errors.whatsapp}
              />

              <SegmentedControl
                legend={orderPageContent.labels.deliveryMethod}
                name="deliveryMethod"
                value={deliveryMethod}
                onChange={(val) => setDeliveryMethod(val === "pickup" ? "pickup" : "delivery")}
                options={[
                  { value: "delivery", label: "Dikirim ke alamat" },
                  { value: "pickup", label: "Ambil di Baturraden" },
                ]}
              />

              <Textarea
                label={orderPageContent.labels.address}
                hint={deliveryMethod === "pickup" ? orderPageContent.labels.pickupAddressHint : undefined}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                }}
                placeholder="Jalan / desa, kecamatan, kabupaten atau kota, provinsi"
                error={errors.address}
              />

              <Textarea
                label={orderPageContent.labels.notes}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mis. proporsi varietas, preferensi jam hubungi, atau pertanyaan lain"
              />

              <Checkbox
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined }));
                }}
                error={errors.consent}
                label={
                  <span>
                    {orderPageContent.labels.consentPrefix}
                    <Link href="/privasi" className="font-bold text-primary-pressed underline underline-offset-4">
                      {orderPageContent.labels.consentLink}
                    </Link>
                    .
                  </span>
                }
              />
            </Card>

            <Card
              elevation="raised"
              className="flex flex-wrap items-center justify-between gap-4 border-primary bg-surface-alt p-5"
            >
              <div className="flex flex-col gap-1">
                <span className="text-caption text-ink-muted">
                  {productType === "pot" ? "Tanaman pot 12 cm" : "Stek berakar"} —{" "}
                  {varieties.length > 0
                    ? varieties.map((v) => (v === "fabiola" ? "Fabiola" : "Claire")).join(" & ")
                    : "Pilih varietas"}
                </span>
                <span className="text-title3 font-extrabold tabular-nums text-ink">
                  {quantity > 0 ? `${quantity.toLocaleString("id-ID")} ${unitLabel}` : "Isi jumlah"}
                  {showIndicativePrices && indicativeTotal > 0 ? ` · Indikatif ${formatRupiah(indicativeTotal)}` : ""}
                </span>
              </div>
              <Button type="submit">{orderPageContent.labels.reviewCta}</Button>
            </Card>
          </form>

          <aside className="flex flex-col gap-4">
            <Card tone="alt" className="flex flex-col gap-3 p-5">
              <h2 className="text-title3 font-bold text-ink">{orderPageContent.notesAsideTitle}</h2>
              <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-body-sm text-ink-muted">
                {orderPageContent.notesAsideList.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </Card>
            <Card tone="surface" className="flex flex-col gap-2 p-5">
              <h3 className="text-body font-bold text-ink">Butuh kerja sama rutin?</h3>
              <p className="text-body-sm text-ink-muted">
                Untuk rencana pembesaran nursery atau distributor, gunakan formulir pengajuan kemitraan.
              </p>
              <ButtonLink href="/kemitraan" size="sm" variant="outline">
                Ajukan kemitraan
              </ButtonLink>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}
