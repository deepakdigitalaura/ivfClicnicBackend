import { defineType, defineField } from "sanity";

export default defineType({
  name: "successBenchmarksPage",
  title: "Success Benchmarks Page",
  type: "document",
  // Singleton — only one document of this type should exist
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "stats", title: "Stats" },
    { name: "pillars", title: "Success Pillars" },
    { name: "badges", title: "Closing Badges" },
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
        defineField({ name: "quote", title: "Quote", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Hero Stats Strip",
      type: "array",
      group: "stats",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "value", title: "Number", type: "number" }),
          defineField({ name: "suffix", title: "Suffix (e.g. +)", type: "string" }),
          defineField({ name: "label", title: "Label", type: "string" }),
        ],
      }],
    }),
    defineField({
      name: "pillars",
      title: "Success Pillar Cards",
      type: "array",
      group: "pillars",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon Name (Lucide)", type: "string" }),
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          defineField({
            name: "highlights", title: "Highlight tags", type: "array",
            of: [{ type: "object", fields: [defineField({ name: "value", title: "Tag", type: "string" })] }],
          }),
        ],
      }],
    }),
    defineField({
      name: "closingBadges",
      title: "Closing Badges (Simple / Safe / Smart / Successful)",
      type: "array",
      group: "badges",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon Name (Lucide)", type: "string" }),
          defineField({ name: "text", title: "Text", type: "string" }),
        ],
      }],
    }),
  ],
  preview: {
    prepare() { return { title: "Success Benchmarks Page" }; },
  },
});
