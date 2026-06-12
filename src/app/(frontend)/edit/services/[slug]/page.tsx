import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { serviceRegistryBySlug } from "@/lib/womens-health";
import { resolveServiceFromCode, type ServiceSource } from "@/lib/services";
import { ServiceEditor } from "@/components/editor/ServiceEditor";

/* =====================================================================
 * Inline editor for a specific maternity Service page (/edit/services/[slug]).
 * ---------------------------------------------------------------------
 * Auth-gated: redirects to admin login if not logged in.
 * Fetches the document from the Payload database (with draft support).
 * If no document exists in the DB, it initialises one from the code defaults
 * before rendering the ServiceEditor. Mirrors the treatments/doctors routes.
 * ===================================================================== */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect(`/admin/login?redirect=/edit/services/${slug}`);

  const res = await payload.find({
    collection: "services",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    draft: true,
    overrideAccess: true,
  });

  let doc = res.docs[0];
  const reg = serviceRegistryBySlug(slug);
  const def = resolveServiceFromCode(slug);

  if (!doc) {
    if (!reg || !def) notFound();

    doc = await payload.create({
      collection: "services",
      data: {
        slug,
        name: reg.name,
        schemaType: def.schemaType,
        shortName: def.shortName,
        breadcrumbName: def.breadcrumbName,
        reviewerSlug: def.reviewerSlug,
        lastReviewed: def.lastReviewed,
      },
      draft: true,
    });
  }

  return (
    <ServiceEditor
      slug={slug}
      initialSource={doc as unknown as NonNullable<ServiceSource>}
      apiPath={`/api/services/${doc.id}`}
    />
  );
}
