import type { Metadata } from "next";
import { SmartTreatmentPage } from "@/components/smart-treatment-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";

const PATH = "/smart-treatment";

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(PATH, {
    title:
      "Smart IVF Treatment — Intelligent Care, Optimal Results | Bavishi Fertility Institute",
    description:
      "Smart treatments and steady care at Bavishi Fertility Institute. Smart use of technology, smart monitoring, smart diagnosis, and parsimonious cost package options.",
    alternates: { canonical: PATH },
    openGraph: {
      title: "Smart IVF Treatment | Bavishi Fertility Institute",
      description:
        "Smart treatments and steady care. Intelligent technology, monitoring, diagnosis, and affordable packages.",
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
    name: "Smart IVF Treatment",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  },
  breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Smart Treatment", url: PATH },
  ]),
];

export default function Page() {
  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={PATH} />
      <SmartTreatmentPage />
    </>
  );
}
