import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { fibroids, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: fibroids.meta.title,
  description: fibroids.meta.description,
  alternates: { canonical: fibroids.href },
  openGraph: {
    title: fibroids.meta.title,
    description: fibroids.meta.description,
    url: fibroids.href,
    type: "article",
    images: [fibroids.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(fibroids)} />
      <TreatmentPage slug={fibroids.slug} />
    </>
  );
}
