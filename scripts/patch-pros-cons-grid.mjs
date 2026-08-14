#!/usr/bin/env node
/**
 * patch-pros-cons-grid.mjs — Transform text-based Pros/Cons sections
 * into visual prosConsGrid blocks across all blog posts.
 *
 * Detects paired headings:
 *   Pros / Cons
 *   Advantages / Disadvantages
 *   Benefits / Risks (or Drawbacks, Limitations, Challenges)
 *
 * Extracts bullet items from paragraphs (– prefixed), list items, and
 * sub-headings, then replaces the entire section with a single
 * prosConsGrid Lexical block.
 *
 * Usage:
 *   node scripts/patch-pros-cons-grid.mjs --dry-run
 *   node scripts/patch-pros-cons-grid.mjs --only=slug1,slug2
 *   node scripts/patch-pros-cons-grid.mjs
 */

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

/** Extract plain text from a Lexical node recursively. */
function getPlainText(node) {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  if (Array.isArray(node.children)) {
    return node.children.map(getPlainText).join("");
  }
  return "";
}

// ───────────────────────── HEADING MATCHERS ──────────────────────────
const PROS_RE = /^(pros|advantages|benefits)\b/i;
const CONS_RE = /^(cons|disadvantages|risks?\s*(and\s*(considerations|drawbacks))?|drawbacks|limitations|challenges)\b/i;

// Also match compound: "Pros and Cons of X"
const PROS_AND_CONS_RE = /^pros\s+and\s+cons\b/i;

function isProsHeading(text) {
  return PROS_RE.test(text.trim()) && !PROS_AND_CONS_RE.test(text.trim());
}

function isConsHeading(text) {
  return CONS_RE.test(text.trim());
}

/** Extract a clean label from heading text, e.g. "Advantages of PGT" → "Advantages" */
function extractLabel(text, type) {
  const t = text.trim().replace(/:$/, "").trim();
  if (type === "pros") {
    const m = t.match(/^(pros|advantages|benefits)/i);
    return m ? m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase() : "Pros";
  }
  const m = t.match(/^(cons|disadvantages|risks?\s*(and\s*(considerations|drawbacks))?|drawbacks|limitations|challenges)/i);
  return m ? m[0].charAt(0).toUpperCase() + m[0].slice(1).toLowerCase() : "Cons";
}

/** Get the heading level as a number (h1=1, h2=2, etc.) */
function headingLevel(node) {
  if (node.type !== "heading" || !node.tag) return 99;
  return parseInt(node.tag.replace("h", ""), 10) || 99;
}

// ────────────────────── ITEM EXTRACTION ──────────────────────────

/** True if text looks like an intro/preamble sentence, not an actual item. */
function isIntroText(text) {
  // Ends with colon — "Here are the risks:" or "Benefits include:"
  if (/[,:]\s*$/.test(text)) return true;
  // Starts with "While", "Although" and is long (explanatory preamble)
  if (/^(while|although|however|there are|it is|these)\b/i.test(text) && text.length > 80) return true;
  return false;
}

/**
 * Extract items from a range of Lexical children (between two headings).
 * Strategy: if the section has sub-headings (h3/h4), extract ONLY those
 * heading texts (they represent the item names; the paragraphs below are
 * just elaborations). Otherwise, extract from paragraphs and list items.
 */
function extractItems(children, startIdx, endIdx) {
  const items = [];
  const seen = new Set();

  function addUnique(text) {
    const lower = text.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      items.push(text);
    }
  }

  // Check if section has sub-headings
  const hasSubHeadings = children.slice(startIdx, endIdx).some(
    (n) => n.type === "heading"
  );

  if (hasSubHeadings) {
    // Extract ONLY sub-heading texts (skip paragraph elaborations)
    for (let i = startIdx; i < endIdx; i++) {
      const node = children[i];
      if (node.type !== "heading") continue;
      const text = getPlainText(node).trim();
      if (!text) continue;
      const cleaned = text.replace(/^\d+[\.\):\s]+\s*/, "").trim();
      if (cleaned) addUnique(cleaned);
    }
  } else {
    // Extract from paragraphs and lists (simple pattern)
    for (let i = startIdx; i < endIdx; i++) {
      const node = children[i];
      if (!node) continue;
      if (node.type === "block") continue;

      if (node.type === "paragraph") {
        const text = getPlainText(node).trim();
        if (!text) continue;
        const cleaned = text.replace(/^[–\-•]\s*/, "").trim();
        if (!cleaned) continue;
        if (isIntroText(cleaned)) continue;
        addUnique(cleaned);
      }

      if (node.type === "list" && node.children) {
        for (const li of node.children) {
          const text = getPlainText(li).trim();
          if (!text) continue;
          const cleaned = text.replace(/^[–\-•]\s*/, "").trim();
          if (cleaned) addUnique(cleaned);
        }
      }
    }
  }

  return items;
}

