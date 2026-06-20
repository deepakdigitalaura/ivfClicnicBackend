#!/usr/bin/env node
/* =====================================================================
 * Patch homepage conveyor-belt stats in the Supabase production DB.
 * Replaces all stats rows with the correct set.
 *
 * Run:  node scripts/patch-homepage-stats.mjs
 * ===================================================================== */
import pg from "pg";
const { Client } = pg;

const DB_URI =
  process.env.DATABASE_URI ??
  "postgresql://postgres.acugkaaiyzbckwafudxa:deepakDigitalAura@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";

const STATS = [
  { value: "30,000+",                    label: "Happy Couples" },
  { value: "25+",                        label: "Years Legacy" },
  { value: "14",                         label: "Fertility Centres" },
  { value: "6× Winner",                  label: "Best IVF Chain in India (West)" },
  { value: "Best IVF Clinic Chain in India", label: "Mid-Day" },
  { value: "Rank #1",                    label: "All India Ahmedabad Institute" },
  { value: "500+",                       label: "International Patients Per Year" },
];

const rand24 = () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

const client = new Client({ connectionString: DB_URI, ssl: { rejectUnauthorized: false } });
await client.connect();

// Delete all existing stats rows
await client.query(`DELETE FROM homepage_stats WHERE _parent_id = 1`);
console.log("[patch] Cleared old stats rows.");

// Insert new rows
for (let i = 0; i < STATS.length; i++) {
  const s = STATS[i];
  await client.query(
    `INSERT INTO homepage_stats (_order, _parent_id, id, value, label) VALUES ($1, 1, $2, $3, $4)`,
    [i + 1, rand24(), s.value, s.label],
  );
}
console.log(`[patch] Inserted ${STATS.length} stats rows.`);

// Fix hero floating badge
await client.query(`UPDATE homepage SET hero_floating_badge = 'National Fertility Award · 6× Winner' WHERE id = 1`);

// Show final state
const rows = await client.query(`SELECT _order, value, label FROM homepage_stats WHERE _parent_id = 1 ORDER BY _order`);
console.log("\n[patch] Final conveyor-belt stats:");
rows.rows.forEach((r) => console.log(`  ${r._order}. ${r.value} / ${r.label}`));

await client.end();
console.log("\n[patch] Done.");
