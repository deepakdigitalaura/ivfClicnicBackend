/* =====================================================================
 * Contact resolver — the single source of truth for phone / email /
 * WhatsApp across the site (Phase 3.5B, Item 1).
 * ---------------------------------------------------------------------
 * Canonical contact values live on the `site-settings` global. Everything
 * that needs a phone/email/WhatsApp value (contact cards, ContactPoint
 * JSON-LD) resolves it HERE instead of duplicating it — so a number is
 * edited in exactly one place. Falls back to the SITE constant so output
 * is byte-identical when the CMS is empty.
 *
 * Pure module (no payload / server-only imports) — safe to call from the
 * server component that builds the props for the client ContactPage.
 * ===================================================================== */
import { SITE } from "@/lib/seo";

/** Contact card delivery channel. `none` = card keeps its own stored value
 *  (e.g. Working Hours); the rest resolve from Site Settings. */
export type ContactChannel = "none" | "phone" | "email" | "whatsapp";

/** Canonical, resolved contact values — the single source of truth. */
export type ContactValues = {
  /** Canonical phone for tel:/schema, e.g. +919712622288. */
  telephone: string;
  /** Formatted phone for display, e.g. +91 97126 22288. */
  telephoneDisplay: string;
  email: string;
  /** WhatsApp digits for wa.me links, e.g. 919712622288. */
  whatsapp: string;
};

/** The subset of the site-settings global this resolver reads. */
export type ContactSource =
  | {
      telephone?: string | null;
      telephoneDisplay?: string | null;
      email?: string | null;
      whatsapp?: string | null;
    }
  | null
  | undefined;

/** Resolve canonical contact values from site-settings, falling back to the
 *  SITE constant per field so output stays stable when the CMS is empty. */
export function resolveContactValues(s?: ContactSource): ContactValues {
  return {
    telephone: s?.telephone || SITE.telephone,
    telephoneDisplay: s?.telephoneDisplay || SITE.telephoneDisplay,
    email: s?.email || SITE.email,
    whatsapp: s?.whatsapp || SITE.whatsapp,
  };
}

/** Resolve a contact card's display value + link from its channel, so cards
 *  never duplicate phone/email/WhatsApp values. `none` (or unset) returns
 *  nothing, leaving the card's own stored value/href in place. */
export function resolveCardChannel(
  channel: ContactChannel | null | undefined,
  c: ContactValues,
): { value?: string; href?: string } {
  switch (channel) {
    case "phone":
      return { value: c.telephoneDisplay, href: `tel:${c.telephone}` };
    case "email":
      return { value: c.email, href: `mailto:${c.email}` };
    case "whatsapp":
      // Display text (e.g. "Chat with our team") stays on the card; only the
      // link is resolved from the canonical WhatsApp number.
      return { href: `https://wa.me/${c.whatsapp}` };
    default:
      return {};
  }
}
