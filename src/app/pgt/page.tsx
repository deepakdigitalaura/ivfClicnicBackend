import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { pgt, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: pgt.meta.title,
  description: pgt.meta.description,
  alternates: { canonical: pgt.href },
  openGraph: {
    title: pgt.meta.title,
    description: pgt.meta.description,
    url: pgt.href,
    type: "article",
    images: [pgt.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(pgt)} />
      <TreatmentPage slug={pgt.slug} />
    </>
  );
}
