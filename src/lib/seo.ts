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
  foundingDate: "1984",
  telephone: "+919712622288",
  email: "drbavishi@ivfclinic.com",
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
  ],
} as const;

/** Stable entity IDs — referenced everywhere via { "@id": ORG_ID }. */
export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

/** Absolute URL helper. Accepts "/path" or a full URL. */
export const abs = (path: string) =>
  path.startsWith("http") ? path : `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;

type Json = Record<string, unknown>;

/* ---------- Sitewide entities (emitted once, in the root layout) ---------- */

export function organizationSchema(): Json {
  return {
    "@type": ["MedicalOrganization", "MedicalClinic"],
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: SITE.alternateName,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: SITE.logo,
    image: SITE.logo,
    telephone: SITE.telephone,
    email: SITE.email,
    foundingDate: SITE.foundingDate,
    founders: [
      { "@type": "Person", name: "Dr. Himanshu Bavishi" },
      { "@type": "Person", name: "Dr. Falguni Bavishi" },
    ],
    address: { "@type": "PostalAddress", ...SITE.address },
    medicalSpecialty: ["Fertility", "ReproductiveMedicine", "Obstetrics", "Gynecology"],
    award: SITE.awards,
    sameAs: SITE.sameAs,
    knowsAbout: [
      "In Vitro Fertilization",
      "Intracytoplasmic Sperm Injection",
      "Intrauterine Insemination",
      "Male Infertility",
      "Female Infertility",
      "Fertility Preservation",
      "Preimplantation Genetic Testing",
    ],
  };
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
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
export function siteGraph(): Json[] {
  return [organizationSchema(), websiteSchema()];
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
