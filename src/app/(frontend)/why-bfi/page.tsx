import type { Metadata } from "next";
import { WhyBfiPage } from "@/components/why-bfi-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";

const PATH = "/why-bfi";

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(PATH, {
    title: "Why Choose Bavishi Fertility Institute | Best IVF Clinic in India",
    description:
      "25+ years of pioneering IVF in India. 25,000+ successful IVF pregnancies. Class 1000 labs, OHSS-free clinic, ethical practice — discover why families trust Bavishi Fertility Institute.",
    alternates: { canonical: PATH },
    openGraph: {
      title: "Why Choose Bavishi Fertility Institute | Best IVF Clinic in India",
      description:
        "Pioneers of IVF since 1998. 25,000+ successful IVF pregnancies, 15 centres across India. Ethical, transparent, and affordable fertility care.",
      url: abs(PATH),
      type: "website",
    },
  });
}

const graph = [
  {
    "@type": "WebPage",
    "@id": `${abs(PATH)}#webpage`,
    url: abs(PATH),
    name: "Why Choose Bavishi Fertility Institute",
    description:
      "25+ years of pioneering IVF in India. 30,000+ success stories. Class 1000 labs, ethical practice, and value-based services across 15 centres.",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  },
  breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Why BFI", url: PATH },
  ]),
];

export default function Page() {
  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={PATH} />
      <WhyBfiPage />
    </>
  );
}
