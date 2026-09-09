import { NextRequest, NextResponse } from "next/server";

/**
 * Vercel Cron hits this weekly (see vercel.json). It doesn't fetch reviews
 * itself — it triggers a redeploy via a Vercel Deploy Hook, which reruns
 * `prebuild` (scripts/sync-reviews.mjs) so the Google Places data gets
 * refreshed as part of a normal build, same as any other deploy.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hookUrl = process.env.REVIEWS_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    return NextResponse.json({ error: "REVIEWS_DEPLOY_HOOK_URL not configured" }, { status: 500 });
  }

  const res = await fetch(hookUrl, { method: "POST" });
  if (!res.ok) {
    return NextResponse.json({ error: `Deploy hook failed: HTTP ${res.status}` }, { status: 502 });
  }

  return NextResponse.json({ triggered: true });
}
