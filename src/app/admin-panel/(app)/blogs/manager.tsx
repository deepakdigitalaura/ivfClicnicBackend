"use client";
import { useState } from "react";
import { deleteBlogAction } from "../../actions";
import type { AdminBlogMeta } from "@/sanity/lib/admin";

export function BlogsManager({ initial }: { initial: AdminBlogMeta[] }) {
  const [items, setItems] = useState(initial);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const del = async (id: string, slug?: string) => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    const r = await deleteBlogAction(id, slug);
    if (!r.ok) { flash(`Error: ${r.error}`); return; }
    setItems((prev) => prev.filter((i) => i._id !== id));
    flash("Deleted.");
  };

  const filtered = search
    ? items.filter((b) =>
        (b.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (b.slug ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (b.categorySlug ?? "").toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  const published = filtered.filter((b) => b.status !== "draft");
  const drafts = filtered.filter((b) => b.status === "draft");

  return (
    <div>
      {toast && <div className="admin-toast">{toast}</div>}

      <div style={{ marginBottom: 16 }}>
        <input
          className="admin-input"
          style={{ maxWidth: 360 }}
          placeholder="Search by title, slug, or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {items.length === 0 && (
        <p className="admin-sub">No blogs yet. Run <code>scripts/migrate-blogs.mts</code> to import from Postgres.</p>
      )}

      {[
        { label: `Published (${published.length})`, list: published },
        { label: `Drafts (${drafts.length})`, list: drafts },
      ].map(({ label, list }) =>
        list.length === 0 ? null : (
          <div key={label} style={{ marginBottom: 32 }}>
            <h2 className="admin-h2" style={{ marginBottom: 12 }}>{label}</h2>
            <div style={{ display: "grid", gap: 8 }}>
              {list.map((b) => (
                <div key={b._id} className="admin-card" style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{b.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>
                      /blogs/{b.slug} · {b.categoryTitle ?? b.categorySlug ?? "—"} · {b.authorName ?? "—"} ·{" "}
                      {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString("en-IN") : "no date"}
                    </div>
                    {b.excerpt && (
                      <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {b.excerpt}
                      </div>
                    )}
                  </div>
                  <a className="admin-btn-ghost" style={{ fontSize: 12, textDecoration: "none" }} href={`/blogs/${b.slug}`} target="_blank">
                    View ↗
                  </a>
                  <button
                    className="admin-btn-ghost"
                    style={{ fontSize: 12, color: "var(--destructive)" }}
                    onClick={() => del(b._id!, b.slug)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  );
}
