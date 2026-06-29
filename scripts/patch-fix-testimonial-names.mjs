#!/usr/bin/env node
/**
 * Re-derive patient_name (and improve quote where possible) for ALL
 * testimonial_videos rows using the REAL YouTube title.
 *
 * Root cause: many BFI testimonial videos have Gujarati/Hindi-only titles
 * with embedded English keywords (IVF, BFI, Review, Success). The original
 * seed's parseTestimonial() ran on a corrupted/garbled version of these
 * titles and silently extracted leftover keyword fragments as "names"
 * (e.g. patient_name = "IVF", "for", "IVF Success" — 39 rows even fell back
 * to the literal default "BFI Patient" placeholder).
 *
 * This script fetches the correct title from YouTube oEmbed for every row,
 * then applies a stricter name extractor that:
 *  - prefers an explicit "Testimonial from X" pattern
 *  - otherwise picks a pipe-separated segment that is dominantly Latin script
 *    and not just a generic keyword (IVF/BFI/Review/Success/Patient/etc.)
 *  - falls back to "BFI Patient" only when no real name can be found
 *
 * Run: node scripts/patch-fix-testimonial-names.mjs
 */
import pg from "pg";

const { Client } = pg;

const DB_URI =
  process.env.DATABASE_URI ??
  "postgresql://postgres.acugkaaiyzbckwafudxa:deepakDigitalAura@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";

const DELAY_MS = 120;
const DEFAULT_QUOTE = "A heartfelt journey shared with Bavishi Fertility Institute.";

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

const GENERIC_STOPWORDS = new Set([
  "ivf", "bfi", "for", "from", "review", "success", "ivf success",
  "story", "ivf success story", "patient", "from patient", "testimonial",
  "happy patient", "bfi patient", "reviews", "bavishi", "fertility",
  "institute", "bavishi fertility institute", "of", "and", "the", "a",
]);

function hasIndicScript(s) {
  return /[ऀ-ॿ઀-૿]/.test(s);
}

function cleanCandidate(s) {
  return s
    .replace(/\s*testimonial\s*$/i, "")
    .replace(/^(from|feedback\s*from)\s+/i, "")
    .replace(/\s*review.*$/i, "")
    .replace(/\s*at\s*bavishi.*$/i, "")
    .replace(/bavishi\s*fertility\s*institute.*$/i, "")
    .replace(/^fertility\s*treatment\s*testimonial\s*(by\s*)?/i, "")
    .replace(/^testimonial\s*(for\s*bavishi\s*fertility\s*institute\s*)?(by\s*patient\s*)?/i, "")
    .replace(/^ahmedabad\s*fertility\s*treatment\s*testimonial\s*from\s*/i, "")
    .trim();
}

function isLikelyName(raw) {
  const s = cleanCandidate(raw);
  if (!s) return false;
  if (hasIndicScript(s)) return false;

  const lower = s.toLowerCase().trim();
  if (GENERIC_STOPWORDS.has(lower)) return false;

  const latinLetters = (s.match(/[A-Za-z]/g) || []).length;
  if (latinLetters < 4) return false;

  // Reject if the ENTIRE string is just a combination of generic stopwords
  const words = lower.split(/\s+/).filter(Boolean);
  if (words.length > 0 && words.every((w) => GENERIC_STOPWORDS.has(w))) return false;

  return true;
}

/** Improved name extraction — prefers "Testimonial from X", else a real-looking
 *  pipe-segment, else the deliberate "BFI Patient" fallback. */
function extractName(title) {
  const fromMatch = title.match(/testimonial\s*from\s+([^|]+?)(?:\s*\||\s*$)/i);
  if (fromMatch) {
    const candidate = cleanCandidate(fromMatch[1]);
    if (isLikelyName(candidate)) return candidate;
  }

  const parts = title.split("|").map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (isLikelyName(part)) return cleanCandidate(part);
  }

  return "BFI Patient";
}

/** Quote pattern matching — same heuristics as the original seed script,
 *  run against the CORRECTED (non-garbled) title so more patterns match. */
