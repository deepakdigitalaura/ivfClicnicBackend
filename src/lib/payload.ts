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
import { getPayload, type Payload, type Where } from "payload";
import { unstable_cache } from "next/cache";
import { cache as reactCache } from "react";
import config from "@payload-config";
import type { Page, Blog, Config } from "@/payload-types";
import type { SiteIdentity } from "@/lib/seo";
import { cacheTags } from "@/lib/cache-tags";
import { resolveContactValues } from "@/lib/contact";
import { resolveFooter, type FooterData, type FooterSource } from "@/lib/footer";
// NavTreatmentItem / NavDoctorItem / NavLocationItem imported from header.ts (pure module shared by header + footer resolvers)
import { resolveHeader, type HeaderData, type HeaderSource, type NavTreatmentItem, type NavDoctorItem, type NavLocationItem } from "@/lib/header";
import { resolveHomepage, type HomepageData, type HomepageSource } from "@/lib/homepage";
import { resolveAbout, type AboutData, type AboutSource } from "@/lib/about";
import { resolveTestimonials, type TestimonialSource } from "@/lib/testimonials";
import type { Review } from "@/lib/reviews";
import { resolveService, type ResolvedService, type ServiceSource } from "@/lib/services";
import { resolveDoctor, DOCTORS, type Doctor, type DoctorSource } from "@/lib/doctors";
import { resolveTreatment, type ResolvedTreatment, type TreatmentSource } from "@/lib/treatment-content";
import { TREATMENTS } from "@/lib/treatments";
import {
  resolveCity,
  resolveCentre,
  type ResolvedCity,
  type ResolvedCentre,
  type CitySource,
  type CentreSource,
} from "@/lib/location-content";

let cached: Promise<Payload> | null = null;

export function payloadClient(): Promise<Payload> {
  if (!cached) cached = getPayload({ config });
  return cached;
}

/** Run a Payload query and return `fallback` on any error (missing table, no DB, etc.). */
async function safeQuery<T>(fn: (p: Payload) => Promise<T>, fallback: T): Promise<T> {
  try {
    const payload = await payloadClient();
    return await fn(payload);
  } catch {
    return fallback;
  }
}

/**
 * Fetch a single Page by slug (published-only for the public, via collection
 * access control). Cached + tagged: `pages`, `pages:<slug>`. Returns null if
 * not found (caller decides the fallback).
 */
