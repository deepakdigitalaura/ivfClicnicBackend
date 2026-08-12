#!/usr/bin/env node
// One-time cleanup: clear truncated seoMetaTitle/seoMetaDescription fields on Sanity
// blog docs (baked-in "…" cutoffs from an old bulk-enrichment script). Clearing them
// lets generateMetadata() fall back to the clean title/excerpt fields.
// Usage: node scripts/fix-blog-seo-truncation.mjs [--dry-run]
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
const dryRun = process.argv.includes("--dry-run");

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN env vars");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const QUERY = `*[_type=="blog" && (seoMetaTitle match "*…" || seoMetaDescription match "*…")]{ _id, title, seoMetaTitle, seoMetaDescription }`;

const docs = await client.fetch(QUERY);
console.log(`Found ${docs.length} affected blog posts.`);

if (dryRun) {
  for (const d of docs.slice(0, 5)) {
    console.log(`  ${d._id} "${d.title}"\n    title: ${d.seoMetaTitle}\n    desc:  ${d.seoMetaDescription}`);
  }
  console.log(dryRun ? "\n[dry-run] No writes performed." : "");
  process.exit(0);
}

let fixed = 0;
for (const d of docs) {
  const unset = [];
  if (typeof d.seoMetaTitle === "string" && d.seoMetaTitle.endsWith("…")) unset.push("seoMetaTitle");
  if (typeof d.seoMetaDescription === "string" && d.seoMetaDescription.endsWith("…")) unset.push("seoMetaDescription");
  if (unset.length === 0) continue;
  await client.patch(d._id).unset(unset).commit();
  fixed++;
  if (fixed % 25 === 0) console.log(`  ...${fixed} done`);
}

console.log(`Done. Cleared truncated SEO overrides on ${fixed} posts.`);
