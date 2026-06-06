import type { CollectionConfig } from "payload";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Uploads collection. Files are written to /public/media so Next serves
 * them statically in dev. `alt` is required for accessibility + SEO parity
 * with the existing image-alt discipline.
 */
export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  upload: {
    staticDir: path.resolve(dirname, "../../public/media"),
  },
  fields: [
    { name: "alt", type: "text", required: true },
  ],
};
