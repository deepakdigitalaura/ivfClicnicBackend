import { readScripts } from "@/sanity/lib/admin";
import { ScriptsForm } from "./form";

export const dynamic = "force-dynamic";

export default async function ScriptsPage() {
  const data = await readScripts();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Script Injection</h1>
        <p className="admin-sub">Add analytics, tag managers, chat widgets & tracking pixels.</p>
      </div>
      <ScriptsForm initial={data} />
    </>
  );
}
