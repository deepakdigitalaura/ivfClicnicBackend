import type { Field, GlobalConfig } from "payload";
import { revalidateGlobal } from "@/lib/revalidate";
import { isAdmin } from "@/access/roles";

/**
 * Site-wide identity → drives the Organization + WebSite JSON-LD emitted once
 * in the root layout. Mirrors the editable fields of the `SITE` constant in
 * src/lib/seo.ts (which remains the typed fallback + the source of the stable
 * entity @ids and canonical origin — those must NOT change for entity
 * grounding, so they are intentionally not editable here).
 *
 * Covers Phase 2: Site Settings + Social Links.
 */
/* Site-settings fields, defined once and grouped into admin Tabs below (UNNAMED
 * tabs → stored data shape unchanged). Cleaner editing only. */
const SITE_SETTINGS_FIELDS: Field[] = [
    { name: "brandName", type: "text", required: true, label: "Brand Name", admin: { description: "The clinic's public brand name." } },
    { name: "alternateName", type: "text", label: "Alternate Name" },
    { name: "legalName", type: "text", label: "Legal Name" },
    {
      name: "logoUrl",
      type: "text",
      admin: { description: "Absolute logo URL used in schema. A Media relation can replace this later." },
    },
    { name: "foundingDate", type: "text", admin: { description: "Year, e.g. 1984." } },
    // ---- Contact (single source of truth; see src/lib/contact.ts) ----
    { name: "telephone", type: "text", admin: { description: "Canonical phone for tel: links + schema, e.g. +919712622288." } },
    { name: "telephoneDisplay", type: "text", admin: { description: "Formatted phone for on-page display, e.g. +91 97126 22288." } },
    { name: "email", type: "email" },
    { name: "whatsapp", type: "text", admin: { description: "WhatsApp number digits for wa.me links, e.g. 919712622288." } },
    {
      name: "address",
      type: "group",
      fields: [
        { name: "streetAddress", type: "text" },
        { name: "addressLocality", type: "text" },
        { name: "addressRegion", type: "text" },
        { name: "postalCode", type: "text" },
        { name: "addressCountry", type: "text", admin: { description: "ISO country code, e.g. IN." } },
      ],
    },
    {
      name: "awards",
      type: "array",
      labels: { singular: "Award", plural: "Awards" },
      fields: [{ name: "award", type: "text", required: true }],
    },
    {
      name: "knowsAbout",
      type: "array",
      labels: { singular: "Area of expertise", plural: "Areas of expertise" },
      admin: { description: "Areas of expertise (helps search engines understand the clinic)." },
      fields: [{ name: "topic", type: "text", required: true, label: "Topic" }],
    },
    {
      name: "socialLinks",
      type: "array",
      labels: { singular: "Social link", plural: "Social links" },
      admin: { description: "Official profile links (Facebook, Instagram, YouTube, LinkedIn, …)." },
      fields: [{ name: "url", type: "text", required: true, label: "Profile URL" }],
    },
];

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Brand & Identity",
  access: { read: () => true, update: isAdmin },
  admin: { group: "Website Settings" },
  hooks: revalidateGlobal("site-settings"),
  // Grouped into Tabs (unnamed) so editors see one short section at a time.
  fields: [
    {
      type: "tabs",
      tabs: [
        { label: "Brand", fields: SITE_SETTINGS_FIELDS.slice(0, 5) },
        { label: "Contact", fields: SITE_SETTINGS_FIELDS.slice(5, 10) },
        { label: "Awards & Expertise", fields: SITE_SETTINGS_FIELDS.slice(10, 12) },
        { label: "Social Links", fields: SITE_SETTINGS_FIELDS.slice(12) },
      ],
    },
  ],
};
