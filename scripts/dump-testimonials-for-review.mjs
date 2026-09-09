#!/usr/bin/env node
/**
 * Dump every testimonial_videos row + its REAL YouTube title to a JSON file
 * for manual review/curation of patient names + quotes.
 *
 * Run: node scripts/dump-testimonials-for-review.mjs
 */
import pg from "pg";
import { writeFileSync } from "fs";

const { Client } = pg;

const DB_URI =
  process.env.DATABASE_URI ??
  "postgresql://postgres.acugkaaiyzbckwafudxa:deepakDigitalAura@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";

const DELAY_MS = 100;
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

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

  const { rows } = await client.query(
    `SELECT id, youtube_id, patient_name, quote, "order" FROM testimonial_videos ORDER BY "order"`
  );

  const out = [];
  for (const row of rows) {
    await sleep(DELAY_MS);
    const title = await fetchYouTubeTitle(row.youtube_id);
    out.push({
      id: row.id,
      youtube_id: row.youtube_id,
      order: row.order,
      current_name: row.patient_name,
      current_quote: row.quote,
      real_title: title,
    });
    console.log(`${row.youtube_id} | ${title}`);
  }

  writeFileSync(
    new URL("./testimonials-review.json", import.meta.url),
    JSON.stringify(out, null, 2)
  );
  console.log(`\nDumped ${out.length} rows to scripts/testimonials-review.json`);

  await client.end();
}

main().catch((err) => { console.error(err); process.exit(1); });
