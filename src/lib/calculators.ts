import { cache as reactCache } from "react";
import { unstable_cache } from "next/cache";
import { getSanityCalculator } from "@/sanity/lib/fetch";
import type { Locale } from "@/lib/i18n";

export type CalculatorFaq = { question: string; answer: string };

export type CalculatorCmsData = {
  slug: string;
  title: string;
  subtitle: string;
  disclaimer: string;
  faqs: CalculatorFaq[];
  seo: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
  };
};

export const CALCULATOR_SLUGS = [
  "ivf-success-rate",
  "ivf-cost",
  "ovulation",
  "natural-pregnancy",
  "fertile-period",
  "amh-level",
  "semen-analysis",
  "miscarriage-risk",
] as const;

export type CalculatorSlug = (typeof CALCULATOR_SLUGS)[number];

export function isCalculatorSlug(s: string): s is CalculatorSlug {
  return (CALCULATOR_SLUGS as readonly string[]).includes(s);
}

const CALCULATOR_DEFAULTS: Record<string, Pick<CalculatorCmsData, "title" | "subtitle" | "disclaimer">> = {
  "ivf-success-rate":  { title: "IVF Success Rate Calculator", subtitle: "Estimate your IVF success probability based on key fertility factors.", disclaimer: "" },
  "ivf-cost":          { title: "IVF Cost Calculator", subtitle: "Get a personalised cost estimate for IVF treatment at BFI.", disclaimer: "" },
  "ovulation":         { title: "Ovulation & Pregnancy Calculator", subtitle: "Track your fertile window and predict your most fertile days.", disclaimer: "" },
  "natural-pregnancy": { title: "Natural Pregnancy Calculator", subtitle: "Understand your natural conception chances based on key factors.", disclaimer: "" },
  "fertile-period":    { title: "Fertile Period Calculator", subtitle: "Calculate your fertile window based on your menstrual cycle.", disclaimer: "" },
  "amh-level":         { title: "AMH Level Interpreter", subtitle: "Interpret your Anti-Müllerian Hormone (AMH) level and what it means for your fertility.", disclaimer: "" },
  "semen-analysis":    { title: "Semen Analysis Calculator", subtitle: "Understand your semen analysis results and what they mean.", disclaimer: "" },
  "miscarriage-risk":  { title: "Miscarriage Risk Calculator", subtitle: "Understand the risk factors associated with miscarriage.", disclaimer: "" },
};

export const getCalculator = reactCache(
  (slug: string, locale: Locale = "en"): Promise<CalculatorCmsData | null> =>
    unstable_cache(
      async () => {
        if (!isCalculatorSlug(slug)) return null;
        const defaults = CALCULATOR_DEFAULTS[slug];
        const cms = await getSanityCalculator(slug, locale);
        const faqs = cms?.faqs?.length
          ? cms.faqs.map((f) => ({ question: f.question ?? "", answer: f.answer ?? "" }))
          : [];
        return {
          slug,
          title: cms?.title || defaults?.title || slug,
          subtitle: cms?.subtitle || defaults?.subtitle || "",
          disclaimer: cms?.disclaimer || defaults?.disclaimer || "",
          faqs,
          seo: {
            metaTitle: cms?.seo?.metaTitle ?? null,
            metaDescription: cms?.seo?.metaDescription ?? null,
            ogTitle: cms?.seo?.ogTitle ?? null,
            ogDescription: cms?.seo?.ogDescription ?? null,
            ogImage: null,
          },
        };
      },
      ["calculator-by-slug", slug, locale],
      { revalidate: 86400, tags: [`calculator-${slug}`] },
    )(),
);

export const getAllCalculators = async (): Promise<CalculatorCmsData[]> =>
  Promise.all(CALCULATOR_SLUGS.map((slug) => getCalculator(slug))).then(
    (results) => results.filter((c): c is CalculatorCmsData => c !== null),
  );
