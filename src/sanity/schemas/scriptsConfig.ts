const scriptEntry = {
  type: "object",
  fields: [
    { name: "name", title: "Script Name (for reference)", type: "string" },
    { name: "enabled", title: "Enabled", type: "boolean", initialValue: true },
    {
      name: "code",
      title: "Script Code",
      description: "Paste the full <script> tag or raw JS/HTML.",
      type: "text",
      rows: 6,
    },
  ],
  preview: {
    select: { title: "name", enabled: "enabled" },
    prepare: ({ title, enabled }: { title: string; enabled: boolean }) => ({
      title: title || "Unnamed Script",
      subtitle: enabled ? "Enabled" : "Disabled",
    }),
  },
};

export default {
  name: "scriptsConfig",
  title: "Script Injection",
  type: "document",
  fields: [
    {
      name: "headScripts",
      title: "Head Scripts (injected in <head>)",
      description: "Analytics, tag managers, verification meta, etc.",
      type: "array",
      of: [scriptEntry],
    },
    {
      name: "bodyScripts",
      title: "Body Scripts (injected before </body>)",
      description: "Chat widgets, tracking pixels, etc.",
      type: "array",
      of: [scriptEntry],
    },
  ],
  preview: { prepare: () => ({ title: "Script Injection" }) },
};
