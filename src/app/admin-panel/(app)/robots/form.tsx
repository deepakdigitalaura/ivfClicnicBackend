"use client";
import { useState } from "react";
import type { RobotsConfig } from "@/sanity/lib/fetch";
import { saveRobotsAction } from "../../actions";
import { useSave, Toast, SaveBar } from "../_components/save-kit";
import { ROBOTS_PRESETS, DEFAULT_ROBOTS_TXT } from "@/lib/robots-presets";

const QUICK_REF: [string, string][] = [
  ["User-agent: *", "Applies to all bots"],
  ["Allow: /", "Allow access to all pages"],
  ["Disallow: /", "Block all pages"],
  ["User-agent: Googlebot", "Applies to Googlebot only"],
  ["Disallow: /admin", "Block access to /admin"],
  ["Sitemap: URL", "Point to your sitemap"],
];

export function RobotsForm({ initial, siteUrl }: { initial: RobotsConfig | null; siteUrl: string }) {
  const savedContent = initial?.rawContent ?? DEFAULT_ROBOTS_TXT;
  const [content, setContent] = useState(savedContent);
  const { pending, toast, run } = useSave();
  const liveUrl = `${siteUrl}/robots.txt`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => saveRobotsAction({ rawContent: content }));
  };

  const lineCount = content.length ? content.split("\n").length : 0;

  return (
    <form onSubmit={submit}>
      <div className="admin-card admin-robots-info">
        <p>
          <strong>robots.txt</strong> tells search engine crawlers which pages to index. Changes are saved
          immediately to the server at{" "}
          <a href={liveUrl} target="_blank" rel="noreferrer">
            {liveUrl}
          </a>
          .
        </p>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Presets</h2>
        <div className="admin-preset-row">
          {ROBOTS_PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              className="admin-btn-ghost admin-preset-btn"
              onClick={() => setContent(p.content)}
            >
              {p.label}
            </button>
          ))}
          <button type="button" className="admin-btn-danger admin-preset-btn" onClick={() => setContent("")}>
            Clear
          </button>
        </div>

        <div className="admin-code-box">
          <div className="admin-code-box-head">
            <span>robots.txt — {lineCount} lines</span>
            <a href={liveUrl} target="_blank" rel="noreferrer">
              View live ↗
            </a>
          </div>
          <textarea
            className="admin-textarea admin-code-editor"
            value={content}
            spellCheck={false}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      <SaveBar
        pending={pending}
        extra={
          <button type="button" className="admin-btn-ghost" onClick={() => setContent(savedContent)}>
            Reset
          </button>
        }
      />

      <div className="admin-card">
        <h2 className="admin-card-title">Quick Reference</h2>
        <div className="admin-quickref-grid">
          {QUICK_REF.map(([code, desc]) => (
            <div className="admin-quickref-item" key={code}>
              <code>{code}</code>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <Toast toast={toast} />
    </form>
  );
}
