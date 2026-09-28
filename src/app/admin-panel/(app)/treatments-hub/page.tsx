import { readTreatmentsHub } from "@/sanity/lib/admin";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage";
import { TreatmentsHubForm } from "./form";

export const dynamic = "force-dynamic";

export default async function TreatmentsHubPage() {
  const doc = await readTreatmentsHub();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Treatments Hub Page</h1>
        <p className="admin-sub">The heading copy at the top of the /treatments page. The treatment cards below it are managed under Treatments.</p>
      </div>
      <TreatmentsHubForm initial={doc} defaults={HOMEPAGE_DEFAULTS.treatments} />
    </>
  );
}
