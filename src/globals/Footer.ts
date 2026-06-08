import type { GlobalConfig } from "payload";
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
export const Footer: GlobalConfig = {
  slug: "footer",
  access: { read: () => true, update: isEditor },
  admin: { group: "Globals" },
  hooks: revalidateGlobal("footer"),
  fields: [
    {
      name: "branding",
      type: "group",
      admin: { description: "Optional logo + blurb. Left empty keeps the footer visually identical." },
      fields: [
        { name: "logoUrl", type: "text", admin: { description: "Absolute logo URL. Empty hides the branding block." } },
        { name: "description", type: "textarea", admin: { description: "Short blurb shown under the logo." } },
      ],
    },
    {
      name: "navGroups",
      type: "array",
      labels: { singular: "Nav group", plural: "Nav groups" },
      admin: { description: "Footer sitemap columns. Empty falls back to the built-in columns." },
      fields: [
        { name: "title", type: "text", required: true, admin: { description: "Column heading, e.g. 'IVF Treatments'." } },
        {
          name: "links",
          type: "array",
          labels: { singular: "Link", plural: "Links" },
          fields: [
            { name: "label", type: "text", required: true },
            {
              name: "channel",
              type: "select",
              defaultValue: "none",
              options: [
                { label: "None — use the URL below", value: "none" },
                { label: "Phone (from Site Settings)", value: "phone" },
                { label: "Email (from Site Settings)", value: "email" },
                { label: "WhatsApp (from Site Settings)", value: "whatsapp" },
              ],
              admin: { description: "Resolve the link target from Site Settings (single source of truth). 'None' uses the URL below." },
            },
            { name: "url", type: "text", admin: { description: "Link target when channel = None. Empty renders a non-clickable label." } },
            { name: "external", type: "checkbox", admin: { description: "Open in a new tab (rel=noopener)." } },
          ],
        },
      ],
    },
    {
      name: "social",
      type: "array",
      labels: { singular: "Social link", plural: "Social links" },
      admin: { description: "Optional social profiles. Empty keeps the footer visually identical." },
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: [
            { label: "Facebook", value: "facebook" },
            { label: "Instagram", value: "instagram" },
            { label: "YouTube", value: "youtube" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "X / Twitter", value: "twitter" },
          ],
        },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "copyrightText",
      type: "text",
      admin: { description: "Copyright owner line, rendered after '© <year> '. Empty uses the default." },
    },
    {
      name: "legalLinks",
      type: "array",
      labels: { singular: "Legal link", plural: "Legal links" },
      admin: { description: "Bottom row policy links. Empty falls back to the built-in links." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", admin: { description: "Empty renders a non-clickable label." } },
        { name: "external", type: "checkbox", admin: { description: "Open in a new tab (rel=noopener)." } },
      ],
    },
  ],
};
