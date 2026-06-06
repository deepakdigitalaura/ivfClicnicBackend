#!/usr/bin/env node
/* =====================================================================
 * Review synchronisation  (runs in `prebuild`, NEVER in the browser)
 * ---------------------------------------------------------------------
 * Google Places API (or a generic review API)
 *   ↓  this script (Node, build-time)            scripts/sync-reviews.mjs
 *   ↓  local cache                               src/data/reviews-cache.json
 *   ↓  static build (reviews.ts imports cache)
 *   ↓  review components + AggregateRating/Review schema
 *
 * POLICY
 *  - Per-source 10-day cache: only calls the API when an entry is missing or
 *    older than `refreshDays`. Otherwise reuses the local cache (no API call).
 *  - Only reviews with rating >= `minRating` are stored (filtered centrally).
 *  - Cache is overwritten for a source ONLY after a successful fetch.
 *  - On any failure (no key, no Place ID, network/parse error) the previous
 *    cache is preserved and the build continues. Never fabricates.
 *  - Pure build step → compatible with `output: "export"`. No runtime calls.
 *
 * SOURCE: Google reviews are fetched via the official Google Places API
 * (Place Details) using each location's Place ID — Google's listing/search
 * pages are NOT scraped (against ToS + unreliable). The Place ID identifies
 * the listing; the API returns rating + total count + up to 5 reviews.
 * ===================================================================== */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCES_PATH = join(ROOT, "src/data/reviews.sources.json");
const CACHE_PATH = join(ROOT, "src/data/reviews-cache.json");

const log = (...a) => console.log("[sync-reviews]", ...a);

/* ---- best-effort .env.local loader (no dependency) ---- */
function loadEnvLocal() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  try {
    for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch { /* ignore */ }
}

const readJson = (path, fallback) => {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return fallback; }
};

function writeCache(cache) {
  try {
    if (!existsSync(dirname(CACHE_PATH))) mkdirSync(dirname(CACHE_PATH), { recursive: true });
    writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n", "utf8");
    log(`cache written (${Object.keys(cache).length} source(s) cached)`);
  } catch (e) {
    log("WARN could not write cache:", e?.message ?? e);
  }
}

const toISO = (v) => {
  if (v == null) return new Date(0).toISOString();
  if (typeof v === "number") return new Date(v < 1e12 ? v * 1000 : v).toISOString();
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? new Date(0).toISOString() : d.toISOString();
};

/* ---- Google Places (Place Details) ---- */
async function fetchGooglePlaces(placeId, apiKey, listingUrl) {
  const fields = "rating,user_ratings_total,reviews,url,name";
  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${encodeURIComponent(placeId)}&fields=${fields}` +
    `&reviews_sort=newest&language=en&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.status !== "OK" || !json.result) {
    throw new Error(`Places status ${json.status}${json.error_message ? ` — ${json.error_message}` : ""}`);
  }
  const r = json.result;
  const aggregate =
    typeof r.rating === "number" && typeof r.user_ratings_total === "number" && r.user_ratings_total > 0
      ? { ratingValue: r.rating, reviewCount: r.user_ratings_total }
      : null;
  const reviews = Array.isArray(r.reviews)
    ? r.reviews.map((rv) => ({
        author: String(rv.author_name ?? "Google user"),
        rating: Number(rv.rating),
        text: String(rv.text ?? "").trim(),
        publishedAtISO: toISO(rv.time),
        relativeTime: rv.relative_time_description,
        profilePhoto: rv.profile_photo_url,
      }))
    : [];
  return { aggregate, reviews, mapsUrl: r.url || listingUrl || undefined };
}

