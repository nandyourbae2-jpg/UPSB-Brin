"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/DialogAndSheet";
import { StatusPill } from "@/components/ui/StatusPill";
import { explorerStrings } from "@/content/explorer";
import { track3DEvent } from "@/lib/analytics-stub";
import type { FlowerPartData } from "@/lib/flower-data";

interface PartInfoSheetProps {
  part: FlowerPartData | null;
  parts: readonly FlowerPartData[];
  onClose: () => void;
  onSelectPart: (partId: string) => void;
}

/**
 * Lembar info bagian bunga (Rule 02 & FIX-06):
 * - Ponsel: bottom sheet 40% dapat diperluas ke 85%.
 * - Desktop: panel kanan 360 px.
 * - Menampilkan judul, nama latin, ringkasan, detail, status verifikasi, CTA, dan Sebelumnya/Berikutnya.
 */
export function PartInfoSheet({ part, parts, onClose, onSelectPart }: PartInfoSheetProps) {
  const [tall, setTall] = useState(false);

  const currentIndex = part ? parts.findIndex((p) => p.id === part.id) : -1;
  const prevPart = currentIndex >= 0 && parts.length > 1 ? parts[(currentIndex - 1 + parts.length) % parts.length] : null;
  const nextPart = currentIndex >= 0 && parts.length > 1 ? parts[(currentIndex + 1) % parts.length] : null;

  return (
    <BottomSheet
      open={Boolean(part)}
      onClose={() => {
        setTall(false);
        onClose();
      }}
      title={part?.title ?? ""}
      closeLabel={explorerStrings.controls.closeSheet}
      desktopMode="side-panel"
      tall={tall}
      headerExtra={
        part ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-body-sm italic text-ink-muted">{part.latin}</span>
            <StatusPill tone={part.verified ? "success" : "warn"}>
              {part.verified ? explorerStrings.verifiedSourceNote : explorerStrings.stagingSourceNote}
            </StatusPill>
          </div>
        ) : null
      }
    >
      {part ? (
        <div className="flex flex-col gap-4">
          <div className="md:hidden">
            <Button variant="outline" size="sm" onClick={() => setTall((v) => !v)}>
              {tall ? explorerStrings.controls.collapseSheet : explorerStrings.controls.expandSheet}
            </Button>
          </div>

          <p className="text-title3 font-bold text-ink">{part.summary}</p>
          <p className="max-w-[65ch] text-body-sm text-ink-muted">{part.detail}</p>

          {part.needsTeamConfirmation ? (
            <p className="rounded-md bg-warn-bg p-3 text-caption text-warn-ink">{part.needsTeamConfirmation}</p>
          ) : null}

          {part.cta ? (
            <div className="self-start">
              <ButtonLink
                href={part.cta.href}
                onClick={() => track3DEvent({ name: "cta_from_part", props: { partId: part.id } })}
              >
                {part.cta.label}
              </ButtonLink>
            </div>
          ) : null}

          <div className="flex flex-wrap justify-between gap-2 border-t border-line pt-3">
            <Button
              variant="outline"
              size="sm"
              disabled={!prevPart}
              onClick={() => prevPart && onSelectPart(prevPart.id)}
            >
              {explorerStrings.controls.previousPart}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!nextPart}
              onClick={() => nextPart && onSelectPart(nextPart.id)}
            >
              {explorerStrings.controls.nextPart}
            </Button>
          </div>

          <p className="text-caption text-ink-muted">{explorerStrings.illustrativeBanner}</p>
        </div>
      ) : null}
    </BottomSheet>
  );
}
