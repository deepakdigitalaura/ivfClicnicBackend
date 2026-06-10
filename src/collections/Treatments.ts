import type { CollectionConfig, Field } from "payload";
import { revalidateCollection } from "@/lib/revalidate";
import { isEditor, isAdminField } from "@/access/roles";
import { ICON_OPTIONS } from "@/lib/icon-map";

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
  label: "Heading",
  fields: [
    { name: "lead", type: "text", required, label: "Heading Text", admin: { description: "Plain heading text before the highlighted word(s)." } },
    { name: "em", type: "text", label: "Highlighted Word(s)", admin: { description: "The word(s) shown in the cursive accent style (optional)." } },
  ],
});

/** Single-column array of short strings, stored as { value }. */
const valueArray = (name: string, label: string): Field => ({
  name,
  type: "array",
  labels: { singular: label, plural: `${label}s` },
  fields: [{ name: "value", type: "text", required: true, label }],
});

/** Paragraph array, stored as { text }. */
const textArray = (name: string, label = "Paragraph"): Field => ({
  name,
  type: "array",
  labels: { singular: label, plural: `${label}s` },
  fields: [{ name: "text", type: "textarea", required: true, label }],
});

/** Icon-card array (icon name + title + description) — types/technology/whyUs. */
const iconCardArray = (name: string): Field => ({
  name,
  type: "array",
  labels: { singular: "Card", plural: "Cards" },
  fields: [
    { name: "icon", type: "select", options: ICON_OPTIONS, required: true, label: "Icon", admin: { description: "Pick the icon shown on this card." } },
    { name: "t", type: "text", required: true, label: "Title" },
    { name: "d", type: "textarea", required: true, label: "Description" },
  ],
});

/** Numbered process-step array (icon + step number + title + description). */
const stepArray = (name: string): Field => ({
  name,
  type: "array",
  labels: { singular: "Step", plural: "Steps" },
  fields: [
    { name: "icon", type: "select", options: ICON_OPTIONS, required: true, label: "Icon", admin: { description: "Pick the icon shown on this step." } },
    { name: "n", type: "text", required: true, label: "Step Number", admin: { description: 'Step number, e.g. "01".' } },
    { name: "t", type: "text", required: true, label: "Title" },
    { name: "d", type: "textarea", required: true, label: "Description" },
  ],
});

/* Every treatment field, defined once and grouped into admin Tabs below
 * (UNNAMED tabs → stored data shape is unchanged; no migration / type / resolver
 * / seed change). Purely a cleaner editing experience. */