export const getPageBySlug = reactCache(
  (slug: string): Promise<Page | null> =>
    unstable_cache(
      () => safeQuery(
        async (payload) => {
          const res = await payload.find({
            collection: "pages",
            where: { slug: { equals: slug } },
            limit: 1,
            depth: 1,
          });
          return (res.docs[0] ?? null) as Page | null;
        },
        null,
      ),
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
  return safeQuery(async (payload) => {
    const res = await payload.find({
      collection: "pages",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      draft: true,
      overrideAccess: true,
    });
    return (res.docs[0] ?? null) as Page | null;
  }, null);
}

/* ---------- Blogs (Phase 3) ---------- */

/** Single published blog by slug. Cached + tagged `blogs`, `blogs:<slug>`.
 *  depth 2 resolves author/reviewedBy/category + nested avatar + ogImage. */
export const getBlogBySlug = reactCache(
  (slug: string): Promise<Blog | null> =>
    unstable_cache(
      () => safeQuery(
        async (payload) => {
          const res = await payload.find({
            collection: "blogs",
            where: { slug: { equals: slug } },
            limit: 1,
            depth: 2,
          });
          return (res.docs[0] ?? null) as Blog | null;
        },
        null,
      ),
      ["blog-by-slug", slug],
      { tags: [cacheTags.collectionList("blogs"), cacheTags.collectionItem("blogs", slug)] },
    )(),
);

/** Published blogs for the hub (newest first). Cached + tagged `blogs`. */
export const getBlogs = reactCache(
  (limit = 24): Promise<Blog[]> =>
    unstable_cache(
      () => safeQuery(
        async (payload) => {
          const res = await payload.find({
            collection: "blogs",
            limit,
            sort: "-publishedAt",
            depth: 1,
          });
          return res.docs as Blog[];
        },
        [],
      ),
      ["blogs-list", String(limit)],
      { tags: [cacheTags.collectionList("blogs")] },
    )(),
);

/** Published blogs tagged to a treatment (drives the treatment-page "Related
 *  Articles" section). Cached + tagged `blogs`. Empty array on any error or
 *  if none are tagged yet — callers top up with placeholders. */
export const getBlogsByTreatmentSlug = reactCache(
  (treatmentSlug: string, limit = 3): Promise<Blog[]> =>
    unstable_cache(
      () => safeQuery(
        async (payload) => {
          const res = await payload.find({
            collection: "blogs",
            where: { "treatmentSlugs.slug": { equals: treatmentSlug } },
            limit,
            sort: "-publishedAt",
            depth: 1,
          });
          return res.docs as Blog[];
        },
        [],
      ),
      ["blogs-by-treatment", treatmentSlug, String(limit)],
      { tags: [cacheTags.collectionList("blogs")] },
    )(),
);

/** Published blogs tagged to a city/centre location (drives the location-page
 *  "Related Articles" section). Cached + tagged `blogs`. */
export const getBlogsByLocationSlug = reactCache(
  (locationSlug: string, limit = 3): Promise<Blog[]> =>
    unstable_cache(
      () => safeQuery(
        async (payload) => {
          const res = await payload.find({
            collection: "blogs",
            where: { "locationSlugs.slug": { equals: locationSlug } },
            limit,
            sort: "-publishedAt",
            depth: 1,
          });
          return res.docs as Blog[];
        },
        [],
      ),
      ["blogs-by-location", locationSlug, String(limit)],
      { tags: [cacheTags.collectionList("blogs")] },
    )(),
);

/** Published blogs related to a given post — shares a treatment tag or its
 *  category, excluding itself. Powers the article's "Keep Reading" section. */
export const getRelatedBlogs = reactCache(
  (slug: string, treatmentSlugs: string[], categoryId: number | null, limit = 3): Promise<Blog[]> =>
    unstable_cache(
      () => safeQuery(
        async (payload) => {
          const or: Where[] = [];
          if (treatmentSlugs.length) or.push({ "treatmentSlugs.slug": { in: treatmentSlugs } });
          if (categoryId) or.push({ category: { equals: categoryId } });
          if (!or.length) return [];
          const res = await payload.find({
            collection: "blogs",
            where: { and: [{ slug: { not_equals: slug } }, { or }] },
            limit,
            sort: "-publishedAt",
            depth: 1,
          });
          return res.docs as Blog[];
        },
        [],
      ),
      ["related-blogs", slug, String(limit)],
      { tags: [cacheTags.collectionList("blogs")] },
    )(),
);

/** Published blog slugs for generateStaticParams. Cached + tagged `blogs`. */
export const getPublishedBlogSlugs = reactCache(
  (): Promise<string[]> =>
    unstable_cache(
      () => safeQuery(
        async (payload) => {
          const res = await payload.find({
            collection: "blogs",
            limit: 1000,
            depth: 0,
            select: { slug: true },
          });
          return res.docs.map((d) => d.slug).filter(Boolean) as string[];
        },
        [],
      ),
      ["blog-slugs"],
      { tags: [cacheTags.collectionList("blogs")] },
    )(),
);

/** Uncached, draft-aware single blog — Draft Mode preview only. */
export async function getBlogBySlugDraft(slug: string): Promise<Blog | null> {
  return safeQuery(async (payload) => {
    const res = await payload.find({
      collection: "blogs",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
      draft: true,
      overrideAccess: true,
    });
    return (res.docs[0] ?? null) as Blog | null;
  }, null);
}

/* ---------- Services (Phase 4.1) ---------- */

/**
 * Resolve a maternity service for `/services/[slug]`: the `services` doc shaped
 * into the plain, serialisable `ResolvedService` the <ServicePage> renders and
 * serviceGraph() turns into JSON-LD. Cached + tagged `services`, `services:<slug>`.
 * Falls back PER-SECTION to the code defaults (src/lib/services.ts) — so an
 * empty, partial, or unavailable CMS (e.g. table not yet pushed) renders
 * byte-identically. React-cached per render. Returns undefined for a slug with
 * no template/registry behind it (caller → notFound).
 */
export const getService = reactCache(
  (slug: string): Promise<ResolvedService | undefined> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "services",
            where: { slug: { equals: slug } },
            limit: 1,
            depth: 1, // resolve seo.ogImage upload relation + heroPhoto
          });
          // Cast includes `name` so resolveService can build a page for DB-only services
          return resolveService(slug, res.docs[0] as ServiceSource & { name?: string });
        } catch {
          // Table not pushed yet / read error → typed code fallback.
          return resolveService(slug, null);
        }
      },
      ["service-by-slug", slug],
      { tags: [cacheTags.collectionList("services"), cacheTags.collectionItem("services", slug)] },
    )(),
);

