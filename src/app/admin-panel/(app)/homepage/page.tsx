import { readHomepage } from "@/sanity/lib/admin";
import { HOMEPAGE_DEFAULTS } from "@/lib/homepage";
import { HomepageEditor } from "./editor";

export const dynamic = "force-dynamic";

export default async function HomepageAdminPage() {
  const doc = await readHomepage();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Homepage Editor</h1>
        <p className="admin-sub">Edit the homepage content — changes preview live on the right and go live on save.</p>
      </div>
      <HomepageEditor initial={doc} defaults={HOMEPAGE_DEFAULTS} />
    </>
  );
}
