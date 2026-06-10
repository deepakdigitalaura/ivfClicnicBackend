/* =====================================================================
 * About-BFI resolver — maps the `about-page` global to the plain,
 * client-serialisable model the <AboutPage> sections render (Wave 4.5, Phase E).
 * ---------------------------------------------------------------------
 * The CMS `about-page` global is the source of truth for the page's STRUCTURED
 * editorial data — the hero copy, the "At a glance" / "Patient First" stat
 * grids, the legacy timeline, the trust pillars, the city network, and the
 * network/final-CTA headings + CTA labels. This module shapes the global doc
 * into `AboutData`, falling back PER-SECTION to the typed ABOUT_DEFAULTS so an
 * empty/partial/unavailable CMS renders byte-identically (same convention as
 * src/lib/homepage.ts → HOMEPAGE_DEFAULTS).
 *
 * SCOPE (Wave 4.5 Phase E, "structured-data only"): the inline-<strong> "Our
 * Story" / "Patient First" prose, every decorative <SectionHead> <em> title,
 * the hero/CTA button hrefs+icons, the JSON-LD graph, and the reused <Doctors>/
 * <AwardsCarousel> sections all stay CODE-OWNED in the component — only the
 * structured copy above becomes editable. The "15 centres / Mumbai · 6 centres"
 * marketing copy is curated (independent of CENTRES) and is preserved verbatim
 * here; do NOT reconcile it to src/lib/locations.ts.
 *
 * ICONS: trust pillars carry icon NAMES (strings), never Lucide components — so
 * the model crosses the server→client boundary as props. <AboutPage> maps names
 * → components via resolveIcon() (src/lib/icon-map). ABOUT_DEFAULTS stores names
 * directly. HEADINGS are { lead, em } text only — the component keeps its own
 * decorative <em className="…">, so markup stays byte-identical while the words
 * become editable.
 *
 * Pure module (no payload / server-only imports) — safe to bundle into the
 * client <AboutPage> (its in-browser default content).
 * ===================================================================== */
import type { IconName } from "@/lib/icon-map";

/* ---------- Resolved (serialisable) model ---------- */

/** A two-part heading: plain lead text + the decorative <em> word(s). The
 *  component supplies the per-section <em> className, so markup is unchanged. */
export type AboutHeading = { lead: string; em: string };

export type AboutHero = { eyebrow: string; headline: string; headlineItalic: string; paragraph: string };
export type StatTuple = { n: string; l: string };
export type Milestone = { y: string; t: string; d: string };
/** A trust pillar (icon carried as a curated NAME, mapped to a component in the view). */
export type TrustPillar = { icon: IconName; t: string; d: string };
export type CitySummary = { c: string; n: string };

export type AboutSeo = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
};

/** Client-ready, fully-resolved About-BFI content. */
export type AboutData = {
  hero: AboutHero;
  atAGlance: StatTuple[];
  milestones: Milestone[];
  trustPillars: TrustPillar[];
  patientStats: StatTuple[];
  network: { heading: AboutHeading; subtitle: string; cities: CitySummary[] };
  finalCta: { heading: AboutHeading; ctas: string[] };
  seo: AboutSeo;
};

/**
 * Typed fallback — the exact About-BFI structured content as it shipped before
 * the CMS, so an empty `about-page` global renders byte-identically. The seeded
 * global mirrors this. NOTE the verbatim marketing copy ("15", "6 centres") —
 * curated, NOT derived from CENTRES; preserve as-is.
 */
