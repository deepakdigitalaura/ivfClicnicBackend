import type { Metadata } from "next";
import { EducationVideosPage } from "@/components/education-videos-page";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { getEducationVideos } from "@/lib/payload";

const PATH = "/education-videos";

export const metadata: Metadata = {
  title: "Fertility Education Videos — IVF, PCOS, Male Infertility & More | Bavishi Fertility Institute",
  description:
    "Watch expert fertility education videos from Bavishi Fertility Institute specialists. Topics include IVF, egg freezing, male infertility, embryo transfer, and more.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Fertility Education Videos — Bavishi Fertility Institute",
    description:
      "Expert fertility education from BFI specialists — IVF, PCOS, sperm count, egg freezing, embryo transfer and more.",
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
    name: "Fertility Education Videos — Bavishi Fertility Institute",
    description: "Expert fertility education videos by Bavishi Fertility Institute specialists.",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  },
  breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Resources", url: "/#resources" },
    { name: "Education Videos", url: PATH },
  ]),
];

export default async function Page() {
  const videos = await getEducationVideos();
  return (
    <>
      <JsonLd graph={graph} />
      <EducationVideosPage videos={videos} />
    </>
  );
}
