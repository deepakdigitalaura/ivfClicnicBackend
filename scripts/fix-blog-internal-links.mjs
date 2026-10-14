#!/usr/bin/env node
/* =====================================================================
 * Point the links inside blog articles at the current URLs.
 *
 * PR #60 fixed the header, footer and templates. The article bodies were
 * left alone, and they carry the bulk of it: 27 retired addresses linked
 * 699 times across the blog, led by /what-is-ivf in 161 posts. Every one of
 * those links costs the reader a redirect, and shows Google the site linking
 * to addresses it has retired.
 *
 * WHAT IT CHANGES
 *   Only the value of a "url" key -- a Lexical link node's fields.url, and
 *   the url on a block's buttons. Never a "text" value, so no visible word on
 *   any page changes. The link label, its position and the surrounding copy
 *   stay exactly as they are; only the address behind it is corrected.
 *
 * WHY IT IS SAFE TO RUN ON EVERY DEPLOY
 *   It matches whole paths, so "/pcos" can never match inside "/pcos-diet",
 *   and it only writes a document that actually contains one of the old
 *   addresses. After the first run nothing matches, so later runs are no-ops.
 *   contentRaw is the only field touched; lastUpdatedAt is deliberately left
 *   alone so the "Updated" date shown on 300 articles does not jump.
 *
 * EVERY DESTINATION WAS VERIFIED
 *   All 27 were fetched from the live site on 14 October 2026 and each
 *   returned 200 directly, with no redirect of its own. The mapping below is
 *   that verified list -- see October 2026/blog-old-links-by-url.csv.
 *
 * Runs from `prebuild`, so merging to main is the whole deploy step: the
 * workflow pulls the production .env (carrying SANITY_API_TOKEN) before
 * building, the same route seed-manual-reviews.mjs relies on.
 *
 * Remove the prebuild wiring once a deploy reports "0 posts changed" --
 * at that point every link has been corrected and the script has no work
 * left to do.
 *
 * Manual run:  node scripts/fix-blog-internal-links.mjs [--dry-run]
 * ===================================================================== */
import { createClient } from "next-sanity";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DRY = process.argv.includes("--dry-run");
const log = (...a) => console.log("[fix-blog-links]", ...a);

