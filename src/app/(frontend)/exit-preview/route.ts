import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

/* Draft-preview EXIT endpoint ( /exit-preview?path=/… ): clears Draft Mode. */
export async function GET(req: NextRequest) {
  const path = new URL(req.url).searchParams.get("path") || "/";
  (await draftMode()).disable();
  redirect(path.startsWith("/") ? path : "/");
}
