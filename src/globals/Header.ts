import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "@/lib/revalidate";
import { isEditor, isAdminField } from "@/access/roles";

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
  label: "Header & Navigation",
  access: { read: () => true, update: isEditor },
  admin: { group: "Website Settings" },
  hooks: revalidateGlobal("header"),
  fields: [
    {
      name: "branding",
      type: "group",
      label: "Logo",
      admin: { description: "Logo shown in the top bar + mobile menu. Leave empty to keep the built-in logo." },
      fields: [
        { name: "logoUrl", type: "text", label: "Logo Image URL", admin: { description: "Web address of the logo image (e.g. /assets/logo.png). Leave empty to use the default." } },
        { name: "logoAlt", type: "text", label: "Logo Alt Text", admin: { description: "Describes the logo for accessibility. Leave empty to use the default." } },
      ],
    },
    {
      name: "navItems",
      type: "array",
      labels: { singular: "Menu item", plural: "Menu items" },
      admin: {
        description:
          "Top-level navigation. Empty falls back to the built-in menu. A plain link uses 'Link URL'; a dropdown uses 'Mega columns'; tick 'Doctors panel' to render the auto-generated doctor menu.",
      },
      fields: [
        { name: "label", type: "text", required: true, label: "Menu Label" },
        { name: "url", type: "text", label: "Link URL", admin: { description: "Where this menu item links to. Leave empty if it opens a dropdown or the Doctors panel instead." } },
        { name: "openInNewTab", type: "checkbox", label: "Open in New Tab", admin: { description: "Open this menu link in a new browser tab." } },
        {
          name: "doctors",
          type: "checkbox",
          label: "Show Doctors Panel",
          admin: { description: "Show the auto-built doctors dropdown (made from the Doctors list). When ticked, the dropdown columns below are ignored." },
        },
        {
          name: "megaCols",
          type: "number",
          label: "Force column count (website team)",
          access: { update: isAdminField },
          admin: { description: "Advanced layout control. Managed by the website team." },
        },
        {
          name: "columns",
          type: "array",
          labels: { singular: "Dropdown column", plural: "Dropdown columns" },
          admin: { description: "Columns shown in this item's dropdown menu. Leave empty for a plain link or the Doctors panel." },
          fields: [
            { name: "heading", type: "text", label: "Column Heading", admin: { description: "Heading at the top of the column. Leave empty for an unlabelled column." } },
            { name: "headingHref", type: "text", label: "Heading Link", admin: { description: "Optional link for the heading (e.g. a city page)." } },
            {
              name: "items",
              type: "array",
              labels: { singular: "Link", plural: "Links" },
              fields: [
                { name: "label", type: "text", required: true, label: "Link Text" },
                { name: "url", type: "text", label: "Link URL" },
                { name: "desc", type: "text", label: "Sub-line", admin: { description: "Optional small line shown under the link." } },
                {
                  name: "children",
                  type: "array",
                  labels: { singular: "Sub-link", plural: "Sub-links" },
                  admin: { description: "Optional nested links shown under this link." },
                  fields: [
                    { name: "label", type: "text", required: true, label: "Link Text" },
                    { name: "url", type: "text", label: "Link URL" },
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
      label: "Main Button",
      admin: { description: "The main call-to-action button (top bar + mobile menu)." },
      fields: [
        { name: "label", type: "text", label: "Button Text", admin: { description: "Button text. Leave empty to use the default ('Book Appointment')." } },
        { name: "url", type: "text", label: "Button Link", admin: { description: "Where the button goes. Leave empty to use the default ('/#book')." } },
        {
          name: "styleVariant",
          type: "select",
          defaultValue: "primary",
          options: [{ label: "Primary", value: "primary" }],
          admin: { hidden: true, description: "Reserved for future button styles." },
        },
      ],
    },
  ],
};
