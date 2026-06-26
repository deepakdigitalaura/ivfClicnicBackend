#!/usr/bin/env node
/**
 * patch-blog-images-pexels.mjs
 *
 * Downloads real Pexels stock photos matched to each blog's actual content,
 * uploads them to Payload Media, then patches heroImage on each blog.
 *
 * Run:      node scripts/patch-blog-images-pexels.mjs
 * Dry-run:  node scripts/patch-blog-images-pexels.mjs --dry-run
 */

import { writeFileSync, mkdirSync, existsSync, unlinkSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir   = dirname(fileURLToPath(import.meta.url));
const CACHE   = resolve(__dir, "../public/blog-media/pexels");
const BASE    = process.env.PAYLOAD_URL         ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL   = process.env.SEED_ADMIN_EMAIL    ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Zxcvbnm@123";
const DRY_RUN = process.argv.includes("--dry-run");

const log  = msg => console.log(`[pexels-patch] ${msg}`);
const wait = ms  => new Promise(r => setTimeout(r, ms));

/**
 * Each entry verified against blog title + excerpt content.
 * Pexels CDN supports ?w=1200&h=630&fit=crop&auto=compress for proper hero dimensions.
 */
const BLOGS = [
  {
    id: 88,
    file: "high-risk-pregnancy-diabetes",
    // Content: managing high-risk pregnancy with diabetes, hypertension, thyroid
    // Image: pregnant woman having blood pressure checked by doctor
    url: "https://images.pexels.com/photos/9951142/pexels-photo-9951142.jpeg",
  },
  {
    id: 50,
    file: "twin-pregnancy-risks",
    // Content: care for twin & high-risk pregnancies, risks doctors manage
    // Image: couple reviewing twin ultrasound scans with doctor
    url: "https://images.pexels.com/photos/12046447/pexels-photo-12046447.jpeg",
  },
  {
    id: 223,
    file: "twin-delivery-options",
    // Content: twin delivery — normal vs C-section options explained
    // Image: surgeon in operating room (C-section setting)
    url: "https://images.pexels.com/photos/6291170/pexels-photo-6291170.jpeg",
  },
  {
    id: 259,
    file: "amh-afc-ovarian-reserve",
    // Content: interpreting AMH/AFC blood test numbers for ovarian reserve
    // Image: doctor holding labelled blood sample tube
    url: "https://images.pexels.com/photos/6627693/pexels-photo-6627693.jpeg",
  },
  {
    id: 166,
    file: "ovarian-rejuvenation-ivf",
    // Content: PRP ovarian rejuvenation + IVF for low egg quality/reserve
    // Image: embryologist with petri dishes in IVF laboratory
    url: "https://images.pexels.com/photos/8940520/pexels-photo-8940520.jpeg",
  },
  {
    id: 158,
    file: "natural-vs-medicated-iui",
    // Content: medicated IUI uses fertility drugs to stimulate ovaries vs natural IUI
    // Image: fertility specialist performing ultrasound monitoring (IUI workup)
    url: "https://images.pexels.com/photos/7089333/pexels-photo-7089333.jpeg",
  },
  {
    id: 92,
    file: "thyroid-fertility-women",
    // Content: thyroid disorders impact on fertility — endocrinologist + fertility specialist
    // Image: female doctor examining/consulting woman patient
    url: "https://images.pexels.com/photos/5214996/pexels-photo-5214996.jpeg",
  },
  {
    id: 103,
    file: "uterus-recovery-after-birth",
    // Content: postpartum uterus recovery, involution after delivery
    // Image: neonatal care — newborn in hospital, postnatal setting
    url: "https://images.pexels.com/photos/34185199/pexels-photo-34185199.jpeg",
  },
  {
    id: 32,
    file: "exercise-ivf-journey",
    // Content: lifestyle & exercise during IVF — gentle movement recommended
    // Image: woman doing yoga / gentle stretching
    url: "https://images.pexels.com/photos/5132103/pexels-photo-5132103.jpeg",
  },
  {
    id: 95,
    file: "letrozole-ovulation-pregnancy",
    // Content: letrozole (aromatase inhibitor) used as fertility medication for ovulation
    // Image: medication pills held in hand — fertility prescription
    url: "https://images.pexels.com/photos/1424538/pexels-photo-1424538.jpeg",
  },
  {
    id: 13,
    file: "types-of-ivf-treatments",
    // Content: IVF, ICSI, egg donation — lab-based reproductive medicine
    // Image: female embryologist examining sample under microscope
    url: "https://images.pexels.com/photos/8851546/pexels-photo-8851546.jpeg",
  },
  {
    id: 115,
    file: "conceiving-naturally-low-amh",
    // Content: strategies to conceive naturally despite low AMH
    // Image: couple at fertility doctor consultation
    url: "https://images.pexels.com/photos/7108395/pexels-photo-7108395.jpeg",
  },
  {
    id: 94,
    file: "follicle-count-ivf-success",
    // Content: antral follicle count and its role in IVF success prediction
    // Image: OB-GYN beside ultrasound machine doing follicle monitoring
    url: "https://images.pexels.com/photos/7089394/pexels-photo-7089394.jpeg",
  },
  {
    id: 157,
    file: "natural-conception-low-amh",
    // Content: low AMH and trying to conceive naturally — hope and support
    // Image: woman holding positive pregnancy test — natural conception success
    url: "https://images.pexels.com/photos/6149284/pexels-photo-6149284.jpeg",
  },
  {
    id: 89,
    file: "age-affects-fertility",
    // Content: age and fertility myths vs facts — ovarian reserve declines with age
    // Image: doctor discussing health chart with female patient
    url: "https://images.pexels.com/photos/7578797/pexels-photo-7578797.jpeg",
  },
  {
    id: 246,
    file: "pregnancy-nutrition-plan",
    // Content: week-by-week pregnancy nutrition — folic acid, iron, DHA etc.
    // Image: colorful fresh fruits and vegetables — pregnancy diet
    url: "https://images.pexels.com/photos/1660027/pexels-photo-1660027.jpeg",
  },
  {
    id: 260,
    file: "pregnancy-ultrasound-safety",
    // Content: role of ultrasound in monitoring fetal development, safety of scans
    // Image: sonographer performing pregnancy ultrasound on patient
    url: "https://images.pexels.com/photos/7088833/pexels-photo-7088833.jpeg",
  },
  {
    id: 241,
    file: "epigenetics-ivf-pregnancy",
    // Content: epigenetics — how environment changes gene expression, DNA blueprint
    // Image: scientist using pipette in genetics/research laboratory
    url: "https://images.pexels.com/photos/3912482/pexels-photo-3912482.jpeg",
  },
  {
    id: 177,
    file: "pregnancy-signs-symptoms",
    // Content: early signs of pregnancy — nausea, missed period, fatigue etc.
    // Image: woman experiencing stomach discomfort — early pregnancy symptom
    url: "https://images.pexels.com/photos/6542721/pexels-photo-6542721.jpeg",
  },
  {
    id: 140,
    file: "iui-success-rate",
    // Content: IUI — sperm placed in uterus, success rates and what to expect
    // Image: happy couple celebrating positive pregnancy test after IUI
    url: "https://images.pexels.com/photos/6463177/pexels-photo-6463177.jpeg",
  },
  {
    id: 7,
    file: "uterine-fibroids-treatment",
    // Content: non-cancerous uterine growths — symptoms, causes, treatment options
    // Image: doctor showing diagnosis / discussing with woman patient in clinic
    url: "https://images.pexels.com/photos/6303645/pexels-photo-6303645.jpeg",
  },
  {
    id: 178,
    file: "preparing-for-pgt",
    // Content: Preimplantation Genetic Testing — embryo screening before IVF transfer
    // Image: scientist using microscope in genetics/embryology lab
    url: "https://images.pexels.com/photos/8442109/pexels-photo-8442109.jpeg",
  },
  {
    id: 232,
    file: "sperm-cramps-treatment",
    // Content: male condition — pain/cramps related to reproductive health
    // Image: male patient in consultation with doctor (male health visit)
    url: "https://images.pexels.com/photos/8413204/pexels-photo-8413204.jpeg",
  },
  {
    id: 112,
    file: "pregnant-without-fibroid-surgery",
    // Content: fibroids and fertility — how to conceive without surgical removal
    // Image: female doctor consulting woman patient about gynaecology options
    url: "https://images.pexels.com/photos/7579823/pexels-photo-7579823.jpeg",
  },
  {
    id: 31,
    file: "ivf-hospitals-ahmedabad",
    // Content: list of IVF hospitals in Ahmedabad — choosing the right clinic
    // Image: modern hospital building exterior — medical facility
    url: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg",
  },
  {
    id: 265,
    file: "ivf-clinics-mumbai",
    // Content: list of IVF clinics in Mumbai — advanced fertility treatments
    // Image: modern medical clinic waiting room/reception interior
    url: "https://images.pexels.com/photos/8459996/pexels-photo-8459996.jpeg",
  },
  {
    id: 149,
    file: "ivf-pregnancy-week-by-week",
    // Content: IVF pregnancy progression — symptoms and safety week by week
    // Image: pregnant woman holding baby bump — prenatal journey
    url: "https://images.pexels.com/photos/12529433/pexels-photo-12529433.jpeg",
  },
  {
    id: 275,
    file: "twins-ivf-myth",
    // Content: myth that IVF always causes twins — explains actual statistics
    // Image: happy parents with twin babies — joyful family reality
    url: "https://images.pexels.com/photos/16949091/pexels-photo-16949091.jpeg",
  },
];

// Pexels CDN parameters — crop to hero dimensions
const PEXELS_PARAMS = "?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop";

async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const { token } = await res.json();
  return { Authorization: `JWT ${token}` };
}

