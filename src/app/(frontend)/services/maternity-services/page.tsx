import type { Metadata } from "next";
import { MaternityServicesHub } from "./hub";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { withPageSeoOverride } from "@/lib/page-seo";

const PATH = "/services/maternity-services";

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(PATH, {
    title: "Maternity Services — Safe, Caring Pregnancy & Delivery",
    description:
      "Comprehensive maternity care at Bavishi Fertility & Birthing — painless delivery, normal delivery, fetal medicine, high-risk pregnancy care, twin pregnancy care, and 3D/4D sonography.",
    alternates: { canonical: PATH },
    openGraph: {
      title: "Maternity Services — Bavishi Fertility & Birthing",
      description:
        "Comprehensive maternity care — painless delivery, normal delivery, fetal medicine, high-risk pregnancy care, and more.",
      url: PATH,
      type: "website",
    },
  });
}

export default function Page() {
  return (
    <>
      <PageSeoSchema path={PATH} />
      <MaternityServicesHub />
    </>
  );
}
