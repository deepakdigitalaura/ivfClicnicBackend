import "server-only";
import { client } from "./client";
import {
  ROBOTS_QUERY,
  SCRIPTS_QUERY,
  CAMPS_QUERY,
  REDIRECTS_QUERY,
  SITEMAP_QUERY,
  SCHEMA_ORG_QUERY,
  PAGE_SEO_BY_PATH_QUERY,
  REVIEWS_BY_KEY_QUERY,
  PAGE_FAQS_QUERY,
} from "./queries";

// ponytail: time-based revalidate, not revalidateTag — sidesteps the disk
// fetch-cache tag-busting bug on the PM2/Cloudways deploy, and keeps Sanity
// CDN request volume bounded (free-tier quota) instead of fetching on every hit.
const SANITY_CACHE = { next: { revalidate: 60 } } as const;

async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null;
  try {
    return await client.fetch<T>(query, params ?? {}, SANITY_CACHE);
  } catch {
    return null;
  }
}

export type RobotsConfig = {
  rawContent?: string;
};

export type ScriptEntry = {
  name?: string;
  enabled?: boolean;
  code?: string;
  category?: "necessary" | "analytics" | "marketing";
};
export type ScriptsConfig = {
  headScripts?: ScriptEntry[];
  bodyScripts?: ScriptEntry[];
};

export type CampPoster = { src?: string; alt?: string };
export type CampsConfig = { posters?: CampPoster[] };

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

export const getRobotsConfig = () => sanityFetch<RobotsConfig>(ROBOTS_QUERY);

export const getScriptsConfig = () => sanityFetch<ScriptsConfig>(SCRIPTS_QUERY);

export const getCampsConfig = () => sanityFetch<CampsConfig>(CAMPS_QUERY);

export const getRedirectsConfig = () => sanityFetch<RedirectsConfig>(REDIRECTS_QUERY);

export const getSitemapConfig = () => sanityFetch<SitemapConfig>(SITEMAP_QUERY);

export const getSchemaOrgConfig = () => sanityFetch<SchemaOrgConfig>(SCHEMA_ORG_QUERY);

export const getPageSeo = (path: string) => sanityFetch<PageSeo>(PAGE_SEO_BY_PATH_QUERY, { path });

// ── Reviews (admin-accumulated, keyed by centre slug / "brand") ──

export type SanityReviewData = {
  aggregate?: { ratingValue: number; reviewCount: number };
  mapsUrl?: string;
  reviews: {
    author: string;
    rating: number;
    text: string;
    publishedAtISO: string;
    relativeTime?: string;
    profilePhoto?: string;
    /** false only for staff-typed entries (manual: true in Sanity) — gates
     *  the "Google" badge and schema.org output per review, not per batch. */
    verified?: boolean;
  }[];
};

/** Public/cached read of the accumulated Google reviews for one key. Busted
 *  by the admin "Refresh Reviews" button and by manual deletes (both call
 *  revalidateTag("sanity-reviews")). null → caller falls back to whatever
 *  build-time data it already has. */
export const getSanityReviews = async (key: string): Promise<SanityReviewData | null> => {
  const data = await sanityFetch<{
    meta: { ratingValue?: number; reviewCount?: number; mapsUrl?: string } | null;
    reviews: (Omit<SanityReviewData["reviews"][number], "verified"> & { manual?: boolean })[];
  }>(REVIEWS_BY_KEY_QUERY, { key });
  if (!data) return null;
  return {
    aggregate: data.meta?.reviewCount
      ? { ratingValue: data.meta.ratingValue ?? 0, reviewCount: data.meta.reviewCount }
      : undefined,
    mapsUrl: data.meta?.mapsUrl,
    reviews: (data.reviews ?? []).map(({ manual, ...r }) => ({ ...r, verified: !manual })),
  };
};

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
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
};

const DOCTORS_QUERY = `*[_type == "doctor"]{
  slug, name, credentials, specialty, role, imageUrl,
  "photoUrl": photo.asset->url,
  experienceLabel, experienceYears,
  cities, treatments, locations,
  shortBio, bio,
  knowsAbout, alumniOf, memberOf, awards, training, publications, languages, sameAs,
  verified, visitsAllCentres, navRole, navOrder,
  metaTitle, metaDescription, ogTitle, ogDescription
}`;

/** All doctors from Sanity (cached + tagged). Empty array when none/unconfigured,
 *  so the resolver falls back to the code DOCTORS list byte-identically. */
