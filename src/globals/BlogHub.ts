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
  access: { read: () => true, update: isEditor },
  admin: { group: "Blog" },
  hooks: revalidateGlobal("blog-hub"),
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "title", type: "text", admin: { description: "Hero heading. Empty keeps the default styled heading." } },
        { name: "description", type: "textarea", admin: { description: "Hero sub-paragraph." } },
      ],
    },
    {
      name: "intro",
      type: "richText",
      admin: { description: "Optional rich content shown beneath the hero, above the article grid." },
    },
    seoField,
  ],
};
