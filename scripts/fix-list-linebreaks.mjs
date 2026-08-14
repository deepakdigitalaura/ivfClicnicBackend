#!/usr/bin/env node
/**
 * fix-list-linebreaks.mjs
 *
 * Problem: some blog listitem nodes contain linebreak nodes followed by
 * more text — e.g. a single <li> stores two bullets separated by <br>.
 * This makes the "3rd bullet" render as plain text after the 2nd bullet.
 *
 * Fix: for every listitem whose children contain linebreak nodes, split
 * the children into separate listitems (one per non-empty segment).
 * Trailing-only linebreaks are stripped silently.
 *
 * Run:      node scripts/fix-list-linebreaks.mjs
 * Dry-run:  node scripts/fix-list-linebreaks.mjs --dry-run
 */

const BASE     = process.env.PAYLOAD_URL          ?? "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL    = process.env.SEED_ADMIN_EMAIL     ?? "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD  ?? "Zxcvbnm@123";
const DRY_RUN  = process.argv.includes("--dry-run");

const log  = msg => console.log(`[fix-lists] ${msg}`);
const wait = ms  => new Promise(r => setTimeout(r, ms));

// ── Lexical content helpers ──────────────────────────────────────────

/**
 * Split a listitem's children array on linebreak nodes.
 * Returns an array of child-groups; empty groups (bare linebreaks) are dropped.
 */
function splitOnLinebreaks(children) {
  const groups = [];
  let current = [];

  for (const child of children) {
    if (child.type === "linebreak") {
      if (current.length > 0) {
        groups.push(current);
        current = [];
      }
      // consecutive / leading linebreaks → skip
    } else {
      current.push(child);
    }
  }

  if (current.length > 0) groups.push(current);
  return groups;
}

/**
 * Fix one list node.
 * Returns { changed: boolean, node }.
 */
function fixList(listNode) {
  const oldChildren = listNode.children ?? [];
  const newChildren = [];
  let changed = false;
  let counter = 1;

  for (const item of oldChildren) {
    if (item.type !== "listitem") {
      newChildren.push(item);
      counter++;
      continue;
    }

    const hasBreak = (item.children ?? []).some(c => c.type === "linebreak");

    if (!hasBreak) {
      // Keep but renumber so values stay sequential after earlier splits
      const updated = { ...item, value: counter };
      if (updated.value !== item.value) changed = true;
      newChildren.push(updated);
      counter++;
      continue;
    }

    changed = true;
    const groups = splitOnLinebreaks(item.children ?? []);

    if (groups.length === 0) {
      // Item was only linebreaks — drop it
      continue;
    }

    for (const group of groups) {
      newChildren.push({ ...item, value: counter, children: group });
      counter++;
    }
  }

  if (!changed) return { changed: false, node: listNode };
  return { changed: true, node: { ...listNode, children: newChildren } };
}

/**
 * Recursively walk Lexical nodes and fix every list found.
 * Returns { changed: boolean, nodes }.
 */
function fixNodes(nodes) {
  if (!Array.isArray(nodes)) return { changed: false, nodes };

  let anyChanged = false;
  const out = nodes.map(node => {
    if (node.type === "list") {
      const { changed, node: fixed } = fixList(node);
      if (changed) { anyChanged = true; return fixed; }
      return node;
    }

    if (Array.isArray(node.children) && node.children.length > 0) {
      const { changed, nodes: fixedChildren } = fixNodes(node.children);
      if (changed) { anyChanged = true; return { ...node, children: fixedChildren }; }
    }

    return node;
  });

  return { changed: anyChanged, nodes: out };
}

/**
 * Fix a blog's Lexical content field.
 * Returns { changed: boolean, content }.
 */
function fixContent(content) {
  if (!content?.root?.children) return { changed: false, content };

  const { changed, nodes } = fixNodes(content.root.children);
  if (!changed) return { changed: false, content };

  return {
    changed: true,
    content: { ...content, root: { ...content.root, children: nodes } },
  };
}

// ── API helpers ──────────────────────────────────────────────────────

async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const { token } = await res.json();
  return { Authorization: `JWT ${token}` };
}

async function fetchAllBlogs(auth) {
  const all = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `${BASE}/api/blogs?limit=100&page=${page}&depth=0`,
      { headers: auth }
    );
    if (!res.ok) throw new Error(`Fetch p${page}: ${res.status}`);
    const data = await res.json();
    all.push(...(data.docs ?? []));
    if (!data.hasNextPage) break;
    page++;
    await wait(400);
  }
  return all;
}

async function patchBlog(id, content, auth) {
  const res = await fetch(`${BASE}/api/blogs/${id}`, {
    method: "PATCH",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PATCH failed (${res.status}): ${text.slice(0, 300)}`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────

async function run() {
  log(`Target : ${BASE}`);
  if (DRY_RUN) log("⚠  DRY RUN — reads only, no writes\n");

  const auth = await login();
  log("Login OK\n");

  const blogs = await fetchAllBlogs(auth);
  log(`Fetched ${blogs.length} blogs\n`);

  let fixed = 0;
  let clean = 0;
  let errors = 0;

  for (let i = 0; i < blogs.length; i++) {
    const b = blogs[i];
    const label = `[${String(i + 1).padStart(3)}/${blogs.length}] ${b.slug}`;

    const { changed, content: newContent } = fixContent(b.content);

    if (!changed) {
      log(`${label} — clean`);
      clean++;
      continue;
    }

    if (DRY_RUN) {
      log(`${label} — WOULD FIX`);
      fixed++;
      continue;
    }

    try {
      await patchBlog(b.id, newContent, auth);
      log(`${label} — FIXED ✓`);
      fixed++;
    } catch (err) {
      log(`${label} — ERROR: ${err.message}`);
      errors++;
    }

    await wait(300); // pace requests, one at a time
  }

  log("\n" + "─".repeat(60));
  log(`Fixed  : ${fixed}`);
  log(`Clean  : ${clean}`);
  if (errors) log(`Errors : ${errors}`);
  log("Done!");
}

run().catch(err => {
  console.error("[fix-lists] FATAL:", err.message);
  process.exit(1);
});
