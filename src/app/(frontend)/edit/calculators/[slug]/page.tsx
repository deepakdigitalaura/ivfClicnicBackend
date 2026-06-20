import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { isCalculatorSlug } from "@/lib/calculators";
import { CalculatorEditor } from "@/components/editor/CalculatorEditor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function EditCalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isCalculatorSlug(slug)) notFound();

  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect(`/admin/login?redirect=/edit/calculators/${slug}`);

  const res = await payload.find({
    collection: "calculators",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    draft: true,
    overrideAccess: true,
  });

  const doc = res.docs[0];
  if (!doc) notFound();

  return (
    <CalculatorEditor
      slug={slug}
      initialDoc={doc as Parameters<typeof CalculatorEditor>[0]["initialDoc"]}
      apiPath={`/api/calculators/${doc.id}`}
    />
  );
}
