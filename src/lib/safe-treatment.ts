/* =====================================================================
 * Safe Treatment page resolver — maps the `safeTreatmentPage` singleton to
 * the plain, client-serialisable model <SafeTreatmentPage> renders. Same
 * convention as src/lib/suraksha-kavach.ts: PER-SECTION fallback to the
 * typed SAFE_TREATMENT_DEFAULTS so an empty/partial doc renders byte-
 * identically.
 *
 * SCOPE: hero, the 7 safety-feature cards, stats strip, and the protocols
 * checklist are editable. The OHSS-prevention and double-witness deep-dive
 * bullet lists stay code-owned (small, decorative checklists rather than
 * structured content, same as Infrastructure's staffing section).
 *
 * ICONS: safety features carry icon NAMES (strings), mapped to Lucide
 * components in the view via resolveIcon().
 *
 * Pure module (no server-only imports) — safe to bundle into the client
 * <SafeTreatmentPage> component.
 * ===================================================================== */
import type { IconName } from "@/lib/icon-map";

export type SafeHero = { eyebrow: string; headline: string; headlineEm: string; paragraph: string; mottoLabel: string; mottoText: string };
export type SafeFeature = { icon: IconName; title: string; description: string };
export type SafeStat = { value: number; suffix: string; label: string; sub: string };

export type SafeTreatmentData = {
  hero: SafeHero;
  features: SafeFeature[];
  stats: SafeStat[];
  protocols: string[];
};

export const SAFE_TREATMENT_DEFAULTS: SafeTreatmentData = {
  hero: {
    eyebrow: "Safety First, Safety for All",
    headline: "Absolute safety for your fertility treatment.",
    headlineEm: "fertility treatment.",
    paragraph: "At Bavishi Fertility Institute, safety isn't a feature — it's the foundation of everything we do. Double witnessing, 24x7 cloud monitoring of IVF labs, OHSS free protocol, Class 1000 labs and much more, every detail is engineered to protect you and your future child.",
    mottoLabel: "Our Motto",
    mottoText: "Safety First, Safety for All — the principle behind every procedure",
  },
  features: [
    { icon: "ShieldCheck", title: "Genetic Safety", description: "Strict sample tracking using IVF-grade labels with a rigorous \"double-witness\" protocol — two professionals oversee every critical procedure including sperm freezing, sperm capacitation, oocyte recovery, insemination, micro-injection, embryo transfer, and cryopreservation." },
    { icon: "Syringe", title: "Infection Prevention", description: "Mandatory infection testing for every patient before treatment begins. Potentially infected samples are stored in separate, dedicated containers to eliminate any risk of cross-contamination." },
    { icon: "HeartPulse", title: "OHSS-Free Clinic", description: "Bavishi Fertility Institute is an OHSS-free clinic. Our signature prevention protocols have ensured zero severe OHSS cases in over a decade — a record we are deeply proud of." },
    { icon: "Wind", title: "Class 1000 IVF Labs", description: "Our labs maintain air quality ten times cleaner than European standards. HEPA-filtered laminar flow hoods, AI-integrated trigas incubators with smart alarm systems, and continuous temperature monitoring at 37°C." },
    { icon: "Baby", title: "Personalised Embryo Transfer", description: "Your ET is personalized not prescribed. Single embryo transfer, where it protects you best. A two-embryo transfer, where it's clinically sound and clearly understood. Every decision made with you, in full light." },
    { icon: "Microscope", title: "Clinical Safety", description: "National Accreditation Board for Hospitals, an apex organization to accredit, has strict criteria for infrastructure and protocols and SOPs for patient safety. Our centers are NABH accredited or under plan to get accreditation." },
    { icon: "Lock", title: "Patient Confidentiality", description: "Your medical records, treatment details, and personal information are fully protected with strict confidentiality protocols. Your privacy is non-negotiable." },
  ],
  stats: [
    { value: 10, suffix: "+ Years", label: "OHSS Free", sub: "zero severe cases in over a decade" },
    { value: 1000, suffix: "", label: "Class 1000 (10X Clean Air) IVF Labs", sub: "ten times cleaner than EU standards" },
    { value: 2, suffix: "x", label: "Double-Witness", sub: "two professionals at every step" },
    { value: 100, suffix: "%", label: "Infection Screened", sub: "mandatory testing for every patient" },
  ],
  protocols: [
    "IVF-grade sample labelling and tracking",
    "Double-witness protocol for all critical procedures",
    "Mandatory pre-treatment infection screening",
    "Separate storage for potentially infected samples",
    "HEPA-filtered Class 1000 air quality in all labs",
    "AI-integrated trigas incubators with smart alarms",
    "Continuous 37°C temperature monitoring",
    "Regular equipment maintenance and calibration",
    "Elective personalized embryo transfer (ET) protocol",
    "Strict patient data confidentiality measures",
  ],
};

export type SafeTreatmentSource =
  | {
      hero?: { eyebrow?: string; headline?: string; headlineEm?: string; paragraph?: string; mottoLabel?: string; mottoText?: string } | null;
      features?: { icon?: string; title?: string; description?: string }[] | null;
      stats?: { value?: number; suffix?: string; label?: string; sub?: string }[] | null;
      protocols?: { value?: string }[] | null;
    }
  | null
  | undefined;

export function resolveSafeTreatment(src: SafeTreatmentSource): SafeTreatmentData {
  const d = SAFE_TREATMENT_DEFAULTS;
  if (!src) return d;

  const hero: SafeHero = src.hero?.headline
    ? {
        eyebrow: src.hero.eyebrow ?? d.hero.eyebrow,
        headline: src.hero.headline,
        headlineEm: src.hero.headlineEm ?? d.hero.headlineEm,
        paragraph: src.hero.paragraph ?? d.hero.paragraph,
        mottoLabel: src.hero.mottoLabel ?? d.hero.mottoLabel,
        mottoText: src.hero.mottoText ?? d.hero.mottoText,
      }
    : d.hero;

  const features = src.features?.length
    ? src.features.map((f) => ({ icon: (f.icon ?? "Sparkles") as IconName, title: f.title ?? "", description: f.description ?? "" }))
    : d.features;

  const stats = src.stats?.length ? src.stats.map((s) => ({ value: s.value ?? 0, suffix: s.suffix ?? "", label: s.label ?? "", sub: s.sub ?? "" })) : d.stats;
  const protocols = src.protocols?.length ? src.protocols.map((p) => p.value ?? "").filter(Boolean) : d.protocols;

  return { hero, features, stats, protocols };
}

export function materializeSafeTreatmentSource(src: SafeTreatmentSource): NonNullable<SafeTreatmentSource> {
  const r = resolveSafeTreatment(src);
  const s = (src ?? {}) as NonNullable<SafeTreatmentSource>;
  return { ...s, hero: r.hero, features: r.features, stats: r.stats, protocols: r.protocols.map((value) => ({ value })) };
}
