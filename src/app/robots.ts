import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { getRobotsConfig } from "@/sanity/lib/fetch";

const ALWAYS_BLOCKED = [
  "/admin", "/api", "/edit", "/studio",
  "/live-preview", "/preview", "/exit-preview",
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const config = await getRobotsConfig();
  const base = SITE.url;

  if (config?.discourageSearchEngines) {
    return {
      rules: { userAgent: "*", disallow: "/" },
      sitemap: `${base}/sitemap.xml`,
      host: base,
    };
  }

  const extra = (config?.disallowPaths ?? []).filter(Boolean) as string[];

  return {
    rules: { userAgent: "*", allow: "/", disallow: [...ALWAYS_BLOCKED, ...extra] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
