import type { CollectionConfig, Field } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { BlocksFeature } from "@payloadcms/richtext-lexical";
import { seoField } from "@/fields/seo";
import { revalidateCollection } from "@/lib/revalidate";
import { isEditor } from "@/access/roles";
import { ARTICLE_BLOCKS } from "@/blocks/articleBlocks";

/**
 * Blog posts. Net-new content type rendered at /blog/[slug] (additive routes).
 *
 * E-E-A-T: `author` (required) and `reviewedBy` (optional medical reviewer) are
 * SEPARATE relationships — for YMYL fertility content the writer and the medical
 * reviewer are distinct roles and must not be conflated. Both point to `authors`
 * now; Phase 4 will allow `reviewedBy` to resolve to a Doctor entity too.
 *
 * `treatmentSlugs` keeps the existing slug-matching contract used by
 * `blogsForTreatment()` — it becomes a real relationship to `treatments` in
 * Phase 5 (treatment-page related-blogs are deliberately untouched until then).
 *
 * Drafts on; public reads published-only; edits bust `blogs` + `blogs:<slug>`.
 */
/* Friendly dropdown options for treatmentSlugs/locationSlugs — non-technical
 * editors pick a name, the stored value is still the plain slug string (same
 * column type as a text field, so this is a config-only change: no schema
 * migration, no change to how blogsForTreatment()/getBlogsByTreatmentSlug()
 * read the data). Mirrors TREATMENTS_REGISTRY (src/lib/treatments.ts) and
 * CITIES (src/lib/locations.ts) — kept as a flat literal here rather than
 * importing those files directly, since they pull in icon components and
 * other page-template dependencies this collection config doesn't need.
 * Add new treatments/cities to BOTH places when they're introduced. */
const TREATMENT_OPTIONS = [
  { label: "IVF", value: "ivf" },
  { label: "ICSI", value: "icsi" },
  { label: "IUI", value: "iui" },
  { label: "PICSI", value: "picsi" },
  { label: "IMSI", value: "imsi" },
  { label: "MACS", value: "macs" },
  { label: "Spindle View ICSI", value: "spindle-view-icsi" },
  { label: "Blastocyst Transfer", value: "blastocyst-transfer" },
  { label: "Laser Assisted Hatching", value: "laser-hatching" },
  { label: "IVF Failure", value: "ivf-failure" },
  { label: "Egg Donation", value: "egg-donation" },
  { label: "Sperm Donation", value: "sperm-donation" },
  { label: "Embryo Donation", value: "embryo-donation" },
  { label: "Male Infertility", value: "male-infertility" },
  { label: "Female Infertility", value: "female-infertility" },
  { label: "Fertility Preservation", value: "fertility-preservation" },
  { label: "Endometriosis", value: "endometriosis" },
  { label: "Zero Sperm Count (Azoospermia)", value: "azoospermia" },
  { label: "Cryopreservation", value: "cryopreservation" },
  { label: "Recurrent Miscarriage", value: "recurrent-miscarriage" },
  { label: "Low Sperm Count (Oligospermia)", value: "oligospermia" },
  { label: "Low Sperm Motility (Asthenospermia)", value: "asthenospermia" },
  { label: "Surgical Sperm Retrieval", value: "surgical-sperm-retrieval" },
  { label: "Varicocele", value: "varicocele" },
  { label: "Erectile Dysfunction", value: "erectile-dysfunction" },
  { label: "Conceive Naturally", value: "conceive-naturally" },
  { label: "PRP Infertility", value: "prp-infertility" },
  { label: "PCOS", value: "pcos" },
  { label: "Poor Ovarian Reserve / Low AMH", value: "ovarian-reserve" },
  { label: "Ovarian Rejuvenation", value: "ovarian-rejuvenation" },
  { label: "Fibroids", value: "fibroids" },
];

const LOCATION_OPTIONS = [
  { label: "Ahmedabad", value: "ahmedabad" },
  { label: "Mumbai", value: "mumbai" },
  { label: "Vadodara", value: "vadodara" },
  { label: "Surat", value: "surat" },
  { label: "Bhuj", value: "bhuj" },
  { label: "Bhavnagar", value: "bhavnagar" },
  { label: "Anand", value: "anand" },
  { label: "Varanasi", value: "varanasi" },
];

/* Blog fields, defined once and grouped into admin Tabs below (UNNAMED tabs →
 * stored data shape unchanged). Cleaner editing only. */
