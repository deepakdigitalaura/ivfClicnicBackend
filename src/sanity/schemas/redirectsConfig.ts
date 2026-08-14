import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "redirectsConfig",
  title: "Redirects",
  type: "document",
  fields: [
    defineField({
      name: "rules",
      title: "Redirect Rules",
      description: "These run on every request via middleware.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "source", title: "From Path", description: "e.g. /old-page", type: "string" }),
            defineField({ name: "destination", title: "To Path or URL", description: "e.g. /new-page or https://external.com", type: "string" }),
            defineField({
              name: "permanent",
              title: "Permanent (301)",
              description: "Use 301 for SEO-safe redirects. Uncheck for temporary 302.",
              type: "boolean",
              initialValue: true,
            }),
            defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
          ],
          preview: {
            select: { source: "source", destination: "destination", enabled: "enabled" },
            prepare({ source, destination, enabled }) {
              return {
                title: `${source ?? "?"} → ${destination ?? "?"}`,
                subtitle: enabled ? "Active" : "Disabled",
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Redirects" }) },
});
