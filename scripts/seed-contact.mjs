#!/usr/bin/env node
/* =====================================================================
 * Seed / update the Contact page via Payload's REST API (UTF-8 safe).
 * ---------------------------------------------------------------------
 * Reads scripts/seed/contact.json and upserts it by slug. Uses Node's
 * global fetch with a raw UTF-8 body, so em dashes etc. are preserved
 * (PowerShell string encoding mangles them; this avoids that).
 *
 * Requires the dev server running and an admin user. Configure via env:
 *   PAYLOAD_URL        (default http://localhost:3000)
 *   SEED_ADMIN_EMAIL   (default admin@bfi.local)
 *   SEED_ADMIN_PASSWORD(default BfiPayload!2026)
 * Run: node scripts/seed-contact.mjs
 * ===================================================================== */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

const data = JSON.parse(readFileSync(join(__dirname, "seed", "contact.json"), "utf8"));

const login = async () => {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`login failed: HTTP ${res.status}`);
  return (await res.json()).token;
};

const run = async () => {
  const token = await login();
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
  if (!res.ok) throw new Error(`upsert failed HTTP ${res.status}: ${JSON.stringify(out)}`);
  console.log(`[seed-contact] ${found.docs?.length ? "updated" : "created"} '${data.slug}' (id=${out.doc?.id})`);
};

run().catch((e) => {
  console.error("[seed-contact] FAILED:", e.message);
  process.exit(1);
});
