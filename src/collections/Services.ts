import type { CollectionConfig, Field } from "payload";
import { seoField } from "@/fields/seo";
import { revalidateCollection } from "@/lib/revalidate";
import { isEditor } from "@/access/roles";
import { ICON_NAMES } from "@/lib/icon-map";

/**
 * Maternity / Women's-Health services. Mirrors `ServiceContent` +
 * `WomensHealthService` in src/lib/womens-health.ts 1:1 (NOT a generic block
 * builder) so the existing <ServicePage> template renders unchanged — the route
 * reshapes a doc into the resolved model via src/lib/services.ts, falling back
 * per-section to the code defaults so an empty CMS stays byte-identical.
 *
 * Icons are stored as NAMES (curated select → ICON_MAP); prose stays as string
 * arrays for byte-parity (the shared RichText serializer arrives in a later
 * wave). Drafts on; public reads published-only; edits bust `services` +
 * `services:<slug>`.
 */

/** Reusable {lead, em} heading group (mirrors ServiceHeading). */
const headingField = (name = "heading", required = true): Field => ({
  name,
  type: "group",
  fields: [
    { name: "lead", type: "text", required },
    { name: "em", type: "text", admin: { description: "Italic emphasis fragment (optional)." } },
  ],
});

/** Reusable single-column array of short strings. */
const stringArray = (name: string, field: string, label: string): Field => ({
  name,
  type: "array",
  labels: { singular: label, plural: `${label}s` },
  fields: [{ name: field, type: "text", required: true }],
});

/** Icon-card step array (icon name + title + description). */
const stepArray = (name: string): Field => ({
  name,
  type: "array",
  labels: { singular: "Step", plural: "Steps" },
  fields: [
    { name: "icon", type: "select", options: ICON_NAMES as string[], required: true },
    { name: "t", type: "text", required: true, admin: { description: "Title." } },
    { name: "d", type: "textarea", required: true, admin: { description: "Description." } },
  ],
});

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "schemaType", "published", "_status"],
    group: "Content",
  },
  versions: { drafts: true },
  hooks: revalidateCollection("services"),
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    // ---- Identity + registry (the light card shown on location pages) ----
    {
      type: "row",
      fields: [
        { name: "slug", type: "text", required: true, unique: true, index: true, admin: { width: "50%", description: "URL segment → /services/<slug>. Also the registry key." } },
        { name: "name", type: "text", required: true, admin: { width: "50%", description: "Service card title." } },
      ],
    },
    { name: "desc", type: "textarea", admin: { description: "One-line card description (registry)." } },
    {
      type: "row",
      fields: [
        { name: "icon", type: "select", options: ICON_NAMES as string[], admin: { width: "50%", description: "Registry card icon." } },
        { name: "href", type: "text", admin: { width: "50%", description: "Canonical page URL, e.g. /services/3d-4d-sonography." } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "published", type: "checkbox", admin: { width: "33%", description: "Gates the live, crawlable location→service link." } },
        { name: "fallback", type: "text", admin: { width: "33%", description: "Where the card points until published." } },
        { name: "schemaType", type: "select", required: true, defaultValue: "MedicalProcedure", options: ["MedicalProcedure", "MedicalTest", "MedicalTherapy"], admin: { width: "33%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "shortName", type: "text", admin: { width: "50%", description: 'Plain label used inside copy ("the scan").' } },
        { name: "breadcrumbName", type: "text", admin: { width: "50%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "reviewerSlug", type: "text", admin: { width: "50%", description: "Doctor slug for the medical reviewer (becomes a relationship once Doctors migrate)." } },
        { name: "lastReviewed", type: "text", admin: { width: "50%", description: "Review date, e.g. 2026-06-01." } },
      ],
    },

    // ---- Hero ----
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text" },
        {
          type: "row",
          fields: [
            { name: "h1", type: "text", admin: { width: "50%" } },
            { name: "h1Em", type: "text", admin: { width: "50%", description: "Italic emphasis word." } },
          ],
        },
        { name: "tagline", type: "textarea" },
        stringArray("badges", "badge", "Badge"),
        {
          type: "row",
          fields: [
            { name: "image", type: "text", admin: { width: "50%", description: "Hero image path (an upload relation can replace this later)." } },
            { name: "imageAlt", type: "text", admin: { width: "50%" } },
          ],
        },
      ],
    },

    // ---- Overview ----
    {
      name: "overview",
      type: "group",
      fields: [
        headingField(),
        stringArray("paragraphs", "text", "Paragraph"),
        {
          name: "aside",
          type: "group",
          admin: { description: "Optional callout box." },
          fields: [
            { name: "title", type: "text" },
            { name: "body", type: "textarea" },
          ],
        },
      ],
    },

    // ---- Benefits ----
    {
      name: "benefits",
      type: "group",
      fields: [headingField(), { name: "subtitle", type: "textarea" }, stringArray("items", "item", "Benefit")],
    },

    // ---- Who it's for ----
    {
      name: "whoFor",
      type: "group",
      fields: [headingField(), { name: "subtitle", type: "textarea" }, stringArray("items", "item", "Item")],
    },

    // ---- Process ----
    {
      name: "process",
      type: "group",
      fields: [headingField(), { name: "subtitle", type: "textarea" }, stepArray("steps"), { name: "note", type: "textarea" }],
    },

    // ---- Why us ----
    {
      name: "whyUs",
      type: "group",
      fields: [headingField(), stepArray("items")],
    },

    // ---- Optional info / myth-busting note ----
    {
      name: "infoNote",
      type: "group",
      admin: { description: "Optional explainer block — leave empty to hide." },
      fields: [headingField("heading", false), stringArray("paragraphs", "text", "Paragraph")],
    },

    // ---- FAQs ----
    {
      name: "faqs",
      type: "array",
      labels: { singular: "FAQ", plural: "FAQs" },
      fields: [
        { name: "q", type: "text", required: true },
        { name: "a", type: "textarea", required: true },
      ],
    },

    // ---- Related services (cross-links; no dead ends) ----
    {
      name: "related",
      type: "array",
      labels: { singular: "Related service", plural: "Related services" },
      admin: { description: "Other service slugs/keys to cross-link." },
      fields: [{ name: "key", type: "text", required: true }],
    },

    seoField,
  ],
};
