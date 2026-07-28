import { NextRequest, NextResponse } from "next/server";
import { backfillLegacyReviewCache } from "@/sanity/lib/admin";

/**
 * TEMPORARY one-time migration trigger — same Bearer-token pattern as
 * /api/cron/refresh-reviews. Loads src/data/reviews-cache.json into the new
 * accumulating Sanity review store. Delete this route (and
 * backfillLegacyReviewCache in src/sanity/lib/admin.ts) once run.
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await backfillLegacyReviewCache();
    return NextResponse.json({ ok: true, results });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
