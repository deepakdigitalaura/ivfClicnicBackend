/* Replace the externalImage block in PRP and Thyroid blogs with content-specific infographics.
 * All data points sourced verbatim from each blog's own text (read via read-blog-section.mts).
 *
 * Run:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=seh0zjkb NEXT_PUBLIC_SANITY_DATASET=production \
 *   SANITY_API_TOKEN=<token> \
 *   npx tsx --tsconfig tsconfig.json scripts/replace-photo-with-infographic.mts --slug <slug>
 */

import { createClient } from "next-sanity";
import { randomBytes } from "crypto";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token     = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN required");

const slug = (process.argv.find(a => a.startsWith("--slug="))?.split("=")[1])
  ?? process.argv[process.argv.indexOf("--slug") + 1];
if (!slug) throw new Error("--slug required");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

function nid() { return randomBytes(8).toString("hex"); }

// ── Design tokens (from src/styles.css) ──────────────────────────────
const C = {
  ivory:  "#FAF9F6",
  border: "#E2DEED",
  rose:   "#CF3A6A",   // --primary
  dark:   "#1A1825",   // --foreground
  muted:  "#6B6580",
  white:  "#FFFFFF",
  sep:    "#E2DEED",
};
const FONT = "'Inter', system-ui, sans-serif";

// ── SVGs ─────────────────────────────────────────────────────────────
// PRP: "Who is PRP Suitable For?" — 6 conditions from the blog's own list (node [8])
// Source text: Diminished ovarian reserve (low AMH), Poor egg quality / recurrent IVF failures,
// Age-related decline (35+), Premature ovarian insufficiency (POI), Post-chemo/radiation effects,
// PCOS or ovulatory disorders.
const SVG_PRP_CANDIDATES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 218" font-family="${FONT}">
  <rect width="800" height="218" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="216.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">WHO IS PRP OVARIAN REJUVENATION SUITABLE FOR?</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.sep}" stroke-width="1"/>

  <!-- Left column — items 1 2 3 -->
  <!-- 1 -->
  <circle cx="68" cy="62" r="13" fill="${C.rose}"/>
  <text x="68" y="66.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="92" y="57" font-size="11.5" font-weight="600" fill="${C.dark}">Diminished Ovarian Reserve</text>
  <text x="92" y="72" font-size="10.5" fill="${C.muted}">Low AMH or antral follicle count</text>

  <!-- 2 -->
  <circle cx="68" cy="107" r="13" fill="${C.rose}"/>
  <text x="68" y="111.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="92" y="102" font-size="11.5" font-weight="600" fill="${C.dark}">Poor Egg Quality</text>
  <text x="92" y="117" font-size="10.5" fill="${C.muted}">Recurrent IVF failures</text>

  <!-- 3 -->
  <circle cx="68" cy="152" r="13" fill="${C.rose}"/>
  <text x="68" y="156.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="92" y="147" font-size="11.5" font-weight="600" fill="${C.dark}">Age-Related Decline (35+)</text>
  <text x="92" y="162" font-size="10.5" fill="${C.muted}">Fertility declining with age</text>

  <!-- Divider -->
  <line x1="400" y1="44" x2="400" y2="190" stroke="${C.sep}" stroke-width="1"/>

  <!-- Right column — items 4 5 6 -->
  <!-- 4 -->
  <circle cx="418" cy="62" r="13" fill="${C.rose}"/>
  <text x="418" y="66.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="442" y="57" font-size="11.5" font-weight="600" fill="${C.dark}">Premature Ovarian Insufficiency</text>
  <text x="442" y="72" font-size="10.5" fill="${C.muted}">POI or early menopause</text>

  <!-- 5 -->
  <circle cx="418" cy="107" r="13" fill="${C.rose}"/>
  <text x="418" y="111.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="442" y="102" font-size="11.5" font-weight="600" fill="${C.dark}">Post-Chemo / Radiation Effects</text>
  <text x="442" y="117" font-size="10.5" fill="${C.muted}">Ovarian function affected by treatment</text>

  <!-- 6 -->
  <circle cx="418" cy="152" r="13" fill="${C.rose}"/>
  <text x="418" y="156.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="442" y="147" font-size="11.5" font-weight="600" fill="${C.dark}">PCOS or Ovulatory Disorders</text>
  <text x="442" y="162" font-size="10.5" fill="${C.muted}">Irregular ovulation affecting fertility</text>

  <line x1="40" y1="194" x2="760" y2="194" stroke="${C.sep}" stroke-width="0.75"/>
  <text x="400" y="209" text-anchor="middle" font-size="9" fill="${C.muted}">Source: Bavishi Fertility Institute PRP programme</text>
