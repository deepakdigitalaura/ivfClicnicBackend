import type { Field } from "payload";

/* =====================================================================
 * Reusable "replace this image" upload field + resolver helper.
 * ---------------------------------------------------------------------
 * The editorial content (collections + globals) historically stored images
 * as TEXT paths into /public/assets ("ask the website team to add new ones").
 * To let non-technical staff swap any image themselves WITHOUT a risky asset
 * migration, we add an OPTIONAL Media-upload field alongside the existing path:
 * when an editor uploads/picks an image it OVERRIDES the path; when empty the
 * built-in default path is used unchanged (byte-identical, no SEO baseline drift).
 *
 * Pair this with `mediaUrl()` in the section resolver:
 *   image: mediaUrl(src.photo) ?? (src.image || def.image)
 *
 * Upload relations only populate when the query runs at depth >= 1. Globals
 * (findGlobal) already populate at the default depth; collection fetches that
 * use `depth: 0` must be bumped to `depth: 1` for the override to resolve.
 * ===================================================================== */

/** An optional "upload or pick an image to replace the current one" field. */
export const imageUploadField = (
  name: string,
  label = "Replace Image",
  description = "Upload or pick a new image to replace the current one. Leave empty to keep the current image.",
): Field => ({
  name,
  type: "upload",
  relationTo: "media",
  label,
  admin: { description },
});

/** A populated Media upload value (depth >= 1) or its bare id / null. */
export type UploadValue =
  | number
  | string
  | { url?: string | null; filename?: string | null }
  | null
  | undefined;

/**
 * Extract the served URL from a populated upload value; `undefined` when the
 * field is empty or unpopulated (so the caller falls back to the default).
 *
 * Payload sets a media doc's `url` to its access-controlled API route
 * (`/api/media/file/<name>`). In dev that route is compiled on first hit and
 * can briefly 404 (→ broken <img>); it also adds an API round-trip. The SAME
 * file is written to /public/media (the collection's `staticDir`), which Next
 * serves directly as a plain static asset — always 200, correct `image/*`
 * content-type, cacheable. So we serve the public site from `/media/<name>`
 * (Media read access is public, so nothing is bypassed).
 */
export const mediaUrl = (v: UploadValue): string | undefined => {
  if (!v || typeof v !== "object") return undefined;
  if (typeof v.filename === "string" && v.filename) {
    return `/media/${encodeURIComponent(v.filename)}`;
  }
  const url = typeof v.url === "string" && v.url ? v.url : undefined;
  return url ? url.replace(/^\/api\/media\/file\//, "/media/") : undefined;
};
