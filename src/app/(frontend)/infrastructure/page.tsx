import type { Metadata } from "next";
import { InfrastructurePage } from "@/components/infrastructure-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID, localeAlternates } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";
import { getInfrastructurePage } from "@/lib/payload";

const PATH = "/infrastructure";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getInfrastructurePage();
  const title = data.metaTitle || "World-Class IVF Lab & Infrastructure | Bavishi Fertility Institute";
  const description = data.metaDescription || "State-of-the-art IVF labs with Class 1000 pure air quality, dedicated andrology and cryology labs, 3D/4D sonography, and advanced endoscopy — all under one roof.";
  return withPageSeoOverride(PATH, {
    title,
    description,
    alternates: localeAlternates(PATH),
    openGraph: { title: data.ogTitle || title, description: data.ogDescription || "Class 1000 IVF labs, advanced equipment, dedicated facilities — world-class fertility care.", url: abs(PATH), type: "website" },
  });
}

const graph = [
  { "@type": "WebPage", "@id": `${abs(PATH)}#webpage`, url: abs(PATH), name: "Infrastructure", isPartOf: { "@id": WEBSITE_ID }, about: { "@id": ORG_ID } },
  breadcrumbSchema([ { name: "Home", url: "/" }, { name: "Infrastructure", url: PATH } ]),
];

export default async function Page() {
  const data = await getInfrastructurePage();
  return (<><JsonLd graph={graph} /><PageSeoSchema path={PATH} /><InfrastructurePage data={data} /></>);
}
