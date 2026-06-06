import type { Metadata } from "next";
import { DoctorsIndex } from "@/components/doctor-page";
import { JsonLd } from "@/components/json-ld";
import { DOCTORS, physicianSchema } from "@/lib/doctors";
import { breadcrumbSchema, abs } from "@/lib/seo";

const URL = "/doctors";

export const metadata: Metadata = {
  title: "Our Fertility Specialists — Doctors at Bavishi Fertility Institute",
  description:
    "Meet the credentialed fertility specialists at Bavishi Fertility Institute — IVF, ICSI, andrology and reproductive surgery experts caring for families across India since 1984.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Our Fertility Specialists — Bavishi Fertility Institute",
    description: "Credentialed IVF and fertility doctors across India. Meet our promoter doctors and specialists.",
    url: abs(URL),
    type: "website",
  },
};

const graph = [
  {
    "@type": "CollectionPage",
    "@id": `${abs(URL)}#webpage`,
    url: abs(URL),
    name: "Our Fertility Specialists",
    hasPart: DOCTORS.map((d) => ({ "@id": `${abs(`/doctors/${d.slug}`)}#physician` })),
  },
  breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Doctors", url: URL },
  ]),
  ...DOCTORS.map((d) => physicianSchema(d)),
];

export default function Page() {
  return (
    <>
      <JsonLd graph={graph} />
      <DoctorsIndex />
    </>
  );
}
