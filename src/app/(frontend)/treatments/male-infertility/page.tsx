import type { Metadata } from "next";
import { MaleInfertilityHub } from "./hub";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { withPageSeoOverride } from "@/lib/page-seo";
import { getCategoryHub } from "@/lib/payload";

const PATH = "/treatments/male-infertility";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCategoryHub("male-infertility");
  const title = data.metaTitle || "Male Infertility Treatments — Expert Care for Every Cause";
  const description = data.metaDescription ||
    "Comprehensive diagnosis and treatment for male infertility — low sperm count, motility issues, azoospermia, varicocele, and more. 30+ years of expertise at Bavishi Fertility Institute.";
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
  const data = await getCategoryHub("male-infertility");
  return (
    <>
      <PageSeoSchema path={PATH} />
      <MaleInfertilityHub data={data} />
    </>
  );
}
