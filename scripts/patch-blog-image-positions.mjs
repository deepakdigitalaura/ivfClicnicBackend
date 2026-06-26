#!/usr/bin/env node
/**
 * patch-blog-image-positions.mjs
 *
 * Sets heroImagePosition for every blog based on its hero image composition:
 *
 *   "right center"  — blog-media/*.png images (banner-style design: subject on
 *                     right half, empty/solid space on left half)
 *   "center center" — batch4/*.jpg images (AI photography, subjects centred)
 *                   — known full-width PNG exceptions (Pregnancy Diet, etc.)
 *                   — blogs with no hero image (gradient fallback)
 *
 * Logic:
 *   1. Fetch all published blogs with heroImage populated (filename in URL).
 *   2. If heroImage URL contains a known JPG stem (batch4 / pexels) → center.
 *   3. If heroImage URL matches a known "centred PNG" exception → center.
 *   4. Otherwise (any other .png) → right center.
 *   5. Blogs with no heroImage → center (no-op, field defaults to center).
 *
 * Run:      node scripts/patch-blog-image-positions.mjs
 * Dry-run:  node scripts/patch-blog-image-positions.mjs --dry-run
 */

const BASE     = process.env.PAYLOAD_URL          ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL    = process.env.SEED_ADMIN_EMAIL     ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD  ?? "Zxcvbnm@123";
const DRY_RUN  = process.argv.includes("--dry-run");

const log  = msg => console.log(`[img-pos] ${msg}`);
const wait = ms  => new Promise(r => setTimeout(r, ms));

/**
 * Stems of batch4 / pexels JPG filenames — all need "center center".
 * These are AI photography images with subjects nicely centred.
 */
const CENTER_JPG_STEMS = new Set([
  "age-affects-fertility",
  "amh-afc-ovarian-reserve",
  "conceiving-naturally-low-amh",
  "epigenetics-ivf-pregnancy",
  "exercise-ivf-journey",
  "follicle-count-ivf-success",
  "high-risk-pregnancy-diabetes",
  "iui-success-rate",
  "ivf-clinics-mumbai",
  "ivf-hospitals-ahmedabad",
  "ivf-pregnancy-week-by-week",
  "letrozole-ovulation-pregnancy",
  "natural-conception-low-amh",
  "natural-vs-medicated-iui",
  "ovarian-rejuvenation-ivf",
  "pregnancy-nutrition-plan",
  "pregnancy-signs-symptoms",
  "pregnancy-ultrasound-safety",
  "pregnant-without-fibroid-surgery",
  "preparing-for-pgt",
  "sperm-cramps-treatment",
  "thyroid-fertility-women",
  "twin-delivery-options",
  "twin-pregnancy-risks",
  "twins-ivf-myth",
  "types-of-ivf-treatments",
  "uterine-fibroids-treatment",
  "uterus-recovery-after-birth",
]);

/**
 * PNG filenames (partial, case-insensitive) that are full-width or centred
 * compositions — these should keep "center center".
 */
const CENTER_PNG_FRAGMENTS = [
  "pregnancy diet",           // Pregnancy Diet.png  — full-width food flatlay
  "ivf excercise",            // pexels/IVF Excercise.png — 4 yoga women, spread
  "thyroid.png",              // pexels/Thyroid.png — close-up face, centred
  "uterus normal after birth",// pexels/uterus normal after birth.png — centred diagram
];

/** Derive a position from the Payload media URL/filename. */
function positionFor(mediaUrl) {
  if (!mediaUrl) return "center center";

  const lower = mediaUrl.toLowerCase();

  // 1. Any JPG → batch4 / pexels photography → center
  if (lower.includes(".jpg") || lower.includes(".jpeg")) {
    const stem = lower.split("/").pop()?.replace(/\.(jpg|jpeg)$/, "") ?? "";
    if (CENTER_JPG_STEMS.has(stem)) return "center center";
    // Unknown JPG → still assume center (future patches)
    return "center center";
  }

  // 2. Known centred PNG exceptions
  for (const frag of CENTER_PNG_FRAGMENTS) {
    if (lower.includes(frag)) return "center center";
  }

  // 3. All other PNGs → blog-media banner style → right center
  if (lower.includes(".png")) return "right center";

  // 4. Unknown extension → default
  return "center center";
}

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

async function fetchAllBlogs(auth) {
  const all = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `${BASE}/api/blogs?limit=100&page=${page}&depth=1`,
      { headers: auth }
    );
    if (!res.ok) throw new Error(`Fetch blogs p${page}: ${res.status}`);
    const data = await res.json();
    all.push(...(data.docs ?? []));
    if (!data.hasNextPage) break;
    page++;
    await wait(300);
  }
  return all;
}

async function patchBlog(id, position, auth) {
  const res = await fetch(`${BASE}/api/blogs/${id}`, {
    method: "PATCH",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ heroImagePosition: position }),
  });
  if (!res.ok) throw new Error(`PATCH ${id} failed: ${await res.text()}`);
}

async function run() {
  log(`Target: ${BASE}`);
  if (DRY_RUN) log("⚠  DRY RUN — no writes\n");

  const auth = DRY_RUN ? { Authorization: "JWT dry" } : await login();
  if (!DRY_RUN) log("Login OK\n");

  const blogs = await fetchAllBlogs(DRY_RUN ? { Authorization: "JWT dry" } : auth);
  log(`Fetched ${blogs.length} blogs\n`);

  const counts = { "right center": 0, "center center": 0, skipped: 0 };
  let errors = 0;

  for (let i = 0; i < blogs.length; i++) {
    const b = blogs[i];
    const heroUrl = typeof b.heroImage === "object" ? b.heroImage?.url : null;
    const position = positionFor(heroUrl);

    const label = heroUrl
      ? heroUrl.split("/").pop()?.slice(0, 50) ?? heroUrl
      : "(no image)";

    if (DRY_RUN) {
      log(`[${String(i + 1).padStart(3)}] ${b.id} → ${position}  (${label})`);
      counts[position] = (counts[position] ?? 0) + 1;
      continue;
    }

    try {
      await patchBlog(b.id, position, auth);
      counts[position] = (counts[position] ?? 0) + 1;
      if ((i + 1) % 10 === 0) log(`  ${i + 1}/${blogs.length} done…`);
    } catch (err) {
      log(`  ✗ Blog ${b.id} (${b.slug}): ${err.message}`);
      errors++;
    }

    await wait(150);
  }

  log("\n" + "─".repeat(60));
  log(`right center : ${counts["right center"] ?? 0}`);
  log(`center center: ${counts["center center"] ?? 0}`);
  if (errors) log(`errors       : ${errors}`);
  log("Done!");
}

run().catch(err => {
  console.error("[img-pos] FATAL:", err.message);
  process.exit(1);
});
