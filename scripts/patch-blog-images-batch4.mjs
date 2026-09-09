#!/usr/bin/env node
/**
 * patch-blog-images-batch4.mjs
 *
 * Replaces hero images for 28 blogs whose current images don't match the title.
 *
 * BEFORE RUNNING:
 *  Drop your images into  public/blog-media/batch4/
 *  using the exact filenames listed in BLOG_IMAGES below.
 *  Supported formats: .png  .jpg  .jpeg  .webp
 *
 * Run (live):   node scripts/patch-blog-images-batch4.mjs
 * Dry run:      node scripts/patch-blog-images-batch4.mjs --dry-run
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname, extname } from "path";
import { fileURLToPath } from "url";

const __dir    = dirname(fileURLToPath(import.meta.url));
const MEDIA    = resolve(__dir, "../public/blog-media/batch4");
const BASE     = process.env.PAYLOAD_URL          ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL    = process.env.SEED_ADMIN_EMAIL     ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD  ?? "Zxcvbnm@123";
const DRY_RUN  = process.argv.includes("--dry-run");

const log  = (msg) => console.log(`[batch4] ${msg}`);
const wait = (ms)  => new Promise(r => setTimeout(r, ms));

/**
 * Each entry:
 *   file  — filename you place in public/blog-media/batch4/
 *   id    — Payload blog ID (verified against live titles below)
 *   title — for confirmation logging only
 */
const BLOG_IMAGES = [
  { file: "high-risk-pregnancy-diabetes",     id: 88,  title: "High risk pregnancy due to diabetes, BP & Thyroid disorders" },
  { file: "twin-pregnancy-risks",             id: 50,  title: "Common risks in twin pregnancy and how do doctors manage them?" },
  { file: "twin-delivery-options",            id: 223, title: "Twin pregnancy delivery options: Normal delivery vs C-Section" },
  { file: "amh-afc-ovarian-reserve",          id: 259, title: "How to Interpret AMH, AFC and Other ovarian reserve rests" },
  { file: "ovarian-rejuvenation-ivf",         id: 166, title: "Ovarian rejuvenation + IVF: What to know when combining treatments?" },
  { file: "natural-vs-medicated-iui",         id: 158, title: "Natural IUI vs. Medicated IUI: Which is more effective?" },
  { file: "thyroid-fertility-women",          id: 92,  title: "How do thyroid disorders affect fertility in women?" },
  { file: "uterus-recovery-after-birth",      id: 103, title: "How long does it take for the uterus to go back to normal after birth?" },
  { file: "exercise-ivf-journey",             id: 32,  title: "Best types of exercise to support your IVF journey" },
  { file: "letrozole-ovulation-pregnancy",    id: 95,  title: "How does letrozole help with ovulation and pregnancy?" },
  { file: "types-of-ivf-treatments",         id: 13,  title: "A guide to the different types of IVF treatments" },
  { file: "conceiving-naturally-low-amh",     id: 115, title: "How to improve your chances of conceiving naturally with low AMH levels?" },
  { file: "follicle-count-ivf-success",       id: 94,  title: "How does follicle count affect IVF success rates?" },
  { file: "natural-conception-low-amh",       id: 157, title: "Natural conception with low AMH levels" },
  { file: "age-affects-fertility",            id: 89,  title: "How age affects fertility: Myths vs. Facts" },
  { file: "pregnancy-nutrition-plan",         id: 246, title: "What to eat during pregnancy: A week-by-week nutrition plan" },
  { file: "pregnancy-ultrasound-safety",      id: 260, title: "Do I need an ultrasound in every pregnancy visit? Is it safe?" },
  { file: "epigenetics-ivf-pregnancy",        id: 241, title: "What is epigenetics? Does it affect IVF pregnancies only?" },
  { file: "pregnancy-signs-symptoms",         id: 177, title: "Pregnancy – Signs & Symptoms" },
  { file: "iui-success-rate",                 id: 140, title: "IUI success rate – What to expect after IUI treatment?" },
  { file: "uterine-fibroids-treatment",       id: 7,   title: "Uterine Fibroids: Symptoms, Causes and Treatment" },
  { file: "preparing-for-pgt",               id: 178, title: "Preparing for PGT: What to expect before, during, and after the procedure?" },
  { file: "sperm-cramps-treatment",           id: 232, title: "Understanding Sperm Cramps: Symptoms, Causes, Diagnosis & Treatment" },
  { file: "pregnant-without-fibroid-surgery", id: 112, title: "How to get pregnant without removing fibroid or without surgery?" },
  { file: "ivf-hospitals-ahmedabad",          id: 31,  title: "7 best IVF hospitals in Ahmedabad" },
  { file: "ivf-clinics-mumbai",               id: 265, title: "13 best IVF Clinics in Mumbai" },
  { file: "ivf-pregnancy-week-by-week",       id: 149, title: "IVF Pregnancy Week by Week – Symptoms & Safety" },
  { file: "twins-ivf-myth",                   id: 275, title: "Dispelling the Myth: Understanding Twins and IVF" },
];

const EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

function findFile(base) {
  for (const ext of EXTENSIONS) {
    const p = resolve(MEDIA, base + ext);
    if (existsSync(p)) return p;
  }
  return null;
}

function mimeType(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (ext === ".png")  return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed ${res.status}: ${await res.text()}`);
  const { token } = await res.json();
  return { Authorization: `JWT ${token}` };
}

async function uploadImage(filePath, baseName, auth) {
  const buffer = readFileSync(filePath);
  const mime   = mimeType(filePath);
  const ext    = extname(filePath).toLowerCase();
  const storageName = baseName + ext;

  const blob = new Blob([buffer], { type: mime });
  const form = new FormData();
  form.append("file", blob, storageName);
  form.append("_payload", JSON.stringify({ alt: baseName.replace(/-/g, " ") }));

  const res = await fetch(`${BASE}/api/media`, { method: "POST", headers: auth, body: form });
  if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
  const data = await res.json();
  const id = data.doc?.id ?? data.id;
  if (!id) throw new Error("No media ID in response");
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
  log(`Target: ${BASE}`);
  if (DRY_RUN) log("⚠  DRY RUN — no writes\n");

  // Pre-flight: check all files exist before touching prod
  log("Checking files in " + MEDIA);
  const missing = [];
  for (const { file, title } of BLOG_IMAGES) {
    if (!findFile(file)) missing.push(`  MISSING: ${file}.(png|jpg|jpeg|webp)  ← ${title}`);
  }
  if (missing.length > 0) {
    log(`\n${missing.length} image(s) not found:\n` + missing.join("\n"));
    if (!DRY_RUN) {
      log("\nAdd the missing files and re-run. Nothing was changed.");
      process.exit(1);
    }
  } else {
    log("All 28 files present ✓\n");
  }

  if (DRY_RUN) {
    log("DRY RUN complete — run without --dry-run to apply.");
    return;
  }

  const auth = await login();
  log("Login OK\n");

  let success = 0, errors = 0;

  for (let i = 0; i < BLOG_IMAGES.length; i++) {
    const { file, id, title } = BLOG_IMAGES[i];
    log(`[${i + 1}/${BLOG_IMAGES.length}] Blog ${id} — "${title}"`);

    const filePath = findFile(file);
    if (!filePath) {
      log(`  ✗ SKIP — file not found\n`);
      errors++;
      continue;
    }

    try {
      const mediaId = await uploadImage(filePath, file, auth);
      log(`  Uploaded → Media ID ${mediaId}`);
      await wait(300);

      await patchBlog(id, mediaId, auth);
      log(`  ✅ heroImage updated\n`);
      success++;
    } catch (err) {
      log(`  ✗ ERROR: ${err.message}\n`);
      errors++;
    }

    await wait(400);
  }

  log("─".repeat(60));
  log(`Done! ${success} updated, ${errors} errors`);
}

run().catch(err => {
  console.error("[batch4] FATAL:", err.message);
  process.exit(1);
});
