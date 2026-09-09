#!/usr/bin/env node
/* =============================================================================
 * patch-azoospermia-decisionlist.mjs
 * The decisionList "recommendation" pill is designed for short badge text
 * (see every other blog's decisionList items — 3-10 words). This blog's
 * recommendations were written as full sentences, which breaks the pill
 * into an oversized rounded-rectangle blob. Shorten to badge-length text;
 * the clinical detail already lives in the "situation" field and the
 * surrounding prose (OA/NOA sections above).
 * Run: node scripts/patch-azoospermia-decisionlist.mjs
 * ============================================================================= */
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN required");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });
const slug = "azoospermia-can-you-have-a-baby-with-zero-sperm-count";

// situation substring -> new short recommendation
const SHORT_RECS = [
  ["vasectomy reversal not desired", "PESA first — over 90% success"],
  ["congenital bilateral absence of vas deferens", "PESA or MESA — confirm CFTR testing first"],
  ["klinefelter syndrome", "micro-TESE by a microsurgical specialist"],
  ["y-chromosome microdeletion", "micro-TESE if AZFb/AZFc; donor sperm if AZFa"],
  ["noa with unknown cause", "Hormonal optimisation first, then micro-TESE"],
  ["post-chemotherapy or post-radiation", "Use banked sperm, or micro-TESE after 2 years"],
];

const run = async () => {
  const doc = await sanity.fetch(`*[_type=="blog"&&slug=="${slug}"][0]{_id,contentRaw}`);
  if (!doc?._id) throw new Error(`Blog not found: ${slug}`);
  console.log(`Found: ${doc._id}`);

  const es = JSON.parse(doc.contentRaw);
  const children = es.root.children;

  const block = children.find((n) => n.type === "block" && n.fields?.blockType === "decisionList");
  if (!block) throw new Error("decisionList block not found");

  let updated = 0;
  for (const item of block.fields.items ?? []) {
    const situation = String(item.situation ?? "").toLowerCase();
    const match = SHORT_RECS.find(([needle]) => situation.includes(needle));
    if (match) {
      console.log(`  "${item.recommendation}"\n  -> "${match[1]}"`);
      item.recommendation = match[1];
      updated++;
    } else {
      console.warn(`  ⚠ no match for situation: ${item.situation}`);
    }
  }
  if (updated !== SHORT_RECS.length) {
    throw new Error(`Expected ${SHORT_RECS.length} updates, got ${updated} — aborting without patch`);
  }

  const newContentRaw = JSON.stringify(es);
  await sanity.patch(doc._id).set({ contentRaw: newContentRaw }).commit();
  console.log(`\n✅ Patched ${doc._id} (${newContentRaw.length} bytes)`);
};

run().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
