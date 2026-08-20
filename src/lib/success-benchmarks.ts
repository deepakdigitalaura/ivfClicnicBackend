/* =====================================================================
 * Success Benchmarks page resolver — maps the `successBenchmarksPage`
 * singleton to the plain, client-serialisable model <SuccessBenchmarksPage>
 * renders. Same convention as src/lib/suraksha-kavach.ts: PER-SECTION
 * fallback to the typed SUCCESS_BENCHMARKS_DEFAULTS so an empty/partial doc
 * renders byte-identically.
 *
 * SCOPE: hero (incl. quote), hero stats strip, the 5 success-pillar cards
 * (each with highlight tags), and the 4 closing badges are editable. The
 * Technology Spotlight, Live Birth Focus, and Packages Teaser sections stay
 * code-owned — they repeat copy that's already editable elsewhere (Infra,
 * Suraksha Kavach) rather than introducing net-new structured content.
 *
 * ICONS: pillars/badges carry icon NAMES (strings), mapped to Lucide
 * components in the view via resolveIcon().
 *
 * Pure module (no server-only imports) — safe to bundle into the client
 * <SuccessBenchmarksPage> component.
 * ===================================================================== */
import type { IconName } from "@/lib/icon-map";

export type SbHero = { eyebrow: string; headline: string; headlineEm: string; paragraph: string; quote: string };
export type SbStat = { value: number; suffix: string; label: string };
export type SbPillar = { icon: IconName; title: string; description: string; highlights: string[] };
export type SbBadge = { icon: IconName; text: string };

export type SuccessBenchmarksData = {
  hero: SbHero;
  stats: SbStat[];
  pillars: SbPillar[];
  closingBadges: SbBadge[];
};

export const SUCCESS_BENCHMARKS_DEFAULTS: SuccessBenchmarksData = {
  hero: {
    eyebrow: "Proven Track Record",
    headline: "Our numbers speak.",
    headlineEm: "speak.",
    paragraph: "With over 30,000+ successful pregnancies and one of the highest success rates across India and the world!",
    quote: "Success is not a random incident; it is years of learning, observing, implementing best practices, and prudent use of technology and resources.",
  },
  stats: [
    { value: 30000, suffix: "+", label: "Successful Pregnancies" },
    { value: 25, suffix: "+", label: "Years of Excellence" },
    { value: 100, suffix: "+", label: "Years Combined Experience" },
    { value: 14, suffix: "", label: "Centres Across India" },
  ],
  pillars: [
    { icon: "FlaskConical", title: "Technology & Medicinal Science", description: "We invest in the latest equipment and maintain Class 1000 pure air labs — 10 times cleaner than European standards. ICSI is offered to most patients, and our protocols include Day 5 blastocyst transfers, PGS, laser-assisted hatching, pICSI, and IMSI when indicated — giving every embryo the best environment and every couple the best chance.", highlights: ["Class 1000 pure air IVF labs", "ICSI for maximum fertilisation", "Day 5 blastocyst culture & transfer", "PGS, pICSI, IMSI & laser-assisted hatching"] },
    { icon: "Users", title: "Humans Behind the Technology", description: "Technology alone doesn't create life — people do. Our team of internationally acclaimed fertility specialists has trained across India and abroad. They bring decades of clinical expertise, continuous knowledge upgradation, and an unwavering commitment to honest, sincere, and dedicated care.", highlights: ["Internationally acclaimed specialists", "Trained in India and abroad", "Continuous knowledge upgradation", "Honest, sincere & dedicated"] },
    { icon: "Heart", title: "Holistic Approach", description: "Success in IVF is not just about embryos and labs — it's about preparing the whole person. We conduct thorough pre-treatment evaluations to uncover every factor, prepare both body and mind for the journey ahead, and ensure mental preparedness for pregnancy and parenthood.", highlights: ["Thorough pre-treatment evaluation", "Body and mind preparation", "Mental preparedness for pregnancy"] },
    { icon: "Baby", title: "Not Just Pregnancy — Successful Live Birth", description: "Our definition of success is not a positive test — it's a healthy baby in your arms. We follow strict protocols to prevent higher-order multiple pregnancies, provide continuous pregnancy guidance and meticulous monitoring, and partner with the best maternity services to see you through delivery.", highlights: ["Protocols to prevent higher-order multiples", "Continuous pregnancy guidance", "Meticulous monitoring throughout", "Best maternity services partnership"] },
    { icon: "IndianRupee", title: "Unique IVF Packages", description: "World-class fertility care should not be a privilege. We offer calibrated packages for every pocket — from our three-cycle package that maximises your chances over multiple attempts to the Suraksha Kavach Package that gives you complete financial peace of mind.", highlights: ["Calibrated packages for every budget", "Three-cycle package for maximum chances", "Suraksha Kavach — complete peace of mind"] },
  ],
  closingBadges: [
    { icon: "Target", text: "Simple" },
    { icon: "ShieldCheck", text: "Safe" },
    { icon: "Sparkles", text: "Smart" },
    { icon: "TrendingUp", text: "Successful" },
  ],
};

export type SuccessBenchmarksSource =
  | {
      hero?: { eyebrow?: string; headline?: string; headlineEm?: string; paragraph?: string; quote?: string } | null;
      stats?: { value?: number; suffix?: string; label?: string }[] | null;
      pillars?: { icon?: string; title?: string; description?: string; highlights?: { value?: string }[] }[] | null;
      closingBadges?: { icon?: string; text?: string }[] | null;
    }
  | null
  | undefined;

export function resolveSuccessBenchmarks(src: SuccessBenchmarksSource): SuccessBenchmarksData {
  const d = SUCCESS_BENCHMARKS_DEFAULTS;
  if (!src) return d;

  const hero: SbHero = src.hero?.headline
    ? {
        eyebrow: src.hero.eyebrow ?? d.hero.eyebrow,
        headline: src.hero.headline,
        headlineEm: src.hero.headlineEm ?? d.hero.headlineEm,
        paragraph: src.hero.paragraph ?? d.hero.paragraph,
        quote: src.hero.quote ?? d.hero.quote,
      }
    : d.hero;

  const stats = src.stats?.length ? src.stats.map((s) => ({ value: s.value ?? 0, suffix: s.suffix ?? "", label: s.label ?? "" })) : d.stats;

  const pillars: SbPillar[] = src.pillars?.length
    ? src.pillars.map((p) => ({
        icon: (p.icon ?? "Sparkles") as IconName,
        title: p.title ?? "",
        description: p.description ?? "",
        highlights: (p.highlights ?? []).map((h) => h.value ?? "").filter(Boolean),
      }))
    : d.pillars;

  const closingBadges = src.closingBadges?.length
    ? src.closingBadges.map((b) => ({ icon: (b.icon ?? "Sparkles") as IconName, text: b.text ?? "" }))
    : d.closingBadges;

  return { hero, stats, pillars, closingBadges };
}

export function materializeSuccessBenchmarksSource(src: SuccessBenchmarksSource): NonNullable<SuccessBenchmarksSource> {
  const r = resolveSuccessBenchmarks(src);
  const s = (src ?? {}) as NonNullable<SuccessBenchmarksSource>;
  return {
    ...s,
    hero: r.hero,
    stats: r.stats,
    closingBadges: r.closingBadges,
    pillars: r.pillars.map((p) => ({ icon: p.icon, title: p.title, description: p.description, highlights: p.highlights.map((value) => ({ value })) })),
  };
}
