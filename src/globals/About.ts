import type { Field, GlobalConfig } from "payload";
import { seoField } from "@/fields/seo";
import { revalidateGlobal } from "@/lib/revalidate";
import { isEditor } from "@/access/roles";
import { ICON_OPTIONS } from "@/lib/icon-map";

/**
 * About-BFI → CMS source of truth for the /about-bfi page's STRUCTURED editorial
 * content (Wave 4.5, Phase E): hero copy, the "At a glance" / "Patient First"
 * stat grids, the legacy timeline, the trust pillars, the city network, and the
 * network/final-CTA headings + CTA labels. Mirrors the typed ABOUT_DEFAULTS
 * fallback in src/lib/about.ts so output is byte-identical when the CMS is empty
 * (same convention as Homepage/Header/Footer).
 *
 * SCOPE: the inline-<strong> "Our Story"/"Patient First" prose, the decorative
 * <SectionHead> <em> titles, hero/CTA button hrefs+icons, the JSON-LD graph and
 * the reused Doctors/AwardsCarousel sections stay CODE-OWNED in the component.
 * The "15 / 6 centres" marketing copy is curated (not derived from CENTRES) and
 * stored verbatim. Headings split into a plain "lead" + decorative "em" word so
 * the styled markup stays in the component. Trust-pillar icon is a curated
 * `select` (ICON_NAMES, shared with Services/Homepage). Ends with the shared
 * `seoField` (no new SEO pattern, no schema drift) which drives the page's
 * generateMetadata. Standard `revalidateGlobal` busts `global:about-page` on
 * edit (the tag the /about-bfi route reads through), keeping the page static +
 * on-demand ISR. RBAC: editors update; admins inherit via isEditor.
 */

/** A reusable { lead, em } heading group — plain lead text + the decorative
 *  <em> word(s) the component styles per section. */
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

/** A { value, label } stat tuple (e.g. "30,000+" / "Happy families"). */
const statArray = (name: string, description: string): Field => ({
  name,
  type: "array",
  labels: { singular: "Stat", plural: "Stats" },
  admin: { description },
  fields: [
    { name: "value", type: "text", required: true, label: "Figure", admin: { description: "Headline figure, e.g. '30,000+'." } },
    { name: "label", type: "text", required: true, label: "Caption", admin: { description: "Caption under the figure." } },
  ],
});

export const About: GlobalConfig = {
  slug: "about-page",
  label: "About BFI",
  access: { read: () => true, update: isEditor },
  admin: { group: "Website Pages" },
  hooks: revalidateGlobal("about-page"),
  fields: [
    {
      name: "hero",
      type: "group",
      label: "Top Section",
      admin: { description: "The banner at the top of the About page — text only. The hero image and buttons are managed by the website team." },
      fields: [
        { name: "eyebrow", type: "text", label: "Small Label Above Heading", admin: { description: "Small label above the headline. Leave empty to use the default." } },
        { name: "headline", type: "text", label: "Page Heading", admin: { description: "The main headline. Leave empty to keep the built-in hero." } },
        { name: "headlineItalic", type: "text", label: "Highlighted Word in Heading", admin: { description: "The word(s) in the headline shown in the cursive accent style." } },
        { name: "paragraph", type: "textarea", label: "Intro Paragraph", admin: { description: "The sub-heading paragraph under the headline." } },
      ],
    },
    statArray("atAGlance", "'At a glance' figures in the Our Story panel. Leave empty to use the built-in figures."),
    {
      name: "milestones",
      type: "array",
      labels: { singular: "Milestone", plural: "Milestones" },
      admin: { description: "The history timeline. Leave empty to use the built-in milestones." },
      fields: [
        { name: "y", type: "text", required: true, label: "Year", admin: { description: "Year or label, e.g. '1984' or 'Today'." } },
        { name: "t", type: "text", required: true, label: "Title", admin: { description: "Milestone title." } },
        { name: "d", type: "textarea", required: true, label: "Description", admin: { description: "Milestone description." } },
      ],
    },
    {
      name: "trustPillars",
      type: "array",
      labels: { singular: "Pillar", plural: "Pillars" },
      admin: { description: "The 'Why families trust' cards. Leave empty to use the built-in pillars." },
      fields: [
        { name: "icon", type: "select", options: ICON_OPTIONS, label: "Card Icon", admin: { description: "Pick the icon shown on the card." } },
        { name: "t", type: "text", required: true, label: "Title", admin: { description: "Pillar title." } },
        { name: "d", type: "textarea", required: true, label: "Description", admin: { description: "Pillar description." } },
      ],
    },
    statArray("patientStats", "The 'Patient First' stat grid. Leave empty to use the built-in figures."),
    {
      name: "network",
      type: "group",
      label: "Our Network",
      admin: { description: "'Our Network' — centres across India." },
      fields: [
        headingGroup("Section heading. Leave empty to keep the default."),
        { name: "subtitle", type: "textarea", label: "Sub-heading" },
        {
          name: "cities",
          type: "array",
          labels: { singular: "City", plural: "Cities" },
          admin: { description: "City cards. These are hand-written marketing counts (not pulled from the Locations data). Leave empty to use the built-in list." },
          fields: [
            { name: "c", type: "text", required: true, label: "City Name", admin: { description: "City name." } },
            { name: "n", type: "text", required: true, label: "Count Label", admin: { description: "Count label, e.g. '3 centres'." } },
          ],
        },
      ],
    },
    {
      name: "finalCta",
      type: "group",
      label: "Closing Call-to-Action",
      admin: { description: "The closing call-to-action band — heading + button labels. Icons and links are managed by the website team." },
      fields: [
        headingGroup("Section heading. Leave empty to keep the default."),
        { name: "ctas", type: "array", labels: { singular: "Button", plural: "Buttons" }, admin: { description: "Button labels in order (the first is the main button)." }, fields: [{ name: "text", type: "text", required: true, label: "Button Text" }] },
      ],
    },
    seoField,
  ],
};
