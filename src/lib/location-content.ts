/* =====================================================================
 * Locations resolver — maps a `cities`/`centres` collection doc to the plain,
 * client-serialisable models the <CityPage>/<CenterPage> templates render, and
 * that cityGraph()/centerGraph() turn into JSON-LD (Wave 4.5, Phase A).
 * ---------------------------------------------------------------------
 * Mirrors src/lib/treatment-content.ts and src/lib/services.ts. The CMS
 * collections (added in a LATER phase) hold the per-page CONTENT; this module
 * shapes a doc into `ResolvedCity`/`ResolvedCentre`, falling back PER-SECTION to
 * the typed code defaults in src/lib/locations.ts (`cityBySlug`/`centreBySlug`)
 * so an empty/unavailable CMS renders byte-identically (same convention as
 * footer/header/services/treatments).
 *
 * STRUCTURE/RELATIONSHIPS STAY CODE-OWNED (ADR-0001 Option A + WAVE-4.5-PLAN
 * §§1.3, 5.3): slug-string relationships (doctors[], treatments[], womensHealth
 * keys, citySlug) are plain strings here — never Payload `relationship` fields.
 * `built`, cityHasOwnPage() and generateStaticParams stay authoritative in
 * locations.ts; this resolver shapes CONTENT only and is read by NOTHING in
 * Phase A (no route reads, no CMS reads).
 *
 * No icon transform is needed (City/Centre carry no Lucide components), so the
 * resolved models are structurally identical to the source types — aliased to
 * `City`/`Centre` to guarantee 1:1 parity with zero drift.
 *
 * Pure module (no payload / server-only imports) — safe to bundle into the
 * client location templates (used as the in-browser fallback when no props
 * arrive in a later phase).
 * ===================================================================== */
import { cityBySlug, centreBySlug, type City, type Centre } from "@/lib/locations";

/* ---------- Resolved (serialisable) models — mirror City/Centre 1:1.
 * Aliased because the source types are already plain, serialisable data; a
 * hand-copied duplicate would only invite drift. ---------- */
export type ResolvedCity = City;
export type ResolvedCentre = Centre;

/** Serialise a typed code default into the resolved model. This is the
 *  byte-identical fallback path AND the canonical shape the (future) round-trip
 *  parity gate compares against. Optional fields are conditionally spread so
 *  present/absent semantics match the source exactly. */
export function centreToResolved(c: Centre): ResolvedCentre {
  return {
    slug: c.slug,
    citySlug: c.citySlug,
    name: c.name,
    fullName: c.fullName,
    ...(c.isHeadOffice ? { isHeadOffice: c.isHeadOffice } : {}),
    area: c.area,
    address: c.address,
    pin: c.pin,
    phone: c.phone,
    phoneLabel: c.phoneLabel,
    hours: c.hours,
    opening: {
      opens: c.opening.opens,
      closes: c.opening.closes,
      ...(c.opening.days ? { days: [...c.opening.days] } : {}),
    },
    ...(c.geo ? { geo: { lat: c.geo.lat, lng: c.geo.lng } } : {}),
    mapQuery: c.mapQuery,
    image: c.image,
    ...(c.hero360Url ? { hero360Url: c.hero360Url } : {}),
    nearby: [...c.nearby],
    landmarks: [...c.landmarks],
    howToReach: [...c.howToReach],
    facilities: [...c.facilities],
    doctors: [...c.doctors],
    treatments: [...c.treatments],
    faqs: c.faqs.map((f) => ({ q: f.q, a: f.a })),
    ...(c.reviewsKey ? { reviewsKey: c.reviewsKey } : {}),
    ...(c.sameAs ? { sameAs: [...c.sameAs] } : {}),
    intro: c.intro,
    gallery: c.gallery.map((g) => ({ src: g.src, alt: g.alt })),
    ...(c.womensHealth ? { womensHealth: [...c.womensHealth] } : {}),
    built: c.built,
  };
}

