#!/usr/bin/env node
// A follow-up to fix-title-meta-priority-pages.mjs / fix-blog-seo-batch-1.mjs /
// fix-blog-seo-remaining-267.mjs. Those three scripts were deliberately
// written to only fill EMPTY fields and never overwrite an existing
// seoMetaTitle/seoMetaDescription -- correct for preserving already-good
// content, but it meant a handful of posts that already had a title/
// description (predating this project, from an older bulk-enrichment pass)
// kept their existing values even where those values were themselves badly
// oversized (one was an 86-character title with a 199-character description).
//
// Found by auditing every published post's *current* field lengths against
// a 75-char title / 160-char description limit after the other three
// scripts ran: 6 titles and 9 descriptions (10 unique posts) were still over.
// This script deliberately DOES overwrite (unlike the other three) --
// intentional here, since the existing values are confirmed too long.
//
// Usage: node scripts/fix-blog-seo-length-violations.mjs [--dry-run]
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

const posts = [
  { slug: "food-for-better-egg-quality-how-sugar-affects-your-eggs", title: "How Sugar Affects Egg Quality", desc: "How excess sugar intake may affect egg quality, and foods that support better outcomes instead." },
  { slug: "azoospermia-can-you-have-a-baby-with-zero-sperm-count", title: "Azoospermia: Can You Have a Baby With Zero Sperm Count?", desc: "Zero sperm count in a semen analysis doesn't mean no biological children. Real options explained clearly." },
  { slug: "top-fertility-treatments-for-women-with-pcos", title: "Top Fertility Treatments for Women With PCOS", desc: "The most effective fertility treatments for PCOS, from lifestyle changes to IVF." },
  { slug: "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days", title: "Post-Embryo Transfer Timeline: Day 3, 5, 7 & 9", desc: "What's actually happening in your body 3, 5, 7, and 9 days after embryo transfer, and which symptoms are truly normal." },
  { slug: "dr-himanshu-bavishi-aogs-2026-recurrent-pregnancy-loss-panel", title: "Dr. Himanshu Bavishi on Recurrent Pregnancy Loss", desc: "Dr. Himanshu Bavishi moderates a panel on recurrent pregnancy loss at AOGS 2026." },
  { slug: "iui-for-unexplained-infertility", title: "IUI for Unexplained Infertility: How It Works", desc: "Why IUI is often the first recommended step for unexplained infertility, and how it works." },
  { slug: "how-to-choose-the-right-treatment-after-45", title: "Choosing the Right Fertility Treatment After 45", desc: "BFI's approach to choosing the right fertility treatment path for patients over 45." },
  { slug: "ivf-vs-icsi-why-we-use-icsi-and-the-male-partners-role", title: "IVF vs ICSI: Why We Use ICSI, and the Male's Role", desc: "Why ICSI is often used for all patients, and the male partner's role in the process." },
  { slug: "why-dr-himanshu-bavishi-is-the-best-ivf-specialist-in-ahmedabad-and-india", title: "Why Dr. Himanshu Bavishi Leads IVF Care in India", desc: "What sets Dr. Himanshu Bavishi apart as a leading IVF specialist in Ahmedabad and across India." },
  { slug: "dr-himanshu-bavishi-social-medical-egg-freezing-vadodara-bogs-isar", title: "Dr. Himanshu Bavishi on Egg Freezing at BOGS x ISAR", desc: "Dr. Himanshu Bavishi speaks on social and medical egg freezing at the Vadodara BOGS x ISAR meet." },
];

let changed = 0;
for (const p of posts) {
  const doc = await client.fetch(
    `*[_type == "blog" && slug == $slug][0]{_id, seoMetaTitle, seoMetaDescription}`,
    { slug: p.slug },
  );
  if (!doc) {
    console.log(`  NOT FOUND: ${p.slug}`);
    continue;
  }
  console.log(`${p.slug}`);
  console.log(`  title (${(doc.seoMetaTitle ?? "").length}c -> ${p.title.length}c): "${doc.seoMetaTitle}" -> "${p.title}"`);
  console.log(`  desc  (${(doc.seoMetaDescription ?? "").length}c -> ${p.desc.length}c)`);
  if (!dryRun) {
    await client.patch(doc._id).set({
      seoMetaTitle: p.title,
      seoMetaDescription: p.desc,
      seoOgTitle: p.title,
      seoOgDescription: p.desc,
    }).commit();
    changed++;
  }
}

console.log(dryRun ? `\n[dry-run] No writes performed. ${posts.length} posts would be updated.` : `\nDone. Updated ${changed} posts.`);
