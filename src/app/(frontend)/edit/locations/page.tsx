import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { CITIES, cityHasOwnPage } from "@/lib/locations";
import "@/components/editor/editor.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function LocationsHubPage() {
  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login?redirect=/edit/locations");

  // Code-backed cities that have a hub page (multi-centre cities).
  const codeList = CITIES.filter((c) => c.built && cityHasOwnPage(c.slug)).map((c) => ({
    slug: c.slug,
    name: c.name,
    desc: c.region ?? "",
  }));
  const codeSeen = new Set(codeList.map((c) => c.slug));

  // DB-only cities — added via admin but not in the code list.
  const dbRes = await payload.find({
    collection: "cities",
    limit: 100,
    depth: 0,
    sort: "name",
    overrideAccess: false,
    user,
    select: { slug: true, name: true },
  });
  const dbExtras = (dbRes.docs as Array<Record<string, unknown>>)
    .filter((d) => d.slug && !codeSeen.has((d.slug as string).toLowerCase()))
    .map((d) => ({
      slug: (d.slug as string).toLowerCase(),
      name: (d.name as string) || (d.slug as string),
      desc: "",
    }));

  const list = [...codeList, ...dbExtras];

  return (
    <div className="bfi-launch">
      <header className="bfi-launch__head">
        <div>
          <h1 className="bfi-launch__title">City Pages Editor</h1>
          <p className="bfi-launch__sub">
            Select a city below to open its hub page in the inline editor.
          </p>
        </div>
        <a className="bfi-btn bfi-btn--ghost bfi-launch__back" href="/studio/pages">
          ← Back to Pages Hub
        </a>
      </header>
      <div className="bfi-launch__grid">
        {list.map((c) => (
          <a key={c.slug} href={`/edit/locations/${c.slug}`} className="bfi-launch__card">
            <span className="bfi-launch__name">{c.name}</span>
            {c.desc && <span className="bfi-launch__desc">{c.desc}</span>}
            <span className="bfi-launch__open">Open editor →</span>
          </a>
        ))}
        {list.length === 0 && (
          <p style={{ gridColumn: "1/-1", color: "var(--plum)", opacity: 0.6 }}>
            No cities found. Add one in the{" "}
            <a href="/admin/collections/cities" style={{ color: "var(--rose)" }}>
              Cities admin
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
