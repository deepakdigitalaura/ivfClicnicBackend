#!/usr/bin/env node
/* Patch: add Simple/Safe/Smart/Successful page links to about-page CMS content */
import pg from "pg";
const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URI ?? "postgresql://postgres.acugkaaiyzbckwafudxa:deepakDigitalAura@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false }
});
await client.connect();
console.log("[patch] Connected.\n");

const ssss = (text) => text
  .replace(/Simple,\s*Safe,\s*Smart\s+and\s+Successful/g,
    '<a href="/simple-treatment" style="color:var(--plum)">Simple</a>, <a href="/safe-treatment" style="color:var(--plum)">Safe</a>, <a href="/smart-treatment" style="color:var(--plum)">Smart</a> and <a href="/success-benchmarks" style="color:var(--plum)">Successful</a>')
  .replace(/simple,\s*safe,\s*smart\s+and\s+successful/g,
    '<a href="/simple-treatment" style="color:var(--plum)">simple</a>, <a href="/safe-treatment" style="color:var(--plum)">safe</a>, <a href="/smart-treatment" style="color:var(--plum)">smart</a> and <a href="/success-benchmarks" style="color:var(--plum)">successful</a>');

// 1. Hero paragraph
const hero = await client.query("SELECT hero_paragraph FROM about_page WHERE id = 1");
let hp = hero.rows[0]?.hero_paragraph ?? "";
if (hp.includes("Simple") && !hp.includes("/simple-treatment")) {
  hp = ssss(hp);
  await client.query("UPDATE about_page SET hero_paragraph = $1, updated_at = NOW() WHERE id = 1", [hp]);
  console.log("[patch] hero_paragraph — SSSS links added");
} else {
  console.log("[patch] hero_paragraph — already done or empty");
}

// 2. Story paragraphs
const sp = await client.query("SELECT id, _order, value FROM about_page_story_paragraphs WHERE _parent_id = 1 ORDER BY _order");
for (const row of sp.rows) {
  if (!row.value || row.value.includes("/simple-treatment")) continue;
  const nv = ssss(row.value);
  if (nv !== row.value) {
    await client.query("UPDATE about_page_story_paragraphs SET value = $1 WHERE id = $2", [nv, row.id]);
    console.log(`[patch] story paragraph ${row._order} — SSSS links added`);
  }
}

// 3. Trust pillars
const tp = await client.query("SELECT id, icon, d FROM about_page_trust_pillars WHERE _parent_id = 1 ORDER BY _order");
for (const row of tp.rows) {
  if (!row.d || row.d.includes("/simple-treatment")) continue;
  const nv = ssss(row.d);
  if (nv !== row.d) {
    await client.query("UPDATE about_page_trust_pillars SET d = $1 WHERE id = $2", [nv, row.id]);
    console.log(`[patch] trust pillar ${row.icon} — SSSS links added`);
  }
}

// Verify
const vHero = await client.query("SELECT hero_paragraph FROM about_page WHERE id = 1");
console.log(`\n[verify] hero has SSSS links: ${(vHero.rows[0]?.hero_paragraph ?? "").includes("/simple-treatment")}`);
const vSp = await client.query("SELECT _order FROM about_page_story_paragraphs WHERE _parent_id = 1 AND value LIKE '%/simple-treatment%'");
console.log(`[verify] story paragraphs with SSSS links: ${vSp.rows.map(r => r._order).join(", ") || "none"}`);
const vTp = await client.query("SELECT icon FROM about_page_trust_pillars WHERE _parent_id = 1 AND d LIKE '%/simple-treatment%'");
console.log(`[verify] trust pillars with SSSS links: ${vTp.rows.map(r => r.icon).join(", ") || "none"}`);

await client.end();
console.log("\n[patch] Done.");
