/* Revert Wave 17 blogs to their pre-Wave-17 state using Sanity document history */
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token     = process.env.SANITY_API_TOKEN!;
if (!projectId || !token) throw new Error("env vars required");

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

// Wave 16 was committed at 2026-07-03T06:14:28Z — Wave 17 patches started after that.
// Using 06:16Z gives us the post-Wave-16 / pre-Wave-17 state for each blog.
const HISTORY_TIME = "2026-07-03T06:16:00Z";

const BLOGS = [
  { id: "blog-pg-213", slug: "the-role-of-endometrial-receptivity-in-ivf-success" },
  { id: "blog-pg-215", slug: "the-thyroid-connection-understanding-its-role-in-female-fertility-health" },
  { id: "blog-pg-219", slug: "top-10-reasons-to-consider-egg-freezing" },
  { id: "blog-pg-220", slug: "top-fertility-treatments-for-women-with-pcos" },
  { id: "blog-pg-221", slug: "trying-to-conceive-after-40-what-you-need-to-know" },
];

interface HistoryDoc {
  _id: string;
  _updatedAt: string;
  _rev: string;
  contentRaw: string;
}

async function main() {
  for (const { id, slug } of BLOGS) {
    console.log(`\n▶ Reverting ${id} (${slug})`);

    const response = await client.request<{ documents: HistoryDoc[] }>({
      url: `/data/history/${dataset}/documents/${id}?time=${HISTORY_TIME}`,
    });

    const hist = response.documents?.[0];
    if (!hist) {
      console.log(`  ❌ No history document found`);
      continue;
    }
    if (!hist.contentRaw) {
      console.log(`  ❌ No contentRaw in historical document`);
      continue;
    }

    console.log(`  Historical _updatedAt: ${hist._updatedAt}`);
    const parsed = JSON.parse(hist.contentRaw) as { root: { children: unknown[] } };
    console.log(`  Historical block count: ${parsed.root.children.length}`);

    await client.patch(id).set({ contentRaw: hist.contentRaw }).commit();
    console.log(`  ✅ Reverted to pre-Wave-17 state (${hist.contentRaw.length} bytes)`);
  }

  console.log("\n✅ All 5 Wave 17 blogs reverted.");
}

main().catch(e => { console.error(e); process.exit(1); });
