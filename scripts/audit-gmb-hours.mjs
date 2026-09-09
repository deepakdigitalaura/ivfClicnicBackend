#!/usr/bin/env node
/* =====================================================================
 * GMB Hours Audit  —  scripts/audit-gmb-hours.mjs
 * ---------------------------------------------------------------------
 * Compares website opening hours against live Google My Business data.
 *
 * WHAT IT DOES
 *  1. Reads each centre's stored hours from CENTRES (below).
 *  2. Looks up known Place IDs from src/data/reviews.sources.json.
 *  3. For centres without a Place ID, searches Google Places by name
 *     to discover one automatically (and saves it back to sources.json).
 *  4. Calls Place Details API to fetch live GMB opening_hours.
 *  5. Compares GMB hours vs. website hours and reports every mismatch.
 *
 * USAGE
 *   node scripts/audit-gmb-hours.mjs
 *   node scripts/audit-gmb-hours.mjs --fix        ← print corrections as edits
 *   node scripts/audit-gmb-hours.mjs --save-ids   ← save discovered Place IDs
 *
 * REQUIRES
 *   GOOGLE_PLACES_API_KEY in .env.local (Places API + billing enabled in GCP)
 * ===================================================================== */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCES_PATH = join(ROOT, "src/data/reviews.sources.json");

const ARGS = process.argv.slice(2);
const FLAG_FIX = ARGS.includes("--fix");
const FLAG_SAVE_IDS = ARGS.includes("--save-ids");

