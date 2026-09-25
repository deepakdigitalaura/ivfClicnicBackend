import type { Metadata } from "next";
import { EasyEmiPage } from "@/components/easy-emi-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID, localeAlternates } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";
import { ui } from "@/lib/ui-strings";

const PATH = "/easy-emi";
const LOCALE = "gu" as const;
const t = (s: string) => ui(s, LOCALE);

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(PATH, {
    title: t("Easy EMI at 0% Interest — Affordable IVF Treatment | Bavishi Fertility Institute"),
    description: t("Making IVF affordable for all. 0% interest EMI, smart payment options, value-based packages, and Suraksha Kavach — calibrated cost packages at Bavishi Fertility Institute."),
    alternates: localeAlternates(PATH),
    openGraph: { title: t("Easy EMI & Affordable IVF | Bavishi Fertility Institute"), description: t("0% interest EMI, smart packages, digital payments — IVF made affordable for everyone."), url: abs(PATH), type: "website" },
  });
}

const graph = [
  { "@type": "WebPage", "@id": `${abs(PATH)}#webpage`, url: abs(PATH), name: t("Easy EMI & Affordable IVF"), isPartOf: { "@id": WEBSITE_ID }, about: { "@id": ORG_ID } },
  breadcrumbSchema([{ name: t("Home"), url: "/" }, { name: t("Easy / Interest Free EMI"), url: PATH }]),
];

export default function Page() {
  return (<><JsonLd graph={graph} /><PageSeoSchema path={PATH} /><EasyEmiPage locale={LOCALE} /></>);
}
