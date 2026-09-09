import { defineType, defineField, defineArrayMember } from "sanity";

const posterEntry = defineArrayMember({
  type: "object",
  fields: [
    defineField({ name: "src", title: "Poster Image URL", type: "string" }),
    defineField({ name: "alt", title: "Alt Text", type: "string" }),
  ],
  preview: {
    select: { title: "alt", media: "src" },
    prepare({ title }) {
      return { title: title || "Untitled poster" };
    },
  },
});

export default defineType({
  name: "campsConfig",
  title: "Camp Posters",
  type: "document",
  fields: [
    defineField({
      name: "posters",
      title: "Posters",
      description: "Shown on the homepage 'Upcoming Events' section and the /camps page. Leave empty to use the default set.",
      type: "array",
      of: [posterEntry],
    }),
  ],
  preview: { prepare: () => ({ title: "Camp Posters" }) },
});
