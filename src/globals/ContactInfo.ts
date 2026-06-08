import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "@/lib/revalidate";
import { isAdmin } from "@/access/roles";

/**
 * Contact display blocks → drives the contact cards on the Contact page
 * (Call / WhatsApp / Email / Working Hours). Icons are stored as NAMES from a
 * curated set and mapped to Lucide components in the template — the same
 * serialisable-icon pattern that future Treatments/Services collections will
 * use (icons are code, not data, so the CMS only ever stores the name).
 *
 * Covers Phase 2: Contact Information.
 */
export const ContactInfo: GlobalConfig = {
  slug: "contact-info",
  access: { read: () => true, update: isAdmin },
  admin: { group: "Globals" },
  hooks: revalidateGlobal("contact-info"),
  fields: [
    {
      name: "cards",
      type: "array",
      labels: { singular: "Contact card", plural: "Contact cards" },
      fields: [
        {
          name: "icon",
          type: "select",
          required: true,
          options: [
            { label: "Phone", value: "Phone" },
            { label: "WhatsApp / Chat", value: "MessageCircle" },
            { label: "Email", value: "Mail" },
            { label: "Clock / Hours", value: "Clock" },
            { label: "Map Pin", value: "MapPin" },
            { label: "Calendar", value: "Calendar" },
          ],
        },
        { name: "title", type: "text", required: true, admin: { description: "Label, e.g. 'Call Us'." } },
        {
          name: "channel",
          type: "select",
          defaultValue: "none",
          options: [
            { label: "None — use the value/link below", value: "none" },
            { label: "Phone (from Site Settings)", value: "phone" },
            { label: "Email (from Site Settings)", value: "email" },
            { label: "WhatsApp (from Site Settings)", value: "whatsapp" },
          ],
          admin: { description: "Resolve value + link from Site Settings (single source of truth). 'None' keeps the value/link below (e.g. Working Hours)." },
        },
        { name: "value", type: "text", admin: { description: "Display value when channel = None (e.g. working hours), or display label for WhatsApp. Ignored for Phone/Email (resolved from Site Settings)." } },
        { name: "href", type: "text", admin: { description: "Link used when channel = None. Ignored for Phone/Email/WhatsApp (resolved from Site Settings)." } },
        { name: "note", type: "text", admin: { description: "Sub-line, e.g. '24×7 patient helpline'." } },
      ],
    },
  ],
};
