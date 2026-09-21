/* =====================================================================
 * EMERGENCY REVERT — the Phase 4 seed (scripts/seed-i18n-from-demo.mts)
 * wrote {en,hi,gu} objects directly into the SHARED production Sanity
 * dataset. That dataset is read by every branch/deployment, not just
 * feat/payload-i18n-hi-gu — including branches/production whose
 * resolveHomepage/resolveAbout predate locale support and expect plain
 * strings. This recursively walks homepage + aboutPage and replaces
 * every {en,hi,gu}-shaped object with its plain .en string, restoring
 * both docs to exactly what every non-i18n branch expects.
 *
 * Run: npx tsx --env-file=.env.local --env-file=<token-file> scripts/revert-i18n-seed-emergency.mts [--dry-run]
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

function isLocalizedObject(v: unknown): v is { en?: string; hi?: string; gu?: string } {
  if (v == null || typeof v !== "object" || Array.isArray(v)) return false;
  const keys = Object.keys(v as object);
  return keys.length > 0 && keys.every((k) => ["en", "hi", "gu"].includes(k));
}

function revert(obj: unknown): unknown {
  if (isLocalizedObject(obj)) return (obj as { en?: string }).en ?? "";
  if (Array.isArray(obj)) return obj.map(revert);
  if (obj !== null && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) out[k] = revert(v);
    return out;
  }
  return obj;
}

async function revertDoc(id: string, type: string) {
  const doc = (await sanity.getDocument(id)) as Record<string, unknown> | null;
  if (!doc) return console.log(`${id}: no doc, nothing to revert`);
  const reverted = revert(doc) as Record<string, unknown>;
  const { _rev, _createdAt, _updatedAt, ...rest } = reverted;
  void _rev; void _createdAt; void _updatedAt;
  console.log(`${id}: reverting, sample ->`, JSON.stringify((reverted as any).hero?.headline ?? (reverted as any).hero));
  if (DRY) return;
  await sanity.createOrReplace({ _id: id, _type: type, ...rest });
  console.log(`${id}: saved (all locale objects flattened to plain English)`);
}

async function main() {
  await revertDoc("homepage", "homepage");
  await revertDoc("aboutPage", "aboutPage");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
