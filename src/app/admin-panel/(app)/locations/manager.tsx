"use client";
import { useState } from "react";
import { Pencil, Trash2, Plus, X, MapPin, ArrowLeft, Building2 } from "lucide-react";
import type { AdminCity, AdminCentre } from "@/sanity/lib/admin";
import { materializeCitySource, materializeCentreSource, type CitySource, type CentreSource } from "@/lib/location-content";
import { saveCityAction, deleteCityAction, saveCentreAction, deleteCentreAction } from "../../actions";
import { useSave, Toast } from "../_components/save-kit";
import { ImageUpload } from "../_components/image-upload";
import { Repeater } from "../_components/repeater";

type CodeCity = { slug: string; name: string };
type CodeCentre = { slug: string; citySlug: string; name: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Doc = Record<string, any>;

const EMPTY_CITY: Doc = { slug: "", built: true };
const emptyCentre = (citySlug: string): Doc => ({ slug: "", citySlug, built: true });

type CityTab = "main" | "contact" | "content" | "faqs";
const CITY_TABS: { id: CityTab; label: string }[] = [
  { id: "main", label: "Main" },
  { id: "contact", label: "Contact" },
  { id: "content", label: "Content" },
  { id: "faqs", label: "FAQs" },
];

type CentreTab = "main" | "contact" | "content" | "facility" | "faqs";
const CENTRE_TABS: { id: CentreTab; label: string }[] = [
  { id: "main", label: "Main" },
  { id: "contact", label: "Contact & Hours" },
  { id: "content", label: "Content" },
  { id: "facility", label: "Facility" },
  { id: "faqs", label: "FAQs" },
];

// Every array field in city/centre schemas wraps plain strings as [{value}]
// (valueArr() in src/sanity/schemas/city.ts / centre.ts) — one shared
// per-line textarea convention, same as Doctors' cities/treatments fields.
const toLinesValue = (a?: { value?: string }[]) => (a ?? []).map((x) => x.value ?? "").join("\n");
const fromLinesValue = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean).map((value) => ({ value }));

function makeSetIn(setState: React.Dispatch<React.SetStateAction<Doc | null>>) {
  return (path: string[], val: unknown) => {
    setState((prev) => {
      const next: Doc = structuredClone(prev ?? {});
      let cur = next;
      for (let i = 0; i < path.length - 1; i++) {
        cur[path[i]] = cur[path[i]] ?? {};
        cur = cur[path[i]];
      }
      cur[path[path.length - 1]] = val;
      return next;
    });
  };
}
function makeGet(state: Doc | null) {
  return (path: string[]): string => {
    let cur: Doc | null = state;
    for (const p of path) { cur = cur?.[p]; if (cur == null) return ""; }
    return typeof cur === "string" ? cur : "";
  };
}

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

function FaqsTab({ faqs, onChange }: { faqs: { q?: string; a?: string }[]; onChange: (next: { q?: string; a?: string }[]) => void }) {
  return (
    <div className="admin-field">
      <label className="admin-label">FAQs</label>
      <Repeater
        items={faqs}
        onChange={onChange}
        newItem={() => ({ q: "", a: "" })}
        addLabel="+ Add FAQ"
        rowLabel={(i) => faqs[i]?.q || `FAQ ${i + 1}`}
        renderItem={(row, i, update) => (
          <div>
            <input className="admin-input" placeholder={`Question ${i + 1}`} value={row.q ?? ""} onChange={(e) => update({ q: e.target.value })} />
            <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 60, marginTop: 6 }} placeholder="Answer" value={row.a ?? ""} onChange={(e) => update({ a: e.target.value })} />
          </div>
        )}
      />
    </div>
  );
}

/**
 * Locations admin manager — nested City → Centres UI (not two flat sections):
 * a top-level Cities list, click into a city to manage its Centres, click a
 * centre to edit it. City and Centre are separate Sanity document types
 * joined by the `citySlug` string field (not a literal nested array), so this
 * is two sibling CRUD flows presented as one drill-down navigation.
 *
 * Same materialize-before-edit reasoning as Services/Treatments — the
 * resolver (location-content.ts) falls back per-field/per-array (not
 * per-section like Treatments/Services), but arrays are still all-or-nothing,
 * so every edit is seeded via materializeCitySource()/materializeCentreSource()
 * to avoid a save blanking untouched rows. No "Section Labels" tab: the schema
 * has no sectionLabels field and the GROQ projections never fetch it — same
 * reasoning Services used to omit its dead `cta` tab.
 */
