/**
 * patch-new-blog-images.mts
 *
 * Replaces heroImageUrl (used for both the article hero and the blog-hub card)
 * for 10 blogs with the new images supplied in public/blog-media/new Blogs/.
 * Uploads each image to Sanity's asset store, then patches the blog doc.
 *
 * Run:  SANITY_API_TOKEN=... npx tsx scripts/patch-new-blog-images.mts
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

const DIR = "public/blog-media/new Blogs";

const ITEMS = [
  { slug: "prp-vs-traditional-fertility-treatments-whats-the-difference", img: `${DIR}/PRP vs Traditional Fertility Treatments.png` },
  { slug: "what-is-the-max-number-of-eggs-that-you-can-retrieve-in-an-ivf-cycle", img: `${DIR}/Max Number of Eggs Retrieved in an IVF Cycle.png` },
  { slug: "natural-iui-vs-medicated-iui-which-is-more-effective", img: `${DIR}/Natural IUI vs Medicated IUI (2).png` },
  { slug: "can-natural-cycle-ivf-reduce-the-risk-of-ovarian-hyperstimulation", img: `${DIR}/Natural Cycle IVF and OHSS Risk.png` },
  { slug: "best-types-of-exercise-to-support-your-ivf-journey", img: `${DIR}/Best Exercises to Support IVF Journey.png` },
  { slug: "top-fertility-treatments-for-women-with-pcos", img: `${DIR}/Top Fertility Treatments for PCOS (2).png` },
  { slug: "ovarian-rejuvenation-for-restoring-fertility-a-new-ray-of-hope", img: `${DIR}/Ovarian Rejuvenation Therapy.png` },
  { slug: "iui-process-explained-what-to-expect-at-every-step", img: `${DIR}/IUI Process Explained Step-by-Step.png` },
  { slug: "pgt-vs-tgt-vs-prt-which-embryo-testing-method-is-right-for-you", img: `${DIR}/PGT vs TGT vs PRT — Embryo Testing Methods.png` },
  { slug: "what-is-epigenetics-does-it-affect-ivf-pregnancies-only", img: `${DIR}/Epigenetics and IVF Pregnancies.png` },
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
