import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { ivf, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: ivf.meta.title,
  description: ivf.meta.description,
  alternates: { canonical: ivf.href },
  openGraph: {
    title: "IVF Treatment — In Vitro Fertilization at Bavishi Fertility Institute",
    description:
      "How IVF works, step by step. India's trusted IVF specialists since 1984 — 30,000+ successful pregnancies, Class 1000 IVF labs, Suraksha Kavach assurance.",
    url: ivf.href,
    type: "article",
    images: [ivf.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(ivf)} />
      <TreatmentPage slug={ivf.slug} />
    </>
  );
}