/**
 * Returns all published service slugs from the DB — used by the services route
 * generateStaticParams so new services added in admin are pre-rendered at build
 * time (the page still renders on-demand for any slug not in the static set).
 */
export const getPublishedServiceSlugs = reactCache(
  (): Promise<string[]> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "services",
            limit: 300,
            depth: 0,
            where: { _status: { equals: "published" } },
            select: { slug: true },
          });
          return (res.docs as Array<Record<string, unknown>>)
            .map((d) => d.slug as string)
            .filter(Boolean);
        } catch {
          return [];
        }
      },
      ["service-slugs"],
      { tags: [cacheTags.collectionList("services")] },
    )(),
);

/* ---------- Doctors (Wave 4.3) ---------- */

/**
 * Resolve a single doctor for `/doctors/[slug]`: the `doctors` doc shaped into
 * the typed `Doctor` model the <DoctorProfile> renders and physicianSchema turns
 * into JSON-LD. Cached + tagged `doctors`, `doctors:<slug>`. Falls back PER FIELD
 * to the code default (src/lib/doctors.ts `DOCTORS`) — so an empty, partial, or
 * unavailable CMS (e.g. table not yet pushed) renders byte-identically. React-
 * cached per render. Returns undefined for a slug with no code entry (→ notFound).
 */
export const getDoctor = reactCache(
  (slug: string): Promise<Doctor | undefined> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "doctors",
            where: { slug: { equals: slug } },
            limit: 1,
            depth: 1, // resolve the optional `photo` upload override
          });
          return resolveDoctor(slug, res.docs[0] as DoctorSource);
        } catch {
          // Table not pushed yet / read error → typed code fallback.
          return resolveDoctor(slug, null);
        }
      },
      ["doctor-by-slug", slug],
      { tags: [cacheTags.collectionList("doctors"), cacheTags.collectionItem("doctors", slug)] },
    )(),
);

/**
 * All doctors for the `/doctors` index, in the INTENTIONAL code order (founders/
 * core first). Order is owned by the `DOCTORS` array — never Payload's query
 * order: we fetch every doc, key it by slug, then map over `DOCTORS` overlaying
 * each one via resolveDoctor (per-field fallback). An unavailable CMS degrades to
 * the code defaults (byte-identical). Cached + tagged `doctors`. React-cached.
 */
/**
 * All doctors for the `/doctors` index, DB-first.
 *
 * Strategy:
 *  1. Fetch every published doctor from Payload DB.
 *  2. Resolve each through resolveDoctor() — overlays DB data onto code defaults
 *     per-field; handles DB-only doctors (no code entry) for admin-created ones.
 *  3. Order: code-known doctors in DOCTORS array order first; DB-only doctors
 *     (added from admin) appended, sorted by navOrder then name.
 *  4. Falls back to DOCTORS code defaults when DB is unavailable.
 */
