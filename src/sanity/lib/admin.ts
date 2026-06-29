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

/**
 * Server-only Sanity client with WRITE access (uses SANITY_API_TOKEN). Reads are
 * uncached (perspective: drafts off; we read published) so the admin panel always
 * shows the latest saved values immediately after a write.
 */
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export const hasSanity = () => Boolean(projectId && process.env.SANITY_API_TOKEN);

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
      blocked: robots?.disallowPaths?.length ?? 0,
      newInquiries: inquiries.filter((i) => (i.status ?? "new") === "new").length,
      totalInquiries: inquiries.length,
    };
  } catch {
    return empty;
  }
}
