import type { CollectionConfig } from "payload";
import { revalidateRelated } from "@/lib/revalidate";

/**
 * Blog authors / medical reviewers (E-E-A-T entities). Authors and Medical
 * Reviewers are deliberately the SAME collection but DIFFERENT roles on a Blog
 * (author = who wrote it; reviewedBy = who medically reviewed it). A `doctor`
 * relationship will be added in Phase 4 so a reviewer can resolve to the
 * canonical Doctor entity (shared @id) for stronger medical E-E-A-T.
 *
 * Editing an author affects rendered blog pages, so changes bust the `blogs`
 * cache tag (Phase 2.5 revalidation).
 */
export const Authors: CollectionConfig = {
  slug: "authors",
  admin: { useAsTitle: "name", defaultColumns: ["name", "slug", "role"], group: "Blog" },
  access: { read: () => true },
  hooks: revalidateRelated(["blogs"]),
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL-safe id, e.g. 'dr-himanshu-bavishi'." },
    },
    { name: "role", type: "text", admin: { description: "e.g. 'Fertility Specialist', 'Medical Content Writer'." } },
    { name: "credentials", type: "text", admin: { description: "e.g. 'MD, FRCOG'." } },
    { name: "avatar", type: "upload", relationTo: "media" },
    { name: "bio", type: "textarea" },
    {
      name: "sameAs",
      type: "array",
      labels: { singular: "Profile link", plural: "Profile links" },
      admin: { description: "schema.org sameAs — official/professional profile URLs." },
      fields: [{ name: "url", type: "text", required: true }],
    },
    // Phase 4: add `doctor` relationship -> doctors for canonical-entity linkage.
  ],
};