/* ─── Centre data (mirrors src/lib/locations.ts opening fields) ──────────── */
const CENTRES = [
  {
    slug: "paldi",
    fullName: "Bavishi Fertility Institute Paldi Ahmedabad",
    mapQuery: "Bavishi Fertility Institute Paldi Ahmedabad",
    hours: "Mon–Sat · 9:00 am – 7:00 pm",
    opening: { opens: "09:00", closes: "19:00" },
  },
  {
    slug: "sindhu-bhavan-road",
    fullName: "Bavishi Fertility Institute Sindhu Bhavan Road Bodakdev Ahmedabad",
    mapQuery: "Bavishi Fertility Institute Sindhu Bhavan Road Bodakdev Ahmedabad",
    hours: "Mon–Sat · 10:30 am – 7:00 pm",
    opening: { opens: "10:30", closes: "19:00" },
  },
  {
    slug: "nikol",
    fullName: "Bavishi Fertility Institute Nikol Ahmedabad",
    mapQuery: "Bavishi Fertility Institute Nikol Ahmedabad",
    hours: "Mon–Sat · 10:00 am – 7:00 pm",
    opening: { opens: "10:00", closes: "19:00" },
  },
  {
    slug: "ghatkopar",
    fullName: "Bavishi Fertility Institute Ghatkopar Mumbai",
    mapQuery: "Bavishi Fertility Institute Ghatkopar Mumbai",
    hours: "Mon–Sat · 9:00 am – 9:00 pm",
    opening: { opens: "09:00", closes: "21:00" },
  },
  {
    slug: "thane",
    fullName: "Bavishi Fertility Institute Thane West",
    mapQuery: "Bavishi Fertility Institute Thane West",
    hours: "Mon–Sat · 10:00 am – 1:00 pm",
    opening: { opens: "10:00", closes: "13:00" },
  },
  {
    slug: "vile-parle",
    fullName: "Bavishi Fertility Institute Vile Parle West Mumbai",
    mapQuery: "Bavishi Fertility Institute Vile Parle West Mumbai",
    hours: "Mon–Sat · 2:00 pm – 5:00 pm",
    opening: { opens: "14:00", closes: "17:00" },
  },
  {
    slug: "borivali",
    fullName: "Bavishi Fertility Institute Borivali West Mumbai",
    mapQuery: "Bavishi Fertility Institute Borivali West Mumbai",
    hours: "Mon–Sat · 10:00 am – 1:00 pm",
    opening: { opens: "10:00", closes: "13:00" },
  },
  {
    slug: "vashi",
    fullName: "Bavishi Fertility Institute Vashi Navi Mumbai",
    mapQuery: "Bavishi Fertility Institute Vashi Navi Mumbai",
    hours: "Tue, Thu & Sat · 3:00 pm – 5:00 pm",
    opening: { opens: "15:00", closes: "17:00", days: ["Tuesday", "Thursday", "Saturday"] },
  },
  {
    slug: "jetalpur-road",
    fullName: "Bavishi Fertility Institute Jetalpur Road Vadodara",
    mapQuery: "Bavishi Fertility Institute Jetalpur Road Vadodara",
    hours: "Mon–Sat · 10:00 am – 7:00 pm",
    opening: { opens: "10:00", closes: "19:00" },
  },
  {
    slug: "lal-darwaja",
    fullName: "Bavishi Fertility Institute Lal Darwaja Surat",
    mapQuery: "Bavishi Fertility Institute Lal Darwaja Surat",
    hours: "Mon–Sat · 10:00 am – 7:00 pm",
    opening: { opens: "10:00", closes: "19:00" },
  },
  {
    slug: "mirjapar",
    fullName: "Bavishi Fertility Institute Bhuj Kutch",
    mapQuery: "Bavishi Fertility Institute Bhuj Kutch",
    hours: "Mon–Fri · 8:00 am – 7:00 pm · Sat till 1:00 pm",
    opening: { opens: "08:00", closes: "19:00", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
  },
  {
    slug: "kalubha-road",
    fullName: "Bavishi Fertility Institute Kalubha Road Bhavnagar",
    mapQuery: "Bavishi Fertility Institute Kalubha Road Bhavnagar",
    hours: "Mon–Sat · 10:00 am – 2:00 pm & 4:00 pm – 8:00 pm",
    opening: { opens: "10:00", closes: "20:00" },
  },
  {
    slug: "nanikhodiyar",
    fullName: "Bavishi Fertility Institute Anand IRIS Hospital",
    mapQuery: "Bavishi Fertility Institute Anand IRIS Hospital",
    hours: "Mon–Sat · 10:00 am – 7:00 pm",
    opening: { opens: "10:00", closes: "19:00" },
  },
  {
    slug: "shivpur",
    fullName: "Bavishi Fertility Institute Shivpur Varanasi",
    mapQuery: "Bavishi Fertility Institute Shivpur Varanasi",
    hours: "Mon–Sat · 10:00 am – 7:00 pm",
    opening: { opens: "10:00", closes: "19:00" },
  },
];

/* ─── Day name helpers ───────────────────────────────────────────────────── */
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DEFAULT_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function timeToHHMM(googleTime) {
  // Google returns "0900" or "1430" — convert to "09:00" / "14:30"
  const t = String(googleTime).padStart(4, "0");
  return `${t.slice(0, 2)}:${t.slice(2)}`;
}

/* Parse Google opening_hours.periods into { opens, closes, days } objects.
 * Returns an array because some places have split hours or different hours
 * per day — each contiguous block becomes one entry. */
function parseGmbPeriods(periods) {
  if (!Array.isArray(periods) || periods.length === 0) return null;

  // Group periods by their open+close times to find which days share the same window
  const groups = new Map();
  for (const p of periods) {
    if (!p.open || !p.close) continue;
    const opens = timeToHHMM(p.open.time);
    const closes = timeToHHMM(p.close.time);
    const key = `${opens}-${closes}`;
    if (!groups.has(key)) groups.set(key, { opens, closes, days: [] });
    groups.get(key).days.push(DAY_NAMES[p.open.day]);
  }

  return Array.from(groups.values());
}

/* Find the best matching GMB block for a centre's stored hours */
function findBestMatch(gmbBlocks, siteOpening) {
  if (!gmbBlocks || gmbBlocks.length === 0) return null;
  const siteDays = (siteOpening.days ?? DEFAULT_DAYS).sort().join(",");
  // Try exact day+time match first
  for (const b of gmbBlocks) {
    if (b.opens === siteOpening.opens && b.closes === siteOpening.closes) return b;
  }
  // Fallback: first block
  return gmbBlocks[0];
}

/* ─── Google Places API calls ────────────────────────────────────────────── */
const BASE = "https://maps.googleapis.com/maps/api";

async function findPlaceId(query, apiKey) {
  const url =
    `${BASE}/place/findplacefromtext/json` +
    `?input=${encodeURIComponent(query)}&inputtype=textquery` +
    `&fields=place_id,name,formatted_address&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.status !== "OK" || !json.candidates?.[0]) return null;
  const c = json.candidates[0];
  return { placeId: c.place_id, name: c.name, address: c.formatted_address };
}

async function fetchPlaceHours(placeId, apiKey) {
  const fields = "name,formatted_address,opening_hours,url";
  const url =
    `${BASE}/place/details/json` +
    `?place_id=${encodeURIComponent(placeId)}&fields=${fields}&language=en&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.status !== "OK" || !json.result) throw new Error(`Places status ${json.status}`);
  return json.result;
}

