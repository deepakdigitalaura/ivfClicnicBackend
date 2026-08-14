#!/usr/bin/env node
// One-time fix: two rules in redirectsConfig.rules cause self-redirect loops.
//
// 1) source "/history/" -> destination "/history" — harmless on paper, but
//    src/middleware.ts normalizes trailing slashes on BOTH the incoming
//    pathname and rule.source before comparing, so this rule also matches
//    the already-clean "/history" request and redirects it to itself
//    forever (ERR_TOO_MANY_REDIRECTS). Removed — Next's own trailing-slash
//    handling already covers "/history/" -> "/history".
//
// 2) source "/blog/factors-to-consider-right-clinic-for-ivf-journey" had a
//    typo'd destination identical to the source (missing the "s" in
//    "/blogs/..."), which is a literal self-loop with no normalization
//    involved. Fixed to point at the real "/blogs/..." slug, matching the
//    other 10 sibling "/blog/..." -> "/blogs/..." rules.
//
// Usage: node scripts/fix-self-loop-redirects.mjs [--dry-run]
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
const dryRun = process.argv.includes("--dry-run");

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN env vars");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const doc = await client.getDocument("redirectsConfig");
if (!doc) {
  console.error("redirectsConfig singleton not found");
  process.exit(1);
}

const rules = doc.rules ?? [];
let changed = 0;
const newRules = rules.filter((r) => {
  if (r.source === "/history/" && r.destination === "/history") {
    console.log(`Removing self-loop rule: ${r.source} -> ${r.destination}`);
    changed++;
    return false;
  }
  return true;
}).map((r) => {
  if (r.source === "/blog/factors-to-consider-right-clinic-for-ivf-journey" && r.destination === r.source) {
    const fixed = "/blogs/factors-to-consider-right-clinic-for-ivf-journey";
    console.log(`Fixing destination: ${r.source} -> ${fixed}`);
    changed++;
    return { ...r, destination: fixed };
  }
  return r;
});

console.log(`${changed} rule(s) changed.`);

if (dryRun || changed === 0) {
  console.log(dryRun ? "[dry-run] No writes performed." : "Nothing to write.");
  process.exit(0);
}

await client.patch("redirectsConfig").set({ rules: newRules }).commit();
console.log("Saved redirectsConfig.");
