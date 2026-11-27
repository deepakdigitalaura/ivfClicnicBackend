import type { Metadata } from "next";
import { AdvancedFertilityHub } from "./hub";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { withPageSeoOverride } from "@/lib/page-seo";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/seo";
import { getCategoryHub } from "@/lib/payload";

const PATH = "/treatments/advanced-fertility-techniques";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCategoryHub("advanced-fertility-techniques");
  const title = data.metaTitle || "Advanced Fertility Techniques — IVF, ICSI, IUI & More";
  const description = data.metaDescription ||
    "Explore advanced assisted reproduction at Bavishi Fertility Institute — IVF, ICSI, IUI, PICSI, IMSI, donor services, cryopreservation, and more. 30,000+ successful pregnancies.";
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
  const data = await getCategoryHub("advanced-fertility-techniques");
  return (
    <>
      {/* Every other treatment and service page carries a breadcrumb through
          treatmentGraph(); these hubs are hand-built routes and were missed. */}
      <JsonLd graph={[breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Treatments", url: "/treatments" },
          { name: "Advanced Fertility Techniques", url: "/treatments/advanced-fertility-techniques" },
      ])]} />
      <PageSeoSchema path={PATH} />
      <AdvancedFertilityHub data={data} />
    </>
  );
}