export const getSanityDoctors = async () => (await sanityFetch<SanityDoctor[]>(DOCTORS_QUERY)) ?? [];

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
export const getSanityTestimonials = async () => (await sanityFetch<SanityTestimonial[]>(TESTIMONIALS_QUERY)) ?? [];

// ── Homepage (singleton) ──

/** Loose shape — kept decoupled; mapped to HomepageSource in payload.ts. */
export type SanityHomepage = Record<string, unknown> | null;

/** The homepage singleton from Sanity (cached + tagged). Null when unset, so the
 *  homepage falls back to HOMEPAGE_DEFAULTS byte-identically. */
export const getSanityHomepage = () => sanityFetch<SanityHomepage>(`*[_type == "homepage"][0]`);

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
  navLabels?: { category?: string; headerLabel?: string; footerLabel?: string; order?: number }[];
} | null;

/** The site-settings singleton (cached + tagged). Null when unset, so identity /
 *  contact fall back to the SITE constant byte-identically. */
export const getSanitySiteSettings = () => sanityFetch<SanitySiteSettings>(`*[_type == "siteSettings"][0]`);

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

export const getSanityEducationVideos = async () => (await sanityFetch<SanityEducationVideo[]>(EDUCATION_VIDEOS_QUERY)) ?? [];

// ── Press ──

export type SanityPress = {
  _id: string;
  slug?: string;
  headline?: string;
  headlineOriginal?: string | null;
  standfirst?: string | null;
  publication?: string;
  edition?: string | null;
  date?: string | null;
  byline?: string | null;
  language?: "English" | "Gujarati";
  summary?: string;
  bodyText?: string[];
  doctorsQuoted?: string[];
  image?: string;
  thumb?: string;
  width?: number;
  height?: number;
  order?: number;
  published?: boolean;
};

const PRESS_QUERY = `*[_type == "press" && published != false] | order(order asc){
  _id, "slug": slug.current, headline, headlineOriginal, standfirst, publication,
  edition, date, byline, language, summary, bodyText, doctorsQuoted, image, thumb,
  width, height, order, published
}`;

export const getSanityPress = async () => (await sanityFetch<SanityPress[]>(PRESS_QUERY)) ?? [];

// ── Blogs ──

export type SanityBlog = {
  _id: string;
  pgId?: number;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  heroImageUrl?: string | null;
  heroImageAlt?: string | null;
  cardImageUrl?: string | null;
  cardImageAlt?: string | null;
  heroTextDark?: boolean | null;
  heroTextRight?: boolean | null;
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
  heroImageUrl, heroImageAlt, heroTextDark, heroTextRight, heroImagePosition,
  cardImageUrl, cardImageAlt,
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

export const getSanityBlogsPage = async (page: number, limit: number, categorySlug?: string) => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return { docs: [], total: 0 };
  const offset = (page - 1) * limit;
  // CME posts have their own dedicated hub at /cme (see getSanityCMEBlogs)
  // and are excluded from the general blog hub here, even if "cme" is
  // requested as a category filter.
  const filter = categorySlug && categorySlug !== "cme"
    ? `_type == "blog" && status != "draft" && categorySlug == $categorySlug`
    : `_type == "blog" && status != "draft" && categorySlug != "cme"`;
  try {
    const [docs, total] = await Promise.all([
      client.fetch<SanityBlog[]>(
        `*[${filter}] | order(publishedAt desc)[${offset}...${offset + limit}]{ ${BLOG_FIELDS} }`,
        { categorySlug },
        SANITY_CACHE,
      ),
      client.fetch<number>(`count(*[${filter}])`, { categorySlug }, SANITY_CACHE),
    ]);
    return { docs: docs ?? [], total: total ?? 0 };
  } catch {
    return { docs: [], total: 0 };
  }
};

export type BlogCategoryCount = { slug: string; title: string; count: number };

export const getSanityBlogCategories = async () => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    const rows = await client.fetch<{ categorySlug: string | null; categoryTitle: string | null }[]>(
      `*[_type == "blog" && status != "draft" && defined(categorySlug)]{ categorySlug, categoryTitle }`,
      {},
      SANITY_CACHE,
    );
    const counts = new Map<string, BlogCategoryCount>();
    for (const r of rows) {
      // CME posts live only on the dedicated /cme hub, not the blog hub's category chips.
      if (!r.categorySlug || r.categorySlug === "cme") continue;
      const existing = counts.get(r.categorySlug);
      if (existing) existing.count++;
      else counts.set(r.categorySlug, { slug: r.categorySlug, title: r.categoryTitle ?? r.categorySlug, count: 1 });
    }
    return [...counts.values()].sort((a, b) => b.count - a.count);
  } catch {
    return [];
  }
};

