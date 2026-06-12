import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { DOCTORS } from "@/lib/doctors";
import { DoctorEditor } from "@/components/editor/DoctorEditor";
import type { DoctorSource } from "@/lib/doctors";

/* =====================================================================
 * Inline editor for a specific Doctor profile (/edit/doctors/[slug]).
 * ---------------------------------------------------------------------
 * Auth-gated: redirects to admin login if not logged in.
 * Fetches the document from the Payload database (with draft support).
 * If no document exists in the DB, initialises one from code defaults
 * before rendering the DoctorEditor.
 * ===================================================================== */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function EditDoctorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect(`/admin/login?redirect=/edit/doctors/${slug}`);

  const res = await payload.find({
    collection: "doctors",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    draft: true,
    overrideAccess: true,
  });

  let doc = res.docs[0];
  const def = DOCTORS.find((d) => d.slug === slug);

  if (!doc) {
    if (!def) notFound();

    doc = await payload.create({
      collection: "doctors",
      data: {
        slug,
        name: def.name,
        credentials: def.credentials,
        specialty: def.specialty,
        role: def.role,
        image: def.image,
        shortBio: def.shortBio,
        verified: def.verified,
        ...(def.visitsAllCentres ? { visitsAllCentres: true } : {}),
      },
      draft: true,
    });
  }

  return (
    <DoctorEditor
      slug={slug}
      initialSource={doc as unknown as NonNullable<DoctorSource>}
      apiPath={`/api/doctors/${doc.id}`}
    />
  );
}