export function cityToResolved(c: City): ResolvedCity {
  return {
    slug: c.slug,
    name: c.name,
    region: c.region,
    country: c.country,
    helpline: c.helpline,
    helplineLabel: c.helplineLabel,
    whatsapp: c.whatsapp,
    heroImage: c.heroImage,
    ...(c.hero360Url ? { hero360Url: c.hero360Url } : {}),
    intro: [...c.intro],
    faqs: c.faqs.map((f) => ({ q: f.q, a: f.a })),
    ...(c.womensHealth ? { womensHealth: [...c.womensHealth] } : {}),
    built: c.built,
  };
}

/** Resolve content for a centre/city straight from the code defaults (no CMS).
 *  Used by the client templates as a back-compat fallback when no props arrive. */
export function resolveCentreFromCode(citySlug: string, slug: string): ResolvedCentre | undefined {
  const def = centreBySlug(citySlug, slug);
  return def ? centreToResolved(def) : undefined;
}
export function resolveCityFromCode(slug: string): ResolvedCity | undefined {
  const def = cityBySlug(slug);
  return def ? cityToResolved(def) : undefined;
}

/* =====================================================================
 * CMS source shapes (kept loose so they stay decoupled from the generated
 * payload-types, same convention as ServiceSource/TreatmentSource). These
 * describe the doc shape the FUTURE `cities`/`centres` collections will return;
 * nothing produces them yet.
 * ===================================================================== */
type FaqSource = { q?: string | null; a?: string | null };
type ValueItem = { value?: string | null };
type GalleryItemSource = { src?: string | null; alt?: string | null };

export type CentreSource =
  | {
      slug?: string | null;
      citySlug?: string | null;
      name?: string | null;
      fullName?: string | null;
      isHeadOffice?: boolean | null;
      area?: string | null;
      address?: string | null;
      pin?: string | null;
      phone?: string | null;
      phoneLabel?: string | null;
      hours?: string | null;
      opening?: { opens?: string | null; closes?: string | null; days?: ValueItem[] | null } | null;
      geo?: { lat?: number | null; lng?: number | null } | null;
      mapQuery?: string | null;
      image?: string | null;
      hero360Url?: string | null;
      nearby?: ValueItem[] | null;
      landmarks?: ValueItem[] | null;
      howToReach?: ValueItem[] | null;
      facilities?: ValueItem[] | null;
      doctors?: ValueItem[] | null;
      treatments?: ValueItem[] | null;
      faqs?: FaqSource[] | null;
      reviewsKey?: string | null;
      sameAs?: ValueItem[] | null;
      intro?: string | null;
      gallery?: GalleryItemSource[] | null;
      womensHealth?: ValueItem[] | null;
      built?: boolean | null;
    }
  | null
  | undefined;

export type CitySource =
  | {
      slug?: string | null;
      name?: string | null;
      region?: string | null;
      country?: string | null;
      helpline?: string | null;
      helplineLabel?: string | null;
      whatsapp?: string | null;
      heroImage?: string | null;
      hero360Url?: string | null;
      intro?: ValueItem[] | null;
      faqs?: FaqSource[] | null;
      womensHealth?: ValueItem[] | null;
      built?: boolean | null;
    }
  | null
  | undefined;

const values = (a: ValueItem[] | null | undefined): string[] =>
  (a ?? []).map((x) => x.value ?? "").filter(Boolean);
const toFaqs = (a: FaqSource[] | null | undefined): { q: string; a: string }[] =>
  (a ?? []).map((f) => ({ q: f.q ?? "", a: f.a ?? "" }));
const toGallery = (a: GalleryItemSource[] | null | undefined): { src: string; alt: string }[] =>
  (a ?? []).map((g) => ({ src: g.src ?? "", alt: g.alt ?? "" }));

