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

const stringArr = (name: string, title: string, itemTitle: string, itemName: string) =>
  defineField({
    name, title, type: "array",
    of: [{ type: "object", fields: [defineField({ name: itemName, title: itemTitle, type: "string" })] }],
  });

const textArr = (name: string, title: string, itemTitle: string) =>
  defineField({
    name, title, type: "array",
    of: [{ type: "object", fields: [defineField({ name: "text", title: itemTitle, type: "text", rows: 2 })] }],
  });

export default defineType({
  name: "service",
  title: "Service Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "meta", title: "SEO & Meta" },
    { name: "content", title: "Content Sections" },
    { name: "faqs", title: "FAQs" },
  ],
  fields: [
    // ── Identity ──
    defineField({
      name: "slug",
      title: "Service Slug",
      description: "Exact URL slug — must match the code slug to overlay defaults (e.g. 3d-4d-sonography, laparoscopy). Leave only the fields you want to override.",
      type: "string",
      group: "hero",
      validation: (R) => R.required(),
    }),

    // ── Hero ──
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      group: "hero",
      options: { collapsible: false },
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string" }),
        defineField({ name: "h1", title: "Page Heading", type: "string" }),
        defineField({ name: "h1Em", title: "Highlighted Word(s)", type: "string" }),
        defineField({ name: "tagline", title: "Tagline / Sub-heading", type: "text", rows: 3 }),
        stringArr("badges", "Badges", "Badge text", "badge"),
        defineField({ name: "image", title: "Hero Image Path", description: "e.g. /assets/services/laparoscopy.jpg", type: "string" }),
        defineField({ name: "heroPhoto", title: "Upload Hero Image", description: "Upload takes priority over the path above.", type: "image", options: { hotspot: true } }),
        defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
      ],
    }),

    // ── Meta ──
    defineField({
      name: "seo",
      title: "SEO & Meta",
      type: "object",
      group: "meta",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "metaTitle", title: "Page Title", type: "string" }),
        defineField({ name: "metaDescription", title: "Meta Description", type: "text", rows: 3 }),
      ],
    }),

    // ── Overview / What Is ──
    defineField({
      name: "overview",
      title: "Overview / What Is This",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      fields: [
        heading("heading", "Heading"),
        textArr("paragraphs", "Paragraphs", "Paragraph"),
        defineField({
          name: "aside",
          title: "Callout Box (optional)",
          type: "object",
          options: { collapsible: true, collapsed: true },
          fields: [
            defineField({ name: "title", type: "string", title: "Title" }),
            defineField({ name: "body", type: "text", title: "Body", rows: 3 }),
          ],
        }),
      ],
    }),

    // ── Benefits ──
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      fields: [
        heading("heading", "Heading"),
        defineField({ name: "subtitle", title: "Sub-heading", type: "text", rows: 2 }),
        stringArr("items", "Benefit Items", "Benefit", "item"),
      ],
    }),

    // ── Who It's For ──
    defineField({
      name: "whoFor",
      title: "Who It's For",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      fields: [
        heading("heading", "Heading"),
        defineField({ name: "subtitle", title: "Sub-heading", type: "text", rows: 2 }),
        stringArr("items", "Indication Items", "Indication", "item"),
      ],
    }),

    // ── Process ──
    defineField({
      name: "process",
      title: "Process / Steps",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      fields: [
        heading("heading", "Heading"),
        defineField({ name: "subtitle", title: "Sub-heading", type: "text", rows: 2 }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [{
            type: "object",
            fields: [
              defineField({ name: "icon", title: "Icon Name (Lucide)", type: "string" }),
              defineField({ name: "t", title: "Title", type: "string" }),
              defineField({ name: "d", title: "Description", type: "text", rows: 2 }),
            ],
          }],
        }),
        defineField({ name: "note", title: "Closing Note", type: "text", rows: 2 }),
      ],
    }),

    // ── Why Us ──
    defineField({
      name: "whyUs",
      title: "Why Bavishi Fertility Institute",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      fields: [
        heading("heading", "Heading"),
        defineField({
          name: "items",
          title: "Points",
          type: "array",
          of: [{
            type: "object",
            fields: [
              defineField({ name: "icon", title: "Icon Name", type: "string" }),
              defineField({ name: "t", title: "Title", type: "string" }),
              defineField({ name: "d", title: "Description", type: "text", rows: 2 }),
            ],
          }],
        }),
      ],
    }),

    // ── FAQs ──
    defineField({
      name: "faqs",
      title: "FAQs",
      group: "faqs",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "q", title: "Question", type: "string" }),
          defineField({ name: "a", title: "Answer", type: "text", rows: 3 }),
        ],
      }],
    }),

    // ── CTA ──
    defineField({
      name: "cta",
      title: "Call to Action",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "headingEm", title: "Highlighted Word(s)", type: "string" }),
        defineField({ name: "subtitle", title: "Subtitle", type: "text", rows: 2 }),
      ],
    }),
  ],
  preview: {
    select: { title: "slug", subtitle: "hero.h1" },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare({ title, subtitle }: any) {
      return { title: subtitle || title, subtitle: `/services/${title}` };
    },
  },
});
