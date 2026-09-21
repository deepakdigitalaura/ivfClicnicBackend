"use client";
import { useState } from "react";
import { saveCalculatorPageAction } from "../../../actions";
import { useSave, Toast, SaveBar } from "../../_components/save-kit";
import { Repeater } from "../../_components/repeater";

type Faq = { question?: string; answer?: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

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

export function CalculatorForm({ slug, initial }: { slug: string; initial: Doc | null }) {
  const [doc, setDoc] = useState<Doc>(initial ?? {});
  const { pending, toast, run } = useSave();
  const faqs = (doc.faqs ?? []) as Faq[];
  const seo = (doc.seo ?? {}) as Record<string, string>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveCalculatorPageAction(slug, doc), { tags: [`calculator-${slug}`], paths: [`/calculators/${slug}`] });
  };

  return (
    <form onSubmit={submit}>
      <div className="admin-card">
        <Field label="Page Title" value={doc.title ?? ""} onChange={(x) => setDoc((p) => ({ ...p, title: x }))} />
        <Field label="Subtitle / Intro Text" textarea value={doc.subtitle ?? ""} onChange={(x) => setDoc((p) => ({ ...p, subtitle: x }))} />
        <Field label="Medical Disclaimer" textarea value={doc.disclaimer ?? ""} onChange={(x) => setDoc((p) => ({ ...p, disclaimer: x }))} />

        <label className="admin-label" style={{ marginTop: 20, display: "block" }}>Frequently Asked Questions</label>
        <Repeater
          items={faqs}
          onChange={(next) => setDoc((p) => ({ ...p, faqs: next }))}
          newItem={() => ({ question: "", answer: "" })}
          addLabel="+ Add FAQ"
          rowLabel={(i) => faqs[i]?.question || `FAQ ${i + 1}`}
          renderItem={(row, i, update) => (
            <>
              <Field label="Question" value={row.question ?? ""} onChange={(x) => update({ question: x })} />
              <Field label="Answer" textarea value={row.answer ?? ""} onChange={(x) => update({ answer: x })} />
            </>
          )}
        />

        <label className="admin-label" style={{ marginTop: 20, display: "block" }}>SEO</label>
        <div className="admin-row-grid">
          <Field label="Meta Title" value={seo.metaTitle ?? ""} onChange={(x) => setDoc((p) => ({ ...p, seo: { ...seo, metaTitle: x } }))} />
          <Field label="Meta Description" textarea value={seo.metaDescription ?? ""} onChange={(x) => setDoc((p) => ({ ...p, seo: { ...seo, metaDescription: x } }))} />
          <Field label="Social Share Title" value={seo.ogTitle ?? ""} onChange={(x) => setDoc((p) => ({ ...p, seo: { ...seo, ogTitle: x } }))} />
          <Field label="Social Share Description" textarea value={seo.ogDescription ?? ""} onChange={(x) => setDoc((p) => ({ ...p, seo: { ...seo, ogDescription: x } }))} />
        </div>
      </div>

      <SaveBar pending={pending} />
      <Toast toast={toast} />
    </form>
  );
}
