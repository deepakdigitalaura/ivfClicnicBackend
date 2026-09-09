#!/usr/bin/env node
/**
 * generate-blog-images-batch4.mjs
 *
 * Generates hero images for 28 blogs using Pollinations.ai
 * (free, no API key, no account required — uses Flux model).
 *
 * Output: public/blog-media/batch4/<filename>.jpg
 *
 * Run:  node scripts/generate-blog-images-batch4.mjs
 * Skip already-generated files automatically (safe to re-run).
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir  = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dir, "../public/blog-media/batch4");
const WIDTH  = 1200;
const HEIGHT = 630;

const DELAY_MS = 4500; // sequential — Pollinations rate-limits parallel requests

const log  = (msg) => console.log(`[img-gen] ${msg}`);
const wait = (ms)  => new Promise(r => setTimeout(r, ms));

/**
 * Prompts are written for:
 * - Medical / fertility clinic photography style
 * - Warm, hopeful tone (not cold or scary)
 * - Realistic humans, clean clinic environments
 * - No text or logos in the image
 */
const BLOGS = [
  {
    file: "high-risk-pregnancy-diabetes",
    prompt: "pregnant woman having blood pressure and blood sugar checked by a caring female doctor in a bright modern clinic, warm natural lighting, professional medical photography, hopeful atmosphere, realistic",
  },
  {
    file: "twin-pregnancy-risks",
    prompt: "pregnant woman carrying twins during medical consultation, doctor reviewing twin pregnancy ultrasound on screen, modern fertility clinic, warm lighting, professional healthcare photography, realistic",
  },
  {
    file: "twin-delivery-options",
    prompt: "calm delivery room with a medical team preparing for twin birth, doctors and nurses in surgical attire, bright clean hospital environment, professional medical photography, realistic",
  },
  {
    file: "amh-afc-ovarian-reserve",
    prompt: "fertility specialist showing a woman her AMH blood test results on a tablet screen, modern fertility clinic, ovarian reserve chart visible, warm professional lighting, realistic medical photography",
  },
  {
    file: "ovarian-rejuvenation-ivf",
    prompt: "fertility doctor explaining ovarian rejuvenation PRP treatment to a hopeful patient, advanced IVF laboratory in background, modern clinic, professional medical photography, warm lighting, realistic",
  },
  {
    file: "natural-vs-medicated-iui",
    prompt: "fertility nurse preparing IUI insemination procedure equipment, clean modern fertility clinic room, professional healthcare photography, soft warm lighting, hope and care atmosphere, realistic",
  },
  {
    file: "thyroid-fertility-women",
    prompt: "female endocrinologist examining thyroid of a young woman patient, consultation desk with thyroid health charts, modern clinic, professional medical photography, warm caring atmosphere, realistic",
  },
  {
    file: "uterus-recovery-after-birth",
    prompt: "new mother resting comfortably in hospital bed holding newborn baby, postnatal care nurse nearby, bright clean modern maternity ward, professional healthcare photography, warm hopeful lighting, realistic",
  },
  {
    file: "exercise-ivf-journey",
    prompt: "woman doing gentle prenatal yoga in a bright airy studio, peaceful expression, natural light, fertility wellness lifestyle photography, soft warm tones, realistic",
  },
  {
    file: "letrozole-ovulation-pregnancy",
    prompt: "pharmacist handing fertility medication to a hopeful woman, pharmacy with ovulation tracking calendar visible, warm professional lighting, medical photography, realistic",
  },
  {
    file: "types-of-ivf-treatments",
    prompt: "embryologist working at IVF laboratory microscope with embryo dish, advanced fertility clinic, clean scientific environment, professional medical photography, warm background lighting, realistic",
  },
  {
    file: "conceiving-naturally-low-amh",
    prompt: "hopeful couple in consultation with fertility doctor reviewing ovarian reserve test results, modern fertility clinic, warm encouraging atmosphere, professional medical photography, realistic",
  },
  {
    file: "follicle-count-ivf-success",
    prompt: "doctor performing transvaginal ultrasound showing ovarian follicles on monitor, fertility monitoring clinic, professional medical photography, soft warm lighting, realistic",
  },
  {
    file: "natural-conception-low-amh",
    prompt: "smiling woman holding positive pregnancy test with flowers on wooden table, natural light, warm hopeful atmosphere, fertility success photography, realistic",
  },
  {
    file: "age-affects-fertility",
    prompt: "fertility specialist counseling women of different ages about fertility and reproductive health, modern clinic infographic on wall, professional medical photography, warm diverse atmosphere, realistic",
  },
  {
    file: "pregnancy-nutrition-plan",
    prompt: "overhead view of colorful healthy pregnancy meal with fruits vegetables legumes dairy nuts on wooden table, week-by-week pregnancy nutrition, bright food photography, warm natural lighting, realistic",
  },
  {
    file: "pregnancy-ultrasound-safety",
    prompt: "pregnant woman having routine ultrasound scan with caring sonographer, baby visible on ultrasound screen, modern obstetric clinic, warm professional lighting, medical photography, realistic",
  },
  {
    file: "epigenetics-ivf-pregnancy",
    prompt: "scientist examining DNA helix model in modern genetics laboratory, IVF embryology research setting, professional scientific photography, cool blue laboratory lighting with warm accents, realistic",
  },
  {
    file: "pregnancy-signs-symptoms",
    prompt: "young woman looking at early pregnancy symptoms checklist with positive test on table, morning light through window, hopeful calm expression, lifestyle medical photography, warm tones, realistic",
  },
  {
    file: "iui-success-rate",
    prompt: "happy couple embracing after receiving positive IUI pregnancy news from a smiling doctor, modern fertility clinic, warm joyful atmosphere, professional medical photography, realistic",
  },
  {
    file: "uterine-fibroids-treatment",
    prompt: "gynecologist explaining uterine fibroid diagnosis to a female patient using anatomical model, modern clinic desk, professional medical photography, warm caring atmosphere, realistic",
  },
  {
    file: "preparing-for-pgt",
    prompt: "geneticist examining embryo chromosomes under microscope for preimplantation genetic testing PGT, advanced IVF embryology laboratory, professional scientific photography, clean environment, realistic",
  },
  {
    file: "sperm-cramps-treatment",
    prompt: "male patient in consultation with a urologist discussing reproductive health, modern urology clinic, professional medical photography, warm reassuring atmosphere, realistic",
  },
  {
    file: "pregnant-without-fibroid-surgery",
    prompt: "smiling pregnant woman with baby bump at doctor consultation about fibroid management without surgery, modern clinic, warm hopeful atmosphere, professional medical photography, realistic",
  },
  {
    file: "ivf-hospitals-ahmedabad",
    prompt: "modern IVF fertility clinic building exterior in Ahmedabad India, bright clean architectural photography, welcoming entrance, blue sky, professional photography, realistic",
  },
  {
    file: "ivf-clinics-mumbai",
    prompt: "state-of-the-art IVF fertility clinic interior in Mumbai India, reception area with warm lighting, modern medical design, professional healthcare photography, welcoming atmosphere, realistic",
  },
  {
    file: "ivf-pregnancy-week-by-week",
    prompt: "collage of fetal development stages week by week during IVF pregnancy, ultrasound imagery, medical illustration style, clean professional infographic photography, warm tones, realistic",
  },
  {
    file: "twins-ivf-myth",
    prompt: "happy mother with adorable twin babies in a bright warm nursery, joyful family moment, soft natural lighting, lifestyle photography, hopeful atmosphere, realistic",
  },
];

