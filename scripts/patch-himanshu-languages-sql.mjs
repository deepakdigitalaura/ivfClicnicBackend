#!/usr/bin/env node
/* Directly patch Dr. Himanshu Bavishi's languages in the Payload Postgres DB.
 * Run: node scripts/patch-himanshu-languages-sql.mjs
 * Requires local Postgres to be running (scripts\pg-local.ps1 start). */
import pg from "pg";

const DB = process.env.DATABASE_URI ?? "postgresql://postgres:payload_local_pw@127.0.0.1:5433/bfi_payload";
const client = new pg.Client({ connectionString: DB });
await client.connect();

// Payload stores array fields as JSON in the doctors table. The languages
// array is stored in a separate relationship table: doctors_languages.
// Let's first find the doctor's id.
const docRes = await client.query(`SELECT id FROM doctors WHERE slug = 'himanshu-bavishi'`);
if (!docRes.rows.length) throw new Error("himanshu-bavishi not found in doctors table");
const docId = docRes.rows[0].id;
console.log(`Found doctor id: ${docId}`);

// Check current languages
const curRes = await client.query(
  `SELECT * FROM doctors_languages WHERE _parent_id = $1 ORDER BY _order`,
  [docId],
);
console.log("Current languages:", curRes.rows.map(r => r.value));

// Check if Marathi already exists
const exists = curRes.rows.some(r => r.value === "Marathi");
if (exists) {
  console.log("Marathi already present — nothing to do.");
  await client.end();
  process.exit(0);
}

// Insert Marathi as next in order
const nextOrder = curRes.rows.length + 1;
await client.query(
  `INSERT INTO doctors_languages (_order, _parent_id, id, value) VALUES ($1, $2, gen_random_uuid(), $3)`,
  [nextOrder, docId, "Marathi"],
);

// Bump updatedAt on the doctor record to trigger cache invalidation
await client.query(`UPDATE doctors SET updated_at = NOW() WHERE id = $1`, [docId]);

const verRes = await client.query(
  `SELECT value FROM doctors_languages WHERE _parent_id = $1 ORDER BY _order`,
  [docId],
);
console.log("Updated languages:", verRes.rows.map(r => r.value));
await client.end();
console.log("Done.");
