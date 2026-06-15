import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { TREATMENTS_REGISTRY } from "@/lib/treatments";
import { DOCTORS } from "@/lib/doctors";
import { CITIES, CENTRES, cityHref, centreHref } from "@/lib/locations";
import { SERVICE_CONTENT } from "@/lib/womens-health";
import { getPublishedBlogSlugs } from "@/lib/payload";

/* =====================================================================
 * /sitemap.xml — every indexable public URL, generated from the same data
 * the site renders from (treatments, services, doctors, locations) plus the
 * published blogs from the CMS. Regenerated hourly (revalidate) and on-demand
 * when blogs change (the blog read is cache-tagged). Tolerates an unavailable
 * CMS by falling back to the code-defined routes.
 * ===================================================================== */

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const paths = new Set<string>(["/", "/about-bfi", "/contact", "/doctors", "/blog"]);

  // Treatments — registry hrefs that are real pages (skip hub anchors like /#…).
  for (const ref of Object.values(TREATMENTS_REGISTRY)) {
    if (ref.href.startsWith("/") && !ref.href.includes("#")) paths.add(ref.href);
  }
  // Maternity services.
  for (const slug of Object.keys(SERVICE_CONTENT)) paths.add(`/services/${slug}`);
  // Doctor profiles.
  for (const d of DOCTORS) paths.add(`/doctors/${d.slug}`);
  // Locations — built only; helpers collapse single-centre cities to /[city].
  for (const c of CITIES) {
    if (c.built) {
      const href = cityHref(c.slug);
      if (href) paths.add(href);
    }
  }
  for (const c of CENTRES) {
    if (c.built) paths.add(centreHref(c));
  }
  // Published blog posts (CMS; tolerate failure).
  try {
    for (const slug of await getPublishedBlogSlugs()) paths.add(`/blog/${slug}`);
  } catch {
    /* CMS unavailable — code routes above still produce a valid sitemap. */
  }

  const lastModified = new Date();
  return [...paths]
    .sort()
    .map((p) => ({ url: `${base}${p === "/" ? "" : p}`, lastModified }));
}
