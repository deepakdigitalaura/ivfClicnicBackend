#!/usr/bin/env node
/* =====================================================================
 * SEO parity check — fails (exit 1) if live render differs from baseline.
 * Fetches each route, extracts the normalised SEO surface, and compares it
 * field-by-field against the committed scripts/seo/snapshots/<file>.json.
 * Use after any refactor that must NOT change SEO/JSON-LD/links.
 *
 * Usage: node scripts/seo/diff.mjs   (BASE=http://localhost:3000)
 * ===================================================================== */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { extractSeo } from "./extract.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE ?? "http://localhost:3000";
const SNAP = join(__dirname, "snapshots");
const routes = JSON.parse(readFileSync(join(__dirname, "routes.json"), "utf8"));
const fileFor = (route) => (route === "/" ? "_root" : route.replace(/^\//, "").replace(/\//g, "__")) + ".json";

const j = (v) => JSON.stringify(v, null, 2);

const run = async () => {
  let failures = 0;
  for (const route of routes) {
    const snapPath = join(SNAP, fileFor(route));
    if (!existsSync(snapPath)) {
      console.error(`[seo:diff] MISSING baseline for ${route} (run snapshot.mjs first)`);
      failures++;
      continue;
    }
    const baseline = JSON.parse(readFileSync(snapPath, "utf8"));
    const res = await fetch(`${BASE}${route}`);
    if (!res.ok) { console.error(`[seo:diff] ${route} -> HTTP ${res.status}`); failures++; continue; }
    const live = { route, ...extractSeo(await res.text()) };

    const fields = ["title", "canonical", "meta", "jsonLd", "internalLinks"];
    const diffs = fields.filter((f) => j(baseline[f]) !== j(live[f]));
    if (diffs.length) {
      failures++;
      console.error(`\n[seo:diff] ✗ ${route} differs in: ${diffs.join(", ")}`);
      for (const f of diffs) {
        console.error(`  --- baseline.${f} ---\n${j(baseline[f])}`);
        console.error(`  --- live.${f} ---\n${j(live[f])}`);
      }
    } else {
      console.log(`[seo:diff] ✓ ${route}`);
    }
  }
  if (failures) { console.error(`\n[seo:diff] FAILED: ${failures} route(s) changed.`); process.exit(1); }
  console.log("\n[seo:diff] PASS — no SEO/JSON-LD/link changes.");
};

run().catch((e) => { console.error("[seo:diff] ERROR:", e.message); process.exit(1); });
