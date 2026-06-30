/**
 * Payload CMS has been replaced with Sanity. This file keeps the same exported
 * function signatures so every existing page/component continues to compile and
 * render — all functions return the code-defined static fallback values that the
 * resolver layers (doctors, treatments, services, etc.) already produce when no
 * CMS data is present.
 *
 * SEO features (robots, sitemap, scripts, redirects, JSON-LD, per-page SEO) are
 * now managed via Sanity — see src/sanity/.
 */
import type { Payload } from "payload";
import type { Page, Blog, Author, Category, Media, Config } from "@/payload-types";
import type { SiteIdentity } from "@/lib/seo";
import { resolveContactValues } from "@/lib/contact";
import { resolveFooter, type FooterData, type FooterSource } from "@/lib/footer";
import { resolveHeader, type HeaderData, type HeaderSource, type NavTreatmentItem, type NavDoctorItem, type NavLocationItem } from "@/lib/header";
import { resolveHomepage, type HomepageData, type HomepageSource } from "@/lib/homepage";
import { getSanityHomepage } from "@/sanity/lib/fetch";
import { resolveAbout, type AboutData, type AboutSource } from "@/lib/about";
import { resolveTestimonials } from "@/lib/testimonials";
import type { Review } from "@/lib/reviews";
import { resolveService, type ResolvedService } from "@/lib/services";
import { resolveDoctor, DOCTORS, doctorUrl, defaultDoctorNavRole, defaultDoctorNavOrder, type Doctor, type DoctorSource } from "@/lib/doctors";
import {
  getSanityDoctors,
  getSanityTestimonials,
  getSanitySiteSettings,
  getSanityEducationVideos,
  getSanityBlogsPage,
  getSanityBlogBySlug,
  getSanityPublishedBlogSlugs,
  getSanityBlogsByTreatmentSlug,
  getSanityBlogsByLocationSlug,
  getSanityRelatedBlogs,
  getSanityCMEBlogs,
  getSanityTreatments,
  getSanityTreatment,
  getSanityServices,
  getSanityService,
  getSanityCities,
  getSanityCity,
  getSanityCentres,
  getSanityCentre,
  getSanityAbout,
  type SanityDoctor,
  type SanitySiteSettings,
  type SanityBlog,
  type SanityTreatment,
  type SanityCentre as SanityCentreDoc,
} from "@/sanity/lib/fetch";
import type { ContactSource } from "@/lib/contact";
import { resolveTreatment, type ResolvedTreatment, type TreatmentSource } from "@/lib/treatment-content";
import { TREATMENTS, treatmentBySlug } from "@/lib/treatments";
import { resolveCity, resolveCentre, type ResolvedCity, type ResolvedCentre, type CitySource, type CentreSource } from "@/lib/location-content";
import { type ServiceSource } from "@/lib/services";

// ---------- Types (kept for callers) ----------

export type EducationVideoItem = { id: string; title: string; desc: string; tab: string };
export type TestimonialVideoItem = { id: string; name: string; quote: string; stars: number };
export type BlogsPage = {
  docs: Blog[];
  page: number;
  totalPages: number;
  totalDocs: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};

// ---------- Legacy compatibility (payloadClient used by some editor routes) ----------

/** @deprecated Payload removed. Always throws — callers have try/catch fallbacks. */
export const payloadClient = async (): Promise<Payload> => {
  throw new Error("Payload CMS has been removed. Use Sanity instead.");
};

// ---------- Pages ----------

export const getPageBySlug = async (_slug: string): Promise<Page | null> => null;
export const getPageBySlugDraft = async (_slug: string): Promise<Page | null> => null;
export const getPublishedPageSlugs = async (): Promise<string[]> => [];

// ---------- Blog helpers ----------

function makeMedia(url: string | null | undefined, alt: string): Media | null {
  if (!url) return null;
  return { id: 0, alt, url, updatedAt: "", createdAt: "" };
}

