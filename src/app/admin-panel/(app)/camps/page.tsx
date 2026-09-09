import { readCamps } from "@/sanity/lib/admin";
import { CampsForm } from "./form";

export const dynamic = "force-dynamic";

export default async function CampsPage() {
  const data = await readCamps();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Camp Posters</h1>
        <p className="admin-sub">
          Manage the poster images shown in the homepage "Upcoming Events" section and the /camps page.
          Leave empty to use the default set.
        </p>
      </div>
      <CampsForm initial={data} />
    </>
  );
}
