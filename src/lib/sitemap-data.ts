import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { TREATMENTS_REGISTRY } from "@/lib/treatments";
import { DOCTORS } from "@/lib/doctors";
import { CITIES, CENTRES, cityHref, centreHref } from "@/lib/locations";
import { SERVICE_CONTENT } from "@/lib/womens-health";
import { getSitemapConfig } from "@/sanity/lib/fetch";

export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const paths = new Set<string>(["/", "/about-bfi", "/contact", "/doctors", "/blogs"]);

  for (const ref of Object.values(TREATMENTS_REGISTRY)) {
    if (ref.href.startsWith("/") && !ref.href.includes("#")) paths.add(ref.href);
  }
  for (const slug of Object.keys(SERVICE_CONTENT)) paths.add(`/services/${slug}`);
  for (const d of DOCTORS) paths.add(`/doctors/${d.slug}`);
  for (const c of CITIES) {
    if (c.built) {
      const href = cityHref(c.slug);
      if (href) paths.add(href);
    }
  }
  for (const c of CENTRES) {
    if (c.built) paths.add(centreHref(c));
  }

  const sitemapCfg = await getSitemapConfig();
  const excluded = new Set(sitemapCfg?.excludePaths ?? []);
  const additionalUrls = sitemapCfg?.additionalUrls ?? [];

  for (const item of additionalUrls) {
    if (item.url) paths.add(item.url);
  }

  const lastModified = new Date();
  const additionalMap = new Map(additionalUrls.map((u) => [u.url, u]));

  return [...paths]
    .filter((p) => !excluded.has(p))
    .sort()
    .map((p) => {
      const extra = additionalMap.get(p);
      return {
        url: `${base}${p === "/" ? "" : p}`,
        lastModified,
        ...(extra?.priority ? { priority: extra.priority } : {}),
        ...(extra?.changefreq ? { changeFrequency: extra.changefreq as MetadataRoute.Sitemap[number]["changeFrequency"] } : {}),
      };
    });
}

export function sitemapEntriesToXml(entries: MetadataRoute.Sitemap): string {
  const urls = entries
    .map((e) => {
      const lines = [`    <loc>${e.url}</loc>`];
      if (e.lastModified) {
        const iso = e.lastModified instanceof Date ? e.lastModified.toISOString() : e.lastModified;
        lines.push(`    <lastmod>${iso}</lastmod>`);
      }
      if (e.changeFrequency) lines.push(`    <changefreq>${e.changeFrequency}</changefreq>`);
      if (e.priority !== undefined) lines.push(`    <priority>${e.priority}</priority>`);
      return `  <url>\n${lines.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}
