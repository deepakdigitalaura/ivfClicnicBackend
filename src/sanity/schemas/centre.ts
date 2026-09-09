import { defineType, defineField } from "sanity";

const valueArr = (name: string, title: string, itemTitle: string) =>
  defineField({
    name, title, type: "array",
    of: [{ type: "object", fields: [defineField({ name: "value", title: itemTitle, type: "string" })] }],
  });

export default defineType({
  name: "centre",
  title: "Location — Centre",
  type: "document",
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "contact", title: "Contact & Hours" },
    { name: "content", title: "Content" },
    { name: "facility", title: "Facility Details" },
    { name: "faqs", title: "FAQs" },
  ],
  fields: [
    // ── Identity ──
    defineField({
      name: "slug",
      title: "Centre Slug",
      description: "URL slug (e.g. paldi, ghatkopar). Must match the code slug to overlay defaults.",
      type: "string",
      group: "main",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "citySlug",
      title: "City Slug",
      description: "The parent city slug (e.g. ahmedabad, mumbai).",
      type: "string",
      group: "main",
      validation: (R) => R.required(),
    }),
    defineField({ name: "name", title: "Centre Name (short)", type: "string", group: "main" }),
    defineField({ name: "fullName", title: "Full Name", type: "string", group: "main" }),
    defineField({ name: "area", title: "Area / Neighbourhood", type: "string", group: "main" }),
    defineField({ name: "isHeadOffice", title: "Head Office", type: "boolean", initialValue: false, group: "main" }),
    defineField({
      name: "built",
      title: "Live (published)",
      description: "Uncheck to hide this centre from the site without deleting it.",
      type: "boolean",
      initialValue: true,
      group: "main",
    }),

    // ── Hero Image ──
    defineField({ name: "image", title: "Centre Image Path", description: "e.g. /assets/centres/paldi-waiting.webp", type: "string", group: "main" }),
    defineField({ name: "hero360Url", title: "360° Map Embed URL", type: "string", group: "main" }),

    // ── Contact ──
    defineField({ name: "address", title: "Full Address", type: "text", rows: 2, group: "contact" }),
    defineField({ name: "pin", title: "PIN Code", type: "string", group: "contact" }),
    defineField({ name: "phone", title: "Phone Number", type: "string", group: "contact" }),
    defineField({ name: "phoneLabel", title: "Phone Display Label", type: "string", group: "contact" }),
    defineField({ name: "hours", title: "Working Hours (display)", description: "e.g. Mon–Sat 9am–7pm", type: "string", group: "contact" }),
    defineField({
      name: "opening",
      title: "Opening Hours (structured)",
      type: "object",
      group: "contact",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "opens", title: "Opens (HH:MM)", type: "string" }),
        defineField({ name: "closes", title: "Closes (HH:MM)", type: "string" }),
        valueArr("days", "Days Open", "Day (e.g. Monday)"),
      ],
    }),
    defineField({
      name: "geo",
      title: "Coordinates",
      type: "object",
      group: "contact",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "lat", title: "Latitude", type: "number" }),
        defineField({ name: "lng", title: "Longitude", type: "number" }),
      ],
    }),
    defineField({ name: "mapQuery", title: "Google Maps Search Query", description: "Used to generate the maps link.", type: "string", group: "contact" }),
    defineField({ name: "reviewsKey", title: "Google Reviews Place ID", type: "string", group: "contact" }),
    valueArr("sameAs", "Listing URLs (sameAs)", "URL (Google Maps, Justdial, etc.)"),

    // ── Content ──
    defineField({ name: "intro", title: "Intro Text", type: "text", rows: 3, group: "content" }),
    valueArr("nearby", "Nearby Areas / Catchment", "Area"),
    valueArr("landmarks", "Landmarks", "Landmark"),
    valueArr("howToReach", "How to Reach", "Instruction"),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "content",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "src", title: "Image Path", type: "string" }),
          defineField({ name: "alt", title: "Alt Text", type: "string" }),
        ],
      }],
    }),

    // ── Facility ──
    valueArr("facilities", "Facilities", "Facility"),
    valueArr("doctors", "Doctor Slugs", "Doctor Slug"),
    valueArr("treatments", "Treatment Slugs", "Treatment Slug"),
    valueArr("womensHealth", "Women's Health Services", "Service Name"),

    // ── FAQs ──
    defineField({
      name: "faqs",
      title: "FAQs",
      group: "faqs",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "q", title: "Question", type: "string" }),
          defineField({ name: "a", title: "Answer", type: "text", rows: 3 }),
        ],
      }],
    }),
  ],
  preview: {
    select: { title: "name", city: "citySlug", slug: "slug" },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare({ title, city, slug }: any) {
      return { title: title || slug, subtitle: `/locations/${city}/${slug}` };
    },
  },
});
