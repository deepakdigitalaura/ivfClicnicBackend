import { readSchema } from "@/sanity/lib/admin";
import { SchemaForm } from "./form";

export const dynamic = "force-dynamic";

export default async function SchemaPage() {
  const data = await readSchema();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Structured Data</h1>
        <p className="admin-sub">Organization schema &amp; custom JSON-LD for rich search results.</p>
      </div>
      <SchemaForm initial={data} />
    </>
  );
}
