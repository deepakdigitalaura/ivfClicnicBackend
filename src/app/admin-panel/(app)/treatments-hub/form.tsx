"use client";
import { useState } from "react";
import { saveTreatmentsHubAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { LocaleTabs } from "../_components/locale-tabs";
import { getLocalized, setLocalized, type Locale, type LocalizedField } from "@/lib/i18n";

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
  const [locale, setLocale] = useState<Locale>("en");
  const { pending, toast, run } = useSave();
  const heading = (doc.heading ?? {}) as { lead?: LocalizedField; em?: LocalizedField };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveTreatmentsHubAction(doc), { tags: ["sanity-treatments-hub"], paths: ["/treatments"] });
  };

  return (
    <form onSubmit={submit}>
      <LocaleTabs locale={locale} onChange={setLocale} />
      <div className="admin-card">
        <Field label="Small Label Above Heading" value={getLocalized(doc.eyebrow, locale)} placeholder={defaults.eyebrow} onChange={(x) => setDoc((p) => ({ ...p, eyebrow: setLocalized(p.eyebrow, locale, x) }))} />
        <div className="admin-row-grid">
          <Field label="Heading Text" value={getLocalized(heading.lead, locale)} placeholder={defaults.heading.lead} onChange={(x) => setDoc((p) => ({ ...p, heading: { ...heading, lead: setLocalized(heading.lead, locale, x) } }))} />
          <Field label="Highlighted Word(s)" value={getLocalized(heading.em, locale)} placeholder={defaults.heading.em} onChange={(x) => setDoc((p) => ({ ...p, heading: { ...heading, em: setLocalized(heading.em, locale, x) } }))} />
        </div>
        <Field label="Sub-heading" textarea value={getLocalized(doc.subtitle, locale)} placeholder={defaults.subtitle} onChange={(x) => setDoc((p) => ({ ...p, subtitle: setLocalized(p.subtitle, locale, x) }))} />
      </div>

      <SaveBar pending={pending} />
      <Toast toast={toast} />
    </form>
  );
}
