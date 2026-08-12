import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { PageSeoSchema } from "@/components/page-seo-schema";
import { treatmentGraph } from "@/lib/treatments";
import { getTreatment, getTreatments, getBlogsByTreatmentSlug } from "@/lib/payload";
import { toBlogPost } from "@/lib/blogs";
import { withPageSeoOverride } from "@/lib/page-seo";

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
  // The canonical/OG URL is always this page's own route, not `t.href`
  // (a nav-link-destination override that can point at an old pre-migration
  // URL for some treatments — SEO audit finding, 2026-08-12).
  const canonicalPath = `/treatments/${slug}`;
  return withPageSeoOverride(canonicalPath, {
    title: t.meta.title,
    description: t.meta.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: canonicalPath,
      type: "article",
      images: [t.meta.ogImage],
    },
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const t = await getTreatment(slug);
  if (!t) notFound();
  const cmsBlogs = (await getBlogsByTreatmentSlug(slug)).map(toBlogPost);
  return (
    <>
      <JsonLd graph={treatmentGraph(t)} />
      <PageSeoSchema path={t.href} />
      <TreatmentPage content={t} cmsBlogs={cmsBlogs} />
    </>
  );
}
