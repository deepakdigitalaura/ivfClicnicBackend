import { defineType, defineField } from "sanity";

export default defineType({
  name: "smartTreatmentPage",
  title: "Smart Treatment Page",
  type: "document",
  // Singleton — only one document of this type should exist
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "pillars", title: "Pillars" },
    { name: "features", title: "Features" },
    { name: "packages", title: "Cost Packages" },
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
      name: "pillars",
      title: "Smart Pillars (hero pill row)",
      type: "array",
      group: "pillars",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon Name (Lucide)", type: "string" }),
          defineField({ name: "label", title: "Label", type: "string" }),
        ],
      }],
    }),
    defineField({
      name: "features",
      title: "Smart Care Feature Cards",
      type: "array",
      group: "features",
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
      name: "packages",
      title: "Cost Package Cards",
      type: "array",
      group: "packages",
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
    prepare() { return { title: "Smart Treatment Page" }; },
  },
});
