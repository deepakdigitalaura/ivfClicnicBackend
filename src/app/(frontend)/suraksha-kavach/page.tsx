import type { Metadata } from "next";
import { SurakshaKavachPage } from "@/components/suraksha-kavach-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, faqSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";

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

const graph = [
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
  faqSchema([
    {
      q: "What is the Suraksha Kavach Package?",
      a: "Suraksha Kavach is Bavishi Fertility Institute's exclusive IVF protection program — the only one of its kind in the world. Multiple IVF cycles are covered under a single package.",
    },
    {
      q: "Who is eligible for Suraksha Kavach?",
      a: "Eligibility is determined after an initial consultation and medical evaluation by our senior fertility specialists. Factors such as age, medical history, ovarian reserve, and overall health are assessed.",
    },
    {
      q: "How many IVF cycles are included?",
      a: "The Suraksha Kavach package covers multiple IVF/ICSI cycles as needed. The program continues until a healthy live birth is achieved or all agreed-upon cycles are completed.",
    },
    {
      q: "What happens if the treatment is not successful for me?",
      a: "If medical reasons prevent your treatment from succeeding, our team will discuss the best next steps and options available to you as part of your Suraksha Kavach enrolment.",
    },
    {
      q: "What does the package include?",
      a: "The package includes consultations, diagnostics, medications, ovarian stimulation, egg retrieval, ICSI/IVF procedure, embryology, embryo transfer, and post-treatment support. No hidden charges.",
    },
    {
      q: "What kind of results has Suraksha Kavach achieved?",
      a: "Suraksha Kavach patients at Bavishi Fertility Institute have achieved excellent outcomes. We are transparent about our results and can share detailed statistics during your consultation — success depends on individual factors such as age, diagnosis and medical history.",
    },
    {
      q: "How do I enrol in Suraksha Kavach?",
      a: "Book a consultation at any of our 15 centres across India. After your initial evaluation, if eligible, our team will walk you through the enrolment process and package details.",
    },
  ]),
];

export default function Page() {
  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={PATH} />
      <SurakshaKavachPage />
    </>
  );
}
