import type { Metadata } from "next";
import { EasyEmiPage } from "@/components/easy-emi-page";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";

const PATH = "/easy-emi";

export const metadata: Metadata = {
  title: "Easy EMI at 0% Interest — Affordable IVF Treatment | Bavishi Fertility Institute",
  description: "Making IVF affordable for all. 0% interest EMI, smart payment options, value-based packages, and Suraksha Kavach — parsimonious cost packages at Bavishi Fertility Institute.",
  alternates: { canonical: PATH },
  openGraph: { title: "Easy EMI & Affordable IVF | Bavishi Fertility Institute", description: "0% interest EMI, smart packages, digital payments — IVF made affordable for everyone.", url: abs(PATH), type: "website" },
};

const graph = [
  { "@type": "WebPage", "@id": `${abs(PATH)}#webpage`, url: abs(PATH), name: "Easy EMI & Affordable IVF", isPartOf: { "@id": WEBSITE_ID }, about: { "@id": ORG_ID } },
  breadcrumbSchema([ { name: "Home", url: "/" }, { name: "Easy / Interest Free EMI", url: PATH } ]),
];

export default function Page() {
  return (<><JsonLd graph={graph} /><EasyEmiPage /></>);
}
