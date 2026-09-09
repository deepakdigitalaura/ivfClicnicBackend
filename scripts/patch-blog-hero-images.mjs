#!/usr/bin/env node
/**
 * patch-blog-hero-images.mjs
 *
 * For each blog in BLOG_IMAGES:
 *  1. Reads local image from public/blog-media/
 *  2. Uploads it to Payload Media
 *  3. Searches for the matching blog post by title keyword
 *  4. PATCHes heroImage on the found blog
 *
 * Run: node scripts/patch-blog-hero-images.mjs
 * Dry: node scripts/patch-blog-hero-images.mjs --dry-run
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir   = dirname(fileURLToPath(import.meta.url));
const MEDIA   = resolve(__dir, "../public/blog-media");
const BASE    = process.env.PAYLOAD_URL         ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL   = process.env.SEED_ADMIN_EMAIL    ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Zxcvbnm@123";
const DRY_RUN = process.argv.includes("--dry-run");

const log  = (msg) => console.log(`[blog-img] ${msg}`);
const wait = (ms)  => new Promise(r => setTimeout(r, ms));

// Map: local filename → Payload blog ID (hardcoded after dry-run verification)
const BLOG_IMAGES = [
  { file: "3D4D Ultrasound.png",                   id: 252 },  // "When should you get 3D/4D ultrasound during pregnancy?"
  { file: "AMH & Ovarian Reserve Tests.png",        id: 259 },  // "How to Interpret AMH, AFC and Other ovarian reserve tests"
  { file: "Asthenospermia & ART.png",               id: 17  },  // "Asthenospermia: Understanding the condition and Exploring ART options"
  { file: "Donor Eggs or Sperm.png",                id: 251 },  // "When should you consider donor eggs or Sperm?"
  { file: "Egg Freezing.png",                       id: 219 },  // "Top 10 Reasons to consider Egg Freezing"
  { file: "Emotional Rollercoaster of IVF (2).png", id: 203 },  // "The emotional rollercoaster of IVF: Why mental health support is essential?"
  { file: "Endometriosis Recurrence.png",           id: 41  },  // "Can endometriosis come back after surgery? Recurrence rates & Prevention tips"
  { file: "Fibroids & Diet.png",                    id: 77  },  // "Fibroids and Diet: Foods that may help manage symptoms naturally"
  { file: "Fibroids in Young Women.png",            id: 79  },  // "Fibroids in young women and Teenagers: Early Symptoms and Myths"
  { file: "High Risk Pregnancy.png",                id: 87  },  // "High-Risk Pregnancy: A guide to Lifestyle, Diet, and Rest tips"
  { file: "IVF & Thyroid Disorders.png",            id: 148 },  // "IVF for women with thyroid disorders: What patients should know"
  { file: "Normal Delivery Tips.png",               id: 160 },  // "Normal delivery: Tips to increase your chances of a natural birth"
  { file: "Ovarian Rejuvenation + IVF.png",         id: 182 },  // "PRP ovarian rejuvenation: Boosting egg quality and Fertility"
  { file: "PRP vs Traditional Treatments.jfif",     id: 183 },  // "PRP vs Traditional fertility treatments: What's the difference?"
  { file: "Pregnancy Diet.png",                     id: 51  },  // "Complete pregnancy diet chart by trimester"
  { file: "Secondary Infertility.png",              id: 191 },  // "Secondary infertility: Why getting pregnant again can be hard?"
  { file: "Sperm DNA Fragmentation Testing.png",    id: 253 },  // "When to consider sperm DNA fragmentation testing in low sperm count cases?"
  { file: "Twin Delivery Options.png",              id: 223 },  // "Twin pregnancy delivery options: Normal delivery vs C-Section"
  { file: "Twin Pregnancy Risks.png",               id: 224 },  // "Twin pregnancy: Understanding common risks and How doctors manage them?"
];

function mimeType(filename) {
  if (filename.endsWith(".jfif")) return "image/jpeg";
  if (filename.endsWith(".png"))  return "image/png";
  if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

// ── API helpers ───────────────────────────────────────────────────────────────

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

async function fetchBlogTitle(id, auth) {
  const res = await fetch(`${BASE}/api/blogs/${id}?depth=0&_fields=id,title`, { headers: auth });
  if (!res.ok) throw new Error(`Fetch blog ${id}: ${res.status}`);
  return res.json();
}

async function uploadLocalImage(filename, auth) {
  const filePath = resolve(MEDIA, filename);
  const buffer   = readFileSync(filePath);
  const mime     = mimeType(filename);
  // Normalize filename for storage: strip special chars, replace spaces with hyphens
  const storageName = filename
    .replace(/\s*\(\d+\)/, "")          // remove "(2)" etc
    .replace(/[&+]/g, "and")            // & → and
    .replace(/\s+/g, "-")               // spaces → hyphens
    .replace(/[^\w\-\.]/g, "")          // remove remaining specials
    .toLowerCase();

  const blob = new Blob([buffer], { type: mime });
  const form = new FormData();
  form.append("file", blob, storageName);
  form.append("_payload", JSON.stringify({ alt: filename.replace(/\.[^.]+$/, "") }));

  const res = await fetch(`${BASE}/api/media`, { method: "POST", headers: auth, body: form });
  if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
  const data = await res.json();
  const id = data.doc?.id ?? data.id;
  if (!id) throw new Error("No media ID returned");
  return id;
}

async function patchBlog(id, heroMediaId, auth) {
  const res = await fetch(`${BASE}/api/blogs/${id}`, {
    method: "PATCH",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ heroImage: heroMediaId }),
  });
  if (!res.ok) throw new Error(`PATCH failed: ${await res.text()}`);
  return res.json();
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  log(`Target: ${BASE}`);
  if (DRY_RUN) log("⚠  DRY RUN — no writes");

  const auth = await login();
  log("Login OK\n");

  let success = 0, errors = 0;

  for (let i = 0; i < BLOG_IMAGES.length; i++) {
    const { file, id } = BLOG_IMAGES[i];
    log(`[${i + 1}/${BLOG_IMAGES.length}] "${file}" → Blog ID ${id}`);

    try {
      // 1. Confirm blog exists
      const blog = await fetchBlogTitle(id, auth);
      log(`  Blog: "${blog.title}"`);

      if (DRY_RUN) {
        log(`  [DRY] Would upload "${file}" and set heroImage\n`);
        success++;
        continue;
      }

      // 2. Upload local image
      const mediaId = await uploadLocalImage(file, auth);
      log(`  Uploaded → Media ID ${mediaId}`);
      await wait(400);

      // 3. Patch blog
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
  log(`Done! ${success} updated, ${errors} errors${DRY_RUN ? " (DRY RUN)" : ""}`);
}

run().catch(err => {
  console.error("[blog-img] FATAL:", err.message);
  process.exit(1);
});
