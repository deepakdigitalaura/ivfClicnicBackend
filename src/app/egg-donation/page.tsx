import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { eggDonation, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: eggDonation.meta.title,
  description: eggDonation.meta.description,
  alternates: { canonical: eggDonation.href },
  openGraph: {
    title: "Egg Donation Treatment — Oocyte Donation at Bavishi Fertility Institute",
    description:
      "How egg donation works, who needs it, and how donors are screened. Young screened donors, Class 1000 IVF labs, trusted fertility specialists since 1984.",
    url: eggDonation.href,
    type: "article",
    images: [eggDonation.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(eggDonation)} />
      <TreatmentPage slug={eggDonation.slug} />
    </>
  );
}
