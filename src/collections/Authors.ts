import type { CollectionConfig } from "payload";
import { revalidateRelated } from "@/lib/revalidate";
import { isAdmin, isEditor } from "@/access/roles";

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
  labels: { singular: "Author / Reviewer", plural: "Authors & Reviewers" },
  // Hidden from the nav to declutter the panel — authors are created/picked
  // inline from a Blog's "Author" / "Reviewed by" relationship field, so a
  // separate sidebar entry only confused non-technical staff. Still fully usable.
  admin: { useAsTitle: "name", defaultColumns: ["name", "slug", "role"], group: "Blog", hidden: true },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isAdmin },
  hooks: revalidateRelated(["blogs"]),
  fields: [
    { name: "name", type: "text", required: true, label: "Name" },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Page URL",
      admin: { description: "The web address for this profile. Changing it breaks existing links, so set it once and leave it." },
    },
    { name: "role", type: "text", label: "Role", admin: { description: "e.g. 'Fertility Specialist', 'Medical Content Writer'." } },
    { name: "credentials", type: "text", label: "Credentials", admin: { description: "Post-nominal degrees, e.g. 'MD, FRCOG'." } },
    { name: "avatar", type: "upload", relationTo: "media", label: "Photo" },
    { name: "bio", type: "textarea", label: "Bio" },
    {
      name: "sameAs",
      type: "array",
      labels: { singular: "Profile Link", plural: "Profile Links" },
      admin: { description: "Official profile links (e.g. LinkedIn, professional society pages)." },
      fields: [{ name: "url", type: "text", required: true, label: "Profile URL" }],
    },
    // Phase 4: add `doctor` relationship -> doctors for canonical-entity linkage.
  ],
};
