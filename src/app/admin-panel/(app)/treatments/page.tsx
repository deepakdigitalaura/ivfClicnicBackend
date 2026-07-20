import { readAdminTreatments } from "@/sanity/lib/admin";
import { TREATMENTS } from "@/lib/treatments";
import { TreatmentsManager } from "./manager";

export const dynamic = "force-dynamic";

export default async function TreatmentsAdminPage() {
  const sanityTreatments = await readAdminTreatments();
  // Code treatments shown as a reference so staff can override by matching slug.
  const codeTreatments = TREATMENTS.map((t) => ({
    slug: t.slug,
    name: t.name,
    shortName: t.shortName,
    href: t.href,
  }));
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Treatments</h1>
        <p className="admin-sub">Add new treatment pages or override the built-in ones. Live on /treatments/[slug].</p>
      </div>
      <TreatmentsManager initial={sanityTreatments} codeTreatments={codeTreatments} />
    </>
  );
}
