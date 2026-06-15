import type { Metadata } from "next";
import { BlogHub } from "@/components/blog-hub";
import { JsonLd } from "@/components/json-ld";
import { abs, ORG_ID, WEBSITE_ID, breadcrumbSchema } from "@/lib/seo";
import { getBlogs, getGlobalSafe } from "@/lib/payload";

const PATH = "/blog";
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

export async function generateMetadata(): Promise<Metadata> {
  const hub = await getGlobalSafe("blog-hub");
  const metaTitle = hub?.seo?.metaTitle ?? FALLBACK.seo.metaTitle;
  const metaDescription = hub?.seo?.metaDescription ?? FALLBACK.seo.metaDescription;
  const ogImage =
    hub?.seo && typeof hub.seo.ogImage === "object" && hub.seo.ogImage?.url
      ? hub.seo.ogImage.url
      : DEFAULT_OG_IMAGE;
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: PATH },
    openGraph: {
      title: hub?.seo?.ogTitle || FALLBACK.seo.ogTitle,
      description: hub?.seo?.ogDescription || FALLBACK.seo.ogDescription,
      url: abs(PATH),
      type: "website",
      images: [ogImage],
    },
  };
}

export default async function Page() {
  const [posts, hub] = await Promise.all([getBlogs(), getGlobalSafe("blog-hub")]);
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
      <BlogHub posts={posts} hero={hero} intro={hub?.intro ?? undefined} />
    </>
  );
}
