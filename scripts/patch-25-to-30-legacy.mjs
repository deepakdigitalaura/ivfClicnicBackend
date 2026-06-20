#!/usr/bin/env node
/* =====================================================================
 * Patch live database: 25+ → 30+, "two decades" → "three decades",
 * and fix footer service link labels to UPPERCASE.
 *
 * Run:  node scripts/patch-25-to-30-legacy.mjs
 * ===================================================================== */
import pg from "pg";
const { Client } = pg;

const DB_URI =
  process.env.DATABASE_URI ??
  "postgresql://postgres.acugkaaiyzbckwafudxa:deepakDigitalAura@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";

const client = new Client({ connectionString: DB_URI, ssl: { rejectUnauthorized: false } });
await client.connect();
console.log("[patch] Connected to database.\n");

// ─── 1. HOMEPAGE GLOBAL (already patched — re-run is idempotent) ────
console.log("=== HOMEPAGE ===");

await client.query(`UPDATE homepage SET hero_headline = REPLACE(hero_headline, '25+', '30+') WHERE hero_headline LIKE '%25+%'`);
await client.query(`UPDATE homepage_hero_badges SET text = REPLACE(text, '25+', '30+') WHERE text LIKE '%25+%'`);
await client.query(`UPDATE homepage_stats SET value = '30+' WHERE value = '25+'`);
await client.query(`UPDATE homepage SET about_subtitle = REPLACE(about_subtitle, 'two decades', 'three decades') WHERE about_subtitle LIKE '%two decades%'`);
await client.query(`UPDATE homepage_about_stats SET v = REPLACE(v, '25+', '30+') WHERE v LIKE '%25+%'`);
await client.query(`UPDATE homepage SET seo_meta_title = REPLACE(seo_meta_title, '25+', '30+') WHERE seo_meta_title LIKE '%25+%'`);
await client.query(`UPDATE homepage SET seo_og_description = REPLACE(seo_og_description, '25+', '30+') WHERE seo_og_description LIKE '%25+%'`);
await client.query(`UPDATE homepage_final_cta_stats SET v = 30 WHERE v = 25`);
console.log("[patch] Homepage: 25+→30+, two decades→three decades ✓");

// ─── 2. ABOUT PAGE GLOBAL ──────────────────────────────────────────
console.log("\n=== ABOUT PAGE ===");

await client.query(`UPDATE about_page SET hero_headline = REPLACE(hero_headline, 'two decades', 'three decades') WHERE hero_headline LIKE '%two decades%'`);
console.log("[patch] about_page.hero_headline: two decades → three decades");

await client.query(`UPDATE about_page SET legacy_eyebrow = REPLACE(legacy_eyebrow, '25+', '30+') WHERE legacy_eyebrow LIKE '%25+%'`);
console.log("[patch] about_page.legacy_eyebrow: 25+ → 30+");

await client.query(`UPDATE about_page_trust_pillars SET t = REPLACE(t, '25+', '30+') WHERE t LIKE '%25+%'`);
console.log("[patch] about_page_trust_pillars: 25+ → 30+");

await client.query(`UPDATE about_page_patient_stats SET value = '30+' WHERE value = '25+'`);
console.log("[patch] about_page_patient_stats: 25+ → 30+");

await client.query(`UPDATE about_page SET seo_meta_title = REPLACE(seo_meta_title, '25+', '30+') WHERE seo_meta_title LIKE '%25+%'`);
console.log("[patch] about_page.seo_meta_title: 25+ → 30+");

// ─── 3. CITIES ─────────────────────────────────────────────────────
console.log("\n=== CITIES ===");

await client.query(`UPDATE cities_intro SET value = REPLACE(value, 'two decades', 'three decades') WHERE value LIKE '%two decades%'`);
console.log("[patch] cities_intro: two decades → three decades");

await client.query(`UPDATE cities_faqs SET a = REPLACE(a, 'two decades', 'three decades') WHERE a LIKE '%two decades%'`);
console.log("[patch] cities_faqs: two decades → three decades");

