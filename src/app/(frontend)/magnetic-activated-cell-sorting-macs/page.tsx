import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { macs, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: macs.meta.title,
  description: macs.meta.description,
  alternates: { canonical: macs.href },
  openGraph: {
    title: macs.meta.title,
    description: macs.meta.description,
    url: macs.href,
    type: "article",
    images: [macs.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(macs)} />
      <TreatmentPage slug={macs.slug} />
    </>
  );
}
