import type { Metadata } from "next";
import { SimpleTreatmentPage } from "@/components/simple-treatment-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";

const PATH = "/simple-treatment";

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(PATH, {
    title:
      "Simple IVF Treatment — Easy to Understand, Plan & Undergo | Bavishi Fertility Institute",
    description:
      "At Bavishi Fertility Institute, we make complex IVF treatment simple — simple to understand, simple to plan, and simple to undergo. Minimum injections, fewer visits, maximum comfort.",
    alternates: { canonical: PATH },
    openGraph: {
      title: "Simple IVF Treatment | Bavishi Fertility Institute",
      description:
        "We make complex IVF treatment simple — minimum injections, fewer visits, maximum comfort.",
      url: abs(PATH),
      type: "website",
    },
  });
}

const graph = [
  {
    "@type": "WebPage",
    "@id": `${abs(PATH)}#webpage`,
    url: abs(PATH),
    name: "Simple IVF Treatment",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  },
  breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Simple Treatment", url: PATH },
  ]),
];

export default function Page() {
  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={PATH} />
      <SimpleTreatmentPage />
    </>
  );
}
