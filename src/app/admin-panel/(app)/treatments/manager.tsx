"use client";
import { useState } from "react";
import { Pencil, Trash2, Plus, X, Syringe } from "lucide-react";
import type { AdminTreatment } from "@/sanity/lib/admin";
import { materializeTreatmentSource, type TreatmentSource } from "@/lib/treatment-content";
import { ICON_NAMES, type IconName } from "@/lib/icon-map";
import { saveTreatmentAction, deleteTreatmentAction } from "../../actions";
import { useSave, Toast } from "../_components/save-kit";
import { ImageUpload } from "../_components/image-upload";
import { Repeater } from "../_components/repeater";
import { LinkTextarea } from "../_components/link-textarea";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

const EMPTY: AdminTreatment = { slug: "" };

const NAV_CATEGORIES = [
  { value: "", label: "Not in nav" },
  { value: "advanced-ivf", label: "Advanced IVF" },
  { value: "donor-services", label: "Donor Services" },
  { value: "male-infertility", label: "Male Infertility" },
  { value: "female-infertility", label: "Female Infertility" },
  { value: "fertility-preservation", label: "Fertility Preservation" },
  { value: "maternity-services", label: "Maternity Services" },
];

type Tab = "hero" | "seo" | "whatIs" | "benefits" | "whoNeedsIt" | "process" | "risks" | "faqs" | "cta" | "nav";
const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "seo", label: "SEO" },
  { id: "whatIs", label: "What Is" },
  { id: "benefits", label: "Benefits" },
  { id: "whoNeedsIt", label: "Who Needs It" },
  { id: "process", label: "Process" },
  { id: "risks", label: "Risks" },
  { id: "faqs", label: "FAQs" },
  { id: "cta", label: "CTA" },
  { id: "nav", label: "Navigation" },
];

// Wrapped-array helpers — the schema stores string lists as [{value}] and
// paragraph lists as [{text}] (see src/sanity/schemas/treatment.ts stringArr/textArr).
const toLinesV = (a?: { value?: string }[]) => (a ?? []).map((x) => x.value ?? "").join("\n");
const fromLinesV = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean).map((value) => ({ value }));
const toLinesT = (a?: { text?: string }[]) => (a ?? []).map((x) => x.text ?? "").join("\n");
const fromLinesT = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean).map((text) => ({ text }));

