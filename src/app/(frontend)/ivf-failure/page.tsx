import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { ivfFailure, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: ivfFailure.meta.title,
  description: ivfFailure.meta.description,
  alternates: { canonical: ivfFailure.href },
  openGraph: {
    title: ivfFailure.meta.title,
    description: ivfFailure.meta.description,
    url: ivfFailure.href,
    type: "article",
    images: [ivfFailure.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(ivfFailure)} />
      <TreatmentPage slug={ivfFailure.slug} />
    </>
  );
}
