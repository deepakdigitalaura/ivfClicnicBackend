"use client";
import { useState, useCallback } from "react";
import { materializeHistorySource, type HistorySource } from "@/lib/history";
import { saveHistoryPageAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

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

export function HistoryForm({ initial }: { initial: Doc | null }) {
  const [doc, setDoc] = useState<Doc>(() => materializeHistorySource(initial as HistorySource));
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
    run(async () => saveHistoryPageAction(doc));
  };

  return (
    <form onSubmit={submit}>
      <div className="admin-card">
        <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 8 }}>Hero</div>
        <Field label="Eyebrow" value={get(["hero", "eyebrow"])} onChange={(v) => setIn(["hero", "eyebrow"], v)} />
        <Field label="Headline" value={get(["hero", "headline"])} onChange={(v) => setIn(["hero", "headline"], v)} textarea />
        <Field label="Highlighted word" hint="The italicised word(s) within the headline." value={get(["hero", "headlineEm"])} onChange={(v) => setIn(["hero", "headlineEm"], v)} />
        <Field label="Paragraph" value={get(["hero", "paragraph"])} onChange={(v) => setIn(["hero", "paragraph"], v)} textarea />

        <div style={{ marginTop: 20, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 8 }}>Present Day Highlight</div>
          <Field label="Heading" value={get(["presentDay", "heading"])} onChange={(v) => setIn(["presentDay", "heading"], v)} />
          <Field label="Paragraph" hint="HTML allowed, e.g. <strong>bold</strong>." value={get(["presentDay", "paragraph"])} onChange={(v) => setIn(["presentDay", "paragraph"], v)} textarea />
        </div>

        <SaveBar pending={pending} />
      </div>
      <Toast toast={toast} />
    </form>
  );
}
