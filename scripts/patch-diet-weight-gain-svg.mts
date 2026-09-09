/* Fix the single remaining design-system violation found in a full audit of all 18 waves:
 * SVG_DIET_WEIGHT_GAIN_LIGHT (Wave 1, "complete-pregnancy-diet-chart...") used THREE different
 * accent tones (roseSoft/roseMid/rose) across its 3 trimester columns, and the middle column had
 * white text on #E07098 — contrast ratio ~3.0:1, failing WCAG AA 4.5:1.
 *
 * Fix: single rose (#CF3A6A) accent throughout, matching the compliant 3-panel pattern already
 * used in SVG_BABY_WEIGHT_TRIMESTERS (rose header + white card + rose stat number).
 *
 * Run:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=seh0zjkb NEXT_PUBLIC_SANITY_DATASET=production \
 *   SANITY_API_TOKEN=<token> npx tsx scripts/patch-diet-weight-gain-svg.mts
 */

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token     = process.env.SANITY_API_TOKEN!;
if (!projectId || !token) throw new Error("env vars required");

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

const SLUG = "complete-pregnancy-diet-chart-by-trimester-what-to-eat-in-the-first-second-third-trimester";

const C = {
  ivory:  "#FAF9F6",
  border: "#E2DEED",
  rose:   "#CF3A6A",
  dark:   "#1A1825",
  muted:  "#6B6580",
  white:  "#FFFFFF",
};
const FONT = "'Inter', system-ui, sans-serif";

const NEW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 214" font-family="${FONT}">
  <rect width="800" height="214" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="212.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">RECOMMENDED WEIGHT GAIN BY TRIMESTER</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="65" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">FIRST TRIMESTER</text>
  <text x="149" y="78" text-anchor="middle" font-size="10" fill="${C.white}">Week 1–12</text>
  <text x="149" y="118" text-anchor="middle" font-size="26" font-weight="800" fill="${C.rose}">1–2 kg</text>
  <rect x="291" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="291" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="291" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="65" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">SECOND TRIMESTER</text>
  <text x="400" y="78" text-anchor="middle" font-size="10" fill="${C.white}">Week 13–27</text>
  <text x="400" y="118" text-anchor="middle" font-size="26" font-weight="800" fill="${C.rose}">4–5 kg</text>
  <rect x="542" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="542" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="542" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="65" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">THIRD TRIMESTER</text>
  <text x="651" y="78" text-anchor="middle" font-size="10" fill="${C.white}">Week 28–Delivery</text>
  <text x="651" y="118" text-anchor="middle" font-size="26" font-weight="800" fill="${C.rose}">5–6 kg</text>
  <text x="400" y="190" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">Total healthy gain: 10–13 kg</text>
  <text x="400" y="205" text-anchor="middle" font-size="9.5" fill="${C.muted}">Varies by pre-pregnancy BMI — confirm targets with your doctor</text>
</svg>`;

interface Block { type: string; fields?: Record<string, unknown>; children?: Block[] }

async function main() {
  const doc = await client.fetch<{ _id: string; contentRaw: string } | null>(
    `*[_type=="blog" && slug==$slug && status=="published"][0]{_id,contentRaw}`,
    { slug: SLUG }
  );
  if (!doc) throw new Error("Blog not found: " + SLUG);

  const parsed = JSON.parse(doc.contentRaw) as { root: { children: Block[] } };
  const children = parsed.root.children;

  const idx = children.findIndex(
    n => n.type === "block" && (n.fields?.blockType as string) === "infographic"
      && (n.fields?.title as string ?? "").toLowerCase().includes("recommended weight gain by trimester")
  );
  if (idx === -1) throw new Error('Infographic "Recommended Weight Gain by Trimester" not found');

  const block = children[idx];
  const updated = [...children];
  updated[idx] = { ...block, fields: { ...block.fields!, svgContent: NEW_SVG } };
  const newRoot = { root: { ...parsed.root, children: updated } };

  await client.patch(doc._id).set({ contentRaw: JSON.stringify(newRoot) }).commit();
  console.log(`✅ Patched ${doc._id} — single-accent rose SVG (was 3-tone, failed contrast on middle panel)`);
}

main().catch(e => { console.error("❌", e); process.exit(1); });
