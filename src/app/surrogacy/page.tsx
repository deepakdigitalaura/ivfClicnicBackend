import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { surrogacy, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: surrogacy.meta.title,
  description: surrogacy.meta.description,
  alternates: { canonical: surrogacy.href },
  openGraph: {
    title: surrogacy.meta.title,
    description: surrogacy.meta.description,
    url: surrogacy.href,
    type: "article",
    images: [surrogacy.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(surrogacy)} />
      <TreatmentPage slug={surrogacy.slug} />
    </>
  );
}
