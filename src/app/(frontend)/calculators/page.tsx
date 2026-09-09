import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { SiteHeader } from "@/components/site-header";
import { Footer, Calculators } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { breadcrumbSchema, abs } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";

const URL = "/calculators";

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(URL, {
    title: "Fertility Calculators — Free Tools by Our Experts | Bavishi Fertility Institute",
    description:
      "Free, science-backed fertility calculators — IVF success rate, IVF cost, ovulation, fertile period, AMH level, semen analysis, natural pregnancy and miscarriage risk.",
    alternates: { canonical: URL },
    openGraph: {
      title: "Fertility Calculators — Bavishi Fertility Institute",
      description: "Practical, science-backed tools to help you understand your fertility — privately and instantly.",
      url: abs(URL),
      type: "website",
    },
  });
}

export default function Page() {
  const graph = [
    {
      "@type": "CollectionPage",
      "@id": `${abs(URL)}#webpage`,
      url: abs(URL),
      name: "Fertility Calculators",
    },
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Calculators", url: URL },
    ]),
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={URL} />
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />

        <div className="border-b border-border/60 bg-[color:var(--ivory)]">
          <nav className="container-px mx-auto flex max-w-[1400px] items-center gap-2 py-3 text-xs text-muted-foreground" aria-label="Breadcrumb">
            <a href="/" className="hover:text-[color:var(--rose)]">Home</a>
            <span>/</span>
            <span className="font-medium text-[color:var(--plum)]">Calculators</span>
          </nav>
        </div>

        <Calculators />

        <Footer />
        <FloatingCTA />
        <ScrollToTop />
        <MobileBottomBar />
      </div>
    </>
  );
}
