import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { treatmentBySlug } from "@/lib/treatments";
import { TreatmentEditor } from "@/components/editor/TreatmentEditor";
import type { TreatmentSource } from "@/lib/treatment-content";

/* =====================================================================
 * Inline editor for a specific Treatment page (/edit/treatments/[slug]).
 * ---------------------------------------------------------------------
 * Auth-gated: redirects to admin login if not logged in.
 * Fetches the document from the Payload database (with draft support).
 * If no document exists in the DB, it dynamically initializes one using the
 * code defaults before rendering the TreatmentEditor.
 * ===================================================================== */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function EditTreatmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect(`/admin/login?redirect=/edit/treatments/${slug}`);

  // Fetch the treatment document with drafts enabled.
  const res = await payload.find({
    collection: "treatments",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    draft: true,
    overrideAccess: true,
  });

  let doc = res.docs[0];
  const def = treatmentBySlug(slug);

  if (!doc) {
    if (!def) notFound();

    // Dynamically initialize the treatment in the database if it doesn't exist yet,
    // so we have a valid database document to PATCH against.
    doc = await payload.create({
      collection: "treatments",
      data: {
        slug,
        name: def.name,
        shortName: def.shortName,
        breadcrumbName: def.breadcrumbName,
        href: def.href,
        lastReviewed: def.lastReviewed,
        reviewerSlug: def.reviewerSlug,
        meta: {
          title: def.meta.title,
          description: def.meta.description,
          ogImage: def.meta.ogImage,
        },
        procedure: {
          procedureType: def.procedure.procedureType,
          bodyLocation: def.procedure.bodyLocation,
          howPerformed: def.procedure.howPerformed,
          followup: def.procedure.followup,
        },
      },
      draft: true,
    });
  }

  return (
    <TreatmentEditor
      slug={slug}
      initialSource={doc as unknown as NonNullable<TreatmentSource>}
      apiPath={`/api/treatments/${doc.id}`}
    />
  );
}
