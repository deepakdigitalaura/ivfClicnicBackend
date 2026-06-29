"use client";
import { useState, useCallback } from "react";
import { RefreshCw, ExternalLink, ChevronDown } from "lucide-react";
import type { HomepageData } from "@/lib/homepage";
import { saveHomepageAction } from "../../actions";
import { useSave, Toast } from "../_components/save-kit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

const SECTION_HEADERS: { key: string; label: string; subtitle: boolean }[] = [
  { key: "whyBavishi", label: "Why Bavishi", subtitle: true },
  { key: "treatments", label: "Treatments", subtitle: true },
  { key: "successStories", label: "Success Stories", subtitle: true },
  { key: "videoHub", label: "Education Videos", subtitle: true },
  { key: "doctors", label: "Our Doctors", subtitle: true },
  { key: "whyChoose", label: "Why Choose Pillars", subtitle: true },
  { key: "about", label: "About the Institute", subtitle: true },
  { key: "locations", label: "Our Locations", subtitle: true },
  { key: "calculators", label: "Fertility Calculators", subtitle: true },
  { key: "blogs", label: "Knowledge & Resources", subtitle: false },
  { key: "testimonials", label: "Google Reviews", subtitle: false },
  { key: "media", label: "Media Coverage", subtitle: false },
  { key: "inquiry", label: "Inquiry Form", subtitle: true },
];

function Panel({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} style={{ border: "1px solid var(--border)", borderRadius: 12, marginBottom: 12, background: "#fff" }}>
      <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 15, padding: "14px 16px", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {title} <ChevronDown size={16} />
      </summary>
      <div style={{ padding: "4px 16px 16px" }}>{children}</div>
    </details>
  );
}

