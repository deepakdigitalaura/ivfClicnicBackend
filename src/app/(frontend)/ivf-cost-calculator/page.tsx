import type { Metadata } from "next";
import { IvfCostCalculatorPage } from "@/components/ivf-cost-calculator";
import { JsonLd } from "@/components/json-ld";
import { abs, ORG_ID, WEBSITE_ID, breadcrumbSchema } from "@/lib/seo";

const PATH = "/ivf-cost-calculator";
const OG_IMAGE = "/assets/hero-mother-baby1.png";
const TITLE = "IVF Cost Calculator — Estimate Your IVF Treatment Cost in India";
const DESCRIPTION =
  "Free IVF Cost Calculator by Bavishi Fertility Institute. Estimate your IVF treatment investment across cycle types (Standard, ICSI, FET, Donor Egg) and optional add-ons like PGT-A, embryo freezing, and ERA testing.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: abs(PATH), type: "article", images: [OG_IMAGE] },
};

export default function Page() {
  const graph = [
    {
      "@type": "WebApplication",
      "@id": `${abs(PATH)}#webapplication`,
      name: "IVF Cost Calculator",
      url: abs(PATH),
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      description: DESCRIPTION,
    },
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Calculators", url: "/#tools" },
      { name: "IVF Cost Calculator", url: PATH },
    ]),
  ];
  return (
    <>
      <JsonLd graph={graph} />
      <IvfCostCalculatorPage />
    </>
  );
}
