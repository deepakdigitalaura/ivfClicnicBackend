/* =====================================================================
 * One-off correction for scripts/seed-i18n-from-demo.mts (commit 37bbcab).
 * That script localized every leaf string found in HOMEPAGE_DEFAULTS/
 * ABOUT_DEFAULTS blindly — but resolveHomepage/resolveAbout expect a few
 * fields in a DIFFERENT shape/key-name on the raw CMS source than on the
 * resolved output, so those specific fields came out wrong:
 *
 *   1. homepage.locations.cities[].c — resolver reads this RAW (no
 *      pickLocale at all, see homepage.ts:952). Seeding it as {en,hi,gu}
 *      passed an object straight into JSX → build-crashing
 *      "Objects are not valid as a React child". Revert to plain string.
 *   2. homepage.stats[].label (top-level, not nested under hero) —
 *      resolver reads `label`, defaults key is `l` (homepage.ts:740).
 *      Seeded under `l`; move to `label`.
 *   3. homepage.calculators.items[] — resolver reads `{name}` objects
 *      (homepage.ts:962), defaults are a bare string[]. Seeded as raw
 *      {en,hi,gu} array items; wrap as {name: {en,hi,gu}}.
 *   4. aboutPage.atAGlance[].label / patientStats[].label — same `label`
 *      vs `l` mismatch as (2) (about.ts:199,255).
 *
 * Run: npx tsx --env-file=.env.local --env-file=<token-file> scripts/fix-i18n-seed-shapes.mts [--dry-run]
 * ===================================================================== */
import { createClient } from "next-sanity";

const DRY = process.argv.includes("--dry-run");

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN!,
});

type Localized = { en?: string; hi?: string; gu?: string } | string;

function asEnglish(v: Localized | undefined): string {
  if (v == null) return "";
  return typeof v === "string" ? v : (v.en ?? "");
}

async function fixHomepage() {
  const doc = (await sanity.getDocument("homepage")) as any;
  if (!doc) return console.log("no homepage doc, nothing to fix");

  // 1. cities[].c: revert to plain English string (resolver reads it raw).
  if (Array.isArray(doc.locations?.cities)) {
    doc.locations.cities = doc.locations.cities.map((city: any) => ({
      ...city,
      c: asEnglish(city.c),
    }));
  }

  // 2. stats[].l -> label (top-level doc.stats, not hero.stats; source key
  //    resolver actually reads is `label`, homepage.ts:740).
  if (Array.isArray(doc.stats)) {
    doc.stats = doc.stats.map((s: any) => {
      const { l, ...rest } = s ?? {};
      return l != null ? { ...rest, label: l } : s;
    });
  }

  // 3. calculators.items[]: wrap raw {en,hi,gu} into {name: {en,hi,gu}}.
  if (Array.isArray(doc.calculators?.items)) {
    doc.calculators.items = doc.calculators.items.map((item: any) =>
      item && typeof item === "object" && !("name" in item) ? { name: item } : item,
    );
  }

  console.log("=== homepage fix ===");
  console.log("cities[0]:", JSON.stringify(doc.locations?.cities?.[0]));
  console.log("stats[0]:", JSON.stringify(doc.stats?.[0]));
  console.log("calculators.items[0]:", JSON.stringify(doc.calculators?.items?.[0]));

  if (DRY) return;
  const { _rev, _createdAt, _updatedAt, ...rest } = doc;
  void _rev; void _createdAt; void _updatedAt;
  await sanity.createOrReplace({ _id: "homepage", _type: "homepage", ...rest });
  console.log("saved homepage");
}

async function fixAbout() {
  const doc = (await sanity.getDocument("aboutPage")) as any;
  if (!doc) return console.log("no aboutPage doc, nothing to fix");

  const renameL = (arr: any[] | undefined) =>
    Array.isArray(arr)
      ? arr.map((s: any) => {
          const { l, ...rest } = s ?? {};
          return l != null ? { ...rest, label: l } : s;
        })
      : arr;

  doc.atAGlance = renameL(doc.atAGlance);
  doc.patientStats = renameL(doc.patientStats);

  console.log("=== aboutPage fix ===");
  console.log("atAGlance[0]:", JSON.stringify(doc.atAGlance?.[0]));
  console.log("patientStats[0]:", JSON.stringify(doc.patientStats?.[0]));

  if (DRY) return;
  const { _rev, _createdAt, _updatedAt, ...rest } = doc;
  void _rev; void _createdAt; void _updatedAt;
  await sanity.createOrReplace({ _id: "aboutPage", _type: "aboutPage", ...rest });
  console.log("saved aboutPage");
}

async function main() {
  await fixHomepage();
  await fixAbout();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
