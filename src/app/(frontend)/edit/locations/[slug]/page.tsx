import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { cityBySlug } from "@/lib/locations";
import { CityEditor } from "@/components/editor/CityEditor";
import type { CitySource } from "@/lib/location-content";

/* =====================================================================
 * Inline editor for a City hub page (/edit/locations/[slug]).
 * Auth-gated; fetches the `cities` doc with drafts, initialising one from the
 * code defaults if none exists. Mirrors the treatments/services edit routes.
 * ===================================================================== */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function EditCityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect(`/admin/login?redirect=/edit/locations/${slug}`);

  const res = await payload.find({
    collection: "cities",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    draft: true,
    overrideAccess: true,
  });

  let doc = res.docs[0];
  const def = cityBySlug(slug);

  if (!doc) {
    if (!def) notFound(); // No DB doc and no code default → city doesn't exist.
    doc = await payload.create({
      collection: "cities",
      data: { slug, name: def.name },
      draft: true,
    });
  }
  // If doc exists (DB-only city added via admin), fall through to the editor below.

  return (
    <CityEditor
      slug={slug}
      initialSource={doc as unknown as NonNullable<CitySource>}
      apiPath={`/api/cities/${doc.id}`}
    />
  );
}
