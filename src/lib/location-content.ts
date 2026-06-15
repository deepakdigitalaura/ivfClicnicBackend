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

/** Per-page overrides for the template section labels (eyebrows/subtitles/titles)
 *  on city/centre pages. Empty/missing → the component's built-in default renders.
 *  Shared by both collections; each page uses the keys it has.
 *  `*Title` fields store HTML strings (with optional <em> for the italic accent)
 *  and are rendered via dangerouslySetInnerHTML on the public site. */
export type LocationSectionLabels = {
  // ---- Eyebrows / sub-headings (small labels, plain text) ----
  overviewEyebrow?: string;
  centresEyebrow?: string;
  landmarksEyebrow?: string;
  areasEyebrow?: string;
  reachEyebrow?: string;
  treatmentsEyebrow?: string;
  womensHealthEyebrow?: string;
  facilitiesEyebrow?: string;
  doctorsEyebrow?: string;
  doctorsSubtitle?: string;
  testimonialsEyebrow?: string;
  testimonialsSubtitle?: string;
  gallerySubtitle?: string;
  whyEyebrow?: string;
  mapEyebrow?: string;
  contactSubtitle?: string;
  faqEyebrow?: string;
  // ---- Section titles (large h1/h2 headings, may contain HTML) ----
  heroTitle?: string;
  overviewTitle?: string;
  centresTitle?: string;
  landmarksTitle?: string;
  areasTitle?: string;
  reachTitle?: string;
  treatmentsTitle?: string;
  womensHealthTitle?: string;
  facilitiesTitle?: string;
  doctorsTitle?: string;
  testimonialsTitle?: string;
  reviewsTitle?: string;
  galleryTitle?: string;
  whyTitle?: string;
  mapTitle?: string;
  contactTitle?: string;
  faqTitle?: string;
  ctaTitle?: string;
};

/* ---------- Resolved (serialisable) models — mirror City/Centre 1:1 (plus the
 * optional CMS-only sectionLabels overlay; absent on the pure-code path so the
 * fallback render stays byte-identical). ---------- */
export type ResolvedCity = City & { sectionLabels?: LocationSectionLabels };
export type ResolvedCentre = Centre & { sectionLabels?: LocationSectionLabels };

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
type SectionLabelsSource = { [K in keyof LocationSectionLabels]?: string | null } | null | undefined;

/** Shape a CMS sectionLabels group into the resolved overlay (null/undefined → "").
 *  Empty string is the correct fallback: falsy, so components use their built-in
 *  HTML defaults via `sl.field || "<html default>"`. */