export const getSanityBlogBySlug = (slug: string) =>
  sanityFetch<SanityBlog>(`*[_type == "blog" && slug == $slug][0]{ ${BLOG_FIELDS} }`, { slug });

export const getSanityPublishedBlogSlugs = async () =>
  (await sanityFetch<{ slug: string }[]>(`*[_type == "blog" && status != "draft"]{ slug }`)) ?? [];

export const getSanityBlogsByTreatmentSlug = async (treatmentSlug: string) =>
  (await sanityFetch<SanityBlog[]>(
    `*[_type == "blog" && status != "draft" && $slug in treatmentSlugs] | order(publishedAt desc)[0...3]{ ${BLOG_FIELDS} }`,
    { slug: treatmentSlug },
  )) ?? [];

export const getSanityBlogsByLocationSlug = async (locationSlug: string) =>
  (await sanityFetch<SanityBlog[]>(
    `*[_type == "blog" && status != "draft" && $slug in locationSlugs] | order(publishedAt desc)[0...3]{ ${BLOG_FIELDS} }`,
    { slug: locationSlug },
  )) ?? [];

/**
 * Pick a window of the candidate list using the current slug as the offset.
 *
 * Taking `[0...3]` of a date-ordered list meant every post in a category linked
 * to the same three newest posts — 69 IVF posts all pointed at the same 3, so
 * ~72 posts site-wide collected every "Keep Reading" link and ~220 received
 * none. That is what left 239 pages on 3 or fewer internal links.
 *
 * Offsetting by a hash of the slug spreads the links across the whole category
 * instead. It stays deterministic, so a given post always shows the same picks
 * and the pages remain cacheable.
 */
const relatedWindow = <T,>(items: T[], seed: string, limit: number): T[] => {
  if (items.length <= limit) return items;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const start = h % items.length;
  // wrap around the end so posts near the tail still get a full set
  return Array.from({ length: limit }, (_, i) => items[(start + i) % items.length]);
};

/**
 * Fourteen articles earn real traffic on two inbound internal links each --
 * sperm cramps alone takes 672 visits a month. The hash window above spreads
 * links evenly, which is right in general but leaves those fourteen on roughly
 * three; they need more if they are to hold and improve their positions.
 *
 * Reserving a "Keep Reading" slot for them wholesale was the obvious fix and
 * the wrong one: simulated against the live data, the single boosted page in
 * the 75-post IVF category collected 74 inbound links, while the page whose
 * category holds nothing else collected none.
 *
 * So the pairing is decided up front instead, balanced, and recorded here.
 * Each of the fourteen gets exactly nine named sources, no article feeds more
 * than one of them, and sources come from the same category first and a
 * related one only when the category cannot supply enough. The full list, with
 * the reason for each pairing, is in October 2026/inbound-link-plan.csv.
 *
 * To retire this once the pages recover: empty the map. Nothing else changes.
 */
