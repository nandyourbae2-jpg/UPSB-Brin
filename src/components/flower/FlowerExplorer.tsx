"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { HERO_FEATURED_PARTS } from "@/3d/anchors";
import type { Variety3D } from "@/3d/ProceduralFlower";
import { Flower2DFallback } from "@/components/flower/Flower2DFallback";
import { PartChips } from "@/components/flower/PartChips";
import { PartInfoSheet } from "@/components/flower/PartInfoSheet";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { StatusPill } from "@/components/ui/StatusPill";
import { explorerStrings } from "@/content/explorer";
import { track3DEvent } from "@/lib/analytics-stub";
import { cn } from "@/lib/cn";
import type { FlowerPartData } from "@/lib/flower-data";

const FlowerScene = dynamic(() => import("@/3d/FlowerScene").then((m) => m.FlowerScene), {
  ssr: false,
});

type FallbackReason = "nowebgl" | "lowmem" | "savedata" | "error" | "manual";

interface EnvCapability {
  ready: boolean;
  fallback: FallbackReason | null;
  maxDpr: number;
}

const SERVER_CAP: EnvCapability = { ready: false, fallback: null, maxDpr: 2 };
let cachedClientCap: EnvCapability | undefined;

function detectCapability(): EnvCapability {
  if (typeof window === "undefined") return SERVER_CAP;
  const params = new URLSearchParams(window.location.search);
  if (params.get("mode") === "2d") {
    return { ready: true, fallback: "manual", maxDpr: 1.5 };
  }
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) {
    return { ready: true, fallback: "savedata", maxDpr: 1.5 };
  }
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) {
    return { ready: true, fallback: "lowmem", maxDpr: 1.5 };
  }

  let hasWebGL = false;
  try {
    const canvas = document.createElement("canvas");
    hasWebGL = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    hasWebGL = false;
  }
  if (!hasWebGL) {
    return { ready: true, fallback: "nowebgl", maxDpr: 1.5 };
  }

  const weakDevice = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  return { ready: true, fallback: null, maxDpr: weakDevice ? 1.5 : 2 };
}

function getClientCapability(): EnvCapability {
  if (!cachedClientCap) cachedClientCap = detectCapability();
  return cachedClientCap;
}

const noopSubscribe = () => () => {};

function subscribeReducedMotion(cb: () => void): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

class CanvasErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

interface FlowerExplorerProps {
  variant: "hero" | "full";
  parts: readonly FlowerPartData[];
  initialVariety?: Variety3D;
  initialPartId?: string | null;
}

/**
 * Pengalaman bunga 3D + cadangan 2D SVG + jalur keyboard PartChips (XP-01..XP-07).
 */
