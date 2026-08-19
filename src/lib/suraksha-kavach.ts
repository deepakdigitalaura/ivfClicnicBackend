/* =====================================================================
 * Suraksha Kavach page resolver — maps the `surakshaKavach` singleton to the
 * plain, client-serialisable model <SurakshaKavachPage> renders. Same
 * convention as src/lib/about.ts: PER-SECTION fallback to the typed
 * SURAKSHA_KAVACH_DEFAULTS (the exact content that shipped before the CMS)
 * so an empty/partial doc renders byte-identically.
 *
 * ICONS: benefits carry icon NAMES (strings), mapped to Lucide components in
 * the view via resolveIcon() (src/lib/icon-map) — same pattern as About's
 * trust pillars.
 *
 * Pure module (no server-only imports) — safe to bundle into the client
 * <SurakshaKavachPage> component.
 * ===================================================================== */
import type { IconName } from "@/lib/icon-map";

export type SKHeading = { lead: string; em: string };
export type SKHero = { eyebrow: string; headline: string; headlineEm: string; paragraph: string; badgeNumber: string; badgeLabel: string; image: string };
export type SKStory = { eyebrow: string; heading: SKHeading; paragraphs: string[] };
export type SKBenefit = { icon: IconName; title: string; description: string };
export type SKStat = { value: number; suffix: string; label: string; sub: string };
export type SKStep = { step: string; title: string; description: string };
export type SKFaq = { q: string; a: string };

export type SurakshaKavachData = {
  hero: SKHero;
  story: SKStory;
  benefits: SKBenefit[];
  stats: SKStat[];
  steps: SKStep[];
  faqs: SKFaq[];
};

export const SURAKSHA_KAVACH_DEFAULTS: SurakshaKavachData = {
  hero: {
    eyebrow: "India's Only IVF Protection Program",
    headline: "No tall claims, but a solid promise.",
    headlineEm: "but a solid promise.",
    paragraph:
      "Suraksha Kavach is a unique and only one-of-its-kind package in the entire world. It covers multiple IVF cycles and offers complete financial protection — for you, or for someone you love.",
    badgeNumber: "30,000+ Happy Families",
    badgeLabel: "trusted Bavishi Fertility Institute for their parenthood journey",
    image: "/assets/hero-mother-baby.jpg",
  },
  story: {
    eyebrow: "What is Suraksha Kavach?",
    heading: { lead: "The world's only", em: "IVF protection program." },
    paragraphs: [
      "IVF is an emotional and financial journey. At Bavishi Fertility Institute, we believe no couple should have to choose between their dream of parenthood and financial security.",
      "Suraksha Kavach is our revolutionary protection program — the only one of its kind in the entire world. It covers multiple IVF cycles with complete financial protection.",
      "Backed by over 25 years of expertise and thousands of successful pregnancies, Suraksha Kavach is designed to give you the strongest possible chance of parenthood.",
    ],
  },
  benefits: [
    { icon: "ShieldCheck", title: "Financial Peace of Mind", description: "Your investment is protected. The program covers multiple cycles, giving you the best possible chance of success." },
    { icon: "RefreshCcw", title: "Multiple IVF Cycles", description: "The package covers multiple IVF/ICSI cycles, giving you the best possible chance of success without additional financial burden." },
    { icon: "Stethoscope", title: "Comprehensive Treatment", description: "Includes consultations, investigations, medications, procedures, embryology, and all lab work — no hidden costs, no surprises." },
    { icon: "Baby", title: "Dedicated to Your Dream", description: "Our commitment is to support you through every step of your fertility journey — with expert care, advanced science, and unwavering dedication." },
  ],
  stats: [
    { value: 30000, suffix: "+", label: "Successful Pregnancies", sub: "across all Bavishi Fertility Institute centres" },
    { value: 25, suffix: "+", label: "Years of Trust", sub: "pioneering IVF since 1998" },
    { value: 14, suffix: "", label: "Centres", sub: "across 8 cities in India" },
    { value: 1998, suffix: "", label: "Est.", sub: "pioneering fertility care" },
  ],
  steps: [
    { step: "01", title: "Initial Consultation", description: "Meet our senior fertility specialist for a thorough evaluation. We assess your medical history, run diagnostics, and determine your eligibility for Suraksha Kavach." },
    { step: "02", title: "Personalised Treatment Plan", description: "Our team designs a customised IVF protocol tailored to your unique physiology. Every detail is planned — from medication dosage to embryo transfer strategy." },
    { step: "03", title: "Enrol in Suraksha Kavach", description: "Once eligible, you enrol in the program with complete transparency on what's included. One package, one price, complete peace of mind." },
    { step: "04", title: "Treatment & Monitoring", description: "Begin your IVF journey with priority care. Our team monitors every stage — stimulation, retrieval, fertilisation, and embryo development — with precision." },
    { step: "05", title: "Embryo Transfer & Support", description: "The best-quality embryos are transferred under ultrasound guidance. Post-transfer, you receive dedicated support through the crucial two-week wait and beyond." },
    { step: "06", title: "A Baby Is Born", description: "The program supports you through multiple cycles to maximise your chances. If additional cycles are needed, they're covered." },
  ],
  faqs: [
    { q: "What is the Suraksha Kavach Package?", a: "Suraksha Kavach is Bavishi Fertility Institute's exclusive IVF protection program — the only one of its kind in the world. Your investment covers multiple IVF cycles." },
    { q: "Who is eligible for Suraksha Kavach?", a: "Eligibility is determined after an initial consultation and medical evaluation by our senior fertility specialists. Factors such as age, medical history, ovarian reserve, and overall health are assessed. Our doctors will recommend whether Suraksha Kavach is the right fit for your situation." },
    { q: "How many IVF cycles are included?", a: "The Suraksha Kavach package covers multiple IVF/ICSI cycles as needed. The exact number depends on your personalised treatment plan. The program continues until a healthy live birth is achieved or all agreed-upon cycles are completed." },
    { q: "What happens if the treatment is not successful for me?", a: "If medical reasons prevent your treatment from succeeding, our team will discuss the best next steps and options available to you as part of your Suraksha Kavach enrolment." },
    { q: "What does the package include?", a: "The package is comprehensive: consultations, diagnostic investigations, medications, ovarian stimulation, egg retrieval, ICSI/IVF procedure, embryology and lab work, embryo transfer, and post-treatment support. There are no hidden charges." },
    { q: "What kind of results has Suraksha Kavach achieved?", a: "Suraksha Kavach patients at Bavishi Fertility Institute have achieved excellent outcomes. We are transparent about our results and can share detailed statistics during your consultation — success depends on individual factors such as age, diagnosis and medical history." },
    { q: "How do I enrol in Suraksha Kavach?", a: "Start by booking a consultation at any of our 14 centres across India. After your initial evaluation, if you are eligible, our team will walk you through the enrolment process, package details, and answer any questions you may have." },
  ],
};

