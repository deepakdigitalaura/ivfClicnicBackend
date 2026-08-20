/* =====================================================================
 * set-blog-authors.mts
 *
 * 1. Ensures Dr. Parth Bavishi (ID 3) has full bio, credentials & role.
 * 2. Ensures Dr. Himanshu Bavishi (ID 2) has correct credentials & role.
 * 3. Sets author = 3, reviewedBy = 2 on EVERY blog post.
 *
 * IDEMPOTENT — safe to re-run.
 *
 * Run against LOCAL:
 *   npx tsx --env-file=.env.local --tsconfig tsconfig.json scripts/set-blog-authors.mts
 *
 * Run against PROD:
 *   npx tsx --env-file=.env.production --tsconfig tsconfig.json scripts/set-blog-authors.mts
 * ===================================================================== */

import { getPayload } from "payload";
import config from "@payload-config";

/* IDs resolved dynamically by name — works in both local and prod DB */
const DR_PARTH_NAME    = "Dr. Parth Bavishi";
const DR_HIMANSHU_NAME = "Dr. Himanshu Bavishi";

/* ── Dr. Parth Bavishi — full detailed bio ───────────────────────────── */
const PARTH_BIO = `Dr. Parth Bavishi holds an MD in Obstetrics and Gynaecology and brings over 12 years of specialist experience as Co-director and IVF Specialist at Bavishi Fertility Institute — a group of fertility centres across India committed to helping couples realise their dream of parenthood.

His clinical focus is on complex and challenging cases: male-factor infertility, poor sperm quality, high sperm DNA fragmentation, and repeated IVF failure. He has received specialised infertility training at three internationally recognised institutions — Bavishi Fertility Institute, the Diamond Institute (USA), and the HART Institute (Japan) — giving him a uniquely broad perspective on the latest global advances in reproductive medicine.

Dr. Bavishi is the author of 'Your Miracle in Making: A Couple's Guide to Pregnancy,' an acclaimed book that offers practical, compassionate guidance to couples navigating the emotional and medical complexities of fertility treatment. His philosophy is rooted in patient empowerment: he believes that informed patients make better decisions, and he is committed to education both in the clinic and through public awareness.

His outstanding contributions to the field of reproductive medicine have been recognised with the prestigious Rose of Paracelsus Award from the European Medical Association. He is a regular invited faculty member at national and international conferences, sharing expertise on advanced reproductive techniques and male infertility.

Under his leadership, Bavishi Fertility Institute is dedicated to treatments that are simple, safe, smart, and successful — blending clinical excellence with the personalised, compassionate care that every patient deserves.`;

async function main() {
  const payload = await getPayload({ config });

  /* ── List all authors to find IDs ─────────────────────────────────── */
  const allAuthors = await payload.find({ collection: "authors", limit: 50, depth: 0 });
  console.log("\n📋  Authors in this DB:");
  allAuthors.docs.forEach(a => console.log(`    ID ${a.id}  →  ${a.name}`));

  const parthDoc    = allAuthors.docs.find(a => a.name === DR_PARTH_NAME);
  let himanshuDoc   = allAuthors.docs.find(a => a.name === DR_HIMANSHU_NAME);

  if (!parthDoc) throw new Error(`Author not found: "${DR_PARTH_NAME}"`);

  /* Create Dr. Himanshu if missing from this DB */
  if (!himanshuDoc) {
    console.log(`\n  ⚡ "${DR_HIMANSHU_NAME}" not found — creating…`);
    himanshuDoc = await payload.create({
      collection: "authors",
      data: {
        name: DR_HIMANSHU_NAME,
        slug: "dr-himanshu-bavishi",
        credentials: "MBBS, MD (Obstetrics & Gynaecology), DNB",
        role: "Director & IVF Specialist",
      },
    });
    console.log(`  ✅ Created "${DR_HIMANSHU_NAME}" with ID ${himanshuDoc.id}`);
  }

  const DR_PARTH_ID    = parthDoc.id;
  const DR_HIMANSHU_ID = himanshuDoc.id;
  console.log(`\n  Dr. Parth Bavishi    → ID ${DR_PARTH_ID}`);
  console.log(`  Dr. Himanshu Bavishi → ID ${DR_HIMANSHU_ID}\n`);

  /* ── 1. Update Dr. Parth Bavishi ──────────────────────────────────── */
  await payload.update({
    collection: "authors",
    id: DR_PARTH_ID,
    data: {
      credentials: "MBBS, MD (Obstetrics & Gynaecology)",
      role: "Co-director & IVF Specialist",
      bio: PARTH_BIO,
    },
  });
  console.log(`✅  Author ID ${DR_PARTH_ID} (Dr. Parth Bavishi) — bio + credentials updated.`);

  /* ── 2. Update Dr. Himanshu Bavishi ───────────────────────────────── */
  await payload.update({
    collection: "authors",
    id: DR_HIMANSHU_ID,
    data: {
      credentials: "MBBS, MD (Obstetrics & Gynaecology), DNB",
      role: "Director & IVF Specialist",
    },
  });
  console.log(`✅  Author ID ${DR_HIMANSHU_ID} (Dr. Himanshu Bavishi) — credentials updated.`);

  /* ── 3. Batch-update all blogs ─────────────────────────────────────── */
  let page = 1;
  const limit = 50;
  let totalDocs = 0;
  let processed = 0;
  let updated = 0;

  console.log("\n🚀  Updating all blog posts…\n");

  do {
    const result = await payload.find({
      collection: "blogs",
      page,
      limit,
      depth: 0,
      select: { id: true, slug: true, author: true, reviewedBy: true },
    });

    if (page === 1) {
      totalDocs = result.totalDocs;
      console.log(`📚  Found ${totalDocs} blog posts.\n`);
    }

    for (const blog of result.docs) {
      processed++;
      await payload.update({
        collection: "blogs",
        id: blog.id,
        data: {
          author:     DR_PARTH_ID,
          reviewedBy: DR_HIMANSHU_ID,
        },
      });
      updated++;
      console.log(`  ✅  [${processed}/${totalDocs}] ${blog.slug}`);

      /* 300 ms pacing — prod-safe */
      await new Promise(r => setTimeout(r, 300));
    }

    page++;
  } while ((page - 1) * limit < totalDocs);

  console.log(`\n🎉  Done!`);
  console.log(`   Author records updated : 2 (Dr. Parth + Dr. Himanshu)`);
  console.log(`   Blog posts updated     : ${updated} / ${totalDocs}`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
