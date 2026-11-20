import { defineType, defineField } from "sanity";

const heading = (name: string, title: string) =>
  defineField({
    name, title, type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: "lead", title: "Heading (plain)", type: "string" }),
      defineField({ name: "em", title: "Highlighted word(s)", type: "string" }),
    ],
  });

export default defineType({
  name: "surakshaKavach",
  title: "Suraksha Kavach Page",
  type: "document",
  // Singleton — only one document of this type should exist
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "story", title: "What Is It" },
    { name: "benefits", title: "Benefits" },
    { name: "stats", title: "Stats" },
    { name: "steps", title: "How It Works" },
    { name: "faqs", title: "FAQs" },
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
        defineField({ name: "paragraph", title: "Intro Paragraph", type: "text", rows: 4 }),
        defineField({ name: "badgeNumber", title: "Badge — Number line (e.g. 30,000+ Happy Families)", type: "string" }),
        defineField({ name: "badgeLabel", title: "Badge — Sub label", type: "string" }),
        defineField({ name: "image", title: "Hero Image Path", type: "string" }),
      ],
    }),

    defineField({
      name: "story",
      title: "What Is Suraksha Kavach",
      type: "object",
      group: "story",
      options: { collapsible: false },
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        heading("heading", "Heading"),
        defineField({
          name: "paragraphs", title: "Paragraphs", type: "array",
          of: [{ type: "object", fields: [defineField({ name: "value", title: "Paragraph", type: "string" })] }],
        }),
      ],
    }),

    defineField({
      name: "benefits",
      title: "Benefit Cards",
      type: "array",
      group: "benefits",
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
      name: "stats",
      title: "Stats Bar",
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
      name: "steps",
      title: "How It Works — Steps",
      type: "array",
      group: "steps",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "step", title: "Step Number (e.g. 01)", type: "string" }),
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
        ],
      }],
    }),

    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "faqs",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "q", title: "Question", type: "string" }),
          defineField({ name: "a", title: "Answer", type: "text", rows: 3 }),
        ],
      }],
    }),
  ],
  preview: {
    prepare() { return { title: "Suraksha Kavach Page" }; },
  },
});