const INBOUND_BOOST: Record<string, string> = {
  "10-signs-you-should-see-fertility-specialist-and-when-not-to-wait": "10-foods-to-improve-female-egg-quality",
  "asthenospermia-understanding-the-condition-and-exploring-assisted-reproductive-technologies-art-options": "understanding-hypospermia-signs-symptoms-and-treatment-options",
  "azoospermia-can-you-have-a-baby-with-zero-sperm-count": "understanding-sperm-cramps-symptoms-causes-diagnosis-treatment",
  "best-types-of-exercise-to-support-your-ivf-journey": "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days",
  "blastocyst-transfer-in-special-situations-pcos-poor-responders-recurrent-ivf-failure-endometriosis-uterine-factors": "10-foods-that-will-increase-sperm-count-and-5-foods-to-avoid",
  "blighted-ovum-symptoms-causes-and-more": "era-test-explained-does-it-really-improve-egg-quality",
  "blocked-fallopian-tubes-diagnosis-treatment": "10-foods-to-improve-female-egg-quality",
  "boosting-implantation-success-the-power-of-embryo-glue": "10-foods-to-improve-female-egg-quality",
  "boosting-male-fertility-tips-to-improve-sperm-quality": "understanding-hypospermia-signs-symptoms-and-treatment-options",
  "boosting-your-ivf-success-a-comprehensive-guide-for-couples": "necrozoospermia-symptoms-causes-and-treatment-options",
  "breaking-free-from-varicocele-pain-3-innovative-ways-to-find-relief": "understanding-hypospermia-signs-symptoms-and-treatment-options",
  "building-families-with-hope-the-power-of-assisted-reproductive-technology": "era-test-explained-does-it-really-improve-egg-quality",
  "can-natural-cycle-ivf-reduce-the-risk-of-ovarian-hyperstimulation": "necrozoospermia-symptoms-causes-and-treatment-options",
  "can-varicocele-be-treated-without-surgery-exploring-your-options": "understanding-hypospermia-signs-symptoms-and-treatment-options",
  "common-risks-in-twin-pregnancy-and-how-do-doctors-manage-them": "ivf-pregnancy-week-by-week-symptoms-and-safety",
  "complete-pregnancy-diet-chart-by-trimester-what-to-eat-in-the-first-second-third-trimester": "vegetarian-diet-chart-for-pregnant-lady-protein-rich-indian-meal-plan",
  "cracking-opens-the-possibilities-how-laser-assisted-hatching-is-changing-the-game-for-ivf-patients": "what-happens-after-embryo-transfer-day-by-day",
  "decoding-your-semen-analysis-report-a-simple-guide": "understanding-sperm-cramps-symptoms-causes-diagnosis-treatment",
  "diabetes-and-fertility": "10-foods-to-improve-female-egg-quality",
  "diabetes-obesity-and-ivf-success": "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide",
  "does-male-age-affect-ivf-success": "understanding-sperm-cramps-symptoms-causes-diagnosis-treatment",
  "donor-egg-ivf-who-its-for-and-how-donors-are-screened": "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide",
  "egg-quality-vs-egg-quantity-what-really-matters": "what-happens-after-embryo-transfer-day-by-day",
  "embracing-positivity-activities-to-nurture-your-journey-to-motherhood-after-embryo-transfer": "10-foods-to-improve-female-egg-quality",
  "embryo-glue-a-game-changer-in-ivf-success-rates": "10-foods-to-improve-female-egg-quality",
  "endometrial-lining-remedies-for-abnormal-thickness": "era-test-explained-does-it-really-improve-egg-quality",
  "endometrial-scratching-before-ivf-evidence-benefits-and-risks": "10-foods-that-will-increase-sperm-count-and-5-foods-to-avoid",
  "essential-tests-for-male-infertility-what-to-expect": "10-foods-that-will-increase-sperm-count-and-5-foods-to-avoid",
  "fertility-ovulation-facts-to-help-you-get-pregnant": "era-test-explained-does-it-really-improve-egg-quality",
  "food-for-better-egg-quality-how-sugar-affects-your-eggs": "10-foods-to-improve-female-egg-quality",
  "foods-to-avoid-during-pregnancy-and-why": "how-long-does-it-take-for-the-uterus-to-go-back-to-normal-after-birth",
  "from-ivf-to-motherhood-the-journey-of-hope-and-happiness": "how-long-does-it-take-for-the-uterus-to-go-back-to-normal-after-birth",
  "frozen-vs-fresh-embryo-transfer-which-is-better": "necrozoospermia-symptoms-causes-and-treatment-options",
  "genetic-testing-before-and-during-pregnancy-a-comprehensive-guide": "how-long-does-it-take-for-the-uterus-to-go-back-to-normal-after-birth",
  "high-risk-pregnancy-a-guide-to-lifestyle-diet-and-rest-tips": "ivf-pregnancy-week-by-week-symptoms-and-safety",
  "high-risk-pregnancy-due-to-diabetes-bp-thyroid-disorders": "ivf-pregnancy-week-by-week-symptoms-and-safety",
  "how-do-male-fertility-supplements-impact-ivf-results": "understanding-hypospermia-signs-symptoms-and-treatment-options",
  "how-do-thyroid-disorders-affect-fertility-in-women": "what-happens-after-embryo-transfer-day-by-day",
  "how-does-age-impact-the-success-rate-of-iui-procedures": "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide",
  "how-long-do-you-have-to-wait-to-try-again-after-a-miscarriage": "how-long-does-it-take-for-the-uterus-to-go-back-to-normal-after-birth",
  "how-long-does-it-take-to-improve-sperm-quality-a-12-week-plan-for-men": "understanding-sperm-cramps-symptoms-causes-diagnosis-treatment",
  "how-long-should-you-see-a-gynecologist-after-delivery": "how-long-does-it-take-for-the-uterus-to-go-back-to-normal-after-birth",
  "how-male-infertility-affects-ivf-treatment": "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days",
  "how-many-embryos-should-be-transferred-risks-of-multiple-pregnancy-explained": "vegetarian-diet-chart-for-pregnant-lady-protein-rich-indian-meal-plan",
  "how-many-times-can-a-person-undergo-ivf-procedure": "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days",
  "how-much-weight-can-a-baby-gain-in-a-week-in-the-womb": "ivf-pregnancy-week-by-week-symptoms-and-safety",
  "how-to-choose-the-right-treatment-after-45": "iui-side-effects-on-the-body-and-emotions-a-complete-guide",
  "how-to-improve-male-infertility": "10-foods-that-will-increase-sperm-count-and-5-foods-to-avoid",
  "how-to-improve-your-chances-of-iui-success-naturally": "reasons-for-iui-failure-symptoms-and-causes",
  "how-to-prepare-for-your-first-iui-cycle-tips-and-advice": "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide",
  "how-to-protect-your-mental-health-during-ivf-and-fertility-treatments": "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days",
  "importance-of-folic-acid-before-and-during-pregnancy": "vegetarian-diet-chart-for-pregnant-lady-protein-rich-indian-meal-plan",
  "imsi-technique-for-ivf-advanced-sperm-selection-for-better-success": "iui-side-effects-on-the-body-and-emotions-a-complete-guide",
  "insurance-and-fertility-treatment-india": "iui-side-effects-on-the-body-and-emotions-a-complete-guide",
  "is-iui-painful-everything-you-need-to-know": "reasons-for-iui-failure-symptoms-and-causes",
  "is-natural-cycle-ivf-better-for-women-with-poor-ovarian-reserve": "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days",
  "iui-for-unexplained-infertility": "reasons-for-iui-failure-symptoms-and-causes",
  "iui-process-explained-what-to-expect-at-every-step": "reasons-for-iui-failure-symptoms-and-causes",
  "iui-success-rate-what-to-expect-after-iui-treatment": "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide",
  "iui-treatment-with-fertility-medicines-what-patients-should-know": "reasons-for-iui-failure-symptoms-and-causes",
  "iui-vs-ivf-a-breakdown-of-the-procedures-and-what-to-expect": "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide",
  "ivf-after-age-40-realistic-success-rates-and-treatment-strategies": "10-foods-that-will-increase-sperm-count-and-5-foods-to-avoid",
  "ivf-for-women-with-thyroid-disorders-what-patients-should-know": "10-foods-that-will-increase-sperm-count-and-5-foods-to-avoid",
  "ivf-india-vs-abroad-cost-comparison": "iui-side-effects-on-the-body-and-emotions-a-complete-guide",
  "ivf-medication-side-effects": "iui-side-effects-on-the-body-and-emotions-a-complete-guide",
  "ivf-second-opinion-when-to-get-one-what-records-to-bring-and-what-to-ask-after-a-failed-cycle": "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide",
  "ivf-stimulation-protocols-a-comprehensive-guide": "iui-side-effects-on-the-body-and-emotions-a-complete-guide",
  "life-after-iui-precautions-lifestyle-tips-and-what-to-expect": "reasons-for-iui-failure-symptoms-and-causes",
  "lifestyle-diet-rest-tips-for-high-risk-pregnancy": "vegetarian-diet-chart-for-pregnant-lady-protein-rich-indian-meal-plan",
  "low-sperm-count-after-40-is-age-related-decline-something-you-can-fix": "understanding-sperm-cramps-symptoms-causes-diagnosis-treatment",
  "male-infertility-signs-causes-treatment": "10-foods-that-will-increase-sperm-count-and-5-foods-to-avoid",
  "minimal-stimulation-ivf-who-its-right-for": "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide",
  "minimum-sperm-count-for-iui-how-much-motile-sperm-do-you-need-for-it-to-work": "reasons-for-iui-failure-symptoms-and-causes",
  "natural-iui-vs-medicated-iui-which-is-more-effective": "reasons-for-iui-failure-symptoms-and-causes",
  "normal-delivery-tips-to-increase-your-chances-of-a-natural-birth": "ivf-pregnancy-week-by-week-symptoms-and-safety",
  "oncofertility-preserving-fertility-before-cancer-treatment": "what-happens-after-embryo-transfer-day-by-day",
  "ovarian-follicles-the-tiny-heroes-of-fertility": "era-test-explained-does-it-really-improve-egg-quality",
  "ovarian-rejuvenation-for-restoring-fertility-a-new-ray-of-hope": "era-test-explained-does-it-really-improve-egg-quality",
  "parenting-after-ivf-unique-challenges-and-rewards": "necrozoospermia-symptoms-causes-and-treatment-options",
  "personalized-ivf-the-future-of-fertility-treatment": "what-happens-after-embryo-transfer-day-by-day",
  "picsi-imsi-macs-spindle-view-icsi-compared": "iui-side-effects-on-the-body-and-emotions-a-complete-guide",
  "postpartum-mental-health-recognizing-baby-blues-and-postpartum-depression": "vegetarian-diet-chart-for-pregnant-lady-protein-rich-indian-meal-plan",
  "preserving-hope-ivf-and-fertility-preservation-for-cancer-patients": "necrozoospermia-symptoms-causes-and-treatment-options",
  "rebuilding-families-fertility-treatment-options-for-cancer-survivors": "10-foods-to-improve-female-egg-quality",
  "recurrent-implantation-failure-what-to-do-next": "iui-side-effects-on-the-body-and-emotions-a-complete-guide",
  "recurrent-miscarriage-why-does-it-keep-happening-and-what-can-you-do": "10-foods-to-improve-female-egg-quality",
  "risks-and-benefits-of-laser-assisted-hatching-in-ivf": "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days",
  "second-baby-after-45-why-is-it-a-completely-different-journey-than-your-first": "vegetarian-diet-chart-for-pregnant-lady-protein-rich-indian-meal-plan",
  "secondary-infertility-why-getting-pregnant-again-can-be-hard": "what-happens-after-embryo-transfer-day-by-day",
  "step-by-step-process-of-an-iui-procedure-what-to-expect": "reasons-for-iui-failure-symptoms-and-causes",
  "superfoods-for-male-fertility-what-fertility-specialists-recommend": "understanding-sperm-cramps-symptoms-causes-diagnosis-treatment",
  "teratozoospermia-uncovering-the-causes-symptoms-and-solutions": "10-foods-that-will-increase-sperm-count-and-5-foods-to-avoid",
  "tese-vs-pesa-vs-testicular-biopsy": "understanding-sperm-cramps-symptoms-causes-diagnosis-treatment",
  "the-connection-between-quality-sleep-and-ivf-success-a-hormonal-perspective": "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days",
  "the-dfi-test-a-crucial-diagnostic-tool-for-male-infertility": "understanding-hypospermia-signs-symptoms-and-treatment-options",
  "the-emotional-rollercoaster-of-ivf-why-mental-health-support-is-essential": "necrozoospermia-symptoms-causes-and-treatment-options",
  "the-journey-to-blastocyst-stage-and-implantation-understanding-your-chances-and-how-bavishi-fertility-institutes-can-help": "what-happens-after-embryo-transfer-day-by-day",
  "the-match-system-revolutionizing-ivf-with-unparalleled-accuracy-and-safety": "necrozoospermia-symptoms-causes-and-treatment-options",
  "the-miracle-of-bonding-connecting-with-your-baby-before-birth": "how-long-does-it-take-for-the-uterus-to-go-back-to-normal-after-birth",
  "the-postpartum-journey-how-long-does-it-take-to-heal-after-giving-birth": "ivf-pregnancy-week-by-week-symptoms-and-safety",
  "the-role-of-endometrial-receptivity-in-ivf-success": "necrozoospermia-symptoms-causes-and-treatment-options",
  "the-role-of-nutrition-in-boosting-ivf-success": "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days",
  "the-thyroid-connection-understanding-its-role-in-female-fertility-health": "era-test-explained-does-it-really-improve-egg-quality",
  "the-ultimate-guide-to-diet-in-lactation-nourishing-your-body-and-baby": "how-long-does-it-take-for-the-uterus-to-go-back-to-normal-after-birth",
  "the-unseen-struggle-understanding-male-infertility": "understanding-hypospermia-signs-symptoms-and-treatment-options",
  "thyroid-disorders-in-early-pregnancy": "vegetarian-diet-chart-for-pregnant-lady-protein-rich-indian-meal-plan",
  "trying-to-conceive-after-40-what-you-need-to-know": "what-happens-after-embryo-transfer-day-by-day",
  "twin-and-multiple-pregnancies-after-ivf-risks-and-care": "how-long-does-it-take-for-the-uterus-to-go-back-to-normal-after-birth",
  "twin-pregnancy-delivery-options-normal-delivery-vs-c-section": "ivf-pregnancy-week-by-week-symptoms-and-safety",
  "twin-pregnancy-understanding-common-risks-and-how-doctors-manage-them": "ivf-pregnancy-week-by-week-symptoms-and-safety",
  "understanding-endometrial-thickness-a-key-factor-in-female-fertility": "era-test-explained-does-it-really-improve-egg-quality",
  "understanding-male-fertility-azoospermia-vs-oligospermia": "understanding-hypospermia-signs-symptoms-and-treatment-options",
  "understanding-sperm-dna-fragmentation-causes-treatment-and-ivf-options": "understanding-sperm-cramps-symptoms-causes-diagnosis-treatment",
  "understanding-thin-endometrium-causes-impact-and-treatment-options": "era-test-explained-does-it-really-improve-egg-quality",
  "understanding-varicocele-how-serious-is-the-diagnosis": "understanding-hypospermia-signs-symptoms-and-treatment-options",
  "unexplained-infertility-when-tests-are-normal-but-you-still-cant-conceive": "vegetarian-diet-chart-for-pregnant-lady-protein-rich-indian-meal-plan",
  "what-is-the-max-number-of-eggs-that-you-can-retrieve-in-an-ivf-cycle": "necrozoospermia-symptoms-causes-and-treatment-options",
  "what-to-eat-during-pregnancy-a-week-by-week-nutrition-plan": "how-long-does-it-take-for-the-uterus-to-go-back-to-normal-after-birth",
  "when-can-you-start-exercising-after-delivery": "vegetarian-diet-chart-for-pregnant-lady-protein-rich-indian-meal-plan",
  "when-is-macs-most-useful-indications-ideal-candidates-limitations": "10-foods-that-will-increase-sperm-count-and-5-foods-to-avoid",
  "when-male-infertility-is-the-real-issue-why-you-need-a-doctor-who-treats-both-partners": "iui-side-effects-on-the-body-and-emotions-a-complete-guide",
  "when-should-you-get-3d-4d-ultrasound-during-pregnancy": "ivf-pregnancy-week-by-week-symptoms-and-safety",
  "when-to-consider-sperm-dna-fragmentation-testing-in-low-sperm-count-cases": "understanding-sperm-cramps-symptoms-causes-diagnosis-treatment",
  "when-to-take-a-pregnancy-test-after-iui-timing-and-accuracy-explained": "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide",
  "who-should-consider-a-blastocyst-transfer-in-ivf": "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days",
  "why-do-some-embryos-not-implant-even-if-they-look-healthy": "what-happens-after-embryo-transfer-day-by-day",
};

