import "server-only";
import { unstable_cache } from "next/cache";
import { client } from "./client";
import {
  ROBOTS_QUERY,
  SCRIPTS_QUERY,
  REDIRECTS_QUERY,
  SITEMAP_QUERY,
  SCHEMA_ORG_QUERY,
  PAGE_SEO_BY_PATH_QUERY,
} from "./queries";

async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
  try {
    return await client.fetch<T>(query, params ?? {});
  } catch {
    return null;
  }
}

export type RobotsConfig = {
  rawContent?: string;
};

export type ScriptEntry = { name?: string; enabled?: boolean; code?: string };
export type ScriptsConfig = {
  headScripts?: ScriptEntry[];
  bodyScripts?: ScriptEntry[];
};

export type RedirectRule = { source: string; destination: string; permanent: boolean; enabled: boolean };
export type RedirectsConfig = { rules?: RedirectRule[] };

export type SitemapConfig = {
  excludePaths?: string[];
  additionalUrls?: { url: string; priority?: number; changefreq?: string }[];
};

export type SchemaOrgConfig = {
  organizationName?: string;
  organizationUrl?: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  socialProfiles?: string[];
  customSchemas?: { name?: string; enabled?: boolean; jsonCode?: string }[];
};

export type PageSeo = {
  pagePath?: string;
  pageName?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  customSchemaJson?: string;
};

export const getRobotsConfig = () =>
  unstable_cache(
    () => sanityFetch<RobotsConfig>(ROBOTS_QUERY),
    ["sanity-robots"],
    { revalidate: 3600, tags: ["sanity-robots"] },
  )();

export const getScriptsConfig = () =>
  unstable_cache(
    () => sanityFetch<ScriptsConfig>(SCRIPTS_QUERY),
    ["sanity-scripts"],
    { revalidate: 3600, tags: ["sanity-scripts"] },
  )();

export const getRedirectsConfig = () =>
  unstable_cache(
    () => sanityFetch<RedirectsConfig>(REDIRECTS_QUERY),
    ["sanity-redirects"],
    { revalidate: 3600, tags: ["sanity-redirects"] },
  )();

export const getSitemapConfig = () =>
  unstable_cache(
    () => sanityFetch<SitemapConfig>(SITEMAP_QUERY),
    ["sanity-sitemap"],
    { revalidate: 3600, tags: ["sanity-sitemap"] },
  )();

export const getSchemaOrgConfig = () =>
  unstable_cache(
    () => sanityFetch<SchemaOrgConfig>(SCHEMA_ORG_QUERY),
    ["sanity-schema-org"],
    { revalidate: 3600, tags: ["sanity-schema-org"] },
  )();

export const getPageSeo = (path: string) =>
  unstable_cache(
    () => sanityFetch<PageSeo>(PAGE_SEO_BY_PATH_QUERY, { path }),
    ["sanity-page-seo", path],
    { revalidate: 3600, tags: ["sanity-page-seo"] },
  )();

// ── Doctors ──

export type SanityDoctor = {
  slug?: string;
  name?: string;
  credentials?: string;
  specialty?: string;
  role?: string;
  imageUrl?: string;
  photoUrl?: string;
  experienceLabel?: string;
  experienceYears?: number;
  cities?: string[];
  treatments?: string[];
  locations?: string[];
  shortBio?: string;
  bio?: string[];
  knowsAbout?: string[];
  alumniOf?: string[];
  memberOf?: string[];
  awards?: string[];
  training?: string[];
  publications?: string[];
  languages?: string[];
  sameAs?: string[];
  verified?: boolean;
  visitsAllCentres?: boolean;
  navRole?: "senior-specialist" | "specialist";
  navOrder?: number;
};

const DOCTORS_QUERY = `*[_type == "doctor"]{
  slug, name, credentials, specialty, role, imageUrl,
  "photoUrl": photo.asset->url,
  experienceLabel, experienceYears,
  cities, treatments, locations,
  shortBio, bio,
  knowsAbout, alumniOf, memberOf, awards, training, publications, languages, sameAs,
  verified, visitsAllCentres, navRole, navOrder
}`;

