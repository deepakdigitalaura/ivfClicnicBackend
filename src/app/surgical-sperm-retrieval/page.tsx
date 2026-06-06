import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { surgicalSpermRetrieval, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: surgicalSpermRetrieval.meta.title,
  description: surgicalSpermRetrieval.meta.description,
  alternates: { canonical: surgicalSpermRetrieval.href },
  openGraph: {
    title: surgicalSpermRetrieval.meta.title,
    description: surgicalSpermRetrieval.meta.description,
    url: surgicalSpermRetrieval.href,
    type: "article",
    images: [surgicalSpermRetrieval.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(surgicalSpermRetrieval)} />
      <TreatmentPage slug={surgicalSpermRetrieval.slug} />
    </>
  );
}
