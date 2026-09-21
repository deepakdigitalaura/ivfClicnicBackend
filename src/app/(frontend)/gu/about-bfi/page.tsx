import type { Metadata } from "next";
import { AboutPage } from "@/components/about-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID, localeAlternates } from "@/lib/seo";
import { getAbout, getGlobalSafe } from "@/lib/payload";
import { ABOUT_DEFAULTS } from "@/lib/about";
import { withPageSeoOverride } from "@/lib/page-seo";

const PATH = "/about-bfi";

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
    alternates: localeAlternates(PATH),
    openGraph: {
      title: about?.seo?.ogTitle || d.ogTitle,
      description: about?.seo?.ogDescription || d.ogDescription,
      url: abs(PATH),
      type: "website",
      images: [ogImage],
    },
  });
}

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
  const data = await getAbout("gu");
  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={PATH} />
      <AboutPage data={data} />
    </>
  );
}
