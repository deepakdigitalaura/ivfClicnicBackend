import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { ovarianRejuvenation, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: ovarianRejuvenation.meta.title,
  description: ovarianRejuvenation.meta.description,
  alternates: { canonical: ovarianRejuvenation.href },
  openGraph: {
    title: ovarianRejuvenation.meta.title,
    description: ovarianRejuvenation.meta.description,
    url: ovarianRejuvenation.href,
    type: "article",
    images: [ovarianRejuvenation.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(ovarianRejuvenation)} />
      <TreatmentPage slug={ovarianRejuvenation.slug} />
    </>
  );
}
