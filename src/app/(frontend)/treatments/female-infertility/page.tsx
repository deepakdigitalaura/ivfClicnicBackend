import type { Metadata } from "next";
import { FemaleInfertilityHub } from "./hub";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { withPageSeoOverride } from "@/lib/page-seo";

const PATH = "/treatments/female-infertility";

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(PATH, {
    title: "Female Infertility Treatments — Personalised Pathways to Motherhood",
    description:
      "Specialised treatment for PCOS, endometriosis, low ovarian reserve, fibroids, and more. Personalised fertility pathways by Bavishi Fertility Institute's expert gynaecologists.",
    alternates: { canonical: PATH },
    openGraph: {
      title: "Female Infertility Treatments — Bavishi Fertility Institute",
      description:
        "Specialised treatment for PCOS, endometriosis, low ovarian reserve, fibroids, and more.",
      url: PATH,
      type: "website",
    },
  });
}

export default function Page() {
  return (
    <>
      <PageSeoSchema path={PATH} />
      <FemaleInfertilityHub />
    </>
  );
}
