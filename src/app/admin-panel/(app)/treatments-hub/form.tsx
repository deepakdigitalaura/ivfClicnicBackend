"use client";
import { useState } from "react";
import { saveTreatmentsHubAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;
type Defaults = { eyebrow: string; heading: { lead: string; em: string }; subtitle: string };

function Field({ label, hint, value, placeholder, onChange, textarea }: { label: string; hint?: string; value: string; placeholder?: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      {hint && <p className="admin-hint">{hint}</p>}
      {textarea ? (
        <textarea className="admin-textarea" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="admin-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export function TreatmentsHubForm({ initial, defaults }: { initial: Doc | null; defaults: Defaults }) {
  const [doc, setDoc] = useState<Doc>(initial ?? {});
  const { pending, toast, run } = useSave();
  const heading = (doc.heading ?? {}) as { lead?: string; em?: string };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveTreatmentsHubAction(doc), { tags: ["sanity-treatments-hub"], paths: ["/treatments"] });
  };

  return (
    <form onSubmit={submit}>
      <div className="admin-card">
        <Field label="Small Label Above Heading" value={doc.eyebrow ?? ""} placeholder={defaults.eyebrow} onChange={(x) => setDoc((p) => ({ ...p, eyebrow: x }))} />
        <div className="admin-row-grid">
          <Field label="Heading Text" value={heading.lead ?? ""} placeholder={defaults.heading.lead} onChange={(x) => setDoc((p) => ({ ...p, heading: { ...heading, lead: x } }))} />
          <Field label="Highlighted Word(s)" value={heading.em ?? ""} placeholder={defaults.heading.em} onChange={(x) => setDoc((p) => ({ ...p, heading: { ...heading, em: x } }))} />
        </div>
        <Field label="Sub-heading" textarea value={doc.subtitle ?? ""} placeholder={defaults.subtitle} onChange={(x) => setDoc((p) => ({ ...p, subtitle: x }))} />
      </div>

      <SaveBar pending={pending} />
      <Toast toast={toast} />
    </form>
  );
}
