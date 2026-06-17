import type { Metadata } from "next";
import { SemenAnalysisCalculatorPage } from "@/components/semen-analysis-calculator";
import { JsonLd } from "@/components/json-ld";
import { abs, ORG_ID, WEBSITE_ID, breadcrumbSchema } from "@/lib/seo";

const PATH = "/semen-analysis-calculator";
const OG_IMAGE = "/assets/hero-mother-baby1.png";
const TITLE = "Sperm Analysis Calculator — Semen Analysis Interpreter (WHO 2021)";
const DESCRIPTION =
  "Free Sperm / Semen Analysis Calculator by Bavishi Fertility Institute. Enter your semen analysis values and get an instant interpretation against WHO 2021 reference ranges with derived metrics and personalised next steps.";

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
      name: "Sperm Analysis Calculator",
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
      { name: "Sperm Analysis Calculator", url: PATH },
    ]),
  ];
  return (
    <>
      <JsonLd graph={graph} />
      <SemenAnalysisCalculatorPage />
    </>
  );
}
