import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { localeAlternates, abs } from "@/lib/seo";
import { getCalculator, CALCULATOR_SLUGS, isCalculatorSlug } from "@/lib/calculators";
import { withPageSeoOverride } from "@/lib/page-seo";
import { calcGraph, CalculatorWidget } from "@/components/calculator-widget";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return CALCULATOR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isCalculatorSlug(slug)) return {};
  const cms = await getCalculator(slug, "gu");
  if (!cms) return {};
  const title       = cms.seo.metaTitle       ?? cms.title;
  const description = cms.seo.metaDescription ?? cms.subtitle;
  const path        = `/calculators/${slug}`;
  return withPageSeoOverride(path, {
    title,
    description,
    alternates: localeAlternates(path),
    openGraph: {
      title:       cms.seo.ogTitle       ?? title,
      description: cms.seo.ogDescription ?? description,
      url:         abs(path),
      type:        "article",
      images:      cms.seo.ogImage ? [cms.seo.ogImage] : ["/assets/hero-mother-baby1.png"],
    },
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!isCalculatorSlug(slug)) notFound();
  const cms = await getCalculator(slug, "gu");
  if (!cms) notFound();
  return (
    <>
      <JsonLd graph={calcGraph(cms)} />
      <PageSeoSchema path={`/calculators/${slug}`} />
      <CalculatorWidget slug={slug} cms={cms} />
    </>
  );
}
