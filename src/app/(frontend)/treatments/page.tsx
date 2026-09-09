import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/home-page";
import { TreatmentsGrid } from "@/components/treatments-grid";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { SectionHead } from "@/components/ivf-page";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage";
import { breadcrumbSchema, abs } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";

const URL = "/treatments";

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(URL, {
    title: "Fertility Treatments — IVF, ICSI, IUI & More | Bavishi Fertility Institute",
    description:
      "Explore every fertility treatment at Bavishi Fertility Institute — IVF, ICSI, IUI, male and female infertility care, donor programs, fertility preservation and maternity services.",
    alternates: { canonical: URL },
    openGraph: {
      title: "Fertility Treatments — Bavishi Fertility Institute",
      description: "Every treatment pathway available at Bavishi Fertility Institute, explained.",
      url: abs(URL),
      type: "website",
    },
  });
}

export default function Page() {
  const { eyebrow, heading, subtitle, items } = HOMEPAGE_DEFAULTS.treatments;
  const graph = [
    {
      "@type": "CollectionPage",
      "@id": `${abs(URL)}#webpage`,
      url: abs(URL),
      name: "Fertility Treatments",
    },
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Treatments", url: URL },
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
            <span className="font-medium text-[color:var(--plum)]">Treatments</span>
          </nav>
        </div>

        <section className="container-px mx-auto max-w-[1400px] py-12 md:py-16">
          <SectionHead
            center
            eyebrow={eyebrow}
            title={<>{heading.lead} <em className="font-display italic text-[color:var(--rose)]">{heading.em}</em></>}
            subtitle={subtitle}
          />
          <TreatmentsGrid items={items} />
        </section>

        <Footer />
        <FloatingCTA />
        <ScrollToTop />
        <MobileBottomBar />
      </div>
    </>
  );
}
