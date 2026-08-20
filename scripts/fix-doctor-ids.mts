/* =====================================================================
 * One-time fix: migrate doctor.<slug> document IDs (containing a literal
 * dot, which Sanity's anonymous/public read API silently excludes) to
 * doctor-<slug> (hyphen). Also deletes throwaway test docs created while
 * diagnosing the issue.
 * ===================================================================== */
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN required");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

async function main() {
  const dotIdDocs = await sanity.fetch<Record<string, unknown>[]>(
    `*[_type == "doctor" && _id match "doctor.*" && _id != "doctor-test-hyphen"]`,
  );
  console.log(`Found ${dotIdDocs.length} doctor doc(s) with dot-format IDs.`);

  for (const doc of dotIdDocs) {
    const oldId = doc._id as string;
    if (!oldId.includes(".")) continue; // already hyphen, skip
    const slug = oldId.replace(/^doctor\./, "");
    const newId = `doctor-${slug}`;
    const { _id, _rev, ...rest } = doc;
    void _id; void _rev;
    console.log(`Migrating ${oldId} -> ${newId}`);
    await sanity.createOrReplace({ _id: newId, ...rest });
    await sanity.delete(oldId);
    console.log(`  ✓ migrated + old doc deleted`);
  }

  // Clean up test docs from diagnosis
  for (const testId of ["doctor-test-hyphen", "doctor.test-dot"]) {
    try {
      await sanity.delete(testId);
      console.log(`Deleted test doc: ${testId}`);
    } catch { /* may not exist, fine */ }
  }

  console.log("\nDone. Revalidating doctor cache...");
  const res = await fetch(
    "https://ivf-clicnic-backend-weld.vercel.app/api/revalidate?secret=bfi-revalidate-9x7k2&tags=sanity-doctors&paths=/doctors/deep-gajiwala,/doctors/suman-singh,/doctors",
    { method: "POST" },
  );
  console.log(`  revalidate -> ${res.status}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
