/* =====================================================================
 * Smart Treatment page resolver — maps the `smartTreatmentPage` singleton to
 * the plain, client-serialisable model <SmartTreatmentPage> renders. Same
 * convention as src/lib/suraksha-kavach.ts: PER-SECTION fallback to the
 * typed SMART_TREATMENT_DEFAULTS so an empty/partial doc renders byte-
 * identically.
 *
 * SCOPE: hero, the smart-pillars pill row, the 8 smart-feature cards (each
 * with highlight tags), and the 4 cost-package cards are editable. The
 * "Smart Diagnosis" 5-step list and the promise-banner items stay
 * code-owned (small, decorative checklists, same pattern as other pages).
 *
 * ICONS: pillars/features/packages carry icon NAMES (strings), mapped to
 * Lucide components in the view via resolveIcon().
 *
 * Pure module (no server-only imports) — safe to bundle into the client
 * <SmartTreatmentPage> component.
 * ===================================================================== */
import type { IconName } from "@/lib/icon-map";

export type SmtHero = { eyebrow: string; headline: string; headlineEm: string; paragraph: string };
export type SmtPillar = { icon: IconName; label: string };
export type SmtFeature = { icon: IconName; title: string; description: string; highlights: string[] };
export type SmtPackage = { icon: IconName; title: string; description: string };

export type SmartTreatmentData = {
  hero: SmtHero;
  pillars: SmtPillar[];
  features: SmtFeature[];
  packages: SmtPackage[];
};

export const SMART_TREATMENT_DEFAULTS: SmartTreatmentData = {
  hero: {
    eyebrow: "Intelligent Fertility Care",
    headline: "Smart Treatments and Steady Care Meets the Goal.",
    headlineEm: "Meets the Goal.",
    paragraph: "The most important decision of your life — having a child and starting a family — calls for a personalized smart strategy. At Bavishi Fertility Institute, every step is intelligent, every choice is data-driven, and every outcome is optimized for your success.",
  },
  pillars: [
    { icon: "Cpu", label: "Smart Technology" },
    { icon: "BarChart3", label: "Smart Monitoring" },
    { icon: "Target", label: "Smart Selection" },
    { icon: "Dna", label: "AI & Big Data" },
    { icon: "Cloud", label: "Cloud Computing" },
    { icon: "Wifi", label: "IoT Enabled" },
  ],
  features: [
    { icon: "Cpu", title: "Smart Use of Technology", description: "All technology under one roof — advanced IVF labs, ultrasound suites, operation theatres, and diagnostic centres. We carefully suggest only the treatment options worth the extra cost for your individual case, never unnecessary add-ons.", highlights: ["State-of-the-art IVF laboratory", "Integrated diagnostic centre", "Cost-effective technology recommendations"] },
    { icon: "Activity", title: "Smart Monitoring", description: "We monitor all clinical and IVF lab KPIs — fertilization rate, embryo formation rate, embryo quality index, and more. Early problem detection before it affects your outcomes gives us the advantage of course-correcting in real time.", highlights: ["Real-time lab KPI tracking", "Fertilization & embryo quality index", "Early anomaly detection"] },
    { icon: "Target", title: "Smart Treatment Selection", description: "Correct and smart choice of treatment is the first step to your success. Our team has a unique ability to predict IVF success at the start of treatment and again at embryo transfer — giving you clarity and confidence at every stage.", highlights: ["Predictive success modelling", "Personalized protocol selection", "Evidence-based decision making"] },
    { icon: "Dna", title: "Smart Use of Latest Techniques", description: "We harness big data, cloud computing, and artificial intelligence to refine treatment protocols. IoT technology powers our smart fertility clinic — from incubator monitoring to environmental control in the embryology lab.", highlights: ["AI-assisted embryo selection", "Cloud-based data analytics", "IoT-enabled lab environment"] },
    { icon: "MapPin", title: "Patient Convenience", description: "Your treatment is managed at your local town or city. You visit the centre only for key procedures — no unnecessary trips. We stay flexible with your schedule so that fertility treatment fits into your life, not the other way around.", highlights: ["Local treatment management", "Visit only for procedures", "Flexible scheduling"] },
    { icon: "ListChecks", title: "Canny Blueprint of Timeline", description: "Our team walks the extra mile to streamline your journey. Reports and prescriptions are prepared in advance. Complete notes for future planning ensure you always know the next step — no surprises, no confusion.", highlights: ["Advance report preparation", "Streamlined prescriptions", "Clear future planning notes"] },
    { icon: "Stethoscope", title: "Smart Diagnosis", description: "Diagnosis first, treatment later. We follow a step-by-step approach to identify the exact cause of infertility. Only pertinent tests are ordered — no blanket panels, no unnecessary investigations, no wasted time or money.", highlights: ["Systematic cause identification", "Only pertinent tests ordered", "Evidence-based diagnostics"] },
    { icon: "Building2", title: "Patient-Centric Architecture", description: "Every department in our centres is designed to be patient-centric. Consultations, labs, scans, and procedures are all under one roof — no transferring from one end of the building to another, no navigating a maze of corridors.", highlights: ["All departments under one roof", "Seamless patient flow", "Comfort-first clinic design"] },
  ],
  packages: [
    { icon: "IndianRupee", title: "Best Treatment at Optimal Pricing", description: "Economy of scale across 14 centres means you receive world-class treatment at a fraction of the cost charged by standalone clinics. Smart packages for every pocket." },
    { icon: "Heart", title: "Three-Cycle Packages", description: "Our multi-cycle packages maximise your chances of success while reducing per-cycle cost. A structured plan that gives you the best shot at parenthood." },
    { icon: "Shield", title: "Suraksha Kavach Package", description: "India's only IVF protection program. It promises at least one healthy baby — and if medical circumstances prevent your success, the package is fully transferable to a loved one." },
    { icon: "CreditCard", title: "Easy EMI at 0% Interest", description: "Digital payment options, secure online portals, and 0% interest EMI available — because financial barriers should never stand between you and parenthood." },
  ],
};

