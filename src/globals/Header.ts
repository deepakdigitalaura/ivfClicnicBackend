import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "@/lib/revalidate";
import { isEditor } from "@/access/roles";

/**
 * Header → CMS source of truth for the sitewide header / navigation
 * (Phase 3.5B, Item 4). Drives the logo, the desktop + mobile navigation
 * (shared structure — no duplicate trees) and the primary CTA rendered by
 * <SiteHeader> (src/components/site-header.tsx).
 *
 * The "Doctors" entry stays data-driven from the DOCTORS entity list
 * (src/lib/doctors.ts): tick `doctors` on a nav item and <SiteHeader> renders
 * the compact doctor-first mega panel — so Doctors-CMS stays out of scope and
 * the menu never drifts from the doctor pages. Mirrors the typed
 * HEADER_DEFAULTS fallback in src/lib/header.ts so output is byte-identical
 * when the CMS is empty. Standard `revalidateGlobal` hook busts `global:header`
 * on edit (the tag every route reads the header through), keeping pages static
 * + on-demand ISR. RBAC: editors update content; admins inherit via isEditor.
 */
export const Header: GlobalConfig = {
  slug: "header",
  access: { read: () => true, update: isEditor },
  admin: { group: "Globals" },
  hooks: revalidateGlobal("header"),
  fields: [
    {
      name: "branding",
      type: "group",
      admin: { description: "Logo shown in the header bar + mobile drawer. Left empty keeps the built-in logo." },
      fields: [
        { name: "logoUrl", type: "text", admin: { description: "Logo image URL (e.g. /assets/logo.png). Empty uses the default." } },
        { name: "logoAlt", type: "text", admin: { description: "Logo alt text. Empty uses the default." } },
      ],
    },
    {
      name: "navItems",
      type: "array",
      labels: { singular: "Nav item", plural: "Nav items" },
      admin: {
        description:
          "Top-level navigation. Empty falls back to the built-in menu. A plain link uses 'Link URL'; a dropdown uses 'Mega columns'; tick 'Doctors panel' to render the auto-generated doctor menu.",
      },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", admin: { description: "Destination for a plain link. Leave empty when using mega columns or the Doctors panel." } },
        { name: "openInNewTab", type: "checkbox", admin: { description: "Open this top-level link in a new tab (rel=noopener)." } },
        {
          name: "doctors",
          type: "checkbox",
          admin: { description: "Render the auto-generated, doctor-first mega panel (built from the Doctors list). Ignores the columns below." },
        },
        {
          name: "megaCols",
          type: "number",
          admin: { description: "Force the dropdown grid to N columns (optional — defaults to the number of columns)." },
        },
        {
          name: "columns",
          type: "array",
          labels: { singular: "Mega column", plural: "Mega columns" },
          admin: { description: "Dropdown columns. Leave empty for a plain link or the Doctors panel." },
          fields: [
            { name: "heading", type: "text", admin: { description: "Column heading. Empty renders an unlabelled column." } },
            { name: "headingHref", type: "text", admin: { description: "Optional link for the heading (e.g. a city hub)." } },
            {
              name: "items",
              type: "array",
              labels: { singular: "Link", plural: "Links" },
              fields: [
                { name: "label", type: "text", required: true },
                { name: "url", type: "text" },
                { name: "desc", type: "text", admin: { description: "Optional secondary line shown under the label." } },
                {
                  name: "children",
                  type: "array",
                  labels: { singular: "Sub-link", plural: "Sub-links" },
                  admin: { description: "Optional nested links revealed under this item." },
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "url", type: "text" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "cta",
      type: "group",
      admin: { description: "Primary call-to-action button (desktop bar + mobile drawer)." },
      fields: [
        { name: "label", type: "text", admin: { description: "Button label. Empty uses the default ('Book Appointment')." } },
        { name: "url", type: "text", admin: { description: "Button target. Empty uses the default ('/#book')." } },
        {
          name: "styleVariant",
          type: "select",
          defaultValue: "primary",
          options: [{ label: "Primary", value: "primary" }],
          admin: { description: "Visual style. Only the primary style exists today." },
        },
      ],
    },
  ],
};
