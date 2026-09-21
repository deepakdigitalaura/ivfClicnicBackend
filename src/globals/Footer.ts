import type { Field, GlobalConfig } from "payload";
import { revalidateGlobal } from "@/lib/revalidate";
import { isEditor } from "@/access/roles";

/**
 * Footer → CMS source of truth for the sitewide footer (Phase 3.5B, Item 3).
 * Drives the sitemap nav grid, the optional branding + social blocks, the
 * copyright line and the bottom legal links rendered by <Footer> in
 * src/components/home-page.tsx.
 *
 * Contact data is NEVER duplicated here: a link may carry a `channel`
 * (phone/email/whatsapp) whose href is resolved from Site Settings via the
 * Item 1 resolver (src/lib/contact.ts) — the footer only decides WHICH contact
 * items appear, not the numbers themselves. Mirrors the typed FOOTER_DEFAULTS
 * fallback in src/lib/footer.ts so output is byte-identical when the CMS is
 * empty. Standard `revalidateGlobal` hook busts `global:footer` on edit (the
 * tag every route reads the footer through), keeping pages static + on-demand
 * ISR. RBAC: editors update content; admins inherit via isEditor.
 */
/* Footer fields, defined once and grouped into admin Tabs below (UNNAMED tabs →
 * stored data shape unchanged). Cleaner editing only. */
const FOOTER_FIELDS: Field[] = [
    {
      name: "branding",
      type: "group",
      label: "Logo & Blurb",
      admin: { description: "Optional logo + short blurb. Leave empty to keep the footer exactly as it is." },
      fields: [
        { name: "logoUrl", type: "text", label: "Logo Image URL", admin: { description: "Web address of the logo image. Leave empty to hide this block." } },
        { name: "description", type: "textarea", label: "Blurb", admin: { description: "Short blurb shown under the logo." } },
      ],
    },
    {
      name: "navGroups",
      type: "array",
      labels: { singular: "Footer column", plural: "Footer columns" },
      admin: { description: "The link columns in the footer. Leave empty to keep the built-in columns." },
      fields: [
        { name: "title", type: "text", required: true, label: "Column Heading", admin: { description: "Heading for this column, e.g. 'IVF Treatments'." } },
        { name: "hidden", type: "checkbox", label: "Hide column", admin: { description: "Tick to hide this whole footer column (and its links) without deleting it." } },
        {
          name: "links",
          type: "array",
          labels: { singular: "Link", plural: "Links" },
          fields: [
            { name: "label", type: "text", required: true, label: "Link Text" },
            { name: "hidden", type: "checkbox", label: "Hide link", admin: { description: "Tick to temporarily hide this link without deleting it." } },
            {
              name: "channel",
              type: "select",
              defaultValue: "none",
              label: "Link Type",
              options: [
                { label: "Custom URL", value: "none" },
                { label: "Phone (from Brand & Identity)", value: "phone" },
                { label: "Email (from Brand & Identity)", value: "email" },
                { label: "WhatsApp (from Brand & Identity)", value: "whatsapp" },
              ],
              admin: { description: "Pick Phone/Email/WhatsApp to auto-fill the link from Brand & Identity, or choose Custom URL and type your own below." },
            },
            { name: "url", type: "text", label: "Custom URL", admin: { description: "Link target when Link Type is Custom URL. Leave empty to show plain (non-clickable) text." } },
            { name: "external", type: "checkbox", label: "Open in New Tab", admin: { description: "Open this link in a new browser tab." } },
          ],
        },
      ],
    },
    {
      name: "social",
      type: "array",
      labels: { singular: "Social link", plural: "Social links" },
      admin: { description: "Optional social media profiles. Leave empty to keep the footer exactly as it is." },
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          label: "Platform",
          options: [
            { label: "Facebook", value: "facebook" },
            { label: "Instagram", value: "instagram" },
            { label: "YouTube", value: "youtube" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "X / Twitter", value: "twitter" },
          ],
        },
        { name: "url", type: "text", required: true, label: "Profile URL" },
      ],
    },
    {
      name: "copyrightText",
      type: "text",
      label: "Copyright Line",
      admin: { description: "Text shown after '© <year> '. Leave empty to use the built-in default." },
    },
    {
      name: "legalLinks",
      type: "array",
      labels: { singular: "Legal link", plural: "Legal links" },
      admin: { description: "Bottom-row policy links (Privacy, Terms, …). Leave empty to keep the built-in links." },
      fields: [
        { name: "label", type: "text", required: true, label: "Link Text" },
        { name: "url", type: "text", label: "Link URL", admin: { description: "Leave empty to show plain (non-clickable) text." } },
        { name: "hidden", type: "checkbox", label: "Hide link", admin: { description: "Tick to temporarily hide this link without deleting it." } },
        { name: "external", type: "checkbox", label: "Open in New Tab", admin: { description: "Open this link in a new browser tab." } },
      ],
    },
];

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  access: { read: () => true, update: isEditor },
  admin: { group: "Website Settings" },
  hooks: revalidateGlobal("footer"),
  // Grouped into Tabs (unnamed) so editors see one short section at a time.
  fields: [
    {
      type: "tabs",
      tabs: [
        { label: "Logo & Blurb", fields: FOOTER_FIELDS.slice(0, 1) },
        { label: "Link Columns", fields: FOOTER_FIELDS.slice(1, 2) },
        { label: "Social & Legal", fields: FOOTER_FIELDS.slice(2) },
      ],
    },
  ],
};
