import type { Metadata } from "next";
import { CampsPage } from "@/components/camps-page";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, abs, ORG_ID, WEBSITE_ID } from "@/lib/seo";
import { getGlobalSafe } from "@/lib/payload";
import type { EventPoster } from "@/lib/homepage";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage";

const PATH = "/camps";

export const metadata: Metadata = {
  title: "Fertility Camps & Outreach Events — Bavishi Fertility Institute",
  description:
    "Bavishi Fertility Institute organises free fertility camps and outreach events across India. Find upcoming camps near you and register your interest.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Fertility Camps & Outreach Events — Bavishi Fertility Institute",
    description:
      "Free fertility camps by BFI specialists across India. Expert consultations, awareness sessions and priority follow-up support.",
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
    name: "Fertility Camps & Outreach Events — Bavishi Fertility Institute",
    description: "Free fertility camps and outreach events organised by Bavishi Fertility Institute across India.",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  },
  breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Resources", url: "/#resources" },
    { name: "Camps", url: PATH },
  ]),
];

export default async function Page() {
  const homepage = await getGlobalSafe("homepage");
  const rawPosters = homepage?.events?.posters;
  const posters: EventPoster[] = Array.isArray(rawPosters) && rawPosters.length
    ? rawPosters
        .filter((p): p is { src: string; alt: string } => !!p?.src)
        .map((p) => ({ src: p.src, alt: p.alt ?? "" }))
    : HOMEPAGE_DEFAULTS.events.posters;

  return (
    <>
      <JsonLd graph={graph} />
      <CampsPage posters={posters} />
    </>
  );
}
