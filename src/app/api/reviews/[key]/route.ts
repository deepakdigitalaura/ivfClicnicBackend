import { NextRequest, NextResponse } from "next/server";
import { getSanityReviews } from "@/sanity/lib/fetch";

/** Public read of the admin-accumulated reviews for one centre/"brand" key.
 *  Consumed client-side by <GoogleReviews> to upgrade past the build-time
 *  snapshot without a redeploy — see location-sections.tsx. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const data = key ? await getSanityReviews(key) : null;
  return NextResponse.json(data ?? { reviews: [] });
}
