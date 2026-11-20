import { defineType, defineField } from "sanity";

export default defineType({
  name: "infrastructurePage",
  title: "Infrastructure Page",
  type: "document",
  // Singleton — only one document of this type should exist
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "stats", title: "Stats" },
    { name: "facilities", title: "Facilities" },
    { name: "tech", title: "Technology" },
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
      name: "stats",
      title: "Stats Strip",
      type: "array",
      group: "stats",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "value", title: "Number", type: "number" }),
          defineField({ name: "suffix", title: "Suffix (e.g. +, x)", type: "string" }),
          defineField({ name: "label", title: "Label", type: "string" }),
          defineField({ name: "sub", title: "Sub-label", type: "string" }),
        ],
      }],
    }),
    defineField({
      name: "facilities",
      title: "Facility Highlight Cards",
      type: "array",
      group: "facilities",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon Name (Lucide)", type: "string" }),
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        ],
      }],
    }),
    defineField({
      name: "techHighlights",
      title: "Technology Highlights",
      type: "array",
      group: "tech",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon Name (Lucide)", type: "string" }),
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        ],
      }],
    }),
  ],
  preview: {
    prepare() { return { title: "Infrastructure Page" }; },
  },
});
