import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { getHomepage, getGlobalSafe } from "@/lib/payload";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage";

const HERO_IMG = "/assets/hero-mother-baby1.png";

/* The homepage's <head> metadata is CMS-managed via the `homepage` global's SEO
 * group (Wave 4.2). Falls back to the original hardcoded copy so the route is
 * byte-identical when the global is empty (same pattern as the Blog Hub /blog
 * page). The hero image stays code-owned (it is the LCP/OG image). */
export async function generateMetadata(): Promise<Metadata> {
  const home = await getGlobalSafe("homepage");
  const d = HOMEPAGE_DEFAULTS.seo;
  const ogImage =
    home?.seo && typeof home.seo.ogImage === "object" && home.seo.ogImage?.url
      ? home.seo.ogImage.url
      : HERO_IMG;
  return {
    title: home?.seo?.metaTitle || d.metaTitle,
    description: home?.seo?.metaDescription || d.metaDescription,
    alternates: { canonical: "/" },
    openGraph: {
      title: home?.seo?.ogTitle || d.ogTitle,
      description: home?.seo?.ogDescription || d.ogDescription,
      type: "website",
      images: [ogImage],
    },
  };
}

export default async function Page() {
  const data = await getHomepage();
  return <HomePage data={data} />;
}