// `noLink`: fields the public page renders through <Linkify> (phrase auto-link)
// instead of raw HTML (hero.tagline), or that feed a <meta> tag (meta.description)
// — an inserted <a> tag would show up as literal text/markup there, not a link.
function Field({ label, hint, value, textarea, noLink, onChange }: { label: string; hint?: string; value: string; textarea?: boolean; noLink?: boolean; onChange: (v: string) => void }) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      {hint && <p className="admin-hint">{hint}</p>}
      {textarea ? (
        noLink ? (
          <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 70 }} value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <LinkTextarea value={value} onChange={onChange} minHeight={70} />
        )
      ) : (
        <input className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

/**
 * Treatments admin manager. Mirrors src/app/admin-panel/(app)/doctors/manager.tsx
 * (list ⇄ edit toggle, code-registry "override" list) but — because
 * resolveTreatment() gates each content section on the WHOLE section being
 * present (array length / heading.lead), not per-field like Doctors — every
 * edit (new override OR re-editing a saved doc) seeds the draft via the
 * existing materializeTreatmentSource() helper, same reasoning as the About
 * Page form. This guarantees a save never submits a half-empty section that
 * would blank out its untouched siblings on the live page.
 */
export function TreatmentsManager({ initial }: { initial: AdminTreatment[] }) {
  const [docs, setDocs] = useState<AdminTreatment[]>(initial);
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

  // Whitelisted to exactly the AdminTreatment/schema shape — materializeTreatmentSource()
  // also seeds resolver-only fields (name, types, timeline, labels, etc.) that have no
  // Sanity schema field to live in; writing those would just bloat the document.
  const startEdit = (slug: string, src: AdminTreatment | null) => {
    const full = materializeTreatmentSource(slug, (src ?? null) as TreatmentSource) as Doc;
    setEditing({
      _id: src?._id,
      slug,
      href: full.href,
      navCategory: src?.navCategory,
      navOrder: src?.navOrder ?? 0,
      hero: full.hero,
      meta: full.meta,
      whatIs: full.whatIs,
      benefits: full.benefits,
      whoNeedsIt: full.whoNeedsIt,
      process: full.process,
      risks: full.risks,
      faqs: full.faqs,
      cta: full.cta,
    });
    setTab("hero");
  };
  const editSaved = (d: AdminTreatment) => startEdit(d.slug ?? "", d);
  const addNew = () => { setEditing({ ...EMPTY }); setTab("hero"); };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.slug) return;
    run(async () => {
      const res = await saveTreatmentAction(editing as AdminTreatment);
      if (res.ok) {
        setDocs((prev) => {
          const i = prev.findIndex((d) => d.slug === editing.slug);
          if (i >= 0) { const next = [...prev]; next[i] = { ...editing } as AdminTreatment; return next; }
          return [...prev, { ...editing } as AdminTreatment];
        });
        setEditing(null);
      }
      return res;
    });
  };

  const remove = (d: AdminTreatment) => {
    if (!d._id) return;
    if (!confirm(`Delete "${d.slug}"? This removes the page permanently — /treatments/${d.slug} will 404.`)) return;
    run(async () => {
      const res = await deleteTreatmentAction(d._id!);
      if (res.ok) setDocs(docs.filter((x) => x._id !== d._id));
      return res;
    });
  };

  if (editing) {
    const badges = (editing.hero?.badges ?? []) as { value?: string }[];
    return (
      <form onSubmit={save}>
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 className="admin-card-title" style={{ margin: 0 }}>{editing._id ? `Edit — ${editing.slug}` : "New Treatment"}</h2>
            <button type="button" className="admin-btn-ghost" style={{ padding: "7px 10px" }} onClick={() => setEditing(null)}><X size={16} /></button>
          </div>

          {!editing._id && (
            <div className="admin-field">
              <label className="admin-label">Slug (URL) *</label>
              <p className="admin-hint">e.g. ivf, icsi — must be unique. Matching a code slug overrides it.</p>
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
              <Field label="Tagline" value={get(["hero", "tagline"])} onChange={(v) => setIn(["hero", "tagline"], v)} textarea noLink />
              <div className="admin-field">
                <label className="admin-label">Badges</label>
                <p className="admin-hint">One per line.</p>
                <textarea className="admin-textarea" style={{ minHeight: 60 }} value={toLinesV(badges)} onChange={(e) => setIn(["hero", "badges"], fromLinesV(e.target.value))} />
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
              <Field label="Page title" value={get(["meta", "title"])} onChange={(v) => setIn(["meta", "title"], v)} />
              <Field label="Meta description" value={get(["meta", "description"])} onChange={(v) => setIn(["meta", "description"], v)} textarea noLink />
              <Field label="OG image path" hint="Overrides the hero image for social sharing." value={get(["meta", "ogImage"])} onChange={(v) => setIn(["meta", "ogImage"], v)} />
            </>
          )}

          {tab === "whatIs" && (
            <>
              <div className="admin-row-grid">
                <Field label="Heading" value={get(["whatIs", "heading", "lead"])} onChange={(v) => setIn(["whatIs", "heading", "lead"], v)} />
                <Field label="Highlighted word" value={get(["whatIs", "heading", "em"])} onChange={(v) => setIn(["whatIs", "heading", "em"], v)} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Paragraphs</label>
                <p className="admin-hint">One paragraph per line.</p>
                <LinkTextarea value={toLinesT(editing.whatIs?.paragraphs)} onChange={(v) => setIn(["whatIs", "paragraphs"], fromLinesT(v))} minHeight={100} />
              </div>
              <Field label="Callout box title (optional)" value={get(["whatIs", "aside", "title"])} onChange={(v) => setIn(["whatIs", "aside", "title"], v)} />
              <div className="admin-field">
                <label className="admin-label">Callout box body</label>
                <LinkTextarea value={get(["whatIs", "aside", "body"])} onChange={(v) => setIn(["whatIs", "aside", "body"], v)} minHeight={70} />
              </div>
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
                <textarea className="admin-textarea" style={{ minHeight: 90 }} value={toLinesV(editing.benefits?.items)} onChange={(e) => setIn(["benefits", "items"], fromLinesV(e.target.value))} />
              </div>
            </>
          )}

          {tab === "whoNeedsIt" && (
            <>
              <div className="admin-row-grid">
                <Field label="Heading" value={get(["whoNeedsIt", "heading", "lead"])} onChange={(v) => setIn(["whoNeedsIt", "heading", "lead"], v)} />
                <Field label="Highlighted word" value={get(["whoNeedsIt", "heading", "em"])} onChange={(v) => setIn(["whoNeedsIt", "heading", "em"], v)} />
              </div>
              <Field label="Subtitle" value={get(["whoNeedsIt", "subtitle"])} onChange={(v) => setIn(["whoNeedsIt", "subtitle"], v)} textarea />
              <div className="admin-field">
                <label className="admin-label">Indications</label>
                <p className="admin-hint">One per line.</p>
                <textarea className="admin-textarea" style={{ minHeight: 90 }} value={toLinesV(editing.whoNeedsIt?.items)} onChange={(e) => setIn(["whoNeedsIt", "items"], fromLinesV(e.target.value))} />
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
                  items={(editing.process?.steps ?? []) as { icon?: string; n?: string; t?: string; d?: string }[]}
                  onChange={(next) => setIn(["process", "steps"], next)}
                  newItem={() => ({ icon: "Sparkles", n: "", t: "", d: "" })}
                  addLabel="+ Add step"
                  rowLabel={(i) => {
                    const s = (editing.process?.steps ?? [])[i] as { t?: string } | undefined;
                    return s?.t || `Step ${i + 1}`;
                  }}
                  renderItem={(row, i, update) => (
                    <div>
                      <div className="admin-row-grid">
                        <select className="admin-input" value={row.icon ?? "Sparkles"} onChange={(e) => update({ icon: e.target.value })}>
                          {ICON_NAMES.map((name: IconName) => <option key={name} value={name}>{name}</option>)}
                        </select>
                        <input className="admin-input" placeholder="Step number (e.g. 01)" value={row.n ?? ""} onChange={(e) => update({ n: e.target.value })} />
                      </div>
                      <input className="admin-input" style={{ marginTop: 6 }} placeholder="Title" value={row.t ?? ""} onChange={(e) => update({ t: e.target.value })} />
                      <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 50, marginTop: 6 }} placeholder={`Description ${i + 1}`} value={row.d ?? ""} onChange={(e) => update({ d: e.target.value })} />
                    </div>
                  )}
                />
              </div>
              <Field label="Closing note" value={get(["process", "note"])} onChange={(v) => setIn(["process", "note"], v)} textarea />
            </>
          )}

          {tab === "risks" && (
            <>
              <div className="admin-row-grid">
                <Field label="Heading" value={get(["risks", "heading", "lead"])} onChange={(v) => setIn(["risks", "heading", "lead"], v)} />
                <Field label="Highlighted word" value={get(["risks", "heading", "em"])} onChange={(v) => setIn(["risks", "heading", "em"], v)} />
              </div>
              <Field label="Subtitle" value={get(["risks", "subtitle"])} onChange={(v) => setIn(["risks", "subtitle"], v)} textarea />
              <div className="admin-field" style={{ marginTop: 12 }}>
                <label className="admin-label">Risk items</label>
                <Repeater
                  items={(editing.risks?.items ?? []) as { t?: string; d?: string; help?: string }[]}
                  onChange={(next) => setIn(["risks", "items"], next)}
                  newItem={() => ({ t: "", d: "", help: "" })}
                  addLabel="+ Add risk"
                  rowLabel={(i) => {
                    const r = (editing.risks?.items ?? [])[i] as { t?: string } | undefined;
                    return r?.t || `Risk ${i + 1}`;
                  }}
                  renderItem={(row, i, update) => (
                    <div>
                      <input className="admin-input" placeholder="Risk title" value={row.t ?? ""} onChange={(e) => update({ t: e.target.value })} />
                      <div style={{ marginTop: 6 }}><LinkTextarea value={row.d ?? ""} onChange={(v) => update({ d: v })} minHeight={50} /></div>
                      <div style={{ marginTop: 6 }}><LinkTextarea value={row.help ?? ""} onChange={(v) => update({ help: v })} minHeight={50} /></div>
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

          {tab === "cta" && (
            <>
              <Field label="Heading" value={get(["cta", "heading"])} onChange={(v) => setIn(["cta", "heading"], v)} />
              <Field label="Highlighted word" value={get(["cta", "headingEm"])} onChange={(v) => setIn(["cta", "headingEm"], v)} />
              <Field label="Subtitle" value={get(["cta", "subtitle"])} onChange={(v) => setIn(["cta", "subtitle"], v)} textarea />
            </>
          )}

          {tab === "nav" && (
            <>
              <div className="admin-row-grid">
                <div className="admin-field">
                  <label className="admin-label">Header/footer nav column</label>
                  <select className="admin-input" value={editing.navCategory ?? ""} onChange={(e) => setEditing((p: Doc) => ({ ...p, navCategory: e.target.value || undefined }))}>
                    {NAV_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Nav order</label>
                  <p className="admin-hint">Lower = earlier in the column.</p>
                  <input className="admin-input" type="number" value={editing.navOrder ?? 0} onChange={(e) => setEditing((p: Doc) => ({ ...p, navOrder: Number(e.target.value) }))} />
                </div>
              </div>
              <Field label="Page URL override" hint="Leave blank to use /treatments/[slug]." value={editing.href ?? ""} onChange={(v) => setEditing((p: Doc) => ({ ...p, href: v || undefined }))} />
            </>
          )}

          <div className="admin-actions-bar">
            <button type="submit" className="admin-btn" disabled={pending}>{pending ? "Saving…" : "Save Treatment"}</button>
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
            <h2 className="admin-card-title" style={{ margin: 0 }}>Treatments</h2>
            <p className="admin-card-desc" style={{ margin: "4px 0 0" }}>{docs.length} treatments</p>
          </div>
          <button type="button" className="admin-btn" onClick={addNew}><Plus size={16} /> Add Treatment</button>
        </div>

        {docs.length === 0 ? (
          <div className="admin-empty">No treatments yet. Add one to get started.</div>
        ) : (
          <div className="admin-divider-list">
            {docs.map((d) => (
              <div key={d._id || d.slug} className="admin-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="admin-stat-icon" style={{ width: 38, height: 38, background: "var(--rose-soft)", color: "var(--rose)" }}><Syringe size={18} /></span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{d.hero?.h1 || d.slug}</div>
                    <div style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginTop: 2 }}>{d.href || `/treatments/${d.slug}`}</div>
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
