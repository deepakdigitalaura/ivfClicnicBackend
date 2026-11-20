import { readHistoryPage } from "@/sanity/lib/admin";
import { HistoryForm } from "./form";

export const dynamic = "force-dynamic";

export default async function HistoryAdminPage() {
  const doc = await readHistoryPage();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">History</h1>
        <p className="admin-sub">
          Edit the hero and present-day highlight on /history. The Legacy Timeline further down that page is
          shared with About BFI — edit it from the About Page &rarr; Legacy &amp; Stats tab.
        </p>
      </div>
      <HistoryForm initial={doc} />
    </>
  );
}
