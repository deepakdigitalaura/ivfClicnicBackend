import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { blastocystTransfer, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: blastocystTransfer.meta.title,
  description: blastocystTransfer.meta.description,
  alternates: { canonical: blastocystTransfer.href },
  openGraph: {
    title: blastocystTransfer.meta.title,
    description: blastocystTransfer.meta.description,
    url: blastocystTransfer.href,
    type: "article",
    images: [blastocystTransfer.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(blastocystTransfer)} />
      <TreatmentPage slug={blastocystTransfer.slug} />
    </>
  );
}
