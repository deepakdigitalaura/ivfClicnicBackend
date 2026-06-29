#!/usr/bin/env node
/**
 * Merge egg-freezing, sperm-freezing, embryo-freezing into cryopreservation.
 *
 * 1. Delete the 3 individual treatment records from the CMS.
 * 2. Update cryopreservation's `related` array (remove the 3 slugs).
 * 3. Clean up `related` arrays in every other treatment that referenced them.
 *
 * Run:  PAYLOAD_URL=https://ivfclinic.vercel.app node scripts/patch-merge-cryopreservation.mjs
 */

const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

const REMOVE_SLUGS = ["embryo-freezing", "sperm-freezing", "egg-freezing"];

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

  // Step 1: Delete the 3 treatment records
  for (const slug of REMOVE_SLUGS) {
    const findRes = await fetch(
      `${BASE}/api/treatments?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=0`,
      { headers: auth },
    );
    const found = await findRes.json();
    const existing = found?.docs?.[0];

    if (existing) {
      const res = await fetch(`${BASE}/api/treatments/${existing.id}`, {
        method: "DELETE",
        headers: auth,
      });
      if (!res.ok) throw new Error(`Failed to delete ${slug}: HTTP ${res.status}`);
      console.log(`Deleted: ${slug}`);
    } else {
      console.log(`Not found (already deleted?): ${slug}`);
    }
  }

  // Step 2 & 3: Clean up related arrays in ALL remaining treatments
  const allRes = await fetch(
    `${BASE}/api/treatments?limit=500&depth=0`,
    { headers: auth },
  );
  const allData = await allRes.json();

  for (const doc of allData.docs) {
    if (!doc.related || !Array.isArray(doc.related)) continue;

    const originalSlugs = doc.related.map((r) =>
      typeof r === "string" ? r : r.slug,
    );
    const cleaned = originalSlugs.filter((s) => !REMOVE_SLUGS.includes(s));

    if (cleaned.length !== originalSlugs.length) {
      const patchRes = await fetch(`${BASE}/api/treatments/${doc.id}`, {
        method: "PATCH",
        headers: auth,
        body: JSON.stringify({
          related: cleaned.map((slug) => ({ slug })),
        }),
      });
      if (!patchRes.ok) {
        console.error(`Failed to patch related for ${doc.slug}: HTTP ${patchRes.status}`);
      } else {
        console.log(`Cleaned related for: ${doc.slug} (removed ${originalSlugs.length - cleaned.length} refs)`);
      }
    }
  }

  console.log("\nDone. Cryopreservation now covers all fertility preservation freezing.");
};

run().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
