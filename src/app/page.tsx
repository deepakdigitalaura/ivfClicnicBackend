import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";

const HERO_IMG = "/assets/hero-mother-baby1.png";

export const metadata: Metadata = {
  title: "Bavishi Fertility Centre — India's Trusted IVF Experts for 40+ Years",
  description:
    "Premium fertility care across 15 centres in India. 30,000+ successful pregnancies, advanced IVF, ICSI, IUI, and personalised treatment plans by leading specialists.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Bavishi Fertility Centre — India's Trusted IVF Experts",
    description:
      "30,000+ pregnancies. 40+ years of legacy. 15 centres. Personalised, transparent and compassionate fertility care.",
    type: "website",
    images: [HERO_IMG],
  },
};

export default function Page() {
  return <HomePage />;
}
