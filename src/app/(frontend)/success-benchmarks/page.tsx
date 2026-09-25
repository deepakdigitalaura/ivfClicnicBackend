import type { Metadata } from "next";
import { SuccessBenchmarksPage } from "@/components/success-benchmarks-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID, localeAlternates } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";
import { getSuccessBenchmarksPage } from "@/lib/payload";

const PATH = "/success-benchmarks";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSuccessBenchmarksPage();
  const title = data.metaTitle || "Success Benchmarks — 30,000+ Successful Pregnancies | Bavishi Fertility Institute";
  const description = data.metaDescription || "Over 30,000 successful pregnancies with one of the highest success rates in India and the world. Success is not random — it's years of learning, best practices, and technology.";
  return withPageSeoOverride(PATH, {
    title,
    description,
    alternates: localeAlternates(PATH),
    openGraph: { title: data.ogTitle || title, description: data.ogDescription || "30,000+ successful pregnancies with one of the highest success rates in India.", url: abs(PATH), type: "website" },
  });
}

const graph = [
  { "@type": "WebPage", "@id": `${abs(PATH)}#webpage`, url: abs(PATH), name: "Success Benchmarks", isPartOf: { "@id": WEBSITE_ID }, about: { "@id": ORG_ID } },
  breadcrumbSchema([ { name: "Home", url: "/" }, { name: "Success Benchmarks", url: PATH } ]),
];

export default async function Page() {
  const data = await getSuccessBenchmarksPage();
  return (<><JsonLd graph={graph} /><PageSeoSchema path={PATH} /><SuccessBenchmarksPage data={data} /></>);
}
