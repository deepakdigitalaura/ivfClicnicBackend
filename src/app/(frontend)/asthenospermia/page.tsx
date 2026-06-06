import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { asthenospermia, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: asthenospermia.meta.title,
  description: asthenospermia.meta.description,
  alternates: { canonical: asthenospermia.href },
  openGraph: {
    title: asthenospermia.meta.title,
    description: asthenospermia.meta.description,
    url: asthenospermia.href,
    type: "article",
    images: [asthenospermia.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(asthenospermia)} />
      <TreatmentPage slug={asthenospermia.slug} />
    </>
  );
}
