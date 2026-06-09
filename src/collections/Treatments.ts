import type { CollectionConfig, Field } from "payload";
import { revalidateCollection } from "@/lib/revalidate";
import { isEditor } from "@/access/roles";
import { ICON_NAMES } from "@/lib/icon-map";

/**
 * Treatment pages (Wave 4.4). Mirrors the `Treatment` type in
 * src/lib/treatments.ts 1:1 (NOT a generic block builder) so the existing
 * <TreatmentPage> template renders unchanged — the route reshapes a doc into the
 * resolved model via src/lib/treatment-content.ts, falling back PER-SECTION to
 * the code defaults (`treatmentBySlug`) so an empty CMS stays byte-identical.
 *
 * SCOPE (Wave 4.4 constraint #1): only the per-page CONTENT lives here. The
 * lightweight name↔href registry (TREATMENTS_REGISTRY / TREATMENT_CARD_META /
 * treatmentCardData / treatmentRef) stays CODE-OWNED — so the related-treatment
 * cross-links, homepage/centre cards, doctor and location integrations carry
 * zero blast radius. `related` here is a plain list of treatment slugs the
 * template still feeds through the code-owned treatmentCardData().
 *
 * Icons are stored as NAMES (curated select → ICON_MAP); prose stays as string
 * arrays for byte-parity. Drafts on; public reads published-only; edits bust
 * `treatments` + `treatments:<slug>`.
 */

/** Reusable {lead, em} heading group (mirrors Heading). */
const headingField = (name = "heading", required = false): Field => ({
  name,
  type: "group",
  fields: [
    { name: "lead", type: "text", required },
    { name: "em", type: "text", admin: { description: "Italic emphasis fragment (optional)." } },
  ],
});

/** Single-column array of short strings, stored as { value }. */
const valueArray = (name: string, label: string): Field => ({
  name,
  type: "array",
  labels: { singular: label, plural: `${label}s` },
  fields: [{ name: "value", type: "text", required: true }],
});

/** Paragraph array, stored as { text }. */
const textArray = (name: string, label = "Paragraph"): Field => ({
  name,
  type: "array",
  labels: { singular: label, plural: `${label}s` },
  fields: [{ name: "text", type: "textarea", required: true }],
});

/** Icon-card array (icon name + title + description) — types/technology/whyUs. */
const iconCardArray = (name: string): Field => ({
  name,
  type: "array",
  labels: { singular: "Card", plural: "Cards" },
  fields: [
    { name: "icon", type: "select", options: ICON_NAMES as string[], required: true },
    { name: "t", type: "text", required: true, admin: { description: "Title." } },
    { name: "d", type: "textarea", required: true, admin: { description: "Description." } },
  ],
});

/** Numbered process-step array (icon + step number + title + description). */
const stepArray = (name: string): Field => ({
  name,
  type: "array",
  labels: { singular: "Step", plural: "Steps" },
  fields: [
    { name: "icon", type: "select", options: ICON_NAMES as string[], required: true },
    { name: "n", type: "text", required: true, admin: { description: 'Step number, e.g. "01".' } },
    { name: "t", type: "text", required: true, admin: { description: "Title." } },
    { name: "d", type: "textarea", required: true, admin: { description: "Description." } },
  ],
});

