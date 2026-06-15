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

  // Code-backed services (hardcoded registry).
  const codeList = Object.values(WOMENS_HEALTH_SERVICES)
    .filter((s) => s.published)
    .map((s) => ({ slug: s.key, name: s.name, desc: s.desc ?? "" }));
  const codeSeen = new Set(codeList.map((s) => s.slug));

  // DB-only services — added via admin but not in the code registry.
  const dbRes = await payload.find({
    collection: "services",
    limit: 300,
    depth: 0,
    sort: "name",
    overrideAccess: false,
    user,
    select: { slug: true, name: true, shortName: true },
  });
  const dbExtras = (dbRes.docs as Array<Record<string, unknown>>)
    .filter((d) => d.slug && !codeSeen.has(d.slug as string))
    .map((d) => ({
      slug: d.slug as string,
      name: (d.name as string) || (d.shortName as string) || (d.slug as string),
      desc: "",
    }));

  const list = [...codeList, ...dbExtras];

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
          <a key={s.slug} href={`/edit/services/${s.slug}`} className="bfi-launch__card">
            <span className="bfi-launch__name">{s.name}</span>
            {s.desc && <span className="bfi-launch__desc">{s.desc}</span>}
            <span className="bfi-launch__open">Open editor →</span>
          </a>
        ))}
        {list.length === 0 && (
          <p style={{ gridColumn: "1/-1", color: "var(--plum)", opacity: 0.6 }}>
            No services found. Add one in the{" "}
            <a href="/admin/collections/services" style={{ color: "var(--rose)" }}>
              Services admin
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
