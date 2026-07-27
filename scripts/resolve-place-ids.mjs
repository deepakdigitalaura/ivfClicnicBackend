#!/usr/bin/env node
/* =====================================================================
 * One-off helper: resolve each centre's Google Place ID and write it
 * into src/data/reviews.sources.json.
 *
 * Run once after GOOGLE_PLACES_API_KEY is set (locally, in .env.local):
 *   npm run resolve-place-ids
 *
 * Uses the Places API "Find Place From Text" endpoint with each centre's
 * existing `mapQuery` (from src/lib/locations.ts) as the search text, biased
 * toward its coordinates where known. Prints the matched name + address for
 * each centre so you can sanity-check before committing — this script never
 * overwrites a placeId that's already filled in, so it's safe to re-run.
 * ===================================================================== */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCES_PATH = join(ROOT, "src/data/reviews.sources.json");

const log = (...a) => console.log("[resolve-place-ids]", ...a);

function loadEnvLocal() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

/* key → { query, geo? } — mirrors mapQuery/geo already in src/lib/locations.ts */
const CENTRES = {
  brand:              { query: "Bavishi Fertility Institute Paldi Ahmedabad", geo: { lat: 23.0130822, lng: 72.5639069 } },
  paldi:              { query: "Bavishi Fertility Institute Paldi Ahmedabad", geo: { lat: 23.0130822, lng: 72.5639069 } },
  "sindhu-bhavan-road": { query: "Bavishi Fertility Institute Sindhu Bhavan Road Bodakdev Ahmedabad", geo: { lat: 23.039814, lng: 72.5085954 } },
  nikol:              { query: "Bavishi Fertility Institute Nikol Ahmedabad", geo: { lat: 23.0589329, lng: 72.6718737 } },
  ghatkopar:          { query: "Bavishi Fertility Institute Ghatkopar Mumbai" },
  thane:              { query: "Bavishi Fertility Institute Thane West" },
  "vile-parle":       { query: "Bavishi Fertility Institute Vile Parle West Mumbai" },
  borivali:           { query: "Bavishi Fertility Institute Borivali West Mumbai" },
  vashi:              { query: "Bavishi Fertility Institute Vashi Navi Mumbai" },
  "jetalpur-road":    { query: "Bavishi Fertility Institute Jetalpur Road Vadodara" },
  "lal-darwaja":      { query: "Bavishi Fertility Institute Lal Darwaja Surat" },
  mirjapar:           { query: "Bavishi Fertility Institute Bhuj Kutch" },
  "kalubha-road":     { query: "Bavishi Fertility Institute Kalubha Road Bhavnagar" },
  nanikhodiyar:       { query: "Bavishi Fertility Institute Anand IRIS Hospital" },
  shivpur:            { query: "Bavishi Fertility Institute Shivpur Varanasi" },
};

async function findPlaceId(query, geo, apiKey) {
  const fields = "place_id,name,formatted_address";
  const params = new URLSearchParams({
    input: query,
    inputtype: "textquery",
    fields,
    key: apiKey,
  });
  if (geo) params.set("locationbias", `point:${geo.lat},${geo.lng}`);
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.status !== "OK" || !json.candidates?.length) {
    throw new Error(`status ${json.status}${json.error_message ? ` — ${json.error_message}` : ""}`);
  }
  return json.candidates[0];
}

async function main() {
  loadEnvLocal();
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    log("ERROR: GOOGLE_PLACES_API_KEY not set in .env.local. Add it, then re-run.");
    process.exit(1);
  }

  const config = JSON.parse(readFileSync(SOURCES_PATH, "utf8"));
  let changed = false;

  for (const [key, entry] of Object.entries(config.sources ?? {})) {
    const def = CENTRES[key];
    if (!def) { log(`SKIP ${key} — no query defined in this script`); continue; }
    if (entry.placeId) { log(`SKIP ${key} — placeId already set (${entry.placeId})`); continue; }

    try {
      const match = await findPlaceId(def.query, def.geo, apiKey);
      entry.placeId = match.place_id;
      changed = true;
      log(`OK    ${key} → "${match.name}" — ${match.formatted_address}`);
    } catch (e) {
      log(`FAIL  ${key} — ${e?.message ?? e}`);
    }
  }

  if (changed) {
    writeFileSync(SOURCES_PATH, JSON.stringify(config, null, 2) + "\n", "utf8");
    log("Wrote resolved placeIds to src/data/reviews.sources.json — review the matches above, then commit.");
  } else {
    log("No changes written.");
  }
}

main().catch((e) => { log("FATAL", e?.message ?? e); process.exit(1); });
