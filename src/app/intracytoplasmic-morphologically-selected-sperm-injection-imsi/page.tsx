import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { imsi, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: imsi.meta.title,
  description: imsi.meta.description,
  alternates: { canonical: imsi.href },
  openGraph: {
    title: imsi.meta.title,
    description: imsi.meta.description,
    url: imsi.href,
    type: "article",
    images: [imsi.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(imsi)} />
      <TreatmentPage slug={imsi.slug} />
    </>
  );
}
