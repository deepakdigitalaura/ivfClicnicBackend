import { readInfrastructurePage } from "@/sanity/lib/admin";
import { InfrastructureForm } from "./form";

export const dynamic = "force-dynamic";

export default async function InfrastructureAdminPage() {
  const doc = await readInfrastructurePage();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Infrastructure</h1>
        <p className="admin-sub">Edit the hero, stats, facility cards and technology highlights on /infrastructure.</p>
      </div>
      <InfrastructureForm initial={doc} />
    </>
  );
}
