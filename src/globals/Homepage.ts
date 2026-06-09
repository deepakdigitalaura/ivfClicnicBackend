import type { Field, GlobalConfig } from "payload";
import { seoField } from "@/fields/seo";
import { revalidateGlobal } from "@/lib/revalidate";
import { isEditor } from "@/access/roles";
import { ICON_NAMES } from "@/lib/icon-map";

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
  admin: { description },
  fields: [
    { name: "lead", type: "text", admin: { description: "Plain heading text before the highlighted word(s). Empty keeps the default heading." } },
    { name: "em", type: "text", admin: { description: "The highlighted (italic) word(s) at the end of the heading." } },
  ],
});

export const Homepage: GlobalConfig = {
  slug: "homepage",
  access: { read: () => true, update: isEditor },
  admin: { group: "Homepage" },
  hooks: revalidateGlobal("homepage"),
  fields: [
    {
      name: "hero",
      type: "group",
      admin: { description: "Top hero — copy only. The hero image stays code-owned (LCP-optimised)." },
      fields: [
        { name: "eyebrow", type: "text", admin: { description: "Small label above the headline. Empty uses the default." } },
        { name: "headline", type: "text", admin: { description: "Full headline text. Empty keeps the default hero." } },
        { name: "headlineItalic", type: "text", admin: { description: "The single word inside the headline rendered in the accent italic style." } },
        { name: "paragraph", type: "textarea", admin: { description: "Sub-headline paragraph." } },
        { name: "badges", type: "array", labels: { singular: "Badge", plural: "Badges" }, admin: { description: "Trust badges under the paragraph." }, fields: [{ name: "text", type: "text", required: true }] },
        { name: "ctas", type: "array", labels: { singular: "Button", plural: "Buttons" }, admin: { description: "Up to three button labels (first is the primary button). Icons/order stay code-owned." }, fields: [{ name: "text", type: "text", required: true }] },
        { name: "floatingBadge", type: "text", admin: { description: "Floating award chip text on the hero image." } },
      ],
    },
    {
      name: "stats",
      type: "array",
      labels: { singular: "Stat", plural: "Stats" },
      admin: { description: "Scrolling stats strip. Empty falls back to the built-in stats." },
      fields: [
        { name: "value", type: "text", required: true, admin: { description: "Headline figure, e.g. '30,000+'." } },
        { name: "label", type: "text", required: true, admin: { description: "Caption under the figure." } },
      ],
    },
    {
      name: "whyBavishi",
      type: "group",
      admin: { description: "'Why Bavishi Fertility Center' — the four icon cards." },
      fields: [
        { name: "eyebrow", type: "text" },
        headingGroup("Section heading. Empty keeps the default."),
        { name: "subtitle", type: "textarea" },
        {
          name: "cards",
          type: "array",
          labels: { singular: "Card", plural: "Cards" },
          admin: { description: "Empty falls back to the built-in cards." },
          fields: [
            { name: "icon", type: "select", options: ICON_NAMES.map((n) => ({ label: n, value: n })), admin: { description: "Lucide icon name." } },
            { name: "t", type: "text", required: true, admin: { description: "Card title." } },
            { name: "d", type: "textarea", required: true, admin: { description: "Card description." } },
          ],
        },
      ],
    },
    {
      name: "whyChoose",
      type: "group",
      admin: { description: "'Why Choose Bavishi Fertility Institute?' — the Simple / Safe / Smart / Successful pillars." },
      fields: [
        { name: "eyebrow", type: "text" },
        headingGroup("Section heading. Empty keeps the default."),
        { name: "subtitle", type: "textarea" },
        {
          name: "blocks",
          type: "array",
          labels: { singular: "Pillar", plural: "Pillars" },
          admin: { description: "Empty falls back to the built-in pillars." },
          fields: [
            { name: "icon", type: "text", admin: { description: "Pillar icon image URL, e.g. /assets/Simple-1.png." } },
            { name: "alt", type: "text", admin: { description: "Icon alt text." } },
            { name: "title", type: "text", required: true },
            { name: "subtitle", type: "text" },
            {
              name: "points",
              type: "array",
              labels: { singular: "Point", plural: "Points" },
              fields: [
                { name: "h", type: "text", required: true, admin: { description: "Point heading." } },
                { name: "d", type: "text", required: true, admin: { description: "Point detail." } },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "suraksha",
      type: "group",
      admin: { description: "Suraksha Kavach section." },
      fields: [
        { name: "badge", type: "text", admin: { description: "Pill label above the heading." } },
        headingGroup("Section heading. Empty keeps the default."),
        { name: "paragraph", type: "textarea" },
        { name: "features", type: "array", labels: { singular: "Feature", plural: "Features" }, fields: [{ name: "text", type: "text", required: true }] },
        {
          name: "primaryCta",
          type: "group",
          admin: { description: "Primary button." },
          fields: [
            { name: "label", type: "text" },
            { name: "href", type: "text" },
          ],
        },
        {
          name: "secondaryCta",
          type: "group",
          admin: { description: "Secondary button." },
          fields: [
            { name: "label", type: "text" },
            { name: "href", type: "text" },
          ],
        },
        { name: "image", type: "text", admin: { description: "Section image URL. Empty uses the default." } },
        { name: "imageAlt", type: "text" },
      ],
    },
    {
      name: "awards",
      type: "group",
      admin: { description: "Awards & Recognition carousel." },
      fields: [
        { name: "eyebrow", type: "text" },
        headingGroup("Section heading. Empty keeps the default."),
        { name: "subtitle", type: "textarea" },
        {
          name: "items",
          type: "array",
          labels: { singular: "Award", plural: "Awards" },
          admin: { description: "Empty falls back to the built-in awards." },
          fields: [
            { name: "img", type: "text", required: true, admin: { description: "Award image URL." } },
            { name: "title", type: "text", required: true },
            { name: "desc", type: "text", admin: { description: "Sub-line under the award title." } },
          ],
        },
      ],
    },
    {
      name: "events",
      type: "group",
      admin: { description: "Upcoming Events posters." },
      fields: [
        { name: "eyebrow", type: "text" },
        headingGroup("Section heading. Empty keeps the default."),
        {
          name: "posters",
          type: "array",
          labels: { singular: "Poster", plural: "Posters" },
          admin: { description: "Empty falls back to the built-in posters." },
          fields: [
            { name: "src", type: "text", required: true, admin: { description: "Poster image URL." } },
            { name: "alt", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "videos",
      type: "group",
      admin: { description: "YouTube video IDs for the three video grids. Titles/headings stay code-owned." },
      fields: [
        {
          name: "stories",
          type: "array",
          labels: { singular: "Patient story", plural: "Patient stories" },
          admin: { description: "Success-story videos. Empty falls back to the built-in set." },
          fields: [
            { name: "id", type: "text", required: true, admin: { description: "YouTube video ID." } },
            { name: "n", type: "text", required: true, admin: { description: "Patient name." } },
            { name: "q", type: "textarea", required: true, admin: { description: "Quote." } },
            { name: "r", type: "number", defaultValue: 5, admin: { description: "Star rating (1–5)." } },
          ],
        },
        {
          name: "edu",
          type: "array",
          labels: { singular: "Education video", plural: "Education videos" },
          admin: { description: "Educational videos. Empty falls back to the built-in set." },
          fields: [
            { name: "id", type: "text", required: true, admin: { description: "YouTube video ID." } },
            { name: "t", type: "text", required: true, admin: { description: "Title." } },
            { name: "d", type: "textarea", required: true, admin: { description: "Description." } },
          ],
        },
        {
          name: "resources",
          type: "array",
          labels: { singular: "Resource video", plural: "Resource videos" },
          admin: { description: "Resource videos. Empty falls back to the built-in set." },
          fields: [
            { name: "id", type: "text", required: true, admin: { description: "YouTube video ID." } },
            { name: "c", type: "text", required: true, admin: { description: "Category tag." } },
            { name: "t", type: "text", required: true, admin: { description: "Title." } },
            { name: "date", type: "text", required: true, admin: { description: "Byline / author." } },
          ],
        },
      ],
    },
    {
      name: "faq",
      type: "group",
      admin: { description: "Homepage FAQ accordion." },
      fields: [
        { name: "eyebrow", type: "text" },
        headingGroup("Section heading. Empty keeps the default."),
        {
          name: "items",
          type: "array",
          labels: { singular: "FAQ", plural: "FAQs" },
          admin: { description: "Empty falls back to the built-in FAQs." },
          fields: [
            { name: "q", type: "text", required: true, admin: { description: "Question." } },
            { name: "a", type: "textarea", required: true, admin: { description: "Answer." } },
          ],
        },
      ],
    },
    {
      name: "finalCta",
      type: "group",
      admin: { description: "Closing call-to-action band." },
      fields: [
        { name: "eyebrow", type: "text" },
        headingGroup("Section heading. Empty keeps the default."),
        { name: "paragraph", type: "textarea" },
        {
          name: "stats",
          type: "array",
          labels: { singular: "Counter", plural: "Counters" },
          admin: { description: "Animated counters. Empty falls back to the built-in counters." },
          fields: [
            { name: "v", type: "number", required: true, admin: { description: "Target value (counts up to this)." } },
            { name: "s", type: "text", admin: { description: "Suffix, e.g. '+'." } },
            { name: "l", type: "text", required: true, admin: { description: "Label." } },
          ],
        },
        { name: "ctas", type: "array", labels: { singular: "Button", plural: "Buttons" }, admin: { description: "Up to three button labels. Icons/order stay code-owned." }, fields: [{ name: "text", type: "text", required: true }] },
      ],
    },
    seoField,
  ],
};