const TREATMENT_FIELDS: Field[] = [
    // ---- Identity ----
    {
      type: "row",
      fields: [
        { name: "slug", type: "text", required: true, unique: true, index: true, label: "Page ID", access: { update: isAdminField }, admin: { width: "50%", description: "The page's web address ID. Set when creating — ask the website team to change it later." } },
        { name: "href", type: "text", label: "Page URL", access: { update: isAdminField }, admin: { width: "50%", description: "The full web address for this page. Managed by the website team." } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, label: "Treatment Name", admin: { width: "50%", description: "Full treatment name." } },
        { name: "shortName", type: "text", label: "Short Name", admin: { width: "50%", description: 'Plain label used inside copy ("IVF").' } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "alternateName", type: "text", label: "Alternate Name", admin: { width: "50%", description: "Optional alternate name for the treatment." } },
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

    // ---- SEO / meta ----
    {
      name: "meta",
      type: "group",
      label: "Search Engine & Social Preview",
      admin: { description: "Controls how this page looks in Google results and when shared. Leave empty to use the built-in defaults." },
      fields: [
        { name: "title", type: "text", label: "Google Page Title", admin: { description: "The clickable title shown in Google. Aim for ~55–60 characters so it isn't cut off." } },
        { name: "description", type: "textarea", label: "Google Search Description", admin: { description: "The grey summary under the title in Google. Aim for ~150–160 characters." } },
        { name: "ogImage", type: "text", label: "Social Share Image Path", admin: { description: "Image path used when shared on social media. Ask the website team to add new images." } },
      ],
    },

    // ---- schema.org MedicalProcedure ----
    {
      name: "procedure",
      type: "group",
      label: "Search Engine Category (website team)",
      access: { update: isAdminField },
      admin: { description: "Search-engine procedure details. Managed by the website team." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "procedureType", type: "text", label: "Procedure Type", admin: { width: "50%", description: "Managed by the website team." } },
            { name: "bodyLocation", type: "text", label: "Body Location", admin: { width: "50%", description: "Managed by the website team." } },
          ],
        },
        { name: "howPerformed", type: "textarea", label: "How Performed", admin: { description: "Managed by the website team." } },
        { name: "followup", type: "textarea", label: "Follow-up", admin: { description: "Managed by the website team." } },
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
        valueArray("badges", "Badge"),
        {
          type: "row",
          fields: [
            { name: "image", type: "text", label: "Hero Image Path", admin: { width: "50%", description: "Image path, e.g. /assets/.... Ask the website team to add new images." } },
            { name: "imageAlt", type: "text", label: "Image Alt Text", admin: { width: "50%", description: "Describes the image for accessibility." } },
          ],
        },
      ],
    },

    // ---- What is … ----
    {
      name: "whatIs",
      type: "group",
      label: "What Is This Treatment",
      fields: [
        headingField(),
        textArray("paragraphs"),
        {
          name: "aside",
          type: "group",
          label: "Callout Box",
          admin: { description: "Optional callout box — leave the title empty to hide." },
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
      fields: [headingField(), { name: "subtitle", type: "textarea", label: "Sub-heading" }, valueArray("items", "Benefit")],
    },

    // ---- Types (optional) ----
    {
      name: "types",
      type: "group",
      label: "Types",
      admin: { description: "Optional 'types of …' icon-card grid — leave empty to hide." },
      fields: [headingField(), { name: "subtitle", type: "textarea", label: "Sub-heading" }, iconCardArray("items")],
    },

    // ---- Who needs it ----
    {
      name: "whoNeedsIt",
      type: "group",
      label: "Who Needs This Treatment",
      fields: [headingField(), { name: "subtitle", type: "textarea", label: "Sub-heading" }, valueArray("items", "Item")],
    },

    // ---- Process ----
    {
      name: "process",
      type: "group",
      label: "Process",
      fields: [headingField(), { name: "subtitle", type: "textarea", label: "Sub-heading" }, stepArray("steps"), { name: "note", type: "textarea", label: "Note" }],
    },

    // ---- Timeline (optional) ----
    {
      name: "timeline",
      type: "group",
      label: "Timeline",
      admin: { description: "Optional day-by-day timeline — leave items empty to hide." },
      fields: [
        headingField(),
        { name: "subtitle", type: "textarea", label: "Sub-heading" },
        {
          name: "items",
          type: "array",
          labels: { singular: "Timeline Item", plural: "Timeline Items" },
          fields: [
            { name: "day", type: "text", required: true, label: "Day" },
            { name: "t", type: "text", required: true, label: "Title" },
            { name: "d", type: "textarea", required: true, label: "Description" },
          ],
        },
        valueArray("chips", "Chip"),
        { name: "chipsNote", type: "textarea", label: "Chips Note" },
      ],
    },

    // ---- Video (optional) ----
    {
      name: "video",
      type: "group",
      label: "Video",
      admin: { description: "Optional explainer video — leave the YouTube id empty to hide." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "id", type: "text", label: "YouTube Video ID", admin: { width: "50%", description: "The ID from the YouTube link (the part after watch?v=)." } },
            { name: "eyebrow", type: "text", label: "Small Label Above Heading", admin: { width: "50%" } },
          ],
        },
        { name: "title", type: "text", label: "Title" },
        { name: "description", type: "textarea", label: "Description" },
        headingField(),
      ],
    },

    // ---- Technology (optional) ----
    {
      name: "technology",
      type: "group",
      label: "Technology",
      admin: { description: "Optional technology/laboratory icon-card grid — leave items empty to hide." },
      fields: [headingField(), { name: "eyebrow", type: "text", label: "Small Label Above Heading" }, { name: "subtitle", type: "textarea", label: "Sub-heading" }, iconCardArray("items")],
    },

    // ---- Why us (optional) ----
    {
      name: "whyUs",
      type: "group",
      label: "Why Choose Us",
      admin: { description: "Optional 'why Bavishi Fertility Institute' icon-card grid — leave items empty to hide." },
      fields: [headingField(), iconCardArray("items")],
    },

    // ---- Success ----
    {
      name: "success",
      type: "group",
      label: "Success Factors",
      fields: [valueArray("factors", "Factor"), { name: "note", type: "textarea", label: "Note" }],
    },

    // ---- Cost ----
    {
      name: "cost",
      type: "group",
      label: "Cost",
      fields: [valueArray("includes", "Inclusion")],
    },

    // ---- Risks ----
    {
      name: "risks",
      type: "group",
      label: "Risks",
      fields: [
        headingField(),
        { name: "subtitle", type: "textarea", label: "Sub-heading" },
        {
          name: "items",
          type: "array",
          labels: { singular: "Risk", plural: "Risks" },
          fields: [
            { name: "t", type: "text", required: true, label: "Title" },
            { name: "d", type: "textarea", required: true, label: "Description" },
            { name: "help", type: "textarea", required: true, label: "How We Help" },
          ],
        },
      ],
    },

    // ---- Preparation (optional) ----
    {
      name: "preparation",
      type: "group",
      label: "Preparation",
      admin: { description: "Optional preparation tips — leave items empty to hide." },
      fields: [headingField(), { name: "subtitle", type: "textarea", label: "Sub-heading" }, valueArray("items", "Item")],
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

    // ---- Related treatments (cross-links; code-owned registry resolves them) ----
    {
      name: "related",
      type: "array",
      labels: { singular: "Related Treatment", plural: "Related Treatments" },
      admin: { description: "Other treatment IDs to cross-link." },
      fields: [{ name: "slug", type: "text", required: true, label: "Treatment ID" }],
    },

    // ---- CTA ----
    {
      name: "cta",
      type: "group",
      label: "Closing Call-to-Action",
      fields: [
        {
          type: "row",
          fields: [
            { name: "heading", type: "text", label: "Heading Text", admin: { width: "50%" } },
            { name: "headingEm", type: "text", label: "Highlighted Word(s)", admin: { width: "50%", description: "The word(s) shown in the cursive accent style." } },
          ],
        },
        { name: "subtitle", type: "textarea", label: "Sub-heading" },
      ],
    },
];

export const Treatments: CollectionConfig = {
  slug: "treatments",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "shortName", "_status"],
    group: "Treatments & Services",
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
  // Grouped into Tabs (unnamed) so editors see one short section at a time.
  fields: [
    {
      type: "tabs",
      tabs: [
        { label: "Basics & SEO", fields: TREATMENT_FIELDS.slice(0, 6) },
        { label: "Top Section", fields: TREATMENT_FIELDS.slice(6, 7) },
        { label: "Overview", fields: TREATMENT_FIELDS.slice(7, 11) },
        { label: "Process & Timeline", fields: TREATMENT_FIELDS.slice(11, 14) },
        { label: "Technology & Why Us", fields: TREATMENT_FIELDS.slice(14, 17) },
        { label: "Cost & Risks", fields: TREATMENT_FIELDS.slice(17, 20) },
        { label: "FAQs & Related", fields: TREATMENT_FIELDS.slice(20, 22) },
        { label: "Closing CTA", fields: TREATMENT_FIELDS.slice(22) },
      ],
    },
  ],
};
