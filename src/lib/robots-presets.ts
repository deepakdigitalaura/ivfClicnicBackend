import { SITE } from "@/lib/seo";

const sitemapLine = `Sitemap: ${SITE.url}/sitemap.xml`;

export const ROBOTS_PRESETS: { key: string; label: string; content: string }[] = [
  {
    key: "allow-all",
    label: "Allow All (Default)",
    content: `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin-panel
Disallow: /api
Disallow: /edit
Disallow: /studio
Disallow: /live-preview
Disallow: /preview
Disallow: /exit-preview

${sitemapLine}
`,
  },
  {
    key: "block-admin-api",
    label: "Block Admin & API",
    content: `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin-panel
Disallow: /api
Disallow: /studio

${sitemapLine}
`,
  },
  {
    key: "block-all",
    label: "Block All Bots",
    content: `User-agent: *
Disallow: /
`,
  },
  {
    key: "googlebot-only",
    label: "Googlebot Only",
    content: `User-agent: Googlebot
Allow: /

User-agent: *
Disallow: /

${sitemapLine}
`,
  },
];

/** Served at /robots.txt when no content has been saved yet. */
export const DEFAULT_ROBOTS_TXT = ROBOTS_PRESETS[0].content;
