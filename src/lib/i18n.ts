export type Locale = "en" | "hi" | "gu";
export type LocalizedField = string | { en?: string; hi?: string; gu?: string } | null | undefined;

/** Reads a field that may be a plain string (not yet migrated to {en,hi,gu})
 *  or a locale object, falling back to English, then undefined. */
export function pickLocale(field: LocalizedField, locale: Locale): string | undefined {
  if (field == null) return undefined;
  if (typeof field === "string") return field || undefined;
  return field[locale] || field.en || undefined;
}

/** Admin-editor read: the raw value for one locale, no English fallback —
 *  an empty hi/gu tab should show blank (untranslated), not a copy of English. */
export function getLocalized(field: LocalizedField, locale: Locale): string {
  if (field == null) return "";
  if (typeof field === "string") return locale === "en" ? field : "";
  return field[locale] ?? "";
}

/** Admin-editor write: sets one locale's value, preserving the others. Stays a
 *  plain string (back-compat, matches untouched fields elsewhere in the doc)
 *  when only English has ever been set; upgrades to {en,hi,gu} once a second
 *  locale is written. */
export function setLocalized(field: LocalizedField, locale: Locale, value: string): LocalizedField {
  if (locale === "en" && (field == null || typeof field === "string")) return value;
  const obj = typeof field === "string" ? { en: field } : { ...(field ?? {}) };
  obj[locale] = value;
  return obj;
}
