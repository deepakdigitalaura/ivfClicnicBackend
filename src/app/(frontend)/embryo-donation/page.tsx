import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { treatmentGraph } from "@/lib/treatments";
import { getTreatment } from "@/lib/payload";

const SLUG = "embryo-donation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTreatment(SLUG);
  if (!t) return {};
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: { canonical: t.href },
    openGraph: {
      title: "Embryo Donation Treatment — Donor Embryos at Bavishi Fertility Institute",
      description:
        "How donor-embryo treatment works when both eggs and sperm are needed, who needs it, and how donors are screened. Trusted fertility specialists since 1984.",
      url: t.href,
      type: "article",
      images: [t.meta.ogImage],
    },
  };
}

export default async function Page() {
  const t = await getTreatment(SLUG);
  if (!t) notFound();
  return (
    <>
      <JsonLd graph={treatmentGraph(t)} />
      <TreatmentPage content={t} />
    </>
  );
}