export const getDoctors = reactCache(
  (): Promise<Doctor[]> =>
    unstable_cache(
      async () => {
        let dbDocs: Array<{ slug: string; src: DoctorSource }> = [];
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "doctors",
            limit: DOCTORS.length + 200,
            depth: 1,
          });
          dbDocs = res.docs.map((d) => ({
            slug: (d as { slug: string }).slug,
            src: d as DoctorSource,
          }));
        } catch {
          // DB unavailable → full code fallback below.
        }

        if (!dbDocs.length) {
          return DOCTORS.map((d) => resolveDoctor(d.slug, null)!);
        }

        const bySlug = new Map(dbDocs.map((d) => [d.slug, d.src]));
        const codeSlugs = new Set(DOCTORS.map((d) => d.slug));

        // Code-known doctors in canonical DOCTORS array order.
        const resolved: Doctor[] = DOCTORS
          .map((d) => resolveDoctor(d.slug, bySlug.get(d.slug) ?? null))
          .filter((d): d is Doctor => !!d);

        // DB-only doctors (admin-created, not in DOCTORS array).
        const dbOnly = dbDocs
          .filter((d) => !codeSlugs.has(d.slug))
          .sort((a, b) => {
            const aOrder = (a.src as { navOrder?: number | null })?.navOrder ?? 999;
            const bOrder = (b.src as { navOrder?: number | null })?.navOrder ?? 999;
            return aOrder !== bOrder ? aOrder - bOrder : (a.slug < b.slug ? -1 : 1);
          });
        for (const d of dbOnly) {
          const doctor = resolveDoctor(d.slug, d.src);
          if (doctor) resolved.push(doctor);
        }

        return resolved;
      },
      ["doctors-list"],
      { tags: [cacheTags.collectionList("doctors")] },
    )(),
);

/**
 * Lightweight doctor nav data for building header/footer menus dynamically.
 * Fetches only doctors with navRole set. React-cached + tagged `doctors`.
 */
const getNavDoctorsInternal = reactCache(
  (): Promise<NavDoctorItem[]> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "doctors",
            where: { navRole: { exists: true } },
            limit: 200,
            depth: 0,
          });
          return res.docs
            .filter((d) => (d as { navRole?: string | null }).navRole)
            .map((d) => {
              const doc = d as {
                slug: string;
                name: string;
                href?: string | null;
                navRole: "senior-specialist" | "specialist";
                navOrder?: number | null;
                cities?: { value: string }[] | null;
                experienceLabel?: string | null;
              };
              return {
                slug: doc.slug,
                name: doc.name,
                href: doc.href || `/doctors/${doc.slug}`,
                navRole: doc.navRole,
                navOrder: typeof doc.navOrder === "number" ? doc.navOrder : 0,
                city: doc.cities?.[0]?.value ?? "",
                experienceLabel: doc.experienceLabel ?? undefined,
              };
            });
        } catch {
          return [];
        }
      },
      ["doctors-nav"],
      { tags: [cacheTags.collectionList("doctors")] },
    )(),
);

/* ---------- Treatments (Wave 4.4) ---------- */

/**
 * Resolve a single treatment for a `/treatment` route: the `treatments` doc
 * shaped into the plain, serialisable `ResolvedTreatment` the <TreatmentPage>
 * renders and treatmentGraph() turns into JSON-LD. Cached + tagged `treatments`,
 * `treatments:<slug>`. Falls back PER-SECTION to the code defaults
 * (src/lib/treatment-content.ts → treatmentBySlug) — so an empty, partial, or
 * unavailable CMS (e.g. table not yet pushed) renders byte-identically. React-
 * cached per render. Returns undefined for a slug with no template/registry
 * behind it (caller → notFound).
 */