function loadEnvLocal() {
  const envPath = join(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  try {
    for (const raw of readFileSync(envPath, "utf8").split("\n")) {
      const m = /^([A-Z0-9_]+)=(.*)$/.exec(raw.trim());
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch { /* ignore */ }
}
loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

/* Retired address -> current address. Each destination was fetched live and
 * returned 200 with no redirect of its own. */
const MAP = {
  "/asthenospermia": "/treatments/asthenospermia",
  "/azoospermia": "/treatments/azoospermia",
  "/best-ivf-doctors": "/doctors",
  "/blastocyst-culture-blastocyst-transfer": "/treatments/blastocyst-transfer",
  "/cryopreservation": "/treatments/cryopreservation",
  "/egg-donation": "/treatments/egg-donation",
  "/egg-freezing": "/treatments/egg-freezing",
  "/embryo-donation": "/treatments/embryo-donation",
  "/endometriosis": "/treatments/endometriosis",
  "/erectile-dysfunction": "/treatments/erectile-dysfunction",
  "/fibroids": "/treatments/fibroids",
  "/icsi-treatment-intracytoplasmic-sperm-injection": "/treatments/icsi",
  "/intra-uterine-insemination-iui": "/treatments/iui",
  "/intracytoplasmic-morphologically-selected-sperm-injection-imsi": "/treatments/imsi",
  "/ivf-failure": "/treatments/ivf-failure",
  "/laser-assisted-hatching": "/treatments/laser-hatching",
  "/magnetic-activated-cell-sorting-macs": "/treatments/macs",
  "/normal-delivery-services-in-ahmedabad": "/services/normal-delivery",
  "/oligospermia": "/treatments/oligospermia",
  "/ovarian-rejuvenation": "/treatments/ovarian-rejuvenation",
  "/ovarian-reserve": "/treatments/ovarian-reserve",
  "/pcos": "/treatments/pcos",
  "/physiological-intracytoplasmic-sperm-injection-picsi": "/treatments/picsi",
  "/sperm-donation": "/treatments/sperm-donation",
  "/spindle-view-icsi": "/treatments/spindle-view-icsi",
  "/varicocele": "/treatments/varicocele",
  "/what-is-ivf": "/treatments/ivf",
};

const ORIGIN = "https://ivfclinic.com";

/* Resolve one href. Returns null when it should be left alone. Handles the
 * absolute form and a trailing slash, and preserves any query or fragment. */
function remap(href) {
  if (typeof href !== "string" || !href) return null;

  let rest = href;
  let prefix = "";
  if (rest.startsWith(ORIGIN)) {
    prefix = ORIGIN;
    rest = rest.slice(ORIGIN.length) || "/";
  }
  if (!rest.startsWith("/")) return null;

  const cut = rest.search(/[?#]/);
  const tail = cut === -1 ? "" : rest.slice(cut);
  const path = cut === -1 ? rest : rest.slice(0, cut);

  const hadSlash = path.length > 1 && path.endsWith("/");
  const bare = hadSlash ? path.slice(0, -1) : path;

  const target = MAP[bare];
  if (!target) return null;
  return prefix + target + tail;
}

/* Walk the Lexical tree and rewrite every "url" value. "text" is never
 * touched, so nothing a reader sees changes. */
function rewrite(node, changes) {
  if (Array.isArray(node)) {
    for (const child of node) rewrite(child, changes);
    return;
  }
  if (!node || typeof node !== "object") return;

  for (const [key, value] of Object.entries(node)) {
    if (key === "url" && typeof value === "string") {
      const next = remap(value);
      if (next) {
        node[key] = next;
        changes.push([value, next]);
      }
    } else if (value && typeof value === "object") {
      rewrite(value, changes);
    }
  }
}

async function main() {
  if (DRY) log("dry run - nothing will be written");

  if (!projectId) {
    log("no Sanity project configured - skipping (expected outside deploy).");
    return;
  }
  if (!token && !DRY) {
    log("no Sanity write token here - skipping (expected outside deploy).");
    return;
  }

  const client = createClient({
    projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token,
  });

  const posts = await client.fetch(
    `*[_type == "blog" && status != "draft"]{ _id, slug, contentRaw }`,
  );
  log(`${posts.length} published posts to check`);

  let changedPosts = 0;
  let changedLinks = 0;
  const tally = new Map();

  for (const post of posts) {
    if (typeof post.contentRaw !== "string") continue;

    // Cheap pre-filter: skip the parse unless an old address is in there.
    if (!Object.keys(MAP).some((old) => post.contentRaw.includes(`"${old}`))) continue;

    let doc;
    try {
      doc = JSON.parse(post.contentRaw);
    } catch {
      log(`${post.slug} -> SKIPPED, contentRaw is not valid JSON`);
      continue;
    }

    const changes = [];
    rewrite(doc, changes);
    if (!changes.length) continue;

    for (const [from] of changes) {
      tally.set(from, (tally.get(from) ?? 0) + 1);
    }
    changedPosts += 1;
    changedLinks += changes.length;

    if (!DRY) {
      await client
        .patch(post._id)
        .set({ contentRaw: JSON.stringify(doc) })
        .commit({ autoGenerateArrayKeys: false });
    }
    log(`${post.slug} -> ${changes.length} link${changes.length === 1 ? "" : "s"}`);
  }

  log("");
  for (const [from, n] of [...tally.entries()].sort((a, b) => b[1] - a[1])) {
    log(`  ${String(n).padStart(3)}x  ${from}  ->  ${MAP[from.replace(/\/$/, "")] ?? remap(from)}`);
  }
  log("");
  log(
    DRY
      ? `[dry-run] would change ${changedLinks} links across ${changedPosts} posts.`
      : `${changedLinks} links corrected across ${changedPosts} posts.`,
  );
}

main().catch((e) => {
  console.error("[fix-blog-links]", e);
  process.exit(1);
});
