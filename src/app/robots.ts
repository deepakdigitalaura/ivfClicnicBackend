import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { getGlobalSafe } from "@/lib/payload";

/* =====================================================================
 * /robots.txt — generated from the editable `seo-settings` global.
 * ---------------------------------------------------------------------
 * Staff toggle visibility + extra blocked paths in the admin; the sitemap
 * link and the always-blocked internal routes (admin/api/editor) are added
 * here. Falls back to "allow all" if the CMS is unavailable.
 * ===================================================================== */

// Internal / non-public routes that should never be indexed, regardless of CMS.
const ALWAYS_BLOCKED = ["/admin", "/api", "/edit", "/studio", "/live-preview", "/preview", "/exit-preview"];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getGlobalSafe("seo-settings");
  const base = SITE.url;

  if (seo?.discourageSearchEngines) {
    return { rules: { userAgent: "*", disallow: "/" }, sitemap: `${base}/sitemap.xml`, host: base };
  }

  const extra = (seo?.disallowPaths ?? [])
    .map((p) => p?.path?.trim())
    .filter((p): p is string => Boolean(p));

  return {
    rules: { userAgent: "*", allow: "/", disallow: [...ALWAYS_BLOCKED, ...extra] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