async function downloadImage(url, destPath) {
  const fullUrl = url + PEXELS_PARAMS;
  const res = await fetch(fullUrl, {
    signal: AbortSignal.timeout(30_000),
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${fullUrl}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(destPath, buf);
  return buf.length;
}

async function uploadToPayload(filePath, filename, auth) {
  const { readFileSync } = await import("fs");
  const buffer = readFileSync(filePath);
  const blob = new Blob([buffer], { type: "image/jpeg" });
  const form = new FormData();
  form.append("file", blob, filename + ".jpg");
  form.append("_payload", JSON.stringify({ alt: filename.replace(/-/g, " ") }));

  const res = await fetch(`${BASE}/api/media`, {
    method: "POST",
    headers: auth,
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
  const data = await res.json();
  const id = data.doc?.id ?? data.id;
  if (!id) throw new Error("No media ID returned");
  return id;
}

async function patchBlog(blogId, mediaId, auth) {
  const res = await fetch(`${BASE}/api/blogs/${blogId}`, {
    method: "PATCH",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ heroImage: mediaId }),
  });
  if (!res.ok) throw new Error(`PATCH failed: ${await res.text()}`);
}

async function run() {
  mkdirSync(CACHE, { recursive: true });
  log(`Target: ${BASE}`);
  if (DRY_RUN) log("⚠  DRY RUN — no writes\n");

  const auth = DRY_RUN ? null : await login();
  if (!DRY_RUN) log("Login OK\n");

  let success = 0, errors = 0;

  for (let i = 0; i < BLOGS.length; i++) {
    const { id, file, url } = BLOGS[i];
    const destPath = resolve(CACHE, file + ".jpg");
    log(`[${i + 1}/${BLOGS.length}] Blog ${id} — ${file}`);

    if (DRY_RUN) {
      log(`  [DRY] Would download ${url.slice(0, 60)}... → upload → patch\n`);
      success++;
      continue;
    }

    try {
      // 1. Download from Pexels
      const size = await downloadImage(url, destPath);
      log(`  Downloaded — ${Math.round(size / 1024)} KB`);
      await wait(300);

      // 2. Upload to Payload Media
      const mediaId = await uploadToPayload(destPath, file, auth);
      log(`  Uploaded → Media ID ${mediaId}`);
      await wait(300);

      // 3. Patch blog heroImage
      await patchBlog(id, mediaId, auth);
      log(`  ✅ heroImage updated\n`);
      success++;

      // Clean up local cache after successful upload
      try { unlinkSync(destPath); } catch {}
    } catch (err) {
      log(`  ✗ ERROR: ${err.message}\n`);
      errors++;
    }

    await wait(500);
  }

  log("─".repeat(60));
  log(`Done! ${success} updated, ${errors} errors`);
  if (errors > 0) log("Re-run to retry failures.");
}

run().catch(err => {
  console.error("[pexels-patch] FATAL:", err.message);
  process.exit(1);
});
