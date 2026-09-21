export type Locale = "en" | "hi" | "gu";
export type LocalizedField = string | { en?: string; hi?: string; gu?: string } | null | undefined;

/** Reads a field that may be a plain string (not yet migrated to {en,hi,gu})
 *  or a locale object, falling back to English, then undefined. */
export function pickLocale(field: LocalizedField, locale: Locale): string | undefined {
  if (field == null) return undefined;
  if (typeof field === "string") return field || undefined;
  return field[locale] || field.en || undefined;
}
