import { cache as reactCache } from "react";
import { unstable_cache } from "next/cache";
import { payloadClient } from "@/lib/payload";
import { cacheTags } from "@/lib/cache-tags";

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

export const getCalculator = reactCache(
  (slug: string): Promise<CalculatorCmsData | null> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const res = await payload.find({
            collection: "calculators",
            where: { slug: { equals: slug } },
            limit: 1,
            depth: 1,
          });
          const doc = res.docs[0];
          if (!doc) return null;
          return {
            slug: doc.slug as string,
            title: (doc.title as string) ?? "",
            subtitle: (doc.subtitle as string) ?? "",
            disclaimer: (doc.disclaimer as string) ?? "",
            faqs: ((doc.faqs as { question: string; answer: string }[]) ?? []).map((f) => ({
              question: f.question,
              answer: f.answer,
            })),
            seo: {
              metaTitle: (doc.seo as { metaTitle?: string })?.metaTitle ?? null,
              metaDescription: (doc.seo as { metaDescription?: string })?.metaDescription ?? null,
              ogTitle: (doc.seo as { ogTitle?: string })?.ogTitle ?? null,
              ogDescription: (doc.seo as { ogDescription?: string })?.ogDescription ?? null,
              ogImage:
                typeof (doc.seo as { ogImage?: { url?: string } })?.ogImage === "object"
                  ? ((doc.seo as { ogImage?: { url?: string } })?.ogImage?.url ?? null)
                  : null,
            },
          };
        } catch {
          return null;
        }
      },
      ["calculator-by-slug", slug],
      { tags: [cacheTags.collectionList("calculators"), cacheTags.collectionItem("calculators", slug)] },
    )(),
);

export const getAllCalculators = reactCache(
  (): Promise<CalculatorCmsData[]> =>
    unstable_cache(
      async () => {
        try {
          const payload = await payloadClient();
          const res = await payload.find({ collection: "calculators", limit: 20, depth: 0 });
          return res.docs.map((doc) => ({
            slug: doc.slug as string,
            title: (doc.title as string) ?? "",
            subtitle: (doc.subtitle as string) ?? "",
            disclaimer: (doc.disclaimer as string) ?? "",
            faqs: [],
            seo: {},
          }));
        } catch {
          return [];
        }
      },
      ["calculators-all"],
      { tags: [cacheTags.collectionList("calculators")] },
    )(),
);
