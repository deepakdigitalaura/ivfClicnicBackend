#!/usr/bin/env node
/**
 * patch-flat-paragraph-tables.mjs — Fix WordPress-import artifacts where an
 * HTML table got flattened into a flat run of bold-header / bold-rowlabel
 * paragraph nodes (each cell its own paragraph) instead of a real
 * `comparisonTable` block. Detected via scripts/_tmp-find-flat-tables.mjs
 * scan of all 279 blogs — exactly 3 blogs affected.
 *
 * Re-detects the flat run on the live-fetched content (sliding window: bold
 * header of width K, followed by 1+ row-groups of K where col 0 is bold and
 * the rest are plain), splices it out, and inserts a proper comparisonTable
 * block in its place.
 *
 * Usage:
 *   node scripts/patch-flat-paragraph-tables.mjs --dry-run --only=<slug>
 *   node scripts/patch-flat-paragraph-tables.mjs --only=<slug>
 */

const PAYLOAD_URL = process.env.PAYLOAD_URL || "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL = process.env.SEED_ADMIN_EMAIL || "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Zxcvbnm@123";
const DRY_RUN = process.argv.includes("--dry-run");
const ONLY_ARG = process.argv.find((a) => a.startsWith("--only="));
const ONLY = ONLY_ARG ? ONLY_ARG.slice("--only=".length).split(",").map((s) => s.trim()).filter(Boolean) : null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function httpReq(method, url, body, headers = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), method === "PATCH" ? 90000 : 45000);
  try {
    const opts = { method, headers: { ...headers }, signal: controller.signal };
    if (body) {
      opts.headers["Content-Type"] = "application/json";
      opts.body = typeof body === "string" ? body : JSON.stringify(body);
    }
    const res = await fetch(url, opts);
    const txt = await res.text();
    clearTimeout(timer);
    try { return { status: res.status, data: JSON.parse(txt) }; }
    catch { return { status: res.status, data: txt }; }
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

async function httpReqRetry(method, url, body, headers = {}, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try { return await httpReq(method, url, body, headers); }
    catch (err) {
      if (attempt === retries) throw err;
      await sleep(4000 * attempt);
    }
  }
}

async function login() {
  const r = await httpReqRetry("POST", `${PAYLOAD_URL}/api/users/login`, { email: EMAIL, password: PASSWORD });
  if (r.status !== 200) throw new Error(`Login failed: ${r.status} — ${JSON.stringify(r.data)}`);
  return r.data.token;
}

function uid() {
  return Math.random().toString(36).slice(2, 14) + Math.random().toString(36).slice(2, 6);
}

function isSingleTextParagraph(node) {
  if (!node || node.type !== "paragraph") return false;
  if (!Array.isArray(node.children) || node.children.length !== 1) return false;
  const c = node.children[0];
  return c.type === "text" && typeof c.text === "string" && c.text.trim().length > 0;
}
function isBold(node) { return ((node.children[0].format ?? 0) & 1) === 1; }
function text(node) { return node.children[0].text.trim(); }

/** Find the single best flat-table run in a children array (widest match wins). */
function findFlatTable(children) {
  let best = null;
  for (let i = 0; i < children.length; i++) {
    for (let K = 2; K <= 6; K++) {
      if (i + K > children.length) continue;
      const header = children.slice(i, i + K);
      if (!header.every(isSingleTextParagraph)) continue;
      if (!header.every(isBold)) continue;
      if (!header.every((p) => text(p).length <= 60)) continue;

      let rows = 0;
      let j = i + K;
      while (j + K <= children.length) {
        const group = children.slice(j, j + K);
        if (!group.every(isSingleTextParagraph)) break;
        if (!isBold(group[0])) break;
        if (group.slice(1).some(isBold)) break;
        rows++;
        j += K;
      }
      if (rows >= 1) {
        const length = K + rows * K;
        if (!best || length > best.length) {
          best = { startIndex: i, endIndex: j, length, columns: K, rows, headerTexts: header.map(text) };
        }
      }
    }
  }
  return best;
}

