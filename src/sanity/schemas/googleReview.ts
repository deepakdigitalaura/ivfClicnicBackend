import { defineType, defineField } from "sanity";

export default defineType({
  name: "googleReview",
  title: "Google Review",
  type: "document",
  fields: [
    defineField({ name: "centreSlug", title: "Centre key", description: "Matches the centre's reviewsKey/slug or \"brand\".", type: "string", validation: (R) => R.required() }),
    defineField({ name: "author", title: "Author", type: "string", validation: (R) => R.required() }),
    defineField({ name: "rating", title: "Rating (1–5)", type: "number", validation: (R) => R.min(1).max(5) }),
    defineField({ name: "text", title: "Review text", type: "text", rows: 4 }),
    defineField({ name: "publishedAt", title: "Published on Google", type: "datetime" }),
    defineField({ name: "relativeTime", title: "Relative time label", description: "e.g. \"in the last week\" — display only, from Google.", type: "string" }),
    defineField({ name: "profilePhoto", title: "Reviewer photo URL", type: "url" }),
    defineField({ name: "fetchedAt", title: "Fetched into admin at", description: "Set automatically when the Refresh button pulls this review in. New fetches sort above older ones.", type: "datetime" }),
    defineField({ name: "manual", title: "Manually added", description: "True when a staff member typed this in directly (e.g. copied from the Google listing) rather than the automated API fetch. Shown with a neutral \"Patient review\" badge instead of \"Google\", and excluded from AggregateRating/Review schema markup.", type: "boolean", initialValue: false }),
  ],
  orderings: [{ title: "Newest fetched first", name: "fetchedAtDesc", by: [{ field: "fetchedAt", direction: "desc" }] }],
  preview: {
    select: { title: "author", centreSlug: "centreSlug", rating: "rating", text: "text" },
    prepare({ title, centreSlug, rating, text }) {
      return { title: title || "Untitled", subtitle: `${centreSlug ?? ""} · ${rating ?? "?"}★ — ${text ?? ""}` };
    },
  },
});