export const getSanityRelatedBlogs = async (currentSlug: string, categorySlug: string | null) => {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    // Two steps on purpose. BLOG_FIELDS includes contentRaw — the whole article
    // body — so pulling a 69-post category just to choose three would drag the
    // entire category's content over the wire on every blog render. Step one
    // asks for slugs only; step two fetches full fields for exactly the three
    // we picked, which is the same payload this function returned before.
    const filter = categorySlug
      ? `_type == "blog" && status != "draft" && slug != $currentSlug && categorySlug == $categorySlug`
      : `_type == "blog" && status != "draft" && slug != $currentSlug`;
    const params = categorySlug ? { currentSlug, categorySlug } : { currentSlug };

    const candidates =
      (await client.fetch<{ slug: string }[]>(
        `*[${filter}] | order(publishedAt desc){ slug }`,
        params,
        SANITY_CACHE,
      )) ?? [];

    // The assigned under-linked page is ADDED to the usual three rather than
    // replacing one of them. Taking a slot instead would have pushed fifteen
    // other articles down to no inbound links at all, which is the problem
    // this whole exercise exists to fix. Four cards lay out 2x2; see
    // KeepReading in blog-article.tsx.
    const forced = INBOUND_BOOST[currentSlug];
    const window = relatedWindow(candidates, currentSlug, 3)
      .map((c) => c.slug)
      .filter(Boolean);
    const picked =
      forced && !window.includes(forced) && forced !== currentSlug
        ? [...window, forced]
        : window;
    if (!picked.length) return [];

    const docs =
      (await client.fetch<SanityBlog[]>(
        // repeat the draft filter: picked is already clean, but if a draft ever
        // shared a slug with a published post this would otherwise surface it
        `*[_type == "blog" && status != "draft" && slug in $picked]{ ${BLOG_FIELDS} }`,
        { picked },
        SANITY_CACHE,
      )) ?? [];

    // `slug in $picked` loses the order we chose, so restore it.
    const order = new Map(picked.map((s, i) => [s, i]));
    return [...docs].sort(
      (a, b) => (order.get(a.slug ?? "") ?? 0) - (order.get(b.slug ?? "") ?? 0),
    );
  } catch {
    return [];
  }
};

