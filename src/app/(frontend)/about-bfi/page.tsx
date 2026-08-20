import type { Metadata } from "next";
import { AboutPage } from "@/components/about-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { getAbout, getGlobalSafe } from "@/lib/payload";
import { ABOUT_DEFAULTS } from "@/lib/about";
import { withPageSeoOverride } from "@/lib/page-seo";

const PATH = "/about-bfi";

/* The page's <head> metadata is CMS-managed via the `about-page` global's SEO
 * group (Wave 4.5, Phase E). Falls back to the original hardcoded copy so the
 * route is byte-identical when the global is empty (same pattern as the homepage
 * and Blog Hub). The static AboutPage JSON-LD graph below stays code-owned. */
export async function generateMetadata(): Promise<Metadata> {
  const about = await getGlobalSafe("about-page");
  const d = ABOUT_DEFAULTS.seo;
  const ogImage =
    about?.seo && typeof about.seo.ogImage === "object" && about.seo.ogImage?.url
      ? about.seo.ogImage.url
      : d.ogImage;
  return withPageSeoOverride(PATH, {
    title: about?.seo?.metaTitle || d.metaTitle,
    description: about?.seo?.metaDescription || d.metaDescription,
    alternates: { canonical: PATH },
    openGraph: {
      title: about?.seo?.ogTitle || d.ogTitle,
      description: about?.seo?.ogDescription || d.ogDescription,
      url: abs(PATH),
      type: "website",
      images: [ogImage],
    },
  });
}

// The full MedicalOrganization entity lives sitewide (layout). Here we only
// reference it via @id, and mark this page as the org's primary About page.
const graph = [
  {
    "@type": "AboutPage",
    "@id": `${abs(PATH)}#webpage`,
    url: abs(PATH),
    name: "About Bavishi Fertility Institute",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    mainEntity: { "@id": ORG_ID },
  },
  breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Bavishi Fertility Institute", url: PATH },
  ]),
];

export default async function Page() {
  const data = await getAbout();
  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={PATH} />
      <AboutPage data={data} />
    </>
  );
}