function makeAuthor(
  name: string | null | undefined,
  slug: string | null | undefined,
  role: string | null | undefined,
  credentials: string | null | undefined,
  avatarUrl: string | null | undefined,
  bio: string | null | undefined,
): Author | null {
  if (!name) return null;
  return {
    id: 0,
    name,
    slug: slug ?? "",
    role: role ?? null,
    credentials: credentials ?? null,
    avatar: makeMedia(avatarUrl, name),
    bio: bio ?? null,
    sameAs: null,
    updatedAt: "",
    createdAt: "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeJSON(s: string | null | undefined): any {
  if (!s) return null;
  try { return JSON.parse(s); } catch { return null; }
}

function toBlogDoc(b: SanityBlog): Blog {
  const author = makeAuthor(
    b.authorName, b.authorSlug, b.authorRole, b.authorCredentials, b.authorAvatarUrl, b.authorBioText,
  ) ?? { id: 0, name: "", slug: "", updatedAt: "", createdAt: "" };

  const reviewer = makeAuthor(
    b.reviewerName, b.reviewerSlug, b.reviewerRole, b.reviewerCredentials, b.reviewerAvatarUrl, null,
  );

  const category: Category | null = b.categorySlug
    ? {
        id: b.categorySlug as unknown as number,
        title: b.categoryTitle ?? b.categorySlug,
        slug: b.categorySlug,
        updatedAt: "",
        createdAt: "",
      }
    : null;

  return {
    id: b.pgId ?? 0,
    title: b.title ?? "",
    slug: b.slug ?? "",
    excerpt: b.excerpt ?? null,
    heroImage: makeMedia(b.heroImageUrl, b.heroImageAlt ?? ""),
    heroTextDark: b.heroTextDark ?? null,
    heroImagePosition: b.heroImagePosition as Blog["heroImagePosition"] ?? null,
    content: safeJSON(b.contentRaw),
    author,
    reviewedBy: reviewer,
    category,
    readMins: b.readMins ?? null,
    publishedAt: b.publishedAt ?? null,
    lastUpdatedAt: b.lastUpdatedAt ?? null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    treatmentSlugs: b.treatmentSlugs?.map((slug) => ({ slug: slug as any, id: null })) ?? null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    locationSlugs: b.locationSlugs?.map((slug) => ({ slug: slug as any, id: null })) ?? null,
    faqs: b.faqs?.map((f, i) => ({ question: f.question, answer: f.answer, id: String(i) })) ?? null,
    seo: {
      metaTitle: b.seoMetaTitle ?? null,
      metaDescription: b.seoMetaDescription ?? null,
      ogTitle: b.seoOgTitle ?? null,
      ogDescription: b.seoOgDescription ?? null,
      ogImage: makeMedia(b.seoOgImageUrl, ""),
    },
    updatedAt: b.lastUpdatedAt ?? b.publishedAt ?? new Date().toISOString(),
    createdAt: b.publishedAt ?? new Date().toISOString(),
    _status: (b.status === "draft" ? "draft" : "published") as Blog["_status"],
  };
}

// ---------- Blogs ----------

export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  const b = await getSanityBlogBySlug(slug);
  return b ? toBlogDoc(b) : null;
};

export const getBlogBySlugDraft = async (_slug: string): Promise<Blog | null> => null;
export const getBlogs = async (_limit = 24): Promise<Blog[]> => {
  const r = await getSanityBlogsPage(1, _limit);
  return r ? r.docs.map(toBlogDoc) : [];
};

