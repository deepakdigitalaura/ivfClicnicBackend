export type Locale = "en" | "hi" | "gu";
export type LocalizedField = string | { en?: string; hi?: string; gu?: string } | null | undefined;

/** Routes that exist under /hi and /gu (see src/app/(frontend)/hi|gu). Keep in
 *  sync with those directories — a route not listed here has no translated
 *  page, so linking it under /hi or /gu would 404. */
const LOCALIZED_ROUTE_ROOTS = ["/", "/about-bfi", "/contact", "/treatments", "/calculators"];
// Category hubs live under /treatments/ but have no hi/gu route yet (would 404).
const UNLOCALIZED_HUBS = ["/treatments/male-infertility", "/treatments/female-infertility", "/treatments/advanced-fertility-techniques"];

/** Prefixes a nav href with /hi or /gu when a translated page exists for it,
 *  leaving external links, hashes, and untranslated routes untouched. */
export function localizeNavHref(href: string, locale: Locale): string {
  if (locale === "en" || !href.startsWith("/") || href.startsWith("//")) return href;
  if (UNLOCALIZED_HUBS.some((h) => href === h || href.startsWith(`${h}/`) || href.startsWith(`${h}#`))) return href;
  const isLocalized = LOCALIZED_ROUTE_ROOTS.some(
    (root) => href === root || href.startsWith(root === "/" ? "/#" : `${root}/`) || href.startsWith(`${root}#`),
  );
  if (!isLocalized) return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

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
