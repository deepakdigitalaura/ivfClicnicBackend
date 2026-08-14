/**
 * patch-ivf-pregnancy-test-step.mts
 *
 * Fixes the "Pregnancy Test" (step 05) description on the `ivf` treatment doc,
 * which had stale numbers ("12–19 days after embryo transfer" / "...12–17 days")
 * that no longer matched the code default. Sets it to the correct text:
 * "13–15 days after embryo transfer" / "...12–19 days".
 *
 * Run: SANITY_API_TOKEN=... npx tsx scripts/patch-ivf-pregnancy-test-step.mts
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

const NEW_TEXT =
  "About 13–15 days after embryo transfer, a Beta-HCG blood test confirms pregnancy. From egg formation to transfer, the active treatment usually takes just 12–19 days.";

async function run() {
  const doc = await s.fetch<{ _id: string; process?: { steps?: { n?: string }[] } }>(
    `*[_type == "treatment" && slug == "ivf"][0]{ _id, process }`
  );
  if (!doc) throw new Error("ivf treatment doc not found");

  const steps = doc.process?.steps ?? [];
  const idx = steps.findIndex((st) => st.n === "05");
  if (idx === -1) throw new Error("step 05 not found in process.steps");

  await s.patch(doc._id).set({ [`process.steps[${idx}].d`]: NEW_TEXT }).commit();
  console.log(`Patched ${doc._id} process.steps[${idx}].d`);
}

run();