function Field({ label, value, placeholder, onChange, textarea }: { label: string; value: string; placeholder?: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div className="admin-field" style={{ marginBottom: 12 }}>
      <label className="admin-label">{label}</label>
      {textarea ? (
        <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 64 }} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="admin-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export function HomepageEditor({ initial, defaults }: { initial: Doc | null; defaults: HomepageData }) {
  const [doc, setDoc] = useState<Doc>(initial ?? {});
  const [iframeKey, setIframeKey] = useState(0);
  const { pending, toast, run } = useSave();

  // Nested setters
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cur: any = doc;
    for (const p of path) { cur = cur?.[p]; if (cur == null) return ""; }
    return typeof cur === "string" ? cur : "";
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const res = await saveHomepageAction(doc);
      if (res.ok) setTimeout(() => setIframeKey((k) => k + 1), 1200); // reload preview after revalidate
      return res;
    });
  };

  // ── Hero ──
  const heroBadges = (doc.hero?.badges ?? []) as string[];
  const setBadge = (i: number, v: string) => setIn(["hero", "badges"], heroBadges.map((b, j) => (j === i ? v : b)));
  const stats = (doc.stats ?? []) as { value?: string; label?: string }[];
  const setStat = (i: number, patch: Partial<{ value: string; label: string }>) =>
    setIn(["stats"], stats.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const faqItems = (doc.faq?.items ?? []) as { q?: string; a?: string }[];
  const setFaq = (i: number, patch: Partial<{ q: string; a: string }>) =>
    setIn(["faq", "items"], faqItems.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  const surakshaFeatures = (doc.suraksha?.features ?? []) as string[];

  return (
    <form onSubmit={save}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(360px, 1fr) 1fr", gap: 20, alignItems: "start" }}>
        {/* LEFT — forms */}
        <div style={{ maxHeight: "calc(100vh - 220px)", overflowY: "auto", paddingRight: 6 }}>
          <Panel title="🎯 Hero / Top Banner" open>
            <Field label="Eyebrow" value={get(["hero", "eyebrow"])} placeholder={defaults.hero.eyebrow} onChange={(v) => setIn(["hero", "eyebrow"], v)} />
            <Field label="Headline" value={get(["hero", "headline"])} placeholder={defaults.hero.headline} onChange={(v) => setIn(["hero", "headline"], v)} textarea />
            <Field label="Highlighted word" value={get(["hero", "headlineItalic"])} placeholder={defaults.hero.headlineItalic} onChange={(v) => setIn(["hero", "headlineItalic"], v)} />
            <Field label="Paragraph" value={get(["hero", "paragraph"])} placeholder={defaults.hero.paragraph} onChange={(v) => setIn(["hero", "paragraph"], v)} textarea />
            <label className="admin-label">Badges</label>
            {(heroBadges.length ? heroBadges : defaults.hero.badges).map((b, i) => (
              <input key={i} className="admin-input" style={{ marginBottom: 6 }} value={heroBadges[i] ?? ""} placeholder={defaults.hero.badges[i] ?? b} onChange={(e) => {
                const arr = heroBadges.length ? [...heroBadges] : [...defaults.hero.badges];
                arr[i] = e.target.value; setIn(["hero", "badges"], arr);
              }} />
            ))}
            <Field label="Floating award chip" value={get(["hero", "floatingBadge"])} placeholder={defaults.hero.floatingBadge} onChange={(v) => setIn(["hero", "floatingBadge"], v)} />
            <Field label="Hero image URL" value={get(["hero", "image"])} placeholder={defaults.hero.image} onChange={(v) => setIn(["hero", "image"], v)} />
          </Panel>

          <Panel title="📊 Stats Strip">
            {(stats.length ? stats : defaults.stats.map((s) => ({ value: s.value, label: s.l }))).map((_, i) => (
              <div className="admin-row-grid" key={i}>
                <Field label={`Value ${i + 1}`} value={stats[i]?.value ?? ""} placeholder={defaults.stats[i]?.value} onChange={(v) => setStat(i, { value: v })} />
                <Field label={`Label ${i + 1}`} value={stats[i]?.label ?? ""} placeholder={defaults.stats[i]?.l} onChange={(v) => setStat(i, { label: v })} />
              </div>
            ))}
          </Panel>

          <Panel title="📰 Section Headlines">
            {SECTION_HEADERS.map(({ key, label, subtitle }) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const def = (defaults as any)[key] ?? {};
              return (
                <div key={key} style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--plum)", marginBottom: 8 }}>{label}</div>
                  <Field label="Eyebrow" value={get([key, "eyebrow"])} placeholder={def.eyebrow} onChange={(v) => setIn([key, "eyebrow"], v)} />
                  <div className="admin-row-grid">
                    <Field label="Heading (plain)" value={get([key, "heading", "lead"])} placeholder={def.heading?.lead} onChange={(v) => setIn([key, "heading", "lead"], v)} />
                    <Field label="Highlighted word" value={get([key, "heading", "em"])} placeholder={def.heading?.em} onChange={(v) => setIn([key, "heading", "em"], v)} />
                  </div>
                  {subtitle && <Field label="Subtitle" value={get([key, "subtitle"])} placeholder={def.subtitle} onChange={(v) => setIn([key, "subtitle"], v)} textarea />}
                </div>
              );
            })}
          </Panel>

          <Panel title="🛡️ Suraksha Kavach">
            <Field label="Badge" value={get(["suraksha", "badge"])} placeholder={defaults.suraksha.badge} onChange={(v) => setIn(["suraksha", "badge"], v)} />
            <div className="admin-row-grid">
              <Field label="Heading (plain)" value={get(["suraksha", "heading", "lead"])} placeholder={defaults.suraksha.heading.lead} onChange={(v) => setIn(["suraksha", "heading", "lead"], v)} />
              <Field label="Highlighted word" value={get(["suraksha", "heading", "em"])} placeholder={defaults.suraksha.heading.em} onChange={(v) => setIn(["suraksha", "heading", "em"], v)} />
            </div>
            <Field label="Paragraph" value={get(["suraksha", "paragraph"])} placeholder={defaults.suraksha.paragraph} onChange={(v) => setIn(["suraksha", "paragraph"], v)} textarea />
            <label className="admin-label">Features</label>
            {(surakshaFeatures.length ? surakshaFeatures : defaults.suraksha.features).map((f, i) => (
              <input key={i} className="admin-input" style={{ marginBottom: 6 }} value={surakshaFeatures[i] ?? ""} placeholder={defaults.suraksha.features[i] ?? f} onChange={(e) => {
                const arr = surakshaFeatures.length ? [...surakshaFeatures] : [...defaults.suraksha.features];
                arr[i] = e.target.value; setIn(["suraksha", "features"], arr);
              }} />
            ))}
          </Panel>

          <Panel title="🎬 Closing Call-to-Action">
            <Field label="Eyebrow" value={get(["finalCta", "eyebrow"])} placeholder={defaults.finalCta.eyebrow} onChange={(v) => setIn(["finalCta", "eyebrow"], v)} />
            <div className="admin-row-grid">
              <Field label="Heading (plain)" value={get(["finalCta", "heading", "lead"])} placeholder={defaults.finalCta.heading.lead} onChange={(v) => setIn(["finalCta", "heading", "lead"], v)} />
              <Field label="Highlighted word" value={get(["finalCta", "heading", "em"])} placeholder={defaults.finalCta.heading.em} onChange={(v) => setIn(["finalCta", "heading", "em"], v)} />
            </div>
            <Field label="Paragraph" value={get(["finalCta", "paragraph"])} placeholder={defaults.finalCta.paragraph} onChange={(v) => setIn(["finalCta", "paragraph"], v)} textarea />
          </Panel>

          <Panel title="❓ FAQ">
            <Field label="Eyebrow" value={get(["faq", "eyebrow"])} placeholder={defaults.faq.eyebrow} onChange={(v) => setIn(["faq", "eyebrow"], v)} />
            <div className="admin-row-grid">
              <Field label="Heading (plain)" value={get(["faq", "heading", "lead"])} placeholder={defaults.faq.heading.lead} onChange={(v) => setIn(["faq", "heading", "lead"], v)} />
              <Field label="Highlighted word" value={get(["faq", "heading", "em"])} placeholder={defaults.faq.heading.em} onChange={(v) => setIn(["faq", "heading", "em"], v)} />
            </div>
            {(faqItems.length ? faqItems : defaults.faq.items).map((_, i) => (
              <div key={i} style={{ borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 10 }}>
                <Field label={`Q${i + 1}`} value={faqItems[i]?.q ?? ""} placeholder={defaults.faq.items[i]?.q} onChange={(v) => setFaq(i, { q: v })} />
                <Field label="Answer" value={faqItems[i]?.a ?? ""} placeholder={defaults.faq.items[i]?.a} onChange={(v) => setFaq(i, { a: v })} textarea />
              </div>
            ))}
          </Panel>

          <div className="admin-actions-bar" style={{ position: "sticky", bottom: 0, background: "var(--ivory)", marginTop: 0 }}>
            <button type="submit" className="admin-btn" disabled={pending}>{pending ? "Saving…" : "Save & Publish"}</button>
            <a className="admin-btn-ghost" href="/" target="_blank" rel="noreferrer"><ExternalLink size={15} /> Open live site</a>
          </div>
        </div>

        {/* RIGHT — live preview */}
        <div style={{ position: "sticky", top: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--muted-foreground)" }}>Live preview</span>
            <button type="button" className="admin-btn-ghost" style={{ padding: "6px 12px", fontSize: 13 }} onClick={() => setIframeKey((k) => k + 1)}><RefreshCw size={14} /> Refresh</button>
          </div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", height: "calc(100vh - 200px)", background: "#fff" }}>
            <iframe key={iframeKey} src="/" title="Homepage preview" style={{ width: "100%", height: "100%", border: "none" }} />
          </div>
        </div>
      </div>
      <Toast toast={toast} />
    </form>
  );
}
