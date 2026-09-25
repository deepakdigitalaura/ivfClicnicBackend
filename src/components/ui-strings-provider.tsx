"use client";
import { createContext, useContext } from "react";
import { ui } from "@/lib/ui-strings";
import type { Locale } from "@/lib/i18n";

const LocaleCtx = createContext<Locale>("en");

export const UiLocaleProvider = ({ locale, children }: { locale: Locale; children: React.ReactNode }) => (
  <LocaleCtx.Provider value={locale}>{children}</LocaleCtx.Provider>
);

/** Returns t(englishKey) → string in the current locale (English if no provider/translation). */
export function useT() {
  const locale = useContext(LocaleCtx);
  return (key: string) => ui(key, locale);
}

/** Inline text form of useT for JSX children: <T k="Learn more" /> */
export const T = ({ k }: { k: string }) => <>{useT()(k)}</>;
