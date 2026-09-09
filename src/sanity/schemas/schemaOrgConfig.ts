import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "schemaOrgConfig",
  title: "Structured Data (Schema.org)",
  type: "document",
  fields: [
    defineField({ name: "organizationName", title: "Organization Name", type: "string", initialValue: "Bavishi Fertility Institute" }),
    defineField({ name: "organizationUrl", title: "Organization URL", type: "url", initialValue: "https://ivfclinic.com" }),
    defineField({ name: "telephone", title: "Phone Number", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      fields: [
        defineField({ name: "streetAddress", title: "Street Address", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "state", title: "State", type: "string" }),
        defineField({ name: "postalCode", title: "Postal Code", type: "string" }),
        defineField({ name: "country", title: "Country", type: "string", initialValue: "IN" }),
      ],
    }),
    defineField({
      name: "socialProfiles",
      title: "Social Profile URLs",
      description: "Facebook, Instagram, YouTube, LinkedIn etc.",
      type: "array",
      of: [{ type: "url" }],
    }),
    defineField({
      name: "customSchemas",
      title: "Custom JSON-LD Schemas",
      description: "Paste raw JSON-LD objects for FAQPage, BreadcrumbList, Article, etc.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Schema Name (for reference)", type: "string" }),
            defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
            defineField({ name: "jsonCode", title: "JSON-LD Code", description: "Raw JSON object (without <script> tag).", type: "text", rows: 8 }),
          ],
          preview: {
            select: { title: "name", enabled: "enabled" },
            prepare({ title, enabled }) {
              return { title: title || "Unnamed Schema", subtitle: enabled ? "Active" : "Disabled" };
            },
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Structured Data" }) },
});
