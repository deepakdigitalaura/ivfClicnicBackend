import type { Metadata } from "next";
import { PressPage } from "@/components/press-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";
import { PRESS_CLIPPINGS } from "@/lib/press";

const PATH = "/press";
const TITLE = "Media & Press Coverage — Bavishi Fertility Institute";
const DESCRIPTION =
  "Newspaper coverage of Bavishi Fertility Institute. Our fertility specialists are consulted by The Times of India and regional press on IVF, male infertility and surrogacy law.";

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(PATH, {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: PATH },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: abs(PATH),
      type: "website",
      images: [PRESS_CLIPPINGS[0]?.image ?? "/assets/hero-mother-baby1.png"],
    },
  });
}

const graph = [
  {
    "@type": "CollectionPage",
    "@id": `${abs(PATH)}#webpage`,
    url: abs(PATH),
    name: TITLE,
    description: DESCRIPTION,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    hasPart: PRESS_CLIPPINGS.map((c) => ({
      "@type": "NewsArticle",
      headline: c.headline,
      inLanguage: c.language === "Gujarati" ? "gu" : "en",
      ...(c.date ? { datePublished: c.date } : {}),
      publisher: { "@type": "Organization", name: c.publication },
      image: abs(c.image),
      about: { "@id": ORG_ID },
    })),
  },
  breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Resources", url: "/blogs" },
    { name: "Media & Press", url: PATH },
  ]),
];

export default function Page() {
  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={PATH} />
      <PressPage />
    </>
  );
}
