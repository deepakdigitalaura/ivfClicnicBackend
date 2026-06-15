"use client";

/* Floating top toolbar for the inline editor — page label, a contextual hint
 * for the current selection, Save / Exit, and an inline error banner.
 * No left nav, no side panel: the whole screen is the live page; this bar is
 * the only chrome. */

import { useState } from "react";
import { useEdit } from "./edit-context";

export function EditorToolbar({
  pageLabel,
  backUrl = "/",
  deleteUrl,
  hubUrl,
}: {
  pageLabel: string;
  /** URL to navigate to when the editor is exited. Defaults to "/" but each
   *  editor component should pass the canonical public URL of the page being
   *  edited so Exit returns the editor to the page they just changed. */
  backUrl?: string;
  /** REST endpoint for DELETE (e.g. "/api/blogs/<id>"). When provided, a
   *  Delete button appears that requires inline confirmation before firing. */
  deleteUrl?: string;
  /** Where to navigate after a successful delete. Defaults to /studio/pages. */
  hubUrl?: string;
}) {
  const ctx = useEdit();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!ctx) return null;

  // INT-06: include "live shortly" note so editors know ISR cache clears after save.
  const saveLabel = ctx.saving
    ? "Saving…"
    : ctx.saved && !ctx.dirty
      ? "Saved ✓ · live shortly"
      : "Save changes";

  async function handleDelete() {
    if (!deleteUrl) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(deleteUrl, { method: "DELETE", credentials: "include" });
      if (res.status === 401) {
        window.location.href =
          `/admin/login?redirect=${encodeURIComponent(location.pathname)}`;
        return;
      }
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      window.location.href = hubUrl ?? "/studio/pages";
    } catch (err) {
      setDeleteError("Delete failed — " + (err as Error).message);
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  // Either a save error or a delete error; save error takes priority.
  const visibleError = ctx.error ?? deleteError;
  const clearVisibleError = () => {
    ctx.clearError();
    setDeleteError(null);
  };

  return (
    <>
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
          {/* BE-03: inline delete with confirmation — only shown when deleteUrl is provided */}
          {deleteUrl && !confirmDelete && (
            <button
              type="button"
              className="bfi-btn bfi-btn--ghost"
              style={{ color: "oklch(0.5 0.18 25)" }}
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </button>
          )}
          {confirmDelete && (
            <>
              <span style={{ fontSize: "0.8rem", color: "oklch(0.5 0.18 25)", whiteSpace: "nowrap" }}>
                Delete this post?
              </span>
              <button
                type="button"
                className="bfi-btn bfi-btn--save"
                style={{ background: "oklch(0.42 0.18 25)" }}
                disabled={deleting}
                onClick={() => void handleDelete()}
              >
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                type="button"
                className="bfi-btn bfi-btn--ghost"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
            </>
          )}
          <button
            type="button"
            className="bfi-btn bfi-btn--save"
            disabled={!ctx.dirty || ctx.saving}
            onClick={() => void ctx.save()}
          >
            {saveLabel}
          </button>
          <a className="bfi-btn bfi-btn--ghost" href={backUrl}>
            Exit
          </a>
        </div>
      </div>
      {visibleError && (
        <div className="bfi-editbar__error" role="alert">
          <span className="bfi-editbar__error-msg">{visibleError}</span>
          <button
            type="button"
            className="bfi-editbar__error-close"
            aria-label="Dismiss error"
            onClick={clearVisibleError}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