export type SmartTreatmentSource =
  | {
      hero?: { eyebrow?: string; headline?: string; headlineEm?: string; paragraph?: string } | null;
      pillars?: { icon?: string; label?: string }[] | null;
      features?: { icon?: string; title?: string; description?: string; highlights?: { value?: string }[] }[] | null;
      packages?: { icon?: string; title?: string; description?: string }[] | null;
    }
  | null
  | undefined;

export function resolveSmartTreatment(src: SmartTreatmentSource): SmartTreatmentData {
  const d = SMART_TREATMENT_DEFAULTS;
  if (!src) return d;

  const hero: SmtHero = src.hero?.headline
    ? {
        eyebrow: src.hero.eyebrow ?? d.hero.eyebrow,
        headline: src.hero.headline,
        headlineEm: src.hero.headlineEm ?? d.hero.headlineEm,
        paragraph: src.hero.paragraph ?? d.hero.paragraph,
      }
    : d.hero;

  const pillars = src.pillars?.length ? src.pillars.map((p) => ({ icon: (p.icon ?? "Sparkles") as IconName, label: p.label ?? "" })) : d.pillars;

  const features: SmtFeature[] = src.features?.length
    ? src.features.map((f) => ({
        icon: (f.icon ?? "Sparkles") as IconName,
        title: f.title ?? "",
        description: f.description ?? "",
        highlights: (f.highlights ?? []).map((h) => h.value ?? "").filter(Boolean),
      }))
    : d.features;

  const packages = src.packages?.length
    ? src.packages.map((p) => ({ icon: (p.icon ?? "Sparkles") as IconName, title: p.title ?? "", description: p.description ?? "" }))
    : d.packages;

  return { hero, pillars, features, packages };
}

export function materializeSmartTreatmentSource(src: SmartTreatmentSource): NonNullable<SmartTreatmentSource> {
  const r = resolveSmartTreatment(src);
  const s = (src ?? {}) as NonNullable<SmartTreatmentSource>;
  return {
    ...s,
    hero: r.hero,
    pillars: r.pillars,
    packages: r.packages,
    features: r.features.map((f) => ({ icon: f.icon, title: f.title, description: f.description, highlights: f.highlights.map((value) => ({ value })) })),
  };
}
