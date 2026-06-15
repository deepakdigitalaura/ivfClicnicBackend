/* =====================================================================
 * Testimonials resolver (Phase B.4) — maps the `testimonials` collection to
 * the plain, serialisable `Review` shape the homepage Testimonials section
 * renders. These are staff-curated entries that SUPPLEMENT the live Google
 * reviews: they are labelled "Patient review" (never "Google review") and are
 * DISPLAY-ONLY — they never feed review schema / JSON-LD (so we never emit
 * unverified reviews into structured data). Pure module (no payload import) so
 * the mapped result is safe to pass into the client <HomePage>.
 * ===================================================================== */
import type { Review } from "@/lib/reviews";

/** Loose source shape (decoupled from generated payload-types, same convention
 *  as the other resolvers). */
export type TestimonialSource = {
  author?: string | null;
  rating?: number | null;
  quote?: string | null;
  role?: string | null;
  published?: boolean | null;
  order?: number | null;
  createdAt?: string | null;
};

/**
 * Map published testimonial docs → the display `Review` shape. Drops any entry
 * missing a name or quote, defaults the rating to 5, and carries the optional
 * sub-line into `relativeTime` (the card shows it after "Patient review · …").
 * `publishedAtISO` is set from createdAt for completeness but is NOT used for
 * schema — these never become structured data.
 */
export function resolveTestimonials(docs: TestimonialSource[] | null | undefined): Review[] {
  return (docs ?? [])
    .filter((d) => d.published !== false && !!d.author && !!d.quote)
    .map((d) => ({
      author: d.author as string,
      rating: typeof d.rating === "number" ? d.rating : 5,
      text: d.quote as string,
      publishedAtISO: d.createdAt ?? "",
      relativeTime: d.role || undefined,
    }));
}