</svg>`;

// Thyroid: "IVF + Thyroid: What to Expect" — 3 steps from the blog's own bullet list (node [9])
// Source text: 1) Thyroid hormone regulation — must be stable before IVF
//              2) Medication adjustments — optimise hormone levels
//              3) Close monitoring — regular blood tests and ultrasounds
const SVG_THYROID_WHAT_TO_EXPECT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 196" font-family="${FONT}">
  <rect width="800" height="196" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="194.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">IVF + THYROID DISORDERS: WHAT TO EXPECT</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.sep}" stroke-width="1"/>
  <defs><marker id="tArr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="${C.rose}"/></marker></defs>

  <!-- Step 1 -->
  <circle cx="160" cy="97" r="34" fill="${C.rose}"/>
  <text x="160" y="91" text-anchor="middle" font-size="9.5" font-weight="600" fill="${C.white}">STEP</text>
  <text x="160" y="109" text-anchor="middle" font-size="20" font-weight="800" fill="${C.white}">1</text>
  <text x="160" y="148" text-anchor="middle" font-size="11.5" font-weight="600" fill="${C.dark}">Stabilise Thyroid First</text>
  <text x="160" y="163" text-anchor="middle" font-size="10" fill="${C.muted}">Thyroid levels must be</text>
  <text x="160" y="177" text-anchor="middle" font-size="10" fill="${C.muted}">optimal before IVF starts</text>

  <line x1="196" y1="97" x2="358" y2="97" stroke="${C.rose}" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#tArr)"/>

  <!-- Step 2 -->
  <circle cx="400" cy="97" r="34" fill="${C.rose}"/>
  <text x="400" y="91" text-anchor="middle" font-size="9.5" font-weight="600" fill="${C.white}">STEP</text>
  <text x="400" y="109" text-anchor="middle" font-size="20" font-weight="800" fill="${C.white}">2</text>
  <text x="400" y="148" text-anchor="middle" font-size="11.5" font-weight="600" fill="${C.dark}">Medication Adjusted</text>
  <text x="400" y="163" text-anchor="middle" font-size="10" fill="${C.muted}">Thyroid medication fine-tuned</text>
  <text x="400" y="177" text-anchor="middle" font-size="10" fill="${C.muted}">to optimise hormone levels</text>

  <line x1="436" y1="97" x2="598" y2="97" stroke="${C.rose}" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#tArr)"/>

  <!-- Step 3 -->
  <circle cx="640" cy="97" r="34" fill="${C.rose}"/>
  <text x="640" y="91" text-anchor="middle" font-size="9.5" font-weight="600" fill="${C.white}">STEP</text>
  <text x="640" y="109" text-anchor="middle" font-size="20" font-weight="800" fill="${C.white}">3</text>
  <text x="640" y="148" text-anchor="middle" font-size="11.5" font-weight="600" fill="${C.dark}">Close Monitoring</text>
  <text x="640" y="163" text-anchor="middle" font-size="10" fill="${C.muted}">Regular blood tests &amp;</text>
  <text x="640" y="177" text-anchor="middle" font-size="10" fill="${C.muted}">ultrasounds throughout IVF</text>
</svg>`;

