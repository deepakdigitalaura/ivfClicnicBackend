import type { Metadata } from "next";
import { BlogHub } from "@/components/blog-hub";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { abs, ORG_ID, WEBSITE_ID, breadcrumbSchema } from "@/lib/seo";
import { getBlogsPage, getGlobalSafe } from "@/lib/payload";
import { withPageSeoOverride } from "@/lib/page-seo";

const PAGE_SIZE = 24;

const PATH = "/blogs";
const DEFAULT_OG_IMAGE = "/assets/hero-mother-baby1.png";

/* Fallbacks = the original hardcoded copy, so the route is byte-identical when
 * the Blog Hub global is empty (same pattern as the Contact page). */
const FALLBACK = {
  hero: {
    description:
      "Expert, compassionate guidance on fertility, IVF and your journey to parenthood — reviewed by our specialists.",
  },
  seo: {
    metaTitle: "Fertility & IVF Blog — Bavishi Fertility Institute",
    metaDescription:
      "Expert, compassionate guidance on fertility, IVF and your journey to parenthood — articles reviewed by Bavishi Fertility Institute specialists.",
    ogTitle: "Fertility & IVF Blog — Bavishi Fertility Institute",
    ogDescription:
      "Expert, compassionate guidance on fertility, IVF and parenthood — reviewed by our specialists.",
  },
};

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ page?: string }> },
): Promise<Metadata> {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const hub = await getGlobalSafe("blog-hub");
  const metaTitle = hub?.seo?.metaTitle ?? FALLBACK.seo.metaTitle;
  const metaDescription = hub?.seo?.metaDescription ?? FALLBACK.seo.metaDescription;
  const ogImage =
    hub?.seo && typeof hub.seo.ogImage === "object" && hub.seo.ogImage?.url
      ? hub.seo.ogImage.url
      : DEFAULT_OG_IMAGE;
  const canonicalPath = page > 1 ? `${PATH}?page=${page}` : PATH;
  return withPageSeoOverride(PATH, {
    title: page > 1 ? `${metaTitle} — Page ${page}` : metaTitle,
    description: metaDescription,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: hub?.seo?.ogTitle || FALLBACK.seo.ogTitle,
      description: hub?.seo?.ogDescription || FALLBACK.seo.ogDescription,
      url: abs(canonicalPath),
      type: "website",
      images: [ogImage],
    },
  });
}

export default async function Page(
  { searchParams }: { searchParams: Promise<{ page?: string }> },
) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const [blogsPage, hub] = await Promise.all([
    getBlogsPage(page, PAGE_SIZE),
    getGlobalSafe("blog-hub"),
  ]);
  const url = abs(PATH);

  const hero = {
    title: hub?.hero?.title ?? undefined,
    description: hub?.hero?.description ?? FALLBACK.hero.description,
  };

  const graph = [
    {
      "@type": "CollectionPage",
      "@id": `${url}#webpage`,
      url,
      name: "Fertility & IVF Blog",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
    },
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Blog", url: PATH },
    ]),
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={PATH} />
      <BlogHub
        posts={blogsPage.docs}
        hero={hero}
        intro={hub?.intro ?? undefined}
        page={blogsPage.page}
        totalPages={blogsPage.totalPages}
        hasPrevPage={blogsPage.hasPrevPage}
        hasNextPage={blogsPage.hasNextPage}
      />
    </>
  );
}
