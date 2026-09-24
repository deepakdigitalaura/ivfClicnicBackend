import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { treatmentGraph } from "@/lib/treatments";
import { getTreatment, getTreatments, getBlogsByTreatmentSlug } from "@/lib/payload";
import { toBlogPost } from "@/lib/blogs";
import { withPageSeoOverride } from "@/lib/page-seo";
import { localeAlternates, abs } from "@/lib/seo";

const LOCALE = "gu" as const;
type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  const treatments = await getTreatments();
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTreatment(slug, LOCALE);
  if (!t) return {};
  const path = `/treatments/${slug}`;
  return withPageSeoOverride(path, {
    title: t.meta.title,
    description: t.meta.description,
    alternates: localeAlternates(path),
    openGraph: {
      title: t.meta.ogTitle || t.meta.title,
      description: t.meta.ogDescription || t.meta.description,
      url: abs(path),
      type: "article",
      images: [t.meta.ogImage],
    },
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const t = await getTreatment(slug, LOCALE);
  if (!t) notFound();
  const cmsBlogs = (await getBlogsByTreatmentSlug(slug)).map(toBlogPost);
  return (
    <>
      <JsonLd graph={treatmentGraph(t)} />
      <PageSeoSchema path={`/treatments/${slug}`} />
      <TreatmentPage content={t} cmsBlogs={cmsBlogs} locale={LOCALE} />
    </>
  );
}
