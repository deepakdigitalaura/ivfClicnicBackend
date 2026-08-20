/* =====================================================================
 * History page resolver — maps the `historyPage` singleton to the plain,
 * client-serialisable model <HistoryPage> renders. Same convention as
 * src/lib/suraksha-kavach.ts: PER-SECTION fallback to the typed
 * HISTORY_DEFAULTS so an empty/partial doc renders byte-identically.
 *
 * NOTE: the "Legacy Timeline" section is intentionally NOT modelled here —
 * it reuses About-BFI's resolved `legacy`/`milestones` (src/lib/about.ts),
 * so editing the timeline in the About Page admin (Legacy & Stats tab)
 * reflects here too, instead of duplicating that editor. The page component
 * receives the resolved About legacy/milestones as separate props.
 *
 * Pure module (no server-only imports) — safe to bundle into the client
 * <HistoryPage> component.
 * ===================================================================== */

export type HistoryHero = { eyebrow: string; headline: string; headlineEm: string; paragraph: string };
export type HistoryPresentDay = { heading: string; paragraph: string };

export type HistoryData = {
  hero: HistoryHero;
  presentDay: HistoryPresentDay;
};

export const HISTORY_DEFAULTS: HistoryData = {
  hero: {
    eyebrow: "Our History",
    headline: "From Humble Beginnings to Best in India",
    headlineEm: "Best in India",
    paragraph: "From 1986 to the present day, here are some of the landmark achievements we've made over the years.",
  },
  presentDay: {
    heading: "India's No. 1 Fertility Institute",
    paragraph:
      'Today, Bavishi Fertility Institute has achieved <strong class="text-[color:var(--plum)]">30,000+ successful pregnancies</strong> across 14 centres in 8 cities. Our commitment remains the same as day one: excellence in service quality, cutting-edge reproductive technology, and unconditional patient support at every step of the journey.',
  },
};

export type HistorySource =
  | {
      hero?: { eyebrow?: string; headline?: string; headlineEm?: string; paragraph?: string } | null;
      presentDay?: { heading?: string; paragraph?: string } | null;
    }
  | null
  | undefined;

export function resolveHistory(src: HistorySource): HistoryData {
  const d = HISTORY_DEFAULTS;
  if (!src) return d;

  const hero: HistoryHero = src.hero?.headline
    ? {
        eyebrow: src.hero.eyebrow ?? d.hero.eyebrow,
        headline: src.hero.headline,
        headlineEm: src.hero.headlineEm ?? d.hero.headlineEm,
        paragraph: src.hero.paragraph ?? d.hero.paragraph,
      }
    : d.hero;

  const presentDay: HistoryPresentDay = src.presentDay?.heading
    ? {
        heading: src.presentDay.heading,
        paragraph: src.presentDay.paragraph ?? d.presentDay.paragraph,
      }
    : d.presentDay;

  return { hero, presentDay };
}

export function materializeHistorySource(src: HistorySource): NonNullable<HistorySource> {
  const r = resolveHistory(src);
  const s = (src ?? {}) as NonNullable<HistorySource>;
  return { ...s, hero: r.hero, presentDay: r.presentDay };
}
