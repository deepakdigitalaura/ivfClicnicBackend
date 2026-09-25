import { readSafeTreatmentPage } from "@/sanity/lib/admin";
import { SafeTreatmentForm } from "./form";

export const dynamic = "force-dynamic";

export default async function SafeTreatmentAdminPage() {
  const doc = await readSafeTreatmentPage();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Safe Treatment</h1>
        <p className="admin-sub">Edit the hero, safety-feature cards, stats and protocols checklist on /safe-treatment.</p>
      </div>
      <SafeTreatmentForm initial={doc} />
    </>
  );
}
