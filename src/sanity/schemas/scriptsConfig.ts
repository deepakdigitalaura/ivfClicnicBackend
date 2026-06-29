import { defineType, defineField, defineArrayMember } from "sanity";

const scriptEntry = defineArrayMember({
  type: "object",
  fields: [
    defineField({ name: "name", title: "Script Name (for reference)", type: "string" }),
    defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
    defineField({
      name: "code",
      title: "Script Code",
      description: "Paste the full <script> tag or raw JS/HTML.",
      type: "text",
      rows: 6,
    }),
  ],
  preview: {
    select: { title: "name", enabled: "enabled" },
    prepare({ title, enabled }) {
      return { title: title || "Unnamed Script", subtitle: enabled ? "Enabled" : "Disabled" };
    },
  },
});

export default defineType({
  name: "scriptsConfig",
  title: "Script Injection",
  type: "document",
  fields: [
    defineField({
      name: "headScripts",
      title: "Head Scripts (injected in <head>)",
      description: "Analytics, tag managers, verification meta, etc.",
      type: "array",
      of: [scriptEntry],
    }),
    defineField({
      name: "bodyScripts",
      title: "Body Scripts (injected before </body>)",
      description: "Chat widgets, tracking pixels, etc.",
      type: "array",
      of: [scriptEntry],
    }),
  ],
  preview: { prepare: () => ({ title: "Script Injection" }) },
});
