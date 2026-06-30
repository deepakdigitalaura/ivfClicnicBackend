import type { Metadata } from "next";
import { MaleInfertilityHub } from "./hub";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { withPageSeoOverride } from "@/lib/page-seo";

const PATH = "/treatments/male-infertility";

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(PATH, {
    title: "Male Infertility Treatments — Expert Care for Every Cause",
    description:
      "Comprehensive diagnosis and treatment for male infertility — low sperm count, motility issues, azoospermia, varicocele, and more. 30+ years of expertise at Bavishi Fertility Institute.",
    alternates: { canonical: PATH },
    openGraph: {
      title: "Male Infertility Treatments — Bavishi Fertility Institute",
      description:
        "Comprehensive diagnosis and treatment for male infertility — low sperm count, motility issues, azoospermia, varicocele, and more.",
      url: PATH,
      type: "website",
    },
  });
}

export default function Page() {
  return (
    <>
      <PageSeoSchema path={PATH} />
      <MaleInfertilityHub />
    </>
  );
}
