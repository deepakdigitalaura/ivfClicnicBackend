import type { Metadata, Viewport } from "next";
import "@/styles.css";
import { ScrollProgress } from "@/components/conversion";
import { JsonLd } from "@/components/json-ld";
import { siteGraph } from "@/lib/seo";
import { getSiteIdentity, getFooter, getHeader } from "@/lib/payload";
import { FooterProvider } from "@/components/footer-provider";
import { HeaderProvider } from "@/components/header-provider";

const OG_IMAGE = "/assets/hero-mother-baby1.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://ivfclinic.com"),
  title: {
    default: "Bavishi Fertility Centre — India's Trusted IVF Experts",
    template: "%s · Bavishi Fertility Centre",
  },
  description:
    "Premium fertility care across 14 centres in India. 30,000+ successful pregnancies, advanced IVF, ICSI and IUI, and personalised treatment plans by leading specialists.",
  openGraph: {
    title: "Bavishi Fertility Centre — India's Trusted IVF Experts",
    description:
      "30,000+ pregnancies. 30+ years of legacy. 14 centres. Personalised, transparent and compassionate fertility care.",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bavishi Fertility Centre — India's Trusted IVF Experts",
    description:
      "30,000+ pregnancies. 30+ years of legacy. 14 centres. Personalised, transparent and compassionate fertility care.",
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Identity comes from the CMS `site-settings` global; falls back to the SITE
  // constant when unavailable so the entity graph is never empty. The header and
  // footer are resolved once here and carried to <SiteHeader> / <Footer>
  // (rendered inside the per-page client components) via context — all stay
  // static (cached + tagged reads).
  const [identity, header, footer] = await Promise.all([
    getSiteIdentity(),
    getHeader(),
    getFooter(),
  ]);
  return (
    <html lang="en">
      <body>
        {/* Sitewide entity graph — #organization + #website are referenced by
            every page's per-page schema so all facts merge into one entity. */}
        <JsonLd graph={siteGraph(identity)} />
        <ScrollProgress />
        <HeaderProvider value={header}>
          <FooterProvider value={footer}>{children}</FooterProvider>
        </HeaderProvider>
      </body>
    </html>
  );
}
