import type { CollectionConfig, Field } from "payload";
import { revalidateCollection } from "@/lib/revalidate";
import { isEditor, isAdminField } from "@/access/roles";
import { sectionLabelsField } from "@/fields/section-labels";

/**
 * Centres (Wave 4.5, Phase B). Mirrors the `Centre` type in src/lib/locations.ts
 * 1:1 so the existing <CenterPage> template renders unchanged once a later phase
 * wires the route — the route reshapes a doc into ResolvedCentre via
 * src/lib/location-content.ts, falling back PER-SECTION to the code defaults
 * (`centreBySlug`) so an empty CMS stays byte-identical.
 *
 * SCOPE / OWNERSHIP (WAVE-4.5-PLAN §§1.2, 5.2, 5.3; ADR-0001 Option A):
 *  - `citySlug` is a plain slug STRING (the city parent link), NOT a Payload
 *    `relationship` — forward refs / single-source ordering stay code-owned.
 *  - The route topology, `built` gating, cityHasOwnPage() and
 *    generateStaticParams stay CODE-AUTHORITATIVE.
 *  - Class-A fields (citySlug, isHeadOffice, geo, opening, doctors[],
 *    treatments[], womensHealth[], reviewsKey, built) are STORED here for editor
 *    visibility + seed/roundtrip parity, but the resolver IGNORES them at render
 *    (resolveCentre reads them from the code default only). doctors/treatments/
 *    womensHealth stay lists of plain string slugs/keys, never relationships.
 *    These are surfaced read-only in the panel (UI only; seeds run as admin).
 *  - `slug` is unique WITHIN a city (not globally); compound uniqueness is
 *    guarded by the seed upsert (citySlug+slug) + roundtrip, not a DB unique
 *    index (WAVE-4.5-PLAN §13).
 *
 * Drafts on; public reads published-only; edits bust `centres` + `centres:<slug>`.
 */

/** Single-column array of short strings, stored as { value }. */
const valueArray = (name: string, label: string, opts?: { readOnly?: boolean; description?: string }): Field => ({
  name,
  type: "array",
  labels: { singular: label, plural: `${label}s` },
  ...(opts?.readOnly ? { access: { update: isAdminField } } : {}),
  admin: opts?.description ? { description: opts.description } : undefined,
  fields: [{ name: "value", type: "text", required: true, label }],
});

/** FAQ array ({ q, a }). */
const faqArray: Field = {
  name: "faqs",
  type: "array",
  labels: { singular: "FAQ", plural: "FAQs" },
  fields: [
    { name: "q", type: "text", required: true, label: "Question" },
    { name: "a", type: "textarea", required: true, label: "Answer" },
  ],
};

/** Gallery array ({ src, alt }). */
const galleryArray: Field = {
  name: "gallery",
  type: "array",
  labels: { singular: "Image", plural: "Images" },
  fields: [
    { name: "src", type: "text", required: true, label: "Image Path", admin: { description: "Image path. Ask the website team to add new images." } },
    { name: "alt", type: "text", required: true, label: "Alt Text", admin: { description: "Describes the image for accessibility." } },
  ],
};

/* Every centre field, defined once and grouped into admin Tabs below (UNNAMED
 * tabs → stored data shape unchanged). Cleaner editing only. */
