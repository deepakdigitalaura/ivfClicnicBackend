/**
 * patch-blog-photos-2026-07-28.mts
 *
 * Sets heroImageUrl (drives both the article hero and the blog-hub card) for
 * 20 blogs — 5 new custom graphics supplied directly, 1 centre photo re-use,
 * 11 matched from the pre-existing WordPress media dump in public/media/,
 * and 3 downloaded from URLs supplied for this batch.
 *
 * Run:  SANITY_API_TOKEN=... npx tsx scripts/patch-blog-photos-2026-07-28.mts
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

const NEW = "public/blog-media/new blog photos relavant to title";

const ITEMS = [
  // Custom graphics supplied directly for this batch
  { slug: "how-does-age-impact-the-success-rate-of-iui-procedures", img: `${NEW}/How Does Age Impact the Success Rate of IUI Procedures.png` },
  { slug: "how-to-recognize-signs-of-ovulation-for-better-fertility-planning", img: `${NEW}/how-to-recognize-signs-of-ovulation-for-better-fertility-planning.png` },
  { slug: "understanding-the-success-rate-of-ivf-treatment", img: `${NEW}/Understanding the Success Rate of IVF Treatment.png` },
  { slug: "unexplained-infertility-when-tests-are-normal-but-you-still-cant-conceive", img: `${NEW}/unexplained-infertility-when-tests-are-normal-but-you-still-cant-conceive.png` },
  { slug: "when-is-macs-most-useful-indications-ideal-candidates-limitations", img: `${NEW}/when-is-macs-most-useful-indications-ideal-candidates-limitations.png` },

  // Centre photo re-use
  { slug: "why-are-couples-from-other-cities-choosing-ahmedabad-for-ivf-treatment", img: `public/assets/centres/paldi-ot.webp` },

  // Downloaded from URLs supplied for this batch
  { slug: "bavishi-fertility-institute-nikol-ahmedabad-celebrates-its-first-anniversary", img: `${NEW}/nikol-first-anniversary-google.webp` },
  { slug: "bavishi-fertility-institute-expands-to-bhavnagar-with-state-of-the-art-ai-enabled-ivf-and-womens-hospital", img: `${NEW}/bhavnagar-real-estate-hotspot.jpg` },
  { slug: "ivf-babies-meet-in-vadodara-a-momentous-event-creating-awareness", img: `${NEW}/ivf-babies-meet-vadodara.jpeg` },

  // Matched from the existing WordPress media dump in public/media/
  { slug: "dr-parth-bavishi-honoured-with-the-prestigious-achiever-award-at-fertivision-2025", img: `public/media/Dr.-Parth-Bavishi-Honoured-with-the-Prestigious-Achiever-Award-at-Fertivision-2025.png` },
  { slug: "bavishi-fertility-institute-honoured-at-times-healthcare-leaders-awards-2025", img: `public/media/Bavishi-Fertility-Institute-Honoured-at-Times-Healthcare-Leaders-Awards-2025.png` },
  { slug: "bavishi-fertility-institute-recognized-as-the-leading-ivf-chain-of-gujarat-by-radio-city", img: `public/media/Bavishi-Fertility-Institute-Recognized-as-the-Leading-IVF-Chain-of-Gujarat-by-Radio-City-2.png` },
  { slug: "bavishi-fertility-institute-hosts-fogsi-recognized-training-program-in-ahmedabad", img: `public/media/Bavishi-Fertility-Institute-Hosts-FOGSI-Recognized-Training-Program-in-Ahmedabad-1.png` },
  { slug: "bavishi-fertility-institute-wins-ivf-chain-of-the-year-west-for-5th-time", img: `public/media/Bavishi-Fertility-Institute-Wins-IVF-Chain-of-the-Year-–-West-for-5th-Time-2.png` },
  { slug: "celebrated-republic-day-with-hope-and-happiness-at-bavishi-fertility-institute", img: `public/media/Celebrating-Republic-Day-with-Hope-and-Happiness-at-Bavishi-Fertility-Institute.png` },
  { slug: "inauguration-of-our-new-branch-in-nikol", img: `public/media/Introducing-Our-New-Nikol-Branch-at-Bavishi-Fertility-Institute.png` },
  { slug: "dr-parth-bavishi-wins-bharat-excellence-award-for-ivf", img: `public/media/Dr.-Parth-Bavishi-Receives-Bharat-Excellence-Award-for-Contributions-to-IVF-Infertility-Care-1.png` },
  { slug: "insights-on-fertility-dr-bavishi-team-at-palanpur-society", img: `public/media/Insights-on-Fertility-Dr.-Bavishi-Team-at-Palanpur-Society.png` },
  { slug: "dr-nilesh-jains-expert-guidance-on-fertility-treatments-in-mumbai", img: `public/media/Dr.-Nilesh-Jains-Expert-Guidance-on-Fertility-Treatments-in-Mumbai.png` },
  { slug: "team-excellence-and-innovation-at-bavishi-fertility-institute", img: `public/media/Team-Excellence-and-Innovation-at-Bavishi-Fertility-Institute.png` },
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
