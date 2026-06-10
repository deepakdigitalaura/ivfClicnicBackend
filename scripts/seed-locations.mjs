#!/usr/bin/env node
/* =====================================================================
 * Seed the `cities` + `centres` collections via REST (UTF-8 safe) from the
 * generated fixtures scripts/seed/cities.json + scripts/seed/centres.json
 * (run `npm run seed:locations:gen` first to (re)derive them from the code
 * defaults). Upserts cities by slug and centres by the (citySlug, slug)
 * compound key — idempotent. Requires the dev/prod server running + an admin
 * user (same env vars as seed-treatments.mjs). Run: npm run seed:locations
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

  const cities = JSON.parse(readFileSync(join(__dirname, "seed", "cities.json"), "utf8"));
  const centres = JSON.parse(readFileSync(join(__dirname, "seed", "centres.json"), "utf8"));

  // ---- Cities (upsert by slug) ----
  for (const doc of cities) {
    const body = JSON.stringify(doc);
    const findRes = await fetch(
      `${BASE}/api/cities?where[slug][equals]=${encodeURIComponent(doc.slug)}&limit=1&depth=0`,
      { headers: auth },
    );
    const found = await findRes.json();
    const existing = found?.docs?.[0];
    const res = existing
      ? await fetch(`${BASE}/api/cities/${existing.id}`, { method: "PATCH", headers: auth, body })
      : await fetch(`${BASE}/api/cities`, { method: "POST", headers: auth, body });
    const out = await res.json();
    if (!res.ok) throw new Error(`city '${doc.slug}' failed HTTP ${res.status}: ${JSON.stringify(out)}`);
    console.log(`[seed-locations] city ${existing ? "updated" : "created"} '${doc.slug}'`);
  }

  // ---- Centres (upsert by citySlug + slug compound) ----
  for (const doc of centres) {
    const body = JSON.stringify(doc);
    const findRes = await fetch(
      `${BASE}/api/centres?where[and][0][citySlug][equals]=${encodeURIComponent(doc.citySlug)}&where[and][1][slug][equals]=${encodeURIComponent(doc.slug)}&limit=1&depth=0`,
      { headers: auth },
    );
    const found = await findRes.json();
    const existing = found?.docs?.[0];
    const res = existing
      ? await fetch(`${BASE}/api/centres/${existing.id}`, { method: "PATCH", headers: auth, body })
      : await fetch(`${BASE}/api/centres`, { method: "POST", headers: auth, body });
    const out = await res.json();
    if (!res.ok) throw new Error(`centre '${doc.citySlug}/${doc.slug}' failed HTTP ${res.status}: ${JSON.stringify(out)}`);
    console.log(`[seed-locations] centre ${existing ? "updated" : "created"} '${doc.citySlug}/${doc.slug}'`);
  }

  console.log(`[seed-locations] done — ${cities.length} cities + ${centres.length} centres upserted.`);
};

run().catch((e) => {
  console.error("[seed-locations] FAILED:", e.message);
  process.exit(1);
});