// ── Blog 3: First Trimester Key Nutrients ──────────────────────────
// Data from blog nodes [19]-[21]: folic acid, iron, vitamin B6, protein, choline
const SVG_DIET_NUTRIENTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 218" font-family="${FONT}">
  <rect width="800" height="218" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="216.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">KEY NUTRIENTS IN THE FIRST TRIMESTER</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Left column: 1 2 3 -->
  <circle cx="68" cy="62" r="13" fill="${C.rose}"/>
  <text x="68" y="66.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="92" y="57" font-size="11.5" font-weight="600" fill="${C.dark}">Folic Acid</text>
  <text x="92" y="72" font-size="10.5" fill="${C.muted}">Prevents neural tube defects — most critical</text>

  <circle cx="68" cy="107" r="13" fill="${C.rose}"/>
  <text x="68" y="111.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="92" y="102" font-size="11.5" font-weight="600" fill="${C.dark}">Iron</text>
  <text x="92" y="117" font-size="10.5" fill="${C.muted}">Prevents anaemia, supports rising blood volume</text>

  <circle cx="68" cy="152" r="13" fill="${C.rose}"/>
  <text x="68" y="156.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="92" y="147" font-size="11.5" font-weight="600" fill="${C.dark}">Vitamin B6</text>
  <text x="92" y="162" font-size="10.5" fill="${C.muted}">Helps manage first-trimester nausea</text>

  <!-- Divider -->
  <line x1="400" y1="44" x2="400" y2="190" stroke="${C.border}" stroke-width="1"/>

  <!-- Right column: 4 5 -->
  <circle cx="418" cy="62" r="13" fill="${C.rose}"/>
  <text x="418" y="66.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="442" y="57" font-size="11.5" font-weight="600" fill="${C.dark}">Protein</text>
  <text x="442" y="72" font-size="10.5" fill="${C.muted}">Supports fetal growth and organ development</text>

  <circle cx="418" cy="107" r="13" fill="${C.rose}"/>
  <text x="418" y="111.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="442" y="102" font-size="11.5" font-weight="600" fill="${C.dark}">Choline</text>
  <text x="442" y="117" font-size="10.5" fill="${C.muted}">Essential for baby's brain development</text>

  <line x1="40" y1="194" x2="760" y2="194" stroke="${C.border}" stroke-width="0.75"/>
  <text x="400" y="209" text-anchor="middle" font-size="9" fill="${C.muted}">Source: Bavishi Fertility Institute pregnancy nutrition guidelines</text>
</svg>`;

// ── Blog 4: BFI Mental Health Support Services ──────────────────────
// Data from blog node [12]: 4 services listed verbatim
const SVG_EMOTIONAL_SUPPORT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 210" font-family="${FONT}">
  <rect width="800" height="210" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="208.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">BFI MENTAL HEALTH SUPPORT SERVICES</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Top-left quadrant -->
  <rect x="40" y="48" width="340" height="70" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="73" r="13" fill="${C.rose}"/>
  <text x="70" y="77.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="96" y="68" font-size="11.5" font-weight="600" fill="${C.dark}">One-on-One Counselling</text>
  <text x="96" y="83" font-size="10.5" fill="${C.muted}">Individualised support &amp; guidance</text>

  <!-- Top-right quadrant -->
  <rect x="420" y="48" width="340" height="70" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="450" cy="73" r="13" fill="${C.rose}"/>
  <text x="450" y="77.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="476" y="68" font-size="11.5" font-weight="600" fill="${C.dark}">Group Therapy Sessions</text>
  <text x="476" y="83" font-size="10.5" fill="${C.muted}">Share experiences in a safe space</text>

  <!-- Bottom-left quadrant -->
  <rect x="40" y="128" width="340" height="70" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="153" r="13" fill="${C.rose}"/>
  <text x="70" y="157.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="96" y="148" font-size="11.5" font-weight="600" fill="${C.dark}">24/7 Emotional Support</text>
  <text x="96" y="163" font-size="10.5" fill="${C.muted}">Team available around the clock</text>

  <!-- Bottom-right quadrant -->
  <rect x="420" y="128" width="340" height="70" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="450" cy="153" r="13" fill="${C.rose}"/>
  <text x="450" y="157.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="476" y="148" font-size="11.5" font-weight="600" fill="${C.dark}">Mindfulness &amp; Relaxation</text>
  <text x="476" y="163" font-size="10.5" fill="${C.muted}">Meditation and yoga techniques</text>

  <text x="400" y="206" text-anchor="middle" font-size="9" fill="${C.muted}">Source: Bavishi Fertility Institute patient support programme</text>
</svg>`;