export const getBlogsPage = async (page = 1, limit = 24): Promise<BlogsPage> => {
  const r = await getSanityBlogsPage(page, limit);
  if (!r) return { docs: [], page: 1, totalPages: 1, totalDocs: 0, hasPrevPage: false, hasNextPage: false };
  const totalPages = Math.max(1, Math.ceil(r.total / limit));
  return {
    docs: r.docs.map(toBlogDoc),
    page,
    totalPages,
    totalDocs: r.total,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getBlogsByTreatmentSlug = async (treatmentSlug: string, _limit = 3): Promise<Blog[]> => {
  const docs = await getSanityBlogsByTreatmentSlug(treatmentSlug);
  return docs.slice(0, _limit).map(toBlogDoc);
};

export const getBlogsByLocationSlug = async (locationSlug: string, _limit = 3): Promise<Blog[]> => {
  const docs = await getSanityBlogsByLocationSlug(locationSlug);
  return docs.slice(0, _limit).map(toBlogDoc);
};

export const getRelatedBlogs = async (
  slug: string,
  _treatmentSlugs: string[],
  categoryId: number | string | null,
  limit = 3,
): Promise<Blog[]> => {
  const categorySlug = categoryId != null ? String(categoryId) : null;
  const docs = await getSanityRelatedBlogs(slug, categorySlug);
  return docs.slice(0, limit).map(toBlogDoc);
};

export const getCMEBlogs = async (): Promise<Blog[]> => {
  const docs = await getSanityCMEBlogs();
  return docs.map(toBlogDoc);
};

export const getPublishedBlogSlugs = async (): Promise<string[]> => {
  const docs = await getSanityPublishedBlogSlugs();
  return docs.map((d) => d.slug).filter(Boolean) as string[];
};

// ---------- Videos ----------

export const getEducationVideos = async (): Promise<EducationVideoItem[]> => {
  const docs = await getSanityEducationVideos();
  return docs
    .filter((v) => v.youtubeId && v.title)
    .map((v) => ({
      id: v.youtubeId as string,
      title: v.title as string,
      desc: v.description ?? "",
      tab: v.category ?? "",
    }));
};

/** Video testimonials (those with a YouTube ID) for /testimonial-videos. */
export const getTestimonialVideos = async (): Promise<TestimonialVideoItem[]> => {
  const docs = await getSanityTestimonials();
  return docs
    .filter((t) => t.youtubeId && t.author && t.quote)
    .map((t) => ({
      id: t.youtubeId as string,
      name: t.author as string,
      quote: t.quote as string,
      stars: typeof t.rating === "number" ? t.rating : 5,
    }));
};

// ---------- Services ----------

/** Map a Sanity service doc to the ServiceSource shape resolveService overlays. */
function toServiceSource(d: Awaited<ReturnType<typeof getSanityService>>): ServiceSource {
  if (!d) return null;
  return {
    slug: d.slug ?? null,
    hero: d.hero ? {
      eyebrow: d.hero.eyebrow ?? null,
      h1: d.hero.h1 ?? null,
      h1Em: d.hero.h1Em ?? null,
      tagline: d.hero.tagline ?? null,
      badges: d.hero.badges ?? null,
      image: d.hero.image ?? null,
      imageAlt: d.hero.imageAlt ?? null,
      heroPhoto: d.hero.heroPhoto?.asset?.url
        ? { url: d.hero.heroPhoto.asset.url }
        : undefined,
    } : null,
    seo: d.seo ? { metaTitle: d.seo.metaTitle ?? null, metaDescription: d.seo.metaDescription ?? null } : null,
    overview: d.overview ?? null,
    benefits: d.benefits ?? null,
    whoFor: d.whoFor ?? null,
    process: d.process ?? null,
    whyUs: d.whyUs ?? null,
    faqs: d.faqs ?? null,
  };
}

export const getService = async (slug: string): Promise<ResolvedService | undefined> => {
  const doc = await getSanityService(slug);
  return resolveService(slug, toServiceSource(doc));
};

export const getPublishedServiceSlugs = async (): Promise<string[]> => {
  const docs = await getSanityServices();
  return docs.filter((d) => d.slug).map((d) => d.slug as string);
};

// ---------- Doctors (Sanity-backed, code fallback) ----------

const toRows = (a?: string[] | null) => (a && a.length ? a.map((value) => ({ value })) : undefined);

/** Map a Sanity doctor doc to the DoctorSource shape resolveDoctor overlays. */
function toDoctorSource(d: SanityDoctor): DoctorSource {
  return {
    name: d.name ?? null,
    credentials: d.credentials ?? null,
    specialty: d.specialty ?? null,
    role: d.role ?? null,
    image: d.photoUrl ?? d.imageUrl ?? null,
    experienceLabel: d.experienceLabel ?? null,
    experienceYears: d.experienceYears ?? null,
    cities: toRows(d.cities),
    locations: toRows(d.locations),
    treatments: toRows(d.treatments),
    shortBio: d.shortBio ?? null,
    bio: toRows(d.bio),
    knowsAbout: toRows(d.knowsAbout),
    alumniOf: toRows(d.alumniOf),
    memberOf: toRows(d.memberOf),
    awards: toRows(d.awards),
    training: toRows(d.training),
    publications: toRows(d.publications),
    languages: toRows(d.languages),
    sameAs: toRows(d.sameAs),
    verified: d.verified ?? null,
    visitsAllCentres: d.visitsAllCentres ?? null,
    navRole: d.navRole ?? null,
    navOrder: d.navOrder ?? null,
  };
}

export const getDoctor = async (slug: string): Promise<Doctor | undefined> => {
  const docs = await getSanityDoctors();
  const found = docs.find((d) => d.slug === slug);
  return resolveDoctor(slug, found ? toDoctorSource(found) : null);
};

/**
 * All doctors, code order first (founders/core), then any Sanity-only doctors
 * (admin-created) appended by navOrder. Falls back to the code DOCTORS list when
 * Sanity is empty/unavailable — byte-identical to before.
 */
export const getDoctors = async (): Promise<Doctor[]> => {
  const docs = await getSanityDoctors();
  const bySlug = new Map(docs.filter((d) => d.slug).map((d) => [d.slug as string, toDoctorSource(d)]));
  const codeSlugs = new Set(DOCTORS.map((d) => d.slug));

  const resolved: Doctor[] = DOCTORS
    .map((d) => resolveDoctor(d.slug, bySlug.get(d.slug) ?? null))
    .filter((d): d is Doctor => !!d);

  const dbOnly = docs
    .filter((d) => d.slug && !codeSlugs.has(d.slug))
    .sort((a, b) => (a.navOrder ?? 999) - (b.navOrder ?? 999) || (a.slug! < b.slug! ? -1 : 1));
  for (const d of dbOnly) {
    const doc = resolveDoctor(d.slug as string, toDoctorSource(d));
    if (doc) resolved.push(doc);
  }
  return resolved;
};

// ---------- Treatments ----------

/** Map a Sanity treatment doc to the TreatmentSource shape resolveTreatment overlays. */
function toTreatmentSource(d: SanityTreatment | null | undefined): TreatmentSource {
  if (!d) return null;
  return {
    slug: d.slug ?? null,
    href: d.href ?? null,
    hero: d.hero ? {
      eyebrow: d.hero.eyebrow ?? null,
      h1: d.hero.h1 ?? null,
      h1Em: d.hero.h1Em ?? null,
      tagline: d.hero.tagline ?? null,
      badges: d.hero.badges ?? null,
      image: d.hero.image ?? null,
      imageAlt: d.hero.imageAlt ?? null,
      heroPhoto: d.hero.heroPhoto?.asset?.url
        ? { url: d.hero.heroPhoto.asset.url }
        : undefined,
    } : null,
    meta: d.meta ?? null,
    whatIs: d.whatIs ?? null,
    benefits: d.benefits ?? null,
    whoNeedsIt: d.whoNeedsIt ?? null,
    process: d.process ?? null,
    risks: d.risks ?? null,
    faqs: d.faqs ?? null,
    cta: d.cta ?? null,
  };
}

export const getTreatment = async (slug: string): Promise<ResolvedTreatment | undefined> => {
  const doc = await getSanityTreatment(slug);
  return resolveTreatment(slug, toTreatmentSource(doc));
};

export const getTreatments = async (): Promise<ResolvedTreatment[]> => {
  const docs = await getSanityTreatments();
  const bySlug = new Map(docs.filter((d) => d.slug).map((d) => [d.slug as string, d]));
  return TREATMENTS
    .map((t) => resolveTreatment(t.slug, toTreatmentSource(bySlug.get(t.slug) ?? null)))
    .filter((t): t is ResolvedTreatment => !!t);
};

// ---------- Locations ----------

function toCitySource(d: Awaited<ReturnType<typeof getSanityCity>>): CitySource {
  if (!d) return null;
  return {
    slug: d.slug ?? null,
    name: d.name ?? null,
    region: d.region ?? null,
    country: d.country ?? null,
    helpline: d.helpline ?? null,
    helplineLabel: d.helplineLabel ?? null,
    whatsapp: d.whatsapp ?? null,
    heroImage: d.heroImage ?? null,
    hero360Url: d.hero360Url ?? null,
    built: d.built ?? null,
    intro: d.intro ?? null,
    faqs: d.faqs ?? null,
    womensHealth: d.womensHealth ?? null,
  };
}

function toCentreSource(d: SanityCentreDoc | null | undefined): CentreSource {
  if (!d) return null;
  return {
    slug: d.slug ?? null,
    citySlug: d.citySlug ?? null,
    name: d.name ?? null,
    fullName: d.fullName ?? null,
    isHeadOffice: d.isHeadOffice ?? null,
    area: d.area ?? null,
    built: d.built ?? null,
    address: d.address ?? null,
    pin: d.pin ?? null,
    phone: d.phone ?? null,
    phoneLabel: d.phoneLabel ?? null,
    hours: d.hours ?? null,
    opening: d.opening ? { opens: d.opening.opens ?? null, closes: d.opening.closes ?? null, days: d.opening.days ?? null } : null,
    geo: d.geo ? { lat: d.geo.lat ?? null, lng: d.geo.lng ?? null } : null,
    mapQuery: d.mapQuery ?? null,
    image: d.image ?? null,
    hero360Url: d.hero360Url ?? null,
    nearby: d.nearby ?? null,
    landmarks: d.landmarks ?? null,
    howToReach: d.howToReach ?? null,
    facilities: d.facilities ?? null,
    doctors: d.doctors ?? null,
    treatments: d.treatments ?? null,
    faqs: d.faqs ?? null,
    reviewsKey: d.reviewsKey ?? null,
    sameAs: d.sameAs ?? null,
    intro: d.intro ?? null,
    gallery: d.gallery ?? null,
    womensHealth: d.womensHealth ?? null,
  };
}

export const getCity = async (slug: string): Promise<ResolvedCity | undefined> => {
  const doc = await getSanityCity(slug);
  return resolveCity(slug, toCitySource(doc));
};

export const getCentre = async (citySlug: string, slug: string): Promise<ResolvedCentre | undefined> => {
  const doc = await getSanityCentre(citySlug, slug);
  return resolveCentre(citySlug, slug, toCentreSource(doc));
};

export const getPublishedCitySlugs = async (): Promise<string[]> => {
  const docs = await getSanityCities();
  return docs.filter((d) => d.slug && d.built !== false).map((d) => d.slug as string);
};

export const getPublishedCentreParams = async (): Promise<{ city: string; center: string }[]> => {
  const docs = await getSanityCentres();
  return docs
    .filter((d) => d.slug && d.citySlug && d.built !== false)
    .map((d) => ({ city: d.citySlug as string, center: d.slug as string }));
};

export const getPublishedCentresForCity = async (citySlug: string): Promise<{ slug: string; name: string }[]> => {
  const docs = await getSanityCentres();
  return docs
    .filter((d) => d.citySlug === citySlug && d.slug && d.built !== false)
    .map((d) => ({ slug: d.slug as string, name: d.name ?? d.slug ?? "" }));
};

// ---------- Globals ----------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getGlobalSafe<S extends keyof Config["globals"]>(
  _slug: S,
): Promise<Config["globals"][S] | null> {
  return Promise.resolve(null);
}

/** Map the Sanity site-settings doc → ContactSource (phone/email/WhatsApp). */
function toContactSource(s: SanitySiteSettings): ContactSource {
  if (!s) return null;
  return {
    telephone: s.telephone ?? null,
    telephoneDisplay: s.telephoneDisplay ?? null,
    email: s.email ?? null,
    whatsapp: s.whatsapp ?? null,
  };
}

/** Map the Sanity site-settings doc → SiteIdentity (schema/identity). Returns
 *  undefined when unset so siteGraph() falls back to the SITE constant. */
export const getSiteIdentity = async (): Promise<SiteIdentity | undefined> => {
  const s = await getSanitySiteSettings();
  if (!s) return undefined;
  return {
    name: s.brandName ?? null,
    alternateName: s.alternateName ?? null,
    legalName: s.legalName ?? null,
    logo: s.logoUrl ?? null,
    foundingDate: s.foundingDate ?? null,
    telephone: s.telephone ?? null,
    email: s.email ?? null,
    address: s.address ?? null,
    awards: s.awards?.length ? s.awards : null,
    knowsAbout: s.knowsAbout?.length ? s.knowsAbout : null,
    sameAs: s.socialLinks?.length ? s.socialLinks : null,
  };
};

/** Build NavTreatmentItem list from Sanity treatment docs + code fallback hrefs. */
async function getNavTreatments(): Promise<NavTreatmentItem[]> {
  const docs = await getSanityTreatments();
  return docs
    .filter((d) => d.slug && d.navCategory)
    .map((d) => {
      const codeDef = treatmentBySlug(d.slug as string);
      return {
        slug: d.slug as string,
        name: (codeDef?.name ?? d.slug) as string,
        href: d.href || codeDef?.href || `/treatments/${d.slug}`,
        navCategory: d.navCategory as string,
        navOrder: d.navOrder ?? 0,
      };
    });
}

/**
 * Build NavDoctorItem list, code doctors first (with their per-field Sanity
 * overlay applied, falling back to a default navRole/navOrder when an admin
 * hasn't set one), then any Sanity-only (admin-created) doctors appended.
 * An admin editing/adding one doctor must never make the rest disappear from
 * the nav menu — each doctor resolves independently, like getDoctors().
 */
async function getNavDoctors(): Promise<NavDoctorItem[]> {
  const docs = await getSanityDoctors();
  const bySlug = new Map(docs.filter((d) => d.slug).map((d) => [d.slug as string, d]));
  const codeSlugs = new Set(DOCTORS.map((d) => d.slug));

  const fromCode: NavDoctorItem[] = DOCTORS.map((d) => {
    const sanityDoc = bySlug.get(d.slug);
    return {
      slug: d.slug,
      name: sanityDoc?.name || d.name,
      href: doctorUrl(d.slug),
      navRole: sanityDoc?.navRole ?? defaultDoctorNavRole(d.slug),
      navOrder: sanityDoc?.navOrder ?? defaultDoctorNavOrder(d.slug),
      city: sanityDoc?.cities?.[0] ?? d.cities[0] ?? "",
      experienceLabel: sanityDoc?.experienceLabel || d.experienceLabel || undefined,
    };
  });

  const dbOnly: NavDoctorItem[] = docs
    .filter((d): d is SanityDoctor & { slug: string; name: string; navRole: "senior-specialist" | "specialist" } =>
      !!d.slug && !!d.name && !!d.navRole && !codeSlugs.has(d.slug))
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      href: doctorUrl(d.slug),
      navRole: d.navRole,
      navOrder: d.navOrder ?? 0,
      city: d.cities?.[0] ?? "",
      experienceLabel: d.experienceLabel || undefined,
    }));

  return [...fromCode, ...dbOnly];
}

