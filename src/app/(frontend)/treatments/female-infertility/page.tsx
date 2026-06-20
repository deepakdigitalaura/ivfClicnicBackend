import type { Metadata } from "next";
import { FemaleInfertilityHub } from "./hub";

export const metadata: Metadata = {
  title: "Female Infertility Treatments — Personalised Pathways to Motherhood",
  description:
    "Specialised treatment for PCOS, endometriosis, low ovarian reserve, fibroids, and more. Personalised fertility pathways by Bavishi Fertility Institute's expert gynaecologists.",
  alternates: { canonical: "/treatments/female-infertility" },
  openGraph: {
    title: "Female Infertility Treatments — Bavishi Fertility Institute",
    description:
      "Specialised treatment for PCOS, endometriosis, low ovarian reserve, fibroids, and more.",
    url: "/treatments/female-infertility",
    type: "website",
  },
};

export default function Page() {
  return <FemaleInfertilityHub />;
}