/* ---- Generic review API (kept for non-Google providers) ---- */
async function fetchGeneric(endpoint, locationId, apiKey, listingUrl) {
  const url = endpoint.includes("{locationId}")
    ? endpoint.replace("{locationId}", encodeURIComponent(locationId))
    : `${endpoint}${endpoint.includes("?") ? "&" : "?"}location=${encodeURIComponent(locationId)}`;
  const res = await fetch(url, { headers: apiKey ? { Authorization: `Bearer ${apiKey}`, Accept: "application/json" } : { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const list = Array.isArray(json) ? json : json.reviews ?? json.data ?? json.results ?? [];
  const rv = Number(json.rating ?? json.average ?? json.aggregate?.ratingValue);
  const cnt = Number(json.total ?? json.count ?? json.aggregate?.reviewCount);
  const aggregate = Number.isFinite(rv) && Number.isFinite(cnt) && cnt > 0 ? { ratingValue: rv, reviewCount: cnt } : null;
  const reviews = (Array.isArray(list) ? list : []).map((x) => ({
    author: String(x.author ?? x.author_name ?? x.name ?? "Anonymous"),
    rating: Number(x.rating ?? x.score ?? x.stars),
    text: String(x.text ?? x.content ?? x.review ?? x.comment ?? "").trim(),
    publishedAtISO: toISO(x.date ?? x.created_at ?? x.time),
    relativeTime: x.relative_time_description ?? undefined,
  }));
  return { aggregate, reviews, mapsUrl: listingUrl || undefined };
}

const isFresh = (entry, refreshMs) => {
  if (!entry?.fetchedAt) return false;
  const age = Date.now() - new Date(entry.fetchedAt).getTime();
  return Number.isFinite(age) && age >= 0 && age < refreshMs;
};

async function main() {
  loadEnvLocal();

  const config = readJson(SOURCES_PATH, null);
  const cache = readJson(CACHE_PATH, {}) ?? {};
  if (!config) { log("WARN no reviews.sources.json — keeping existing cache."); return; }

  const provider = config.provider ?? "google-places";
  const apiKey = process.env[config.apiKeyEnv ?? "GOOGLE_PLACES_API_KEY"];
  const refreshMs = Number(config.refreshDays ?? 10) * 24 * 60 * 60 * 1000;
  const minRating = Number(config.minRating ?? 4);
  const PLACEHOLDER = "YOUR_REVIEW_API_ENDPOINT";
  const endpointReady = provider !== "generic" || (typeof config.endpoint === "string" && config.endpoint !== PLACEHOLDER && /^https?:\/\//.test(config.endpoint));

  if (!apiKey) {
    log(`No ${config.apiKeyEnv ?? "GOOGLE_PLACES_API_KEY"} set. Skipping fetch — cache preserved, build continues.`);
    return;
  }
  if (!endpointReady) {
    log(`Generic endpoint not configured. Skipping fetch — cache preserved, build continues.`);
    return;
  }

  let changed = false;
  for (const [key, src] of Object.entries(config.sources ?? {})) {
    const id = src?.placeId || src?.locationId;
    if (!id) { log(`SKIP ${key} — no ${provider === "google-places" ? "placeId" : "locationId"}`); continue; }

    if (isFresh(cache[key], refreshMs)) {
      log(`FRESH ${key} — cached ${Math.floor((Date.now() - new Date(cache[key].fetchedAt)) / 86400000)}d ago, no API call`);
      continue;
    }

    try {
      const { aggregate, reviews, mapsUrl } =
        provider === "google-places"
          ? await fetchGooglePlaces(id, apiKey, src.listingUrl)
          : await fetchGeneric(config.endpoint, id, apiKey, src.listingUrl);

      const valid = reviews.filter((r) => Number.isFinite(r.rating));
      const display = valid.filter((r) => r.rating >= minRating && r.text); // central rating>=4 filter

      cache[key] = {
        key,
        source: provider,
        fetchedAt: new Date().toISOString(),
        ...(mapsUrl ? { mapsUrl } : {}),
        ...(aggregate ? { aggregate } : {}),
        reviews: display,
      };
      changed = true;
      log(`OK    ${key} — ${display.length} review(s) >= ${minRating}★, aggregate ${aggregate?.ratingValue ?? "n/a"} (${aggregate?.reviewCount ?? 0})`);
    } catch (e) {
      log(`FAIL  ${key} — ${e?.message ?? e} (keeping previous cache, build continues)`);
    }
  }

  if (changed) writeCache(cache);
  else log("No sources required a refresh — cache unchanged.");
}

main()
  .catch((e) => log("WARN unexpected error, continuing build:", e?.message ?? e))
  .finally(() => process.exit(0));
