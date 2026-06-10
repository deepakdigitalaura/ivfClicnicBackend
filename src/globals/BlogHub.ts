import type { GlobalConfig } from "payload";
import { seoField } from "@/fields/seo";
import { revalidateGlobal } from "@/lib/revalidate";
import { isEditor } from "@/access/roles";

/**
 * Blog Hub → CMS source of truth for the /blog landing page's editorial content
 * (hero + optional intro prose + SEO). The blog LISTING itself still comes from
 * the `blogs` collection; only the page's own copy becomes editable here.
 *
 * Reuses the shared `seoField` (no new SEO pattern) and the standard
 * `revalidateGlobal` hook so edits bust `global:blog-hub` — the tag the /blog
 * route reads through (keeps the page static + on-demand ISR, like every other
 * CMS surface). RBAC: editors update content; admins inherit via isEditor.
 */
export const BlogHub: GlobalConfig = {
  slug: "blog-hub",
  label: "Blog Landing Page",
  access: { read: () => true, update: isEditor },
  admin: { group: "Website Pages" },
  hooks: revalidateGlobal("blog-hub"),
  fields: [
    {
      name: "hero",
      type: "group",
      label: "Top Section",
      fields: [
        { name: "title", type: "text", label: "Page Heading", admin: { description: "Heading at the top of the blog page. Leave empty to keep the built-in default." } },
        { name: "description", type: "textarea", label: "Intro Paragraph", admin: { description: "Short paragraph under the heading." } },
      ],
    },
    {
      name: "intro",
      type: "richText",
      label: "Introduction",
      admin: { description: "Optional extra content shown beneath the top section, above the list of articles." },
    },
    seoField,
  ],
};