export const ABOUT_DEFAULTS: AboutData = {
  hero: {
    eyebrow: "About Bavishi Fertility Institute",
    headline: "Four decades of fertility excellence — built on hope",
    headlineItalic: "fertility excellence",
    paragraph:
      "Since 1984, Bavishi Fertility Institute has helped over 30,000 families experience the joy of parenthood — pioneering IVF in India and growing into one of the country's most trusted fertility networks, with 15 centres across 8 cities.",
  },
  atAGlance: [
    { n: "1984", l: "Founded in Ahmedabad" },
    { n: "30,000+", l: "Successful pregnancies" },
    { n: "3,000+", l: "IVF cycles every year" },
    { n: "15", l: "Centres across 8 cities" },
    { n: "5×", l: "National Fertility Award (2021–25)" },
  ],
  milestones: [
    { y: "1984", t: "The journey begins", d: "Dr. Himanshu & Dr. Falguni Bavishi found Bavishi Fertility Institute in Ahmedabad with one promise — fertility care above international standards, with an Indian heart." },
    { y: "1998", t: "Pioneering IVF in India", d: "Bavishi Fertility Institute helps bring modern IVF and assisted reproduction to thousands of Indian families." },
    { y: "Firsts", t: "Two national firsts", d: "India's first live birth from a vitrified (frozen) egg, and India's first surrogacy for an international couple — milestones that shaped Indian reproductive medicine." },
    { y: "2021–25", t: "National Fertility Award", d: "Honoured for excellence in IVF & fertility care for five consecutive years — a record of consistency, not chance." },
    { y: "Today", t: "15 centres, one family", d: "30,000+ successful pregnancies, 3,000+ IVF cycles every year, and Class 1000 embryology labs across 8 Indian cities." },
  ],
  trustPillars: [
    { icon: "Award", t: "Four Decades of Experience", d: "Since 1984, a family-led institute that pioneered IVF in India and has guided 30,000+ families to parenthood." },
    { icon: "HeartPulse", t: "Outcomes That Matter", d: "3,000+ IVF cycles a year with a focus on safe stimulation, best-quality embryos and healthy single pregnancies." },
    { icon: "Users", t: "A Family of Specialists", d: "Reproductive endocrinologists, embryologists, andrologists, fetal-medicine experts, counsellors and nutritionists under one roof." },
    { icon: "Microscope", t: "World-Class Technology", d: "Class 1000 IVF labs — 10× cleaner than the international standard — with time-lapse imaging, vitrification and PGT." },
    { icon: "ShieldCheck", t: "Transparency & Ethics", d: "Honest counselling, no hidden costs, double-witnessing of every sample, and the Suraksha Kavach assurance." },
    { icon: "Sparkles", t: "Simple · Safe · Smart · Successful", d: "Our four values shape every plan — personalised, compassionate and judicious use of advanced reproductive technology." },
  ],
  patientStats: [
    { n: "30,000+", l: "Happy families" },
    { n: "40+", l: "Years of fertility expertise" },
    { n: "300+", l: "International patients a year" },
    { n: "8", l: "Cities, one standard of care" },
  ],
  network: {
    heading: { lead: "15 centres across", em: "8 Indian cities" },
    subtitle: "World-class fertility care, close to home — wherever you are.",
    cities: [
      { c: "Ahmedabad", n: "3 centres" }, { c: "Mumbai", n: "6 centres" },
      { c: "Vadodara", n: "1 centre" }, { c: "Surat", n: "1 centre" },
      { c: "Bhuj", n: "1 centre" }, { c: "Bhavnagar", n: "1 centre" },
      { c: "Anand", n: "1 centre" }, { c: "Varanasi", n: "1 centre" },
    ],
  },
  finalCta: {
    heading: { lead: "Begin your journey with", em: "people who care." },
    ctas: ["Book Free Consultation", "WhatsApp Us"],
  },
  seo: {
    metaTitle: "About Bavishi Fertility Institute — 40 Years of IVF Excellence in India",
    metaDescription:
      "Founded in 1984 by Dr. Himanshu & Dr. Falguni Bavishi, Bavishi Fertility Institute has guided 30,000+ families to parenthood across 15 centres. Discover our story, legacy and values.",
    ogTitle: "About Bavishi Fertility Institute — India's Trusted IVF Legacy Since 1984",
    ogDescription:
      "30,000+ pregnancies. 15 centres across 8 cities. National Fertility Award 5 years running. The story of India's pioneering fertility institute.",
    ogImage: "/assets/about-clinic.jpg",
  },
};

/* =====================================================================
 * CMS source shape (kept loose so it stays decoupled from the generated
 * payload-types, same convention as HomepageSource / ServiceSource).
 * ===================================================================== */
type HeadingSource = { lead?: string | null; em?: string | null } | null | undefined;
type TextItem = { text?: string | null };
type StatSource = { value?: string | null; label?: string | null };

