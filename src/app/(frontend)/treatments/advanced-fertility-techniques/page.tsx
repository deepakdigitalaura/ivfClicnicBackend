import type { Metadata } from "next";
import { AdvancedFertilityHub } from "./hub";

export const metadata: Metadata = {
  title: "Advanced Fertility Techniques — IVF, ICSI, IUI & More",
  description:
    "Explore advanced assisted reproduction at Bavishi Fertility Institute — IVF, ICSI, IUI, PICSI, IMSI, donor services, cryopreservation, and more. 30,000+ successful pregnancies.",
  alternates: { canonical: "/treatments/advanced-fertility-techniques" },
  openGraph: {
    title: "Advanced Fertility Techniques — Bavishi Fertility Institute",
    description:
      "Explore advanced assisted reproduction — IVF, ICSI, IUI, PICSI, IMSI, donor services, cryopreservation, and more.",
    url: "/treatments/advanced-fertility-techniques",
    type: "website",
  },
};

export default function Page() {
  return <AdvancedFertilityHub />;
}
