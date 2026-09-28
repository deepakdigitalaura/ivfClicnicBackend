import type { Metadata } from "next";
import { SafeTreatmentPage } from "@/components/safe-treatment-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID, localeAlternates } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";
import { getSafeTreatmentPage } from "@/lib/payload";
import { ui } from "@/lib/ui-strings";

const PATH = "/safe-treatment";
const LOCALE = "hi" as const;
const t = (s: string) => ui(s, LOCALE);

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSafeTreatmentPage();
  const title = t(data.metaTitle || "Safe IVF Treatment — Safety First, Safety for All | Bavishi Fertility Institute");
  const description = t(data.metaDescription || "Bavishi Fertility Institute's motto: Safety First. OHSS-free clinic, Class 1000 labs, double-witness protocol. Your safety is our top priority.");
  return withPageSeoOverride(PATH, {
    title,
    description,
    alternates: localeAlternates(PATH),
    openGraph: {
      title: data.ogTitle ? t(data.ogTitle) : title,
      description: t(data.ogDescription || "OHSS-free clinic, Class 1000 labs, double-witness protocol. Your safety is our top priority."),
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
    name: t("Safe IVF Treatment"),
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  },
  breadcrumbSchema([
    { name: t("Home"), url: "/" },
    { name: t("Safe Treatment"), url: PATH },
  ]),
];

export default async function Page() {
  const data = await getSafeTreatmentPage();
  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={PATH} />
      <SafeTreatmentPage data={data} locale={LOCALE} />
    </>
  );
}
