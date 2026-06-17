#!/usr/bin/env node
/* =====================================================================
 * fix-blog-authors.mjs
 * Fixes author + reviewedBy on ALL blog posts via the Payload REST API.
 * Looks up Dr. Parth Bavishi and Dr. Himanshu Bavishi by NAME so it
 * works correctly on both local and production (IDs differ between DBs).
 *
 * Author    → Dr. Parth Bavishi
 * Reviewer  → Dr. Himanshu Bavishi
 *
 * Run against LOCAL:
 *   node scripts/fix-blog-authors.mjs
 *
 * Run against PROD:
 *   PAYLOAD_URL=https://... SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... node scripts/fix-blog-authors.mjs
 * ===================================================================== */

const BASE     = process.env.PAYLOAD_URL        ?? "http://localhost:3000";
const EMAIL    = process.env.SEED_ADMIN_EMAIL    ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

const log = (msg) => console.log(`[fix-authors] ${msg}`);

async function main() {
  log(`Connecting to ${BASE} ...`);

  /* ── Login ─────────────────────────────────────────────────────── */
  const loginRes = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!loginRes.ok) {
    const err = await loginRes.text();
    throw new Error(`Login failed HTTP ${loginRes.status}: ${err}`);
  }
  const { token } = await loginRes.json();
  log("Login OK");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
  };

  /* ── Find author IDs by name ────────────────────────────────────── */
  const authorsRes = await fetch(`${BASE}/api/authors?limit=50&depth=0`, { headers });
  const authorsData = await authorsRes.json();
  const authors = authorsData.docs ?? [];

  log(`Authors in this DB:`);
  authors.forEach(a => log(`  ID ${a.id}  →  ${a.name}`));

  const parth    = authors.find(a => a.name === "Dr. Parth Bavishi");
  const himanshu = authors.find(a => a.name === "Dr. Himanshu Bavishi");

  if (!parth)    throw new Error('Author "Dr. Parth Bavishi" not found');
  if (!himanshu) throw new Error('Author "Dr. Himanshu Bavishi" not found');

  const AUTHOR_ID   = parth.id;
  const REVIEWER_ID = himanshu.id;
  log(`\nAuthor   → Dr. Parth Bavishi    (ID ${AUTHOR_ID})`);
  log(`Reviewer → Dr. Himanshu Bavishi (ID ${REVIEWER_ID})\n`);

  /* ── Paginate through all blogs and update ──────────────────────── */
  let page = 1;
  const limit = 50;
  let total = 0;
  let processed = 0;
  let updated = 0;
  let failed = 0;

  do {
    const listRes = await fetch(
      `${BASE}/api/blogs?limit=${limit}&page=${page}&depth=0&select[id]=true&select[slug]=true`,
      { headers }
    );
    const listData = await listRes.json();
    const blogs = listData.docs ?? [];
    total = listData.totalDocs ?? 0;

    if (page === 1) log(`Found ${total} blog posts. Updating...\n`);

    for (const blog of blogs) {
      processed++;
      const patchRes = await fetch(`${BASE}/api/blogs/${blog.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ author: AUTHOR_ID, reviewedBy: REVIEWER_ID }),
      });
      if (patchRes.ok) {
        updated++;
        log(`  ✓ [${processed}/${total}] ${blog.slug}`);
      } else {
        failed++;
        const errText = await patchRes.text();
        log(`  ✗ [${processed}/${total}] ${blog.slug} — ${errText.slice(0, 80)}`);
      }
      /* 150 ms pacing — prod-safe, avoids rate limit */
      await new Promise(r => setTimeout(r, 150));
    }

    page++;
  } while ((page - 1) * limit < total);

  log(`\n✅  Done!`);
  log(`   Total    : ${total}`);
  log(`   Updated  : ${updated}`);
  log(`   Failed   : ${failed}`);
}

main().catch(err => {
  console.error(`[fix-authors] FAILED:`, err.message);
  process.exit(1);
});
