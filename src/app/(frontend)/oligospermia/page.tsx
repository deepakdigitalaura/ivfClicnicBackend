import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TreatmentPage } from "@/components/treatment-page";
import { JsonLd } from "@/components/json-ld";
import { treatmentGraph } from "@/lib/treatments";
import { getTreatment, getBlogsByTreatmentSlug } from "@/lib/payload";
import { toBlogPost } from "@/lib/blogs";

/* Wave 4.4 D1 — pilot CMS migration. Content now reads from the `treatments`
 * collection via getTreatment() through the resolver/fallback pipeline; an
 * empty/unavailable CMS degrades to the code default (byte-identical). The
 * route URL, canonical, metadata, JSON-LD and static generation are unchanged;
 * the slug/registry source of truth stays code-owned (src/lib/treatments.ts). */
const SLUG = "oligospermia";

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
