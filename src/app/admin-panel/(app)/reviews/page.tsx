import { readAdminReviews } from "@/sanity/lib/admin";
import reviewSources from "@/data/reviews.sources.json";
import { ReviewsManager } from "./manager";

export const dynamic = "force-dynamic";

export default async function ReviewsAdminPage() {
  const reviews = await readAdminReviews();
  const sources = (reviewSources as { sources?: Record<string, { placeId?: string }> }).sources ?? {};
  const centres = Object.entries(sources).map(([centreSlug, src]) => ({
    centreSlug,
    configured: Boolean(src?.placeId),
  }));

  return (
    <>
      <div className="admin-page-head">
        <h1 className="admin-h1">Google Reviews</h1>
        <p className="admin-sub">
          Pull the latest 4-5★ reviews from each centre&apos;s Google listing. Every refresh adds only NEW
          reviews on top — nothing already saved is ever removed or overwritten. Live on every location page.
        </p>
      </div>
      <ReviewsManager initial={reviews} centres={centres} />
    </>
  );
}
