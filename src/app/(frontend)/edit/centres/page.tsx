import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { CENTRES, cityBySlug } from "@/lib/locations";
import "@/components/editor/editor.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type CentreCard = {
  citySlug: string;
  slug: string;
  fullName: string;
  area: string;
};

export default async function CentresHubPage() {
  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login?redirect=/edit/centres");

  // Code-backed centres (seeded, built = has a public page).
  const codeList: CentreCard[] = CENTRES.filter((c) => c.built).map((c) => ({
    citySlug: c.citySlug,
    slug: c.slug,
    fullName: c.fullName,
    area: c.area,
  }));
  const codeSeen = new Set(codeList.map((c) => `${c.citySlug}/${c.slug}`));

  // DB-only centres — anything published in admin that isn't in the code list.
  // Use the authenticated user (not overrideAccess: true) so collection-level
  // access control is respected, consistent with every other editor hub page.
  const dbRes = await payload.find({
    collection: "centres",
    limit: 300,
    depth: 0,
    where: { _status: { equals: "published" } },
    select: { slug: true, citySlug: true, name: true, fullName: true, area: true },
    overrideAccess: false,
    user,
  });

  const dbExtras: CentreCard[] = (dbRes.docs as Array<Record<string, unknown>>)
    .filter((d) => {
      if (!d.slug || !d.citySlug) return false;
      const key = `${(d.citySlug as string).toLowerCase()}/${(d.slug as string).toLowerCase()}`;
      return !codeSeen.has(key);
    })
    .map((d) => ({
      citySlug: (d.citySlug as string).toLowerCase(),
      slug: (d.slug as string).toLowerCase(),
      fullName: (d.fullName as string) || (d.name as string) || String(d.slug),
      area: (d.area as string) || "",
    }));

  const list = [...codeList, ...dbExtras];

  return (
    <div className="bfi-launch">
      <header className="bfi-launch__head">
        <div>
          <h1 className="bfi-launch__title">Centre Pages Editor</h1>
          <p className="bfi-launch__sub">
            Select a centre below to open its page in the inline editor.
          </p>
        </div>
        <a className="bfi-btn bfi-btn--ghost bfi-launch__back" href="/studio/pages">
          ← Back to Pages Hub
        </a>
      </header>
      <div className="bfi-launch__grid">
        {list.map((c) => (
          <a key={`${c.citySlug}/${c.slug}`} href={`/edit/centres/${c.citySlug}/${c.slug}`} className="bfi-launch__card">
            <span className="bfi-launch__name">{c.fullName}</span>
            <span className="bfi-launch__desc">
              {cityBySlug(c.citySlug)?.name ?? c.citySlug}
              {c.area ? ` · ${c.area}` : ""}
            </span>
            <span className="bfi-launch__open">Open editor →</span>
          </a>
        ))}
        {list.length === 0 && (
          <p style={{ gridColumn: "1/-1", color: "var(--plum)", opacity: 0.6 }}>
            No centres found. Add one in the{" "}
            <a href="/admin/collections/centres" style={{ color: "var(--rose)" }}>
              Centres admin
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
