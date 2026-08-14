import type { Metadata } from "next";
import { SurakshaKavachPage } from "@/components/suraksha-kavach-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, faqSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";
import { getPageFaqs } from "@/sanity/lib/fetch";
import { DEFAULT_FAQS } from "@/lib/suraksha-kavach-faqs";

const PATH = "/suraksha-kavach";

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(PATH, {
    title: "Suraksha Kavach — India's Only IVF Protection Program | Bavishi Fertility Institute",
    description:
      "Suraksha Kavach — India's only IVF protection program. Multiple IVF cycles covered. Complete financial peace of mind — only at Bavishi Fertility Institute.",
    alternates: { canonical: PATH },
    openGraph: {
      title: "Suraksha Kavach — India's Only IVF Protection Program | Bavishi Fertility Institute",
      description:
        "India's only IVF protection program. Multiple IVF cycles covered. Complete financial peace of mind at Bavishi Fertility Institute.",
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
      name: "Suraksha Kavach — India's Only IVF Protection Program",
      description:
        "Suraksha Kavach — India's only IVF protection program. Multiple IVF cycles covered at Bavishi Fertility Institute.",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
    },
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Suraksha Kavach", url: PATH },
    ]),
    faqSchema(faqs),
  ];
}

export default async function Page() {
  const faqs = (await getPageFaqs("suraksha-kavach")) ?? DEFAULT_FAQS;
  return (
    <>
      <JsonLd graph={buildGraph(faqs)} />
      <PageSeoSchema path={PATH} />
      <SurakshaKavachPage faqs={faqs} />
    </>
  );
}
