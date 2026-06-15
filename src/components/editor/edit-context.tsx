"use client";

/* =====================================================================
 * Inline visual editor — shared context.
 * ---------------------------------------------------------------------
 * Powers the full-screen "edit in the preview" experience (/edit/<page>):
 * the page renders normally, but every <Editable> reads this context and turns
 * itself into a click-to-edit, contentEditable element. Edits update a local
 * DRAFT of the page's CMS source by dot-path; Save POSTs the whole draft to the
 * Payload global/collection API (same-origin session) and the existing revalidate
 * hook pushes it live. Styling stays code-owned (we only edit content).
 *
 * `useEdit()` returns null when there is no provider (i.e. the public site), so
 * <Editable> renders bare children there — the public DOM is byte-identical.
 * ===================================================================== */

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type Json = Record<string, unknown>;

type EditCtx = {
  editMode: true;
  selected: string | null;
  /** Type of the selected element, drives the floating toolbar's controls. */
  selectedKind: "text" | "image" | "video" | null;
  select: (path: string | null, kind?: "text" | "image" | "video") => void;
  update: (path: string, value: unknown) => void;
  /** Open a file picker and replace the image at `path` with the upload. */
  replaceImage: (path: string) => void;
  /** True while an image upload is in flight (drives the toolbar label). */
  uploading: boolean;
  dirty: boolean;
  saving: boolean;
  saved: boolean;
  /** Non-null when the last save or upload failed; displayed inline in the toolbar. */
  error: string | null;
  clearError: () => void;
  save: () => Promise<void>;
};

const Ctx = createContext<EditCtx | null>(null);
export const useEdit = (): EditCtx | null => useContext(Ctx);

/** Immutably set `value` at dot-path (numeric keys index arrays), cloning the
 *  spine so React sees a new object and re-renders. */
function setByPath<T extends Json>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const isIndex = (k: string) => /^\d+$/.test(k);
  // Clone a container, creating an ARRAY when the child key is numeric (so an
  // absent "items" branch becomes [] not {}), and DENSELY filling array gaps
  // with {} up to the target index. A sparse array would serialise to JSON with
  // `null` holes, and Payload's beforeValidate (getExistingRowDoc) throws
  // "Cannot read properties of null (reading 'id')" on the first null row → the
  // whole Save 500s. Empty {} rows are valid and round-trip cleanly.
  const ensure = (container: unknown, childKey: string): Json => {
    let c: Json;
    if (Array.isArray(container)) c = [...(container as unknown[])] as unknown as Json;
    else if (container && typeof container === "object") c = { ...(container as Json) };
    else c = (isIndex(childKey) ? [] : {}) as unknown as Json;
    if (isIndex(childKey) && Array.isArray(c)) {
      const idx = Number(childKey);
      for (let i = 0; i <= idx; i++) if ((c as unknown[])[i] == null) (c as unknown[])[i] = {};
    }
    return c;
  };
  const root: Json = ensure(obj, keys[0]);
  let cur: Json = root;
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = ensure(cur[keys[i]], keys[i + 1]);
    cur = cur[keys[i]] as Json;
  }
  cur[keys[keys.length - 1]] = value;
  return root as T;
}

/** Normalise the draft for saving:
 *  - Replace null/undefined array holes with {} (Payload's row-matching crashes
 *    on a null array element → 500).
 *  - Flatten a POPULATED upload/relationship doc back to its `id`. The source is
 *    read at depth ≥1 so e.g. `seo.ogImage` arrives as a full Media object, which
 *    Payload rejects on write (it wants the id) → 400. Detected by upload-doc
 *    shape (has `id` + url/filename/mimeType) so array rows — which also carry an
 *    `id` but none of those — are left untouched. */
function denseClean(v: unknown): unknown {
  if (Array.isArray(v)) return v.map((x) => (x == null ? {} : denseClean(x)));
  if (v && typeof v === "object") {
    const o = v as Json;
    if ("id" in o && ("url" in o || "filename" in o || "mimeType" in o)) return o.id;
    const out: Json = {};
    for (const [k, val] of Object.entries(o)) out[k] = denseClean(val);
    return out;
  }
  return v;
}

