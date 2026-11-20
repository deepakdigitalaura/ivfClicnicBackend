import { readAdminTreatments } from "@/sanity/lib/admin";
import { TreatmentsManager } from "./manager";

export const dynamic = "force-dynamic";

export default async function TreatmentsAdminPage() {
  const sanityTreatments = await readAdminTreatments();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Treatments</h1>
        <p className="admin-sub">Add or edit treatment pages. Live on /treatments/[slug].</p>
      </div>
      <TreatmentsManager initial={sanityTreatments} />
    </>
  );
}
