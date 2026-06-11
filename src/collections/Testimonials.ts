import type { CollectionConfig } from "payload";
import { isAdmin, isEditor } from "@/access/roles";
import { revalidateRelated } from "@/lib/revalidate";

/**
 * Testimonials — Phase B.4. Staff-curated patient testimonials that SUPPLEMENT
 * the live Google reviews on the homepage's Testimonials section. The homepage
 * still shows verified Google reviews (synced into src/data/reviews-cache.json
 * by scripts/sync-reviews.mjs) WITH the "verified Google" aggregate badge; these
 * CMS entries are merged in alongside and labelled "Patient review" — they are
 * NEVER presented as Google data and NEVER emitted into review schema/JSON-LD
 * (avoids Google's fake-review policy). See src/lib/testimonials.ts (resolver)
 * and the merge in <Testimonials> (src/components/home-page.tsx).
 *
 * Public `read` is open because these render on the public homepage (same as the
 * other content collections); only staff may create/update, and only admins may
 * delete. `revalidateRelated(["testimonials"])` busts the homepage on edit (the
 * `/` route reads getTestimonials(), tagged `testimonials`), keeping it static +
 * on-demand ISR.
 */
export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: "Testimonial", plural: "Testimonials" },
  admin: {
    useAsTitle: "author",
    defaultColumns: ["author", "rating", "published", "order"],
    group: "Testimonials",
    description:
      "Patient testimonials shown on the homepage, alongside your live Google reviews. Add a few of your best stories here — they appear as 'Patient review'.",
  },
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isAdmin,
  },
  hooks: revalidateRelated(["testimonials"]),
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "author",
          type: "text",
          required: true,
          label: "Patient Name",
          admin: { width: "60%", description: "Name shown on the testimonial card." },
        },
        {
          name: "rating",
          type: "number",
          required: true,
          defaultValue: 5,
          min: 1,
          max: 5,
          label: "Star Rating (1–5)",
          admin: { width: "40%", description: "How many stars to show, from 1 to 5." },
        },
      ],
    },
    {
      name: "quote",
      type: "textarea",
      required: true,
      label: "Testimonial",
      admin: { description: "The patient's words, in their voice. Keep it genuine." },
    },
    {
      name: "role",
      type: "text",
      label: "Sub-line (optional)",
      admin: {
        description:
          "Optional small line under the name, e.g. 'IVF · 2024' or a city. Leave blank to show 'Patient review'.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "published",
          type: "checkbox",
          defaultValue: true,
          label: "Show on website",
          admin: { width: "50%", description: "Untick to hide this testimonial without deleting it." },
        },
        {
          name: "order",
          type: "number",
          label: "Sort Order",
          defaultValue: 0,
          admin: { width: "50%", description: "Lower numbers show first. Leave at 0 to sort by newest." },
        },
      ],
    },
  ],
};
