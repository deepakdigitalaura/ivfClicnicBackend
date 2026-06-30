import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "@/styles.css";
import { ScrollProgress } from "@/components/conversion";
import { JsonLd } from "@/components/json-ld";
import { siteGraph } from "@/lib/seo";
import { getSiteIdentity, getFooter, getHeader } from "@/lib/payload";
import { FooterProvider } from "@/components/footer-provider";
import { HeaderProvider } from "@/components/header-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { getScriptsConfig, getSchemaOrgConfig, getPageSeo } from "@/sanity/lib/fetch";

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
  const h = await headers();
  const currentPath = h.get("x-pathname") ?? "/";

  const [identity, header, footer, scripts, schemaOrg, pageSeo] = await Promise.all([
    getSiteIdentity(),
    getHeader(),
    getFooter(),
    getScriptsConfig(),
    getSchemaOrgConfig(),
    getPageSeo(currentPath),
  ]);

  const headScripts = scripts?.headScripts?.filter((s) => s.enabled && s.code) ?? [];
  const bodyScripts = scripts?.bodyScripts?.filter((s) => s.enabled && s.code) ?? [];

  // Global custom JSON-LD blocks (Structured Data → Custom schemas, apply to all pages).
  const customSchemas = (schemaOrg?.customSchemas ?? [])
    .filter((s) => s.enabled && s.jsonCode)
    .map((s) => {
      try { return JSON.parse(s.jsonCode!); } catch { return null; }
    })
    .filter(Boolean);

  // Per-page JSON-LD set in Page SEO admin. Parsed once; invalid JSON is silently skipped.
  let pageSchema: Record<string, unknown> | null = null;
  if (pageSeo?.customSchemaJson?.trim()) {
    try { pageSchema = JSON.parse(pageSeo.customSchemaJson); } catch { /* invalid — ignore */ }
  }

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
        {pageSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...pageSchema }) }}
          />
        )}
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
