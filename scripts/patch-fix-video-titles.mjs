#!/usr/bin/env node
/**
 * Fetch correct UTF-8 titles for all education_videos + testimonial_videos from
 * YouTube oEmbed (no API key needed) and update the production DB.
 *
 * Root cause: bfi_all_channel.txt was generated with wrong encoding on Windows,
 * turning Hindi Devanagari chars into literal '?' and smart-quotes into U+FFFD.
 * This script fixes the DB directly without needing to re-run yt-dlp.
 *
 * Run: node scripts/patch-fix-video-titles.mjs
 */
import pg from "pg";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const DB_URI =
  process.env.DATABASE_URI ??
  "postgresql://postgres.acugkaaiyzbckwafudxa:deepakDigitalAura@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";

const DELAY_MS = 120; // ms between YouTube requests — polite rate limit

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Fetch a single video title from YouTube oEmbed.
 * Returns null if the video is unavailable/private.
 */
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

/** True if a title looks corrupted — contains '?' standing in for non-ASCII. */
function looksCorrupted(title) {
  if (!title) return true;
  // Literal ? that replaced a non-ASCII char: appears at start or surrounded by spaces
  if (/^\?\s/.test(title)) return true;
  // Unicode replacement char U+FFFD (shows as ? in some terminals)
  if (title.includes("�")) return true;
  // Garbled sequences of spaces/? with no real words
  if (/^[\s?]+$/.test(title)) return true;
  return false;
}

async function main() {
  const client = new Client({ connectionString: DB_URI, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("Connected to production DB.\n");

  // ── 1. Fetch all rows from both tables ──
  const { rows: eduRows } = await client.query(
    `SELECT id, youtube_id, title FROM education_videos ORDER BY "order"`
  );
  const { rows: testRows } = await client.query(
    `SELECT id, youtube_id, patient_name FROM testimonial_videos ORDER BY "order"`
  );

  console.log(`education_videos:  ${eduRows.length} rows`);
  console.log(`testimonial_videos: ${testRows.length} rows\n`);

  // ── 2. Education videos — fix all titles ──
  console.log("=== Fixing education_videos titles ===");
  let eduFixed = 0;
  let eduSkipped = 0;
  let eduFailed = 0;

  // Also build corrected data for the JSON file
  const eduJson = JSON.parse(
    readFileSync(join(__dirname, "bfi_education.json"), "utf8")
  );
  const eduJsonById = Object.fromEntries(eduJson.map((v) => [v.id, v]));

  for (const row of eduRows) {
    const { id, youtube_id, title } = row;
    await sleep(DELAY_MS);
    const fetched = await fetchYouTubeTitle(youtube_id);

    if (!fetched) {
      console.log(`  [SKIP/404] ${youtube_id} — video unavailable`);
      eduFailed++;
      continue;
    }

    if (fetched === title && !looksCorrupted(title)) {
      eduSkipped++;
      continue;
    }

    console.log(`  [FIX] ${youtube_id}`);
    console.log(`    old: ${title}`);
    console.log(`    new: ${fetched}`);

    await client.query(
      `UPDATE education_videos SET title = $1, updated_at = NOW() WHERE id = $2`,
      [fetched, id]
    );
    eduFixed++;

    // Update JSON too
    if (eduJsonById[youtube_id]) {
      eduJsonById[youtube_id].title = fetched;
    }
  }

  console.log(`\neducation_videos: ${eduFixed} fixed, ${eduSkipped} unchanged, ${eduFailed} unavailable\n`);

  // ── 3. Testimonial videos — fix patient_name when it's clearly a corrupted title ──
  // (patient_name is derived from the YouTube title in parseTestimonial — not the
  //  raw title itself — but many ended up as '?' or garbled text)
  console.log("=== Checking testimonial_videos patient_name ===");
  let testFixed = 0;
  let testSkipped = 0;
  let testFailed = 0;

  const testJson = JSON.parse(
    readFileSync(join(__dirname, "bfi_testimonials.json"), "utf8")
  );
  const testJsonById = Object.fromEntries(testJson.map((v) => [v.id, v]));

  for (const row of testRows) {
    const { id, youtube_id, patient_name } = row;

    // Only fix rows where patient_name is clearly garbled
    if (!looksCorrupted(patient_name)) {
      testSkipped++;
      continue;
    }

    await sleep(DELAY_MS);
    const fetched = await fetchYouTubeTitle(youtube_id);

    if (!fetched) {
      console.log(`  [SKIP/404] ${youtube_id} — video unavailable`);
      testFailed++;
      continue;
    }

    // Build a clean patient_name from the real title using same logic as patch-seed
    let name = fetched;
    const pipeIdx = fetched.indexOf("|");
    if (pipeIdx > 0) name = fetched.slice(0, pipeIdx).trim();

    name = name
      .replace(/\s*testimonial\s*$/i, "")
      .replace(/\s*\|.*$/, "")
      .replace(/^(from|feedback\s*from)\s+/i, "")
      .replace(/\s*review.*$/i, "")
      .replace(/\s*at\s*bavishi.*$/i, "")
      .replace(/bavishi\s*fertility\s*institute.*$/i, "")
      .replace(/^fertility\s*treatment\s*testimonial\s*(by\s*)?/i, "")
      .replace(/^testimonial\s*(for\s*bavishi\s*fertility\s*institute\s*)?(by\s*patient\s*)?/i, "")
      .replace(/^ahmedabad\s*fertility\s*treatment\s*testimonial\s*from\s*/i, "")
      .trim();

    if (!name || name.length < 2) name = "BFI Patient";

    console.log(`  [FIX] ${youtube_id}`);
    console.log(`    old name: ${patient_name}`);
    console.log(`    new name: ${name}  (from: ${fetched.slice(0, 70)})`);

    await client.query(
      `UPDATE testimonial_videos SET patient_name = $1, updated_at = NOW() WHERE id = $2`,
      [name, id]
    );
    testFixed++;

    if (testJsonById[youtube_id]) {
      testJsonById[youtube_id].title = fetched;
    }
  }

  console.log(`\ntestimonial_videos: ${testFixed} fixed, ${testSkipped} unchanged, ${testFailed} unavailable\n`);

  // ── 4. Save corrected JSON files ──
  const correctedEdu = Object.values(eduJsonById);
  writeFileSync(
    join(__dirname, "bfi_education.json"),
    JSON.stringify(correctedEdu, null, 2)
  );
  const correctedTest = Object.values(testJsonById);
  writeFileSync(
    join(__dirname, "bfi_testimonials.json"),
    JSON.stringify(correctedTest, null, 2)
  );
  console.log("JSON source files updated.");

  await client.end();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
