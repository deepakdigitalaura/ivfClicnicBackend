import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/service-page";
import { JsonLd } from "@/components/json-ld";
import { serviceRegistryBySlug, builtServiceParams, serviceGraph } from "@/lib/womens-health";
import { getService } from "@/lib/payload";
import { abs } from "@/lib/seo";

/* Pre-render every published maternity service. The published gate stays
 * code-driven in 4.1 (registry), so the static route set is identical regardless
 * of CMS/DB state — the per-page CONTENT is what resolves from the CMS (with a
 * per-section fallback to the typed defaults). */
export function generateStaticParams() {
  return builtServiceParams();
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const content = await getService(slug);
  const reg = serviceRegistryBySlug(slug);
  if (!content || !reg) return {};
  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: { canonical: reg.href },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url: abs(reg.href),
      type: "article",
      images: [content.hero.image],
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