/** Build NavLocationItem list (one entry per city, each carrying its live centres). */
async function getNavLocations(): Promise<NavLocationItem[]> {
  const [cities, centres] = await Promise.all([getSanityCities(), getSanityCentres()]);
  const liveCities = cities.filter((c) => c.slug && c.built !== false);
  return liveCities.map((c) => ({
    citySlug: c.slug as string,
    cityName: c.name || (c.slug as string),
    centres: centres
      .filter((cn) => cn.citySlug === c.slug && cn.slug && cn.built !== false)
      .map((cn) => ({ slug: cn.slug as string, name: cn.name || (cn.slug as string) })),
  }));
}

export const getFooter = async (): Promise<FooterData> => {
  const [settings, navTreatments, navDoctors, navLocations] = await Promise.all([
    getSanitySiteSettings(),
    getNavTreatments(),
    getNavDoctors(),
    getNavLocations(),
  ]);
  return resolveFooter(null as unknown as FooterSource, resolveContactValues(toContactSource(settings)), navTreatments, navDoctors, navLocations);
};

export const getHeader = async (): Promise<HeaderData> => {
  const [navTreatments, navDoctors, navLocations] = await Promise.all([
    getNavTreatments(),
    getNavDoctors(),
    getNavLocations(),
  ]);
  return resolveHeader(null as unknown as HeaderSource, navTreatments, navDoctors, navLocations);
};