/** All doctors from Sanity (cached + tagged). Empty array when none/unconfigured,
 *  so the resolver falls back to the code DOCTORS list byte-identically. */
export const getSanityDoctors = () =>
  unstable_cache(
    async () => (await sanityFetch<SanityDoctor[]>(DOCTORS_QUERY)) ?? [],
    ["sanity-doctors"],
    { revalidate: 3600, tags: ["sanity-doctors"] },
  )();

// ── Testimonials (text + video) ──

export type SanityTestimonial = {
  author?: string;
  role?: string;
  quote?: string;
  rating?: number;
  youtubeId?: string;
  published?: boolean;
  order?: number;
  createdAt?: string;
};

const TESTIMONIALS_QUERY = `*[_type == "testimonial" && published != false] | order(order asc){
  author, role, quote, rating, youtubeId, published, order, "createdAt": _createdAt
}`;

/** All visible testimonials from Sanity (cached + tagged). Empty when none, so
 *  the homepage/testimonial pages fall back to their built-in defaults. */
export const getSanityTestimonials = () =>
  unstable_cache(
    async () => (await sanityFetch<SanityTestimonial[]>(TESTIMONIALS_QUERY)) ?? [],
    ["sanity-testimonials"],
    { revalidate: 3600, tags: ["sanity-testimonials"] },
  )();

// ── Homepage (singleton) ──

/** Loose shape — kept decoupled; mapped to HomepageSource in payload.ts. */
export type SanityHomepage = Record<string, unknown> | null;

/** The homepage singleton from Sanity (cached + tagged). Null when unset, so the
 *  homepage falls back to HOMEPAGE_DEFAULTS byte-identically. */
export const getSanityHomepage = () =>
  unstable_cache(
    () => sanityFetch<SanityHomepage>(`*[_type == "homepage"][0]`),
    ["sanity-homepage"],
    { revalidate: 3600, tags: ["sanity-homepage"] },
  )();

// ── Site Settings (singleton — shared across every page) ──

export type SanitySiteSettings = {
  brandName?: string;
  alternateName?: string;
  legalName?: string;
  logoUrl?: string;
  foundingDate?: string;
  telephone?: string;
  telephoneDisplay?: string;
  email?: string;
  whatsapp?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  socialLinks?: string[];
  awards?: string[];
  knowsAbout?: string[];
} | null;

/** The site-settings singleton (cached + tagged). Null when unset, so identity /
 *  contact fall back to the SITE constant byte-identically. */
export const getSanitySiteSettings = () =>
  unstable_cache(
    () => sanityFetch<SanitySiteSettings>(`*[_type == "siteSettings"][0]`),
    ["sanity-site-settings"],
    { revalidate: 3600, tags: ["sanity-site-settings"] },
  )();

// ── Education Videos ──

export type SanityEducationVideo = {
  _id: string;
  title?: string;
  category?: string;
  youtubeId?: string;
  description?: string;
  published?: boolean;
  order?: number;
};

const EDUCATION_VIDEOS_QUERY = `*[_type == "educationVideo" && published != false] | order(category asc, order asc){
  _id, title, category, youtubeId, description, published, order
}`;

export const getSanityEducationVideos = () =>
  unstable_cache(
    async () => (await sanityFetch<SanityEducationVideo[]>(EDUCATION_VIDEOS_QUERY)) ?? [],
    ["sanity-education-videos"],
    { revalidate: 3600, tags: ["sanity-education-videos"] },
  )();

// ── Blogs ──

export type SanityBlog = {
  _id: string;
  pgId?: number;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  heroImageUrl?: string | null;
  heroImageAlt?: string | null;
  heroTextDark?: boolean | null;
  heroImagePosition?: string | null;
  contentRaw?: string | null;
  authorSlug?: string | null;
  authorName?: string | null;
  authorRole?: string | null;
  authorCredentials?: string | null;
  authorAvatarUrl?: string | null;
  authorBioText?: string | null;
  reviewerSlug?: string | null;
  reviewerName?: string | null;
  reviewerRole?: string | null;
  reviewerCredentials?: string | null;
  reviewerAvatarUrl?: string | null;
  categoryTitle?: string | null;
  categorySlug?: string | null;
  readMins?: number | null;
  publishedAt?: string | null;
  lastUpdatedAt?: string | null;
  treatmentSlugs?: string[] | null;
  locationSlugs?: string[] | null;
  faqs?: { question: string; answer: string }[] | null;
  seoMetaTitle?: string | null;
  seoMetaDescription?: string | null;
  seoOgTitle?: string | null;
  seoOgDescription?: string | null;
  seoOgImageUrl?: string | null;
  status?: string | null;
};