export const getTreatment = reactCache(
  (slug: string): Promise<ResolvedTreatment | undefined> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "treatments",
            where: { slug: { equals: slug } },
            limit: 1,
            depth: 1, // resolve the optional hero `heroPhoto` upload override
          });
          return resolveTreatment(slug, res.docs[0] as TreatmentSource);
        } catch {
          // Table not pushed yet / read error → typed code fallback.
          return resolveTreatment(slug, null);
        }
      },
      ["treatment-by-slug", slug],
      { tags: [cacheTags.collectionList("treatments"), cacheTags.collectionItem("treatments", slug)] },
    )(),
);

/**
 * All treatments in the INTENTIONAL code order (the `TREATMENTS` array order —
 * never Payload's query order): we fetch every doc, key it by slug, then map
 * over `TREATMENTS` overlaying each one via resolveTreatment (per-section
 * fallback). An unavailable CMS degrades to the code defaults (byte-identical).
 * Cached + tagged `treatments`. React-cached.
 */
export const getTreatments = reactCache(
  (): Promise<ResolvedTreatment[]> =>
    unstable_cache(
      async () => {
        let bySlug = new Map<string, TreatmentSource>();
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "treatments",
            limit: TREATMENTS.length + 50,
            depth: 1, // resolve the optional hero `heroPhoto` upload override
          });
          bySlug = new Map(res.docs.map((d) => [(d as { slug: string }).slug, d as TreatmentSource]));
        } catch {
          // Table not pushed yet / read error → all code defaults.
        }
        return TREATMENTS.map((t) => resolveTreatment(t.slug, bySlug.get(t.slug) ?? null)!);
      },
      ["treatments-list"],
      { tags: [cacheTags.collectionList("treatments")] },
    )(),
);

/* ---------- Locations (Wave 4.5) ---------- */

/**
 * Resolve a single city for `/locations/[city]`: the `cities` doc shaped into the
 * plain, serialisable `ResolvedCity` the <CityPage> renders and cityGraph() turns
 * into JSON-LD. Cached + tagged `cities`, `cities:<slug>`. Falls back PER-SECTION
 * to the code defaults (src/lib/location-content.ts → cityBySlug) — so an empty,
 * partial, or unavailable CMS (e.g. table not yet pushed) renders byte-identically.
 * React-cached per render. Returns undefined for a slug with no code default
 * behind it (caller → notFound). Class-A structural fields (slug, built,
 * womensHealth) stay code-authoritative in the resolver (ADR-0001 Option A).
 */
export const getCity = reactCache(
  (slug: string): Promise<ResolvedCity | undefined> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "cities",
            where: { slug: { equals: slug } },
            limit: 1,
            depth: 0,
          });
          return resolveCity(slug, res.docs[0] as CitySource);
        } catch {
          // Table not pushed yet / read error → typed code fallback.
          return resolveCity(slug, null);
        }
      },
      ["city-by-slug", slug],
      { tags: [cacheTags.collectionList("cities"), cacheTags.collectionItem("cities", slug)] },
    )(),
);

/**
 * Resolve a single centre for `/locations/[city]/[center]`: the `centres` doc
 * shaped into the plain, serialisable `ResolvedCentre` the <CenterPage> renders
 * and centerGraph() turns into JSON-LD. Cached + tagged `centres`, `centres:<slug>`.
 * Falls back PER-SECTION to the code defaults (src/lib/location-content.ts →
 * centreBySlug) — so an empty, partial, or unavailable CMS renders byte-identically.
 * React-cached per render. Returns undefined for an unknown centre with no code
 * default (caller → notFound).
 *
 * Centre slugs are unique only WITHIN a city (ADR-0001 Option A slug-string
 * `citySlug` parent link, not a Payload relationship), so the query keys on the
 * COMPOUND (citySlug, slug) and the cache key carries both. The item cache TAG is
 * the bare `centres:<slug>` to match the revalidateCollection hook (which only
 * sees doc.slug); with no cross-city slug collisions today this is exact — if a
 * slug is ever reused across cities, that tag would over-bust (same trade-off the
 * index-only DB uniqueness accepts, WAVE-4.5-PLAN §13).
 */
