#!/usr/bin/env node
/**
 * patch-cme-hero-fixes.mjs
 *
 * Replaces two bad CME hero images on production:
 *  - Blog 24 (East Ahmedabad): current hero is a ceiling shot (462) → real landscape group photo
 *  - Blog 23 (FOGSI Ahmedabad): generic banner (195) → generic CME audience photo
 *
 * Bharuch / Himanshu / Falguni need NO source change — their faces are fixed
 * by the object-[center_35%] crop bias in blog-article.tsx.
 *
 * Run: node scripts/patch-cme-hero-fixes.mjs
 */

const BASE     = process.env.PAYLOAD_URL         ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL    = process.env.SEED_ADMIN_EMAIL    ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "Zxcvbnm@123";

const log  = (m) => console.log(`[hero-fix] ${m}`);
const wait = (ms) => new Promise(r => setTimeout(r, ms));

const FIXES = [
  {
    payloadId: 24,
    category: 22,
    wpUrl: "https://ivfclinic.com/wp-content/uploads/2026/02/IMG_2100.JPG-1-scaled.jpeg",
    filename: "cme-east-ahmedabad-group.jpeg",
    alt: "Bavishi Fertility Institute joint educational CME with East Ahmedabad Gynaecologist Association — group of attending doctors",
  },
  {
    payloadId: 23,
    category: 22,
    wpUrl: "https://ivfclinic.com/wp-content/uploads/2026/02/FOR_3140-Copy.jpg",
    filename: "cme-fogsi-ahmedabad-audience.jpg",
    alt: "Bavishi Fertility Institute FOGSI-recognized training programme in Ahmedabad — gynaecologists attending the CME session",
  },
];

async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed ${res.status}: ${await res.text()}`);
  const { token } = await res.json();
  return { Authorization: `JWT ${token}` };
}

async function uploadImage(fix, auth) {
  log(`  Downloading ${fix.wpUrl}`);
  const dl = await fetch(fix.wpUrl);
  if (!dl.ok) throw new Error(`Download failed ${dl.status}`);
  const blob = await dl.blob();
  log(`  Downloaded ${(blob.size / 1024 | 0)} KB`);

  const form = new FormData();
  form.append("file", blob, fix.filename);
  form.append("_payload", JSON.stringify({ alt: fix.alt }));

  const up = await fetch(`${BASE}/api/media`, { method: "POST", headers: auth, body: form });
  if (!up.ok) throw new Error(`Upload failed: ${await up.text()}`);
  const data = await up.json();
  const id = data.doc?.id ?? data.id;
  if (!id) throw new Error("No media ID returned");
  log(`  Uploaded → Media ID ${id}`);
  return id;
}

async function patchBlog(id, payload, auth) {
  const res = await fetch(`${BASE}/api/blogs/${id}`, {
    method: "PATCH",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`PATCH ${id}: ${await res.text()}`);
  return res.json();
}

async function run() {
  log(`Connecting to ${BASE} …`);
  const auth = await login();
  log("Login OK\n");

  for (const fix of FIXES) {
    log(`Blog ${fix.payloadId}:`);
    const mediaId = await uploadImage(fix, auth);
    await wait(500);
    await patchBlog(fix.payloadId, {
      heroImage: mediaId,
      category: fix.category,
      _status: "published",
    }, auth);
    log(`  ✅ hero → Media ID ${mediaId}\n`);
    await wait(500);
  }

  log("Done.");
}

run().catch(err => { console.error("[hero-fix] FATAL:", err.message); process.exit(1); });