export const getSanityCMEBlogs = async () =>
  (await sanityFetch<SanityBlog[]>(
    `*[_type == "blog" && status != "draft" && categorySlug == "cme"] | order(publishedAt desc){ ${BLOG_FIELDS} }`,
  )) ?? [];

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
  types { heading, subtitle, items },
  whoNeedsIt { heading, subtitle, items },
  process { heading, subtitle, steps, note },
  risks { heading, subtitle, items },
  faqs, cta
`;

export const getSanityTreatments = async () =>
  (await sanityFetch<SanityTreatment[]>(`*[_type == "treatment"]{ ${TREATMENT_FIELDS} }`)) ?? [];

export const getSanityTreatment = (slug: string) =>
  sanityFetch<SanityTreatment>(`*[_type == "treatment" && slug == $slug][0]{ ${TREATMENT_FIELDS} }`, { slug });

// ── Services ──

export type SanityService = {
  slug?: string | null;
  hero?: {
    eyebrow?: string | null; h1?: string | null; h1Em?: string | null;
    tagline?: string | null; badges?: { badge?: string | null }[] | null;
    image?: string | null; imageAlt?: string | null;
    heroPhoto?: { asset?: { url?: string | null } | null } | null;
  } | null;
  seo?: { metaTitle?: string | null; metaDescription?: string | null; ogTitle?: string | null; ogDescription?: string | null } | null;
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
  seo { metaTitle, metaDescription, ogTitle, ogDescription },
  overview { heading, paragraphs, aside },
  benefits { heading, subtitle, items },
  whoFor { heading, subtitle, items },
  process { heading, subtitle, steps, note },
  whyUs { heading, items },
  faqs, cta
`;

