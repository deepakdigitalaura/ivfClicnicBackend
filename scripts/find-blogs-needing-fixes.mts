/* Find all blogs that still have Complete Guide / Key Numbers / externalImage blocks */
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token     = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("env vars required");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

// Already-done slugs
const DONE = new Set([
  "prp-ovarian-rejuvenation-boosting-egg-quality-and-fertility",
  "ivf-for-women-with-thyroid-disorders-what-patients-should-know",
  "complete-pregnancy-diet-chart-by-trimester-what-to-eat-in-the-first-second-third-trimester",
  "the-emotional-rollercoaster-of-ivf-why-mental-health-support-is-essential",
  "high-risk-pregnancy-due-to-diabetes-bp-thyroid-disorders",
]);

type Block = { type: string; fields?: Record<string, unknown>; children?: Block[] };

async function main() {
  const docs = await sanity.fetch<{ _id: string; slug: string; title: string; contentRaw: string }[]>(
    `*[_type=="blog"]{_id,slug,title,contentRaw} | order(_id asc)`
  );

  console.log(`Total published blogs with contentRaw: ${docs.length}\n`);

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
