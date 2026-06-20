import type { Metadata } from "next";
import { MaleInfertilityHub } from "./hub";

export const metadata: Metadata = {
  title: "Male Infertility Treatments — Expert Care for Every Cause",
  description:
    "Comprehensive diagnosis and treatment for male infertility — low sperm count, motility issues, azoospermia, varicocele, and more. 30+ years of expertise at Bavishi Fertility Institute.",
  alternates: { canonical: "/treatments/male-infertility" },
  openGraph: {
    title: "Male Infertility Treatments — Bavishi Fertility Institute",
    description:
      "Comprehensive diagnosis and treatment for male infertility — low sperm count, motility issues, azoospermia, varicocele, and more.",
    url: "/treatments/male-infertility",
    type: "website",
  },
};

export default function Page() {
  return <MaleInfertilityHub />;
}
