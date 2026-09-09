import { defineType, defineField } from "sanity";

export default defineType({
  name: "pageSeo",
  title: "Page SEO",
  type: "document",
  fields: [
    defineField({
      name: "pagePath",
      title: "Page Path",
      description: "Exact URL path, e.g. /about-bfi or /treatments/ivf",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "pageName",
      title: "Page Label (display only)",
      description: "Human-readable name for this entry, e.g. 'About BFI'",
      type: "string",
    }),
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      description: "Overrides the page title in <title> and Google snippets. Keep under 60 chars.",
      type: "string",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      description: "Overrides the default description. Keep under 160 chars.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ogTitle",
      title: "OG / Social Title",
      description: "Title shown when shared on Facebook, WhatsApp, LinkedIn.",
      type: "string",
    }),
    defineField({
      name: "ogDescription",
      title: "OG / Social Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ogImageUrl",
      title: "OG Image URL",
      description: "Image URL for social shares (1200×630 recommended).",
      type: "url",
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL (override)",
      description: "Only set if pointing canonical to a different URL.",
      type: "string",
    }),
    defineField({
      name: "noIndex",
      title: "No Index",
      description: "Check to exclude this page from search engine results.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "customSchemaJson",
      title: "Structured Data (JSON-LD)",
      description:
        "Paste a valid JSON-LD schema for this page only. Use schema.org types like MedicalProcedure, Physician, FAQPage, Article, etc. Must be valid JSON — invalid JSON is silently ignored.",
      type: "text",
      rows: 10,
    }),
  ],
  preview: {
    select: { title: "pageName", subtitle: "pagePath" },
    prepare({ title, subtitle }) {
      return { title: title || subtitle || "Unnamed Page", subtitle };
    },
  },
});
