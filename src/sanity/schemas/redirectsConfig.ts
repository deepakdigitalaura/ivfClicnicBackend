export default {
  name: "redirectsConfig",
  title: "Redirects",
  type: "document",
  fields: [
    {
      name: "rules",
      title: "Redirect Rules",
      description: "These run on every request. Existing treatment/calculator redirects are also baked in (next.config.mjs).",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "source", title: "From Path", description: "e.g. /old-page", type: "string" },
            { name: "destination", title: "To Path or URL", description: "e.g. /new-page or https://external.com", type: "string" },
            {
              name: "permanent",
              title: "Permanent (301)",
              description: "Use 301 for SEO-safe redirects. Uncheck for temporary 302.",
              type: "boolean",
              initialValue: true,
            },
            { name: "enabled", title: "Enabled", type: "boolean", initialValue: true },
          ],
          preview: {
            select: { source: "source", destination: "destination", enabled: "enabled" },
            prepare: ({ source, destination, enabled }: { source: string; destination: string; enabled: boolean }) => ({
              title: `${source} → ${destination}`,
              subtitle: enabled ? "Active" : "Disabled",
            }),
          },
        },
      ],
    },
  ],
  preview: { prepare: () => ({ title: "Redirects" }) },
};
