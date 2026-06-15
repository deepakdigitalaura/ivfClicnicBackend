import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { ContactEditor } from "@/components/editor/ContactEditor";

/* =====================================================================
 * Inline editor for the Contact page (/edit/contact).
 * Auth-gated; edits the contact `pages` doc (slug "contact"), initialising one
 * from defaults if none exists. The hero copy + FAQs are editable here; the
 * contact cards + centre directory are owned by other globals/code.
 * ===================================================================== */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function EditContactPage() {
  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login?redirect=/edit/contact");

  const res = await payload.find({
    collection: "pages",
    where: { slug: { equals: "contact" } },
    limit: 1,
    depth: 1,
    draft: true,
    overrideAccess: true,
  });

  let doc = res.docs[0];
  if (!doc) {
    doc = await payload.create({
      collection: "pages",
      data: { slug: "contact", title: "Contact Us" },
      draft: true,
    });
  }

  return (
    <ContactEditor
      initialSource={doc as unknown as Record<string, unknown>}
      apiPath={`/api/pages/${doc.id}`}
    />
  );
}
