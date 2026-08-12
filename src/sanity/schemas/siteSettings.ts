import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "contact", title: "Contact" },
    { name: "social", title: "Social & Awards" },
    { name: "address", title: "Address" },
    { name: "navigation", title: "Navigation" },
  ],
  fields: [
    // General
    defineField({ name: "brandName", title: "Brand Name", type: "string", group: "general" }),
    defineField({ name: "alternateName", title: "Alternate Name", type: "string", group: "general" }),
    defineField({ name: "legalName", title: "Legal Name", type: "string", group: "general" }),
    defineField({ name: "logoUrl", title: "Logo URL", type: "string", group: "general" }),
    defineField({ name: "foundingDate", title: "Founding Year", type: "string", group: "general" }),

    // Contact
    defineField({ name: "telephone", title: "Phone (canonical, e.g. +919712622288)", type: "string", group: "contact" }),
    defineField({ name: "telephoneDisplay", title: "Phone (display, e.g. +91 97126 22288)", type: "string", group: "contact" }),
    defineField({ name: "email", title: "Email", type: "string", group: "contact" }),
    defineField({ name: "whatsapp", title: "WhatsApp digits (e.g. 919712622288)", type: "string", group: "contact" }),

    // Address
    defineField({
      name: "address",
      title: "Head Office Address",
      type: "object",
      group: "address",
      fields: [
        defineField({ name: "streetAddress", title: "Street", type: "string" }),
        defineField({ name: "addressLocality", title: "City", type: "string" }),
        defineField({ name: "addressRegion", title: "State", type: "string" }),
        defineField({ name: "postalCode", title: "Postal Code", type: "string" }),
        defineField({ name: "addressCountry", title: "Country (e.g. IN)", type: "string" }),
      ],
    }),

    // Social & Awards
    defineField({
      name: "socialLinks",
      title: "Social Profile URLs",
      description: "Instagram, Facebook, YouTube, LinkedIn — feeds the schema sameAs + footer.",
      type: "array",
      of: [{ type: "string" }],
      group: "social",
    }),
    defineField({ name: "awards", title: "Awards (schema)", type: "array", of: [{ type: "string" }], group: "social" }),
    defineField({ name: "knowsAbout", title: "Areas of Expertise (schema knowsAbout)", type: "array", of: [{ type: "string" }], group: "social" }),

    // Navigation
    defineField({
      name: "navLabels",
      title: "Navigation Category Labels",
      description: "Labels and display order for the header mega-menu and footer link columns. Leave empty to use the site's default labels.",
      type: "array",
      group: "navigation",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "category", title: "Category key (e.g. female-infertility)", type: "string", validation: (Rule) => Rule.required() }),
          defineField({ name: "headerLabel", title: "Header Label", type: "string" }),
          defineField({ name: "footerLabel", title: "Footer Label", type: "string" }),
          defineField({ name: "order", title: "Display Order", type: "number" }),
        ],
        preview: {
          select: { title: "category", subtitle: "footerLabel" },
        },
      }],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
