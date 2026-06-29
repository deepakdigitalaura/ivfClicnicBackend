"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { ScriptsConfig, ScriptEntry } from "@/sanity/lib/fetch";
import { saveScriptsAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";

function ScriptList({
  title, hint, items, setItems,
}: { title: string; hint: string; items: ScriptEntry[]; setItems: (s: ScriptEntry[]) => void }) {
  const update = (i: number, patch: Partial<ScriptEntry>) =>
    setItems(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  return (
    <div className="admin-card">
      <h2 className="admin-card-title">{title}</h2>
      <p className="admin-card-desc">{hint}</p>
      {items.map((it, i) => (
        <div className="admin-row" key={i}>
          <div className="admin-row-head">
            <div className="admin-toggle-row" style={{ gap: 8 }}>
              <input type="checkbox" className="admin-toggle" checked={it.enabled ?? true} onChange={(e) => update(i, { enabled: e.target.checked })} />
              <span className="admin-badge" style={{ background: (it.enabled ?? true) ? "#dcfce7" : "var(--muted)", color: (it.enabled ?? true) ? "#166534" : "var(--muted-foreground)" }}>
                {(it.enabled ?? true) ? "Enabled" : "Disabled"}
              </span>
            </div>
            <button type="button" className="admin-remove" onClick={() => setItems(items.filter((_, j) => j !== i))}>
              <Trash2 size={14} style={{ verticalAlign: "-2px" }} /> Remove
            </button>
          </div>
          <div className="admin-field" style={{ marginBottom: 10 }}>
            <input className="admin-input" placeholder="Script name (e.g. Google Analytics)" value={it.name ?? ""} onChange={(e) => update(i, { name: e.target.value })} />
          </div>
          <textarea className="admin-textarea" placeholder="<script>…</script> or raw JS/HTML" value={it.code ?? ""} onChange={(e) => update(i, { code: e.target.value })} />
        </div>
      ))}
      <button type="button" className="admin-add-btn" onClick={() => setItems([...items, { name: "", enabled: true, code: "" }])}>
        + Add script
      </button>
    </div>
  );
}

export function ScriptsForm({ initial }: { initial: ScriptsConfig | null }) {
  const [head, setHead] = useState<ScriptEntry[]>(initial?.headScripts ?? []);
  const [body, setBody] = useState<ScriptEntry[]>(initial?.bodyScripts ?? []);
  const { pending, toast, run } = useSave();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveScriptsAction({ headScripts: head, bodyScripts: body }));
  };

  return (
    <form onSubmit={submit}>
      <ScriptList title="Head Scripts" hint="Injected inside <head> — analytics, GTM, site verification meta tags." items={head} setItems={setHead} />
      <ScriptList title="Body Scripts" hint="Injected before </body> — chat widgets, tracking pixels, deferred scripts." items={body} setItems={setBody} />
      <SaveBar pending={pending} />
      <Toast toast={toast} />
    </form>
  );
}
