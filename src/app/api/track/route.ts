import { NextResponse } from "next/server";
import { recordPageview } from "@/lib/pageviews";

/** Cookie-less hit counter — fires on every page load regardless of cookie
 *  consent, so total traffic can be reconciled against GA's consent-gated count. */
export async function POST() {
  await recordPageview();
  return NextResponse.json({ ok: true });
}
