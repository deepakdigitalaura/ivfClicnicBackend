#!/usr/bin/env node
/* =====================================================================
 * One-time patch: update the "specialists" section heading for the three
 * donor-services treatment pages in the Payload DB so the heading reads
 * "Our Expert Doctors for <Treatment Name>" instead of the old default
 * "Our <Treatment Name> Specialists". Values live in the DB from here on.
 *
 * Run (dev server must be running):
 *   node scripts/patch-donation-specialists-heading.mjs
 * ===================================================================== */

const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

const PATCHES = [
  { slug: "egg-donation",    lead: "Our Expert Doctors for", em: "Egg Donation" },
  { slug: "sperm-donation",  lead: "Our Expert Doctors for", em: "Sperm Donation" },
  { slug: "embryo-donation", lead: "Our Expert Doctors for", em: "Embryo Donation" },
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

const run = async () => {
  const token = await login();
  const auth = { Authorization: `JWT ${token}`, "Content-Type": "application/json" };

  for (const { slug, lead, em } of PATCHES) {
    const findRes = await fetch(
      `${BASE}/api/treatments?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`,
      { headers: auth },
    );
    const found = await findRes.json();
    const existing = found?.docs?.[0];
    if (!existing) {
      console.warn(`[patch] '${slug}' not found in DB — skipping`);
      continue;
    }

    const body = JSON.stringify({
      specialists: {
        ...(existing.specialists ?? {}),
        heading: { lead, em },
      },
    });

    const res = await fetch(`${BASE}/api/treatments/${existing.id}`, {
      method: "PATCH",
      headers: auth,
      body,
    });
    const out = await res.json();
    if (!res.ok) throw new Error(`${slug} failed HTTP ${res.status}: ${JSON.stringify(out)}`);
    console.log(`[patch] '${slug}' specialists heading updated → "${lead} ${em}"`);
  }

  console.log("[patch] done.");
};

run().catch((e) => {
  console.error("[patch] FAILED:", e.message);
  process.exit(1);
});
