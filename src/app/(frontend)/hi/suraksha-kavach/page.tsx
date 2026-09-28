import type { Metadata } from "next";
import { SurakshaKavachPage } from "@/components/suraksha-kavach-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, faqSchema, abs, ORG_ID, WEBSITE_ID, localeAlternates } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";
import { getSurakshaKavach } from "@/lib/payload";
import { ui } from "@/lib/ui-strings";

const PATH = "/suraksha-kavach";
const LOCALE = "hi" as const;
const t = (s: string) => ui(s, LOCALE);

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSurakshaKavach(LOCALE);
  const title = t(data.metaTitle || "Suraksha Kavach — India's Only IVF Protection Program | Bavishi Fertility Institute");
  const description = t(data.metaDescription || "Suraksha Kavach — India's only IVF protection program. Multiple IVF cycles covered. Complete financial peace of mind — only at Bavishi Fertility Institute.");
  return withPageSeoOverride(PATH, {
    title,
    description,
    alternates: localeAlternates(PATH),
    openGraph: {
      title: data.ogTitle ? t(data.ogTitle) : title,
      description: t(data.ogDescription || "India's only IVF protection program. Multiple IVF cycles covered. Complete financial peace of mind at Bavishi Fertility Institute."),
      url: abs(PATH),
      type: "website",
      images: ["/assets/suraksha-parenthood.png"],
    },
  });
}

function buildGraph(faqs: { q: string; a: string }[]) {
  return [
    {
      "@type": "WebPage",
      "@id": `${abs(PATH)}#webpage`,
      url: abs(PATH),
      name: t("Suraksha Kavach — India's Only IVF Protection Program"),
      description: t("Suraksha Kavach — India's only IVF protection program. Multiple IVF cycles covered at Bavishi Fertility Institute."),
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
    },
    breadcrumbSchema([
      { name: t("Home"), url: "/" },
      { name: t("Suraksha Kavach"), url: PATH },
    ]),
    faqSchema(faqs.map((f) => ({ q: t(f.q), a: t(f.a) }))),
  ];
}

export default async function Page() {
  const data = await getSurakshaKavach(LOCALE);
  return (
    <>
      <JsonLd graph={buildGraph(data.faqs)} />
      <PageSeoSchema path={PATH} />
      <SurakshaKavachPage data={data} locale={LOCALE} />
    </>
  );
}
