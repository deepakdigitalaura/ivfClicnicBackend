import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { erectileDysfunction, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: erectileDysfunction.meta.title,
  description: erectileDysfunction.meta.description,
  alternates: { canonical: erectileDysfunction.href },
  openGraph: {
    title: erectileDysfunction.meta.title,
    description: erectileDysfunction.meta.description,
    url: erectileDysfunction.href,
    type: "article",
    images: [erectileDysfunction.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(erectileDysfunction)} />
      <TreatmentPage slug={erectileDysfunction.slug} />
    </>
  );
}