// ──────────────────── FIND PROS/CONS PAIRS ──────────────────────
/**
 * Scan the root children for paired Pros/Cons heading sections.
 * Returns an array of pairs: { prosStart, consStart, consEnd, prosItems, consItems, prosLabel, consLabel }
 * Indices refer to root.children positions.
 */
function findProsConsPairs(children) {
  const pairs = [];
  const used = new Set(); // track already-matched indices

  for (let i = 0; i < children.length; i++) {
    if (used.has(i)) continue;
    const node = children[i];
    if (node.type !== "heading") continue;

    const text = getPlainText(node).trim();

    // === Pattern 1: "Pros and Cons of X:" — single heading with list below ===
    if (PROS_AND_CONS_RE.test(text)) {
      // Look for a list right after with "Pros: ..." and "Cons: ..." items
      if (i + 1 < children.length && children[i + 1].type === "list") {
        const list = children[i + 1];
        const prosItems = [];
        const consItems = [];
        for (const li of (list.children || [])) {
          const liText = getPlainText(li).trim();
          if (/^pros:\s*/i.test(liText)) {
            prosItems.push(liText.replace(/^pros:\s*/i, "").trim());
          } else if (/^cons:\s*/i.test(liText)) {
            consItems.push(liText.replace(/^cons:\s*/i, "").trim());
          }
        }
        if (prosItems.length >= 2 && consItems.length >= 2) {
          pairs.push({
            startIdx: i,
            endIdx: i + 2, // heading + list
            prosItems,
            consItems,
            prosLabel: "Pros",
            consLabel: "Cons",
          });
          used.add(i);
          used.add(i + 1);
          continue;
        }
      }
      continue; // skip if not matching the expected format
    }

    // === Pattern 2: Separate Pros heading + Cons heading ===
    if (!isProsHeading(text)) continue;

    const prosLevel = headingLevel(node);
    const prosLabel = extractLabel(text, "pros");

    // Scan forward for the matching Cons heading (same or higher level)
    let consIdx = -1;
    for (let j = i + 1; j < children.length; j++) {
      const cn = children[j];
      if (cn.type !== "heading") continue;
      const ct = getPlainText(cn).trim();
      const cLevel = headingLevel(cn);

      // If we hit a heading at same or higher level that's NOT cons, and NOT a sub-heading: stop
      if (cLevel <= prosLevel && !isConsHeading(ct)) break;

      if (isConsHeading(ct) && cLevel === prosLevel) {
        consIdx = j;
        break;
      }
    }

    if (consIdx === -1) continue; // no matching cons heading

    const consLevel = headingLevel(children[consIdx]);
    const consLabel = extractLabel(getPlainText(children[consIdx]).trim(), "cons");

    // Find where the cons section ends (next heading at same or higher level)
    let consEnd = children.length;
    for (let j = consIdx + 1; j < children.length; j++) {
      const cn = children[j];
      if (cn.type !== "heading") continue;
      const cLevel = headingLevel(cn);
      if (cLevel <= consLevel) {
        consEnd = j;
        break;
      }
    }

    // Extract pros items (between pros heading and cons heading)
    const prosItems = extractItems(children, i + 1, consIdx);
    // Extract cons items (between cons heading and consEnd)
    const consItems = extractItems(children, consIdx + 1, consEnd);

    // Filter out meta-headers like "Benefits of IVF" that are section titles, not items
    const META_RE = /^(pros|cons|advantages?|disadvantages?|benefits?|risks?|drawbacks?|limitations?|challenges?)\s+(of|for)\b/i;
    const filteredPros = prosItems.filter((t) => !META_RE.test(t) && !/^\s*what\s/i.test(t));
    const filteredCons = consItems.filter((t) => !META_RE.test(t) && !/^\s*what\s/i.test(t));

    // Require at least 2 items on each side for a meaningful grid
    if (filteredPros.length < 2 || filteredCons.length < 2) continue;

    pairs.push({
      startIdx: i,
      endIdx: consEnd,
      prosItems: filteredPros,
      consItems: filteredCons,
      prosLabel,
      consLabel,
    });

    // Mark all indices as used
    for (let k = i; k < consEnd; k++) used.add(k);
    i = consEnd - 1; // skip past this pair
  }

  return pairs;
}

