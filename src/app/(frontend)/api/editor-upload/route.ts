import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { payloadClient } from "@/lib/payload";

/* =====================================================================
 * Server-side media upload proxy for the inline visual editor.
 * ---------------------------------------------------------------------
 * The editor's client-side onFileChange handler cannot POST multipart
 * directly to /api/media (Payload's REST endpoint uses cookie-based auth
 * which some browser/fetch combinations don't satisfy for multipart). This
 * route handles the upload server-side:
 *
 *   1. Reads the session from the Payload cookie (via payload.auth()).
 *   2. Verifies the caller has admin or editor role.
 *   3. Parses the file from the FormData.
 *   4. Creates the Media doc via the Payload local API (no CSRF friction).
 *   5. Returns { doc: { filename } } to match the shape edit-context.tsx expects.
 * ===================================================================== */

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const payload = await payloadClient();

    // Verify the user is logged in and has the right role.
    const reqHeaders = await headers();
    const { user } = await payload.auth({ headers: reqHeaders });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const roles = (user as { roles?: string[] }).roles ?? [];
    if (!roles.includes("admin") && !roles.includes("editor")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse the multipart body.
    const formData = await req.formData();
    const file = formData.get("file");
    const payloadField = formData.get("_payload");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const alt =
      payloadField && typeof payloadField === "string"
        ? ((JSON.parse(payloadField) as { alt?: string }).alt ?? "")
        : file.name.replace(/\.[^.]+$/, "") || "Image";

    // Convert the Web File → Node Buffer for the Payload local API.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const doc = await payload.create({
      collection: "media",
      data: { alt },
      file: {
        name: file.name,
        data: buffer,
        mimetype: file.type,
        size: file.size,
      },
      overrideAccess: true, // access already verified above
    });

    return NextResponse.json({ doc });
  } catch (err) {
    console.error("[editor-upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