export type AboutSource =
  | {
      hero?: {
        eyebrow?: string | null;
        headline?: string | null;
        headlineItalic?: string | null;
        paragraph?: string | null;
      } | null;
      atAGlance?: StatSource[] | null;
      milestones?: { y?: string | null; t?: string | null; d?: string | null }[] | null;
      trustPillars?: { icon?: string | null; t?: string | null; d?: string | null }[] | null;
      patientStats?: StatSource[] | null;
      network?: {
        heading?: HeadingSource;
        subtitle?: string | null;
        cities?: { c?: string | null; n?: string | null }[] | null;
      } | null;
      finalCta?: {
        heading?: HeadingSource;
        ctas?: TextItem[] | null;
      } | null;
      seo?: {
        metaTitle?: string | null;
        metaDescription?: string | null;
        ogTitle?: string | null;
        ogDescription?: string | null;
        ogImage?: unknown;
      } | null;
    }
  | null
  | undefined;

/* ---------- Small helpers (mirror src/lib/homepage.ts) ---------- */
const heading = (h: HeadingSource, def: AboutHeading): AboutHeading =>
  h?.lead ? { lead: h.lead, em: h.em ?? "" } : def;
const texts = (a: TextItem[] | null | undefined): string[] =>
  (a ?? []).map((x) => x.text ?? "").filter(Boolean);
const stats = (a: StatSource[] | null | undefined): StatTuple[] =>
  (a ?? []).map((s) => ({ n: s.value ?? "", l: s.label ?? "" }));

/**
 * Map the `about-page` global → AboutData, falling back PER-SECTION to
 * ABOUT_DEFAULTS so an empty/partial CMS renders byte-identically. A section is
 * taken from the CMS only when its content is actually present (non-empty array
 * / set heading); otherwise the typed default is used verbatim. SEO meta is
 * consumed by generateMetadata() (a server context) where the ogImage upload
 * relation is resolved, so ogImage here always carries the default string.
 */
export function resolveAbout(src: AboutSource): AboutData {
  const d = ABOUT_DEFAULTS;
  if (!src) return d;

  const hero: AboutHero = src.hero?.headline
    ? {
        eyebrow: src.hero.eyebrow ?? d.hero.eyebrow,
        headline: src.hero.headline,
        headlineItalic: src.hero.headlineItalic ?? d.hero.headlineItalic,
        paragraph: src.hero.paragraph ?? d.hero.paragraph,
      }
    : d.hero;

  const atAGlance = src.atAGlance?.length ? stats(src.atAGlance) : d.atAGlance;
  const milestones = src.milestones?.length
    ? src.milestones.map((m) => ({ y: m.y ?? "", t: m.t ?? "", d: m.d ?? "" }))
    : d.milestones;
  const trustPillars = src.trustPillars?.length
    ? src.trustPillars.map((p) => ({ icon: (p.icon ?? "Sparkles") as IconName, t: p.t ?? "", d: p.d ?? "" }))
    : d.trustPillars;
  const patientStats = src.patientStats?.length ? stats(src.patientStats) : d.patientStats;

  const network = src.network?.cities?.length
    ? {
        heading: heading(src.network.heading, d.network.heading),
        subtitle: src.network.subtitle ?? d.network.subtitle,
        cities: src.network.cities.map((c) => ({ c: c.c ?? "", n: c.n ?? "" })),
      }
    : d.network;

  const finalCta = src.finalCta?.heading?.lead
    ? {
        heading: heading(src.finalCta.heading, d.finalCta.heading),
        ctas: src.finalCta.ctas?.length ? texts(src.finalCta.ctas) : d.finalCta.ctas,
      }
    : d.finalCta;

  const seo: AboutSeo = {
    metaTitle: src.seo?.metaTitle || d.seo.metaTitle,
    metaDescription: src.seo?.metaDescription || d.seo.metaDescription,
    ogTitle: src.seo?.ogTitle || d.seo.ogTitle,
    ogDescription: src.seo?.ogDescription || d.seo.ogDescription,
    ogImage: d.seo.ogImage,
  };

  return { hero, atAGlance, milestones, trustPillars, patientStats, network, finalCta, seo };
}
