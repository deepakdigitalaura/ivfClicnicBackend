import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

/* =====================================================================
 * Draft-preview ENABLE endpoint  ( /preview?secret=…&path=/… ).
 * ---------------------------------------------------------------------
 * Secret-guarded: enables Next Draft Mode and redirects to the front-end
 * path. The Payload admin "Preview" button points here (see Pages.admin.preview).
 * Mounted at /preview (NOT /api/*) to avoid colliding with Payload's /api
 * catch-all route. Public rendering stays static — only pages that opt into
 * draftMode() render drafts (wired per-collection when migrated).
 * ===================================================================== */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") || "/";

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return new Response("Invalid preview secret", { status: 401 });
  }
  if (!path.startsWith("/")) {
    return new Response("Invalid path", { status: 400 });
  }

  (await draftMode()).enable();
  redirect(path);
}
