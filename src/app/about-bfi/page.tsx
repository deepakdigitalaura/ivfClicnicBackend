import type { Metadata } from "next";
import { AboutPage } from "@/components/about-page";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";

const PATH = "/about-bfi";

export const metadata: Metadata = {
  title: "About Bavishi Fertility Institute — 40 Years of IVF Excellence in India",
  description:
    "Founded in 1984 by Dr. Himanshu & Dr. Falguni Bavishi, Bavishi Fertility Institute has guided 30,000+ families to parenthood across 15 centres. Discover our story, legacy and values.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "About Bavishi Fertility Institute — India's Trusted IVF Legacy Since 1984",
    description:
      "30,000+ pregnancies. 15 centres across 8 cities. National Fertility Award 5 years running. The story of India's pioneering fertility institute.",
    url: abs(PATH),
    type: "website",
    images: ["/assets/about-clinic.jpg"],
  },
};

// The full MedicalOrganization entity lives sitewide (layout). Here we only
// reference it via @id, and mark this page as the org's primary About page.
const graph = [
  {
    "@type": "AboutPage",
    "@id": `${abs(PATH)}#webpage`,
    url: abs(PATH),
    name: "About Bavishi Fertility Institute",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    mainEntity: { "@id": ORG_ID },
  },
  breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Bavishi Fertility Institute", url: PATH },
  ]),
];

export default function Page() {
  return (
    <>
      <JsonLd graph={graph} />
      <AboutPage />
    </>
  );
}
