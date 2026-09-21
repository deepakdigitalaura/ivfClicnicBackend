import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { JsonLd } from "@/components/json-ld";
import { faqSchema, localeAlternates } from "@/lib/seo";
import { getHomepage, getGlobalSafe, getTestimonials } from "@/lib/payload";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage";
import { withPageSeoOverride } from "@/lib/page-seo";

const HERO_IMG = "/assets/hero-mother-baby1.png";

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
    alternates: localeAlternates("/"),
    openGraph: {
      title: home?.seo?.ogTitle || d.ogTitle,
      description: home?.seo?.ogDescription || d.ogDescription,
      type: "website",
      images: [ogImage],
    },
  });
}

export default async function Page() {
  const [data, testimonials] = await Promise.all([getHomepage("hi"), getTestimonials()]);
  return (
    <>
      <PageSeoSchema path="/" />
      {data.faq.items.length > 0 && <JsonLd graph={[faqSchema(data.faq.items)]} />}
      <HomePage data={data} testimonials={testimonials} />
    </>
  );
}
