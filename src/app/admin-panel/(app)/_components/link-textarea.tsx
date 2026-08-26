"use client";
import { useRef } from "react";

/* =====================================================================
 * <LinkTextarea> — plain textarea + "Insert Link" button for the
 * Doctors/Treatments admin forms (Sanity-backed, plain-text fields).
 * ---------------------------------------------------------------------
 * These fields already render as raw HTML on the live site (see
 * `Editable`'s `rich` mode in src/components/editor/Editable.tsx and the
 * `ed()` helper in treatment-page.tsx), so wrapping the selected text in
 * a styled <a> tag here is enough to make it a real, working link on the
 * public page — no renderer or schema change needed.
 * ===================================================================== */

const LINK_STYLE =
  'style="color:var(--rose);text-decoration:underline;text-underline-offset:2px;font-weight:500"';

export function LinkTextarea({
  value,
  onChange,
  minHeight = 90,
}: {
  value: string;
  onChange: (v: string) => void;
  minHeight?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const insertLink = () => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart, selectionEnd } = el;
    const selected = value.slice(selectionStart, selectionEnd) || "link text";
    const url = window.prompt("Link URL (e.g. /treatments/ivf or https://...)");
    if (!url) return;
    const tag = `<a href="${url}" ${LINK_STYLE}>${selected}</a>`;
    const next = value.slice(0, selectionStart) + tag + value.slice(selectionEnd);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = selectionStart + tag.length;
      el.setSelectionRange(pos, pos);
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
        <button
          type="button"
          onClick={insertLink}
          style={{
            padding: "3px 9px", fontSize: 12, fontWeight: 600,
            border: "1px solid var(--border)", borderRadius: 6, background: "#fff", cursor: "pointer",
          }}
        >
          🔗 Insert Link
        </button>
      </div>
      <textarea
        ref={ref}
        className="admin-textarea"
        style={{ fontFamily: "inherit", minHeight }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="admin-hint">Select some text, then click "Insert Link" to add an internal or external link (e.g. /treatments/ivf).</p>
    </div>
  );
}
