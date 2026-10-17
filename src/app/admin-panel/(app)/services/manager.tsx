"use client";
import { useState } from "react";
import { Pencil, Trash2, Plus, X, HeartPulse } from "lucide-react";
import type { AdminService } from "@/sanity/lib/admin";
import { materializeServiceSource, type ServiceSource } from "@/lib/services";
import { ICON_NAMES, type IconName } from "@/lib/icon-map";
import { saveServiceAction, deleteServiceAction } from "../../actions";
import { useSave, Toast } from "../_components/save-kit";
import { ImageUpload } from "../_components/image-upload";
import { Repeater } from "../_components/repeater";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

const EMPTY: AdminService = { slug: "" };

const HTML_HINT = "HTML allowed (e.g. <a href=\"/doctors/x\">name</a>) — matches the existing site copy.";

type Tab = "hero" | "seo" | "overview" | "benefits" | "whoFor" | "process" | "whyUs" | "faqs";
const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "seo", label: "SEO" },
  { id: "overview", label: "Overview" },
  { id: "benefits", label: "Benefits" },
  { id: "whoFor", label: "Who It's For" },
  { id: "process", label: "Process" },
  { id: "whyUs", label: "Why Us" },
  { id: "faqs", label: "FAQs" },
];

// Wrapped-array helpers — service.ts schema wraps string lists differently per
// field: badges use [{badge}], benefit/whoFor items use [{item}], paragraphs
// use [{text}] (see stringArr()/textArr() calls in src/sanity/schemas/service.ts).
const toLinesBadge = (a?: { badge?: string }[]) => (a ?? []).map((x) => x.badge ?? "").join("\n");
const fromLinesBadge = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean).map((badge) => ({ badge }));
const toLinesItem = (a?: { item?: string }[]) => (a ?? []).map((x) => x.item ?? "").join("\n");
const fromLinesItem = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean).map((item) => ({ item }));
const toLinesT = (a?: { text?: string }[]) => (a ?? []).map((x) => x.text ?? "").join("\n");
const fromLinesT = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean).map((text) => ({ text }));

function Field({ label, hint, value, textarea, onChange }: { label: string; hint?: string; value: string; textarea?: boolean; onChange: (v: string) => void }) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      {hint && <p className="admin-hint">{hint}</p>}
      {textarea ? (
        <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 70 }} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

/**
 * Services (Maternity) admin manager. Mirrors src/app/admin-panel/(app)/treatments/manager.tsx
 * exactly — same materialize-before-edit reasoning (resolveService() gates each
 * section on the whole section being present, not per-field), same Repeater use
 * for Process steps / Why Us points / FAQs. No Navigation tab (services aren't
 * part of the header/footer nav system — that menu is fully hardcoded). No CTA
 * tab either: the schema has a `cta` field but resolveService()/toServiceSource()
 * never read it, so it would be a dead field with no effect on the live page.
 */
