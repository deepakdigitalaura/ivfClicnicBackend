"use client";
import { useState, useTransition } from "react";
import { savePressAction, deletePressAction } from "../../actions";
import { ImageUpload } from "../_components/image-upload";
import type { AdminPress } from "@/sanity/lib/admin";

/** Editing form uses bodyText/doctorsQuoted as plain text for easier
 *  editing — paragraphs separated by a blank line, doctors comma-separated —
 *  then split back into arrays on save. */
type EditingPress = Omit<AdminPress, "bodyText" | "doctorsQuoted"> & {
  bodyText: string;
  doctorsQuoted: string;
};

const BLANK: EditingPress = {
  slug: "",
  headline: "",
  headlineOriginal: "",
  standfirst: "",
  publication: "",
  edition: "",
  date: "",
  byline: "",
  language: "English",
  summary: "",
  bodyText: "",
  doctorsQuoted: "",
  image: "",
  thumb: "",
  width: undefined,
  height: undefined,
  order: 0,
  published: true,
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function toEditing(p: AdminPress): EditingPress {
  return {
    ...p,
    bodyText: (p.bodyText ?? []).join("\n\n"),
    doctorsQuoted: (p.doctorsQuoted ?? []).join(", "),
  };
}

function toSaveDoc(e: EditingPress): AdminPress {
  return {
    ...e,
    slug: e.slug?.trim() || slugify(e.headline ?? ""),
    bodyText: e.bodyText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    doctorsQuoted: e.doctorsQuoted.split(",").map((d) => d.trim()).filter(Boolean),
  };
}

export function PressManager({ initial }: { initial: AdminPress[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<EditingPress | null>(null);
  const [toast, setToast] = useState("");
  const [pending, startTransition] = useTransition();

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const save = () => {
    if (!editing) return;
    if (!editing.headline?.trim() || !editing.publication?.trim() || !editing.summary?.trim() || !editing.image || !editing.thumb) {
      flash("Headline, publication, summary and both images are required.");
      return;
    }
    startTransition(async () => {
      const r = await savePressAction(toSaveDoc(editing));
      if (!r.ok) { flash(`Error: ${r.error}`); return; }
      flash("Saved!");
      setEditing(null);
      window.location.reload();
    });
  };

  const del = (id: string, slug?: string) => {
    if (!confirm("Delete this clipping? This cannot be undone.")) return;
    startTransition(async () => {
      const r = await deletePressAction(id, slug);
      if (!r.ok) { flash(`Error: ${r.error}`); return; }
      setItems((prev) => prev.filter((i) => i._id !== id));
      flash("Deleted.");
    });
  };

  const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div>
      {toast && <div className="admin-toast">{toast}</div>}

      <div style={{ marginBottom: 16 }}>
        <button className="admin-btn" onClick={() => setEditing({ ...BLANK })}>+ Add Clipping</button>
      </div>

      {editing && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <h2 className="admin-h2" style={{ marginBottom: 16 }}>{editing._id ? "Edit Clipping" : "New Clipping"}</h2>

          <div className="admin-form-grid">
            <label className="admin-label">Headline (English) *
              <input className="admin-input" value={editing.headline ?? ""} onChange={(e) => setEditing({ ...editing, headline: e.target.value })} />
            </label>
            <label className="admin-label">Slug
              <input className="admin-input" value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto-generated from headline if left blank" />
            </label>
            <label className="admin-label">Headline (Original Language)
              <input className="admin-input" value={editing.headlineOriginal ?? ""} onChange={(e) => setEditing({ ...editing, headlineOriginal: e.target.value })} />
            </label>
            <label className="admin-label">Publication *
              <input className="admin-input" value={editing.publication ?? ""} onChange={(e) => setEditing({ ...editing, publication: e.target.value })} placeholder="e.g. The Times of India" />
            </label>
            <label className="admin-label">Edition / City
              <input className="admin-input" value={editing.edition ?? ""} onChange={(e) => setEditing({ ...editing, edition: e.target.value })} placeholder="e.g. Ahmedabad" />
            </label>
            <label className="admin-label">Date
              <input className="admin-input" value={editing.date ?? ""} onChange={(e) => setEditing({ ...editing, date: e.target.value })} placeholder="leave blank if not legible on the clipping" />
            </label>
            <label className="admin-label">Byline
              <input className="admin-input" value={editing.byline ?? ""} onChange={(e) => setEditing({ ...editing, byline: e.target.value })} placeholder="e.g. Times News Network" />
            </label>
            <label className="admin-label">Language *
              <select className="admin-input" value={editing.language ?? "English"} onChange={(e) => setEditing({ ...editing, language: e.target.value as "English" | "Gujarati" })}>
                <option value="English">English</option>
                <option value="Gujarati">Gujarati</option>
              </select>
            </label>
            <label className="admin-label">Order
              <input className="admin-input" type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
            </label>
            <label className="admin-label" style={{ gridColumn: "1/-1" }}>Standfirst / Sub-headline
              <input className="admin-input" value={editing.standfirst ?? ""} onChange={(e) => setEditing({ ...editing, standfirst: e.target.value })} />
            </label>
            <label className="admin-label" style={{ gridColumn: "1/-1" }}>Summary * (meta/OG only — not shown as page copy)
              <textarea className="admin-input" rows={2} value={editing.summary ?? ""} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} />
            </label>
            <label className="admin-label" style={{ gridColumn: "1/-1" }}>Body Text — full transcribed article, separate paragraphs with a blank line
              <textarea className="admin-input" rows={10} value={editing.bodyText} onChange={(e) => setEditing({ ...editing, bodyText: e.target.value })} />
            </label>
            <label className="admin-label" style={{ gridColumn: "1/-1" }}>Doctors Quoted (comma-separated)
              <input className="admin-input" value={editing.doctorsQuoted} onChange={(e) => setEditing({ ...editing, doctorsQuoted: e.target.value })} placeholder="e.g. Dr. Falguni Bavishi, Dr. Himanshu Bavishi" />
            </label>

            <div className="admin-field">
              <ImageUpload value={editing.image ?? ""} onChange={(url) => setEditing({ ...editing, image: url })} label="Full-Resolution Scan" />
            </div>
            <div className="admin-field">
              <ImageUpload value={editing.thumb ?? ""} onChange={(url) => setEditing({ ...editing, thumb: url })} label="Grid Thumbnail" />
            </div>

            <label className="admin-label">Image Width (px)
              <input className="admin-input" type="number" value={editing.width ?? ""} onChange={(e) => setEditing({ ...editing, width: Number(e.target.value) || undefined })} />
            </label>
            <label className="admin-label">Image Height (px)
              <input className="admin-input" type="number" value={editing.height ?? ""} onChange={(e) => setEditing({ ...editing, height: Number(e.target.value) || undefined })} />
            </label>

            <label className="admin-label" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
              Visible on site
            </label>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button className="admin-btn" onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </button>
            <button className="admin-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}

      {sorted.length === 0 && <p className="admin-sub">No press clippings yet. Click "+ Add Clipping".</p>}

      <div style={{ display: "grid", gap: 10 }}>
        {sorted.map((p) => (
          <div key={p._id} className="admin-card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {p.thumb && (
              <img src={p.thumb} alt={p.headline ?? ""} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{p.headline}</div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                {p.publication}{p.date ? ` · ${p.date}` : ""} · order {p.order} · {p.published === false ? "Hidden" : "Visible"}
              </div>
            </div>
            <button className="admin-btn-ghost" style={{ fontSize: 12 }} onClick={() => setEditing(toEditing(p))}>Edit</button>
            <button className="admin-btn-ghost" style={{ fontSize: 12, color: "var(--destructive)" }} onClick={() => del(p._id!, p.slug)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
