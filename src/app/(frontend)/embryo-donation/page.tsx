import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { embryoDonation, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: embryoDonation.meta.title,
  description: embryoDonation.meta.description,
  alternates: { canonical: embryoDonation.href },
  openGraph: {
    title: "Embryo Donation Treatment — Donor Embryos at Bavishi Fertility Institute",
    description:
      "How donor-embryo treatment works when both eggs and sperm are needed, who needs it, and how donors are screened. Trusted fertility specialists since 1984.",
    url: embryoDonation.href,
    type: "article",
    images: [embryoDonation.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(embryoDonation)} />
      <TreatmentPage slug={embryoDonation.slug} />
    </>
  );
}
