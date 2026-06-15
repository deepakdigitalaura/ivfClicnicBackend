#!/usr/bin/env node
/* =====================================================================
 * SEO snapshot writer — captures the parity baseline.
 * Fetches each route from a running server, extracts the normalised SEO
 * surface (see extract.mjs), and writes scripts/seo/snapshots/<file>.json.
 * Commit the snapshots as the baseline; diff.mjs compares against them.
 *
 * Usage: node scripts/seo/snapshot.mjs           (BASE=http://localhost:3000)
 *        BASE=http://localhost:3000 node scripts/seo/snapshot.mjs
 * ===================================================================== */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { extractSeo } from "./extract.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = join(__dirname, "snapshots");
const routes = JSON.parse(readFileSync(join(__dirname, "routes.json"), "utf8"));

const fileFor = (route) => (route === "/" ? "_root" : route.replace(/^\//, "").replace(/\//g, "__")) + ".json";

const run = async () => {
  if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
  for (const route of routes) {
    const res = await fetch(`${BASE}${route}`);
    if (!res.ok) throw new Error(`${route} -> HTTP ${res.status}`);
    const seo = extractSeo(await res.text());
    writeFileSync(join(OUT, fileFor(route)), JSON.stringify({ route, ...seo }, null, 2) + "\n", "utf8");
    console.log(`[seo:snapshot] wrote ${fileFor(route)} (jsonLd:${seo.jsonLd.length}, links:${seo.internalLinks.length})`);
  }
};

run().catch((e) => {
  console.error("[seo:snapshot] FAILED:", e.message);
  process.exit(1);
});
