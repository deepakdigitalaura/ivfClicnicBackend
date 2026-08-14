import { defineType, defineField } from "sanity";

/* =====================================================================
 * Press clippings (Media & Press coverage — /press hub + /press/<slug>).
 * ---------------------------------------------------------------------
 * Mirrors the PressClipping type in src/lib/press.ts field-for-field.
 * `image`/`thumb` are plain string URLs for BOTH the migrated legacy
 * clippings (their exact current public-folder path, to guarantee
 * byte-identical URLs against the pre-migration hardcoded array) AND new
 * clippings added via the admin panel (a Sanity CDN URL, uploaded through
 * the same /api/admin/upload-image endpoint the rest of the admin panel
 * uses — see src/app/admin-panel/(app)/_components/image-upload.tsx).
 *
 * DATA HONESTY (same rules as src/lib/press.ts): headline/bodyText must be
 * faithfully transcribed from the real clipping, never invented or
 * paraphrased; Gujarati stays in Gujarati; `date` is omitted rather than
 * guessed when the clipping carries no legible date.
 * ===================================================================== */

export default defineType({
  name: "press",
  title: "Press Clipping",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "headline", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({ name: "headline", title: "Headline (English)", type: "string", validation: (R) => R.required() }),
    defineField({ name: "headlineOriginal", title: "Headline (Original Language)", type: "string" }),
    defineField({ name: "standfirst", title: "Standfirst / Sub-headline", type: "text", rows: 2 }),
    defineField({ name: "publication", title: "Publication", type: "string", validation: (R) => R.required() }),
    defineField({ name: "edition", title: "Edition / City", type: "string" }),
    defineField({
      name: "date",
      title: "Date",
      type: "string",
      description: "Human date label as printed on the clipping — leave blank if no legible date (never guess).",
    }),
    defineField({ name: "byline", title: "Byline", type: "string" }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: ["English", "Gujarati"] },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "Short factual description — used only for meta/OG descriptions, not shown as page copy.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "bodyText",
      title: "Body Text",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      description: "Full transcribed article, one paragraph per entry, in the language it was printed in.",
    }),
    defineField({
      name: "doctorsQuoted",
      title: "Doctors Quoted",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "image",
      title: "Full-Resolution Scan",
      type: "string",
      description: "Image URL — either a legacy /assets/media/press/... public path, or a Sanity CDN URL uploaded via the admin panel.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "thumb",
      title: "Grid Thumbnail",
      type: "string",
      description: "Image URL — either a legacy /assets/media/press/... public path, or a Sanity CDN URL uploaded via the admin panel.",
      validation: (R) => R.required(),
    }),
    defineField({ name: "width", title: "Image Width (px)", type: "number" }),
    defineField({ name: "height", title: "Image Height (px)", type: "number" }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 0 }),
    defineField({ name: "published", title: "Visible on site", type: "boolean", initialValue: true }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "headline", publication: "publication", date: "date", published: "published" },
    prepare({ title, publication, date, published }) {
      return {
        title: title || "Untitled",
        subtitle: `${publication ?? ""}${date ? " · " + date : ""} · ${published === false ? "Hidden" : "Visible"}`,
      };
    },
  },
});
