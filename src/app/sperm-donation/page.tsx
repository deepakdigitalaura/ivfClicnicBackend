import type { Metadata } from "next";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { spermDonation, treatmentGraph } from "@/lib/treatments";

export const metadata: Metadata = {
  title: spermDonation.meta.title,
  description: spermDonation.meta.description,
  alternates: { canonical: spermDonation.href },
  openGraph: {
    title: "Donor Sperm Treatment (Sperm Donation) at Bavishi Fertility Institute",
    description:
      "How donor sperm is used in IUI and IVF–ICSI, who needs it, and how donors are screened. Large screened donor pool, no waiting, trusted since 1984.",
    url: spermDonation.href,
    type: "article",
    images: [spermDonation.meta.ogImage],
  },
};

export default function Page() {
  return (
    <>
      <JsonLd graph={treatmentGraph(spermDonation)} />
      <TreatmentPage slug={spermDonation.slug} />
    </>
  );
}
