import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { picsi, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: picsi.meta.title,
  description: picsi.meta.description,
  alternates: { canonical: picsi.href },
  openGraph: {
    title: picsi.meta.title,
    description: picsi.meta.description,
    url: picsi.href,
    type: "article",
    images: [picsi.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(picsi)} />
      <TreatmentPage slug={picsi.slug} />
    </>
  );
}
