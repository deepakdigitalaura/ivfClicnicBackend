import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { TREATMENTS_REGISTRY } from "@/lib/treatments";
import { DOCTORS } from "@/lib/doctors";
import { CITIES, CENTRES, cityHref, centreHref } from "@/lib/locations";
import { SERVICE_CONTENT } from "@/lib/womens-health";
import { getSitemapConfig } from "@/sanity/lib/fetch";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const paths = new Set<string>(["/", "/about-bfi", "/contact", "/doctors", "/blogs"]);

  // Treatments
  for (const ref of Object.values(TREATMENTS_REGISTRY)) {
    if (ref.href.startsWith("/") && !ref.href.includes("#")) paths.add(ref.href);
  }
  // Services
  for (const slug of Object.keys(SERVICE_CONTENT)) paths.add(`/services/${slug}`);
  // Doctors
  for (const d of DOCTORS) paths.add(`/doctors/${d.slug}`);
  // Locations
  for (const c of CITIES) {
    if (c.built) {
      const href = cityHref(c.slug);
      if (href) paths.add(href);
    }
  }
  for (const c of CENTRES) {
    if (c.built) paths.add(centreHref(c));
  }

  // Sanity-managed sitemap config
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
