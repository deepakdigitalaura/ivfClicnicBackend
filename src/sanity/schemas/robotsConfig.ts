import { defineType, defineField } from "sanity";

export default defineType({
  name: "robotsConfig",
  title: "Robots.txt",
  type: "document",
  fields: [
    defineField({
      name: "rawContent",
      title: "robots.txt content",
      description: "Raw text served verbatim at /robots.txt.",
      type: "text",
      rows: 20,
    }),
  ],
  preview: { prepare: () => ({ title: "Robots.txt Settings" }) },
});
