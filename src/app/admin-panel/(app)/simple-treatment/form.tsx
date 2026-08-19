"use client";
import { useState, useCallback } from "react";
import { materializeSimpleTreatmentSource, type SimpleTreatmentSource } from "@/lib/simple-treatment";
import { ICON_NAMES, type IconName } from "@/lib/icon-map";
import { saveSimpleTreatmentPageAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { Repeater } from "../_components/repeater";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

type Tab = "hero" | "philosophy" | "steps" | "quote" | "pillars";
const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "philosophy", label: "Philosophy" },
  { id: "steps", label: "5-Step Journey" },
  { id: "quote", label: "Quote Banner" },
  { id: "pillars", label: "Pillars" },
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

export function SimpleTreatmentForm({ initial }: { initial: Doc | null }) {
  const [doc, setDoc] = useState<Doc>(() => materializeSimpleTreatmentSource(initial as SimpleTreatmentSource));
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
    run(async () => saveSimpleTreatmentPageAction(doc));
  };

  const steps = (doc.steps ?? []) as { step?: string; icon?: string; title?: string; description?: string; highlights?: { value?: string }[] }[];

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

        {tab === "philosophy" && (
          <div className="admin-field">
            <label className="admin-label">Philosophy cards</label>
            {iconCardRepeater(doc.philosophy ?? [], (next) => setIn(["philosophy"], next), "+ Add card")}
          </div>
        )}

        {tab === "pillars" && (
          <div className="admin-field">
            <label className="admin-label">Three pillars</label>
            {iconCardRepeater(doc.pillars ?? [], (next) => setIn(["pillars"], next), "+ Add pillar")}
          </div>
        )}

        {tab === "quote" && (
          <>
            <Field label="Quote" value={get(["quote", "quote"])} onChange={(v) => setIn(["quote", "quote"], v)} textarea />
            <Field label="Paragraph below quote" value={get(["quote", "paragraph"])} onChange={(v) => setIn(["quote", "paragraph"], v)} textarea />
          </>
        )}

        {tab === "steps" && (
          <div className="admin-field">
            <label className="admin-label">5-step journey</label>
            <Repeater
              items={steps}
              onChange={(next) => setIn(["steps"], next)}
              newItem={() => ({ step: "", icon: "Sparkles", title: "", description: "", highlights: [] })}
              addLabel="+ Add step"
              rowLabel={(i) => steps[i]?.title || `Step ${i + 1}`}
              renderItem={(row, i, update) => {
                const highlights = row.highlights ?? [];
                return (
                  <div>
                    <div className="admin-row-grid">
                      <input className="admin-input" placeholder="Step number (e.g. 01)" value={row.step ?? ""} onChange={(e) => update({ step: e.target.value })} />
                      <select className="admin-input" value={row.icon ?? "Sparkles"} onChange={(e) => update({ icon: e.target.value })}>
                        {ICON_NAMES.map((name: IconName) => <option key={name} value={name}>{name}</option>)}
                      </select>
                    </div>
                    <input className="admin-input" style={{ marginTop: 6 }} placeholder="Title" value={row.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
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
