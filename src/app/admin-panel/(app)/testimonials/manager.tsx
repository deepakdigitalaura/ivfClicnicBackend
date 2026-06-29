"use client";
import { useState, useMemo } from "react";
import { Pencil, Trash2, Plus, X, Star, Play, Eye, EyeOff } from "lucide-react";
import type { AdminTestimonial } from "@/sanity/lib/admin";
import { saveTestimonialAction, deleteTestimonialAction } from "../../actions";
import { useSave, Toast } from "../_components/save-kit";

const EMPTY: AdminTestimonial = { author: "", quote: "", rating: 5, published: true, order: 0 };

type Filter = "all" | "text" | "video";

function Stars({ n }: { n: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} fill={i < n ? "var(--gold)" : "none"} color={i < n ? "var(--gold)" : "var(--border)"} />
      ))}
    </span>
  );
}

export function TestimonialsManager({ initial }: { initial: AdminTestimonial[] }) {
  const [items, setItems] = useState<AdminTestimonial[]>(initial);
  const [editing, setEditing] = useState<AdminTestimonial | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const { pending, toast, run } = useSave();

  const stats = useMemo(() => ({
    total: items.length,
    video: items.filter((t) => t.youtubeId).length,
    visible: items.filter((t) => t.published !== false).length,
  }), [items]);

  const filtered = items.filter((t) =>
    filter === "all" ? true : filter === "video" ? !!t.youtubeId : !t.youtubeId);

  const set = (patch: Partial<AdminTestimonial>) => setEditing((p) => ({ ...(p ?? EMPTY), ...patch }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.author || !editing?.quote) return;
    run(async () => {
      const res = await saveTestimonialAction(editing);
      if (res.ok) {
        setItems((prev) => {
          const i = prev.findIndex((x) => x._id && x._id === editing._id);
          if (i >= 0) { const next = [...prev]; next[i] = { ...editing }; return next; }
          return [...prev, { ...editing }];
        });
        setEditing(null);
      }
      return res;
    });
  };

  const toggleVisible = (t: AdminTestimonial) => {
    const updated = { ...t, published: !(t.published !== false) };
    setItems(items.map((x) => (x._id === t._id ? updated : x)));
    run(() => saveTestimonialAction(updated));
  };

  const remove = (t: AdminTestimonial) => {
    if (!t._id || !confirm(`Delete testimonial from ${t.author}?`)) return;
    setItems(items.filter((x) => x._id !== t._id));
    run(() => deleteTestimonialAction(t._id!));
  };

  if (editing) {
    return (
      <form onSubmit={save}>
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 className="admin-card-title" style={{ margin: 0 }}>{editing._id ? "Edit Testimonial" : "New Testimonial"}</h2>
            <button type="button" className="admin-btn-ghost" style={{ padding: "7px 10px" }} onClick={() => setEditing(null)}><X size={16} /></button>
          </div>

          <div className="admin-row-grid">
            <div className="admin-field">
              <label className="admin-label">Name *</label>
              <input className="admin-input" required value={editing.author ?? ""} onChange={(e) => set({ author: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Sub-line</label>
              <p className="admin-hint">e.g. IVF patient, Ahmedabad</p>
              <input className="admin-input" value={editing.role ?? ""} onChange={(e) => set({ role: e.target.value })} />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Quote *</label>
            <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 90 }} required value={editing.quote ?? ""} onChange={(e) => set({ quote: e.target.value })} />
          </div>

          <div className="admin-row-grid">
            <div className="admin-field">
              <label className="admin-label">Rating</label>
              <select className="admin-input" value={editing.rating ?? 5} onChange={(e) => set({ rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Order</label>
              <input className="admin-input" type="number" value={editing.order ?? 0} onChange={(e) => set({ order: Number(e.target.value) })} />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">YouTube Video ID (optional)</label>
            <p className="admin-hint">Fill this to make it a <b>video</b> testimonial (shows on /testimonial-videos). Leave blank for a text testimonial (homepage). e.g. dQw4w9WgXcQ</p>
            <input className="admin-input" value={editing.youtubeId ?? ""} onChange={(e) => set({ youtubeId: e.target.value })} />
          </div>

          <div className="admin-toggle-row">
            <input type="checkbox" className="admin-toggle" checked={editing.published !== false} onChange={(e) => set({ published: e.target.checked })} />
            <span style={{ fontSize: 13.5 }}>{editing.published !== false ? "Visible on site" : "Hidden"}</span>
          </div>

          <div className="admin-actions-bar">
            <button type="submit" className="admin-btn" disabled={pending}>{pending ? "Saving…" : "Save Testimonial"}</button>
            <button type="button" className="admin-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        <Toast toast={toast} />
      </form>
    );
  }

  return (
    <>
      <div style={{ display: "flex", gap: 14, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div className="admin-stat" style={{ padding: "12px 18px" }}><div><div className="admin-stat-num" style={{ fontSize: 22 }}>{stats.total}</div><div className="admin-stat-label">Total</div></div></div>
        <div className="admin-stat" style={{ padding: "12px 18px" }}><div><div className="admin-stat-num" style={{ fontSize: 22 }}>{stats.video}</div><div className="admin-stat-label">Video</div></div></div>
        <div className="admin-stat" style={{ padding: "12px 18px" }}><div><div className="admin-stat-num" style={{ fontSize: 22, color: "#166534" }}>{stats.visible}</div><div className="admin-stat-label">Visible</div></div></div>
        <div style={{ flex: 1 }} />
        <button type="button" className="admin-btn" onClick={() => setEditing({ ...EMPTY })}><Plus size={16} /> Add Testimonial</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {(["all", "text", "video"] as Filter[]).map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={filter === f ? "admin-btn" : "admin-btn-ghost"} style={{ textTransform: "capitalize", padding: "7px 16px" }}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">No {filter === "all" ? "" : filter} testimonials yet.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
          {filtered.map((t) => {
            const visible = t.published !== false;
            return (
              <div key={t._id} className="admin-card" style={{ padding: 18, opacity: visible ? 1 : 0.6, borderLeft: `3px solid ${t.youtubeId ? "var(--plum)" : "var(--rose)"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <strong style={{ fontSize: 15 }}>{t.author}</strong>
                    {t.role && <div style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>{t.role}</div>}
                    <div style={{ marginTop: 4 }}><Stars n={t.rating ?? 5} /></div>
                  </div>
                  {t.youtubeId && <span className="admin-badge" style={{ background: "#ede9fe", color: "var(--plum)", display: "inline-flex", gap: 4, alignItems: "center" }}><Play size={11} /> Video</span>}
                </div>
                <p style={{ margin: "0 0 14px", fontSize: 13.5, lineHeight: 1.5, fontStyle: "italic", color: "var(--foreground)" }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display: "flex", gap: 6 }}>
                  <button type="button" className="admin-btn-ghost" style={{ padding: "6px 11px", fontSize: 13 }} onClick={() => toggleVisible(t)}>
                    {visible ? <><EyeOff size={14} /> Hide</> : <><Eye size={14} /> Show</>}
                  </button>
                  <button type="button" className="admin-btn-ghost" style={{ padding: "6px 10px" }} onClick={() => setEditing(t)}><Pencil size={14} /></button>
                  <button type="button" className="admin-btn-danger" style={{ padding: "6px 10px" }} onClick={() => remove(t)}><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Toast toast={toast} />
    </>
  );
}
