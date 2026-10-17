import { defineType, defineField } from "sanity";

/* Serves the 4 CategoryHubPage-based landing pages (advanced-fertility-
 * techniques, male-infertility, female-infertility, maternity-services) —
 * one doc per slug, distinguished by the `slug` field (see src/lib/
 * category-hub.ts HUB_SLUGS). Not a true singleton: 4 docs of this type
 * are expected to exist, one per page. */
export default defineType({
  name: "categoryHubPage",
  title: "Category Hub Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "cards", title: "Cards" },
    { name: "overview", title: "Overview" },
    { name: "signs", title: "Signs" },
    { name: "why", title: "Why Choose Us" },
    { name: "faqs", title: "FAQs" },
  ],
  fields: [
    defineField({
      name: "slug",
      title: "Page",
      type: "string",
      options: {
        list: [
          { title: "Advanced Fertility Techniques", value: "advanced-fertility-techniques" },
          { title: "Male Infertility", value: "male-infertility" },
          { title: "Female Infertility", value: "female-infertility" },
          { title: "Maternity Services", value: "maternity-services" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "eyebrow", title: "Eyebrow", type: "string", group: "hero",
    }),
    defineField({ name: "title", title: "Title (plain)", type: "string", group: "hero" }),
    defineField({ name: "titleAccent", title: "Title — highlighted word(s)", type: "string", group: "hero" }),
    defineField({ name: "subtitle", title: "Subtitle", type: "text", rows: 3, group: "hero" }),
    defineField({ name: "breadcrumbLabel", title: "Breadcrumb Label", type: "string", group: "hero" }),
    defineField({ name: "heroImage", title: "Hero Image Path", type: "string", group: "hero" }),
    defineField({ name: "heroImageAlt", title: "Hero Image Alt Text", type: "string", group: "hero" }),
    defineField({ name: "ctaHeading", title: "Closing CTA — Heading", type: "string", group: "hero" }),
    defineField({ name: "ctaSubtitle", title: "Closing CTA — Subtitle", type: "text", rows: 2, group: "hero" }),

    defineField({
      name: "cardsSectionTitle", title: "Cards Section — Title", type: "string", group: "cards",
    }),
    defineField({ name: "cardsSectionSubtitle", title: "Cards Section — Subtitle", type: "text", rows: 2, group: "cards" }),
    defineField({
      name: "cards", title: "Cards", type: "array", group: "cards",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon Name (Lucide)", type: "string" }),
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "desc", title: "Description", type: "text", rows: 2 }),
          defineField({ name: "href", title: "Link (path)", type: "string" }),
        ],
      }],
    }),
    defineField({
      name: "stats", title: "Stats Strip", type: "array", group: "cards",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "value", title: "Value (e.g. 30,000+)", type: "string" }),
          defineField({ name: "label", title: "Label", type: "string" }),
        ],
      }],
    }),

    defineField({ name: "overviewTitle", title: "Overview — Title (plain)", type: "string", group: "overview" }),
    defineField({ name: "overviewTitleAccent", title: "Overview — highlighted word(s)", type: "string", group: "overview" }),
    defineField({
      name: "overviewParagraphs", title: "Overview Paragraphs", type: "array", group: "overview",
      of: [{ type: "object", fields: [defineField({ name: "value", title: "Paragraph", type: "text", rows: 3 })] }],
    }),
    defineField({
      name: "overviewBullets", title: "Overview — Key Facts (bullets)", type: "array", group: "overview",
      of: [{ type: "object", fields: [defineField({ name: "value", title: "Bullet", type: "string" })] }],
    }),

    defineField({ name: "signsTitle", title: "Signs — Title (plain)", type: "string", group: "signs" }),
    defineField({ name: "signsTitleAccent", title: "Signs — highlighted word(s)", type: "string", group: "signs" }),
    defineField({ name: "signsSubtitle", title: "Signs — Subtitle", type: "text", rows: 2, group: "signs" }),
    defineField({
      name: "signs", title: "Signs List", type: "array", group: "signs",
      of: [{ type: "object", fields: [defineField({ name: "value", title: "Sign", type: "string" })] }],
    }),

    defineField({ name: "whyTitle", title: "Why Choose Us — Title (plain)", type: "string", group: "why" }),
    defineField({ name: "whyTitleAccent", title: "Why Choose Us — highlighted word(s)", type: "string", group: "why" }),
    defineField({
      name: "whyPoints", title: "Why Choose Us — Points", type: "array", group: "why",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "icon", title: "Icon Name (Lucide)", type: "string" }),
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "desc", title: "Description", type: "text", rows: 2 }),
        ],
      }],
    }),

    defineField({
      name: "faqs", title: "FAQs", type: "array", group: "faqs",
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
    select: { title: "slug" },
    prepare({ title }) { return { title: title ? `Category Hub — ${title}` : "Category Hub Page" }; },
  },
});
