"use client";
import { useState, useCallback } from "react";
import { materializeAboutSource, type AboutSource } from "@/lib/about";
import { ICON_NAMES, type IconName } from "@/lib/icon-map";
import { saveAboutAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { ImageUpload } from "../_components/image-upload";
import { Repeater } from "../_components/repeater";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

type Tab = "hero" | "story" | "legacy" | "trust" | "network" | "seo";
const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "story", label: "Our Story" },
  { id: "legacy", label: "Legacy & Stats" },
  { id: "trust", label: "Trust & Patient First" },
  { id: "network", label: "Network & CTA" },
  { id: "seo", label: "SEO" },
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

const HTML_HINT = "HTML allowed (e.g. <a href=\"/doctors/x\">name</a>) — matches the existing site copy.";

/**
 * About-BFI admin form. Unlike Homepage/Site Settings (per-field placeholder
 * fallback), About's resolver (resolveAbout) gates most sections on a single
 * "lead" field or array length and then swaps the WHOLE section — so this
 * form materializes the full current content (Sanity doc, or defaults where
 * unset) on load via materializeAboutSource() and edits/saves that complete
 * object every time. This guarantees a save never submits a half-empty
 * section that would blank out its untouched siblings on the live page.
 */
export function AboutForm({ initial }: { initial: Doc | null }) {
  const [doc, setDoc] = useState<Doc>(() => materializeAboutSource(initial as AboutSource));
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
    run(async () => saveAboutAction(doc));
  };

  const paragraphsField = (path: string[], label: string) => {
    const items = (doc[path[0]]?.[path[1]] ?? []) as { value?: string }[];
    return (
      <div className="admin-field">
        <label className="admin-label">{label}</label>
        <Repeater
          items={items}
          onChange={(next) => setIn(path, next)}
          newItem={() => ({ value: "" })}
          addLabel="+ Add paragraph"
          rowLabel={(i) => `Paragraph ${i + 1}`}
          renderItem={(row, i, update) => (
            <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 60 }} value={row.value ?? ""} onChange={(e) => update({ value: e.target.value })} placeholder={`Paragraph ${i + 1}`} />
          )}
        />
      </div>
    );
  };

  const headingFields = (path: string[]) => (
    <div className="admin-row-grid">
      <Field label="Heading" value={get([...path, "lead"])} onChange={(v) => setIn([...path, "lead"], v)} />
      <Field label="Highlighted word" value={get([...path, "em"])} onChange={(v) => setIn([...path, "em"], v)} />
    </div>
  );

  const statsField = (key: "atAGlance" | "patientStats", label: string) => {
    const items = (doc[key] ?? []) as { value?: string; label?: string }[];
    return (
      <div className="admin-field">
        <label className="admin-label">{label}</label>
        <Repeater
          items={items}
          onChange={(next) => setIn([key], next)}
          newItem={() => ({ value: "", label: "" })}
          addLabel="+ Add stat"
          rowLabel={(i) => (items[i]?.label ? items[i].label! : `Stat ${i + 1}`)}
          renderItem={(row, i, update) => (
            <div className="admin-row-grid">
              <input className="admin-input" placeholder={`Number ${i + 1} (e.g. 30,000+)`} value={row.value ?? ""} onChange={(e) => update({ value: e.target.value })} />
              <input className="admin-input" placeholder="Label" value={row.label ?? ""} onChange={(e) => update({ label: e.target.value })} />
            </div>
          )}
        />
      </div>
    );
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
            <Field label="Eyebrow" value={get(["hero", "eyebrow"])} onChange={(v) => setIn(["hero", "eyebrow"], v)} />
            <Field label="Headline" value={get(["hero", "headline"])} onChange={(v) => setIn(["hero", "headline"], v)} textarea />
            <Field label="Highlighted word" hint="The italicised word(s) within the headline." value={get(["hero", "headlineItalic"])} onChange={(v) => setIn(["hero", "headlineItalic"], v)} />
            <Field label="Paragraph" hint={HTML_HINT} value={get(["hero", "paragraph"])} onChange={(v) => setIn(["hero", "paragraph"], v)} textarea />
            <div className="admin-field">
              <label className="admin-label">Hero image</label>
              <ImageUpload value={get(["hero", "image"])} onChange={(url) => setIn(["hero", "image"], url)} label="Hero image" />
            </div>
          </>
        )}

        {tab === "story" && (
          <>
            <Field label="Eyebrow" value={get(["story", "eyebrow"])} onChange={(v) => setIn(["story", "eyebrow"], v)} />
            {headingFields(["story", "heading"])}
            {paragraphsField(["story", "paragraphs"], "Story paragraphs")}
          </>
        )}

        {tab === "legacy" && (
          <>
            <Field label="Eyebrow" value={get(["legacy", "eyebrow"])} onChange={(v) => setIn(["legacy", "eyebrow"], v)} />
            {headingFields(["legacy", "heading"])}
            <div className="admin-field" style={{ marginTop: 16 }}>
              <label className="admin-label">Milestones (timeline)</label>
              <Repeater
                items={(doc.milestones ?? []) as { y?: string; t?: string; d?: string }[]}
                onChange={(next) => setIn(["milestones"], next)}
                newItem={() => ({ y: "", t: "", d: "" })}
                addLabel="+ Add milestone"
                rowLabel={(i) => {
                  const m = (doc.milestones ?? [])[i] as { y?: string; t?: string } | undefined;
                  return m?.y ? `${m.y}${m.t ? ` — ${m.t}` : ""}` : `Milestone ${i + 1}`;
                }}
                renderItem={(row, i, update) => (
                  <div>
                    <div className="admin-row-grid">
                      <input className="admin-input" placeholder="Year (e.g. 2026)" value={row.y ?? ""} onChange={(e) => update({ y: e.target.value })} />
                      <input className="admin-input" placeholder="Title" value={row.t ?? ""} onChange={(e) => update({ t: e.target.value })} />
                    </div>
                    <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 50, marginTop: 6 }} placeholder={`Description ${i + 1} — ${HTML_HINT}`} value={row.d ?? ""} onChange={(e) => update({ d: e.target.value })} />
                  </div>
                )}
              />
            </div>
            <div style={{ marginTop: 16 }}>{statsField("atAGlance", "At a Glance stats")}</div>
          </>
        )}

        {tab === "trust" && (
          <>
            <Field label="Eyebrow" value={get(["trust", "eyebrow"])} onChange={(v) => setIn(["trust", "eyebrow"], v)} />
            {headingFields(["trust", "heading"])}
            <div className="admin-field" style={{ marginTop: 16 }}>
              <label className="admin-label">Trust pillars</label>
              <Repeater
                items={(doc.trustPillars ?? []) as { icon?: string; t?: string; d?: string }[]}
                onChange={(next) => setIn(["trustPillars"], next)}
                newItem={() => ({ icon: "Sparkles", t: "", d: "" })}
                addLabel="+ Add pillar"
                rowLabel={(i) => {
                  const p = (doc.trustPillars ?? [])[i] as { t?: string } | undefined;
                  return p?.t || `Pillar ${i + 1}`;
                }}
                renderItem={(row, i, update) => (
                  <div>
                    <div className="admin-row-grid">
                      <select className="admin-input" value={row.icon ?? "Sparkles"} onChange={(e) => update({ icon: e.target.value })}>
                        {ICON_NAMES.map((name: IconName) => <option key={name} value={name}>{name}</option>)}
                      </select>
                      <input className="admin-input" placeholder="Title" value={row.t ?? ""} onChange={(e) => update({ t: e.target.value })} />
                    </div>
                    <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 50, marginTop: 6 }} placeholder={`Description ${i + 1} — ${HTML_HINT}`} value={row.d ?? ""} onChange={(e) => update({ d: e.target.value })} />
                  </div>
                )}
              />
            </div>
            <div style={{ marginTop: 20, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 8 }}>Patient First</div>
              <Field label="Eyebrow" value={get(["patientFirst", "eyebrow"])} onChange={(v) => setIn(["patientFirst", "eyebrow"], v)} />
              {headingFields(["patientFirst", "heading"])}
              {paragraphsField(["patientFirst", "paragraphs"], "Paragraphs")}
              <div style={{ marginTop: 12 }}>{statsField("patientStats", "Patient stats")}</div>
            </div>
          </>
        )}

        {tab === "network" && (
          <>
            <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 8 }}>Meet the Specialists</div>
            <Field label="Eyebrow" value={get(["meetSpecialists", "eyebrow"])} onChange={(v) => setIn(["meetSpecialists", "eyebrow"], v)} />
            {headingFields(["meetSpecialists", "heading"])}
            <Field label="Subtitle" value={get(["meetSpecialists", "subtitle"])} onChange={(v) => setIn(["meetSpecialists", "subtitle"], v)} />

            <div style={{ marginTop: 20, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 8 }}>Our Network</div>
              <Field label="Eyebrow" value={get(["network", "eyebrow"])} onChange={(v) => setIn(["network", "eyebrow"], v)} />
              {headingFields(["network", "heading"])}
              <Field label="Subtitle" value={get(["network", "subtitle"])} onChange={(v) => setIn(["network", "subtitle"], v)} />
              <div className="admin-field" style={{ marginTop: 10 }}>
                <label className="admin-label">Cities</label>
                <Repeater
                  items={(doc.network?.cities ?? []) as { c?: string; n?: string }[]}
                  onChange={(next) => setIn(["network", "cities"], next)}
                  newItem={() => ({ c: "", n: "" })}
                  addLabel="+ Add city"
                  rowLabel={(i) => {
                    const c = (doc.network?.cities ?? [])[i] as { c?: string } | undefined;
                    return c?.c || `City ${i + 1}`;
                  }}
                  renderItem={(row, i, update) => (
                    <div className="admin-row-grid">
                      <input className="admin-input" placeholder={`City ${i + 1} name`} value={row.c ?? ""} onChange={(e) => update({ c: e.target.value })} />
                      <input className="admin-input" placeholder="e.g. 3 centres" value={row.n ?? ""} onChange={(e) => update({ n: e.target.value })} />
                    </div>
                  )}
                />
              </div>
            </div>

            <div style={{ marginTop: 20, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 8 }}>Closing CTA</div>
              <p className="admin-hint">Button labels (e.g. &quot;Book Consultation&quot;) are fixed in code; only the heading is editable here.</p>
              {headingFields(["finalCta", "heading"])}
            </div>
          </>
        )}

        {tab === "seo" && (
          <>
            <Field label="Meta title" value={get(["seo", "metaTitle"])} onChange={(v) => setIn(["seo", "metaTitle"], v)} />
            <Field label="Meta description" value={get(["seo", "metaDescription"])} onChange={(v) => setIn(["seo", "metaDescription"], v)} textarea />
            <Field label="OG title" value={get(["seo", "ogTitle"])} onChange={(v) => setIn(["seo", "ogTitle"], v)} />
            <Field label="OG description" value={get(["seo", "ogDescription"])} onChange={(v) => setIn(["seo", "ogDescription"], v)} textarea />
          </>
        )}

        <SaveBar pending={pending} />
      </div>
      <Toast toast={toast} />
    </form>
  );
}
