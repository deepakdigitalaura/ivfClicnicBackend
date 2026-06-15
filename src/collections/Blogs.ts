import type { CollectionConfig, Field } from "payload";
import { seoField } from "@/fields/seo";
import { revalidateCollection } from "@/lib/revalidate";
import { isEditor } from "@/access/roles";

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
/* Blog fields, defined once and grouped into admin Tabs below (UNNAMED tabs →
 * stored data shape unchanged). Cleaner editing only. */
const BLOG_FIELDS: Field[] = [
    { name: "title", type: "text", required: true, label: "Title" },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Page URL",
      admin: { description: "The web address for this article (→ /blog/<this>). Changing it breaks existing links and Google rankings, so set it once and leave it." },
    },
    { name: "excerpt", type: "textarea", label: "Short Summary", admin: { description: "Short summary shown on cards and used as the Google search description if none is set." } },
    { name: "heroImage", type: "upload", relationTo: "media", label: "Cover Image" },
    { name: "content", type: "richText", label: "Article Body" },
    {
      type: "row",
      fields: [
        {
          name: "author",
          type: "relationship",
          relationTo: "authors",
          required: true,
          label: "Author",
          admin: { width: "50%", description: "Who wrote the article." },
        },
        {
          name: "reviewedBy",
          type: "relationship",
          relationTo: "authors",
          label: "Medically Reviewed By",
          admin: { width: "50%", description: "Optional medical reviewer who checked the article." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "category", type: "relationship", relationTo: "categories", label: "Category", admin: { width: "50%" } },
        { name: "readMins", type: "number", label: "Read Time (minutes)", admin: { width: "50%", description: "Estimated read time in minutes." } },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Published Date",
      admin: { description: "The date shown on the article. Leave blank to use today." },
    },
    {
      name: "treatmentSlugs",
      type: "array",
      labels: { singular: "Related Treatment ID", plural: "Related Treatment IDs" },
      admin: { description: "Treatment page IDs this article links to (drives the Related Articles list). Ask the website team if unsure of the exact IDs." },
      fields: [{ name: "slug", type: "text", required: true, label: "Treatment ID" }],
    },
    seoField,
];

export const Blogs: CollectionConfig = {
  slug: "blogs",
  labels: { singular: "Article", plural: "Articles" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "author", "_status", "publishedAt"],
    group: "Blog",
    // No `admin.preview` (front-end draft preview) on purpose: the public
    // /blog/[slug] is pure SSG and does not read draftMode(), so a front-end
    // preview link would show the published version, not the draft. Editors
    // preview drafts inside Payload's admin version view. The /preview infra
    // and getBlogBySlugDraft remain available if blogs ever move to dynamic.
  },
  versions: { drafts: true },
  hooks: revalidateCollection("blogs"),
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  // Grouped into Tabs (unnamed) so editors see one short section at a time.
  fields: [
    {
      type: "tabs",
      tabs: [
        { label: "Article", fields: BLOG_FIELDS.slice(0, 5) },
        { label: "Details", fields: BLOG_FIELDS.slice(5, 9) },
        { label: "Search & Social", fields: BLOG_FIELDS.slice(9) },
      ],
    },
  ],
};
