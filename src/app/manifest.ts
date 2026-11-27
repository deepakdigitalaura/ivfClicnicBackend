import type { MetadataRoute } from "next";

/**
 * Web app manifest, served by Next at /manifest.webmanifest.
 *
 * Without one, a visitor who adds the site to a phone home screen gets a
 * truncated URL as the label and the browser's own chrome. This gives it the
 * clinic's name, the brand colours and a proper icon.
 *
 * ICONS: the only square icon in the repo is 115x115 (src/app/(frontend)/icon.png,
 * also served as the favicon and the apple-touch-icon). It is declared here so
 * the home-screen shortcut has an icon at all. Chrome's "Install app" prompt
 * additionally wants a 192x192 and a 512x512 PNG; neither exists yet, and they
 * have to come from the designer rather than be upscaled from 115px. Once they
 * do, drop them in /public and add two more entries below — nothing else here
 * needs to change.
 *
 * The hex values mirror the --rose and --ivory tokens in styles.css, which are
 * defined in oklch; a manifest only accepts hex/rgb, so they are converted
 * here. Keep them in step if the tokens move.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bavishi Fertility Institute",
    short_name: "Bavishi IVF",
    description:
      "India's trusted IVF experts since 1998 — 30,000+ successful pregnancies across 14 centres.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF9F6",
    theme_color: "#D81B60",
    icons: [
      {
        src: "/favicon.png",
        sizes: "115x115",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
