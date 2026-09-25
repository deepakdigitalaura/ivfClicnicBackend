import type { Metadata } from "next";
import { SimpleTreatmentPage } from "@/components/simple-treatment-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID, localeAlternates } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";
import { getSimpleTreatmentPage } from "@/lib/payload";
import { ui } from "@/lib/ui-strings";

const PATH = "/simple-treatment";
const LOCALE = "gu" as const;
const t = (s: string) => ui(s, LOCALE);

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSimpleTreatmentPage();
  const title = t(data.metaTitle || "Simple IVF Treatment — Easy to Understand, Plan & Undergo | Bavishi Fertility Institute");
  const description = t(
    data.metaDescription ||
      "At Bavishi Fertility Institute, we make complex IVF treatment simple — simple to understand, simple to plan, and simple to undergo. Minimum injections, fewer visits, maximum comfort.",
  );
  return withPageSeoOverride(PATH, {
    title,
    description,
    alternates: localeAlternates(PATH),
    openGraph: {
      title: data.ogTitle ? t(data.ogTitle) : title,
      description: t(
        data.ogDescription ||
          "We make complex IVF treatment simple — minimum injections, fewer visits, maximum comfort.",
      ),
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
    name: t("Simple IVF Treatment"),
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  },
  breadcrumbSchema([
    { name: t("Home"), url: "/" },
    { name: t("Simple Treatment"), url: PATH },
  ]),
];

export default async function Page() {
  const data = await getSimpleTreatmentPage();
  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={PATH} />
      <SimpleTreatmentPage data={data} locale={LOCALE} />
    </>
  );
}
