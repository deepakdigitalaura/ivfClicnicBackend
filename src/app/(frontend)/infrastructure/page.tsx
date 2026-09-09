import type { Metadata } from "next";
import { InfrastructurePage } from "@/components/infrastructure-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";

const PATH = "/infrastructure";

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(PATH, {
    title: "World-Class IVF Lab & Infrastructure | Bavishi Fertility Institute",
    description: "State-of-the-art IVF labs with Class 1000 pure air quality, dedicated andrology and cryology labs, 3D/4D sonography, and advanced endoscopy — all under one roof.",
    alternates: { canonical: PATH },
    openGraph: { title: "World-Class Infrastructure | Bavishi Fertility Institute", description: "Class 1000 IVF labs, advanced equipment, dedicated facilities — world-class fertility care.", url: abs(PATH), type: "website" },
  });
}

const graph = [
  { "@type": "WebPage", "@id": `${abs(PATH)}#webpage`, url: abs(PATH), name: "Infrastructure", isPartOf: { "@id": WEBSITE_ID }, about: { "@id": ORG_ID } },
  breadcrumbSchema([ { name: "Home", url: "/" }, { name: "Infrastructure", url: PATH } ]),
];

export default function Page() {
  return (<><JsonLd graph={graph} /><PageSeoSchema path={PATH} /><InfrastructurePage /></>);
}
