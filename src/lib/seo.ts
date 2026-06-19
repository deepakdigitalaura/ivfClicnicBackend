/* =====================================================================
 * Central SEO / structured-data utility
 * ---------------------------------------------------------------------
 * Single source of truth for site identity + reusable JSON-LD builders.
 *
 * WHY THIS EXISTS
 *  - Entity grounding: every page must reference the SAME @id for the
 *    Organization (#organization) and WebSite (#website). Search engines
 *    and LLMs use these stable IDs to merge facts across pages into one
 *    knowledge-graph entity. Re-declaring ad-hoc org objects per page
 *    (as the old About/Contact pages did) fragments the entity.
 *  - Scale: a treatment / location / doctor page just calls a builder and
 *    gets correct, consistent schema — no hand-rolled JSON per page.
 * ===================================================================== */

export const SITE = {
  /** Canonical origin — keep in sync with next metadataBase. */
  url: "https://ivfclinic.com",
  name: "Bavishi Fertility Institute",
  alternateName: "Bavishi Fertility Institute",
  legalName: "Bavishi Fertility Institute",
  logo: "https://ivfclinic.com/logo.png",
  foundingDate: "1998",
  telephone: "+919712622288",
  /** Formatted phone for on-page display (canonical `telephone` is for tel:/schema). */
  telephoneDisplay: "+91 97126 22288",
  email: "drbavishi@ivfclinic.com",
  /** WhatsApp digits for wa.me links. */
  whatsapp: "919712622288",
  sameAs: [
    "https://www.instagram.com/bavishifertility/",
    "https://www.facebook.com/BavishiFertilityInstitute/",
    "https://www.youtube.com/@BavishiFertilityInstitute",
  ],
  /** Head-office address — the canonical postal address for #organization. */
  address: {
    streetAddress: "Paldi Cross Roads, Opp. Manjulal Municipal Garden",
    addressLocality: "Ahmedabad",
    addressRegion: "Gujarat",
    postalCode: "380007",
    addressCountry: "IN",
  },
  awards: [
    "National Fertility Award 2021",
    "National Fertility Award 2022",
    "National Fertility Award 2023",
    "National Fertility Award 2024",
    "National Fertility Award 2025",
    "Economic Times IVF Chain of the Year — West",
    "Bharat Excellence Award for IVF and Infertility Care",
    "Best Test Tube Baby Clinic — 2004",
    "Power Brand Award — IVF India (2015)",
    "Excellence in IVF — Divya Bhaskar Group / My FM (2017)",
    "Rose of Paracelsus Award — European Medical Association (2017)",
    "Best IVF Clinic Chain in India — Mid-Day (2018)",
    "Times Health Icon Award — Times of India (2018)",
    "Best IVF Chain in India – West — The Economic Times (2019)",
    "India's No.1 Fertility Clinic — TOI National Survey (2020)",
    "No.1 in Western India — 5 consecutive years (2016–2020)",
    "IVF / Fertility Chain of the Year – West (2024)",
  ],
} as const;

/** Stable entity IDs — referenced everywhere via { "@id": ORG_ID }. */
export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

/** Absolute URL helper. Accepts "/path" or a full URL. */
export const abs = (path: string) =>
  path.startsWith("http") ? path : `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;

type Json = Record<string, unknown>;

/* ---------- Sitewide entities (emitted once, in the root layout) ----------
 * The editable identity fields can be supplied from the CMS `site-settings`
 * global; when omitted, each field falls back to the SITE constant so output
 * is byte-identical to the pre-CMS version. The stable @ids (ORG_ID /
 * WEBSITE_ID) and canonical `url` are intentionally NOT overridable — they are
 * the entity-grounding anchors and must never change. `founders` and
 * `medicalSpecialty` stay code-defined for now (not yet in the global). */

const DEFAULT_KNOWS_ABOUT = [
  "In Vitro Fertilization",
  "Intracytoplasmic Sperm Injection",
  "Intrauterine Insemination",
  "Male Infertility",
  "Female Infertility",
  "Fertility Preservation",
  "Preimplantation Genetic Testing",
];

export type SiteIdentity = {
  name?: string | null;
  alternateName?: string | null;
  legalName?: string | null;
  logo?: string | null;
  foundingDate?: string | null;
  telephone?: string | null;
  email?: string | null;
  address?: Partial<Record<keyof typeof SITE.address, string | null>> | null;
  awards?: string[] | null;
  knowsAbout?: string[] | null;
  sameAs?: string[] | null;
};

export function organizationSchema(identity?: SiteIdentity): Json {
  const addr = {
    streetAddress: identity?.address?.streetAddress ?? SITE.address.streetAddress,
    addressLocality: identity?.address?.addressLocality ?? SITE.address.addressLocality,
    addressRegion: identity?.address?.addressRegion ?? SITE.address.addressRegion,
    postalCode: identity?.address?.postalCode ?? SITE.address.postalCode,
    addressCountry: identity?.address?.addressCountry ?? SITE.address.addressCountry,
  };
  return {
    "@type": ["MedicalOrganization", "MedicalClinic"],
    "@id": ORG_ID,
    name: identity?.name ?? SITE.name,
    alternateName: identity?.alternateName ?? SITE.alternateName,
    legalName: identity?.legalName ?? SITE.legalName,
    url: SITE.url,
    logo: identity?.logo ?? SITE.logo,
    image: identity?.logo ?? SITE.logo,
    telephone: identity?.telephone ?? SITE.telephone,
    email: identity?.email ?? SITE.email,
    foundingDate: identity?.foundingDate ?? SITE.foundingDate,
    founders: [
      { "@type": "Person", name: "Dr. Himanshu Bavishi" },
      { "@type": "Person", name: "Dr. Falguni Bavishi" },
    ],
    address: { "@type": "PostalAddress", ...addr },
    medicalSpecialty: ["Fertility", "ReproductiveMedicine", "Obstetrics", "Gynecology"],
    award: identity?.awards?.length ? identity.awards : SITE.awards,
    sameAs: identity?.sameAs?.length ? identity.sameAs : SITE.sameAs,
    knowsAbout: identity?.knowsAbout?.length ? identity.knowsAbout : DEFAULT_KNOWS_ABOUT,
  };
}

export function websiteSchema(identity?: SiteIdentity): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: identity?.name ?? SITE.name,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

/** The two sitewide nodes, ready to drop into a root @graph. */
export function siteGraph(identity?: SiteIdentity): Json[] {
  return [organizationSchema(identity), websiteSchema(identity)];
}

/* ---------- Per-page building blocks ---------- */

export function breadcrumbSchema(trail: { name: string; url: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.url),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * AggregateRating — ONLY emitted when real values are supplied.
 * Never call this with fabricated numbers. Returns null if no data,
 * so callers can safely spread `...(aggregateRating(x) ? { aggregateRating: ... } : {})`.
 */
export function aggregateRatingSchema(
  data?: { ratingValue: number; reviewCount: number },
): Json | null {
  if (!data || !data.reviewCount) return null;
  return {
    "@type": "AggregateRating",
    ratingValue: data.ratingValue,
    reviewCount: data.reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}
