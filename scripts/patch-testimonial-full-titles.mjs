#!/usr/bin/env node
/**
 * Set patientName = FULL YouTube video title for every row in testimonial_videos.
 * No name-extraction or regex — just the raw title from oEmbed, unchanged.
 *
 * Run: node scripts/patch-testimonial-full-titles.mjs
 */
import pg from "pg";

const { Client } = pg;

const DB_URI =
  process.env.DATABASE_URI ??
  "postgresql://postgres.acugkaaiyzbckwafudxa:deepakDigitalAura@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";

const DELAY_MS = 150;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchYouTubeTitle(videoId) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; title-fixer/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.title ?? null;
  } catch {
    return null;
  }
}

async function main() {
  const client = new Client({ connectionString: DB_URI, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("Connected to production DB.\n");

  const { rows } = await client.query(
    `SELECT id, youtube_id, patient_name FROM testimonial_videos ORDER BY "order"`
  );
  console.log(`Found ${rows.length} testimonial_videos rows.\n`);

  let updated = 0;
  let unchanged = 0;
  let failed = 0;

  for (const row of rows) {
    const { id, youtube_id, patient_name } = row;
    await sleep(DELAY_MS);

    const title = await fetchYouTubeTitle(youtube_id);

    if (!title) {
      console.log(`[SKIP] ${youtube_id} — video unavailable or private`);
      failed++;
      continue;
    }

    if (title === patient_name) {
      console.log(`[OK]   ${youtube_id} — already correct`);
      unchanged++;
      continue;
    }

    console.log(`[UPDATE] ${youtube_id}`);
    console.log(`  old: ${patient_name}`);
    console.log(`  new: ${title}\n`);

    await client.query(
      `UPDATE testimonial_videos SET patient_name = $1, updated_at = NOW() WHERE id = $2`,
      [title, id]
    );
    updated++;
  }

  console.log(`\nDone.`);
  console.log(`  Updated  : ${updated}`);
  console.log(`  Unchanged: ${unchanged}`);
  console.log(`  Failed   : ${failed}`);

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
