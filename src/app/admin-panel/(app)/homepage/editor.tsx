"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Monitor, Tablet, Smartphone, ExternalLink, RotateCw, ChevronDown, Save,
} from "lucide-react";
import { resolveHomepage, type HomepageData, type HomepageSource } from "@/lib/homepage";
import { saveHomepageAction } from "../../actions";
import { useSave, Toast } from "../_components/save-kit";
import { LocaleTabs } from "../_components/locale-tabs";
import { getLocalized, setLocalized, type Locale } from "@/lib/i18n";

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
const HEADER_KEYS = new Set(SECTION_HEADERS.map((s) => s.key));

type PanelId = "hero" | "stats" | "headlines" | "suraksha" | "finalCta" | "faq";

function panelForPath(path: string): PanelId | null {
  const seg = path.split(".")[0];
  if (seg === "hero") return "hero";
  if (seg === "stats") return "stats";
  if (seg === "suraksha") return "suraksha";
  if (seg === "finalCta") return "finalCta";
  if (seg === "faq") return "faq";
  if (HEADER_KEYS.has(seg)) return "headlines";
  return null;
}

/** doc (editor draft) → HomepageSource for the client-side resolve. Converts the
 *  string[] badge/feature lists to the {text}[] form the resolver expects. */
function mapClientSource(doc: Doc): HomepageSource {
  const textRows = (a?: string[]) => (Array.isArray(a) ? a.filter(Boolean).map((text) => ({ text })) : undefined);
  return {
    ...doc,
    hero: doc.hero ? { ...doc.hero, badges: textRows(doc.hero.badges) } : undefined,
    suraksha: doc.suraksha ? { ...doc.suraksha, features: textRows(doc.suraksha.features) } : undefined,
  } as HomepageSource;
}

const DEVICE_WIDTH: Record<string, string> = { desktop: "100%", tablet: "834px", mobile: "390px" };

