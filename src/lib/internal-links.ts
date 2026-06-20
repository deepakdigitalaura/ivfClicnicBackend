/* =====================================================================
 * Internal-linking registry — the site's "no dead ends" backbone
 * ---------------------------------------------------------------------
 * One source of truth for cross-page destinations that are referenced from
 * prose, CTAs and cards but whose dedicated page may not be built yet.
 *
 * Each entry carries the CANONICAL `href` the page will live at, plus a
 * `published` flag. While `published: false` the link gracefully falls back
 * to the nearest live anchor (so there is never a broken/placeholder URL in
 * the markup). The moment the real page ships we flip one boolean and every
 * reference across the entire site — hero copy, CTAs, related sections —
 * starts pointing at it automatically. No content edits, no dead ends.
 *
 * This is what makes the Suraksha Kavach CTA (and every other "future page"
 * reference) seamless to switch on later: add the page, set published=true.
 * ===================================================================== */

export type SiteDestination = {
  key: string;
  /** Canonical display text — also auto-linked in prose via <Linkify>. */
  label: string;
  /** Canonical URL the (future) standalone page will live at. */
  href: string;
  /** True once the dedicated page actually exists. Gates the live link. */
  published: boolean;
  /** Where to point until `published` flips true (a live anchor/section). */
  fallback?: string;
  /** Extra phrases that should also auto-link to this destination in prose. */
  aliases?: string[];
};

/**
 * Registry of destinations that are referenced before (or independently of)
 * their dedicated page existing. Flip `published` to true — and optionally
 * confirm `href` — when each page is built.
 */
export const SITE_DESTINATIONS: Record<string, SiteDestination> = {
  "suraksha-kavach": {
    key: "suraksha-kavach",
    label: "Suraksha Kavach",
    href: "/suraksha-kavach",
    published: true,
    fallback: "/#suraksha",
    aliases: ["Suraksha Kavach Package", "Suraksha Kavach programme", "Suraksha Kavach program"],
  },
  blog: {
    key: "blog",
    label: "Blog",
    href: "/blog",
    published: true, // Phase 3: /blog hub is live.
    fallback: "/#blogs",
  },
  "success-stories": {
    key: "success-stories",
    label: "Success Stories",
    href: "/success-stories",
    published: false,
    fallback: "/#stories",
  },
};

/** Resolve a destination's live href (published page, else fallback). */
export function destinationHref(key: string): string {
  const d = SITE_DESTINATIONS[key];
  if (!d) return "/";
  return d.published ? d.href : d.fallback ?? d.href;
}

/** Whether a destination's dedicated page is live yet. */
export const isPublished = (key: string): boolean => !!SITE_DESTINATIONS[key]?.published;

export const destination = (key: string): SiteDestination | undefined =>
  SITE_DESTINATIONS[key];
