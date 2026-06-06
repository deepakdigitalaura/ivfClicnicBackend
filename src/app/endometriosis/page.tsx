import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { endometriosis, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: endometriosis.meta.title,
  description: endometriosis.meta.description,
  alternates: { canonical: endometriosis.href },
  openGraph: {
    title: endometriosis.meta.title,
    description: endometriosis.meta.description,
    url: endometriosis.href,
    type: "article",
    images: [endometriosis.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(endometriosis)} />
      <TreatmentPage slug={endometriosis.slug} />
    </>
  );
}
