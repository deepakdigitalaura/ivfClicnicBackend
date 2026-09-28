import { defineType, defineField } from "sanity";

// Translatable field: {en,hi,gu}. Untranslated locales fall back to English on the site
// (pickLocale). A legacy plain-string value still renders (Studio just shows it empty).
const loc = (name: string, title: string, kind: "string" | "text" = "string", extra: Record<string, unknown> = {}) =>
  defineField({
    name, title, type: "object",
    fields: (["en", "hi", "gu"] as const).map((l) =>
      defineField({ name: l, title: l === "en" ? "English" : l === "hi" ? "Hindi" : "Gujarati", type: kind, ...(kind === "text" ? { rows: 3 } : {}) }),
    ),
    ...extra,
  });

const heading = (name: string, title: string) =>
  defineField({
    name, title, type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [
      loc("lead", "Heading (plain)", "string"),
      loc("em", "Highlighted word(s)", "string"),
    ],
  });

const stringArr = (name: string, title: string, itemTitle: string, itemName = "value") =>
  defineField({
    name, title, type: "array",
    of: [{ type: "object", fields: [loc(itemName, itemTitle, "string")] }],
  });

const textArr = (name: string, title: string, itemTitle: string) =>
  defineField({
    name, title, type: "array",
    of: [{ type: "object", fields: [loc("text", itemTitle, "text")] }],
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
        loc("eyebrow", "Eyebrow Label (small text above heading)", "string"),
        loc("h1", "Page Heading", "string"),
        loc("h1Em", "Highlighted Word(s)", "string"),
        loc("tagline", "Tagline / Sub-heading", "text"),
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
        defineField({ name: "ogTitle", title: "OG Title", description: "Used when shared on Facebook/WhatsApp. Defaults to Page Title.", type: "string" }),
        defineField({ name: "ogDescription", title: "OG Description", description: "Defaults to Meta Description.", type: "text", rows: 3 }),
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
            loc("title", "Title", "string"),
            loc("body", "Body", "text"),
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
        loc("subtitle", "Sub-heading", "text"),
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
        loc("subtitle", "Sub-heading", "text"),
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
        loc("subtitle", "Sub-heading", "text"),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [{
            type: "object",
            fields: [
              defineField({ name: "icon", title: "Icon Name (Lucide)", type: "string" }),
              defineField({ name: "n", title: "Step Number (e.g. 01)", type: "string" }),
              loc("t", "Title", "string"),
              loc("d", "Description", "text"),
            ],
          }],
        }),
        loc("note", "Closing Note", "text"),
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
        loc("subtitle", "Sub-heading", "text"),
        defineField({
          name: "items",
          title: "Risk Items",
          type: "array",
          of: [{
            type: "object",
            fields: [
              loc("t", "Risk Title", "string"),
              loc("d", "Description", "text"),
              loc("help", "How We Help", "text"),
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
          loc("q", "Question", "string"),
          loc("a", "Answer", "text"),
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
        loc("heading", "Heading", "string"),
        loc("headingEm", "Highlighted Word(s)", "string"),
        loc("subtitle", "Subtitle", "text"),
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
    select: { title: "slug", subtitle: "hero.h1.en" },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare({ title, subtitle }: any) {
      return { title: subtitle || title, subtitle: `/${title}` };
    },
  },
});