async function generateImage(prompt, retries = 2) {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 99999);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=${WIDTH}&height=${HEIGHT}&model=flux&nologo=true&seed=${seed}`;
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(45_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (attempt > retries) throw err;
      log(`  Retry ${attempt}/${retries} after error: ${err.message}`);
      await wait(3000);
    }
  }
}

async function run() {
  mkdirSync(OUTPUT, { recursive: true });
  log(`Output: ${OUTPUT}`);
  log(`Generating ${BLOGS.length} images sequentially via Pollinations.ai\n`);

  let success = 0, skipped = 0, errors = 0;

  for (let i = 0; i < BLOGS.length; i++) {
    const { file, prompt } = BLOGS[i];
    const outPath = resolve(OUTPUT, file + ".jpg");

    if (existsSync(outPath)) {
      log(`[${i + 1}/${BLOGS.length}] SKIP: ${file}.jpg`);
      skipped++;
      continue;
    }

    log(`[${i + 1}/${BLOGS.length}] Generating: ${file}...`);
    try {
      const buffer = await generateImage(prompt);
      writeFileSync(outPath, buffer);
      log(`  ✅ ${Math.round(buffer.length / 1024)} KB saved`);
      success++;
    } catch (err) {
      log(`  ✗ FAILED: ${err.message}`);
      errors++;
    }

    if (i < BLOGS.length - 1) await wait(DELAY_MS);
  }

  log("\n" + "─".repeat(60));
  log(`Done! ${success} generated, ${skipped} skipped, ${errors} errors`);
  if (errors > 0) log("Re-run to retry — already-saved files are skipped automatically.");
  if (errors === 0) {
    log("\nAll images ready. Next:");
    log("  node scripts/patch-blog-images-batch4.mjs --dry-run");
    log("  node scripts/patch-blog-images-batch4.mjs");
  }
}

run().catch(err => {
  console.error("[img-gen] FATAL:", err.message);
  process.exit(1);
});
