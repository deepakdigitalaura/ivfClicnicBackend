import type { Field, GlobalConfig } from "payload";
import { seoField } from "@/fields/seo";
import { revalidateGlobal } from "@/lib/revalidate";
import { isEditor } from "@/access/roles";
import { ICON_OPTIONS } from "@/lib/icon-map";

/**
 * Homepage → CMS source of truth for the homepage's EDITORIAL content
 * (Wave 4.2): hero copy, stats, the two "Why" blocks, the Suraksha section,
 * awards, events, video IDs, FAQs and the final CTA. The page's layout,
 * component hierarchy, calculators, dynamic Doctors/Treatments sections, review
 * aggregation and the blog listing all stay CODE-OWNED — only editorial copy
 * becomes editable here.
 *
 * Mirrors the typed HOMEPAGE_DEFAULTS fallback in src/lib/homepage.ts so output
 * is byte-identical when the CMS is empty (same convention as Header/Footer).
 * Headings are split into a plain "lead" + decorative "em" word so the styled
 * markup stays in the component. The Lucide "Why Bavishi" card icon is a curated
 * `select` (ICON_NAMES, shared with Services). Ends with the shared `seoField`
 * (no new SEO pattern, no schema drift) which drives the page's generateMetadata.
 * Standard `revalidateGlobal` hook busts `global:homepage` on edit (the tag the
 * `/` route reads through), keeping the page static + on-demand ISR. RBAC:
 * editors update content; admins inherit via isEditor.
 */

/** A reusable { lead, em } heading group — the plain lead text plus the
 *  decorative <em> word(s) the component styles per section. */
const headingGroup = (description: string): Field => ({
  name: "heading",
  type: "group",
  label: "Heading",
  admin: { description },
  fields: [
    { name: "lead", type: "text", label: "Heading Text", admin: { description: "Plain heading text before the highlighted word(s). Leave empty to keep the built-in heading." } },
    { name: "em", type: "text", label: "Highlighted Word(s)", admin: { description: "The word(s) shown in the cursive accent style at the end of the heading." } },
  ],
});

