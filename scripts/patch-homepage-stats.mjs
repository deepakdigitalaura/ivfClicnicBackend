#!/usr/bin/env node
/* =====================================================================
 * Patch homepage conveyor-belt stats in the Supabase production DB:
 *   1. Fix item 4 label (remove HTML / messy ET text, restore clean label)
 *   2. Add "Best IVF Clinic Chain / Mid-Day" as a new item
 *   3. Add "Best IVF Chain – West / The Economic Times" as a new item
 *
 * Run:  node scripts/patch-homepage-stats.mjs
 * ===================================================================== */
import pg from "pg";
const { Client } = pg;

const DB_URI =
  process.env.DATABASE_URI ??
  "postgresql://postgres.acugkaaiyzbckwafudxa:deepakDigitalAura@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";

const client = new Client({ connectionString: DB_URI, ssl: { rejectUnauthorized: false } });

const rand24 = () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

await client.connect();

// 1. Fix item 4 (the "6× Winner" row) — remove the HTML-stuffed ET label
await client.query(
  `UPDATE homepage_stats
   SET value = '6× Winner', label = 'National Fertility Award'
   WHERE _order = 4 AND _parent_id = 1`,
);
console.log("[patch] Fixed item 4: 6× Winner / National Fertility Award");

// 2. Remove any existing Mid-Day or Economic Times rows (avoid duplicates)
await client.query(
  `DELETE FROM homepage_stats
   WHERE _parent_id = 1 AND (label ILIKE '%mid-day%' OR label ILIKE '%economic times%')`,
);

// 3. Insert Mid-Day award after existing 6 items
await client.query(
  `INSERT INTO homepage_stats (_order, _parent_id, id, value, label)
   VALUES (7, 1, $1, 'Best IVF Clinic Chain', 'Mid-Day')`,
  [rand24()],
);
console.log("[patch] Added: Best IVF Clinic Chain / Mid-Day");

// 4. Insert Economic Times award
await client.query(
  `INSERT INTO homepage_stats (_order, _parent_id, id, value, label)
   VALUES (8, 1, $1, 'Best IVF Chain – West', 'The Economic Times')`,
  [rand24()],
);
console.log("[patch] Added: Best IVF Chain – West / The Economic Times");

// Show final state
const rows = await client.query(`SELECT _order, value, label FROM homepage_stats WHERE _parent_id = 1 ORDER BY _order`);
console.log("\n[patch] Final conveyor-belt stats:");
rows.rows.forEach((r) => console.log(`  ${r._order}. ${r.value} / ${r.label}`));

await client.end();
console.log("\n[patch] Done. Redeploy or revalidate the homepage cache to see changes.");
