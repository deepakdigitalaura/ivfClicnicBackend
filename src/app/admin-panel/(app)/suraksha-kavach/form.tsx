"use client";
import { useState, useCallback } from "react";
import { materializeSurakshaKavachSource, type SurakshaKavachSource } from "@/lib/suraksha-kavach";
import { ICON_NAMES, type IconName } from "@/lib/icon-map";
import { saveSurakshaKavachAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { ImageUpload } from "../_components/image-upload";
import { Repeater } from "../_components/repeater";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

type Tab = "hero" | "story" | "benefits" | "stats" | "steps" | "faqs";
const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "story", label: "What Is It" },
  { id: "benefits", label: "Benefits" },
  { id: "stats", label: "Stats" },
  { id: "steps", label: "How It Works" },
  { id: "faqs", label: "FAQs" },
];

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
 * Suraksha Kavach admin form. Same convention as About BFI's form
 * (src/app/admin-panel/(app)/about/form.tsx): resolveSurakshaKavach() gates
 * each section on the WHOLE section being present, so the draft is seeded via
 * materializeSurakshaKavachSource() (current Sanity doc, or defaults where
 * unset) and edits/saves that complete object every time — a save can never
 * submit a half-empty section that would blank out its untouched siblings.
 */
export function SurakshaKavachForm({ initial }: { initial: Doc | null }) {
  const [doc, setDoc] = useState<Doc>(() => materializeSurakshaKavachSource(initial as SurakshaKavachSource));
  const [tab, setTab] = useState<Tab>("hero");
  const { pending, toast, run } = useSave();

  const setIn = useCallback((path: string[], val: unknown) => {
    setDoc((prev) => {
      const next = structuredClone(prev);
      let cur = next;
      for (let i = 0; i < path.length - 1; i++) {
        cur[path[i]] = cur[path[i]] ?? {};
        cur = cur[path[i]];
      }
      cur[path[path.length - 1]] = val;
      return next;
    });
  }, []);
  const get = (path: string[]): string => {
    let cur: Doc = doc;
    for (const p of path) { cur = cur?.[p]; if (cur == null) return ""; }
    return typeof cur === "string" ? cur : "";
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => saveSurakshaKavachAction(doc));
  };

  return (
    <form onSubmit={submit}>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={tab === t.id ? "admin-btn" : "admin-btn-ghost"} style={{ padding: "8px 16px" }}>{t.label}</button>
        ))}
      </div>

      <div className="admin-card">
        {tab === "hero" && (
          <>
            <Field label="Eyebrow" value={get(["hero", "eyebrow"])} onChange={(v) => setIn(["hero", "eyebrow"], v)} />
            <Field label="Headline" value={get(["hero", "headline"])} onChange={(v) => setIn(["hero", "headline"], v)} textarea />
            <Field label="Highlighted word" hint="The italicised word(s) within the headline." value={get(["hero", "headlineEm"])} onChange={(v) => setIn(["hero", "headlineEm"], v)} />
            <Field label="Paragraph" value={get(["hero", "paragraph"])} onChange={(v) => setIn(["hero", "paragraph"], v)} textarea />
            <div className="admin-row-grid">
              <Field label="Badge — number line" hint="e.g. 30,000+ Happy Families" value={get(["hero", "badgeNumber"])} onChange={(v) => setIn(["hero", "badgeNumber"], v)} />
              <Field label="Badge — sub label" value={get(["hero", "badgeLabel"])} onChange={(v) => setIn(["hero", "badgeLabel"], v)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Hero image</label>
              <ImageUpload value={get(["hero", "image"])} onChange={(url) => setIn(["hero", "image"], url)} label="Hero image" />
            </div>
          </>
        )}

        {tab === "story" && (
          <>
            <Field label="Eyebrow" value={get(["story", "eyebrow"])} onChange={(v) => setIn(["story", "eyebrow"], v)} />
            <div className="admin-row-grid">
              <Field label="Heading" value={get(["story", "heading", "lead"])} onChange={(v) => setIn(["story", "heading", "lead"], v)} />
              <Field label="Highlighted word" value={get(["story", "heading", "em"])} onChange={(v) => setIn(["story", "heading", "em"], v)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Paragraphs</label>
              <Repeater
                items={(doc.story?.paragraphs ?? []) as { value?: string }[]}
                onChange={(next) => setIn(["story", "paragraphs"], next)}
                newItem={() => ({ value: "" })}
                addLabel="+ Add paragraph"
                rowLabel={(i) => `Paragraph ${i + 1}`}
                renderItem={(row, i, update) => (
                  <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 60 }} value={row.value ?? ""} onChange={(e) => update({ value: e.target.value })} placeholder={`Paragraph ${i + 1}`} />
                )}
              />
            </div>
          </>
        )}

        {tab === "benefits" && (
          <div className="admin-field">
            <label className="admin-label">Benefit cards</label>
            <Repeater
              items={(doc.benefits ?? []) as { icon?: string; title?: string; description?: string }[]}
              onChange={(next) => setIn(["benefits"], next)}
              newItem={() => ({ icon: "ShieldCheck", title: "", description: "" })}
              addLabel="+ Add benefit"
              rowLabel={(i) => {
                const b = (doc.benefits ?? [])[i] as { title?: string } | undefined;
                return b?.title || `Benefit ${i + 1}`;
              }}
              renderItem={(row, i, update) => (
                <div>
                  <div className="admin-row-grid">
                    <select className="admin-input" value={row.icon ?? "ShieldCheck"} onChange={(e) => update({ icon: e.target.value })}>
                      {ICON_NAMES.map((name: IconName) => <option key={name} value={name}>{name}</option>)}
                    </select>
                    <input className="admin-input" placeholder="Title" value={row.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
                  </div>
                  <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 50, marginTop: 6 }} placeholder={`Description ${i + 1}`} value={row.description ?? ""} onChange={(e) => update({ description: e.target.value })} />
                </div>
              )}
            />
          </div>
        )}

        {tab === "stats" && (
          <div className="admin-field">
            <label className="admin-label">Stats bar</label>
            <Repeater
              items={(doc.stats ?? []) as { value?: number; suffix?: string; label?: string; sub?: string }[]}
              onChange={(next) => setIn(["stats"], next)}
              newItem={() => ({ value: 0, suffix: "", label: "", sub: "" })}
              addLabel="+ Add stat"
              rowLabel={(i) => {
                const s = (doc.stats ?? [])[i] as { label?: string } | undefined;
                return s?.label || `Stat ${i + 1}`;
              }}
              renderItem={(row, i, update) => (
                <div>
                  <div className="admin-row-grid">
                    <input className="admin-input" type="number" placeholder="Number" value={row.value ?? 0} onChange={(e) => update({ value: Number(e.target.value) })} />
                    <input className="admin-input" placeholder="Suffix (e.g. +)" value={row.suffix ?? ""} onChange={(e) => update({ suffix: e.target.value })} />
                  </div>
                  <div className="admin-row-grid" style={{ marginTop: 6 }}>
                    <input className="admin-input" placeholder={`Label ${i + 1}`} value={row.label ?? ""} onChange={(e) => update({ label: e.target.value })} />
                    <input className="admin-input" placeholder="Sub-label" value={row.sub ?? ""} onChange={(e) => update({ sub: e.target.value })} />
                  </div>
                </div>
              )}
            />
          </div>
        )}

        {tab === "steps" && (
          <div className="admin-field">
            <label className="admin-label">How it works — steps</label>
            <Repeater
              items={(doc.steps ?? []) as { step?: string; title?: string; description?: string }[]}
              onChange={(next) => setIn(["steps"], next)}
              newItem={() => ({ step: "", title: "", description: "" })}
              addLabel="+ Add step"
              rowLabel={(i) => {
                const s = (doc.steps ?? [])[i] as { title?: string } | undefined;
                return s?.title || `Step ${i + 1}`;
              }}
              renderItem={(row, i, update) => (
                <div>
                  <div className="admin-row-grid">
                    <input className="admin-input" placeholder="Step number (e.g. 01)" value={row.step ?? ""} onChange={(e) => update({ step: e.target.value })} />
                    <input className="admin-input" placeholder="Title" value={row.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
                  </div>
                  <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 50, marginTop: 6 }} placeholder={`Description ${i + 1}`} value={row.description ?? ""} onChange={(e) => update({ description: e.target.value })} />
                </div>
              )}
            />
          </div>
        )}

        {tab === "faqs" && (
          <div className="admin-field">
            <label className="admin-label">FAQs</label>
            <Repeater
              items={(doc.faqs ?? []) as { q?: string; a?: string }[]}
              onChange={(next) => setIn(["faqs"], next)}
              newItem={() => ({ q: "", a: "" })}
              addLabel="+ Add FAQ"
              rowLabel={(i) => {
                const f = (doc.faqs ?? [])[i] as { q?: string } | undefined;
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

        <SaveBar pending={pending} />
      </div>
      <Toast toast={toast} />
    </form>
  );
}
