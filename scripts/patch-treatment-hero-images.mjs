#!/usr/bin/env node
/**
 * patch-treatment-hero-images.mjs
 *
 * Updates hero.image and meta.ogImage for 4 treatment pages
 * to point to their dedicated treatment illustrations.
 *
 * Run: node scripts/patch-treatment-hero-images.mjs
 */

const BASE     = process.env.PAYLOAD_URL         ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL    = process.env.SEED_ADMIN_EMAIL     ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD  ?? "Zxcvbnm@123";

const UPDATES = [
  { slug: "ivf-evaluation", image: "/assets/treatments/ivf-evaluation.png" },
  { slug: "era-test",       image: "/assets/treatments/era-test.png" },
  { slug: "pgt",            image: "/assets/treatments/pgt.png" },
  { slug: "surrogacy",      image: "/assets/treatments/surrogacy.png" },
];

const log  = (msg) => console.log(`[patch] ${msg}`);
const wait = (ms)  => new Promise(r => setTimeout(r, ms));

async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const data = await res.json();
  return data.token;
}

async function findTreatment(token, slug) {
  const url = `${BASE}/api/treatments?where[slug][equals]=${slug}&limit=1`;
  const res = await fetch(url, {
    headers: { Authorization: `JWT ${token}` },
  });
  if (!res.ok) throw new Error(`Search failed for ${slug}: ${res.status}`);
  const data = await res.json();
  return data.docs?.[0];
}

async function patchTreatment(token, id, slug, image) {
  const res = await fetch(`${BASE}/api/treatments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({
      hero: { image },
      meta: { ogImage: image },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PATCH ${slug} failed: ${res.status} — ${text}`);
  }
  log(`✓ ${slug} → ${image}`);
}

async function main() {
  log("Logging in…");
  const token = await login();
  log("Logged in.");

  for (const { slug, image } of UPDATES) {
    const doc = await findTreatment(token, slug);
    if (!doc) { log(`✗ ${slug} not found — skipping`); continue; }
    await patchTreatment(token, doc.id, slug, image);
    await wait(500);
  }

  log("Done — all 4 treatments updated.");
}

main().catch(err => { console.error(err); process.exit(1); });