export const Treatments: CollectionConfig = {
  slug: "treatments",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "shortName", "_status"],
    group: "Content",
  },
  versions: { drafts: true },
  hooks: revalidateCollection("treatments"),
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
    // ---- Identity ----
    {
      type: "row",
      fields: [
        { name: "slug", type: "text", required: true, unique: true, index: true, admin: { width: "50%", description: "Treatment key (matches the code registry slug)." } },
        { name: "href", type: "text", admin: { width: "50%", description: "Canonical page URL, e.g. /what-is-ivf. The route/registry stays code-owned." } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: { width: "50%", description: "Full treatment name (schema.org MedicalProcedure name)." } },
        { name: "shortName", type: "text", admin: { width: "50%", description: 'Plain label used inside copy ("IVF").' } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "alternateName", type: "text", admin: { width: "50%", description: "Optional alternate name (schema.org alternateName)." } },
        { name: "breadcrumbName", type: "text", admin: { width: "50%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "reviewerSlug", type: "text", admin: { width: "50%", description: "Doctor slug for the medical reviewer (becomes a relationship once entity graph migrates)." } },
        { name: "lastReviewed", type: "text", admin: { width: "50%", description: "Review date, e.g. 2026-06-01." } },
      ],
    },

    // ---- SEO / meta ----
    {
      name: "meta",
      type: "group",
      admin: { description: "Page metadata (title/description/OG image)." },
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        { name: "ogImage", type: "text", admin: { description: "OG image path (an upload relation can replace this later)." } },
      ],
    },

    // ---- schema.org MedicalProcedure ----
    {
      name: "procedure",
      type: "group",
      admin: { description: "schema.org MedicalProcedure fields." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "procedureType", type: "text", admin: { width: "50%", description: "e.g. https://schema.org/NoninvasiveProcedure" } },
            { name: "bodyLocation", type: "text", admin: { width: "50%" } },
          ],
        },
        { name: "howPerformed", type: "textarea" },
        { name: "followup", type: "textarea" },
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
            { name: "h1Em", type: "text", admin: { width: "50%", description: "Italic emphasis fragment." } },
          ],
        },
        { name: "tagline", type: "textarea" },
        valueArray("badges", "Badge"),
        {
          type: "row",
          fields: [
            { name: "image", type: "text", admin: { width: "50%", description: "Hero image path." } },
            { name: "imageAlt", type: "text", admin: { width: "50%" } },
          ],
        },
      ],
    },

    // ---- What is … ----
    {
      name: "whatIs",
      type: "group",
      fields: [
        headingField(),
        textArray("paragraphs"),
        {
          name: "aside",
          type: "group",
          admin: { description: "Optional callout box — leave the title empty to hide." },
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
      fields: [headingField(), { name: "subtitle", type: "textarea" }, valueArray("items", "Benefit")],
    },

    // ---- Types (optional) ----
    {
      name: "types",
      type: "group",
      admin: { description: "Optional 'types of …' icon-card grid — leave empty to hide." },
      fields: [headingField(), { name: "subtitle", type: "textarea" }, iconCardArray("items")],
    },

    // ---- Who needs it ----
    {
      name: "whoNeedsIt",
      type: "group",
      fields: [headingField(), { name: "subtitle", type: "textarea" }, valueArray("items", "Item")],
    },

    // ---- Process ----
    {
      name: "process",
      type: "group",
      fields: [headingField(), { name: "subtitle", type: "textarea" }, stepArray("steps"), { name: "note", type: "textarea" }],
    },

    // ---- Timeline (optional) ----
    {
      name: "timeline",
      type: "group",
      admin: { description: "Optional day-by-day timeline — leave items empty to hide." },
      fields: [
        headingField(),
        { name: "subtitle", type: "textarea" },
        {
          name: "items",
          type: "array",
          labels: { singular: "Timeline item", plural: "Timeline items" },
          fields: [
            { name: "day", type: "text", required: true },
            { name: "t", type: "text", required: true, admin: { description: "Title." } },
            { name: "d", type: "textarea", required: true, admin: { description: "Description." } },
          ],
        },
        valueArray("chips", "Chip"),
        { name: "chipsNote", type: "textarea" },
      ],
    },

    // ---- Video (optional) ----
    {
      name: "video",
      type: "group",
      admin: { description: "Optional explainer video — leave the YouTube id empty to hide." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "id", type: "text", admin: { width: "50%", description: "YouTube video id." } },
            { name: "eyebrow", type: "text", admin: { width: "50%" } },
          ],
        },
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        headingField(),
      ],
    },

    // ---- Technology (optional) ----
    {
      name: "technology",
      type: "group",
      admin: { description: "Optional technology/laboratory icon-card grid — leave items empty to hide." },
      fields: [headingField(), { name: "eyebrow", type: "text" }, { name: "subtitle", type: "textarea" }, iconCardArray("items")],
    },

    // ---- Why us (optional) ----
    {
      name: "whyUs",
      type: "group",
      admin: { description: "Optional 'why Bavishi Fertility Institute' icon-card grid — leave items empty to hide." },
      fields: [headingField(), iconCardArray("items")],
    },

    // ---- Success ----
    {
      name: "success",
      type: "group",
      fields: [valueArray("factors", "Factor"), { name: "note", type: "textarea" }],
    },

    // ---- Cost ----
    {
      name: "cost",
      type: "group",
      fields: [valueArray("includes", "Inclusion")],
    },

    // ---- Risks ----
    {
      name: "risks",
      type: "group",
      fields: [
        headingField(),
        { name: "subtitle", type: "textarea" },
        {
          name: "items",
          type: "array",
          labels: { singular: "Risk", plural: "Risks" },
          fields: [
            { name: "t", type: "text", required: true, admin: { description: "Title." } },
            { name: "d", type: "textarea", required: true, admin: { description: "Description." } },
            { name: "help", type: "textarea", required: true, admin: { description: "How we help." } },
          ],
        },
      ],
    },

    // ---- Preparation (optional) ----
    {
      name: "preparation",
      type: "group",
      admin: { description: "Optional preparation tips — leave items empty to hide." },
      fields: [headingField(), { name: "subtitle", type: "textarea" }, valueArray("items", "Item")],
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

    // ---- Related treatments (cross-links; code-owned registry resolves them) ----
    {
      name: "related",
      type: "array",
      labels: { singular: "Related treatment", plural: "Related treatments" },
      admin: { description: "Other treatment slugs to cross-link (resolved via the code-owned registry)." },
      fields: [{ name: "slug", type: "text", required: true }],
    },

    // ---- CTA ----
    {
      name: "cta",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "heading", type: "text", admin: { width: "50%" } },
            { name: "headingEm", type: "text", admin: { width: "50%", description: "Italic emphasis fragment." } },
          ],
        },
        { name: "subtitle", type: "textarea" },
      ],
    },
  ],
};
