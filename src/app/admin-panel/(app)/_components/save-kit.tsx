"use client";
import { useState, useTransition, useCallback } from "react";

type SaveResult = { ok: boolean; error?: string };

/** Shared save+toast helper used by every feature form. */
export function useSave() {
  const [pending, start] = useTransition();
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const run = useCallback((fn: () => Promise<SaveResult>) => {
    start(async () => {
      const res = await fn();
      setToast(res.ok ? { msg: "Saved ✓ — live within a minute", ok: true } : { msg: res.error || "Save failed", ok: false });
      setTimeout(() => setToast(null), 3500);
    });
  }, []);

  return { pending, toast, run };
}

export function Toast({ toast }: { toast: { msg: string; ok: boolean } | null }) {
  if (!toast) return null;
  return (
    <div className="admin-toast" style={{ background: toast.ok ? "var(--plum)" : "var(--destructive)" }}>
      {toast.msg}
    </div>
  );
}

export function SaveBar({ pending, extra }: { pending: boolean; extra?: React.ReactNode }) {
  return (
    <div className="admin-actions-bar">
      <button type="submit" className="admin-btn" disabled={pending}>
        {pending ? "Saving…" : "Save Changes"}
      </button>
      {extra}
    </div>
  );
}
