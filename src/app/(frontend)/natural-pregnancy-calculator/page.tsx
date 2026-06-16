import type { Metadata } from "next";
import { NaturalPregnancyCalculatorPage } from "@/components/natural-pregnancy-calculator";
import { JsonLd } from "@/components/json-ld";
import { abs, ORG_ID, WEBSITE_ID, breadcrumbSchema } from "@/lib/seo";

const PATH = "/natural-pregnancy-calculator";
const OG_IMAGE = "/assets/hero-mother-baby1.png";

const TITLE = "Natural Pregnancy Calculator — Chances of Conceiving Naturally";
const DESCRIPTION =
  "Free, clinically validated Natural Pregnancy Calculator (Hunault model, Erasmus MC 2004). Estimate your probability of natural conception within 12 months from age, duration trying, history, sperm motility and referral — by Bavishi Fertility Institute.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: abs(PATH),
    type: "article",
    images: [OG_IMAGE],
  },
};

export default function Page() {
  const graph = [
    {
      "@type": "WebApplication",
      "@id": `${abs(PATH)}#webapplication`,
      name: "Natural Pregnancy Calculator",
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
      { name: "Natural Pregnancy Calculator", url: PATH },
    ]),
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <NaturalPregnancyCalculatorPage />
    </>
  );
}
