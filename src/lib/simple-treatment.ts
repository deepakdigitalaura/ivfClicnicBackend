/* =====================================================================
 * Simple Treatment page resolver — maps the `simpleTreatmentPage` singleton
 * to the plain, client-serialisable model <SimpleTreatmentPage> renders.
 * Same convention as src/lib/suraksha-kavach.ts: PER-SECTION fallback to
 * the typed SIMPLE_TREATMENT_DEFAULTS so an empty/partial doc renders
 * byte-identically.
 *
 * SCOPE: hero, philosophy cards, the 5-step journey (each with a list of
 * highlight tags), the quote banner, and the 3 "pillars" cards are all
 * editable.
 *
 * ICONS: philosophy/steps/pillars carry icon NAMES (strings), mapped to
 * Lucide components in the view via resolveIcon().
 *
 * Pure module (no server-only imports) — safe to bundle into the client
 * <SimpleTreatmentPage> component.
 * ===================================================================== */
import type { IconName } from "@/lib/icon-map";

export type STHero = { eyebrow: string; headline: string; headlineEm: string; paragraph: string };
export type STPhilosophy = { icon: IconName; title: string; description: string };
export type STStep = { step: string; icon: IconName; title: string; description: string; highlights: string[] };
export type STQuote = { quote: string; paragraph: string };
export type STPillar = { icon: IconName; title: string; description: string };

export type SimpleTreatmentData = {
  hero: STHero;
  philosophy: STPhilosophy[];
  steps: STStep[];
  quote: STQuote;
  pillars: STPillar[];
};

export const SIMPLE_TREATMENT_DEFAULTS: SimpleTreatmentData = {
  hero: {
    eyebrow: "Simple by Design",
    headline: "Most Complex things can be made Simple with Science & Care.",
    headlineEm: "Simple with Science & Care.",
    paragraph: "At Bavishi Fertility Institute, with 100+ years combined IVF experience, we have made the most complex IVF treatment SIMPLE.",
  },
  philosophy: [
    { icon: "Activity", title: "Minimum Injections", description: "Only essential injections for optimum response — your comfort is our priority." },
    { icon: "Stethoscope", title: "Fewer Hospital Visits", description: "Sonography at your hometown. Reduced travel, reduced stress." },
    { icon: "CheckCircle2", title: "Zero Error Technique", description: "Our signature embryo transfer technique — simple, painless, precise." },
    { icon: "HeartHandshake", title: "Maximum Comfort", description: "No unnecessary rest. Return to your routine. Live your life normally." },
  ],
  steps: [
    { step: "01", icon: "ClipboardCheck", title: "Pre-treatment Evaluation", description: "Highly individualized, personalized, minimalistic. You are involved in the decision process — we explain every option, every outcome, so you make informed choices about your own body.", highlights: ["Personalized assessment", "Minimalistic approach", "You decide, we guide"] },
    { step: "02", icon: "Syringe", title: "Simple Treatment", description: "Focuses on maximizing your comfort by reducing injections and hospital visits to the bare minimum. Only essential injections for optimum response. Oral and vaginal drugs preferred. Self-injection encouraged. Sonography at your hometown.", highlights: ["Minimum injections & dosage", "Oral/vaginal drugs preferred", "Sonography at hometown"] },
    { step: "03", icon: "Egg", title: "Ovum Pickup", description: "Very light and short anaesthesia — you are comfortable throughout. Discharged in just 2 hours. We use the most comfortable OT position and minimize nil-by-mouth time so you can eat sooner.", highlights: ["Light, short anaesthesia", "Discharged in 2 hours", "Minimum fasting time"] },
    { step: "04", icon: "Sparkles", title: "Embryo Transfer", description: "Our signature 'Zero Error' technique makes this simple, painless, and easy. After the procedure, you enjoy a brief relaxation session — and can leave and start work after just a few hours.", highlights: ["Signature 'Zero Error' technique", "Simple, painless, easy", "Back to work in hours"] },
    { step: "05", icon: "HeartHandshake", title: "Post Embryo Transfer", description: "NO REST required. We actively encourage you to maintain your routine lifestyle and work. Only minimum required medicines are prescribed. A simple blood pregnancy test can be done at home.", highlights: ["No bed rest needed", "Routine lifestyle encouraged", "Pregnancy test at home"] },
  ],
  quote: {
    quote: "We believe the hardest journey deserves the simplest path. Decades of expertise & the most advanced reproductive technology, brought together to make your IVF Simple",
    paragraph: "With over 100 years of combined IVF experience, our specialists have refined every protocol to deliver maximum results with minimum complexity. Simple is not a compromise — it is the result of deep expertise.",
  },
  pillars: [
    { icon: "ClipboardCheck", title: "Simple to Understand", description: "We explain every step in plain language. No jargon, no confusion. You know exactly what is happening, why it is happening, and what comes next." },
    { icon: "CalendarCheck", title: "Simple to Plan", description: "Fewer hospital visits, hometown sonography, self-injection guidance. We fit the treatment around your life — not the other way around." },
    { icon: "Sparkles", title: "Simple to Undergo", description: "Minimum injections, light anaesthesia, no bed rest. Our Zero Error technique makes embryo transfer painless. You can return to work the same day." },
  ],
};

