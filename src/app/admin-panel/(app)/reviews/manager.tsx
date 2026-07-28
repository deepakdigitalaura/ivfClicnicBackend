"use client";
import { useMemo, useState } from "react";
import { RefreshCw, Trash2, Star, ChevronDown, ChevronUp, AlertTriangle, Download } from "lucide-react";
import type { AdminGoogleReview } from "@/sanity/lib/admin";
import { refreshReviewsAction, backfillLegacyReviewsAction, deleteReviewAction, type RefreshReviewsResult } from "../../actions";
import { useSave, Toast } from "../_components/save-kit";

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

export function ReviewsManager({ initial, centres }: { initial: AdminGoogleReview[]; centres: CentreInfo[] }) {
  const [items, setItems] = useState<AdminGoogleReview[]>(initial);
  const [lastRun, setLastRun] = useState<RefreshReviewsResult["results"] | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const { pending, toast, run } = useSave();

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
        <button type="button" className="admin-btn-ghost" onClick={backfill} disabled={pending} title="One-time: import reviews already in the old build-time cache">
          <Download size={16} /> Import legacy cache
        </button>
        <button type="button" className="admin-btn" onClick={refresh} disabled={pending}>
          <RefreshCw size={16} className={pending ? "animate-spin" : ""} /> {pending ? "Refreshing…" : "Refresh All Reviews"}
        </button>
      </div>

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
