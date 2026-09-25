"use client";
import { useState } from "react";
import { Pencil, Plus, X } from "lucide-react";
import { deleteBlogAction, saveBlogAction, setBlogStatusAction } from "../../actions";
import type { AdminBlogMeta } from "@/sanity/lib/admin";

const BLOG_HERO_IMAGE_POSITIONS = [
  "center center", "right center", "left center",
  "right top", "center top", "center bottom",
] as const;
import { ImageUpload } from "../_components/image-upload";
import { useSave, Toast } from "../_components/save-kit";

type Tab = "published" | "drafts";

const EMPTY: AdminBlogMeta = { title: "", slug: "", status: "draft" };

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const HERO_POSITION_LABELS: Record<string, string> = {
  "center center": "Center",
  "right center": "Right",
  "left center": "Left",
  "right top": "Top Right",
  "center top": "Top",
  "center bottom": "Bottom",
};

export function BlogsManager({ initial }: { initial: AdminBlogMeta[] }) {
  const [items, setItems] = useState(initial);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("published");
  const [editing, setEditing] = useState<AdminBlogMeta | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [toast, setToast] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const { pending, toast: saveToast, run } = useSave();

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const startNew = () => { setEditing({ ...EMPTY }); setSlugTouched(false); };
  const startEdit = (b: AdminBlogMeta) => { setEditing({ ...b }); setSlugTouched(true); };

  const set = (patch: Partial<AdminBlogMeta>) => setEditing((p) => ({ ...(p ?? EMPTY), ...patch }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.title || !editing?.slug) return;
    run(async () => {
      const res = await saveBlogAction(editing);
      if (res.ok) {
        setItems((prev) => {
          const i = prev.findIndex((x) => x._id && x._id === editing._id);
          if (i >= 0) { const next = [...prev]; next[i] = { ...editing }; return next; }
          return [{ ...editing }, ...prev];
        });
        setEditing(null);
      }
      return res;
    });
  };

  const del = async (id: string, slug?: string) => {
    if (!confirm("Delete this blog post? This cannot be undone.")) return;
    const r = await deleteBlogAction(id, slug);
    if (!r.ok) { flash(`Error: ${r.error}`); return; }
    setItems((prev) => prev.filter((i) => i._id !== id));
    flash("Deleted.");
  };

  const toggleStatus = async (b: AdminBlogMeta) => {
    const nextStatus = b.status === "draft" ? "published" : "draft";
    setBusyId(b._id ?? null);
    const r = await setBlogStatusAction(b._id!, nextStatus, b.slug);
    setBusyId(null);
    if (!r.ok) { flash(`Error: ${r.error}`); return; }
    setItems((prev) => prev.map((i) => (i._id === b._id ? { ...i, status: nextStatus } : i)));
    flash(nextStatus === "published" ? "Published." : "Moved to drafts.");
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
  const list = tab === "published" ? published : drafts;

  if (editing) {
    return (
      <form onSubmit={save}>
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 className="admin-card-title" style={{ margin: 0 }}>{editing._id ? "Edit Blog Meta" : "New Blog"}</h2>
            <button type="button" className="admin-btn-ghost" style={{ padding: "7px 10px" }} onClick={() => setEditing(null)}><X size={16} /></button>
          </div>

          <p className="admin-hint" style={{ marginBottom: 14 }}>
            This sets the title, summary &amp; metadata only. The article body, FAQs and SEO fields
            are written in <a href="/studio" target="_blank" style={{ color: "var(--rose)" }}>Sanity Studio</a> —
            new posts save as a draft so you can finish the body there before publishing.
          </p>

          <div className="admin-row-grid">
            <div className="admin-field">
              <label className="admin-label">Title *</label>
              <input
                className="admin-input"
                required
                value={editing.title ?? ""}
                onChange={(e) => {
                  const title = e.target.value;
                  set({ title, ...(slugTouched ? {} : { slug: slugify(title) }) });
                }}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Slug *</label>
              <p className="admin-hint">/blogs/&lt;slug&gt;</p>
              <input
                className="admin-input"
                required
                value={editing.slug ?? ""}
                onChange={(e) => { setSlugTouched(true); set({ slug: slugify(e.target.value) }); }}
              />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Excerpt</label>
            <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 70 }} value={editing.excerpt ?? ""} onChange={(e) => set({ excerpt: e.target.value })} />
          </div>

          <div className="admin-row-grid">
            <div className="admin-field">
              <label className="admin-label">Category</label>
              <input
                className="admin-input"
                value={editing.categoryTitle ?? ""}
                onChange={(e) => set({ categoryTitle: e.target.value, categorySlug: slugify(e.target.value) })}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Author Name</label>
              <input className="admin-input" value={editing.authorName ?? ""} onChange={(e) => set({ authorName: e.target.value })} />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Hero Image</label>
            <ImageUpload value={editing.heroImageUrl ?? ""} onChange={(url) => set({ heroImageUrl: url })} label="hero image" />
          </div>

          <div className="admin-field">
            <label className="admin-label">Hero Image Position</label>
            <p className="admin-hint">Controls which part of the image stays visible when it's cropped to fit the banner.</p>
            <select
              className="admin-input"
              value={editing.heroImagePosition ?? "center center"}
              onChange={(e) => set({ heroImagePosition: e.target.value })}
            >
              {BLOG_HERO_IMAGE_POSITIONS.map((pos) => (
                <option key={pos} value={pos}>{HERO_POSITION_LABELS[pos]}</option>
              ))}
            </select>
          </div>

          <div className="admin-actions-bar">
            <button type="submit" className="admin-btn" disabled={pending}>{pending ? "Saving…" : "Save Blog"}</button>
            <button type="button" className="admin-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        <Toast toast={saveToast} />
      </form>
    );
  }

  return (
    <div>
      {toast && <div className="admin-toast">{toast}</div>}

      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <input
          className="admin-input"
          style={{ maxWidth: 360 }}
          placeholder="Search by title, slug, or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={{ flex: 1 }} />
        <button type="button" className="admin-btn" onClick={startNew}><Plus size={16} /> Add Blog</button>
      </div>

      {items.length === 0 && (
        <p className="admin-sub">No blogs yet. Run <code>scripts/migrate-blogs.mts</code> to import from Postgres, or click Add Blog above.</p>
      )}

      {items.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 18, borderBottom: "1px solid var(--border)" }}>
          {([
            { key: "published", label: `Published (${published.length})` },
            { key: "drafts", label: `Drafts (${drafts.length})` },
          ] as { key: Tab; label: string }[]).map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                padding: "9px 16px",
                fontSize: 13.5,
                fontWeight: 600,
                background: "none",
                border: "none",
                borderBottom: tab === t.key ? "2px solid var(--rose)" : "2px solid transparent",
                color: tab === t.key ? "var(--foreground)" : "var(--muted-foreground)",
                cursor: "pointer",
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {items.length > 0 && list.length === 0 && (
        <div className="admin-empty">No {tab} blogs{search ? " match your search" : ""}.</div>
      )}

      <div style={{ display: "grid", gap: 8 }}>
        {list.map((b) => (
          <div key={b._id} className="admin-card" style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 220px", minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{b.title}</div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2, overflowWrap: "break-word" }}>
                /blogs/{b.slug} · {b.categoryTitle ?? b.categorySlug ?? "—"} · {b.authorName ?? "—"} ·{" "}
                {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString("en-IN") : "no date"}
              </div>
              {b.excerpt && (
                <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                  {b.excerpt}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
              <button
                className="admin-btn-ghost"
                style={{ fontSize: 12 }}
                disabled={busyId === b._id}
                onClick={() => toggleStatus(b)}
              >
                {busyId === b._id ? "Saving…" : b.status === "draft" ? "Publish" : "Move to draft"}
              </button>
              <button className="admin-btn-ghost" style={{ padding: "6px 10px" }} onClick={() => startEdit(b)}><Pencil size={14} /></button>
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
          </div>
        ))}
      </div>
    </div>
  );
}
