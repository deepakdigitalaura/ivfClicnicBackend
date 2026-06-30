import "server-only";
import { createClient } from "next-sanity";
import { revalidateTag } from "next/cache";
import { projectId, dataset } from "./client";
import type {
  RobotsConfig,
  ScriptsConfig,
  RedirectsConfig,
  SitemapConfig,
  SchemaOrgConfig,
  PageSeo,
} from "./fetch";

export const hasSanity = () => Boolean(projectId && process.env.SANITY_API_TOKEN);

/**
 * Server-only Sanity client with WRITE access (uses SANITY_API_TOKEN). Reads are
 * uncached (perspective: drafts off; we read published) so the admin panel always
 * shows the latest saved values immediately after a write.
 * Lazily created so module import never throws when projectId is not configured.
 */
let _writeClient: ReturnType<typeof createClient> | null = null;
function getWriteClient() {
  if (!projectId) throw new Error("Sanity not configured");
  if (!_writeClient) {
    _writeClient = createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: false,
      token: process.env.SANITY_API_TOKEN,
    });
  }
  return _writeClient;
}
const writeClient = new Proxy({} as ReturnType<typeof createClient>, {
  get(_t, prop) {
    const c = getWriteClient();
    const val = (c as Record<string, unknown>)[prop as string];
    return typeof val === "function" ? (val as Function).bind(c) : val;
  },
});

/** Fresh (uncached) read of a singleton document by its fixed _id. */
async function readSingleton<T>(id: string): Promise<T | null> {
  if (!hasSanity()) return null;
  try {
    return await writeClient.getDocument(id) as T | null;
  } catch {
    return null;
  }
}

/** Create-or-replace a singleton document, then bust its public cache tag. */
async function saveSingleton(id: string, type: string, data: Record<string, unknown>, tag: string) {
  await writeClient.createOrReplace({ _id: id, _type: type, ...data });
  revalidateTag(tag);
}

// ── Singleton IDs (must match the documentId() set in sanity.config.ts) ──
export const IDS = {
  robots: "robotsConfig",
  scripts: "scriptsConfig",
  redirects: "redirectsConfig",
  sitemap: "sitemapConfig",
  schema: "schemaOrgConfig",
} as const;

// ── Robots ──
export const readRobots = () => readSingleton<RobotsConfig>(IDS.robots);
export const saveRobots = (data: RobotsConfig) =>
  saveSingleton(IDS.robots, "robotsConfig", data as Record<string, unknown>, "sanity-robots");

// ── Scripts ──
export const readScripts = () => readSingleton<ScriptsConfig>(IDS.scripts);
export const saveScripts = (data: ScriptsConfig) =>
  saveSingleton(IDS.scripts, "scriptsConfig", data as Record<string, unknown>, "sanity-scripts");

// ── Redirects ──
export const readRedirects = () => readSingleton<RedirectsConfig>(IDS.redirects);
export const saveRedirects = (data: RedirectsConfig) =>
  saveSingleton(IDS.redirects, "redirectsConfig", data as Record<string, unknown>, "sanity-redirects");

// ── Sitemap ──
export const readSitemap = () => readSingleton<SitemapConfig>(IDS.sitemap);
export const saveSitemap = (data: SitemapConfig) =>
  saveSingleton(IDS.sitemap, "sitemapConfig", data as Record<string, unknown>, "sanity-sitemap");

// ── Structured data ──
export const readSchema = () => readSingleton<SchemaOrgConfig>(IDS.schema);
export const saveSchema = (data: SchemaOrgConfig) =>
  saveSingleton(IDS.schema, "schemaOrgConfig", data as Record<string, unknown>, "sanity-schema-org");

// ── Page SEO (collection) ──
export async function readAllPageSeo(): Promise<(PageSeo & { _id: string })[]> {
  if (!hasSanity()) return [];
  try {
    return await writeClient.fetch(`*[_type == "pageSeo"] | order(pagePath asc)`);
  } catch {
    return [];
  }
}

export async function savePageSeo(doc: PageSeo & { _id?: string }) {
  const { _id, ...rest } = doc;
  if (_id) {
    await writeClient.createOrReplace({ _id, _type: "pageSeo", ...rest });
  } else {
    await writeClient.create({ _type: "pageSeo", ...rest });
  }
  revalidateTag("sanity-page-seo");
}

export async function deletePageSeo(id: string) {
  await writeClient.delete(id);
  revalidateTag("sanity-page-seo");
}

// ── Inquiries (leads) ──

export type Inquiry = {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  treatment?: string;
  location?: string;
  message?: string;
  source?: string;
  status?: "new" | "contacted" | "closed";
  createdAt?: string;
};

