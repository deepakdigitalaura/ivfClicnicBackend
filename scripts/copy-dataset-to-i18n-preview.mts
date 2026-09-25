/* =====================================================================
 * One-off: copy every document from the `production` Sanity dataset into
 * the new, isolated `i18n-preview` dataset, so Hindi/Gujarati translations
 * can be seeded and reviewed there without touching shared production
 * data (see the incident: seeding production broke other branches whose
 * code predates locale support).
 *
 * Asset image/file URLs are absolute (they embed the dataset name in the
 * stored URL string itself, e.g. cdn.sanity.io/images/<proj>/production/…)
 * so a plain document copy keeps images working in the new dataset too.
 *
 * Run: npx tsx --env-file=.env.local --env-file=<token-file> scripts/copy-dataset-to-i18n-preview.mts
 * ===================================================================== */
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const token = process.env.SANITY_API_TOKEN!;

const source = createClient({ projectId, dataset: "production", apiVersion: "2024-01-01", useCdn: false });
const target = createClient({ projectId, dataset: "i18n-preview", apiVersion: "2024-01-01", useCdn: false, token });

async function main() {
  console.log("fetching all documents from production...");
  const docs = await source.fetch<Record<string, unknown>[]>("*[]");
  console.log(`fetched ${docs.length} documents`);

  const CHUNK = 50;
  let done = 0;
  for (let i = 0; i < docs.length; i += CHUNK) {
    const chunk = docs.slice(i, i + CHUNK);
    const tx = target.transaction();
    for (const doc of chunk) tx.createOrReplace(doc as any);
    await tx.commit();
    done += chunk.length;
    console.log(`copied ${done}/${docs.length}`);
  }
  console.log("done — i18n-preview now mirrors production");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
