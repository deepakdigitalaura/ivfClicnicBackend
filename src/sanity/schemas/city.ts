import { defineType, defineField } from "sanity";

const faq = defineField({
  name: "faqs",
  title: "FAQs",
  type: "array",
  of: [{
    type: "object",
    fields: [
      defineField({ name: "q", title: "Question", type: "string" }),
      defineField({ name: "a", title: "Answer", type: "text", rows: 3 }),
    ],
  }],
});

const valueArr = (name: string, title: string, itemTitle: string) =>
  defineField({
    name, title, type: "array",
    of: [{ type: "object", fields: [defineField({ name: "value", title: itemTitle, type: "string" })] }],
  });

export default defineType({
  name: "city",
  title: "Location — City",
  type: "document",
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "contact", title: "Contact" },
    { name: "content", title: "Content" },
    { name: "faqs", title: "FAQs" },
  ],
  fields: [
    // ── Identity ──
    defineField({
      name: "slug",
      title: "City Slug",
      description: "URL slug — must match the code slug (e.g. ahmedabad, mumbai). Leave only the fields you want to override.",
      type: "string",
      group: "main",
      validation: (R) => R.required(),
    }),
    defineField({ name: "name", title: "City Name", type: "string", group: "main" }),
    defineField({ name: "region", title: "Region / State", type: "string", group: "main" }),
    defineField({ name: "country", title: "Country", type: "string", group: "main" }),
    defineField({
      name: "built",
      title: "Live (published)",
      description: "Uncheck to hide this city from the site without deleting it.",
      type: "boolean",
      initialValue: true,
      group: "main",
    }),

    // ── Hero ──
    defineField({ name: "heroImage", title: "Hero Image Path", description: "e.g. /assets/Locations/Mumbai.png", type: "string", group: "main" }),
    defineField({ name: "hero360Url", title: "360° Map Embed URL", description: "Google Maps embed src for a 360° panorama.", type: "string", group: "main" }),

    // ── Contact ──
    defineField({ name: "helpline", title: "Helpline Number", type: "string", group: "contact" }),
    defineField({ name: "helplineLabel", title: "Helpline Display Label", type: "string", group: "contact" }),
    defineField({ name: "whatsapp", title: "WhatsApp Number (digits only)", type: "string", group: "contact" }),

    // ── Content ──
    valueArr("intro", "Intro Paragraphs", "Paragraph"),
    faq,
    valueArr("womensHealth", "Women's Health Services", "Service Name"),
  ],
  preview: {
    select: { title: "name", subtitle: "slug" },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare({ title, subtitle }: any) {
      return { title: title || subtitle, subtitle: `/locations/${subtitle}` };
    },
  },
});
