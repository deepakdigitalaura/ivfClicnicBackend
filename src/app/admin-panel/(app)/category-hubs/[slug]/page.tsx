import { notFound } from "next/navigation";
import { readCategoryHub } from "@/sanity/lib/admin";
import { HUB_SLUGS, HUB_LABELS, type HubSlug } from "@/lib/category-hub";
import { CategoryHubForm } from "./form";

export const dynamic = "force-dynamic";

export default async function CategoryHubAdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!HUB_SLUGS.includes(slug as HubSlug)) notFound();
  const hubSlug = slug as HubSlug;
  const doc = await readCategoryHub(hubSlug);
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">{HUB_LABELS[hubSlug]}</h1>
        <p className="admin-sub">Fields start filled with the current live content.</p>
      </div>
      <CategoryHubForm slug={hubSlug} initial={doc} />
    </>
  );
}
