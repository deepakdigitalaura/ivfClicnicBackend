"use client";
import { useState } from "react";
import { saveHeaderNavAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { Repeater } from "../_components/repeater";
import { LocaleTabs } from "../_components/locale-tabs";
import { getLocalized, setLocalized, type Locale, type LocalizedField } from "@/lib/i18n";

type MegaItem = { label?: LocalizedField; url?: string; desc?: LocalizedField; hidden?: boolean };
type MegaCol = { heading?: LocalizedField; headingHref?: string; hidden?: boolean; items?: MegaItem[] };
type NavItem = { label?: LocalizedField; url?: string; openInNewTab?: boolean; doctors?: boolean; hidden?: boolean; columns?: MegaCol[] };

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
  const [locale, setLocale] = useState<Locale>("en");
  const { pending, toast, run } = useSave();
  const branding = (doc.branding ?? {}) as { logoUrl?: string; logoAlt?: LocalizedField };
  const navItems = (doc.navItems ?? []) as NavItem[];
  const cta = (doc.cta ?? {}) as { label?: LocalizedField; url?: string };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveHeaderNavAction(doc), { tags: ["sanity-header-nav"], paths: ["/"] });
  };

  return (
    <form onSubmit={submit}>
      <LocaleTabs locale={locale} onChange={setLocale} />
      <div className="admin-card">
        <label className="admin-label" style={{ display: "block", marginBottom: 8 }}>Logo</label>
        <div className="admin-row-grid">
          <Field label="Logo Image URL" value={branding.logoUrl ?? ""} onChange={(x) => setDoc((p) => ({ ...p, branding: { ...branding, logoUrl: x } }))} />
          <Field label="Logo Alt Text" value={getLocalized(branding.logoAlt, locale)} onChange={(x) => setDoc((p) => ({ ...p, branding: { ...branding, logoAlt: setLocalized(branding.logoAlt, locale, x) } }))} />
        </div>

        <label className="admin-label" style={{ display: "block", marginTop: 20 }}>Main Button</label>
        <div className="admin-row-grid">
          <Field label="Button Text" value={getLocalized(cta.label, locale)} placeholder="Book Appointment" onChange={(x) => setDoc((p) => ({ ...p, cta: { ...cta, label: setLocalized(cta.label, locale, x) } }))} />
          <Field label="Button Link" value={cta.url ?? ""} placeholder="/#book" onChange={(x) => setDoc((p) => ({ ...p, cta: { ...cta, url: x } }))} />
        </div>

        <label className="admin-label" style={{ display: "block", marginTop: 20 }}>Top-level menu</label>
        <p className="admin-hint">The Doctors panel, and the IVF Treatments / Maternity Services / Locations dropdown columns, are auto-generated from their own sections — editing columns here for those items has no effect. Everything else (label, link, and dropdown columns for About/Resources/Calculators/Contact-style items) is fully editable.</p>
        <Repeater
          items={navItems}
          onChange={(next) => setDoc((p) => ({ ...p, navItems: next }))}
          newItem={() => ({ label: "", url: "", columns: [] })}
          addLabel="+ Add menu item"
          rowLabel={(i) => getLocalized(navItems[i]?.label, "en") || `Item ${i + 1}`}
          renderItem={(row, i, update) => (
            <>
              <div className="admin-row-grid">
                <Field label="Menu Label" value={getLocalized(row.label, locale)} onChange={(x) => update({ label: setLocalized(row.label, locale, x) })} />
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
                rowLabel={(ci) => getLocalized((row.columns ?? [])[ci]?.heading, "en") || `Column ${ci + 1}`}
                renderItem={(col, ci, updateCol) => (
                  <>
                    <div className="admin-row-grid">
                      <Field label="Column Heading" value={getLocalized(col.heading, locale)} onChange={(x) => updateCol({ heading: setLocalized(col.heading, locale, x) })} />
                      <Field label="Heading Link" value={col.headingHref ?? ""} onChange={(x) => updateCol({ headingHref: x })} />
                    </div>
                    <Repeater
                      items={col.items ?? []}
                      onChange={(items) => updateCol({ items })}
                      newItem={() => ({ label: "", url: "" })}
                      addLabel="+ Add link"
                      rowLabel={(ii) => getLocalized((col.items ?? [])[ii]?.label, "en") || `Link ${ii + 1}`}
                      renderItem={(it, _ii, updateIt) => (
                        <div className="admin-row-grid">
                          <Field label="Link Text" value={getLocalized(it.label, locale)} onChange={(x) => updateIt({ label: setLocalized(it.label, locale, x) })} />
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
