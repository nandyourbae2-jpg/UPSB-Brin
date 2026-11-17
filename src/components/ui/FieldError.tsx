import type { ReactNode } from "react";

/**
 * Pesan error: menjelaskan masalah dan cara memperbaiki. Wadah selalu ada di DOM
 * dan berupa live region polite, supaya pembaca layar membacakan perubahan (FIX-07).
 */
export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  return (
    <p id={id} aria-live="polite" className={children ? "mt-1 text-body-sm font-bold text-danger" : "hidden"}>
      {children}
    </p>
  );
}