/** Map the Sanity homepage doc → the HomepageSource shape resolveHomepage
 *  overlays. Converts string[] badge/feature lists to the {text}[] form the
 *  source expects; everything else passes through. Unknown/empty → resolver
 *  uses HOMEPAGE_DEFAULTS per-section (byte-identical). */
function mapHomepageSource(doc: Record<string, unknown> | null): HomepageSource {
  if (!doc) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = doc as any;
  const textRows = (a?: string[] | null) => (Array.isArray(a) ? a.filter(Boolean).map((text) => ({ text })) : undefined);
  return {
    ...d,
    hero: d.hero ? { ...d.hero, badges: textRows(d.hero.badges) } : undefined,
    suraksha: d.suraksha ? { ...d.suraksha, features: textRows(d.suraksha.features) } : undefined,
  } as HomepageSource;
}

export const getHomepage = async (): Promise<HomepageData> => {
  const doc = await getSanityHomepage();
  return resolveHomepage(mapHomepageSource(doc));
};

export const getAbout = async (): Promise<AboutData> => {
  const doc = await getSanityAbout();
  if (!doc) return resolveAbout(null);
  return resolveAbout({
    hero: doc.hero ?? null,
    story: doc.story ?? null,
    atAGlance: doc.atAGlance ?? null,
    legacy: doc.legacy ?? null,
    milestones: doc.milestones ?? null,
    trust: doc.trust ?? null,
    trustPillars: doc.trustPillars ?? null,
    patientFirst: doc.patientFirst ?? null,
    patientStats: doc.patientStats ?? null,
    meetSpecialists: doc.meetSpecialists ?? null,
    network: doc.network ?? null,
    finalCta: doc.finalCta ?? null,
    seo: doc.seo ?? null,
  } as AboutSource);
};

/** Text testimonials (no YouTube ID) for the homepage "Patient review" cards. */
export const getTestimonials = async (): Promise<Review[]> => {
  const docs = await getSanityTestimonials();
  return resolveTestimonials(
    docs
      .filter((t) => !t.youtubeId)
      .map((t) => ({
        author: t.author ?? null,
        rating: t.rating ?? null,
        quote: t.quote ?? null,
        role: t.role ?? null,
        published: t.published ?? null,
        order: t.order ?? null,
        createdAt: t.createdAt ?? null,
      })),
  );
};
