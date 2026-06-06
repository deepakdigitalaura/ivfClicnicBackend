import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { conceiveNaturally, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: conceiveNaturally.meta.title,
  description: conceiveNaturally.meta.description,
  alternates: { canonical: conceiveNaturally.href },
  openGraph: {
    title: conceiveNaturally.meta.title,
    description: conceiveNaturally.meta.description,
    url: conceiveNaturally.href,
    type: "article",
    images: [conceiveNaturally.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(conceiveNaturally)} />
      <TreatmentPage slug={conceiveNaturally.slug} />
    </>
  );
}
