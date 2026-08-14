"use client";
import { useMemo, useState } from "react";
import { RefreshCw, Trash2, Star, ChevronDown, ChevronUp, AlertTriangle, Download, Plus, X, Shuffle } from "lucide-react";
import type { AdminGoogleReview, ManualReviewInput } from "@/sanity/lib/admin";
import {
  refreshReviewsAction, backfillLegacyReviewsAction, poolBrandReviewsAction, createManualReviewAction, createManualReviewsAction,
  deleteReviewAction, type RefreshReviewsResult,
} from "../../actions";
import { useSave, Toast } from "../_components/save-kit";

/** Parses blocks separated by a line of 3+ dashes, each with Author/Rating/Text
 *  labels — Text captures everything after it (including blank lines) so
 *  multi-paragraph reviews survive intact. Lenient: skips any block missing
 *  an author or text rather than erroring the whole paste. */
function parseBulkReviews(raw: string, centreSlug: string): ManualReviewInput[] {
  if (!centreSlug || !raw.trim()) return [];
  const blocks = raw.split(/\n\s*-{3,}\s*\n?/);
  const out: ManualReviewInput[] = [];
  for (const block of blocks) {
    const authorMatch = /(?:^|\n)\s*author\s*:\s*(.+)/i.exec(block);
    const ratingMatch = /(?:^|\n)\s*rating\s*:\s*(\d)/i.exec(block);
    const textMatch = /(?:^|\n)\s*text\s*:\s*([\s\S]*)/i.exec(block);
    const author = authorMatch?.[1]?.trim();
    const rating = ratingMatch ? Number(ratingMatch[1]) : 5;
    const text = textMatch?.[1]?.trim();
    if (author && text) out.push({ centreSlug, author, rating, text });
  }
  return out;
}

const BULK_PLACEHOLDER = `Author: Jane Doe
Rating: 5
Text: Wonderful experience, the doctors explained everything clearly.
---
Author: John Smith
Rating: 4
Text: Good care, would recommend.
---`;

type CentreInfo = { centreSlug: string; configured: boolean };

function Stars({ n }: { n: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} fill={i < n ? "var(--gold)" : "none"} color={i < n ? "var(--gold)" : "var(--border)"} />
      ))}
    </span>
  );
}

const EMPTY_FORM: ManualReviewInput = { centreSlug: "", author: "", rating: 5, text: "" };

