import { defineType, defineField } from "sanity";

export default defineType({
  name: "historyPage",
  title: "History Page",
  type: "document",
  // Singleton — only one document of this type should exist
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "presentDay", title: "Present Day" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      group: "hero",
      options: { collapsible: false },
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string" }),
        defineField({ name: "headline", title: "Headline (plain)", type: "string" }),
        defineField({ name: "headlineEm", title: "Highlighted word(s)", type: "string" }),
        defineField({ name: "paragraph", title: "Intro Paragraph", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "presentDay",
      title: "Present Day Highlight",
      type: "object",
      group: "presentDay",
      options: { collapsible: false },
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "paragraph", title: "Paragraph", description: "HTML allowed, e.g. <strong>bold</strong>.", type: "text", rows: 4 }),
      ],
    }),
  ],
  preview: {
    prepare() { return { title: "History Page" }; },
  },
});
