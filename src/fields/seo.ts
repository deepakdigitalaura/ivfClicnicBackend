import type { Field } from "payload";

/**
 * Reusable SEO field group — the single definition every CMS-driven page/
 * collection uses for its <head> metadata + Open Graph.
 *
 * IMPORTANT: this reproduces the exact group ("seo") and subfield names/types
 * that the Pages collection already shipped, so adopting it causes NO schema
 * change (no DB migration, no payload-types diff). Reused by future Blogs,
 * Doctors, Locations, Treatments, Services collections.
 *
 * Resolution contract (implemented in the route, not here):
 *   ogTitle       -> falls back to metaTitle
 *   ogDescription -> falls back to metaDescription
 *   ogImage       -> falls back to the template's default image
 */
export const seoField: Field = {
  name: "seo",
  type: "group",
  fields: [
    { name: "metaTitle", type: "text" },
    { name: "metaDescription", type: "textarea" },
    {
      name: "ogTitle",
      type: "text",
      admin: { description: "Open Graph title. Falls back to metaTitle if empty." },
    },
    {
      name: "ogDescription",
      type: "textarea",
      admin: { description: "Open Graph description. Falls back to metaDescription if empty." },
    },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "Open Graph / social share image. Falls back to the default hero image if empty." },
    },
  ],
};