/**
 * Map a `centres` doc → ResolvedCentre, falling back PER-SECTION to the typed
 * default for (citySlug, slug) so an empty/partial CMS renders byte-identically.
 * Structural/relational fields (citySlug, doctors[], treatments[], opening, geo,
 * womensHealth) stay code-authoritative via `base`; src overrides only when it
 * supplies a non-empty value. Returns undefined for an unknown centre with no
 * default (caller → notFound).
 */
export function resolveCentre(citySlug: string, slug: string, src: CentreSource): ResolvedCentre | undefined {
  const def = centreBySlug(citySlug, slug);
  if (!src) return def ? centreToResolved(def) : undefined;
  if (!def) return undefined; // unknown centre — no template behind it
  const base = centreToResolved(def);

  return {
    // ---- Class A (structural / relational / gating) — CODE-AUTHORITATIVE ----
    // Carried from `base` ONLY; the CMS copy is intentionally IGNORED at render
    // so the route set, the schema graph (geo, openingHoursSpecification,
    // areaServed, availableService) and the cross-app helpers cannot drift with
    // CMS state (WAVE-4.5-PLAN §§1.2, 5.3; ADR-0001). The collection still
    // STORES these (for seed/roundtrip + editor visibility) — they are just not
    // read here. Class-A set: slug, citySlug, built, isHeadOffice, reviewsKey,
    // geo, opening, doctors[], treatments[], womensHealth[].
    ...base,
    // ---- Class B (editorial content) — CMS-overridable, per-section fallback ----
    name: src.name || base.name,
    fullName: src.fullName || base.fullName,
    area: src.area || base.area,
    address: src.address || base.address,
    pin: src.pin || base.pin,
    phone: src.phone || base.phone,
    phoneLabel: src.phoneLabel || base.phoneLabel,
    hours: src.hours || base.hours,
    mapQuery: src.mapQuery || base.mapQuery,
    image: src.image || base.image,
    intro: src.intro || base.intro,
    nearby: src.nearby?.length ? values(src.nearby) : base.nearby,
    landmarks: src.landmarks?.length ? values(src.landmarks) : base.landmarks,
    howToReach: src.howToReach?.length ? values(src.howToReach) : base.howToReach,
    facilities: src.facilities?.length ? values(src.facilities) : base.facilities,
    faqs: src.faqs?.length ? toFaqs(src.faqs) : base.faqs,
    gallery: src.gallery?.length ? toGallery(src.gallery) : base.gallery,
    ...(src.hero360Url ? { hero360Url: src.hero360Url } : {}),
    ...(src.sameAs?.length ? { sameAs: values(src.sameAs) } : {}),
  };
}

/**
 * Map a `cities` doc → ResolvedCity, falling back PER-SECTION to the typed
 * default for `slug`. Returns undefined for an unknown city with no default.
 */
export function resolveCity(slug: string, src: CitySource): ResolvedCity | undefined {
  const def = cityBySlug(slug);
  if (!src) return def ? cityToResolved(def) : undefined;
  if (!def) return undefined;
  const base = cityToResolved(def);

  return {
    // ---- Class A — CODE-AUTHORITATIVE (base only; CMS ignored): slug, built,
    //      womensHealth[]. See resolveCentre for the rationale. ----
    ...base,
    // ---- Class B (editorial content) — CMS-overridable, per-section fallback ----
    name: src.name || base.name,
    region: src.region || base.region,
    country: src.country || base.country,
    helpline: src.helpline || base.helpline,
    helplineLabel: src.helplineLabel || base.helplineLabel,
    whatsapp: src.whatsapp || base.whatsapp,
    heroImage: src.heroImage || base.heroImage,
    intro: src.intro?.length ? values(src.intro) : base.intro,
    faqs: src.faqs?.length ? toFaqs(src.faqs) : base.faqs,
    ...(src.hero360Url ? { hero360Url: src.hero360Url } : {}),
  };
}