export const getSanityServices = async () =>
  (await sanityFetch<SanityService[]>(`*[_type == "service"]{ ${SERVICE_FIELDS} }`)) ?? [];

export const getSanityService = (slug: string) =>
  sanityFetch<SanityService>(`*[_type == "service" && slug == $slug][0]{ ${SERVICE_FIELDS} }`, { slug });

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
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
};

const CITY_FIELDS = `slug, name, region, country, helpline, helplineLabel, whatsapp, heroImage, hero360Url, built, intro, faqs, womensHealth, metaTitle, metaDescription, ogTitle, ogDescription`;

export const getSanityCities = async () =>
  (await sanityFetch<SanityCity[]>(`*[_type == "city"]{ ${CITY_FIELDS} }`)) ?? [];

export const getSanityCity = (slug: string) =>
  sanityFetch<SanityCity>(`*[_type == "city" && slug == $slug][0]{ ${CITY_FIELDS} }`, { slug });

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
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
};

const CENTRE_FIELDS = `
  slug, citySlug, name, fullName, isHeadOffice, area, built,
  address, pin, phone, phoneLabel, hours,
  opening { opens, closes, days },
  geo { lat, lng },
  mapQuery, image, hero360Url,
  nearby, landmarks, howToReach, facilities, doctors, treatments,
  faqs, reviewsKey, sameAs, intro, gallery, womensHealth,
  metaTitle, metaDescription, ogTitle, ogDescription
`;

