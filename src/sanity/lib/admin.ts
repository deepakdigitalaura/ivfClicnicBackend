import "server-only";
import { createClient } from "next-sanity";
import { revalidateTag } from "next/cache";
import { projectId, dataset } from "./client";
import reviewSources from "@/data/reviews.sources.json";
import type {
  RobotsConfig,
  ScriptsConfig,
  CampsConfig,
  RedirectsConfig,
  SitemapConfig,
  SchemaOrgConfig,
  PageSeo,
  PageFaqsConfig,
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

/**
 * Create-or-replace a singleton document, then bust its public cache tag.
 * NOTE: on this self-hosted deployment, revalidateTag() here doesn't
 * reliably propagate to statically-rendered routes on its own — the client
 * (see save-kit.tsx's useSave) additionally calls /api/revalidate after a
 * successful save as a proven-reliable fallback.
 */
async function saveSingleton(id: string, type: string, data: Record<string, unknown>, tag: string) {
  await writeClient.createOrReplace({ _id: id, _type: type, ...data });
  revalidateTag(tag);
}

// ── Singleton IDs (must match the documentId() set in sanity.config.ts) ──
export const IDS = {
  robots: "robotsConfig",
  scripts: "scriptsConfig",
  camps: "campsConfig",
  redirects: "redirectsConfig",
  sitemap: "sitemapConfig",
  schema: "schemaOrgConfig",
  pageFaqs: "pageFaqsConfig",
} as const;

// ── Robots ──
export const readRobots = () => readSingleton<RobotsConfig>(IDS.robots);
export const saveRobots = (data: RobotsConfig) =>
  saveSingleton(IDS.robots, "robotsConfig", data as Record<string, unknown>, "sanity-robots");

// ── Scripts ──
export const readScripts = () => readSingleton<ScriptsConfig>(IDS.scripts);
export const saveScripts = (data: ScriptsConfig) =>
  saveSingleton(IDS.scripts, "scriptsConfig", data as Record<string, unknown>, "sanity-scripts");

// ── Camp Posters ──
export const readCamps = () => readSingleton<CampsConfig>(IDS.camps);
export const saveCamps = (data: CampsConfig) =>
  saveSingleton(IDS.camps, "campsConfig", data as Record<string, unknown>, "sanity-camps");

// ── Page FAQs ──
export const readPageFaqs = () => readSingleton<PageFaqsConfig>(IDS.pageFaqs);
export const savePageFaqs = (data: PageFaqsConfig) =>
  saveSingleton(IDS.pageFaqs, "pageFaqsConfig", data as Record<string, unknown>, "sanity-page-faqs");

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

// ── Treatments ──
// Mirrors the `treatment` Sanity schema exactly (src/sanity/schemas/treatment.ts)
// — only the fields that schema actually exposes are editable here. The
// resolver (treatment-content.ts) supports more (name, types, timeline, etc.)
// but those aren't in the schema/Studio either, so they stay code-owned.

type HeadingSrc = { lead?: string; em?: string };
type ValueRow = { value?: string };
type TextRow = { text?: string };

export type AdminTreatment = {
  _id?: string;
  slug?: string;
  href?: string;
  navCategory?: string;
  navOrder?: number;
  hero?: {
    eyebrow?: string; h1?: string; h1Em?: string; tagline?: string;
    badges?: ValueRow[]; image?: string; imageAlt?: string;
  };
  meta?: { title?: string; description?: string; ogImage?: string };
  whatIs?: {
    heading?: HeadingSrc;
    paragraphs?: TextRow[];
    aside?: { title?: string; body?: string };
  };
  benefits?: { heading?: HeadingSrc; subtitle?: string; items?: ValueRow[] };
  whoNeedsIt?: { heading?: HeadingSrc; subtitle?: string; items?: ValueRow[] };
  process?: {
    heading?: HeadingSrc; subtitle?: string;
    steps?: { icon?: string; n?: string; t?: string; d?: string }[];
    note?: string;
  };
  risks?: {
    heading?: HeadingSrc; subtitle?: string;
    items?: { t?: string; d?: string; help?: string }[];
  };
  faqs?: { q?: string; a?: string }[];
  cta?: { heading?: string; headingEm?: string; subtitle?: string };
};

const TREATMENT_TAG = "sanity-treatments";

const TREATMENT_FIELDS_ADMIN = `
  _id, slug, href, navCategory, navOrder,
  hero{ eyebrow, h1, h1Em, tagline, badges, image, imageAlt },
  meta{ title, description, ogImage },
  whatIs{ heading, paragraphs, aside },
  benefits{ heading, subtitle, items },
  whoNeedsIt{ heading, subtitle, items },
  process{ heading, subtitle, steps, note },
  risks{ heading, subtitle, items },
  faqs, cta
`;

export async function readAdminTreatments(): Promise<AdminTreatment[]> {
  if (!hasSanity()) return [];
  try {
    return await writeClient.fetch(`*[_type == "treatment"] | order(slug asc){ ${TREATMENT_FIELDS_ADMIN} }`);
  } catch {
    return [];
  }
}

export async function saveTreatment(doc: AdminTreatment) {
  const { _id, ...rest } = doc;
  const id = _id || `treatment-${(doc.slug ?? "").trim()}`;
  // Preserve an existing Studio-uploaded heroPhoto asset (not editable here — the
  // admin form only sets hero.image, a plain path/URL string, same as Doctors).
  const existing = (await writeClient.getDocument(id)) as { hero?: { heroPhoto?: unknown } } | null;
  await writeClient.createOrReplace({
    _id: id,
    _type: "treatment",
    ...rest,
    ...(existing?.hero?.heroPhoto ? { hero: { ...rest.hero, heroPhoto: existing.hero.heroPhoto } } : {}),
  });
  revalidateTag(TREATMENT_TAG);
}

export async function deleteTreatment(id: string) {
  await writeClient.delete(id);
  revalidateTag(TREATMENT_TAG);
}

// ── Services ──
// Mirrors the `service` Sanity schema exactly (src/sanity/schemas/service.ts).
// NOTE the schema's `cta` field is fetched publicly (SERVICE_FIELDS in fetch.ts)
// but toServiceSource()/resolveService() (src/lib/payload.ts, src/lib/services.ts)
// never read it — it's dead data today, so it's intentionally NOT exposed here
// either (a form field that silently does nothing would be worse than no field).
// Also note the array-item wrapper keys differ from Treatments: badges use
// `{badge}` and benefit/whoFor items use `{item}`, not `{value}`.

export type AdminService = {
  _id?: string;
  slug?: string;
  hero?: {
    eyebrow?: string; h1?: string; h1Em?: string; tagline?: string;
    badges?: { badge?: string }[]; image?: string; imageAlt?: string;
  };
  seo?: { metaTitle?: string; metaDescription?: string };
  overview?: {
    heading?: HeadingSrc;
    paragraphs?: TextRow[];
    aside?: { title?: string; body?: string };
  };
  benefits?: { heading?: HeadingSrc; subtitle?: string; items?: { item?: string }[] };
  whoFor?: { heading?: HeadingSrc; subtitle?: string; items?: { item?: string }[] };
  process?: {
    heading?: HeadingSrc; subtitle?: string;
    steps?: { icon?: string; t?: string; d?: string }[];
    note?: string;
  };
  whyUs?: { heading?: HeadingSrc; items?: { icon?: string; t?: string; d?: string }[] };
  faqs?: { q?: string; a?: string }[];
};

const SERVICE_TAG = "sanity-services";

const SERVICE_FIELDS_ADMIN = `
  _id, slug,
  hero{ eyebrow, h1, h1Em, tagline, badges, image, imageAlt },
  seo{ metaTitle, metaDescription },
  overview{ heading, paragraphs, aside },
  benefits{ heading, subtitle, items },
  whoFor{ heading, subtitle, items },
  process{ heading, subtitle, steps, note },
  whyUs{ heading, items },
  faqs
`;

export async function readAdminServices(): Promise<AdminService[]> {
  if (!hasSanity()) return [];
  try {
    return await writeClient.fetch(`*[_type == "service"] | order(slug asc){ ${SERVICE_FIELDS_ADMIN} }`);
  } catch {
    return [];
  }
}

export async function saveService(doc: AdminService) {
  const { _id, ...rest } = doc;
  const id = _id || `service-${(doc.slug ?? "").trim()}`;
  // Preserve an existing Studio-uploaded heroPhoto asset (not editable here).
  const existing = (await writeClient.getDocument(id)) as { hero?: { heroPhoto?: unknown } } | null;
  await writeClient.createOrReplace({
    _id: id,
    _type: "service",
    ...rest,
    ...(existing?.hero?.heroPhoto ? { hero: { ...rest.hero, heroPhoto: existing.hero.heroPhoto } } : {}),
  });
  revalidateTag(SERVICE_TAG);
}

export async function deleteService(id: string) {
  await writeClient.delete(id);
  revalidateTag(SERVICE_TAG);
}

// ── Locations (Cities + Centres) ──
// Mirrors `city`/`centre` Sanity schemas exactly (src/sanity/schemas/city.ts,
// centre.ts). Unlike Doctors/Treatments/Services, heroImage/image are plain
// string paths (schema type "string", not "image") — no Sanity asset to
// preserve on save, same as the rest of this pair's fields.

export type AdminCity = {
  _id?: string;
  slug?: string;
  name?: string;
  region?: string;
  country?: string;
  built?: boolean;
  heroImage?: string;
  hero360Url?: string;
  helpline?: string;
  helplineLabel?: string;
  whatsapp?: string;
  intro?: ValueRow[];
  faqs?: { q?: string; a?: string }[];
  womensHealth?: ValueRow[];
};

export type AdminCentre = {
  _id?: string;
  slug?: string;
  citySlug?: string;
  name?: string;
  fullName?: string;
  area?: string;
  isHeadOffice?: boolean;
  built?: boolean;
  image?: string;
  hero360Url?: string;
  address?: string;
  pin?: string;
  phone?: string;
  phoneLabel?: string;
  hours?: string;
  opening?: { opens?: string; closes?: string; days?: ValueRow[] };
  geo?: { lat?: number; lng?: number };
  mapQuery?: string;
  reviewsKey?: string;
  sameAs?: ValueRow[];
  intro?: string;
  nearby?: ValueRow[];
  landmarks?: ValueRow[];
  howToReach?: ValueRow[];
  gallery?: { src?: string; alt?: string }[];
  facilities?: ValueRow[];
  doctors?: ValueRow[];
  treatments?: ValueRow[];
  womensHealth?: ValueRow[];
  faqs?: { q?: string; a?: string }[];
};

// Reuses the "sanity-locations" tag already wired into getSanityCities/
// getSanityCity/getSanityCentres/getSanityCentre (src/sanity/lib/fetch.ts) so a
// save here busts the same cache the public routes + nav read from.
const LOCATION_TAG = "sanity-locations";

const CITY_FIELDS_ADMIN = `
  _id, slug, name, region, country, built, heroImage, hero360Url,
  helpline, helplineLabel, whatsapp, intro, faqs, womensHealth
`;

export async function readAdminCities(): Promise<AdminCity[]> {
  if (!hasSanity()) return [];
  try {
    return await writeClient.fetch(`*[_type == "city"] | order(slug asc){ ${CITY_FIELDS_ADMIN} }`);
  } catch {
    return [];
  }
}

export async function saveCity(doc: AdminCity) {
  const { _id, ...rest } = doc;
  const id = _id || `city-${(doc.slug ?? "").trim()}`;
  await writeClient.createOrReplace({ _id: id, _type: "city", ...rest });
  revalidateTag(LOCATION_TAG);
}

export async function deleteCity(id: string) {
  await writeClient.delete(id);
  revalidateTag(LOCATION_TAG);
}

const CENTRE_FIELDS_ADMIN = `
  _id, slug, citySlug, name, fullName, area, isHeadOffice, built, image, hero360Url,
  address, pin, phone, phoneLabel, hours, opening, geo, mapQuery, reviewsKey, sameAs,
  intro, nearby, landmarks, howToReach, gallery, facilities, doctors, treatments,
  womensHealth, faqs
`;

export async function readAdminCentres(): Promise<AdminCentre[]> {
  if (!hasSanity()) return [];
  try {
    return await writeClient.fetch(`*[_type == "centre"] | order(citySlug asc, slug asc){ ${CENTRE_FIELDS_ADMIN} }`);
  } catch {
    return [];
  }
}

export async function saveCentre(doc: AdminCentre) {
  const { _id, ...rest } = doc;
  // Id includes citySlug — centre slugs aren't globally unique across cities
  // (e.g. two different cities could each have a centre named "main").
  const id = _id || `centre-${(doc.citySlug ?? "").trim()}-${(doc.slug ?? "").trim()}`;
  await writeClient.createOrReplace({ _id: id, _type: "centre", ...rest });
  revalidateTag(LOCATION_TAG);
}

export async function deleteCentre(id: string) {
  await writeClient.delete(id);
  revalidateTag(LOCATION_TAG);
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

// ── About Page (singleton) ──

export type AdminAbout = Record<string, unknown>;

export async function readAbout(): Promise<AdminAbout | null> {
  if (!hasSanity()) return null;
  try {
    return (await writeClient.getDocument("aboutPage")) as AdminAbout | null;
  } catch {
    return null;
  }
}

export async function saveAbout(data: AdminAbout) {
  const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = data as Record<string, unknown>;
  void _id; void _type; void _rev; void _createdAt; void _updatedAt;
  await writeClient.createOrReplace({ _id: "aboutPage", _type: "aboutPage", ...rest });
  revalidateTag("sanity-about");
}

export type AdminSurakshaKavach = Record<string, unknown>;

export async function readSurakshaKavach(): Promise<AdminSurakshaKavach | null> {
  if (!hasSanity()) return null;
  try {
    return (await writeClient.getDocument("surakshaKavach")) as AdminSurakshaKavach | null;
  } catch {
    return null;
  }
}

export async function saveSurakshaKavach(data: AdminSurakshaKavach) {
  const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = data as Record<string, unknown>;
  void _id; void _type; void _rev; void _createdAt; void _updatedAt;
  await writeClient.createOrReplace({ _id: "surakshaKavach", _type: "surakshaKavach", ...rest });
  revalidateTag("sanity-suraksha-kavach");
}

export type AdminHistoryPage = Record<string, unknown>;

export async function readHistoryPage(): Promise<AdminHistoryPage | null> {
  if (!hasSanity()) return null;
  try {
    return (await writeClient.getDocument("historyPage")) as AdminHistoryPage | null;
  } catch {
    return null;
  }
}

export async function saveHistoryPage(data: AdminHistoryPage) {
  const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = data as Record<string, unknown>;
  void _id; void _type; void _rev; void _createdAt; void _updatedAt;
  await writeClient.createOrReplace({ _id: "historyPage", _type: "historyPage", ...rest });
  revalidateTag("sanity-history-page");
}

export type AdminInfrastructurePage = Record<string, unknown>;

export async function readInfrastructurePage(): Promise<AdminInfrastructurePage | null> {
  if (!hasSanity()) return null;
  try {
    return (await writeClient.getDocument("infrastructurePage")) as AdminInfrastructurePage | null;
  } catch {
    return null;
  }
}

export async function saveInfrastructurePage(data: AdminInfrastructurePage) {
  const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = data as Record<string, unknown>;
  void _id; void _type; void _rev; void _createdAt; void _updatedAt;
  await writeClient.createOrReplace({ _id: "infrastructurePage", _type: "infrastructurePage", ...rest });
  revalidateTag("sanity-infrastructure-page");
}

export type AdminWhyBfiPage = Record<string, unknown>;

export async function readWhyBfiPage(): Promise<AdminWhyBfiPage | null> {
  if (!hasSanity()) return null;
  try {
    return (await writeClient.getDocument("whyBfiPage")) as AdminWhyBfiPage | null;
  } catch {
    return null;
  }
}

export async function saveWhyBfiPage(data: AdminWhyBfiPage) {
  const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = data as Record<string, unknown>;
  void _id; void _type; void _rev; void _createdAt; void _updatedAt;
  await writeClient.createOrReplace({ _id: "whyBfiPage", _type: "whyBfiPage", ...rest });
  revalidateTag("sanity-why-bfi-page");
}

export type AdminSimpleTreatmentPage = Record<string, unknown>;

export async function readSimpleTreatmentPage(): Promise<AdminSimpleTreatmentPage | null> {
  if (!hasSanity()) return null;
  try {
    return (await writeClient.getDocument("simpleTreatmentPage")) as AdminSimpleTreatmentPage | null;
  } catch {
    return null;
  }
}

export async function saveSimpleTreatmentPage(data: AdminSimpleTreatmentPage) {
  const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = data as Record<string, unknown>;
  void _id; void _type; void _rev; void _createdAt; void _updatedAt;
  await writeClient.createOrReplace({ _id: "simpleTreatmentPage", _type: "simpleTreatmentPage", ...rest });
  revalidateTag("sanity-simple-treatment-page");
}

export type AdminSafeTreatmentPage = Record<string, unknown>;

export async function readSafeTreatmentPage(): Promise<AdminSafeTreatmentPage | null> {
  if (!hasSanity()) return null;
  try {
    return (await writeClient.getDocument("safeTreatmentPage")) as AdminSafeTreatmentPage | null;
  } catch {
    return null;
  }
}

export async function saveSafeTreatmentPage(data: AdminSafeTreatmentPage) {
  const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = data as Record<string, unknown>;
  void _id; void _type; void _rev; void _createdAt; void _updatedAt;
  await writeClient.createOrReplace({ _id: "safeTreatmentPage", _type: "safeTreatmentPage", ...rest });
  revalidateTag("sanity-safe-treatment-page");
}

export type AdminSmartTreatmentPage = Record<string, unknown>;

export async function readSmartTreatmentPage(): Promise<AdminSmartTreatmentPage | null> {
  if (!hasSanity()) return null;
  try {
    return (await writeClient.getDocument("smartTreatmentPage")) as AdminSmartTreatmentPage | null;
  } catch {
    return null;
  }
}

export async function saveSmartTreatmentPage(data: AdminSmartTreatmentPage) {
  const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = data as Record<string, unknown>;
  void _id; void _type; void _rev; void _createdAt; void _updatedAt;
  await writeClient.createOrReplace({ _id: "smartTreatmentPage", _type: "smartTreatmentPage", ...rest });
  revalidateTag("sanity-smart-treatment-page");
}

export type AdminSuccessBenchmarksPage = Record<string, unknown>;

export async function readSuccessBenchmarksPage(): Promise<AdminSuccessBenchmarksPage | null> {
  if (!hasSanity()) return null;
  try {
    return (await writeClient.getDocument("successBenchmarksPage")) as AdminSuccessBenchmarksPage | null;
  } catch {
    return null;
  }
}

export async function saveSuccessBenchmarksPage(data: AdminSuccessBenchmarksPage) {
  const { _id, _type, _rev, _createdAt, _updatedAt, ...rest } = data as Record<string, unknown>;
  void _id; void _type; void _rev; void _createdAt; void _updatedAt;
  await writeClient.createOrReplace({ _id: "successBenchmarksPage", _type: "successBenchmarksPage", ...rest });
  revalidateTag("sanity-success-benchmarks-page");
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

// ── Press ──

export type AdminPress = {
  _id?: string;
  slug?: string;
  headline?: string;
  headlineOriginal?: string;
  standfirst?: string;
  publication?: string;
  edition?: string;
  date?: string;
  byline?: string;
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

const PRESS_TAG = "sanity-press";

export async function readAdminPress(): Promise<AdminPress[]> {
  if (!hasSanity()) return [];
  try {
    return await writeClient.fetch(
      `*[_type == "press"] | order(order asc){ _id, "slug": slug.current, headline, headlineOriginal, standfirst, publication, edition, date, byline, language, summary, bodyText, doctorsQuoted, image, thumb, width, height, order, published }`,
    );
  } catch {
    return [];
  }
}

export async function savePress(doc: AdminPress) {
  const { _id, slug, ...rest } = doc;
  const body = { ...rest, slug: { _type: "slug", current: slug } };
  if (_id) {
    await writeClient.createOrReplace({ _id, _type: "press", ...body });
  } else {
    await writeClient.create({ _type: "press", ...body });
  }
  revalidateTag(PRESS_TAG);
}

export async function deletePress(id: string) {
  await writeClient.delete(id);
  revalidateTag(PRESS_TAG);
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

// ── Google Reviews (admin-accumulated) ──
// Reads Place IDs from the existing src/data/reviews.sources.json (same file
// scripts/sync-reviews.mjs uses). Each refresh pulls Google's up-to-5 "newest"
// reviews per centre, keeps only 4-5★ reviews between 120-320 characters
// (substantial, not one-liners), and stores any NOT already saved as new
// Sanity documents — existing reviews are never touched, so the stored set
// only ever grows. Ordering by fetchedAt (see REVIEWS_BY_KEY_QUERY) means
// whatever a refresh just added surfaces above older, previously-saved ones.

export type AdminGoogleReview = {
  _id: string;
  centreSlug: string;
  author: string;
  rating: number;
  text: string;
  publishedAt?: string;
  relativeTime?: string;
  profilePhoto?: string;
  fetchedAt: string;
  manual?: boolean;
};

export type ManualReviewInput = {
  centreSlug: string;
  author: string;
  rating: number;
  text: string;
  publishedAt?: string;
};

export type ReviewRefreshResult = {
  centreSlug: string;
  fetched: number;
  added: number;
  skipped?: "no-placeid";
  error?: string;
};

const REVIEW_TAG = "sanity-reviews";
const REVIEW_MIN_RATING = 4;
const REVIEW_MIN_TEXT_LEN = 120;
const REVIEW_MAX_TEXT_LEN = 320;

const slugifyKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-+|-+$)/g, "");

export async function readAdminReviews(): Promise<AdminGoogleReview[]> {
  if (!hasSanity()) return [];
  try {
    return await writeClient.fetch(
      `*[_type == "googleReview"] | order(centreSlug asc, fetchedAt desc){ _id, centreSlug, author, rating, text, publishedAt, relativeTime, profilePhoto, fetchedAt, manual }`,
    );
  } catch {
    return [];
  }
}

/** Staff-entered review — e.g. copied from a centre's Google listing directly
 *  (more are visible in a browser than the free Places API ever returns).
 *  Stored in the same accumulating list so it shows in the same carousel,
 *  but flagged `manual: true` so it never gets the "Google" badge or feeds
 *  AggregateRating/Review schema — only API-fetched reviews get that,
 *  since we can't automatically verify a hand-typed entry's provenance. */
export async function createManualReview(input: ManualReviewInput): Promise<void> {
  if (!hasSanity()) throw new Error("Sanity not configured");
  const now = new Date().toISOString();
  await writeClient.create({
    _type: "googleReview",
    centreSlug: input.centreSlug,
    author: input.author,
    rating: input.rating,
    text: input.text,
    publishedAt: input.publishedAt || now,
    fetchedAt: now,
    manual: true,
  });
  revalidateTag(REVIEW_TAG);
}

/** Same as createManualReview, batched — sequential (not Promise.all) to
 *  keep writes paced rather than firing a burst of concurrent requests. */
export async function createManualReviews(inputs: ManualReviewInput[]): Promise<{ added: number }> {
  if (!hasSanity()) throw new Error("Sanity not configured");
  const now = new Date().toISOString();
  let added = 0;
  for (const input of inputs) {
    await writeClient.create({
      _type: "googleReview",
      centreSlug: input.centreSlug,
      author: input.author,
      rating: input.rating,
      text: input.text,
      publishedAt: input.publishedAt || now,
      fetchedAt: now,
      manual: true,
    });
    added++;
  }
  revalidateTag(REVIEW_TAG);
  return { added };
}

export async function deleteReview(id: string) {
  await writeClient.delete(id);
  revalidateTag(REVIEW_TAG);
}

type GoogleReviewSource = { placeId?: string; listingUrl?: string };

type RawGoogleReview = {
  author_name?: string;
  rating?: number;
  text?: string;
  time?: number;
  relative_time_description?: string;
  profile_photo_url?: string;
};

/** Fetches every configured centre's Place Details from Google, filters to
 *  4-5★ reviews of substantial length, and saves any new ones. Never throws —
 *  a per-centre failure (bad Place ID, API error) is reported in that
 *  centre's result and does not stop the others. */
export async function refreshAllReviews(): Promise<ReviewRefreshResult[]> {
  if (!hasSanity()) throw new Error("Sanity not configured");
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY not set");

  const sources = (reviewSources as { sources?: Record<string, GoogleReviewSource> }).sources ?? {};
  const results: ReviewRefreshResult[] = [];

  for (const [centreSlug, src] of Object.entries(sources)) {
    if (!src?.placeId) {
      results.push({ centreSlug, fetched: 0, added: 0, skipped: "no-placeid" });
      continue;
    }

    try {
      const fields = "rating,user_ratings_total,reviews,url,name";
      const url =
        `https://maps.googleapis.com/maps/api/place/details/json` +
        `?place_id=${encodeURIComponent(src.placeId)}&fields=${fields}&reviews_sort=newest&language=en&key=${apiKey}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.status !== "OK" || !json.result) {
        throw new Error(`Places status ${json.status}${json.error_message ? ` — ${json.error_message}` : ""}`);
      }

      const r = json.result;
      const rawReviews: RawGoogleReview[] = Array.isArray(r.reviews) ? r.reviews : [];
      const fetchedAt = new Date().toISOString();
      let added = 0;

      for (const rv of rawReviews) {
        const rating = Number(rv.rating);
        const text = String(rv.text ?? "").trim();
        if (!Number.isFinite(rating) || rating < REVIEW_MIN_RATING) continue;
        if (text.length < REVIEW_MIN_TEXT_LEN || text.length > REVIEW_MAX_TEXT_LEN) continue;

        const author = String(rv.author_name ?? "Google user");
        const time = Number(rv.time) || 0;
        const id = `googleReview-${centreSlug}-${slugifyKey(author)}-${time}`;

        const existing = await writeClient.getDocument(id);
        if (existing) continue; // already stored from a previous refresh — leave it in place

        await writeClient.createIfNotExists({
          _id: id,
          _type: "googleReview",
          centreSlug,
          author,
          rating,
          text,
          publishedAt: time ? new Date(time * 1000).toISOString() : fetchedAt,
          ...(rv.relative_time_description ? { relativeTime: rv.relative_time_description } : {}),
          ...(rv.profile_photo_url ? { profilePhoto: rv.profile_photo_url } : {}),
          fetchedAt,
        });
        added++;
      }

      const aggregate =
        typeof r.rating === "number" && typeof r.user_ratings_total === "number" && r.user_ratings_total > 0
          ? { ratingValue: r.rating, reviewCount: r.user_ratings_total }
          : null;
      if (aggregate) {
        await writeClient.createOrReplace({
          _id: `reviewMeta-${centreSlug}`,
          _type: "reviewMeta",
          centreSlug,
          ratingValue: aggregate.ratingValue,
          reviewCount: aggregate.reviewCount,
          ...(r.url || src.listingUrl ? { mapsUrl: r.url || src.listingUrl } : {}),
          lastRefreshedAt: fetchedAt,
        });
      }

      results.push({ centreSlug, fetched: rawReviews.length, added });
    } catch (e) {
      results.push({ centreSlug, fetched: 0, added: 0, error: e instanceof Error ? e.message : String(e) });
    }
  }

  revalidateTag(REVIEW_TAG);
  return results;
}

/** ONE-TIME migration: the pre-existing build-time cache (src/data/reviews-cache.json,
 *  populated by scripts/sync-reviews.mjs before this admin store existed) already has
 *  real Google reviews fetched over past weeks. Loads them into the same accumulating
 *  Sanity store — through the same 4-5★/120-320-char filter — so the admin panel isn't
 *  starting from zero before the first live "Refresh All Reviews" click. Safe to re-run
 *  (dedupes exactly like refreshAllReviews). Remove this + its call site once run. */
export async function backfillLegacyReviewCache(): Promise<ReviewRefreshResult[]> {
  if (!hasSanity()) throw new Error("Sanity not configured");
  const { default: legacyCache } = await import("@/data/reviews-cache.json");
  const results: ReviewRefreshResult[] = [];

  for (const [centreSlug, entry] of Object.entries(legacyCache as Record<string, {
    fetchedAt?: string;
    mapsUrl?: string;
    aggregate?: { ratingValue?: number; reviewCount?: number };
    reviews?: { author?: string; rating?: number; text?: string; publishedAtISO?: string; relativeTime?: string; profilePhoto?: string }[];
  }>)) {
    try {
      const fetchedAt = new Date().toISOString();
      let added = 0;

      for (const rv of entry.reviews ?? []) {
        const rating = Number(rv.rating);
        const text = String(rv.text ?? "").trim();
        if (!Number.isFinite(rating) || rating < REVIEW_MIN_RATING) continue;
        if (text.length < REVIEW_MIN_TEXT_LEN || text.length > REVIEW_MAX_TEXT_LEN) continue;

        const author = String(rv.author ?? "Google user");
        const time = rv.publishedAtISO ? Math.floor(new Date(rv.publishedAtISO).getTime() / 1000) : 0;
        const id = `googleReview-${centreSlug}-${slugifyKey(author)}-${time}`;

        const existing = await writeClient.getDocument(id);
        if (existing) continue;

        await writeClient.createIfNotExists({
          _id: id,
          _type: "googleReview",
          centreSlug,
          author,
          rating,
          text,
          publishedAt: rv.publishedAtISO || fetchedAt,
          ...(rv.relativeTime ? { relativeTime: rv.relativeTime } : {}),
          ...(rv.profilePhoto ? { profilePhoto: rv.profilePhoto } : {}),
          fetchedAt,
        });
        added++;
      }

      if (entry.aggregate?.reviewCount) {
        await writeClient.createOrReplace({
          _id: `reviewMeta-${centreSlug}`,
          _type: "reviewMeta",
          centreSlug,
          ratingValue: entry.aggregate.ratingValue ?? 0,
          reviewCount: entry.aggregate.reviewCount,
          ...(entry.mapsUrl ? { mapsUrl: entry.mapsUrl } : {}),
          lastRefreshedAt: entry.fetchedAt || fetchedAt,
        });
      }

      results.push({ centreSlug, fetched: entry.reviews?.length ?? 0, added });
    } catch (e) {
      results.push({ centreSlug, fetched: 0, added: 0, error: e instanceof Error ? e.message : String(e) });
    }
  }

  revalidateTag(REVIEW_TAG);
  return results;
}

/** Copies a random sample of already-stored reviews from every OTHER centre
 *  into "brand" (used by the homepage carousel), so it showcases the whole
 *  network instead of one listing. Each copy keeps its original verified/
 *  manual status and gets a deterministic id (`...-from-<source _id>`), so
 *  re-running is safe — a review already copied in just gets skipped, only
 *  genuinely new picks get added. Never touches or removes existing "brand"
 *  reviews (same additive rule as the rest of this store). */
export async function poolBrandReviews(count = 15): Promise<{ added: number; pooled: number }> {
  if (!hasSanity()) throw new Error("Sanity not configured");
  const source: {
    _id: string;
    author: string;
    rating: number;
    text: string;
    publishedAt?: string;
    relativeTime?: string;
    profilePhoto?: string;
    manual?: boolean;
  }[] = await writeClient.fetch(
    `*[_type == "googleReview" && centreSlug != "brand"]{ _id, author, rating, text, publishedAt, relativeTime, profilePhoto, manual }`,
  );
  if (source.length === 0) return { added: 0, pooled: 0 };

  const pool = source.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const picked = pool.slice(0, Math.min(count, pool.length));

  const fetchedAt = new Date().toISOString();
  let added = 0;
  for (const rv of picked) {
    const id = `googleReview-brand-from-${rv._id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
    const existing = await writeClient.getDocument(id);
    if (existing) continue;

    await writeClient.createIfNotExists({
      _id: id,
      _type: "googleReview",
      centreSlug: "brand",
      author: rv.author,
      rating: rv.rating,
      text: rv.text,
      publishedAt: rv.publishedAt || fetchedAt,
      ...(rv.relativeTime ? { relativeTime: rv.relativeTime } : {}),
      ...(rv.profilePhoto ? { profilePhoto: rv.profilePhoto } : {}),
      fetchedAt,
      ...(rv.manual ? { manual: true } : {}),
    });
    added++;
  }

  revalidateTag(REVIEW_TAG);
  return { added, pooled: picked.length };
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
