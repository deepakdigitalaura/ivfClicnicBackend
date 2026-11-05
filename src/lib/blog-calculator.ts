/* =====================================================================
 * Blog -> calculator matching
 * ---------------------------------------------------------------------
 * Why this exists: the blog posts carry almost all of the site's search
 * impressions but convert at well under 1%, while the calculators convert
 * at 5-10% on a fraction of the traffic. A reader who finishes an article
 * is told nothing to do next except read another article. This maps a post
 * to the one calculator a reader of that post would actually find useful.
 *
 * Rules are ordered: the first match wins, so specific clinical terms come
 * before general intent, and general intent before cycle timing. A post
 * that matches nothing returns null and renders no block at all — an
 * irrelevant calculator is worse than none.
 * ===================================================================== */
import type { CalculatorSlug } from "@/lib/calculators";

export type BlogCalculator = {
  slug: CalculatorSlug;
  title: string;
  /** Second line on the card: why THIS reader should click it. */
  blurb: string;
};

type Rule = BlogCalculator & { match: RegExp };

const RULES: Rule[] = [
  {
    match: /\bsperm\b|\bsemen\b|azoospermia|motility|morpholog|male (infertility|factor)/i,
    slug: "semen-analysis",
    title: "Semen Analysis Calculator",
    blurb: "Enter your report values and see what each number actually means.",
  },
  {
    match: /\bamh\b|egg quality|egg count|ovarian reserve|egg reserve|egg freezing/i,
    slug: "amh-level",
    title: "AMH Level Interpreter",
    blurb: "See what your AMH level means for your egg reserve and your options.",
  },
  {
    match: /miscarriage|pregnancy loss|recurrent loss/i,
    slug: "miscarriage-risk",
    title: "Miscarriage Risk Calculator",
    blurb: "Understand the risk factors that apply to your own situation.",
  },
  {
    match: /ivf cost|cost of ivf|treatment cost|\bemi\b|afford|budget/i,
    slug: "ivf-cost",
    title: "IVF Cost Calculator",
    blurb: "Get a personalised estimate before you book a consultation.",
  },
  {
    match: /embryo transfer|implantation|\bivf\b|\biui\b|\bicsi\b|stimulation|blastocyst/i,
    slug: "ivf-success-rate",
    title: "IVF Success Rate Calculator",
    blurb: "See your estimated chance of success from your own age and history.",
  },
  {
    match: /fertile (window|period|days)/i,
    slug: "fertile-period",
    title: "Fertile Period Calculator",
    blurb: "Work out the days in your cycle when conception is most likely.",
  },
  {
    match: /conceiv|get(ting)? pregnant|trying for a baby|chances of pregnan|natural pregnan/i,
    slug: "natural-pregnancy",
    title: "Natural Pregnancy Calculator",
    blurb: "See your natural conception chances before considering treatment.",
  },
  {
    match: /ovulat|menstrual|\bperiods?\b|\bcycle\b|letrozole|clomid|after birth|postpartum|after delivery/i,
    slug: "ovulation",
    title: "Ovulation & Pregnancy Calculator",
    blurb: "Track your cycle and find your most fertile days.",
  },
];

/** The one calculator worth offering a reader of this post, or null. */
export function calculatorForBlog(
  title: string | null | undefined,
  category?: string | null,
): BlogCalculator | null {
  const haystack = `${title ?? ""} ${category ?? ""}`;
  if (!haystack.trim()) return null;
  const hit = RULES.find((r) => r.match.test(haystack));
  return hit ? { slug: hit.slug, title: hit.title, blurb: hit.blurb } : null;
}
