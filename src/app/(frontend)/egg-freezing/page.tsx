import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { eggFreezing, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: eggFreezing.meta.title,
  description: eggFreezing.meta.description,
  alternates: { canonical: eggFreezing.href },
  openGraph: {
    title: eggFreezing.meta.title,
    description: eggFreezing.meta.description,
    url: eggFreezing.href,
    type: "article",
    images: [eggFreezing.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(eggFreezing)} />
      <TreatmentPage slug={eggFreezing.slug} />
    </>
  );
}
