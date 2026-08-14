#!/usr/bin/env node
/* Publishes all draft blogs that belong to the "cme" category.
 *
 * Run:
 *   PAYLOAD_URL=https://ivf-clicnic-backend-weld.vercel.app \
 *   SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... \
 *   node scripts/unhide-cme-blogs.mjs
 */

const BASE = process.env.PAYLOAD_URL ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL = process.env.SEED_ADMIN_EMAIL;
const PASSWORD = process.env.SEED_ADMIN_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error("[cme] SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD env vars are required");
  process.exit(1);
}

const log = (msg) => console.log(`[cme] ${msg}`);

async function main() {
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

  // Fetch all blogs with category slug = "cme" (including drafts — need auth)
  const allCme = [];
  let page = 1;
  const limit = 100;
  let total = 0;
  do {
    const res = await fetch(
      `${BASE}/api/blogs?limit=${limit}&page=${page}&depth=1&where[category.slug][equals]=cme`,
      { headers }
    );
    const data = await res.json();
    allCme.push(...(data.docs ?? []));
    total = data.totalDocs ?? 0;
    page++;
  } while ((page - 1) * limit < total);

  log(`${allCme.length} CME blog(s) found (totalDocs=${total})`);

  const drafts = allCme.filter((b) => b._status === "draft");
  const alreadyPublished = allCme.filter((b) => b._status !== "draft");

  log(`Already published: ${alreadyPublished.length}`);
  log(`To publish (draft → published): ${drafts.length}`);

  let updated = 0;
  let failed = 0;
  for (const [i, blog] of drafts.entries()) {
    const res = await fetch(`${BASE}/api/blogs/${blog.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ _status: "published" }),
    });
    if (res.ok) {
      updated++;
      log(`  ✓ [${i + 1}/${drafts.length}] ${blog.slug} → published`);
    } else {
      failed++;
      const errText = await res.text();
      log(`  ✗ [${i + 1}/${drafts.length}] ${blog.slug} — ${errText.slice(0, 120)}`);
    }
    await new Promise((r) => setTimeout(r, 150));
  }

  log(`\nDone. Updated=${updated} Failed=${failed}`);
}

main().catch((err) => {
  console.error("[cme] FAILED:", err.message);
  process.exit(1);
});