// ─── 4. CENTRES ────────────────────────────────────────────────────
console.log("\n=== CENTRES ===");

await client.query(`UPDATE centres SET intro = REPLACE(intro, 'two decades', 'three decades') WHERE intro LIKE '%two decades%'`);
console.log("[patch] centres.intro: two decades → three decades");

await client.query(`UPDATE centres_faqs SET a = REPLACE(a, 'two decades', 'three decades') WHERE a LIKE '%two decades%'`);
console.log("[patch] centres_faqs: two decades → three decades");

// ─── 5. DOCTORS ─────────────────────────────────────────────────────
console.log("\n=== DOCTORS ===");

await client.query(`UPDATE doctors_bio SET value = REPLACE(value, 'two decades', 'three decades') WHERE value LIKE '%two decades%'`);
console.log("[patch] doctors_bio: two decades → three decades");

// ─── 6. FOOTER — ensure Title Case for maternity service links ──────
console.log("\n=== FOOTER MATERNITY LINKS → Title Case ===");

function toTitleCase(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

const maternityGroupId = await client.query(
  `SELECT id FROM footer_nav_groups WHERE title ILIKE '%maternity%' LIMIT 1`
);
if (maternityGroupId.rows[0]) {
  const links = await client.query(
    `SELECT id, label FROM footer_nav_groups_links WHERE _parent_id = $1`,
    [maternityGroupId.rows[0].id]
  );
  let updated = 0;
  for (const row of links.rows) {
    // Special cases: keep 3D/4D as-is, capitalize first letter of each word
    let proper = toTitleCase(row.label);
    // Preserve "3D/4D" casing
    proper = proper.replace(/3d\/4d/i, "3D/4D");
    if (proper !== row.label) {
      await client.query(`UPDATE footer_nav_groups_links SET label = $1 WHERE id = $2`, [proper, row.id]);
      console.log(`[patch]   "${row.label}" → "${proper}"`);
      updated++;
    }
  }
  console.log(`[patch] ${updated} maternity links updated to Title Case`);
} else {
  console.log("[patch] No maternity group found in footer");
}

// ─── 7. VERIFY ──────────────────────────────────────────────────────
console.log("\n=== VERIFICATION ===");

const hp = await client.query(`SELECT hero_headline, about_subtitle, seo_meta_title, seo_og_description FROM homepage WHERE id = 1`);
if (hp.rows[0]) {
  console.log("[verify] homepage.hero_headline:", hp.rows[0].hero_headline);
  console.log("[verify] homepage.about_subtitle:", hp.rows[0].about_subtitle?.substring(0, 100) + "...");
  console.log("[verify] homepage.seo_meta_title:", hp.rows[0].seo_meta_title);
}

const stats = await client.query(`SELECT value, label FROM homepage_stats WHERE _parent_id = 1 ORDER BY _order`);
console.log("[verify] homepage_stats:", stats.rows.map(r => `${r.value}/${r.label}`).join(" | "));

const ab = await client.query(`SELECT hero_headline, legacy_eyebrow, seo_meta_title FROM about_page WHERE id = 1`);
if (ab.rows[0]) {
  console.log("[verify] about.hero_headline:", ab.rows[0].hero_headline);
  console.log("[verify] about.legacy_eyebrow:", ab.rows[0].legacy_eyebrow);
  console.log("[verify] about.seo_meta_title:", ab.rows[0].seo_meta_title);
}

const fp = await client.query(`SELECT g.title, array_agg(l.label ORDER BY l._order) as labels FROM footer_nav_groups g JOIN footer_nav_groups_links l ON l._parent_id = g.id WHERE g.title ILIKE '%MATERNITY%' GROUP BY g.title`);
if (fp.rows[0]) {
  console.log("[verify] footer maternity:", fp.rows[0].title, "→", fp.rows[0].labels);
}

await client.end();
console.log("\n[patch] Done — all changes applied to live database.");
