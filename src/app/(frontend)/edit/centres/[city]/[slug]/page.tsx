import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { centreBySlug } from "@/lib/locations";
import { CenterEditor } from "@/components/editor/CenterEditor";
import type { CentreSource } from "@/lib/location-content";

/* =====================================================================
 * Inline editor for a Centre page (/edit/centres/[city]/[slug]).
 * Auth-gated; fetches the `centres` doc with drafts, keyed on the compound
 * (citySlug, slug) — centre slugs are unique only within a city (ADR-0001).
 * Initialises a doc from the code defaults if none exists.
 * ===================================================================== */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function EditCentrePage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city, slug } = await params;

  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect(`/admin/login?redirect=/edit/centres/${city}/${slug}`);

  const res = await payload.find({
    collection: "centres",
    where: { and: [{ slug: { equals: slug } }, { citySlug: { equals: city } }] },
    limit: 1,
    depth: 1,
    draft: true,
    overrideAccess: true,
  });

  let doc = res.docs[0];
  const def = centreBySlug(city, slug);

  if (!doc) {
    if (!def) notFound();
    doc = await payload.create({
      collection: "centres",
      data: { slug, citySlug: city, name: def.name, fullName: def.fullName },
      draft: true,
    });
  }

  return (
    <CenterEditor
      citySlug={city}
      slug={slug}
      initialSource={doc as unknown as NonNullable<CentreSource>}
      apiPath={`/api/centres/${doc.id}`}
    />
  );
}
