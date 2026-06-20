import type { Metadata } from "next";
import { SurakshaKavachPage } from "@/components/suraksha-kavach-page";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, faqSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";

const PATH = "/suraksha-kavach";

export const metadata: Metadata = {
  title: "Suraksha Kavach — India's Only IVF Protection Program | Bavishi Fertility Institute",
  description:
    "Suraksha Kavach promises at least one healthy baby from your investment. 98% success rate. Multiple IVF cycles covered. Fully transferable package — only at Bavishi Fertility Institute.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Suraksha Kavach — India's Only IVF Protection Program | Bavishi Fertility Institute",
    description:
      "At least one healthy baby, guaranteed. 98% success rate. Multiple IVF cycles. Fully transferable package. India's most trusted IVF protection program.",
    url: abs(PATH),
    type: "website",
    images: ["/assets/suraksha-parenthood.png"],
  },
};

const graph = [
  {
    "@type": "WebPage",
    "@id": `${abs(PATH)}#webpage`,
    url: abs(PATH),
    name: "Suraksha Kavach — India's Only IVF Protection Program",
    description:
      "Suraksha Kavach promises at least one healthy baby from your investment. 98% success rate across Bavishi Fertility Institute centres. Fully transferable package.",
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
      a: "Suraksha Kavach is Bavishi Fertility Institute's exclusive IVF protection program — the only one of its kind in the world. It promises at least one healthy baby from your investment. Multiple IVF cycles are covered, and if medical circumstances prevent your success, the package is fully transferable to someone you know.",
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
      a: "If medical reasons prevent your treatment from succeeding, your Suraksha Kavach package can be transferred to a family member, friend, or loved one. Your investment always results in the gift of life.",
    },
    {
      q: "What does the package include?",
      a: "The package includes consultations, diagnostics, medications, ovarian stimulation, egg retrieval, ICSI/IVF procedure, embryology, embryo transfer, pregnancy monitoring, and post-treatment support. No hidden charges.",
    },
    {
      q: "Is the 98% success rate real?",
      a: "Yes. 98% of couples who opted for the Suraksha Kavach package at Bavishi Fertility Institute have achieved a healthy live-born child — one of the highest documented success rates for any IVF program in India.",
    },
    {
      q: "How do I enrol in Suraksha Kavach?",
      a: "Book a free consultation at any of our 15 centres across India. After your initial evaluation, if eligible, our team will walk you through the enrolment process and package details.",
    },
    {
      q: "Can I transfer my package to someone else?",
      a: "Yes. If your treatment journey doesn't lead to success due to medical reasons, the Suraksha Kavach package is fully transferable to a family member, friend, or anyone who could benefit from fertility treatment at Bavishi Fertility Institute.",
    },
  ]),
];

export default function Page() {
  return (
    <>
      <JsonLd graph={graph} />
      <SurakshaKavachPage />
    </>
  );
}
