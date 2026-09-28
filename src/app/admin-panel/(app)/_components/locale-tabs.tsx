"use client";
import type { Locale } from "@/lib/i18n";

const TABS: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिंदी" },
  { value: "gu", label: "ગુજરાતી" },
];

/** Pill switcher for which locale's text the editor below is showing/editing.
 *  Purely local UI state — the parent editor passes the active locale into
 *  its field getters/setters (see lib/i18n's getLocalized/setLocalized). */
export function LocaleTabs({ locale, onChange }: { locale: Locale; onChange: (l: Locale) => void }) {
  return (
    <div className="admin-locale-tabs">
      {TABS.map((t) => (
        <button
          key={t.value}
          type="button"
          className={locale === t.value ? "active" : ""}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
