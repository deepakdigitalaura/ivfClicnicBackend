/**
 * Legal/policy page content (Privacy, Terms, Refund, Cookie policies).
 *
 * These were originally seeded into Payload (see scripts/seed/*.json +
 * scripts/seed-legal-pages.mjs) but Payload has since been removed and
 * replaced with Sanity — see src/lib/payload.ts. There is no Sanity schema
 * for generic legal pages yet, so this module serves the same seeded
 * content directly as a code-owned fallback, following the same
 * "code default, Sanity can override later" pattern used for treatments,
 * services and doctors.
 */
import privacyPolicy from "../../scripts/seed/privacy-policy.json";
import termsOfService from "../../scripts/seed/terms-of-service.json";
import refundPolicy from "../../scripts/seed/refund-policy.json";
import cookiePolicy from "../../scripts/seed/cookie-policy.json";

type LegalPageSeo = {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
};

type LegalPageSeed = {
  title: string;
  slug: string;
  hero?: { eyebrow?: string; lead?: string; em?: string; subtitle?: string };
  content?: unknown;
  seo?: LegalPageSeo;
};

const LEGAL_PAGES: Record<string, LegalPageSeed> = {
  "privacy-policy": privacyPolicy as LegalPageSeed,
  "terms-of-service": termsOfService as LegalPageSeed,
  "refund-policy": refundPolicy as LegalPageSeed,
  "cookie-policy": cookiePolicy as LegalPageSeed,
};

// Date these pages were last authored (the seeding commit) — shown as
// "Last updated" on each page.
const LAST_UPDATED = "2026-06-29T00:00:00.000Z";

export const LEGAL_PAGE_SLUGS = Object.keys(LEGAL_PAGES);

export type LegalPage = {
  id: number;
  title: string;
  slug: string;
  hero?: LegalPageSeed["hero"];
  content?: unknown;
  seo?: LegalPageSeo;
  updatedAt: string;
  createdAt: string;
  _status: "published";
};

export function getLegalPage(slug: string): LegalPage | null {
  const seed = LEGAL_PAGES[slug];
  if (!seed) return null;
  return {
    id: 0,
    title: seed.title,
    slug: seed.slug,
    hero: seed.hero,
    content: seed.content,
    seo: seed.seo,
    updatedAt: LAST_UPDATED,
    createdAt: LAST_UPDATED,
    _status: "published",
  };
}
