import type { Metadata } from "next";
import { MiscarriageRiskCalculatorPage } from "@/components/miscarriage-risk-calculator";
import { JsonLd } from "@/components/json-ld";
import { abs, ORG_ID, WEBSITE_ID, breadcrumbSchema } from "@/lib/seo";

const PATH = "/risk-of-repeat-miscarriage-calculator";
const OG_IMAGE = "/assets/hero-mother-baby1.png";
const TITLE = "Risk of Repeat Miscarriage Calculator — Recurrent Pregnancy Loss Risk";
const DESCRIPTION =
  "Free Recurrent Pregnancy Loss risk calculator by Bavishi Fertility Institute. Assess your risk profile for repeat miscarriage based on pregnancy history, age, and known medical conditions — with personalised next steps.";

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
      name: "Risk of Repeat Miscarriage Calculator",
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
      { name: "Risk of Repeat Miscarriage Calculator", url: PATH },
    ]),
  ];
  return (
    <>
      <JsonLd graph={graph} />
      <MiscarriageRiskCalculatorPage />
    </>
  );
}
