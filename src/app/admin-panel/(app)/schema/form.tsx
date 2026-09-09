"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { SchemaOrgConfig } from "@/sanity/lib/fetch";
import { saveSchemaAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";

type Social = string;
type Custom = { name?: string; enabled?: boolean; jsonCode?: string };

export function SchemaForm({ initial }: { initial: SchemaOrgConfig | null }) {
  const [orgName, setOrgName] = useState(initial?.organizationName ?? "");
  const [orgUrl, setOrgUrl] = useState(initial?.organizationUrl ?? "");
  const [tel, setTel] = useState(initial?.telephone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [social, setSocial] = useState<Social[]>(initial?.socialProfiles ?? []);
  const [custom, setCustom] = useState<Custom[]>(initial?.customSchemas ?? []);
  const { pending, toast, run } = useSave();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveSchemaAction({
      organizationName: orgName,
      organizationUrl: orgUrl,
      telephone: tel,
      email,
      socialProfiles: social.filter(Boolean),
      customSchemas: custom.filter((c) => c.jsonCode),
    }));
  };

  return (
    <form onSubmit={submit}>
      <div className="admin-card">
        <h2 className="admin-card-title">Organization</h2>
        <p className="admin-card-desc">Powers the site-wide Organization / MedicalClinic schema Google reads.</p>
        <div className="admin-row-grid">
          <div className="admin-field"><label className="admin-label">Organization name</label><input className="admin-input" value={orgName} onChange={(e) => setOrgName(e.target.value)} /></div>
          <div className="admin-field"><label className="admin-label">Website URL</label><input className="admin-input" value={orgUrl} onChange={(e) => setOrgUrl(e.target.value)} /></div>
          <div className="admin-field"><label className="admin-label">Phone</label><input className="admin-input" value={tel} onChange={(e) => setTel(e.target.value)} /></div>
          <div className="admin-field"><label className="admin-label">Email</label><input className="admin-input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        </div>
        <label className="admin-label">Social profile URLs</label>
        <p className="admin-hint">Facebook, Instagram, YouTube, LinkedIn — one per row.</p>
        <div className="admin-divider-list">
          {social.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8 }}>
              <input className="admin-input" placeholder="https://instagram.com/…" value={s} onChange={(e) => setSocial(social.map((x, j) => (j === i ? e.target.value : x)))} />
              <button type="button" className="admin-btn-danger" style={{ padding: "0 12px", borderRadius: 9 }} onClick={() => setSocial(social.filter((_, j) => j !== i))}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <button type="button" className="admin-add-btn" style={{ marginTop: social.length ? 12 : 0 }} onClick={() => setSocial([...social, ""])}>+ Add social URL</button>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Custom JSON-LD</h2>
        <p className="admin-card-desc">Paste raw JSON-LD objects for FAQ, Breadcrumbs, Article etc. (no &lt;script&gt; tag needed).</p>
        {custom.map((c, i) => (
          <div className="admin-row" key={i}>
            <div className="admin-row-head">
              <div className="admin-toggle-row" style={{ gap: 8 }}>
                <input type="checkbox" className="admin-toggle" checked={c.enabled ?? true} onChange={(e) => setCustom(custom.map((x, j) => (j === i ? { ...x, enabled: e.target.checked } : x)))} />
                <span className="admin-row-title">{(c.enabled ?? true) ? "Active" : "Disabled"}</span>
              </div>
              <button type="button" className="admin-remove" onClick={() => setCustom(custom.filter((_, j) => j !== i))}><Trash2 size={14} style={{ verticalAlign: "-2px" }} /> Remove</button>
            </div>
            <input className="admin-input" placeholder="Schema name (e.g. FAQ schema)" value={c.name ?? ""} onChange={(e) => setCustom(custom.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} style={{ marginBottom: 10 }} />
            <textarea className="admin-textarea" placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "FAQPage"\n}'} value={c.jsonCode ?? ""} onChange={(e) => setCustom(custom.map((x, j) => (j === i ? { ...x, jsonCode: e.target.value } : x)))} />
          </div>
        ))}
        <button type="button" className="admin-add-btn" style={{ marginTop: custom.length ? 12 : 0 }} onClick={() => setCustom([...custom, { name: "", enabled: true, jsonCode: "" }])}>+ Add JSON-LD schema</button>
      </div>

      <SaveBar pending={pending} />
      <Toast toast={toast} />
    </form>
  );
}
