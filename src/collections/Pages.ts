import type { CollectionConfig, Field } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { revalidateCollection } from "@/lib/revalidate";
import { seoField } from "@/fields/seo";
import { isAdmin, isEditor, isAdminField } from "@/access/roles";

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
/* Page fields, defined once and grouped into admin Tabs below (UNNAMED tabs →
 * stored data shape unchanged). Cleaner editing only. */
const PAGE_FIELDS: Field[] = [
    { name: "title", type: "text", required: true, label: "Page Title", admin: { description: "Internal name for this page in the list." } },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Page URL",
      access: { update: isAdminField },
      admin: { description: "The web address for this page. Set when creating — ask the website team to change it later." },
    },
    {
      name: "hero",
      type: "group",
      label: "Top Section",
      admin: { description: "The banner at the top of the page." },
      fields: [
        { name: "eyebrow", type: "text", label: "Small Label Above Heading" },
        {
          name: "lead",
          type: "text",
          label: "Heading Text",
          admin: { description: "Plain heading text before the highlighted word(s), e.g. 'Contact'." },
        },
        {
          name: "em",
          type: "text",
          label: "Highlighted Word(s)",
          admin: { description: "The word(s) shown in the cursive accent style, e.g. the brand name." },
        },
        { name: "subtitle", type: "textarea", label: "Sub-heading" },
      ],
    },
    {
      name: "content",
      type: "richText",
      label: "Page Content",
      editor: lexicalEditor({}),
      admin: { description: "Main body content for this page (used by policy/legal pages)." },
    },
    {
      name: "faqs",
      type: "array",
      labels: { singular: "FAQ", plural: "FAQs" },
      admin: { description: "Questions and answers shown on the page." },
      fields: [
        { name: "question", type: "text", required: true, label: "Question" },
        { name: "answer", type: "textarea", required: true, label: "Answer" },
      ],
    },
    {
      name: "sectionLabels",
      type: "group",
      label: "Page Section Labels",
      admin: { description: "Small labels and sub-headings above each section. Leave empty to use the defaults." },
      fields: [
        { name: "networkEyebrow", type: "text", label: "'Our Network' Section Label" },
        { name: "networkSubtitle", type: "textarea", label: "'Our Network' Sub-heading" },
        { name: "faqEyebrow", type: "text", label: "'FAQ' Section Label" },
      ],
    },
    seoField,
];

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "Page", plural: "Pages" },
  admin: {
    group: "Website Pages",
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
  // Grouped into Tabs (unnamed) so editors see one short section at a time.
  fields: [
    {
      type: "tabs",
      tabs: [
        { label: "Page", fields: PAGE_FIELDS.slice(0, 3) },
        { label: "Content", fields: PAGE_FIELDS.slice(3, 4) },
        { label: "FAQs", fields: PAGE_FIELDS.slice(4, 5) },
        { label: "Section Labels", fields: PAGE_FIELDS.slice(5, 6) },
        { label: "Search & Social", fields: PAGE_FIELDS.slice(6) },
      ],
    },
  ],
};