const CENTRE_FIELDS: Field[] = [
    // ---- Identity + parent link (slug string, NOT a relationship) ----
    {
      type: "row",
      fields: [
        { name: "slug", type: "text", required: true, index: true, label: "Page ID", access: { update: isAdminField }, admin: { width: "50%", description: "The centre's web address ID (→ /locations/<city>/<this>). Set when creating — ask the website team to change it later." } },
        { name: "citySlug", type: "text", required: true, index: true, label: "Parent City ID", access: { update: isAdminField }, admin: { width: "50%", description: "ID of the city this centre belongs to. Set when creating — ask the website team to change it later." } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, label: "Short Name", admin: { width: "50%", description: 'Short name, e.g. "Paldi".' } },
        { name: "fullName", type: "text", required: true, label: "Full Clinic Name", admin: { width: "50%", description: "Full clinic name shown on the page." } },
      ],
    },
    { name: "isHeadOffice", type: "checkbox", label: "Head Office (website team)", access: { update: isAdminField }, admin: { description: "Whether this is the head office. Managed by the website team." } },

    // ---- Address / contact ----
    {
      type: "row",
      fields: [
        { name: "area", type: "text", label: "Area", admin: { width: "50%" } },
        { name: "pin", type: "text", label: "PIN Code", admin: { width: "50%", description: "Postal code." } },
      ],
    },
    { name: "address", type: "textarea", label: "Address" },
    {
      type: "row",
      fields: [
        { name: "phone", type: "text", label: "Phone (digits)", admin: { width: "33%", description: "Phone number, digits only (used for the call link)." } },
        { name: "phoneLabel", type: "text", label: "Phone (display)", admin: { width: "33%", description: "Phone number as shown on the page." } },
        { name: "hours", type: "text", label: "Opening Hours (text)", admin: { width: "34%", description: "Opening hours as plain text, e.g. 'Mon–Sat, 9am–7pm'." } },
      ],
    },

    // ---- Opening hours (Class A — schema openingHoursSpecification) ----
    {
      name: "opening",
      type: "group",
      label: "Opening Hours Data (website team)",
      access: { update: isAdminField },
      admin: { description: "Machine-readable opening hours. Managed by the website team (the plain-text hours above is what shows on the page)." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "opens", type: "text", label: "Opens", admin: { width: "50%", description: 'e.g. "09:00". Managed by the website team.' } },
            { name: "closes", type: "text", label: "Closes", admin: { width: "50%", description: 'e.g. "19:00". Managed by the website team.' } },
          ],
        },
        valueArray("days", "Day", { readOnly: true, description: "Open days. Managed by the website team." }),
      ],
    },

    // ---- Geo (Class A — schema GeoCoordinates) ----
    {
      name: "geo",
      type: "group",
      label: "Map Coordinates (website team)",
      access: { update: isAdminField },
      admin: { description: "Latitude / longitude. Managed by the website team." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "lat", type: "number", label: "Latitude", admin: { width: "50%", description: "Managed by the website team." } },
            { name: "lng", type: "number", label: "Longitude", admin: { width: "50%", description: "Managed by the website team." } },
          ],
        },
      ],
    },

    // ---- Hero / map ----
    {
      type: "row",
      fields: [
        { name: "mapQuery", type: "text", label: "Google Maps Search", admin: { width: "50%", description: "Search text used for the embedded map." } },
        { name: "image", type: "text", label: "Building Image Path", admin: { width: "50%", description: "Image path. Ask the website team to add new images." } },
      ],
    },
    { name: "hero360Url", type: "text", label: "360° Map Embed URL", admin: { description: "Optional Google Maps 360° embed link." } },

    // ---- Local SEO arrays (editorial) ----
    valueArray("nearby", "Nearby Area"),
    valueArray("landmarks", "Landmark"),
    valueArray("howToReach", "Direction"),
    valueArray("facilities", "Facility"),

    // ---- Relationships as slug strings (Class A — stored; resolver ignores) ----
    valueArray("doctors", "Linked Doctor ID (website team)", { readOnly: true, description: "Doctor IDs linked to this centre. Managed by the website team." }),
    valueArray("treatments", "Linked Treatment ID (website team)", { readOnly: true, description: "Treatment IDs linked to this centre. Managed by the website team." }),
    valueArray("womensHealth", "Linked Service ID (website team)", { readOnly: true, description: "Service IDs linked to this centre. Managed by the website team." }),

    // ---- Editorial body ----
    { name: "intro", type: "textarea", label: "Introduction" },
    faqArray,
    galleryArray,
    valueArray("sameAs", "Profile Link"),
    sectionLabelsField,

    // ---- Class A scalars (stored for parity; resolver ignores) ----
    { name: "reviewsKey", type: "text", label: "Reviews Feed Key (website team)", access: { update: isAdminField }, admin: { description: "Key for the reviews feed. Managed by the website team." } },
    { name: "built", type: "checkbox", label: "Live on Site (website team)", access: { update: isAdminField }, admin: { description: "Whether this centre has its own page. Managed by the website team." } },
];

export const Centres: CollectionConfig = {
  slug: "centres",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "slug", "citySlug", "built", "_status"],
    group: "Locations",
  },
  versions: { drafts: true },
  hooks: {
    ...revalidateCollection("centres"),
    beforeChange: [
      ({ data }) => {
        if (typeof data.slug === "string") data.slug = data.slug.toLowerCase().trim();
        if (typeof data.citySlug === "string") data.citySlug = data.citySlug.toLowerCase().trim();
        return data;
      },
    ],
  },
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
        { label: "Basics", fields: CENTRE_FIELDS.slice(0, 3) },
        { label: "Address & Contact", fields: CENTRE_FIELDS.slice(3, 6) },
        { label: "Hours & Map (website team)", fields: CENTRE_FIELDS.slice(6, 10) },
        { label: "Local SEO", fields: CENTRE_FIELDS.slice(10, 14) },
        { label: "Linked (website team)", fields: CENTRE_FIELDS.slice(14, 17) },
        { label: "Content", fields: CENTRE_FIELDS.slice(17, 21) },
        { label: "Section Labels", fields: CENTRE_FIELDS.slice(21, 22) },
        { label: "Advanced (website team)", fields: CENTRE_FIELDS.slice(22) },
      ],
    },
  ],
};
