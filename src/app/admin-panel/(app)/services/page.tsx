import { readAdminServices } from "@/sanity/lib/admin";
import { ServicesManager } from "./manager";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const sanityServices = await readAdminServices();
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Maternity Services</h1>
        <p className="admin-sub">Add or edit service pages. Live on /services/[slug].</p>
      </div>
      <ServicesManager initial={sanityServices} />
    </>
  );
}