export function EditProvider<T extends Json>({
  apiPath,
  method = "POST",
  initial,
  children,
}: {
  /** Where to send the draft, e.g. "/api/globals/homepage" (global) or
   *  "/api/treatments/<id>" (collection item). */
  apiPath: string;
  /** HTTP method: globals update with POST (Payload merges); a collection item
   *  updates with PATCH (`/api/<collection>/<id>`). Defaults to POST. */
  method?: "POST" | "PATCH";
  initial: T;
  children: (draft: T) => ReactNode;
}) {
  const [draft, setDraft] = useState<T>(initial);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedKind, setSelectedKind] = useState<"text" | "image" | "video" | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // BE-05: synchronous ref guard prevents rapid double-save from enqueueing two
  // concurrent fetch calls before the first setState("saving") re-render fires.
  const savingRef = useRef(false);
  // Hidden <input type=file> reused for every image replace; the path being
  // replaced is held in a ref so the change handler knows where to write.
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingPath = useRef<string | null>(null);

  // UI-04: warn the browser before the page unloads when there are unsaved edits.
  // The standard `beforeunload` event works for both link clicks and tab/window close.
  useEffect(() => {
    if (!dirty) return;
    const handle = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handle);
    return () => window.removeEventListener("beforeunload", handle);
  }, [dirty]);

  const clearError = useCallback(() => setError(null), []);

  const select = useCallback((path: string | null, kind: "text" | "image" | "video" = "text") => {
    setSelected(path);
    setSelectedKind(path ? kind : null);
  }, []);

  const update = useCallback((path: string, value: unknown) => {
    setDraft((d) => setByPath(d, path, value));
    setDirty(true);
    setSaved(false);
  }, []);

  const replaceImage = useCallback((path: string) => {
    pendingPath.current = path;
    fileRef.current?.click();
  }, []);

  // Upload the chosen file to Payload's Media collection (same-origin session),
  // then point the field at the new file's URL. We use `doc.url` from the
  // response (INT-02) — correct for any storage backend (local /media, S3, CDN)
  // rather than constructing /media/<filename> which only works locally.
  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      const path = pendingPath.current;
      e.target.value = ""; // allow re-picking the same file later
      if (!file || !path) return;
      setUploading(true);
      setError(null);
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("_payload", JSON.stringify({ alt: file.name.replace(/\.[^.]+$/, "") || "Image" }));
        const res = await fetch("/api/editor-upload", { method: "POST", credentials: "include", body: fd });
        if (!res.ok) throw new Error(`Upload failed (${res.status})`);
        const json = (await res.json()) as { doc?: { url?: string; filename?: string } };
        // Prefer doc.url (authoritative for all storage backends); fall back to
        // the /media/<filename> convention only if url is absent (local dev only).
        const url = json.doc?.url ?? (json.doc?.filename ? `/media/${json.doc.filename}` : null);
        if (!url) throw new Error("Upload succeeded but no URL was returned.");
        update(path, url);
      } catch (err) {
        // UI-03: in-page error instead of blocking alert()
        setError("Could not upload the image — " + (err as Error).message);
      } finally {
        setUploading(false);
        pendingPath.current = null;
      }
    },
    [update],
  );

  const save = useCallback(async () => {
    // BE-05: synchronous guard — skip if a save is already in flight
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setError(null);
    try {
      // INT-01: for collection PATCH calls, always include _status: "published".
      // Payload v3 keeps a draft-initialized doc in "draft" state on PATCH unless
      // explicitly told to publish. The public routes read published-only, so
      // without this flag inline-editor saves would be invisible on the live site
      // until an admin published manually via /admin. Globals (POST) have no
      // _status concept and the field is silently ignored.
      const cleaned = denseClean(draft) as Record<string, unknown>;
      const body = method === "PATCH" ? { ...cleaned, _status: "published" } : cleaned;
      const res = await fetch(apiPath, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      // INT-03: session expired → redirect to admin login (preserving the current
      // editor path so the user returns here after re-authenticating). Do NOT show
      // a generic error — "try again" would keep failing and the user has no path
      // to recovery without a manual nav to /admin.
      if (res.status === 401) {
        window.location.href =
          `/admin/login?redirect=${encodeURIComponent(location.pathname + location.search)}`;
        return;
      }
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      setDirty(false);
      setSaved(true);
    } catch (err) {
      // UI-03: in-page error instead of blocking alert()
      setError("Could not save changes — " + (err as Error).message);
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  }, [apiPath, method, draft]);

  return (
    <Ctx.Provider value={{ editMode: true, selected, selectedKind, select, update, replaceImage, uploading, dirty, saving, saved, error, clearError, save }}>
      {children(draft)}
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFileChange} />
    </Ctx.Provider>
  );
}
