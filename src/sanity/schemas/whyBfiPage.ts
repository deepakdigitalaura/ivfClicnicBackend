import { defineType, defineField } from "sanity";

export default defineType({
  name: "whyBfiPage",
  title: "Why BFI Page",
  type: "document",
  // Singleton — only one document of this type should exist
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "stats", title: "Stats" },
    { name: "reasons", title: "Reasons" },
    { name: "journey", title: "Journey Timeline" },
    { name: "ethics", title: "Ethics" },
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
        defineField({ name: "quote", title: "Quote", type: "text", rows: 2 }),
        defineField({ name: "quoteFooter", title: "Quote attribution", type: "string" }),
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
          defineField({ name: "suffix", title: "Suffix (e.g. +)", type: "string" }),
          defineField({ name: "label", title: "Label", type: "string" }),
          defineField({ name: "sub", title: "Sub-label", type: "string" }),
        ],
      }],
    }),
    defineField({
      name: "reasons",
      title: "12 Reasons Grid",
      type: "array",
      group: "reasons",
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
      name: "journey",
      title: "Journey Timeline (Eras)",
      type: "array",
      group: "journey",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "era", title: "Era Range (e.g. 1990 – 2001)", type: "string" }),
          defineField({ name: "eraLabel", title: "Era Label (e.g. Foundations)", type: "string" }),
          defineField({
            name: "entries", title: "Year Entries", type: "array",
            of: [{
              type: "object",
              fields: [
                defineField({ name: "year", title: "Year", type: "string" }),
                defineField({ name: "icon", title: "Icon Name (Lucide)", type: "string" }),
                defineField({
                  name: "items", title: "Bullet Items", type: "array",
                  of: [{ type: "object", fields: [defineField({ name: "value", title: "Item", type: "string" })] }],
                }),
              ],
            }],
          }),
        ],
      }],
    }),
    defineField({
      name: "ethics",
      title: "Ethics & Transparency Cards",
      type: "array",
      group: "ethics",
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
    prepare() { return { title: "Why BFI Page" }; },
  },
});
