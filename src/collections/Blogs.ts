import type { CollectionConfig } from "payload";
import { seoField } from "@/fields/seo";
import { revalidateCollection } from "@/lib/revalidate";

/**
 * Blog posts. Net-new content type rendered at /blog/[slug] (additive routes).
 *
 * E-E-A-T: `author` (required) and `reviewedBy` (optional medical reviewer) are
 * SEPARATE relationships — for YMYL fertility content the writer and the medical
 * reviewer are distinct roles and must not be conflated. Both point to `authors`
 * now; Phase 4 will allow `reviewedBy` to resolve to a Doctor entity too.
 *
 * `treatmentSlugs` keeps the existing slug-matching contract used by
 * `blogsForTreatment()` — it becomes a real relationship to `treatments` in
 * Phase 5 (treatment-page related-blogs are deliberately untouched until then).
 *
 * Drafts on; public reads published-only; edits bust `blogs` + `blogs:<slug>`.
 */
export const Blogs: CollectionConfig = {
  slug: "blogs",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "author", "_status", "publishedAt"],
    group: "Blog",
    preview: (doc) => {
      const slug = typeof doc?.slug === "string" ? doc.slug : "";
      if (!slug) return null;
      return `/preview?secret=${process.env.PREVIEW_SECRET ?? ""}&path=${encodeURIComponent(`/blog/${slug}`)}`;
    },
  },
  versions: { drafts: true },
  hooks: revalidateCollection("blogs"),
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL path segment → /blog/<slug>." },
    },
    { name: "excerpt", type: "textarea", admin: { description: "Card summary + meta description fallback." } },
    { name: "heroImage", type: "upload", relationTo: "media" },
    { name: "content", type: "richText" },
    {
      type: "row",
      fields: [
        {
          name: "author",
          type: "relationship",
          relationTo: "authors",
          required: true,
          admin: { width: "50%", description: "Who wrote the post." },
        },
        {
          name: "reviewedBy",
          type: "relationship",
          relationTo: "authors",
          admin: { width: "50%", description: "Medical reviewer (optional). Phase 4: may point to a Doctor." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "category", type: "relationship", relationTo: "categories", admin: { width: "50%" } },
        { name: "readMins", type: "number", admin: { width: "50%", description: "Estimated read time (minutes)." } },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      admin: { description: "Display + schema datePublished. dateModified uses updatedAt." },
    },
    {
      name: "treatmentSlugs",
      type: "array",
      labels: { singular: "Treatment slug", plural: "Treatment slugs" },
      admin: { description: "Treatment slugs this post relates to (drives Related Blogs). Becomes a relationship in Phase 5." },
      fields: [{ name: "slug", type: "text", required: true }],
    },
    seoField,
  ],
};
