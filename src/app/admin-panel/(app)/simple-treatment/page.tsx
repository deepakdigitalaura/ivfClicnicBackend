import { readSimpleTreatmentPage } from "@/sanity/lib/admin";
import { SimpleTreatmentForm } from "./form";

export const dynamic = "force-dynamic";

export default async function SimpleTreatmentAdminPage() {
  const doc = await readSimpleTreatmentPage();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Simple Treatment</h1>
        <p className="admin-sub">Edit the hero, philosophy cards, 5-step journey, quote banner and pillars on /simple-treatment.</p>
      </div>
      <SimpleTreatmentForm initial={doc} />
    </>
  );
}
