"use client";
import { useState, useCallback } from "react";
import { materializeSafeTreatmentSource, type SafeTreatmentSource } from "@/lib/safe-treatment";
import { ICON_NAMES, type IconName } from "@/lib/icon-map";
import { saveSafeTreatmentPageAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { Repeater } from "../_components/repeater";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

type Tab = "hero" | "features" | "stats" | "protocols";
const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "features", label: "Safety Features" },
  { id: "stats", label: "Stats" },
  { id: "protocols", label: "Protocols" },
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

export function SafeTreatmentForm({ initial }: { initial: Doc | null }) {
  const [doc, setDoc] = useState<Doc>(() => materializeSafeTreatmentSource(initial as SafeTreatmentSource));
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
    run(async () => saveSafeTreatmentPageAction(doc));
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
              <Field label="Motto box — label" hint="e.g. Our Motto" value={get(["hero", "mottoLabel"])} onChange={(v) => setIn(["hero", "mottoLabel"], v)} />
              <Field label="Motto box — text" value={get(["hero", "mottoText"])} onChange={(v) => setIn(["hero", "mottoText"], v)} />
            </div>
          </>
        )}

        {tab === "features" && (
          <div className="admin-field">
            <label className="admin-label">Safety feature cards</label>
            <Repeater
              items={(doc.features ?? []) as { icon?: string; title?: string; description?: string }[]}
              onChange={(next) => setIn(["features"], next)}
              newItem={() => ({ icon: "Sparkles", title: "", description: "" })}
              addLabel="+ Add feature"
              rowLabel={(i) => (doc.features ?? [])[i]?.title || `Feature ${i + 1}`}
              renderItem={(row, i, update) => (
                <div>
                  <div className="admin-row-grid">
                    <select className="admin-input" value={row.icon ?? "Sparkles"} onChange={(e) => update({ icon: e.target.value })}>
                      {ICON_NAMES.map((name: IconName) => <option key={name} value={name}>{name}</option>)}
                    </select>
                    <input className="admin-input" placeholder="Title" value={row.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
                  </div>
                  <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 60, marginTop: 6 }} placeholder={`Description ${i + 1}`} value={row.description ?? ""} onChange={(e) => update({ description: e.target.value })} />
                </div>
              )}
            />
          </div>
        )}

        {tab === "stats" && (
          <div className="admin-field">
            <label className="admin-label">Stats strip</label>
            <Repeater
              items={(doc.stats ?? []) as { value?: number; suffix?: string; label?: string; sub?: string }[]}
              onChange={(next) => setIn(["stats"], next)}
              newItem={() => ({ value: 0, suffix: "", label: "", sub: "" })}
              addLabel="+ Add stat"
              rowLabel={(i) => (doc.stats ?? [])[i]?.label || `Stat ${i + 1}`}
              renderItem={(row, i, update) => (
                <div>
                  <div className="admin-row-grid">
                    <input className="admin-input" type="number" placeholder="Number" value={row.value ?? 0} onChange={(e) => update({ value: Number(e.target.value) })} />
                    <input className="admin-input" placeholder="Suffix (e.g. +, %, x)" value={row.suffix ?? ""} onChange={(e) => update({ suffix: e.target.value })} />
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

        {tab === "protocols" && (
          <div className="admin-field">
            <label className="admin-label">Safety protocols checklist</label>
            <Repeater
              items={(doc.protocols ?? []) as { value?: string }[]}
              onChange={(next) => setIn(["protocols"], next)}
              newItem={() => ({ value: "" })}
              addLabel="+ Add protocol"
              rowLabel={(i) => `Protocol ${i + 1}`}
              renderItem={(row, i, update) => (
                <input className="admin-input" value={row.value ?? ""} onChange={(e) => update({ value: e.target.value })} placeholder={`Protocol ${i + 1}`} />
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
