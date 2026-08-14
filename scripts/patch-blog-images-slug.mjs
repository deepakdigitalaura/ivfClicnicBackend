#!/usr/bin/env node
/**
 * patch-blog-images-slug.mjs
 *
 * Updates heroImage for blogs identified by their slug (from the live URL).
 * Looks up each blog ID by slug, uploads the local image to Payload Media,
 * then patches heroImage. Slug-based so no hardcoded IDs to drift.
 *
 * Run (live):  node scripts/patch-blog-images-slug.mjs
 * Dry run:     node scripts/patch-blog-images-slug.mjs --dry-run
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname, extname, basename } from "path";
import { fileURLToPath } from "url";

const __dir    = dirname(fileURLToPath(import.meta.url));
const ROOT     = resolve(__dir, "..");
const BASE     = process.env.PAYLOAD_URL          ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL    = process.env.SEED_ADMIN_EMAIL     ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD  ?? "Zxcvbnm@123";
const DRY_RUN  = process.argv.includes("--dry-run");

const log  = (msg) => console.log(`[slug-patch] ${msg}`);
const wait = (ms)  => new Promise(r => setTimeout(r, ms));

/**
 * slug — from the blog URL (/blog/<slug>)
 * img  — local image path relative to project root
 */
const ITEMS = [
  { slug: "how-do-thyroid-disorders-affect-fertility-in-women",                       img: "public/blog-media/pexels/Thyroid.png" },
  { slug: "how-long-does-it-take-for-the-uterus-to-go-back-to-normal-after-birth",    img: "public/blog-media/pexels/uterus normal after birth.png" },
  { slug: "best-types-of-exercise-to-support-your-ivf-journey",                       img: "public/blog-media/pexels/IVF Excercise.png" },
  { slug: "ivf-treatment-cost-in-ahmedabad-across-india",                             img: "public/blog-media/IVF Cost in Ahmedabad.png" },
  { slug: "how-to-improve-your-chances-of-conceiving-naturally-with-low-amh-levels",  img: "public/blog-media/Low AMH & Menstrual Irregularity.png" },
  { slug: "teratozoospermia-uncovering-the-causes-symptoms-and-solutions",            img: "public/blog-media/Teratozoospermia.png" },
  { slug: "how-does-follicle-count-affect-ivf-success-rates",                         img: "public/blog-media/pexels/Follicle count.png" },
  { slug: "do-i-need-an-ultrasound-in-every-pregnancy-visit-is-it-safe",              img: "public/blog-media/Ultrasound Every Pregnancy Visit.png" },
  { slug: "uterine-fibroids-symptoms-causes-and-treatment",                           img: "public/blog-media/Fibroids in Young Women.png" },
  { slug: "preparing-for-pgt-what-to-expect-before-during-and-after-the-procedure",   img: "public/blog-media/PGT Boosts IVF Success.png" },
  { slug: "understanding-sperm-cramps-symptoms-causes-diagnosis-treatment",           img: "public/blog-media/Sperm Cramps Symptoms & Treatment.png" },
  { slug: "how-to-get-pregnant-without-removing-fibroid-or-without-surgery",          img: "public/blog-media/Pregnancy Test Timing After IUI.png" },
  { slug: "13-best-ivf-clinics-in-mumbai",                                            img: "public/assets/Locations/Nikol.png" },
  { slug: "best-ivf-hospitals-in-ahmedabad",                                          img: "public/assets/Locations/sindhu-bhavan-road.png" },
];

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

async function findBlogBySlug(slug, auth) {
  const url = `${BASE}/api/blogs?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`;
  const res = await fetch(url, { headers: auth });
  if (!res.ok) throw new Error(`Lookup failed ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const doc = data.docs?.[0];
  if (!doc) throw new Error(`No blog found for slug "${slug}"`);
  return { id: doc.id, title: doc.title };
}

async function uploadImage(filePath, auth) {
  const buffer = readFileSync(filePath);
  const mime   = mimeType(filePath);
  const ext    = extname(filePath).toLowerCase();
  // Clean storage filename derived from the source file
  const cleanName = basename(filePath, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const storageName = cleanName + ext;

  const blob = new Blob([buffer], { type: mime });
  const form = new FormData();
  form.append("file", blob, storageName);
  form.append("_payload", JSON.stringify({ alt: cleanName.replace(/-/g, " ") }));

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

  // Pre-flight: verify every local file exists before touching prod
  const missing = [];
  for (const { img } of ITEMS) {
    if (!existsSync(resolve(ROOT, img))) missing.push(`  MISSING: ${img}`);
  }
  if (missing.length > 0) {
    log(`\n${missing.length} image(s) not found:\n` + missing.join("\n"));
    log("\nNothing was changed.");
    process.exit(1);
  }
  log(`All ${ITEMS.length} files present ✓\n`);

  const auth = DRY_RUN ? {} : await login();
  if (!DRY_RUN) log("Login OK\n");

  let success = 0, errors = 0;

  for (let i = 0; i < ITEMS.length; i++) {
    const { slug, img } = ITEMS[i];
    const filePath = resolve(ROOT, img);
    log(`[${i + 1}/${ITEMS.length}] ${slug}`);

    try {
      const { id, title } = DRY_RUN
        ? { id: "?", title: "(dry run — not looked up)" }
        : await findBlogBySlug(slug, auth);
      log(`  Blog ${id} — "${title}"`);

      if (DRY_RUN) {
        log(`  [DRY] Would upload ${basename(img)} → patch heroImage\n`);
        success++;
        continue;
      }

      const mediaId = await uploadImage(filePath, auth);
      log(`  Uploaded ${basename(img)} → Media ID ${mediaId}`);
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
  if (errors > 0) log("Re-run to retry failures.");
}

run().catch(err => {
  console.error("[slug-patch] FATAL:", err.message);
  process.exit(1);
});
