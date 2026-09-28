/* =====================================================================
 * Seed the `press` collection into Sanity from the existing hardcoded
 * PRESS_CLIPPINGS array (src/lib/press.ts) — verbatim, no content changes.
 * Idempotent: each doc's _id is deterministic (`press-<slug>`), written via
 * createOrReplace, so re-running is always safe.
 *
 * This is step 1 of the Press migration: it has ZERO effect on the live
 * site — the frontend keeps reading PRESS_CLIPPINGS from code until a
 * separate follow-up commit flips press/page.tsx and press/[slug]/page.tsx
 * to read from Sanity instead.
 *
 * Run:
 *   npx tsx --env-file=.env.local --tsconfig tsconfig.json \
 *     scripts/seed-press.mts [--dry-run]
 * ===================================================================== */
import { createClient } from "next-sanity";
import { PRESS_CLIPPINGS } from "../src/lib/press";

const DRY = process.argv.includes("--dry-run");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET");
}
if (!DRY && !token) {
  throw new Error("Missing SANITY_API_TOKEN (required to write — pass --dry-run to skip)");
}

const sanity = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log(`Seeding ${PRESS_CLIPPINGS.length} press clippings ${DRY ? "(dry run)" : ""}`);

  let written = 0;
  for (let i = 0; i < PRESS_CLIPPINGS.length; i++) {
    const c = PRESS_CLIPPINGS[i];
    const doc = {
      _id: `press-${c.slug}`,
      _type: "press",
      slug: { _type: "slug", current: c.slug },
      headline: c.headline,
      headlineOriginal: c.headlineOriginal ?? null,
      standfirst: c.standfirst ?? null,
      publication: c.publication,
      edition: c.edition ?? null,
      date: c.date ?? null,
      byline: c.byline ?? null,
      language: c.language,
      summary: c.summary,
      bodyText: c.bodyText,
      doctorsQuoted: c.doctorsQuoted,
      image: c.image,
      thumb: c.thumb,
      width: c.width,
      height: c.height,
      order: i,
      published: true,
    };

    if (DRY) {
      console.log(`[dry-run] would write ${doc._id} — "${c.headline}"`);
      continue;
    }

    await sanity.createOrReplace(doc);
    written++;
    console.log(`[ok] ${doc._id} — "${c.headline}"`);
    await sleep(150);
  }

  console.log(DRY ? `\n[dry-run] ${PRESS_CLIPPINGS.length} docs would be written` : `\n✅ ${written}/${PRESS_CLIPPINGS.length} docs written`);
}

main().catch((e) => {
  console.error("[seed-press] FAILED:", e);
  process.exit(1);
});
