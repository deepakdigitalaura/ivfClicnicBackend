export default {
  name: "pageSeo",
  title: "Page SEO",
  type: "document",
  fields: [
    {
      name: "pagePath",
      title: "Page Path",
      description: "Exact URL path, e.g. /about-bfi or /treatments/ivf",
      type: "string",
      validation: (R: { required: () => unknown }) => R.required(),
    },
    {
      name: "pageName",
      title: "Page Label (display only)",
      description: "Human-readable name for this entry, e.g. 'About BFI'",
      type: "string",
    },
    {
      name: "metaTitle",
      title: "Meta Title",
      description: "Overrides the default page title in <title> and Google snippets. Keep under 60 chars.",
      type: "string",
    },
    {
      name: "metaDescription",
      title: "Meta Description",
      description: "Overrides the default description. Keep under 160 chars.",
      type: "text",
      rows: 3,
    },
    {
      name: "ogTitle",
      title: "OG / Social Title",
      description: "Title shown when shared on Facebook, WhatsApp, LinkedIn. Falls back to Meta Title.",
      type: "string",
    },
    {
      name: "ogDescription",
      title: "OG / Social Description",
      description: "Description shown on social shares. Falls back to Meta Description.",
      type: "text",
      rows: 3,
    },
    {
      name: "ogImageUrl",
      title: "OG Image URL",
      description: "Image URL shown on social shares (1200×630 recommended).",
      type: "url",
    },
    {
      name: "canonicalUrl",
      title: "Canonical URL (override)",
      description: "Only set this if you need to point canonical to a different URL. Leave blank otherwise.",
      type: "string",
    },
    {
      name: "noIndex",
      title: "No Index",
      description: "Check to exclude this page from search engine results.",
      type: "boolean",
      initialValue: false,
    },
  ],
  preview: {
    select: { title: "pageName", subtitle: "pagePath" },
    prepare: ({ title, subtitle }: { title: string; subtitle: string }) => ({
      title: title || subtitle || "Unnamed Page",
      subtitle,
    }),
  },
};
