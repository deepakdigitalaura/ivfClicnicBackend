#!/usr/bin/env node
/**
 * patch-blog-center-fixes.mjs
 *
 * Resets heroImagePosition to "center center" for blogs whose PNG cover
 * images have centered content (not right-side subjects). These were
 * incorrectly tagged as "right center" by the bulk position script.
 *
 * Run: node scripts/patch-blog-center-fixes.mjs
 */

const BASE     = process.env.PAYLOAD_URL         ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL    = process.env.SEED_ADMIN_EMAIL    ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Zxcvbnm@123";

// These CME/event photos have faces near the top — use "center top" so
// object-cover crops the bottom instead of the heads.
const TOP_SLUGS = [
  "the-emotional-rollercoaster-of-ivf-why-mental-health-support-is-essential",
  "bavishi-fertility-institute-conducts-an-educational-programme-at-rajkot",
  "bavishi-fertility-institute-conducts-a-successful-cme-program-at-bardoli",
  "bavishi-fertility-institute-hosts-knowledge-sharing-program-with-bharuch-ob-gy-society",
  "empowering-women-in-medicine-knowledge-sharing-program-on-advanced-fertility-and-ivf-techniques-at-nikol",
  "ivf-treatment-cost-in-ahmedabad-across-india",
  "dr-himanshu-bavishi-speaks-on-ivf-at-sogog-conference",
  "dr-falguni-bavishi-at-sogog-conference-on-iui-success",
];

const log  = msg => console.log(`[center-fix] ${msg}`);
const wait = ms  => new Promise(r => setTimeout(r, ms));

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

async function run() {
  log(`Target: ${BASE}`);
  const auth = await login();
  log("Login OK\n");

  let ok = 0;
  let errors = 0;

  for (const slug of TOP_SLUGS) {
    // Fetch the blog by slug
    const findRes = await fetch(
      `${BASE}/api/blogs?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`,
      { headers: auth }
    );
    if (!findRes.ok) {
      log(`  ✗ Lookup failed for "${slug}": ${findRes.status}`);
      errors++;
      continue;
    }
    const { docs } = await findRes.json();
    if (!docs?.length) {
      log(`  ⚠  Not found: "${slug}"`);
      errors++;
      continue;
    }
    const { id } = docs[0];

    // Patch heroImagePosition to center top so faces show, bottom crops
    const patchRes = await fetch(`${BASE}/api/blogs/${id}`, {
      method: "PATCH",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({ heroImagePosition: "center top" }),
    });
    if (!patchRes.ok) {
      log(`  ✗ PATCH failed for "${slug}" (id ${id}): ${await patchRes.text()}`);
      errors++;
    } else {
      log(`  ✓ ${slug}`);
      ok++;
    }

    await wait(200);
  }

  log(`\nDone — ${ok} fixed, ${errors} errors`);
}

run().catch(err => {
  console.error("[center-fix] FATAL:", err.message);
  process.exit(1);
});
