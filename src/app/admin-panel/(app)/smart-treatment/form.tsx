"use client";
import { useState, useCallback } from "react";
import { materializeSmartTreatmentSource, type SmartTreatmentSource } from "@/lib/smart-treatment";
import { ICON_NAMES, type IconName } from "@/lib/icon-map";
import { saveSmartTreatmentPageAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { Repeater } from "../_components/repeater";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

type Tab = "hero" | "pillars" | "features" | "packages";
const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "pillars", label: "Pillars" },
  { id: "features", label: "Features" },
  { id: "packages", label: "Cost Packages" },
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

export function SmartTreatmentForm({ initial }: { initial: Doc | null }) {
  const [doc, setDoc] = useState<Doc>(() => materializeSmartTreatmentSource(initial as SmartTreatmentSource));
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
    run(async () => saveSmartTreatmentPageAction(doc));
  };

  const features = (doc.features ?? []) as { icon?: string; title?: string; description?: string; highlights?: { value?: string }[] }[];

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

        {tab === "pillars" && (
          <div className="admin-field">
            <label className="admin-label">Smart pillars (hero pill row)</label>
            <Repeater
              items={(doc.pillars ?? []) as { icon?: string; label?: string }[]}
              onChange={(next) => setIn(["pillars"], next)}
              newItem={() => ({ icon: "Sparkles", label: "" })}
              addLabel="+ Add pillar"
              rowLabel={(i) => (doc.pillars ?? [])[i]?.label || `Pillar ${i + 1}`}
              renderItem={(row, i, update) => (
                <div className="admin-row-grid">
                  <select className="admin-input" value={row.icon ?? "Sparkles"} onChange={(e) => update({ icon: e.target.value })}>
                    {ICON_NAMES.map((name: IconName) => <option key={name} value={name}>{name}</option>)}
                  </select>
                  <input className="admin-input" placeholder="Label" value={row.label ?? ""} onChange={(e) => update({ label: e.target.value })} />
                </div>
              )}
            />
          </div>
        )}

        {tab === "packages" && (
          <div className="admin-field">
            <label className="admin-label">Cost package cards</label>
            {iconCardRepeater(doc.packages ?? [], (next) => setIn(["packages"], next), "+ Add package")}
          </div>
        )}

        {tab === "features" && (
          <div className="admin-field">
            <label className="admin-label">Smart care feature cards</label>
            <Repeater
              items={features}
              onChange={(next) => setIn(["features"], next)}
              newItem={() => ({ icon: "Sparkles", title: "", description: "", highlights: [] })}
              addLabel="+ Add feature"
              rowLabel={(i) => features[i]?.title || `Feature ${i + 1}`}
              renderItem={(row, i, update) => {
                const highlights = row.highlights ?? [];
                return (
                  <div>
                    <div className="admin-row-grid">
                      <select className="admin-input" value={row.icon ?? "Sparkles"} onChange={(e) => update({ icon: e.target.value })}>
                        {ICON_NAMES.map((name: IconName) => <option key={name} value={name}>{name}</option>)}
                      </select>
                      <input className="admin-input" placeholder="Title" value={row.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
                    </div>
                    <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 60, marginTop: 6 }} placeholder={`Description ${i + 1}`} value={row.description ?? ""} onChange={(e) => update({ description: e.target.value })} />
                    <div style={{ marginTop: 8 }}>
                      <label className="admin-label" style={{ fontSize: 12 }}>Highlight tags</label>
                      <Repeater
                        items={highlights}
                        onChange={(nextH) => update({ highlights: nextH })}
                        newItem={() => ({ value: "" })}
                        addLabel="+ Add tag"
                        rowLabel={(hi) => `Tag ${hi + 1}`}
                        renderItem={(h, hi, updateH) => (
                          <input className="admin-input" value={h.value ?? ""} onChange={(e) => updateH({ value: e.target.value })} placeholder={`Tag ${hi + 1}`} />
                        )}
                      />
                    </div>
                  </div>
                );
              }}
            />
          </div>
        )}

        <SaveBar pending={pending} />
      </div>
      <Toast toast={toast} />
    </form>
  );
}
