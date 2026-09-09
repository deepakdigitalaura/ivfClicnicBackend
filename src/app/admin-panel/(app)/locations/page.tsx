import { readAdminCities, readAdminCentres } from "@/sanity/lib/admin";
import { CITIES, CENTRES } from "@/lib/locations";
import { LocationsManager } from "./manager";

export const dynamic = "force-dynamic";

export default async function LocationsAdminPage() {
  const [sanityCities, sanityCentres] = await Promise.all([readAdminCities(), readAdminCentres()]);
  // Code cities/centres shown as reference so staff can override by matching slug.
  const codeCities = CITIES.map((c) => ({ slug: c.slug, name: c.name }));
  const codeCentres = CENTRES.map((c) => ({ slug: c.slug, citySlug: c.citySlug, name: c.name }));
  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Locations</h1>
        <p className="admin-sub">Manage cities and the centres inside them. Live on /locations/[city] and /locations/[city]/[center].</p>
      </div>
      <LocationsManager
        initialCities={sanityCities}
        initialCentres={sanityCentres}
        codeCities={codeCities}
        codeCentres={codeCentres}
      />
    </>
  );
}
