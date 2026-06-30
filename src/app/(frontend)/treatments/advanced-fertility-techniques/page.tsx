import type { Metadata } from "next";
import { AdvancedFertilityHub } from "./hub";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { withPageSeoOverride } from "@/lib/page-seo";

const PATH = "/treatments/advanced-fertility-techniques";

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(PATH, {
    title: "Advanced Fertility Techniques — IVF, ICSI, IUI & More",
    description:
      "Explore advanced assisted reproduction at Bavishi Fertility Institute — IVF, ICSI, IUI, PICSI, IMSI, donor services, cryopreservation, and more. 30,000+ successful pregnancies.",
    alternates: { canonical: PATH },
    openGraph: {
      title: "Advanced Fertility Techniques — Bavishi Fertility Institute",
      description:
        "Explore advanced assisted reproduction — IVF, ICSI, IUI, PICSI, IMSI, donor services, cryopreservation, and more.",
      url: PATH,
      type: "website",
    },
  });
}

export default function Page() {
  return (
    <>
      <PageSeoSchema path={PATH} />
      <AdvancedFertilityHub />
    </>
  );
}
