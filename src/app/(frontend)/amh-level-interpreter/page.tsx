import type { Metadata } from "next";
import { AmhLevelInterpreterPage } from "@/components/amh-level-interpreter";
import { JsonLd } from "@/components/json-ld";
import { abs, ORG_ID, WEBSITE_ID, breadcrumbSchema } from "@/lib/seo";

const PATH = "/amh-level-interpreter";
const OG_IMAGE = "/assets/hero-mother-baby1.png";
const TITLE = "AMH Level Interpreter — Understand Your AMH Result & Ovarian Reserve";
const DESCRIPTION =
  "Free AMH Level Interpreter by Bavishi Fertility Institute. Understand what your Anti-Müllerian Hormone (AMH) result means for your ovarian reserve and IVF outcome — with age-specific reference ranges and next steps.";

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
      name: "AMH Level Interpreter",
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
      { name: "AMH Level Interpreter", url: PATH },
    ]),
  ];
  return (
    <>
      <JsonLd graph={graph} />
      <AmhLevelInterpreterPage />
    </>
  );
}
