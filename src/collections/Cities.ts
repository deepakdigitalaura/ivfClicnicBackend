import type { CollectionConfig, Field } from "payload";
import { revalidateCollection } from "@/lib/revalidate";
import { isEditor, isAdminField } from "@/access/roles";

/**
 * Cities (Wave 4.5, Phase B). Mirrors the `City` type in src/lib/locations.ts
 * 1:1 so the existing <CityPage> template renders unchanged once a later phase
 * wires the route — the route reshapes a doc into ResolvedCity via
 * src/lib/location-content.ts, falling back PER-SECTION to the code defaults
 * (`cityBySlug`) so an empty CMS stays byte-identical.
 *
 * SCOPE / OWNERSHIP (WAVE-4.5-PLAN §§1.2, 5.3; ADR-0001 Option A):
 *  - The route topology, `built` gating, cityHasOwnPage() and
 *    generateStaticParams stay CODE-AUTHORITATIVE — they are computed from the
 *    code arrays, never from these docs.
 *  - Class-A fields (slug, built, womensHealth keys) are STORED here for editor
 *    visibility + seed/roundtrip parity, but the resolver IGNORES them at render
 *    (resolveCity reads them from the code default only). They are not Payload
 *    `relationship` fields — womensHealth stays a list of plain string keys.
 *    These are surfaced read-only in the panel (UI only; seeds run as admin).
 *
 * Drafts on; public reads published-only; edits bust `cities` + `cities:<slug>`.
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

export const Cities: CollectionConfig = {
  slug: "cities",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "region", "built", "_status"],
    group: "Locations",
  },
  versions: { drafts: true },
  hooks: revalidateCollection("cities"),
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
        { name: "slug", type: "text", required: true, unique: true, index: true, label: "Page URL", access: { update: isAdminField }, admin: { width: "50%", description: "The city's web address ID (→ /locations/<this>). Set when creating — ask the website team to change it later." } },
        { name: "name", type: "text", required: true, label: "City Name", admin: { width: "50%", description: "City name shown on the page." } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "region", type: "text", label: "State / Region", admin: { width: "50%", description: "State or region, e.g. 'Gujarat'." } },
        { name: "country", type: "text", label: "Country", admin: { width: "50%", description: "ISO country code, e.g. IN." } },
      ],
    },

    // ---- Contact ----
    {
      type: "row",
      fields: [
        { name: "helpline", type: "text", label: "Helpline (digits)", admin: { width: "33%", description: "Phone number, digits only (used for the call link)." } },
        { name: "helplineLabel", type: "text", label: "Helpline (display)", admin: { width: "33%", description: "Phone number as shown on the page." } },
        { name: "whatsapp", type: "text", label: "WhatsApp", admin: { width: "33%", description: "WhatsApp number, digits only." } },
      ],
    },

    // ---- Hero ----
    {
      type: "row",
      fields: [
        { name: "heroImage", type: "text", label: "Hero Image Path", admin: { width: "50%", description: "Image path, e.g. /assets/.... Ask the website team to add new images." } },
        { name: "hero360Url", type: "text", label: "360° Map Embed URL", admin: { width: "50%", description: "Optional Google Maps 360° embed link." } },
      ],
    },

    // ---- Editorial body ----
    valueArray("intro", "Paragraph"),
    faqArray,

    // ---- Class A (stored for visibility/roundtrip; resolver ignores) ----
    valueArray("womensHealth", "Linked Service ID (website team)", { readOnly: true, description: "Service IDs linked to this city. Managed by the website team." }),
    { name: "built", type: "checkbox", label: "Live on Site (website team)", access: { update: isAdminField }, admin: { description: "Whether this city has its own page. Managed by the website team." } },
  ],
};
