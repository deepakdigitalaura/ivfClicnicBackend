"use client";
import { useState } from "react";
import { Pencil, Trash2, Plus, X, Stethoscope } from "lucide-react";
import type { AdminDoctor } from "@/sanity/lib/admin";
import { saveDoctorAction, deleteDoctorAction } from "../../actions";
import { useSave, Toast } from "../_components/save-kit";
import { ImageUpload } from "../_components/image-upload";

type CodeDoctor = { slug: string; name: string; specialty: string; image: string };

const EMPTY: AdminDoctor = { slug: "", name: "", verified: false, navOrder: 0 };

// Comma/line helpers for the array fields.
const toLines = (a?: string[]) => (a ?? []).join("\n");
const fromLines = (v: string) => v.split("\n").map((s) => s.trim()).filter(Boolean);

export function DoctorsManager({ initial, codeDoctors }: { initial: AdminDoctor[]; codeDoctors: CodeDoctor[] }) {
  const [docs, setDocs] = useState<AdminDoctor[]>(initial);
  const [editing, setEditing] = useState<AdminDoctor | null>(null);
  const { pending, toast, run } = useSave();

  const savedSlugs = new Set(docs.map((d) => d.slug));
  const overridableCode = codeDoctors.filter((c) => !savedSlugs.has(c.slug));

  const set = (patch: Partial<AdminDoctor>) => setEditing((p) => ({ ...(p ?? EMPTY), ...patch }));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.slug || !editing?.name) return;
    run(async () => {
      const res = await saveDoctorAction(editing);
      if (res.ok) {
        setDocs((prev) => {
          const i = prev.findIndex((d) => d.slug === editing.slug);
          if (i >= 0) { const next = [...prev]; next[i] = { ...editing }; return next; }
          return [...prev, { ...editing }];
        });
        setEditing(null);
      }
      return res;
    });
  };

  const remove = (d: AdminDoctor) => {
    if (!d._id) return;
    if (!confirm(`Delete ${d.name}? This removes the Sanity override (code default returns).`)) return;
    run(async () => {
      const res = await deleteDoctorAction(d._id!);
      if (res.ok) setDocs(docs.filter((x) => x._id !== d._id));
      return res;
    });
  };

  const editCode = (c: CodeDoctor) => setEditing({ slug: c.slug, name: c.name, specialty: c.specialty, verified: false });

  if (editing) {
    return (
      <form onSubmit={save}>
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 className="admin-card-title" style={{ margin: 0 }}>{editing._id ? "Edit Doctor" : "New Doctor"}</h2>
            <button type="button" className="admin-btn-ghost" style={{ padding: "7px 10px" }} onClick={() => setEditing(null)}><X size={16} /></button>
          </div>

          <div className="admin-row-grid">
            <div className="admin-field">
              <label className="admin-label">Slug (URL) *</label>
              <p className="admin-hint">e.g. dr-himanshu-bavishi</p>
              <input className="admin-input" required value={editing.slug ?? ""} onChange={(e) => set({ slug: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Full name *</label>
              <input className="admin-input" required value={editing.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Credentials</label>
              <input className="admin-input" placeholder="M.D., D.G.O." value={editing.credentials ?? ""} onChange={(e) => set({ credentials: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Specialty line</label>
              <input className="admin-input" placeholder="Fertility Specialist & Gynaecologist" value={editing.specialty ?? ""} onChange={(e) => set({ specialty: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Role</label>
              <input className="admin-input" placeholder="Director & Chief IVF Specialist" value={editing.role ?? ""} onChange={(e) => set({ role: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Doctor Photo</label>
              <ImageUpload value={editing.imageUrl ?? ""} onChange={(url) => set({ imageUrl: url })} label="Photo" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Experience label</label>
              <input className="admin-input" placeholder="35+ yrs" value={editing.experienceLabel ?? ""} onChange={(e) => set({ experienceLabel: e.target.value })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Experience (years)</label>
              <input className="admin-input" type="number" value={editing.experienceYears ?? ""} onChange={(e) => set({ experienceYears: e.target.value ? Number(e.target.value) : undefined })} />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Short bio</label>
            <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 60 }} value={editing.shortBio ?? ""} onChange={(e) => set({ shortBio: e.target.value })} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Bio paragraphs</label>
            <p className="admin-hint">One paragraph per line.</p>
            <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 90 }} value={toLines(editing.bio)} onChange={(e) => set({ bio: fromLines(e.target.value) })} />
          </div>

          <div className="admin-row-grid">
            <div className="admin-field">
              <label className="admin-label">Cities</label>
              <p className="admin-hint">One per line.</p>
              <textarea className="admin-textarea" style={{ minHeight: 70 }} value={toLines(editing.cities)} onChange={(e) => set({ cities: fromLines(e.target.value) })} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Treatment slugs</label>
              <p className="admin-hint">One per line (ivf, icsi, iui…).</p>
              <textarea className="admin-textarea" style={{ minHeight: 70 }} value={toLines(editing.treatments)} onChange={(e) => set({ treatments: fromLines(e.target.value) })} />
            </div>
          </div>

          <details style={{ marginTop: 8 }}>
            <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Advanced credentials (EEAT) — optional</summary>
            <div className="admin-row-grid">
              {([
                ["alumniOf", "Alumni of / degrees"],
                ["memberOf", "Member of"],
                ["awards", "Awards"],
                ["training", "Advanced training"],
                ["publications", "Publications / books"],
                ["knowsAbout", "Knows about"],
                ["languages", "Languages"],
                ["sameAs", "Profile URLs (sameAs)"],
              ] as [keyof AdminDoctor, string][]).map(([key, label]) => (
                <div className="admin-field" key={key}>
                  <label className="admin-label">{label}</label>
                  <textarea className="admin-textarea" style={{ minHeight: 60 }} value={toLines(editing[key] as string[] | undefined)} onChange={(e) => set({ [key]: fromLines(e.target.value) } as Partial<AdminDoctor>)} />
                </div>
              ))}
            </div>
          </details>

          <div className="admin-row-grid" style={{ marginTop: 12 }}>
            <div className="admin-field">
              <label className="admin-label">Header/footer role</label>
              <select className="admin-input" value={editing.navRole ?? ""} onChange={(e) => set({ navRole: (e.target.value || undefined) as AdminDoctor["navRole"] })}>
                <option value="">Not in nav</option>
                <option value="senior-specialist">Senior Specialist</option>
                <option value="specialist">Specialist</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">List order</label>
              <input className="admin-input" type="number" value={editing.navOrder ?? 0} onChange={(e) => set({ navOrder: Number(e.target.value) })} />
            </div>
          </div>

          <div className="admin-toggle-row" style={{ marginTop: 6 }}>
            <input type="checkbox" className="admin-toggle" checked={editing.verified ?? false} onChange={(e) => set({ verified: e.target.checked })} />
            <span style={{ fontSize: 13.5 }}>Verified (degrees & experience confirmed)</span>
          </div>
          <div className="admin-toggle-row">
            <input type="checkbox" className="admin-toggle" checked={editing.visitsAllCentres ?? false} onChange={(e) => set({ visitsAllCentres: e.target.checked })} />
            <span style={{ fontSize: 13.5 }}>Visits all centres (rotating senior specialist)</span>
          </div>

          <div className="admin-actions-bar">
            <button type="submit" className="admin-btn" disabled={pending}>{pending ? "Saving…" : "Save Doctor"}</button>
            <button type="button" className="admin-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        <Toast toast={toast} />
      </form>
    );
  }

  return (
    <>
      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 className="admin-card-title" style={{ margin: 0 }}>Doctors</h2>
            <p className="admin-card-desc" style={{ margin: "4px 0 0" }}>{docs.length} edited in admin · {codeDoctors.length} built-in</p>
          </div>
          <button type="button" className="admin-btn" onClick={() => setEditing({ ...EMPTY })}><Plus size={16} /> Add Doctor</button>
        </div>

        {docs.length === 0 ? (
          <div className="admin-empty">No admin doctors yet. Add a new one, or override a built-in doctor below.</div>
        ) : (
          <div className="admin-divider-list">
            {docs.map((d) => (
              <div key={d._id || d.slug} className="admin-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="admin-stat-icon" style={{ width: 38, height: 38, background: "var(--rose-soft)", color: "var(--rose)" }}><Stethoscope size={18} /></span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{d.name} {d.verified && <span className="admin-badge admin-badge-on" style={{ marginLeft: 6 }}>verified</span>}</div>
                    <div style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginTop: 2 }}>/doctors/{d.slug} · {d.specialty || "—"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button type="button" className="admin-btn-ghost" style={{ padding: "7px 10px" }} onClick={() => setEditing(d)}><Pencil size={15} /></button>
                  <button type="button" className="admin-btn-danger" style={{ padding: "7px 10px" }} onClick={() => remove(d)}><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {overridableCode.length > 0 && (
        <div className="admin-card">
          <h2 className="admin-card-title">Built-in Doctors</h2>
          <p className="admin-card-desc">These come from the site code. Click Override to edit one in the admin (your changes win; the rest stays as-is).</p>
          <div className="admin-divider-list">
            {overridableCode.map((c) => (
              <div key={c.slug} className="admin-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 0 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginTop: 2 }}>/doctors/{c.slug} · {c.specialty}</div>
                </div>
                <button type="button" className="admin-btn-ghost" onClick={() => editCode(c)}><Pencil size={14} /> Override</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <Toast toast={toast} />
    </>
  );
}
