/* =====================================================================
 * Phase 4 Task 4.1 — seed hi/gu translations (from the sir-approved demo,
 * PR #38) onto the live Sanity `homepage` and `aboutPage` singletons.
 *
 * Contact/Treatments-hub/Calculators CMS docs and the ~80 static nav
 * labels are deliberately left untouched — no prior demo translation
 * exists for them (see docs/superpowers/plans/2026-09-21-payload-i18n-
 * hindi-gujarati.md Global Constraints); they render English via
 * pickLocale's fallback until a real translation pass is done.
 *
 * Each translatable leaf field becomes {en: <current/default>, hi, gu} —
 * same shape setLocalized() produces in the admin UI. Icon/image/href/
 * slug/numeric fields are left as plain strings because the seed content
 * (src/lib/i18n-seed-content.ts) only carries keys for translated fields;
 * localizeTree() skips any key absent from both patches.
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/seed-i18n-from-demo.mts [--dry-run]
 * ===================================================================== */
import { createClient } from "next-sanity";
import { HOMEPAGE_DEFAULTS } from "../src/lib/homepage";
import { ABOUT_DEFAULTS } from "../src/lib/about";
import { homepageSeed, aboutSeed } from "../src/lib/i18n-seed-content";

const DRY = process.argv.includes("--dry-run");

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN!,
});

/** Walks `base` (current Sanity doc, or the typed defaults as fallback),
 *  applying hi/gu patches leaf-by-leaf. A leaf becomes {en,hi,gu} only if
 *  the patch has a value there; otherwise it stays exactly as `base` had
 *  it (plain string/number/etc — untouched, including non-text fields the
 *  patches never mention). */
function localizeTree(base: unknown, hiPatch: unknown, guPatch: unknown): unknown {
  if (base == null) return base;
  if (Array.isArray(base)) {
    const hiArr = Array.isArray(hiPatch) ? hiPatch : undefined;
    const guArr = Array.isArray(guPatch) ? guPatch : undefined;
    return base.map((item, i) => localizeTree(item, hiArr?.[i], guArr?.[i]));
  }
  if (typeof base === "object") {
    const hiObj = hiPatch && typeof hiPatch === "object" ? (hiPatch as Record<string, unknown>) : undefined;
    const guObj = guPatch && typeof guPatch === "object" ? (guPatch as Record<string, unknown>) : undefined;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(base as Record<string, unknown>)) {
      out[key] = localizeTree((base as Record<string, unknown>)[key], hiObj?.[key], guObj?.[key]);
    }
    return out;
  }
  if (typeof base === "string") {
    if (hiPatch == null && guPatch == null) return base;
    const localized: { en: string; hi?: string; gu?: string } = { en: base };
    if (typeof hiPatch === "string" && hiPatch) localized.hi = hiPatch;
    if (typeof guPatch === "string" && guPatch) localized.gu = guPatch;
    return localized;
  }
  return base;
}

/** Per-field merge: existing Sanity value wins where present, otherwise
 *  fall back to the typed default (same convention resolveHomepage/
 *  resolveAbout use at render time — a sparse/empty CMS doc is normal). */
function mergeOverDefaults(defaults: unknown, existing: unknown): unknown {
  if (existing == null) return defaults;
  if (Array.isArray(defaults)) {
    return Array.isArray(existing) && existing.length ? existing : defaults;
  }
  if (defaults !== null && typeof defaults === "object") {
    if (typeof existing !== "object") return defaults;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(defaults as Record<string, unknown>)) {
      out[key] = mergeOverDefaults((defaults as Record<string, unknown>)[key], (existing as Record<string, unknown>)[key]);
    }
    return out;
  }
  return existing;
}

async function seedDoc(id: string, type: string, defaults: Record<string, unknown>, hi: Record<string, unknown>, gu: Record<string, unknown>) {
  const existing = (await sanity.getDocument(id).catch(() => null)) as Record<string, unknown> | null;
  const base = mergeOverDefaults(defaults, existing) as Record<string, unknown>;
  const localized = localizeTree(base, hi, gu) as Record<string, unknown>;
  const { _id, _rev, _createdAt, _updatedAt, ...rest } = localized;
  void _id; void _rev; void _createdAt; void _updatedAt;
  const doc = { _id: id, _type: type, ...rest };

  console.log(`\n=== ${id} ===`);
  console.log(existing ? "existing doc found, merging locales onto it" : "no existing doc, seeding from HOMEPAGE/ABOUT_DEFAULTS");

  if (DRY) {
    console.log(JSON.stringify(doc, null, 2).slice(0, 2000) + "\n... (truncated, --dry-run)");
    return;
  }
  await sanity.createOrReplace(doc);
  console.log(`saved ${id}`);
}

async function main() {
  await seedDoc("homepage", "homepage", HOMEPAGE_DEFAULTS as unknown as Record<string, unknown>, homepageSeed.hi, homepageSeed.gu);
  await seedDoc("aboutPage", "aboutPage", ABOUT_DEFAULTS as unknown as Record<string, unknown>, aboutSeed.hi, aboutSeed.gu);
  console.log("\nDone. Contact/Treatments-hub/Calculators docs and nav labels intentionally left untouched (no prior translation).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
