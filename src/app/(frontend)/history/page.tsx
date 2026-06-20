import type { Metadata } from "next";
import { HistoryPage } from "@/components/history-page";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";

const PATH = "/history";

export const metadata: Metadata = {
  title: "History — 35+ Years of Fertility Care | Bavishi Fertility Institute",
  description: "From humble beginnings in 1986 to India's No. 1 ranked fertility clinic. Explore the landmark milestones and achievements of Bavishi Fertility Institute.",
  alternates: { canonical: PATH },
  openGraph: { title: "History of Bavishi Fertility Institute", description: "35+ years of landmark achievements in fertility care — from 1986 to present day.", url: abs(PATH), type: "website" },
};

const graph = [
  { "@type": "WebPage", "@id": `${abs(PATH)}#webpage`, url: abs(PATH), name: "History of Bavishi Fertility Institute", isPartOf: { "@id": WEBSITE_ID }, about: { "@id": ORG_ID } },
  breadcrumbSchema([ { name: "Home", url: "/" }, { name: "History", url: PATH } ]),
];

export default function Page() {
  return (<><JsonLd graph={graph} /><HistoryPage /></>);
}
