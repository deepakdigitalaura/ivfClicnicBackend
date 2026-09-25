import type { Metadata } from "next";
import { HistoryPage } from "@/components/history-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID, localeAlternates } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";
import { getHistoryPage } from "@/lib/payload";

const PATH = "/history";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHistoryPage();
  const title = data.metaTitle || "History — 35+ Years of Fertility Care | Bavishi Fertility Institute";
  const description = data.metaDescription || "From humble beginnings in 1986 to India's No. 1 ranked fertility clinic. Explore the landmark milestones and achievements of Bavishi Fertility Institute.";
  return withPageSeoOverride(PATH, {
    title,
    description,
    alternates: localeAlternates(PATH),
    openGraph: { title: data.ogTitle || title, description: data.ogDescription || "35+ years of landmark achievements in fertility care — from 1986 to present day.", url: abs(PATH), type: "website" },
  });
}

const graph = [
  { "@type": "WebPage", "@id": `${abs(PATH)}#webpage`, url: abs(PATH), name: "History of Bavishi Fertility Institute", isPartOf: { "@id": WEBSITE_ID }, about: { "@id": ORG_ID } },
  breadcrumbSchema([ { name: "Home", url: "/" }, { name: "History", url: PATH } ]),
];

export default async function Page() {
  const data = await getHistoryPage();
  return (<><JsonLd graph={graph} /><PageSeoSchema path={PATH} /><HistoryPage data={data} /></>);
}
