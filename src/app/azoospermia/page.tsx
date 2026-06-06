import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { azoospermia, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: azoospermia.meta.title,
  description: azoospermia.meta.description,
  alternates: { canonical: azoospermia.href },
  openGraph: {
    title: azoospermia.meta.title,
    description: azoospermia.meta.description,
    url: azoospermia.href,
    type: "article",
    images: [azoospermia.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(azoospermia)} />
      <TreatmentPage slug={azoospermia.slug} />
    </>
  );
}
