"use client";
import { useState } from "react";
import { saveHeaderNavAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { Repeater } from "../_components/repeater";

type MegaItem = { label?: string; url?: string; desc?: string; hidden?: boolean };
type MegaCol = { heading?: string; headingHref?: string; hidden?: boolean; items?: MegaItem[] };
type NavItem = { label?: string; url?: string; openInNewTab?: boolean; doctors?: boolean; hidden?: boolean; columns?: MegaCol[] };

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

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /> {label}
    </label>
  );
}

export function HeaderNavForm({ initial }: { initial: Doc | null }) {
  const [doc, setDoc] = useState<Doc>(initial ?? {});
  const { pending, toast, run } = useSave();
  const branding = (doc.branding ?? {}) as { logoUrl?: string; logoAlt?: string };
  const navItems = (doc.navItems ?? []) as NavItem[];
  const cta = (doc.cta ?? {}) as { label?: string; url?: string };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveHeaderNavAction(doc), { tags: ["sanity-header-nav"], paths: ["/"] });
  };

  return (
    <form onSubmit={submit}>
      <div className="admin-card">
        <label className="admin-label" style={{ display: "block", marginBottom: 8 }}>Logo</label>
        <div className="admin-row-grid">
          <Field label="Logo Image URL" value={branding.logoUrl ?? ""} onChange={(x) => setDoc((p) => ({ ...p, branding: { ...branding, logoUrl: x } }))} />
          <Field label="Logo Alt Text" value={branding.logoAlt ?? ""} onChange={(x) => setDoc((p) => ({ ...p, branding: { ...branding, logoAlt: x } }))} />
        </div>

        <label className="admin-label" style={{ display: "block", marginTop: 20 }}>Main Button</label>
        <div className="admin-row-grid">
          <Field label="Button Text" value={cta.label ?? ""} placeholder="Book Appointment" onChange={(x) => setDoc((p) => ({ ...p, cta: { ...cta, label: x } }))} />
          <Field label="Button Link" value={cta.url ?? ""} placeholder="/#book" onChange={(x) => setDoc((p) => ({ ...p, cta: { ...cta, url: x } }))} />
        </div>

        <label className="admin-label" style={{ display: "block", marginTop: 20 }}>Top-level menu</label>
        <p className="admin-hint">The Doctors panel, and the IVF Treatments / Maternity Services / Locations dropdown columns, are auto-generated from their own sections — editing columns here for those items has no effect. Everything else (label, link, and dropdown columns for About/Resources/Calculators/Contact-style items) is fully editable.</p>
        <Repeater
          items={navItems}
          onChange={(next) => setDoc((p) => ({ ...p, navItems: next }))}
          newItem={() => ({ label: "", url: "", columns: [] })}
          addLabel="+ Add menu item"
          rowLabel={(i) => navItems[i]?.label || `Item ${i + 1}`}
          renderItem={(row, i, update) => (
            <>
              <div className="admin-row-grid">
                <Field label="Menu Label" value={row.label ?? ""} onChange={(x) => update({ label: x })} />
                <Field label="Link URL" value={row.url ?? ""} onChange={(x) => update({ url: x })} />
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                <Checkbox label="Hide from menu" checked={!!row.hidden} onChange={(v) => update({ hidden: v })} />
                <Checkbox label="Open in new tab" checked={!!row.openInNewTab} onChange={(v) => update({ openInNewTab: v })} />
                <Checkbox label="Show Doctors panel" checked={!!row.doctors} onChange={(v) => update({ doctors: v })} />
              </div>
              <label className="admin-label" style={{ marginTop: 10, display: "block" }}>Dropdown columns</label>
              <Repeater
                items={row.columns ?? []}
                onChange={(cols) => update({ columns: cols })}
                newItem={() => ({ heading: "", items: [] })}
                addLabel="+ Add column"
                rowLabel={(ci) => (row.columns ?? [])[ci]?.heading || `Column ${ci + 1}`}
                renderItem={(col, ci, updateCol) => (
                  <>
                    <div className="admin-row-grid">
                      <Field label="Column Heading" value={col.heading ?? ""} onChange={(x) => updateCol({ heading: x })} />
                      <Field label="Heading Link" value={col.headingHref ?? ""} onChange={(x) => updateCol({ headingHref: x })} />
                    </div>
                    <Repeater
                      items={col.items ?? []}
                      onChange={(items) => updateCol({ items })}
                      newItem={() => ({ label: "", url: "" })}
                      addLabel="+ Add link"
                      rowLabel={(ii) => (col.items ?? [])[ii]?.label || `Link ${ii + 1}`}
                      renderItem={(it, _ii, updateIt) => (
                        <div className="admin-row-grid">
                          <Field label="Link Text" value={it.label ?? ""} onChange={(x) => updateIt({ label: x })} />
                          <Field label="Link URL" value={it.url ?? ""} onChange={(x) => updateIt({ url: x })} />
                        </div>
                      )}
                    />
                  </>
                )}
              />
            </>
          )}
        />
      </div>

      <SaveBar pending={pending} />
      <Toast toast={toast} />
    </form>
  );
}
