import { defineType, defineField } from "sanity";

export default defineType({
  name: "simpleTreatmentPage",
  title: "Simple Treatment Page",
  type: "document",
  // Singleton — only one document of this type should exist
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "philosophy", title: "Philosophy" },
    { name: "steps", title: "5-Step Journey" },
    { name: "quote", title: "Quote Banner" },
    { name: "pillars", title: "Pillars" },
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
      name: "philosophy",
      title: "Philosophy Cards",
      type: "array",
      group: "philosophy",
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
      name: "steps",
      title: "5-Step Journey",
      type: "array",
      group: "steps",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "step", title: "Step Number (e.g. 01)", type: "string" }),
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
      name: "quote",
      title: "Quote Banner",
      type: "object",
      group: "quote",
      options: { collapsible: false },
      fields: [
        defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }),
        defineField({ name: "paragraph", title: "Paragraph below quote", type: "text", rows: 3 }),
      ],
    }),
    defineField({
      name: "pillars",
      title: "Three Pillars",
      type: "array",
      group: "pillars",
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
    prepare() { return { title: "Simple Treatment Page" }; },
  },
});