export const getCentre = reactCache(
  (citySlug: string, slug: string): Promise<ResolvedCentre | undefined> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "centres",
            where: { and: [{ citySlug: { equals: citySlug } }, { slug: { equals: slug } }] },
            limit: 1,
            depth: 0,
          });
          return resolveCentre(citySlug, slug, res.docs[0] as CentreSource);
        } catch {
          // Table not pushed yet / read error → typed code fallback.
          return resolveCentre(citySlug, slug, null);
        }
      },
      ["centre-by-city-slug", citySlug, slug],
      { tags: [cacheTags.collectionList("centres"), cacheTags.collectionItem("centres", slug)] },
    )(),
);

/**
 * All published city slugs — used by the city route generateStaticParams so
 * new cities added in admin are pre-rendered at build time.
 */
export const getPublishedCitySlugs = reactCache(
  (): Promise<string[]> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "cities",
            limit: 100,
            depth: 0,
            where: { _status: { equals: "published" } },
            select: { slug: true },
          });
          return (res.docs as Array<Record<string, unknown>>)
            .map((d) => d.slug as string)
            .filter(Boolean);
        } catch {
          return [];
        }
      },
      ["city-slugs"],
      { tags: [cacheTags.collectionList("cities")] },
    )(),
);

/**
 * All published centre (city + center slug pairs) — used by the centre route
 * generateStaticParams so new centres added in admin are pre-rendered.
 */
export const getPublishedCentreParams = reactCache(
  (): Promise<{ city: string; center: string }[]> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "centres",
            limit: 300,
            depth: 0,
            where: { _status: { equals: "published" } },
            select: { slug: true, citySlug: true },
          });
          return (res.docs as Array<Record<string, unknown>>)
            .filter((d) => d.slug && d.citySlug)
            .map((d) => ({
              city: (d.citySlug as string).toLowerCase().trim(),
              center: d.slug as string,
            }));
        } catch {
          return [];
        }
      },
      ["centre-params"],
      { tags: [cacheTags.collectionList("centres")] },
    )(),
);

/**
 * Published centres for a specific city — used by the city hub page to detect
 * whether a DB-only city has multiple centres (determines hub vs. single-centre
 * rendering) and to resolve the sole centre slug for single-centre cities.
 */
export const getPublishedCentresForCity = reactCache(
  (citySlug: string): Promise<{ slug: string; name: string }[]> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "centres",
            limit: 50,
            depth: 0,
            where: { and: [{ citySlug: { equals: citySlug } }, { _status: { equals: "published" } }] },
            select: { slug: true, name: true },
          });
          return (res.docs as Array<Record<string, unknown>>)
            .filter((d) => d.slug && d.name)
            .map((d) => ({ slug: d.slug as string, name: d.name as string }));
        } catch {
          return [];
        }
      },
      ["centres-for-city", citySlug],
      { tags: [cacheTags.collectionList("centres")] },
    )(),
);

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
 * Nav-only treatment data: name, href, navCategory, navOrder for published
 * treatments that have a navCategory set. Powers the dynamic header mega menu
 * and footer treatment groups. Cached + tagged `treatments` (busted on any
 * treatment publish/update). Returns [] on any error (CMS unavailable / table
 * not yet pushed) so header + footer fall back to their hardcoded defaults.
 * Type is defined in src/lib/header.ts (pure module) to keep payload.ts free of
 * type definitions that other pure modules also need.
 */
const getTreatmentsForNavInternal = reactCache(
  (): Promise<NavTreatmentItem[]> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "treatments",
            limit: 300,
            depth: 0,
            sort: "navOrder",
            select: { slug: true, name: true, shortName: true, href: true, navCategory: true, navOrder: true },
          });
          return (res.docs as Array<Record<string, unknown>>)
            .filter((d) => d.navCategory && d.slug && (d.shortName || d.name))
            .map((d) => ({
              slug: d.slug as string,
              name: (d.shortName as string) || (d.name as string),
              href: (d.href as string) || `/treatments/${d.slug as string}`,
              navCategory: d.navCategory as string,
              navOrder: typeof d.navOrder === "number" ? d.navOrder : 0,
            }));
        } catch {
          return [];
        }
      },
      ["treatments-nav"],
      { tags: [cacheTags.collectionList("treatments")] },
    )(),
);

