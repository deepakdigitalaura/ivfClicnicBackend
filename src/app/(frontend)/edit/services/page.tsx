import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import { WOMENS_HEALTH_SERVICES } from "@/lib/womens-health";
import "@/components/editor/editor.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ServicesHubPage() {
  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login?redirect=/edit/services");

  const list = Object.values(WOMENS_HEALTH_SERVICES).filter((s) => s.published);

  return (
    <div className="bfi-launch">
      <header className="bfi-launch__head">
        <div>
          <h1 className="bfi-launch__title">Maternity Services Editor</h1>
          <p className="bfi-launch__sub">
            Select a service below to open its page in the inline editor.
          </p>
        </div>
        <a className="bfi-btn bfi-btn--ghost bfi-launch__back" href="/studio/pages">
          ← Back to Pages Hub
        </a>
      </header>
      <div className="bfi-launch__grid">
        {list.map((s) => (
          <a key={s.key} href={`/edit/services/${s.key}`} className="bfi-launch__card">
            <span className="bfi-launch__name">{s.name}</span>
            <span className="bfi-launch__desc">{s.desc}</span>
            <span className="bfi-launch__open">Open editor →</span>
          </a>
        ))}
      </div>
    </div>
  );
}
