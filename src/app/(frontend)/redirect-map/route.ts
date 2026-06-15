import { NextResponse } from "next/server";
import { getRedirectMap } from "@/lib/redirects";

/* =====================================================================
 * Redirect map endpoint  ( GET /redirect-map ).
 * ---------------------------------------------------------------------
 * Serves the ENABLED redirects as a flat JSON map for `src/middleware.ts`
 * (edge runtime, no DB access). The heavy DB read is cached inside
 * getRedirectMap (unstable_cache, tag `redirects`); this route is excluded
 * from the middleware matcher so it never triggers a loop. Mounted at
 * /redirect-map — NOT under /api/* — to dodge Payload's /api catch-all.
 * ===================================================================== */
export async function GET() {
  const map = await getRedirectMap();
  return NextResponse.json(map);
}
