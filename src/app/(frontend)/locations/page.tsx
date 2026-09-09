import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { SiteHeader } from "@/components/site-header";
import { Footer, Locations } from "@/components/home-page";
import { FloatingCTA, MobileBottomBar, ScrollToTop } from "@/components/conversion";
import { breadcrumbSchema, abs } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";

const URL = "/locations";

export async function generateMetadata(): Promise<Metadata> {
  return withPageSeoOverride(URL, {
    title: "Our Locations — 14 IVF Centres Across 8 Cities | Bavishi Fertility Institute",
    description:
      "Find a Bavishi Fertility Institute centre near you — 14 centres across Ahmedabad, Mumbai, Vadodara, Surat, Bhuj, Bhavnagar, Anand and Varanasi.",
    alternates: { canonical: URL },
    openGraph: {
      title: "Our Locations — Bavishi Fertility Institute",
      description: "14 centres across 8 cities — premium fertility care, close to home wherever you are.",
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
      name: "Our Locations",
    },
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Locations", url: URL },
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
            <span className="font-medium text-[color:var(--plum)]">Locations</span>
          </nav>
        </div>

        <Locations />

        <Footer />
        <FloatingCTA />
        <ScrollToTop />
        <MobileBottomBar />
      </div>
    </>
  );
}
