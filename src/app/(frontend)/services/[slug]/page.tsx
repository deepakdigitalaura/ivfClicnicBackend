import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/service-page";
import { JsonLd } from "@/components/json-ld";
import { serviceRegistryBySlug, builtServiceParams, serviceGraph } from "@/lib/womens-health";
import { getService, getPublishedServiceSlugs } from "@/lib/payload";
import { abs } from "@/lib/seo";

/* Pre-render the 6 code-registered services plus any additional services
 * published in the CMS. Unrecognised slugs still render on-demand via ISR. */
export async function generateStaticParams() {
  const codeParams = builtServiceParams();
  const dbSlugs = await getPublishedServiceSlugs();
  const seen = new Set(codeParams.map((p) => p.slug));
  const extra = dbSlugs.filter((s) => !seen.has(s)).map((s) => ({ slug: s }));
  return [...codeParams, ...extra];
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const content = await getService(slug);
  const reg = serviceRegistryBySlug(slug);
  if (!content) return {};
  return {
    title: content.meta.title,
    description: content.meta.description,
    ...(reg ? { alternates: { canonical: reg.href } } : {}),
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      ...(reg ? { url: abs(reg.href) } : {}),
      type: "article",
      images: content.hero.image ? [content.hero.image] : [],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getService(slug);
  if (!content) notFound();
  return (
    <>
      <JsonLd graph={serviceGraph(content)} />
      <ServicePage slug={slug} content={content} />
    </>
  );
}
