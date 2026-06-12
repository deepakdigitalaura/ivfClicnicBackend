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

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

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
  // Hidden <input type=file> reused for every image replace; the path being
  // replaced is held in a ref so the change handler knows where to write.
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingPath = useRef<string | null>(null);

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
  // then point the field at the new file's stable static /media/ path. Payload's
  // /api/media/file/ URL is flaky on first dev hit, so we use /media/<filename>
  // (the same convention as src/lib/about/mediaUrl) which serves reliably.
  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      const path = pendingPath.current;
      e.target.value = ""; // allow re-picking the same file later
      if (!file || !path) return;
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("_payload", JSON.stringify({ alt: file.name.replace(/\.[^.]+$/, "") || "Image" }));
        const res = await fetch("/api/editor-upload", { method: "POST", credentials: "include", body: fd });
        if (!res.ok) throw new Error(`Upload failed (${res.status})`);
        const json = (await res.json()) as { doc?: { filename?: string } };
        const filename = json.doc?.filename;
        if (!filename) throw new Error("Upload succeeded but no file name was returned.");
        update(path, `/media/${filename}`);
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert("Could not upload the image. Please try a different file.\n" + (err as Error).message);
      } finally {
        setUploading(false);
        pendingPath.current = null;
      }
    },
    [update],
  );

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch(apiPath, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(denseClean(draft)),
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      setDirty(false);
      setSaved(true);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert("Could not save changes. Please try again.\n" + (err as Error).message);
    } finally {
      setSaving(false);
    }
  }, [apiPath, method, draft]);

  return (
    <Ctx.Provider value={{ editMode: true, selected, selectedKind, select, update, replaceImage, uploading, dirty, saving, saved, save }}>
      {children(draft)}
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFileChange} />
    </Ctx.Provider>
  );
}
