#!/usr/bin/env node
/* =====================================================================
 * Seed Payload Globals (site-settings, contact-info) via REST (UTF-8 safe).
 * Reads scripts/seed/<slug>.json and POSTs to /api/globals/<slug>.
 * Requires the dev server running + an admin user (same env vars as
 * seed-contact.mjs). Run: node scripts/seed-globals.mjs
 * ===================================================================== */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

const GLOBALS = ["site-settings", "contact-info", "blog-hub", "footer", "header", "homepage"];

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
  for (const slug of GLOBALS) {
    const data = readFileSync(join(__dirname, "seed", `${slug}.json`), "utf8");
    const res = await fetch(`${BASE}/api/globals/${slug}`, { method: "POST", headers: auth, body: data });
    const out = await res.json();
    if (!res.ok) throw new Error(`${slug} failed HTTP ${res.status}: ${JSON.stringify(out)}`);
    console.log(`[seed-globals] updated '${slug}'`);
  }
};

run().catch((e) => {
  console.error("[seed-globals] FAILED:", e.message);
  process.exit(1);
});
