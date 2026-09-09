/* =====================================================================
 * One-time migration: old Payload `testimonial_videos` Postgres table -> the
 * existing Sanity `testimonial` document type (youtubeId populated marks a
 * doc as a video testimonial — see src/sanity/schemas/testimonial.ts).
 *
 * Idempotent: each doc gets a deterministic _id derived from the Postgres
 * row id, so re-running this script upserts rather than duplicates.
 *
 * Run:
 *   PG_URI=... SANITY_API_TOKEN=... NEXT_PUBLIC_SANITY_PROJECT_ID=... NEXT_PUBLIC_SANITY_DATASET=... \
 *     npx tsx --tsconfig tsconfig.json scripts/migrate-testimonial-videos.mts [--dry-run]
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
    `SELECT id, patient_name, rating, youtube_id, quote, published, "order" FROM testimonial_videos ORDER BY id`,
  );
  console.log(`Read ${rows.length} rows from testimonial_videos.`);

  let written = 0;
  let skipped = 0;
  const failed: number[] = [];

  for (const row of rows) {
    if (!row.youtube_id || !row.patient_name || !row.quote) {
      console.warn(`[skip] id=${row.id} missing required field(s)`);
      skipped++;
      continue;
    }
    const doc = {
      _id: `testimonialVideo-pg-${row.id}`,
      _type: "testimonial",
      author: row.patient_name,
      quote: row.quote,
      rating: row.rating ?? 5,
      youtubeId: row.youtube_id,
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
