/* Quick audit: list every custom block in each target blog's contentRaw */
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN required");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

const SLUGS = [
  "prp-ovarian-rejuvenation-boosting-egg-quality-and-fertility",
  "ivf-for-women-with-thyroid-disorders-what-patients-should-know",
  "complete-pregnancy-diet-chart-by-trimester-what-to-eat-in-the-first-second-third-trimester",
  "the-emotional-rollercoaster-of-ivf-why-mental-health-support-is-essential",
  "high-risk-pregnancy-due-to-diabetes-bp-thyroid-disorders",
];

type Block = { type: string; fields?: Record<string, unknown>; tag?: string; children?: Block[] };

function extractText(node: Block): string {
  if (node.type === "text") return (node as unknown as { text: string }).text ?? "";
  return (node.children ?? []).map(extractText).join("").slice(0, 80);
}

async function main() {
  for (const slug of SLUGS) {
    const doc = await sanity.fetch<{ _id: string; contentRaw: string; heroImageUrl?: string }>(
      `*[_type=="blog"&&slug=="${slug}"][0]{_id,contentRaw,heroImageUrl}`
    );
    if (!doc) { console.log(`❌ Not found: ${slug}`); continue; }

    const es = JSON.parse(doc.contentRaw) as { root: { children: Block[] } };
    const children = es.root.children;

    console.log(`\n${"─".repeat(80)}`);
    console.log(`▶ ${slug}`);
    console.log(`  _id: ${doc._id}   heroImageUrl: ${doc.heroImageUrl?.slice(0,60) ?? "(none)"}`);
    console.log(`  Total nodes: ${children.length}`);

    children.forEach((node, i) => {
      if (node.type === "heading") {
        const text = extractText(node);
        console.log(`  [${i}] H${(node as unknown as {tag:string}).tag?.slice(1)} "${text}"`);
      } else if (node.type === "block") {
        const f = node.fields ?? {};
        const bt = f.blockType as string ?? "?";
        let detail = "";
        if (bt === "infographic") {
          detail = ` title="${f.title as string ?? ""}"  svgLen=${((f.svgContent as string) ?? "").length}`;
        } else if (bt === "externalImage") {
          const url = f.url as string ?? "";
          detail = ` url=${url.includes("cdn.sanity.io") ? "✓sanity" : url.includes("pexels") ? "✗pexels" : url.slice(0,40)}  alt="${(f.alt as string ?? "").slice(0,50)}"`;
        } else if (bt === "statStrip") {
          const items = (f.items as {value:string;label:string}[]) ?? [];
          detail = ` [${items.map(it=>it.value).join(" | ")}]`;
        } else if (bt === "comparisonTable") {
          const rows = (f.rows as {rowLabel:string}[]) ?? [];
          detail = ` rowHeader="${f.rowHeader}"  ${rows.length} rows`;
        } else if (bt === "highlightCard") {
          detail = ` tagline="${(f.tagline as string ?? "").slice(0,50)}"`;
        } else if (bt === "conclusionPanel") {
          detail = ` headline="${(f.headline as string ?? "").slice(0,50)}"`;
        }
        console.log(`  [${i}] BLOCK:${bt}${detail}`);
      } else if (node.type === "table") {
        console.log(`  [${i}] native-TABLE`);
      }
    });
  }
}

main().catch(e => { console.error(e); process.exit(1); });
