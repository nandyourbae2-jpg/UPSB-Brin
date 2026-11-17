/**
 * Pencatat event pengalaman 3D (PRD §12 v2.0). Tanpa data pribadi (PII).
 * Pada M3 mencatat di window.__upsbAnalyticsBuffer (jika test/staging) atau console.debug,
 * sebelum terhubung ke penyedia analitik di M7.
 */
export type Analytics3DEvent =
  | { name: "view_explorer"; props: { entry: "hero" | "jelajah" | "varietas" } }
  | { name: "tap_flower_part"; props: { partId: string; input: "touch" | "mouse" | "keyboard" } }
  | { name: "change_variety_3d"; props: { variety: "fabiola" | "claire" } }
  | { name: "cta_from_part"; props: { partId: string } }
  | { name: "fallback_2d_shown"; props: { reason: "nowebgl" | "lowmem" | "savedata" | "error" | "manual" } }
  | { name: "fps_degrade"; props: { level: 1 | 2 } };

export function track3DEvent(event: Analytics3DEvent): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { __upsbAnalytics?: Analytics3DEvent[] };
  if (Array.isArray(w.__upsbAnalytics)) {
    w.__upsbAnalytics.push(event);
  }
}
