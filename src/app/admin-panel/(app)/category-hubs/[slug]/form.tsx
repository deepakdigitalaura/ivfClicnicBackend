"use client";
import { useState, useCallback } from "react";
import { materializeCategoryHubSource, type CategoryHubSource, type HubSlug } from "@/lib/category-hub";
import { ICON_NAMES, type IconName } from "@/lib/icon-map";
import { saveCategoryHubAction } from "../../../actions";
import { useSave, Toast, SaveBar } from "../../_components/save-kit";
import { Repeater } from "../../_components/repeater";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

type Tab = "hero" | "cards" | "overview" | "signs" | "why" | "faqs";
const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "cards", label: "Cards" },
  { id: "overview", label: "Overview" },
  { id: "signs", label: "Signs" },
  { id: "why", label: "Why Choose Us" },
  { id: "faqs", label: "FAQs" },
];

function Field({ label, hint, value, textarea, onChange }: { label: string; hint?: string; value: string; textarea?: boolean; onChange: (v: string) => void }) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      {hint && <p className="admin-hint">{hint}</p>}
      {textarea ? (
        <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 70 }} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

/**
 * Shared editor for all 4 category hub pages (Advanced Fertility Techniques,
 * Male/Female Infertility, Maternity Services). Same materialize/resolve
 * convention as the About-family editors: draft is seeded via
 * materializeCategoryHubSource() (current Sanity doc, or defaults where
 * unset), so a save always submits the complete section.
 */
