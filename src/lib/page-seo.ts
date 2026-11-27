import "server-only";
import type { Metadata } from "next";
import { getPageSeo } from "@/sanity/lib/fetch";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

/** Layers an admin-configured Page SEO override (set in /admin-panel by exact
 *  path) on top of a page's own Metadata, per-field. Pages stay byte-identical
 *  when no override exists for their path. */
export async function withPageSeoOverride(path: string, base: Metadata): Promise<Metadata> {
  const o = await getPageSeo(path);

  // Every page that declares its own `openGraph` loses the root layout's image,
  // because Next replaces the parent object instead of merging it. This is the
  // one funnel all those pages pass through, so the fallback goes here: a page
  // that names no image shares with the site's default rather than as a bare
  // link. A page that sets its own, or an admin override, still wins.
  const withOgImage = (m: Metadata): Metadata => {
    const og = m.openGraph as Record<string, unknown> | undefined;
    if (!og || og.images) return m;
    return { ...m, openGraph: { ...og, images: [DEFAULT_OG_IMAGE] } as Metadata["openGraph"] };
  };

  if (!o) return withOgImage(base);

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
      ...{ images: o.ogImageUrl ? [o.ogImageUrl] : (baseOg.images ?? [DEFAULT_OG_IMAGE]) },
    } as Metadata["openGraph"],
  } as Metadata;
}
