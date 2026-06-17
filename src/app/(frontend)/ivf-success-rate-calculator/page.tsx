import type { Metadata } from "next";
import { IvfSuccessRateCalculatorPage } from "@/components/ivf-success-rate-calculator";
import { JsonLd } from "@/components/json-ld";
import { abs, ORG_ID, WEBSITE_ID, breadcrumbSchema } from "@/lib/seo";

const PATH = "/ivf-success-rate-calculator";
const OG_IMAGE = "/assets/hero-mother-baby1.png";
const TITLE = "IVF Success Rate Calculator — Personalised IVF Success Probability";
const DESCRIPTION =
  "Free, evidence-based IVF Success Rate Calculator by Bavishi Fertility Institute. Estimate your personalised IVF success probability based on age, diagnosis, embryo type, treatment history, and egg source.";

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
      name: "IVF Success Rate Calculator",
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
      { name: "IVF Success Rate Calculator", url: PATH },
    ]),
  ];
  return (
    <>
      <JsonLd graph={graph} />
      <IvfSuccessRateCalculatorPage />
    </>
  );
}
