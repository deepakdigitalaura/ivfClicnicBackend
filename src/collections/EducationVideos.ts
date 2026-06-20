import type { CollectionConfig } from "payload";
import { isAdmin, isEditor } from "@/access/roles";
import { revalidateRelated } from "@/lib/revalidate";

/**
 * Education Videos — the cards on the public /education-videos page. Each doc is
 * one YouTube video with a topic label (the filter tab). Public `read` is open
 * (renders on the public page); staff create/update, admins delete.
 *
 * The /education-videos route reads getEducationVideos() (tagged
 * `education-videos`); `revalidateRelated(["education-videos"])` busts that tag
 * on edit so the static page regenerates on the next request. If the collection
 * is empty the page falls back to its built-in default list, so it never breaks.
 */
export const EducationVideos: CollectionConfig = {
  slug: "education-videos",
  labels: { singular: "Education Video", plural: "Education Videos" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "published", "order"],
    group: "Videos & Media",
    description:
      "Educational YouTube videos shown on the Education Videos page. Add a video by pasting its YouTube ID and a short description.",
  },
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isAdmin,
  },
  hooks: revalidateRelated(["education-videos"]),
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          label: "Video Title",
          admin: { width: "60%", description: "The heading shown on the video card." },
        },
        {
          name: "category",
          type: "text",
          required: true,
          label: "Topic / Filter Tab",
          defaultValue: "IVF",
          admin: {
            width: "40%",
            description: "Groups the video under a filter tab, e.g. 'IVF', 'IVF Cost', 'Male Infertility'.",
          },
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
          "The ID after watch?v= in a YouTube URL. e.g. for youtube.com/watch?v=lovYgHlbZoE the ID is 'lovYgHlbZoE'.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Short Description",
      admin: { description: "One or two sentences shown under the title on the card." },
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