// ──────────────────── BUILD BLOCK NODE ──────────────────────────
function buildProsConsBlock(pair) {
  return {
    type: "block",
    format: "",
    version: 2,
    fields: {
      id: uid(),
      blockType: "prosConsGrid",
      blockName: "",
      prosLabel: pair.prosLabel,
      consLabel: pair.consLabel,
      pros: pair.prosItems.map((text) => ({ id: uid(), text })),
      cons: pair.consItems.map((text) => ({ id: uid(), text })),
    },
  };
}

// ──────────────────── TRANSFORM CONTENT ──────────────────────────
/**
 * Transform a blog's Lexical content — find all pros/cons pairs and
 * replace them with prosConsGrid blocks.
 * Returns { changed, content, pairs } where changed = true if modifications were made.
 */
function transformContent(content) {
  if (!content?.root?.children) return { changed: false, content, pairs: [] };

  const children = [...content.root.children];
  const pairs = findProsConsPairs(children);

  if (pairs.length === 0) return { changed: false, content, pairs: [] };

  // Apply replacements in reverse order so indices stay valid
  const sortedPairs = [...pairs].sort((a, b) => b.startIdx - a.startIdx);
  for (const pair of sortedPairs) {
    const block = buildProsConsBlock(pair);
    children.splice(pair.startIdx, pair.endIdx - pair.startIdx, block);
  }

  const newContent = {
    ...content,
    root: {
      ...content.root,
      children,
    },
  };

  return { changed: true, content: newContent, pairs };
}

// ──────────────────── MAIN ──────────────────────────
async function main() {
  console.log(`\n╔══════════════════════════════════════════════════════════╗`);
  console.log(`║  patch-pros-cons-grid  ${DRY_RUN ? "(DRY RUN)" : "(LIVE)"}                       ║`);
  console.log(`╚══════════════════════════════════════════════════════════╝\n`);

  const token = await login();
  const authHeaders = { Authorization: `Bearer ${token}` };

  // Fetch all blogs
  let allBlogs = [];
  let page = 1;
  while (true) {
    const r = await httpReqRetry("GET", `${PAYLOAD_URL}/api/blogs?limit=50&page=${page}&depth=0&sort=createdAt`, null, authHeaders);
    if (r.status !== 200) throw new Error(`Fetch blogs failed: ${r.status}`);
    allBlogs.push(...(r.data.docs || []));
    if (!r.data.hasNextPage) break;
    page++;
  }

  console.log(`  Fetched ${allBlogs.length} blogs total.\n`);

  // Filter if --only
  if (ONLY) {
    allBlogs = allBlogs.filter((b) => ONLY.includes(b.slug));
    console.log(`  Filtered to ${allBlogs.length} blogs via --only.\n`);
  }

  let patched = 0;
  let skipped = 0;
  const patchedSlugs = [];
  const skippedSlugs = [];

  for (let idx = 0; idx < allBlogs.length; idx++) {
    const blog = allBlogs[idx];
    const prefix = `[${idx + 1}/${allBlogs.length}] ${blog.slug}`;

    const { changed, content: newContent, pairs } = transformContent(blog.content);

    if (!changed) {
      skipped++;
      continue;
    }

    console.log(`${prefix}`);
    for (const pair of pairs) {
      console.log(`    ✦ Found: ${pair.prosLabel} (${pair.prosItems.length} items) / ${pair.consLabel} (${pair.consItems.length} items)`);
      console.log(`      Pros: ${pair.prosItems.slice(0, 3).map(t => t.slice(0, 60)).join(" | ")}${pair.prosItems.length > 3 ? " ..." : ""}`);
      console.log(`      Cons: ${pair.consItems.slice(0, 3).map(t => t.slice(0, 60)).join(" | ")}${pair.consItems.length > 3 ? " ..." : ""}`);
    }

    if (!DRY_RUN) {
      const patchRes = await httpReqRetry("PATCH", `${PAYLOAD_URL}/api/blogs/${blog.id}`, { content: newContent }, authHeaders);
      if (patchRes.status === 200) {
        console.log(`    ✅ PATCHED`);
      } else {
        console.log(`    ❌ PATCH FAILED: ${patchRes.status} — ${JSON.stringify(patchRes.data).slice(0, 200)}`);
        continue;
      }
      await sleep(PACE_MS);
    } else {
      console.log(`    ⏸ DRY RUN — would patch`);
    }

    patched++;
    patchedSlugs.push(blog.slug);
  }

  console.log(`\n────────────────────────────────────────`);
  console.log(`  ${DRY_RUN ? "Would patch" : "Patched"}: ${patched} blogs`);
  console.log(`  Skipped (no pros/cons): ${skipped}`);
  if (patchedSlugs.length) {
    console.log(`\n  Affected slugs:`);
    patchedSlugs.forEach((s) => console.log(`    - ${s}`));
  }
  console.log();
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
