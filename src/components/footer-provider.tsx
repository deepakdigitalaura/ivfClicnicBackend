"use client";

/* =====================================================================
 * Footer context — carries the server-resolved FooterData across the
 * client boundary to <Footer> (Phase 3.5B, Item 3).
 * ---------------------------------------------------------------------
 * The footer lives deep inside the per-page CLIENT components, so it can't
 * fetch the global itself. The (server) root layout resolves it once via
 * getFooter() and provides it here; <Footer> reads it with useFooter(),
 * falling back to FOOTER_DEFAULTS if a provider is ever absent.
 * ===================================================================== */
import { createContext, useContext } from "react";
import { FOOTER_DEFAULTS, type FooterData } from "@/lib/footer";

const FooterContext = createContext<FooterData | null>(null);

export function FooterProvider({
  value,
  children,
}: {
  value: FooterData;
  children: React.ReactNode;
}) {
  return <FooterContext.Provider value={value}>{children}</FooterContext.Provider>;
}

/** Footer content from context, or the typed defaults if no provider is present. */
export function useFooter(): FooterData {
  return useContext(FooterContext) ?? FOOTER_DEFAULTS;
}
