"use client";
import { CategoryHubPage } from "@/components/category-hub-page";
import { resolveIcon } from "@/lib/icon-map";
import type { CategoryHubData } from "@/lib/category-hub";

export function FemaleInfertilityHub({ data }: { data: CategoryHubData }) {
  return (
    <CategoryHubPage
      eyebrow={data.eyebrow}
      title={data.title}
      titleAccent={data.titleAccent}
      subtitle={data.subtitle}
      breadcrumbLabel={data.breadcrumbLabel}
      cards={data.cards.map((c) => ({ ...c, icon: resolveIcon(c.icon) }))}
      cardsSectionTitle={data.cardsSectionTitle}
      cardsSectionSubtitle={data.cardsSectionSubtitle}
      stats={data.stats}
      overviewTitle={data.overviewTitle}
      overviewTitleAccent={data.overviewTitleAccent}
      overviewParagraphs={data.overviewParagraphs}
      overviewBullets={data.overviewBullets}
      signsTitle={data.signsTitle}
      signsTitleAccent={data.signsTitleAccent}
      signsSubtitle={data.signsSubtitle}
      signs={data.signs}
      whyTitle={data.whyTitle}
      whyTitleAccent={data.whyTitleAccent}
      whyPoints={data.whyPoints.map((p) => ({ ...p, icon: resolveIcon(p.icon) }))}
      faqs={data.faqs}
      heroImage={data.heroImage}
      heroImageAlt={data.heroImageAlt}
      ctaHeading={data.ctaHeading}
      ctaSubtitle={data.ctaSubtitle}
    />
  );
}
