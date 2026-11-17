"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { IconAlert, IconCheck, IconInfo } from "@/components/icons";
import { Button } from "@/components/ui/Button";

type Tone = "info" | "success" | "error";
interface ToastItem {
  key: number;
  tone: Tone;
  message: string;
}
interface ToastApi {
  show: (message: string, tone?: Tone) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const icons = { info: IconInfo, success: IconCheck, error: IconAlert } as const;
const toneClass: Record<Tone, string> = {
  info: "text-primary",
  success: "text-leaf",
  error: "text-danger",
};

const AUTO_DISMISS_MS = 6000;

export function ToastProvider({ children, closeLabel }: { children: ReactNode; closeLabel: string }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((key: number) => setItems((prev) => prev.filter((t) => t.key !== key)), []);
  const show = useCallback((message: string, tone: Tone = "info") => {
    counter.current += 1;
    const key = counter.current;
    setItems((prev) => [...prev, { key, tone, message }]);
  }, []);
  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 px-4"
        style={{ paddingBottom: "calc(var(--layout-bottomnav-h) + env(safe-area-inset-bottom) + var(--space-4))" }}
      >
        {items.map((t) => (
          <ToastRow key={t.key} item={t} closeLabel={closeLabel} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastRow({ item, closeLabel, onDismiss }: { item: ToastItem; closeLabel: string; onDismiss: (key: number) => void }) {
  const Icon = icons[item.tone];
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(item.key), AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [item.key, onDismiss]);
  return (
    <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-lg border border-line bg-surface p-3 shadow-e3">
      <Icon className={toneClass[item.tone]} />
      <p className="min-w-0 flex-1 text-body-sm text-ink">{item.message}</p>
      <Button size="sm" variant="outline" onClick={() => onDismiss(item.key)}>
        {closeLabel}
      </Button>
    </div>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam ToastProvider.");
  return ctx;
}
