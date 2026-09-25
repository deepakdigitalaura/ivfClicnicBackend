import { readSmartTreatmentPage } from "@/sanity/lib/admin";
import { SmartTreatmentForm } from "./form";

export const dynamic = "force-dynamic";

export default async function SmartTreatmentAdminPage() {
  const doc = await readSmartTreatmentPage();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Smart Treatment</h1>
        <p className="admin-sub">Edit the hero, smart pillars, feature cards and cost packages on /smart-treatment.</p>
      </div>
      <SmartTreatmentForm initial={doc} />
    </>
  );
}
