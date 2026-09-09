/**
 * patch-newblogmedia-images-batch2.mts
 *
 * Second batch — the 2 blogs that had no matching image in the first pass of
 * public/newblogmedia/ (see patch-newblogmedia-images.mts).
 *
 * Run:  SANITY_API_TOKEN=... npx tsx scripts/patch-newblogmedia-images-batch2.mts
 */
import { createClient } from "next-sanity";
import { readFileSync } from "fs";
import { resolve, dirname, extname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, "..");

const token = process.env.SANITY_API_TOKEN;
if (!token) throw new Error("SANITY_API_TOKEN is required");

const s = createClient({
  projectId: "seh0zjkb",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

const DIR = "public/newblogmedia";

const ITEMS = [
  { slug: "lifestyle-diet-rest-tips-for-high-risk-pregnancy", img: `${DIR}/Lifestyle, Diet & Rest Tips for High-Risk Pregnancy.png` },
  { slug: "egg-freezing-vs-embryo-freezing-making-the-right-choice-for-your-fertility-journey", img: `${DIR}/Egg Freezing vs Embryo Freezing.png` },
];

function mimeType(filePath: string) {
  const ext = extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "application/octet-stream";
}

async function run() {
  const docs = await s.fetch<{ _id: string; slug: string }[]>(
    `*[_type=="blog" && slug in $slugs]{_id,slug}`,
    { slugs: ITEMS.map((i) => i.slug) },
  );
  const bySlug = new Map(docs.map((d) => [d.slug, d._id]));

  let success = 0, errors = 0;
  for (const { slug, img } of ITEMS) {
    const id = bySlug.get(slug);
    if (!id) {
      console.log(`✗ No blog doc for slug "${slug}"`);
      errors++;
      continue;
    }
    try {
      const filePath = resolve(ROOT, img);
      const buffer = readFileSync(filePath);
      const asset = await s.assets.upload("image", buffer, {
        filename: filePath.split(/[\\/]/).pop(),
        contentType: mimeType(filePath),
      });
      await s.patch(id).set({ heroImageUrl: asset.url }).commit();
      console.log(`✅ ${slug} → ${asset.url}`);
      success++;
    } catch (err) {
      console.log(`✗ ${slug}: ${(err as Error).message}`);
      errors++;
    }
  }
  console.log(`\nDone. ${success} updated, ${errors} errors.`);
}

run();