export type SimpleTreatmentSource =
  | {
      hero?: { eyebrow?: string; headline?: string; headlineEm?: string; paragraph?: string } | null;
      philosophy?: { icon?: string; title?: string; description?: string }[] | null;
      steps?: { step?: string; icon?: string; title?: string; description?: string; highlights?: { value?: string }[] }[] | null;
      quote?: { quote?: string; paragraph?: string } | null;
      pillars?: { icon?: string; title?: string; description?: string }[] | null;
    }
  | null
  | undefined;

export function resolveSimpleTreatment(src: SimpleTreatmentSource): SimpleTreatmentData {
  const d = SIMPLE_TREATMENT_DEFAULTS;
  if (!src) return d;

  const hero: STHero = src.hero?.headline
    ? {
        eyebrow: src.hero.eyebrow ?? d.hero.eyebrow,
        headline: src.hero.headline,
        headlineEm: src.hero.headlineEm ?? d.hero.headlineEm,
        paragraph: src.hero.paragraph ?? d.hero.paragraph,
      }
    : d.hero;

  const philosophy = src.philosophy?.length
    ? src.philosophy.map((p) => ({ icon: (p.icon ?? "Sparkles") as IconName, title: p.title ?? "", description: p.description ?? "" }))
    : d.philosophy;

  const steps: STStep[] = src.steps?.length
    ? src.steps.map((s) => ({
        step: s.step ?? "",
        icon: (s.icon ?? "Sparkles") as IconName,
        title: s.title ?? "",
        description: s.description ?? "",
        highlights: (s.highlights ?? []).map((h) => h.value ?? "").filter(Boolean),
      }))
    : d.steps;

  const quote: STQuote = src.quote?.quote ? { quote: src.quote.quote, paragraph: src.quote.paragraph ?? d.quote.paragraph } : d.quote;

  const pillars = src.pillars?.length
    ? src.pillars.map((p) => ({ icon: (p.icon ?? "Sparkles") as IconName, title: p.title ?? "", description: p.description ?? "" }))
    : d.pillars;

  return { hero, philosophy, steps, quote, pillars };
}

export function materializeSimpleTreatmentSource(src: SimpleTreatmentSource): NonNullable<SimpleTreatmentSource> {
  const r = resolveSimpleTreatment(src);
  const s = (src ?? {}) as NonNullable<SimpleTreatmentSource>;
  return {
    ...s,
    hero: r.hero,
    philosophy: r.philosophy,
    quote: r.quote,
    pillars: r.pillars,
    steps: r.steps.map((st) => ({ step: st.step, icon: st.icon, title: st.title, description: st.description, highlights: st.highlights.map((value) => ({ value })) })),
  };
}
