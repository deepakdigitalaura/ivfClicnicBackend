import "server-only";
import type { Metadata } from "next";
import { getPageSeo } from "@/sanity/lib/fetch";

/** Layers an admin-configured Page SEO override (set in /admin-panel by exact
 *  path) on top of a page's own Metadata, per-field. Pages stay byte-identical
 *  when no override exists for their path. */
export async function withPageSeoOverride(path: string, base: Metadata): Promise<Metadata> {
  const o = await getPageSeo(path);
  if (!o) return base;

  const baseOg = (base.openGraph ?? {}) as Record<string, unknown>;
  const title = o.metaTitle || base.title;
  const description = o.metaDescription || base.description;

  return {
    ...base,
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(o.noIndex ? { robots: { index: false, follow: false } } : {}),
    alternates: o.canonicalUrl
      ? { ...base.alternates, canonical: o.canonicalUrl }
      : base.alternates,
    openGraph: {
      ...baseOg,
      ...(o.ogTitle || title ? { title: o.ogTitle || title } : {}),
      ...(o.ogDescription || description ? { description: o.ogDescription || description } : {}),
      ...(o.ogImageUrl ? { images: [o.ogImageUrl] } : {}),
    } as Metadata["openGraph"],
  } as Metadata;
}
