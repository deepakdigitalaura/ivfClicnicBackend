#!/usr/bin/env node
// 9 blogs ended up with seoMetaTitle correctly in the 55-75 range (either
// already there, or fixed by fix-blog-title-range.mjs) but a separately-set
// seoOgTitle that was still short -- that script only touched posts where
// seoMetaTitle itself was under 55, so these 9 (where only seoOgTitle was
// short) were missed. Simplest correct fix: set seoOgTitle = seoMetaTitle
// for these 9, since the meta title is already good and in range.
//
// Usage: node scripts/fix-og-title-mismatch.mjs [--dry-run]
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

const slugs = [
  "vegetarian-diet-chart-for-pregnant-lady-protein-rich-indian-meal-plan",
  "a-guide-to-the-different-types-of-ivf-treatments",
  "pregnancy-signs-symptoms",
  "13-best-ivf-clinics-in-mumbai",
  "do-and-dont-for-fertility",
  "can-ivf-work-with-low-amh",
  "iui-treatment-with-fertility-medicines-what-patients-should-know",
  "superfoods-for-male-fertility-what-fertility-specialists-recommend",
  "icsi-treatment-for-men-with-poor-sperm-morphology-does-it-really-help",
];

let changed = 0;
for (const slug of slugs) {
  const doc = await client.fetch(`*[_type == "blog" && slug == $slug][0]{_id, seoMetaTitle, seoOgTitle}`, { slug });
  if (!doc) {
    console.log(`  NOT FOUND: ${slug}`);
    continue;
  }
  console.log(`${slug}\n  seoOgTitle (${(doc.seoOgTitle ?? "").length}c) "${doc.seoOgTitle}" -> (${doc.seoMetaTitle.length}c) "${doc.seoMetaTitle}"`);
  if (!dryRun) {
    await client.patch(doc._id).set({ seoOgTitle: doc.seoMetaTitle }).commit();
    changed++;
  }
}

console.log(dryRun ? `\n[dry-run] No writes performed. ${slugs.length} posts would be updated.` : `\nDone. Updated ${changed} posts.`);
