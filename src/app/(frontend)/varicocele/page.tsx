import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { varicocele, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: varicocele.meta.title,
  description: varicocele.meta.description,
  alternates: { canonical: varicocele.href },
  openGraph: {
    title: varicocele.meta.title,
    description: varicocele.meta.description,
    url: varicocele.href,
    type: "article",
    images: [varicocele.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(varicocele)} />
      <TreatmentPage slug={varicocele.slug} />
    </>
  );
}
