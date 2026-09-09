#!/usr/bin/env node
/* =====================================================================
 * Seed / update policy & legal pages via Payload's REST API.
 * ---------------------------------------------------------------------
 * Upserts: privacy-policy, terms-of-service, refund-policy, cookie-policy, sitemap.
 * Uses the same pattern as seed-contact.mjs.
 *
 * Run: node scripts/seed-legal-pages.mjs
 * (Requires the dev server or PAYLOAD_URL pointing to prod.)
 * ===================================================================== */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

const FILES = [
  "privacy-policy.json",
  "terms-of-service.json",
  "refund-policy.json",
  "cookie-policy.json",
  "sitemap-page.json",
];

const login = async () => {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`login failed: HTTP ${res.status}`);
  return (await res.json()).token;
};

const upsert = async (token, data) => {
  const auth = { Authorization: `JWT ${token}`, "Content-Type": "application/json" };
  const found = await fetch(
    `${BASE}/api/pages?where[slug][equals]=${encodeURIComponent(data.slug)}&depth=0&limit=1`,
    { headers: auth },
  ).then((r) => r.json());

  const body = JSON.stringify(data);
  let res;
  if (found.docs?.length) {
    res = await fetch(`${BASE}/api/pages/${found.docs[0].id}`, { method: "PATCH", headers: auth, body });
  } else {
    res = await fetch(`${BASE}/api/pages`, { method: "POST", headers: auth, body });
  }
  const out = await res.json();
  if (!res.ok) throw new Error(`upsert '${data.slug}' failed HTTP ${res.status}: ${JSON.stringify(out)}`);
  const action = found.docs?.length ? "updated" : "created";
  console.log(`  [${action}] ${data.slug} (id=${out.doc?.id})`);
};

const run = async () => {
  console.log(`[seed-legal-pages] Seeding to ${BASE}`);
  const token = await login();
  for (const file of FILES) {
    const data = JSON.parse(readFileSync(join(__dirname, "seed", file), "utf8"));
    await upsert(token, data);
  }
  console.log("[seed-legal-pages] Done.");
};

run().catch((e) => {
  console.error("[seed-legal-pages] FAILED:", e.message);
  process.exit(1);
});
