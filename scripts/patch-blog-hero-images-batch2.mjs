#!/usr/bin/env node
/**
 * patch-blog-hero-images-batch2.mjs
 *
 * Second batch of blog hero image patches (44 new images).
 * The 19 from batch 1 are excluded — already patched.
 * "Can PCOS Be Cured.png" skipped — no matching blog found in CMS.
 *
 * Run: node scripts/patch-blog-hero-images-batch2.mjs
 * Dry: node scripts/patch-blog-hero-images-batch2.mjs --dry-run
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir    = dirname(fileURLToPath(import.meta.url));
const MEDIA    = resolve(__dir, "../public/blog-media");
const BASE     = process.env.PAYLOAD_URL         ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL    = process.env.SEED_ADMIN_EMAIL    ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Zxcvbnm@123";
const DRY_RUN  = process.argv.includes("--dry-run");

const log  = (msg) => console.log(`[blog-img2] ${msg}`);
const wait = (ms)  => new Promise(r => setTimeout(r, ms));

// Map: local filename → Payload blog ID (verified via live API search)
const BLOG_IMAGES = [
  { file: "Azoospermia & Treatment.png",               id: 18  },  // "Azoospermia: Can you have a baby with zero sperm count?"
  { file: "Baby Weight Gain in Womb.png",              id: 109 },  // "How much weight can a baby gain in a week in the womb?"
  { file: "Conceiving After 40.png",                   id: 221 },  // "Trying to conceive after 40: What you need to know"
  { file: "Egg Freezing to Delay Pregnancy.png",       id: 132 },  // "Is egg freezing a good option if I want to delay pregnancy?"
  { file: "Endometrial Receptivity in IVF.png",        id: 213 },  // "The role of endometrial receptivity in IVF success"
  { file: "Exercise During IVF.png",                   id: 190 },  // "Role of Exercise in IVF Success"
  { file: "Foods to Avoid in Pregnancy.png",           id: 81  },  // "Foods to avoid during pregnancy and Why?"
  { file: "Frozen vs Fresh Embryo Transfer.png",       id: 84  },  // "Frozen vs. Fresh Embryo Transfer: Which is better?"
  { file: "How Many Times Can You Do IVF.png",         id: 108 },  // "How many times can a person undergo IVF procedure?"
  { file: "ICSI for Low Sperm Count.png",              id: 133 },  // "Is ICSI better for men with low sperm count?"
  { file: "ICSI Procedure Step-by-Step.png",           id: 193 },  // "Step-by-Step guide to the ICSI procedure"
  { file: "Improve IUI Success Naturally.png",         id: 116 },  // "How to improve your chances of IUI success naturally?"
  { file: "Improve Ovulation Naturally with PCOS.png", id: 114 },  // "How to improve ovulation naturally when you have PCOS?"
  { file: "Is IUI Painful.png",                        id: 134 },  // "Is IUI Painful? Everything you need to know"
  { file: "IUI Procedure Step-by-Step.png",            id: 194 },  // "Step-by-Step process of an IUI procedure: What to expect"
  { file: "IUI Process Step-by-Step.png",              id: 138 },  // "IUI process explained: What to expect at every step"
  { file: "IUI Side Effects Body & Emotions.png",      id: 139 },  // "IUI side effects on the body and emotions: A complete guide"
  { file: "IVF Failure — What Next.png",               id: 146 },  // "IVF failure doesn't mean the end: What can you do next?"
  { file: "Janmashtami Babies.png",                    id: 47  },  // "Celebrating the Divine Joy: Six Babies Born on Janmashtami at Bavishi Fertility Institute"
  { file: "Laser Assisted Hatching Risks & Benefits.png", id: 189 }, // "Risks and Benefits of laser assisted hatching in IVF"
  { file: "Letrozole & Ovulation.png",                 id: 99  },  // "How Letrozole works: A comprehensive guide to boosting ovulation for fertility"
  { file: "Letrozole Clearance Time.png",              id: 102 },  // "How long does it take for letrozole to get out of your system?"
  { file: "Life After IUI.png",                        id: 152 },  // "Life after IUI: Precautions, Lifestyle tips, and What to expect"
  { file: "Lifestyle Changes for PCOS Fertility.png",  id: 153 },  // "Lifestyle changes that boost fertility in PCOS women"
  { file: "Male Fertility Supplements & IVF.png",      id: 91  },  // "How do male fertility supplements impact IVF results?"
  { file: "Male Infertility & IVF.png",                id: 106 },  // "How male infertility affects IVF treatment?"
  { file: "Max Eggs in IVF Cycle.png",                 id: 243 },  // "What is the max number of eggs that you can retrieve in an IVF cycle?"
  { file: "Mental Health During IVF.png",              id: 118 },  // "How to protect your mental health during IVF and Fertility treatments"
  { file: "Natural Cycle IVF & Poor Ovarian Reserve.png", id: 137 }, // "Is natural cycle IVF better for women with poor ovarian reserve?"
  { file: "Natural IUI vs Medicated IUI.png",          id: 158 },  // "Natural IUI vs. Medicated IUI: Which is more effective?"
  { file: "Ovarian Rejuvenation — New Ray of Hope.png",id: 165 },  // "Ovarian rejuvenation for restoring fertility: A new ray of hope"
  { file: "PCOS Diet for Natural Conception.png",      id: 168 },  // "PCOS diet tips to support natural conception"
  { file: "Postpartum Journey.png",                    id: 210 },  // "The postpartum journey: How long does it take to heal after giving birth?"
  { file: "Sleep & IVF Success.png",                   id: 201 },  // "The connection between quality sleep and IVF success: A hormonal perspective"
  { file: "Surrogacy vs IVF.png",                      id: 198 },  // "Surrogacy vs IVF: Key Differences, Benefits, and Choosing the Right Path to Parenthood"
  { file: "Thin Endometrium.png",                      id: 236 },  // "Understanding thin endometrium: Causes, Impact, and Treatment options"
  { file: "Thyroid & Female Fertility.png",            id: 215 },  // "The thyroid connection: Understanding its role in female fertility health"
  { file: "Thyroid Disorders & Fertility.png",         id: 92  },  // "How do thyroid disorders affect fertility in women?"
  { file: "Top Fertility Treatments for PCOS.png",     id: 220 },  // "Top fertility treatments for women with PCOS"
  { file: "Trying Again After Miscarriage.png",        id: 101 },  // "How long do you have to wait to try again after a miscarriage?"
  { file: "Twin Pregnancies After IVF.png",            id: 222 },  // "Twin and Multiple pregnancies After IVF: Risks and Care"
  { file: "Uterus Recovery After Birth.png",           id: 103 },  // "How long does it take for the uterus to go back to normal after birth?"
  { file: "Varicocele Pain Relief.png",                id: 38  },  // "Breaking free from varicocele pain: 3 Innovative ways to find relief"
  { file: "Why Embryos Don't Implant.png",             id: 257 },  // "Why do some embryos not implant even if they look healthy?"
];

// Skipped — "Can PCOS Be Cured.png": no matching blog found in Payload CMS (279 blogs searched)

function mimeType(filename) {
  if (filename.endsWith(".jfif")) return "image/jpeg";
  if (filename.endsWith(".png"))  return "image/png";
  if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
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

async function fetchBlogTitle(id, auth) {
  const res = await fetch(`${BASE}/api/blogs/${id}?depth=0&_fields=id,title`, { headers: auth });
  if (!res.ok) throw new Error(`Fetch blog ${id}: ${res.status}`);
  return res.json();
}

async function uploadLocalImage(filename, auth) {
  const buffer     = readFileSync(resolve(MEDIA, filename));
  const mime       = mimeType(filename);
  const storageName = filename
    .replace(/\s*\(\d+\)/, "")
    .replace(/[—–]/g, "-")
    .replace(/[&+]/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-\.]/g, "")
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

async function run() {
  log(`Target: ${BASE}`);
  if (DRY_RUN) log("⚠  DRY RUN — no writes");
  log(`Processing ${BLOG_IMAGES.length} new images (19 from batch 1 skipped)\n`);

  const auth = await login();
  log("Login OK\n");

  let success = 0, errors = 0;

  for (let i = 0; i < BLOG_IMAGES.length; i++) {
    const { file, id } = BLOG_IMAGES[i];
    log(`[${i + 1}/${BLOG_IMAGES.length}] "${file}" → Blog ID ${id}`);

    try {
      const blog = await fetchBlogTitle(id, auth);
      log(`  Blog: "${blog.title}"`);

      if (DRY_RUN) {
        log(`  [DRY] Would upload and set heroImage\n`);
        success++;
        continue;
      }

      const mediaId = await uploadLocalImage(file, auth);
      log(`  Uploaded → Media ID ${mediaId}`);
      await wait(400);

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
  if (errors === 0) log(`\n⚠  Skipped: "Can PCOS Be Cured.png" — no matching blog in CMS`);
}

run().catch(err => {
  console.error("[blog-img2] FATAL:", err.message);
  process.exit(1);
});
