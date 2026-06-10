import type { CollectionConfig } from "payload";
import { revalidateRelated } from "@/lib/revalidate";
import { isAdmin, isEditor } from "@/access/roles";

/** Blog categories. Editing a category affects rendered blog pages, so changes
 *  bust the `blogs` cache tag. */
export const Categories: CollectionConfig = {
  slug: "categories",
  admin: { useAsTitle: "title", defaultColumns: ["title", "slug"], group: "Blog" },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isAdmin },
  hooks: revalidateRelated(["blogs"]),
  fields: [
    { name: "title", type: "text", required: true, label: "Title" },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Page URL",
      admin: { description: "The web address for this category. Changing it breaks existing links, so set it once and leave it." },
    },
    { name: "description", type: "textarea", label: "Description" },
  ],
};
