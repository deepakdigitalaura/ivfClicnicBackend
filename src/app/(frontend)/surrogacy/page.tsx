import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { treatmentGraph } from "@/lib/treatments";
import { getTreatment, getBlogsByTreatmentSlug } from "@/lib/payload";
import { toBlogPost } from "@/lib/blogs";

const SLUG = "surrogacy";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTreatment(SLUG);
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

export default async function Page() {
  const t = await getTreatment(SLUG);
  if (!t) notFound();
  const cmsBlogs = (await getBlogsByTreatmentSlug(SLUG)).map(toBlogPost);
  return (
    <>
      <JsonLd graph={treatmentGraph(t)} />
      <TreatmentPage content={t} cmsBlogs={cmsBlogs} />
    </>
  );
}
