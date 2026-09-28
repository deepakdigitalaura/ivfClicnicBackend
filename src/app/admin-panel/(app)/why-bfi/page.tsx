import { readWhyBfiPage } from "@/sanity/lib/admin";
import { WhyBfiForm } from "./form";

export const dynamic = "force-dynamic";

export default async function WhyBfiAdminPage() {
  const doc = await readWhyBfiPage();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Why BFI</h1>
        <p className="admin-sub">Edit the hero, stats, reasons grid, journey timeline and ethics cards on /why-bfi.</p>
      </div>
      <WhyBfiForm initial={doc} />
    </>
  );
}
