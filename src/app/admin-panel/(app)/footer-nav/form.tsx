"use client";
import { useState } from "react";
import { saveFooterNavAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { Repeater } from "../_components/repeater";

type FooterLink = { label?: string; url?: string; external?: boolean; hidden?: boolean };
type FooterGroup = { title?: string; hidden?: boolean; links?: FooterLink[] };
type Social = { platform?: string; url?: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

function Field({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (v: string) => void }) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <input className="admin-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function FooterNavForm({ initial }: { initial: Doc | null }) {
  const [doc, setDoc] = useState<Doc>(initial ?? {});
  const { pending, toast, run } = useSave();
  const branding = (doc.branding ?? {}) as { logoUrl?: string; description?: string };
  const navGroups = (doc.navGroups ?? []) as FooterGroup[];
  const social = (doc.social ?? []) as Social[];
  const legalLinks = (doc.legalLinks ?? []) as FooterLink[];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveFooterNavAction(doc), { tags: ["sanity-footer-nav"], paths: ["/"] });
  };

  return (
    <form onSubmit={submit}>
      <div className="admin-card">
        <label className="admin-label" style={{ display: "block", marginBottom: 8 }}>Logo &amp; Blurb</label>
        <Field label="Logo Image URL" value={branding.logoUrl ?? ""} onChange={(x) => setDoc((p) => ({ ...p, branding: { ...branding, logoUrl: x } }))} />
        <Field label="Blurb" value={branding.description ?? ""} onChange={(x) => setDoc((p) => ({ ...p, branding: { ...branding, description: x } }))} />

        <label className="admin-label" style={{ display: "block", marginTop: 20 }}>Link Columns</label>
        <Repeater
          items={navGroups}
          onChange={(next) => setDoc((p) => ({ ...p, navGroups: next }))}
          newItem={() => ({ title: "", links: [] })}
          addLabel="+ Add column"
          rowLabel={(i) => navGroups[i]?.title || `Column ${i + 1}`}
          renderItem={(row, i, update) => (
            <>
              <Field label="Column Heading" value={row.title ?? ""} onChange={(x) => update({ title: x })} />
              <Repeater
                items={row.links ?? []}
                onChange={(links) => update({ links })}
                newItem={() => ({ label: "", url: "" })}
                addLabel="+ Add link"
                rowLabel={(li) => (row.links ?? [])[li]?.label || `Link ${li + 1}`}
                renderItem={(link, _li, updateLink) => (
                  <div className="admin-row-grid">
                    <Field label="Link Text" value={link.label ?? ""} onChange={(x) => updateLink({ label: x })} />
                    <Field label="Link URL" value={link.url ?? ""} onChange={(x) => updateLink({ url: x })} />
                  </div>
                )}
              />
            </>
          )}
        />

        <label className="admin-label" style={{ display: "block", marginTop: 20 }}>Social Links</label>
        <Repeater
          items={social}
          onChange={(next) => setDoc((p) => ({ ...p, social: next }))}
          newItem={() => ({ platform: "", url: "" })}
          addLabel="+ Add social link"
          rowLabel={(i) => social[i]?.platform || `Social ${i + 1}`}
          renderItem={(row, _i, update) => (
            <div className="admin-row-grid">
              <Field label="Platform" value={row.platform ?? ""} placeholder="facebook" onChange={(x) => update({ platform: x })} />
              <Field label="Profile URL" value={row.url ?? ""} onChange={(x) => update({ url: x })} />
            </div>
          )}
        />

        <label className="admin-label" style={{ display: "block", marginTop: 20 }}>Copyright Line</label>
        <Field label="Text shown after '© <year> '" value={doc.copyrightText ?? ""} onChange={(x) => setDoc((p) => ({ ...p, copyrightText: x }))} />

        <label className="admin-label" style={{ display: "block", marginTop: 20 }}>Legal Links</label>
        <Repeater
          items={legalLinks}
          onChange={(next) => setDoc((p) => ({ ...p, legalLinks: next }))}
          newItem={() => ({ label: "", url: "" })}
          addLabel="+ Add legal link"
          rowLabel={(i) => legalLinks[i]?.label || `Link ${i + 1}`}
          renderItem={(row, _i, update) => (
            <div className="admin-row-grid">
              <Field label="Link Text" value={row.label ?? ""} onChange={(x) => update({ label: x })} />
              <Field label="Link URL" value={row.url ?? ""} onChange={(x) => update({ url: x })} />
            </div>
          )}
        />
      </div>

      <SaveBar pending={pending} />
      <Toast toast={toast} />
    </form>
  );
}
