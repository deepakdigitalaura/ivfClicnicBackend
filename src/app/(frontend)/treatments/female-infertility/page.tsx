import type { Metadata } from "next";
import { FemaleInfertilityHub } from "./hub";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { withPageSeoOverride } from "@/lib/page-seo";
import { getCategoryHub } from "@/lib/payload";

const PATH = "/treatments/female-infertility";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCategoryHub("female-infertility");
  const title = data.metaTitle || "Female Infertility Treatments — Personalised Pathways to Motherhood";
  const description = data.metaDescription ||
    "Specialised treatment for PCOS, endometriosis, low ovarian reserve, fibroids, and more. Personalised fertility pathways by Bavishi Fertility Institute's expert gynaecologists.";
  return withPageSeoOverride(PATH, {
    title,
    description,
    alternates: { canonical: PATH },
    openGraph: {
      title: data.ogTitle || title,
      description: data.ogDescription || description,
      url: PATH,
      type: "website",
    },
  });
}

export default async function Page() {
  const data = await getCategoryHub("female-infertility");
  return (
    <>
      <PageSeoSchema path={PATH} />
      <FemaleInfertilityHub data={data} />
    </>
  );
}