function Panel({ id, title, open, onToggle, children }: { id: PanelId; title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div data-panel={id} style={{ border: "1px solid var(--border)", borderRadius: 12, marginBottom: 10, background: "#fff", overflow: "hidden" }}>
      <button type="button" onClick={onToggle} style={{ all: "unset", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", boxSizing: "border-box", padding: "13px 15px", fontWeight: 700, fontSize: 14.5 }}>
        {title}
        <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
      </button>
      {open && <div style={{ padding: "2px 15px 16px" }}>{children}</div>}
    </div>
  );
}

function Field({ label, fieldPath, value, placeholder, onChange, textarea }: { label: string; fieldPath: string; value: string; placeholder?: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div className="admin-field" style={{ marginBottom: 12 }}>
      <label className="admin-label">{label}</label>
      {textarea ? (
        <textarea className="admin-textarea" data-fieldpath={fieldPath} style={{ fontFamily: "inherit", minHeight: 60 }} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="admin-input" data-fieldpath={fieldPath} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export function HomepageEditor({ initial, defaults }: { initial: Doc | null; defaults: HomepageData }) {
  const [doc, setDoc] = useState<Doc>(initial ?? {});
  const [locale, setLocale] = useState<Locale>("en");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [open, setOpen] = useState<Set<PanelId>>(new Set(["hero"]));
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { pending, toast, run } = useSave();

  const togglePanel = (id: PanelId) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const postToPreview = useCallback((msg: unknown) => {
    iframeRef.current?.contentWindow?.postMessage(msg, window.location.origin);
  }, []);

  // Push the live resolved preview whenever the draft changes.
  useEffect(() => {
    const data = resolveHomepage(mapClientSource(doc), locale);
    postToPreview({ type: "bfi-preview-data", data });
  }, [doc, locale, postToPreview]);

  // Receive click-to-select from the preview + the ready handshake.
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      const msg = e.data;
      if (!msg || typeof msg !== "object") return;
      if (msg.type === "bfi-preview-ready") {
        postToPreview({ type: "bfi-preview-data", data: resolveHomepage(mapClientSource(doc), locale) });
      } else if (msg.type === "bfi-mark-select" && typeof msg.path === "string") {
        selectField(msg.path);
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, locale, postToPreview]);

  const selectField = useCallback((path: string) => {
    const panel = panelForPath(path);
    if (panel) setOpen((prev) => new Set(prev).add(panel));
    // Scroll the preview to the section.
    const section = path.split(".")[0];
    postToPreview({ type: "bfi-scroll", section });
    // Focus the matching input (strip a trailing ".text" from badge paths).
    const norm = path.replace(/\.text$/, "");
    setTimeout(() => {
      const el = document.querySelector<HTMLElement>(`[data-fieldpath="${CSS.escape(norm)}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
        el.classList.add("admin-field-flash");
        setTimeout(() => el.classList.remove("admin-field-flash"), 1200);
      } else if (panel) {
        document.querySelector(`[data-panel="${panel}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  }, [postToPreview]);

  // ── Nested setters ──
  const setIn = useCallback((pathArr: string[], val: unknown) => {
    setDoc((prev) => {
      const next = structuredClone(prev);
      let cur = next;
      for (let i = 0; i < pathArr.length - 1; i++) {
        cur[pathArr[i]] = cur[pathArr[i]] ?? {};
        cur = cur[pathArr[i]];
      }
      cur[pathArr[pathArr.length - 1]] = val;
      return next;
    });
  }, []);
  const get = (pathArr: string[]): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cur: any = doc;
    for (const p of pathArr) { cur = cur?.[p]; if (cur == null) return ""; }
    return typeof cur === "string" ? cur : "";
  };
  /** Localized text field: reads/writes the active locale, preserving siblings. */
  const getL = (pathArr: string[]): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cur: any = doc;
    for (const p of pathArr) { cur = cur?.[p]; if (cur == null) break; }
    return getLocalized(cur, locale);
  };
  const setInL = (pathArr: string[], val: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cur: any = doc;
    for (const p of pathArr) { cur = cur?.[p]; if (cur == null) break; }
    setIn(pathArr, setLocalized(cur, locale, val));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const heroBadges = (doc.hero?.badges ?? []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stats = (doc.stats ?? []) as { value?: string; label?: any }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faqItems = (doc.faq?.items ?? []) as { q?: any; a?: any }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const surakshaFeatures = (doc.suraksha?.features ?? []) as any[];

  const save = () => run(async () => {
    const res = await saveHomepageAction(doc);
    if (res.ok) setTimeout(() => setIframeKey((k) => k + 1), 1000);
    return res;
  });

  const isOpen = (id: PanelId) => open.has(id);

  return (
    <div className="admin-editor">
      {/* Top bar */}
      <header className="admin-editor-top">
        <Link href="/admin-panel" className="admin-btn-ghost admin-editor-back"><ArrowLeft size={16} /> Exit Editor</Link>
        <div className="admin-editor-title">Homepage Editor</div>
        <div className="admin-editor-devices">
          {([["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]] as const).map(([d, Icon]) => (
            <button key={d} type="button" className={device === d ? "active" : ""} onClick={() => setDevice(d)} title={d}><Icon size={16} /></button>
          ))}
        </div>
        <div className="admin-editor-actions">
          <button type="button" className="admin-btn-ghost" onClick={() => setIframeKey((k) => k + 1)} title="Refresh preview"><RotateCw size={15} /></button>
          <a className="admin-btn-ghost" href="/" target="_blank" rel="noreferrer"><ExternalLink size={15} /> Live site</a>
          <button type="button" className="admin-btn" onClick={save} disabled={pending}><Save size={15} /> {pending ? "Saving…" : "Save & Publish"}</button>
        </div>
      </header>

      <div className="admin-editor-body">
        {/* Left — content forms */}
        <aside className="admin-editor-forms">
          <p className="admin-editor-hint">Click any highlighted element in the preview → its field opens here. Or edit below.</p>
          <LocaleTabs locale={locale} onChange={setLocale} />

          <Panel id="hero" title="🎯 Hero / Top Banner" open={isOpen("hero")} onToggle={() => togglePanel("hero")}>
            <Field label="Eyebrow" fieldPath="hero.eyebrow" value={getL(["hero", "eyebrow"])} placeholder={defaults.hero.eyebrow} onChange={(v) => setInL(["hero", "eyebrow"], v)} />
            <Field label="Headline" fieldPath="hero.headline" value={getL(["hero", "headline"])} placeholder={defaults.hero.headline} onChange={(v) => setInL(["hero", "headline"], v)} textarea />
            <Field label="Highlighted word" fieldPath="hero.headlineItalic" value={getL(["hero", "headlineItalic"])} placeholder={defaults.hero.headlineItalic} onChange={(v) => setInL(["hero", "headlineItalic"], v)} />
            <Field label="Paragraph" fieldPath="hero.paragraph" value={getL(["hero", "paragraph"])} placeholder={defaults.hero.paragraph} onChange={(v) => setInL(["hero", "paragraph"], v)} textarea />
            <label className="admin-label">Badges</label>
            {(heroBadges.length ? heroBadges : defaults.hero.badges).map((b, i) => (
              <input key={i} className="admin-input" data-fieldpath={`hero.badges.${i}`} style={{ marginBottom: 6 }} value={getLocalized(heroBadges[i], locale)} placeholder={typeof b === "string" ? b : defaults.hero.badges[i]} onChange={(e) => {
                const arr = heroBadges.length ? [...heroBadges] : [...defaults.hero.badges];
                arr[i] = setLocalized(arr[i], locale, e.target.value); setIn(["hero", "badges"], arr);
              }} />
            ))}
            <Field label="Floating award chip" fieldPath="hero.floatingBadge" value={getL(["hero", "floatingBadge"])} placeholder={defaults.hero.floatingBadge} onChange={(v) => setInL(["hero", "floatingBadge"], v)} />
            <Field label="Hero image URL" fieldPath="hero.image" value={get(["hero", "image"])} placeholder={defaults.hero.image} onChange={(v) => setIn(["hero", "image"], v)} />
          </Panel>

          <Panel id="stats" title="📊 Stats Strip" open={isOpen("stats")} onToggle={() => togglePanel("stats")}>
            {(stats.length ? stats : defaults.stats.map((s) => ({ value: s.value, label: s.l }))).map((_, i) => (
              <div className="admin-row-grid" key={i}>
                <Field label={`Value ${i + 1}`} fieldPath={`stats.${i}.value`} value={stats[i]?.value ?? ""} placeholder={defaults.stats[i]?.value} onChange={(v) => {
                  const base = stats.length ? [...stats] : defaults.stats.map((s) => ({ value: s.value, label: s.l }));
                  base[i] = { ...base[i], value: v }; setIn(["stats"], base);
                }} />
                <Field label={`Label ${i + 1}`} fieldPath={`stats.${i}.label`} value={getLocalized(stats[i]?.label, locale)} placeholder={defaults.stats[i]?.l} onChange={(v) => {
                  const base = stats.length ? [...stats] : defaults.stats.map((s) => ({ value: s.value, label: s.l }));
                  base[i] = { ...base[i], label: setLocalized(base[i]?.label, locale, v) }; setIn(["stats"], base);
                }} />
              </div>
            ))}
          </Panel>

          <Panel id="headlines" title="📰 Section Headlines" open={isOpen("headlines")} onToggle={() => togglePanel("headlines")}>
            {SECTION_HEADERS.map(({ key, label, subtitle }) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const def = (defaults as any)[key] ?? {};
              return (
                <div key={key} data-fieldpath={`${key}.eyebrow`} style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--plum)", marginBottom: 8 }}>{label}</div>
                  <Field label="Eyebrow" fieldPath={`${key}.eyebrow`} value={getL([key, "eyebrow"])} placeholder={def.eyebrow} onChange={(v) => setInL([key, "eyebrow"], v)} />
                  <div className="admin-row-grid">
                    <Field label="Heading" fieldPath={`${key}.heading.lead`} value={getL([key, "heading", "lead"])} placeholder={def.heading?.lead} onChange={(v) => setInL([key, "heading", "lead"], v)} />
                    <Field label="Highlighted word" fieldPath={`${key}.heading.em`} value={getL([key, "heading", "em"])} placeholder={def.heading?.em} onChange={(v) => setInL([key, "heading", "em"], v)} />
                  </div>
                  {subtitle && <Field label="Subtitle" fieldPath={`${key}.subtitle`} value={getL([key, "subtitle"])} placeholder={def.subtitle} onChange={(v) => setInL([key, "subtitle"], v)} textarea />}
                </div>
              );
            })}
          </Panel>

          <Panel id="suraksha" title="🛡️ Suraksha Kavach" open={isOpen("suraksha")} onToggle={() => togglePanel("suraksha")}>
            <Field label="Badge" fieldPath="suraksha.badge" value={getL(["suraksha", "badge"])} placeholder={defaults.suraksha.badge} onChange={(v) => setInL(["suraksha", "badge"], v)} />
            <div className="admin-row-grid">
              <Field label="Heading" fieldPath="suraksha.heading.lead" value={getL(["suraksha", "heading", "lead"])} placeholder={defaults.suraksha.heading.lead} onChange={(v) => setInL(["suraksha", "heading", "lead"], v)} />
              <Field label="Highlighted word" fieldPath="suraksha.heading.em" value={getL(["suraksha", "heading", "em"])} placeholder={defaults.suraksha.heading.em} onChange={(v) => setInL(["suraksha", "heading", "em"], v)} />
            </div>
            <Field label="Paragraph" fieldPath="suraksha.paragraph" value={getL(["suraksha", "paragraph"])} placeholder={defaults.suraksha.paragraph} onChange={(v) => setInL(["suraksha", "paragraph"], v)} textarea />
            <label className="admin-label">Features</label>
            {(surakshaFeatures.length ? surakshaFeatures : defaults.suraksha.features).map((f, i) => (
              <input key={i} className="admin-input" data-fieldpath={`suraksha.features.${i}`} style={{ marginBottom: 6 }} value={getLocalized(surakshaFeatures[i], locale)} placeholder={typeof f === "string" ? f : defaults.suraksha.features[i]} onChange={(e) => {
                const arr = surakshaFeatures.length ? [...surakshaFeatures] : [...defaults.suraksha.features];
                arr[i] = setLocalized(arr[i], locale, e.target.value); setIn(["suraksha", "features"], arr);
              }} />
            ))}
          </Panel>

          <Panel id="finalCta" title="🎬 Closing CTA" open={isOpen("finalCta")} onToggle={() => togglePanel("finalCta")}>
            <Field label="Eyebrow" fieldPath="finalCta.eyebrow" value={getL(["finalCta", "eyebrow"])} placeholder={defaults.finalCta.eyebrow} onChange={(v) => setInL(["finalCta", "eyebrow"], v)} />
            <div className="admin-row-grid">
              <Field label="Heading" fieldPath="finalCta.heading.lead" value={getL(["finalCta", "heading", "lead"])} placeholder={defaults.finalCta.heading.lead} onChange={(v) => setInL(["finalCta", "heading", "lead"], v)} />
              <Field label="Highlighted word" fieldPath="finalCta.heading.em" value={getL(["finalCta", "heading", "em"])} placeholder={defaults.finalCta.heading.em} onChange={(v) => setInL(["finalCta", "heading", "em"], v)} />
            </div>
            <Field label="Paragraph" fieldPath="finalCta.paragraph" value={getL(["finalCta", "paragraph"])} placeholder={defaults.finalCta.paragraph} onChange={(v) => setInL(["finalCta", "paragraph"], v)} textarea />
          </Panel>

          <Panel id="faq" title="❓ FAQ" open={isOpen("faq")} onToggle={() => togglePanel("faq")}>
            <Field label="Eyebrow" fieldPath="faq.eyebrow" value={getL(["faq", "eyebrow"])} placeholder={defaults.faq.eyebrow} onChange={(v) => setInL(["faq", "eyebrow"], v)} />
            <div className="admin-row-grid">
              <Field label="Heading" fieldPath="faq.heading.lead" value={getL(["faq", "heading", "lead"])} placeholder={defaults.faq.heading.lead} onChange={(v) => setInL(["faq", "heading", "lead"], v)} />
              <Field label="Highlighted word" fieldPath="faq.heading.em" value={getL(["faq", "heading", "em"])} placeholder={defaults.faq.heading.em} onChange={(v) => setInL(["faq", "heading", "em"], v)} />
            </div>
            {(faqItems.length ? faqItems : defaults.faq.items).map((_, i) => (
              <div key={i} style={{ borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 10 }}>
                <Field label={`Q${i + 1}`} fieldPath={`faq.items.${i}.q`} value={getLocalized(faqItems[i]?.q, locale)} placeholder={defaults.faq.items[i]?.q} onChange={(v) => {
                  const base = faqItems.length ? [...faqItems] : defaults.faq.items.map((x) => ({ q: x.q, a: x.a }));
                  base[i] = { ...base[i], q: setLocalized(base[i]?.q, locale, v) }; setIn(["faq", "items"], base);
                }} />
                <Field label="Answer" fieldPath={`faq.items.${i}.a`} value={getLocalized(faqItems[i]?.a, locale)} placeholder={defaults.faq.items[i]?.a} onChange={(v) => {
                  const base = faqItems.length ? [...faqItems] : defaults.faq.items.map((x) => ({ q: x.q, a: x.a }));
                  base[i] = { ...base[i], a: setLocalized(base[i]?.a, locale, v) }; setIn(["faq", "items"], base);
                }} textarea />
              </div>
            ))}
          </Panel>
        </aside>

        {/* Right — live preview */}
        <div className="admin-editor-preview">
          <div className="admin-editor-frame" style={{ maxWidth: DEVICE_WIDTH[device] }}>
            <iframe key={iframeKey} ref={iframeRef} src="/live-preview/homepage" title="Homepage preview" />
          </div>
        </div>
      </div>
      <Toast toast={toast} />
    </div>
  );
}
