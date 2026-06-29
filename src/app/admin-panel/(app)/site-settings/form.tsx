"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { saveSiteSettingsAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;
type Defaults = {
  brandName: string; alternateName: string; legalName: string; logoUrl: string; foundingDate: string;
  telephone: string; telephoneDisplay: string; email: string; whatsapp: string;
  address: Record<string, string>; socialLinks: string[];
};

type Tab = "general" | "contact" | "address" | "social";
const TABS: { id: Tab; label: string }[] = [
  { id: "general", label: "General" },
  { id: "contact", label: "Contact Info" },
  { id: "address", label: "Address" },
  { id: "social", label: "Social & Awards" },
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

export function SiteSettingsForm({ initial, defaults }: { initial: Doc | null; defaults: Defaults }) {
  const [doc, setDoc] = useState<Doc>(initial ?? {});
  const [tab, setTab] = useState<Tab>("general");
  const { pending, toast, run } = useSave();

  const v = (k: string): string => (typeof doc[k] === "string" ? doc[k] : "");
  const set = (k: string, val: unknown) => setDoc((p) => ({ ...p, [k]: val }));
  const addr = (doc.address ?? {}) as Record<string, string>;
  const setAddr = (k: string, val: string) => set("address", { ...addr, [k]: val });
  const social = (doc.socialLinks ?? []) as string[];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveSiteSettingsAction(doc));
  };

  return (
    <form onSubmit={submit}>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={tab === t.id ? "admin-btn" : "admin-btn-ghost"} style={{ padding: "8px 16px" }}>{t.label}</button>
        ))}
      </div>

      <div className="admin-card">
        {tab === "general" && (
          <>
            <Field label="Brand name" value={v("brandName")} placeholder={defaults.brandName} onChange={(x) => set("brandName", x)} />
            <Field label="Alternate name" value={v("alternateName")} placeholder={defaults.alternateName} onChange={(x) => set("alternateName", x)} />
            <Field label="Legal name" value={v("legalName")} placeholder={defaults.legalName} onChange={(x) => set("legalName", x)} />
            <Field label="Logo URL" value={v("logoUrl")} placeholder={defaults.logoUrl} onChange={(x) => set("logoUrl", x)} />
            <Field label="Founding year" value={v("foundingDate")} placeholder={defaults.foundingDate} onChange={(x) => set("foundingDate", x)} />
          </>
        )}

        {tab === "contact" && (
          <>
            <Field label="Phone (canonical)" hint="Used for tel: links & schema, e.g. +919712622288" value={v("telephone")} placeholder={defaults.telephone} onChange={(x) => set("telephone", x)} />
            <Field label="Phone (display)" hint="Shown on the page, e.g. +91 97126 22288" value={v("telephoneDisplay")} placeholder={defaults.telephoneDisplay} onChange={(x) => set("telephoneDisplay", x)} />
            <Field label="Email" value={v("email")} placeholder={defaults.email} onChange={(x) => set("email", x)} />
            <Field label="WhatsApp digits" hint="For wa.me links, e.g. 919712622288" value={v("whatsapp")} placeholder={defaults.whatsapp} onChange={(x) => set("whatsapp", x)} />
          </>
        )}

        {tab === "address" && (
          <div className="admin-row-grid">
            <Field label="Street" value={addr.streetAddress ?? ""} placeholder={defaults.address.streetAddress} onChange={(x) => setAddr("streetAddress", x)} />
            <Field label="City" value={addr.addressLocality ?? ""} placeholder={defaults.address.addressLocality} onChange={(x) => setAddr("addressLocality", x)} />
            <Field label="State" value={addr.addressRegion ?? ""} placeholder={defaults.address.addressRegion} onChange={(x) => setAddr("addressRegion", x)} />
            <Field label="Postal code" value={addr.postalCode ?? ""} placeholder={defaults.address.postalCode} onChange={(x) => setAddr("postalCode", x)} />
            <Field label="Country" value={addr.addressCountry ?? ""} placeholder={defaults.address.addressCountry} onChange={(x) => setAddr("addressCountry", x)} />
          </div>
        )}

        {tab === "social" && (
          <>
            <label className="admin-label">Social profile URLs</label>
            <p className="admin-hint">Instagram, Facebook, YouTube, LinkedIn — feeds the footer &amp; search schema.</p>
            <div className="admin-divider-list">
              {(social.length ? social : defaults.socialLinks).map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8 }}>
                  <input className="admin-input" value={social[i] ?? ""} placeholder={defaults.socialLinks[i] ?? s} onChange={(e) => {
                    const arr = social.length ? [...social] : [...defaults.socialLinks];
                    arr[i] = e.target.value; set("socialLinks", arr);
                  }} />
                  <button type="button" className="admin-btn-danger" style={{ padding: "0 12px", borderRadius: 9 }} onClick={() => set("socialLinks", (social.length ? social : defaults.socialLinks).filter((_, j) => j !== i))}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="admin-add-btn" style={{ marginTop: 12 }} onClick={() => set("socialLinks", [...(social.length ? social : defaults.socialLinks), ""])}>+ Add social URL</button>

            <label className="admin-label" style={{ marginTop: 20, display: "block" }}>Awards (schema)</label>
            <p className="admin-hint">One per line. Leave blank to keep the built-in awards list.</p>
            <textarea className="admin-textarea" style={{ minHeight: 120 }} value={((doc.awards ?? []) as string[]).join("\n")} placeholder="National Fertility Award 2025&#10;Economic Times IVF Chain of the Year — West" onChange={(e) => set("awards", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} />
          </>
        )}
      </div>

      <SaveBar pending={pending} />
      <Toast toast={toast} />
    </form>
  );
}
