"use client";
import { useState, useCallback } from "react";
import { materializeSuccessBenchmarksSource, type SuccessBenchmarksSource } from "@/lib/success-benchmarks";
import { ICON_NAMES, type IconName } from "@/lib/icon-map";
import { saveSuccessBenchmarksPageAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { Repeater } from "../_components/repeater";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

type Tab = "hero" | "stats" | "pillars" | "badges";
const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "stats", label: "Stats" },
  { id: "pillars", label: "Success Pillars" },
  { id: "badges", label: "Closing Badges" },
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

export function SuccessBenchmarksForm({ initial }: { initial: Doc | null }) {
  const [doc, setDoc] = useState<Doc>(() => materializeSuccessBenchmarksSource(initial as SuccessBenchmarksSource));
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
    run(async () => saveSuccessBenchmarksPageAction(doc));
  };

  const pillars = (doc.pillars ?? []) as { icon?: string; title?: string; description?: string; highlights?: { value?: string }[] }[];

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
            <Field label="Quote" value={get(["hero", "quote"])} onChange={(v) => setIn(["hero", "quote"], v)} textarea />
          </>
        )}

        {tab === "stats" && (
          <div className="admin-field">
            <label className="admin-label">Hero stats strip</label>
            <Repeater
              items={(doc.stats ?? []) as { value?: number; suffix?: string; label?: string }[]}
              onChange={(next) => setIn(["stats"], next)}
              newItem={() => ({ value: 0, suffix: "", label: "" })}
              addLabel="+ Add stat"
              rowLabel={(i) => (doc.stats ?? [])[i]?.label || `Stat ${i + 1}`}
              renderItem={(row, i, update) => (
                <div className="admin-row-grid">
                  <input className="admin-input" type="number" placeholder="Number" value={row.value ?? 0} onChange={(e) => update({ value: Number(e.target.value) })} />
                  <input className="admin-input" placeholder="Suffix (e.g. +)" value={row.suffix ?? ""} onChange={(e) => update({ suffix: e.target.value })} />
                  <input className="admin-input" placeholder={`Label ${i + 1}`} value={row.label ?? ""} onChange={(e) => update({ label: e.target.value })} />
                </div>
              )}
            />
          </div>
        )}

        {tab === "badges" && (
          <div className="admin-field">
            <label className="admin-label">Closing badges</label>
            <Repeater
              items={(doc.closingBadges ?? []) as { icon?: string; text?: string }[]}
              onChange={(next) => setIn(["closingBadges"], next)}
              newItem={() => ({ icon: "Sparkles", text: "" })}
              addLabel="+ Add badge"
              rowLabel={(i) => (doc.closingBadges ?? [])[i]?.text || `Badge ${i + 1}`}
              renderItem={(row, i, update) => (
                <div className="admin-row-grid">
                  <select className="admin-input" value={row.icon ?? "Sparkles"} onChange={(e) => update({ icon: e.target.value })}>
                    {ICON_NAMES.map((name: IconName) => <option key={name} value={name}>{name}</option>)}
                  </select>
                  <input className="admin-input" placeholder="Text" value={row.text ?? ""} onChange={(e) => update({ text: e.target.value })} />
                </div>
              )}
            />
          </div>
        )}

        {tab === "pillars" && (
          <div className="admin-field">
            <label className="admin-label">Success pillar cards</label>
            <Repeater
              items={pillars}
              onChange={(next) => setIn(["pillars"], next)}
              newItem={() => ({ icon: "Sparkles", title: "", description: "", highlights: [] })}
              addLabel="+ Add pillar"
              rowLabel={(i) => pillars[i]?.title || `Pillar ${i + 1}`}
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