export function ReviewsManager({ initial, centres }: { initial: AdminGoogleReview[]; centres: CentreInfo[] }) {
  const [items, setItems] = useState<AdminGoogleReview[]>(initial);
  const [lastRun, setLastRun] = useState<RefreshReviewsResult["results"] | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [form, setForm] = useState<ManualReviewInput>(EMPTY_FORM);
  const [bulkText, setBulkText] = useState("");
  const { pending, toast, run } = useSave();

  const bulkParsed = useMemo(() => parseBulkReviews(bulkText, form.centreSlug), [bulkText, form.centreSlug]);

  const byCentre = useMemo(() => {
    const map = new Map<string, AdminGoogleReview[]>();
    for (const r of items) {
      const list = map.get(r.centreSlug) ?? [];
      list.push(r);
      map.set(r.centreSlug, list);
    }
    return map;
  }, [items]);

  const configuredSlugs = centres.filter((c) => c.configured).map((c) => c.centreSlug);
  const unconfigured = centres.filter((c) => !c.configured);
  // Every centre that has ever yielded a stored review, plus every configured
  // source that hasn't yet (so a freshly-added Place ID still shows up empty).
  const allSlugs = Array.from(new Set([...configuredSlugs, ...byCentre.keys()])).sort();

  const refresh = () => {
    run(async () => {
      const res = await refreshReviewsAction();
      if (res.ok && res.results) {
        setLastRun(res.results);
        if (res.reviews) setItems(res.reviews);
      }
      return { ok: res.ok, error: res.error };
    });
  };

  const backfill = () => {
    if (!confirm("Import the reviews already sitting in the old build-time cache into this store? Safe to run more than once.")) return;
    run(async () => {
      const res = await backfillLegacyReviewsAction();
      if (res.ok && res.results) {
        setLastRun(res.results);
        if (res.reviews) setItems(res.reviews);
      }
      return { ok: res.ok, error: res.error };
    });
  };

  const [pooled, setPooled] = useState<number | null>(null);

  const poolBrand = () => {
    run(async () => {
      const res = await poolBrandReviewsAction(15);
      if (res.ok) {
        setPooled(res.added ?? 0);
        if (res.reviews) setItems(res.reviews);
      }
      return { ok: res.ok, error: res.error };
    });
  };

  const addReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.centreSlug || !form.author.trim() || !form.text.trim()) return;
    run(async () => {
      const res = await createManualReviewAction(form);
      if (res.ok && res.reviews) {
        setItems(res.reviews);
        // Keep the centre selected and clear the rest so the next entry for
        // the same centre is quick to add.
        setForm({ ...EMPTY_FORM, centreSlug: form.centreSlug });
      }
      return { ok: res.ok, error: res.error };
    });
  };

  const addBulk = () => {
    if (bulkParsed.length === 0) return;
    run(async () => {
      const res = await createManualReviewsAction(bulkParsed);
      if (res.ok && res.reviews) {
        setItems(res.reviews);
        setBulkText("");
      }
      return { ok: res.ok, error: res.error };
    });
  };

  const remove = (r: AdminGoogleReview) => {
    if (!confirm(`Delete this review from ${r.author}?`)) return;
    setItems((prev) => prev.filter((x) => x._id !== r._id));
    run(() => deleteReviewAction(r._id));
  };

  const toggle = (slug: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  };

  return (
    <>
      <div style={{ display: "flex", gap: 14, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div className="admin-stat" style={{ padding: "12px 18px" }}>
          <div><div className="admin-stat-num" style={{ fontSize: 22 }}>{items.length}</div><div className="admin-stat-label">Stored reviews</div></div>
        </div>
        <div className="admin-stat" style={{ padding: "12px 18px" }}>
          <div><div className="admin-stat-num" style={{ fontSize: 22 }}>{configuredSlugs.length}</div><div className="admin-stat-label">Centres configured</div></div>
        </div>
        {unconfigured.length > 0 && (
          <div className="admin-stat" style={{ padding: "12px 18px" }}>
            <div><div className="admin-stat-num" style={{ fontSize: 22, color: "var(--destructive)" }}>{unconfigured.length}</div><div className="admin-stat-label">Missing Place ID</div></div>
          </div>
        )}
        <div style={{ flex: 1 }} />
        <button type="button" className="admin-btn-ghost" onClick={() => setAdding((v) => !v)} disabled={pending}>
          <Plus size={16} /> Add Review
        </button>
        <button type="button" className="admin-btn-ghost" onClick={backfill} disabled={pending} title="One-time: import reviews already in the old build-time cache">
          <Download size={16} /> Import legacy cache
        </button>
        <button type="button" className="admin-btn-ghost" onClick={poolBrand} disabled={pending} title="Copy 15 random reviews from every other centre into &quot;brand&quot; (shown on the homepage). Safe to re-run — only newly-picked reviews get added, existing ones are never touched.">
          <Shuffle size={16} /> Pool 15 into Brand
        </button>
        <button type="button" className="admin-btn" onClick={refresh} disabled={pending}>
          <RefreshCw size={16} className={pending ? "animate-spin" : ""} /> {pending ? "Refreshing…" : "Refresh All Reviews"}
        </button>
      </div>

      {adding && (
        <div className="admin-card" style={{ padding: 18, marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 className="admin-card-title" style={{ margin: 0 }}>Add a review</h2>
            <button type="button" className="admin-btn-ghost" style={{ padding: "7px 10px" }} onClick={() => setAdding(false)}><X size={16} /></button>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginTop: -6, marginBottom: 14 }}>
            For reviews you&apos;ve copied from the centre&apos;s actual Google listing. Shown with a neutral
            &ldquo;Patient review&rdquo; badge (not &ldquo;Google&rdquo;) since it&apos;s hand-entered, not API-verified.
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <button type="button" onClick={() => setBulkMode(false)} className={!bulkMode ? "admin-btn" : "admin-btn-ghost"} style={{ padding: "7px 16px" }}>One at a time</button>
            <button type="button" onClick={() => setBulkMode(true)} className={bulkMode ? "admin-btn" : "admin-btn-ghost"} style={{ padding: "7px 16px" }}>Paste multiple</button>
          </div>

          <div className="admin-field">
            <label className="admin-label">Centre *</label>
            <select className="admin-input" required value={form.centreSlug} onChange={(e) => setForm((f) => ({ ...f, centreSlug: e.target.value }))}>
              <option value="" disabled>Select a centre…</option>
              {allSlugs.map((slug) => <option key={slug} value={slug}>{slug}</option>)}
            </select>
          </div>

          {bulkMode ? (
            <>
              <div className="admin-field">
                <label className="admin-label">Reviews</label>
                <p className="admin-hint">
                  One block per review, separated by a line of dashes (<code>---</code>). <code>Text:</code> can span multiple lines/paragraphs.
                </p>
                <textarea
                  className="admin-textarea"
                  style={{ fontFamily: "monospace", fontSize: 12.5, minHeight: 220 }}
                  placeholder={BULK_PLACEHOLDER}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                />
              </div>
              <div className="admin-actions-bar" style={{ alignItems: "center", gap: 12 }}>
                <button type="button" className="admin-btn" disabled={pending || bulkParsed.length === 0} onClick={addBulk}>
                  {pending ? "Adding…" : `Add ${bulkParsed.length || ""} Review${bulkParsed.length === 1 ? "" : "s"}`}
                </button>
                {bulkText.trim() && (
                  <span style={{ fontSize: 12.5, color: bulkParsed.length ? "var(--muted-foreground)" : "var(--destructive)" }}>
                    {form.centreSlug ? `${bulkParsed.length} parsed` : "Select a centre first"}
                  </span>
                )}
              </div>
            </>
          ) : (
            <form onSubmit={addReview}>
              <div className="admin-row-grid">
                <div className="admin-field">
                  <label className="admin-label">Author *</label>
                  <input className="admin-input" required value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Rating</label>
                  <select className="admin-input" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}>
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">Review text *</label>
                <textarea className="admin-textarea" style={{ fontFamily: "inherit", minHeight: 80 }} required value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} />
              </div>
              <div className="admin-actions-bar">
                <button type="submit" className="admin-btn" disabled={pending}>{pending ? "Adding…" : "Add Review"}</button>
              </div>
            </form>
          )}
        </div>
      )}

      {pooled !== null && (
        <div className="admin-card" style={{ padding: 16, marginBottom: 18 }}>
          <div style={{ fontSize: 13 }}>
            {pooled > 0 ? `Added ${pooled} new review${pooled === 1 ? "" : "s"} to "brand".` : `Nothing new to add — try again for a different random pick, or add more reviews to other centres first.`}
          </div>
        </div>
      )}

      {lastRun && (
        <div className="admin-card" style={{ padding: 16, marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Last refresh</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {lastRun.map((r) => (
              <span
                key={r.centreSlug}
                className="admin-badge"
                style={{
                  background: r.error ? "#fee2e2" : r.added > 0 ? "#dcfce7" : "#f1f5f9",
                  color: r.error ? "#991b1b" : r.added > 0 ? "#166534" : "var(--muted-foreground)",
                }}
                title={r.error ?? `${r.fetched} fetched from Google, ${r.added} new`}
              >
                {r.centreSlug}: {r.error ? "error" : r.skipped === "no-placeid" ? "no Place ID" : `+${r.added}`}
              </span>
            ))}
          </div>
        </div>
      )}

      {allSlugs.length === 0 ? (
        <div className="admin-empty">No review sources configured yet — add Place IDs in src/data/reviews.sources.json.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {allSlugs.map((slug) => {
            const list = (byCentre.get(slug) ?? []).slice().sort((a, b) => (b.fetchedAt || "").localeCompare(a.fetchedAt || ""));
            const isOpen = expanded.has(slug);
            return (
              <div key={slug} className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
                <button
                  type="button"
                  onClick={() => toggle(slug)}
                  style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "14px 18px", boxSizing: "border-box" }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <strong style={{ fontSize: 14 }}>{slug}</strong>
                    <span className="admin-badge">{list.length} stored</span>
                  </span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isOpen && (
                  <div style={{ borderTop: "1px solid var(--border)", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                    {list.length === 0 ? (
                      <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>No reviews stored yet — run a refresh.</div>
                    ) : (
                      list.map((r) => (
                        <div key={r._id} style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                              <strong style={{ fontSize: 13.5 }}>{r.author}</strong>
                              <Stars n={r.rating} />
                              {r.manual && <span className="admin-badge" style={{ fontSize: 10.5 }}>Manual</span>}
                              {r.relativeTime && <span style={{ fontSize: 11.5, color: "var(--muted-foreground)" }}>{r.relativeTime}</span>}
                            </div>
                            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--foreground)" }}>&ldquo;{r.text}&rdquo;</p>
                          </div>
                          <button type="button" className="admin-btn-danger" style={{ padding: "6px 10px", height: "fit-content", flexShrink: 0 }} onClick={() => remove(r)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {unconfigured.length > 0 && (
        <div className="admin-card" style={{ marginTop: 18, padding: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <AlertTriangle size={16} style={{ color: "var(--destructive)", flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 13, lineHeight: 1.5 }}>
            <strong>{unconfigured.map((c) => c.centreSlug).join(", ")}</strong> {unconfigured.length === 1 ? "has" : "have"} no Google Place ID
            configured, so {unconfigured.length === 1 ? "it" : "they"} show the &ldquo;Read reviews on Google&rdquo; link instead of review cards.
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </>
  );
}
