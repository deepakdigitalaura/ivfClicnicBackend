/* =====================================================================
 * Server-side Payload access (local API) + caching.
 * ---------------------------------------------------------------------
 * `import "server-only"` makes the bundler FAIL the build if this module is
 * ever pulled into a client bundle — protecting the client/server boundary the
 * templates depend on (seo.ts stays Payload-free).
 *
 * Reads go through `unstable_cache` (cross-request Data Cache + cache TAGS) so
 * the revalidation hooks (src/lib/revalidate.ts) can invalidate exactly the
 * affected routes on Node — without making any route dynamic, so static
 * generation is preserved. React `cache()` adds per-render dedup.
 * ===================================================================== */
import "server-only";
import { getPayload, type Payload } from "payload";
import { unstable_cache } from "next/cache";
import { cache as reactCache } from "react";
import config from "@payload-config";
import type { Page, Config } from "@/payload-types";
import type { SiteIdentity } from "@/lib/seo";
import { cacheTags } from "@/lib/cache-tags";

let cached: Promise<Payload> | null = null;

export function payloadClient(): Promise<Payload> {
  if (!cached) cached = getPayload({ config });
  return cached;
}

/**
 * Fetch a single Page by slug (published-only for the public, via collection
 * access control). Cached + tagged: `pages`, `pages:<slug>`. Returns null if
 * not found (caller decides the fallback).
 */
export const getPageBySlug = reactCache(
  (slug: string): Promise<Page | null> =>
    unstable_cache(
      async () => {
        const payload = await payloadClient();
        const res = await payload.find({
          collection: "pages",
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 1, // resolve ogImage upload relation
        });
        return res.docs[0] ?? null;
      },
      ["page-by-slug", slug],
      { tags: [cacheTags.collectionList("pages"), cacheTags.collectionItem("pages", slug)] },
    )(),
);

/**
 * Uncached, draft-aware page fetch — for Draft Mode preview ONLY. Reads the
 * latest draft (overrideAccess) and is never cached, so editors see live edits.
 * Not used on the public render path (which stays static + published-only).
 */
export async function getPageBySlugDraft(slug: string): Promise<Page | null> {
  const payload = await payloadClient();
  const res = await payload.find({
    collection: "pages",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    draft: true,
    overrideAccess: true,
  });
  return res.docs[0] ?? null;
}

/**
 * Fetch a global by slug. Cached + tagged `global:<slug>`. Returns null on any
 * error (e.g. table not yet pushed) so callers fall back to typed defaults —
 * keeps the site rendering during the migration.
 */
export function getGlobalSafe<S extends keyof Config["globals"]>(
  slug: S,
): Promise<Config["globals"][S] | null> {
  return unstable_cache(
    async () => {
      try {
        const payload = await payloadClient();
        return (await payload.findGlobal({ slug })) as Config["globals"][S];
      } catch {
        return null;
      }
    },
    ["global", String(slug)],
    { tags: [cacheTags.global(String(slug))] },
  )();
}

/**
 * Map the `site-settings` global to the pure SiteIdentity shape the schema
 * builders consume. Returns undefined if unavailable, so siteGraph() falls back
 * to the SITE constant (byte-identical output). React-cached for per-render dedup.
 */
export const getSiteIdentity = reactCache(async (): Promise<SiteIdentity | undefined> => {
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
});
