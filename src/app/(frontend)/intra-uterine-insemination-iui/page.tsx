import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { iui, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: iui.meta.title,
  description: iui.meta.description,
  alternates: { canonical: iui.href },
  openGraph: {
    title: iui.meta.title,
    description: iui.meta.description,
    url: iui.href,
    type: "article",
    images: [iui.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(iui)} />
      <TreatmentPage slug={iui.slug} />
    </>
  );
}
