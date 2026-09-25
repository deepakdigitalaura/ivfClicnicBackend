import { readSuccessBenchmarksPage } from "@/sanity/lib/admin";
import { SuccessBenchmarksForm } from "./form";

export const dynamic = "force-dynamic";

export default async function SuccessBenchmarksAdminPage() {
  const doc = await readSuccessBenchmarksPage();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Success Benchmarks</h1>
        <p className="admin-sub">Edit the hero, stats, success-pillar cards and closing badges on /success-benchmarks.</p>
      </div>
      <SuccessBenchmarksForm initial={doc} />
    </>
  );
}
