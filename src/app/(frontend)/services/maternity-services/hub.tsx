"use client";
import { HeartPulse } from "lucide-react";
import { CategoryHubPage, type HubCard } from "@/components/category-hub-page";
import { resolveIcon } from "@/lib/icon-map";
import type { CategoryHubData } from "@/lib/category-hub";

type ExtraServiceCard = { title: string; desc: string; href: string };

export function MaternityServicesHub({ data, extraCards = [] }: { data: CategoryHubData; extraCards?: ExtraServiceCard[] }) {
  const allCards: HubCard[] = [
    ...data.cards.map((c) => ({ ...c, icon: resolveIcon(c.icon) })),
    ...extraCards.map((c) => ({ ...c, icon: HeartPulse })),
  ];
  return (
    <CategoryHubPage
      eyebrow={data.eyebrow}
      title={data.title}
      titleAccent={data.titleAccent}
      subtitle={data.subtitle}
      breadcrumbLabel={data.breadcrumbLabel}
      cards={allCards}
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
      logoSrc="/assets/bavishi-fertility-birthing.png"
      logoAlt="Bavishi Fertility & Birthing"
    />
  );
}
