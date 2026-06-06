import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { cryopreservation, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: cryopreservation.meta.title,
  description: cryopreservation.meta.description,
  alternates: { canonical: cryopreservation.href },
  openGraph: {
    title: cryopreservation.meta.title,
    description: cryopreservation.meta.description,
    url: cryopreservation.href,
    type: "article",
    images: [cryopreservation.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(cryopreservation)} />
      <TreatmentPage slug={cryopreservation.slug} />
    </>
  );
}