/* ─── Env loader (no deps) ───────────────────────────────────────────────── */
function loadEnv() {
  const p = join(ROOT, ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
async function main() {
  loadEnv();

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error(
      "\n❌  GOOGLE_PLACES_API_KEY is not set in .env.local\n" +
      "    1. Go to console.cloud.google.com → APIs & Services → Credentials\n" +
      "    2. Create an API key with Places API enabled (+ billing)\n" +
      "    3. Add to .env.local:  GOOGLE_PLACES_API_KEY=your_key_here\n" +
      "    Then re-run this script.\n"
    );
    process.exit(1);
  }

  // Load known place IDs from sources.json
  let sources = {};
  try {
    sources = JSON.parse(readFileSync(SOURCES_PATH, "utf8")).sources ?? {};
  } catch { /* ignore */ }

  const results = [];
  const discoveredIds = {}; // newly found place IDs to save back

  console.log("\n━━━ GMB Hours Audit — Bavishi Fertility Institute ━━━\n");

  for (const centre of CENTRES) {
    process.stdout.write(`  Checking ${centre.slug} … `);

    let placeId = sources[centre.slug]?.placeId || "";
    let gmb = null;
    let foundName = "";
    let foundAddress = "";

    try {
      // Auto-discover place ID if missing
      if (!placeId) {
        const found = await findPlaceId(centre.mapQuery, apiKey);
        if (!found) {
          console.log("⚠  Place not found on Google");
          results.push({ slug: centre.slug, status: "NOT_FOUND" });
          continue;
        }
        placeId = found.placeId;
        foundName = found.name;
        foundAddress = found.address;
        discoveredIds[centre.slug] = placeId;
        process.stdout.write(`[discovered ${placeId}] `);
      }

      // Fetch Place Details (opening_hours)
      const detail = await fetchPlaceHours(placeId, apiKey);
      foundName = detail.name || foundName;
      foundAddress = detail.formatted_address || foundAddress;
      const gmbHours = detail.opening_hours;

      if (!gmbHours) {
        console.log("⚠  No hours on GMB listing");
        results.push({ slug: centre.slug, placeId, status: "NO_HOURS", gmb: null, site: centre.opening });
        continue;
      }

      const gmbBlocks = parseGmbPeriods(gmbHours.periods);
      const best = findBestMatch(gmbBlocks, centre.opening);

      // Compare
      const siteDays = (centre.opening.days ?? DEFAULT_DAYS).sort().join(",");
      const gmbDays = (best?.days ?? []).sort().join(",");
      const opensMatch = best?.opens === centre.opening.opens;
      const closesMatch = best?.closes === centre.opening.closes;
      const daysMatch = gmbDays === siteDays;
      const matched = opensMatch && closesMatch && daysMatch;

      if (matched) {
        console.log("✓  MATCH");
      } else {
        const issues = [];
        if (!opensMatch) issues.push(`opens: GMB ${best?.opens} vs site ${centre.opening.opens}`);
        if (!closesMatch) issues.push(`closes: GMB ${best?.closes} vs site ${centre.opening.closes}`);
        if (!daysMatch) issues.push(`days: GMB [${gmbDays}] vs site [${siteDays}]`);
        console.log(`✗  MISMATCH — ${issues.join(" | ")}`);
      }

      results.push({
        slug: centre.slug,
        placeId,
        status: matched ? "MATCH" : "MISMATCH",
        site: centre.opening,
        siteHours: centre.hours,
        gmb: gmbBlocks,
        gmbWeekdayText: gmbHours.weekday_text,
        matched,
        issues: matched ? [] : [],
      });
    } catch (err) {
      console.log(`✗  ERROR — ${err.message}`);
      results.push({ slug: centre.slug, placeId, status: "ERROR", error: err.message });
    }

    // Polite rate-limiting: avoid Places API 429s
    await new Promise((r) => setTimeout(r, 250));
  }

  /* ── Summary report ── */
  console.log("\n━━━ RESULTS ━━━\n");

  const matches = results.filter((r) => r.status === "MATCH");
  const mismatches = results.filter((r) => r.status === "MISMATCH");
  const noHours = results.filter((r) => r.status === "NO_HOURS");
  const notFound = results.filter((r) => r.status === "NOT_FOUND");
  const errors = results.filter((r) => r.status === "ERROR");

  console.log(`  ✓ Match:      ${matches.length}`);
  console.log(`  ✗ Mismatch:   ${mismatches.length}`);
  console.log(`  ⚠ No GMB hrs: ${noHours.length}`);
  console.log(`  ⚠ Not found:  ${notFound.length}`);
  console.log(`  ✗ API error:  ${errors.length}`);

  if (mismatches.length > 0) {
    console.log("\n━━━ MISMATCHES — CORRECTIONS NEEDED ━━━\n");
    for (const r of mismatches) {
      console.log(`  ┌─ ${r.slug}`);
      console.log(`  │  Site:  ${r.siteHours}`);
      console.log(`  │  GMB blocks:`);
      for (const b of r.gmb ?? []) {
        console.log(`  │    • ${b.opens} – ${b.closes}  [${b.days.join(", ")}]`);
      }
      if (r.gmbWeekdayText) {
        console.log(`  │  GMB text:`);
        for (const line of r.gmbWeekdayText) console.log(`  │    ${line}`);
      }
      if (FLAG_FIX) {
        // Suggest the corrected opening field
        const primary = r.gmb?.[0];
        if (primary) {
          const correction = {
            opens: primary.opens,
            closes: primary.closes,
            ...(primary.days.length < 7 ? { days: primary.days } : {}),
          };
          console.log(`  │  Suggested fix in locations.ts:`);
          console.log(`  │    opening: ${JSON.stringify(correction)},`);
        }
      }
      console.log(`  └─`);
    }
  }

  if (noHours.length > 0) {
    console.log("\n━━━ LISTINGS WITHOUT HOURS — UPDATE YOUR GMB PROFILE ━━━\n");
    for (const r of noHours) {
      console.log(`  • ${r.slug} (${r.placeId})`);
      console.log(`    Visit: https://business.google.com and add opening hours`);
    }
  }

  if (Object.keys(discoveredIds).length > 0 && FLAG_SAVE_IDS) {
    /* Merge discovered IDs back into sources.json */
    try {
      const raw = JSON.parse(readFileSync(SOURCES_PATH, "utf8"));
      for (const [slug, pid] of Object.entries(discoveredIds)) {
        if (!raw.sources[slug]) raw.sources[slug] = {};
        raw.sources[slug].placeId = pid;
      }
      writeFileSync(SOURCES_PATH, JSON.stringify(raw, null, 2) + "\n", "utf8");
      console.log(`\n  ✓ Saved ${Object.keys(discoveredIds).length} discovered Place IDs to reviews.sources.json`);
    } catch (e) {
      console.log(`\n  ⚠ Could not save IDs: ${e.message}`);
    }
  } else if (Object.keys(discoveredIds).length > 0) {
    console.log("\n  ℹ  Re-run with --save-ids to persist discovered Place IDs to reviews.sources.json");
  }

  console.log("\n━━━ Done ━━━\n");
}

main().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(1);
});
