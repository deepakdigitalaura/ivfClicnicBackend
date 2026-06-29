export default {
  name: "schemaOrgConfig",
  title: "Structured Data (Schema.org)",
  type: "document",
  fields: [
    {
      name: "organizationName",
      title: "Organization Name",
      type: "string",
      initialValue: "Bavishi Fertility Institute",
    },
    {
      name: "organizationUrl",
      title: "Organization URL",
      type: "url",
      initialValue: "https://ivfclinic.com",
    },
    { name: "telephone", title: "Phone Number", type: "string" },
    { name: "email", title: "Email", type: "string" },
    {
      name: "address",
      title: "Address",
      type: "object",
      fields: [
        { name: "streetAddress", title: "Street Address", type: "string" },
        { name: "city", title: "City", type: "string" },
        { name: "state", title: "State", type: "string" },
        { name: "postalCode", title: "Postal Code", type: "string" },
        { name: "country", title: "Country", type: "string", initialValue: "IN" },
      ],
    },
    {
      name: "socialProfiles",
      title: "Social Profile URLs",
      description: "Facebook, Instagram, YouTube, LinkedIn etc.",
      type: "array",
      of: [{ type: "url" }],
    },
    {
      name: "customSchemas",
      title: "Custom JSON-LD Schemas",
      description: "Paste raw JSON-LD objects here for FAQPage, BreadcrumbList, Article, etc.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Schema Name (for reference)", type: "string" },
            { name: "enabled", title: "Enabled", type: "boolean", initialValue: true },
            {
              name: "jsonCode",
              title: "JSON-LD Code",
              description: "Paste the raw JSON object (without the <script> tag).",
              type: "text",
              rows: 8,
            },
          ],
          preview: {
            select: { title: "name", enabled: "enabled" },
            prepare: ({ title, enabled }: { title: string; enabled: boolean }) => ({
              title: title || "Unnamed Schema",
              subtitle: enabled ? "Active" : "Disabled",
            }),
          },
        },
      ],
    },
  ],
  preview: { prepare: () => ({ title: "Structured Data" }) },
};
