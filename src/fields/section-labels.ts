import type { Field } from "payload";

/**
 * Shared `sectionLabels` group for the Cities and Centres collections — per-page
 * overrides for the template section labels (eyebrows/sub-headings) the
 * city/centre templates otherwise hardcode. Every field is optional; empty →
 * the built-in label renders (byte-identical fallback, same convention as the
 * Doctors `profileLabels` group). Keys mirror `LocationSectionLabels` in
 * src/lib/location-content.ts 1:1.
 */
export const sectionLabelsField: Field = {
  name: "sectionLabels",
  type: "group",
  label: "Page Section Labels",
  admin: { description: "Small labels and sub-headings shown above each section of this page. Leave empty to use the defaults." },
  fields: [
    { name: "overviewEyebrow", type: "text", label: "Overview Section Label" },
    { name: "centresEyebrow", type: "text", label: "'Our Centres' Section Label" },
    { name: "landmarksEyebrow", type: "text", label: "'Landmarks' Section Label" },
    { name: "areasEyebrow", type: "text", label: "'Areas served' Section Label" },
    { name: "reachEyebrow", type: "text", label: "'How to reach' Section Label" },
    { name: "treatmentsEyebrow", type: "text", label: "'Treatments offered' Section Label" },
    { name: "womensHealthEyebrow", type: "text", label: "Women's Health Section Label" },
    { name: "facilitiesEyebrow", type: "text", label: "'Facilities' Section Label" },
    { name: "doctorsEyebrow", type: "text", label: "Doctors Section Label" },
    { name: "doctorsSubtitle", type: "textarea", label: "Doctors Sub-heading" },
    { name: "testimonialsEyebrow", type: "text", label: "'Testimonials' Section Label" },
    { name: "testimonialsSubtitle", type: "textarea", label: "Testimonials Sub-heading" },
    { name: "gallerySubtitle", type: "textarea", label: "Gallery Sub-heading" },
    { name: "whyEyebrow", type: "text", label: "'Why choose us' Section Label" },
    { name: "mapEyebrow", type: "text", label: "Map Section Label" },
    { name: "contactSubtitle", type: "textarea", label: "Contact Sub-heading" },
    { name: "faqEyebrow", type: "text", label: "'FAQ' Section Label" },
  ],
};
