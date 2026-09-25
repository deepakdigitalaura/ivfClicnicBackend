import type { Metadata } from "next";
import { DoctorsIndex } from "@/components/doctor-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { physicianSchema } from "@/lib/doctors";
import { getDoctors } from "@/lib/payload";
import { ui } from "@/lib/ui-strings";
import { breadcrumbSchema, abs, localeAlternates } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";

export const revalidate = 3600;

const URL = "/doctors";
const LOCALE = "hi" as const;
const t = (s: string) => ui(s, LOCALE);

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(URL, {
    title: t("Our Fertility Specialists — Doctors at Bavishi Fertility Institute"),
    description: t("Meet the credentialed fertility specialists at Bavishi Fertility Institute — IVF, ICSI, andrology and reproductive surgery experts caring for families across India since 1998."),
    alternates: localeAlternates(URL),
    openGraph: {
      title: t("Our Fertility Specialists — Bavishi Fertility Institute"),
      description: t("Credentialed IVF and fertility doctors across India. Meet our promoter doctors and specialists."),
      url: abs(URL),
      type: "website",
    },
  });
}

export default async function Page() {
  const doctors = await getDoctors();
  const graph = [
    {
      "@type": "CollectionPage",
      "@id": `${abs(URL)}#webpage`,
      url: abs(URL),
      name: t("Our Fertility Specialists"),
      hasPart: doctors.map((d) => ({ "@id": `${abs(`/doctors/${d.slug}`)}#physician` })),
    },
    breadcrumbSchema([
      { name: t("Home"), url: "/" },
      { name: t("Doctors"), url: URL },
    ]),
    ...doctors.map((d) => physicianSchema(d)),
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={URL} />
      <DoctorsIndex doctors={doctors} locale={LOCALE} />
    </>
  );
}