const toSectionLabels = (s: SectionLabelsSource): LocationSectionLabels => ({
  // Eyebrows / sub-headings
  overviewEyebrow: s?.overviewEyebrow ?? "",
  centresEyebrow: s?.centresEyebrow ?? "",
  landmarksEyebrow: s?.landmarksEyebrow ?? "",
  areasEyebrow: s?.areasEyebrow ?? "",
  reachEyebrow: s?.reachEyebrow ?? "",
  treatmentsEyebrow: s?.treatmentsEyebrow ?? "",
  womensHealthEyebrow: s?.womensHealthEyebrow ?? "",
  facilitiesEyebrow: s?.facilitiesEyebrow ?? "",
  doctorsEyebrow: s?.doctorsEyebrow ?? "",
  doctorsSubtitle: s?.doctorsSubtitle ?? "",
  testimonialsEyebrow: s?.testimonialsEyebrow ?? "",
  testimonialsSubtitle: s?.testimonialsSubtitle ?? "",
  gallerySubtitle: s?.gallerySubtitle ?? "",
  whyEyebrow: s?.whyEyebrow ?? "",
  mapEyebrow: s?.mapEyebrow ?? "",
  contactSubtitle: s?.contactSubtitle ?? "",
  faqEyebrow: s?.faqEyebrow ?? "",
  // Section titles
  heroTitle: s?.heroTitle ?? "",
  overviewTitle: s?.overviewTitle ?? "",
  centresTitle: s?.centresTitle ?? "",
  landmarksTitle: s?.landmarksTitle ?? "",
  areasTitle: s?.areasTitle ?? "",
  reachTitle: s?.reachTitle ?? "",
  treatmentsTitle: s?.treatmentsTitle ?? "",
  womensHealthTitle: s?.womensHealthTitle ?? "",
  facilitiesTitle: s?.facilitiesTitle ?? "",
  doctorsTitle: s?.doctorsTitle ?? "",
  testimonialsTitle: s?.testimonialsTitle ?? "",
  reviewsTitle: s?.reviewsTitle ?? "",
  galleryTitle: s?.galleryTitle ?? "",
  whyTitle: s?.whyTitle ?? "",
  mapTitle: s?.mapTitle ?? "",
  contactTitle: s?.contactTitle ?? "",
  faqTitle: s?.faqTitle ?? "",
  ctaTitle: s?.ctaTitle ?? "",
});

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
      sectionLabels?: SectionLabelsSource;
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
      sectionLabels?: SectionLabelsSource;
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
  if (!def) {
    // DB-only centre — no code template behind it; build from CMS data alone.
    return {
      slug: src.slug ?? slug,
      citySlug: src.citySlug ?? citySlug,
      name: src.name ?? "",
      fullName: src.fullName ?? src.name ?? "",
      ...(src.isHeadOffice ? { isHeadOffice: src.isHeadOffice } : {}),
      area: src.area ?? "",
      address: src.address ?? "",
      pin: src.pin ?? "",
      phone: src.phone ?? "",
      phoneLabel: src.phoneLabel ?? "",
      hours: src.hours ?? "",
      opening: {
        opens: src.opening?.opens ?? "09:00",
        closes: src.opening?.closes ?? "20:00",
        ...(src.opening?.days?.length ? { days: values(src.opening.days) } : {}),
      },
      ...(src.geo?.lat != null && src.geo?.lng != null ? { geo: { lat: src.geo.lat, lng: src.geo.lng } } : {}),
      mapQuery: src.mapQuery ?? "",
      image: src.image ?? "",
      ...(src.hero360Url ? { hero360Url: src.hero360Url } : {}),
      nearby: values(src.nearby),
      landmarks: values(src.landmarks),
      howToReach: values(src.howToReach),
      facilities: values(src.facilities),
      doctors: values(src.doctors),
      treatments: values(src.treatments),
      faqs: toFaqs(src.faqs),
      ...(src.reviewsKey ? { reviewsKey: src.reviewsKey } : {}),
      ...(src.sameAs?.length ? { sameAs: values(src.sameAs) } : {}),
      intro: src.intro ?? "",
      gallery: toGallery(src.gallery),
      ...(src.womensHealth?.length ? { womensHealth: values(src.womensHealth) } : {}),
      // Published in admin = live, unless explicitly hidden via built: false
      built: src.built !== false,
      sectionLabels: toSectionLabels(src.sectionLabels),
    };
  }
  const base = centreToResolved(def);

  return {
    // Structural/relational fields carried from base; editorial fields from CMS with per-section fallback.
    ...base,
    // `built` is now DB-overridable: admin can toggle live/hidden without a code change.
    built: src.built ?? base.built,
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
    sectionLabels: toSectionLabels(src.sectionLabels),
  };
}

/**
 * Map a `cities` doc → ResolvedCity, falling back PER-SECTION to the typed
 * default for `slug`. Returns undefined for an unknown city with no default.
 */
