"use client";
import { useState } from "react";
import { Trash2, Pencil, Plus, X } from "lucide-react";
import type { PageSeo } from "@/sanity/lib/fetch";
import { savePageSeoAction, deletePageSeoAction } from "../../actions";
import { useSave, Toast } from "../_components/save-kit";

type Entry = PageSeo & { _id?: string };

const EMPTY: Entry = {
  pagePath: "", pageName: "", metaTitle: "", metaDescription: "",
  ogTitle: "", ogDescription: "", ogImageUrl: "", canonicalUrl: "", noIndex: false,
  customSchemaJson: "",
};

export function PageSeoManager({ initial }: { initial: (PageSeo & { _id: string })[] }) {
  const [entries, setEntries] = useState<(PageSeo & { _id: string })[]>(initial);
  const [editing, setEditing] = useState<Entry | null>(null);
  const { pending, toast, run } = useSave();

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    run(async () => {
      const res = await savePageSeoAction(editing);
      if (res.ok) setEditing(null);
      return res;
    });
  };

  const remove = (id: string) => {
    if (!confirm("Delete this SEO entry?")) return;
    run(async () => {
      const res = await deletePageSeoAction(id);
      if (res.ok) setEntries(entries.filter((x) => x._id !== id));
      return res;
    });
  };

  const set = (patch: Partial<Entry>) => setEditing((prev) => ({ ...(prev ?? EMPTY), ...patch }));

  return (
    <>
      {!editing && (
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 className="admin-card-title" style={{ margin: 0 }}>SEO Overrides</h2>
              <p className="admin-card-desc" style={{ margin: "4px 0 0" }}>{entries.length} page{entries.length === 1 ? "" : "s"} configured</p>
            </div>
            <button type="button" className="admin-btn" onClick={() => setEditing({ ...EMPTY })}><Plus size={16} /> Add Page</button>
          </div>

          {entries.length === 0 ? (
            <div className="admin-empty">No SEO overrides yet. Click “Add Page” to set a page&apos;s title &amp; description.</div>
          ) : (
            <div className="admin-divider-list">
              {entries.map((e) => (
                <div key={e._id} className="admin-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 0 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{e.pageName || e.pagePath}{e.noIndex && <span className="admin-badge admin-badge-off" style={{ marginLeft: 8 }}>noindex</span>}</div>
                    <div style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginTop: 2 }}>{e.pagePath} · {e.metaTitle || "no title set"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button type="button" className="admin-btn-ghost" style={{ padding: "7px 10px" }} onClick={() => setEditing(e)}><Pencil size={15} /></button>
                    <button type="button" className="admin-btn-danger" style={{ padding: "7px 10px" }} onClick={() => remove(e._id)}><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {editing && (
        <form onSubmit={save}>
          <div className="admin-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 className="admin-card-title" style={{ margin: 0 }}>{editing._id ? "Edit Page SEO" : "New Page SEO"}</h2>
              <button type="button" className="admin-btn-ghost" style={{ padding: "7px 10px" }} onClick={() => setEditing(null)}><X size={16} /></button>
            </div>

            <div className="admin-row-grid">
              <div className="admin-field">
                <label className="admin-label">Page path *</label>
                <p className="admin-hint">Exact URL, e.g. <code>/about-bfi</code></p>
                <input className="admin-input" required value={editing.pagePath ?? ""} onChange={(e) => set({ pagePath: e.target.value })} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Label</label>
                <p className="admin-hint">For your reference only</p>
                <input className="admin-input" value={editing.pageName ?? ""} onChange={(e) => set({ pageName: e.target.value })} />
              </div>
            </div>

            <div className="admin-field">
              <label className="admin-label">Meta title</label>
              <p className="admin-hint">Shown in the browser tab &amp; Google results. ≤ 60 chars. ({(editing.metaTitle ?? "").length})</p>
              <input className="admin-input" value={editing.metaTitle ?? ""} onChange={(e) => set({ metaTitle: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Meta description</label>
              <p className="admin-hint">The snippet under the title in Google. ≤ 160 chars. ({(editing.metaDescription ?? "").length})</p>
              <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 70 }} value={editing.metaDescription ?? ""} onChange={(e) => set({ metaDescription: e.target.value })} />
            </div>

            <div className="admin-row-grid">
              <div className="admin-field">
                <label className="admin-label">Social title (OG)</label>
                <input className="admin-input" value={editing.ogTitle ?? ""} onChange={(e) => set({ ogTitle: e.target.value })} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Social image URL</label>
                <input className="admin-input" placeholder="https://… (1200×630)" value={editing.ogImageUrl ?? ""} onChange={(e) => set({ ogImageUrl: e.target.value })} />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">Social description (OG)</label>
              <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 70 }} value={editing.ogDescription ?? ""} onChange={(e) => set({ ogDescription: e.target.value })} />
            </div>

            <div className="admin-row-grid">
              <div className="admin-field">
                <label className="admin-label">Canonical URL (optional)</label>
                <input className="admin-input" value={editing.canonicalUrl ?? ""} onChange={(e) => set({ canonicalUrl: e.target.value })} />
              </div>
              <div className="admin-field" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <label className="admin-label">Search visibility</label>
                <div className="admin-toggle-row">
                  <input type="checkbox" className="admin-toggle" checked={editing.noIndex ?? false} onChange={(e) => set({ noIndex: e.target.checked })} />
                  <span style={{ fontSize: 13.5 }}>{editing.noIndex ? "Hidden (noindex)" : "Indexed by Google"}</span>
                </div>
              </div>
            </div>

            <div className="admin-field">
              <label className="admin-label">Structured Data — JSON-LD (page-specific)</label>
              <p className="admin-hint">
                Paste a valid JSON-LD object for <em>this page only</em>. Example types:{" "}
                <code>MedicalProcedure</code>, <code>Physician</code>, <code>FAQPage</code>,{" "}
                <code>Article</code>. Leave blank to skip. Invalid JSON is silently ignored.
              </p>
              <textarea
                className="admin-textarea"
                style={{ fontFamily: "monospace", fontSize: 12, minHeight: 140 }}
                placeholder={'{\n  "@type": "MedicalProcedure",\n  "name": "IVF"\n}'}
                value={editing.customSchemaJson ?? ""}
                onChange={(e) => set({ customSchemaJson: e.target.value })}
                spellCheck={false}
              />
              {(() => {
                const v = editing.customSchemaJson?.trim();
                if (!v) return null;
                try { JSON.parse(v); return <p style={{ fontSize: 12, color: "green", marginTop: 4 }}>✓ Valid JSON</p>; }
                catch { return <p style={{ fontSize: 12, color: "red", marginTop: 4 }}>✗ Invalid JSON — will not be injected</p>; }
              })()}
            </div>

            <div className="admin-actions-bar">
              <button type="submit" className="admin-btn" disabled={pending}>{pending ? "Saving…" : "Save Page SEO"}</button>
              <button type="button" className="admin-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </form>
      )}
      <Toast toast={toast} />
    </>
  );
}
