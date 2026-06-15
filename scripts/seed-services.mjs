#!/usr/bin/env node
/* =====================================================================
 * Seed the `services` collection via REST (UTF-8 safe) from the generated
 * fixture scripts/seed/services.json (run `npm run seed:services:gen` first to
 * (re)derive it from the code defaults). Upserts by slug — idempotent.
 * Requires the dev/prod server running + an admin user (same env vars as
 * seed-globals.mjs). Run: npm run seed:services
 * ===================================================================== */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

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
  const docs = JSON.parse(readFileSync(join(__dirname, "seed", "services.json"), "utf8"));

  for (const doc of docs) {
    const body = JSON.stringify(doc);
    // Find an existing doc by slug (idempotent upsert).
    const findRes = await fetch(
      `${BASE}/api/services?where[slug][equals]=${encodeURIComponent(doc.slug)}&limit=1&depth=0`,
      { headers: auth },
    );
    const found = await findRes.json();
    const existing = found?.docs?.[0];

    const res = existing
      ? await fetch(`${BASE}/api/services/${existing.id}`, { method: "PATCH", headers: auth, body })
      : await fetch(`${BASE}/api/services`, { method: "POST", headers: auth, body });

    const out = await res.json();
    if (!res.ok) throw new Error(`${doc.slug} failed HTTP ${res.status}: ${JSON.stringify(out)}`);
    console.log(`[seed-services] ${existing ? "updated" : "created"} '${doc.slug}'`);
  }
};

run().catch((e) => {
  console.error("[seed-services] FAILED:", e.message);
  process.exit(1);
});