const BLOG_FIELDS = `
  _id, pgId, title, slug, excerpt,
  heroImageUrl, heroImageAlt, heroTextDark, heroImagePosition,
  contentRaw,
  authorSlug, authorName, authorRole, authorCredentials, authorAvatarUrl, authorBioText,
  reviewerSlug, reviewerName, reviewerRole, reviewerCredentials, reviewerAvatarUrl,
  categoryTitle, categorySlug,
  readMins, publishedAt, lastUpdatedAt,
  treatmentSlugs, locationSlugs,
  faqs[]{ question, answer },
  seoMetaTitle, seoMetaDescription, seoOgTitle, seoOgDescription, seoOgImageUrl,
  status
`;

export const getSanityBlogsPage = (page: number, limit: number) =>
  unstable_cache(
    async () => {
      if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return { docs: [], total: 0 };
      const offset = (page - 1) * limit;
      try {
        const [docs, total] = await Promise.all([
          client.fetch<SanityBlog[]>(
            `*[_type == "blog" && status != "draft"] | order(publishedAt desc)[${offset}...${offset + limit}]{ ${BLOG_FIELDS} }`,
          ),
          client.fetch<number>(`count(*[_type == "blog" && status != "draft"])`),
        ]);
        return { docs: docs ?? [], total: total ?? 0 };
      } catch {
        return { docs: [], total: 0 };
      }
    },
    ["sanity-blogs-page", String(page), String(limit)],
    { revalidate: 3600, tags: ["sanity-blogs"] },
  )();

export const getSanityBlogBySlug = (slug: string) =>
  unstable_cache(
    async () => sanityFetch<SanityBlog>(`*[_type == "blog" && slug == $slug][0]{ ${BLOG_FIELDS} }`, { slug }),
    ["sanity-blog-slug", slug],
    { revalidate: 3600, tags: ["sanity-blogs", `sanity-blog-${slug}`] },
  )();

export const getSanityPublishedBlogSlugs = () =>
  unstable_cache(
    async () =>
      (await sanityFetch<{ slug: string }[]>(`*[_type == "blog" && status != "draft"]{ slug }`)) ?? [],
    ["sanity-blog-slugs"],
    { revalidate: 3600, tags: ["sanity-blogs"] },
  )();

export const getSanityBlogsByTreatmentSlug = (treatmentSlug: string) =>
  unstable_cache(
    async () =>
      (await sanityFetch<SanityBlog[]>(
        `*[_type == "blog" && status != "draft" && $slug in treatmentSlugs] | order(publishedAt desc)[0...3]{ ${BLOG_FIELDS} }`,
        { slug: treatmentSlug },
      )) ?? [],
    ["sanity-blogs-treatment", treatmentSlug],
    { revalidate: 3600, tags: ["sanity-blogs"] },
  )();

export const getSanityBlogsByLocationSlug = (locationSlug: string) =>
  unstable_cache(
    async () =>
      (await sanityFetch<SanityBlog[]>(
        `*[_type == "blog" && status != "draft" && $slug in locationSlugs] | order(publishedAt desc)[0...3]{ ${BLOG_FIELDS} }`,
        { slug: locationSlug },
      )) ?? [],
    ["sanity-blogs-location", locationSlug],
    { revalidate: 3600, tags: ["sanity-blogs"] },
  )();

