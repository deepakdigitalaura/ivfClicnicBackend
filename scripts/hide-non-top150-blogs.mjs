#!/usr/bin/env node
/* =====================================================================
 * hide-non-top150-blogs.mjs
 * Sets _status="draft" on every blog post NOT in the GSC top-150 list
 * (scripts/gsc_top150_urls.txt), leaving the top 150 untouched
 * (already _status="published"). Reversible — flip a post back to
 * published from /admin (or another script) at any time.
 *
 * Run against PROD:
 *   PAYLOAD_URL=https://ivf-clicnic-backend-weld.vercel.app \
 *   SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... \
 *   node scripts/hide-non-top150-blogs.mjs
 * ===================================================================== */
import { readFileSync } from "fs";

const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL;
const PASSWORD = process.env.SEED_ADMIN_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error("[hide] SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD env vars are required");
  process.exit(1);
}

const log = (msg) => console.log(`[hide] ${msg}`);

const slugFromUrl = (url) => {
  const path = new URL(url).pathname.replace(/^\/+|\/+$/g, "");
  return path.split("/").filter(Boolean).pop();
};

/* Slugs that were reworded during import — GSC slug -> live slug */
const SLUG_OVERRIDES = {
  "tips-for-getting-pregnant-faster-with-pcos-a-step-by-step-guide":
    "12-tips-for-getting-pregnant-faster-with-pcos-a-step-by-step-guide",
  "reasons-behind-low-amh-levels-and-ways-to-increase-it":
    "reasons-behind-low-amh-levels-ways-to-increase",
  "miscarriages-during-ivf-signs-causes-prevention":
    "miscarriages-during-ivf-signs-causes-prevention-hope",
  "best-ivf-clinics-in-mumbai": "13-best-ivf-clinics-in-mumbai",
  "do-i-need-an-ultrasound-in-every-pregnancy-visit":
    "do-i-need-an-ultrasound-in-every-pregnancy-visit-is-it-safe",
  "how-to-interpret-amh-afc-and-other-ovarian-reserve-rests":
    "how-to-interpret-amh-afc-and-other-ovarian-reserve-rests-what-the-numbers-really-mean",
  "what-are-microplastics-and-how-do-they-affect-reproductive-health":
    "what-are-microplastics-how-do-they-affect-reproductive-health",
};

async function main() {
  const lines = readFileSync(new URL("./gsc_top150_urls.txt", import.meta.url), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const keepSlugs = new Set(
    lines.map((url) => {
      const slug = slugFromUrl(url);
      return SLUG_OVERRIDES[slug] ?? slug;
    })
  );
  log(`${keepSlugs.size} slugs to keep published`);

  log(`Connecting to ${BASE} ...`);
  const loginRes = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!loginRes.ok) throw new Error(`Login failed HTTP ${loginRes.status}: ${await loginRes.text()}`);
  const { token } = await loginRes.json();
  log("Login OK");
  const headers = { "Content-Type": "application/json", Authorization: `JWT ${token}` };

  const allBlogs = [];
  let page = 1;
  const limit = 100;
  let total = 0;
  do {
    const res = await fetch(
      `${BASE}/api/blogs?limit=${limit}&page=${page}&depth=0&select[slug]=true&select[_status]=true`,
      { headers }
    );
    const data = await res.json();
    allBlogs.push(...(data.docs ?? []));
    total = data.totalDocs ?? 0;
    page++;
  } while ((page - 1) * limit < total);
  log(`${allBlogs.length} blog posts found (totalDocs=${total})`);

  const toHide = allBlogs.filter((b) => !keepSlugs.has(b.slug) && b._status !== "draft");
  const alreadyDraft = allBlogs.filter((b) => !keepSlugs.has(b.slug) && b._status === "draft");
  const missing = [...keepSlugs].filter((s) => !allBlogs.some((b) => b.slug === s));

  log(`To hide (publish -> draft): ${toHide.length}`);
  log(`Already draft (skip): ${alreadyDraft.length}`);
  if (missing.length) log(`WARNING: ${missing.length} keep-slugs not found live: ${missing.join(", ")}`);

  let updated = 0;
  let failed = 0;
  for (const [i, blog] of toHide.entries()) {
    const res = await fetch(`${BASE}/api/blogs/${blog.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ _status: "draft" }),
    });
    if (res.ok) {
      updated++;
      log(`  ✓ [${i + 1}/${toHide.length}] ${blog.slug} -> draft`);
    } else {
      failed++;
      const errText = await res.text();
      log(`  ✗ [${i + 1}/${toHide.length}] ${blog.slug} — ${errText.slice(0, 120)}`);
    }
    await new Promise((r) => setTimeout(r, 150)); // prod-safe pacing
  }

  log(`\nDone. Updated=${updated} Failed=${failed} Kept-published=${keepSlugs.size}`);
}

main().catch((err) => {
  console.error("[hide] FAILED:", err.message);
  process.exit(1);
});
