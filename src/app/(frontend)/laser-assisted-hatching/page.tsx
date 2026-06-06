import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { laserHatching, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: laserHatching.meta.title,
  description: laserHatching.meta.description,
  alternates: { canonical: laserHatching.href },
  openGraph: {
    title: laserHatching.meta.title,
    description: laserHatching.meta.description,
    url: laserHatching.href,
    type: "article",
    images: [laserHatching.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(laserHatching)} />
      <TreatmentPage slug={laserHatching.slug} />
    </>
  );
}
