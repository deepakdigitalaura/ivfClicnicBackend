import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import "@/components/editor/editor.css";

/* =====================================================================
 * Treatments Editor Hub (/edit/treatments).
 * ---------------------------------------------------------------------
 * Lists ALL treatments from the Payload CMS (published + draft) that the
 * logged-in editor can see, making them available for inline visual editing.
 * Clicking any treatment opens its dynamic editor path /edit/treatments/[slug].
 *
 * Previously used the code-owned TREATMENTS_REGISTRY — now fully dynamic:
 * adding a treatment in the admin panel makes it appear here automatically.
 * ===================================================================== */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function TreatmentsHubPage() {
  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login?redirect=/edit/treatments");

  // Fetch all treatments (published + draft — editor sees everything).
  const res = await payload.find({
    collection: "treatments",
    limit: 500,
    depth: 0,
    sort: "name",
    overrideAccess: false,
    user,
    select: { slug: true, name: true, href: true, navCategory: true },
  });

  const list = (res.docs as Array<Record<string, unknown>>).filter(
    (d) => d.slug && d.name,
  );

  return (
    <div className="bfi-launch">
      <header className="bfi-launch__head">
        <div>
          <h1 className="bfi-launch__title">Treatments Editor</h1>
          <p className="bfi-launch__sub">
            Select a treatment below to open its inline editor and edit its content directly on the real page layout.
          </p>
        </div>
        <a className="bfi-btn bfi-btn--ghost bfi-launch__back" href="/studio/pages">
          ← Back to Pages Hub
        </a>
      </header>
      <div className="bfi-launch__grid">
        {list.map((t) => {
          const href = (t.href as string) || `/treatments/${t.slug as string}`;
          return (
            <a
              key={t.slug as string}
              href={`/edit/treatments/${t.slug as string}`}
              className="bfi-launch__card"
            >
              <span className="bfi-launch__name">{t.name as string}</span>
              {!href.startsWith("/#") && (
                <span className="bfi-launch__desc">Route: {href}</span>
              )}
              {(t.navCategory as string | null) && (
                <span className="bfi-launch__desc" style={{ color: "var(--rose)", opacity: 0.75 }}>
                  {t.navCategory as string}
                </span>
              )}
              <span className="bfi-launch__open">Open editor →</span>
            </a>
          );
        })}
        {list.length === 0 && (
          <p style={{ gridColumn: "1/-1", color: "var(--plum)", opacity: 0.6 }}>
            No treatments found. Add one in the{" "}
            <a href="/admin/collections/treatments" style={{ color: "var(--rose)" }}>
              Treatments admin
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
