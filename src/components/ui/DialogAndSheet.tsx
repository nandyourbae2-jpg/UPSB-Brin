"use client";

import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { IconClose } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel?: string;
  /** "modal": dialog di tengah pada desktop; "side-panel": panel kanan 360 px pada desktop (M3). */
  desktopMode?: "modal" | "side-panel";
  tall?: boolean;
  headerExtra?: ReactNode;
  children: ReactNode;
}

/**
 * BottomSheet di ponsel, Dialog atau panel kanan di desktop (FIX-06).
 * Menjalankan focus trap, menutup dengan Esc atau klik latar, dan mengembalikan fokus ke pemicu saat tutup.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  closeLabel = "Tutup",
  desktopMode = "modal",
  tall = false,
  headerExtra,
  children,
}: SheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Fokuskan panel atau elemen fokus pertama setelah terbuka.
    const panel = panelRef.current;
    const timer = window.requestAnimationFrame(() => {
      if (!panel) return;
      const first = panel.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel).focus();
    });

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el.getClientRects().length > 0,
      );
      if (nodes.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const firstEl = nodes[0]!;
      const lastEl = nodes[nodes.length - 1]!;
      if (e.shiftKey && (document.activeElement === firstEl || document.activeElement === panel)) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      if (triggerRef.current && triggerRef.current.isConnected) {
        triggerRef.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  const desktopWrap =
    desktopMode === "side-panel"
      ? "items-end justify-center md:items-stretch md:justify-end"
      : "items-end justify-center md:items-center md:p-4";

  const desktopPanel =
    desktopMode === "side-panel"
      ? "w-full rounded-t-xl md:h-full md:max-h-full md:rounded-none md:rounded-l-xl md:border-l"
      : "w-full max-w-lg rounded-t-xl md:rounded-xl";

  return (
    <div
      className={cn("sheet-backdrop fixed inset-0 z-50 flex", desktopWrap)}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "sheet-panel-mobile flex flex-col gap-4 overflow-y-auto border-t border-line bg-surface p-5 text-ink shadow-e3 focus:outline-none",
          desktopPanel,
        )}
        style={{
          ...(desktopMode === "side-panel" ? { maxWidth: "min(100vw, 360px)" } : {}),
          minHeight: tall ? "85vh" : undefined,
          paddingBottom: "calc(env(safe-area-inset-bottom) + var(--space-5))",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h2 id={titleId} className="text-title2 font-extrabold text-ink">
              {title}
            </h2>
            {headerExtra}
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <IconClose width={16} height={16} />
            <span>{closeLabel}</span>
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
