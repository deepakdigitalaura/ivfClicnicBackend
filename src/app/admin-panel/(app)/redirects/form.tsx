"use client";
import { useState } from "react";
import { Trash2, ArrowRight } from "lucide-react";
import type { RedirectsConfig, RedirectRule } from "@/sanity/lib/fetch";
import { saveRedirectsAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";

const blank: RedirectRule = { source: "", destination: "", permanent: true, enabled: true };

export function RedirectsForm({ initial }: { initial: RedirectsConfig | null }) {
  const [rules, setRules] = useState<RedirectRule[]>(initial?.rules ?? []);
  const { pending, toast, run } = useSave();

  const update = (i: number, patch: Partial<RedirectRule>) =>
    setRules(rules.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveRedirectsAction({ rules: rules.filter((r) => r.source && r.destination) }));
  };

  return (
    <form onSubmit={submit}>
      <div className="admin-card">
        <h2 className="admin-card-title">Redirect Rules</h2>
        <p className="admin-card-desc">
          Each rule sends visitors from one path to another. Use <b>301 (permanent)</b> for SEO-safe moves.
          Destination can be a path (<code>/new</code>) or a full URL.
        </p>

        {rules.length === 0 && <div className="admin-empty">No redirects yet. Add your first below.</div>}

        {rules.map((r, i) => (
          <div className="admin-row" key={i}>
            <div className="admin-row-head">
              <div className="admin-toggle-row" style={{ gap: 8 }}>
                <input type="checkbox" className="admin-toggle" checked={r.enabled} onChange={(e) => update(i, { enabled: e.target.checked })} />
                <span className="admin-row-title">{r.enabled ? "Active" : "Disabled"}</span>
              </div>
              <button type="button" className="admin-remove" onClick={() => setRules(rules.filter((_, j) => j !== i))}>
                <Trash2 size={14} style={{ verticalAlign: "-2px" }} /> Remove
              </button>
            </div>
            <div className="admin-row-grid">
              <div>
                <label className="admin-label">From</label>
                <input className="admin-input" placeholder="/old-page" value={r.source} onChange={(e) => update(i, { source: e.target.value })} />
              </div>
              <div>
                <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: 6 }}><ArrowRight size={13} /> To</label>
                <input className="admin-input" placeholder="/new-page" value={r.destination} onChange={(e) => update(i, { destination: e.target.value })} />
              </div>
            </div>
            <div className="admin-toggle-row" style={{ marginTop: 12 }}>
              <input type="checkbox" className="admin-toggle" checked={r.permanent} onChange={(e) => update(i, { permanent: e.target.checked })} />
              <span style={{ fontSize: 13.5 }}>{r.permanent ? "Permanent (301)" : "Temporary (302)"}</span>
            </div>
          </div>
        ))}

        <button type="button" className="admin-add-btn" style={{ marginTop: rules.length ? 12 : 0 }} onClick={() => setRules([...rules, { ...blank }])}>
          + Add redirect
        </button>
      </div>
      <SaveBar pending={pending} />
      <Toast toast={toast} />
    </form>
  );
}
