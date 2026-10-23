#!/usr/bin/env node
/* =====================================================================
 * Tag blog articles with the centre city they relate to.
 *
 * Setting locationSlugs on a blog makes the article template render a link
 * to that city's page -- so this adds internal links to the location pages
 * without editing a single sentence of anyone's prose.
 *
 * WHY THIS WAS NEEDED
 *   Eleven of the location pages were linked only from the footer. Of 307
 *   published articles, just 20 carried a location tag, and five cities had
 *   none at all. Location pages earn 147 visits a month between them, with
 *   most of them on zero.
 *
 * HOW EACH PAIRING WAS CHOSEN
 *   1. the city is named in the article title or slug   (strongest)
 *   2. the city is named in the article body
 *   3. the article is about treatment cost, success rates, choosing a clinic
 *      or a core treatment that every centre offers -- used only to bring a
 *      city up to five, and only for articles that already earn traffic
 *
 *   An article whose title names one city is never tagged with another, so
 *   "choosing a clinic in Ahmedabad" cannot end up pointing at Varanasi.
 *   No article carries more than three cities; no city gets more than eight.
 *
 * The full reasoning, pairing by pairing, is in
 * October 2026/location-tagging-plan.csv.
 *
 * SAFE TO RE-RUN
 *   Tags are merged into whatever is already on the document, never replaced,
 *   and a document already carrying the tag is left untouched. Nothing else
 *   on the blog is written.
 *
 * Manual run:  node scripts/tag-blog-locations.mjs [--dry-run]
 * ===================================================================== */
import { createClient } from "next-sanity";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DRY = process.argv.includes("--dry-run");
const log = (...a) => console.log("[tag-blog-locations]", ...a);

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

/* article slug -> the city pages it should link to */
const TAGS = {
  "bavishi-fertility-institute-conducts-an-educational-programme-at-rajkot": ["bhuj", "bhavnagar"],
  "bed-rest-myth-during-ivf": ["mumbai"],
  "can-ivf-work-with-low-amh": ["mumbai"],
  "celebrated-republic-day-with-hope-and-happiness-at-bavishi-fertility-institute": ["mumbai", "bhuj"],
  "choosing-between-a-day-5-vs-day-3-embryo-transfer": ["surat", "anand", "varanasi"],
  "complications-of-delaying-your-ivf-journey": ["mumbai"],
  "does-stress-affect-ivf-success": ["mumbai"],
  "icsi-vs-ivf-do-you-actually-need-icsi-or-is-it-being-upsold-to-you": ["surat", "anand", "varanasi"],
  "impact-of-age-repeated-ivf-cycles-on-pregnancy": ["mumbai"],
  "iui-process-explained-what-to-expect-at-every-step": ["bhuj", "bhavnagar"],
  "iui-side-effects-on-the-body-and-emotions-a-complete-guide": ["surat", "anand", "varanasi"],
  "iui-treatment-with-fertility-medicines-what-patients-should-know": ["surat", "anand", "varanasi"],
  "ivf-pregnancy-week-by-week-symptoms-and-safety": ["bhavnagar"],
  "necrozoospermia-symptoms-causes-and-treatment-options": ["bhuj", "anand", "varanasi"],
  "understanding-endometrial-thickness-a-key-factor-in-female-fertility": ["vadodara"],
  "understanding-hypospermia-signs-symptoms-and-treatment-options": ["vadodara", "bhuj", "bhavnagar"],
};

async function main() {
  const slugs = Object.keys(TAGS);
  log(`${slugs.length} articles, ${Object.values(TAGS).flat().length} tags to merge`);

  if (DRY) {
    for (const [slug, cities] of Object.entries(TAGS)) {
      log(`  ${slug} -> ${cities.join(", ")}`);
    }
    log("[dry-run] nothing written.");
    return;
  }

  if (!projectId || !token) {
    log("no Sanity write token here - skipping (expected outside deploy).");
    return;
  }

  const client = createClient({
    projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token,
  });

  const docs = await client.fetch(
    `*[_type == "blog" && slug in $slugs]{ _id, slug, locationSlugs }`,
    { slugs },
  );
  const bySlug = new Map(docs.map((d) => [d.slug, d]));

  let updated = 0;
  let unchanged = 0;
  let missing = 0;

  for (const [slug, cities] of Object.entries(TAGS)) {
    const doc = bySlug.get(slug);
    if (!doc) {
      missing += 1;
      log(`  ${slug} -> NOT FOUND, skipped`);
      continue;
    }

    // Merge, never replace: anything an editor added by hand survives.
    const current = doc.locationSlugs ?? [];
    const merged = [...new Set([...current, ...cities])];
    if (merged.length === current.length) {
      unchanged += 1;
      continue;
    }

    await client.patch(doc._id).set({ locationSlugs: merged }).commit();
    updated += 1;
    log(`  ${slug} -> ${merged.join(", ")}`);
  }

  log(`done: ${updated} updated, ${unchanged} already tagged, ${missing} not found.`);
}

main().catch((e) => {
  console.error("[tag-blog-locations]", e);
  process.exit(1);
});
