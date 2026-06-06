import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { ovarianReserve, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: ovarianReserve.meta.title,
  description: ovarianReserve.meta.description,
  alternates: { canonical: ovarianReserve.href },
  openGraph: {
    title: ovarianReserve.meta.title,
    description: ovarianReserve.meta.description,
    url: ovarianReserve.href,
    type: "article",
    images: [ovarianReserve.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(ovarianReserve)} />
      <TreatmentPage slug={ovarianReserve.slug} />
    </>
  );
}
