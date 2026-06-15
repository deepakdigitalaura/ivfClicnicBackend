import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "@/lib/revalidate";
import { isEditor } from "@/access/roles";

/**
 * SEO Settings (Phase B.3) — the editable side of robots.txt. `src/app/robots.ts`
 * reads this global to decide what search engines may crawl. The Sitemap line and
 * the always-blocked internal paths (/admin, /api, editor routes) are added
 * automatically, so staff only choose visibility + any extra blocked paths.
 *
 * Read is public (robots.ts renders for crawlers); update is staff-only. Edits
 * bust `global:seo-settings` so robots.txt regenerates on the next request.
 */
export const SeoSettings: GlobalConfig = {
  slug: "seo-settings",
  label: "Search Engines & Robots",
  admin: {
    group: "SEO Tools",
    description:
      "Controls robots.txt — what search engines are allowed to crawl. The sitemap link is added for you automatically.",
  },
  access: { read: () => true, update: isEditor },
  hooks: revalidateGlobal("seo-settings"),
  fields: [
    {
      name: "discourageSearchEngines",
      type: "checkbox",
      defaultValue: false,
      label: "Hide the entire site from search engines",
      admin: {
        description:
          "⚠️ When ON, robots.txt blocks ALL crawling (Disallow: /) — use this only on a staging/test site. Keep it OFF for the live website.",
      },
    },
    {
      name: "disallowPaths",
      type: "array",
      labels: { singular: "Blocked path", plural: "Blocked paths" },
      admin: {
        description:
          "Specific paths search engines should NOT crawl (e.g. /thank-you). One per row. The admin panel and internal pages are always blocked automatically.",
      },
      fields: [
        { name: "path", type: "text", required: true, label: "Path", admin: { description: "Starts with / — e.g. /thank-you" } },
      ],
    },
  ],
};
