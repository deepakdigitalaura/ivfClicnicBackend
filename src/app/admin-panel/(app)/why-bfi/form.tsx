"use client";
import { useState, useCallback } from "react";
import { materializeWhyBfiSource, type WhyBfiSource } from "@/lib/why-bfi";
import { ICON_NAMES, type IconName } from "@/lib/icon-map";
import { saveWhyBfiPageAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { Repeater } from "../_components/repeater";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

type Tab = "hero" | "stats" | "reasons" | "journey" | "ethics";
const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "stats", label: "Stats" },
  { id: "reasons", label: "Reasons" },
  { id: "journey", label: "Journey Timeline" },
  { id: "ethics", label: "Ethics" },
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
  defaultIcon: string,
) {
  return (
    <Repeater
      items={items}
      onChange={onChange}
      newItem={() => ({ icon: defaultIcon, title: "", description: "" })}
      addLabel={addLabel}
      rowLabel={(i) => items[i]?.title || `Item ${i + 1}`}
      renderItem={(row, i, update) => (
        <div>
          <div className="admin-row-grid">
            <select className="admin-input" value={row.icon ?? defaultIcon} onChange={(e) => update({ icon: e.target.value })}>
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

export function WhyBfiForm({ initial }: { initial: Doc | null }) {
  const [doc, setDoc] = useState<Doc>(() => materializeWhyBfiSource(initial as WhyBfiSource));
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
    run(async () => saveWhyBfiPageAction(doc));
  };

  const journey = (doc.journey ?? []) as { era?: string; eraLabel?: string; entries?: { year?: string; icon?: string; items?: { value?: string }[] }[] }[];

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
            <Field label="Quote" value={get(["hero", "quote"])} onChange={(v) => setIn(["hero", "quote"], v)} textarea />
            <Field label="Quote attribution" value={get(["hero", "quoteFooter"])} onChange={(v) => setIn(["hero", "quoteFooter"], v)} />
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

        {tab === "reasons" && (
          <div className="admin-field">
            <label className="admin-label">12 reasons grid</label>
            {iconCardRepeater(doc.reasons ?? [], (next) => setIn(["reasons"], next), "+ Add reason", "Sparkles")}
          </div>
        )}

        {tab === "ethics" && (
          <div className="admin-field">
            <label className="admin-label">Ethics & transparency cards</label>
            {iconCardRepeater(doc.ethics ?? [], (next) => setIn(["ethics"], next), "+ Add ethic", "CheckCircle2")}
          </div>
        )}

        {tab === "journey" && (
          <div className="admin-field">
            <label className="admin-label">Journey timeline — eras</label>
            <p className="admin-hint">Each era has a year-range, a label, and a list of year-entries. Each entry has an icon and one or more bullet items.</p>
            <Repeater
              items={journey}
              onChange={(next) => setIn(["journey"], next)}
              newItem={() => ({ era: "", eraLabel: "", entries: [] })}
              addLabel="+ Add era"
              rowLabel={(i) => journey[i]?.eraLabel || `Era ${i + 1}`}
              renderItem={(era, ei, updateEra) => {
                const entries = era.entries ?? [];
                return (
                  <div>
                    <div className="admin-row-grid">
                      <input className="admin-input" placeholder="Year range (e.g. 1990 – 2001)" value={era.era ?? ""} onChange={(e) => updateEra({ era: e.target.value })} />
                      <input className="admin-input" placeholder="Era label (e.g. Foundations)" value={era.eraLabel ?? ""} onChange={(e) => updateEra({ eraLabel: e.target.value })} />
                    </div>
                    <div style={{ marginTop: 10, paddingLeft: 14, borderLeft: "2px solid var(--border)" }}>
                      <Repeater
                        items={entries}
                        onChange={(nextEntries) => updateEra({ entries: nextEntries })}
                        newItem={() => ({ year: "", icon: "Sparkles", items: [] })}
                        addLabel="+ Add year entry"
                        rowLabel={(yi) => entries[yi]?.year || `Entry ${yi + 1}`}
                        renderItem={(entry, yi, updateEntry) => {
                          const items = entry.items ?? [];
                          return (
                            <div>
                              <div className="admin-row-grid">
                                <input className="admin-input" placeholder="Year" value={entry.year ?? ""} onChange={(e) => updateEntry({ year: e.target.value })} />
                                <select className="admin-input" value={entry.icon ?? "Sparkles"} onChange={(e) => updateEntry({ icon: e.target.value })}>
                                  {ICON_NAMES.map((name: IconName) => <option key={name} value={name}>{name}</option>)}
                                </select>
                              </div>
                              <div style={{ marginTop: 6 }}>
                                <Repeater
                                  items={items}
                                  onChange={(nextItems) => updateEntry({ items: nextItems })}
                                  newItem={() => ({ value: "" })}
                                  addLabel="+ Add bullet"
                                  rowLabel={(ii) => `Bullet ${ii + 1}`}
                                  renderItem={(item, ii, updateItem) => (
                                    <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 50 }} value={item.value ?? ""} onChange={(e) => updateItem({ value: e.target.value })} placeholder={`Bullet ${ii + 1}`} />
                                  )}
                                />
                              </div>
                            </div>
                          );
                        }}
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
