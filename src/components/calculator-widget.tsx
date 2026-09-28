import { abs, ORG_ID, WEBSITE_ID, breadcrumbSchema } from "@/lib/seo";
import type { CalculatorCmsData } from "@/lib/calculators";
import type { Locale } from "@/lib/i18n";

import { IvfSuccessRateCalculatorPage } from "@/components/ivf-success-rate-calculator";
import { IvfCostCalculatorPage } from "@/components/ivf-cost-calculator";
import { OvulationPregnancyCalculatorPage } from "@/components/ovulation-pregnancy-calculator";
import { NaturalPregnancyCalculatorPage } from "@/components/natural-pregnancy-calculator";
import { FertilePeriodCalculatorPage } from "@/components/fertile-period-calculator";
import { AmhLevelInterpreterPage } from "@/components/amh-level-interpreter";
import { SemenAnalysisCalculatorPage } from "@/components/semen-analysis-calculator";
import { MiscarriageRiskCalculatorPage } from "@/components/miscarriage-risk-calculator";

export function calcGraph(cms: CalculatorCmsData) {
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
      { name: "Calculators", url: "/calculators" },
      { name: cms.title,     url: path },
    ]),
  ];
}

export function CalculatorWidget({ slug, cms, locale = "en" }: { slug: string; cms: CalculatorCmsData; locale?: Locale }) {
  switch (slug) {
    case "ivf-success-rate":  return <IvfSuccessRateCalculatorPage cms={cms} locale={locale} />;
    case "ivf-cost":          return <IvfCostCalculatorPage cms={cms} locale={locale} />;
    case "ovulation":         return <OvulationPregnancyCalculatorPage cms={cms} locale={locale} />;
    case "natural-pregnancy": return <NaturalPregnancyCalculatorPage cms={cms} locale={locale} />;
    case "fertile-period":    return <FertilePeriodCalculatorPage cms={cms} locale={locale} />;
    case "amh-level":         return <AmhLevelInterpreterPage cms={cms} locale={locale} />;
    case "semen-analysis":    return <SemenAnalysisCalculatorPage cms={cms} locale={locale} />;
    case "miscarriage-risk":  return <MiscarriageRiskCalculatorPage cms={cms} locale={locale} />;
    default:                  return null;
  }
}
