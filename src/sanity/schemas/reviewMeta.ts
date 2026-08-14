import { defineType, defineField } from "sanity";

export default defineType({
  name: "reviewMeta",
  title: "Review Aggregate (internal)",
  type: "document",
  description: "One per centre — the live Google rating/count snapshot from the last refresh. Not directly editable; managed by the admin Reviews Refresh button.",
  fields: [
    defineField({ name: "centreSlug", title: "Centre key", type: "string", validation: (R) => R.required() }),
    defineField({ name: "ratingValue", title: "Rating value", type: "number" }),
    defineField({ name: "reviewCount", title: "Total review count", type: "number" }),
    defineField({ name: "mapsUrl", title: "Google Maps listing URL", type: "url" }),
    defineField({ name: "lastRefreshedAt", title: "Last refreshed at", type: "datetime" }),
  ],
  preview: {
    select: { title: "centreSlug", ratingValue: "ratingValue", reviewCount: "reviewCount" },
    prepare({ title, ratingValue, reviewCount }) {
      return { title: title || "Untitled", subtitle: `${ratingValue ?? "?"}★ · ${reviewCount ?? 0} reviews` };
    },
  },
});
