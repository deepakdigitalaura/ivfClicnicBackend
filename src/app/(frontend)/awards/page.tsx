import type { Metadata } from "next";
import { AwardsPage } from "@/components/awards-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { getHomepage } from "@/lib/payload";
import { withPageSeoOverride } from "@/lib/page-seo";

const PATH = "/awards";
const TITLE = "Awards & Achievements — Bavishi Fertility Institute";
const DESCRIPTION =
  "Bavishi Fertility Institute's national awards and recognitions, including Best IVF Chain in India — West (The Economic Times) and India's No.1 Fertility Clinic.";

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
      images: ["/assets/hero-mother-baby1.png"],
    },
  });
}

const graph = [
  {
    "@type": "WebPage",
    "@id": `${abs(PATH)}#webpage`,
    url: abs(PATH),
    name: TITLE,
    description: DESCRIPTION,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  },
  breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Resources", url: "/#resources" },
    { name: "Awards & Achievements", url: PATH },
  ]),
];

export default async function Page() {
  const homepage = await getHomepage();
  const items = homepage.awards.items;

  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={PATH} />
      <AwardsPage items={items} />
    </>
  );
}
