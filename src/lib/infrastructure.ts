/* =====================================================================
 * Infrastructure page resolver — maps the `infrastructurePage` singleton to
 * the plain, client-serialisable model <InfrastructurePage> renders. Same
 * convention as src/lib/suraksha-kavach.ts: PER-SECTION fallback to the
 * typed INFRASTRUCTURE_DEFAULTS so an empty/partial doc renders byte-
 * identically.
 *
 * SCOPE: hero, stats strip, facility cards, tech highlights, and the "Why
 * Class 1000" body copy are editable. The Staffing section's bullet list and
 * the Class 1000 deep-dive's bullet list stay code-owned (small, decorative
 * checklists rather than structured content).
 *
 * ICONS: facility/tech items carry icon NAMES (strings), mapped to Lucide
 * components in the view via resolveIcon().
 *
 * Pure module (no server-only imports) — safe to bundle into the client
 * <InfrastructurePage> component.
 * ===================================================================== */
import type { IconName } from "@/lib/icon-map";

export type InfraHero = { eyebrow: string; headline: string; headlineEm: string; paragraph: string };
export type InfraStat = { value: number; suffix: string; label: string; sub: string };
export type InfraFacility = { icon: IconName; title: string; description: string };
export type InfraTech = { icon: IconName; title: string; description: string };

export type InfrastructureData = {
  hero: InfraHero;
  stats: InfraStat[];
  facilities: InfraFacility[];
  techHighlights: InfraTech[];
};

export const INFRASTRUCTURE_DEFAULTS: InfrastructureData = {
  hero: {
    eyebrow: "World-Class Facilities",
    headline: "World-Class IVF Lab & Infrastructure",
    headlineEm: "& Infrastructure",
    paragraph: "Scientifically designed and aesthetically decorated centres combining functional proficiency with privacy and comfort — everything your fertility journey demands, all under one roof.",
  },
  stats: [
    { value: 14, suffix: "", label: "Centres", sub: "across 8 cities in India" },
    { value: 10, suffix: "x", label: "Superior Air Quality", sub: "Class 1000 vs Class 10,000" },
    { value: 25, suffix: "+", label: "Years of Excellence", sub: "pioneering IVF since 1998" },
    { value: 30000, suffix: "+", label: "Successful Pregnancies", sub: "across all centres" },
  ],
  facilities: [
    { icon: "Wind", title: "Class 1000 IVF Labs", description: "Our IVF laboratories maintain air purity that is 10 times superior to the international Class 10,000 standard. This ultra-clean environment is the purest possible setting for embryo development — protecting your embryos at every moment." },
    { icon: "FlaskConical", title: "Dedicated IVF Lab Complex", description: "Separate IVF lab, andrology lab, and cryology lab — each purpose-built for its specialised function. Complete lab infrastructure under one roof means no compromise at any stage of the process." },
    { icon: "Microscope", title: "Advanced Equipment", description: "Cutting-edge 3D/4D sonography, advanced endoscopy suites, and next-generation IVF laboratory equipment. At Bavishi Fertility Institute, every piece of technology is the best available — because your embryos deserve nothing less." },
    { icon: "Building2", title: "Separate Operating Theatres", description: "Dedicated IVF operating theatres and separate endoscopy operating theatres for specialised procedures. Purpose-built spaces ensure the highest standards of sterility and procedural efficiency." },
    { icon: "Users", title: "Patient Comfort Areas", description: "Multiple private consulting rooms, dedicated counselling rooms, and comfortable waiting and recovery areas. Every space is designed for privacy, dignity, and your emotional wellbeing." },
    { icon: "Monitor", title: "Self-Sufficient Centres", description: "Every Bavishi Fertility Institute centre is a standalone facility equipped to handle even the most advanced cases. No need for external referrals — everything you need is available in one place." },
  ],
  techHighlights: [
    { icon: "Wind", title: "HEPA-Filtered Laminar Flow Hoods", description: "Ultra-clean workstations that remove 99.97% of airborne particles, creating a sterile environment for embryo handling and preparation." },
    { icon: "Thermometer", title: "AI-Integrated Trigas Incubators", description: "Smart incubators with AI monitoring and alarm systems that precisely regulate oxygen, CO₂, and nitrogen levels — mimicking the natural environment of the womb." },
    { icon: "ShieldCheck", title: "Temperature Monitoring Systems", description: "Continuous, automated temperature monitoring across all laboratories and storage areas. Any deviation triggers immediate alerts to protect your embryos 24/7." },
    { icon: "ClipboardList", title: "International-Standard Data Management", description: "Patient data management systems built to international benchmarks — ensuring accuracy, security, and seamless coordination across all departments." },
    { icon: "Eye", title: "Double-Witnessing Protocols", description: "Every critical step — from egg retrieval to embryo transfer — is verified by two independent professionals. A rigorous safety protocol that eliminates the possibility of error." },
  ],
};

export type InfrastructureSource =
  | {
      hero?: { eyebrow?: string; headline?: string; headlineEm?: string; paragraph?: string } | null;
      stats?: { value?: number; suffix?: string; label?: string; sub?: string }[] | null;
      facilities?: { icon?: string; title?: string; description?: string }[] | null;
      techHighlights?: { icon?: string; title?: string; description?: string }[] | null;
    }
  | null
  | undefined;

export function resolveInfrastructure(src: InfrastructureSource): InfrastructureData {
  const d = INFRASTRUCTURE_DEFAULTS;
  if (!src) return d;

  const hero: InfraHero = src.hero?.headline
    ? {
        eyebrow: src.hero.eyebrow ?? d.hero.eyebrow,
        headline: src.hero.headline,
        headlineEm: src.hero.headlineEm ?? d.hero.headlineEm,
        paragraph: src.hero.paragraph ?? d.hero.paragraph,
      }
    : d.hero;

  const stats = src.stats?.length ? src.stats.map((s) => ({ value: s.value ?? 0, suffix: s.suffix ?? "", label: s.label ?? "", sub: s.sub ?? "" })) : d.stats;
  const facilities = src.facilities?.length
    ? src.facilities.map((f) => ({ icon: (f.icon ?? "Sparkles") as IconName, title: f.title ?? "", description: f.description ?? "" }))
    : d.facilities;
  const techHighlights = src.techHighlights?.length
    ? src.techHighlights.map((t) => ({ icon: (t.icon ?? "Sparkles") as IconName, title: t.title ?? "", description: t.description ?? "" }))
    : d.techHighlights;

  return { hero, stats, facilities, techHighlights };
}

export function materializeInfrastructureSource(src: InfrastructureSource): NonNullable<InfrastructureSource> {
  const r = resolveInfrastructure(src);
  const s = (src ?? {}) as NonNullable<InfrastructureSource>;
  return { ...s, hero: r.hero, stats: r.stats, facilities: r.facilities, techHighlights: r.techHighlights };
}
