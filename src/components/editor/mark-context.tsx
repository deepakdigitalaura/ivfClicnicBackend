"use client";

/* =====================================================================
 * Mark mode — lightweight "click-to-select from the live preview".
 * ---------------------------------------------------------------------
 * Used inside the admin Homepage editor's preview iframe. Unlike the old
 * Payload EditProvider (full contentEditable inline editing), this only makes
 * each <Editable> element a CLICK TARGET: hovering shows a dotted outline,
 * clicking postMessages the field path up to the parent editor, which opens
 * and focuses that field in its side panel. No contentEditable, no Payload.
 *
 * useMark() returns null on the public site (no provider) → <Editable> renders
 * bare children, so the public DOM stays byte-identical.
 * ===================================================================== */

import { createContext, useContext, useCallback, type ReactNode } from "react";

type MarkCtx = { markMode: true; select: (path: string) => void };

const Ctx = createContext<MarkCtx | null>(null);
export const useMark = (): MarkCtx | null => useContext(Ctx);

export function MarkProvider({ children }: { children: ReactNode }) {
  const select = useCallback((path: string) => {
    if (typeof window !== "undefined" && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "bfi-mark-select", path }, window.location.origin);
    }
  }, []);
  return <Ctx.Provider value={{ markMode: true, select }}>{children}</Ctx.Provider>;
}
