"use client";
import { useState, useTransition } from "react";
import { saveEducationVideoAction, deleteEducationVideoAction } from "../../actions";
import type { AdminEducationVideo } from "@/sanity/lib/admin";

const BLANK: AdminEducationVideo = { title: "", category: "", youtubeId: "", description: "", published: true, order: 0 };

export function EducationVideosManager({ initial }: { initial: AdminEducationVideo[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<AdminEducationVideo | null>(null);
  const [toast, setToast] = useState("");
  const [pending, startTransition] = useTransition();

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const save = () => {
    if (!editing) return;
    startTransition(async () => {
      const r = await saveEducationVideoAction(editing);
      if (!r.ok) { flash(`Error: ${r.error}`); return; }
      flash("Saved!");
      setEditing(null);
      const updated = await fetch("/admin-panel/education-videos").then(() => null).catch(() => null);
      void updated;
      window.location.reload();
    });
  };

  const del = (id: string) => {
    if (!confirm("Delete this video?")) return;
    startTransition(async () => {
      const r = await deleteEducationVideoAction(id);
      if (!r.ok) { flash(`Error: ${r.error}`); return; }
      setItems((prev) => prev.filter((i) => i._id !== id));
      flash("Deleted.");
    });
  };

  const categories = [...new Set(items.map((v) => v.category).filter(Boolean))].sort();

  return (
    <div>
      {toast && <div className="admin-toast">{toast}</div>}

      <div style={{ marginBottom: 16 }}>
        <button className="admin-btn" onClick={() => setEditing({ ...BLANK })}>+ Add Video</button>
      </div>

      {editing && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <h2 className="admin-h2" style={{ marginBottom: 16 }}>{editing._id ? "Edit Video" : "New Video"}</h2>
          <div className="admin-form-grid">
            <label className="admin-label">Title *
              <input className="admin-input" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </label>
            <label className="admin-label">Category Tab *
              <input className="admin-input" value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="e.g. IVF, PCOS, Male Infertility" />
            </label>
            <label className="admin-label">YouTube Video ID *
              <input className="admin-input" value={editing.youtubeId ?? ""} onChange={(e) => setEditing({ ...editing, youtubeId: e.target.value })} placeholder="e.g. dQw4w9WgXcQ" />
            </label>
            <label className="admin-label">Order
              <input className="admin-input" type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
            </label>
            <label className="admin-label" style={{ gridColumn: "1/-1" }}>Description
              <textarea className="admin-input" rows={3} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </label>
            <label className="admin-label" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
              Visible on site
            </label>
          </div>
          {editing.youtubeId && (
            <div style={{ marginTop: 12 }}>
              <img src={`https://img.youtube.com/vi/${editing.youtubeId}/mqdefault.jpg`} alt="thumbnail" style={{ width: 200, borderRadius: 6 }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button className="admin-btn" onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </button>
            <button className="admin-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}

      {categories.length === 0 && items.length === 0 && (
        <p className="admin-sub">No videos yet. Click "+ Add Video" or run the migration script.</p>
      )}

      {categories.map((cat) => (
        <div key={cat} style={{ marginBottom: 32 }}>
          <h2 className="admin-h2" style={{ marginBottom: 12 }}>{cat}</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {items.filter((v) => v.category === cat).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((v) => (
              <div key={v._id} className="admin-card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {v.youtubeId && (
                  <img src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} alt={v.title ?? ""} style={{ width: 80, height: 45, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{v.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{v.youtubeId} · order {v.order} · {v.published === false ? "Hidden" : "Visible"}</div>
                </div>
                <button className="admin-btn-ghost" style={{ fontSize: 12 }} onClick={() => setEditing({ ...v })}>Edit</button>
                <button className="admin-btn-ghost" style={{ fontSize: 12, color: "var(--destructive)" }} onClick={() => del(v._id!)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {items.filter((v) => !v.category).length > 0 && (
        <div>
          <h2 className="admin-h2" style={{ marginBottom: 12 }}>Uncategorised</h2>
          {items.filter((v) => !v.category).map((v) => (
            <div key={v._id} className="admin-card" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>{v.title} · {v.youtubeId}</div>
              <button className="admin-btn-ghost" style={{ fontSize: 12 }} onClick={() => setEditing({ ...v })}>Edit</button>
              <button className="admin-btn-ghost" style={{ fontSize: 12, color: "var(--destructive)" }} onClick={() => del(v._id!)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
