// Canonical post slug list straight from the WP REST API (paginated),
// far more reliable than scraping the sitemap (which has language-variant
// duplicates under /gu/, /ma/ and inconsistent /blog/ path prefixes that
// don't match the actual REST API slug).
const BASE = "https://ivfclinic.com";
let page = 1;
const slugs = [];
while (true) {
  const res = await fetch(`${BASE}/wp-json/wp/v2/posts?per_page=100&page=${page}&_fields=slug`);
  if (!res.ok) break;
  const arr = await res.json();
  if (!Array.isArray(arr) || arr.length === 0) break;
  for (const p of arr) slugs.push(p.slug);
  if (arr.length < 100) break;
  page++;
}
import fs from "fs";
fs.writeFileSync("scripts/import-blogs/wp-canonical-slugs.txt", slugs.join("\n") + "\n", "utf-8");
console.log(`total: ${slugs.length}`);
