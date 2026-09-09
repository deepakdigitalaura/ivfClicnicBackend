#!/usr/bin/env node
/* =====================================================================
 * Remove the "Tools" column from the Resources mega-menu in the header.
 * Deletes the column row — cascade removes its items automatically.
 *
 * Run:  node scripts/patch-remove-tools-nav.mjs
 * ===================================================================== */
import pg from "pg";
const { Client } = pg;

const DB_URI =
  process.env.DATABASE_URI ??
  "postgresql://postgres.acugkaaiyzbckwafudxa:deepakDigitalAura@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";

const client = new Client({ connectionString: DB_URI, ssl: { rejectUnauthorized: false } });
await client.connect();

// Find the Resources nav item
const navRes = await client.query(
  `SELECT id FROM header_nav_items WHERE label = 'Resources' LIMIT 1`,
);
if (!navRes.rows.length) {
  console.log("[patch] No 'Resources' nav item found — nothing to do.");
  await client.end();
  process.exit(0);
}
const resourcesNavId = navRes.rows[0].id;
console.log(`[patch] Found Resources nav item id=${resourcesNavId}`);

// Delete the Tools column (cascade removes its items)
const del = await client.query(
  `DELETE FROM header_nav_items_columns WHERE _parent_id = $1 AND heading = 'Tools' RETURNING id`,
  [resourcesNavId],
);
if (del.rowCount === 0) {
  console.log("[patch] No 'Tools' column found — already removed or never existed.");
} else {
  console.log(`[patch] Deleted Tools column (id=${del.rows[0].id}) + its items.`);
}

// Show remaining columns for Resources
const cols = await client.query(
  `SELECT id, heading FROM header_nav_items_columns WHERE _parent_id = $1 ORDER BY _order`,
  [resourcesNavId],
);
console.log("[patch] Remaining Resources columns:", cols.rows.map((r) => r.heading));

await client.end();
console.log("[patch] Done.");
