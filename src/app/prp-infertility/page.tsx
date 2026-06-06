import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { prpInfertility, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: prpInfertility.meta.title,
  description: prpInfertility.meta.description,
  alternates: { canonical: prpInfertility.href },
  openGraph: {
    title: prpInfertility.meta.title,
    description: prpInfertility.meta.description,
    url: prpInfertility.href,
    type: "article",
    images: [prpInfertility.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(prpInfertility)} />
      <TreatmentPage slug={prpInfertility.slug} />
    </>
  );
}
