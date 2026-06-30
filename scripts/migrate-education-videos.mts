/* =====================================================================
 * One-time migration: old Payload `education_videos` Postgres table ->
 * Sanity `educationVideo` documents.
 *
 * Idempotent: each doc gets a deterministic _id from the Postgres row id.
 *
 * Run:
 *   PG_URI=... SANITY_API_TOKEN=... NEXT_PUBLIC_SANITY_PROJECT_ID=... NEXT_PUBLIC_SANITY_DATASET=... \
 *     npx tsx --tsconfig tsconfig.json scripts/migrate-education-videos.mts [--dry-run]
 * ===================================================================== */
import { Client } from "pg";
import { createClient } from "next-sanity";

const DRY_RUN = process.argv.includes("--dry-run");

const PG_URI = process.env.PG_URI;
if (!PG_URI) throw new Error("PG_URI env var is required");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !dataset || !token) {
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN are required");
}

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const pg = new Client({ connectionString: PG_URI, ssl: { rejectUnauthorized: false } });
  await pg.connect();

  const { rows } = await pg.query(
    `SELECT id, title, category, youtube_id, description, published, "order" FROM education_videos ORDER BY id`,
  );
  console.log(`Read ${rows.length} rows from education_videos.`);

  let written = 0;
  let skipped = 0;
  const failed: number[] = [];

  for (const row of rows) {
    if (!row.youtube_id || !row.title) {
      console.warn(`[skip] id=${row.id} missing required field(s)`);
      skipped++;
      continue;
    }
    const doc = {
      _id: `educationVideo-pg-${row.id}`,
      _type: "educationVideo",
      title: row.title,
      category: row.category ?? "General",
      youtubeId: row.youtube_id,
      description: row.description ?? null,
      published: row.published ?? true,
      order: row.order ?? 0,
    };

    if (DRY_RUN) {
      console.log("[dry-run]", JSON.stringify(doc));
      written++;
      continue;
    }

    try {
      await sanity.createOrReplace(doc);
      written++;
      console.log(`[ok] id=${row.id} -> ${doc._id}`);
    } catch (e) {
      console.error(`[fail] id=${row.id}:`, (e as Error).message);
      failed.push(row.id);
    }
    await sleep(150);
  }

  await pg.end();
  console.log(`\nDone. read=${rows.length} written=${written} skipped=${skipped} failed=${failed.length}`);
  if (failed.length) console.log("Failed ids:", failed.join(", "));
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
