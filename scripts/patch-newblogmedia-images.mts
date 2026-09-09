/**
 * patch-newblogmedia-images.mts
 *
 * Replaces heroImageUrl (drives both the article hero and the blog-hub card)
 * for 62 blogs with the new images supplied in public/newblogmedia/.
 * Uploads each image to Sanity's asset store, then patches the blog doc.
 *
 * Run:  SANITY_API_TOKEN=... npx tsx scripts/patch-newblogmedia-images.mts
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
  { slug: "imsi-technique-for-ivf-advanced-sperm-selection-for-better-success", img: `${DIR}/IMSI Technique for IVF.png` },
  { slug: "understanding-sperm-dna-fragmentation-causes-treatment-and-ivf-options", img: `${DIR}/Understanding Sperm DNA Fragmentation.png` },
  { slug: "ivf-stimulation-protocols-a-comprehensive-guide", img: `${DIR}/IVF Stimulation Protocols.png` },
  { slug: "when-can-you-start-exercising-after-delivery", img: `${DIR}/When Can You Start Exercising After Delivery.png` },
  { slug: "postpartum-mental-health-recognizing-baby-blues-and-postpartum-depression", img: `${DIR}/Postpartum Mental Health.png` },
  { slug: "how-many-embryos-should-be-transferred-risks-of-multiple-pregnancy-explained", img: `${DIR}/How Many Embryos Should Be Transferred.png` },
  { slug: "fibroids-and-ivf-should-you-remove-them-before-treatment", img: `${DIR}/Fibroids and IVF.png` },
  { slug: "recurrent-miscarriage-why-does-it-keep-happening-and-what-can-you-do", img: `${DIR}/Recurrent Miscarriage.png` },
  { slug: "icsi-vs-ivf-do-you-actually-need-icsi-or-is-it-being-upsold-to-you", img: `${DIR}/ICSI vs IVF Upsold.png` },
  { slug: "10-signs-you-should-see-fertility-specialist-and-when-not-to-wait", img: `${DIR}/10 Signs You Should See a Fertility Specialist.png` },
  { slug: "rebuilding-families-fertility-treatment-options-for-cancer-survivors", img: `${DIR}/Rebuilding Families Fertility for Cancer Survivors.png` },
  { slug: "embracing-positivity-activities-to-nurture-your-journey-to-motherhood-after-embryo-transfer", img: `${DIR}/Embracing Positivity After Embryo Transfer.png` },
  { slug: "cracking-opens-the-possibilities-how-laser-assisted-hatching-is-changing-the-game-for-ivf-patients", img: `${DIR}/Laser-Assisted Hatching.png` },
  { slug: "ivf-after-age-40-realistic-success-rates-and-treatment-strategies", img: `${DIR}/IVF After Age 40.png` },
  { slug: "egg-quality-vs-egg-quantity-what-really-matters", img: `${DIR}/Egg Quality vs Egg Quantity.png` },
  { slug: "silent-endometriosis-can-you-have-it-without-symptoms", img: `${DIR}/Silent Endometriosis.png` },
  { slug: "thyroid-disorders-in-early-pregnancy", img: `${DIR}/Thyroid Disorders in Early Pregnancy.png` },
  { slug: "importance-of-folic-acid-before-and-during-pregnancy", img: `${DIR}/Importance of Folic Acid Before and During Pregnancy.png` },
  { slug: "the-match-system-revolutionizing-ivf-with-unparalleled-accuracy-and-safety", img: `${DIR}/The MATCH System (Biometric Gamete Tracking).png` },
  { slug: "preserving-hope-ivf-and-fertility-preservation-for-cancer-patients", img: `${DIR}/Preserving Hope Fertility Preservation for Cancer Patients.png` },
  { slug: "unlocking-the-puzzle-of-recurrent-ivf-failure-endometriosis-and-uterine-factors", img: `${DIR}/Recurrent IVF Failure Endometriosis & Uterine Factors.png` },
  { slug: "the-journey-to-blastocyst-stage-and-implantation-understanding-your-chances-and-how-bavishi-fertility-institutes-can-help", img: `${DIR}/Journey to Blastocyst Stage & Implantation.png` },
  { slug: "the-relationship-between-egg-freezing-and-future-ivf-success-rates", img: `${DIR}/Egg Freezing & Future IVF Success Rates.png` },
  { slug: "egg-freezing-your-fertility-time-capsule", img: `${DIR}/Egg Freezing Your Fertility Time Capsule.png` },
  { slug: "oncofertility-preserving-fertility-before-cancer-treatment", img: `${DIR}/Oncofertility Preserving Fertility Before Cancer Treatment.png` },
  { slug: "boosting-your-ivf-success-a-comprehensive-guide-for-couples", img: `${DIR}/Boosting Your IVF Success Guide for Couples.png` },
  { slug: "parenting-after-ivf-unique-challenges-and-rewards", img: `${DIR}/Parenting After IVF.png` },
  { slug: "the-miracle-of-bonding-connecting-with-your-baby-before-birth", img: `${DIR}/The Miracle of Bonding Before Birth.png` },
  { slug: "boosting-male-fertility-tips-to-improve-sperm-quality", img: `${DIR}/Boosting Male Fertility Tips to Improve Sperm Quality.png` },
  { slug: "genetic-testing-before-and-during-pregnancy-a-comprehensive-guide", img: `${DIR}/Genetic Testing Before and During Pregnancy.png` },
  { slug: "building-families-with-hope-the-power-of-assisted-reproductive-technology", img: `${DIR}/Building Families with Hope Assisted Reproductive Technology.png` },
  { slug: "understanding-endometrial-thickness-a-key-factor-in-female-fertility", img: `${DIR}/Understanding Endometrial Thickness.png` },
  { slug: "from-diagnosis-to-conception-managing-pcos-for-a-healthy-pregnancy", img: `${DIR}/Managing PCOS for a Healthy Pregnancy.png` },
  { slug: "ovarian-rejuvenation-for-restoring-fertility-a-new-ray-of-hope", img: `${DIR}/Ovarian Rejuvenation A New Ray of Hope.png` },
  { slug: "how-to-choose-the-best-ivf-clinic-in-ahmedabad", img: `${DIR}/How to Choose the Best IVF Clinic in Ahmedabad.png` },
  { slug: "success-rate-of-ivf-treatments-in-ahmedabad-what-to-expect-in-2025", img: `${DIR}/Success Rate of IVF Treatments in Ahmedabad (2025).png` },
  { slug: "male-infertility-treatment-options-in-ahmedabad-what-you-should-know", img: `${DIR}/Male Infertility Treatment Options in Ahmedabad.png` },
  { slug: "fertility-ovulation-facts-to-help-you-get-pregnant", img: `${DIR}/Fertility & Ovulation Facts.png` },
  { slug: "the-unseen-struggle-understanding-male-infertility", img: `${DIR}/The Unseen Struggle Male Infertility.png` },
  { slug: "the-ultimate-guide-to-diet-in-lactation-nourishing-your-body-and-baby", img: `${DIR}/Diet in Lactation Guide.png` },
  { slug: "how-to-recognize-signs-of-ovulation-for-better-fertility-planning", img: `${DIR}/Recognizing Signs of Ovulation.png` },
  { slug: "the-power-of-egg-freezing-empowering-choices-for-the-modern-generation", img: `${DIR}/The Power of Egg Freezing Modern Choices.png` },
  { slug: "finding-fertility-options-with-low-amh-a-detailed-guide", img: `${DIR}/Finding Fertility Options with Low AMH.png` },
  { slug: "how-to-test-for-female-infertility", img: `${DIR}/How to Test for Female Infertility.png` },
  { slug: "understanding-the-reasons-for-ivf-failure", img: `${DIR}/Understanding the Reasons for IVF Failure.png` },
  { slug: "how-to-improve-male-infertility", img: `${DIR}/How to Improve Male Infertility.png` },
  { slug: "how-does-age-impact-the-success-rate-of-iui-procedures", img: `${DIR}/How Age Impacts IUI Success.png` },
  { slug: "endometriosis-and-menopause-what-to-expect-and-how-to-manage-symptoms", img: `${DIR}/Endometriosis and Menopause.png` },
  { slug: "pregnancy-complications", img: `${DIR}/Pregnancy Complications.png` },
  { slug: "what-to-expect-during-each-stage-of-ivf", img: `${DIR}/What to Expect During Each Stage of IVF.png` },
  { slug: "questions-to-discuss-with-doctor-during-multiple-ivf-cycles", img: `${DIR}/Questions to Discuss With Doctor During Multiple IVF Cycles.png` },
  { slug: "impact-of-age-repeated-ivf-cycles-on-pregnancy", img: `${DIR}/Impact of Age & Repeated IVF Cycles on Pregnancy.png` },
  { slug: "does-stress-affect-ivf-success", img: `${DIR}/Does Stress Affect IVF Success.png` },
  { slug: "ivf-and-career-balancing-work-and-fertility-treatments", img: `${DIR}/IVF and Career Balancing Work and Fertility Treatments.png` },
  { slug: "ivf-pregnancy-with-pcos-and-endometriosis", img: `${DIR}/IVF Pregnancy with PCOS and Endometriosis.png` },
  { slug: "questions-to-ask-ivf-specialist-at-1st-visit", img: `${DIR}/Questions to Ask Your IVF Specialist at First Visit.png` },
  { slug: "male-infertility-signs-causes-treatment", img: `${DIR}/Male Infertility Signs, Causes, Treatment.png` },
  { slug: "factors-to-consider-right-clinic-for-ivf-journey", img: `${DIR}/Factors to Consider Right Clinic for IVF Journey.png` },
  { slug: "checking-if-ivf-is-the-last-option-to-conceive", img: `${DIR}/Checking If IVF Is the Last Option to Conceive.png` },
  { slug: "complications-of-delaying-your-ivf-journey", img: `${DIR}/Complications of Delaying Your IVF Journey.png` },
  { slug: "ectopic-pregnancy", img: `${DIR}/Ectopic Pregnancy.png` },
  { slug: "do-and-dont-for-fertility", img: `${DIR}/Do's and Don'ts for Fertility.png` },
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
