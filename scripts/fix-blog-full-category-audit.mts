/* =====================================================================
 * Full-site blog category audit fix (2026-07-07).
 *
 * Follows a manual one-by-one review of all 275 published posts' title,
 * excerpt, hero image alt, and body content against their assigned
 * category. Three kinds of fixes, per the site owner's standing policy:
 * "always match the dedicated topic category over a general one".
 *
 *   - Gap-fills: posts left "Uncategorized" that clearly belong in an
 *     existing category (e.g. a sperm-count post with no category set).
 *   - Mistags: posts tagged into an unrelated category, usually because
 *     the title superficially resembles another category's name (e.g.
 *     "endometrial scratching" landing in "Endometriosis") or because an
 *     award/location post got the wrong genre tag.
 *   - Policy fixes: posts sitting in a general bucket (Maternity, Female
 *     Infertility, IVF, Ovarian Reserve) when a more specific dedicated
 *     category already exists and fits better (PCOS, Low AMH, Ovarian
 *     Rejuvenation, PGT, IUI, a city category, etc).
 *
 * Run:
 *   npx tsx --tsconfig tsconfig.json scripts/fix-blog-full-category-audit.mts --dry-run
 *   npx tsx --tsconfig tsconfig.json scripts/fix-blog-full-category-audit.mts
 * ===================================================================== */
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN required");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });
const DRY_RUN = process.argv.includes("--dry-run");

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const FIXES: { slug: string; categoryTitle: string }[] = [
  // Gap-fills
  { slug: "10-foods-that-will-increase-sperm-count-and-5-foods-to-avoid", categoryTitle: "Male Infertility" },
  { slug: "essential-tests-for-male-infertility-what-to-expect", categoryTitle: "Male Infertility" },
  { slug: "how-to-improve-male-infertility", categoryTitle: "Male Infertility" },
  { slug: "understanding-sperm-cramps-symptoms-causes-diagnosis-treatment", categoryTitle: "Male Infertility" },
  { slug: "male-infertility-signs-causes-treatment", categoryTitle: "Male Infertility" },
  { slug: "egg-freezing-your-fertility-time-capsule", categoryTitle: "Freezing" },
  { slug: "is-egg-freezing-a-good-option-if-i-want-to-delay-pregnancy", categoryTitle: "Freezing" },
  { slug: "natural-conception-with-low-amh-levels", categoryTitle: "Low AMH" },
  { slug: "understanding-ovarian-reserve-and-rejuvenation-a-guide", categoryTitle: "Ovarian Reserve" },
  { slug: "dr-parth-bavishi-honoured-with-the-prestigious-achiever-award-at-fertivision-2025", categoryTitle: "Awards" },
  { slug: "insights-on-fertility-dr-bavishi-team-at-palanpur-society", categoryTitle: "CME" },
  { slug: "ectopic-pregnancy", categoryTitle: "Maternity" },
  { slug: "r-j-lajja-of-my-fm-taking-interview-of-dr-parth-bavishi", categoryTitle: "CME" },
  { slug: "what-are-microplastics-how-do-they-affect-reproductive-health", categoryTitle: "Female Infertility" },
  { slug: "bavishi-fertility-institute-nikol-ahmedabad-celebrates-its-first-anniversary", categoryTitle: "Ahmedabad" },

  // Mistags (tagged into an unrelated category)
  { slug: "uterine-fibroids-symptoms-causes-and-treatment", categoryTitle: "Fibroid" },
  { slug: "endometrial-scratching-before-ivf-evidence-benefits-and-risks", categoryTitle: "IVF" },
  { slug: "ivf-stimulation-protocols-a-comprehensive-guide", categoryTitle: "IVF" },
  { slug: "why-do-some-embryos-not-implant-even-if-they-look-healthy", categoryTitle: "Female Infertility" },
  { slug: "bavishi-fertility-institute-honoured-at-times-healthcare-leaders-awards-2025", categoryTitle: "Awards" },
  { slug: "bavishi-fertility-institute-most-trusted-fertility-chain-hospital-in-gujarat", categoryTitle: "Awards" },
  { slug: "bavishi-fertility-institute-recognized-as-the-leading-ivf-chain-of-gujarat-by-radio-city", categoryTitle: "Awards" },
  { slug: "blastocyst-transfer-in-special-situations-pcos-poor-responders-recurrent-ivf-failure-endometriosis-uterine-factors", categoryTitle: "IVF" },

  // Dedicated-topic-over-general policy
  { slug: "from-diagnosis-to-conception-managing-pcos-for-a-healthy-pregnancy", categoryTitle: "PCOS" },
  { slug: "how-to-improve-ovulation-naturally-when-you-have-pcos", categoryTitle: "PCOS" },
  { slug: "unlocking-hope-getting-pregnant-with-pcos-and-irregular-periods", categoryTitle: "PCOS" },
  { slug: "12-tips-for-getting-pregnant-faster-with-pcos-a-step-by-step-guide", categoryTitle: "PCOS" },
  { slug: "innovative-treatments-for-low-amh", categoryTitle: "Low AMH" },
  { slug: "reasons-behind-low-amh-levels-ways-to-increase", categoryTitle: "Low AMH" },
  { slug: "13-best-ivf-clinics-in-mumbai", categoryTitle: "Mumbai" },
  { slug: "when-to-take-a-pregnancy-test-after-iui-timing-and-accuracy-explained", categoryTitle: "IUI" },
  { slug: "prp-ovarian-rejuvenation-boosting-egg-quality-and-fertility", categoryTitle: "Ovarian Rejuvenation" },
  { slug: "prp-vs-traditional-fertility-treatments-whats-the-difference", categoryTitle: "Ovarian Rejuvenation" },
  { slug: "pgt-for-couples-with-recurrent-ivf-failure-or-miscarriages-does-it-help", categoryTitle: "PGT" },
  { slug: "how-pre-implantation-genetic-testing-boosts-ivf-success", categoryTitle: "PGT" },

  // Trying-to-conceive content wrongly bucketed under Maternity/IVF
  { slug: "can-you-get-pregnant-with-ovarian-cysts", categoryTitle: "Female Infertility" },
  { slug: "fertility-ovulation-facts-to-help-you-get-pregnant", categoryTitle: "Female Infertility" },
  { slug: "trying-to-conceive-after-40-what-you-need-to-know", categoryTitle: "Female Infertility" },
  { slug: "ovarian-cysts-symptoms-causes-treatment-diagnosis", categoryTitle: "Female Infertility" },
  { slug: "ivf-pregnancy-week-by-week-symptoms-and-safety", categoryTitle: "Maternity" },
  { slug: "a-complete-guide-on-explaining-periods-to-men", categoryTitle: "Female Infertility" },
];

async function main() {
  let changed = 0;
  for (const fix of FIXES) {
    const doc = await sanity.fetch<{ _id: string; categoryTitle: string | null } | null>(
      `*[_type=="blog"&&slug==$slug][0]{_id,categoryTitle}`,
      { slug: fix.slug },
    );
    if (!doc?._id) {
      console.error(`[skip] not found: ${fix.slug}`);
      continue;
    }
    if (doc.categoryTitle === fix.categoryTitle) {
      console.log(`[ok] ${fix.slug}: already "${fix.categoryTitle}"`);
      continue;
    }
    console.log(`${fix.slug}: "${doc.categoryTitle}" -> "${fix.categoryTitle}"`);
    changed++;
    if (DRY_RUN) continue;
    await sanity
      .patch(doc._id)
      .set({ categoryTitle: fix.categoryTitle, categorySlug: slugify(fix.categoryTitle) })
      .commit();
  }
  console.log(`\n${DRY_RUN ? "[dry-run] would change" : "changed"}: ${changed}/${FIXES.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
