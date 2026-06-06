import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { ivfEvaluation, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: ivfEvaluation.meta.title,
  description: ivfEvaluation.meta.description,
  alternates: { canonical: ivfEvaluation.href },
  openGraph: {
    title: ivfEvaluation.meta.title,
    description: ivfEvaluation.meta.description,
    url: ivfEvaluation.href,
    type: "article",
    images: [ivfEvaluation.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(ivfEvaluation)} />
      <TreatmentPage slug={ivfEvaluation.slug} />
    </>
  );
}
