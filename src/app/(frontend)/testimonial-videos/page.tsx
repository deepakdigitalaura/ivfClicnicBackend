import type { Metadata } from "next";
import { TestimonialVideosPage } from "@/components/testimonial-videos-page";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { getTestimonialVideos } from "@/lib/payload";

const PATH = "/testimonial-videos";

export const metadata: Metadata = {
  title: "Patient Testimonial Videos — Real IVF Success Stories | Bavishi Fertility Institute",
  description:
    "Watch real patient testimonials from families who achieved their dream of parenthood at Bavishi Fertility Institute. 30,000+ success stories across India.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Patient Testimonial Videos — Bavishi Fertility Institute",
    description:
      "Real IVF success stories from families who trusted Bavishi Fertility Institute. Hear their journeys in their own words.",
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
    name: "Patient Testimonial Videos — Bavishi Fertility Institute",
    description:
      "Real IVF patient success stories from Bavishi Fertility Institute.",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  },
  breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Resources", url: "/#resources" },
    { name: "Testimonial Videos", url: PATH },
  ]),
];

export default async function Page() {
  const videos = await getTestimonialVideos();
  return (
    <>
      <JsonLd graph={graph} />
      <TestimonialVideosPage videos={videos} />
    </>
  );
}