export const Homepage: GlobalConfig = {
  slug: "homepage",
  access: { read: () => true, update: isEditor },
  admin: { group: "Website Pages" },
  hooks: revalidateGlobal("homepage"),
  fields: [
    {
      name: "hero",
      type: "group",
      label: "Top Section",
      admin: { description: "The banner at the very top of the homepage — text only. The hero image is managed by the website team." },
      fields: [
        { name: "eyebrow", type: "text", label: "Small Label Above Heading", admin: { description: "Small label above the headline. Leave empty to use the default." } },
        { name: "headline", type: "text", label: "Page Heading", admin: { description: "The main headline. Leave empty to keep the built-in hero." } },
        { name: "headlineItalic", type: "text", label: "Highlighted Word in Heading", admin: { description: "The one word in the headline shown in the cursive accent style." } },
        { name: "paragraph", type: "textarea", label: "Intro Paragraph", admin: { description: "The sub-heading paragraph under the headline." } },
        { name: "badges", type: "array", labels: { singular: "Badge", plural: "Badges" }, admin: { description: "Trust badges shown under the paragraph." }, fields: [{ name: "text", type: "text", required: true, label: "Badge Text" }] },
        { name: "ctas", type: "array", labels: { singular: "Button", plural: "Buttons" }, admin: { description: "Up to three button labels (the first is the main button). Icons and order are managed by the website team." }, fields: [{ name: "text", type: "text", required: true, label: "Button Text" }] },
        { name: "floatingBadge", type: "text", label: "Floating Award Chip", admin: { description: "Text on the small floating award chip over the hero image." } },
      ],
    },
    {
      name: "stats",
      type: "array",
      labels: { singular: "Stat", plural: "Stats" },
      admin: { description: "The scrolling stats strip. Leave empty to use the built-in stats." },
      fields: [
        { name: "value", type: "text", required: true, label: "Figure", admin: { description: "Headline figure, e.g. '30,000+'." } },
        { name: "label", type: "text", required: true, label: "Caption", admin: { description: "Caption under the figure." } },
      ],
    },
    {
      name: "whyBavishi",
      type: "group",
      label: "Why Bavishi Cards",
      admin: { description: "'Why Bavishi Fertility Center' — the four icon cards." },
      fields: [
        { name: "eyebrow", type: "text", label: "Small Label Above Heading" },
        headingGroup("Section heading. Leave empty to keep the default."),
        { name: "subtitle", type: "textarea", label: "Sub-heading" },
        {
          name: "cards",
          type: "array",
          labels: { singular: "Card", plural: "Cards" },
          admin: { description: "Leave empty to use the built-in cards." },
          fields: [
            { name: "icon", type: "select", options: ICON_OPTIONS, label: "Card Icon", admin: { description: "Pick the icon shown on the card." } },
            { name: "t", type: "text", required: true, label: "Title", admin: { description: "Card title." } },
            { name: "d", type: "textarea", required: true, label: "Description", admin: { description: "Card description." } },
          ],
        },
      ],
    },
    {
      name: "whyChoose",
      type: "group",
      label: "Why Choose Us Pillars",
      admin: { description: "'Why Choose Bavishi Fertility Institute?' — the Simple / Safe / Smart / Successful pillars." },
      fields: [
        { name: "eyebrow", type: "text", label: "Small Label Above Heading" },
        headingGroup("Section heading. Leave empty to keep the default."),
        { name: "subtitle", type: "textarea", label: "Sub-heading" },
        {
          name: "blocks",
          type: "array",
          labels: { singular: "Pillar", plural: "Pillars" },
          admin: { description: "Leave empty to use the built-in pillars." },
          fields: [
            { name: "icon", type: "text", label: "Pillar Icon Image", admin: { description: "Web address of the pillar icon image, e.g. /assets/Simple-1.png. Ask the website team if unsure." } },
            { name: "alt", type: "text", label: "Icon Alt Text", admin: { description: "Describes the icon for accessibility." } },
            { name: "title", type: "text", required: true, label: "Pillar Title" },
            { name: "subtitle", type: "text", label: "Pillar Sub-title" },
            {
              name: "points",
              type: "array",
              labels: { singular: "Point", plural: "Points" },
              fields: [
                { name: "h", type: "text", required: true, label: "Point Heading", admin: { description: "Point heading." } },
                { name: "d", type: "text", required: true, label: "Point Detail", admin: { description: "Point detail." } },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "suraksha",
      type: "group",
      label: "Suraksha Kavach Section",
      admin: { description: "The Suraksha Kavach section." },
      fields: [
        { name: "badge", type: "text", label: "Pill Label", admin: { description: "Small pill label above the heading." } },
        headingGroup("Section heading. Leave empty to keep the default."),
        { name: "paragraph", type: "textarea", label: "Paragraph" },
        { name: "features", type: "array", labels: { singular: "Feature", plural: "Features" }, fields: [{ name: "text", type: "text", required: true, label: "Feature Text" }] },
        {
          name: "primaryCta",
          type: "group",
          label: "Main Button",
          admin: { description: "The main button." },
          fields: [
            { name: "label", type: "text", label: "Button Text" },
            { name: "href", type: "text", label: "Button Link" },
          ],
        },
        {
          name: "secondaryCta",
          type: "group",
          label: "Secondary Button",
          admin: { description: "The secondary button." },
          fields: [
            { name: "label", type: "text", label: "Button Text" },
            { name: "href", type: "text", label: "Button Link" },
          ],
        },
        { name: "image", type: "text", label: "Section Image", admin: { description: "Web address of the section image. Leave empty to use the default." } },
        { name: "imageAlt", type: "text", label: "Image Alt Text" },
      ],
    },
    {
      name: "awards",
      type: "group",
      label: "Awards & Recognition",
      admin: { description: "The Awards & Recognition carousel." },
      fields: [
        { name: "eyebrow", type: "text", label: "Small Label Above Heading" },
        headingGroup("Section heading. Leave empty to keep the default."),
        { name: "subtitle", type: "textarea", label: "Sub-heading" },
        {
          name: "items",
          type: "array",
          labels: { singular: "Award", plural: "Awards" },
          admin: { description: "Leave empty to use the built-in awards." },
          fields: [
            { name: "img", type: "text", required: true, label: "Award Image", admin: { description: "Web address of the award image." } },
            { name: "title", type: "text", required: true, label: "Award Title" },
            { name: "desc", type: "text", label: "Sub-line", admin: { description: "Small line under the award title." } },
          ],
        },
      ],
    },
    {
      name: "events",
      type: "group",
      label: "Upcoming Events",
      admin: { description: "The Upcoming Events posters." },
      fields: [
        { name: "eyebrow", type: "text", label: "Small Label Above Heading" },
        headingGroup("Section heading. Leave empty to keep the default."),
        {
          name: "posters",
          type: "array",
          labels: { singular: "Poster", plural: "Posters" },
          admin: { description: "Leave empty to use the built-in posters." },
          fields: [
            { name: "src", type: "text", required: true, label: "Poster Image", admin: { description: "Web address of the poster image." } },
            { name: "alt", type: "text", required: true, label: "Image Alt Text" },
          ],
        },
      ],
    },
    {
      name: "videos",
      type: "group",
      label: "Videos",
      admin: { description: "YouTube video IDs for the three video grids. Section titles are managed by the website team." },
      fields: [
        {
          name: "stories",
          type: "array",
          labels: { singular: "Patient story", plural: "Patient stories" },
          admin: { description: "Success-story videos. Leave empty to use the built-in set." },
          fields: [
            { name: "id", type: "text", required: true, label: "YouTube Video ID", admin: { description: "The ID from the YouTube link (the part after watch?v=)." } },
            { name: "n", type: "text", required: true, label: "Patient Name", admin: { description: "Patient name." } },
            { name: "q", type: "textarea", required: true, label: "Quote", admin: { description: "Quote from the patient." } },
            { name: "r", type: "number", defaultValue: 5, label: "Star Rating (1–5)", admin: { description: "Star rating from 1 to 5." } },
          ],
        },
        {
          name: "edu",
          type: "array",
          labels: { singular: "Education video", plural: "Education videos" },
          admin: { description: "Educational videos. Leave empty to use the built-in set." },
          fields: [
            { name: "id", type: "text", required: true, label: "YouTube Video ID", admin: { description: "The ID from the YouTube link (the part after watch?v=)." } },
            { name: "t", type: "text", required: true, label: "Title", admin: { description: "Video title." } },
            { name: "d", type: "textarea", required: true, label: "Description", admin: { description: "Video description." } },
          ],
        },
        {
          name: "resources",
          type: "array",
          labels: { singular: "Resource video", plural: "Resource videos" },
          admin: { description: "Resource videos. Leave empty to use the built-in set." },
          fields: [
            { name: "id", type: "text", required: true, label: "YouTube Video ID", admin: { description: "The ID from the YouTube link (the part after watch?v=)." } },
            { name: "c", type: "text", required: true, label: "Category Tag", admin: { description: "Short category tag." } },
            { name: "t", type: "text", required: true, label: "Title", admin: { description: "Video title." } },
            { name: "date", type: "text", required: true, label: "Byline", admin: { description: "Byline / author." } },
          ],
        },
      ],
    },
    {
      name: "faq",
      type: "group",
      label: "FAQs",
      admin: { description: "The homepage FAQ accordion." },
      fields: [
        { name: "eyebrow", type: "text", label: "Small Label Above Heading" },
        headingGroup("Section heading. Leave empty to keep the default."),
        {
          name: "items",
          type: "array",
          labels: { singular: "FAQ", plural: "FAQs" },
          admin: { description: "Leave empty to use the built-in FAQs." },
          fields: [
            { name: "q", type: "text", required: true, label: "Question", admin: { description: "The question visitors read before expanding the answer." } },
            { name: "a", type: "textarea", required: true, label: "Answer", admin: { description: "The answer shown when expanded." } },
          ],
        },
      ],
    },
    {
      name: "finalCta",
      type: "group",
      label: "Closing Call-to-Action",
      admin: { description: "The closing call-to-action band at the bottom of the homepage." },
      fields: [
        { name: "eyebrow", type: "text", label: "Small Label Above Heading" },
        headingGroup("Section heading. Leave empty to keep the default."),
        { name: "paragraph", type: "textarea", label: "Paragraph" },
        {
          name: "stats",
          type: "array",
          labels: { singular: "Counter", plural: "Counters" },
          admin: { description: "Animated counters. Leave empty to use the built-in counters." },
          fields: [
            { name: "v", type: "number", required: true, label: "Number", admin: { description: "The number it counts up to." } },
            { name: "s", type: "text", label: "Suffix", admin: { description: "Suffix after the number, e.g. '+'." } },
            { name: "l", type: "text", required: true, label: "Label", admin: { description: "Caption under the number." } },
          ],
        },
        { name: "ctas", type: "array", labels: { singular: "Button", plural: "Buttons" }, admin: { description: "Up to three button labels. Icons and order are managed by the website team." }, fields: [{ name: "text", type: "text", required: true, label: "Button Text" }] },
      ],
    },
    seoField,
  ],
};
