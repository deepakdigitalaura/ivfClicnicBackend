"use client";

/* Floating top toolbar for the inline editor — page label, a contextual hint
 * for the current selection, and Save / Exit. No left nav, no side panel: the
 * whole screen is the live page; this bar is the only chrome. */

import { useEdit } from "./edit-context";

export function EditorToolbar({ pageLabel }: { pageLabel: string }) {
  const ctx = useEdit();
  if (!ctx) return null;

  const saveLabel = ctx.saving
    ? "Saving…"
    : ctx.saved && !ctx.dirty
      ? "Saved ✓"
      : "Save changes";

  return (
    <div className="bfi-editbar">
      <div className="bfi-editbar__brand">
        <span className="bfi-editbar__dot" /> Editing: <strong>{pageLabel}</strong>
      </div>
      <div className="bfi-editbar__hint">
        {ctx.selected
          ? ctx.selectedKind === "image"
            ? "Image selected"
            : "Type to edit · Enter to confirm"
          : "Click any text on the page to edit it"}
      </div>
      <div className="bfi-editbar__actions">
        <button
          type="button"
          className="bfi-btn bfi-btn--save"
          disabled={!ctx.dirty || ctx.saving}
          onClick={() => void ctx.save()}
        >
          {saveLabel}
        </button>
        <a className="bfi-btn bfi-btn--ghost" href="/">
          Exit
        </a>
      </div>
    </div>
  );
}
