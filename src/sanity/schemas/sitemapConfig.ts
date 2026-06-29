export default {
  name: "sitemapConfig",
  title: "Sitemap",
  type: "document",
  fields: [
    {
      name: "excludePaths",
      title: "Exclude Paths",
      description: "Paths to remove from the sitemap (e.g. /draft-page). Use exact match.",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "additionalUrls",
      title: "Additional URLs",
      description: "Add extra URLs that are not auto-discovered (e.g. external landing pages).",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "url", title: "URL Path", description: "e.g. /special-offer", type: "string" },
            {
              name: "priority",
              title: "Priority (0.0 – 1.0)",
              type: "number",
              initialValue: 0.5,
              validation: (R: { min: (n: number) => unknown }) => R.min(0),
            },
            {
              name: "changefreq",
              title: "Change Frequency",
              type: "string",
              options: { list: ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"] },
              initialValue: "weekly",
            },
          ],
          preview: {
            select: { url: "url", priority: "priority" },
            prepare: ({ url, priority }: { url: string; priority: number }) => ({ title: url, subtitle: `priority: ${priority}` }),
          },
        },
      ],
    },
  ],
  preview: { prepare: () => ({ title: "Sitemap Settings" }) },
};