export const getSanityCentres = async () =>
  (await sanityFetch<SanityCentre[]>(`*[_type == "centre"]{ ${CENTRE_FIELDS} }`)) ?? [];

export const getSanityCentre = (citySlug: string, slug: string) =>
  sanityFetch<SanityCentre>(
    `*[_type == "centre" && citySlug == $citySlug && slug == $slug][0]{ ${CENTRE_FIELDS} }`,
    { citySlug, slug },
  );

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

export const getSanityAbout = () => sanityFetch<SanityAbout>(`*[_type == "aboutPage"][0]`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSanitySurakshaKavach = () => sanityFetch<any>(`*[_type == "surakshaKavach"][0]`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSanityHistoryPage = () => sanityFetch<any>(`*[_type == "historyPage"][0]`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSanityInfrastructurePage = () => sanityFetch<any>(`*[_type == "infrastructurePage"][0]`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSanityWhyBfiPage = () => sanityFetch<any>(`*[_type == "whyBfiPage"][0]`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSanitySimpleTreatmentPage = () => sanityFetch<any>(`*[_type == "simpleTreatmentPage"][0]`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSanitySafeTreatmentPage = () => sanityFetch<any>(`*[_type == "safeTreatmentPage"][0]`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSanitySmartTreatmentPage = () => sanityFetch<any>(`*[_type == "smartTreatmentPage"][0]`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSanitySuccessBenchmarksPage = () => sanityFetch<any>(`*[_type == "successBenchmarksPage"][0]`);

export const getSanityCategoryHub = (slug: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sanityFetch<any>(`*[_type == "categoryHubPage" && slug == $slug][0]`, { slug });
