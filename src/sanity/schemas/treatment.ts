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

const stringArr = (name: string, title: string, itemTitle: string, itemName = "value") =>
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
  name: "treatment",
  title: "Treatment Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "meta", title: "SEO & Meta" },
    { name: "content", title: "Content Sections" },
    { name: "faqs", title: "FAQs" },
    { name: "nav", title: "Navigation" },
  ],
  fields: [
    // ── Identity ──
    defineField({
      name: "slug",
      title: "Treatment Slug",
      description: "Exact URL slug — must match the code slug to overlay defaults (e.g. ivf, icsi, cryopreservation). Leave-only fields you want to override; the rest come from code.",
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
        defineField({ name: "eyebrow", title: "Eyebrow Label (small text above heading)", type: "string" }),
        defineField({ name: "h1", title: "Page Heading", type: "string" }),
        defineField({ name: "h1Em", title: "Highlighted Word(s)", description: "Word(s) in the cursive accent style.", type: "string" }),
        defineField({ name: "tagline", title: "Tagline / Sub-heading", type: "text", rows: 3 }),
        stringArr("badges", "Badges", "Badge text"),
        defineField({ name: "image", title: "Hero Image Path", description: "e.g. /assets/treatments/fertility-preservation.png — leave blank to use the code default.", type: "string" }),
        defineField({ name: "heroPhoto", title: "Upload Hero Image", description: "Upload a new image — takes priority over the path field above.", type: "image", options: { hotspot: true } }),
        defineField({ name: "imageAlt", title: "Image Alt Text", type: "string" }),
      ],
    }),

    // ── Meta ──
    defineField({
      name: "meta",
      title: "SEO & Meta",
      type: "object",
      group: "meta",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "title", title: "Page Title", type: "string" }),
        defineField({ name: "description", title: "Meta Description", type: "text", rows: 3 }),
        defineField({ name: "ogImage", title: "OG Image Path", description: "Overrides the hero image for social sharing.", type: "string" }),
      ],
    }),

    // ── What Is ──
    defineField({
      name: "whatIs",
      title: "What Is This Treatment",
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
        stringArr("items", "Benefit Items", "Benefit"),
      ],
    }),

    // ── Who Needs It ──
    defineField({
      name: "whoNeedsIt",
      title: "Who Should Consider This",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      fields: [
        heading("heading", "Heading"),
        defineField({ name: "subtitle", title: "Sub-heading", type: "text", rows: 2 }),
        stringArr("items", "Indications", "Indication"),
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
              defineField({ name: "n", title: "Step Number (e.g. 01)", type: "string" }),
              defineField({ name: "t", title: "Title", type: "string" }),
              defineField({ name: "d", title: "Description", type: "text", rows: 2 }),
            ],
          }],
        }),
        defineField({ name: "note", title: "Closing Note", type: "text", rows: 2 }),
      ],
    }),

    // ── Risks ──
    defineField({
      name: "risks",
      title: "Risks & Considerations",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: true },
      fields: [
        heading("heading", "Heading"),
        defineField({ name: "subtitle", title: "Sub-heading", type: "text", rows: 2 }),
        defineField({
          name: "items",
          title: "Risk Items",
          type: "array",
          of: [{
            type: "object",
            fields: [
              defineField({ name: "t", title: "Risk Title", type: "string" }),
              defineField({ name: "d", title: "Description", type: "text", rows: 2 }),
              defineField({ name: "help", title: "How We Help", type: "text", rows: 2 }),
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

    // ── Navigation ──
    defineField({
      name: "navCategory",
      title: "Nav Category",
      description: "Which column in the header / footer treatment menu this appears in. Leave blank to omit from nav.",
      type: "string",
      group: "nav",
      options: {
        list: [
          { title: "Advanced IVF", value: "advanced-ivf" },
          { title: "Donor Services", value: "donor-services" },
          { title: "Male Infertility", value: "male-infertility" },
          { title: "Female Infertility", value: "female-infertility" },
          { title: "Fertility Preservation", value: "fertility-preservation" },
          { title: "Maternity Services", value: "maternity-services" },
        ],
      },
    }),
    defineField({
      name: "navOrder",
      title: "Nav Order",
      description: "Position within the nav column (lower = earlier). Default 0.",
      type: "number",
      group: "nav",
      initialValue: 0,
    }),
    defineField({
      name: "href",
      title: "Page URL (override)",
      description: "Override the page URL for nav links (e.g. /what-is-ivf). Leave blank to use /treatments/[slug].",
      type: "string",
      group: "nav",
    }),
  ],
  preview: {
    select: { title: "slug", subtitle: "hero.h1" },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare({ title, subtitle }: any) {
      return { title: subtitle || title, subtitle: `/${title}` };
    },
  },
});
