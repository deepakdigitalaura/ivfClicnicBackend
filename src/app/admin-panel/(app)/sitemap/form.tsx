"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { SitemapConfig } from "@/sanity/lib/fetch";
import { saveSitemapAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";

type ExtraUrl = { url: string; priority?: number; changefreq?: string };
const FREQ = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];

export function SitemapForm({ initial }: { initial: SitemapConfig | null }) {
  const [exclude, setExclude] = useState<string[]>(initial?.excludePaths ?? []);
  const [extra, setExtra] = useState<ExtraUrl[]>(initial?.additionalUrls ?? []);
  const { pending, toast, run } = useSave();

  const updateExtra = (i: number, patch: Partial<ExtraUrl>) =>
    setExtra(extra.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveSitemapAction({
      excludePaths: exclude.filter(Boolean),
      additionalUrls: extra.filter((x) => x.url),
    }));
  };

  return (
    <form onSubmit={submit}>
      <div className="admin-card" style={{ background: "var(--rose-soft)", borderColor: "transparent" }}>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--plum)" }}>
          ✓ Your treatments, doctors, services, locations &amp; pages are added to the sitemap automatically. You only need this page for exceptions.
        </p>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Exclude Paths</h2>
        <p className="admin-card-desc">Remove specific pages from the sitemap (exact path match).</p>
        <div className="admin-divider-list">
          {exclude.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 8 }}>
              <input className="admin-input" placeholder="/path-to-exclude" value={p} onChange={(e) => setExclude(exclude.map((x, j) => (j === i ? e.target.value : x)))} />
              <button type="button" className="admin-btn-danger" style={{ padding: "0 12px", borderRadius: 9 }} onClick={() => setExclude(exclude.filter((_, j) => j !== i))}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="admin-add-btn" style={{ marginTop: exclude.length ? 12 : 0 }} onClick={() => setExclude([...exclude, ""])}>
          + Add excluded path
        </button>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Additional URLs</h2>
        <p className="admin-card-desc">Add extra URLs not auto-discovered (e.g. landing pages).</p>
        {extra.map((x, i) => (
          <div className="admin-row" key={i}>
            <div className="admin-row-head">
              <span className="admin-row-title">URL {i + 1}</span>
              <button type="button" className="admin-remove" onClick={() => setExtra(extra.filter((_, j) => j !== i))}>
                <Trash2 size={14} style={{ verticalAlign: "-2px" }} /> Remove
              </button>
            </div>
            <input className="admin-input" placeholder="/special-offer" value={x.url} onChange={(e) => updateExtra(i, { url: e.target.value })} style={{ marginBottom: 10 }} />
            <div className="admin-row-grid">
              <div>
                <label className="admin-label">Priority (0–1)</label>
                <input className="admin-input" type="number" min={0} max={1} step={0.1} value={x.priority ?? 0.5} onChange={(e) => updateExtra(i, { priority: Number(e.target.value) })} />
              </div>
              <div>
                <label className="admin-label">Change frequency</label>
                <select className="admin-input" value={x.changefreq ?? "weekly"} onChange={(e) => updateExtra(i, { changefreq: e.target.value })}>
                  {FREQ.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="admin-add-btn" style={{ marginTop: extra.length ? 12 : 0 }} onClick={() => setExtra([...extra, { url: "", priority: 0.5, changefreq: "weekly" }])}>
          + Add URL
        </button>
      </div>

      <SaveBar pending={pending} />
      <Toast toast={toast} />
    </form>
  );
}