export const getSanityRelatedBlogs = (currentSlug: string, categorySlug: string | null) =>
  unstable_cache(
    async () => {
      if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
      try {
        if (categorySlug) {
          return (
            (await client.fetch<SanityBlog[]>(
              `*[_type == "blog" && status != "draft" && slug != $currentSlug && categorySlug == $categorySlug] | order(publishedAt desc)[0...3]{ ${BLOG_FIELDS} }`,
              { currentSlug, categorySlug },
            )) ?? []
          );
        }
        return (
          (await client.fetch<SanityBlog[]>(
            `*[_type == "blog" && status != "draft" && slug != $currentSlug] | order(publishedAt desc)[0...3]{ ${BLOG_FIELDS} }`,
            { currentSlug },
          )) ?? []
        );
      } catch {
        return [];
      }
    },
    ["sanity-blogs-related", currentSlug, categorySlug ?? "none"],
    { revalidate: 3600, tags: ["sanity-blogs"] },
  )();

export const getSanityCMEBlogs = () =>
  unstable_cache(
    async () =>
      (await sanityFetch<SanityBlog[]>(
        `*[_type == "blog" && status != "draft" && categorySlug == "cme"] | order(publishedAt desc){ ${BLOG_FIELDS} }`,
      )) ?? [],
    ["sanity-blogs-cme"],
    { revalidate: 3600, tags: ["sanity-blogs"] },
  )();

// ── Treatments ──

export type SanityTreatment = {
  slug?: string | null;
  href?: string | null;
  navCategory?: string | null;
  navOrder?: number | null;
  hero?: {
    eyebrow?: string | null; h1?: string | null; h1Em?: string | null;
    tagline?: string | null; badges?: { value?: string | null }[] | null;
    image?: string | null; imageAlt?: string | null;
    heroPhoto?: { asset?: { url?: string | null } | null } | null;
  } | null;
  meta?: { title?: string | null; description?: string | null; ogImage?: string | null } | null;
  whatIs?: {
    heading?: { lead?: string | null; em?: string | null } | null;
    paragraphs?: { text?: string | null }[] | null;
    aside?: { title?: string | null; body?: string | null } | null;
  } | null;
  benefits?: {
    heading?: { lead?: string | null; em?: string | null } | null;
    subtitle?: string | null;
    items?: { value?: string | null }[] | null;
  } | null;
  whoNeedsIt?: {
    heading?: { lead?: string | null; em?: string | null } | null;
    subtitle?: string | null;
    items?: { value?: string | null }[] | null;
  } | null;
  process?: {
    heading?: { lead?: string | null; em?: string | null } | null;
    subtitle?: string | null;
    steps?: { icon?: string | null; n?: string | null; t?: string | null; d?: string | null }[] | null;
    note?: string | null;
  } | null;
  risks?: {
    heading?: { lead?: string | null; em?: string | null } | null;
    subtitle?: string | null;
    items?: { t?: string | null; d?: string | null; help?: string | null }[] | null;
  } | null;
  faqs?: { q?: string | null; a?: string | null }[] | null;
  cta?: { heading?: string | null; headingEm?: string | null; subtitle?: string | null } | null;
};

const TREATMENT_FIELDS = `
  slug, href, navCategory, navOrder,
  hero { eyebrow, h1, h1Em, tagline, badges, image, imageAlt, heroPhoto { asset->{ url } } },
  meta { title, description, ogImage },
  whatIs { heading, paragraphs, aside },
  benefits { heading, subtitle, items },
  whoNeedsIt { heading, subtitle, items },
  process { heading, subtitle, steps, note },
  risks { heading, subtitle, items },
  faqs, cta
`;

export const getSanityTreatments = () =>
  unstable_cache(
    async () => (await sanityFetch<SanityTreatment[]>(`*[_type == "treatment"]{ ${TREATMENT_FIELDS} }`)) ?? [],
    ["sanity-treatments"],
    { revalidate: 3600, tags: ["sanity-treatments"] },
  )();

export const getSanityTreatment = (slug: string) =>
  unstable_cache(
    () => sanityFetch<SanityTreatment>(`*[_type == "treatment" && slug == $slug][0]{ ${TREATMENT_FIELDS} }`, { slug }),
    ["sanity-treatment", slug],
    { revalidate: 3600, tags: ["sanity-treatments"] },
  )();

