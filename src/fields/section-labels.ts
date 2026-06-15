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
    // ---- Section titles (the large h1 / h2 headings above each section) ----
    // Leave blank to auto-generate from the page's area/city name.
    // HTML is supported: use <em class="font-display italic text-[color:var(--rose)]">word</em>
    // for the italic rose accent word. Easiest to set via the visual inline editor.
    { name: "heroTitle", type: "textarea", label: "Hero Heading (h1)", admin: { description: "Main page heading. Leave blank to auto-generate. Use the visual editor to style the accent word in italic rose." } },
    { name: "overviewTitle", type: "textarea", label: "Overview Section Heading" },
    { name: "centresTitle", type: "textarea", label: "'Our Centres' Section Heading" },
    { name: "landmarksTitle", type: "textarea", label: "'Landmarks' Section Heading" },
    { name: "areasTitle", type: "textarea", label: "'Areas served' Section Heading" },
    { name: "reachTitle", type: "textarea", label: "'How to reach' Section Heading" },
    { name: "treatmentsTitle", type: "textarea", label: "'Treatments offered' Section Heading" },
    { name: "womensHealthTitle", type: "textarea", label: "Women's Health Section Heading" },
    { name: "facilitiesTitle", type: "textarea", label: "'Facilities' Section Heading" },
    { name: "doctorsTitle", type: "textarea", label: "Doctors Section Heading" },
    { name: "testimonialsTitle", type: "textarea", label: "Testimonials Section Heading" },
    { name: "reviewsTitle", type: "textarea", label: "Reviews Section Heading" },
    { name: "galleryTitle", type: "textarea", label: "Gallery Section Heading" },
    { name: "whyTitle", type: "textarea", label: "'Why choose' Section Heading" },
    { name: "mapTitle", type: "textarea", label: "Map Section Heading" },
    { name: "contactTitle", type: "textarea", label: "Contact Section Heading" },
    { name: "faqTitle", type: "textarea", label: "FAQ Section Heading" },
    { name: "ctaTitle", type: "textarea", label: "Call-to-Action Heading (closing h2)", admin: { description: "The large heading inside the dark closing CTA band." } },
  ],
};