/** Strip a leading "<RowLabel> " duplicate from a cell value, if present
 * (WordPress import sometimes bled the row label into the first cell). */
function cleanCell(value, rowLabel) {
  const prefix = rowLabel + " ";
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

function buildComparisonTableNode(children, match) {
  const { startIndex, columns: K, rows } = match;
  const header = children.slice(startIndex, startIndex + K).map(text);
  const rowHeader = header[0];
  const columns = header.slice(1).map((h) => ({ id: uid(), header: h }));

  const dataRows = [];
  for (let r = 0; r < rows; r++) {
    const base = startIndex + K + r * K;
    const group = children.slice(base, base + K).map(text);
    const rowLabel = group[0];
    const cells = group.slice(1).map((v) => ({ id: uid(), value: cleanCell(v, rowLabel) }));
    dataRows.push({ id: uid(), rowLabel, cells });
  }

  return {
    type: "block",
    fields: {
      id: uid(),
      blockName: "",
      blockType: "comparisonTable",
      rowHeader,
      columns,
      rows: dataRows,
    },
    format: "",
    version: 2,
  };
}

async function main() {
  console.log(`[flat-tables] ${DRY_RUN ? "DRY RUN" : "LIVE"}`);
  if (ONLY) console.log(`[flat-tables] --only filter: ${ONLY.join(", ")}`);

  const token = await login();
  const authHeaders = { Authorization: `JWT ${token}` };
  console.log("[flat-tables] ✓ Authenticated");

  // Known affected slugs (from full-corpus scan) — restrict the loop to these
  // unless --only narrows it further, to avoid touching unrelated content.
  const KNOWN_AFFECTED = [
    "asthenospermia-understanding-the-condition-and-exploring-assisted-reproductive-technologies-art-options",
    "can-natural-cycle-ivf-reduce-the-risk-of-ovarian-hyperstimulation",
    "government-vs-private-ivf-centres-in-ahmedabad-which-one-is-better",
  ];
  const targets = ONLY ?? KNOWN_AFFECTED;

  for (const slug of targets) {
    const found = await httpReqRetry("GET", `${PAYLOAD_URL}/api/blogs?where[slug][equals]=${encodeURIComponent(slug)}&depth=0&limit=1`, null, authHeaders);
    const blog = found.data?.docs?.[0];
    if (!blog) { console.log(`✗ ${slug}: not found`); continue; }

    const full = await httpReqRetry("GET", `${PAYLOAD_URL}/api/blogs/${blog.id}?depth=0`, null, authHeaders);
    if (full.status !== 200) { console.log(`✗ ${slug}: fetch failed ${full.status}`); continue; }
    const content = full.data.content;
    const children = content.root.children;

    const match = findFlatTable(children);
    if (!match) { console.log(`✗ ${slug}: no flat-table pattern found (already fixed?)`); continue; }

    console.log(`\n${slug}`);
    console.log(`  match: startIndex=${match.startIndex} cols=${match.columns} rows=${match.rows} header=[${match.headerTexts.join(" | ")}]`);

    const tableNode = buildComparisonTableNode(children, match);
    console.log("  built block:", JSON.stringify(tableNode.fields, null, 2));

    const newChildren = [
      ...children.slice(0, match.startIndex),
      tableNode,
      ...children.slice(match.endIndex),
    ];
    const newContent = { ...content, root: { ...content.root, children: newChildren } };

    if (!DRY_RUN) {
      const patchRes = await httpReqRetry("PATCH", `${PAYLOAD_URL}/api/blogs/${blog.id}`, { content: newContent }, authHeaders);
      if (patchRes.status !== 200) {
        console.log(`  ✗ PATCH failed: ${patchRes.status} — ${JSON.stringify(patchRes.data).slice(0, 300)}`);
        continue;
      }
      console.log(`  ✓ patched`);
      await sleep(2000);
    } else {
      console.log(`  (dry run — no PATCH sent)`);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
