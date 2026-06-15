import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { BlogEditor, type BlogDoc } from "@/components/editor/BlogEditor";

/* =====================================================================
 * Inline editor for a specific Blog post (/edit/blog/[slug]).
 * Auth-gated: redirects to admin login if not authenticated.
 * Fetches the blog doc (draft-aware) and renders the BlogEditor.
 * ===================================================================== */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect(`/admin/login?redirect=/edit/blog/${slug}`);

  const res = await payload.find({
    collection: "blogs",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft: true,
    overrideAccess: true,
  });

  const doc = res.docs[0];
  if (!doc) notFound();

  return (
    <BlogEditor
      initialDoc={doc as unknown as BlogDoc}
      apiPath={`/api/blogs/${doc.id}`}
    />
  );
}
