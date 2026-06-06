import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/service-page";
import { JsonLd } from "@/components/json-ld";
import {
  serviceContentBySlug,
  serviceRegistryBySlug,
  builtServiceParams,
  serviceGraph,
} from "@/lib/womens-health";
import { abs } from "@/lib/seo";

/** Pre-render every published maternity service (static export). */
export function generateStaticParams() {
  return builtServiceParams();
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceContentBySlug(slug);
  const reg = serviceRegistryBySlug(slug);
  if (!s || !reg) return {};
  return {
    title: s.meta.title,
    description: s.meta.description,
    alternates: { canonical: reg.href },
    openGraph: {
      title: s.meta.title,
      description: s.meta.description,
      url: abs(reg.href),
      type: "article",
      images: [s.hero.image],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = serviceContentBySlug(slug);
  if (!s) notFound();
  return (
    <>
      <JsonLd graph={serviceGraph(s)} />
      <ServicePage slug={s.slug} />
    </>
  );
}
