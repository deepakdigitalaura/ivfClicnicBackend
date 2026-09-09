import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PressArticlePage } from "@/components/press-article-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { breadcrumbSchema, abs, ORG_ID } from "@/lib/seo";
import { withPageSeoOverride } from "@/lib/page-seo";
import { PRESS_CLIPPINGS, pressClippingBySlug, pressHref } from "@/lib/press";

export async function generateStaticParams() {
  return PRESS_CLIPPINGS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const c = pressClippingBySlug(slug);
  if (!c) return {};

  const title = `${c.headline} — ${c.publication} | Bavishi Fertility Institute`;
  return withPageSeoOverride(pressHref(c.slug), {
    title,
    description: c.summary,
    alternates: { canonical: pressHref(c.slug) },
    openGraph: {
      title,
      description: c.summary,
      url: abs(pressHref(c.slug)),
      type: "article",
      images: [c.image],
    },
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const clipping = pressClippingBySlug(slug);
  if (!clipping) notFound();

  const graph = [
    {
      "@type": "NewsArticle",
      "@id": `${abs(pressHref(clipping.slug))}#article`,
      headline: clipping.headline,
      inLanguage: clipping.language === "Gujarati" ? "gu" : "en",
      ...(clipping.date ? { datePublished: clipping.date } : {}),
      ...(clipping.byline ? { author: { "@type": "Person", name: clipping.byline } } : {}),
      publisher: { "@type": "Organization", name: clipping.publication },
      image: abs(clipping.image),
      articleBody: clipping.bodyText.join("\n\n"),
      about: { "@id": ORG_ID },
      mainEntityOfPage: abs(pressHref(clipping.slug)),
    },
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Media & Press", url: "/press" },
      { name: clipping.headline, url: pressHref(clipping.slug) },
    ]),
  ];

  const others = PRESS_CLIPPINGS.filter((c) => c.slug !== clipping.slug);

  return (
    <>
      <JsonLd graph={graph} />
      <PageSeoSchema path={pressHref(clipping.slug)} />
      <PressArticlePage clipping={clipping} more={others} />
    </>
  );
}
