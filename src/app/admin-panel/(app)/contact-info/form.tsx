"use client";
import { useState } from "react";
import { saveContactInfoAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { Repeater } from "../_components/repeater";

type Card = { icon?: string; title?: string; channel?: string; value?: string; href?: string; note?: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

const ICON_OPTIONS = ["Phone", "MessageCircle", "Mail", "Clock", "MapPin", "Calendar"];
const CHANNEL_OPTIONS = [
  { value: "none", label: "Custom — type the value/link below" },
  { value: "phone", label: "Phone (from Brand & Identity)" },
  { value: "email", label: "Email (from Brand & Identity)" },
  { value: "whatsapp", label: "WhatsApp (from Brand & Identity)" },
];

function Field({ label, hint, value, placeholder, onChange }: { label: string; hint?: string; value: string; placeholder?: string; onChange: (v: string) => void }) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      {hint && <p className="admin-hint">{hint}</p>}
      <input className="admin-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <select className="admin-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function ContactInfoForm({ initial }: { initial: Doc | null }) {
  const [doc, setDoc] = useState<Doc>(initial ?? {});
  const { pending, toast, run } = useSave();
  const cards = (doc.cards ?? []) as Card[];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveContactInfoAction(doc), { tags: ["sanity-contact-info"], paths: ["/contact"] });
  };

  return (
    <form onSubmit={submit}>
      <div className="admin-card">
        <Repeater
          items={cards}
          onChange={(next) => setDoc((p) => ({ ...p, cards: next }))}
          newItem={() => ({ icon: "Phone", title: "", channel: "none", value: "", href: "", note: "" })}
          addLabel="+ Add card"
          rowLabel={(i) => cards[i]?.title || `Card ${i + 1}`}
          renderItem={(row, i, update) => (
            <div className="admin-row-grid">
              <Select label="Icon" value={row.icon ?? "Phone"} options={ICON_OPTIONS.map((v) => ({ value: v, label: v }))} onChange={(x) => update({ icon: x })} />
              <Field label="Card Title" value={row.title ?? ""} placeholder="Call Us" onChange={(x) => update({ title: x })} />
              <Select label="Contact Type" value={row.channel ?? "none"} options={CHANNEL_OPTIONS} onChange={(x) => update({ channel: x })} />
              <Field label="Display Value" hint="Used when Contact Type is Custom (e.g. working hours). Ignored for Phone/Email/WhatsApp." value={row.value ?? ""} onChange={(x) => update({ value: x })} />
              <Field label="Custom Link" hint="Used when Contact Type is Custom. Ignored otherwise." value={row.href ?? ""} onChange={(x) => update({ href: x })} />
              <Field label="Sub-line" hint="e.g. '24×7 patient helpline'" value={row.note ?? ""} onChange={(x) => update({ note: x })} />
            </div>
          )}
        />
      </div>

      <SaveBar pending={pending} />
      <Toast toast={toast} />
    </form>
  );
}