export function ServicesManager({ initial }: { initial: AdminService[] }) {
  const [docs, setDocs] = useState<AdminService[]>(initial);
  const [editing, setEditing] = useState<Doc | null>(null);
  const [tab, setTab] = useState<Tab>("hero");
  const { pending, toast, run } = useSave();

  const setIn = (path: string[], val: unknown) => {
    setEditing((prev) => {
      const next = structuredClone(prev ?? {});
      let cur = next;
      for (let i = 0; i < path.length - 1; i++) {
        cur[path[i]] = cur[path[i]] ?? {};
        cur = cur[path[i]];
      }
      cur[path[path.length - 1]] = val;
      return next;
    });
  };
  const get = (path: string[]): string => {
    let cur: Doc | null = editing;
    for (const p of path) { cur = cur?.[p]; if (cur == null) return ""; }
    return typeof cur === "string" ? cur : "";
  };

  // Whitelisted to exactly the AdminService/schema shape — materializeServiceSource()
  // also seeds resolver-only fields (schemaType, breadcrumbName, reviewerSlug,
  // lastReviewed, key, related, sectionLabels) that have no Sanity schema field
  // to live in; writing those would just bloat the document.
  const startEdit = (slug: string, src: AdminService | null) => {
    const full = materializeServiceSource(slug, (src ?? null) as ServiceSource) as Doc;
    setEditing({
      _id: src?._id,
      slug,
      hero: full.hero,
      seo: full.seo,
      overview: full.overview,
      benefits: full.benefits,
      whoFor: full.whoFor,
      process: full.process,
      whyUs: full.whyUs,
      faqs: full.faqs,
    });
    setTab("hero");
  };
  const editSaved = (d: AdminService) => startEdit(d.slug ?? "", d);
  const addNew = () => { setEditing({ ...EMPTY }); setTab("hero"); };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.slug) return;
    run(async () => {
      const res = await saveServiceAction(editing as AdminService);
      if (res.ok) {
        setDocs((prev) => {
          const i = prev.findIndex((d) => d.slug === editing.slug);
          if (i >= 0) { const next = [...prev]; next[i] = { ...editing } as AdminService; return next; }
          return [...prev, { ...editing } as AdminService];
        });
        setEditing(null);
      }
      return res;
    });
  };

  const remove = (d: AdminService) => {
    if (!d._id) return;
    if (!confirm(`Delete "${d.slug}"? This removes the page permanently — /services/${d.slug} will 404.`)) return;
    run(async () => {
      const res = await deleteServiceAction(d._id!);
      if (res.ok) setDocs(docs.filter((x) => x._id !== d._id));
      return res;
    });
  };

  if (editing) {
    const badges = (editing.hero?.badges ?? []) as { badge?: string }[];
    return (
      <form onSubmit={save}>
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 className="admin-card-title" style={{ margin: 0 }}>{editing._id ? `Edit — ${editing.slug}` : "New Service"}</h2>
            <button type="button" className="admin-btn-ghost" style={{ padding: "7px 10px" }} onClick={() => setEditing(null)}><X size={16} /></button>
          </div>

          {!editing._id && (
            <div className="admin-field">
              <label className="admin-label">Slug (URL) *</label>
              <p className="admin-hint">e.g. 3d-4d-sonography — must be unique. Matching a code slug overrides it.</p>
              <input className="admin-input" required value={editing.slug ?? ""} onChange={(e) => setEditing((p: Doc) => ({ ...p, slug: e.target.value }))} />
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            {TABS.map((t) => (
              <button key={t.id} type="button" onClick={() => setTab(t.id)} className={tab === t.id ? "admin-btn" : "admin-btn-ghost"} style={{ padding: "7px 14px", fontSize: 13 }}>{t.label}</button>
            ))}
          </div>

          {tab === "hero" && (
            <>
              <Field label="Eyebrow" value={get(["hero", "eyebrow"])} onChange={(v) => setIn(["hero", "eyebrow"], v)} />
              <Field label="Heading" value={get(["hero", "h1"])} onChange={(v) => setIn(["hero", "h1"], v)} />
              <Field label="Highlighted word" value={get(["hero", "h1Em"])} onChange={(v) => setIn(["hero", "h1Em"], v)} />
              <Field label="Tagline" value={get(["hero", "tagline"])} onChange={(v) => setIn(["hero", "tagline"], v)} textarea />
              <div className="admin-field">
                <label className="admin-label">Badges</label>
                <p className="admin-hint">One per line.</p>
                <textarea className="admin-textarea" style={{ minHeight: 60 }} value={toLinesBadge(badges)} onChange={(e) => setIn(["hero", "badges"], fromLinesBadge(e.target.value))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Hero image</label>
                <ImageUpload value={get(["hero", "image"])} onChange={(url) => setIn(["hero", "image"], url)} label="Hero image" />
              </div>
              <Field label="Image alt text" value={get(["hero", "imageAlt"])} onChange={(v) => setIn(["hero", "imageAlt"], v)} />
            </>
          )}

          {tab === "seo" && (
            <>
              <Field label="Page title" value={get(["seo", "metaTitle"])} onChange={(v) => setIn(["seo", "metaTitle"], v)} />
              <Field label="Meta description" value={get(["seo", "metaDescription"])} onChange={(v) => setIn(["seo", "metaDescription"], v)} textarea />
            </>
          )}

          {tab === "overview" && (
            <>
              <div className="admin-row-grid">
                <Field label="Heading" value={get(["overview", "heading", "lead"])} onChange={(v) => setIn(["overview", "heading", "lead"], v)} />
                <Field label="Highlighted word" value={get(["overview", "heading", "em"])} onChange={(v) => setIn(["overview", "heading", "em"], v)} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Paragraphs</label>
                <p className="admin-hint">One paragraph per line. {HTML_HINT}</p>
                <textarea className="admin-textarea" style={{ minHeight: 100 }} value={toLinesT(editing.overview?.paragraphs)} onChange={(e) => setIn(["overview", "paragraphs"], fromLinesT(e.target.value))} />
              </div>
              <Field label="Callout box title (optional)" value={get(["overview", "aside", "title"])} onChange={(v) => setIn(["overview", "aside", "title"], v)} />
              <Field label="Callout box body" value={get(["overview", "aside", "body"])} onChange={(v) => setIn(["overview", "aside", "body"], v)} textarea />
            </>
          )}

          {tab === "benefits" && (
            <>
              <div className="admin-row-grid">
                <Field label="Heading" value={get(["benefits", "heading", "lead"])} onChange={(v) => setIn(["benefits", "heading", "lead"], v)} />
                <Field label="Highlighted word" value={get(["benefits", "heading", "em"])} onChange={(v) => setIn(["benefits", "heading", "em"], v)} />
              </div>
              <Field label="Subtitle" value={get(["benefits", "subtitle"])} onChange={(v) => setIn(["benefits", "subtitle"], v)} textarea />
              <div className="admin-field">
                <label className="admin-label">Benefit items</label>
                <p className="admin-hint">One per line.</p>
                <textarea className="admin-textarea" style={{ minHeight: 90 }} value={toLinesItem(editing.benefits?.items)} onChange={(e) => setIn(["benefits", "items"], fromLinesItem(e.target.value))} />
              </div>
            </>
          )}

          {tab === "whoFor" && (
            <>
              <div className="admin-row-grid">
                <Field label="Heading" value={get(["whoFor", "heading", "lead"])} onChange={(v) => setIn(["whoFor", "heading", "lead"], v)} />
                <Field label="Highlighted word" value={get(["whoFor", "heading", "em"])} onChange={(v) => setIn(["whoFor", "heading", "em"], v)} />
              </div>
              <Field label="Subtitle" value={get(["whoFor", "subtitle"])} onChange={(v) => setIn(["whoFor", "subtitle"], v)} textarea />
              <div className="admin-field">
                <label className="admin-label">Indication items</label>
                <p className="admin-hint">One per line.</p>
                <textarea className="admin-textarea" style={{ minHeight: 90 }} value={toLinesItem(editing.whoFor?.items)} onChange={(e) => setIn(["whoFor", "items"], fromLinesItem(e.target.value))} />
              </div>
            </>
          )}

          {tab === "process" && (
            <>
              <div className="admin-row-grid">
                <Field label="Heading" value={get(["process", "heading", "lead"])} onChange={(v) => setIn(["process", "heading", "lead"], v)} />
                <Field label="Highlighted word" value={get(["process", "heading", "em"])} onChange={(v) => setIn(["process", "heading", "em"], v)} />
              </div>
              <Field label="Subtitle" value={get(["process", "subtitle"])} onChange={(v) => setIn(["process", "subtitle"], v)} textarea />
              <div className="admin-field" style={{ marginTop: 12 }}>
                <label className="admin-label">Steps</label>
                <Repeater
                  items={(editing.process?.steps ?? []) as { icon?: string; t?: string; d?: string }[]}
                  onChange={(next) => setIn(["process", "steps"], next)}
                  newItem={() => ({ icon: "Sparkles", t: "", d: "" })}
                  addLabel="+ Add step"
                  rowLabel={(i) => {
                    const s = (editing.process?.steps ?? [])[i] as { t?: string } | undefined;
                    return s?.t || `Step ${i + 1}`;
                  }}
                  renderItem={(row, i, update) => (
                    <div>
                      <select className="admin-input" value={row.icon ?? "Sparkles"} onChange={(e) => update({ icon: e.target.value })}>
                        {ICON_NAMES.map((name: IconName) => <option key={name} value={name}>{name}</option>)}
                      </select>
                      <input className="admin-input" style={{ marginTop: 6 }} placeholder="Title" value={row.t ?? ""} onChange={(e) => update({ t: e.target.value })} />
                      <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 50, marginTop: 6 }} placeholder={`Description ${i + 1}`} value={row.d ?? ""} onChange={(e) => update({ d: e.target.value })} />
                    </div>
                  )}
                />
              </div>
              <Field label="Closing note" value={get(["process", "note"])} onChange={(v) => setIn(["process", "note"], v)} textarea />
            </>
          )}

          {tab === "whyUs" && (
            <>
              <div className="admin-row-grid">
                <Field label="Heading" value={get(["whyUs", "heading", "lead"])} onChange={(v) => setIn(["whyUs", "heading", "lead"], v)} />
                <Field label="Highlighted word" value={get(["whyUs", "heading", "em"])} onChange={(v) => setIn(["whyUs", "heading", "em"], v)} />
              </div>
              <div className="admin-field" style={{ marginTop: 12 }}>
                <label className="admin-label">Points</label>
                <Repeater
                  items={(editing.whyUs?.items ?? []) as { icon?: string; t?: string; d?: string }[]}
                  onChange={(next) => setIn(["whyUs", "items"], next)}
                  newItem={() => ({ icon: "Sparkles", t: "", d: "" })}
                  addLabel="+ Add point"
                  rowLabel={(i) => {
                    const w = (editing.whyUs?.items ?? [])[i] as { t?: string } | undefined;
                    return w?.t || `Point ${i + 1}`;
                  }}
                  renderItem={(row, i, update) => (
                    <div>
                      <select className="admin-input" value={row.icon ?? "Sparkles"} onChange={(e) => update({ icon: e.target.value })}>
                        {ICON_NAMES.map((name: IconName) => <option key={name} value={name}>{name}</option>)}
                      </select>
                      <input className="admin-input" style={{ marginTop: 6 }} placeholder="Title" value={row.t ?? ""} onChange={(e) => update({ t: e.target.value })} />
                      <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 50, marginTop: 6 }} placeholder={`Description ${i + 1}`} value={row.d ?? ""} onChange={(e) => update({ d: e.target.value })} />
                    </div>
                  )}
                />
              </div>
            </>
          )}

          {tab === "faqs" && (
            <div className="admin-field">
              <label className="admin-label">FAQs</label>
              <Repeater
                items={(editing.faqs ?? []) as { q?: string; a?: string }[]}
                onChange={(next) => setIn(["faqs"], next)}
                newItem={() => ({ q: "", a: "" })}
                addLabel="+ Add FAQ"
                rowLabel={(i) => {
                  const f = (editing.faqs ?? [])[i] as { q?: string } | undefined;
                  return f?.q || `FAQ ${i + 1}`;
                }}
                renderItem={(row, i, update) => (
                  <div>
                    <input className="admin-input" placeholder={`Question ${i + 1}`} value={row.q ?? ""} onChange={(e) => update({ q: e.target.value })} />
                    <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 60, marginTop: 6 }} placeholder="Answer" value={row.a ?? ""} onChange={(e) => update({ a: e.target.value })} />
                  </div>
                )}
              />
            </div>
          )}

          <div className="admin-actions-bar">
            <button type="submit" className="admin-btn" disabled={pending}>{pending ? "Saving…" : "Save Service"}</button>
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
            <h2 className="admin-card-title" style={{ margin: 0 }}>Maternity Services</h2>
            <p className="admin-card-desc" style={{ margin: "4px 0 0" }}>{docs.length} services</p>
          </div>
          <button type="button" className="admin-btn" onClick={addNew}><Plus size={16} /> Add Service</button>
        </div>

        {docs.length === 0 ? (
          <div className="admin-empty">No services yet. Add one to get started.</div>
        ) : (
          <div className="admin-divider-list">
            {docs.map((d) => (
              <div key={d._id || d.slug} className="admin-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="admin-stat-icon" style={{ width: 38, height: 38, background: "var(--rose-soft)", color: "var(--rose)" }}><HeartPulse size={18} /></span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{d.hero?.h1 || d.slug}</div>
                    <div style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginTop: 2 }}>{`/services/${d.slug}`}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button type="button" className="admin-btn-ghost" style={{ padding: "7px 10px" }} onClick={() => editSaved(d)}><Pencil size={15} /></button>
                  <button type="button" className="admin-btn-danger" style={{ padding: "7px 10px" }} onClick={() => remove(d)}><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toast toast={toast} />
    </>
  );
}
