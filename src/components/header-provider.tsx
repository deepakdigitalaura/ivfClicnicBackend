"use client";

/* =====================================================================
 * Header context — carries the server-resolved HeaderData across the
 * client boundary to <SiteHeader> (Phase 3.5B, Item 4).
 * ---------------------------------------------------------------------
 * <SiteHeader> is a client component rendered inside the per-page client
 * trees, so it can't fetch the global itself. The (server) root layout
 * resolves it once via getHeader() and provides it here; <SiteHeader> reads
 * it with useHeader(), falling back to HEADER_DEFAULTS if a provider is ever
 * absent (mirrors src/components/footer-provider.tsx).
 * ===================================================================== */
import { createContext, useContext } from "react";
import { HEADER_DEFAULTS, type HeaderData } from "@/lib/header";

const HeaderContext = createContext<HeaderData | null>(null);

export function HeaderProvider({
  value,
  children,
}: {
  value: HeaderData;
  children: React.ReactNode;
}) {
  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
}

/** Header content from context, or the typed defaults if no provider is present. */
export function useHeader(): HeaderData {
  return useContext(HeaderContext) ?? HEADER_DEFAULTS;
}
