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
