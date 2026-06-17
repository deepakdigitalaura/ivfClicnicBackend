import type { Metadata } from "next";
import { FertilePeriodCalculatorPage } from "@/components/fertile-period-calculator";
import { JsonLd } from "@/components/json-ld";
import { abs, ORG_ID, WEBSITE_ID, breadcrumbSchema } from "@/lib/seo";

const PATH = "/fertile-period-calculator";
const OG_IMAGE = "/assets/hero-mother-baby1.png";
const TITLE = "Fertile Period Calculator — Find Your Fertile Window";
const DESCRIPTION =
  "Free Fertile Period Calculator by Bavishi Fertility Institute. Find your fertile window, peak ovulation day, and next period date from your last menstrual period and cycle length.";

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
      name: "Fertile Period Calculator",
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
      { name: "Fertile Period Calculator", url: PATH },
    ]),
  ];
  return (
    <>
      <JsonLd graph={graph} />
      <FertilePeriodCalculatorPage />
    </>
  );
}
