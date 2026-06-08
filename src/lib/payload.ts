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
import type { Page, Blog, Config } from "@/payload-types";
import type { SiteIdentity } from "@/lib/seo";
import { cacheTags } from "@/lib/cache-tags";
import { resolveContactValues } from "@/lib/contact";
import { resolveFooter, type FooterData, type FooterSource } from "@/lib/footer";
import { resolveHeader, type HeaderData, type HeaderSource } from "@/lib/header";

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

/* ---------- Blogs (Phase 3) ---------- */

/** Single published blog by slug. Cached + tagged `blogs`, `blogs:<slug>`.
 *  depth 2 resolves author/reviewedBy/category + nested avatar + ogImage. */
export const getBlogBySlug = reactCache(
  (slug: string): Promise<Blog | null> =>
    unstable_cache(
      async () => {
        const payload = await payloadClient();
        const res = await payload.find({
          collection: "blogs",
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 2,
        });
        return res.docs[0] ?? null;
      },
      ["blog-by-slug", slug],
      { tags: [cacheTags.collectionList("blogs"), cacheTags.collectionItem("blogs", slug)] },
    )(),
);

/** Published blogs for the hub (newest first). Cached + tagged `blogs`. */
export const getBlogs = reactCache(
  (limit = 24): Promise<Blog[]> =>
    unstable_cache(
      async () => {
        const payload = await payloadClient();
        const res = await payload.find({
          collection: "blogs",
          limit,
          sort: "-publishedAt",
          depth: 1,
        });
        return res.docs;
      },
      ["blogs-list", String(limit)],
      { tags: [cacheTags.collectionList("blogs")] },
    )(),
);

/** Published blog slugs for generateStaticParams. Cached + tagged `blogs`. */
export const getPublishedBlogSlugs = reactCache(
  (): Promise<string[]> =>
    unstable_cache(
      async () => {
        const payload = await payloadClient();
        const res = await payload.find({
          collection: "blogs",
          limit: 1000,
          depth: 0,
          select: { slug: true },
        });
        return res.docs.map((d) => d.slug).filter(Boolean) as string[];
      },
      ["blog-slugs"],
      { tags: [cacheTags.collectionList("blogs")] },
    )(),
);

/** Uncached, draft-aware single blog — Draft Mode preview only. */
export async function getBlogBySlugDraft(slug: string): Promise<Blog | null> {
  const payload = await payloadClient();
  const res = await payload.find({
    collection: "blogs",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
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

/**
 * Resolve the sitewide footer: the `footer` global shaped into the plain
 * `FooterData` the client <Footer> renders, with contact links resolved from
 * `site-settings` (Item 1) so numbers live in one place. Both globals are read
 * through getGlobalSafe (cached + tagged), so an empty/unavailable CMS falls
 * back to FOOTER_DEFAULTS — byte-identical output. React-cached per render.
 */
export const getFooter = reactCache(async (): Promise<FooterData> => {
  const [footer, settings] = await Promise.all([
    getGlobalSafe("footer"),
    getGlobalSafe("site-settings"),
  ]);
  return resolveFooter(footer as FooterSource, resolveContactValues(settings));
});

/**
 * Resolve the sitewide header: the `header` global shaped into the plain
 * `HeaderData` the client <SiteHeader> renders (logo, navigation, CTA). Read
 * through getGlobalSafe (cached + tagged `global:header`), so an empty or
 * unavailable CMS falls back to HEADER_DEFAULTS — byte-identical output. The
 * Doctors mega panel stays data-driven from src/lib/doctors.ts (not the CMS).
 * React-cached per render.
 */
export const getHeader = reactCache(async (): Promise<HeaderData> => {
  const header = await getGlobalSafe("header");
  return resolveHeader(header as HeaderSource);
});
