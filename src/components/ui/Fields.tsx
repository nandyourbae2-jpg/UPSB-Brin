import { useId } from "react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { IconChevronDown } from "@/components/icons";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/cn";

interface FieldBase {
  label: string;
  hint?: string;
  error?: string;
}

const control =
  "w-full rounded-sm border bg-surface px-4 text-body text-ink placeholder:text-ink-muted transition-colors duration-(--motion-fast) disabled:opacity-60";
// Batas kolom isian memakai ink-muted (kontras ≥ 3:1, WCAG 1.4.11), bukan line yang hanya dekoratif.
const borderFor = (error?: string): string => (error ? "border-danger" : "border-ink-muted hover:border-ink");

function Shell({
  id,
  label,
  hint,
  error,
  children,
}: FieldBase & { id: string; children: (aria: { id: string; "aria-describedby": string; "aria-invalid": boolean }) => ReactNode }) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : "", errorId].filter(Boolean).join(" ");
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-body-sm font-bold text-ink">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="text-body-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
      {children({ id, "aria-describedby": describedBy, "aria-invalid": Boolean(error) })}
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}

export function TextField({ label, hint, error, className, ...rest }: FieldBase & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error}>
      {(aria) => <input {...aria} className={cn(control, "min-h-12", borderFor(error), className)} {...rest} />}
    </Shell>
  );
}

export function Textarea({ label, hint, error, className, ...rest }: FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error}>
      {(aria) => <textarea {...aria} rows={4} className={cn(control, "min-h-12 py-3", borderFor(error), className)} {...rest} />}
    </Shell>
  );
}

export function Select({
  label,
  hint,
  error,
  className,
  children,
  ...rest
}: FieldBase & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error}>
      {(aria) => (
        <div className="relative">
          <select {...aria} className={cn(control, "min-h-12 appearance-none pr-12", borderFor(error), className)} {...rest}>
            {children}
          </select>
          <IconChevronDown className="pointer-events-none absolute top-3 right-4 text-ink-muted" />
        </div>
      )}
    </Shell>
  );
}

export function Checkbox({
  label,
  error,
  className,
  ...rest
}: { label: ReactNode; error?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex min-h-12 cursor-pointer items-center gap-3 text-body text-ink">
        <input
          id={id}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cn("size-6 shrink-0 accent-primary", className)}
          {...rest}
        />
        <span>{label}</span>
      </label>
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}
