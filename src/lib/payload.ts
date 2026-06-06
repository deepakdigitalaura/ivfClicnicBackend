/* =====================================================================
 * Server-side Payload access (local API).
 * ---------------------------------------------------------------------
 * Payload's local API talks to Postgres directly — server only, never the
 * client. The instance is memoised so repeated calls in one runtime reuse a
 * single connection pool. Used by server components / generateMetadata to
 * read CMS content; the existing templates stay client components and receive
 * the data as props.
 * ===================================================================== */
import { getPayload, type Payload } from "payload";
import config from "@payload-config";
import type { Page, Config } from "@/payload-types";
import type { SiteIdentity } from "@/lib/seo";

let cached: Promise<Payload> | null = null;

export function payloadClient(): Promise<Payload> {
  if (!cached) cached = getPayload({ config });
  return cached;
}

/**
 * Fetch a single Page by slug. Returns null if not found (caller decides the
 * fallback). Public/unauthenticated context → access control returns only
 * published docs, so drafts never leak to the live site.
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const payload = await payloadClient();
  const res = await payload.find({
    collection: "pages",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1, // resolve ogImage upload relation
  });
  return res.docs[0] ?? null;
}

/**
 * Fetch a global by slug. Returns null on any error (e.g. table not yet
 * pushed) so callers fall back to their typed defaults — keeps the site
 * rendering during the migration.
 */
export async function getGlobalSafe<S extends keyof Config["globals"]>(
  slug: S,
): Promise<Config["globals"][S] | null> {
  try {
    const payload = await payloadClient();
    return (await payload.findGlobal({ slug })) as Config["globals"][S];
  } catch {
    return null;
  }
}

/**
 * Map the `site-settings` global to the pure SiteIdentity shape the schema
 * builders consume. Returns undefined if the global is unavailable, so
 * siteGraph() falls back to the SITE constant (byte-identical output).
 */
export async function getSiteIdentity(): Promise<SiteIdentity | undefined> {
  const s = await getGlobalSafe("site-settings");
  if (!s) return undefined;
  return {
    name: s.brandName,
    alternateName: s.alternateName,
    legalName: s.legalName,
    logo: s.logoUrl,
    foundingDate: s.foundingDate,
    telephone: s.telephone,
    email: s.email,
    address: s.address ?? null,
    awards: s.awards?.map((a) => a.award).filter(Boolean) ?? null,
    knowsAbout: s.knowsAbout?.map((k) => k.topic).filter(Boolean) ?? null,
    sameAs: s.socialLinks?.map((l) => l.url).filter(Boolean) ?? null,
  };
}