// ── Services ──

export type SanityService = {
  slug?: string | null;
  hero?: {
    eyebrow?: string | null; h1?: string | null; h1Em?: string | null;
    tagline?: string | null; badges?: { badge?: string | null }[] | null;
    image?: string | null; imageAlt?: string | null;
    heroPhoto?: { asset?: { url?: string | null } | null } | null;
  } | null;
  seo?: { metaTitle?: string | null; metaDescription?: string | null } | null;
  overview?: {
    heading?: { lead?: string | null; em?: string | null } | null;
    paragraphs?: { text?: string | null }[] | null;
    aside?: { title?: string | null; body?: string | null } | null;
  } | null;
  benefits?: {
    heading?: { lead?: string | null; em?: string | null } | null;
    subtitle?: string | null;
    items?: { item?: string | null }[] | null;
  } | null;
  whoFor?: {
    heading?: { lead?: string | null; em?: string | null } | null;
    subtitle?: string | null;
    items?: { item?: string | null }[] | null;
  } | null;
  process?: {
    heading?: { lead?: string | null; em?: string | null } | null;
    subtitle?: string | null;
    steps?: { icon?: string | null; t?: string | null; d?: string | null }[] | null;
    note?: string | null;
  } | null;
  whyUs?: {
    heading?: { lead?: string | null; em?: string | null } | null;
    items?: { icon?: string | null; t?: string | null; d?: string | null }[] | null;
  } | null;
  faqs?: { q?: string | null; a?: string | null }[] | null;
  cta?: { heading?: string | null; headingEm?: string | null; subtitle?: string | null } | null;
};

const SERVICE_FIELDS = `
  slug,
  hero { eyebrow, h1, h1Em, tagline, badges, image, imageAlt, heroPhoto { asset->{ url } } },
  seo { metaTitle, metaDescription },
  overview { heading, paragraphs, aside },
  benefits { heading, subtitle, items },
  whoFor { heading, subtitle, items },
  process { heading, subtitle, steps, note },
  whyUs { heading, items },
  faqs, cta
`;

export const getSanityServices = () =>
  unstable_cache(
    async () => (await sanityFetch<SanityService[]>(`*[_type == "service"]{ ${SERVICE_FIELDS} }`)) ?? [],
    ["sanity-services"],
    { revalidate: 3600, tags: ["sanity-services"] },
  )();

export const getSanityService = (slug: string) =>
  unstable_cache(
    () => sanityFetch<SanityService>(`*[_type == "service" && slug == $slug][0]{ ${SERVICE_FIELDS} }`, { slug }),
    ["sanity-service", slug],
    { revalidate: 3600, tags: ["sanity-services"] },
  )();

// ── Cities ──

export type SanityCity = {
  slug?: string | null;
  name?: string | null;
  region?: string | null;
  country?: string | null;
  helpline?: string | null;
  helplineLabel?: string | null;
  whatsapp?: string | null;
  heroImage?: string | null;
  hero360Url?: string | null;
  built?: boolean | null;
  intro?: { value?: string | null }[] | null;
  faqs?: { q?: string | null; a?: string | null }[] | null;
  womensHealth?: { value?: string | null }[] | null;
};

const CITY_FIELDS = `slug, name, region, country, helpline, helplineLabel, whatsapp, heroImage, hero360Url, built, intro, faqs, womensHealth`;

export const getSanityCities = () =>
  unstable_cache(
    async () => (await sanityFetch<SanityCity[]>(`*[_type == "city"]{ ${CITY_FIELDS} }`)) ?? [],
    ["sanity-cities"],
    { revalidate: 3600, tags: ["sanity-locations"] },
  )();

export const getSanityCity = (slug: string) =>
  unstable_cache(
    () => sanityFetch<SanityCity>(`*[_type == "city" && slug == $slug][0]{ ${CITY_FIELDS} }`, { slug }),
    ["sanity-city", slug],
    { revalidate: 3600, tags: ["sanity-locations"] },
  )();

// ── Centres ──

