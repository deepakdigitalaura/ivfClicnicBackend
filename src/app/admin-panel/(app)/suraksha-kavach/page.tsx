import { readSurakshaKavach } from "@/sanity/lib/admin";
import { SurakshaKavachForm } from "./form";

export const dynamic = "force-dynamic";

export default async function SurakshaKavachAdminPage() {
  const doc = await readSurakshaKavach();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Suraksha Kavach</h1>
        <p className="admin-sub">Edit the hero, benefits, stats, steps and FAQs on /suraksha-kavach. Fields start filled with the current live content.</p>
      </div>
      <SurakshaKavachForm initial={doc} />
    </>
  );
}