export function LocationsManager({
  initialCities, initialCentres, codeCities, codeCentres,
}: {
  initialCities: AdminCity[]; initialCentres: AdminCentre[]; codeCities: CodeCity[]; codeCentres: CodeCentre[];
}) {
  const [cities, setCities] = useState<AdminCity[]>(initialCities);
  const [centres, setCentres] = useState<AdminCentre[]>(initialCentres);
  const [activeCitySlug, setActiveCitySlug] = useState<string | null>(null);
  const [editingCity, setEditingCity] = useState<Doc | null>(null);
  const [editingCentre, setEditingCentre] = useState<Doc | null>(null);
  // Tracks "Add City/Centre" (blank slug, editable) vs editing a row that's
  // already visible in a list — whether that row is a saved admin doc or a
  // not-yet-overridden code default, its slug is already known and shown
  // read-only, and the heading says "Edit"/"Override" instead of "New".
  const [isNewCity, setIsNewCity] = useState(false);
  const [isNewCentre, setIsNewCentre] = useState(false);
  const [cityTab, setCityTab] = useState<CityTab>("main");
  const [centreTab, setCentreTab] = useState<CentreTab>("main");
  const { pending, toast, run } = useSave();

  const setInCity = makeSetIn(setEditingCity);
  const getCity = makeGet(editingCity);
  const setInCentre = makeSetIn(setEditingCentre);
  const getCentre = makeGet(editingCentre);

  // Whitelisted to exactly the AdminCity/schema shape — materializeCitySource()
  // also seeds a resolver-only sectionLabels field with no schema home; writing
  // it back would just bloat the document (see file-level comment).
  const startEditCity = (slug: string, src: AdminCity | null) => {
    const full = materializeCitySource(slug, (src ?? null) as CitySource) as Doc;
    setEditingCity({
      _id: src?._id, slug,
      name: full.name, region: full.region, country: full.country, built: full.built,
      heroImage: full.heroImage, hero360Url: full.hero360Url,
      helpline: full.helpline, helplineLabel: full.helplineLabel, whatsapp: full.whatsapp,
      intro: full.intro, faqs: full.faqs, womensHealth: full.womensHealth,
    });
    setIsNewCity(false);
    setCityTab("main");
  };

  const startEditCentre = (citySlug: string, slug: string, src: AdminCentre | null) => {
    const full = materializeCentreSource(citySlug, slug, (src ?? null) as CentreSource) as Doc;
    setEditingCentre({
      _id: src?._id, slug, citySlug,
      name: full.name, fullName: full.fullName, area: full.area, isHeadOffice: full.isHeadOffice, built: full.built,
      image: full.image, hero360Url: full.hero360Url,
      address: full.address, pin: full.pin, phone: full.phone, phoneLabel: full.phoneLabel, hours: full.hours,
      opening: full.opening, geo: full.geo, mapQuery: full.mapQuery, reviewsKey: full.reviewsKey, sameAs: full.sameAs,
      intro: full.intro, nearby: full.nearby, landmarks: full.landmarks, howToReach: full.howToReach, gallery: full.gallery,
      facilities: full.facilities, doctors: full.doctors, treatments: full.treatments, womensHealth: full.womensHealth,
      faqs: full.faqs,
    });
    setIsNewCentre(false);
    setCentreTab("main");
  };

  const addNewCity = () => { setEditingCity({ ...EMPTY_CITY }); setIsNewCity(true); setCityTab("main"); };
  const addNewCentre = (citySlug: string) => { setEditingCentre(emptyCentre(citySlug)); setIsNewCentre(true); setCentreTab("main"); };

  const saveCityForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCity?.slug) return;
    const wasNew = isNewCity;
    run(async () => {
      const res = await saveCityAction(editingCity as AdminCity);
      if (res.ok) {
        setCities((prev) => {
          const i = prev.findIndex((d) => d.slug === editingCity.slug);
          if (i >= 0) { const next = [...prev]; next[i] = { ...editingCity } as AdminCity; return next; }
          return [...prev, { ...editingCity } as AdminCity];
        });
        const slug = editingCity.slug;
        setEditingCity(null);
        if (wasNew) setActiveCitySlug(slug); // land on the new city's Centres view
      }
      return res;
    });
  };

  const removeCity = (d: AdminCity) => {
    if (!d._id) return;
    if (!confirm(`Delete this override for "${d.slug}"? The code default returns (if one exists), or the page 404s if it doesn't. Centres under this city are separate documents and are NOT deleted.`)) return;
    run(async () => {
      const res = await deleteCityAction(d._id!);
      if (res.ok) setCities(cities.filter((x) => x._id !== d._id));
      return res;
    });
  };

  const saveCentreForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCentre?.slug || !editingCentre?.citySlug) return;
    run(async () => {
      const res = await saveCentreAction(editingCentre as AdminCentre);
      if (res.ok) {
        setCentres((prev) => {
          const i = prev.findIndex((d) => d.slug === editingCentre.slug && d.citySlug === editingCentre.citySlug);
          if (i >= 0) { const next = [...prev]; next[i] = { ...editingCentre } as AdminCentre; return next; }
          return [...prev, { ...editingCentre } as AdminCentre];
        });
        setEditingCentre(null);
      }
      return res;
    });
  };

  const removeCentre = (d: AdminCentre) => {
    if (!d._id) return;
    if (!confirm(`Delete this override for "${d.slug}"? The code default returns (if one exists), or the page 404s if it doesn't.`)) return;
    run(async () => {
      const res = await deleteCentreAction(d._id!);
      if (res.ok) setCentres(centres.filter((x) => x._id !== d._id));
      return res;
    });
  };

  // ── City edit form ──
  if (editingCity) {
    return (
      <form onSubmit={saveCityForm}>
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 className="admin-card-title" style={{ margin: 0 }}>
              {isNewCity ? "New City" : editingCity._id ? `Edit City — ${editingCity.slug}` : `Override — ${editingCity.slug}`}
            </h2>
            <button type="button" className="admin-btn-ghost" style={{ padding: "7px 10px" }} onClick={() => setEditingCity(null)}><X size={16} /></button>
          </div>

          {isNewCity ? (
            <div className="admin-field">
              <label className="admin-label">Slug (URL) *</label>
              <p className="admin-hint">e.g. ahmedabad — must be unique. Matching a code slug overrides it.</p>
              <input className="admin-input" required value={editingCity.slug ?? ""} onChange={(e) => setEditingCity((p: Doc) => ({ ...p, slug: e.target.value }))} />
            </div>
          ) : (
            <p className="admin-card-desc" style={{ marginTop: -8, marginBottom: 16 }}>Slug: {editingCity.slug}</p>
          )}

          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            {CITY_TABS.map((t) => (
              <button key={t.id} type="button" onClick={() => setCityTab(t.id)} className={cityTab === t.id ? "admin-btn" : "admin-btn-ghost"} style={{ padding: "7px 14px", fontSize: 13 }}>{t.label}</button>
            ))}
          </div>

          {cityTab === "main" && (
            <>
              <Field label="City name" value={getCity(["name"])} onChange={(v) => setInCity(["name"], v)} />
              <div className="admin-row-grid">
                <Field label="Region / State" value={getCity(["region"])} onChange={(v) => setInCity(["region"], v)} />
                <Field label="Country" value={getCity(["country"])} onChange={(v) => setInCity(["country"], v)} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Hero image</label>
                <ImageUpload value={getCity(["heroImage"])} onChange={(url) => setInCity(["heroImage"], url)} label="hero image" />
              </div>
              <Field label="360° map embed URL" hint="Google Maps embed src — shown instead of the hero image when set." value={getCity(["hero360Url"])} onChange={(v) => setInCity(["hero360Url"], v)} />
              <div className="admin-toggle-row" style={{ marginTop: 6 }}>
                <input type="checkbox" className="admin-toggle" checked={editingCity.built ?? true} onChange={(e) => setInCity(["built"], e.target.checked)} />
                <span style={{ fontSize: 13.5 }}>{(editingCity.built ?? true) ? "Live (published)" : "Hidden — uncheck to hide without deleting"}</span>
              </div>
            </>
          )}

          {cityTab === "contact" && (
            <>
              <Field label="Helpline number" value={getCity(["helpline"])} onChange={(v) => setInCity(["helpline"], v)} />
              <Field label="Helpline display label" value={getCity(["helplineLabel"])} onChange={(v) => setInCity(["helplineLabel"], v)} />
              <Field label="WhatsApp number (digits only)" value={getCity(["whatsapp"])} onChange={(v) => setInCity(["whatsapp"], v)} />
            </>
          )}

          {cityTab === "content" && (
            <>
              <div className="admin-field">
                <label className="admin-label">Intro paragraphs</label>
                <p className="admin-hint">One paragraph per line.</p>
                <textarea className="admin-textarea" style={{ minHeight: 100 }} value={toLinesValue(editingCity.intro)} onChange={(e) => setInCity(["intro"], fromLinesValue(e.target.value))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Women&apos;s health services</label>
                <p className="admin-hint">One per line — must match a Maternity Service slug/short name to link correctly.</p>
                <textarea className="admin-textarea" style={{ minHeight: 90 }} value={toLinesValue(editingCity.womensHealth)} onChange={(e) => setInCity(["womensHealth"], fromLinesValue(e.target.value))} />
              </div>
            </>
          )}

          {cityTab === "faqs" && (
            <FaqsTab faqs={editingCity.faqs ?? []} onChange={(next) => setInCity(["faqs"], next)} />
          )}

          <div className="admin-actions-bar">
            <button type="submit" className="admin-btn" disabled={pending}>{pending ? "Saving…" : "Save City"}</button>
            <button type="button" className="admin-btn-ghost" onClick={() => setEditingCity(null)}>Cancel</button>
          </div>
        </div>
        <Toast toast={toast} />
      </form>
    );
  }

  // ── Centre edit form ──
  if (editingCentre) {
    return (
      <form onSubmit={saveCentreForm}>
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 className="admin-card-title" style={{ margin: 0 }}>
              {isNewCentre ? "New Centre" : editingCentre._id ? `Edit Centre — ${editingCentre.slug}` : `Override — ${editingCentre.slug}`}
            </h2>
            <button type="button" className="admin-btn-ghost" style={{ padding: "7px 10px" }} onClick={() => setEditingCentre(null)}><X size={16} /></button>
          </div>
          <p className="admin-card-desc" style={{ marginTop: -8, marginBottom: 16 }}>
            City: {editingCentre.citySlug}{!isNewCentre && ` · Slug: ${editingCentre.slug}`}
          </p>

          {isNewCentre && (
            <div className="admin-field">
              <label className="admin-label">Slug (URL) *</label>
              <p className="admin-hint">e.g. paldi — must be unique within this city. Matching a code slug overrides it.</p>
              <input className="admin-input" required value={editingCentre.slug ?? ""} onChange={(e) => setEditingCentre((p: Doc) => ({ ...p, slug: e.target.value }))} />
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            {CENTRE_TABS.map((t) => (
              <button key={t.id} type="button" onClick={() => setCentreTab(t.id)} className={centreTab === t.id ? "admin-btn" : "admin-btn-ghost"} style={{ padding: "7px 14px", fontSize: 13 }}>{t.label}</button>
            ))}
          </div>

          {centreTab === "main" && (
            <>
              <div className="admin-row-grid">
                <Field label="Centre name (short)" value={getCentre(["name"])} onChange={(v) => setInCentre(["name"], v)} />
                <Field label="Full name" value={getCentre(["fullName"])} onChange={(v) => setInCentre(["fullName"], v)} />
              </div>
              <Field label="Area / neighbourhood" value={getCentre(["area"])} onChange={(v) => setInCentre(["area"], v)} />
              <div className="admin-field">
                <label className="admin-label">Centre image</label>
                <ImageUpload value={getCentre(["image"])} onChange={(url) => setInCentre(["image"], url)} label="centre image" />
              </div>
              <Field label="360° map embed URL" value={getCentre(["hero360Url"])} onChange={(v) => setInCentre(["hero360Url"], v)} />
              <div className="admin-toggle-row" style={{ marginTop: 6 }}>
                <input type="checkbox" className="admin-toggle" checked={editingCentre.isHeadOffice ?? false} onChange={(e) => setInCentre(["isHeadOffice"], e.target.checked)} />
                <span style={{ fontSize: 13.5 }}>Head office</span>
              </div>
              <div className="admin-toggle-row">
                <input type="checkbox" className="admin-toggle" checked={editingCentre.built ?? true} onChange={(e) => setInCentre(["built"], e.target.checked)} />
                <span style={{ fontSize: 13.5 }}>{(editingCentre.built ?? true) ? "Live (published)" : "Hidden — uncheck to hide without deleting"}</span>
              </div>
            </>
          )}

          {centreTab === "contact" && (
            <>
              <Field label="Full address" value={getCentre(["address"])} onChange={(v) => setInCentre(["address"], v)} textarea />
              <div className="admin-row-grid">
                <Field label="PIN code" value={getCentre(["pin"])} onChange={(v) => setInCentre(["pin"], v)} />
                <Field label="Phone number" value={getCentre(["phone"])} onChange={(v) => setInCentre(["phone"], v)} />
              </div>
              <div className="admin-row-grid">
                <Field label="Phone display label" value={getCentre(["phoneLabel"])} onChange={(v) => setInCentre(["phoneLabel"], v)} />
                <Field label="Working hours (display)" hint="e.g. Mon–Sat 9am–7pm" value={getCentre(["hours"])} onChange={(v) => setInCentre(["hours"], v)} />
              </div>
              <div className="admin-row-grid">
                <Field label="Opens (HH:MM)" value={getCentre(["opening", "opens"])} onChange={(v) => setInCentre(["opening", "opens"], v)} />
                <Field label="Closes (HH:MM)" value={getCentre(["opening", "closes"])} onChange={(v) => setInCentre(["opening", "closes"], v)} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Days open</label>
                <p className="admin-hint">One per line, e.g. Monday.</p>
                <textarea className="admin-textarea" style={{ minHeight: 70 }} value={toLinesValue(editingCentre.opening?.days)} onChange={(e) => setInCentre(["opening", "days"], fromLinesValue(e.target.value))} />
              </div>
              <div className="admin-row-grid">
                <Field label="Latitude" value={String(editingCentre.geo?.lat ?? "")} onChange={(v) => setInCentre(["geo", "lat"], v === "" ? undefined : Number(v))} />
                <Field label="Longitude" value={String(editingCentre.geo?.lng ?? "")} onChange={(v) => setInCentre(["geo", "lng"], v === "" ? undefined : Number(v))} />
              </div>
              <Field label="Google Maps search query" value={getCentre(["mapQuery"])} onChange={(v) => setInCentre(["mapQuery"], v)} />
              <Field label="Google reviews Place ID" value={getCentre(["reviewsKey"])} onChange={(v) => setInCentre(["reviewsKey"], v)} />
              <div className="admin-field">
                <label className="admin-label">Listing URLs (sameAs)</label>
                <p className="admin-hint">One per line — Google Maps, Justdial, etc.</p>
                <textarea className="admin-textarea" style={{ minHeight: 70 }} value={toLinesValue(editingCentre.sameAs)} onChange={(e) => setInCentre(["sameAs"], fromLinesValue(e.target.value))} />
              </div>
            </>
          )}

          {centreTab === "content" && (
            <>
              <Field label="Intro text" value={getCentre(["intro"])} onChange={(v) => setInCentre(["intro"], v)} textarea />
              <div className="admin-field">
                <label className="admin-label">Nearby areas / catchment</label>
                <p className="admin-hint">One per line — local SEO.</p>
                <textarea className="admin-textarea" style={{ minHeight: 70 }} value={toLinesValue(editingCentre.nearby)} onChange={(e) => setInCentre(["nearby"], fromLinesValue(e.target.value))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Landmarks</label>
                <p className="admin-hint">One per line.</p>
                <textarea className="admin-textarea" style={{ minHeight: 70 }} value={toLinesValue(editingCentre.landmarks)} onChange={(e) => setInCentre(["landmarks"], fromLinesValue(e.target.value))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">How to reach</label>
                <p className="admin-hint">One instruction per line.</p>
                <textarea className="admin-textarea" style={{ minHeight: 70 }} value={toLinesValue(editingCentre.howToReach)} onChange={(e) => setInCentre(["howToReach"], fromLinesValue(e.target.value))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Gallery</label>
                <Repeater
                  items={(editingCentre.gallery ?? []) as { src?: string; alt?: string }[]}
                  onChange={(next) => setInCentre(["gallery"], next)}
                  newItem={() => ({ src: "", alt: "" })}
                  addLabel="+ Add photo"
                  rowLabel={(i) => (editingCentre.gallery ?? [])[i]?.alt || `Photo ${i + 1}`}
                  renderItem={(row, i, update) => (
                    <div>
                      <input className="admin-input" placeholder="Image path/URL" value={row.src ?? ""} onChange={(e) => update({ src: e.target.value })} />
                      <input className="admin-input" style={{ marginTop: 6 }} placeholder={`Alt text ${i + 1}`} value={row.alt ?? ""} onChange={(e) => update({ alt: e.target.value })} />
                    </div>
                  )}
                />
              </div>
            </>
          )}

          {centreTab === "facility" && (
            <>
              <div className="admin-field">
                <label className="admin-label">Facilities</label>
                <p className="admin-hint">One per line.</p>
                <textarea className="admin-textarea" style={{ minHeight: 80 }} value={toLinesValue(editingCentre.facilities)} onChange={(e) => setInCentre(["facilities"], fromLinesValue(e.target.value))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Doctor slugs</label>
                <p className="admin-hint">One per line — must match a doctor&apos;s slug exactly.</p>
                <textarea className="admin-textarea" style={{ minHeight: 70 }} value={toLinesValue(editingCentre.doctors)} onChange={(e) => setInCentre(["doctors"], fromLinesValue(e.target.value))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Treatment slugs</label>
                <p className="admin-hint">One per line — must match a treatment&apos;s slug exactly.</p>
                <textarea className="admin-textarea" style={{ minHeight: 70 }} value={toLinesValue(editingCentre.treatments)} onChange={(e) => setInCentre(["treatments"], fromLinesValue(e.target.value))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Women&apos;s health services</label>
                <p className="admin-hint">One per line — must match a Maternity Service slug/short name.</p>
                <textarea className="admin-textarea" style={{ minHeight: 70 }} value={toLinesValue(editingCentre.womensHealth)} onChange={(e) => setInCentre(["womensHealth"], fromLinesValue(e.target.value))} />
              </div>
            </>
          )}

          {centreTab === "faqs" && (
            <FaqsTab faqs={editingCentre.faqs ?? []} onChange={(next) => setInCentre(["faqs"], next)} />
          )}

          <div className="admin-actions-bar">
            <button type="submit" className="admin-btn" disabled={pending}>{pending ? "Saving…" : "Save Centre"}</button>
            <button type="button" className="admin-btn-ghost" onClick={() => setEditingCentre(null)}>Cancel</button>
          </div>
        </div>
        <Toast toast={toast} />
      </form>
    );
  }

  // ── City detail: header + its Centres list ──
  if (activeCitySlug) {
    const savedCity = cities.find((c) => c.slug === activeCitySlug) ?? null;
    const codeCity = codeCities.find((c) => c.slug === activeCitySlug) ?? null;
    const displayName = savedCity?.name || codeCity?.name || activeCitySlug;

    const codeCentresHere = codeCentres.filter((c) => c.citySlug === activeCitySlug);
    const savedCentresHere = centres.filter((c) => c.citySlug === activeCitySlug);
    const centreRows = [
      ...codeCentresHere.map((c) => ({ slug: c.slug, name: c.name, saved: savedCentresHere.find((d) => d.slug === c.slug) ?? null })),
      ...savedCentresHere.filter((d) => !codeCentresHere.some((c) => c.slug === d.slug)).map((d) => ({ slug: d.slug as string, name: d.name || d.fullName || (d.slug as string), saved: d })),
    ];

    return (
      <>
        <button type="button" className="admin-btn-ghost" style={{ marginBottom: 14 }} onClick={() => setActiveCitySlug(null)}>
          <ArrowLeft size={15} /> All Cities
        </button>

        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="admin-stat-icon" style={{ width: 38, height: 38, background: "var(--rose-soft)", color: "var(--rose)" }}><MapPin size={18} /></span>
              <div>
                <h2 className="admin-card-title" style={{ margin: 0 }}>{displayName}</h2>
                <p className="admin-card-desc" style={{ margin: "4px 0 0" }}>{`/locations/${activeCitySlug}`} · {centreRows.length} centre(s)</p>
              </div>
            </div>
            <button type="button" className="admin-btn-ghost" onClick={() => startEditCity(activeCitySlug, savedCity)}><Pencil size={14} /> Edit City Info</button>
          </div>
        </div>

        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 className="admin-card-title" style={{ margin: 0 }}>Centres</h2>
            <button type="button" className="admin-btn" onClick={() => addNewCentre(activeCitySlug)}><Plus size={16} /> Add Centre</button>
          </div>

          {centreRows.length === 0 ? (
            <div className="admin-empty">No centres yet for this city. Add one above.</div>
          ) : (
            <div className="admin-divider-list">
              {centreRows.map(({ slug, name, saved }) => (
                <div key={slug} className="admin-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="admin-stat-icon" style={{ width: 36, height: 36, background: "var(--muted)", color: "var(--muted-foreground)" }}><Building2 size={16} /></span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{name}</div>
                      <div style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginTop: 2 }}>{`/locations/${activeCitySlug}/${slug}`}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button type="button" className="admin-btn-ghost" style={{ padding: "7px 10px" }} onClick={() => startEditCentre(activeCitySlug, slug, saved)}><Pencil size={15} /></button>
                    {saved?._id && <button type="button" className="admin-btn-danger" style={{ padding: "7px 10px" }} onClick={() => removeCentre(saved)}><Trash2 size={15} /></button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Toast toast={toast} />
      </>
    );
  }

  // ── Top-level Cities list ──
  const cityRows = [
    ...codeCities.map((c) => ({ slug: c.slug, name: c.name, saved: cities.find((d) => d.slug === c.slug) ?? null })),
    ...cities.filter((d) => !codeCities.some((c) => c.slug === d.slug)).map((d) => ({ slug: d.slug as string, name: d.name || (d.slug as string), saved: d })),
  ];
  const centreCountFor = (citySlug: string) => {
    const s = new Set<string>();
    codeCentres.filter((c) => c.citySlug === citySlug).forEach((c) => s.add(c.slug));
    centres.filter((c) => c.citySlug === citySlug).forEach((c) => { if (c.slug) s.add(c.slug); });
    return s.size;
  };

  return (
    <>
      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 className="admin-card-title" style={{ margin: 0 }}>Cities</h2>
            <p className="admin-card-desc" style={{ margin: "4px 0 0" }}>Click a city to manage its centres.</p>
          </div>
          <button type="button" className="admin-btn" onClick={addNewCity}><Plus size={16} /> Add City</button>
        </div>

        <div className="admin-divider-list">
          {cityRows.map(({ slug, name, saved }) => (
            <div key={slug} className="admin-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 0 }}>
              <button type="button" onClick={() => setActiveCitySlug(slug)} style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                <span className="admin-stat-icon" style={{ width: 38, height: 38, background: "var(--rose-soft)", color: "var(--rose)" }}><MapPin size={18} /></span>
                <div>
                  <div style={{ fontWeight: 600 }}>{name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginTop: 2 }}>{`/locations/${slug}`} · {centreCountFor(slug)} centre(s)</div>
                </div>
              </button>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" className="admin-btn-ghost" style={{ padding: "7px 10px" }} onClick={() => startEditCity(slug, saved)}><Pencil size={15} /></button>
                {saved?._id && <button type="button" className="admin-btn-danger" style={{ padding: "7px 10px" }} onClick={() => removeCity(saved)}><Trash2 size={15} /></button>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Toast toast={toast} />
    </>
  );
}
