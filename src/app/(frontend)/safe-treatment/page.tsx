import type { Metadata } from "next";
import { SafeTreatmentPage } from "@/components/safe-treatment-page";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";

const PATH = "/safe-treatment";

export const metadata: Metadata = {
  title: "Safe IVF Treatment — Safety First, Safety for All | Bavishi Fertility Institute",
  description: "Bavishi Fertility Institute's motto: Safety First. OHSS-free clinic, Class 1000 labs, double-witness protocol. Your safety is our top priority.",
  alternates: { canonical: PATH },
  openGraph: { title: "Safe IVF Treatment | Bavishi Fertility Institute", description: "OHSS-free clinic, Class 1000 labs, double-witness protocol. Your safety is our top priority.", url: abs(PATH), type: "website" },
};

const graph = [
  { "@type": "WebPage", "@id": `${abs(PATH)}#webpage`, url: abs(PATH), name: "Safe IVF Treatment", isPartOf: { "@id": WEBSITE_ID }, about: { "@id": ORG_ID } },
  breadcrumbSchema([ { name: "Home", url: "/" }, { name: "Safe Treatment", url: PATH } ]),
];

export default function Page() {
  return (<><JsonLd graph={graph} /><SafeTreatmentPage /></>);
}