export function CategoryHubForm({ slug, initial }: { slug: HubSlug; initial: Doc | null }) {
  const [doc, setDoc] = useState<Doc>(() => materializeCategoryHubSource(slug, initial as CategoryHubSource));
  const [tab, setTab] = useState<Tab>("hero");
  const { pending, toast, run } = useSave();

  const setIn = useCallback((path: string[], val: unknown) => {
    setDoc((prev) => {
      const next = structuredClone(prev);
      let cur = next;
      for (let i = 0; i < path.length - 1; i++) {
        cur[path[i]] = cur[path[i]] ?? {};
        cur = cur[path[i]];
      }
      cur[path[path.length - 1]] = val;
      return next;
    });
  }, []);
  const get = (path: string[]): string => {
    let cur: Doc = doc;
    for (const p of path) { cur = cur?.[p]; if (cur == null) return ""; }
    return typeof cur === "string" ? cur : "";
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => saveCategoryHubAction(slug, doc));
  };

  return (
    <form onSubmit={submit}>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={tab === t.id ? "admin-btn" : "admin-btn-ghost"} style={{ padding: "8px 16px" }}>{t.label}</button>
        ))}
      </div>

      <div className="admin-card">
        {tab === "hero" && (
          <>
            <Field label="Eyebrow" value={get(["eyebrow"])} onChange={(v) => setIn(["eyebrow"], v)} />
            <div className="admin-row-grid">
              <Field label="Title (plain)" value={get(["title"])} onChange={(v) => setIn(["title"], v)} />
              <Field label="Title — highlighted word(s)" value={get(["titleAccent"])} onChange={(v) => setIn(["titleAccent"], v)} />
            </div>
            <Field label="Subtitle" value={get(["subtitle"])} onChange={(v) => setIn(["subtitle"], v)} textarea />
            <Field label="Breadcrumb label" value={get(["breadcrumbLabel"])} onChange={(v) => setIn(["breadcrumbLabel"], v)} />
            <div className="admin-row-grid">
              <Field label="Hero image path" hint="e.g. /assets/ivf-icsi.png" value={get(["heroImage"])} onChange={(v) => setIn(["heroImage"], v)} />
              <Field label="Hero image alt text" value={get(["heroImageAlt"])} onChange={(v) => setIn(["heroImageAlt"], v)} />
            </div>
            <Field label="Closing CTA — heading" value={get(["ctaHeading"])} onChange={(v) => setIn(["ctaHeading"], v)} />
            <Field label="Closing CTA — subtitle" value={get(["ctaSubtitle"])} onChange={(v) => setIn(["ctaSubtitle"], v)} textarea />
          </>
        )}

        {tab === "cards" && (
          <>
            <Field label="Cards section title" value={get(["cardsSectionTitle"])} onChange={(v) => setIn(["cardsSectionTitle"], v)} />
            <Field label="Cards section subtitle" value={get(["cardsSectionSubtitle"])} onChange={(v) => setIn(["cardsSectionSubtitle"], v)} textarea />
            <div className="admin-field">
              <label className="admin-label">Cards</label>
              <Repeater
                items={(doc.cards ?? []) as { icon?: string; title?: string; desc?: string; href?: string }[]}
                onChange={(next) => setIn(["cards"], next)}
                newItem={() => ({ icon: "Sparkles", title: "", desc: "", href: "" })}
                addLabel="+ Add card"
                rowLabel={(i) => {
                  const c = (doc.cards ?? [])[i] as { title?: string } | undefined;
                  return c?.title || `Card ${i + 1}`;
                }}
                renderItem={(row, i, update) => (
                  <div>
                    <div className="admin-row-grid">
                      <select className="admin-input" value={row.icon ?? "Sparkles"} onChange={(e) => update({ icon: e.target.value })}>
                        {ICON_NAMES.map((name: IconName) => <option key={name} value={name}>{name}</option>)}
                      </select>
                      <input className="admin-input" placeholder="Title" value={row.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
                    </div>
                    <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 50, marginTop: 6 }} placeholder={`Description ${i + 1}`} value={row.desc ?? ""} onChange={(e) => update({ desc: e.target.value })} />
                    <input className="admin-input" style={{ marginTop: 6 }} placeholder="Link (path, e.g. /what-is-ivf)" value={row.href ?? ""} onChange={(e) => update({ href: e.target.value })} />
                  </div>
                )}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Stats strip</label>
              <Repeater
                items={(doc.stats ?? []) as { value?: string; label?: string }[]}
                onChange={(next) => setIn(["stats"], next)}
                newItem={() => ({ value: "", label: "" })}
                addLabel="+ Add stat"
                rowLabel={(i) => {
                  const s = (doc.stats ?? [])[i] as { label?: string } | undefined;
                  return s?.label || `Stat ${i + 1}`;
                }}
                renderItem={(row, i, update) => (
                  <div className="admin-row-grid">
                    <input className="admin-input" placeholder="Value (e.g. 30,000+)" value={row.value ?? ""} onChange={(e) => update({ value: e.target.value })} />
                    <input className="admin-input" placeholder={`Label ${i + 1}`} value={row.label ?? ""} onChange={(e) => update({ label: e.target.value })} />
                  </div>
                )}
              />
            </div>
          </>
        )}

        {tab === "overview" && (
          <>
            <div className="admin-row-grid">
              <Field label="Overview title (plain)" value={get(["overviewTitle"])} onChange={(v) => setIn(["overviewTitle"], v)} />
              <Field label="Overview — highlighted word(s)" value={get(["overviewTitleAccent"])} onChange={(v) => setIn(["overviewTitleAccent"], v)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Paragraphs</label>
              <Repeater
                items={(doc.overviewParagraphs ?? []) as { value?: string }[]}
                onChange={(next) => setIn(["overviewParagraphs"], next)}
                newItem={() => ({ value: "" })}
                addLabel="+ Add paragraph"
                rowLabel={(i) => `Paragraph ${i + 1}`}
                renderItem={(row, i, update) => (
                  <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 60 }} value={row.value ?? ""} onChange={(e) => update({ value: e.target.value })} placeholder={`Paragraph ${i + 1}`} />
                )}
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Key facts (bullets)</label>
              <Repeater
                items={(doc.overviewBullets ?? []) as { value?: string }[]}
                onChange={(next) => setIn(["overviewBullets"], next)}
                newItem={() => ({ value: "" })}
                addLabel="+ Add bullet"
                rowLabel={(i) => `Bullet ${i + 1}`}
                renderItem={(row, i, update) => (
                  <input className="admin-input" value={row.value ?? ""} onChange={(e) => update({ value: e.target.value })} placeholder={`Bullet ${i + 1}`} />
                )}
              />
            </div>
          </>
        )}

        {tab === "signs" && (
          <>
            <div className="admin-row-grid">
              <Field label="Signs title (plain)" value={get(["signsTitle"])} onChange={(v) => setIn(["signsTitle"], v)} />
              <Field label="Signs — highlighted word(s)" value={get(["signsTitleAccent"])} onChange={(v) => setIn(["signsTitleAccent"], v)} />
            </div>
            <Field label="Signs subtitle" value={get(["signsSubtitle"])} onChange={(v) => setIn(["signsSubtitle"], v)} textarea />
            <div className="admin-field">
              <label className="admin-label">Signs list</label>
              <Repeater
                items={(doc.signs ?? []) as { value?: string }[]}
                onChange={(next) => setIn(["signs"], next)}
                newItem={() => ({ value: "" })}
                addLabel="+ Add sign"
                rowLabel={(i) => `Sign ${i + 1}`}
                renderItem={(row, i, update) => (
                  <input className="admin-input" value={row.value ?? ""} onChange={(e) => update({ value: e.target.value })} placeholder={`Sign ${i + 1}`} />
                )}
              />
            </div>
          </>
        )}

        {tab === "why" && (
          <>
            <div className="admin-row-grid">
              <Field label="Why-choose-us title (plain)" value={get(["whyTitle"])} onChange={(v) => setIn(["whyTitle"], v)} />
              <Field label="Why-choose-us — highlighted word(s)" value={get(["whyTitleAccent"])} onChange={(v) => setIn(["whyTitleAccent"], v)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Why-choose-us points</label>
              <Repeater
                items={(doc.whyPoints ?? []) as { icon?: string; title?: string; desc?: string }[]}
                onChange={(next) => setIn(["whyPoints"], next)}
                newItem={() => ({ icon: "Sparkles", title: "", desc: "" })}
                addLabel="+ Add point"
                rowLabel={(i) => {
                  const p = (doc.whyPoints ?? [])[i] as { title?: string } | undefined;
                  return p?.title || `Point ${i + 1}`;
                }}
                renderItem={(row, i, update) => (
                  <div>
                    <div className="admin-row-grid">
                      <select className="admin-input" value={row.icon ?? "Sparkles"} onChange={(e) => update({ icon: e.target.value })}>
                        {ICON_NAMES.map((name: IconName) => <option key={name} value={name}>{name}</option>)}
                      </select>
                      <input className="admin-input" placeholder="Title" value={row.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
                    </div>
                    <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 50, marginTop: 6 }} placeholder={`Description ${i + 1}`} value={row.desc ?? ""} onChange={(e) => update({ desc: e.target.value })} />
                  </div>
                )}
              />
            </div>
          </>
        )}

        {tab === "faqs" && (
          <div className="admin-field">
            <label className="admin-label">FAQs</label>
            <Repeater
              items={(doc.faqs ?? []) as { q?: string; a?: string }[]}
              onChange={(next) => setIn(["faqs"], next)}
              newItem={() => ({ q: "", a: "" })}
              addLabel="+ Add FAQ"
              rowLabel={(i) => {
                const f = (doc.faqs ?? [])[i] as { q?: string } | undefined;
                return f?.q || `FAQ ${i + 1}`;
              }}
              renderItem={(row, i, update) => (
                <div>
                  <input className="admin-input" placeholder={`Question ${i + 1}`} value={row.q ?? ""} onChange={(e) => update({ q: e.target.value })} />
                  <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 60, marginTop: 6 }} placeholder="Answer" value={row.a ?? ""} onChange={(e) => update({ a: e.target.value })} />
                </div>
              )}
            />
          </div>
        )}

        <SaveBar pending={pending} />
      </div>
      <Toast toast={toast} />
    </form>
  );
}