/* ---------- Source (raw Sanity doc) shape ---------- */
export type SurakshaKavachSource =
  | {
      hero?: { eyebrow?: string; headline?: string; headlineEm?: string; paragraph?: string; badgeNumber?: string; badgeLabel?: string; image?: string } | null;
      story?: { eyebrow?: string; heading?: { lead?: string; em?: string }; paragraphs?: { value?: string }[] } | null;
      benefits?: { icon?: string; title?: string; description?: string }[] | null;
      stats?: { value?: number; suffix?: string; label?: string; sub?: string }[] | null;
      steps?: { step?: string; title?: string; description?: string }[] | null;
      faqs?: { q?: string; a?: string }[] | null;
    }
  | null
  | undefined;

const heading = (h: { lead?: string; em?: string } | undefined, d: SKHeading): SKHeading =>
  h?.lead ? { lead: h.lead, em: h.em ?? d.em } : d;

export function resolveSurakshaKavach(src: SurakshaKavachSource): SurakshaKavachData {
  const d = SURAKSHA_KAVACH_DEFAULTS;
  if (!src) return d;

  const hero: SKHero = src.hero?.headline
    ? {
        eyebrow: src.hero.eyebrow ?? d.hero.eyebrow,
        headline: src.hero.headline,
        headlineEm: src.hero.headlineEm ?? d.hero.headlineEm,
        paragraph: src.hero.paragraph ?? d.hero.paragraph,
        badgeNumber: src.hero.badgeNumber ?? d.hero.badgeNumber,
        badgeLabel: src.hero.badgeLabel ?? d.hero.badgeLabel,
        image: src.hero.image || d.hero.image,
      }
    : { ...d.hero, image: src.hero?.image || d.hero.image };

  const story: SKStory = src.story?.heading?.lead
    ? {
        eyebrow: src.story.eyebrow ?? d.story.eyebrow,
        heading: heading(src.story.heading, d.story.heading),
        paragraphs: src.story.paragraphs?.length ? src.story.paragraphs.map((p) => p.value ?? "") : d.story.paragraphs,
      }
    : d.story;

  const benefits: SKBenefit[] = src.benefits?.length
    ? src.benefits.map((b) => ({ icon: (b.icon ?? "Sparkles") as IconName, title: b.title ?? "", description: b.description ?? "" }))
    : d.benefits;

  const stats: SKStat[] = src.stats?.length
    ? src.stats.map((s) => ({ value: s.value ?? 0, suffix: s.suffix ?? "", label: s.label ?? "", sub: s.sub ?? "" }))
    : d.stats;

  const steps: SKStep[] = src.steps?.length
    ? src.steps.map((s) => ({ step: s.step ?? "", title: s.title ?? "", description: s.description ?? "" }))
    : d.steps;

  const faqs: SKFaq[] = src.faqs?.length
    ? src.faqs.filter((f) => f.q && f.a).map((f) => ({ q: f.q!, a: f.a! }))
    : d.faqs;

  return { hero, story, benefits, stats, steps, faqs };
}

/** Seeds the admin form draft with the full current content (Sanity doc, or
 *  defaults where unset) — same reasoning as materializeAboutSource(): the
 *  resolver gates each section on the WHOLE section being present, so a save
 *  must never submit a half-empty section that would blank out its untouched
 *  siblings on the live page. */
export function materializeSurakshaKavachSource(src: SurakshaKavachSource): NonNullable<SurakshaKavachSource> {
  const r = resolveSurakshaKavach(src);
  const s = (src ?? {}) as NonNullable<SurakshaKavachSource>;
  return {
    ...s,
    hero: { ...r.hero, ...s.hero },
    story: {
      eyebrow: r.story.eyebrow,
      heading: r.story.heading,
      paragraphs: r.story.paragraphs.map((value) => ({ value })),
    },
    benefits: r.benefits,
    stats: r.stats,
    steps: r.steps,
    faqs: r.faqs,
  };
}