/**
 * Nav-only service data: name, href for published maternity services from the
 * `services` collection. Injected as navCategory "maternity-services" so the
 * existing header/footer resolvers pick them up automatically. Cached + tagged
 * `services` (busted on any service publish/update). Returns [] on any error.
 */
const getServicesForNavInternal = reactCache(
  (): Promise<NavTreatmentItem[]> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "services",
            limit: 300,
            depth: 0,
            where: { _status: { equals: "published" } },
            select: { slug: true, name: true, shortName: true, href: true },
          });
          return (res.docs as Array<Record<string, unknown>>)
            .filter((d) => d.slug && (d.shortName || d.name))
            .map((d, i) => ({
              slug: d.slug as string,
              name: (d.shortName as string) || (d.name as string),
              href: (d.href as string) || `/services/${d.slug as string}`,
              navCategory: "maternity-services",
              navOrder: i,
            }));
        } catch {
          return [];
        }
      },
      ["services-nav"],
      { tags: [cacheTags.collectionList("services")] },
    )(),
);

/**
 * Nav-only location data: published centres grouped by city for the dynamic
 * Locations mega menu (header) and footer Locations group. Queries both the
 * `centres` and `cities` collections. Cached + tagged so publishing a new
 * centre or city auto-busts the nav cache. Returns [] on any error so
 * header + footer fall back to their hardcoded defaults.
 */
const getLocationsForNavInternal = reactCache(
  (): Promise<NavLocationItem[]> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const [centresRes, citiesRes] = await Promise.all([
            payload.find({
              collection: "centres",
              limit: 300,
              depth: 0,
              where: { _status: { equals: "published" } },
              select: { slug: true, name: true, citySlug: true },
            }),
            payload.find({
              collection: "cities",
              limit: 100,
              depth: 0,
              where: { _status: { equals: "published" } },
              select: { slug: true, name: true },
            }),
          ]);

          const cityNames = new Map<string, string>();
          for (const c of citiesRes.docs as Array<Record<string, unknown>>) {
            if (c.slug && c.name)
              cityNames.set((c.slug as string).toLowerCase().trim(), c.name as string);
          }

          const byCitySlug = new Map<string, { slug: string; name: string }[]>();
          for (const c of centresRes.docs as Array<Record<string, unknown>>) {
            if (!c.slug || !c.citySlug || !c.name) continue;
            const key = (c.citySlug as string).toLowerCase().trim();
            const arr = byCitySlug.get(key) ?? [];
            arr.push({ slug: c.slug as string, name: c.name as string });
            byCitySlug.set(key, arr);
          }

          if (!byCitySlug.size) return [];

          return Array.from(byCitySlug.entries()).map(([citySlug, centres]) => {
            const rawName = cityNames.get(citySlug) || citySlug;
            const cityName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
            // Deduplicate centres by slug in case of any DB duplicates.
            const unique = Array.from(
              new Map(centres.map((c) => [c.slug, c])).values(),
            );
            return { citySlug, cityName, centres: unique };
          });
        } catch {
          return [];
        }
      },
      ["locations-nav"],
      { tags: [cacheTags.collectionList("centres"), cacheTags.collectionList("cities")] },
    )(),
);

/**
 * Resolve the sitewide footer: the `footer` global shaped into the plain
 * `FooterData` the client <Footer> renders, with contact links resolved from
 * `site-settings` (Item 1) so numbers live in one place. Treatment groups in
 * the footer are now built dynamically from published Payload treatments that
 * have a `navCategory` set — so adding a treatment in the admin automatically
 * reflects in the footer. Falls back to FOOTER_DEFAULTS when no CMS data. React-
 * cached per render.
 */
