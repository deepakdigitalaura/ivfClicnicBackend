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
  label: "Search Engine & Social Preview",
  admin: { description: "Controls how this page looks in Google results and when shared on social media. Leave empty to use the built-in defaults." },
  fields: [
    {
      name: "metaTitle",
      type: "text",
      label: "Google Page Title",
      admin: { description: "The clickable title shown in Google. Aim for ~55–60 characters so it isn't cut off." },
    },
    {
      name: "metaDescription",
      type: "textarea",
      label: "Google Search Description",
      admin: { description: "The grey summary under the title in Google. Aim for ~150–160 characters." },
    },
    {
      name: "ogTitle",
      type: "text",
      label: "Social Share Title",
      admin: { description: "Title used when shared on Facebook / WhatsApp / LinkedIn. Leave empty to reuse the Google Page Title." },
    },
    {
      name: "ogDescription",
      type: "textarea",
      label: "Social Share Description",
      admin: { description: "Description used when shared on social media. Leave empty to reuse the Google Search Description." },
    },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
      label: "Social Share Image",
      admin: { description: "Image shown when this page is shared on social media. Leave empty to use the default page image." },
    },
  ],
};
