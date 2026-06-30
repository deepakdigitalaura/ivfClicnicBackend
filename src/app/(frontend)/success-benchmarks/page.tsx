import type { Metadata } from "next";
import { SuccessBenchmarksPage } from "@/components/success-benchmarks-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";

const PATH = "/success-benchmarks";

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(PATH, {
    title: "Success Benchmarks — 20,000+ Successful IVF Pregnancies | Bavishi Fertility Institute",
    description: "Over 20,000 successful IVF pregnancies with one of the highest success rates in India and the world. Success is not random — it's years of learning, best practices, and technology.",
    alternates: { canonical: PATH },
    openGraph: { title: "Success Benchmarks | Bavishi Fertility Institute", description: "20,000+ successful IVF pregnancies with one of the highest success rates in India.", url: abs(PATH), type: "website" },
  });
}

const graph = [
  { "@type": "WebPage", "@id": `${abs(PATH)}#webpage`, url: abs(PATH), name: "Success Benchmarks", isPartOf: { "@id": WEBSITE_ID }, about: { "@id": ORG_ID } },
  breadcrumbSchema([ { name: "Home", url: "/" }, { name: "Success Benchmarks", url: PATH } ]),
];

export default function Page() {
  return (<><JsonLd graph={graph} /><PageSeoSchema path={PATH} /><SuccessBenchmarksPage /></>);
}
