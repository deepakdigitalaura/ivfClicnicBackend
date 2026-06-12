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

  // City hub pages (multi-centre cities). Single-centre cities render a centre
  // page and are edited via the Centre editor instead.
  const list = CITIES.filter((c) => c.built && cityHasOwnPage(c.slug));

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
            <span className="bfi-launch__desc">{c.region}</span>
            <span className="bfi-launch__open">Open editor →</span>
          </a>
        ))}
      </div>
    </div>
  );
}
