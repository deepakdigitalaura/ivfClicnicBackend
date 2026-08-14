#!/usr/bin/env node
/* =====================================================================
 * match-gsc-top150.mjs
 * Compares the GSC top-150 URL list (scripts/gsc_top150_urls.txt) against
 * every blog slug currently live on production. Read-only — makes no
 * changes. Prints matched / unmatched so we can confirm before any
 * publish/draft flip.
 *
 * Run: node scripts/match-gsc-top150.mjs
 * ===================================================================== */
import { readFileSync } from "fs";

const BASE = process.env.PAYLOAD_URL ?? "https://ivf-clicnic-backend-weld.vercel.app";

const slugFromUrl = (url) => {
  const path = new URL(url).pathname.replace(/^\/+|\/+$/g, ""); // trim slashes
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1]; // last segment, drops a leading "blog/" prefix
};

async function main() {
  const lines = readFileSync(new URL("./gsc_top150_urls.txt", import.meta.url), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const wanted = lines.map((url) => ({ url, slug: slugFromUrl(url) }));
  console.log(`[match] ${wanted.length} target slugs from GSC list`);

  const allBlogs = [];
  let page = 1;
  const limit = 100;
  let total = 0;
  do {
    const res = await fetch(
      `${BASE}/api/blogs?limit=${limit}&page=${page}&depth=0&select[slug]=true&select[title]=true&select[_status]=true`
    );
    const data = await res.json();
    allBlogs.push(...(data.docs ?? []));
    total = data.totalDocs ?? 0;
    page++;
  } while ((page - 1) * limit < total);

  console.log(`[match] ${allBlogs.length} blog posts found live (totalDocs=${total})`);

  const bySlug = new Map(allBlogs.map((b) => [b.slug, b]));

  const matched = [];
  const unmatched = [];
  for (const w of wanted) {
    const blog = bySlug.get(w.slug);
    if (blog) matched.push({ ...w, id: blog.id, status: blog._status });
    else unmatched.push(w);
  }

  console.log(`\n=== MATCHED (${matched.length}/${wanted.length}) ===`);
  for (const m of matched) console.log(`  ✓ ${m.slug}  [id ${m.id}, status=${m.status}]`);

  console.log(`\n=== UNMATCHED — no blog post found for this slug (${unmatched.length}) ===`);
  for (const u of unmatched) console.log(`  ✗ ${u.slug}   (from ${u.url})`);

  const toHide = allBlogs.filter((b) => !matched.some((m) => m.id === b.id));
  console.log(`\n=== WOULD BE HIDDEN (set to draft) — currently published, not in top 150 (${toHide.length}) ===`);
  for (const h of toHide.slice(0, 20)) console.log(`  - ${h.slug} [id ${h.id}, status=${h._status}]`);
  if (toHide.length > 20) console.log(`  ... and ${toHide.length - 20} more`);
}

main().catch((err) => {
  console.error("[match] FAILED:", err.message);
  process.exit(1);
});
