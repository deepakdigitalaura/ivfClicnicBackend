import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { CITIES, cityHasOwnPage, centresForCity } from "@/lib/locations";
import "@/components/editor/editor.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function LocationsHubPage() {
  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login?redirect=/edit/locations");

  // Multi-centre cities (have a city hub page + individual centre pages).
  const multiCitiesTome = CITIES.filter((c) => c.built && cityHasOwnPage(c.slug)).map((c) => ({
    slug: c.slug,
    name: c.name,
    desc: c.region ?? "",
    centres: centresForCity(c.slug).filter((ce) => ce.built).map((ce) => ({ slug: ce.slug, name: ce.name })),
  }));

  // Single-centre cities (no hub page; editor goes straight to the centre page).
  const singleCities = CITIES.filter((c) => c.built && !cityHasOwnPage(c.slug)).map((c) => {
    const centre = centresForCity(c.slug).find((ce) => ce.built);
    return { citySlug: c.slug, cityName: c.name, centreSlug: centre?.slug ?? c.slug, centreName: centre?.name ?? c.name };
  });

  // DB-only cities/centres — added via admin, not in code. Fetch in one query each.
  const codeSeenSlugs = new Set([
    ...multiCitiesTome.map((c) => c.slug),
    ...singleCities.map((c) => c.citySlug),
  ]);

  const [dbCitiesRes, dbCentresRes] = await Promise.all([
    payload.find({ collection: "cities", limit: 100, depth: 0, sort: "name", overrideAccess: false, user, select: { slug: true, name: true } }),
    payload.find({ collection: "centres", limit: 200, depth: 0, sort: "name", overrideAccess: false, user, select: { slug: true, name: true, citySlug: true } }),
  ]);

  // Group DB centres by citySlug.
  const dbCentresByCity: Record<string, { slug: string; name: string }[]> = {};
  for (const doc of dbCentresRes.docs as Array<Record<string, unknown>>) {
    const cs = doc.citySlug as string;
    if (!cs) continue;
    if (!dbCentresByCity[cs]) dbCentresByCity[cs] = [];
    dbCentresByCity[cs].push({ slug: doc.slug as string, name: doc.name as string });
  }

  // DB-only cities (not in code at all).
  const dbOnlyCities = (dbCitiesRes.docs as Array<Record<string, unknown>>)
    .filter((d) => d.slug && !codeSeenSlugs.has((d.slug as string).toLowerCase()))
    .map((d) => ({
      slug: (d.slug as string).toLowerCase(),
      name: (d.name as string) || (d.slug as string),
      centres: dbCentresByCity[(d.slug as string).toLowerCase()] ?? [],
    }));

  const hasSingle = singleCities.length > 0 || dbOnlyCities.filter((c) => c.centres.length <= 1).length > 0;

  return (
    <div className="bfi-launch">
      <header className="bfi-launch__head">
        <div>
          <h1 className="bfi-launch__title">City Pages Editor</h1>
          <p className="bfi-launch__sub">
            Select a city or centre to open its page in the inline editor.
          </p>
        </div>
        <a className="bfi-btn bfi-btn--ghost bfi-launch__back" href="/studio/pages">
          ← Back to Pages Hub
        </a>
      </header>

      {/* Multi-centre cities — grouped with individual centre cards */}
      {multiCitiesTome.map((city) => (
        <section key={city.slug} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "var(--plum)" }}>{city.name}</h2>
            {city.desc && <span style={{ fontSize: "0.8rem", color: "var(--plum)", opacity: 0.5 }}>{city.desc}</span>}
          </div>
          <div className="bfi-launch__grid">
            {/* City hub overview card */}
            <a href={`/edit/locations/${city.slug}`} className="bfi-launch__card">
              <span className="bfi-launch__name">City Hub Page</span>
              <span className="bfi-launch__desc">Overview · all centres · doctors · FAQs</span>
              <span className="bfi-launch__open">Open editor →</span>
            </a>
            {/* Individual centre cards */}
            {city.centres.map((ce) => (
              <a key={ce.slug} href={`/edit/locations/${city.slug}/${ce.slug}`} className="bfi-launch__card">
                <span className="bfi-launch__name">{ce.name}</span>
                <span className="bfi-launch__desc">Centre page · {city.name}</span>
                <span className="bfi-launch__open">Open editor →</span>
              </a>
            ))}
          </div>
        </section>
      ))}

      {/* DB-only multi-centre cities */}
      {dbOnlyCities.filter((c) => c.centres.length > 1).map((city) => (
        <section key={city.slug} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "var(--plum)" }}>{city.name}</h2>
          </div>
          <div className="bfi-launch__grid">
            <a href={`/edit/locations/${city.slug}`} className="bfi-launch__card">
              <span className="bfi-launch__name">City Hub Page</span>
              <span className="bfi-launch__desc">Overview · all centres</span>
              <span className="bfi-launch__open">Open editor →</span>
            </a>
            {city.centres.map((ce) => (
              <a key={ce.slug} href={`/edit/locations/${city.slug}/${ce.slug}`} className="bfi-launch__card">
                <span className="bfi-launch__name">{ce.name}</span>
                <span className="bfi-launch__desc">Centre page · {city.name}</span>
                <span className="bfi-launch__open">Open editor →</span>
              </a>
            ))}
          </div>
        </section>
      ))}

      {/* Single-centre cities — one card per city linking straight to the centre editor */}
      {hasSingle && (
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "var(--plum)" }}>Single-Centre Cities</h2>
          </div>
          <div className="bfi-launch__grid">
            {singleCities.map((c) => (
              <a key={c.citySlug} href={`/edit/locations/${c.citySlug}/${c.centreSlug}`} className="bfi-launch__card">
                <span className="bfi-launch__name">{c.cityName}</span>
                <span className="bfi-launch__desc">{c.centreName}</span>
                <span className="bfi-launch__open">Open editor →</span>
              </a>
            ))}
            {dbOnlyCities.filter((c) => c.centres.length <= 1).map((c) => (
              <a
                key={c.slug}
                href={c.centres[0] ? `/edit/locations/${c.slug}/${c.centres[0].slug}` : `/edit/locations/${c.slug}`}
                className="bfi-launch__card"
              >
                <span className="bfi-launch__name">{c.name}</span>
                {c.centres[0] && <span className="bfi-launch__desc">{c.centres[0].name}</span>}
                <span className="bfi-launch__open">Open editor →</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {multiCitiesTome.length === 0 && singleCities.length === 0 && dbOnlyCities.length === 0 && (
        <p style={{ color: "var(--plum)", opacity: 0.6 }}>
          No cities found. Add one in the{" "}
          <a href="/admin/collections/cities" style={{ color: "var(--rose)" }}>Cities admin</a>.
        </p>
      )}
    </div>
  );
}
