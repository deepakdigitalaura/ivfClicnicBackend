import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { spermFreezing, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: spermFreezing.meta.title,
  description: spermFreezing.meta.description,
  alternates: { canonical: spermFreezing.href },
  openGraph: {
    title: spermFreezing.meta.title,
    description: spermFreezing.meta.description,
    url: spermFreezing.href,
    type: "article",
    images: [spermFreezing.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(spermFreezing)} />
      <TreatmentPage slug={spermFreezing.slug} />
    </>
  );
}
