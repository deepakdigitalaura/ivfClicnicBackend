import type { Metadata } from "next";
import { MaleInfertilityHub } from "./hub";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { withPageSeoOverride } from "@/lib/page-seo";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/seo";
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
      {/* Every other treatment and service page carries a breadcrumb through
          treatmentGraph(); these hubs are hand-built routes and were missed. */}
      <JsonLd graph={[breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Treatments", url: "/treatments" },
          { name: "Male Infertility", url: "/treatments/male-infertility" },
      ])]} />
      <PageSeoSchema path={PATH} />
      <MaleInfertilityHub data={data} />
    </>
  );
}
