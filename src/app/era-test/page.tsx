import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { eraTest, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: eraTest.meta.title,
  description: eraTest.meta.description,
  alternates: { canonical: eraTest.href },
  openGraph: {
    title: eraTest.meta.title,
    description: eraTest.meta.description,
    url: eraTest.href,
    type: "article",
    images: [eraTest.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(eraTest)} />
      <TreatmentPage slug={eraTest.slug} />
    </>
  );
}
