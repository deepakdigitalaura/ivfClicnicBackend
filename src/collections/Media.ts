import type { CollectionConfig } from "payload";
import path from "path";
import { fileURLToPath } from "url";
import { isAdmin, isEditor } from "@/access/roles";
import { revalidateRelated } from "@/lib/revalidate";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Uploads collection. Files are written to /public/media so Next serves
 * them statically in dev. `alt` is required for accessibility + SEO parity
 * with the existing image-alt discipline.
 *
 * An image can be referenced from anywhere (doctor photos, treatment/service
 * heroes, page heroes, blog/og images), and editing or REPLACING a media doc's
 * file changes its filename — so the routes that embed it must be busted, else
 * their statically-cached HTML keeps pointing at the old (now-deleted) file and
 * the <img> breaks. We can't cheaply know every referrer, so on any media
 * change/delete we bust every image-bearing route's tag (rare event, low cost).
 */
const revalidateMediaReferrers = revalidateRelated([
  "doctors",
  "treatments",
  "services",
  "pages",
  "blogs",
  "global:homepage",
  "global:about-page",
  "global:header",
  "global:footer",
]);

export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Media Library" },
  hooks: revalidateMediaReferrers,
  access: { read: () => true, create: isEditor, update: isEditor, delete: isAdmin },
  upload: {
    staticDir: path.resolve(dirname, "../../public/media"),
  },
  fields: [
    { name: "alt", type: "text", required: true, label: "Alt Text", admin: { description: "Describe the image for accessibility and SEO, e.g. 'IVF lab technician at work'." } },
  ],
};
