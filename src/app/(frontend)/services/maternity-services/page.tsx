import type { Metadata } from "next";
import { MaternityServicesHub } from "./hub";

export const metadata: Metadata = {
  title: "Maternity Services — Safe, Caring Pregnancy & Delivery",
  description:
    "Comprehensive maternity care at Bavishi Fertility & Birthing — painless delivery, normal delivery, fetal medicine, high-risk pregnancy care, twin pregnancy care, and 3D/4D sonography.",
  alternates: { canonical: "/services/maternity-services" },
  openGraph: {
    title: "Maternity Services — Bavishi Fertility & Birthing",
    description:
      "Comprehensive maternity care — painless delivery, normal delivery, fetal medicine, high-risk pregnancy care, and more.",
    url: "/services/maternity-services",
    type: "website",
  },
};

export default function Page() {
  return <MaternityServicesHub />;
}