export function FlowerExplorer({
  variant,
  parts,
  initialVariety = "fabiola",
  initialPartId = null,
}: FlowerExplorerProps) {
  const capability = useSyncExternalStore(noopSubscribe, getClientCapability, () => SERVER_CAP);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);

  const [variety, setVariety] = useState<Variety3D>(initialVariety);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(initialPartId);
  const [manualMode, setManualMode] = useState<"auto" | "2d" | "3d">("auto");
  const [runtimeError, setRuntimeError] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  const visibleParts = useMemo(() => {
    if (variant === "hero") {
      const featured = parts.filter((p) => (HERO_FEATURED_PARTS as readonly string[]).includes(p.id));
      return featured.slice(0, 3);
    }
    return parts;
  }, [parts, variant]);

  const fallbackReason: FallbackReason | null = runtimeError
    ? "error"
    : manualMode === "2d"
      ? "manual"
      : manualMode === "3d"
        ? capability.fallback === "manual"
          ? null
          : capability.fallback
        : capability.fallback;

  const show2D = !capability.ready || Boolean(fallbackReason);

  useEffect(() => {
    track3DEvent({ name: "view_explorer", props: { entry: variant === "hero" ? "hero" : "jelajah" } });
  }, [variant]);

  useEffect(() => {
    if (capability.ready && fallbackReason) {
      track3DEvent({ name: "fallback_2d_shown", props: { reason: fallbackReason } });
    }
  }, [capability.ready, fallbackReason]);

  const handleSelectPart = useCallback((partId: string, input: "mouse" | "touch" | "keyboard") => {
    setSelectedPartId(partId);
    track3DEvent({ name: "tap_flower_part", props: { partId, input } });
  }, []);

  function handleVarietyChange(next: string) {
    if (next !== "fabiola" && next !== "claire") return;
    setVariety(next);
    track3DEvent({ name: "change_variety_3d", props: { variety: next } });
  }

  const selectedPart = useMemo(() => visibleParts.find((p) => p.id === selectedPartId) ?? null, [visibleParts, selectedPartId]);

  const stage = (
    <div
      className={cn(
        "relative w-full min-w-0 overflow-hidden rounded-xl border border-line bg-surface-alt",
        variant === "hero" ? "hero-flower-stage" : "h-full min-h-16",
      )}
      style={variant === "full" ? { height: "min(62vh, 520px)" } : undefined}
    >
      {show2D ? (
        <Flower2DFallback
          variety={variety}
          parts={visibleParts}
          selectedPartId={selectedPartId}
          label={explorerStrings.canvasDescription}
          onSelectPart={(id, input) => handleSelectPart(id, input)}
        />
      ) : (
        <CanvasErrorBoundary onError={() => setRuntimeError(true)}>
          <FlowerScene
            variety={variety}
            parts={visibleParts}
            selectedPartId={selectedPartId}
            reducedMotion={reducedMotion}
            resetSignal={resetSignal}
            maxDprCap={capability.maxDpr}
            ariaLabel={explorerStrings.canvasDescription}
            onSelectPart={(id, input) => handleSelectPart(id, input)}
            onFpsDegrade={(level) => track3DEvent({ name: "fps_degrade", props: { level } })}
            onWebGLError={() => setRuntimeError(true)}
          />
        </CanvasErrorBoundary>
      )}
    </div>
  );

  if (variant === "hero") {
    return (
      <div className="flex flex-col items-center gap-3">
        {stage}
        <p className="text-center text-caption">{explorerStrings.illustrativeBanner}</p>
        {visibleParts.length > 0 ? (
          <PartChips
            parts={visibleParts}
            selectedPartId={selectedPartId}
            label={explorerStrings.controls.partsHeading}
            onSelect={(id) => handleSelectPart(id, "keyboard")}
          />
        ) : null}
        <ButtonLink href="/jelajah" size="sm" variant="secondary">
          {explorerStrings.controls.exploreAll}
        </ButtonLink>
        <PartInfoSheet
          part={selectedPart}
          parts={visibleParts}
          onClose={() => setSelectedPartId(null)}
          onSelectPart={(id) => handleSelectPart(id, "keyboard")}
        />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-lg border border-line bg-surface p-4">
        <div className="w-full min-w-0 md:flex-1" style={{ maxWidth: "320px" }}>
          <SegmentedControl
            legend={explorerStrings.controls.varietyLegend}
            name="explorer-variety"
            value={variety}
            onChange={handleVarietyChange}
            options={[
              { value: "fabiola", label: "Fabiola" },
              { value: "claire", label: "Claire" },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!show2D ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedPartId(null);
                setResetSignal((n) => n + 1);
              }}
            >
              {explorerStrings.controls.resetView}
            </Button>
          ) : null}
          {!capability.fallback || capability.fallback === "manual" ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setManualMode(show2D ? "3d" : "2d")}
            >
              {show2D ? explorerStrings.controls.switchTo3D : explorerStrings.controls.switchTo2D}
            </Button>
          ) : null}
        </div>
      </div>

      {fallbackReason && fallbackReason !== "manual" ? (
        <div className="flex flex-wrap items-center gap-2 rounded-md bg-warn-bg p-3 text-body-sm text-warn-ink">
          <StatusPill tone="warn">Mode 2D</StatusPill>
          <span>{explorerStrings.fallbackNotice[fallbackReason]}</span>
        </div>
      ) : null}

      {parts.length === 0 ? (
        <div className="rounded-md bg-warn-bg p-4 text-body-sm text-warn-ink">
          {explorerStrings.productionUnverifiedNotice}
        </div>
      ) : null}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-[260px_minmax(0,1fr)] md:items-start">
        <aside aria-label={explorerStrings.controls.partsHeading} className="order-2 flex min-w-0 flex-col gap-3 md:order-1">
          <h2 className="text-title3 font-bold text-ink">{explorerStrings.controls.partsHeading}</h2>
          <PartChips
            parts={visibleParts}
            selectedPartId={selectedPartId}
            label={explorerStrings.controls.partsHeading}
            onSelect={(id) => handleSelectPart(id, "keyboard")}
          />
          <p className="text-caption text-ink-muted">{explorerStrings.illustrativeBanner}</p>
        </aside>

        <div className="order-1 flex min-w-0 flex-col gap-2 md:order-2">
          {stage}
          <p className="text-caption text-ink-muted">{explorerStrings.illustrativeBanner}</p>
        </div>
      </div>

      <PartInfoSheet
        part={selectedPart}
        parts={visibleParts}
        onClose={() => setSelectedPartId(null)}
        onSelectPart={(id) => handleSelectPart(id, "keyboard")}
      />
    </div>
  );
}
