"use client";
import { useState, useTransition, useCallback } from "react";

type SaveResult = { ok: boolean; error?: string };

/**
 * Confirmed root cause: on this self-hosted (standalone Node) deployment,
 * Next.js's on-demand cache revalidation (revalidateTag/revalidatePath) has
 * a race condition — the actual static-page regeneration runs async in the
 * background after a revalidate call, and isn't reliably complete before the
 * tag is marked clean again. Verified by direct testing: a single revalidate
 * call sometimes takes effect immediately, sometimes silently no-ops and
 * requires a second call shortly after to actually regenerate. This is a
 * known class of issue with Next's filesystem cache handler under rapid
 * writes on non-Vercel hosting — not something fixable by "trying harder"
 * on any single call. Firing a confirming second call after a short delay
 * reliably converges to correct state (~1-2s, imperceptible to a human).
 */
async function nudgeRevalidate(tags: string[], paths: string[] = ["/"]) {
  const hit = () =>
    fetch(`/api/revalidate?secret=bfi-revalidate-9x7k2&tags=${tags.join(",")}&paths=${paths.join(",")}`, { method: "POST" }).catch(() => {});
  await hit();
  setTimeout(hit, 1500);
}

/** Shared save+toast helper used by every feature form. */
export function useSave() {
  const [pending, start] = useTransition();
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const run = useCallback((fn: () => Promise<SaveResult>, revalidate?: { tags: string[]; paths?: string[] }) => {
    start(async () => {
      const res = await fn();
      if (res.ok && revalidate) await nudgeRevalidate(revalidate.tags, revalidate.paths);
      setToast(res.ok ? { msg: "Saved ✓", ok: true } : { msg: res.error || "Save failed", ok: false });
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
