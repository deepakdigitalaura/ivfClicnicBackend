import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { payloadClient } from "@/lib/payload";
import "@/components/editor/editor.css";

/* =====================================================================
 * Blog Editor Hub (/edit/blog).
 * Lists all blog posts (published + draft) visible to the logged-in
 * editor. Clicking a post opens its inline editor (/edit/blog/[slug]).
 * Creating or deleting posts is done in the admin panel.
 * ===================================================================== */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function BlogHubPage() {
  const payload = await payloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login?redirect=/edit/blog");

  const res = await payload.find({
    collection: "blogs",
    limit: 200,
    depth: 0,
    sort: "-publishedAt",
    overrideAccess: false,
    user,
    select: { slug: true, title: true, publishedAt: true, _status: true },
  });

  const list = (res.docs as Array<Record<string, unknown>>).filter(
    (d) => d.slug && d.title,
  );

  return (
    <div className="bfi-launch">
      <header className="bfi-launch__head">
        <div>
          <h1 className="bfi-launch__title">Blog Editor</h1>
          <p className="bfi-launch__sub">
            Select an article to open its inline editor (title, excerpt &amp; hero image).
            To add or delete articles use the{" "}
            <a href="/admin/collections/blogs" style={{ color: "var(--rose)" }}>
              Admin panel
            </a>
            .
          </p>
        </div>
        <a className="bfi-btn bfi-btn--ghost bfi-launch__back" href="/studio/pages">
          ← Back to Pages Hub
        </a>
      </header>
      <div className="bfi-launch__grid">
        {list.map((b) => (
          <a
            key={b.slug as string}
            href={`/edit/blog/${b.slug as string}`}
            className="bfi-launch__card"
          >
            <span className="bfi-launch__name">{b.title as string}</span>
            {typeof b.publishedAt === "string" && (
              <span className="bfi-launch__desc">
                {new Date(b.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                {(b._status as string) !== "published" ? " · Draft" : ""}
              </span>
            )}
            <span className="bfi-launch__open">Open editor →</span>
          </a>
        ))}
        {list.length === 0 && (
          <p style={{ gridColumn: "1/-1", color: "var(--plum)", opacity: 0.6 }}>
            No blog posts yet. Add one in the{" "}
            <a href="/admin/collections/blogs" style={{ color: "var(--rose)" }}>
              Blogs admin
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
