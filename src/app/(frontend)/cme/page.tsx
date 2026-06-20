import type { Metadata } from "next";
import { CmePage } from "@/components/cme-page";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { getCMEBlogs } from "@/lib/payload";

const PATH = "/cme";

export const metadata: Metadata = {
  title: "CME — Continuing Medical Education | Bavishi Fertility Institute",
  description:
    "Bavishi Fertility Institute is a FOGSI-recognised centre for fertility training. Explore our CME programmes, seminar reports, and knowledge-sharing events for medical professionals.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "CME — Continuing Medical Education | Bavishi Fertility Institute",
    description:
      "FOGSI-recognised CME programmes, seminars, and knowledge-sharing events for gynaecologists and medical professionals by Bavishi Fertility Institute.",
    url: abs(PATH),
    type: "website",
    images: ["/assets/hero-mother-baby1.png"],
  },
};

const graph = [
  {
    "@type": "WebPage",
    "@id": `${abs(PATH)}#webpage`,
    url: abs(PATH),
    name: "CME — Continuing Medical Education | Bavishi Fertility Institute",
    description:
      "FOGSI-recognised CME training, seminars, and knowledge-sharing events for medical professionals by Bavishi Fertility Institute.",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  },
  breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Resources", url: "/#resources" },
    { name: "CME", url: PATH },
  ]),
];

export default async function Page() {
  const blogs = await getCMEBlogs();
  return (
    <>
      <JsonLd graph={graph} />
      <CmePage blogs={blogs} />
    </>
  );
}
