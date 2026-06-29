import { defineType, defineField } from "sanity";

/** Reusable two-part heading: plain lead + decorative <em> word(s). */
const heading = (name: string, title: string, group?: string) =>
  defineField({
    name,
    title,
    type: "object",
    group,
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: "lead", title: "Heading (plain)", type: "string" }),
      defineField({ name: "em", title: "Highlighted word(s)", type: "string" }),
    ],
  });

/** A section header block: eyebrow + heading + optional subtitle. */
const sectionHeader = (name: string, title: string, withSubtitle = true) =>
  defineField({
    name,
    title,
    type: "object",
    group: "headings",
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
      defineField({
        name: "heading",
        title: "Heading",
        type: "object",
        fields: [
          defineField({ name: "lead", title: "Heading (plain)", type: "string" }),
          defineField({ name: "em", title: "Highlighted word(s)", type: "string" }),
        ],
      }),
      ...(withSubtitle ? [defineField({ name: "subtitle", title: "Subtitle", type: "text", rows: 2 })] : []),
    ],
  });

export default defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "headings", title: "Section Headlines" },
    { name: "faq", title: "FAQ" },
  ],
  fields: [
    // ── Hero ──
    defineField({
      name: "hero",
      title: "Hero / Top Banner",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "headline", title: "Headline", type: "text", rows: 2 }),
        defineField({ name: "headlineItalic", title: "Highlighted word in headline", type: "string" }),
        defineField({ name: "paragraph", title: "Paragraph", type: "text", rows: 3 }),
        defineField({ name: "badges", title: "Badges", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "floatingBadge", title: "Floating award chip", type: "string" }),
        defineField({ name: "image", title: "Hero image URL", type: "string" }),
      ],
    }),

    // ── Stats strip ──
    defineField({
      name: "stats",
      title: "Stats Strip",
      type: "array",
      group: "hero",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string" }),
            defineField({ name: "label", title: "Label", type: "string" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    }),

    // ── Section headlines (eyebrow + heading + subtitle) ──
    sectionHeader("whyBavishi", "Why Bavishi"),
    sectionHeader("treatments", "Treatments"),
    sectionHeader("successStories", "Success Stories"),
    sectionHeader("videoHub", "Education Videos"),
    sectionHeader("doctors", "Our Doctors"),
    sectionHeader("whyChoose", "Why Choose Pillars"),
    sectionHeader("about", "About the Institute"),
    sectionHeader("locations", "Our Locations"),
    sectionHeader("calculators", "Fertility Calculators"),
    sectionHeader("blogs", "Knowledge & Resources", false),
    sectionHeader("testimonials", "Google Reviews", false),
    sectionHeader("media", "Media Coverage", false),
    sectionHeader("inquiry", "Inquiry Form"),

    // ── Suraksha ──
    defineField({
      name: "suraksha",
      title: "Suraksha Kavach",
      type: "object",
      group: "headings",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "badge", title: "Badge", type: "string" }),
        heading("heading", "Heading"),
        defineField({ name: "paragraph", title: "Paragraph", type: "text", rows: 3 }),
        defineField({ name: "features", title: "Features", type: "array", of: [{ type: "string" }] }),
      ],
    }),

    // ── Final CTA ──
    defineField({
      name: "finalCta",
      title: "Closing Call-to-Action",
      type: "object",
      group: "headings",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        heading("heading", "Heading"),
        defineField({ name: "paragraph", title: "Paragraph", type: "text", rows: 2 }),
      ],
    }),

    // ── FAQ ──
    defineField({
      name: "faq",
      title: "FAQ",
      type: "object",
      group: "faq",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        heading("heading", "Heading"),
        defineField({
          name: "items",
          title: "Questions",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "q", title: "Question", type: "string" }),
                defineField({ name: "a", title: "Answer", type: "text", rows: 3 }),
              ],
              preview: { select: { title: "q" } },
            },
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});