// ── Blog 5: 3 Conditions — Pregnancy Impact ─────────────────────────
// Data from blog nodes [13],[16]-[18],[21]: verbatim risks per condition
const SVG_HIGHRISK_CONDITIONS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 232" font-family="${FONT}">
  <rect width="800" height="232" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="230.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">HOW THESE CONDITIONS AFFECT PREGNANCY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Column 1: Diabetes -->
  <rect x="32" y="48" width="228" height="170" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="32" y="48" width="228" height="32" rx="8" fill="${C.rose}"/>
  <rect x="32" y="68" width="228" height="12" fill="${C.rose}"/>
  <text x="146" y="69" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">DIABETES</text>
  <text x="50" y="100" font-size="10.5" fill="${C.dark}">• High birth weight (GDM)</text>
  <text x="50" y="120" font-size="10.5" fill="${C.dark}">• Delivery complications</text>
  <text x="50" y="140" font-size="10.5" fill="${C.dark}">• Increased C-section risk</text>
  <text x="50" y="160" font-size="10.5" fill="${C.dark}">• Risks for mother &amp; baby</text>
  <text x="50" y="180" font-size="9.5" fill="${C.muted}">(Type 1, 2 or gestational)</text>

  <!-- Column 2: Hypertension -->
  <rect x="286" y="48" width="228" height="170" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="286" y="48" width="228" height="32" rx="8" fill="${C.rose}"/>
  <rect x="286" y="68" width="228" height="12" fill="${C.rose}"/>
  <text x="400" y="69" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">HYPERTENSION</text>
  <text x="304" y="100" font-size="10.5" fill="${C.dark}">• Preeclampsia risk</text>
  <text x="304" y="120" font-size="10.5" fill="${C.dark}">• Fetal growth restriction (IUGR)</text>
  <text x="304" y="140" font-size="10.5" fill="${C.dark}">• Preterm delivery</text>
  <text x="304" y="160" font-size="10.5" fill="${C.dark}">• Placental abruption</text>
  <text x="304" y="180" font-size="9.5" fill="${C.muted}">(chronic or gestational)</text>

  <!-- Column 3: Thyroid -->
  <rect x="540" y="48" width="228" height="170" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="540" y="48" width="228" height="32" rx="8" fill="${C.rose}"/>
  <rect x="540" y="68" width="228" height="12" fill="${C.rose}"/>
  <text x="654" y="69" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">THYROID DISORDERS</text>
  <text x="558" y="100" font-size="10.5" fill="${C.dark}">• Miscarriage risk (hypothyroid)</text>
  <text x="558" y="120" font-size="10.5" fill="${C.dark}">• Developmental delays (hypo)</text>
  <text x="558" y="140" font-size="10.5" fill="${C.dark}">• Preterm birth (hyperthyroid)</text>
  <text x="558" y="160" font-size="10.5" fill="${C.dark}">• Low birth weight (hyper)</text>
  <text x="558" y="180" font-size="9.5" fill="${C.muted}">(hypo or hyperthyroidism)</text>

  <line x1="40" y1="226" x2="760" y2="226" stroke="${C.border}" stroke-width="0.75"/>
  <text x="400" y="222" text-anchor="middle" font-size="9" fill="${C.muted}">With proper management, most women with these conditions achieve healthy outcomes — Source: Bavishi Fertility Institute</text>
