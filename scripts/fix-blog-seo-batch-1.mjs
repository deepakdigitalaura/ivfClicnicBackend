#!/usr/bin/env node
// Batch 1 of 283 published blogs: fills SEO Meta Title/Description and
// Social Share (OG) Title/Description on the 15 highest-traffic blog posts
// still missing them (per the 21 Sep audit: 282 of 283 published blogs are
// missing at least one of these 4 fields; 250 are missing all 4).
//
// Social Share Title/Description are set equal to the SEO Meta Title/
// Description for each post — standard practice, and keeps this batch to
// one title + one description per post instead of four separate strings.
//
// Ranked by real 90-day Search Console impressions (highest first).
//
// Usage: node scripts/fix-blog-seo-batch-1.mjs [--dry-run]
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
  { slug: "how-long-does-it-take-for-the-uterus-to-go-back-to-normal-after-birth", title: "How Long Does the Uterus Take to Shrink After Birth?", desc: "The uterus returns to its pre-pregnancy size in about 6 weeks. Here's the week-by-week timeline and what's normal." },
  { slug: "10-foods-to-improve-female-egg-quality", title: "10 Foods to Improve Female Egg Quality", desc: "10 foods that may support better egg quality, backed by nutrition science — plus what to limit while trying to conceive." },
  { slug: "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide", title: "Do's and Don'ts After IUI Treatment: Complete Guide", desc: "What to do — and avoid — after IUI, from activity restrictions to medication timing, explained by fertility specialists." },
  { slug: "can-varicocele-be-treated-without-surgery-exploring-your-options", title: "Can Varicocele Be Treated Without Surgery?", desc: "Yes, in many cases. Lifestyle changes, medication, and embolization are real non-surgical options — here's when each works." },
  { slug: "10-foods-that-will-increase-sperm-count-and-5-foods-to-avoid", title: "10 Foods to Increase Sperm Count (and 5 to Avoid)", desc: "Foods that may naturally support sperm count and quality, and 5 to cut back on — explained by fertility specialists." },
  { slug: "what-happens-after-embryo-transfer-day-by-day", title: "What Happens After Embryo Transfer, Day by Day", desc: "A day-by-day guide to what's happening in your body after embryo transfer, and which symptoms are actually normal." },
  { slug: "can-you-get-pregnant-with-ovarian-cysts", title: "Can You Get Pregnant With Ovarian Cysts?", desc: "Most ovarian cysts don't stop pregnancy. Here's when they matter for fertility, and when to see a specialist." },
  { slug: "how-long-do-you-have-to-wait-to-try-again-after-a-miscarriage", title: "How Long to Wait to Conceive After a Miscarriage", desc: "Physically, one normal cycle may be enough — but the right wait depends on you. What doctors actually recommend." },
  { slug: "how-much-weight-can-a-baby-gain-in-a-week-in-the-womb", title: "How Much Weight Does a Baby Gain Per Week in the Womb?", desc: "A week-by-week look at healthy fetal weight gain, and what can cause a baby to grow faster or slower than expected." },
  { slug: "reasons-for-iui-failure-symptoms-and-causes", title: "Reasons for IUI Failure: Symptoms and Causes", desc: "Why an IUI cycle may not work — from timing and sperm quality to underlying fertility issues — and what to consider next." },
  { slug: "can-a-woman-get-pregnant-once-her-periods-stop", title: "Can a Woman Get Pregnant After Periods Stop?", desc: "Once periods stop for good (menopause), natural pregnancy isn't possible — but there are still paths to parenthood." },
  { slug: "what-is-the-non-stress-test-nst-in-pregnancy-and-why-is-it-important", title: "What Is the Non-Stress Test (NST) in Pregnancy?", desc: "Why doctors recommend the NST in pregnancy, how it works, and what the results actually mean for you and your baby." },
  { slug: "when-should-you-get-3d-4d-ultrasound-during-pregnancy", title: "When Should You Get a 3D/4D Ultrasound?", desc: "The best weeks for a 3D/4D ultrasound to see clear facial features, and what it can and can't tell you." },
  { slug: "what-to-eat-during-pregnancy-a-week-by-week-nutrition-plan", title: "Pregnancy Nutrition: A Week-by-Week Eating Plan", desc: "What to eat at each stage of pregnancy, and why your nutritional needs shift as your baby grows." },
  { slug: "a-complete-guide-on-explaining-periods-to-men", title: "Explaining Periods to Men: A Complete Guide", desc: "A clear, judgment-free guide for men who want to actually understand periods — the basics, myths, and how to be supportive." },
];

let changed = 0;
for (const p of posts) {
  const doc = await client.fetch(`*[_type == "blog" && slug == $slug][0]{_id, seoMetaTitle, seoMetaDescription, seoOgTitle, seoOgDescription}`, { slug: p.slug });
  if (!doc) {
    console.log(`  NOT FOUND: ${p.slug}`);
    continue;
  }

  // Only fill fields that are actually empty -- never overwrite an existing
  // value (some posts may already have one of these 4 fields set).
  const empty = (v) => v === null || v === undefined || (typeof v === "string" && v.trim() === "");
  const patch = {};
  if (empty(doc.seoMetaTitle)) patch.seoMetaTitle = p.title;
  if (empty(doc.seoMetaDescription)) patch.seoMetaDescription = p.desc;
  if (empty(doc.seoOgTitle)) patch.seoOgTitle = p.title;
  if (empty(doc.seoOgDescription)) patch.seoOgDescription = p.desc;

  if (Object.keys(patch).length === 0) {
    console.log(`${p.slug}\n  all 4 fields already filled -- skipping`);
    continue;
  }
  console.log(`${p.slug}`);
  for (const [field, value] of Object.entries(patch)) console.log(`  ${field}: (empty) -> "${value}"`);

  if (!dryRun) {
    await client.patch(doc._id).set(patch).commit();
    changed++;
  }
}

console.log(dryRun ? `\n[dry-run] No writes performed. ${posts.length} posts checked.` : `\nDone. Updated ${changed} posts.`);
