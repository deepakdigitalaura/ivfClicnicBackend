import { defineType, defineField } from "sanity";

export default defineType({
  name: "safeTreatmentPage",
  title: "Safe Treatment Page",
  type: "document",
  // Singleton — only one document of this type should exist
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "features", title: "Safety Features" },
    { name: "stats", title: "Stats" },
    { name: "protocols", title: "Protocols" },
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
        defineField({ name: "mottoLabel", title: "Motto box — label (e.g. Our Motto)", type: "string" }),
        defineField({ name: "mottoText", title: "Motto box — text", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "features",
      title: "Safety Feature Cards",
      type: "array",
      group: "features",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon Name (Lucide)", type: "string" }),
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
        ],
      }],
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
          defineField({ name: "suffix", title: "Suffix (e.g. +, %, x)", type: "string" }),
          defineField({ name: "label", title: "Label", type: "string" }),
          defineField({ name: "sub", title: "Sub-label", type: "string" }),
        ],
      }],
    }),
    defineField({
      name: "protocols",
      title: "Safety Protocols Checklist",
      type: "array",
      group: "protocols",
      of: [{ type: "object", fields: [defineField({ name: "value", title: "Protocol", type: "string" })] }],
    }),
  ],
  preview: {
    prepare() { return { title: "Safe Treatment Page" }; },
  },
});