</svg>`;

// ── Per-slug config ───────────────────────────────────────────────────
const CONFIGS: Record<string, { svg: string; title: string; altText: string }> = {
  "prp-ovarian-rejuvenation-boosting-egg-quality-and-fertility": {
    svg:     SVG_PRP_CANDIDATES,
    title:   "Who Is PRP Ovarian Rejuvenation Suitable For?",
    altText: "Six-panel infographic listing PRP candidates: Diminished Ovarian Reserve, Poor Egg Quality, Age-Related Decline (35+), Premature Ovarian Insufficiency (POI), Post-Chemo/Radiation Effects, PCOS or Ovulatory Disorders.",
  },
  "ivf-for-women-with-thyroid-disorders-what-patients-should-know": {
    svg:     SVG_THYROID_WHAT_TO_EXPECT,
    title:   "IVF + Thyroid Disorders: What to Expect",
    altText: "Three-step infographic: Step 1 — Stabilise thyroid levels before IVF; Step 2 — Medication adjusted to optimise hormones; Step 3 — Close monitoring via regular blood tests and ultrasounds throughout IVF.",
  },
  "complete-pregnancy-diet-chart-by-trimester-what-to-eat-in-the-first-second-third-trimester": {
    svg:     SVG_DIET_NUTRIENTS,
    title:   "Key Nutrients in the First Trimester",
    altText: "Five-panel infographic of first-trimester nutrients: 1 Folic Acid (prevents neural tube defects), 2 Iron (prevents anaemia), 3 Vitamin B6 (manages nausea), 4 Protein (fetal growth), 5 Choline (brain development).",
  },
  "the-emotional-rollercoaster-of-ivf-why-mental-health-support-is-essential": {
    svg:     SVG_EMOTIONAL_SUPPORT,
    title:   "BFI Mental Health Support Services",
    altText: "Four-panel infographic of BFI support services: 1 One-on-One Counselling, 2 Group Therapy Sessions, 3 24/7 Emotional Support, 4 Mindfulness and Relaxation (meditation, yoga).",
  },
  "high-risk-pregnancy-due-to-diabetes-bp-thyroid-disorders": {
    svg:     SVG_HIGHRISK_CONDITIONS,
    title:   "How These Conditions Affect Pregnancy",
    altText: "Three-column infographic comparing pregnancy risks: Diabetes (high birth weight, delivery complications, C-section risk), Hypertension (preeclampsia, IUGR, preterm delivery, placental abruption), Thyroid Disorders (miscarriage, developmental delays, preterm birth, low birth weight).",
  },
};

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  const cfg = CONFIGS[slug];
  if (!cfg) {
    console.error(`No config for: ${slug}\nAvailable:\n  ` + Object.keys(CONFIGS).join("\n  "));
    process.exit(1);
  }

  console.log(`\n▶ Replacing photo with infographic: ${slug}`);

  const doc = await sanity.fetch<{ _id: string; contentRaw: string }>(
    `*[_type=="blog"&&slug=="${slug}"][0]{_id,contentRaw}`
  );
  if (!doc?._id) throw new Error(`Blog not found: ${slug}`);
  console.log(`  Doc: ${doc._id}`);

  const es = JSON.parse(doc.contentRaw) as { root: { children: Record<string, unknown>[] } };
  const children = es.root.children;

  // Find and replace the first externalImage block
  let replaced = false;
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.type === "block" && (node.fields as Record<string, unknown>)?.blockType === "externalImage") {
      children[i] = {
        type: "block",
        format: "",
        indent: 0,
        version: 1,
        children: [],
        fields: {
          id:          nid(),
          blockName:   "",
          blockType:   "infographic",
          title:       cfg.title,
          svgContent:  cfg.svg,
          altText:     cfg.altText,
          caption:     "",
        },
      };
      console.log(`  ✓ Replaced externalImage at [${i}] with infographic "${cfg.title}"`);
      replaced = true;
      break;
    }
  }

  if (!replaced) {
    console.log("  ⚠ No externalImage block found — nothing to replace");
    return;
  }

  const newContentRaw = JSON.stringify(es);
  await sanity.patch(doc._id).set({ contentRaw: newContentRaw }).commit();
  console.log(`  ✅ Patched ${doc._id} (${newContentRaw.length} bytes)\n`);
}

main().catch(e => { console.error("❌", e); process.exit(1); });
