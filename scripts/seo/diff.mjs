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
const c = (v) => JSON.stringify(v); // compact, single-line

/* Compact, path-addressed delta between two JSON-comparable values, so a
 * failing route names the EXACT field that changed (e.g. `meta.robots`,
 * `jsonLd[1]....headline`, or an added/removed internalLinks entry) instead of
 * dumping the whole blob. This makes regressions actionable and makes it
 * obvious when a "failure" is a single benign field vs a structural change. */
function deepDelta(a, b, path) {
  const out = [];
  const typeOf = (v) => (v === null ? "null" : Array.isArray(v) ? "array" : typeof v);
  const ta = typeOf(a), tb = typeOf(b);
  if (ta !== tb) return [`  ~ ${path}: ${c(a)} -> ${c(b)}`];

  if (ta === "array") {
    const isPrim = (arr) => arr.every((x) => typeOf(x) !== "array" && typeOf(x) !== "object");
    if (isPrim(a) && isPrim(b)) {
      // Order-independent set diff — right for sorted link/string arrays.
      const sa = new Set(a.map(c)), sb = new Set(b.map(c));
      for (const x of b) if (!sa.has(c(x))) out.push(`  + ${path}: ${c(x)}`);
      for (const x of a) if (!sb.has(c(x))) out.push(`  - ${path}: ${c(x)}`);
      return out;
    }
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i++) {
      if (i >= a.length) out.push(`  + ${path}[${i}]: ${c(b[i])}`);
      else if (i >= b.length) out.push(`  - ${path}[${i}]: ${c(a[i])}`);
      else out.push(...deepDelta(a[i], b[i], `${path}[${i}]`));
    }
    return out;
  }

  if (ta === "object") {
    for (const k of [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()) {
      const p = `${path}.${k}`;
      if (!(k in a)) out.push(`  + ${p}: ${c(b[k])}`);
      else if (!(k in b)) out.push(`  - ${p}: ${c(a[k])}`);
      else out.push(...deepDelta(a[k], b[k], p));
    }
    return out;
  }

  if (c(a) !== c(b)) out.push(`  ~ ${path}: ${c(a)} -> ${c(b)}`);
  return out;
}

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
        const delta = deepDelta(baseline[f], live[f], f);
        console.error(delta.length ? delta.join("\n") : `  ~ ${f}: (changed)\n  --- baseline ---\n${j(baseline[f])}\n  --- live ---\n${j(live[f])}`);
      }
    } else {
      console.log(`[seo:diff] ✓ ${route}`);
    }
  }
  if (failures) { console.error(`\n[seo:diff] FAILED: ${failures} route(s) changed.`); process.exit(1); }
  console.log("\n[seo:diff] PASS — no SEO/JSON-LD/link changes.");
};

run().catch((e) => { console.error("[seo:diff] ERROR:", e.message); process.exit(1); });
