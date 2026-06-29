"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { RobotsConfig } from "@/sanity/lib/fetch";
import { saveRobotsAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";

export function RobotsForm({ initial }: { initial: RobotsConfig | null }) {
  const [block, setBlock] = useState(initial?.discourageSearchEngines ?? false);
  const [paths, setPaths] = useState<string[]>(initial?.disallowPaths ?? []);
  const { pending, toast, run } = useSave();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveRobotsAction({ discourageSearchEngines: block, disallowPaths: paths.filter(Boolean) }));
  };

  return (
    <form onSubmit={submit}>
      <div className="admin-card">
        <h2 className="admin-card-title">Search Engine Visibility</h2>
        <p className="admin-card-desc">When ON, your entire site is hidden from Google and other search engines. Keep OFF for a live site.</p>
        <div className="admin-toggle-row">
          <input type="checkbox" className="admin-toggle" checked={block} onChange={(e) => setBlock(e.target.checked)} />
          <span style={{ fontWeight: 600, fontSize: 14 }}>{block ? "Blocking all search engines" : "Visible to search engines"}</span>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Blocked Paths</h2>
        <p className="admin-card-desc">Paths crawlers should ignore (e.g. <code>/old-page</code>). Admin, API &amp; Studio are always blocked automatically.</p>
        <div className="admin-divider-list">
          {paths.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 8 }}>
              <input
                className="admin-input"
                value={p}
                placeholder="/path-to-block"
                onChange={(e) => setPaths(paths.map((x, j) => (j === i ? e.target.value : x)))}
              />
              <button type="button" className="admin-btn-danger" style={{ padding: "0 12px", borderRadius: 9 }} onClick={() => setPaths(paths.filter((_, j) => j !== i))}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="admin-add-btn" style={{ marginTop: paths.length ? 12 : 0 }} onClick={() => setPaths([...paths, ""])}>
          + Add blocked path
        </button>
      </div>

      <SaveBar pending={pending} />
      <Toast toast={toast} />
    </form>
  );
}
