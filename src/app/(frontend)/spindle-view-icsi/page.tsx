import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { spindleViewIcsi, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: spindleViewIcsi.meta.title,
  description: spindleViewIcsi.meta.description,
  alternates: { canonical: spindleViewIcsi.href },
  openGraph: {
    title: spindleViewIcsi.meta.title,
    description: spindleViewIcsi.meta.description,
    url: spindleViewIcsi.href,
    type: "article",
    images: [spindleViewIcsi.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(spindleViewIcsi)} />
      <TreatmentPage slug={spindleViewIcsi.slug} />
    </>
  );
}
