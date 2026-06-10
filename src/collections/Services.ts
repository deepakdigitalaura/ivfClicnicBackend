import type { CollectionConfig, Field } from "payload";
import { seoField } from "@/fields/seo";
import { revalidateCollection } from "@/lib/revalidate";
import { isEditor, isAdminField } from "@/access/roles";
import { ICON_OPTIONS } from "@/lib/icon-map";

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
  label: "Heading",
  fields: [
    { name: "lead", type: "text", required, label: "Heading Text", admin: { description: "Plain heading text before the highlighted word(s)." } },
    { name: "em", type: "text", label: "Highlighted Word(s)", admin: { description: "The word(s) shown in the cursive accent style (optional)." } },
  ],
});

/** Reusable single-column array of short strings. */
const stringArray = (name: string, field: string, label: string): Field => ({
  name,
  type: "array",
  labels: { singular: label, plural: `${label}s` },
  fields: [{ name: field, type: "text", required: true, label }],
});

/** Icon-card step array (icon name + title + description). */
const stepArray = (name: string): Field => ({
  name,
  type: "array",
  labels: { singular: "Step", plural: "Steps" },
  fields: [
    { name: "icon", type: "select", options: ICON_OPTIONS, required: true, label: "Icon", admin: { description: "Pick the icon shown on this card." } },
    { name: "t", type: "text", required: true, label: "Title" },
    { name: "d", type: "textarea", required: true, label: "Description" },
  ],
});

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "schemaType", "published", "_status"],
    group: "Treatments & Services",
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
        { name: "slug", type: "text", required: true, unique: true, index: true, label: "Page ID", access: { update: isAdminField }, admin: { width: "50%", description: "The page's web address ID. Set when creating — ask the website team to change it later." } },
        { name: "name", type: "text", required: true, label: "Service Name", admin: { width: "50%", description: "Service title shown on the card and page." } },
      ],
    },
    { name: "desc", type: "textarea", label: "Short Description", admin: { description: "One-line description shown on the service card." } },
    {
      type: "row",
      fields: [
        { name: "icon", type: "select", options: ICON_OPTIONS, label: "Card Icon", admin: { width: "50%", description: "Pick the icon shown on the service card." } },
        { name: "href", type: "text", label: "Page URL", access: { update: isAdminField }, admin: { width: "50%", description: "The full web address for this page. Managed by the website team." } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "published", type: "checkbox", label: "Show on Location Pages", admin: { width: "33%", description: "Show this service's link on location pages. (Separate from the draft/publish state.)" } },
        { name: "fallback", type: "text", label: "Temporary Link (website team)", access: { update: isAdminField }, admin: { width: "33%", description: "Where the card points until published. Managed by the website team." } },
        { name: "schemaType", type: "select", required: true, defaultValue: "MedicalProcedure", options: ["MedicalProcedure", "MedicalTest", "MedicalTherapy"], label: "Search Engine Category (website team)", access: { update: isAdminField }, admin: { width: "33%", description: "Search-engine category. Managed by the website team." } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "shortName", type: "text", label: "Short Name", admin: { width: "50%", description: 'Plain label used inside copy ("the scan").' } },
        { name: "breadcrumbName", type: "text", label: "Breadcrumb Name", admin: { width: "50%", description: "Short name shown in the breadcrumb trail." } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "reviewerSlug", type: "text", label: "Medical Reviewer (doctor ID)", access: { update: isAdminField }, admin: { width: "50%", description: "Doctor ID of the medical reviewer. Managed by the website team." } },
        { name: "lastReviewed", type: "text", label: "Last Medically Reviewed (date)", admin: { width: "50%", description: "Date this page was last checked by a doctor, e.g. 2026-06-01." } },
      ],
    },

    // ---- Hero ----
    {
      name: "hero",
      type: "group",
      label: "Top Section",
      admin: { description: "The banner at the top of the page." },
      fields: [
        { name: "eyebrow", type: "text", label: "Small Label Above Heading" },
        {
          type: "row",
          fields: [
            { name: "h1", type: "text", label: "Page Heading", admin: { width: "50%" } },
            { name: "h1Em", type: "text", label: "Highlighted Word(s)", admin: { width: "50%", description: "The word(s) shown in the cursive accent style." } },
          ],
        },
        { name: "tagline", type: "textarea", label: "Sub-heading" },
        stringArray("badges", "badge", "Badge"),
        {
          type: "row",
          fields: [
            { name: "image", type: "text", label: "Hero Image Path", admin: { width: "50%", description: "Image path, e.g. /assets/.... Ask the website team to add new images." } },
            { name: "imageAlt", type: "text", label: "Image Alt Text", admin: { width: "50%", description: "Describes the image for accessibility." } },
          ],
        },
      ],
    },

    // ---- Overview ----
    {
      name: "overview",
      type: "group",
      label: "Overview",
      fields: [
        headingField(),
        stringArray("paragraphs", "text", "Paragraph"),
        {
          name: "aside",
          type: "group",
          label: "Callout Box",
          admin: { description: "Optional callout box." },
          fields: [
            { name: "title", type: "text", label: "Title" },
            { name: "body", type: "textarea", label: "Body" },
          ],
        },
      ],
    },

    // ---- Benefits ----
    {
      name: "benefits",
      type: "group",
      label: "Benefits",
      fields: [headingField(), { name: "subtitle", type: "textarea", label: "Sub-heading" }, stringArray("items", "item", "Benefit")],
    },

    // ---- Who it's for ----
    {
      name: "whoFor",
      type: "group",
      label: "Who It's For",
      fields: [headingField(), { name: "subtitle", type: "textarea", label: "Sub-heading" }, stringArray("items", "item", "Item")],
    },

    // ---- Process ----
    {
      name: "process",
      type: "group",
      label: "Process",
      fields: [headingField(), { name: "subtitle", type: "textarea", label: "Sub-heading" }, stepArray("steps"), { name: "note", type: "textarea", label: "Note" }],
    },

    // ---- Why us ----
    {
      name: "whyUs",
      type: "group",
      label: "Why Choose Us",
      fields: [headingField(), stepArray("items")],
    },

    // ---- Optional info / myth-busting note ----
    {
      name: "infoNote",
      type: "group",
      label: "Optional Info Note",
      admin: { description: "Optional explainer block — leave empty to hide." },
      fields: [headingField("heading", false), stringArray("paragraphs", "text", "Paragraph")],
    },

    // ---- FAQs ----
    {
      name: "faqs",
      type: "array",
      labels: { singular: "FAQ", plural: "FAQs" },
      fields: [
        { name: "q", type: "text", required: true, label: "Question" },
        { name: "a", type: "textarea", required: true, label: "Answer" },
      ],
    },

    // ---- Related services (cross-links; no dead ends) ----
    {
      name: "related",
      type: "array",
      labels: { singular: "Related Service", plural: "Related Services" },
      admin: { description: "Other service IDs to cross-link." },
      fields: [{ name: "key", type: "text", required: true, label: "Service ID" }],
    },

    seoField,
  ],
};
