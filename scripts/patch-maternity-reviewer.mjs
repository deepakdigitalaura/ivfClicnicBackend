#!/usr/bin/env node
/* =====================================================================
 * Patch reviewerSlug for all 6 maternity service pages to "binal-shah".
 * Previously seeded as "falguni-bavishi" — this corrects the live CMS.
 *
 * Usage (against production):
 *   PAYLOAD_URL=https://ivfclinic.com \
 *   SEED_ADMIN_EMAIL=<admin-email> \
 *   SEED_ADMIN_PASSWORD=<admin-password> \
 *   node scripts/patch-maternity-reviewer.mjs
 *
 * Or against local dev (defaults):
 *   node scripts/patch-maternity-reviewer.mjs
 * ===================================================================== */

const BASE     = process.env.PAYLOAD_URL        ?? "http://localhost:3000";
const EMAIL    = process.env.SEED_ADMIN_EMAIL   ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

const SLUGS = [
  "3d-4d-sonography",
  "painless-delivery",
  "normal-delivery",
  "fetal-medicine",
  "high-risk-pregnancy-care",
  "twin-pregnancy-care",
];

const login = async () => {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed: HTTP ${res.status}`);
  const data = await res.json();
  if (!data.token) throw new Error(`Login failed: no token in response`);
  console.log(`[patch] Logged in as ${EMAIL}`);
  return data.token;
};

const run = async () => {
  const token = await login();
  const auth  = { Authorization: `JWT ${token}`, "Content-Type": "application/json" };

  for (const slug of SLUGS) {
    // Find the existing service doc by slug
    const findRes = await fetch(
      `${BASE}/api/services?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`,
      { headers: auth },
    );
    const found = await findRes.json();
    const doc   = found?.docs?.[0];

    if (!doc) {
      console.warn(`[patch] NOT FOUND: '${slug}' — skipping`);
      continue;
    }

    const patchRes = await fetch(`${BASE}/api/services/${doc.id}`, {
      method:  "PATCH",
      headers: auth,
      body:    JSON.stringify({ reviewerSlug: "binal-shah" }),
    });

    if (!patchRes.ok) {
      const err = await patchRes.json().catch(() => ({}));
      console.error(`[patch] FAILED '${slug}': HTTP ${patchRes.status}`, err);
    } else {
      console.log(`[patch] ✓ '${slug}' → reviewerSlug = binal-shah`);
    }
  }

  console.log("\n[patch] Done. Revalidation will clear the cache on next request.");
};

run().catch((e) => {
  console.error("[patch] FATAL:", e.message);
  process.exit(1);
});
