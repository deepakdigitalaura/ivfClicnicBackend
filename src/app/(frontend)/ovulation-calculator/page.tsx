import type { Metadata } from "next";
import { OvulationPregnancyCalculatorPage } from "@/components/ovulation-pregnancy-calculator";
import { JsonLd } from "@/components/json-ld";
import { abs, ORG_ID, WEBSITE_ID, breadcrumbSchema } from "@/lib/seo";

const PATH = "/ovulation-calculator";
const OG_IMAGE = "/assets/hero-mother-baby1.png";
const TITLE = "Ovulation & Pregnancy Calculator — Fertile Window & Due Date";
const DESCRIPTION = "Free Ovulation Calculator: find your fertile window, ovulation date, pregnancy test date and next 6 cycles. Includes Pregnancy Calculator showing your baby's size, trimester dates and days to due date.";

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

const graph = [
  {
    "@type": "WebApplication",
    "@id": `${abs(PATH)}#webapplication`,
    name: "Ovulation & Pregnancy Calculator",
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
    { name: "Ovulation & Pregnancy Calculator", url: PATH },
  ]),
];

export default function Page() {
  return (
    <>
      <JsonLd graph={graph} />
      <OvulationPregnancyCalculatorPage />
    </>
  );
}
