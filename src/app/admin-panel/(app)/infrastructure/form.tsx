"use client";
import { useState, useCallback } from "react";
import { materializeInfrastructureSource, type InfrastructureSource } from "@/lib/infrastructure";
import { ICON_NAMES, type IconName } from "@/lib/icon-map";
import { saveInfrastructurePageAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { Repeater } from "../_components/repeater";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

type Tab = "hero" | "stats" | "facilities" | "tech";
const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "stats", label: "Stats" },
  { id: "facilities", label: "Facilities" },
  { id: "tech", label: "Technology" },
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

function iconCardRepeater(
  items: { icon?: string; title?: string; description?: string }[],
  onChange: (next: { icon?: string; title?: string; description?: string }[]) => void,
  addLabel: string,
) {
  return (
    <Repeater
      items={items}
      onChange={onChange}
      newItem={() => ({ icon: "Sparkles", title: "", description: "" })}
      addLabel={addLabel}
      rowLabel={(i) => items[i]?.title || `Item ${i + 1}`}
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
  );
}

export function InfrastructureForm({ initial }: { initial: Doc | null }) {
  const [doc, setDoc] = useState<Doc>(() => materializeInfrastructureSource(initial as InfrastructureSource));
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
    run(async () => saveInfrastructurePageAction(doc));
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
          </>
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
                    <input className="admin-input" placeholder="Suffix (e.g. +, x)" value={row.suffix ?? ""} onChange={(e) => update({ suffix: e.target.value })} />
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

        {tab === "facilities" && (
          <div className="admin-field">
            <label className="admin-label">Facility highlight cards</label>
            {iconCardRepeater(doc.facilities ?? [], (next) => setIn(["facilities"], next), "+ Add facility")}
          </div>
        )}

        {tab === "tech" && (
          <div className="admin-field">
            <label className="admin-label">Technology highlights</label>
            {iconCardRepeater(doc.techHighlights ?? [], (next) => setIn(["techHighlights"], next), "+ Add technology")}
          </div>
        )}

        <SaveBar pending={pending} />
      </div>
      <Toast toast={toast} />
    </form>
  );
}
