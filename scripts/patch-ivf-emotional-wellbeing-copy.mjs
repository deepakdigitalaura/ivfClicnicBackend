#!/usr/bin/env node
/**
 * patch-ivf-emotional-wellbeing-copy.mjs
 *
 * Fixes the IVF treatment page "Risks & Considerations" → "Emotional well-being"
 * card description, which was missing the "IVF" lead-in on the live Sanity doc:
 *   "Treatment can be an emotional journey." → "IVF treatment can be an emotional journey."
 *
 * Run: SANITY_API_TOKEN=... node scripts/patch-ivf-emotional-wellbeing-copy.mjs
 */
import { createClient } from "next-sanity";

const token = process.env.SANITY_API_TOKEN;
if (!token) throw new Error("SANITY_API_TOKEN is required");

const s = createClient({
  projectId: "seh0zjkb",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

const DOC_ID = "treatment-ivf";
const OLD_TEXT = "Treatment can be an emotional journey.";
const NEW_TEXT = "IVF treatment can be an emotional journey.";

async function main() {
  const doc = await s.getDocument(DOC_ID);
  if (!doc) throw new Error(`Document ${DOC_ID} not found`);

  const items = doc.risks?.items ?? [];
  const idx = items.findIndex((it) => it.t === "Emotional well-being" && it.d === OLD_TEXT);
  if (idx === -1) {
    console.log(`[patch] No matching item found (already fixed?) — current items:`, items.map((i) => `${i.t}: ${i.d}`));
    return;
  }

  await s
    .patch(DOC_ID)
    .set({ [`risks.items[${idx}].d`]: NEW_TEXT })
    .commit();

  console.log(`[patch] ✓ Updated risks.items[${idx}].d → "${NEW_TEXT}"`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
