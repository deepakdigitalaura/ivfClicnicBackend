/* =====================================================================
 * One-off fix for blogs migrated with the wrong category.
 *
 * Root cause: scripts/import-blogs/extract.mts picked terms[0] from
 * WordPress's category list, which is returned alphabetically — not in
 * order of relevance. This bit in both directions:
 *   - Several posts are cross-tagged "Male Infertility" + "Maternity";
 *     "Male Infertility" sorts first and won even though the post has
 *     nothing to do with it (postpartum/pregnancy content).
 *   - 1 post (azoospermia) is cross-tagged "IVF" + "Male Infertility";
 *     here "IVF" sorts first and won even though every sibling post on
 *     the same diagnosis pattern (oligospermia, asthenospermia, etc.) is
 *     correctly tagged "Male Infertility".
 * Fixed at the source in extract.mts (deprioritizes "Male Infertility"
 * when another category is present); this script repairs the posts
 * already imported before that fix landed.
 *
 * "Recurrent miscarriage" was reviewed against sibling posts on the same
 * sub-topic (recurrent-loss workup articles) and landed on Female
 * Infertility rather than Maternity — an editorial call, not the same
 * mechanical bug, made after reading the article's actual content.
 * "How many embryos should be transferred" was also reviewed (it reads as
 * an IVF-treatment-decision article, same genre as other embryo-transfer
 * posts tagged IVF) but the site owner opted to keep it under Maternity.
 *
 * A handful of other multi-category posts (IMSI, ICSI-for-low-sperm-count,
 * "how male infertility affects IVF", the Ahmedabad male-infertility
 * roundup) were reviewed and left as-is — genuinely defensible either way,
 * not clear defects.
 *
 * Run:
 *   npx tsx --tsconfig tsconfig.json scripts/fix-blog-category-mismatches.mts --dry-run
 *   npx tsx --tsconfig tsconfig.json scripts/fix-blog-category-mismatches.mts
 * ===================================================================== */
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN required");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });
const DRY_RUN = process.argv.includes("--dry-run");

const FIXES: { slug: string; categoryTitle: string; categorySlug: string }[] = [
  { slug: "how-many-embryos-should-be-transferred-risks-of-multiple-pregnancy-explained", categoryTitle: "Maternity", categorySlug: "maternity" },
  { slug: "lifestyle-diet-rest-tips-for-high-risk-pregnancy", categoryTitle: "Maternity", categorySlug: "maternity" },
  { slug: "postpartum-mental-health-recognizing-baby-blues-and-postpartum-depression", categoryTitle: "Maternity", categorySlug: "maternity" },
  { slug: "recurrent-miscarriage-why-does-it-keep-happening-and-what-can-you-do", categoryTitle: "Female Infertility", categorySlug: "female-infertility" },
  { slug: "unexplained-infertility-when-tests-are-normal-but-you-still-cant-conceive", categoryTitle: "Maternity", categorySlug: "maternity" },
  { slug: "when-can-you-start-exercising-after-delivery", categoryTitle: "Maternity", categorySlug: "maternity" },
  { slug: "azoospermia-can-you-have-a-baby-with-zero-sperm-count", categoryTitle: "Male Infertility", categorySlug: "male-infertility" },
];

async function main() {
  for (const fix of FIXES) {
    const doc = await sanity.fetch<{ _id: string; categoryTitle: string | null } | null>(
      `*[_type=="blog"&&slug==$slug][0]{_id,categoryTitle}`,
      { slug: fix.slug },
    );
    if (!doc?._id) {
      console.error(`[skip] not found: ${fix.slug}`);
      continue;
    }
    console.log(`${fix.slug}: "${doc.categoryTitle}" -> "${fix.categoryTitle}"`);
    if (DRY_RUN) continue;
    await sanity
      .patch(doc._id)
      .set({ categoryTitle: fix.categoryTitle, categorySlug: fix.categorySlug })
      .commit();
    console.log(`  ✅ patched ${doc._id}`);
  }
  if (DRY_RUN) console.log("\nDRY RUN — no writes made. Re-run without --dry-run to apply.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
