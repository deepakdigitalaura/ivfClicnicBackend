/* Find all blogs that still have Complete Guide / Key Numbers / externalImage blocks */
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token     = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("env vars required");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

// Already-done slugs
const DONE = new Set([
  // Wave 1
  "prp-ovarian-rejuvenation-boosting-egg-quality-and-fertility",
  "ivf-for-women-with-thyroid-disorders-what-patients-should-know",
  "complete-pregnancy-diet-chart-by-trimester-what-to-eat-in-the-first-second-third-trimester",
  "the-emotional-rollercoaster-of-ivf-why-mental-health-support-is-essential",
  "high-risk-pregnancy-due-to-diabetes-bp-thyroid-disorders",
  // Wave 2
  "iui-vs-ivf-which-fertility-treatment-is-right-for-you",
  "10-foods-to-improve-female-egg-quality",
  "how-male-infertility-affects-ivf-treatment",
  "how-nutrition-impacts-your-fertility-what-science-says",
  "icsi-vs-ivf-success-rates-benefits-and-risks-compared",
  // Wave 3
  "how-lifestyle-choices-of-both-partners-impact-icsi-success-rates",
  "how-pre-implantation-genetic-testing-boosts-ivf-success",
  "is-egg-freezing-a-good-option-if-i-want-to-delay-pregnancy",
  "ivf-after-35-navigating-fertility-challenges-with-confidence-and-hope",
  "how-to-improve-ovulation-naturally-when-you-have-pcos",
  // Wave 4
  "how-long-do-you-have-to-wait-to-try-again-after-a-miscarriage",
  "how-long-does-it-take-for-letrozole-to-get-out-of-your-system",
  "how-long-does-it-take-for-the-uterus-to-go-back-to-normal-after-birth",
  "how-long-should-you-see-a-gynecologist-after-delivery",
  "how-low-amh-affects-menstrual-cycle-regularity",
  // Wave 5
  "how-to-boost-your-ivf-success-rates-naturally",
  "how-to-choose-the-best-ivf-centre-in-india",
  "how-to-deal-with-ivf-failure",
  "how-to-find-the-right-ivf-specialist",
  "how-to-improve-your-chances-of-iui-success-naturally",
  // Wave 6
  "how-to-protect-your-mental-health-during-ivf-and-fertility-treatments",
  "a-complete-guide-on-explaining-periods-to-men",
  "indian-celebrities-who-improved-fertility-through-yoga",
  "a-guide-to-the-different-types-of-ivf-treatments",
  "innovative-treatments-for-low-amh",
  // Wave 7
  "how-to-prepare-for-your-first-iui-cycle-tips-and-advice",
  "icsi-dos-and-donts",
  "is-icsi-better-for-men-with-low-sperm-count",
  "is-iui-painful-everything-you-need-to-know",
  "is-ivf-painful",
  // Wave 8
  "is-ivf-possible-without-injections-understanding-easy-ivf-and-injection-free-ivf",
  "is-natural-cycle-ivf-better-for-women-with-poor-ovarian-reserve",
  "iui-process-explained-what-to-expect-at-every-step",
  "iui-side-effects-on-the-body-and-emotions-a-complete-guide",
  "a-quick-guide-on-the-ivf-journey-with-egg-donors",
  // Wave 9
  "iui-success-rate-what-to-expect-after-iui-treatment",
  "ivf-cost-in-ahmedabad-whats-included-how-to-plan-your-budget",
  "ivf-failure-doesnt-mean-the-end-what-can-you-do-next",
  "ivf-for-single-women-in-india-navigating-new-art-law",
  "ivf-pregnancy-week-by-week-symptoms-and-safety",
  // Wave 10
  "advancing-ovarian-science-a-full-day-scientific-program-in-surat",
  "ivf-pregnancy-with-pcos-and-endometriosis",
  "life-after-iui-precautions-lifestyle-tips-and-what-to-expect",
  "lifestyle-changes-that-boost-fertility-in-pcos-women",
  "lifestyle-changes-to-boost-ivf-success-and-increase-your-chances-of-a-healthy-pregnancy",
  // Wave 11
  "natural-conception-with-low-amh-levels",
  "necrozoospermia-symptoms-causes-and-treatment-options",
  "nourishing-your-body-after-embryo-transfer-a-comprehensive-guide",
  "ovarian-rejuvenation-for-restoring-fertility-a-new-ray-of-hope",
  "ovarian-rejuvenation-ivf-what-to-know-when-combining-treatments",
]);

type Block = { type: string; fields?: Record<string, unknown>; children?: Block[] };

async function main() {
  const docs = await sanity.fetch<{ _id: string; slug: string; title: string; contentRaw: string; status: string }[]>(
    `*[_type=="blog" && status=="published"]{_id,slug,title,contentRaw,status} | order(_id asc)`
  );

  console.log(`Total PUBLISHED blogs: ${docs.length}\n`);

  const candidates: { slug: string; title: string; _id: string; issues: string[] }[] = [];

  for (const doc of docs) {
    if (DONE.has(doc.slug)) continue;
    let children: Block[];
    try {
      children = (JSON.parse(doc.contentRaw) as { root: { children: Block[] } }).root.children;
    } catch { continue; }

    const issues: string[] = [];
    let hasPhoto = false;
    let hasCompleteGuide = false;
    let hasKeyNumbers = false;
    let hasInfographic = false;

    for (const node of children) {
      if (node.type !== "block") continue;
      const f = node.fields ?? {};
      const bt = f.blockType as string;
      const title = (f.title as string ?? "").toLowerCase();
      if (bt === "infographic") {
        hasInfographic = true;
        if (title.includes("complete guide") || title.includes("step-by-step")) hasCompleteGuide = true;
        if (title.includes("key number")) hasKeyNumbers = true;
      }
      if (bt === "externalImage") hasPhoto = true;
    }

    if (hasCompleteGuide) issues.push("Complete Guide / Step-by-Step infographic");
    if (hasKeyNumbers)   issues.push("Key Numbers infographic");
    if (hasPhoto)        issues.push("externalImage (photo)");
    if (hasInfographic && !hasCompleteGuide && !hasKeyNumbers) issues.push("other infographic(s)");

    if (issues.length > 0) candidates.push({ slug: doc.slug, title: doc.title, _id: doc._id, issues });
  }

  console.log(`Blogs with fixable content (${candidates.length} total):\n`);
  for (const c of candidates) {
    console.log(`▶ ${c._id}`);
    console.log(`  ${c.title}`);
    console.log(`  /blogs/${c.slug}`);
    console.log(`  Issues: ${c.issues.join(" | ")}`);
    console.log();
  }
}
main().catch(e => { console.error(e); process.exit(1); });
