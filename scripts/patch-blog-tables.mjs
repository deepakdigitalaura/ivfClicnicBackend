#!/usr/bin/env node
/**
 * patch-blog-tables.mjs — Replace ONLY the comparisonTable block on each blog
 * with a UNIQUE, topic-specific table authored per slug.
 *
 * This is a surgical patch: it walks each blog's Lexical content, finds the
 * existing `comparisonTable` block, and swaps its `fields` for the per-slug
 * table from scripts/blog-comparison-tables.mjs. Nothing else is touched
 * (stat strips, infographics, conclusion, CTA all stay as-is).
 *
 * Blogs without an authored table entry are skipped and listed at the end as
 * MISSING, so we can drive coverage to 100% batch by batch.
 *
 * Usage:
 *   node scripts/patch-blog-tables.mjs --dry-run          # no PATCH, just report
 *   node scripts/patch-blog-tables.mjs --only=slug1,slug2 # only these slugs
 *   node scripts/patch-blog-tables.mjs                    # patch all authored blogs
 */

import { TABLES } from "./blog-comparison-tables.mjs";

// ───────────────────────────── CONFIG ─────────────────────────────
const PAYLOAD_URL = process.env.PAYLOAD_URL || "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL = process.env.SEED_ADMIN_EMAIL || "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Zxcvbnm@123";
const DRY_RUN = process.argv.includes("--dry-run");
const ONLY_ARG = process.argv.find((a) => a.startsWith("--only="));
const ONLY = ONLY_ARG ? ONLY_ARG.slice("--only=".length).split(",").map((s) => s.trim()).filter(Boolean) : null;
const PACE_MS = 4000;

// ───────────────────────────── HTTP ─────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function httpReq(method, url, body, headers = {}) {
  const controller = new AbortController();
  const timeout = method === "PATCH" ? 90000 : 45000;
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const opts = { method, headers: { ...headers }, signal: controller.signal };
    if (body) {
      opts.headers["Content-Type"] = "application/json";
      opts.body = typeof body === "string" ? body : JSON.stringify(body);
    }
    const res = await fetch(url, opts);
    const text = await res.text();
    clearTimeout(timer);
    try { return { status: res.status, data: JSON.parse(text) }; }
    catch { return { status: res.status, data: text }; }
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

async function httpReqRetry(method, url, body, headers = {}, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await httpReq(method, url, body, headers);
    } catch (err) {
      if (attempt === retries) throw err;
      const backoff = 4000 * attempt;
      console.log(`       ⟳ retry ${attempt}/${retries - 1} after ${err.message} (wait ${backoff / 1000}s)`);
      await sleep(backoff);
    }
  }
}

async function login() {
  const r = await httpReqRetry("POST", `${PAYLOAD_URL}/api/users/login`, { email: EMAIL, password: PASSWORD });
  if (r.status !== 200) throw new Error(`Login failed: ${r.status} — ${JSON.stringify(r.data)}`);
  return r.data.token;
}

// ───────────────────────────── HELPERS ─────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 14) + Math.random().toString(36).slice(2, 6);
}

/** Expand the compact authored table into the Payload comparisonTable shape. */
function buildTableFields(def, keepId) {
  return {
    id: keepId || uid(),
    blockName: "",
    blockType: "comparisonTable",
    rowHeader: def.rowHeader,
    columns: def.columns.map((header) => ({ id: uid(), header })),
    rows: def.rows.map((r) => ({
      id: uid(),
      rowLabel: r[0],
      cells: r.slice(1).map((value) => ({ id: uid(), value: String(value) })),
    })),
  };
}

/** Find the comparisonTable block node inside Lexical content. */
function findComparisonBlock(content) {
  const children = content?.root?.children || [];
  for (let i = 0; i < children.length; i++) {
    if (children[i].type === "block" && children[i].fields?.blockType === "comparisonTable") {
      return { node: children[i], index: i };
    }
  }
  return null;
}

// ───────────────────────────── MAIN ─────────────────────────────
async function main() {
  console.log(`[tables] Patch comparison tables — ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
  console.log(`[tables] Authored entries available: ${Object.keys(TABLES).length}`);
  if (ONLY) console.log(`[tables] --only filter: ${ONLY.join(", ")}`);

  const token = await login();
  const authHeaders = { Authorization: `JWT ${token}` };
  console.log("[tables] ✓ Authenticated");

  // Fetch all blogs
  let allBlogs = [];
  let page = 1;
  while (true) {
    const r = await httpReqRetry("GET", `${PAYLOAD_URL}/api/blogs?limit=50&page=${page}&depth=0&sort=createdAt`, null, authHeaders);
    if (r.status !== 200) throw new Error(`Fetch failed page ${page}: ${r.status}`);
    allBlogs.push(...r.data.docs);
    if (!r.data.hasNextPage) break;
    page++;
  }
  console.log(`[tables] Found ${allBlogs.length} live blogs`);

  const summary = { patched: 0, skippedNoEntry: 0, noTableBlock: 0, errors: 0 };
  const missing = [];
  const noBlock = [];

  for (let i = 0; i < allBlogs.length; i++) {
    const blog = allBlogs[i];
    const slug = blog.slug;
    const label = `[${i + 1}/${allBlogs.length}]`;

    if (ONLY && !ONLY.includes(slug)) continue;

    const def = TABLES[slug];
    if (!def) {
      summary.skippedNoEntry++;
      missing.push(slug);
      continue;
    }

    try {
      const full = await httpReqRetry("GET", `${PAYLOAD_URL}/api/blogs/${blog.id}?depth=0`, null, authHeaders);
      if (full.status !== 200) throw new Error(`Fetch blog ${blog.id} failed: ${full.status}`);
      const content = full.data.content;

      const found = findComparisonBlock(content);
      if (!found) {
        summary.noTableBlock++;
        noBlock.push(slug);
        console.log(`${label} ⚠ no comparisonTable block — ${slug}`);
        continue;
      }

      const keepId = found.node.fields?.id;
      const keepBlockName = found.node.fields?.blockName || "";
      found.node.fields = { ...buildTableFields(def, keepId), blockName: keepBlockName };

      if (!DRY_RUN) {
        const patchRes = await httpReqRetry("PATCH", `${PAYLOAD_URL}/api/blogs/${blog.id}`, { content }, authHeaders);
        if (patchRes.status !== 200) throw new Error(`PATCH ${blog.id} failed: ${patchRes.status} — ${JSON.stringify(patchRes.data).slice(0, 200)}`);
      }
      summary.patched++;
      console.log(`${label} ✓ ${DRY_RUN ? "(dry) " : ""}${slug}`);
      if (!DRY_RUN) await sleep(PACE_MS);
    } catch (err) {
      summary.errors++;
      console.log(`${label} ✗ ERROR ${slug}: ${err.message}`);
    }
  }

  console.log("\n────────────── SUMMARY ──────────────");
  console.log(`Patched:            ${summary.patched}`);
  console.log(`No table block:     ${summary.noTableBlock}`);
  console.log(`Errors:             ${summary.errors}`);
  console.log(`Live blogs w/o an authored table yet: ${summary.skippedNoEntry}`);
  if (noBlock.length) {
    console.log(`\nBlogs missing a comparisonTable block (need insert):`);
    noBlock.forEach((s) => console.log(`  - ${s}`));
  }
  if (!ONLY && missing.length) {
    console.log(`\nMISSING authored tables (${missing.length}) — next batches:`);
    missing.forEach((s) => console.log(`  - ${s}`));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