export type SanityCentre = {
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
  opening?: { opens?: string | null; closes?: string | null; days?: { value?: string | null }[] | null } | null;
  geo?: { lat?: number | null; lng?: number | null } | null;
  mapQuery?: string | null;
  image?: string | null;
  hero360Url?: string | null;
  nearby?: { value?: string | null }[] | null;
  landmarks?: { value?: string | null }[] | null;
  howToReach?: { value?: string | null }[] | null;
  facilities?: { value?: string | null }[] | null;
  doctors?: { value?: string | null }[] | null;
  treatments?: { value?: string | null }[] | null;
  faqs?: { q?: string | null; a?: string | null }[] | null;
  reviewsKey?: string | null;
  sameAs?: { value?: string | null }[] | null;
  intro?: string | null;
  gallery?: { src?: string | null; alt?: string | null }[] | null;
  womensHealth?: { value?: string | null }[] | null;
  built?: boolean | null;
};

const CENTRE_FIELDS = `
  slug, citySlug, name, fullName, isHeadOffice, area, built,
  address, pin, phone, phoneLabel, hours,
  opening { opens, closes, days },
  geo { lat, lng },
  mapQuery, image, hero360Url,
  nearby, landmarks, howToReach, facilities, doctors, treatments,
  faqs, reviewsKey, sameAs, intro, gallery, womensHealth
`;

export const getSanityCentres = () =>
  unstable_cache(
    async () => (await sanityFetch<SanityCentre[]>(`*[_type == "centre"]{ ${CENTRE_FIELDS} }`)) ?? [],
    ["sanity-centres"],
    { revalidate: 3600, tags: ["sanity-locations"] },
  )();

export const getSanityCentre = (citySlug: string, slug: string) =>
  unstable_cache(
    () => sanityFetch<SanityCentre>(
      `*[_type == "centre" && citySlug == $citySlug && slug == $slug][0]{ ${CENTRE_FIELDS} }`,
      { citySlug, slug },
    ),
    ["sanity-centre", citySlug, slug],
    { revalidate: 3600, tags: ["sanity-locations"] },
  )();

// ── About Page (singleton) ──

export type SanityAbout = {
  hero?: {
    eyebrow?: string | null; headline?: string | null; headlineItalic?: string | null;
    paragraph?: string | null; image?: string | null;
  } | null;
  story?: {
    eyebrow?: string | null;
    heading?: { lead?: string | null; em?: string | null } | null;
    paragraphs?: { value?: string | null }[] | null;
  } | null;
  atAGlance?: { value?: string | null; label?: string | null }[] | null;
  legacy?: { eyebrow?: string | null; heading?: { lead?: string | null; em?: string | null } | null } | null;
  milestones?: { y?: string | null; t?: string | null; d?: string | null }[] | null;
  trust?: { eyebrow?: string | null; heading?: { lead?: string | null; em?: string | null } | null } | null;
  trustPillars?: { icon?: string | null; t?: string | null; d?: string | null }[] | null;
  patientFirst?: {
    eyebrow?: string | null;
    heading?: { lead?: string | null; em?: string | null } | null;
    paragraphs?: { value?: string | null }[] | null;
  } | null;
  patientStats?: { value?: string | null; label?: string | null }[] | null;
  meetSpecialists?: {
    eyebrow?: string | null;
    heading?: { lead?: string | null; em?: string | null } | null;
    subtitle?: string | null;
  } | null;
  network?: {
    eyebrow?: string | null;
    heading?: { lead?: string | null; em?: string | null } | null;
    subtitle?: string | null;
    cities?: { c?: string | null; n?: string | null }[] | null;
  } | null;
  finalCta?: { heading?: { lead?: string | null; em?: string | null } | null } | null;
  seo?: {
    metaTitle?: string | null; metaDescription?: string | null;
    ogTitle?: string | null; ogDescription?: string | null; ogImage?: string | null;
  } | null;
};

export const getSanityAbout = () =>
  unstable_cache(
    () => sanityFetch<SanityAbout>(`*[_type == "aboutPage"][0]`),
    ["sanity-about"],
    { revalidate: 3600, tags: ["sanity-about"] },
  )();
