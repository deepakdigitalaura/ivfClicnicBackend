import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { getHomepage, getGlobalSafe, getTestimonials } from "@/lib/payload";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage";
import { withPageSeoOverride } from "@/lib/page-seo";

const HERO_IMG = "/assets/hero-mother-baby1.png";

/* The homepage's <head> metadata is CMS-managed via the `homepage` global's SEO
 * group (Wave 4.2). Falls back to the original hardcoded copy so the route is
 * byte-identical when the global is empty (same pattern as the Blog Hub /blog
 * page). The hero image stays code-owned (it is the LCP/OG image). The admin's
 * Page SEO entry for "/" (if any) layers on top last. */
export async function generateMetadata(): Promise<Metadata> {
  const home = await getGlobalSafe("homepage");
  const d = HOMEPAGE_DEFAULTS.seo;
  const ogImage =
    home?.seo && typeof home.seo.ogImage === "object" && home.seo.ogImage?.url
      ? home.seo.ogImage.url
      : HERO_IMG;
  return withPageSeoOverride("/", {
    title: home?.seo?.metaTitle || d.metaTitle,
    description: home?.seo?.metaDescription || d.metaDescription,
    alternates: { canonical: "/" },
    openGraph: {
      title: home?.seo?.ogTitle || d.ogTitle,
      description: home?.seo?.ogDescription || d.ogDescription,
      type: "website",
      images: [ogImage],
    },
  });
}

export default async function Page() {
  const [data, testimonials] = await Promise.all([getHomepage(), getTestimonials()]);
  return (
    <>
      <PageSeoSchema path="/" />
      <HomePage data={data} testimonials={testimonials} />
    </>
  );
}
