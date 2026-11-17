import { cn } from "@/lib/cn";

interface Option {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  legend: string;
  name: string;
  options: readonly Option[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/** Pilihan satu dari beberapa. Memakai radio native, jadi keyboard dan pembaca layar bekerja tanpa kode tambahan. */
export function SegmentedControl({ legend, name, options, defaultValue, value, onChange, className }: SegmentedControlProps) {
  return (
    <fieldset className={cn("m-0 min-w-0 border-0 p-0", className)}>
      <legend className="mb-2 text-body-sm font-bold text-ink-muted">{legend}</legend>
      <div className="inline-flex w-full rounded-md bg-surface-alt p-1">
        {options.map((o) => (
          <label key={o.value} className="relative flex-1">
            <input
              type="radio"
              name={name}
              value={o.value}
              className="peer sr-only"
              {...(value !== undefined
                ? { checked: value === o.value, onChange: () => onChange?.(o.value) }
                : { defaultChecked: defaultValue === o.value, onChange: () => onChange?.(o.value) })}
            />
            <span className="flex min-h-10 cursor-pointer items-center justify-center rounded-sm px-3 text-body-sm font-bold text-ink-muted transition-colors duration-(--motion-fast) peer-checked:bg-surface peer-checked:text-ink peer-checked:shadow-e1 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus">
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
