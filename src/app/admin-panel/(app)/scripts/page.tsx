import { redirect } from "next/navigation";
import { getSession } from "@/lib/admin-auth";
import { readScripts } from "@/sanity/lib/admin";
import { ScriptsForm } from "./form";

export const dynamic = "force-dynamic";

export default async function ScriptsPage() {
  const session = await getSession();
  if (session?.role !== "superadmin") redirect("/admin-panel");
  const data = await readScripts();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Add Script</h1>
        <p className="admin-sub">Add analytics, tag managers, chat widgets & tracking pixels.</p>
      </div>
      <ScriptsForm initial={data} />
    </>
  );
}
