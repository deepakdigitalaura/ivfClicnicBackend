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

const valueArr = (name: string, title: string, itemTitle: string) =>
  defineField({
    name, title, type: "array",
    of: [{ type: "object", fields: [defineField({ name: "value", title: itemTitle, type: "string" })] }],
  });

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  // Singleton — only one document of this type should exist
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "story", title: "Our Story" },
    { name: "stats", title: "Stats & Timeline" },
    { name: "trust", title: "Trust Pillars" },
    { name: "network", title: "Network & CTA" },
    { name: "meta", title: "SEO & Meta" },
  ],
  fields: [
    // ── Hero ──
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      group: "hero",
      options: { collapsible: false },
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string" }),
        defineField({ name: "headline", title: "Headline (plain)", type: "string" }),
        defineField({ name: "headlineItalic", title: "Headline (italic/highlighted part)", type: "string" }),
        defineField({ name: "paragraph", title: "Intro Paragraph", type: "text", rows: 4 }),
        defineField({ name: "image", title: "Hero Image Path", type: "string" }),
      ],
    }),

    // ── Our Story ──
    defineField({
      name: "story",
      title: "Our Story",
      type: "object",
      group: "story",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        heading("heading", "Heading"),
        valueArr("paragraphs", "Paragraphs", "Paragraph"),
      ],
    }),

    // ── Stats (At a Glance) ──
    defineField({
      name: "atAGlance",
      title: "At a Glance — Stats",
      type: "array",
      group: "stats",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "value", title: "Number / Value (e.g. 30,000+)", type: "string" }),
          defineField({ name: "label", title: "Label (e.g. Pregnancies)", type: "string" }),
        ],
      }],
    }),

    // ── Legacy Timeline ──
    defineField({
      name: "legacy",
      title: "Legacy Section Header",
      type: "object",
      group: "stats",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        heading("heading", "Heading"),
      ],
    }),
    defineField({
      name: "milestones",
      title: "Timeline Milestones",
      type: "array",
      group: "stats",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "y", title: "Year", type: "string" }),
          defineField({ name: "t", title: "Title", type: "string" }),
          defineField({ name: "d", title: "Description", type: "text", rows: 2 }),
        ],
      }],
    }),

    // ── Patient First ──
    defineField({
      name: "patientFirst",
      title: "Patient First Section",
      type: "object",
      group: "story",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        heading("heading", "Heading"),
        valueArr("paragraphs", "Paragraphs", "Paragraph"),
      ],
    }),
    defineField({
      name: "patientStats",
      title: "Patient First — Stats",
      type: "array",
      group: "story",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "value", title: "Number / Value", type: "string" }),
          defineField({ name: "label", title: "Label", type: "string" }),
        ],
      }],
    }),

    // ── Trust Pillars ──
    defineField({
      name: "trust",
      title: "Trust Section Header",
      type: "object",
      group: "trust",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        heading("heading", "Heading"),
      ],
    }),
    defineField({
      name: "trustPillars",
      title: "Trust Pillars",
      type: "array",
      group: "trust",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon Name (Lucide)", type: "string" }),
          defineField({ name: "t", title: "Title", type: "string" }),
          defineField({ name: "d", title: "Description", type: "text", rows: 2 }),
        ],
      }],
    }),

    // ── Meet Specialists ──
    defineField({
      name: "meetSpecialists",
      title: "Meet Specialists Section Header",
      type: "object",
      group: "network",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        heading("heading", "Heading"),
        defineField({ name: "subtitle", title: "Subtitle", type: "text", rows: 2 }),
      ],
    }),

    // ── Network ──
    defineField({
      name: "network",
      title: "City Network Section",
      type: "object",
      group: "network",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        heading("heading", "Heading"),
        defineField({ name: "subtitle", title: "Subtitle", type: "text", rows: 2 }),
        defineField({
          name: "cities",
          title: "Cities",
          type: "array",
          of: [{
            type: "object",
            fields: [
              defineField({ name: "c", title: "City Name", type: "string" }),
              defineField({ name: "n", title: "Tagline (e.g. 6 centres)", type: "string" }),
            ],
          }],
        }),
      ],
    }),

    // ── Final CTA ──
    defineField({
      name: "finalCta",
      title: "Final CTA",
      type: "object",
      group: "network",
      options: { collapsible: true, collapsed: true },
      fields: [heading("heading", "Heading")],
    }),

    // ── SEO ──
    defineField({
      name: "seo",
      title: "SEO & Meta",
      type: "object",
      group: "meta",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "metaTitle", title: "Page Title", type: "string" }),
        defineField({ name: "metaDescription", title: "Meta Description", type: "text", rows: 3 }),
        defineField({ name: "ogTitle", title: "OG Title", type: "string" }),
        defineField({ name: "ogDescription", title: "OG Description", type: "text", rows: 3 }),
        defineField({ name: "ogImage", title: "OG Image Path", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare() { return { title: "About Page" }; },
  },
});
