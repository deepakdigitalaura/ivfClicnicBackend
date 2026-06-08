import type { CollectionConfig } from "payload";
import { revalidateCollection } from "@/lib/revalidate";
import { seoField } from "@/fields/seo";
import { isAdmin, isEditor } from "@/access/roles";

/**
 * Generic Pages collection (Phase 1 POC scope = Contact page).
 *
 * Deliberately MINIMAL and typed (no block/layout builder yet): the existing
 * React templates are preserved and simply read these fields. Fields map 1:1
 * onto what the Contact template renders today:
 *   - hero.lead + hero.em  -> the h1 "{lead} <em>{em}</em>" exactly
 *   - faqs[]               -> rendered FAQ list AND faqSchema() JSON-LD
 *   - seo.*                -> <head> metadata
 *
 * NOT modelled here (stay hardcoded in the template for now): the 15-centre
 * directory and the contact cards — those belong to a future Centres
 * collection + a contactInfo global, not to a Page document.
 *
 * Drafts are enabled so editors can stage changes; unauthenticated reads are
 * constrained to published docs (the public site never sees drafts).
 */
export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    // "Preview" button → secret-guarded /preview endpoint that enables Draft
    // Mode and opens the front-end path. Foundation only; the public render
    // stays static until a page type opts into draftMode().
    preview: (doc) => {
      const slug = typeof doc?.slug === "string" ? doc.slug : "";
      if (!slug) return null;
      return `/preview?secret=${process.env.PREVIEW_SECRET ?? ""}&path=${encodeURIComponent(`/${slug}`)}`;
    },
  },
  versions: {
    drafts: true,
  },
  hooks: revalidateCollection("pages"),
  access: {
    read: ({ req }) => {
      // Authenticated admins see everything (incl. drafts); the public only
      // sees published documents.
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
    create: isAdmin, // creating a page = creating a route (admin only)
    update: isEditor, // editing page content is routine (editor + admin)
    delete: isAdmin, // removing a route (admin only)
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL path segment, e.g. 'contact' for /contact." },
    },
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text" },
        {
          name: "lead",
          type: "text",
          admin: { description: "Heading text shown upright, e.g. 'Contact'." },
        },
        {
          name: "em",
          type: "text",
          admin: { description: "Heading text shown in italic emphasis, e.g. the brand name." },
        },
        { name: "subtitle", type: "textarea" },
      ],
    },
    {
      name: "faqs",
      type: "array",
      labels: { singular: "FAQ", plural: "FAQs" },
      fields: [
        { name: "question", type: "text", required: true },
        { name: "answer", type: "textarea", required: true },
      ],
    },
    seoField,
  ],
};
