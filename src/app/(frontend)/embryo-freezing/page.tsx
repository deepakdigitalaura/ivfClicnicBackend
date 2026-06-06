import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { embryoFreezing, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: embryoFreezing.meta.title,
  description: embryoFreezing.meta.description,
  alternates: { canonical: embryoFreezing.href },
  openGraph: {
    title: embryoFreezing.meta.title,
    description: embryoFreezing.meta.description,
    url: embryoFreezing.href,
    type: "article",
    images: [embryoFreezing.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(embryoFreezing)} />
      <TreatmentPage slug={embryoFreezing.slug} />
    </>
  );
}
