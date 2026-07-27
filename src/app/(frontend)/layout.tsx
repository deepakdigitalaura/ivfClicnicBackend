import type { Metadata, Viewport } from "next";
import "@/styles.css";
import { ScrollProgress } from "@/components/conversion";
import { JsonLd } from "@/components/json-ld";
import { siteGraph } from "@/lib/seo";
import { getSiteIdentity, getFooter, getHeader } from "@/lib/payload";
import { FooterProvider } from "@/components/footer-provider";
import { HeaderProvider } from "@/components/header-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { ConsentScripts } from "@/components/consent-scripts";
import { getScriptsConfig, getSchemaOrgConfig } from "@/sanity/lib/fetch";

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
  const [identity, header, footer, scripts, schemaOrg] = await Promise.all([
    getSiteIdentity(),
    getHeader(),
    getFooter(),
    getScriptsConfig(),
    getSchemaOrgConfig(),
  ]);

  const isLive = (s: { enabled?: boolean; code?: string }) => !!s.enabled && !!s.code;
  const isNecessary = (s: { category?: string }) => s.category === "necessary";

  const allHead = scripts?.headScripts?.filter(isLive) ?? [];
  const allBody = scripts?.bodyScripts?.filter(isLive) ?? [];

  // Necessary scripts (site verification, essential tag managers) always render.
  // Analytics/marketing scripts are only executed client-side once the visitor
  // accepts cookies — see <ConsentScripts> and src/components/cookie-consent.tsx.
  const headScripts = allHead.filter(isNecessary);
  const bodyScripts = allBody.filter(isNecessary);
  const gatedScripts = [...allHead, ...allBody].filter((s) => !isNecessary(s));

  const customSchemas = (schemaOrg?.customSchemas ?? [])
    .filter((s) => s.enabled && s.jsonCode)
    .map((s) => {
      try { return JSON.parse(s.jsonCode!); } catch { return null; }
    })
    .filter(Boolean);

  return (
    <html lang="en">
      <head>
        {headScripts.map((s, i) => (
          <script key={i} dangerouslySetInnerHTML={{ __html: s.code! }} />
        ))}
      </head>
      <body>
        <JsonLd graph={siteGraph(identity)} />
        {customSchemas.map((schema, i) => (
          <script key={`cs-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}
        <ScrollProgress />
        <HeaderProvider value={header}>
          <FooterProvider value={footer}>{children}</FooterProvider>
        </HeaderProvider>
        <CookieConsent />
        <ConsentScripts scripts={gatedScripts} />
        {bodyScripts.map((s, i) => (
          <script key={i} dangerouslySetInnerHTML={{ __html: s.code! }} />
        ))}
      </body>
    </html>
  );
}
