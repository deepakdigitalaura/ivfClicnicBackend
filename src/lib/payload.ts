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
import type { Page, Blog, Config } from "@/payload-types";
import type { SiteIdentity } from "@/lib/seo";
import { resolveContactValues } from "@/lib/contact";
import { resolveFooter, type FooterData, type FooterSource } from "@/lib/footer";
import { resolveHeader, type HeaderData, type HeaderSource, type NavTreatmentItem, type NavDoctorItem, type NavLocationItem } from "@/lib/header";
import { resolveHomepage, type HomepageData, type HomepageSource } from "@/lib/homepage";
import { resolveAbout, type AboutData, type AboutSource } from "@/lib/about";
import { resolveTestimonials } from "@/lib/testimonials";
import type { Review } from "@/lib/reviews";
import { resolveService, type ResolvedService } from "@/lib/services";
import { resolveDoctor, DOCTORS, type Doctor, type DoctorSource } from "@/lib/doctors";
import { getSanityDoctors, type SanityDoctor } from "@/sanity/lib/fetch";
import { resolveTreatment, type ResolvedTreatment } from "@/lib/treatment-content";
import { TREATMENTS } from "@/lib/treatments";
import { resolveCity, resolveCentre, type ResolvedCity, type ResolvedCentre } from "@/lib/location-content";

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

// ---------- Blogs ----------

export const getBlogBySlug = async (_slug: string): Promise<Blog | null> => null;
export const getBlogBySlugDraft = async (_slug: string): Promise<Blog | null> => null;
export const getBlogs = async (_limit = 24): Promise<Blog[]> => [];
export const getBlogsPage = async (_page = 1, _limit = 24): Promise<BlogsPage> => ({
  docs: [],
  page: 1,
  totalPages: 1,
  totalDocs: 0,
  hasPrevPage: false,
  hasNextPage: false,
});
export const getBlogsByTreatmentSlug = async (_treatmentSlug: string, _limit = 3): Promise<Blog[]> => [];
export const getBlogsByLocationSlug = async (_locationSlug: string, _limit = 3): Promise<Blog[]> => [];
export const getRelatedBlogs = async (_slug: string, _treatmentSlugs: string[], _categoryId: number | null, _limit = 3): Promise<Blog[]> => [];
export const getCMEBlogs = async (): Promise<Blog[]> => [];
export const getPublishedBlogSlugs = async (): Promise<string[]> => [];

// ---------- Videos ----------

export const getEducationVideos = async (): Promise<EducationVideoItem[]> => [];
export const getTestimonialVideos = async (): Promise<TestimonialVideoItem[]> => [];

// ---------- Services ----------

export const getService = async (slug: string): Promise<ResolvedService | undefined> =>
  resolveService(slug, null);

export const getPublishedServiceSlugs = async (): Promise<string[]> => [];

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

export const getTreatment = async (slug: string): Promise<ResolvedTreatment | undefined> =>
  resolveTreatment(slug, null);

export const getTreatments = async (): Promise<ResolvedTreatment[]> =>
  TREATMENTS.map((t) => resolveTreatment(t.slug, null)).filter((t): t is ResolvedTreatment => !!t);

// ---------- Locations ----------

export const getCity = async (slug: string): Promise<ResolvedCity | undefined> =>
  resolveCity(slug, null);

export const getCentre = async (citySlug: string, slug: string): Promise<ResolvedCentre | undefined> =>
  resolveCentre(citySlug, slug, null);

export const getPublishedCitySlugs = async (): Promise<string[]> => [];
export const getPublishedCentreParams = async (): Promise<{ city: string; center: string }[]> => [];
export const getPublishedCentresForCity = async (_citySlug: string): Promise<{ slug: string; name: string }[]> => [];

// ---------- Globals ----------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getGlobalSafe<S extends keyof Config["globals"]>(
  _slug: S,
): Promise<Config["globals"][S] | null> {
  return Promise.resolve(null);
}

export const getSiteIdentity = async (): Promise<SiteIdentity | undefined> => undefined;

export const getFooter = async (): Promise<FooterData> =>
  resolveFooter(null as unknown as FooterSource, resolveContactValues(null), [], [], []);

export const getHeader = async (): Promise<HeaderData> =>
  resolveHeader(null as unknown as HeaderSource, [], [], []);

export const getHomepage = async (): Promise<HomepageData> =>
  resolveHomepage(null as unknown as HomepageSource);

export const getAbout = async (): Promise<AboutData> =>
  resolveAbout(null as unknown as AboutSource);

export const getTestimonials = async (): Promise<Review[]> =>
  resolveTestimonials([]);
