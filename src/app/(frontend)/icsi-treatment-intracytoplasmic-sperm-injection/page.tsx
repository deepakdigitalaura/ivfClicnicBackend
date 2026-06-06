import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { icsi, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: icsi.meta.title,
  description: icsi.meta.description,
  alternates: { canonical: icsi.href },
  openGraph: {
    title: icsi.meta.title,
    description: icsi.meta.description,
    url: icsi.href,
    type: "article",
    images: [icsi.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(icsi)} />
      <TreatmentPage slug={icsi.slug} />
    </>
  );
}
