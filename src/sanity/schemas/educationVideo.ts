import { defineType, defineField } from "sanity";

export default defineType({
  name: "educationVideo",
  title: "Education Video",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
    defineField({
      name: "category",
      title: "Category Tab",
      description: "e.g. IVF, Male Infertility, PCOS",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "youtubeId",
      title: "YouTube Video ID",
      description: "e.g. dQw4w9WgXcQ",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({ name: "description", title: "Short Description", type: "text", rows: 3 }),
    defineField({ name: "published", title: "Visible on site", type: "boolean", initialValue: true }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 0 }),
  ],
  orderings: [
    {
      title: "Category then Order",
      name: "categoryOrder",
      by: [
        { field: "category", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", youtubeId: "youtubeId", published: "published" },
    prepare({ title, subtitle, youtubeId, published }) {
      return {
        title: title || "Untitled",
        subtitle: `${subtitle ?? ""} · ${youtubeId ?? ""} · ${published === false ? "Hidden" : "Visible"}`,
      };
    },
  },
});
