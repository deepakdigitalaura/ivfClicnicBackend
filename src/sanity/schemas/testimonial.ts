import { defineType, defineField } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "author", title: "Patient / Author Name", type: "string", validation: (R) => R.required() }),
    defineField({ name: "role", title: "Sub-line", description: "e.g. IVF patient, Ahmedabad", type: "string" }),
    defineField({ name: "quote", title: "Quote", type: "text", rows: 4, validation: (R) => R.required() }),
    defineField({
      name: "rating",
      title: "Rating (1–5)",
      type: "number",
      initialValue: 5,
      validation: (R) => R.min(1).max(5),
    }),
    defineField({
      name: "youtubeId",
      title: "YouTube Video ID (optional)",
      description: "Fill this to make it a VIDEO testimonial (shown on /testimonial-videos). Leave blank for a text testimonial (shown on the homepage). e.g. dQw4w9WgXcQ",
      type: "string",
    }),
    defineField({ name: "published", title: "Visible on site", type: "boolean", initialValue: true }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "author", subtitle: "quote", youtubeId: "youtubeId", published: "published" },
    prepare({ title, subtitle, youtubeId, published }) {
      const tags = [youtubeId ? "🎬 Video" : "💬 Text", published === false ? "Hidden" : "Visible"];
      return { title: title || "Untitled", subtitle: `${tags.join(" · ")} — ${subtitle ?? ""}` };
    },
  },
});
