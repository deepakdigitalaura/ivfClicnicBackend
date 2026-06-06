/* =====================================================================
 * Review service layer  (reads the local cache — no network at runtime)
 * ---------------------------------------------------------------------
 * SINGLE integration point for review data. Components NEVER hardcode
 * ratings or counts — they call getReviews(key) and render only what the
 * locally-cached, build-time data contains.
 *
 * SOURCE: a third-party review API is synced at BUILD time by
 * `scripts/sync-reviews.mjs` into `src/data/reviews-cache.json`, which is
 * imported here. There is NO browser fetch and NO runtime API call, so this
 * is fully compatible with `output: "export"`. Until the cache holds data the
 * store is empty and NOTHING is rendered — no placeholders, no fabrication.
 * ===================================================================== */

import cache from "@/data/reviews-cache.json";
import sources from "@/data/reviews.sources.json";
import fallbackData from "@/data/reviews.fallback.json";

export type Review = {
  author: string;
  rating: number;            // 1–5
  text: string;
  publishedAtISO: string;    // ISO date → schema datePublished
  relativeTime?: string;     // display only
  profilePhoto?: string;
};

export type AggregateRating = {
  ratingValue: number;       // e.g. 4.8
  reviewCount: number;       // total ratings
};

export type ReviewData = {
  key?: string;              // source key (e.g. centre slug / "brand")
  source?: string;           // provenance metadata ("google-places" | "fallback" | …)
  /** true = real verified data (Google). false/undefined = illustrative fallback. */
  verified?: boolean;
  fetchedAt?: string;        // ISO timestamp of last successful sync
  mapsUrl?: string;          // public listing link ("read reviews" CTA)
  aggregate?: AggregateRating;
  reviews: Review[];
};

/* ---------- Cache-backed store (populated by scripts/sync-reviews.mjs) ----------
 * Keyed by source key. Seeded from the local cache JSON at build time. */
export const REVIEWS_STORE: Record<string, ReviewData> = {
  ...(cache as Record<string, ReviewData>),
};

/* ---------- Illustrative fallback (shown only when no verified data) ----------
 * UI-only: clearly labeled "Patient review", NO Google branding, and NEVER
 * used for schema (see isVerified / reviewNodes). Real Google data always wins. */
const FALLBACK = fallbackData as unknown as Record<string, ReviewData>;

/**
 * Resolution order: real verified Google data → illustrative fallback → null.
 * The returned object's `verified` flag tells components/schema which it is.
 */
export function getReviews(key?: string): ReviewData | null {
  if (!key) return null;
  const real = REVIEWS_STORE[key];
  if (real && ((real.aggregate?.reviewCount ?? 0) > 0 || real.reviews.length > 0)) {
    return { ...real, verified: true };
  }
  const fb = FALLBACK[key];
  if (fb && fb.reviews.length > 0) return { ...fb, verified: false };
  return null;
}

/* ---------- Brand-level reviews (homepage) ----------
 * Sourced from the "brand" key. Configure its locationId in
 * src/data/reviews.sources.json; until a sync populates it, getBrandReviews()
 * returns null and the homepage shows the honest "read reviews" CTA. */
const brandSource = (sources as { sources?: Record<string, { listingUrl?: string }> }).sources?.brand;
export const BRAND_LISTING_URL =
  brandSource?.listingUrl || "https://www.google.com/maps/search/?api=1&query=Bavishi+Fertility+Institute";
export const getBrandReviews = (): ReviewData | null => getReviews("brand");

/** True when there is at least one review/aggregate to display (real OR fallback). */
export function hasReviews(data: ReviewData | null | undefined): data is ReviewData {
  return !!data && ((data.aggregate?.reviewCount ?? 0) > 0 || data.reviews.length > 0);
}

/** True ONLY for real verified Google data — the gate for schema + Google badge. */
export function isVerified(data: ReviewData | null | undefined): data is ReviewData {
  return hasReviews(data) && data.verified === true;
}

/* The third-party fetch lives in scripts/sync-reviews.mjs (build-time only).
 * reviews.ts stays free of any network/runtime code so it is safe to import
 * into client components and into the static export. */

/* ---------- Schema generators (emit nothing without real data) ---------- */

export function aggregateRatingSchema(agg?: AggregateRating): Record<string, unknown> | null {
  if (!agg || !agg.reviewCount) return null;
  return {
    "@type": "AggregateRating",
    ratingValue: agg.ratingValue,
    reviewCount: agg.reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}

export function reviewSchema(r: Review): Record<string, unknown> {
  return {
    "@type": "Review",
    author: { "@type": "Person", name: r.author },
    datePublished: r.publishedAtISO,
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
    reviewBody: r.text,
  };
}

/** Convenience: the review-related nodes to merge into a clinic's schema.
 * Emits ONLY for verified Google data — fallback/dummy reviews never produce
 * structured data (avoids Google's fake-review policy violations). */
export function reviewNodes(data: ReviewData | null | undefined): {
  aggregateRating?: Record<string, unknown>;
  review?: Record<string, unknown>[];
} {
  if (!isVerified(data)) return {};
  const agg = aggregateRatingSchema(data.aggregate);
  return {
    ...(agg ? { aggregateRating: agg } : {}),
    ...(data.reviews.length ? { review: data.reviews.map(reviewSchema) } : {}),
  };
}
