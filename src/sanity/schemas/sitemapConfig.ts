import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "sitemapConfig",
  title: "Sitemap",
  type: "document",
  fields: [
    defineField({
      name: "excludePaths",
      title: "Exclude Paths",
      description: "Paths to remove from the sitemap. Use exact match.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "additionalUrls",
      title: "Additional URLs",
      description: "Extra URLs to include that are not auto-discovered.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "url", title: "URL Path", description: "e.g. /special-offer", type: "string" }),
            defineField({ name: "priority", title: "Priority (0.0 – 1.0)", type: "number", initialValue: 0.5 }),
            defineField({
              name: "changefreq",
              title: "Change Frequency",
              type: "string",
              options: { list: ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"] },
              initialValue: "weekly",
            }),
          ],
          preview: {
            select: { url: "url", priority: "priority" },
            prepare({ url, priority }) {
              return { title: url ?? "/", subtitle: `priority: ${priority ?? 0.5}` };
            },
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Sitemap Settings" }) },
});
