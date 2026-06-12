import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { CENTRES, cityBySlug } from "@/lib/locations";
import "@/components/editor/editor.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function CentresHubPage() {
  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login?redirect=/edit/centres");

  const list = CENTRES.filter((c) => c.built);

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
            <span className="bfi-launch__desc">{cityBySlug(c.citySlug)?.name ?? c.citySlug} · {c.area}</span>
            <span className="bfi-launch__open">Open editor →</span>
          </a>
        ))}
      </div>
    </div>
  );
}
