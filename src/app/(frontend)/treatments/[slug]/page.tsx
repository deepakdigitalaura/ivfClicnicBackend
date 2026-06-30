import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { treatmentGraph } from "@/lib/treatments";
import { getTreatment, getTreatments, getBlogsByTreatmentSlug } from "@/lib/payload";
import { toBlogPost } from "@/lib/blogs";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const treatments = await getTreatments();
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTreatment(slug);
  if (!t) return {};
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: { canonical: t.href },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: t.href,
      type: "article",
      images: [t.meta.ogImage],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const t = await getTreatment(slug);
  if (!t) notFound();
  const cmsBlogs = (await getBlogsByTreatmentSlug(slug)).map(toBlogPost);
  return (
    <>
      <JsonLd graph={treatmentGraph(t)} />
      <TreatmentPage content={t} cmsBlogs={cmsBlogs} />
    </>
  );
}
