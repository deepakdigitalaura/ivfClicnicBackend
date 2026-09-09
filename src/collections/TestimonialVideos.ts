import type { CollectionConfig } from "payload";
import { isAdmin, isEditor } from "@/access/roles";
import { revalidateRelated } from "@/lib/revalidate";

/**
 * Testimonial Videos — the patient-story cards on the public /testimonial-videos
 * page. Each doc is one YouTube testimonial with the patient's name, a pull
 * quote and a star rating. Public `read` is open; staff create/update, admins
 * delete.
 *
 * These are video testimonials shown on their own page; they are SEPARATE from
 * the text `testimonials` collection that supplements the homepage Google
 * reviews. The /testimonial-videos route reads getTestimonialVideos() (tagged
 * `testimonial-videos`); `revalidateRelated(["testimonial-videos"])` busts that
 * tag on edit. If empty, the page falls back to its built-in default list.
 */
export const TestimonialVideos: CollectionConfig = {
  slug: "testimonial-videos",
  labels: { singular: "Testimonial Video", plural: "Testimonial Videos" },
  admin: {
    useAsTitle: "patientName",
    defaultColumns: ["patientName", "rating", "published", "order"],
    group: "Videos & Media",
    description:
      "Patient-story YouTube videos shown on the Testimonial Videos page. Add a video by pasting its YouTube ID, the patient's name and a short quote.",
  },
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isAdmin,
  },
  hooks: revalidateRelated(["testimonial-videos"]),
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "patientName",
          type: "text",
          required: true,
          label: "Patient Name / Title",
          admin: { width: "60%", description: "Shown under the quote, e.g. 'Anita Thakkar' or 'Rekha's Journey'." },
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
      name: "youtubeId",
      type: "text",
      required: true,
      label: "YouTube Video ID",
      admin: {
        description:
          "The ID after watch?v= in a YouTube URL. e.g. for youtube.com/watch?v=6bH_RnV-_2Y the ID is '6bH_RnV-_2Y'.",
      },
    },
    {
      name: "quote",
      type: "textarea",
      required: true,
      label: "Pull Quote",
      admin: { description: "A short line in the patient's words, shown on the card." },
    },
    {
      type: "row",
      fields: [
        {
          name: "published",
          type: "checkbox",
          defaultValue: true,
          label: "Show on website",
          admin: { width: "50%", description: "Untick to hide this video without deleting it." },
        },
        {
          name: "order",
          type: "number",
          defaultValue: 0,
          label: "Sort Order",
          admin: { width: "50%", description: "Lower numbers show first." },
        },
      ],
    },
  ],
};
