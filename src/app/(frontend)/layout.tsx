import type { Metadata, Viewport } from "next";
import "@/styles.css";
import { ScrollProgress } from "@/components/conversion";
import { JsonLd } from "@/components/json-ld";
import { siteGraph } from "@/lib/seo";
import { getSiteIdentity, getFooter, getHeader } from "@/lib/payload";
import { FooterProvider } from "@/components/footer-provider";
import { HeaderProvider } from "@/components/header-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { getScriptsConfig } from "@/sanity/lib/fetch";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [identity, header, footer, scripts] = await Promise.all([
    getSiteIdentity(),
    getHeader(),
    getFooter(),
    getScriptsConfig(),
  ]);

  const headScripts = scripts?.headScripts?.filter((s) => s.enabled && s.code) ?? [];
  const bodyScripts = scripts?.bodyScripts?.filter((s) => s.enabled && s.code) ?? [];

  return (
    <html lang="en">
      <head>
        {headScripts.map((s, i) => (
          <script key={i} dangerouslySetInnerHTML={{ __html: s.code! }} />
        ))}
      </head>
      <body>
        <JsonLd graph={siteGraph(identity)} />
        <ScrollProgress />
        <HeaderProvider value={header}>
          <FooterProvider value={footer}>{children}</FooterProvider>
        </HeaderProvider>
        <CookieConsent />
        {bodyScripts.map((s, i) => (
          <script key={i} dangerouslySetInnerHTML={{ __html: s.code! }} />
        ))}
      </body>
    </html>
  );
}
