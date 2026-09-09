import { readAdminServices } from "@/sanity/lib/admin";
import { SERVICE_CONTENT } from "@/lib/womens-health";
import { ServicesManager } from "./manager";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const sanityServices = await readAdminServices();
  // Code services shown as a reference so staff can override by matching slug.
  const codeServices = Object.values(SERVICE_CONTENT).map((s) => ({
    slug: s.slug,
    name: s.shortName,
    href: `/services/${s.slug}`,
  }));
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Maternity Services</h1>
        <p className="admin-sub">Add new service pages or override the built-in ones. Live on /services/[slug].</p>
      </div>
      <ServicesManager initial={sanityServices} codeServices={codeServices} />
    </>
  );
}
