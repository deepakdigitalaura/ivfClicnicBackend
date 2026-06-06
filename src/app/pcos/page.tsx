import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { pcos, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: pcos.meta.title,
  description: pcos.meta.description,
  alternates: { canonical: pcos.href },
  openGraph: {
    title: pcos.meta.title,
    description: pcos.meta.description,
    url: pcos.href,
    type: "article",
    images: [pcos.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(pcos)} />
      <TreatmentPage slug={pcos.slug} />
    </>
  );
}
