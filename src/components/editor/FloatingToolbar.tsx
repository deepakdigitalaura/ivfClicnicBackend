"use client";

/* =====================================================================
 * Floating contextual toolbar — pops up next to the element you click, like
 * Word's mini-toolbar. Driven by the shared editor context's `selected` path:
 * finds that element, positions itself just above it, and shows actions for its
 * kind: plain text shows Clear / Done; an image shows Replace; a video shows a
 * YouTube URL field. `onMouseDown preventDefault` keeps the caret/selection
 * inside the contentEditable so Clear/Done act on the current field.
 * ===================================================================== */

import { useCallback, useEffect, useState } from "react";
import { useEdit } from "./edit-context";

/** Extract a YouTube video ID from a full URL or a bare 11-char ID. */
function extractYouTubeId(urlOrId: string): string | null {
  const clean = urlOrId.trim();
  if (/^[\w-]{11}$/.test(clean)) return clean;
  const m = clean.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return m?.[1] ?? null;
}

function escapeAttr(v: string): string {
  if (typeof CSS !== "undefined" && CSS.escape) return CSS.escape(v);
  return v.replace(/["\\]/g, "\\$&");
}

export function FloatingToolbar() {
  const ctx = useEdit();
  const selected = ctx?.selected ?? null;
  const kind = ctx?.selectedKind ?? null;
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [isRich, setIsRich] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

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

  // Reset the video URL input whenever the selection changes to a new element.
  useEffect(() => { setVideoUrl(""); }, [selected]);

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

  const submitVideo = () => {
    const id = extractYouTubeId(videoUrl);
    if (id && selected) {
      ctx.update(selected, id);
      ctx.select(null);
    }
  };

  return (
    <div
      className="bfi-floattool"
      style={{ top: pos.top, left: pos.left }}
      onMouseDown={(e) => {
        // Allow <input> elements inside the toolbar to receive focus normally.
        if ((e.target as HTMLElement).tagName === "INPUT") return;
        e.preventDefault();
      }}
    >
      {kind === "image" ? (
        <>
          <button type="button" className="bfi-floattool__btn bfi-floattool__btn--primary" disabled={ctx.uploading} onClick={() => ctx.replaceImage(selected)}>
            {ctx.uploading ? "Uploading…" : "🖼 Replace image"}
          </button>
          <button type="button" className="bfi-floattool__btn bfi-floattool__btn--icon" title="Close" onClick={() => ctx.select(null)}>
            ✕
          </button>
        </>
      ) : kind === "video" ? (
        <>
          <span className="bfi-floattool__label">🎬 YouTube URL</span>
          <input
            type="text"
            className="bfi-floattool__input"
            placeholder="Paste YouTube link or ID"
            autoFocus
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); submitVideo(); }
              if (e.key === "Escape") ctx.select(null);
            }}
          />
          <button type="button" className="bfi-floattool__btn bfi-floattool__btn--primary" onClick={submitVideo}>
            Update
          </button>
          <button type="button" className="bfi-floattool__btn bfi-floattool__btn--icon" title="Close" onClick={() => ctx.select(null)}>
            ✕
          </button>
        </>
      ) : (
        <>
          <span className="bfi-floattool__label">✎ Text</span>
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
