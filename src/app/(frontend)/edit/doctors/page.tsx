import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import "@/components/editor/editor.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function DoctorsHubPage() {
  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login?redirect=/edit/doctors");

  const res = await payload.find({
    collection: "doctors",
    limit: 300,
    depth: 0,
    sort: "name",
    overrideAccess: false,
    user,
    select: { slug: true, name: true, specialty: true, navRole: true },
  });

  const list = (res.docs as Array<Record<string, unknown>>).filter(
    (d) => d.slug && d.name,
  );

  return (
    <div className="bfi-launch">
      <header className="bfi-launch__head">
        <div>
          <h1 className="bfi-launch__title">Doctors Editor</h1>
          <p className="bfi-launch__sub">
            Select a doctor below to open their profile in the inline editor.
          </p>
        </div>
        <a className="bfi-btn bfi-btn--ghost bfi-launch__back" href="/studio/pages">
          ← Back to Pages Hub
        </a>
      </header>
      <div className="bfi-launch__grid">
        {list.map((d) => (
          <a
            key={d.slug as string}
            href={`/edit/doctors/${d.slug as string}`}
            className="bfi-launch__card"
          >
            <span className="bfi-launch__name">{d.name as string}</span>
            {(d.specialty as string | null) && (
              <span className="bfi-launch__desc">{d.specialty as string}</span>
            )}
            {(d.navRole as string | null) && (
              <span className="bfi-launch__desc" style={{ color: "var(--rose)", opacity: 0.75 }}>
                {d.navRole === "senior-specialist" ? "Senior Specialist" : "Specialist"}
              </span>
            )}
            <span className="bfi-launch__open">Open editor →</span>
          </a>
        ))}
        {list.length === 0 && (
          <p style={{ gridColumn: "1/-1", color: "var(--plum)", opacity: 0.6 }}>
            No doctors found. Add one in the{" "}
            <a href="/admin/collections/doctors" style={{ color: "var(--rose)" }}>
              Doctors admin
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