/** Public lead intake — called by the /inquiry route. Best-effort; never throws
 *  to the caller silently (the route handles failures). Returns the created id. */
export async function createInquiry(data: Omit<Inquiry, "_id">): Promise<string> {
  if (!hasSanity()) throw new Error("Sanity not configured");
  const doc = await writeClient.create({ _type: "inquiry", ...data });
  return doc._id;
}

export async function readInquiries(): Promise<Inquiry[]> {
  if (!hasSanity()) return [];
  try {
    return await writeClient.fetch(`*[_type == "inquiry"] | order(createdAt desc)`);
  } catch {
    return [];
  }
}

export async function setInquiryStatus(id: string, status: Inquiry["status"]) {
  await writeClient.patch(id).set({ status }).commit();
}

export async function deleteInquiry(id: string) {
  await writeClient.delete(id);
}

// ── Doctors ──

export type AdminDoctor = {
  _id?: string;
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

const DOCTOR_TAG = "sanity-doctors";

function revalidateDoctors() {
  revalidateTag(DOCTOR_TAG);
}

export async function readAdminDoctors(): Promise<AdminDoctor[]> {
  if (!hasSanity()) return [];
  try {
    return await writeClient.fetch(
      `*[_type == "doctor"] | order(navOrder asc, name asc){ _id, slug, name, credentials, specialty, role, imageUrl, "photoUrl": photo.asset->url, experienceLabel, experienceYears, cities, treatments, locations, shortBio, bio, knowsAbout, alumniOf, memberOf, awards, training, publications, languages, sameAs, verified, visitsAllCentres, navRole, navOrder }`,
    );
  } catch {
    return [];
  }
}

export async function saveDoctor(doc: AdminDoctor) {
  const { _id, photoUrl, ...rest } = doc;
  // photoUrl is a read-only projection; never write it back.
  void photoUrl;
  // NOTE: must NOT contain a literal "." — Sanity's public/anonymous read API
  // silently excludes document IDs with a dot outside recognised system
  // prefixes (e.g. "drafts."), so a "doctor.<slug>" id is invisible on the
  // live site even though it reads fine via the authenticated admin client.
  const id = _id || `doctor-${(doc.slug ?? "").trim()}`;
  // Preserve an existing uploaded photo asset by merging onto the current doc.
  const existing = (await writeClient.getDocument(id)) as { photo?: unknown } | null;
  await writeClient.createOrReplace({
    _id: id,
    _type: "doctor",
    ...(existing?.photo ? { photo: existing.photo } : {}),
    ...rest,
  });
  revalidateDoctors();
}

export async function deleteDoctor(id: string) {
  await writeClient.delete(id);
  revalidateDoctors();
}

// ── Homepage (singleton) ──

export type AdminHomepage = Record<string, unknown>;

export async function readHomepage(): Promise<AdminHomepage | null> {
  if (!hasSanity()) return null;
  try {
    return (await writeClient.getDocument("homepage")) as AdminHomepage | null;
  } catch {
    return null;
  }
}

export async function saveHomepage(data: AdminHomepage) {
  // Strip system fields before write.
  const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = data as Record<string, unknown>;
  void _id; void _type; void _rev; void _createdAt; void _updatedAt;
  await writeClient.createOrReplace({ _id: "homepage", _type: "homepage", ...rest });
  revalidateTag("sanity-homepage");
}

// ── Site Settings (singleton — shared across every page) ──

export type AdminSiteSettings = Record<string, unknown>;

export async function readSiteSettings(): Promise<AdminSiteSettings | null> {
  if (!hasSanity()) return null;
  try {
    return (await writeClient.getDocument("siteSettings")) as AdminSiteSettings | null;
  } catch {
    return null;
  }
}

export async function saveSiteSettings(data: AdminSiteSettings) {
  const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = data as Record<string, unknown>;
  void _id; void _type; void _rev; void _createdAt; void _updatedAt;
  await writeClient.createOrReplace({ _id: "siteSettings", _type: "siteSettings", ...rest });
  revalidateTag("sanity-site-settings");
}

// ── Testimonials ──

export type AdminTestimonial = {
  _id?: string;
  author?: string;
  role?: string;
  quote?: string;
  rating?: number;
  youtubeId?: string;
  published?: boolean;
  order?: number;
};

const TESTIMONIAL_TAG = "sanity-testimonials";

export async function readAdminTestimonials(): Promise<AdminTestimonial[]> {
  if (!hasSanity()) return [];
  try {
    return await writeClient.fetch(
      `*[_type == "testimonial"] | order(order asc){ _id, author, role, quote, rating, youtubeId, published, order }`,
    );
  } catch {
    return [];
  }
}

export async function saveTestimonial(doc: AdminTestimonial) {
  const { _id, ...rest } = doc;
  if (_id) {
    await writeClient.createOrReplace({ _id, _type: "testimonial", ...rest });
  } else {
    await writeClient.create({ _type: "testimonial", ...rest });
  }
  revalidateTag(TESTIMONIAL_TAG);
}

export async function deleteTestimonial(id: string) {
  await writeClient.delete(id);
  revalidateTag(TESTIMONIAL_TAG);
}

// ── Education Videos ──

export type AdminEducationVideo = {
  _id?: string;
  title?: string;
  category?: string;
  youtubeId?: string;
  description?: string;
  published?: boolean;
  order?: number;
};

const EDU_VIDEO_TAG = "sanity-education-videos";

export async function readAdminEducationVideos(): Promise<AdminEducationVideo[]> {
  if (!hasSanity()) return [];
  try {
    return await writeClient.fetch(
      `*[_type == "educationVideo"] | order(category asc, order asc){ _id, title, category, youtubeId, description, published, order }`,
    );
  } catch {
    return [];
  }
}

export async function saveEducationVideo(doc: AdminEducationVideo) {
  const { _id, ...rest } = doc;
  if (_id) {
    await writeClient.createOrReplace({ _id, _type: "educationVideo", ...rest });
  } else {
    await writeClient.create({ _type: "educationVideo", ...rest });
  }
  revalidateTag(EDU_VIDEO_TAG);
}

export async function deleteEducationVideo(id: string) {
  await writeClient.delete(id);
  revalidateTag(EDU_VIDEO_TAG);
}

// ── Blogs ──

const BLOG_TAG = "sanity-blogs";

export type AdminBlogMeta = {
  _id?: string;
  pgId?: number;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  categoryTitle?: string | null;
  categorySlug?: string | null;
  authorName?: string | null;
  heroImageUrl?: string | null;
  heroImageAlt?: string | null;
  heroImagePosition?: string | null;
  status?: string | null;
  publishedAt?: string | null;
  lastUpdatedAt?: string | null;
};

export async function readAdminBlogs(): Promise<AdminBlogMeta[]> {
  if (!hasSanity()) return [];
  try {
    return await writeClient.fetch(
      `*[_type == "blog"] | order(publishedAt desc){ _id, pgId, title, slug, excerpt, categoryTitle, categorySlug, authorName, heroImageUrl, heroImageAlt, heroImagePosition, status, publishedAt, lastUpdatedAt }`,
    );
  } catch {
    return [];
  }
}

/** Quick-add / meta-edit from the admin panel. Article body (contentRaw) and
 *  SEO/FAQs are intentionally left untouched here — those still go through
 *  Sanity Studio. New posts default to draft until someone publishes them. */
export async function saveBlog(doc: AdminBlogMeta) {
  const { _id, ...rest } = doc;
  if (_id) {
    await writeClient.patch(_id).set(rest).commit();
  } else {
    await writeClient.create({ _type: "blog", status: "draft", ...rest });
  }
  revalidateTag(BLOG_TAG);
}

export async function deleteBlog(id: string) {
  await writeClient.delete(id);
  revalidateTag(BLOG_TAG);
}

export async function setBlogStatus(id: string, status: "published" | "draft") {
  await writeClient.patch(id).set({ status }).commit();
  revalidateTag(BLOG_TAG);
}

/** Lightweight counts for the dashboard stat cards. */
export async function getDashboardStats() {
  const empty = { redirects: 0, pageSeo: 0, headScripts: 0, bodyScripts: 0, customSchemas: 0, blocked: 0, newInquiries: 0, totalInquiries: 0 };
  if (!hasSanity()) return empty;
  try {
    const [redirects, scripts, schema, pageSeo, robots, inquiries] = await Promise.all([
      readRedirects(),
      readScripts(),
      readSchema(),
      readAllPageSeo(),
      readRobots(),
      readInquiries(),
    ]);
    return {
      redirects: redirects?.rules?.length ?? 0,
      pageSeo: pageSeo.length,
      headScripts: scripts?.headScripts?.length ?? 0,
      bodyScripts: scripts?.bodyScripts?.length ?? 0,
      customSchemas: schema?.customSchemas?.length ?? 0,
      blocked: (robots?.rawContent?.match(/^\s*Disallow:\s*\S+/gim) ?? []).length,
      newInquiries: inquiries.filter((i) => (i.status ?? "new") === "new").length,
      totalInquiries: inquiries.length,
    };
  } catch {
    return empty;
  }
}