function deriveQuote(title) {
  const t = title;
  if (/\d+\s*years?\s*of\s*wait/i.test(t)) {
    const m = t.match(/(\d+)\s*years?\s*of\s*wait/i);
    if (m) return `After ${m[1]} long years of waiting, Bavishi Fertility Institute helped us achieve our dream.`;
  }
  if (/\d+\s*years?\s*of\s*hope/i.test(t)) {
    const m = t.match(/(\d+)\s*years?\s*of\s*hope/i);
    if (m) return `${m[1]} years of hope — and Bavishi Fertility Institute made it happen.`;
  }
  if (/failed\s*treatment/i.test(t)) return "After failed treatments elsewhere, Bavishi Fertility Institute gave us our miracle.";
  if (/1st\s*ivf\s*cycle|first\s*ivf\s*cycle/i.test(t)) return "We succeeded in our very first IVF cycle at Bavishi Fertility Institute.";
  if (/twin/i.test(t)) return "We were blessed with twins thanks to the expert care at Bavishi Fertility Institute.";
  if (/natural\s*miracle|natural\s*pregnancy/i.test(t)) return "After our IVF miracle, we were blessed with a natural pregnancy — thanks to BFI.";
  if (/dream.*came\s*true/i.test(t)) return "Our dream of becoming parents finally came true at Bavishi Fertility Institute.";
  if (/\d+\s*ivf.*cycle/i.test(t)) {
    const m = t.match(/(\d+)\s*ivf/i);
    if (m) return `After ${m[1]} IVF cycles, Bavishi Fertility Institute finally blessed us.`;
  }
  if (/personalised\s*care|personalized\s*care/i.test(t)) return "The personalised care at Bavishi Fertility Institute made all the difference.";
  if (/hope.*care|journey.*hope/i.test(t)) return "A journey full of hope — guided with care by the Bavishi Fertility Institute team.";
  if (/canada/i.test(t)) return "Being treated from Canada was seamless — the BFI team's communication was exceptional.";
  if (/parenthood/i.test(t)) return "Our journey to parenthood was made possible by the dedicated team at BFI.";
  if (/ivf\s*success|success.*ivf/i.test(t)) return "Our IVF journey at Bavishi Fertility Institute was a complete success.";
  if (/son\b|बेटे|पुत्र|દીકરા|પુત્ર/i.test(t) && /success|सफलता|સફળતા/i.test(t)) return "We are overjoyed to welcome our son, thanks to the expert care at Bavishi Fertility Institute.";
  if (/daughter|बेटी|દીકરી/i.test(t) && /success|सफलता|સફળતા/i.test(t)) return "We are overjoyed to welcome our daughter, thanks to the expert care at Bavishi Fertility Institute.";
  if (/review/i.test(t)) return "We are grateful for the expert treatment and compassionate care at BFI.";
  return DEFAULT_QUOTE;
}

async function main() {
  const client = new Client({ connectionString: DB_URI, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log("Connected to production DB.\n");

  const { rows } = await client.query(
    `SELECT id, youtube_id, patient_name, quote FROM testimonial_videos ORDER BY "order"`
  );
  console.log(`testimonial_videos: ${rows.length} rows\n`);

  let nameFixed = 0;
  let quoteFixed = 0;
  let unavailable = 0;
  let unchanged = 0;

  for (const row of rows) {
    const { id, youtube_id, patient_name, quote } = row;
    await sleep(DELAY_MS);
    const title = await fetchYouTubeTitle(youtube_id);

    if (!title) {
      console.log(`[SKIP/404] ${youtube_id}`);
      unavailable++;
      continue;
    }

    const newName = extractName(title);
    const newQuote = quote === DEFAULT_QUOTE ? deriveQuote(title) : quote;

    const nameChanged = newName !== patient_name;
    const quoteChanged = newQuote !== quote;

    if (!nameChanged && !quoteChanged) {
      unchanged++;
      continue;
    }

    console.log(`[FIX] ${youtube_id}  (title: ${title.slice(0, 70)})`);
    if (nameChanged) {
      console.log(`  name : "${patient_name}" -> "${newName}"`);
      nameFixed++;
    }
    if (quoteChanged) {
      console.log(`  quote: "${quote.slice(0, 50)}" -> "${newQuote.slice(0, 50)}"`);
      quoteFixed++;
    }

    await client.query(
      `UPDATE testimonial_videos SET patient_name = $1, quote = $2, updated_at = NOW() WHERE id = $3`,
      [newName, newQuote, id]
    );
  }

  console.log(`\nDone. names fixed: ${nameFixed}, quotes fixed: ${quoteFixed}, unchanged: ${unchanged}, unavailable: ${unavailable}`);

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