const BLOG_FIELDS: Field[] = [
    { name: "title", type: "text", required: true, label: "Title" },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Page URL",
      admin: { description: "The web address for this article (→ /blog/<this>). Changing it breaks existing links and Google rankings, so set it once and leave it." },
    },
    { name: "excerpt", type: "textarea", label: "Short Summary", admin: { description: "Short summary shown on cards and used as the Google search description if none is set." } },
    { name: "heroImage", type: "upload", relationTo: "media", label: "Cover Image" },
    {
      name: "heroTextDark",
      type: "checkbox",
      label: "Dark text on hero card",
      defaultValue: false,
      admin: {
        description: "Tick this if the LEFT side of the cover image is LIGHT (cream / white / grey). The in-article title overlay will use dark plum text so it's readable. Leave un-ticked for images that have a dark left side — white text is used instead.",
      },
    },
    {
      name: "content",
      type: "richText",
      label: "Article Body",
      // Field-level editor (instead of the global default) adds the
      // graphical content blocks (stat strip, comparison table, highlight
      // card, decision list) on top of the default text features — used to
      // turn flat heading+bullet sections into scannable, visual ones.
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({ blocks: ARTICLE_BLOCKS }),
        ],
      }),
    },
    {
      type: "row",
      fields: [
        {
          name: "author",
          type: "relationship",
          relationTo: "authors",
          required: true,
          label: "Author",
          admin: { width: "50%", description: "Who wrote the article." },
        },
        {
          name: "reviewedBy",
          type: "relationship",
          relationTo: "authors",
          label: "Medically Reviewed By",
          admin: { width: "50%", description: "Optional medical reviewer who checked the article." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "category", type: "relationship", relationTo: "categories", label: "Category", admin: { width: "50%" } },
        { name: "readMins", type: "number", label: "Read Time (minutes)", admin: { width: "50%", description: "Estimated read time in minutes." } },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Published Date",
      admin: { description: "The date shown on the article. Leave blank to use today." },
    },
    {
      name: "lastUpdatedAt",
      type: "date",
      label: "Last Updated Date",
      admin: { description: "Shown as 'Last updated' on the article and used for the search-engine dateModified signal. Leave blank to use the Published Date." },
    },
    {
      name: "treatmentSlugs",
      type: "array",
      labels: { singular: "Related Treatment", plural: "Related Treatments" },
      admin: { description: "Treatment pages this article links to (drives the Related Articles list on those pages). Click 'Add Related Treatment' and pick from the list." },
      fields: [{ name: "slug", type: "select", required: true, label: "Treatment", options: TREATMENT_OPTIONS }],
    },
    {
      name: "locationSlugs",
      type: "array",
      labels: { singular: "Related Location", plural: "Related Locations" },
      admin: { description: "City pages this article links to (drives the Related Articles list on those pages). Click 'Add Related Location' and pick from the list." },
      fields: [{ name: "slug", type: "select", required: true, label: "City", options: LOCATION_OPTIONS }],
    },
    {
      name: "faqs",
      type: "array",
      labels: { singular: "FAQ", plural: "FAQs" },
      admin: { description: "Optional. Adds an FAQ accordion to the article and FAQPage search-engine markup." },
      fields: [
        { name: "question", type: "text", required: true, label: "Question" },
        { name: "answer", type: "textarea", required: true, label: "Answer" },
      ],
    },
    seoField,
];

export const Blogs: CollectionConfig = {
  slug: "blogs",
  labels: { singular: "Article", plural: "Articles" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "author", "_status", "publishedAt"],
    group: "Blog",
    // No `admin.preview` (front-end draft preview) on purpose: the public
    // /blog/[slug] is pure SSG and does not read draftMode(), so a front-end
    // preview link would show the published version, not the draft. Editors
    // preview drafts inside Payload's admin version view. The /preview infra
    // and getBlogBySlugDraft remain available if blogs ever move to dynamic.
  },
  versions: { drafts: true },
  hooks: revalidateCollection("blogs"),
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
        { label: "Article", fields: BLOG_FIELDS.slice(0, 6) },
        { label: "Details", fields: BLOG_FIELDS.slice(6, 10) },
        { label: "Tagging", fields: BLOG_FIELDS.slice(10, 12) },
        { label: "FAQs & SEO", fields: BLOG_FIELDS.slice(12) },
      ],
    },
  ],
};
