import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { abs, ORG_ID, WEBSITE_ID, breadcrumbSchema } from "@/lib/seo";
import { getCalculator, CALCULATOR_SLUGS, isCalculatorSlug } from "@/lib/calculators";
import { withPageSeoOverride } from "@/lib/page-seo";
import type { CalculatorCmsData } from "@/lib/calculators";

import { IvfSuccessRateCalculatorPage } from "@/components/ivf-success-rate-calculator";
import { IvfCostCalculatorPage } from "@/components/ivf-cost-calculator";
import { OvulationPregnancyCalculatorPage } from "@/components/ovulation-pregnancy-calculator";
import { NaturalPregnancyCalculatorPage } from "@/components/natural-pregnancy-calculator";
import { FertilePeriodCalculatorPage } from "@/components/fertile-period-calculator";
import { AmhLevelInterpreterPage } from "@/components/amh-level-interpreter";
import { SemenAnalysisCalculatorPage } from "@/components/semen-analysis-calculator";
import { MiscarriageRiskCalculatorPage } from "@/components/miscarriage-risk-calculator";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return CALCULATOR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isCalculatorSlug(slug)) return {};
  const cms = await getCalculator(slug);
  if (!cms) return {};
  const title       = cms.seo.metaTitle       ?? cms.title;
  const description = cms.seo.metaDescription ?? cms.subtitle;
  const path        = `/calculators/${slug}`;
  return withPageSeoOverride(path, {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title:       cms.seo.ogTitle       ?? title,
      description: cms.seo.ogDescription ?? description,
      url:         abs(path),
      type:        "article",
      images:      cms.seo.ogImage ? [cms.seo.ogImage] : ["/assets/hero-mother-baby1.png"],
    },
  });
}

function calcGraph(cms: CalculatorCmsData) {
  const path = `/calculators/${cms.slug}`;
  return [
    {
      "@type": "WebApplication",
      "@id": `${abs(path)}#webapplication`,
      name: cms.title,
      url: abs(path),
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORG_ID },
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      description: cms.subtitle,
    },
    breadcrumbSchema([
      { name: "Home",        url: "/" },
      { name: "Calculators", url: "/#tools" },
      { name: cms.title,     url: path },
    ]),
  ];
}

function CalculatorWidget({ slug, cms }: { slug: string; cms: CalculatorCmsData }) {
  switch (slug) {
    case "ivf-success-rate":  return <IvfSuccessRateCalculatorPage cms={cms} />;
    case "ivf-cost":          return <IvfCostCalculatorPage cms={cms} />;
    case "ovulation":         return <OvulationPregnancyCalculatorPage cms={cms} />;
    case "natural-pregnancy": return <NaturalPregnancyCalculatorPage cms={cms} />;
    case "fertile-period":    return <FertilePeriodCalculatorPage cms={cms} />;
    case "amh-level":         return <AmhLevelInterpreterPage cms={cms} />;
    case "semen-analysis":    return <SemenAnalysisCalculatorPage cms={cms} />;
    case "miscarriage-risk":  return <MiscarriageRiskCalculatorPage cms={cms} />;
    default:                  return null;
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!isCalculatorSlug(slug)) notFound();
  const cms = await getCalculator(slug);
  if (!cms) notFound();
  return (
    <>
      <JsonLd graph={calcGraph(cms)} />
      <PageSeoSchema path={`/calculators/${slug}`} />
      <CalculatorWidget slug={slug} cms={cms} />
    </>
  );
}
