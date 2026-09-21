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
  label: "Contact Details",
  access: { read: () => true, update: isAdmin },
  admin: { group: "Website Settings" },
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
        { name: "title", type: "text", required: true, label: "Card Title", admin: { description: "Card label, e.g. 'Call Us'." } },
        {
          name: "channel",
          type: "select",
          defaultValue: "none",
          label: "Contact Type",
          options: [
            { label: "Custom — type the value/link below", value: "none" },
            { label: "Phone (from Brand & Identity)", value: "phone" },
            { label: "Email (from Brand & Identity)", value: "email" },
            { label: "WhatsApp (from Brand & Identity)", value: "whatsapp" },
          ],
          admin: { description: "Pick Phone/Email/WhatsApp to auto-fill from Brand & Identity (one place to update). Choose Custom for anything else (e.g. Working Hours)." },
        },
        { name: "value", type: "text", label: "Display Value", admin: { description: "Text shown on the card when 'Contact type' is Custom (e.g. working hours), or the WhatsApp display label. Ignored for Phone/Email (filled from Brand & Identity)." } },
        { name: "href", type: "text", label: "Custom Link", admin: { description: "Link used when 'Contact type' is Custom. Ignored for Phone/Email/WhatsApp (filled from Brand & Identity)." } },
        { name: "note", type: "text", label: "Sub-line", admin: { description: "Small line under the value, e.g. '24×7 patient helpline'." } },
      ],
    },
  ],
};
