"use client";

/* =====================================================================
 * Floating contextual toolbar — pops up next to the element you click, like
 * Word's mini-toolbar. Driven by the shared editor context's `selected` path:
 * finds that element, positions itself just above it, and shows actions for its
 * kind. For a `rich` text field it shows real formatting (Bold / Italic /
 * Underline / colour) via execCommand; for plain text just Clear / Done; for an
 * image, Replace. `onMouseDown preventDefault` keeps the caret/selection inside
 * the contentEditable so a button press formats the current selection.
 * ===================================================================== */

import { useCallback, useEffect, useState } from "react";
import { useEdit } from "./edit-context";

function escapeAttr(v: string): string {
  if (typeof CSS !== "undefined" && CSS.escape) return CSS.escape(v);
  return v.replace(/["\\]/g, "\\$&");
}

const SWATCHES: { label: string; color: string }[] = [
  { label: "Brand pink", color: "#d6336c" },
  { label: "Plum", color: "#3d2a4f" },
  { label: "Black", color: "#111111" },
];

export function FloatingToolbar() {
  const ctx = useEdit();
  const selected = ctx?.selected ?? null;
  const kind = ctx?.selectedKind ?? null;
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [isRich, setIsRich] = useState(false);

  const findEl = useCallback(
    () => (selected ? (document.querySelector(`[data-edit-path="${escapeAttr(selected)}"]`) as HTMLElement | null) : null),
    [selected],
  );

  const reposition = useCallback(() => {
    const el = findEl();
    if (!el) {
      setPos(null);
      return;
    }
    setIsRich(el.dataset.bfiRich === "true");
    const r = el.getBoundingClientRect();
    // Hide the toolbar once its element has scrolled out of view, rather than
    // pinning it to the top of the screen (where it used to get "stuck"). The
    // selection is kept, so scrolling the element back brings the toolbar back.
    if (r.bottom < 56 || r.top > window.innerHeight - 8) {
      setPos(null);
      return;
    }
    setPos({ top: Math.max(62, r.top - 46), left: Math.max(8, r.left) });
  }, [findEl]);

  useEffect(() => {
    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [reposition]);

  // Dismiss the toolbar/selection on an outside click or Escape. A click on
  // another editable element (or the toolbar itself) is ignored so it keeps its
  // own selection; clicking empty page chrome clears it. `select` is stable.
  const select = ctx?.select;
  useEffect(() => {
    if (!select) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("[data-edit-path]") || t?.closest?.(".bfi-floattool")) return;
      select(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") select(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [select]);

  if (!ctx || !selected || !pos) return null;

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    const el = findEl();
    if (el) ctx.update(selected, el.innerHTML); // keep draft in sync
  };

  return (
    <div className="bfi-floattool" style={{ top: pos.top, left: pos.left }} onMouseDown={(e) => e.preventDefault()}>
      {kind === "image" ? (
        <>
          <button type="button" className="bfi-floattool__btn bfi-floattool__btn--primary" disabled={ctx.uploading} onClick={() => ctx.replaceImage(selected)}>
            {ctx.uploading ? "Uploading…" : "🖼 Replace image"}
          </button>
          <button type="button" className="bfi-floattool__btn bfi-floattool__btn--icon" title="Close" onClick={() => ctx.select(null)}>
            ✕
          </button>
        </>
      ) : (
        <>
          {isRich && (
            <>
              <button type="button" className="bfi-floattool__btn bfi-floattool__btn--icon" title="Bold" onClick={() => exec("bold")}>
                <b>B</b>
              </button>
              <button type="button" className="bfi-floattool__btn bfi-floattool__btn--icon" title="Italic" onClick={() => exec("italic")}>
                <i>I</i>
              </button>
              <button type="button" className="bfi-floattool__btn bfi-floattool__btn--icon" title="Underline" onClick={() => exec("underline")}>
                <u>U</u>
              </button>
              <span className="bfi-floattool__sep" />
              {SWATCHES.map((s) => (
                <button
                  key={s.color}
                  type="button"
                  className="bfi-floattool__swatch"
                  title={`Colour: ${s.label}`}
                  style={{ background: s.color }}
                  onClick={() => exec("foreColor", s.color)}
                />
              ))}
              <span className="bfi-floattool__sep" />
            </>
          )}
          {!isRich && <span className="bfi-floattool__label">✎ Text</span>}
          <button
            type="button"
            className="bfi-floattool__btn"
            onClick={() => {
              ctx.update(selected, "");
              const el = findEl();
              if (el) {
                el.textContent = "";
                el.focus();
              }
            }}
          >
            Clear
          </button>
          <button
            type="button"
            className="bfi-floattool__btn bfi-floattool__btn--primary"
            onClick={() => {
              const el = findEl();
              if (el) ctx.update(selected, isRich ? el.innerHTML : el.textContent ?? "");
              ctx.select(null);
            }}
          >
            Done
          </button>
        </>
      )}
    </div>
  );
}
