import type { Metadata } from "next";
import { WhyBfiPage } from "@/components/why-bfi-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID, localeAlternates } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";
import { getWhyBfiPage } from "@/lib/payload";
import { ui } from "@/lib/ui-strings";

const PATH = "/why-bfi";
const LOCALE = "gu" as const;
const t = (s: string) => ui(s, LOCALE);

export async function generateMetadata(): Promise<Metadata> {
  const data = await getWhyBfiPage();
  const title = t(data.metaTitle || "Why Choose Bavishi Fertility Institute | Best IVF Clinic in India");
  const description = t(
    data.metaDescription ||
      "25+ years of pioneering IVF in India. 30,000+ successful pregnancies. Class 1000 labs, OHSS-free clinic, ethical practice — discover why families trust Bavishi Fertility Institute.",
  );
  return withPageSeoOverride(PATH, {
    title,
    description,
    alternates: localeAlternates(PATH),
    openGraph: {
      title: data.ogTitle ? t(data.ogTitle) : title,
      description: t(
        data.ogDescription ||
          "Pioneers of IVF since 1998. 30,000+ successful pregnancies, 14 centres across India. Ethical, transparent, and affordable fertility care.",
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
    name: t("Why Choose Bavishi Fertility Institute"),
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  },
  breadcrumbSchema([
    { name: t("Home"), url: "/" },
    { name: t("Why BFI"), url: PATH },
  ]),
];

export default async function Page() {
  const data = await getWhyBfiPage();
  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={PATH} />
      <WhyBfiPage data={data} locale={LOCALE} />
    </>
  );
}
