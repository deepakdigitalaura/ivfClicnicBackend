import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  fields: [
    defineField({ name: "pgId", title: "Postgres ID (read-only)", type: "number", readOnly: true }),
    defineField({ name: "title", title: "Title", type: "string", validation: (R) => R.required() }),
    defineField({ name: "slug", title: "Slug", type: "string", validation: (R) => R.required() }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3 }),
    defineField({ name: "status", title: "Status", type: "string", initialValue: "published", options: { list: [{ title: "Published", value: "published" }, { title: "Draft", value: "draft" }] } }),
    // Hero
    defineField({ name: "heroImageUrl", title: "Hero Image URL", type: "url" }),
    defineField({ name: "heroImageAlt", title: "Hero Image Alt", type: "string" }),
    defineField({ name: "heroTextDark", title: "Hero Text Dark", type: "boolean", initialValue: false }),
    defineField({
      name: "heroImagePosition",
      title: "Hero Image Position",
      type: "string",
      options: {
        list: ["center center", "right center", "left center", "right top", "center top", "center bottom"].map(
          (v) => ({ title: v, value: v }),
        ),
      },
    }),
    // Article body — stored as raw Lexical JSON; rendered by rich-text.tsx
    defineField({
      name: "contentRaw",
      title: "Article Body (raw JSON — do not edit manually)",
      type: "text",
      readOnly: true,
    }),
    // Author
    defineField({ name: "authorSlug", title: "Author Slug", type: "string" }),
    defineField({ name: "authorName", title: "Author Name", type: "string" }),
    defineField({ name: "authorRole", title: "Author Role", type: "string" }),
    defineField({ name: "authorCredentials", title: "Author Credentials", type: "string" }),
    defineField({ name: "authorAvatarUrl", title: "Author Avatar URL", type: "url" }),
    defineField({ name: "authorBioText", title: "Author Bio", type: "text", rows: 3 }),
    // Reviewer
    defineField({ name: "reviewerSlug", title: "Reviewer Slug", type: "string" }),
    defineField({ name: "reviewerName", title: "Reviewer Name", type: "string" }),
    defineField({ name: "reviewerRole", title: "Reviewer Role", type: "string" }),
    defineField({ name: "reviewerCredentials", title: "Reviewer Credentials", type: "string" }),
    defineField({ name: "reviewerAvatarUrl", title: "Reviewer Avatar URL", type: "url" }),
    // Category
    defineField({ name: "categoryTitle", title: "Category Title", type: "string" }),
    defineField({ name: "categorySlug", title: "Category Slug", type: "string" }),
    // Meta
    defineField({ name: "readMins", title: "Read Time (minutes)", type: "number" }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime" }),
    defineField({ name: "lastUpdatedAt", title: "Last Updated At", type: "datetime" }),
    // Related
    defineField({
      name: "treatmentSlugs",
      title: "Treatment Slugs",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "locationSlugs",
      title: "Location Slugs",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    // FAQs
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string" }),
            defineField({ name: "answer", title: "Answer", type: "text" }),
          ],
        }),
      ],
    }),
    // SEO
    defineField({ name: "seoMetaTitle", title: "SEO Meta Title", type: "string" }),
    defineField({ name: "seoMetaDescription", title: "SEO Meta Description", type: "text", rows: 2 }),
    defineField({ name: "seoOgTitle", title: "OG Title", type: "string" }),
    defineField({ name: "seoOgDescription", title: "OG Description", type: "text", rows: 2 }),
    defineField({ name: "seoOgImageUrl", title: "OG Image URL", type: "url" }),
  ],
  orderings: [
    {
      title: "Published (newest first)",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "categoryTitle", status: "status", slug: "slug" },
    prepare({ title, subtitle, status, slug }) {
      return {
        title: title || "Untitled",
        subtitle: `${subtitle ?? ""} · /blogs/${slug ?? ""} · ${status ?? "published"}`,
      };
    },
  },
});