export function resolveCity(slug: string, src: CitySource): ResolvedCity | undefined {
  const def = cityBySlug(slug);
  if (!src) return def ? cityToResolved(def) : undefined;
  if (!def) {
    // DB-only city — no code template; build from CMS data alone.
    return {
      slug: src.slug ?? slug,
      name: src.name ?? "",
      region: src.region ?? "",
      country: src.country ?? "IN",
      helpline: src.helpline ?? "",
      helplineLabel: src.helplineLabel ?? "",
      whatsapp: src.whatsapp ?? "",
      heroImage: src.heroImage ?? "",
      ...(src.hero360Url ? { hero360Url: src.hero360Url } : {}),
      intro: values(src.intro),
      faqs: toFaqs(src.faqs),
      ...(src.womensHealth?.length ? { womensHealth: values(src.womensHealth) } : {}),
      built: src.built !== false,
      sectionLabels: toSectionLabels(src.sectionLabels),
    };
  }
  const base = cityToResolved(def);

  return {
    ...base,
    // `built` is now DB-overridable.
    built: src.built ?? base.built,
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
    sectionLabels: toSectionLabels(src.sectionLabels),
  };
}

/**
 * Produce a fully-populated CitySource by merging `src` with the resolved
 * (default-overlaid) content for `slug`. Used by the inline editor to seed the
 * draft so every field/row is present before any edit — prevents sparse PATCH
 * bodies that fail Payload validation (mirrors materializeServiceSource).
 */
export function materializeCitySource(slug: string, src: CitySource): NonNullable<CitySource> {
  const r = resolveCity(slug, src);
  const s = (src ?? {}) as NonNullable<CitySource>;
  if (!r) return s;
  const v = (value: string) => ({ value });
  return {
    ...s,
    slug: r.slug,
    name: r.name,
    region: r.region,
    country: r.country,
    helpline: r.helpline,
    helplineLabel: r.helplineLabel,
    whatsapp: r.whatsapp,
    heroImage: r.heroImage,
    ...(r.hero360Url ? { hero360Url: r.hero360Url } : {}),
    intro: r.intro.map(v),
    faqs: r.faqs.map((f) => ({ q: f.q, a: f.a })),
    ...(r.womensHealth ? { womensHealth: r.womensHealth.map(v) } : {}),
    built: r.built,
    sectionLabels: toSectionLabels(s.sectionLabels),
  };
}

/**
 * Produce a fully-populated CentreSource by merging `src` with the resolved
 * content for (citySlug, slug). Used by the inline Centre editor.
 */
export function materializeCentreSource(citySlug: string, slug: string, src: CentreSource): NonNullable<CentreSource> {
  const r = resolveCentre(citySlug, slug, src);
  const s = (src ?? {}) as NonNullable<CentreSource>;
  if (!r) return s;
  const v = (value: string) => ({ value });
  return {
    ...s,
    slug: r.slug,
    citySlug: r.citySlug,
    name: r.name,
    fullName: r.fullName,
    ...(r.isHeadOffice ? { isHeadOffice: r.isHeadOffice } : {}),
    area: r.area,
    address: r.address,
    pin: r.pin,
    phone: r.phone,
    phoneLabel: r.phoneLabel,
    hours: r.hours,
    opening: { opens: r.opening.opens, closes: r.opening.closes, ...(r.opening.days ? { days: r.opening.days.map(v) } : {}) },
    ...(r.geo ? { geo: { lat: r.geo.lat, lng: r.geo.lng } } : {}),
    mapQuery: r.mapQuery,
    image: r.image,
    ...(r.hero360Url ? { hero360Url: r.hero360Url } : {}),
    nearby: r.nearby.map(v),
    landmarks: r.landmarks.map(v),
    howToReach: r.howToReach.map(v),
    facilities: r.facilities.map(v),
    doctors: r.doctors.map(v),
    treatments: r.treatments.map(v),
    faqs: r.faqs.map((f) => ({ q: f.q, a: f.a })),
    ...(r.reviewsKey ? { reviewsKey: r.reviewsKey } : {}),
    ...(r.sameAs ? { sameAs: r.sameAs.map(v) } : {}),
    intro: r.intro,
    gallery: r.gallery.map((g) => ({ src: g.src, alt: g.alt })),
    ...(r.womensHealth ? { womensHealth: r.womensHealth.map(v) } : {}),
    built: r.built,
    sectionLabels: toSectionLabels(s.sectionLabels),
  };
}
