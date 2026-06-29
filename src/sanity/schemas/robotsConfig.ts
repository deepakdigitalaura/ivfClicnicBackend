export default {
  name: "robotsConfig",
  title: "Robots.txt",
  type: "document",
  fields: [
    {
      name: "discourageSearchEngines",
      title: "Block All Search Engines (noindex entire site)",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "disallowPaths",
      title: "Additional Disallow Paths",
      description: "Paths to block crawlers from (e.g. /old-page, /draft). Admin, API, Studio are always blocked.",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
  preview: { select: { title: "discourageSearchEngines" }, prepare: () => ({ title: "Robots.txt Settings" }) },
};
