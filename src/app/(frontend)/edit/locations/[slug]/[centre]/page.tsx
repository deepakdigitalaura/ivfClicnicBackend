import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { centreBySlug } from "@/lib/locations";
import { CentreEditor } from "@/components/editor/CentreEditor";
import type { CentreSource } from "@/lib/location-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function EditCentrePage({
  params,
}: {
  params: Promise<{ slug: string; centre: string }>;
}) {
  const { slug: citySlug, centre } = await params;

  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect(`/admin/login?redirect=/edit/locations/${citySlug}/${centre}`);

  const res = await payload.find({
    collection: "centres",
    where: { and: [{ citySlug: { equals: citySlug } }, { slug: { equals: centre } }] },
    limit: 1,
    depth: 1,
    draft: true,
    overrideAccess: true,
  });

  let doc = res.docs[0];
  const def = centreBySlug(citySlug, centre);

  if (!doc) {
    if (!def) notFound();
    doc = await payload.create({
      collection: "centres",
      data: { slug: centre, citySlug, name: def.name },
      draft: true,
    });
  }

  return (
    <CentreEditor
      citySlug={citySlug}
      slug={centre}
      initialSource={doc as unknown as NonNullable<CentreSource>}
      apiPath={`/api/centres/${doc.id}`}
    />
  );
}
