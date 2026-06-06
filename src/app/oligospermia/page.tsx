import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { oligospermia, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: oligospermia.meta.title,
  description: oligospermia.meta.description,
  alternates: { canonical: oligospermia.href },
  openGraph: {
    title: oligospermia.meta.title,
    description: oligospermia.meta.description,
    url: oligospermia.href,
    type: "article",
    images: [oligospermia.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(oligospermia)} />
      <TreatmentPage slug={oligospermia.slug} />
    </>
  );
}
