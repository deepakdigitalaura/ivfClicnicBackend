/**
 * patch-ivf-failure-indications.mjs
 *
 * Reorders + rewords the "Common reasons for IVF failure" indications list
 * in the ivf-failure treatment's Sanity document (whoNeedsIt.items), which
 * overlays the code fallback in src/lib/treatments.ts entirely.
 *
 * Run:  SANITY_API_TOKEN=... node scripts/patch-ivf-failure-indications.mjs
 */
import { createClient } from "next-sanity";
import { randomBytes } from "crypto";

const token = process.env.SANITY_API_TOKEN;
if (!token) throw new Error("SANITY_API_TOKEN is required");

const s = createClient({
  projectId: "seh0zjkb",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

const key = () => randomBytes(6).toString("hex");

const items = [
  "Genetic abnormalities in the embryos",
  "Sub-optimal stimulation or very low egg yield",
  "Early, late or suboptimal trigger compromising egg number and quality",
  "Poor embryo quality or arrested development",
  "Poor fertilisation despite ICSI",
  "Uterine abnormalities or endometrial receptivity issues",
  "Poor egg quality & high sperm DFI",
  "Thrombophilia (blood-clotting disorders)",
  "Lifestyle and general health factors",
].map((value) => ({ _key: key(), _type: "value", value }));

const result = await s
  .patch("treatment-ivf-failure")
  .set({ "whoNeedsIt.items": items })
  .commit();

console.log("Patched:", result._id);
console.log(JSON.stringify(result.whoNeedsIt.items, null, 2));
