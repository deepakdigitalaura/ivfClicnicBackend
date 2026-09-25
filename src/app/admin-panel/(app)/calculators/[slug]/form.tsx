"use client";
import { useState } from "react";
import { saveCalculatorPageAction } from "../../../actions";
import { useSave, Toast, SaveBar } from "../../_components/save-kit";
import { Repeater } from "../../_components/repeater";
import { LocaleTabs } from "../../_components/locale-tabs";
import { getLocalized, setLocalized, type Locale, type LocalizedField } from "@/lib/i18n";

type Faq = { question?: LocalizedField; answer?: LocalizedField };

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
  const [locale, setLocale] = useState<Locale>("en");
  const { pending, toast, run } = useSave();
  const faqs = (doc.faqs ?? []) as Faq[];
  const seo = (doc.seo ?? {}) as Record<string, LocalizedField>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveCalculatorPageAction(slug, doc), { tags: [`calculator-${slug}`], paths: [`/calculators/${slug}`] });
  };

  return (
    <form onSubmit={submit}>
      <LocaleTabs locale={locale} onChange={setLocale} />
      <div className="admin-card">
        <Field label="Page Title" value={getLocalized(doc.title, locale)} onChange={(x) => setDoc((p) => ({ ...p, title: setLocalized(p.title, locale, x) }))} />
        <Field label="Subtitle / Intro Text" textarea value={getLocalized(doc.subtitle, locale)} onChange={(x) => setDoc((p) => ({ ...p, subtitle: setLocalized(p.subtitle, locale, x) }))} />
        <Field label="Medical Disclaimer" textarea value={getLocalized(doc.disclaimer, locale)} onChange={(x) => setDoc((p) => ({ ...p, disclaimer: setLocalized(p.disclaimer, locale, x) }))} />

        <label className="admin-label" style={{ marginTop: 20, display: "block" }}>Frequently Asked Questions</label>
        <Repeater
          items={faqs}
          onChange={(next) => setDoc((p) => ({ ...p, faqs: next }))}
          newItem={() => ({ question: "", answer: "" })}
          addLabel="+ Add FAQ"
          rowLabel={(i) => getLocalized(faqs[i]?.question, "en") || `FAQ ${i + 1}`}
          renderItem={(row, i, update) => (
            <>
              <Field label="Question" value={getLocalized(row.question, locale)} onChange={(x) => update({ question: setLocalized(row.question, locale, x) })} />
              <Field label="Answer" textarea value={getLocalized(row.answer, locale)} onChange={(x) => update({ answer: setLocalized(row.answer, locale, x) })} />
            </>
          )}
        />

        <label className="admin-label" style={{ marginTop: 20, display: "block" }}>SEO</label>
        <div className="admin-row-grid">
          <Field label="Meta Title" value={getLocalized(seo.metaTitle, locale)} onChange={(x) => setDoc((p) => ({ ...p, seo: { ...seo, metaTitle: setLocalized(seo.metaTitle, locale, x) } }))} />
          <Field label="Meta Description" textarea value={getLocalized(seo.metaDescription, locale)} onChange={(x) => setDoc((p) => ({ ...p, seo: { ...seo, metaDescription: setLocalized(seo.metaDescription, locale, x) } }))} />
          <Field label="Social Share Title" value={getLocalized(seo.ogTitle, locale)} onChange={(x) => setDoc((p) => ({ ...p, seo: { ...seo, ogTitle: setLocalized(seo.ogTitle, locale, x) } }))} />
          <Field label="Social Share Description" textarea value={getLocalized(seo.ogDescription, locale)} onChange={(x) => setDoc((p) => ({ ...p, seo: { ...seo, ogDescription: setLocalized(seo.ogDescription, locale, x) } }))} />
        </div>
      </div>

      <SaveBar pending={pending} />
      <Toast toast={toast} />
    </form>
  );
}
