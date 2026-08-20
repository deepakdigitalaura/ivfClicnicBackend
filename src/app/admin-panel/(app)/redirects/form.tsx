"use client";
import { useState } from "react";
import { Trash2, Pencil, Plus, X, ArrowRight } from "lucide-react";
import type { RedirectsConfig, RedirectRule } from "@/sanity/lib/fetch";
import { saveRedirectsAction } from "../../actions";
import { useSave, Toast } from "../_components/save-kit";

const EMPTY: RedirectRule = { source: "", destination: "", permanent: true, enabled: true };

export function RedirectsForm({ initial }: { initial: RedirectsConfig | null }) {
  const [rules, setRules] = useState<RedirectRule[]>(initial?.rules ?? []);
  const [editing, setEditing] = useState<{ index: number; rule: RedirectRule } | null>(null);
  const { pending, toast, run } = useSave();

  const persist = (next: RedirectRule[]) => {
    setRules(next);
    run(() => saveRedirectsAction({ rules: next }));
  };

  const toggleEnabled = (i: number) =>
    persist(rules.map((r, j) => (j === i ? { ...r, enabled: !r.enabled } : r)));

  const remove = (i: number) => {
    if (!confirm("Delete this redirect?")) return;
    persist(rules.filter((_, j) => j !== i));
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !editing.rule.source || !editing.rule.destination) return;
    const { index, rule } = editing;
    const next = index === -1 ? [...rules, rule] : rules.map((r, j) => (j === index ? rule : r));
    setRules(next);
    run(async () => {
      const res = await saveRedirectsAction({ rules: next });
      if (res.ok) setEditing(null);
      return res;
    });
  };

  const set = (patch: Partial<RedirectRule>) =>
    setEditing((prev) => (prev ? { ...prev, rule: { ...prev.rule, ...patch } } : prev));

  const activeCount = rules.filter((r) => r.enabled).length;

  return (
    <>
      {!editing && (
        <div className="admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, gap: 16 }}>
            <div>
              <h2 className="admin-card-title">Redirect Rules</h2>
              <p className="admin-card-desc" style={{ margin: 0 }}>
                Each rule sends visitors from one path to another. Use <b>301 (permanent)</b> for SEO-safe moves.
                Destination can be a path (<code>/new</code>) or a full URL.
              </p>
            </div>
            <button type="button" className="admin-btn" style={{ flexShrink: 0 }} onClick={() => setEditing({ index: -1, rule: { ...EMPTY } })}>
              <Plus size={16} /> Add Redirect
            </button>
          </div>

          {rules.length === 0 ? (
            <div className="admin-empty">No redirects yet. Click “Add Redirect” to create your first one.</div>
          ) : (
            <>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>From URL</th>
                      <th>To URL</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rules.map((r, i) => (
                      <tr key={i}>
                        <td><span className="admin-table-mono">{r.source}</span></td>
                        <td>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <ArrowRight size={13} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                            <span className="admin-table-mono">{r.destination}</span>
                          </span>
                        </td>
                        <td><span className="admin-badge admin-badge-off">{r.permanent ? "301" : "302"}</span></td>
                        <td>
                          <input
                            type="checkbox"
                            className="admin-toggle"
                            checked={r.enabled}
                            disabled={pending}
                            onChange={() => toggleEnabled(i)}
                            aria-label={r.enabled ? "Active" : "Disabled"}
                          />
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                            <button type="button" className="admin-btn-ghost" style={{ padding: "6px 9px" }} onClick={() => setEditing({ index: i, rule: r })}>
                              <Pencil size={14} />
                            </button>
                            <button type="button" className="admin-btn-danger" style={{ padding: "6px 9px" }} onClick={() => remove(i)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="admin-table-foot">{rules.length} redirect{rules.length === 1 ? "" : "s"} total · {activeCount} active</p>
            </>
          )}
        </div>
      )}

      {editing && (
        <form onSubmit={save}>
          <div className="admin-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 className="admin-card-title" style={{ margin: 0 }}>{editing.index === -1 ? "New Redirect" : "Edit Redirect"}</h2>
              <button type="button" className="admin-btn-ghost" style={{ padding: "7px 10px" }} onClick={() => setEditing(null)}><X size={16} /></button>
            </div>

            <div className="admin-row-grid">
              <div className="admin-field">
                <label className="admin-label">From</label>
                <input className="admin-input" placeholder="/old-page" required value={editing.rule.source} onChange={(e) => set({ source: e.target.value })} />
              </div>
              <div className="admin-field">
                <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: 6 }}><ArrowRight size={13} /> To</label>
                <input className="admin-input" placeholder="/new-page" required value={editing.rule.destination} onChange={(e) => set({ destination: e.target.value })} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 28, marginTop: 6 }}>
              <div className="admin-toggle-row">
                <input type="checkbox" className="admin-toggle" checked={editing.rule.permanent} onChange={(e) => set({ permanent: e.target.checked })} />
                <span style={{ fontSize: 13.5 }}>{editing.rule.permanent ? "Permanent (301)" : "Temporary (302)"}</span>
              </div>
              <div className="admin-toggle-row">
                <input type="checkbox" className="admin-toggle" checked={editing.rule.enabled} onChange={(e) => set({ enabled: e.target.checked })} />
                <span style={{ fontSize: 13.5 }}>{editing.rule.enabled ? "Active" : "Disabled"}</span>
              </div>
            </div>

            <div className="admin-actions-bar">
              <button type="submit" className="admin-btn" disabled={pending}>{pending ? "Saving…" : "Save Redirect"}</button>
              <button type="button" className="admin-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </form>
      )}
      <Toast toast={toast} />
    </>
  );
}
