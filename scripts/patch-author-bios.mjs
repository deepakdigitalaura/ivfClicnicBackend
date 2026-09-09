#!/usr/bin/env node
/* =====================================================================
 * patch-author-bios.mjs
 *
 * Updates Dr. Parth Bavishi + Dr. Himanshu Bavishi author records in
 * production with correct credentials, role, and full bio text.
 *
 * Uses REST API only — safe to run against production.
 *
 * Run:
 *   PAYLOAD_URL=https://ivfclinic.com \
 *   SEED_ADMIN_EMAIL=... \
 *   SEED_ADMIN_PASSWORD=... \
 *   node scripts/patch-author-bios.mjs
 * ===================================================================== */

const BASE     = process.env.PAYLOAD_URL        ?? "http://localhost:3000";
const EMAIL    = process.env.SEED_ADMIN_EMAIL    ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

const log = (msg) => console.log(`[patch-author-bios] ${msg}`);

/* ── Dr. Parth Bavishi — full detailed bio ─────────────────────────── */
const PARTH_DATA = {
  credentials: "MBBS, MD (Obstetrics & Gynaecology)",
  role: "Co-director & IVF Specialist",
  bio: `Dr. Parth Bavishi holds an MD in Obstetrics and Gynaecology and brings over 12 years of specialist experience as Co-director and IVF Specialist at Bavishi Fertility Institute — a group of fertility centres across India committed to helping couples realise their dream of parenthood.

His clinical focus is on complex and challenging cases: male-factor infertility, poor sperm quality, high sperm DNA fragmentation, and repeated IVF failure. He has received specialised infertility training at three internationally recognised institutions — Bavishi Fertility Institute, the Diamond Institute (USA), and the HART Institute (Japan) — giving him a uniquely broad perspective on the latest global advances in reproductive medicine.

Dr. Bavishi is the author of 'Your Miracle in Making: A Couple's Guide to Pregnancy,' an acclaimed book that offers practical, compassionate guidance to couples navigating the emotional and medical complexities of fertility treatment. His philosophy is rooted in patient empowerment: he believes that informed patients make better decisions, and he is committed to education both in the clinic and through public awareness.

His outstanding contributions to the field of reproductive medicine have been recognised with the prestigious Rose of Paracelsus Award from the European Medical Association. He is a regular invited faculty member at national and international conferences, sharing expertise on advanced reproductive techniques and male infertility.

Under his leadership, Bavishi Fertility Institute is dedicated to treatments that are simple, safe, smart, and successful — blending clinical excellence with the personalised, compassionate care that every patient deserves.`,
};

/* ── Dr. Himanshu Bavishi ──────────────────────────────────────────── */
const HIMANSHU_DATA = {
  credentials: "MBBS, MD (Obstetrics & Gynaecology), DNB",
  role: "Director & IVF Specialist",
};

async function main() {
  log(`Connecting to ${BASE} ...`);

  /* ── Login ─────────────────────────────────────────────────────── */
  const loginRes = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!loginRes.ok) {
    const err = await loginRes.text();
    throw new Error(`Login failed HTTP ${loginRes.status}: ${err}`);
  }
  const { token } = await loginRes.json();
  log("Login OK");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
  };

  /* ── Find authors by name ──────────────────────────────────────── */
  const authorsRes = await fetch(`${BASE}/api/authors?limit=50&depth=0`, { headers });
  const authorsData = await authorsRes.json();
  const authors = authorsData.docs ?? [];

  log(`Authors in this DB:`);
  authors.forEach(a => log(`  ID ${a.id}  →  ${a.name}`));

  const parth    = authors.find(a => a.name === "Dr. Parth Bavishi");
  const himanshu = authors.find(a => a.name === "Dr. Himanshu Bavishi");

  if (!parth)    throw new Error('Author "Dr. Parth Bavishi" not found');
  if (!himanshu) throw new Error('Author "Dr. Himanshu Bavishi" not found');

  /* ── Patch Dr. Parth Bavishi ───────────────────────────────────── */
  log(`\nPatching Dr. Parth Bavishi (ID ${parth.id})…`);
  const parthRes = await fetch(`${BASE}/api/authors/${parth.id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(PARTH_DATA),
  });
  if (!parthRes.ok) {
    const err = await parthRes.text();
    throw new Error(`PATCH Dr. Parth failed HTTP ${parthRes.status}: ${err}`);
  }
  log(`✅  Dr. Parth Bavishi bio + credentials updated.`);

  /* ── Patch Dr. Himanshu Bavishi ────────────────────────────────── */
  log(`\nPatching Dr. Himanshu Bavishi (ID ${himanshu.id})…`);
  const himanshuRes = await fetch(`${BASE}/api/authors/${himanshu.id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(HIMANSHU_DATA),
  });
  if (!himanshuRes.ok) {
    const err = await himanshuRes.text();
    throw new Error(`PATCH Dr. Himanshu failed HTTP ${himanshuRes.status}: ${err}`);
  }
  log(`✅  Dr. Himanshu Bavishi credentials updated.`);

  log(`\n🎉  Done! Both author records patched.`);
}

main().catch(err => {
  console.error(`[patch-author-bios] FAILED:`, err.message);
  process.exit(1);
});