export const getFooter = reactCache(async (): Promise<FooterData> => {
  const [footer, settings, navTreatments, navServices, navDoctors, navLocations] = await Promise.all([
    getGlobalSafe("footer"),
    getGlobalSafe("site-settings"),
    getTreatmentsForNavInternal(),
    getServicesForNavInternal(),
    getNavDoctorsInternal(),
    getLocationsForNavInternal(),
  ]);
  return resolveFooter(footer as FooterSource, resolveContactValues(settings), [...navTreatments, ...navServices], navDoctors, navLocations);
});

/**
 * Resolve the sitewide header: the `header` global shaped into the plain
 * `HeaderData` the client <SiteHeader> renders (logo, navigation, CTA). Both
 * the "IVF Treatments" mega menu columns and the Doctors panel are built
 * dynamically from CMS data. Falls back to HEADER_DEFAULTS when no CMS data.
 * React-cached per render.
 */
export const getHeader = reactCache(async (): Promise<HeaderData> => {
  const [header, navTreatments, navServices, navDoctors, navLocations] = await Promise.all([
    getGlobalSafe("header"),
    getTreatmentsForNavInternal(),
    getServicesForNavInternal(),
    getNavDoctorsInternal(),
    getLocationsForNavInternal(),
  ]);
  return resolveHeader(header as HeaderSource, [...navTreatments, ...navServices], navDoctors, navLocations);
});

/**
 * Resolve the homepage's editorial content: the `homepage` global shaped into
 * the plain, serialisable `HomepageData` the client <HomePage> sections render
 * (hero, stats, both "Why" blocks, Suraksha, awards, events, video IDs, FAQs,
 * final CTA). Read through getGlobalSafe (cached + tagged `global:homepage`), so
 * an empty or unavailable CMS falls back to HOMEPAGE_DEFAULTS — byte-identical
 * output. Calculators, dynamic Doctors/Treatments, review aggregation and the
 * blog listing stay code-owned. React-cached per render.
 */
export const getHomepage = reactCache(async (): Promise<HomepageData> => {
  const homepage = await getGlobalSafe("homepage");
  return resolveHomepage(homepage as HomepageSource);
});

/**
 * Resolve the /about-bfi page's structured editorial content: the `about-page`
 * global shaped into the plain, serialisable `AboutData` the client <AboutPage>
 * renders (hero copy, stat grids, legacy timeline, trust pillars, city network,
 * network/final-CTA headings + CTA labels). Read through getGlobalSafe (cached +
 * tagged `global:about-page`), so an empty or unavailable CMS falls back to
 * ABOUT_DEFAULTS — byte-identical output. The inline-<strong> prose, decorative
 * <em> titles, JSON-LD graph and reused Doctors/AwardsCarousel sections stay
 * code-owned. React-cached per render.
 */
export const getAbout = reactCache(async (): Promise<AboutData> => {
  const about = await getGlobalSafe("about-page");
  return resolveAbout(about as AboutSource);
});

/**
 * Published patient testimonials (Phase B.4) for the homepage's Testimonials
 * section, mapped to the display `Review` shape. SUPPLEMENTS the live Google
 * reviews — these render as "Patient review" alongside Google data and never
 * feed review schema. Cached + tagged `testimonials` (busted by the collection's
 * revalidateRelated hook). On any error (e.g. table not pushed yet) returns [] so
 * the homepage shows Google-only — byte-identical to before this collection
 * existed. React-cached per render.
 */
export const getTestimonials = reactCache(
  (): Promise<Review[]> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "testimonials",
            where: { published: { equals: true } },
            sort: "order",
            limit: 50,
            depth: 0,
          });
          return resolveTestimonials(res.docs as TestimonialSource[]);
        } catch {
          // Table not pushed yet / read error → no supplement (Google-only).
          return [];
        }
      },
      ["testimonials-list"],
      { tags: [cacheTags.collectionList("testimonials")] },
    )(),
);
