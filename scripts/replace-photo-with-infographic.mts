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

// ── Wave 2 SVGs ──────────────────────────────────────────────────────

// Blog 1 (IUI vs IVF): "Who Should Choose IUI vs IVF?" — 2-col decision guide
// Data from blog nodes [7] (IUI candidates) and [12] (IVF candidates)
const SVG_IUI_VS_IVF_CHOOSE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="238.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">WHO SHOULD CHOOSE IUI vs IVF?</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Left panel header: IUI -->
  <rect x="40" y="44" width="340" height="32" rx="6" fill="${C.rose}"/>
  <text x="210" y="65" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">CHOOSE IUI WHEN:</text>

  <!-- IUI items -->
  <circle cx="64" cy="97" r="10" fill="${C.rose}"/><text x="64" y="101" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">1</text>
  <text x="84" y="93" font-size="11" font-weight="600" fill="${C.dark}">Mild male factor infertility</text>
  <text x="84" y="107" font-size="10" fill="${C.muted}">Low count or mild motility issues</text>

  <circle cx="64" cy="130" r="10" fill="${C.rose}"/><text x="64" y="134" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">2</text>
  <text x="84" y="126" font-size="11" font-weight="600" fill="${C.dark}">Ovulation disorders (PCOS)</text>
  <text x="84" y="140" font-size="10" fill="${C.muted}">With or without mild stimulation</text>

  <circle cx="64" cy="163" r="10" fill="${C.rose}"/><text x="64" y="167" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">3</text>
  <text x="84" y="159" font-size="11" font-weight="600" fill="${C.dark}">Unexplained infertility (under 35)</text>
  <text x="84" y="173" font-size="10" fill="${C.muted}">Tubes open, reasonable sperm</text>

  <circle cx="64" cy="196" r="10" fill="${C.rose}"/><text x="64" y="200" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">4</text>
  <text x="84" y="192" font-size="11" font-weight="600" fill="${C.dark}">Single women / donor sperm</text>
  <text x="84" y="206" font-size="10" fill="${C.muted}">Or cervical factor infertility</text>

  <!-- Divider -->
  <line x1="400" y1="44" x2="400" y2="228" stroke="${C.border}" stroke-width="1"/>

  <!-- Right panel header: IVF -->
  <rect x="420" y="44" width="340" height="32" rx="6" fill="${C.rose}"/>
  <text x="590" y="65" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">CHOOSE IVF WHEN:</text>

  <!-- IVF items -->
  <circle cx="444" cy="97" r="10" fill="${C.rose}"/><text x="444" y="101" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">1</text>
  <text x="464" y="93" font-size="11" font-weight="600" fill="${C.dark}">Blocked / damaged fallopian tubes</text>
  <text x="464" y="107" font-size="10" fill="${C.muted}">Most common IVF indication</text>

  <circle cx="444" cy="130" r="10" fill="${C.rose}"/><text x="444" y="134" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">2</text>
  <text x="464" y="126" font-size="11" font-weight="600" fill="${C.dark}">Severe male factor / azoospermia</text>
  <text x="464" y="140" font-size="10" fill="${C.muted}">Very low count, zero motility</text>

  <circle cx="444" cy="163" r="10" fill="${C.rose}"/><text x="444" y="167" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">3</text>
  <text x="464" y="159" font-size="11" font-weight="600" fill="${C.dark}">Failed 3 or more IUI cycles</text>
  <text x="464" y="173" font-size="10" fill="${C.muted}">Or women over 35 trying 6+ months</text>

  <circle cx="444" cy="196" r="10" fill="${C.rose}"/><text x="444" y="200" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">4</text>
  <text x="464" y="192" font-size="11" font-weight="600" fill="${C.dark}">Endometriosis / poor ovarian reserve</text>
  <text x="464" y="206" font-size="10" fill="${C.muted}">Recurrent miscarriage needing PGT</text>

  <text x="400" y="234" text-anchor="middle" font-size="9" fill="${C.muted}">Source: Bavishi Fertility Institute clinical guidelines</text>
</svg>`;

// Blog 2 (10 foods): "10 Foods That Boost Egg Quality" — 2×5 grid
// Data from blog headings: Avocados [6], Leafy Greens [11], Berries [17], Nuts & Seeds [23],
// Whole Grains [28], Eggs [33], Fatty Fish [38], Lentils [43], Citrus [48], Dark Chocolate [53]
const SVG_TEN_FOODS_EGG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 248" font-family="${FONT}">
  <rect width="800" height="248" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="246.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">10 FOODS THAT BOOST EGG QUALITY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Left column: items 1-5 -->
  <rect x="40" y="44" width="340" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="62" r="12" fill="${C.rose}"/><text x="70" y="66.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="94" y="58" font-size="11.5" font-weight="600" fill="${C.dark}">Avocados</text>
  <text x="94" y="71" font-size="10" fill="${C.muted}">Healthy fats, Vitamin E &amp; folate</text>

  <rect x="40" y="86" width="340" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="104" r="12" fill="${C.rose}"/><text x="70" y="108.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="94" y="100" font-size="11.5" font-weight="600" fill="${C.dark}">Leafy Green Vegetables</text>
  <text x="94" y="113" font-size="10" fill="${C.muted}">Spinach, Kale, Fenugreek — rich in folate</text>

  <rect x="40" y="128" width="340" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="146" r="12" fill="${C.rose}"/><text x="70" y="150.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="94" y="142" font-size="11.5" font-weight="600" fill="${C.dark}">Berries</text>
  <text x="94" y="155" font-size="10" fill="${C.muted}">Blueberries, Strawberries — antioxidants</text>

  <rect x="40" y="170" width="340" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="188" r="12" fill="${C.rose}"/><text x="70" y="192.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="94" y="184" font-size="11.5" font-weight="600" fill="${C.dark}">Nuts &amp; Seeds</text>
  <text x="94" y="197" font-size="10" fill="${C.muted}">Walnuts, Flaxseeds, Pumpkin Seeds</text>

  <rect x="40" y="212" width="340" height="28" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="226" r="12" fill="${C.rose}"/><text x="70" y="230.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="94" y="230" font-size="11.5" font-weight="600" fill="${C.dark}">Whole Grains</text>

  <!-- Right column: items 6-10 -->
  <rect x="420" y="44" width="340" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="450" cy="62" r="12" fill="${C.rose}"/><text x="450" y="66.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="474" y="58" font-size="11.5" font-weight="600" fill="${C.dark}">Eggs</text>
  <text x="474" y="71" font-size="10" fill="${C.muted}">Protein, choline &amp; Vitamin D</text>

  <rect x="420" y="86" width="340" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="450" cy="104" r="12" fill="${C.rose}"/><text x="450" y="108.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">7</text>
  <text x="474" y="100" font-size="11.5" font-weight="600" fill="${C.dark}">Fatty Fish</text>
  <text x="474" y="113" font-size="10" fill="${C.muted}">Salmon, Sardines — Omega-3 rich</text>

  <rect x="420" y="128" width="340" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="450" cy="146" r="12" fill="${C.rose}"/><text x="450" y="150.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">8</text>
  <text x="474" y="142" font-size="11.5" font-weight="600" fill="${C.dark}">Lentils &amp; Legumes</text>
  <text x="474" y="155" font-size="10" fill="${C.muted}">Plant iron, folate &amp; protein</text>

  <rect x="420" y="170" width="340" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="450" cy="188" r="12" fill="${C.rose}"/><text x="450" y="192.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">9</text>
  <text x="474" y="184" font-size="11.5" font-weight="600" fill="${C.dark}">Citrus Fruits</text>
  <text x="474" y="197" font-size="10" fill="${C.muted}">Oranges, Lemons — Vitamin C</text>

  <rect x="420" y="212" width="340" height="28" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="450" cy="226" r="12" fill="${C.rose}"/><text x="450" y="230.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">10</text>
  <text x="474" y="230" font-size="11.5" font-weight="600" fill="${C.dark}">Dark Chocolate (70%+ Cocoa)</text>
</svg>`;

// Blog 3 (male infertility): "Common Causes of Male Infertility" — 4-box grid
// Data from blog node [29]
const SVG_MALE_INFERTILITY_CAUSES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 248" font-family="${FONT}">
  <rect width="800" height="248" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="246.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">COMMON CAUSES OF MALE INFERTILITY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Box 1: Medical -->
  <rect x="40" y="48" width="340" height="92" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="340" height="30" rx="8" fill="${C.rose}"/>
  <rect x="40" y="66" width="340" height="12" fill="${C.rose}"/>
  <text x="210" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">MEDICAL</text>
  <text x="58" y="92" font-size="10.5" fill="${C.dark}">• Varicocele (enlarged scrotal veins)</text>
  <text x="58" y="108" font-size="10.5" fill="${C.dark}">• Hormonal imbalances &amp; infections</text>
  <text x="58" y="124" font-size="10.5" fill="${C.dark}">• Undescended testes / diabetes</text>

  <!-- Box 2: Genetic -->
  <rect x="420" y="48" width="340" height="92" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="420" y="48" width="340" height="30" rx="8" fill="${C.rose}"/>
  <rect x="420" y="66" width="340" height="12" fill="${C.rose}"/>
  <text x="590" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">GENETIC</text>
  <text x="438" y="92" font-size="10.5" fill="${C.dark}">• Klinefelter syndrome</text>
  <text x="438" y="108" font-size="10.5" fill="${C.dark}">• Y-chromosome microdeletions</text>
  <text x="438" y="124" font-size="10.5" fill="${C.dark}">• Other chromosomal disorders</text>

  <!-- Box 3: Lifestyle -->
  <rect x="40" y="152" width="340" height="88" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="152" width="340" height="30" rx="8" fill="${C.rose}"/>
  <rect x="40" y="170" width="340" height="12" fill="${C.rose}"/>
  <text x="210" y="172" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">LIFESTYLE</text>
  <text x="58" y="196" font-size="10.5" fill="${C.dark}">• Smoking, alcohol &amp; drug use</text>
  <text x="58" y="212" font-size="10.5" fill="${C.dark}">• Obesity &amp; poor diet</text>
  <text x="58" y="228" font-size="10.5" fill="${C.dark}">• Stress &amp; lack of exercise</text>

  <!-- Box 4: Environmental -->
  <rect x="420" y="152" width="340" height="88" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="420" y="152" width="340" height="30" rx="8" fill="${C.rose}"/>
  <rect x="420" y="170" width="340" height="12" fill="${C.rose}"/>
  <text x="590" y="172" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">ENVIRONMENTAL</text>
  <text x="438" y="196" font-size="10.5" fill="${C.dark}">• Heat exposure (hot tubs, laptops)</text>
  <text x="438" y="212" font-size="10.5" fill="${C.dark}">• Toxins, radiation &amp; chemicals</text>
  <text x="438" y="228" font-size="10.5" fill="${C.dark}">• Occupational exposures</text>
</svg>`;

// Blog 4 (nutrition): "Key Nutrients for Fertility" — 2-col female / male
// Data from blog nodes [9-17] (female) and [19-24] (male)
const SVG_FERTILITY_NUTRIENTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="238.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">KEY NUTRIENTS FOR FERTILITY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Left panel: Female -->
  <rect x="40" y="44" width="340" height="30" rx="6" fill="${C.rose}"/>
  <text x="210" y="64" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">FEMALE FERTILITY</text>

  <circle cx="64" cy="97" r="11" fill="${C.rose}"/><text x="64" y="101" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">1</text>
  <text x="86" y="93" font-size="11" font-weight="600" fill="${C.dark}">Folate (Vitamin B9)</text>
  <text x="86" y="107" font-size="10" fill="${C.muted}">Leafy greens, citrus, beans</text>

  <circle cx="64" cy="128" r="11" fill="${C.rose}"/><text x="64" y="132" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">2</text>
  <text x="86" y="124" font-size="11" font-weight="600" fill="${C.dark}">Iron</text>
  <text x="86" y="138" font-size="10" fill="${C.muted}">Lentils, spinach, tofu</text>

  <circle cx="64" cy="159" r="11" fill="${C.rose}"/><text x="64" y="163" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">3</text>
  <text x="86" y="155" font-size="11" font-weight="600" fill="${C.dark}">Omega-3 Fatty Acids</text>
  <text x="86" y="169" font-size="10" fill="${C.muted}">Salmon, sardines, flaxseeds</text>

  <circle cx="64" cy="190" r="11" fill="${C.rose}"/><text x="64" y="194" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">4</text>
  <text x="86" y="186" font-size="11" font-weight="600" fill="${C.dark}">Vitamin D</text>
  <text x="86" y="200" font-size="10" fill="${C.muted}">Sunlight, egg yolks, mushrooms</text>

  <!-- Divider -->
  <line x1="400" y1="44" x2="400" y2="224" stroke="${C.border}" stroke-width="1"/>

  <!-- Right panel: Male -->
  <rect x="420" y="44" width="340" height="30" rx="6" fill="${C.rose}"/>
  <text x="590" y="64" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">MALE FERTILITY</text>

  <circle cx="444" cy="97" r="11" fill="${C.rose}"/><text x="444" y="101" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">1</text>
  <text x="466" y="93" font-size="11" font-weight="600" fill="${C.dark}">Zinc</text>
  <text x="466" y="107" font-size="10" fill="${C.muted}">Pumpkin seeds, oysters, legumes</text>

  <circle cx="444" cy="128" r="11" fill="${C.rose}"/><text x="444" y="132" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">2</text>
  <text x="466" y="124" font-size="11" font-weight="600" fill="${C.dark}">Vitamin C</text>
  <text x="466" y="138" font-size="10" fill="${C.muted}">Citrus fruits, bell peppers</text>

  <circle cx="444" cy="159" r="11" fill="${C.rose}"/><text x="444" y="163" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">3</text>
  <text x="466" y="155" font-size="11" font-weight="600" fill="${C.dark}">Coenzyme Q10</text>
  <text x="466" y="169" font-size="10" fill="${C.muted}">Organ meats, soybeans, whole grains</text>

  <text x="400" y="234" text-anchor="middle" font-size="9" fill="${C.muted}">Source: Bavishi Fertility Institute nutrition guidelines</text>
</svg>`;

// Blog 5 (ICSI vs IVF): "When to Choose IVF vs ICSI" — 2-col decision guide
// Data from blog nodes [23-26]
const SVG_ICSI_VS_IVF_WHEN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 232" font-family="${FONT}">
  <rect width="800" height="232" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="230.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">WHEN TO CHOOSE IVF VS ICSI</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Left: IVF -->
  <rect x="40" y="44" width="340" height="30" rx="6" fill="${C.rose}"/>
  <text x="210" y="64" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">CHOOSE IVF WHEN:</text>

  <circle cx="64" cy="97" r="10" fill="${C.rose}"/><text x="64" y="101" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">1</text>
  <text x="84" y="93" font-size="11" font-weight="600" fill="${C.dark}">Female or unexplained infertility</text>
  <text x="84" y="107" font-size="10" fill="${C.muted}">Male partner has normal sperm</text>

  <circle cx="64" cy="130" r="10" fill="${C.rose}"/><text x="64" y="134" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">2</text>
  <text x="84" y="126" font-size="11" font-weight="600" fill="${C.dark}">No previous fertilization failure</text>
  <text x="84" y="140" font-size="10" fill="${C.muted}">Eggs and sperm can fertilize naturally</text>

  <circle cx="64" cy="163" r="10" fill="${C.rose}"/><text x="64" y="167" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">3</text>
  <text x="84" y="159" font-size="11" font-weight="600" fill="${C.dark}">Fertility preservation</text>
  <text x="84" y="173" font-size="10" fill="${C.muted}">Egg freezing before cancer treatment</text>

  <!-- Divider -->
  <line x1="400" y1="44" x2="400" y2="216" stroke="${C.border}" stroke-width="1"/>

  <!-- Right: ICSI -->
  <rect x="420" y="44" width="340" height="30" rx="6" fill="${C.rose}"/>
  <text x="590" y="64" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">CHOOSE ICSI WHEN:</text>

  <circle cx="444" cy="97" r="10" fill="${C.rose}"/><text x="444" y="101" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">1</text>
  <text x="464" y="93" font-size="11" font-weight="600" fill="${C.dark}">Low sperm count or poor motility</text>
  <text x="464" y="107" font-size="10" fill="${C.muted}">Abnormal sperm shape (morphology)</text>

  <circle cx="444" cy="130" r="10" fill="${C.rose}"/><text x="444" y="134" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">2</text>
  <text x="464" y="126" font-size="11" font-weight="600" fill="${C.dark}">Previous IVF fertilization failure</text>
  <text x="464" y="140" font-size="10" fill="${C.muted}">Eggs not fertilizing in standard IVF</text>

  <circle cx="444" cy="163" r="10" fill="${C.rose}"/><text x="444" y="167" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">3</text>
  <text x="464" y="159" font-size="11" font-weight="600" fill="${C.dark}">Frozen or surgically retrieved sperm</text>
  <text x="464" y="173" font-size="10" fill="${C.muted}">TESA, PESA, or Micro-TESE</text>

  <text x="400" y="226" text-anchor="middle" font-size="9" fill="${C.muted}">Source: Bavishi Fertility Institute treatment guidelines</text>
</svg>`;

// ── Wave 3 SVGs ──────────────────────────────────────────────────────

// Blog W3-1 (ICSI Lifestyle): "5 Lifestyle Factors That Affect ICSI Success"
// Data sourced from blog H2 sections: Diet & Nutrition, Smoking, Stress, Exercise, Shared Responsibility
const SVG_ICSI_LIFESTYLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 252" font-family="${FONT}">
  <rect width="800" height="252" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="250.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 LIFESTYLE FACTORS THAT AFFECT ICSI SUCCESS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1 -->
  <rect x="40" y="44" width="720" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="62" r="12" fill="${C.rose}"/>
  <text x="72" y="66.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="98" y="57" font-size="11.5" font-weight="600" fill="${C.dark}">Diet &amp; Nutrition</text>
  <text x="98" y="72" font-size="10.5" fill="${C.muted}">Antioxidant-rich foods (fruits, vegetables, lean protein) build healthy eggs and sperm</text>

  <!-- Row 2 -->
  <rect x="40" y="86" width="720" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="104" r="12" fill="${C.rose}"/>
  <text x="72" y="108.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="98" y="99" font-size="11.5" font-weight="600" fill="${C.dark}">Avoid Smoking</text>
  <text x="98" y="114" font-size="10.5" fill="${C.muted}">Smoking reduces sperm quality and egg health — significant risk to ICSI outcomes</text>

  <!-- Row 3 -->
  <rect x="40" y="128" width="720" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="146" r="12" fill="${C.rose}"/>
  <text x="72" y="150.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="98" y="141" font-size="11.5" font-weight="600" fill="${C.dark}">Manage Stress &amp; Psychological Well-Being</text>
  <text x="98" y="156" font-size="10.5" fill="${C.muted}">Counselling, mindfulness and emotional support improve the mind-body connection</text>

  <!-- Row 4 -->
  <rect x="40" y="170" width="720" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="188" r="12" fill="${C.rose}"/>
  <text x="72" y="192.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="98" y="183" font-size="11.5" font-weight="600" fill="${C.dark}">Exercise &amp; Body Weight</text>
  <text x="98" y="198" font-size="10.5" fill="${C.muted}">Maintain a healthy BMI — both extremes of weight can affect hormones and fertility</text>

  <!-- Row 5 -->
  <rect x="40" y="212" width="720" height="32" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="228" r="12" fill="${C.rose}"/>
  <text x="72" y="232.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="98" y="223" font-size="11.5" font-weight="600" fill="${C.dark}">Shared Responsibility</text>
  <text x="98" y="238" font-size="10.5" fill="${C.muted}">ICSI success depends on both partners — lifestyle changes together yield best results</text>
</svg>`;

// Blog W3-2 (PGT): "3 Types of Pre-Implantation Genetic Testing (PGT)"
// Data from blog nodes [8][9]: PGT-A (aneuploidies), PGT-M (monogenic), PGT-SR (structural)
const SVG_PGT_TYPES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 228" font-family="${FONT}">
  <rect width="800" height="228" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="226.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">3 TYPES OF PRE-IMPLANTATION GENETIC TESTING (PGT)</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Panel 1: PGT-A -->
  <rect x="40" y="44" width="220" height="172" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="220" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="68" width="220" height="12" fill="${C.rose}"/>
  <text x="150" y="60" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">PGT-A</text>
  <text x="150" y="75" text-anchor="middle" font-size="9.5" font-weight="600" fill="${C.white}">Aneuploidies</text>
  <text x="58" y="102" font-size="10.5" font-weight="600" fill="${C.dark}">What it screens:</text>
  <text x="58" y="118" font-size="10" fill="${C.muted}">Abnormal chromosome numbers</text>
  <text x="58" y="133" font-size="10" fill="${C.muted}">(extra or missing chromosomes)</text>
  <text x="58" y="152" font-size="10.5" font-weight="600" fill="${C.dark}">Best for:</text>
  <text x="58" y="168" font-size="10" fill="${C.muted}">Women over 35</text>
  <text x="58" y="183" font-size="10" fill="${C.muted}">Recurrent miscarriage</text>
  <text x="58" y="198" font-size="10" fill="${C.muted}">Multiple IVF failures</text>

  <!-- Panel 2: PGT-M -->
  <rect x="290" y="44" width="220" height="172" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="290" y="44" width="220" height="36" rx="8" fill="${C.rose}"/>
  <rect x="290" y="68" width="220" height="12" fill="${C.rose}"/>
  <text x="400" y="60" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">PGT-M</text>
  <text x="400" y="75" text-anchor="middle" font-size="9.5" font-weight="600" fill="${C.white}">Monogenic / Single Gene</text>
  <text x="308" y="102" font-size="10.5" font-weight="600" fill="${C.dark}">What it screens:</text>
  <text x="308" y="118" font-size="10" fill="${C.muted}">Specific inherited genetic</text>
  <text x="308" y="133" font-size="10" fill="${C.muted}">disorders in embryos</text>
  <text x="308" y="152" font-size="10.5" font-weight="600" fill="${C.dark}">Best for:</text>
  <text x="308" y="168" font-size="10" fill="${C.muted}">Carriers of BRCA mutation</text>
  <text x="308" y="183" font-size="10" fill="${C.muted}">Cystic fibrosis / sickle cell</text>
  <text x="308" y="198" font-size="10" fill="${C.muted}">Known hereditary conditions</text>

  <!-- Panel 3: PGT-SR -->
  <rect x="540" y="44" width="220" height="172" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="540" y="44" width="220" height="36" rx="8" fill="${C.rose}"/>
  <rect x="540" y="68" width="220" height="12" fill="${C.rose}"/>
  <text x="650" y="60" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">PGT-SR</text>
  <text x="650" y="75" text-anchor="middle" font-size="9.5" font-weight="600" fill="${C.white}">Structural Rearrangements</text>
  <text x="558" y="102" font-size="10.5" font-weight="600" fill="${C.dark}">What it screens:</text>
  <text x="558" y="118" font-size="10" fill="${C.muted}">Structural chromosome</text>
  <text x="558" y="133" font-size="10" fill="${C.muted}">rearrangements in embryos</text>
  <text x="558" y="152" font-size="10.5" font-weight="600" fill="${C.dark}">Best for:</text>
  <text x="558" y="168" font-size="10" fill="${C.muted}">Balanced translocation carriers</text>
  <text x="558" y="183" font-size="10" fill="${C.muted}">Inversions or deletions</text>
  <text x="558" y="198" font-size="10" fill="${C.muted}">Recurrent pregnancy loss</text>
</svg>`;

// Blog W3-3 (Egg Freezing): "How Egg Freezing Works — 3 Steps"
// Data from blog nodes [11] Ovarian Stimulation, [14] Egg Retrieval, [16] Vitrification/Storage
const SVG_EGG_FREEZING_STEPS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 210" font-family="${FONT}">
  <rect width="800" height="210" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="208.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">HOW EGG FREEZING WORKS — 3 STEPS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Step 1 -->
  <rect x="40" y="48" width="210" height="148" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="145" cy="78" r="22" fill="${C.rose}"/>
  <text x="145" y="83" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">STEP 1</text>
  <text x="145" y="118" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}">Ovarian Stimulation</text>
  <text x="145" y="136" text-anchor="middle" font-size="10" fill="${C.muted}">Hormone injections over</text>
  <text x="145" y="150" text-anchor="middle" font-size="10" fill="${C.muted}">10–14 days to produce</text>
  <text x="145" y="164" text-anchor="middle" font-size="10" fill="${C.muted}">multiple mature eggs</text>
  <text x="145" y="186" text-anchor="middle" font-size="9" fill="${C.muted}">Monitored via ultrasound</text>

  <!-- Arrow 1 -->
  <text x="268" y="128" text-anchor="middle" font-size="22" fill="${C.rose}">→</text>

  <!-- Step 2 -->
  <rect x="295" y="48" width="210" height="148" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="400" cy="78" r="22" fill="${C.rose}"/>
  <text x="400" y="83" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">STEP 2</text>
  <text x="400" y="118" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}">Egg Retrieval</text>
  <text x="400" y="136" text-anchor="middle" font-size="10" fill="${C.muted}">Minor procedure under</text>
  <text x="400" y="150" text-anchor="middle" font-size="10" fill="${C.muted}">sedation — ultrasound-</text>
  <text x="400" y="164" text-anchor="middle" font-size="10" fill="${C.muted}">guided needle collection</text>
  <text x="400" y="186" text-anchor="middle" font-size="9" fill="${C.muted}">Takes 20–30 minutes</text>

  <!-- Arrow 2 -->
  <text x="523" y="128" text-anchor="middle" font-size="22" fill="${C.rose}">→</text>

  <!-- Step 3 -->
  <rect x="550" y="48" width="210" height="148" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="655" cy="78" r="22" fill="${C.rose}"/>
  <text x="655" y="83" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">STEP 3</text>
  <text x="655" y="118" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}">Freeze &amp; Store</text>
  <text x="655" y="136" text-anchor="middle" font-size="10" fill="${C.muted}">Vitrification (flash-</text>
  <text x="655" y="150" text-anchor="middle" font-size="10" fill="${C.muted}">freezing) technique</text>
  <text x="655" y="164" text-anchor="middle" font-size="10" fill="${C.muted}">stored in liquid nitrogen</text>
  <text x="655" y="186" text-anchor="middle" font-size="9" fill="${C.muted}">Preserved for years</text>
</svg>`;

// Blog W3-4 (IVF after 35): "IVF After 35 — 5 Techniques That Help"
// Data from blog nodes [10-14]: Genetic testing/PGT, Egg Freezing, Embryo Banking, Ovarian Rejuvenation, Personalised Protocol
const SVG_IVF_AFTER_35 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 252" font-family="${FONT}">
  <rect width="800" height="252" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="250.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">IVF AFTER 35 — 5 TECHNIQUES THAT MAKE A DIFFERENCE</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1: items 1 + 2 -->
  <rect x="40" y="46" width="340" height="64" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="66" r="13" fill="${C.rose}"/>
  <text x="72" y="71" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="98" y="60" font-size="11.5" font-weight="700" fill="${C.dark}">Genetic Testing (PGT)</text>
  <text x="98" y="76" font-size="10.5" fill="${C.muted}">Screens embryos for chromosomal</text>
  <text x="98" y="90" font-size="10.5" fill="${C.muted}">abnormalities before transfer</text>

  <rect x="420" y="46" width="340" height="64" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="452" cy="66" r="13" fill="${C.rose}"/>
  <text x="452" y="71" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="478" y="60" font-size="11.5" font-weight="700" fill="${C.dark}">Egg Freezing</text>
  <text x="478" y="76" font-size="10.5" fill="${C.muted}">Preserve fertility before age</text>
  <text x="478" y="90" font-size="10.5" fill="${C.muted}">further impacts egg quality</text>

  <!-- Row 2: items 3 + 4 -->
  <rect x="40" y="120" width="340" height="64" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="140" r="13" fill="${C.rose}"/>
  <text x="72" y="145" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="98" y="134" font-size="11.5" font-weight="700" fill="${C.dark}">Embryo Banking</text>
  <text x="98" y="150" font-size="10.5" fill="${C.muted}">Multiple stimulation cycles to</text>
  <text x="98" y="164" font-size="10.5" fill="${C.muted}">accumulate a healthy embryo batch</text>

  <rect x="420" y="120" width="340" height="64" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="452" cy="140" r="13" fill="${C.rose}"/>
  <text x="452" y="145" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="478" y="134" font-size="11.5" font-weight="700" fill="${C.dark}">Ovarian Rejuvenation</text>
  <text x="478" y="150" font-size="10.5" fill="${C.muted}">Emerging treatments for women</text>
  <text x="478" y="164" font-size="10.5" fill="${C.muted}">with significant ovarian reserve challenges</text>

  <!-- Row 3: item 5 (full width) -->
  <rect x="40" y="194" width="720" height="48" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="218" r="13" fill="${C.rose}"/>
  <text x="72" y="223" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="98" y="209" font-size="11.5" font-weight="700" fill="${C.dark}">Personalised IVF Protocol</text>
  <text x="98" y="225" font-size="10.5" fill="${C.muted}">Medication doses, stimulation timing, and transfer strategy tailored to each woman's unique fertility profile</text>
</svg>`;

// Blog W3-5 (PCOS Ovulation): "7 Natural Ways to Improve Ovulation with PCOS"
// Data from blog H3 headings across sections [11]-[46]
const SVG_PCOS_OVULATION = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 260" font-family="${FONT}">
  <rect width="800" height="260" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="258.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">7 NATURAL WAYS TO IMPROVE OVULATION WITH PCOS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Left column: items 1–4 -->
  <rect x="40" y="44" width="340" height="42" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="65" r="12" fill="${C.rose}"/>
  <text x="70" y="69.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="95" y="60" font-size="11.5" font-weight="600" fill="${C.dark}">PCOS-Friendly Diet</text>
  <text x="95" y="76" font-size="10" fill="${C.muted}">Low-GI foods that balance blood sugar and support ovulation</text>

  <rect x="40" y="92" width="340" height="42" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="113" r="12" fill="${C.rose}"/>
  <text x="70" y="117.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="95" y="108" font-size="11.5" font-weight="600" fill="${C.dark}">Maintain a Healthy Weight</text>
  <text x="95" y="124" font-size="10" fill="${C.muted}">Even 5–10% weight loss can restore regular ovulation in PCOS</text>

  <rect x="40" y="140" width="340" height="42" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="161" r="12" fill="${C.rose}"/>
  <text x="70" y="165.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="95" y="156" font-size="11.5" font-weight="600" fill="${C.dark}">Smart Exercise</text>
  <text x="95" y="172" font-size="10" fill="${C.muted}">Moderate cardio + strength training improves insulin sensitivity</text>

  <rect x="40" y="188" width="340" height="42" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="209" r="12" fill="${C.rose}"/>
  <text x="70" y="213.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="95" y="204" font-size="11.5" font-weight="600" fill="${C.dark}">Manage Stress &amp; Sleep</text>
  <text x="95" y="220" font-size="10" fill="${C.muted}">Chronic stress disrupts LH/FSH balance — aim for 7–9 hrs sleep</text>

  <!-- Right column: items 5–7 -->
  <rect x="420" y="44" width="340" height="42" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="450" cy="65" r="12" fill="${C.rose}"/>
  <text x="450" y="69.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="475" y="60" font-size="11.5" font-weight="600" fill="${C.dark}">Evidence-Based Supplements</text>
  <text x="475" y="76" font-size="10" fill="${C.muted}">Inositol, Vitamin D, Omega-3 — discuss with your doctor</text>

  <rect x="420" y="92" width="340" height="42" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="450" cy="113" r="12" fill="${C.rose}"/>
  <text x="450" y="117.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="475" y="108" font-size="11.5" font-weight="600" fill="${C.dark}">Herbal Support</text>
  <text x="475" y="124" font-size="10" fill="${C.muted}">Spearmint tea, cinnamon — emerging evidence, always consult first</text>

  <rect x="420" y="140" width="340" height="42" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="450" cy="161" r="12" fill="${C.rose}"/>
  <text x="450" y="165.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">7</text>
  <text x="475" y="156" font-size="11.5" font-weight="600" fill="${C.dark}">Track Ovulation Naturally</text>
  <text x="475" y="172" font-size="10" fill="${C.muted}">OPK strips, BBT charting — identify your fertile window</text>

  <text x="400" y="248" text-anchor="middle" font-size="9" fill="${C.muted}">Source: Bavishi Fertility Institute clinical guidance</text>
</svg>`;

// ── Wave 4 SVGs ──────────────────────────────────────────────────────

// Blog W4-1 (Miscarriage): "Waiting to Try Again After Miscarriage — Recommended Timeline"
// Data from blog node [6]: 1-2 cycles (4-8 wks), 3-6 months (after D&C), 6-12 months (recurrent)
const SVG_MISCARRIAGE_TIMELINE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" font-family="${FONT}">
  <rect width="800" height="200" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="198.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">WAITING TO TRY AGAIN AFTER MISCARRIAGE — RECOMMENDED TIMELINE</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Panel 1 -->
  <rect x="40" y="48" width="218" height="136" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="64" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">4 – 8 Weeks</text>
  <text x="149" y="78" text-anchor="middle" font-size="9.5" fill="${C.white}">1–2 Menstrual Cycles</text>
  <text x="149" y="104" text-anchor="middle" font-size="11" font-weight="600" fill="${C.dark}">General Recommendation</text>
  <text x="149" y="120" text-anchor="middle" font-size="10" fill="${C.muted}">Allows uterus to heal</text>
  <text x="149" y="135" text-anchor="middle" font-size="10" fill="${C.muted}">and hormonal balance</text>
  <text x="149" y="150" text-anchor="middle" font-size="10" fill="${C.muted}">to be restored</text>
  <text x="149" y="175" text-anchor="middle" font-size="9" fill="${C.rose}" font-weight="600">Standard recovery</text>

  <!-- Panel 2 -->
  <rect x="291" y="48" width="218" height="136" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="291" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="291" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="64" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">3 – 6 Months</text>
  <text x="400" y="78" text-anchor="middle" font-size="9.5" fill="${C.white}">After D&amp;C Procedure</text>
  <text x="400" y="104" text-anchor="middle" font-size="11" font-weight="600" fill="${C.dark}">Post-Procedure Recovery</text>
  <text x="400" y="120" text-anchor="middle" font-size="10" fill="${C.muted}">Uterus recovers fully</text>
  <text x="400" y="135" text-anchor="middle" font-size="10" fill="${C.muted}">from dilation &amp;</text>
  <text x="400" y="150" text-anchor="middle" font-size="10" fill="${C.muted}">curettage procedure</text>
  <text x="400" y="175" text-anchor="middle" font-size="9" fill="${C.rose}" font-weight="600">D&amp;C recovery window</text>

  <!-- Panel 3 -->
  <rect x="542" y="48" width="218" height="136" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="542" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="542" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="64" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">6 – 12 Months</text>
  <text x="651" y="78" text-anchor="middle" font-size="9.5" fill="${C.white}">Recurrent Miscarriage (3+)</text>
  <text x="651" y="104" text-anchor="middle" font-size="11" font-weight="600" fill="${C.dark}">Evaluation &amp; Treatment</text>
  <text x="651" y="120" text-anchor="middle" font-size="10" fill="${C.muted}">Time for full workup,</text>
  <text x="651" y="135" text-anchor="middle" font-size="10" fill="${C.muted}">underlying cause</text>
  <text x="651" y="150" text-anchor="middle" font-size="10" fill="${C.muted}">diagnosis &amp; treatment</text>
  <text x="651" y="175" text-anchor="middle" font-size="9" fill="${C.rose}" font-weight="600">Specialist consultation needed</text>
</svg>`;

// Blog W4-2 (Letrozole): "How Long Letrozole Stays in Your System"
// Data from blog node [11]: 1-2 days peak; 2-4 days half-life (50%); 4-7 days 75%; 10-14 days 95%
const SVG_LETROZOLE_CLEARANCE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 196" font-family="${FONT}">
  <rect width="800" height="196" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="194.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">HOW LONG LETROZOLE STAYS IN YOUR SYSTEM</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Stage 1 -->
  <rect x="40" y="48" width="160" height="132" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="120" cy="78" r="24" fill="${C.rose}"/>
  <text x="120" y="74" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1–2</text>
  <text x="120" y="87" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">DAYS</text>
  <text x="120" y="116" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Peak</text>
  <text x="120" y="131" text-anchor="middle" font-size="10" fill="${C.muted}">Plasma concentration</text>
  <text x="120" y="146" text-anchor="middle" font-size="10" fill="${C.muted}">at its highest</text>
  <text x="120" y="167" text-anchor="middle" font-size="9.5" font-weight="600" fill="${C.rose}">100% present</text>

  <!-- Arrow -->
  <text x="213" y="120" text-anchor="middle" font-size="20" fill="${C.rose}">→</text>

  <!-- Stage 2 -->
  <rect x="227" y="48" width="160" height="132" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="307" cy="78" r="24" fill="${C.rose}"/>
  <text x="307" y="74" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2–4</text>
  <text x="307" y="87" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">DAYS</text>
  <text x="307" y="116" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Half-Life</text>
  <text x="307" y="131" text-anchor="middle" font-size="10" fill="${C.muted}">50% of medication</text>
  <text x="307" y="146" text-anchor="middle" font-size="10" fill="${C.muted}">eliminated from body</text>
  <text x="307" y="167" text-anchor="middle" font-size="9.5" font-weight="600" fill="${C.rose}">~50% cleared</text>

  <!-- Arrow -->
  <text x="400" y="120" text-anchor="middle" font-size="20" fill="${C.rose}">→</text>

  <!-- Stage 3 -->
  <rect x="414" y="48" width="160" height="132" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="494" cy="78" r="24" fill="${C.rose}"/>
  <text x="494" y="74" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4–7</text>
  <text x="494" y="87" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">DAYS</text>
  <text x="494" y="116" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Mostly Gone</text>
  <text x="494" y="131" text-anchor="middle" font-size="10" fill="${C.muted}">75% of medication</text>
  <text x="494" y="146" text-anchor="middle" font-size="10" fill="${C.muted}">has been eliminated</text>
  <text x="494" y="167" text-anchor="middle" font-size="9.5" font-weight="600" fill="${C.rose}">~75% cleared</text>

  <!-- Arrow -->
  <text x="587" y="120" text-anchor="middle" font-size="20" fill="${C.rose}">→</text>

  <!-- Stage 4 -->
  <rect x="601" y="48" width="159" height="132" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="680" cy="78" r="24" fill="${C.rose}"/>
  <text x="680" y="74" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">10–14</text>
  <text x="680" y="87" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">DAYS</text>
  <text x="680" y="116" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Fully Cleared</text>
  <text x="680" y="131" text-anchor="middle" font-size="10" fill="${C.muted}">95% of medication</text>
  <text x="680" y="146" text-anchor="middle" font-size="10" fill="${C.muted}">out of your system</text>
  <text x="680" y="167" text-anchor="middle" font-size="9.5" font-weight="600" fill="${C.rose}">~95% cleared</text>
</svg>`;

// Blog W4-3 (Uterus recovery): "Uterine Recovery After Birth — Timeline"
// Data from blog node [9]: 0-24h grapefruit 2-3 lbs; 1-2 wks orange; 2-6 wks pear; 6-12 wks full tone
const SVG_UTERUS_RECOVERY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 196" font-family="${FONT}">
  <rect width="800" height="196" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="194.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">UTERINE RECOVERY AFTER BIRTH — TIMELINE</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Stage 1 -->
  <rect x="40" y="48" width="160" height="136" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="160" height="32" rx="8" fill="${C.rose}"/>
  <rect x="40" y="68" width="160" height="12" fill="${C.rose}"/>
  <text x="120" y="67" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">0 – 24 Hours</text>
  <text x="120" y="100" text-anchor="middle" font-size="11" font-weight="600" fill="${C.dark}">Grapefruit Size</text>
  <text x="120" y="116" text-anchor="middle" font-size="10" fill="${C.muted}">~2–3 lbs in weight</text>
  <text x="120" y="131" text-anchor="middle" font-size="10" fill="${C.muted}">Uterine contractions</text>
  <text x="120" y="146" text-anchor="middle" font-size="10" fill="${C.muted}">begin immediately</text>
  <text x="120" y="171" text-anchor="middle" font-size="9" fill="${C.muted}">Immediate postpartum</text>

  <!-- Arrow -->
  <text x="213" y="122" text-anchor="middle" font-size="20" fill="${C.rose}">→</text>

  <!-- Stage 2 -->
  <rect x="227" y="48" width="160" height="136" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="227" y="48" width="160" height="32" rx="8" fill="${C.rose}"/>
  <rect x="227" y="68" width="160" height="12" fill="${C.rose}"/>
  <text x="307" y="67" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">1 – 2 Weeks</text>
  <text x="307" y="100" text-anchor="middle" font-size="11" font-weight="600" fill="${C.dark}">Orange Size</text>
  <text x="307" y="116" text-anchor="middle" font-size="10" fill="${C.muted}">Continues to shrink</text>
  <text x="307" y="131" text-anchor="middle" font-size="10" fill="${C.muted}">Breastfeeding helps</text>
  <text x="307" y="146" text-anchor="middle" font-size="10" fill="${C.muted}">speed involution</text>
  <text x="307" y="171" text-anchor="middle" font-size="9" fill="${C.muted}">Early postpartum</text>

  <!-- Arrow -->
  <text x="400" y="122" text-anchor="middle" font-size="20" fill="${C.rose}">→</text>

  <!-- Stage 3 -->
  <rect x="414" y="48" width="160" height="136" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="414" y="48" width="160" height="32" rx="8" fill="${C.rose}"/>
  <rect x="414" y="68" width="160" height="12" fill="${C.rose}"/>
  <text x="494" y="67" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">2 – 6 Weeks</text>
  <text x="494" y="100" text-anchor="middle" font-size="11" font-weight="600" fill="${C.dark}">Pear Size</text>
  <text x="494" y="116" text-anchor="middle" font-size="10" fill="${C.muted}">Pre-pregnancy size</text>
  <text x="494" y="131" text-anchor="middle" font-size="10" fill="${C.muted}">and shape restored</text>
  <text x="494" y="146" text-anchor="middle" font-size="10" fill="${C.muted}">6-week checkup time</text>
  <text x="494" y="171" text-anchor="middle" font-size="9" fill="${C.muted}">Postpartum recovery</text>

  <!-- Arrow -->
  <text x="587" y="122" text-anchor="middle" font-size="20" fill="${C.rose}">→</text>

  <!-- Stage 4 -->
  <rect x="601" y="48" width="159" height="136" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="601" y="48" width="159" height="32" rx="8" fill="${C.rose}"/>
  <rect x="601" y="68" width="159" height="12" fill="${C.rose}"/>
  <text x="680" y="67" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">6 – 12 Weeks</text>
  <text x="680" y="100" text-anchor="middle" font-size="11" font-weight="600" fill="${C.dark}">Fully Restored</text>
  <text x="680" y="116" text-anchor="middle" font-size="10" fill="${C.muted}">Continues to tone</text>
  <text x="680" y="131" text-anchor="middle" font-size="10" fill="${C.muted}">and strengthen</text>
  <text x="680" y="146" text-anchor="middle" font-size="10" fill="${C.muted}">All changes resolve</text>
  <text x="680" y="171" text-anchor="middle" font-size="9" fill="${C.muted}">Full recovery</text>
</svg>`;

// Blog W4-4 (Gynecologist visits): "What Your Postpartum Gynecologist Visits Cover"
// Data from blog H3 sections [38]-[46]: Physical exam, Mental health, Breastfeeding, Family planning, Pelvic floor
const SVG_POSTPARTUM_VISITS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 252" font-family="${FONT}">
  <rect width="800" height="252" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="250.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">WHAT YOUR POSTPARTUM GYNECOLOGIST VISITS COVER</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1: items 1 + 2 -->
  <rect x="40" y="46" width="340" height="62" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="66" r="13" fill="${C.rose}"/>
  <text x="72" y="71" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="98" y="60" font-size="11.5" font-weight="700" fill="${C.dark}">Physical Examinations</text>
  <text x="98" y="75" font-size="10" fill="${C.muted}">Pelvic exam, breast check &amp; scar / incision</text>
  <text x="98" y="89" font-size="10" fill="${C.muted}">evaluation (C-section or episiotomy)</text>

  <rect x="420" y="46" width="340" height="62" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="452" cy="66" r="13" fill="${C.rose}"/>
  <text x="452" y="71" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="478" y="60" font-size="11.5" font-weight="700" fill="${C.dark}">Mental Health Evaluation</text>
  <text x="478" y="75" font-size="10" fill="${C.muted}">Screening for postpartum depression (PPD)</text>
  <text x="478" y="89" font-size="10" fill="${C.muted}">and anxiety; counselling referral if needed</text>

  <!-- Row 2: items 3 + 4 -->
  <rect x="40" y="118" width="340" height="62" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="138" r="13" fill="${C.rose}"/>
  <text x="72" y="143" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="98" y="132" font-size="11.5" font-weight="700" fill="${C.dark}">Breastfeeding Support</text>
  <text x="98" y="147" font-size="10" fill="${C.muted}">Lactation guidance, managing sore nipples,</text>
  <text x="98" y="161" font-size="10" fill="${C.muted}">mastitis treatment and milk supply concerns</text>

  <rect x="420" y="118" width="340" height="62" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="452" cy="138" r="13" fill="${C.rose}"/>
  <text x="452" y="143" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="478" y="132" font-size="11.5" font-weight="700" fill="${C.dark}">Family Planning</text>
  <text x="478" y="147" font-size="10" fill="${C.muted}">Contraception options discussed;</text>
  <text x="478" y="161" font-size="10" fill="${C.muted}">readiness for future pregnancies assessed</text>

  <!-- Row 3: item 5 (full width) -->
  <rect x="40" y="190" width="720" height="50" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="215" r="13" fill="${C.rose}"/>
  <text x="72" y="220" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="98" y="207" font-size="11.5" font-weight="700" fill="${C.dark}">Pelvic Floor Health</text>
  <text x="98" y="222" font-size="10" fill="${C.muted}">Assessment and exercises for pelvic floor dysfunction, incontinence, or pelvic pressure common after childbirth</text>
</svg>`;

// Blog W4-5 (Low AMH): "4 Ways Low AMH Affects Menstrual Cycles"
// Data from blog H3 sections [9], [13], [16], [19]: Irregular cycles, follicle count, ovulation, hormones
const SVG_LOW_AMH_EFFECTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 244" font-family="${FONT}">
  <rect width="800" height="244" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="242.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">4 WAYS LOW AMH AFFECTS MENSTRUAL CYCLES</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Box 1: Irregular Cycles -->
  <rect x="40" y="48" width="340" height="92" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="340" height="30" rx="8" fill="${C.rose}"/>
  <rect x="40" y="66" width="340" height="12" fill="${C.rose}"/>
  <text x="210" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">IRREGULAR CYCLES</text>
  <text x="58" y="92" font-size="10.5" fill="${C.dark}">• Skipped or missed periods</text>
  <text x="58" y="108" font-size="10.5" fill="${C.dark}">• Variable cycle length (shorter or longer)</text>
  <text x="58" y="124" font-size="10.5" fill="${C.dark}">• Diminished ovarian reserve as root cause</text>

  <!-- Box 2: Decreased Follicle Count -->
  <rect x="420" y="48" width="340" height="92" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="420" y="48" width="340" height="30" rx="8" fill="${C.rose}"/>
  <rect x="420" y="66" width="340" height="12" fill="${C.rose}"/>
  <text x="590" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">DECREASED FOLLICLE COUNT</text>
  <text x="438" y="92" font-size="10.5" fill="${C.dark}">• Fewer ovarian follicles available</text>
  <text x="438" y="108" font-size="10.5" fill="${C.dark}">• Inconsistent egg production each cycle</text>
  <text x="438" y="124" font-size="10.5" fill="${C.dark}">• Reduced egg reserve over time</text>

  <!-- Box 3: Disrupted Ovulation -->
  <rect x="40" y="152" width="340" height="84" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="152" width="340" height="30" rx="8" fill="${C.rose}"/>
  <rect x="40" y="170" width="340" height="12" fill="${C.rose}"/>
  <text x="210" y="172" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">DISRUPTED OVULATION</text>
  <text x="58" y="196" font-size="10.5" fill="${C.dark}">• Inconsistent or absent ovulation</text>
  <text x="58" y="212" font-size="10.5" fill="${C.dark}">• Anovulation — no egg released in cycle</text>
  <text x="58" y="228" font-size="10.5" fill="${C.dark}">• Disrupts cycle regularity directly</text>

  <!-- Box 4: Hormonal Imbalances -->
  <rect x="420" y="152" width="340" height="84" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="420" y="152" width="340" height="30" rx="8" fill="${C.rose}"/>
  <rect x="420" y="170" width="340" height="12" fill="${C.rose}"/>
  <text x="590" y="172" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">HORMONAL IMBALANCES</text>
  <text x="438" y="196" font-size="10.5" fill="${C.dark}">• Estrogen &amp; progesterone fluctuations</text>
  <text x="438" y="212" font-size="10.5" fill="${C.dark}">• Altered feedback to brain hormones</text>
  <text x="438" y="228" font-size="10.5" fill="${C.dark}">• Mood swings &amp; cycle instability</text>
</svg>`;

// ── Wave 5 SVGs ──────────────────────────────────────────────────────

// Blog W5-1 (IVF cycles): "4 Factors That Influence How Many IVF Cycles You May Need"
// Data from blog nodes [8-11]: Age, Fertility issues, Medical history, Response to previous cycles
const SVG_IVF_CYCLE_FACTORS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 244" font-family="${FONT}">
  <rect width="800" height="244" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="242.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">4 FACTORS THAT INFLUENCE HOW MANY IVF CYCLES YOU MAY NEED</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Box 1: Age -->
  <rect x="40" y="48" width="340" height="92" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="340" height="30" rx="8" fill="${C.rose}"/>
  <rect x="40" y="66" width="340" height="12" fill="${C.rose}"/>
  <text x="210" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">AGE</text>
  <text x="58" y="92" font-size="10.5" fill="${C.dark}">• Success rates decline with age, especially after 40</text>
  <text x="58" y="108" font-size="10.5" fill="${C.dark}">• Younger women may need fewer cycles</text>
  <text x="58" y="124" font-size="10.5" fill="${C.dark}">• Women over 45 may consider egg donation</text>

  <!-- Box 2: Fertility Issues -->
  <rect x="420" y="48" width="340" height="92" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="420" y="48" width="340" height="30" rx="8" fill="${C.rose}"/>
  <rect x="420" y="66" width="340" height="12" fill="${C.rose}"/>
  <text x="590" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">TYPE OF FERTILITY ISSUES</text>
  <text x="438" y="92" font-size="10.5" fill="${C.dark}">• Severity of the condition impacts outcomes</text>
  <text x="438" y="108" font-size="10.5" fill="${C.dark}">• Tubal, ovarian or male factor each differ</text>
  <text x="438" y="124" font-size="10.5" fill="${C.dark}">• Unexplained infertility may require more cycles</text>

  <!-- Box 3: Medical History -->
  <rect x="40" y="152" width="340" height="84" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="152" width="340" height="30" rx="8" fill="${C.rose}"/>
  <rect x="40" y="170" width="340" height="12" fill="${C.rose}"/>
  <text x="210" y="172" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">MEDICAL HISTORY</text>
  <text x="58" y="196" font-size="10.5" fill="${C.dark}">• Previous surgeries affect uterine environment</text>
  <text x="58" y="212" font-size="10.5" fill="${C.dark}">• Chronic conditions require tailored protocols</text>
  <text x="58" y="228" font-size="10.5" fill="${C.dark}">• Prior treatments inform the current plan</text>

  <!-- Box 4: Response to Previous Cycles -->
  <rect x="420" y="152" width="340" height="84" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="420" y="152" width="340" height="30" rx="8" fill="${C.rose}"/>
  <rect x="420" y="170" width="340" height="12" fill="${C.rose}"/>
  <text x="590" y="172" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">RESPONSE TO PREVIOUS CYCLES</text>
  <text x="438" y="196" font-size="10.5" fill="${C.dark}">• Ovarian response guides future stimulation</text>
  <text x="438" y="212" font-size="10.5" fill="${C.dark}">• Embryo quality from prior cycles matters</text>
  <text x="438" y="228" font-size="10.5" fill="${C.dark}">• Most clinics recommend 3–6 cycles total</text>
</svg>`;

// Blog W5-2 (Fetal weight): "Baby Weight Gain by Trimester"
// Data from blog nodes [6][7][9][10]: trimester-by-trimester weekly gain + milestone weights
const SVG_BABY_WEIGHT_TRIMESTERS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 206" font-family="${FONT}">
  <rect width="800" height="206" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="204.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">BABY WEIGHT GAIN BY TRIMESTER</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Panel 1: First Trimester -->
  <rect x="40" y="48" width="218" height="146" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="65" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">FIRST TRIMESTER</text>
  <text x="149" y="78" text-anchor="middle" font-size="10" fill="${C.white}">Weeks 0 – 12</text>
  <text x="149" y="106" text-anchor="middle" font-size="13" font-weight="700" fill="${C.rose}">0.5 – 1g / week</text>
  <line x1="68" y1="118" x2="230" y2="118" stroke="${C.border}" stroke-width="1"/>
  <text x="149" y="136" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">Milestone</text>
  <text x="149" y="152" text-anchor="middle" font-size="10" fill="${C.muted}">At 12 weeks:</text>
  <text x="149" y="167" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">~14 grams</text>
  <text x="149" y="184" text-anchor="middle" font-size="9" fill="${C.muted}">Organs forming rapidly</text>

  <!-- Panel 2: Second Trimester -->
  <rect x="291" y="48" width="218" height="146" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="291" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="291" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="65" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">SECOND TRIMESTER</text>
  <text x="400" y="78" text-anchor="middle" font-size="10" fill="${C.white}">Weeks 13 – 26</text>
  <text x="400" y="106" text-anchor="middle" font-size="13" font-weight="700" fill="${C.rose}">50 – 100g / week</text>
  <line x1="319" y1="118" x2="481" y2="118" stroke="${C.border}" stroke-width="1"/>
  <text x="400" y="136" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">Milestone</text>
  <text x="400" y="152" text-anchor="middle" font-size="10" fill="${C.muted}">At 20 weeks:</text>
  <text x="400" y="167" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">~300 grams</text>
  <text x="400" y="184" text-anchor="middle" font-size="9" fill="${C.muted}">Movement felt by mother</text>

  <!-- Panel 3: Third Trimester -->
  <rect x="542" y="48" width="218" height="146" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="542" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="542" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="65" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">THIRD TRIMESTER</text>
  <text x="651" y="78" text-anchor="middle" font-size="10" fill="${C.white}">Weeks 27 – 40</text>
  <text x="651" y="106" text-anchor="middle" font-size="13" font-weight="700" fill="${C.rose}">100 – 200g / week</text>
  <line x1="570" y1="118" x2="732" y2="118" stroke="${C.border}" stroke-width="1"/>
  <text x="651" y="136" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">Milestone</text>
  <text x="651" y="152" text-anchor="middle" font-size="10" fill="${C.muted}">At 40 weeks:</text>
  <text x="651" y="167" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">3 – 4 kg</text>
  <text x="651" y="184" text-anchor="middle" font-size="9" fill="${C.muted}">Full-term birth weight</text>
</svg>`;

// Blog W5-3 (Fibroids): "3 Types of Uterine Fibroids"
// Data from blog nodes [11][13][14]: Submucosal, Intramural (most common), Subserosal
const SVG_FIBROID_TYPES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 210" font-family="${FONT}">
  <rect width="800" height="210" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="208.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">3 TYPES OF UTERINE FIBROIDS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Panel 1: Submucosal -->
  <rect x="40" y="48" width="218" height="150" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="65" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">SUBMUCOSAL</text>
  <text x="149" y="78" text-anchor="middle" font-size="9.5" fill="${C.white}">Inner lining layer</text>
  <text x="149" y="104" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">Location</text>
  <text x="149" y="120" text-anchor="middle" font-size="10" fill="${C.muted}">Just beneath the inner</text>
  <text x="149" y="134" text-anchor="middle" font-size="10" fill="${C.muted}">uterine lining (endometrium)</text>
  <text x="149" y="152" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">Main Symptom</text>
  <text x="149" y="168" text-anchor="middle" font-size="10" fill="${C.muted}">Heavy menstrual bleeding</text>
  <text x="149" y="182" text-anchor="middle" font-size="10" fill="${C.muted}">Prolonged periods</text>

  <!-- Panel 2: Intramural -->
  <rect x="291" y="48" width="218" height="150" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="291" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="291" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="65" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">INTRAMURAL</text>
  <text x="400" y="78" text-anchor="middle" font-size="9.5" fill="${C.white}">Most common type</text>
  <text x="400" y="104" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">Location</text>
  <text x="400" y="120" text-anchor="middle" font-size="10" fill="${C.muted}">Within the muscular wall</text>
  <text x="400" y="134" text-anchor="middle" font-size="10" fill="${C.muted}">of the uterus (myometrium)</text>
  <text x="400" y="152" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">Main Symptom</text>
  <text x="400" y="168" text-anchor="middle" font-size="10" fill="${C.muted}">Pelvic pain &amp; pressure</text>
  <text x="400" y="182" text-anchor="middle" font-size="10" fill="${C.muted}">if large (&gt;4 cm)</text>

  <!-- Panel 3: Subserosal -->
  <rect x="542" y="48" width="218" height="150" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="542" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="542" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="65" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">SUBSEROSAL</text>
  <text x="651" y="78" text-anchor="middle" font-size="9.5" fill="${C.white}">Outer wall layer</text>
  <text x="651" y="104" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">Location</text>
  <text x="651" y="120" text-anchor="middle" font-size="10" fill="${C.muted}">On the outer wall of</text>
  <text x="651" y="134" text-anchor="middle" font-size="10" fill="${C.muted}">the uterus; grows outward</text>
  <text x="651" y="152" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">Main Symptom</text>
  <text x="651" y="168" text-anchor="middle" font-size="10" fill="${C.muted}">Pressure on bladder</text>
  <text x="651" y="182" text-anchor="middle" font-size="10" fill="${C.muted}">or rectum</text>
</svg>`;

// Blog W5-4 (Low AMH conception): "5 Ways to Improve Natural Conception with Low AMH"
// Data from blog H3 sections [16][19][22][25][27][29]: 10 tips — showing top 5 most actionable
const SVG_LOW_AMH_CONCEPTION = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 252" font-family="${FONT}">
  <rect width="800" height="252" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="250.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 WAYS TO IMPROVE NATURAL CONCEPTION WITH LOW AMH</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1 -->
  <rect x="40" y="44" width="720" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="62" r="12" fill="${C.rose}"/>
  <text x="72" y="66.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="98" y="57" font-size="11.5" font-weight="600" fill="${C.dark}">Track Ovulation Accurately</text>
  <text x="98" y="72" font-size="10.5" fill="${C.muted}">Use OPKs, BBT charting or apps — timing intercourse to your fertile window is crucial with low reserve</text>

  <!-- Row 2 -->
  <rect x="40" y="86" width="720" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="104" r="12" fill="${C.rose}"/>
  <text x="72" y="108.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="98" y="99" font-size="11.5" font-weight="600" fill="${C.dark}">Eat a Fertility-Friendly Diet</text>
  <text x="98" y="114" font-size="10.5" fill="${C.muted}">Antioxidant-rich foods (berries, leafy greens, nuts), whole grains, omega-3s — Mediterranean style diet</text>

  <!-- Row 3 -->
  <rect x="40" y="128" width="720" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="146" r="12" fill="${C.rose}"/>
  <text x="72" y="150.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="98" y="141" font-size="11.5" font-weight="600" fill="${C.dark}">Maintain a Healthy Body Weight</text>
  <text x="98" y="156" font-size="10.5" fill="${C.muted}">Aim for BMI 18.5–24.9; moderate exercise like yoga or walking supports hormonal balance</text>

  <!-- Row 4 -->
  <rect x="40" y="170" width="720" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="188" r="12" fill="${C.rose}"/>
  <text x="72" y="192.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="98" y="183" font-size="11.5" font-weight="600" fill="${C.dark}">Reduce Stress</text>
  <text x="98" y="198" font-size="10.5" fill="${C.muted}">Chronic stress disrupts ovulation — try meditation, yoga, acupuncture or counselling</text>

  <!-- Row 5 -->
  <rect x="40" y="212" width="720" height="32" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="72" cy="228" r="12" fill="${C.rose}"/>
  <text x="72" y="232.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="98" y="223" font-size="11.5" font-weight="600" fill="${C.dark}">Consider Evidence-Based Supplements</text>
  <text x="98" y="238" font-size="10.5" fill="${C.muted}">CoQ10 (Ubiquinol), Vitamin D, Omega-3s may support egg quality — always consult your doctor first</text>
</svg>`;

// Blog W5-5 (IUI naturally): "10 Natural Ways to Boost IUI Success"
// Data from blog node [5] list: all 10 tips verbatim from the blog's own introduction
const SVG_IUI_NATURAL_TIPS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 264" font-family="${FONT}">
  <rect width="800" height="264" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="262.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">10 NATURAL WAYS TO BOOST IUI SUCCESS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Left column: 1-5 -->
  <rect x="40" y="44" width="340" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="63" r="11" fill="${C.rose}"/><text x="66" y="67.5" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">1</text>
  <text x="88" y="58" font-size="11" font-weight="600" fill="${C.dark}">Track Ovulation Accurately</text>
  <text x="88" y="74" font-size="9.5" fill="${C.muted}">OPKs, BBT charting, cervical mucus</text>

  <rect x="40" y="88" width="340" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="107" r="11" fill="${C.rose}"/><text x="66" y="111.5" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">2</text>
  <text x="88" y="102" font-size="11" font-weight="600" fill="${C.dark}">Eat a Fertility-Friendly Diet</text>
  <text x="88" y="118" font-size="9.5" fill="${C.muted}">Leafy greens, whole grains, omega-3s</text>

  <rect x="40" y="132" width="340" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="151" r="11" fill="${C.rose}"/><text x="66" y="155.5" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">3</text>
  <text x="88" y="146" font-size="11" font-weight="600" fill="${C.dark}">Maintain Healthy Body Weight</text>
  <text x="88" y="162" font-size="9.5" fill="${C.muted}">BMI 18.5–24.9 improves ovulation</text>

  <rect x="40" y="176" width="340" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="195" r="11" fill="${C.rose}"/><text x="66" y="199.5" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">4</text>
  <text x="88" y="190" font-size="11" font-weight="600" fill="${C.dark}">Reduce Stress &amp; Prioritise Mental Health</text>
  <text x="88" y="206" font-size="9.5" fill="${C.muted}">Yoga, meditation, counselling</text>

  <rect x="40" y="220" width="340" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="239" r="11" fill="${C.rose}"/><text x="66" y="243.5" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">5</text>
  <text x="88" y="234" font-size="11" font-weight="600" fill="${C.dark}">Fertility Yoga &amp; Light Exercise</text>
  <text x="88" y="250" font-size="9.5" fill="${C.muted}">Increases blood flow to reproductive organs</text>

  <!-- Right column: 6-10 -->
  <rect x="420" y="44" width="340" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="446" cy="63" r="11" fill="${C.rose}"/><text x="446" y="67.5" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">6</text>
  <text x="468" y="58" font-size="11" font-weight="600" fill="${C.dark}">Avoid Alcohol, Smoking &amp; Toxins</text>
  <text x="468" y="74" font-size="9.5" fill="${C.muted}">BPA, phthalates harm egg &amp; sperm quality</text>

  <rect x="420" y="88" width="340" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="446" cy="107" r="11" fill="${C.rose}"/><text x="446" y="111.5" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">7</text>
  <text x="468" y="102" font-size="11" font-weight="600" fill="${C.dark}">Get Adequate Sleep</text>
  <text x="468" y="118" font-size="9.5" fill="${C.muted}">Aim 7–9 hrs; consistent schedule</text>

  <rect x="420" y="132" width="340" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="446" cy="151" r="11" fill="${C.rose}"/><text x="446" y="155.5" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">8</text>
  <text x="468" y="146" font-size="11" font-weight="600" fill="${C.dark}">Evidence-Based Supplements</text>
  <text x="468" y="162" font-size="9.5" fill="${C.muted}">CoQ10, Vitamin D, Inositol (with doctor)</text>

  <rect x="420" y="176" width="340" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="446" cy="195" r="11" fill="${C.rose}"/><text x="446" y="199.5" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">9</text>
  <text x="468" y="190" font-size="11" font-weight="600" fill="${C.dark}">Male Partner Health Matters Too</text>
  <text x="468" y="206" font-size="9.5" fill="${C.muted}">Antioxidants, no heat, no smoking</text>

  <rect x="420" y="220" width="340" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="446" cy="239" r="11" fill="${C.rose}"/><text x="446" y="243.5" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">10</text>
  <text x="468" y="234" font-size="11" font-weight="600" fill="${C.dark}">Build a Positive Mindset</text>
  <text x="468" y="250" font-size="9.5" fill="${C.muted}">Set realistic expectations; trust the process</text>
</svg>`;

// ── Wave 6 SVGs ──────────────────────────────────────────────────────

const SVG_IVF_MENTAL_HEALTH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 310" font-family="${FONT}">
  <rect width="800" height="310" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="38" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">5 Reasons IVF Can Be Emotionally Challenging</text>
  <line x1="40" y1="52" x2="760" y2="52" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1 -->
  <rect x="40" y="64" width="720" height="42" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="85" r="13" fill="${C.rose}"/>
  <text x="68" y="89.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="94" y="80" font-size="12" font-weight="600" fill="${C.dark}">Uncertainty of Outcomes</text>
  <text x="94" y="97" font-size="10.5" fill="${C.muted}">Each cycle brings anticipation — results may vary and are never guaranteed</text>

  <!-- Row 2 -->
  <rect x="40" y="114" width="720" height="42" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="135" r="13" fill="${C.rose}"/>
  <text x="68" y="139.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="94" y="130" font-size="12" font-weight="600" fill="${C.dark}">Hormonal Changes</text>
  <text x="94" y="147" font-size="10.5" fill="${C.muted}">Fertility medications intensify emotional sensitivity and mood fluctuations</text>

  <!-- Row 3 -->
  <rect x="40" y="164" width="720" height="42" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="185" r="13" fill="${C.rose}"/>
  <text x="68" y="189.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="94" y="180" font-size="12" font-weight="600" fill="${C.dark}">Social Pressure</text>
  <text x="94" y="197" font-size="10.5" fill="${C.muted}">Family and societal expectations create additional emotional burden</text>

  <!-- Row 4 -->
  <rect x="40" y="214" width="720" height="42" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="235" r="13" fill="${C.rose}"/>
  <text x="68" y="239.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="94" y="230" font-size="12" font-weight="600" fill="${C.dark}">Financial Stress</text>
  <text x="94" y="247" font-size="10.5" fill="${C.muted}">Treatments can be costly, adding significant financial pressure to couples</text>

  <!-- Row 5 -->
  <rect x="40" y="264" width="720" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="282" r="13" fill="${C.rose}"/>
  <text x="68" y="286.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="94" y="277" font-size="12" font-weight="600" fill="${C.dark}">Repeated Procedures</text>
  <text x="94" y="294" font-size="10.5" fill="${C.muted}">Multiple cycles or failures take a significant mental and physical toll</text>
</svg>`;

const SVG_MENSTRUAL_CYCLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" font-family="${FONT}">
  <rect width="800" height="200" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">The 4 Phases of the Menstrual Cycle</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Phase 1 -->
  <rect x="40" y="58" width="162" height="124" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <rect x="40" y="58" width="162" height="32" rx="8" fill="${C.rose}"/>
  <rect x="40" y="78" width="162" height="12" fill="${C.rose}"/>
  <text x="121" y="79" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">Menstruation</text>
  <text x="121" y="106" text-anchor="middle" font-size="10" font-weight="600" fill="${C.rose}">Day 1 – 5</text>
  <text x="121" y="124" text-anchor="middle" font-size="9.5" fill="${C.muted}" width="140">Uterine lining sheds;</text>
  <text x="121" y="140" text-anchor="middle" font-size="9.5" fill="${C.muted}">bleeding occurs</text>

  <!-- Phase 2 -->
  <rect x="214" y="58" width="162" height="124" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <rect x="214" y="58" width="162" height="32" rx="8" fill="${C.rose}"/>
  <rect x="214" y="78" width="162" height="12" fill="${C.rose}"/>
  <text x="295" y="79" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">Follicular Phase</text>
  <text x="295" y="106" text-anchor="middle" font-size="10" font-weight="600" fill="${C.rose}">Day 6 – 14</text>
  <text x="295" y="124" text-anchor="middle" font-size="9.5" fill="${C.muted}">Hormones stimulate</text>
  <text x="295" y="140" text-anchor="middle" font-size="9.5" fill="${C.muted}">follicle growth; oestrogen rises</text>

  <!-- Phase 3 -->
  <rect x="388" y="58" width="162" height="124" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <rect x="388" y="58" width="162" height="32" rx="8" fill="${C.rose}"/>
  <rect x="388" y="78" width="162" height="12" fill="${C.rose}"/>
  <text x="469" y="79" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">Ovulation</text>
  <text x="469" y="106" text-anchor="middle" font-size="10" font-weight="600" fill="${C.rose}">Day 14</text>
  <text x="469" y="124" text-anchor="middle" font-size="9.5" fill="${C.muted}">LH surge triggers egg release;</text>
  <text x="469" y="140" text-anchor="middle" font-size="9.5" fill="${C.muted}">peak fertility window</text>

  <!-- Phase 4 -->
  <rect x="562" y="58" width="198" height="124" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <rect x="562" y="58" width="198" height="32" rx="8" fill="${C.rose}"/>
  <rect x="562" y="78" width="198" height="12" fill="${C.rose}"/>
  <text x="661" y="79" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">Luteal Phase</text>
  <text x="661" y="106" text-anchor="middle" font-size="10" font-weight="600" fill="${C.rose}">Day 15 – 28</text>
  <text x="661" y="124" text-anchor="middle" font-size="9.5" fill="${C.muted}">Hormones prepare uterus</text>
  <text x="661" y="140" text-anchor="middle" font-size="9.5" fill="${C.muted}">for potential pregnancy</text>
</svg>`;

const SVG_YOGA_FERTILITY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 290" font-family="${FONT}">
  <rect width="800" height="290" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">7 Ways Yoga Supports Fertility</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1: items 1–2 -->
  <rect x="40" y="58" width="346" height="54" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="85" r="13" fill="${C.rose}"/>
  <text x="68" y="89.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="92" y="79" font-size="12" font-weight="600" fill="${C.dark}">Reduce Stress</text>
  <text x="92" y="96" font-size="10" fill="${C.muted}">Pranayama &amp; meditation calm cortisol levels</text>

  <rect x="414" y="58" width="346" height="54" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="85" r="13" fill="${C.rose}"/>
  <text x="442" y="89.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="466" y="79" font-size="12" font-weight="600" fill="${C.dark}">Improve Blood Circulation</text>
  <text x="466" y="96" font-size="10" fill="${C.muted}">Supta Baddha Konasana enhances pelvic flow</text>

  <!-- Row 2: items 3–4 -->
  <rect x="40" y="122" width="346" height="54" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="149" r="13" fill="${C.rose}"/>
  <text x="68" y="153.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="92" y="143" font-size="12" font-weight="600" fill="${C.dark}">Balance Hormonal Levels</text>
  <text x="92" y="160" font-size="10" fill="${C.muted}">Surya Namaskar stimulates endocrine function</text>

  <rect x="414" y="122" width="346" height="54" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="149" r="13" fill="${C.rose}"/>
  <text x="442" y="153.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="466" y="143" font-size="12" font-weight="600" fill="${C.dark}">Strengthen the Body</text>
  <text x="466" y="160" font-size="10" fill="${C.muted}">Bridge Pose strengthens pelvic floor muscles</text>

  <!-- Row 3: items 5–6 -->
  <rect x="40" y="186" width="346" height="54" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="213" r="13" fill="${C.rose}"/>
  <text x="68" y="217.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="92" y="207" font-size="12" font-weight="600" fill="${C.dark}">Promote Detoxification</text>
  <text x="92" y="224" font-size="10" fill="${C.muted}">Hydration &amp; gentle detox poses support cleansing</text>

  <rect x="414" y="186" width="346" height="54" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="213" r="13" fill="${C.rose}"/>
  <text x="442" y="217.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="466" y="207" font-size="12" font-weight="600" fill="${C.dark}">Enhance Emotional Well-being</text>
  <text x="466" y="224" font-size="10" fill="${C.muted}">Heart-opening poses like Ustrasana uplift mood</text>

  <!-- Row 4: item 7 centred -->
  <rect x="227" y="250" width="346" height="30" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="255" cy="265" r="11" fill="${C.rose}"/>
  <text x="255" y="269.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">7</text>
  <text x="278" y="261" font-size="12" font-weight="600" fill="${C.dark}">Improve Sleep Quality</text>
  <text x="278" y="277" font-size="10" fill="${C.muted}">Yoga Nidra &amp; Balasana promote deep, restful sleep</text>
</svg>`;

const SVG_IVF_TYPES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 310" font-family="${FONT}">
  <rect width="800" height="310" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">8 Types of IVF Treatment — At a Glance</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1: 1–2 -->
  <rect x="40" y="56" width="346" height="52" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="67" cy="82" r="13" fill="${C.rose}"/>
  <text x="67" y="86.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="92" y="76" font-size="12" font-weight="600" fill="${C.dark}">Conventional IVF</text>
  <text x="92" y="93" font-size="10" fill="${C.muted}">Eggs fertilised with sperm in a lab dish</text>

  <rect x="414" y="56" width="346" height="52" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="441" cy="82" r="13" fill="${C.rose}"/>
  <text x="441" y="86.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="466" y="76" font-size="12" font-weight="600" fill="${C.dark}">ICSI</text>
  <text x="466" y="93" font-size="10" fill="${C.muted}">Single sperm injected directly into the egg</text>

  <!-- Row 2: 3–4 -->
  <rect x="40" y="118" width="346" height="52" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="67" cy="144" r="13" fill="${C.rose}"/>
  <text x="67" y="148.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="92" y="138" font-size="12" font-weight="600" fill="${C.dark}">Donor IVF</text>
  <text x="92" y="155" font-size="10" fill="${C.muted}">Uses donor eggs, sperm, or embryos</text>

  <rect x="414" y="118" width="346" height="52" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="441" cy="144" r="13" fill="${C.rose}"/>
  <text x="441" y="148.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="466" y="138" font-size="12" font-weight="600" fill="${C.dark}">Surrogacy</text>
  <text x="466" y="155" font-size="10" fill="${C.muted}">Another woman carries and delivers the baby</text>

  <!-- Row 3: 5–6 -->
  <rect x="40" y="180" width="346" height="52" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="67" cy="206" r="13" fill="${C.rose}"/>
  <text x="67" y="210.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="92" y="200" font-size="12" font-weight="600" fill="${C.dark}">PGD</text>
  <text x="92" y="217" font-size="10" fill="${C.muted}">Tests embryos for specific genetic disorders</text>

  <rect x="414" y="180" width="346" height="52" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="441" cy="206" r="13" fill="${C.rose}"/>
  <text x="441" y="210.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="466" y="200" font-size="12" font-weight="600" fill="${C.dark}">PGT-A</text>
  <text x="466" y="217" font-size="10" fill="${C.muted}">Screens embryos for chromosomal abnormalities</text>

  <!-- Row 4: 7–8 -->
  <rect x="40" y="242" width="346" height="52" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="67" cy="268" r="13" fill="${C.rose}"/>
  <text x="67" y="272.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">7</text>
  <text x="92" y="262" font-size="12" font-weight="600" fill="${C.dark}">FET (Frozen Embryo Transfer)</text>
  <text x="92" y="279" font-size="10" fill="${C.muted}">Frozen embryos thawed and transferred to uterus</text>

  <rect x="414" y="242" width="346" height="52" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="441" cy="268" r="13" fill="${C.rose}"/>
  <text x="441" y="272.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">8</text>
  <text x="466" y="262" font-size="12" font-weight="600" fill="${C.dark}">Natural Cycle IVF</text>
  <text x="466" y="279" font-size="10" fill="${C.muted}">No medications; monitors and uses natural cycle</text>
</svg>`;

const SVG_LOW_AMH_INNOVATIVE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 330" font-family="${FONT}">
  <rect width="800" height="330" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">9 Innovative Treatments for Low AMH</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1: 1–3 -->
  <rect x="40" y="56" width="216" height="60" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="65" cy="78" r="11" fill="${C.rose}"/>
  <text x="65" y="82" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="86" y="74" font-size="11" font-weight="600" fill="${C.dark}">Personalised</text>
  <text x="86" y="88" font-size="11" font-weight="600" fill="${C.dark}">IVF Protocols</text>
  <text x="86" y="104" font-size="9.5" fill="${C.muted}">Tailored stimulation plans</text>

  <rect x="292" y="56" width="216" height="60" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="317" cy="78" r="11" fill="${C.rose}"/>
  <text x="317" y="82" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="338" y="74" font-size="11" font-weight="600" fill="${C.dark}">Ovarian PRP</text>
  <text x="338" y="88" font-size="11" font-weight="600" fill="${C.dark}">Therapy</text>
  <text x="338" y="104" font-size="9.5" fill="${C.muted}">Platelet-rich plasma rejuvenation</text>

  <rect x="544" y="56" width="216" height="60" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="569" cy="78" r="11" fill="${C.rose}"/>
  <text x="569" y="82" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="590" y="74" font-size="11" font-weight="600" fill="${C.dark}">Stem Cell</text>
  <text x="590" y="88" font-size="11" font-weight="600" fill="${C.dark}">Therapy</text>
  <text x="590" y="104" font-size="9.5" fill="${C.muted}">Regenerating ovarian tissue</text>

  <!-- Row 2: 4–6 -->
  <rect x="40" y="130" width="216" height="60" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="65" cy="152" r="11" fill="${C.rose}"/>
  <text x="65" y="156" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="86" y="148" font-size="11" font-weight="600" fill="${C.dark}">Genetic</text>
  <text x="86" y="162" font-size="11" font-weight="600" fill="${C.dark}">Modifications</text>
  <text x="86" y="178" font-size="9.5" fill="${C.muted}">Targeting underlying causes</text>

  <rect x="292" y="130" width="216" height="60" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="317" cy="152" r="11" fill="${C.rose}"/>
  <text x="317" y="156" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="338" y="148" font-size="11" font-weight="600" fill="${C.dark}">Hormonal</text>
  <text x="338" y="162" font-size="11" font-weight="600" fill="${C.dark}">Supplementation</text>
  <text x="338" y="178" font-size="9.5" fill="${C.muted}">DHEA improves egg quality</text>

  <rect x="544" y="130" width="216" height="60" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="569" cy="152" r="11" fill="${C.rose}"/>
  <text x="569" y="156" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="590" y="148" font-size="11" font-weight="600" fill="${C.dark}">Acupuncture &amp;</text>
  <text x="590" y="162" font-size="11" font-weight="600" fill="${C.dark}">Complementary</text>
  <text x="590" y="178" font-size="9.5" fill="${C.muted}">Holistic fertility support</text>

  <!-- Row 3: 7–9 -->
  <rect x="40" y="204" width="216" height="60" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="65" cy="226" r="11" fill="${C.rose}"/>
  <text x="65" y="230" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">7</text>
  <text x="86" y="222" font-size="11" font-weight="600" fill="${C.dark}">Lifestyle</text>
  <text x="86" y="236" font-size="11" font-weight="600" fill="${C.dark}">Modifications</text>
  <text x="86" y="252" font-size="9.5" fill="${C.muted}">Diet, exercise &amp; stress reduction</text>

  <rect x="292" y="204" width="216" height="60" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="317" cy="226" r="11" fill="${C.rose}"/>
  <text x="317" y="230" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">8</text>
  <text x="338" y="222" font-size="11" font-weight="600" fill="${C.dark}">Oocyte</text>
  <text x="338" y="236" font-size="11" font-weight="600" fill="${C.dark}">Preservation</text>
  <text x="338" y="252" font-size="9.5" fill="${C.muted}">Vitrification to freeze eggs early</text>

  <rect x="544" y="204" width="216" height="60" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="569" cy="226" r="11" fill="${C.rose}"/>
  <text x="569" y="230" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">9</text>
  <text x="590" y="222" font-size="11" font-weight="600" fill="${C.dark}">Time-Lapse</text>
  <text x="590" y="236" font-size="11" font-weight="600" fill="${C.dark}">Technology</text>
  <text x="590" y="252" font-size="9.5" fill="${C.muted}">Optimal embryo selection via imaging</text>

  <!-- Footer note -->
  <text x="400" y="294" text-anchor="middle" font-size="10" fill="${C.muted}">Bavishi Fertility Institute — individualised care for every low-AMH case</text>
</svg>`;

// ── Wave 7 SVGs ──────────────────────────────────────────────────────

const SVG_IUI_PREP_TIPS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 280" font-family="${FONT}">
  <rect width="800" height="280" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">6 Essential IUI Preparation Tips</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1: 1–2 -->
  <rect x="40" y="56" width="346" height="60" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="79" r="13" fill="${C.rose}"/>
  <text x="68" y="83.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="92" y="73" font-size="12" font-weight="600" fill="${C.dark}">Monitor Your Cycle</text>
  <text x="92" y="90" font-size="10" fill="${C.muted}">Use OPKs or basal body temp to track</text>
  <text x="92" y="105" font-size="10" fill="${C.muted}">your fertile window precisely</text>

  <rect x="414" y="56" width="346" height="60" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="79" r="13" fill="${C.rose}"/>
  <text x="442" y="83.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="466" y="73" font-size="12" font-weight="600" fill="${C.dark}">Maintain a Healthy Diet</text>
  <text x="466" y="90" font-size="10" fill="${C.muted}">Fruits, vegetables, lean proteins, omega-3</text>
  <text x="466" y="105" font-size="10" fill="${C.muted}">fatty acids &amp; prenatal vitamins</text>

  <!-- Row 2: 3–4 -->
  <rect x="40" y="126" width="346" height="60" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="149" r="13" fill="${C.rose}"/>
  <text x="68" y="153.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="92" y="143" font-size="12" font-weight="600" fill="${C.dark}">Manage Stress</text>
  <text x="92" y="160" font-size="10" fill="${C.muted}">Mindfulness, yoga &amp; fertility support</text>
  <text x="92" y="175" font-size="10" fill="${C.muted}">groups reduce anxiety during treatment</text>

  <rect x="414" y="126" width="346" height="60" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="149" r="13" fill="${C.rose}"/>
  <text x="442" y="153.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="466" y="143" font-size="12" font-weight="600" fill="${C.dark}">Prepare for Medications</text>
  <text x="466" y="160" font-size="10" fill="${C.muted}">Follow prescription schedule closely;</text>
  <text x="466" y="175" font-size="10" fill="${C.muted}">ask your doctor about side effects</text>

  <!-- Row 3: 5–6 -->
  <rect x="40" y="196" width="346" height="60" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="219" r="13" fill="${C.rose}"/>
  <text x="68" y="223.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="92" y="213" font-size="12" font-weight="600" fill="${C.dark}">Make Lifestyle Changes</text>
  <text x="92" y="230" font-size="10" fill="${C.muted}">Limit caffeine &amp; alcohol, quit smoking,</text>
  <text x="92" y="245" font-size="10" fill="${C.muted}">maintain a healthy body weight</text>

  <rect x="414" y="196" width="346" height="60" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="219" r="13" fill="${C.rose}"/>
  <text x="442" y="223.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="466" y="213" font-size="12" font-weight="600" fill="${C.dark}">Plan for the Procedure Day</text>
  <text x="466" y="230" font-size="10" fill="${C.muted}">Arrive rested; procedure takes ~15 minutes</text>
  <text x="466" y="245" font-size="10" fill="${C.muted}">and is generally painless</text>
</svg>`;

const SVG_ICSI_DOS_DONTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 290" font-family="${FONT}">
  <rect width="800" height="290" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">ICSI Do's &amp; Don'ts: 5 Key Rules Each</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Column headers -->
  <rect x="40" y="54" width="346" height="28" rx="6" fill="${C.rose}"/>
  <text x="213" y="73" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">✓  Do's</text>

  <rect x="414" y="54" width="346" height="28" rx="6" fill="${C.dark}"/>
  <text x="587" y="73" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">✕  Don'ts</text>

  <!-- Do items -->
  <rect x="40" y="90" width="346" height="36" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="62" y="113" font-size="11" font-weight="600" fill="${C.rose}">1</text>
  <text x="80" y="113" font-size="11" fill="${C.dark}">Follow your doctor's medication schedule</text>

  <rect x="40" y="132" width="346" height="36" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="62" y="155" font-size="11" font-weight="600" fill="${C.rose}">2</text>
  <text x="80" y="155" font-size="11" fill="${C.dark}">Eat a balanced, nutrient-rich diet</text>

  <rect x="40" y="174" width="346" height="36" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="62" y="197" font-size="11" font-weight="600" fill="${C.rose}">3</text>
  <text x="80" y="197" font-size="11" fill="${C.dark}">Stay well hydrated throughout treatment</text>

  <rect x="40" y="216" width="346" height="36" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="62" y="239" font-size="11" font-weight="600" fill="${C.rose}">4</text>
  <text x="80" y="239" font-size="11" fill="${C.dark}">Light exercise — walking or yoga only</text>

  <rect x="40" y="258" width="346" height="24" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="62" y="275" font-size="11" font-weight="600" fill="${C.rose}">5</text>
  <text x="80" y="275" font-size="11" fill="${C.dark}">Get 7–8 hours of quality sleep each night</text>

  <!-- Dont items -->
  <rect x="414" y="90" width="346" height="36" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="436" y="113" font-size="11" font-weight="600" fill="${C.dark}">1</text>
  <text x="454" y="113" font-size="11" fill="${C.dark}">Don't skip medications or appointments</text>

  <rect x="414" y="132" width="346" height="36" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="436" y="155" font-size="11" font-weight="600" fill="${C.dark}">2</text>
  <text x="454" y="155" font-size="11" fill="${C.dark}">Avoid alcohol and excessive caffeine</text>

  <rect x="414" y="174" width="346" height="36" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="436" y="197" font-size="11" font-weight="600" fill="${C.dark}">3</text>
  <text x="454" y="197" font-size="11" fill="${C.dark}">Don't smoke during your ICSI cycle</text>

  <rect x="414" y="216" width="346" height="36" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="436" y="239" font-size="11" font-weight="600" fill="${C.dark}">4</text>
  <text x="454" y="239" font-size="11" fill="${C.dark}">No high-intensity or strenuous exercise</text>

  <rect x="414" y="258" width="346" height="24" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="436" y="275" font-size="11" font-weight="600" fill="${C.dark}">5</text>
  <text x="454" y="275" font-size="11" fill="${C.dark}">Don't self-prescribe supplements or herbs</text>
</svg>`;

const SVG_ICSI_SPERM_CONDITIONS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" font-family="${FONT}">
  <rect width="800" height="300" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">5 Male Factor Conditions Where ICSI Works Best</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1 -->
  <rect x="40" y="58" width="720" height="42" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="79" r="13" fill="${C.rose}"/>
  <text x="70" y="83.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="96" y="73" font-size="12" font-weight="600" fill="${C.dark}">Oligospermia — Low Sperm Count</text>
  <text x="96" y="90" font-size="10.5" fill="${C.muted}">Only one viable sperm is needed per egg; low count is no barrier with ICSI</text>

  <!-- Row 2 -->
  <rect x="40" y="108" width="720" height="42" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="129" r="13" fill="${C.rose}"/>
  <text x="70" y="133.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="96" y="123" font-size="12" font-weight="600" fill="${C.dark}">Asthenospermia — Poor Sperm Motility</text>
  <text x="96" y="140" font-size="10.5" fill="${C.muted}">ICSI bypasses the need for sperm to swim and reach the egg naturally</text>

  <!-- Row 3 -->
  <rect x="40" y="158" width="720" height="42" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="179" r="13" fill="${C.rose}"/>
  <text x="70" y="183.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="96" y="173" font-size="12" font-weight="600" fill="${C.dark}">Teratospermia — Abnormal Sperm Shape</text>
  <text x="96" y="190" font-size="10.5" fill="${C.muted}">The embryologist selects the best-looking sperm; morphology does not prevent fertilisation</text>

  <!-- Row 4 -->
  <rect x="40" y="208" width="720" height="42" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="229" r="13" fill="${C.rose}"/>
  <text x="70" y="233.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="96" y="223" font-size="12" font-weight="600" fill="${C.dark}">Previous IVF Failure Due to Fertilisation Issues</text>
  <text x="96" y="240" font-size="10.5" fill="${C.muted}">Direct injection resolves poor fertilisation that occurred with conventional IVF</text>

  <!-- Row 5 -->
  <rect x="40" y="258" width="720" height="34" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="70" cy="275" r="13" fill="${C.rose}"/>
  <text x="70" y="279.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="96" y="270" font-size="12" font-weight="600" fill="${C.dark}">Azoospermia — No Sperm in Semen</text>
  <text x="96" y="286" font-size="10.5" fill="${C.muted}">Sperm surgically retrieved via TESA, PESA, or Micro-TESE then used for ICSI</text>
</svg>`;

const SVG_IUI_PAIN_GUIDE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220" font-family="${FONT}">
  <rect width="800" height="220" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">IUI Comfort Guide: During &amp; After the Procedure</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- During panel -->
  <rect x="40" y="56" width="346" height="148" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <rect x="40" y="56" width="346" height="30" rx="8" fill="${C.rose}"/>
  <rect x="40" y="74" width="346" height="12" fill="${C.rose}"/>
  <text x="213" y="77" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">During IUI</text>
  <text x="62" y="108" font-size="10.5" fill="${C.dark}">• Procedure takes just 5–10 minutes</text>
  <text x="62" y="128" font-size="10.5" fill="${C.dark}">• Similar in feel to a routine Pap smear</text>
  <text x="62" y="148" font-size="10.5" fill="${C.dark}">• Mild pressure when catheter passes the cervix</text>
  <text x="62" y="168" font-size="10.5" fill="${C.dark}">• Many women feel almost nothing at all</text>

  <!-- After panel -->
  <rect x="414" y="56" width="346" height="148" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <rect x="414" y="56" width="346" height="30" rx="8" fill="${C.rose}"/>
  <rect x="414" y="74" width="346" height="12" fill="${C.rose}"/>
  <text x="587" y="77" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">After IUI</text>
  <text x="436" y="108" font-size="10.5" fill="${C.dark}">• Mild cramping (like menstrual cramps)</text>
  <text x="436" y="128" font-size="10.5" fill="${C.dark}">• Light spotting may occur — this is normal</text>
  <text x="436" y="148" font-size="10.5" fill="${C.dark}">• Normal activities can resume the same day</text>
  <text x="436" y="168" font-size="10.5" fill="${C.dark}">• Symptoms typically resolve within 24 hours</text>
</svg>`;

const SVG_IVF_STAGES_PAIN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 310" font-family="${FONT}">
  <rect width="800" height="310" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">5 IVF Stages: What to Expect</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Stage 1 -->
  <rect x="40" y="56" width="720" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="56" width="6" height="44" rx="3" fill="${C.rose}"/>
  <text x="62" y="73" font-size="12" font-weight="700" fill="${C.dark}">1. Ovarian Stimulation</text>
  <text x="62" y="73" font-size="10" fill="${C.rose}" dx="190">  8–14 days</text>
  <text x="62" y="90" font-size="10.5" fill="${C.muted}">Daily hormone injections; mild injection-site discomfort, bloating, slight cramping</text>

  <!-- Stage 2 -->
  <rect x="40" y="108" width="720" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="108" width="6" height="44" rx="3" fill="${C.rose}"/>
  <text x="62" y="125" font-size="12" font-weight="700" fill="${C.dark}">2. Egg Retrieval</text>
  <text x="62" y="125" font-size="10" fill="${C.rose}" dx="130">  20–30 minutes</text>
  <text x="62" y="142" font-size="10.5" fill="${C.muted}">Performed under sedation — no pain during; mild cramping or spotting may follow</text>

  <!-- Stage 3 -->
  <rect x="40" y="160" width="720" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="160" width="6" height="44" rx="3" fill="${C.rose}"/>
  <text x="62" y="177" font-size="12" font-weight="700" fill="${C.dark}">3. Fertilisation &amp; Embryo Development</text>
  <text x="62" y="177" font-size="10" fill="${C.rose}" dx="290">  3–5 days</text>
  <text x="62" y="194" font-size="10.5" fill="${C.muted}">Entirely in the embryology lab — no physical interventions; completely painless</text>

  <!-- Stage 4 -->
  <rect x="40" y="212" width="720" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="212" width="6" height="44" rx="3" fill="${C.rose}"/>
  <text x="62" y="229" font-size="12" font-weight="700" fill="${C.dark}">4. Embryo Transfer</text>
  <text x="62" y="229" font-size="10" fill="${C.rose}" dx="150">  10–15 minutes</text>
  <text x="62" y="246" font-size="10.5" fill="${C.muted}">Thin catheter guided by ultrasound; mild pressure; no sedation required</text>

  <!-- Stage 5 -->
  <rect x="40" y="264" width="720" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="264" width="6" height="38" rx="3" fill="${C.rose}"/>
  <text x="62" y="281" font-size="12" font-weight="700" fill="${C.dark}">5. Luteal Phase Support</text>
  <text x="62" y="296" font-size="10.5" fill="${C.muted}">Progesterone supplementation; possible bloating, breast tenderness &amp; mood changes</text>
</svg>`;

// ── Wave 8 SVGs ──────────────────────────────────────────────────────

const SVG_INJECTION_FREE_IVF = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220" font-family="${FONT}">
  <rect width="800" height="220" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">3 Paths to Easier IVF — Less Injection, More Comfort</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Panel 1: Easy IVF -->
  <rect x="40" y="56" width="218" height="148" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <rect x="40" y="56" width="218" height="32" rx="8" fill="${C.rose}"/>
  <rect x="40" y="76" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="78" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Easy IVF</text>
  <text x="62" y="112" font-size="10" fill="${C.dark}">• Fewer injections overall</text>
  <text x="62" y="130" font-size="10" fill="${C.dark}">• Shorter treatment cycles</text>
  <text x="62" y="148" font-size="10" fill="${C.dark}">• Simplified medication schedules</text>
  <text x="62" y="166" font-size="10" fill="${C.dark}">• Oral meds or patches replace some</text>
  <text x="62" y="182" font-size="10" fill="${C.dark}">  injectable hormones</text>

  <!-- Panel 2: Minimal Stimulation IVF -->
  <rect x="291" y="56" width="218" height="148" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <rect x="291" y="56" width="218" height="32" rx="8" fill="${C.rose}"/>
  <rect x="291" y="76" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="78" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Minimal Stimulation IVF</text>
  <text x="313" y="112" font-size="10" fill="${C.dark}">• Oral medications (Clomid/Letrozole)</text>
  <text x="313" y="130" font-size="10" fill="${C.dark}">• Fewer gonadotropin injections</text>
  <text x="313" y="148" font-size="10" fill="${C.dark}">• Lower cost than standard IVF</text>
  <text x="313" y="166" font-size="10" fill="${C.dark}">• Ideal for poor ovarian responders</text>
  <text x="313" y="182" font-size="10" fill="${C.dark}">  who produce few eggs regardless</text>

  <!-- Panel 3: Natural Cycle IVF -->
  <rect x="542" y="56" width="218" height="148" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <rect x="542" y="56" width="218" height="32" rx="8" fill="${C.rose}"/>
  <rect x="542" y="76" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="78" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Natural Cycle IVF</text>
  <text x="564" y="112" font-size="10" fill="${C.dark}">• No hormonal medications at all</text>
  <text x="564" y="130" font-size="10" fill="${C.dark}">• Monitors your body's natural cycle</text>
  <text x="564" y="148" font-size="10" fill="${C.dark}">• One egg retrieved per cycle</text>
  <text x="564" y="166" font-size="10" fill="${C.dark}">• Only one final trigger injection</text>
  <text x="564" y="182" font-size="10" fill="${C.dark}">  may still be required</text>
</svg>`;

const SVG_NATURAL_CYCLE_IVF_BENEFITS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220" font-family="${FONT}">
  <rect width="800" height="220" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">4 Key Benefits of Natural Cycle IVF</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Card 1 -->
  <rect x="40" y="56" width="346" height="68" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="72" cy="84" r="14" fill="${C.rose}"/>
  <text x="72" y="88.5" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">1</text>
  <text x="98" y="76" font-size="12" font-weight="700" fill="${C.dark}">Reduced Risk of OHSS</text>
  <text x="98" y="93" font-size="10.5" fill="${C.muted}">No ovarian stimulation = no risk of</text>
  <text x="98" y="109" font-size="10.5" fill="${C.muted}">hyperstimulation syndrome</text>

  <!-- Card 2 -->
  <rect x="414" y="56" width="346" height="68" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="446" cy="84" r="14" fill="${C.rose}"/>
  <text x="446" y="88.5" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">2</text>
  <text x="472" y="76" font-size="12" font-weight="700" fill="${C.dark}">Lower Cost</text>
  <text x="472" y="93" font-size="10.5" fill="${C.muted}">No expensive hormonal medications;</text>
  <text x="472" y="109" font-size="10.5" fill="${C.muted}">more affordable than standard IVF</text>

  <!-- Card 3 -->
  <rect x="40" y="136" width="346" height="68" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="72" cy="164" r="14" fill="${C.rose}"/>
  <text x="72" y="168.5" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">3</text>
  <text x="98" y="156" font-size="12" font-weight="700" fill="${C.dark}">Fewer Side Effects</text>
  <text x="98" y="173" font-size="10.5" fill="${C.muted}">No bloating, mood swings or</text>
  <text x="98" y="189" font-size="10.5" fill="${C.muted}">injection-site discomfort</text>

  <!-- Card 4 -->
  <rect x="414" y="136" width="346" height="68" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="446" cy="164" r="14" fill="${C.rose}"/>
  <text x="446" y="168.5" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">4</text>
  <text x="472" y="156" font-size="12" font-weight="700" fill="${C.dark}">Potentially Better Egg Quality</text>
  <text x="472" y="173" font-size="10.5" fill="${C.muted}">Natural selection may produce the</text>
  <text x="472" y="189" font-size="10.5" fill="${C.muted}">body's highest-quality egg</text>
</svg>`;

const SVG_IUI_8_STEPS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 310" font-family="${FONT}">
  <rect width="800" height="310" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">8 Steps of the IUI Process — What to Expect</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Column 1: Steps 1-4 -->
  <rect x="40" y="56" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="80" r="12" fill="${C.rose}"/>
  <text x="66" y="84.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="90" y="74" font-size="11.5" font-weight="600" fill="${C.dark}">Initial Consultation &amp; Fertility Evaluation</text>
  <text x="90" y="91" font-size="10" fill="${C.muted}">Medical history, blood tests, ultrasound, semen analysis</text>

  <rect x="40" y="112" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="136" r="12" fill="${C.rose}"/>
  <text x="66" y="140.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="90" y="130" font-size="11.5" font-weight="600" fill="${C.dark}">Ovulation Monitoring or Induction</text>
  <text x="90" y="147" font-size="10" fill="${C.muted}">Natural cycle tracking or fertility meds (Clomiphene/Gonadotropins)</text>

  <rect x="40" y="168" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="192" r="12" fill="${C.rose}"/>
  <text x="66" y="196.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="90" y="186" font-size="11.5" font-weight="600" fill="${C.dark}">Triggering Ovulation</text>
  <text x="90" y="203" font-size="10" fill="${C.muted}">HCG trigger shot when follicle reaches 18–20 mm</text>

  <rect x="40" y="224" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="248" r="12" fill="${C.rose}"/>
  <text x="66" y="252.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="90" y="242" font-size="11.5" font-weight="600" fill="${C.dark}">Sperm Collection &amp; Preparation</text>
  <text x="90" y="259" font-size="10" fill="${C.muted}">Semen washed &amp; concentrated to isolate motile sperm</text>

  <!-- Column 2: Steps 5-8 -->
  <rect x="414" y="56" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="440" cy="80" r="12" fill="${C.rose}"/>
  <text x="440" y="84.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="464" y="74" font-size="11.5" font-weight="600" fill="${C.dark}">The IUI Procedure</text>
  <text x="464" y="91" font-size="10" fill="${C.muted}">Catheter places sperm into uterus; takes just a few minutes</text>

  <rect x="414" y="112" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="440" cy="136" r="12" fill="${C.rose}"/>
  <text x="440" y="140.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="464" y="130" font-size="11.5" font-weight="600" fill="${C.dark}">Post-IUI Instructions &amp; Medications</text>
  <text x="464" y="147" font-size="10" fill="${C.muted}">Progesterone support; avoid heavy lifting or intense exercise</text>

  <rect x="414" y="168" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="440" cy="192" r="12" fill="${C.rose}"/>
  <text x="440" y="196.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">7</text>
  <text x="464" y="186" font-size="11.5" font-weight="600" fill="${C.dark}">The Two-Week Wait</text>
  <text x="464" y="203" font-size="10" fill="${C.muted}">Manage stress; continue medications; watch for symptoms</text>

  <rect x="414" y="224" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="440" cy="248" r="12" fill="${C.rose}"/>
  <text x="440" y="252.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">8</text>
  <text x="464" y="242" font-size="11.5" font-weight="600" fill="${C.dark}">Pregnancy Testing &amp; Next Steps</text>
  <text x="464" y="259" font-size="10" fill="${C.muted}">Blood beta-hCG test; scan if positive; review if negative</text>
</svg>`;

const SVG_IUI_SIDE_EFFECTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 280" font-family="${FONT}">
  <rect width="800" height="280" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">5 Common Physical Side Effects of IUI</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1 -->
  <rect x="40" y="56" width="720" height="40" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="76" r="12" fill="${C.rose}"/>
  <text x="68" y="80.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="92" y="70" font-size="12" font-weight="600" fill="${C.dark}">Cramping &amp; Mild Discomfort</text>
  <text x="92" y="87" font-size="10.5" fill="${C.muted}">Caused by catheter insertion through the cervix; use a warm compress and rest after the procedure</text>

  <!-- Row 2 -->
  <rect x="40" y="104" width="720" height="40" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="124" r="12" fill="${C.rose}"/>
  <text x="68" y="128.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="92" y="118" font-size="12" font-weight="600" fill="${C.dark}">Spotting or Light Bleeding</text>
  <text x="92" y="135" font-size="10.5" fill="${C.muted}">Minor spotting from slight cervical irritation by the catheter; harmless and does not affect outcome</text>

  <!-- Row 3 -->
  <rect x="40" y="152" width="720" height="40" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="172" r="12" fill="${C.rose}"/>
  <text x="68" y="176.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="92" y="166" font-size="12" font-weight="600" fill="${C.dark}">Breast Tenderness</text>
  <text x="92" y="183" font-size="10.5" fill="${C.muted}">Caused by fertility medications; swollen or sore breasts are a common hormonal side effect</text>

  <!-- Row 4 -->
  <rect x="40" y="200" width="720" height="40" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="220" r="12" fill="${C.rose}"/>
  <text x="68" y="224.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="92" y="214" font-size="12" font-weight="600" fill="${C.dark}">Bloating or Abdominal Fullness</text>
  <text x="92" y="231" font-size="10.5" fill="${C.muted}">Hormonal stimulation causes temporary bloating; resolves on its own within a few days</text>

  <!-- Row 5 -->
  <rect x="40" y="248" width="720" height="24" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="260" r="12" fill="${C.rose}"/>
  <text x="68" y="264.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="92" y="255" font-size="12" font-weight="600" fill="${C.dark}">Headaches or Mood Swings</text>
  <text x="92" y="266" font-size="10.5" fill="${C.muted}">Linked to Clomiphene or Gonadotropin medications; relatively uncommon and temporary</text>
</svg>`;

const SVG_EGG_DONOR_IVF_STEPS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 310" font-family="${FONT}">
  <rect width="800" height="310" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">8 Steps: IVF with Egg Donation</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Column 1: Steps 1-4 -->
  <rect x="40" y="56" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="80" r="12" fill="${C.rose}"/>
  <text x="66" y="84.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="90" y="74" font-size="11.5" font-weight="600" fill="${C.dark}">Initial Consultation &amp; Counseling</text>
  <text x="90" y="91" font-size="10" fill="${C.muted}">Medical history review; emotional &amp; psychological counseling</text>

  <rect x="40" y="112" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="136" r="12" fill="${C.rose}"/>
  <text x="66" y="140.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="90" y="130" font-size="11.5" font-weight="600" fill="${C.dark}">Selecting an Egg Donor</text>
  <text x="90" y="147" font-size="10" fill="${C.muted}">Anonymous or known donor; screened for genetics, health &amp; psychology</text>

  <rect x="40" y="168" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="192" r="12" fill="${C.rose}"/>
  <text x="66" y="196.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="90" y="186" font-size="11.5" font-weight="600" fill="${C.dark}">Synchronising Menstrual Cycles</text>
  <text x="90" y="203" font-size="10" fill="${C.muted}">Hormonal medications synchronise recipient &amp; donor cycles</text>

  <rect x="40" y="224" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="248" r="12" fill="${C.rose}"/>
  <text x="66" y="252.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="90" y="242" font-size="11.5" font-weight="600" fill="${C.dark}">Egg Retrieval (Aspiration)</text>
  <text x="90" y="259" font-size="10" fill="${C.muted}">Donor eggs collected under light sedation; 20–30 minutes</text>

  <!-- Column 2: Steps 5-8 -->
  <rect x="414" y="56" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="440" cy="80" r="12" fill="${C.rose}"/>
  <text x="440" y="84.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="464" y="74" font-size="11.5" font-weight="600" fill="${C.dark}">Fertilisation &amp; Embryo Culture</text>
  <text x="464" y="91" font-size="10" fill="${C.muted}">Eggs fertilised in lab; embryos cultured &amp; monitored 3–5 days</text>

  <rect x="414" y="112" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="440" cy="136" r="12" fill="${C.rose}"/>
  <text x="440" y="140.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="464" y="130" font-size="11.5" font-weight="600" fill="${C.dark}">Embryo Transfer</text>
  <text x="464" y="147" font-size="10" fill="${C.muted}">Best embryo(s) placed into uterus; quick, minimally invasive</text>

  <rect x="414" y="168" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="440" cy="192" r="12" fill="${C.rose}"/>
  <text x="440" y="196.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">7</text>
  <text x="464" y="186" font-size="11.5" font-weight="600" fill="${C.dark}">Pregnancy Test &amp; Follow-up</text>
  <text x="464" y="203" font-size="10" fill="${C.muted}">Beta-hCG blood test 10–14 days after transfer</text>

  <rect x="414" y="224" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="440" cy="248" r="12" fill="${C.rose}"/>
  <text x="440" y="252.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">8</text>
  <text x="464" y="242" font-size="11.5" font-weight="600" fill="${C.dark}">Emotional Support &amp; Counseling</text>
  <text x="464" y="259" font-size="10" fill="${C.muted}">Ongoing psychological support &amp; fertility counseling throughout</text>
</svg>`;

// ── Wave 9 SVGs ──────────────────────────────────────────────────────

const SVG_IUI_SUCCESS_FACTORS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">4 Key Factors That Affect IUI Success Rate</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Card 1 -->
  <rect x="40" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="122" cy="86" r="18" fill="${C.rose}"/>
  <text x="122" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">1</text>
  <text x="122" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Age of the</text>
  <text x="122" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Woman</text>
  <text x="122" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Under 35: ~15–18%</text>
  <text x="122" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">Age 35–40: ~10–15%</text>
  <text x="122" y="185" text-anchor="middle" font-size="9.5" fill="${C.muted}">Over 40: lower rates</text>
  <text x="122" y="200" text-anchor="middle" font-size="9.5" fill="${C.muted}">due to egg quality</text>

  <!-- Card 2 -->
  <rect x="218" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="300" cy="86" r="18" fill="${C.rose}"/>
  <text x="300" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">2</text>
  <text x="300" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Fertility</text>
  <text x="300" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Issues</text>
  <text x="300" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Best results with</text>
  <text x="300" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">healthy tubes &amp;</text>
  <text x="300" y="185" text-anchor="middle" font-size="9.5" fill="${C.muted}">mild ovulation or</text>
  <text x="300" y="200" text-anchor="middle" font-size="9.5" fill="${C.muted}">unexplained infertility</text>

  <!-- Card 3 -->
  <rect x="396" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="478" cy="86" r="18" fill="${C.rose}"/>
  <text x="478" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">3</text>
  <text x="478" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Sperm</text>
  <text x="478" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Quality</text>
  <text x="478" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Higher motility &amp;</text>
  <text x="478" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">concentration</text>
  <text x="478" y="185" text-anchor="middle" font-size="9.5" fill="${C.muted}">improve fertilisation</text>
  <text x="478" y="200" text-anchor="middle" font-size="9.5" fill="${C.muted}">odds significantly</text>

  <!-- Card 4 -->
  <rect x="574" y="58" width="186" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="667" cy="86" r="18" fill="${C.rose}"/>
  <text x="667" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">4</text>
  <text x="667" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Number of</text>
  <text x="667" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Cycles</text>
  <text x="667" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Cumulative success</text>
  <text x="667" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">improves over</text>
  <text x="667" y="185" text-anchor="middle" font-size="9.5" fill="${C.muted}">multiple attempts;</text>
  <text x="667" y="200" text-anchor="middle" font-size="9.5" fill="${C.muted}">typically 3–6 cycles</text>
</svg>`;

const SVG_IVF_COST_COMPONENTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 310" font-family="${FONT}">
  <rect width="800" height="310" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">10 Cost Components of an IVF Cycle</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Column 1: 1-5 -->
  <rect x="40" y="56" width="346" height="38" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="63" cy="75" r="11" fill="${C.rose}"/>
  <text x="63" y="79.5" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.white}">1</text>
  <text x="84" y="70" font-size="11.5" font-weight="600" fill="${C.dark}">Initial Consultation &amp; Diagnostic Tests</text>
  <text x="84" y="85" font-size="10" fill="${C.muted}">Blood tests, hormone levels, ultrasound, semen analysis</text>

  <rect x="40" y="102" width="346" height="38" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="63" cy="121" r="11" fill="${C.rose}"/>
  <text x="63" y="125.5" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.white}">2</text>
  <text x="84" y="116" font-size="11.5" font-weight="600" fill="${C.dark}">Ovarian Stimulation Medications</text>
  <text x="84" y="131" font-size="10" fill="${C.muted}">Hormonal injections + monitoring (ultrasound &amp; blood tests)</text>

  <rect x="40" y="148" width="346" height="38" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="63" cy="167" r="11" fill="${C.rose}"/>
  <text x="63" y="171.5" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.white}">3</text>
  <text x="84" y="162" font-size="11.5" font-weight="600" fill="${C.dark}">Egg Retrieval Procedure</text>
  <text x="84" y="177" font-size="10" fill="${C.muted}">Daycare procedure; anaesthesia &amp; operation theatre charges</text>

  <rect x="40" y="194" width="346" height="38" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="63" cy="213" r="11" fill="${C.rose}"/>
  <text x="63" y="217.5" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.white}">4</text>
  <text x="84" y="208" font-size="11.5" font-weight="600" fill="${C.dark}">Sperm Collection &amp; Preparation</text>
  <text x="84" y="223" font-size="10" fill="${C.muted}">Sample processing; TESA/PESA if advanced retrieval is needed</text>

  <rect x="40" y="240" width="346" height="38" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="63" cy="259" r="11" fill="${C.rose}"/>
  <text x="63" y="263.5" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.white}">5</text>
  <text x="84" y="254" font-size="11.5" font-weight="600" fill="${C.dark}">IVF Lab Charges &amp; Fertilisation</text>
  <text x="84" y="269" font-size="10" fill="${C.muted}">ICSI if needed; embryo culture in advanced lab environment</text>

  <!-- Column 2: 6-10 -->
  <rect x="414" y="56" width="346" height="38" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="437" cy="75" r="11" fill="${C.rose}"/>
  <text x="437" y="79.5" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.white}">6</text>
  <text x="458" y="70" font-size="11.5" font-weight="600" fill="${C.dark}">Embryo Transfer Procedure</text>
  <text x="458" y="85" font-size="10" fill="${C.muted}">Transfer + luteal phase support medications</text>

  <rect x="414" y="102" width="346" height="38" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="437" cy="121" r="11" fill="${C.rose}"/>
  <text x="437" y="125.5" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.white}">7</text>
  <text x="458" y="116" font-size="11.5" font-weight="600" fill="${C.dark}">Embryo Freezing &amp; Storage</text>
  <text x="458" y="131" font-size="10" fill="${C.muted}">Vitrification of extra embryos; 1-year storage included</text>

  <rect x="414" y="148" width="346" height="38" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="437" cy="167" r="11" fill="${C.rose}"/>
  <text x="437" y="171.5" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.white}">8</text>
  <text x="458" y="162" font-size="11.5" font-weight="600" fill="${C.dark}">Additional Procedures (if required)</text>
  <text x="458" y="177" font-size="10" fill="${C.muted}">PGT, Laser Hatching, ERA, donor gametes, surrogacy</text>

  <rect x="414" y="194" width="346" height="38" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="437" cy="213" r="11" fill="${C.rose}"/>
  <text x="437" y="217.5" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.white}">9</text>
  <text x="458" y="208" font-size="11.5" font-weight="600" fill="${C.dark}">Pregnancy Test &amp; Follow-up</text>
  <text x="458" y="223" font-size="10" fill="${C.muted}">Beta-hCG test; first ultrasound; follow-up consultations</text>

  <rect x="414" y="240" width="346" height="38" rx="5" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="437" cy="259" r="11" fill="${C.rose}"/>
  <text x="437" y="263.5" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.white}">10</text>
  <text x="458" y="254" font-size="11.5" font-weight="600" fill="${C.dark}">Total Cycle Cost</text>
  <text x="458" y="269" font-size="10" fill="${C.muted}">Varies by treatment type, medications &amp; clinic infrastructure</text>
</svg>`;

const SVG_IVF_FAILURE_REASONS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 290" font-family="${FONT}">
  <rect width="800" height="290" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">6 Common Reasons IVF Cycles Fail</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1: 1-2 -->
  <rect x="40" y="56" width="346" height="52" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="82" r="13" fill="${C.rose}"/>
  <text x="68" y="86.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="92" y="76" font-size="12" font-weight="600" fill="${C.dark}">Poor Egg Quality</text>
  <text x="92" y="93" font-size="10" fill="${C.muted}">Genetic abnormalities prevent fertilisation or healthy development</text>

  <rect x="414" y="56" width="346" height="52" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="82" r="13" fill="${C.rose}"/>
  <text x="442" y="86.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="466" y="76" font-size="12" font-weight="600" fill="${C.dark}">Embryo Quality Issues</text>
  <text x="466" y="93" font-size="10" fill="${C.muted}">Chromosomal problems prevent implantation even after fertilisation</text>

  <!-- Row 2: 3-4 -->
  <rect x="40" y="116" width="346" height="52" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="142" r="13" fill="${C.rose}"/>
  <text x="68" y="146.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="92" y="136" font-size="12" font-weight="600" fill="${C.dark}">Uterine Issues</text>
  <text x="92" y="153" font-size="10" fill="${C.muted}">Thin lining, polyps, fibroids or septum block implantation</text>

  <rect x="414" y="116" width="346" height="52" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="142" r="13" fill="${C.rose}"/>
  <text x="442" y="146.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="466" y="136" font-size="12" font-weight="600" fill="${C.dark}">Sperm Factors</text>
  <text x="466" y="153" font-size="10" fill="${C.muted}">Low count, motility, morphology or high DNA fragmentation</text>

  <!-- Row 3: 5-6 -->
  <rect x="40" y="176" width="346" height="52" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="202" r="13" fill="${C.rose}"/>
  <text x="68" y="206.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="92" y="196" font-size="12" font-weight="600" fill="${C.dark}">Immune or Genetic Factors</text>
  <text x="92" y="213" font-size="10" fill="${C.muted}">Immune system may reject the embryo or block implantation</text>

  <rect x="414" y="176" width="346" height="52" rx="7" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="202" r="13" fill="${C.rose}"/>
  <text x="442" y="206.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="466" y="196" font-size="12" font-weight="600" fill="${C.dark}">Timing &amp; Technique</text>
  <text x="466" y="213" font-size="10" fill="${C.muted}">Transfer precision and lab expertise influence outcome</text>

  <!-- Footer -->
  <rect x="40" y="238" width="720" height="36" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="400" y="258" text-anchor="middle" font-size="11" font-weight="600" fill="${C.rose}">One failed cycle is not the end.</text>
  <text x="400" y="266" text-anchor="middle" font-size="10" fill="${C.muted}"> Advanced testing (PGT-A, ERA, Hysteroscopy) and revised protocols help most couples succeed in subsequent cycles.</text>
</svg>`;

const SVG_ART_LAW_SINGLE_WOMEN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 230" font-family="${FONT}">
  <rect width="800" height="230" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">4 Key ART Law Provisions for Single Women in India</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Card 1 -->
  <rect x="40" y="58" width="346" height="72" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="72" cy="86" r="14" fill="${C.rose}"/>
  <text x="72" y="90.5" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">1</text>
  <text x="98" y="78" font-size="12" font-weight="700" fill="${C.dark}">Eligibility for IVF</text>
  <text x="98" y="95" font-size="10.5" fill="${C.muted}">Single women — including unmarried women</text>
  <text x="98" y="111" font-size="10.5" fill="${C.muted}">and single mothers — are legally eligible for IVF</text>

  <!-- Card 2 -->
  <rect x="414" y="58" width="346" height="72" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="446" cy="86" r="14" fill="${C.rose}"/>
  <text x="446" y="90.5" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">2</text>
  <text x="472" y="78" font-size="12" font-weight="700" fill="${C.dark}">Age Requirements</text>
  <text x="472" y="95" font-size="10.5" fill="${C.muted}">Women must be between 21 and 50 years</text>
  <text x="472" y="111" font-size="10.5" fill="${C.muted}">of age to qualify for IVF services</text>

  <!-- Card 3 -->
  <rect x="40" y="142" width="346" height="72" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="72" cy="170" r="14" fill="${C.rose}"/>
  <text x="72" y="174.5" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">3</text>
  <text x="98" y="162" font-size="12" font-weight="700" fill="${C.dark}">Informed Consent</text>
  <text x="98" y="179" font-size="10.5" fill="${C.muted}">All ART procedures require pre-treatment</text>
  <text x="98" y="195" font-size="10.5" fill="${C.muted}">counseling and documented informed consent</text>

  <!-- Card 4 -->
  <rect x="414" y="142" width="346" height="72" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="446" cy="170" r="14" fill="${C.rose}"/>
  <text x="446" y="174.5" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">4</text>
  <text x="472" y="162" font-size="12" font-weight="700" fill="${C.dark}">Confidentiality</text>
  <text x="472" y="179" font-size="10.5" fill="${C.muted}">Patient identities and all medical records</text>
  <text x="472" y="195" font-size="10.5" fill="${C.muted}">are kept strictly confidential by law</text>
</svg>`;

const SVG_IVF_PREGNANCY_MILESTONES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 310" font-family="${FONT}">
  <rect width="800" height="310" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">IVF Pregnancy: 8 Key Weekly Milestones</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>

  <!-- Column 1: Weeks 1-4, 5-8, 9-12, 13-16 -->
  <rect x="40" y="56" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="56" width="6" height="48" rx="3" fill="${C.rose}"/>
  <text x="58" y="74" font-size="10" font-weight="700" fill="${C.rose}">Weeks 1–4</text>
  <text x="58" y="88" font-size="11.5" font-weight="600" fill="${C.dark}">Conception &amp; Confirmation</text>
  <text x="58" y="99" font-size="10" fill="${C.muted}">Embryo implants; avoid alcohol, smoking &amp; risky medications</text>

  <rect x="40" y="112" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="112" width="6" height="48" rx="3" fill="${C.rose}"/>
  <text x="58" y="130" font-size="10" font-weight="700" fill="${C.rose}">Weeks 5–8</text>
  <text x="58" y="144" font-size="11.5" font-weight="600" fill="${C.dark}">Early Pregnancy Symptoms</text>
  <text x="58" y="155" font-size="10" fill="${C.muted}">Nausea, fatigue, breast tenderness; prenatal check-ups begin</text>

  <rect x="40" y="168" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="168" width="6" height="48" rx="3" fill="${C.rose}"/>
  <text x="58" y="186" font-size="10" font-weight="700" fill="${C.rose}">Weeks 9–12</text>
  <text x="58" y="200" font-size="11.5" font-weight="600" fill="${C.dark}">Transition to Second Trimester</text>
  <text x="58" y="211" font-size="10" fill="${C.muted}">Energy returns; genetic screening &amp; structural anomaly tests</text>

  <rect x="40" y="224" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="224" width="6" height="48" rx="3" fill="${C.rose}"/>
  <text x="58" y="242" font-size="10" font-weight="700" fill="${C.rose}">Weeks 13–16</text>
  <text x="58" y="256" font-size="11.5" font-weight="600" fill="${C.dark}">Maternal Comfort &amp; Fetal Growth</text>
  <text x="58" y="267" font-size="10" fill="${C.muted}">Amniocentesis or CVS may be offered; light exercise with clearance</text>

  <!-- Column 2: Weeks 17-20, 21-24, 25-28, 37-40 -->
  <rect x="414" y="56" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="414" y="56" width="6" height="48" rx="3" fill="${C.rose}"/>
  <text x="432" y="74" font-size="10" font-weight="700" fill="${C.rose}">Weeks 17–20</text>
  <text x="432" y="88" font-size="11.5" font-weight="600" fill="${C.dark}">Halfway Milestone</text>
  <text x="432" y="99" font-size="10" fill="${C.muted}">Fetal movements felt; gestational diabetes screening begins</text>

  <rect x="414" y="112" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="414" y="112" width="6" height="48" rx="3" fill="${C.rose}"/>
  <text x="432" y="130" font-size="10" font-weight="700" fill="${C.rose}">Weeks 21–24</text>
  <text x="432" y="144" font-size="11.5" font-weight="600" fill="${C.dark}">Fetal Anomaly Scan</text>
  <text x="432" y="155" font-size="10" fill="${C.muted}">Most important structural scan; fetal echo if advised</text>

  <rect x="414" y="168" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="414" y="168" width="6" height="48" rx="3" fill="${C.rose}"/>
  <text x="432" y="186" font-size="10" font-weight="700" fill="${C.rose}">Weeks 25–28</text>
  <text x="432" y="200" font-size="11.5" font-weight="600" fill="${C.dark}">Third Trimester Begins</text>
  <text x="432" y="211" font-size="10" fill="${C.muted}">Fetal movements monitored; swelling &amp; discomfort may increase</text>

  <rect x="414" y="224" width="346" height="48" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="414" y="224" width="6" height="48" rx="3" fill="${C.rose}"/>
  <text x="432" y="242" font-size="10" font-weight="700" fill="${C.rose}">Weeks 37–40</text>
  <text x="432" y="256" font-size="11.5" font-weight="600" fill="${C.dark}">Full-Term Pregnancy</text>
  <text x="432" y="267" font-size="10" fill="${C.muted}">Labor signs appear; prepare for hospital &amp; postpartum care</text>
</svg>`;

// ── Wave 10 SVGs ─────────────────────────────────────────────────────

// Blog W10-1 (Ovarian Science): "4 Key Topics of the BFI Ovarian Science Program"
// Source: Blog node [6] — Ovarian Physiology, Ovarian Reserve, Poor Ovarian Response, Advanced Fertility Mgmt
const SVG_OVARIAN_SCIENCE_TOPICS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" font-family="${FONT}">
  <rect width="800" height="200" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="198.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">4 KEY TOPICS OF THE BFI OVARIAN SCIENCE PROGRAM</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="172" height="136" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="172" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="172" height="12" fill="${C.rose}"/>
  <text x="126" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">01</text>
  <text x="126" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Ovarian Physiology</text>
  <text x="126" y="118" text-anchor="middle" font-size="10" fill="${C.muted}">How the ovary</text>
  <text x="126" y="133" text-anchor="middle" font-size="10" fill="${C.muted}">functions and</text>
  <text x="126" y="148" text-anchor="middle" font-size="10" fill="${C.muted}">produces eggs</text>
  <rect x="222" y="48" width="172" height="136" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="222" y="48" width="172" height="36" rx="8" fill="${C.rose}"/>
  <rect x="222" y="72" width="172" height="12" fill="${C.rose}"/>
  <text x="308" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">02</text>
  <text x="308" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Ovarian Reserve</text>
  <text x="308" y="118" text-anchor="middle" font-size="10" fill="${C.muted}">Assessment and</text>
  <text x="308" y="133" text-anchor="middle" font-size="10" fill="${C.muted}">management</text>
  <text x="308" y="148" text-anchor="middle" font-size="10" fill="${C.muted}">strategies</text>
  <rect x="404" y="48" width="172" height="136" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="404" y="48" width="172" height="36" rx="8" fill="${C.rose}"/>
  <rect x="404" y="72" width="172" height="12" fill="${C.rose}"/>
  <text x="490" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">03</text>
  <text x="490" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Poor Ovarian</text>
  <text x="490" y="116" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Response</text>
  <text x="490" y="133" text-anchor="middle" font-size="10" fill="${C.muted}">Advanced management</text>
  <text x="490" y="148" text-anchor="middle" font-size="10" fill="${C.muted}">approaches</text>
  <rect x="586" y="48" width="174" height="136" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="586" y="48" width="174" height="36" rx="8" fill="${C.rose}"/>
  <rect x="586" y="72" width="174" height="12" fill="${C.rose}"/>
  <text x="673" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">04</text>
  <text x="673" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Advanced Fertility</text>
  <text x="673" y="116" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Management</text>
  <text x="673" y="133" text-anchor="middle" font-size="10" fill="${C.muted}">Expert clinical insights</text>
  <text x="673" y="148" text-anchor="middle" font-size="10" fill="${C.muted}">from BFI specialists</text>
</svg>`;

// Blog W10-2 (PCOS & Endo IVF): "4 Key Benefits of IVF for PCOS and Endometriosis"
// Source: Blog nodes [13-14] — benefits of IVF in overcoming PCOS/endo challenges
const SVG_IVF_PCOS_ENDO_BENEFITS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="238.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">4 KEY BENEFITS OF IVF FOR PCOS AND ENDOMETRIOSIS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="345" height="82" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="89" r="16" fill="${C.rose}"/>
  <text x="68" y="93.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="94" y="78" font-size="11.5" font-weight="700" fill="${C.dark}">Overcomes Ovulation Issues</text>
  <text x="94" y="94" font-size="10" fill="${C.muted}">Controlled stimulation bypasses</text>
  <text x="94" y="108" font-size="10" fill="${C.muted}">irregular ovulation in PCOS</text>
  <rect x="415" y="48" width="345" height="82" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="443" cy="89" r="16" fill="${C.rose}"/>
  <text x="443" y="93.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="469" y="78" font-size="11.5" font-weight="700" fill="${C.dark}">Bypasses Endometriosis Blockages</text>
  <text x="469" y="94" font-size="10" fill="${C.muted}">Eggs retrieved directly, avoiding</text>
  <text x="469" y="108" font-size="10" fill="${C.muted}">fallopian tube damage</text>
  <rect x="40" y="142" width="345" height="82" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="183" r="16" fill="${C.rose}"/>
  <text x="68" y="187.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="94" y="172" font-size="11.5" font-weight="700" fill="${C.dark}">Improves Fertilisation Rates</text>
  <text x="94" y="188" font-size="10" fill="${C.muted}">ICSI and advanced lab techniques</text>
  <text x="94" y="202" font-size="10" fill="${C.muted}">maximise each fertilisation chance</text>
  <rect x="415" y="142" width="345" height="82" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="443" cy="183" r="16" fill="${C.rose}"/>
  <text x="443" y="187.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="469" y="172" font-size="11.5" font-weight="700" fill="${C.dark}">Increases Implantation Chances</text>
  <text x="469" y="188" font-size="10" fill="${C.muted}">Careful embryo selection ensures</text>
  <text x="469" y="202" font-size="10" fill="${C.muted}">uterine readiness for transfer</text>
</svg>`;

// Blog W10-3 (Life after IUI): "Post-IUI Care Guide: What to Do and What to Avoid"
// Source: Blog nodes [13-16] — do's and don'ts after IUI procedure
const SVG_POST_IUI_DOS_DONTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 308" font-family="${FONT}">
  <rect width="800" height="308" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="306.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">POST-IUI CARE GUIDE: WHAT TO DO AND WHAT TO AVOID</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="356" height="34" rx="8" fill="${C.rose}"/>
  <rect x="40" y="66" width="356" height="12" fill="${C.rose}"/>
  <text x="218" y="65" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">5 THINGS TO DO AFTER IUI</text>
  <rect x="404" y="44" width="356" height="34" rx="8" fill="${C.dark}"/>
  <rect x="404" y="66" width="356" height="12" fill="${C.dark}"/>
  <text x="582" y="65" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">5 THINGS TO AVOID AFTER IUI</text>
  <rect x="40" y="90" width="356" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="109" r="13" fill="${C.rose}"/>
  <text x="68" y="113.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="90" y="103" font-size="11" font-weight="600" fill="${C.dark}">Take medications as prescribed</text>
  <text x="90" y="119" font-size="10" fill="${C.muted}">Progesterone support on schedule</text>
  <rect x="40" y="132" width="356" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="151" r="13" fill="${C.rose}"/>
  <text x="68" y="155.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="90" y="145" font-size="11" font-weight="600" fill="${C.dark}">Rest for 24 hours after IUI</text>
  <text x="90" y="161" font-size="10" fill="${C.muted}">Mild cramping is normal — rest helps</text>
  <rect x="40" y="174" width="356" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="193" r="13" fill="${C.rose}"/>
  <text x="68" y="197.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="90" y="187" font-size="11" font-weight="600" fill="${C.dark}">Stay hydrated and eat well</text>
  <text x="90" y="203" font-size="10" fill="${C.muted}">8–10 glasses water; balanced meals</text>
  <rect x="40" y="216" width="356" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="235" r="13" fill="${C.rose}"/>
  <text x="68" y="239.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="90" y="229" font-size="11" font-weight="600" fill="${C.dark}">Use a warm compress for comfort</text>
  <text x="90" y="245" font-size="10" fill="${C.muted}">Eases pelvic heaviness after the procedure</text>
  <rect x="40" y="258" width="356" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="277" r="13" fill="${C.rose}"/>
  <text x="68" y="281.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="90" y="271" font-size="11" font-weight="600" fill="${C.dark}">Attend your follow-up appointment</text>
  <text x="90" y="287" font-size="10" fill="${C.muted}">Beta-hCG test typically after 14 days</text>
  <rect x="404" y="90" width="356" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="432" cy="109" r="13" fill="${C.rose}"/>
  <text x="432" y="113.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="454" y="103" font-size="11" font-weight="600" fill="${C.dark}">No heavy lifting or intense exercise</text>
  <text x="454" y="119" font-size="10" fill="${C.muted}">Elevated heart rate may affect outcome</text>
  <rect x="404" y="132" width="356" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="432" cy="151" r="13" fill="${C.rose}"/>
  <text x="432" y="155.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="454" y="145" font-size="11" font-weight="600" fill="${C.dark}">No hot baths, saunas or swimming</text>
  <text x="454" y="161" font-size="10" fill="${C.muted}">Heat increases pelvic blood flow</text>
  <rect x="404" y="174" width="356" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="432" cy="193" r="13" fill="${C.rose}"/>
  <text x="432" y="197.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="454" y="187" font-size="11" font-weight="600" fill="${C.dark}">No alcohol, smoking or caffeine</text>
  <text x="454" y="203" font-size="10" fill="${C.muted}">These affect the implantation environment</text>
  <rect x="404" y="216" width="356" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="432" cy="235" r="13" fill="${C.rose}"/>
  <text x="432" y="239.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="454" y="229" font-size="11" font-weight="600" fill="${C.dark}">Don't test pregnancy before 14 days</text>
  <text x="454" y="245" font-size="10" fill="${C.muted}">Testing too early gives false results</text>
  <rect x="404" y="258" width="356" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="432" cy="277" r="13" fill="${C.rose}"/>
  <text x="432" y="281.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="454" y="271" font-size="11" font-weight="600" fill="${C.dark}">Don't panic over mild symptoms</text>
  <text x="454" y="287" font-size="10" fill="${C.muted}">Light spotting and bloating are normal</text>
</svg>`;

// Blog W10-4 (PCOS Lifestyle Fertility): "8 Lifestyle Changes to Boost Fertility with PCOS"
// Source: Blog node [9] — 8 lifestyle factors affecting PCOS fertility
const SVG_PCOS_FERTILITY_LIFESTYLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" font-family="${FONT}">
  <rect width="800" height="320" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="318.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">8 LIFESTYLE CHANGES TO BOOST FERTILITY WITH PCOS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="75" r="15" fill="${C.rose}"/>
  <text x="68" y="79.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="93" y="70" font-size="11.5" font-weight="700" fill="${C.dark}">Balanced Nutrition</text>
  <text x="93" y="87" font-size="10" fill="${C.muted}">Low-GI foods, lean proteins, healthy fats</text>
  <rect x="40" y="112" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="143" r="15" fill="${C.rose}"/>
  <text x="68" y="147.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="93" y="138" font-size="11.5" font-weight="700" fill="${C.dark}">Regular Smart Exercise</text>
  <text x="93" y="155" font-size="10" fill="${C.muted}">Cardio, strength and yoga — avoid overtraining</text>
  <rect x="40" y="180" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="211" r="15" fill="${C.rose}"/>
  <text x="68" y="215.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="93" y="206" font-size="11.5" font-weight="700" fill="${C.dark}">Maintain Healthy Weight</text>
  <text x="93" y="223" font-size="10" fill="${C.muted}">5–10% weight loss can restore ovulation in PCOS</text>
  <rect x="40" y="248" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="279" r="15" fill="${C.rose}"/>
  <text x="68" y="283.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="93" y="274" font-size="11.5" font-weight="700" fill="${C.dark}">Reduce Stress</text>
  <text x="93" y="291" font-size="10" fill="${C.muted}">Mindfulness, meditation and counselling help</text>
  <rect x="405" y="44" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="75" r="15" fill="${C.rose}"/>
  <text x="433" y="79.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="458" y="70" font-size="11.5" font-weight="700" fill="${C.dark}">Prioritize Quality Sleep</text>
  <text x="458" y="87" font-size="10" fill="${C.muted}">7–9 hours nightly with a consistent schedule</text>
  <rect x="405" y="112" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="143" r="15" fill="${C.rose}"/>
  <text x="433" y="147.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="458" y="138" font-size="11.5" font-weight="700" fill="${C.dark}">Avoid Smoking &amp; Limit Alcohol</text>
  <text x="458" y="155" font-size="10" fill="${C.muted}">Both affect ovarian reserve and hormone levels</text>
  <rect x="405" y="180" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="211" r="15" fill="${C.rose}"/>
  <text x="433" y="215.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">7</text>
  <text x="458" y="206" font-size="11.5" font-weight="700" fill="${C.dark}">Consider Supplements</text>
  <text x="458" y="223" font-size="10" fill="${C.muted}">Inositol, Vitamin D, Omega-3 — with your doctor</text>
  <rect x="405" y="248" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="279" r="15" fill="${C.rose}"/>
  <text x="433" y="283.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">8</text>
  <text x="458" y="274" font-size="11.5" font-weight="700" fill="${C.dark}">Track Ovulation</text>
  <text x="458" y="291" font-size="10" fill="${C.muted}">OPKs, BBT charts or ultrasound monitoring</text>
</svg>`;

// Blog W10-5 (IVF Success Lifestyle): "10 Lifestyle Changes to Boost IVF Success"
// Source: Blog H2 sections — 10 key lifestyle pillars from the blog's own content
const SVG_IVF_SUCCESS_LIFESTYLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" font-family="${FONT}">
  <rect width="800" height="360" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="358.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">10 LIFESTYLE CHANGES TO BOOST IVF SUCCESS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="71" r="14" fill="${C.rose}"/>
  <text x="68" y="75.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="92" y="66" font-size="11.5" font-weight="700" fill="${C.dark}">Maintain a Healthy Diet</text>
  <text x="92" y="82" font-size="10" fill="${C.muted}">Antioxidant-rich whole foods; avoid processed food</text>
  <rect x="40" y="104" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="131" r="14" fill="${C.rose}"/>
  <text x="68" y="135.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="92" y="126" font-size="11.5" font-weight="700" fill="${C.dark}">Achieve a Healthy Weight</text>
  <text x="92" y="142" font-size="10" fill="${C.muted}">BMI 18.5–24.9 optimal for implantation success</text>
  <rect x="40" y="164" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="191" r="14" fill="${C.rose}"/>
  <text x="68" y="195.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="92" y="186" font-size="11.5" font-weight="700" fill="${C.dark}">Exercise Moderately</text>
  <text x="92" y="202" font-size="10" fill="${C.muted}">Walking, swimming, yoga; avoid high-intensity training</text>
  <rect x="40" y="224" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="251" r="14" fill="${C.rose}"/>
  <text x="68" y="255.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="92" y="246" font-size="11.5" font-weight="700" fill="${C.dark}">Manage Stress Effectively</text>
  <text x="92" y="262" font-size="10" fill="${C.muted}">Meditation, mindfulness, partner communication</text>
  <rect x="40" y="284" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="311" r="14" fill="${C.rose}"/>
  <text x="68" y="315.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="92" y="306" font-size="11.5" font-weight="700" fill="${C.dark}">Quit Smoking &amp; Limit Alcohol</text>
  <text x="92" y="322" font-size="10" fill="${C.muted}">Smoking reduces egg quality and sperm count</text>
  <rect x="405" y="44" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="71" r="14" fill="${C.rose}"/>
  <text x="433" y="75.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="457" y="66" font-size="11.5" font-weight="700" fill="${C.dark}">Focus on Fertility Supplements</text>
  <text x="457" y="82" font-size="10" fill="${C.muted}">Folic acid, CoQ10, Vitamin D — with your doctor</text>
  <rect x="405" y="104" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="131" r="14" fill="${C.rose}"/>
  <text x="433" y="135.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">7</text>
  <text x="457" y="126" font-size="11.5" font-weight="700" fill="${C.dark}">Get Sufficient Sleep</text>
  <text x="457" y="142" font-size="10" fill="${C.muted}">7–8 hours nightly; keep a consistent schedule</text>
  <rect x="405" y="164" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="191" r="14" fill="${C.rose}"/>
  <text x="433" y="195.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">8</text>
  <text x="457" y="186" font-size="11.5" font-weight="700" fill="${C.dark}">Avoid Environmental Toxins</text>
  <text x="457" y="202" font-size="10" fill="${C.muted}">BPA, pesticides and chemicals affect fertility</text>
  <rect x="405" y="224" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="251" r="14" fill="${C.rose}"/>
  <text x="433" y="255.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">9</text>
  <text x="457" y="246" font-size="11.5" font-weight="700" fill="${C.dark}">Stay Well Hydrated</text>
  <text x="457" y="262" font-size="10" fill="${C.muted}">8–10 glasses of water daily; avoid sugary drinks</text>
  <rect x="405" y="284" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="311" r="14" fill="${C.rose}"/>
  <text x="433" y="315.5" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">10</text>
  <text x="457" y="306" font-size="11.5" font-weight="700" fill="${C.dark}">Maintain Work-Life Balance</text>
  <text x="457" y="322" font-size="10" fill="${C.muted}">Reduce occupational stress; take regular breaks</text>
</svg>`;

// ── Wave 11 SVGs ─────────────────────────────────────────────────────

// Blog W11-1 (Low AMH): "6 Ways to Improve Natural Conception with Low AMH"
// Source: Blog nodes [15-33] — 6 H3 strategy sections in the blog
const SVG_NATURAL_CONCEPTION_LOW_AMH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 280" font-family="${FONT}">
  <rect width="800" height="280" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="278.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">6 WAYS TO IMPROVE NATURAL CONCEPTION WITH LOW AMH</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="355" height="70" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="79" r="15" fill="${C.rose}"/>
  <text x="68" y="83.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="93" y="74" font-size="11.5" font-weight="700" fill="${C.dark}">Optimize Your Diet</text>
  <text x="93" y="91" font-size="10" fill="${C.muted}">Antioxidants, healthy fats, lean proteins, whole grains</text>
  <rect x="40" y="120" width="355" height="70" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="155" r="15" fill="${C.rose}"/>
  <text x="68" y="159.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="93" y="150" font-size="11.5" font-weight="700" fill="${C.dark}">Manage Stress Effectively</text>
  <text x="93" y="167" font-size="10" fill="${C.muted}">Mindfulness, yoga, breathing and quality sleep</text>
  <rect x="40" y="196" width="355" height="70" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="231" r="15" fill="${C.rose}"/>
  <text x="68" y="235.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="93" y="226" font-size="11.5" font-weight="700" fill="${C.dark}">Exercise in Moderation</text>
  <text x="93" y="243" font-size="10" fill="${C.muted}">Walking, swimming, yoga; avoid over-exercising</text>
  <rect x="405" y="44" width="355" height="70" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="79" r="15" fill="${C.rose}"/>
  <text x="433" y="83.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="458" y="74" font-size="11.5" font-weight="700" fill="${C.dark}">Maintain a Healthy Weight</text>
  <text x="458" y="91" font-size="10" fill="${C.muted}">Balanced BMI supports hormone production and ovulation</text>
  <rect x="405" y="120" width="355" height="70" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="155" r="15" fill="${C.rose}"/>
  <text x="433" y="159.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="458" y="150" font-size="11.5" font-weight="700" fill="${C.dark}">Take Fertility Supplements</text>
  <text x="458" y="167" font-size="10" fill="${C.muted}">CoQ10, Vitamin D, Omega-3, Folate — with your doctor</text>
  <rect x="405" y="196" width="355" height="70" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="231" r="15" fill="${C.rose}"/>
  <text x="433" y="235.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="458" y="226" font-size="11.5" font-weight="700" fill="${C.dark}">Track Ovulation Carefully</text>
  <text x="458" y="243" font-size="10" fill="${C.muted}">OPKs, BBT charting, cervical mucus monitoring</text>
</svg>`;

// Blog W11-2 (Necrozoospermia): "8 Common Causes of Necrozoospermia"
// Source: Blog nodes [15-30] — 8 H3 cause sections
const SVG_NECROZOOSPERMIA_CAUSES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" font-family="${FONT}">
  <rect width="800" height="320" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="318.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">8 COMMON CAUSES OF NECROZOOSPERMIA</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="75" r="15" fill="${C.rose}"/>
  <text x="68" y="79.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="93" y="70" font-size="11.5" font-weight="700" fill="${C.dark}">Infections &amp; Inflammation</text>
  <text x="93" y="87" font-size="10" fill="${C.muted}">Prostatitis, epididymitis — toxins that damage sperm cells</text>
  <rect x="40" y="112" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="143" r="15" fill="${C.rose}"/>
  <text x="68" y="147.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="93" y="138" font-size="11.5" font-weight="700" fill="${C.dark}">Oxidative Stress</text>
  <text x="93" y="155" font-size="10" fill="${C.muted}">ROS from poor diet, smoking, toxins, heat exposure</text>
  <rect x="40" y="180" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="211" r="15" fill="${C.rose}"/>
  <text x="68" y="215.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="93" y="206" font-size="11.5" font-weight="700" fill="${C.dark}">Exposure to Toxins</text>
  <text x="93" y="223" font-size="10" fill="${C.muted}">Industrial chemicals, pesticides and radiation damage sperm</text>
  <rect x="40" y="248" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="279" r="15" fill="${C.rose}"/>
  <text x="68" y="283.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="93" y="274" font-size="11.5" font-weight="700" fill="${C.dark}">High Scrotal Temperature</text>
  <text x="93" y="291" font-size="10" fill="${C.muted}">Varicocele, tight clothing, hot baths, laptop heat</text>
  <rect x="405" y="44" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="75" r="15" fill="${C.rose}"/>
  <text x="433" y="79.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="458" y="70" font-size="11.5" font-weight="700" fill="${C.dark}">Medications &amp; Treatments</text>
  <text x="458" y="87" font-size="10" fill="${C.muted}">Chemotherapy, radiation or certain antibiotics harm sperm</text>
  <rect x="405" y="112" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="143" r="15" fill="${C.rose}"/>
  <text x="433" y="147.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="458" y="138" font-size="11.5" font-weight="700" fill="${C.dark}">Autoimmune Reactions</text>
  <text x="458" y="155" font-size="10" fill="${C.muted}">Anti-sperm antibodies attack and kill viable sperm cells</text>
  <rect x="405" y="180" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="211" r="15" fill="${C.rose}"/>
  <text x="433" y="215.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">7</text>
  <text x="458" y="206" font-size="11.5" font-weight="700" fill="${C.dark}">Hormonal Imbalance</text>
  <text x="458" y="223" font-size="10" fill="${C.muted}">Testosterone disorders reduce sperm quality and survival</text>
  <rect x="405" y="248" width="355" height="62" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="433" cy="279" r="15" fill="${C.rose}"/>
  <text x="433" y="283.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">8</text>
  <text x="458" y="274" font-size="11.5" font-weight="700" fill="${C.dark}">Genetic Factors</text>
  <text x="458" y="291" font-size="10" fill="${C.muted}">Chromosomal defects impair sperm development and function</text>
</svg>`;

// Blog W11-3 (Embryo Transfer Diet): "5 Key Nutrients for Embryo Implantation"
// Source: Blog nodes [18-23] — 5 nutrients listed with descriptions
const SVG_EMBRYO_TRANSFER_NUTRIENTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 KEY NUTRIENTS FOR EMBRYO IMPLANTATION</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">01</text>
  <text x="108" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Folic Acid</text>
  <text x="108" y="118" text-anchor="middle" font-size="10" fill="${C.muted}">Fetal neural</text>
  <text x="108" y="133" text-anchor="middle" font-size="10" fill="${C.muted}">tube development</text>
  <text x="108" y="148" text-anchor="middle" font-size="10" fill="${C.muted}">and cell health</text>
  <rect x="186" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">02</text>
  <text x="254" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Omega-3</text>
  <text x="254" y="118" text-anchor="middle" font-size="10" fill="${C.muted}">Reduces uterine</text>
  <text x="254" y="133" text-anchor="middle" font-size="10" fill="${C.muted}">inflammation and</text>
  <text x="254" y="148" text-anchor="middle" font-size="10" fill="${C.muted}">supports embryo</text>
  <rect x="332" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">03</text>
  <text x="400" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Protein</text>
  <text x="400" y="118" text-anchor="middle" font-size="10" fill="${C.muted}">Fuels cell repair</text>
  <text x="400" y="133" text-anchor="middle" font-size="10" fill="${C.muted}">and embryo growth</text>
  <text x="400" y="148" text-anchor="middle" font-size="10" fill="${C.muted}">after transfer</text>
  <rect x="478" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">04</text>
  <text x="546" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Iron</text>
  <text x="546" y="118" text-anchor="middle" font-size="10" fill="${C.muted}">Prevents anaemia</text>
  <text x="546" y="133" text-anchor="middle" font-size="10" fill="${C.muted}">for healthy</text>
  <text x="546" y="148" text-anchor="middle" font-size="10" fill="${C.muted}">embryo development</text>
  <rect x="624" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">05</text>
  <text x="692" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Antioxidants</text>
  <text x="692" y="118" text-anchor="middle" font-size="10" fill="${C.muted}">Protects cells</text>
  <text x="692" y="133" text-anchor="middle" font-size="10" fill="${C.muted}">from oxidative</text>
  <text x="692" y="148" text-anchor="middle" font-size="10" fill="${C.muted}">stress damage</text>
</svg>`;

// Blog W11-4 (Ovarian Rejuvenation): "5 Key Benefits of Ovarian Rejuvenation Therapy"
// Source: Blog node [19] — benefits bullet list
const SVG_OVARIAN_REJUVENATION_BENEFITS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 310" font-family="${FONT}">
  <rect width="800" height="310" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="308.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 KEY BENEFITS OF OVARIAN REJUVENATION THERAPY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="67" r="14" fill="${C.rose}"/>
  <text x="68" y="71.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="92" y="63" font-size="11.5" font-weight="700" fill="${C.dark}">May Improve Hormone Levels</text>
  <text x="92" y="79" font-size="10" fill="${C.muted}">AMH and oestrogen levels may improve after PRP ovarian treatment</text>
  <rect x="40" y="96" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="119" r="14" fill="${C.rose}"/>
  <text x="68" y="123.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="92" y="115" font-size="11.5" font-weight="700" fill="${C.dark}">Could Lead to Natural Ovulation</text>
  <text x="92" y="131" font-size="10" fill="${C.muted}">Dormant follicles may be re-activated to produce viable eggs</text>
  <rect x="40" y="148" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="171" r="14" fill="${C.rose}"/>
  <text x="68" y="175.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="92" y="167" font-size="11.5" font-weight="700" fill="${C.dark}">Potential for More Eggs in IVF</text>
  <text x="92" y="183" font-size="10" fill="${C.muted}">Better ovarian response allows retrieval of more eggs per cycle</text>
  <rect x="40" y="200" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="223" r="14" fill="${C.rose}"/>
  <text x="68" y="227.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="92" y="219" font-size="11.5" font-weight="700" fill="${C.dark}">Chance to Conceive with Own Eggs</text>
  <text x="92" y="235" font-size="10" fill="${C.muted}">Explore natural conception before considering egg donation</text>
  <rect x="40" y="252" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="275" r="14" fill="${C.rose}"/>
  <text x="68" y="279.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="92" y="271" font-size="11.5" font-weight="700" fill="${C.dark}">Minimally Invasive and Safe</text>
  <text x="92" y="287" font-size="10" fill="${C.muted}">Uses patient's own blood (PRP) — no risk of allergic reactions</text>
</svg>`;

// Blog W11-5 (Ovarian Rejuvenation + IVF at BFI): "Why Choose BFI for Ovarian Rejuvenation + IVF"
// Source: Blog node [18] — 5 BFI differentiators (bullet list)
const SVG_BFI_REJUVENATION_IVF = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 340" font-family="${FONT}">
  <rect width="800" height="340" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="338.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">WHY CHOOSE BFI FOR OVARIAN REJUVENATION + IVF</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="720" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="6" height="52" rx="3" fill="${C.rose}"/>
  <text x="60" y="63" font-size="10" font-weight="700" fill="${C.rose}">Reason 1</text>
  <text x="60" y="79" font-size="11.5" font-weight="600" fill="${C.dark}">Personalised Assessment</text>
  <text x="60" y="90" font-size="10" fill="${C.muted}">Thorough evaluation of ovarian reserve, fertility history and treatment goals</text>
  <rect x="40" y="102" width="720" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="102" width="6" height="52" rx="3" fill="${C.rose}"/>
  <text x="60" y="121" font-size="10" font-weight="700" fill="${C.rose}">Reason 2</text>
  <text x="60" y="137" font-size="11.5" font-weight="600" fill="${C.dark}">Realistic Expectations</text>
  <text x="60" y="148" font-size="10" fill="${C.muted}">Honest guidance on what each procedure can realistically achieve for you</text>
  <rect x="40" y="160" width="720" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="160" width="6" height="52" rx="3" fill="${C.rose}"/>
  <text x="60" y="179" font-size="10" font-weight="700" fill="${C.rose}">Reason 3</text>
  <text x="60" y="195" font-size="11.5" font-weight="600" fill="${C.dark}">Transparent Counselling</text>
  <text x="60" y="206" font-size="10" fill="${C.muted}">Clear explanation of benefits, limitations and potential risks of all options</text>
  <rect x="40" y="218" width="720" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="218" width="6" height="52" rx="3" fill="${C.rose}"/>
  <text x="60" y="237" font-size="10" font-weight="700" fill="${C.rose}">Reason 4</text>
  <text x="60" y="253" font-size="11.5" font-weight="600" fill="${C.dark}">Comprehensive Fertility Solutions</text>
  <text x="60" y="264" font-size="10" fill="${C.muted}">IVF, ICSI, PRP and emerging treatments — all tailored to each patient</text>
  <rect x="40" y="276" width="720" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="276" width="6" height="52" rx="3" fill="${C.rose}"/>
  <text x="60" y="295" font-size="10" font-weight="700" fill="${C.rose}">Reason 5</text>
  <text x="60" y="311" font-size="11.5" font-weight="600" fill="${C.dark}">Ethical &amp; Compassionate Care</text>
  <text x="60" y="322" font-size="10" fill="${C.muted}">Patient comfort, safety and emotional support throughout the fertility journey</text>
</svg>`;

// ── Wave 33 SVG constants (Draft-blog enrichment begins) ──────────────

// Blog D1-1 (How many embryos to transfer): "How Many Embryos to Transfer? By Age"
// Source: Blog node [13] — 3 age-based recommendations, stated verbatim
const SVG_EMBRYO_TRANSFER_COUNT_BY_AGE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 214" font-family="${FONT}">
  <rect width="800" height="214" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="212.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">HOW MANY EMBRYOS TO TRANSFER? BY AGE</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="70" text-anchor="middle" font-size="12.5" font-weight="700" fill="${C.white}">UNDER 35</text>
  <text x="149" y="118" text-anchor="middle" font-size="16" font-weight="800" fill="${C.rose}">Single Embryo</text>
  <text x="149" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">SET usually recommended</text>
  <rect x="291" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="291" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="291" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="12.5" font-weight="700" fill="${C.white}">35–40</text>
  <text x="400" y="118" text-anchor="middle" font-size="16" font-weight="800" fill="${C.rose}">One or Two</text>
  <text x="400" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">May be considered</text>
  <rect x="542" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="542" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="542" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="70" text-anchor="middle" font-size="12.5" font-weight="700" fill="${C.white}">ABOVE 40</text>
  <text x="651" y="118" text-anchor="middle" font-size="16" font-weight="800" fill="${C.rose}">Two Embryos</text>
  <text x="651" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">May be transferred</text>
  <text x="400" y="190" text-anchor="middle" font-size="9.5" fill="${C.muted}">Many leading IVF centres now encourage SET to reduce risk while maintaining success</text>
</svg>`;

// Blog D1-2 (When to see a fertility specialist): "When to See a Fertility Specialist: By Age"
// Source: Blog node [9] — 4 age-based timing thresholds, stated verbatim
const SVG_FERTILITY_SPECIALIST_TIMING = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">WHEN TO SEE A FERTILITY SPECIALIST: BY AGE</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">UNDER 35</text>
  <text x="108" y="112" text-anchor="middle" font-size="18" font-weight="800" fill="${C.rose}">12</text>
  <text x="108" y="130" text-anchor="middle" font-size="10" fill="${C.dark}" font-weight="600">months first</text>
  <rect x="186" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">35–37</text>
  <text x="254" y="112" text-anchor="middle" font-size="18" font-weight="800" fill="${C.rose}">6</text>
  <text x="254" y="130" text-anchor="middle" font-size="10" fill="${C.dark}" font-weight="600">months first</text>
  <rect x="332" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">38–39</text>
  <text x="400" y="112" text-anchor="middle" font-size="18" font-weight="800" fill="${C.rose}">3</text>
  <text x="400" y="130" text-anchor="middle" font-size="10" fill="${C.dark}" font-weight="600">months first</text>
  <rect x="478" y="48" width="282" height="138" rx="8" fill="${C.white}" stroke="${C.rose}" stroke-width="1.5"/>
  <rect x="478" y="48" width="282" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="282" height="12" fill="${C.rose}"/>
  <text x="619" y="70" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">40+</text>
  <text x="619" y="118" text-anchor="middle" font-size="15" font-weight="800" fill="${C.rose}">See a Specialist</text>
  <text x="619" y="135" text-anchor="middle" font-size="10" fill="${C.dark}" font-weight="600">Immediately</text>
</svg>`;

// Blog D1-3 (Improve male infertility): "9 Ways to Improve Male Fertility"
// Source: Blog headings [9],[13],[15],[17],[19],[21],[23],[25],[27] — 9 strategies, stated verbatim
const SVG_MALE_INFERTILITY_IMPROVE_9 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 370" font-family="${FONT}">
  <rect width="800" height="370" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="368.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">9 WAYS TO IMPROVE MALE FERTILITY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="73" r="16" fill="${C.rose}"/>
  <text x="42" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="67" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Healthy Diet</text>
  <text x="67" y="84" font-size="10.5" fill="${C.muted}">Antioxidants, vitamins, zinc-rich foods</text>
  <rect x="10" y="104" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="133" r="16" fill="${C.rose}"/>
  <text x="42" y="138" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="67" y="127" font-size="11.5" font-weight="700" fill="${C.dark}">Regular Exercise</text>
  <text x="67" y="144" font-size="10.5" fill="${C.muted}">Maintains healthy weight and hormone balance</text>
  <rect x="10" y="164" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="193" r="16" fill="${C.rose}"/>
  <text x="42" y="198" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="67" y="187" font-size="11.5" font-weight="700" fill="${C.dark}">Avoid Smoking &amp; Alcohol</text>
  <text x="67" y="204" font-size="10.5" fill="${C.muted}">Both reduce sperm count and quality</text>
  <rect x="10" y="224" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="253" r="16" fill="${C.rose}"/>
  <text x="42" y="258" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="67" y="247" font-size="11.5" font-weight="700" fill="${C.dark}">Reduce Stress</text>
  <text x="67" y="264" font-size="10.5" fill="${C.muted}">Protects testosterone and sperm production</text>
  <rect x="10" y="284" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="313" r="16" fill="${C.rose}"/>
  <text x="42" y="318" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="67" y="307" font-size="11.5" font-weight="700" fill="${C.dark}">Limit Environmental Toxins</text>
  <text x="67" y="324" font-size="10.5" fill="${C.muted}">Avoid pesticides, heavy metals, chemicals</text>
  <rect x="410" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="73" r="16" fill="${C.rose}"/>
  <text x="442" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="467" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Loose-Fitting Underwear</text>
  <text x="467" y="84" font-size="10.5" fill="${C.muted}">Reduces scrotal temperature</text>
  <rect x="410" y="104" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="133" r="16" fill="${C.rose}"/>
  <text x="442" y="138" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">7</text>
  <text x="467" y="127" font-size="11.5" font-weight="700" fill="${C.dark}">Treat Underlying Conditions</text>
  <text x="467" y="144" font-size="10.5" fill="${C.muted}">Varicocele, hormonal, ED treatments</text>
  <rect x="410" y="164" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="193" r="16" fill="${C.rose}"/>
  <text x="442" y="198" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">8</text>
  <text x="467" y="187" font-size="11.5" font-weight="700" fill="${C.dark}">Fertility Supplements</text>
  <text x="467" y="204" font-size="10.5" fill="${C.muted}">Zinc, folic acid, CoQ10, L-carnitine</text>
  <rect x="410" y="224" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="253" r="16" fill="${C.rose}"/>
  <text x="442" y="258" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">9</text>
  <text x="467" y="247" font-size="11.5" font-weight="700" fill="${C.dark}">Avoid Excessive Heat</text>
  <text x="467" y="264" font-size="10.5" fill="${C.muted}">No hot tubs, saunas, prolonged heat exposure</text>
</svg>`;

// Blog D1-4 (Recognize signs of ovulation): "5 Physical Signs of Ovulation"
// Source: Blog node [8] — 5 physical signs, stated verbatim
const SVG_OVULATION_PHYSICAL_SIGNS_5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 PHYSICAL SIGNS OF OVULATION</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">01</text>
  <text x="108" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">BBT Shift</text>
  <text x="108" y="118" text-anchor="middle" font-size="9" fill="${C.muted}">Temp rises</text>
  <text x="108" y="131" text-anchor="middle" font-size="9" fill="${C.muted}">after ovulation</text>
  <rect x="186" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">02</text>
  <text x="254" y="100" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.dark}">Cervical Mucus</text>
  <text x="254" y="118" text-anchor="middle" font-size="9" fill="${C.muted}">Clear, slippery,</text>
  <text x="254" y="131" text-anchor="middle" font-size="9" fill="${C.muted}">egg-white like</text>
  <rect x="332" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">03</text>
  <text x="400" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Ovulation Pain</text>
  <text x="400" y="118" text-anchor="middle" font-size="9" fill="${C.muted}">Mild, sharp,</text>
  <text x="400" y="131" text-anchor="middle" font-size="9" fill="${C.muted}">one-sided</text>
  <rect x="478" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">04</text>
  <text x="546" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Breast</text>
  <text x="546" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Tenderness</text>
  <text x="546" y="133" text-anchor="middle" font-size="9" fill="${C.muted}">Hormonal swelling</text>
  <rect x="624" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">05</text>
  <text x="692" y="100" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.dark}">Increased Libido</text>
  <text x="692" y="118" text-anchor="middle" font-size="9" fill="${C.muted}">Natural surge in</text>
  <text x="692" y="131" text-anchor="middle" font-size="9" fill="${C.muted}">fertile window</text>
</svg>`;

// Blog D1-5 (Test for female infertility): "6 Key Diagnostic Tests for Female Infertility"
// Source: Blog headings [19],[23],[25],[28],[34],[43] — 6 core tests, stated verbatim
const SVG_FEMALE_INFERTILITY_TESTS_6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 244" font-family="${FONT}">
  <rect width="800" height="244" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="242.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">6 KEY DIAGNOSTIC TESTS FOR FEMALE INFERTILITY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="73" r="16" fill="${C.rose}"/>
  <text x="42" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="67" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Hormonal Testing</text>
  <text x="67" y="84" font-size="10.5" fill="${C.muted}">FSH, LH, AMH, thyroid, prolactin</text>
  <rect x="410" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="73" r="16" fill="${C.rose}"/>
  <text x="442" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="467" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Ovulation Testing</text>
  <text x="467" y="84" font-size="10.5" fill="${C.muted}">Progesterone levels, OPKs, ultrasound</text>
  <rect x="10" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="139" r="16" fill="${C.rose}"/>
  <text x="42" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="67" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Ultrasound Evaluation</text>
  <text x="67" y="150" font-size="10.5" fill="${C.muted}">Checks PCOS, fibroids, endometrial thickness</text>
  <rect x="410" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="139" r="16" fill="${C.rose}"/>
  <text x="442" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="467" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">HSG</text>
  <text x="467" y="150" font-size="10.5" fill="${C.muted}">X-ray checks tubal blockages and uterine shape</text>
  <rect x="10" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="205" r="16" fill="${C.rose}"/>
  <text x="42" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="67" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Laparoscopy</text>
  <text x="67" y="216" font-size="10.5" fill="${C.muted}">Direct view to check endometriosis, PID</text>
  <rect x="410" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="205" r="16" fill="${C.rose}"/>
  <text x="442" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="467" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Ovarian Reserve Testing</text>
  <text x="467" y="216" font-size="10.5" fill="${C.muted}">AMH, AFC, FSH and estradiol levels</text>
</svg>`;

// ── Wave 34 SVG constants (Draft-blog enrichment continues) ───────────

// Blog D2-1 (ICSI vs IVF upsold): "ICSI vs IVF: Is It Actually Needed?"
// Source: Blog nodes [18] (genuinely recommended) and [21] (not necessary), stated verbatim
const SVG_ICSI_ACTUALLY_NEEDED = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 278" font-family="${FONT}">
  <rect width="800" height="278" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="276.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <rect x="10" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">ICSI Is Genuinely Needed</text>
  <rect x="22" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Very Low Sperm Count</text>
  <text x="34" y="89" font-size="10.5" fill="${C.muted}">Severe male factor infertility</text>
  <rect x="22" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Poor Motility or Shape</text>
  <text x="34" y="137" font-size="10.5" fill="${C.muted}">Abnormal morphology affects fertilisation</text>
  <rect x="22" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">No Sperm in Semen</text>
  <text x="34" y="185" font-size="10.5" fill="${C.muted}">Surgically retrieved sperm (azoospermia)</text>
  <rect x="22" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Previous Fertilisation Failure</text>
  <text x="34" y="233" font-size="10.5" fill="${C.muted}">Standard IVF fertilisation didn't work before</text>
  <rect x="410" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">ICSI Is Not Necessary</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>
  <rect x="422" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Normal Semen Analysis</text>
  <text x="434" y="89" font-size="10.5" fill="${C.muted}">No male factor infertility present</text>
  <rect x="422" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">First IVF Cycle</text>
  <text x="434" y="137" font-size="10.5" fill="${C.muted}">No prior fertilisation failure</text>
  <rect x="422" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Unexplained Infertility</text>
  <text x="434" y="185" font-size="10.5" fill="${C.muted}">With normal sperm parameters</text>
  <rect x="422" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Female-Only Infertility</text>
  <text x="434" y="233" font-size="10.5" fill="${C.muted}">PCOS or endometriosis with normal sperm</text>
</svg>`;

// Blog D2-2 (Impact of age & repeated IVF cycles): "7 Strategies to Improve IVF Success"
// Source: Blog node [17]-[24] — 7 unique strategies (deduplicated from a repeated list), stated verbatim
const SVG_IVF_SUCCESS_STRATEGIES_7 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 310" font-family="${FONT}">
  <rect width="800" height="310" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="308.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">7 STRATEGIES TO IMPROVE IVF SUCCESS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="73" r="16" fill="${C.rose}"/>
  <text x="42" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="67" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Healthy Diet</text>
  <text x="67" y="84" font-size="10.5" fill="${C.muted}">Antioxidants, vitamins and minerals from balanced meals</text>
  <rect x="10" y="104" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="133" r="16" fill="${C.rose}"/>
  <text x="42" y="138" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="67" y="127" font-size="11.5" font-weight="700" fill="${C.dark}">Weight Management</text>
  <text x="67" y="144" font-size="10.5" fill="${C.muted}">Under- and over-weight can both affect fertility</text>
  <rect x="10" y="164" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="193" r="16" fill="${C.rose}"/>
  <text x="42" y="198" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="67" y="187" font-size="11.5" font-weight="700" fill="${C.dark}">Avoid Harmful Substances</text>
  <text x="67" y="204" font-size="10.5" fill="${C.muted}">Limit alcohol, quit smoking, avoid drugs</text>
  <rect x="10" y="224" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="253" r="16" fill="${C.rose}"/>
  <text x="42" y="258" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="67" y="247" font-size="11.5" font-weight="700" fill="${C.dark}">Stress Management</text>
  <text x="67" y="264" font-size="10.5" fill="${C.muted}">Yoga, meditation and mindfulness reduce stress</text>
  <rect x="410" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="73" r="16" fill="${C.rose}"/>
  <text x="442" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="467" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Regular Physical Activity</text>
  <text x="467" y="84" font-size="10.5" fill="${C.muted}">Moderate exercise like walking, swimming, yoga</text>
  <rect x="410" y="104" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="133" r="16" fill="${C.rose}"/>
  <text x="442" y="138" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="467" y="127" font-size="11.5" font-weight="700" fill="${C.dark}">Consult a Fertility Specialist</text>
  <text x="467" y="144" font-size="10.5" fill="${C.muted}">Personalized plan; PGT can boost implantation</text>
  <rect x="410" y="164" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="193" r="16" fill="${C.rose}"/>
  <text x="442" y="198" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">7</text>
  <text x="467" y="187" font-size="11.5" font-weight="700" fill="${C.dark}">Mind Cycle Timing</text>
  <text x="467" y="204" font-size="10.5" fill="${C.muted}">Shorter intervals between cycles aid cumulative success</text>
</svg>`;

// Blog D2-3 (Folic acid): "5 Reasons Folic Acid Matters"
// Source: Blog nodes [16] (before conception) and [20],[22],[24] (during pregnancy), stated verbatim
const SVG_FOLIC_ACID_REASONS_5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 250" font-family="${FONT}">
  <rect width="800" height="250" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="248.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 REASONS FOLIC ACID MATTERS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="73" r="16" fill="${C.rose}"/>
  <text x="42" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="67" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Healthy DNA Synthesis</text>
  <text x="67" y="84" font-size="10.5" fill="${C.muted}">Supports cell division from the very first weeks</text>
  <rect x="10" y="104" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="133" r="16" fill="${C.rose}"/>
  <text x="42" y="138" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="67" y="127" font-size="11.5" font-weight="700" fill="${C.dark}">Prevents Neural Tube Defects</text>
  <text x="67" y="144" font-size="10.5" fill="${C.muted}">Critical for brain and spinal cord formation</text>
  <rect x="10" y="164" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="193" r="16" fill="${C.rose}"/>
  <text x="42" y="198" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="67" y="187" font-size="11.5" font-weight="700" fill="${C.dark}">Improved Reproductive Health</text>
  <text x="67" y="204" font-size="10.5" fill="${C.muted}">Supports overall preconception wellness</text>
  <rect x="410" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="73" r="16" fill="${C.rose}"/>
  <text x="442" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="467" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Reduces Risk of Premature Birth</text>
  <text x="467" y="84" font-size="10.5" fill="${C.muted}">Lowers likelihood of early delivery</text>
  <rect x="410" y="104" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="133" r="16" fill="${C.rose}"/>
  <text x="442" y="138" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="467" y="127" font-size="11.5" font-weight="700" fill="${C.dark}">Prevents Low Birth Weight</text>
  <text x="467" y="144" font-size="10.5" fill="${C.muted}">Supports healthy fetal growth</text>
</svg>`;

// Blog D2-4 (IMSI technique): "How IMSI Works: 5 Lab Steps"
// Source: Blog node [12] — 5 lab steps, stated verbatim
const SVG_IMSI_LAB_STEPS_5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 310" font-family="${FONT}">
  <rect width="800" height="310" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="308.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">HOW IMSI WORKS: 5 LAB STEPS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="67" r="14" fill="${C.rose}"/>
  <text x="68" y="71.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="92" y="63" font-size="11.5" font-weight="700" fill="${C.dark}">Semen Preparation</text>
  <text x="92" y="79" font-size="10" fill="${C.muted}">Density gradient or swim-up isolates the best motile sperm</text>
  <rect x="40" y="96" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="119" r="14" fill="${C.rose}"/>
  <text x="68" y="123.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="92" y="115" font-size="11.5" font-weight="700" fill="${C.dark}">High Magnification Screening</text>
  <text x="92" y="131" font-size="10" fill="${C.muted}">Sperm scanned at 6000x under specialized optics</text>
  <rect x="40" y="148" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="171" r="14" fill="${C.rose}"/>
  <text x="68" y="175.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="92" y="167" font-size="11.5" font-weight="700" fill="${C.dark}">Morphological Assessment</text>
  <text x="92" y="183" font-size="10" fill="${C.muted}">Checked for head shape, size, symmetry and vacuoles</text>
  <rect x="40" y="200" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="223" r="14" fill="${C.rose}"/>
  <text x="68" y="227.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="92" y="219" font-size="11.5" font-weight="700" fill="${C.dark}">Selection &amp; Injection</text>
  <text x="92" y="235" font-size="10" fill="${C.muted}">Best morphologically normal sperm injected into the egg</text>
  <rect x="40" y="252" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="275" r="14" fill="${C.rose}"/>
  <text x="68" y="279.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="92" y="271" font-size="11.5" font-weight="700" fill="${C.dark}">Culture &amp; Monitoring</text>
  <text x="92" y="287" font-size="10" fill="${C.muted}">Fertilized eggs tracked through embryo development</text>
</svg>`;

// Blog D2-5 (Egg retrieval process): "The Egg Retrieval Process: 4 Steps"
// Source: Blog nodes [7],[9],[11] — 4-step retrieval sequence, stated verbatim
const SVG_EGG_RETRIEVAL_STEPS_4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 214" font-family="${FONT}">
  <rect width="800" height="214" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="212.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">THE EGG RETRIEVAL PROCESS: 4 STEPS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="166" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="166" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="166" height="12" fill="${C.rose}"/>
  <text x="123" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">1</text>
  <text x="123" y="106" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Preparation</text>
  <text x="123" y="124" text-anchor="middle" font-size="9.5" fill="${C.muted}">Ovarian stimulation</text>
  <text x="123" y="138" text-anchor="middle" font-size="9.5" fill="${C.muted}">medications</text>
  <rect x="216" y="48" width="166" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="216" y="48" width="166" height="36" rx="8" fill="${C.rose}"/>
  <rect x="216" y="72" width="166" height="12" fill="${C.rose}"/>
  <text x="299" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">2</text>
  <text x="299" y="106" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Monitoring</text>
  <text x="299" y="124" text-anchor="middle" font-size="9.5" fill="${C.muted}">Ultrasound and hormone</text>
  <text x="299" y="138" text-anchor="middle" font-size="9.5" fill="${C.muted}">level checks</text>
  <rect x="392" y="48" width="166" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="392" y="48" width="166" height="36" rx="8" fill="${C.rose}"/>
  <rect x="392" y="72" width="166" height="12" fill="${C.rose}"/>
  <text x="475" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">3</text>
  <text x="475" y="106" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Procedure</text>
  <text x="475" y="124" text-anchor="middle" font-size="9.5" fill="${C.muted}">Ultrasound-guided needle</text>
  <text x="475" y="138" text-anchor="middle" font-size="9.5" fill="${C.muted}">under sedation</text>
  <rect x="568" y="48" width="192" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="568" y="48" width="192" height="36" rx="8" fill="${C.rose}"/>
  <rect x="568" y="72" width="192" height="12" fill="${C.rose}"/>
  <text x="664" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">4</text>
  <text x="664" y="106" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Egg Collection</text>
  <text x="664" y="124" text-anchor="middle" font-size="9.5" fill="${C.muted}">Eggs aspirated from</text>
  <text x="664" y="138" text-anchor="middle" font-size="9.5" fill="${C.muted}">follicles into a lab dish</text>
</svg>`;

// ── Wave 35 SVG constants (Draft-blog enrichment continues) ───────────

// Blog D3-1 (Nikol branch inauguration): "Bavishi Fertility Institute: New Branch in Nikol"
// Source: Blog paras [3],[5],[6] — location, facility, care details, stated verbatim
const SVG_NIKOL_BRANCH_INAUGURATION = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 288" font-family="${FONT}">
  <rect width="800" height="288" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="286.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">BAVISHI FERTILITY INSTITUTE: NEW BRANCH IN NIKOL</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="63" font-size="11" font-weight="700" fill="${C.rose}">01</text>
  <text x="68" y="63" font-size="12" font-weight="700" fill="${C.dark}">New Location</text>
  <text x="68" y="81" font-size="10.5" fill="${C.muted}">Nikol, Ahmedabad — bringing world-class fertility care closer to the community</text>
  <rect x="20" y="107" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="107" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="11" font-weight="700" fill="${C.rose}">02</text>
  <text x="68" y="126" font-size="12" font-weight="700" fill="${C.dark}">Advanced Facility</text>
  <text x="68" y="144" font-size="10.5" fill="${C.muted}">State-of-the-art technology and modern amenities for the highest standards of care</text>
  <rect x="20" y="170" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="170" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="189" font-size="11" font-weight="700" fill="${C.rose}">03</text>
  <text x="68" y="189" font-size="12" font-weight="700" fill="${C.dark}">Expert Team</text>
  <text x="68" y="207" font-size="10.5" fill="${C.muted}">Dedicated fertility specialists, embryologists and support staff</text>
  <rect x="20" y="233" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="233" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="252" font-size="11" font-weight="700" fill="${C.rose}">04</text>
  <text x="68" y="252" font-size="12" font-weight="700" fill="${C.dark}">Comprehensive Care</text>
  <text x="68" y="270" font-size="10.5" fill="${C.muted}">Full range of advanced IVF treatments for every stage of the fertility journey</text>
</svg>`;

// Blog D3-2 (Palanpur society talk): "BFI at Palanpur: 4 Key Highlights"
// Source: Blog paras [3],[5],[6] — speakers, session focus, approach, impact, stated verbatim
const SVG_PALANPUR_SOCIETY_TALK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 288" font-family="${FONT}">
  <rect width="800" height="288" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="286.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">BFI AT PALANPUR: 4 KEY HIGHLIGHTS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="63" font-size="11" font-weight="700" fill="${C.rose}">01</text>
  <text x="68" y="63" font-size="12" font-weight="700" fill="${C.dark}">The Event</text>
  <text x="68" y="81" font-size="10.5" fill="${C.muted}">Dr. Himanshu, Dr. Falguni &amp; Dr. Parth Bavishi invited by the Palanpur Ob-Gyn Society</text>
  <rect x="20" y="107" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="107" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="11" font-weight="700" fill="${C.rose}">02</text>
  <text x="68" y="126" font-size="12" font-weight="700" fill="${C.dark}">Session Focus</text>
  <text x="68" y="144" font-size="10.5" fill="${C.muted}">Latest advancements in infertility and IVF treatment</text>
  <rect x="20" y="170" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="170" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="189" font-size="11" font-weight="700" fill="${C.rose}">03</text>
  <text x="68" y="189" font-size="12" font-weight="700" fill="${C.dark}">Patient-Centric Approach</text>
  <text x="68" y="207" font-size="10.5" fill="${C.muted}">Emphasis on personalized care for better treatment outcomes</text>
  <rect x="20" y="233" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="233" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="252" font-size="11" font-weight="700" fill="${C.rose}">04</text>
  <text x="68" y="252" font-size="12" font-weight="700" fill="${C.dark}">Real-World Impact</text>
  <text x="68" y="270" font-size="10.5" fill="${C.muted}">Case studies and success stories shared with attending gynaecologists</text>
</svg>`;

// Blog D3-3 (IVF after age 40): "4 Treatment Strategies for IVF After 40"
// Source: Blog nodes [8]-[11], stated verbatim (50-70% figure is the blog's own stated stat)
const SVG_IVF_AFTER_40_STRATEGIES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 288" font-family="${FONT}">
  <rect width="800" height="288" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="286.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">4 TREATMENT STRATEGIES FOR IVF AFTER 40</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="63" font-size="11" font-weight="700" fill="${C.rose}">01</text>
  <text x="68" y="63" font-size="12" font-weight="700" fill="${C.dark}">Egg Donation</text>
  <text x="68" y="81" font-size="10.5" fill="${C.muted}">Live birth rates of 50–70% using donor eggs from younger women</text>
  <rect x="20" y="107" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="107" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="11" font-weight="700" fill="${C.rose}">02</text>
  <text x="68" y="126" font-size="12" font-weight="700" fill="${C.dark}">PGT (Genetic Testing)</text>
  <text x="68" y="144" font-size="10.5" fill="${C.muted}">Identifies chromosomal abnormalities, improving healthy pregnancy chances</text>
  <rect x="20" y="170" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="170" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="189" font-size="11" font-weight="700" fill="${C.rose}">03</text>
  <text x="68" y="189" font-size="12" font-weight="700" fill="${C.dark}">ICSI</text>
  <text x="68" y="207" font-size="10.5" fill="${C.muted}">Single sperm injection improves fertilization rates</text>
  <rect x="20" y="233" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="233" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="252" font-size="11" font-weight="700" fill="${C.rose}">04</text>
  <text x="68" y="252" font-size="12" font-weight="700" fill="${C.dark}">Blastocyst Transfer</text>
  <text x="68" y="270" font-size="10.5" fill="${C.muted}">Day 5–6 embryo transfer increases implantation rates</text>
</svg>`;

// Blog D3-4 (IVF and career): "Balancing IVF Treatment & Career: 3 Tips"
// Source: Blog node [9] — 3 communication tips, stated verbatim
const SVG_IVF_CAREER_BALANCE_3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">BALANCING IVF TREATMENT &amp; CAREER: 3 TIPS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">1</text>
  <text x="149" y="106" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Open Dialogue</text>
  <text x="149" y="120" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">with Employer</text>
  <text x="149" y="142" text-anchor="middle" font-size="9.5" fill="${C.muted}">Many companies offer</text>
  <text x="149" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">flexible arrangements</text>
  <rect x="291" y="48" width="218" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="291" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="291" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">2</text>
  <text x="400" y="106" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Know Your</text>
  <text x="400" y="120" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Treatment Needs</text>
  <text x="400" y="142" text-anchor="middle" font-size="9.5" fill="${C.muted}">Modern protocols rarely</text>
  <text x="400" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">need extended rest</text>
  <rect x="542" y="48" width="218" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="542" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="542" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">3</text>
  <text x="651" y="106" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Build a Support</text>
  <text x="651" y="120" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Network</text>
  <text x="651" y="142" text-anchor="middle" font-size="9.5" fill="${C.muted}">A trusted colleague can</text>
  <text x="651" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">help navigate scheduling</text>
</svg>`;

// Blog D3-5 (IVF stimulation protocols): "IVF Stimulation Protocols: Long vs Short"
// Source: Blog nodes [9] (Long/Down Regulation) and [11] (Short/Antagonist), stated verbatim
const SVG_STIMULATION_PROTOCOLS_COMPARISON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 278" font-family="${FONT}">
  <rect width="800" height="278" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="276.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <rect x="10" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Long Protocol (Down Regulation)</text>
  <rect x="22" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Duration: 4–6 Weeks</text>
  <text x="34" y="89" font-size="10.5" fill="${C.muted}">GnRH agonist down-regulation then FSH stimulation</text>
  <rect x="22" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Benefit</text>
  <text x="34" y="137" font-size="10.5" fill="${C.muted}">Improved egg quality, increased chances of pregnancy</text>
  <rect x="22" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Best For</text>
  <text x="34" y="185" font-size="10.5" fill="${C.muted}">Normal ovarian reserve, regular menstrual cycles</text>
  <rect x="22" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Medications</text>
  <text x="34" y="233" font-size="10.5" fill="${C.muted}">GnRH agonist, FSH and hCG trigger</text>
  <rect x="410" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">Short Protocol (Antagonist)</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>
  <rect x="422" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Duration: 2–3 Weeks</text>
  <text x="434" y="89" font-size="10.5" fill="${C.muted}">GnRH antagonist prevents premature ovulation</text>
  <rect x="422" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Benefit</text>
  <text x="434" y="137" font-size="10.5" fill="${C.muted}">Reduced OHSS risk, flexible treatment start date</text>
  <rect x="422" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Best For</text>
  <text x="434" y="185" font-size="10.5" fill="${C.muted}">Normal reserve or those at risk of OHSS</text>
  <rect x="422" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Medications</text>
  <text x="434" y="233" font-size="10.5" fill="${C.muted}">GnRH antagonist, FSH and hCG trigger</text>
</svg>`;

// ── Wave 32 SVG constants (FINAL WAVE) ────────────────────────────────

// Blog W32-1 (Male fertility supplements): "4 Key Nutrients for Male Fertility Supplements"
// Source: Blog node [9] — 4 nutrients, stated verbatim
const SVG_MALE_SUPPLEMENT_NUTRIENTS_4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="16" font-weight="700" fill="${C.dark}">4 Key Nutrients for Male Fertility Supplements</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="122" cy="86" r="18" fill="${C.rose}"/>
  <text x="122" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">1</text>
  <text x="122" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">CoQ10</text>
  <text x="122" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Boosts motility and</text>
  <text x="122" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">sperm energy</text>
  <rect x="218" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="300" cy="86" r="18" fill="${C.rose}"/>
  <text x="300" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">2</text>
  <text x="300" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">L-Carnitine</text>
  <text x="300" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Enhances motility</text>
  <text x="300" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">and repro health</text>
  <rect x="396" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="478" cy="86" r="18" fill="${C.rose}"/>
  <text x="478" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">3</text>
  <text x="478" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Zinc &amp; Selenium</text>
  <text x="478" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Support maturation</text>
  <text x="478" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">and DNA integrity</text>
  <rect x="574" y="58" width="186" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="667" cy="86" r="18" fill="${C.rose}"/>
  <text x="667" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">4</text>
  <text x="667" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Folate &amp; Vit C/E</text>
  <text x="667" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Protect sperm from</text>
  <text x="667" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">oxidative damage</text>
</svg>`;

// Blog W32-2 (Thyroid & fertility in women): comparison infographic
// Source: Blog nodes [8]-[9] — hypo vs hyperthyroidism effects, stated verbatim
const SVG_THYROID_FERTILITY_WOMEN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236" font-family="${FONT}">
  <rect width="800" height="236" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="234.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <rect x="10" y="10" width="380" height="216" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Hypothyroidism (Underactive)</text>
  <rect x="22" y="70" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="75.5" font-size="11.5" font-weight="700" fill="${C.dark}">Irregular or Missed Periods</text>
  <text x="34" y="91" font-size="10.5" fill="${C.muted}">Low hormone levels disrupt the cycle</text>
  <rect x="22" y="122" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="127.5" font-size="11.5" font-weight="700" fill="${C.dark}">Anovulation</text>
  <text x="34" y="143" font-size="10.5" fill="${C.muted}">Increased prolactin suppresses egg release</text>
  <rect x="22" y="174" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="179.5" font-size="11.5" font-weight="700" fill="${C.dark}">Reduced Luteal Phase</text>
  <text x="34" y="195" font-size="10.5" fill="${C.muted}">Shorter phase makes implantation difficult</text>
  <rect x="410" y="10" width="380" height="216" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">Hyperthyroidism (Overactive)</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>
  <rect x="422" y="70" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="75.5" font-size="11.5" font-weight="700" fill="${C.dark}">Light or Infrequent Periods</text>
  <text x="434" y="91" font-size="10.5" fill="${C.muted}">Excess hormone alters the cycle</text>
  <rect x="422" y="122" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="127.5" font-size="11.5" font-weight="700" fill="${C.dark}">Poor Egg Quality</text>
  <text x="434" y="143" font-size="10.5" fill="${C.muted}">Increased miscarriage risk</text>
  <rect x="422" y="174" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="179.5" font-size="11.5" font-weight="700" fill="${C.dark}">Altered Cervical Mucus</text>
  <text x="434" y="195" font-size="10.5" fill="${C.muted}">Less receptive to sperm; affects lining too</text>
</svg>`;

// Blog W32-3 (Follicle count & IVF): "Follicle Count & IVF Success"
// Source: Blog node [11] — 3 ranges, stated verbatim
const SVG_FOLLICLE_COUNT_IVF = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 214" font-family="${FONT}">
  <rect width="800" height="214" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="212.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">FOLLICLE COUNT &amp; IVF SUCCESS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">LOW</text>
  <text x="149" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="${C.rose}">&lt;5</text>
  <text x="149" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">Diminished ovarian reserve</text>
  <rect x="291" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="291" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="291" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">MODERATE (IDEAL)</text>
  <text x="400" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="${C.rose}">6–15</text>
  <text x="400" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">Best balance of eggs and safety</text>
  <rect x="542" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="542" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="542" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">HIGH</text>
  <text x="651" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="${C.rose}">&gt;15</text>
  <text x="651" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">Higher OHSS risk</text>
  <text x="400" y="190" text-anchor="middle" font-size="9.5" fill="${C.muted}">Egg quality matters as much as follicle quantity for IVF success</text>
</svg>`;

// Blog W32-4 (Letrozole ovulation & pregnancy): "Letrozole Success Rates"
// Source: Blog node [26] — stated success rates, verbatim
const SVG_LETROZOLE_SUCCESS_RATES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" font-family="${FONT}">
  <rect width="800" height="200" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="198.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">LETROZOLE SUCCESS RATES</text>
  <line x1="60" y1="36" x2="740" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="70" y="48" width="200" height="126" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="170" y="76" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">OVULATION</text>
  <text x="170" y="118" text-anchor="middle" font-size="24" font-weight="800" fill="${C.rose}">60–80%</text>
  <text x="170" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">of women ovulate</text>
  <rect x="300" y="40" width="200" height="134" rx="8" fill="${C.white}" stroke="${C.rose}" stroke-width="1.5"/>
  <text x="400" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">PREGNANCY (PCOS)</text>
  <text x="400" y="112" text-anchor="middle" font-size="26" font-weight="800" fill="${C.rose}">20–27%</text>
  <text x="400" y="134" text-anchor="middle" font-size="10" fill="${C.muted}">per cycle, when ovulating</text>
  <rect x="530" y="48" width="200" height="126" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="630" y="76" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">LIVE BIRTH</text>
  <text x="630" y="118" text-anchor="middle" font-size="20" font-weight="800" fill="${C.rose}">Higher</text>
  <text x="630" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">vs Clomid in PCOS patients</text>
</svg>`;

// Blog W32-5 (Number of eggs & IVF): "Egg Count & IVF Success"
// Source: Blog nodes [12],[16],[19] — 3 ranges, stated verbatim
const SVG_EGG_COUNT_IVF = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 214" font-family="${FONT}">
  <rect width="800" height="214" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="212.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">EGG COUNT &amp; IVF SUCCESS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">TOO FEW</text>
  <text x="149" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="${C.rose}">&lt;5</text>
  <text x="149" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">Limits fertilisation chances</text>
  <rect x="291" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="291" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="291" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">OPTIMAL</text>
  <text x="400" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="${C.rose}">10–15</text>
  <text x="400" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">Best balance of quality and safety</text>
  <rect x="542" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="542" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="542" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">HIGH</text>
  <text x="651" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="${C.rose}">&gt;20</text>
  <text x="651" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">OHSS risk; may need frozen transfer</text>
  <text x="400" y="190" text-anchor="middle" font-size="9.5" fill="${C.muted}">12 high-quality eggs can outperform 25 lower-quality eggs</text>
</svg>`;

// Blog W32-6 (Human fertilization steps): "Human Fertilization: 5 Steps"
// Source: Blog headings [4],[5],[7],[9],[11] — 5 steps, stated verbatim
const SVG_HUMAN_FERTILIZATION_5STEP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">HUMAN FERTILIZATION: 5 STEPS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">1</text>
  <text x="108" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Ovulation</text>
  <text x="108" y="118" text-anchor="middle" font-size="9" fill="${C.muted}">Egg released</text>
  <text x="108" y="131" text-anchor="middle" font-size="9" fill="${C.muted}">around day 14</text>
  <rect x="186" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">2</text>
  <text x="254" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Sperm</text>
  <text x="254" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Production</text>
  <text x="254" y="133" text-anchor="middle" font-size="9" fill="${C.muted}">Mature in epididymis</text>
  <rect x="332" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">3</text>
  <text x="400" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Fertilization</text>
  <text x="400" y="118" text-anchor="middle" font-size="9" fill="${C.muted}">Sperm fuses</text>
  <text x="400" y="131" text-anchor="middle" font-size="9" fill="${C.muted}">with the egg</text>
  <rect x="478" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">4</text>
  <text x="546" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Zygote</text>
  <text x="546" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Formation</text>
  <text x="546" y="133" text-anchor="middle" font-size="9" fill="${C.muted}">Cells begin dividing</text>
  <rect x="624" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">5</text>
  <text x="692" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Implantation</text>
  <text x="692" y="118" text-anchor="middle" font-size="9" fill="${C.muted}">Into the uterine</text>
  <text x="692" y="131" text-anchor="middle" font-size="9" fill="${C.muted}">lining</text>
</svg>`;

// Blog W32-7 (How Letrozole works — comprehensive guide): "How Letrozole Triggers Ovulation: 4 Steps"
// Source: Blog node [10] — 4-step mechanism, stated verbatim
const SVG_LETROZOLE_MECHANISM_4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 246" font-family="${FONT}">
  <rect width="800" height="246" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="244.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">HOW LETROZOLE TRIGGERS OVULATION: 4 STEPS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="72" font-size="14" font-weight="700" fill="${C.rose}">1</text>
  <text x="60" y="63" font-size="12" font-weight="700" fill="${C.dark}">Reduces Estrogen</text>
  <text x="60" y="79" font-size="10.5" fill="${C.muted}">Blocks the aromatase enzyme, lowering circulating estrogen</text>
  <rect x="20" y="98" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="98" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="14" font-weight="700" fill="${C.rose}">2</text>
  <text x="60" y="117" font-size="12" font-weight="700" fill="${C.dark}">Increases FSH &amp; LH</text>
  <text x="60" y="133" font-size="10.5" fill="${C.muted}">Pituitary responds to lower estrogen with more hormone</text>
  <rect x="20" y="152" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="152" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="180" font-size="14" font-weight="700" fill="${C.rose}">3</text>
  <text x="60" y="171" font-size="12" font-weight="700" fill="${C.dark}">Follicle Development</text>
  <text x="60" y="187" font-size="10.5" fill="${C.muted}">Higher FSH stimulates ovarian follicle growth</text>
  <rect x="20" y="206" width="760" height="30" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="206" width="8" height="30" rx="3" fill="${C.rose}"/>
  <text x="38" y="226" font-size="14" font-weight="700" fill="${C.rose}">4</text>
  <text x="60" y="225" font-size="12" font-weight="700" fill="${C.dark}">Triggers Ovulation — a mature egg is released from the ovary</text>
</svg>`;

// ── Wave 31 SVG constants ─────────────────────────────────────────────

// Blog W31-1 (Frozen vs Fresh embryo transfer): comparison infographic
// Source: Blog nodes [13],[18],[27] — advantages of each, stated verbatim
const SVG_FROZEN_VS_FRESH_TRANSFER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236" font-family="${FONT}">
  <rect width="800" height="236" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="234.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <rect x="10" y="10" width="380" height="216" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Frozen Embryo Transfer (FET)</text>
  <rect x="22" y="70" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="75.5" font-size="11.5" font-weight="700" fill="${C.dark}">Often Higher Success Rates</text>
  <text x="34" y="91" font-size="10.5" fill="${C.muted}">Body recovers; uterine lining can be optimised</text>
  <rect x="22" y="122" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="127.5" font-size="11.5" font-weight="700" fill="${C.dark}">Reduced OHSS Risk</text>
  <text x="34" y="143" font-size="10.5" fill="${C.muted}">Avoids the hormonal peak right after stimulation</text>
  <rect x="22" y="174" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="179.5" font-size="11.5" font-weight="700" fill="${C.dark}">Allows PGT-A Testing</text>
  <text x="34" y="195" font-size="10.5" fill="${C.muted}">99%+ embryo survival with modern vitrification</text>
  <rect x="410" y="10" width="380" height="216" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">Fresh Embryo Transfer</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>
  <rect x="422" y="70" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="75.5" font-size="11.5" font-weight="700" fill="${C.dark}">Suits Normal Hormone Levels</text>
  <text x="434" y="91" font-size="10.5" fill="${C.muted}">Best when stimulation response is balanced</text>
  <rect x="422" y="122" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="127.5" font-size="11.5" font-weight="700" fill="${C.dark}">Good for Younger Responders</text>
  <text x="434" y="143" font-size="10.5" fill="${C.muted}">Works well without needing genetic testing</text>
  <rect x="422" y="174" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="179.5" font-size="11.5" font-weight="700" fill="${C.dark}">Shorter Overall Timeline</text>
  <text x="434" y="195" font-size="10.5" fill="${C.muted}">No freezing wait or extra storage cost</text>
</svg>`;

// Blog W31-2 (Government vs Private IVF): comparison infographic
// Source: Blog comparison table rows [7]-[22] — stated verbatim
const SVG_GOVT_VS_PRIVATE_IVF = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236" font-family="${FONT}">
  <rect width="800" height="236" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="234.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <rect x="10" y="10" width="380" height="216" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Private IVF Centres</text>
  <rect x="22" y="70" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="75.5" font-size="11.5" font-weight="700" fill="${C.dark}">Higher Cost, EMI Options</text>
  <text x="34" y="91" font-size="10.5" fill="${C.muted}">Transparent billing with flexible payment plans</text>
  <rect x="22" y="122" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="127.5" font-size="11.5" font-weight="700" fill="${C.dark}">Tailored Care</text>
  <text x="34" y="143" font-size="10.5" fill="${C.muted}">One-on-one counselling and personalised protocols</text>
  <rect x="22" y="174" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="179.5" font-size="11.5" font-weight="700" fill="${C.dark}">Higher Success Rates</text>
  <text x="34" y="195" font-size="10.5" fill="${C.muted}">Skilled experts and modern technology</text>
  <rect x="410" y="10" width="380" height="216" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">Government IVF Centres</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>
  <rect x="422" y="70" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="75.5" font-size="11.5" font-weight="700" fill="${C.dark}">Low-Cost or Subsidised</text>
  <text x="434" y="91" font-size="10.5" fill="${C.muted}">Supported by government health schemes</text>
  <rect x="422" y="122" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="127.5" font-size="11.5" font-weight="700" fill="${C.dark}">General Approach</text>
  <text x="434" y="143" font-size="10.5" fill="${C.muted}">Less individualised attention due to patient volume</text>
  <rect x="422" y="174" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="179.5" font-size="11.5" font-weight="700" fill="${C.dark}">Standard Success Rates</text>
  <text x="434" y="195" font-size="10.5" fill="${C.muted}">Part-time fertility specialists, simpler cases</text>
</svg>`;

// Blog W31-3 (Age & fertility myths): "4 Fertility Age Myths — Busted"
// Source: Blog headings [4]-[16] — myth/fact pairs 1-4, stated verbatim
const SVG_FERTILITY_AGE_MYTHS_4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 260" font-family="${FONT}">
  <rect width="800" height="260" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">4 Fertility Age Myths — Busted</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="58" width="164" height="186" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="122" cy="82" r="16" fill="${C.rose}"/>
  <text x="122" y="87" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">1</text>
  <text x="122" y="112" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.rose}">MYTH</text>
  <text x="122" y="128" text-anchor="middle" font-size="10" font-weight="600" fill="${C.dark}">Fertile until</text>
  <text x="122" y="141" text-anchor="middle" font-size="10" font-weight="600" fill="${C.dark}">menopause</text>
  <text x="122" y="160" text-anchor="middle" font-size="9" fill="${C.muted}">FACT: Declines</text>
  <text x="122" y="172" text-anchor="middle" font-size="9" fill="${C.muted}">sharply after 35</text>
  <rect x="218" y="58" width="164" height="186" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="300" cy="82" r="16" fill="${C.rose}"/>
  <text x="300" y="87" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">2</text>
  <text x="300" y="112" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.rose}">MYTH</text>
  <text x="300" y="128" text-anchor="middle" font-size="10" font-weight="600" fill="${C.dark}">Male fertility</text>
  <text x="300" y="141" text-anchor="middle" font-size="10" font-weight="600" fill="${C.dark}">unaffected</text>
  <text x="300" y="160" text-anchor="middle" font-size="9" fill="${C.muted}">FACT: Sperm quality</text>
  <text x="300" y="172" text-anchor="middle" font-size="9" fill="${C.muted}">declines with age</text>
  <rect x="396" y="58" width="164" height="186" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="478" cy="82" r="16" fill="${C.rose}"/>
  <text x="478" y="87" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">3</text>
  <text x="478" y="112" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.rose}">MYTH</text>
  <text x="478" y="128" text-anchor="middle" font-size="10" font-weight="600" fill="${C.dark}">IVF overcomes</text>
  <text x="478" y="141" text-anchor="middle" font-size="10" font-weight="600" fill="${C.dark}">age decline</text>
  <text x="478" y="160" text-anchor="middle" font-size="9" fill="${C.muted}">FACT: IVF success</text>
  <text x="478" y="172" text-anchor="middle" font-size="9" fill="${C.muted}">also drops with age</text>
  <rect x="574" y="58" width="186" height="186" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="667" cy="82" r="16" fill="${C.rose}"/>
  <text x="667" y="87" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">4</text>
  <text x="667" y="112" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.rose}">MYTH</text>
  <text x="667" y="128" text-anchor="middle" font-size="10" font-weight="600" fill="${C.dark}">Egg freezing</text>
  <text x="667" y="141" text-anchor="middle" font-size="10" font-weight="600" fill="${C.dark}">guarantees pregnancy</text>
  <text x="667" y="160" text-anchor="middle" font-size="9" fill="${C.muted}">FACT: Improves odds,</text>
  <text x="667" y="172" text-anchor="middle" font-size="9" fill="${C.muted}">doesn't guarantee</text>
</svg>`;

// Blog W31-4 (IVF vs Surrogacy — actual body content of this slug): comparison infographic
// Source: Blog node [22]-[25] — key differences, stated verbatim
const SVG_IVF_VS_SURROGACY_KEY_DIFF = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236" font-family="${FONT}">
  <rect width="800" height="236" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="234.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <rect x="10" y="10" width="380" height="216" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">In Vitro Fertilisation (IVF)</text>
  <rect x="22" y="70" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="75.5" font-size="11.5" font-weight="700" fill="${C.dark}">Intended Mother Carries</text>
  <text x="34" y="91" font-size="10.5" fill="${C.muted}">Suits women who can carry but struggle to conceive</text>
  <rect x="22" y="122" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="127.5" font-size="11.5" font-weight="700" fill="${C.dark}">Biological Connection</text>
  <text x="34" y="143" font-size="10.5" fill="${C.muted}">Both parents can be genetically linked to the baby</text>
  <rect x="22" y="174" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="179.5" font-size="11.5" font-weight="700" fill="${C.dark}">Simpler Legal Process</text>
  <text x="34" y="195" font-size="10.5" fill="${C.muted}">No surrogacy contracts or court procedures needed</text>
  <rect x="410" y="10" width="380" height="216" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">Surrogacy</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>
  <rect x="422" y="70" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="75.5" font-size="11.5" font-weight="700" fill="${C.dark}">Another Woman Carries</text>
  <text x="434" y="91" font-size="10.5" fill="${C.muted}">For those unable to safely carry a pregnancy</text>
  <rect x="422" y="122" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="127.5" font-size="11.5" font-weight="700" fill="${C.dark}">Genetic Link Still Possible</text>
  <text x="434" y="143" font-size="10.5" fill="${C.muted}">In gestational surrogacy, own eggs and sperm can be used</text>
  <rect x="422" y="174" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="179.5" font-size="11.5" font-weight="700" fill="${C.dark}">Requires Legal Contracts</text>
  <text x="434" y="195" font-size="10.5" fill="${C.muted}">Formal agreements and compliance with national laws</text>
</svg>`;

// Blog W31-5 (Increase AMH levels): "7 Ways to Support AMH & Ovarian Health"
// Source: Blog node [15] — 7 strategies, stated verbatim
const SVG_AMH_SUPPORT_STRATEGIES_7 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 278" font-family="${FONT}">
  <rect width="800" height="278" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="276.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">7 WAYS TO SUPPORT AMH &amp; OVARIAN HEALTH</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="52" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="79" r="14" fill="${C.rose}"/>
  <text x="64" y="83.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="86" y="74" font-size="11" font-weight="700" fill="${C.dark}">Fertility-Friendly Diet</text>
  <text x="86" y="90" font-size="9.5" fill="${C.muted}">Healthy fats, antioxidants, CoQ10</text>
  <rect x="40" y="112" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="139" r="14" fill="${C.rose}"/>
  <text x="64" y="143.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="86" y="134" font-size="11" font-weight="700" fill="${C.dark}">Supplements (Supervised)</text>
  <text x="86" y="150" font-size="9.5" fill="${C.muted}">DHEA, CoQ10, Vitamin D</text>
  <rect x="40" y="172" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="199" r="14" fill="${C.rose}"/>
  <text x="64" y="203.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="86" y="194" font-size="11" font-weight="700" fill="${C.dark}">Reduce Stress &amp; Sleep Well</text>
  <text x="86" y="210" font-size="9.5" fill="${C.muted}">7–8 hours nightly, yoga, meditation</text>
  <rect x="40" y="232" width="355" height="30" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="247" r="14" fill="${C.rose}"/>
  <text x="64" y="251.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="86" y="252" font-size="11" font-weight="700" fill="${C.dark}">Quit Smoking &amp; Limit Toxins</text>
  <rect x="405" y="52" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="79" r="14" fill="${C.rose}"/>
  <text x="429" y="83.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="451" y="74" font-size="11" font-weight="700" fill="${C.dark}">Ovarian PRP Therapy</text>
  <text x="451" y="90" font-size="9.5" fill="${C.muted}">Stimulates follicle growth</text>
  <rect x="405" y="112" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="139" r="14" fill="${C.rose}"/>
  <text x="429" y="143.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="451" y="134" font-size="11" font-weight="700" fill="${C.dark}">Fertility Preservation</text>
  <text x="451" y="150" font-size="9.5" fill="${C.muted}">Egg or embryo freezing</text>
  <rect x="405" y="172" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="199" r="14" fill="${C.rose}"/>
  <text x="429" y="203.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">7</text>
  <text x="451" y="194" font-size="11" font-weight="700" fill="${C.dark}">Customised IVF Protocols</text>
  <text x="451" y="210" font-size="9.5" fill="${C.muted}">Tailored to AMH, age and history</text>
</svg>`;

// ── Wave 30 SVG constants ─────────────────────────────────────────────

// Blog W30-1 (Post-embryo-transfer precautions): "6 Key Precautions After Embryo Transfer"
// Source: Blog node [4] + headings [5],[11],[17],[22],[27] — top 6 of 12, stated verbatim
const SVG_EMBRYO_TRANSFER_PRECAUTIONS_6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 244" font-family="${FONT}">
  <rect width="800" height="244" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="242.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">6 KEY PRECAUTIONS AFTER EMBRYO TRANSFER</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="73" r="16" fill="${C.rose}"/>
  <text x="42" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="67" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Avoid Complete Bed Rest</text>
  <text x="67" y="84" font-size="10.5" fill="${C.muted}">Light activity supports circulation and uterine health</text>
  <rect x="410" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="73" r="16" fill="${C.rose}"/>
  <text x="442" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="467" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Maintain a Balanced Diet</text>
  <text x="467" y="84" font-size="10.5" fill="${C.muted}">Protein, fibre, folic acid, and 8–10 glasses of water daily</text>
  <rect x="10" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="139" r="16" fill="${C.rose}"/>
  <text x="42" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="67" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Monitor Stress Levels</text>
  <text x="67" y="150" font-size="10.5" fill="${C.muted}">Relaxation supports hormonal balance during implantation</text>
  <rect x="410" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="139" r="16" fill="${C.rose}"/>
  <text x="442" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="467" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Avoid High Temperatures</text>
  <text x="467" y="150" font-size="10.5" fill="${C.muted}">No hot baths, saunas or prolonged sun exposure</text>
  <rect x="10" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="205" r="16" fill="${C.rose}"/>
  <text x="42" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="67" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Follow Medication Guidelines</text>
  <text x="67" y="216" font-size="10.5" fill="${C.muted}">Progesterone and hormone support exactly as prescribed</text>
  <rect x="410" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="205" r="16" fill="${C.rose}"/>
  <text x="442" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="467" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Avoid Harmful Substances</text>
  <text x="467" y="216" font-size="10.5" fill="${C.muted}">No smoking, alcohol or environmental toxins</text>
</svg>`;

// Blog W30-2 (Male infertility tests): "6 Essential Tests for Male Infertility"
// Source: Blog node [4] + headings [5],[15],[23],[30],[36],[42] — 6 tests, stated verbatim
const SVG_MALE_INFERTILITY_TESTS_6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 244" font-family="${FONT}">
  <rect width="800" height="244" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="242.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">6 ESSENTIAL TESTS FOR MALE INFERTILITY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="73" r="16" fill="${C.rose}"/>
  <text x="42" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="67" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Semen Analysis</text>
  <text x="67" y="84" font-size="10.5" fill="${C.muted}">Measures sperm count, motility and morphology</text>
  <rect x="410" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="73" r="16" fill="${C.rose}"/>
  <text x="442" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="467" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Physical Examination</text>
  <text x="467" y="84" font-size="10.5" fill="${C.muted}">Checks testes, varicocele, vas and epididymis</text>
  <rect x="10" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="139" r="16" fill="${C.rose}"/>
  <text x="42" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="67" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Hormone Testing</text>
  <text x="67" y="150" font-size="10.5" fill="${C.muted}">Testosterone, LH, FSH, prolactin and estradiol levels</text>
  <rect x="410" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="139" r="16" fill="${C.rose}"/>
  <text x="442" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="467" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Ultrasound Examination</text>
  <text x="467" y="150" font-size="10.5" fill="${C.muted}">Detects varicocele, atrophy and blockages</text>
  <rect x="10" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="205" r="16" fill="${C.rose}"/>
  <text x="42" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="67" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Genetic Testing</text>
  <text x="67" y="216" font-size="10.5" fill="${C.muted}">Checks Y-chromosome deletions, Klinefelter syndrome</text>
  <rect x="410" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="205" r="16" fill="${C.rose}"/>
  <text x="442" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="467" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Sperm DNA Fragmentation</text>
  <text x="467" y="216" font-size="10.5" fill="${C.muted}">Assesses DNA integrity for embryo and IVF success</text>
</svg>`;

// Blog W30-3 (Fibroids & diet): "6 Foods That May Help Manage Fibroid Symptoms"
// Source: Blog node [9] — top 6 of 10 beneficial foods, stated verbatim
const SVG_FIBROID_DIET_FOODS_6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 244" font-family="${FONT}">
  <rect width="800" height="244" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="242.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">6 FOODS THAT MAY HELP MANAGE FIBROID SYMPTOMS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="73" r="16" fill="${C.rose}"/>
  <text x="42" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="67" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Leafy Greens</text>
  <text x="67" y="84" font-size="10.5" fill="${C.muted}">Antioxidants support hormone regulation</text>
  <rect x="410" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="73" r="16" fill="${C.rose}"/>
  <text x="442" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="467" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Cruciferous Vegetables</text>
  <text x="467" y="84" font-size="10.5" fill="${C.muted}">May help reduce estrogen levels</text>
  <rect x="10" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="139" r="16" fill="${C.rose}"/>
  <text x="42" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="67" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Berries</text>
  <text x="67" y="150" font-size="10.5" fill="${C.muted}">Antioxidants reduce inflammation and oxidative stress</text>
  <rect x="410" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="139" r="16" fill="${C.rose}"/>
  <text x="442" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="467" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Fatty Fish</text>
  <text x="467" y="150" font-size="10.5" fill="${C.muted}">Omega-3s promote hormone balance</text>
  <rect x="10" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="205" r="16" fill="${C.rose}"/>
  <text x="42" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="67" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Whole Grains</text>
  <text x="67" y="216" font-size="10.5" fill="${C.muted}">Regulate blood sugar and insulin levels</text>
  <rect x="410" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="205" r="16" fill="${C.rose}"/>
  <text x="442" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="467" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Turmeric</text>
  <text x="467" y="216" font-size="10.5" fill="${C.muted}">Curcumin may help reduce inflammation</text>
</svg>`;

// Blog W30-4 (Fibroids in young women): "4 Types of Fibroids in Young Women"
// Source: Blog nodes [8]-[11] — 4 types, stated verbatim
const SVG_YOUNG_WOMEN_FIBROID_TYPES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="16" font-weight="700" fill="${C.dark}">4 Types of Fibroids in Young Women</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="122" cy="86" r="18" fill="${C.rose}"/>
  <text x="122" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">1</text>
  <text x="122" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Submucosal</text>
  <text x="122" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Under the lining;</text>
  <text x="122" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">affects fertility</text>
  <rect x="218" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="300" cy="86" r="18" fill="${C.rose}"/>
  <text x="300" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">2</text>
  <text x="300" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Intramural</text>
  <text x="300" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Muscular wall;</text>
  <text x="300" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">heavy periods</text>
  <rect x="396" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="478" cy="86" r="18" fill="${C.rose}"/>
  <text x="478" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">3</text>
  <text x="478" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Subserosal</text>
  <text x="478" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Outer surface;</text>
  <text x="478" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">presses on organs</text>
  <rect x="574" y="58" width="186" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="667" cy="86" r="18" fill="${C.rose}"/>
  <text x="667" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">4</text>
  <text x="667" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Pedunculated</text>
  <text x="667" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Attached by a stalk;</text>
  <text x="667" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">pain if it twists</text>
</svg>`;

// Blog W30-5 (Foods to avoid during pregnancy): "6 Foods to Avoid During Pregnancy"
// Source: Blog headings [5],[9],[14],[18],[22],[35] — top 6 of 10, stated verbatim
const SVG_PREGNANCY_FOODS_AVOID_6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 244" font-family="${FONT}">
  <rect width="800" height="244" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="242.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">6 FOODS TO AVOID DURING PREGNANCY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="73" r="16" fill="${C.rose}"/>
  <text x="42" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="67" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Raw or Undercooked Seafood</text>
  <text x="67" y="84" font-size="10.5" fill="${C.muted}">Risk of Listeria, Salmonella or Vibrio infection</text>
  <rect x="410" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="73" r="16" fill="${C.rose}"/>
  <text x="442" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="467" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Raw or Undercooked Meat</text>
  <text x="467" y="84" font-size="10.5" fill="${C.muted}">Toxoplasma gondii risk to baby's development</text>
  <rect x="10" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="139" r="16" fill="${C.rose}"/>
  <text x="42" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="67" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Unpasteurized Dairy</text>
  <text x="67" y="150" font-size="10.5" fill="${C.muted}">Listeria risk from soft cheeses</text>
  <rect x="410" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="139" r="16" fill="${C.rose}"/>
  <text x="442" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="467" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Raw or Undercooked Eggs</text>
  <text x="467" y="150" font-size="10.5" fill="${C.muted}">Salmonella risk from runny yolks</text>
  <rect x="10" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="205" r="16" fill="${C.rose}"/>
  <text x="42" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="67" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">High-Mercury Fish</text>
  <text x="67" y="216" font-size="10.5" fill="${C.muted}">Shark, swordfish can affect baby's brain</text>
  <rect x="410" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="205" r="16" fill="${C.rose}"/>
  <text x="442" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="467" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Alcohol</text>
  <text x="467" y="216" font-size="10.5" fill="${C.muted}">No level of alcohol is considered safe</text>
</svg>`;

// ── Wave 29 SVG constants ─────────────────────────────────────────────

// Blog W29-1 (Embryo transfer procedure): "Embryo Transfer: 5-Step Procedure"
// Source: Blog headings [17],[20],[23],[25],[27] — 5 steps, stated verbatim
const SVG_EMBRYO_TRANSFER_5STEP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 288" font-family="${FONT}">
  <rect width="800" height="288" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="286.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">EMBRYO TRANSFER: 5-STEP PROCEDURE</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="44" rx="3" fill="${C.rose}"/>
  <text x="38" y="70" font-size="13" font-weight="700" fill="${C.rose}">1</text>
  <text x="60" y="62" font-size="11.5" font-weight="700" fill="${C.dark}">Endometrial Preparation</text>
  <text x="60" y="78" font-size="10" fill="${C.muted}">Hormonal support; lining thickness monitored at 7–12mm</text>
  <rect x="20" y="94" width="760" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="94" width="8" height="44" rx="3" fill="${C.rose}"/>
  <text x="38" y="120" font-size="13" font-weight="700" fill="${C.rose}">2</text>
  <text x="60" y="112" font-size="11.5" font-weight="700" fill="${C.dark}">Embryo Selection</text>
  <text x="60" y="128" font-size="10" fill="${C.muted}">Morphological grading; PGT if indicated</text>
  <rect x="20" y="144" width="760" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="144" width="8" height="44" rx="3" fill="${C.rose}"/>
  <text x="38" y="170" font-size="13" font-weight="700" fill="${C.rose}">3</text>
  <text x="60" y="162" font-size="11.5" font-weight="700" fill="${C.dark}">Embryo Thawing (FET cycles)</text>
  <text x="60" y="178" font-size="10" fill="${C.muted}">Precise warming protocol to maintain viability</text>
  <rect x="20" y="194" width="760" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="194" width="8" height="44" rx="3" fill="${C.rose}"/>
  <text x="38" y="220" font-size="13" font-weight="700" fill="${C.rose}">4</text>
  <text x="60" y="212" font-size="11.5" font-weight="700" fill="${C.dark}">The Transfer</text>
  <text x="60" y="228" font-size="10" fill="${C.muted}">10–15 minutes via soft catheter; usually painless</text>
  <rect x="20" y="244" width="760" height="30" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="244" width="8" height="30" rx="3" fill="${C.rose}"/>
  <text x="38" y="264" font-size="13" font-weight="700" fill="${C.rose}">5</text>
  <text x="60" y="263" font-size="11.5" font-weight="700" fill="${C.dark}">Post-Transfer Rest — 15–30 minutes, no strict bed rest</text>
</svg>`;

// Blog W29-2 (Nikol women in medicine event): "5 Modern Fertility Techniques Discussed"
// Source: Blog node [7] — 5 techniques listed verbatim
const SVG_NIKOL_FERTILITY_TECHNIQUES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 MODERN FERTILITY TECHNIQUES DISCUSSED</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">01</text>
  <text x="108" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">PGT</text>
  <text x="108" y="118" text-anchor="middle" font-size="9" fill="${C.muted}">Preimplantation</text>
  <text x="108" y="131" text-anchor="middle" font-size="9" fill="${C.muted}">Genetic Testing</text>
  <rect x="186" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">02</text>
  <text x="254" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">ERA</text>
  <text x="254" y="118" text-anchor="middle" font-size="9" fill="${C.muted}">Endometrial</text>
  <text x="254" y="131" text-anchor="middle" font-size="9" fill="${C.muted}">Receptivity Array</text>
  <rect x="332" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">03</text>
  <text x="400" y="100" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.dark}">Advanced</text>
  <text x="400" y="118" text-anchor="middle" font-size="9" fill="${C.muted}">Stimulation</text>
  <text x="400" y="131" text-anchor="middle" font-size="9" fill="${C.muted}">Protocols</text>
  <rect x="478" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">04</text>
  <text x="546" y="100" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.dark}">Egg &amp; Embryo</text>
  <text x="546" y="118" text-anchor="middle" font-size="9" fill="${C.muted}">Freezing for</text>
  <text x="546" y="131" text-anchor="middle" font-size="9" fill="${C.muted}">preservation</text>
  <rect x="624" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">05</text>
  <text x="692" y="100" text-anchor="middle" font-size="9.5" font-weight="700" fill="${C.dark}">Male Infertility</text>
  <text x="692" y="118" text-anchor="middle" font-size="9" fill="${C.muted}">Sperm retrieval,</text>
  <text x="692" y="131" text-anchor="middle" font-size="9" fill="${C.muted}">PRP treatments</text>
</svg>`;

// Blog W29-3 (Endometrial thickness): "4 Signs of Abnormal Endometrial Thickness"
// Source: Blog node [12] — 4 symptoms, stated verbatim
const SVG_ENDOMETRIAL_THICKNESS_SIGNS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="16" font-weight="700" fill="${C.dark}">4 Signs of Abnormal Endometrial Thickness</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="122" cy="86" r="18" fill="${C.rose}"/>
  <text x="122" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">1</text>
  <text x="122" y="120" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Heavy Menstrual</text>
  <text x="122" y="135" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Bleeding</text>
  <rect x="218" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="300" cy="86" r="18" fill="${C.rose}"/>
  <text x="300" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">2</text>
  <text x="300" y="120" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Spotting Between</text>
  <text x="300" y="135" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Periods</text>
  <rect x="396" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="478" cy="86" r="18" fill="${C.rose}"/>
  <text x="478" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">3</text>
  <text x="478" y="120" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Difficulty</text>
  <text x="478" y="135" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Conceiving</text>
  <rect x="574" y="58" width="186" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="667" cy="86" r="18" fill="${C.rose}"/>
  <text x="667" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">4</text>
  <text x="667" y="120" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Repeated Implantation</text>
  <text x="667" y="135" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Failure (IVF)</text>
</svg>`;

// Blog W29-4 (Uterine fibroids): "4 Types of Uterine Fibroids"
// Source: Blog node [7] — 4 types, stated verbatim
const SVG_UTERINE_FIBROID_TYPES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">4 Types of Uterine Fibroids</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="122" cy="86" r="18" fill="${C.rose}"/>
  <text x="122" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">1</text>
  <text x="122" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Intramural</text>
  <text x="122" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Within the muscular</text>
  <text x="122" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">wall; most common</text>
  <rect x="218" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="300" cy="86" r="18" fill="${C.rose}"/>
  <text x="300" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">2</text>
  <text x="300" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Submucosal</text>
  <text x="300" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Under the lining;</text>
  <text x="300" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">often heavy bleeding</text>
  <rect x="396" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="478" cy="86" r="18" fill="${C.rose}"/>
  <text x="478" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">3</text>
  <text x="478" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Subserosal</text>
  <text x="478" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Outer uterine wall;</text>
  <text x="478" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">may press on organs</text>
  <rect x="574" y="58" width="186" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="667" cy="86" r="18" fill="${C.rose}"/>
  <text x="667" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">4</text>
  <text x="667" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Pedunculated</text>
  <text x="667" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Attached by a stalk;</text>
  <text x="667" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">inside or outside</text>
</svg>`;

// Blog W29-5 (Endometriosis & IVF): "IVF Process for Endometriosis: 4 Steps"
// Source: Blog nodes [11]-[14] — 4 steps, stated verbatim
const SVG_ENDOMETRIOSIS_IVF_STEPS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 246" font-family="${FONT}">
  <rect width="800" height="246" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="244.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">IVF PROCESS FOR ENDOMETRIOSIS: 4 STEPS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="72" font-size="14" font-weight="700" fill="${C.rose}">1</text>
  <text x="60" y="63" font-size="12" font-weight="700" fill="${C.dark}">Initial Consultation &amp; Diagnosis</text>
  <text x="60" y="79" font-size="10.5" fill="${C.muted}">Medical history review, ultrasounds or MRI to assess severity</text>
  <rect x="20" y="98" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="98" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="14" font-weight="700" fill="${C.rose}">2</text>
  <text x="60" y="117" font-size="12" font-weight="700" fill="${C.dark}">Ovarian Stimulation</text>
  <text x="60" y="133" font-size="10.5" fill="${C.muted}">Tailored protocols monitored via blood tests and ultrasounds</text>
  <rect x="20" y="152" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="152" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="180" font-size="14" font-weight="700" fill="${C.rose}">3</text>
  <text x="60" y="171" font-size="12" font-weight="700" fill="${C.dark}">Egg Retrieval &amp; Fertilization</text>
  <text x="60" y="187" font-size="10.5" fill="${C.muted}">ICSI often recommended to enhance fertilization success</text>
  <rect x="20" y="206" width="760" height="30" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="206" width="8" height="30" rx="3" fill="${C.rose}"/>
  <text x="38" y="226" font-size="14" font-weight="700" fill="${C.rose}">4</text>
  <text x="60" y="225" font-size="12" font-weight="700" fill="${C.dark}">Embryo Transfer — carefully timed for optimal implantation</text>
</svg>`;

// ── Wave 28 SVG constants ─────────────────────────────────────────────

// Blog W28-1 (Twin pregnancy risks): "5 Common Risks in Twin Pregnancy"
// Source: Blog headings [15],[21],[25],[29],[33] + node [16] — 5 risks, one real stat
const SVG_TWIN_PREGNANCY_RISKS_5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 COMMON RISKS IN TWIN PREGNANCY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">01</text>
  <text x="108" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Preterm</text>
  <text x="108" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Labour</text>
  <text x="108" y="132" text-anchor="middle" font-size="9" fill="${C.muted}">50%+ born before</text>
  <text x="108" y="145" text-anchor="middle" font-size="9" fill="${C.muted}">37 weeks</text>
  <rect x="186" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">02</text>
  <text x="254" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Low Birth</text>
  <text x="254" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Weight</text>
  <text x="254" y="132" text-anchor="middle" font-size="9" fill="${C.muted}">Shared uterine</text>
  <text x="254" y="145" text-anchor="middle" font-size="9" fill="${C.muted}">space</text>
  <rect x="332" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">03</text>
  <text x="400" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Hypertension</text>
  <text x="400" y="132" text-anchor="middle" font-size="9" fill="${C.muted}">Higher preeclampsia</text>
  <text x="400" y="145" text-anchor="middle" font-size="9" fill="${C.muted}">risk</text>
  <rect x="478" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">04</text>
  <text x="546" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Gestational</text>
  <text x="546" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Diabetes</text>
  <text x="546" y="132" text-anchor="middle" font-size="9" fill="${C.muted}">Pronounced hormone</text>
  <text x="546" y="145" text-anchor="middle" font-size="9" fill="${C.muted}">shifts</text>
  <rect x="624" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">05</text>
  <text x="692" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">TTTS</text>
  <text x="692" y="132" text-anchor="middle" font-size="9" fill="${C.muted}">Uneven blood flow</text>
  <text x="692" y="145" text-anchor="middle" font-size="9" fill="${C.muted}">(monochorionic)</text>
</svg>`;

// Blog W28-2 (IVF stimulation dos/donts): "IVF Stimulation: Key Do's and Don'ts"
// Source: Blog nodes [6],[9],[13],[16] + [29],[32],[35],[41] — top 4 each, stated verbatim
const SVG_IVF_STIMULATION_DOS_DONTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 278" font-family="${FONT}">
  <rect width="800" height="278" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="276.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <rect x="10" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Do's During IVF Stimulation</text>
  <rect x="22" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Follow Medication Schedule</text>
  <text x="34" y="89" font-size="10.5" fill="${C.muted}">Right time, right dosage for optimal response</text>
  <rect x="22" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Eat a Balanced Diet</text>
  <text x="34" y="137" font-size="10.5" fill="${C.muted}">Antioxidants, vitamins and minerals support the body</text>
  <rect x="22" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Stay Hydrated</text>
  <text x="34" y="185" font-size="10.5" fill="${C.muted}">8–10 glasses of water daily</text>
  <rect x="22" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Get Plenty of Rest</text>
  <text x="34" y="233" font-size="10.5" fill="${C.muted}">7–8 hours nightly to support medication response</text>
  <rect x="410" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">Don'ts During IVF Stimulation</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>
  <rect x="422" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Avoid High-Intensity Exercise</text>
  <text x="434" y="89" font-size="10.5" fill="${C.muted}">Enlarged ovaries risk complications like torsion</text>
  <rect x="422" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Limit Caffeine &amp; Alcohol</text>
  <text x="434" y="137" font-size="10.5" fill="${C.muted}">Can interfere with hormone levels and medication</text>
  <rect x="422" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Don't Smoke</text>
  <text x="434" y="185" font-size="10.5" fill="${C.muted}">Reduces success rates and affects egg quality</text>
  <rect x="422" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Don't Ignore Unusual Symptoms</text>
  <text x="434" y="233" font-size="10.5" fill="${C.muted}">Severe pain or bloating may signal OHSS</text>
</svg>`;

// Blog W28-3 (Dr. Falguni Bavishi at SOGOG): speaker-highlight card
// Source: Blog paras [3],[5],[6] — event, topic, focus, stated verbatim
const SVG_DR_FALGUNI_SOGOG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 218" font-family="${FONT}">
  <rect width="800" height="218" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="216.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">DR. FALGUNI BAVISHI AT SOGOG: ADVANCING IUI SUCCESS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="50" rx="3" fill="${C.rose}"/>
  <text x="38" y="66" font-size="11" font-weight="700" fill="${C.rose}">EVENT</text>
  <text x="130" y="66" font-size="12" font-weight="700" fill="${C.dark}">SOGOG Annual Conference</text>
  <text x="130" y="83" font-size="10.5" fill="${C.muted}">Society of Obstetricians and Gynecologists of Gujarat</text>
  <rect x="20" y="102" width="760" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="102" width="8" height="50" rx="3" fill="${C.rose}"/>
  <text x="38" y="124" font-size="11" font-weight="700" fill="${C.rose}">TOPIC</text>
  <text x="130" y="124" font-size="12" font-weight="700" fill="${C.dark}">Enhancing IUI Success Rates</text>
  <text x="130" y="141" font-size="10.5" fill="${C.muted}">A simple, accessible and cost-effective fertility treatment</text>
  <rect x="20" y="160" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="160" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="182" font-size="11" font-weight="700" fill="${C.rose}">FOCUS</text>
  <text x="130" y="182" font-size="11.5" font-weight="600" fill="${C.dark}">Making accessible care even more successful for patients</text>
</svg>`;

// Blog W28-4 (Dr. Himanshu Bavishi at SOGOG): speaker-highlight card
// Source: Blog paras [3],[5] — event, topic, recognition, stated verbatim
const SVG_DR_HIMANSHU_SOGOG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 218" font-family="${FONT}">
  <rect width="800" height="218" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="216.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">DR. HIMANSHU BAVISHI AT SOGOG: IVF ADVANCEMENTS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="50" rx="3" fill="${C.rose}"/>
  <text x="38" y="66" font-size="11" font-weight="700" fill="${C.rose}">EVENT</text>
  <text x="130" y="66" font-size="12" font-weight="700" fill="${C.dark}">SOGOG State Conference</text>
  <text x="130" y="83" font-size="10.5" fill="${C.muted}">Gynecologists gathered from all over the country</text>
  <rect x="20" y="102" width="760" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="102" width="8" height="50" rx="3" fill="${C.rose}"/>
  <text x="38" y="124" font-size="11" font-weight="700" fill="${C.rose}">TOPIC</text>
  <text x="130" y="124" font-size="12" font-weight="700" fill="${C.dark}">Latest Advancements in IVF Techniques</text>
  <text x="130" y="141" font-size="10.5" fill="${C.muted}">Cutting-edge solutions for infertility</text>
  <rect x="20" y="160" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="160" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="182" font-size="11" font-weight="700" fill="${C.rose}">RECOGNITION</text>
  <text x="185" y="182" font-size="11.5" font-weight="600" fill="${C.dark}">Invited as authority speaker in reproductive medicine</text>
</svg>`;

// Blog W28-5 (PCOS & infertility): "4 Ways PCOS Affects Fertility"
// Source: Blog headings [11],[14],[16],[18] — 4 mechanisms, stated verbatim
const SVG_PCOS_FERTILITY_MECHANISMS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">4 Ways PCOS Affects Fertility</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="122" cy="86" r="18" fill="${C.rose}"/>
  <text x="122" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">1</text>
  <text x="122" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Hormonal</text>
  <text x="122" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Imbalance</text>
  <text x="122" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Excess androgens</text>
  <text x="122" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">disrupt ovulation</text>
  <rect x="218" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="300" cy="86" r="18" fill="${C.rose}"/>
  <text x="300" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">2</text>
  <text x="300" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Anovulation</text>
  <text x="300" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">No egg is released</text>
  <text x="300" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">for fertilisation</text>
  <rect x="396" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="478" cy="86" r="18" fill="${C.rose}"/>
  <text x="478" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">3</text>
  <text x="478" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Insulin</text>
  <text x="478" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Resistance</text>
  <text x="478" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Worsens androgen</text>
  <text x="478" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">production</text>
  <rect x="574" y="58" width="186" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="667" cy="86" r="18" fill="${C.rose}"/>
  <text x="667" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">4</text>
  <text x="667" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Chronic</text>
  <text x="667" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Inflammation</text>
  <text x="667" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Affects egg quality</text>
  <text x="667" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">and uterine lining</text>
</svg>`;

// ── Wave 27 SVG constants ─────────────────────────────────────────────

// Blog W27-1 (Varicocele non-surgical treatment): "4 Non-Surgical Treatment Options for Varicocele"
// Source: Blog headings [16],[20],[25],[32] — 4 approaches, stated verbatim
const SVG_VARICOCELE_NONSURGICAL_4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="16" font-weight="700" fill="${C.dark}">4 Non-Surgical Treatment Options for Varicocele</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="122" cy="86" r="18" fill="${C.rose}"/>
  <text x="122" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">1</text>
  <text x="122" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Lifestyle</text>
  <text x="122" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Changes</text>
  <text x="122" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Supportive underwear,</text>
  <text x="122" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">cold packs</text>
  <rect x="218" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="300" cy="86" r="18" fill="${C.rose}"/>
  <text x="300" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">2</text>
  <text x="300" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Medications &amp;</text>
  <text x="300" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Supplements</text>
  <text x="300" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Antioxidants and</text>
  <text x="300" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">L-Carnitine support</text>
  <rect x="396" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="478" cy="86" r="18" fill="${C.rose}"/>
  <text x="478" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">3</text>
  <text x="478" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Varicocele</text>
  <text x="478" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Embolization</text>
  <text x="478" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Minimally invasive,</text>
  <text x="478" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">similar success rate</text>
  <rect x="574" y="58" width="186" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="667" cy="86" r="18" fill="${C.rose}"/>
  <text x="667" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">4</text>
  <text x="667" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Observation &amp;</text>
  <text x="667" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Monitoring</text>
  <text x="667" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Regular semen</text>
  <text x="667" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">analysis, ultrasounds</text>
</svg>`;

// Blog W27-2 (Ovarian cysts & fertility): "Ovarian Cysts: Effect on Fertility"
// Source: Blog nodes [19],[21] — cysts that do/don't affect fertility, stated verbatim
const SVG_OVARIAN_CYSTS_FERTILITY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236" font-family="${FONT}">
  <rect width="800" height="236" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="234.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <rect x="10" y="10" width="380" height="216" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Usually Don't Affect Fertility</text>
  <rect x="22" y="72" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="77.5" font-size="11.5" font-weight="700" fill="${C.dark}">Functional Cysts</text>
  <text x="34" y="93" font-size="10.5" fill="${C.muted}">Follicular and corpus luteum cysts usually resolve on their own</text>
  <rect x="22" y="128" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="133.5" font-size="11.5" font-weight="700" fill="${C.dark}">Cystadenomas &amp; Dermoid Cysts</text>
  <text x="34" y="149" font-size="10.5" fill="${C.muted}">Rarely interfere with conception when small</text>
  <rect x="410" y="10" width="380" height="216" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">May Impact Fertility</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>
  <rect x="422" y="70" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="75.5" font-size="11.5" font-weight="700" fill="${C.dark}">Endometriomas</text>
  <text x="434" y="91" font-size="10.5" fill="${C.muted}">Can damage ovarian reserve and egg quality</text>
  <rect x="422" y="122" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="127.5" font-size="11.5" font-weight="700" fill="${C.dark}">Large Cysts (&gt;5cm)</text>
  <text x="434" y="143" font-size="10.5" fill="${C.muted}">May distort anatomy and impact ovulation</text>
  <rect x="422" y="174" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="179.5" font-size="11.5" font-weight="700" fill="${C.dark}">PCOS-Related Cysts</text>
  <text x="434" y="195" font-size="10.5" fill="${C.muted}">Hormonal imbalances disrupt regular ovulation</text>
</svg>`;

// Blog W27-3 (Janmashtami babies): celebratory single-stat hero card
// Source: Blog nodes [4],[9] — the one central fact, stated verbatim (no list content in this blog)
const SVG_JANMASHTAMI_BABIES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220" font-family="${FONT}">
  <rect width="800" height="220" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="218.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <circle cx="400" cy="88" r="52" fill="${C.rose}"/>
  <text x="400" y="105" text-anchor="middle" font-size="48" font-weight="800" fill="${C.white}">6</text>
  <text x="400" y="164" text-anchor="middle" font-size="15" font-weight="700" fill="${C.dark}">Healthy Babies Born on Janmashtami 2025</text>
  <text x="400" y="185" text-anchor="middle" font-size="11" fill="${C.muted}">At Bavishi Fertility Institute — Ahmedabad's Leading IVF Center</text>
  <line x1="260" y1="200" x2="540" y2="200" stroke="${C.border}" stroke-width="1"/>
  <text x="400" y="214" text-anchor="middle" font-size="9.5" fill="${C.muted}">A blend of science and spirituality, celebrated together</text>
</svg>`;

// Blog W27-4 (Day 3 vs Day 5 transfer): "Day 3 vs Day 5 Embryo Transfer"
// Source: Blog nodes [9],[13] — advantages of each, stated verbatim
const SVG_DAY3_VS_DAY5_TRANSFER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 258" font-family="${FONT}">
  <rect width="800" height="258" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="256.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <rect x="10" y="10" width="380" height="238" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Day 3 Transfer (Cleavage-Stage)</text>
  <rect x="22" y="70" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="75.5" font-size="11.5" font-weight="700" fill="${C.dark}">Suits Low Embryo Numbers</text>
  <text x="34" y="91" font-size="10.5" fill="${C.muted}">Avoids risking viable embryos waiting to day 5</text>
  <rect x="22" y="118" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="123.5" font-size="11.5" font-weight="700" fill="${C.dark}">Less Time in the Lab</text>
  <text x="34" y="139" font-size="10.5" fill="${C.muted}">May benefit embryos that don't thrive in culture</text>
  <rect x="22" y="166" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="171.5" font-size="11.5" font-weight="700" fill="${C.dark}">Earlier Transfer</text>
  <text x="34" y="187" font-size="10.5" fill="${C.muted}">Good for time-sensitive or urgent cycles</text>
  <rect x="410" y="10" width="380" height="238" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">Day 5 Transfer (Blastocyst)</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>
  <rect x="422" y="70" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="75.5" font-size="11.5" font-weight="700" fill="${C.dark}">Better Embryo Selection</text>
  <text x="434" y="91" font-size="10.5" fill="${C.muted}">Surviving embryos show better developmental potential</text>
  <rect x="422" y="118" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="123.5" font-size="11.5" font-weight="700" fill="${C.dark}">Higher Implantation Rates</text>
  <text x="434" y="139" font-size="10.5" fill="${C.muted}">Closer to natural implantation timing</text>
  <rect x="422" y="166" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="171.5" font-size="11.5" font-weight="700" fill="${C.dark}">Facilitates PGT Testing</text>
  <text x="434" y="187" font-size="10.5" fill="${C.muted}">More accurate genetic testing at this stage</text>
  <rect x="422" y="214" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="219.5" font-size="11.5" font-weight="700" fill="${C.dark}">Reduces Multiple Pregnancies</text>
  <text x="434" y="235" font-size="10.5" fill="${C.muted}">Fewer embryos needed due to higher potential</text>
</svg>`;

// ── Wave 26 SVG constants ─────────────────────────────────────────────

// Blog W26-1 (Varicocele pain relief): "3 Innovative Ways to Relieve Varicocele Pain"
// Source: Blog headings [5],[11],[15] — 3 approaches, stated verbatim
const SVG_VARICOCELE_RELIEF_3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" font-family="${FONT}">
  <rect width="800" height="200" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="198.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">3 INNOVATIVE WAYS TO RELIEVE VARICOCELE PAIN</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="72" font-size="14" font-weight="700" fill="${C.rose}">1</text>
  <text x="60" y="63" font-size="12" font-weight="700" fill="${C.dark}">Pelvic Floor Physical Therapy</text>
  <text x="60" y="79" font-size="10.5" fill="${C.muted}">Releases muscle tension and improves blood flow</text>
  <rect x="20" y="98" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="98" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="14" font-weight="700" fill="${C.rose}">2</text>
  <text x="60" y="117" font-size="12" font-weight="700" fill="${C.dark}">Acupuncture</text>
  <text x="60" y="133" font-size="10.5" fill="${C.muted}">Reduces inflammation and stimulates natural pain relief</text>
  <rect x="20" y="152" width="760" height="30" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="152" width="8" height="30" rx="3" fill="${C.rose}"/>
  <text x="38" y="172" font-size="14" font-weight="700" fill="${C.rose}">3</text>
  <text x="60" y="171" font-size="12" font-weight="700" fill="${C.dark}">Nutrition &amp; Lifestyle — antioxidants, hydration, exercise, less stress</text>
</svg>`;

// Blog W26-2 (Pregnancy after periods stop): "3 Health Priorities for IVF After Periods Stop"
// Source: Blog nodes [18]-[20] — 3 health considerations, stated verbatim
const SVG_IVF_POST_MENOPAUSE_PRIORITIES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="16" font-weight="700" fill="${C.dark}">3 Health Priorities for IVF After Periods Stop</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>
  <rect x="60" y="58" width="215" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="167" cy="86" r="18" fill="${C.rose}"/>
  <text x="167" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">1</text>
  <text x="167" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Manage Existing</text>
  <text x="167" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Conditions</text>
  <text x="167" y="158" text-anchor="middle" font-size="9.5" fill="${C.muted}">Blood pressure, thyroid</text>
  <text x="167" y="173" text-anchor="middle" font-size="9.5" fill="${C.muted}">and diabetes addressed</text>
  <rect x="292" y="58" width="215" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="399" cy="86" r="18" fill="${C.rose}"/>
  <text x="399" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">2</text>
  <text x="399" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Nutrition &amp; Medical</text>
  <text x="399" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Care</text>
  <text x="399" y="158" text-anchor="middle" font-size="9.5" fill="${C.muted}">Balanced diet, consistent</text>
  <text x="399" y="173" text-anchor="middle" font-size="9.5" fill="${C.muted}">prenatal attention</text>
  <rect x="524" y="58" width="215" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="631" cy="86" r="18" fill="${C.rose}"/>
  <text x="631" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">3</text>
  <text x="631" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Ongoing Pregnancy</text>
  <text x="631" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Monitoring</text>
  <text x="631" y="158" text-anchor="middle" font-size="9.5" fill="${C.muted}">Regular check-ups for</text>
  <text x="631" y="173" text-anchor="middle" font-size="9.5" fill="${C.muted}">mother and baby</text>
</svg>`;

// Blog W26-3 (Endometriosis recurrence): "Endometriosis Recurrence Rates After Surgery"
// Source: Blog node [14] — recurrence rates stated verbatim
const SVG_ENDOMETRIOSIS_RECURRENCE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 214" font-family="${FONT}">
  <rect width="800" height="214" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="212.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">ENDOMETRIOSIS RECURRENCE RATES AFTER SURGERY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">WITHIN 2 YEARS</text>
  <text x="149" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="${C.rose}">20–30%</text>
  <text x="149" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">experience recurrence</text>
  <rect x="291" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="291" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="291" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">WITHIN 5 YEARS</text>
  <text x="400" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="${C.rose}">40–50%</text>
  <text x="400" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">if no preventive therapy</text>
  <rect x="542" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="542" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="542" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">WITH HORMONAL THERAPY</text>
  <text x="651" y="115" text-anchor="middle" font-size="15" font-weight="800" fill="${C.rose}">Significantly</text>
  <text x="651" y="133" text-anchor="middle" font-size="15" font-weight="800" fill="${C.rose}">Lower</text>
  <text x="651" y="153" text-anchor="middle" font-size="10" fill="${C.muted}">when combined with surgery</text>
  <text x="400" y="188" text-anchor="middle" font-size="9.5" fill="${C.muted}">Women who undergo complete excision by experienced specialists tend to have better long-term outcomes</text>
</svg>`;

// Blog W26-4 (IVF with low AMH): "3 Factors That Affect IVF Success with Low AMH"
// Source: Blog node [11] — 3 factors, stated verbatim
const SVG_LOW_AMH_IVF_SUCCESS_FACTORS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" font-family="${FONT}">
  <rect width="800" height="200" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="198.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">3 FACTORS THAT AFFECT IVF SUCCESS WITH LOW AMH</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="72" font-size="14" font-weight="700" fill="${C.rose}">1</text>
  <text x="60" y="63" font-size="12" font-weight="700" fill="${C.dark}">Age</text>
  <text x="60" y="79" font-size="10.5" fill="${C.muted}">Younger women with low AMH often see better outcomes</text>
  <rect x="20" y="98" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="98" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="14" font-weight="700" fill="${C.rose}">2</text>
  <text x="60" y="117" font-size="12" font-weight="700" fill="${C.dark}">Overall Health</text>
  <text x="60" y="133" font-size="10.5" fill="${C.muted}">Good health supports a stronger response to stimulation</text>
  <rect x="20" y="152" width="760" height="30" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="152" width="8" height="30" rx="3" fill="${C.rose}"/>
  <text x="38" y="172" font-size="14" font-weight="700" fill="${C.rose}">3</text>
  <text x="60" y="171" font-size="12" font-weight="700" fill="${C.dark}">Previous Treatments — inform a more customised protocol</text>
</svg>`;

// Blog W26-5 (Natural cycle IVF & OHSS): "How Natural Cycle IVF Works: 5 Steps"
// Source: Blog node [14] — 5-step process, stated verbatim
const SVG_NATURAL_CYCLE_IVF_STEPS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">HOW NATURAL CYCLE IVF WORKS: 5 STEPS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">1</text>
  <text x="108" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Track Natural</text>
  <text x="108" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Cycle</text>
  <text x="108" y="134" text-anchor="middle" font-size="9.5" fill="${C.muted}">No heavy stimulation</text>
  <rect x="186" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">2</text>
  <text x="254" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Monitor</text>
  <text x="254" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Follicle</text>
  <text x="254" y="134" text-anchor="middle" font-size="9.5" fill="${C.muted}">The natural one</text>
  <rect x="332" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">3</text>
  <text x="400" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Retrieve</text>
  <text x="400" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Single Egg</text>
  <text x="400" y="134" text-anchor="middle" font-size="9.5" fill="${C.muted}">One mature egg</text>
  <rect x="478" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">4</text>
  <text x="546" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Fertilize in</text>
  <text x="546" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">the Lab</text>
  <text x="546" y="134" text-anchor="middle" font-size="9.5" fill="${C.muted}">Egg meets sperm</text>
  <rect x="624" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">5</text>
  <text x="692" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Transfer</text>
  <text x="692" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Embryo</text>
  <text x="692" y="134" text-anchor="middle" font-size="9.5" fill="${C.muted}">Back to the uterus</text>
</svg>`;

// ── Wave 25 SVG constants ─────────────────────────────────────────────

// Blog W25-1 (OHSS): "OHSS: Primary vs Secondary"
// Source: Blog nodes [9]-[12] — 2 types described verbatim
const SVG_OHSS_PRIMARY_VS_SECONDARY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 236" font-family="${FONT}">
  <rect width="800" height="236" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="234.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <rect x="10" y="10" width="380" height="216" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Primary OHSS</text>
  <rect x="22" y="70" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="75.5" font-size="11.5" font-weight="700" fill="${C.dark}">Caused by Fertility Medication</text>
  <text x="34" y="91" font-size="10.5" fill="${C.muted}">Drugs used to stimulate egg growth</text>
  <rect x="22" y="122" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="127.5" font-size="11.5" font-weight="700" fill="${C.dark}">Ovaries Enlarge</text>
  <text x="34" y="143" font-size="10.5" fill="${C.muted}">More eggs cause temporary enlargement</text>
  <rect x="22" y="174" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="179.5" font-size="11.5" font-weight="700" fill="${C.dark}">Regresses on Its Own</text>
  <text x="34" y="195" font-size="10.5" fill="${C.muted}">Stopping medication ends stimulation</text>
  <rect x="410" y="10" width="380" height="216" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">Secondary OHSS</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>
  <rect x="422" y="70" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="75.5" font-size="11.5" font-weight="700" fill="${C.dark}">Occurs During Pregnancy</text>
  <text x="434" y="91" font-size="10.5" fill="${C.muted}">Not linked to the stimulation drugs alone</text>
  <rect x="422" y="122" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="127.5" font-size="11.5" font-weight="700" fill="${C.dark}">hCG Keeps Stimulating</text>
  <text x="434" y="143" font-size="10.5" fill="${C.muted}">Pregnancy hormone continuously acts on ovaries</text>
  <rect x="422" y="174" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="179.5" font-size="11.5" font-weight="700" fill="${C.dark}">Can Be More Severe</text>
  <text x="434" y="195" font-size="10.5" fill="${C.muted}">Often more intense than primary OHSS</text>
</svg>`;

// Blog W25-2 (Egg freezing): "The Egg Freezing Process: 4 Steps"
// Source: Blog nodes [15]-[18] — 4-step process, stated verbatim
const SVG_EGG_FREEZING_PROCESS_4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 246" font-family="${FONT}">
  <rect width="800" height="246" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="244.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">THE EGG FREEZING PROCESS: 4 STEPS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="72" font-size="14" font-weight="700" fill="${C.rose}">1</text>
  <text x="60" y="63" font-size="12" font-weight="700" fill="${C.dark}">Initial Consultation &amp; Testing</text>
  <text x="60" y="79" font-size="10.5" fill="${C.muted}">Medical history review, blood tests, and ultrasound to assess ovarian reserve</text>
  <rect x="20" y="98" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="98" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="14" font-weight="700" fill="${C.rose}">2</text>
  <text x="60" y="117" font-size="12" font-weight="700" fill="${C.dark}">Ovarian Stimulation</text>
  <text x="60" y="133" font-size="10.5" fill="${C.muted}">Hormonal injections stimulate the ovaries to produce multiple eggs</text>
  <rect x="20" y="152" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="152" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="180" font-size="14" font-weight="700" fill="${C.rose}">3</text>
  <text x="60" y="171" font-size="12" font-weight="700" fill="${C.dark}">Egg Retrieval</text>
  <text x="60" y="187" font-size="10.5" fill="${C.muted}">Eggs are retrieved through a minimally invasive procedure</text>
  <rect x="20" y="206" width="760" height="30" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="206" width="8" height="30" rx="3" fill="${C.rose}"/>
  <text x="38" y="226" font-size="14" font-weight="700" fill="${C.rose}">4</text>
  <text x="60" y="225" font-size="12" font-weight="700" fill="${C.dark}">Freezing — eggs are frozen and stored in a cryobank</text>
</svg>`;

// Blog W25-3 (Best IVF hospitals Ahmedabad): "Bavishi Fertility Institute: By the Numbers"
// Source: Blog node [20] — statistics stated verbatim
const SVG_BFI_AHMEDABAD_NUMBERS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">Bavishi Fertility Institute: By the Numbers</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="122" y="105" text-anchor="middle" font-size="22" font-weight="800" fill="${C.rose}">25,000+</text>
  <text x="122" y="150" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Successful IVF</text>
  <text x="122" y="165" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Pregnancies</text>
  <rect x="218" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="300" y="105" text-anchor="middle" font-size="22" font-weight="800" fill="${C.rose}">45,000+</text>
  <text x="300" y="150" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Patient Visits</text>
  <text x="300" y="165" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Annually</text>
  <rect x="396" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="478" y="105" text-anchor="middle" font-size="22" font-weight="800" fill="${C.rose}">100+ Years</text>
  <text x="478" y="150" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Combined Doctor</text>
  <text x="478" y="165" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Experience</text>
  <rect x="574" y="58" width="186" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="667" y="105" text-anchor="middle" font-size="22" font-weight="800" fill="${C.rose}">7 Cities</text>
  <text x="667" y="150" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Across India</text>
</svg>`;

// Blog W25-4 (Exercise during IVF): "How Exercise Supports IVF Success"
// Source: Blog nodes [8]-[16] — 4 mechanisms, stated verbatim
const SVG_EXERCISE_IVF_BENEFITS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 246" font-family="${FONT}">
  <rect width="800" height="246" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="244.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">HOW EXERCISE SUPPORTS IVF SUCCESS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="63" font-size="11" font-weight="700" fill="${C.rose}">01</text>
  <text x="68" y="63" font-size="12" font-weight="700" fill="${C.dark}">Hormonal Balance</text>
  <text x="68" y="80" font-size="10.5" fill="${C.muted}">Regulates insulin, cortisol, estrogen and progesterone</text>
  <rect x="20" y="98" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="98" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="117" font-size="11" font-weight="700" fill="${C.rose}">02</text>
  <text x="68" y="117" font-size="12" font-weight="700" fill="${C.dark}">Blood Flow</text>
  <text x="68" y="134" font-size="10.5" fill="${C.muted}">Enhances blood flow to the uterus and ovaries</text>
  <rect x="20" y="152" width="760" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="152" width="8" height="46" rx="3" fill="${C.rose}"/>
  <text x="38" y="171" font-size="11" font-weight="700" fill="${C.rose}">03</text>
  <text x="68" y="171" font-size="12" font-weight="700" fill="${C.dark}">Mental Health</text>
  <text x="68" y="188" font-size="10.5" fill="${C.muted}">Reduces cortisol, promotes emotional stability</text>
  <rect x="20" y="206" width="760" height="30" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="206" width="8" height="30" rx="3" fill="${C.rose}"/>
  <text x="38" y="226" font-size="11" font-weight="700" fill="${C.rose}">04</text>
  <text x="68" y="225" font-size="12" font-weight="700" fill="${C.dark}">Weight Management — maintains a healthy BMI</text>
</svg>`;

// Blog W25-5 (Blighted ovum): "4 Causes of Blighted Ovum"
// Source: Blog node [9]-[12] — 4 causes, stated verbatim
const SVG_BLIGHTED_OVUM_CAUSES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">4 Causes of Blighted Ovum</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="122" cy="86" r="18" fill="${C.rose}"/>
  <text x="122" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">1</text>
  <text x="122" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Chromosomal</text>
  <text x="122" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Abnormalities</text>
  <text x="122" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Genetic issues</text>
  <text x="122" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">block development</text>
  <rect x="218" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="300" cy="86" r="18" fill="${C.rose}"/>
  <text x="300" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">2</text>
  <text x="300" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Hormonal</text>
  <text x="300" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Imbalance</text>
  <text x="300" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Affects embryo</text>
  <text x="300" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">development</text>
  <rect x="396" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="478" cy="86" r="18" fill="${C.rose}"/>
  <text x="478" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">3</text>
  <text x="478" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Uterine</text>
  <text x="478" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Abnormalities</text>
  <text x="478" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Can affect</text>
  <text x="478" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">implantation</text>
  <rect x="574" y="58" width="186" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="667" cy="86" r="18" fill="${C.rose}"/>
  <text x="667" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">4</text>
  <text x="667" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Advanced Maternal</text>
  <text x="667" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Age</text>
  <text x="667" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Women over 35 at</text>
  <text x="667" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">higher risk</text>
</svg>`;

// ── Wave 24 SVG constants ─────────────────────────────────────────────

// Blog W24-1 (Low AMH reasons): "9 Reasons Behind Low AMH Levels"
// Source: Blog node [15] — 9 reasons listed
const SVG_LOW_AMH_REASONS_9 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 370" font-family="${FONT}">
  <rect width="800" height="370" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="368.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">9 REASONS BEHIND LOW AMH LEVELS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="73" r="16" fill="${C.rose}"/>
  <text x="42" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="67" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Age-Related Decline</text>
  <text x="67" y="84" font-size="10.5" fill="${C.muted}">Fertility decreases gradually after 30, more after 35</text>
  <rect x="10" y="104" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="133" r="16" fill="${C.rose}"/>
  <text x="42" y="138" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="67" y="127" font-size="11.5" font-weight="700" fill="${C.dark}">Ovarian Reserve Dynamics</text>
  <text x="67" y="144" font-size="10.5" fill="${C.muted}">Genetic and environmental factors affect decline rate</text>
  <rect x="10" y="164" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="193" r="16" fill="${C.rose}"/>
  <text x="42" y="198" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="67" y="187" font-size="11.5" font-weight="700" fill="${C.dark}">PCOS</text>
  <text x="67" y="204" font-size="10.5" fill="${C.muted}">Hormonal imbalance disturbs follicle maturation</text>
  <rect x="10" y="224" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="253" r="16" fill="${C.rose}"/>
  <text x="42" y="258" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="67" y="247" font-size="11.5" font-weight="700" fill="${C.dark}">Premature Ovarian Insufficiency</text>
  <text x="67" y="264" font-size="10.5" fill="${C.muted}">Ovaries cease normal function before age 40</text>
  <rect x="10" y="284" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="313" r="16" fill="${C.rose}"/>
  <text x="42" y="318" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="67" y="307" font-size="11.5" font-weight="700" fill="${C.dark}">Endometriosis</text>
  <text x="67" y="324" font-size="10.5" fill="${C.muted}">Inflammation affects ovarian follicle health</text>
  <rect x="410" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="73" r="16" fill="${C.rose}"/>
  <text x="442" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="467" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Cancer Treatments</text>
  <text x="467" y="84" font-size="10.5" fill="${C.muted}">Chemotherapy and radiation reduce viable eggs</text>
  <rect x="410" y="104" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="133" r="16" fill="${C.rose}"/>
  <text x="442" y="138" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">7</text>
  <text x="467" y="127" font-size="11.5" font-weight="700" fill="${C.dark}">Underlying Medical Conditions</text>
  <text x="467" y="144" font-size="10.5" fill="${C.muted}">Autoimmune and genetic conditions can play a role</text>
  <rect x="410" y="164" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="193" r="16" fill="${C.rose}"/>
  <text x="442" y="198" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">8</text>
  <text x="467" y="187" font-size="11.5" font-weight="700" fill="${C.dark}">Ovarian Surgery</text>
  <text x="467" y="204" font-size="10.5" fill="${C.muted}">Removal of ovarian cysts can reduce reserve</text>
  <rect x="410" y="224" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="253" r="16" fill="${C.rose}"/>
  <text x="442" y="258" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">9</text>
  <text x="467" y="247" font-size="11.5" font-weight="700" fill="${C.dark}">Lifestyle Factors</text>
  <text x="467" y="264" font-size="10.5" fill="${C.muted}">Smoking, alcohol and obesity affect ovarian function</text>
</svg>`;

// Blog W24-2 (Miscarriage during IVF): "5 Signs of Possible Miscarriage During IVF"
// Source: Blog node [9]-[14] — 5 signs listed verbatim
const SVG_MISCARRIAGE_SIGNS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 SIGNS OF POSSIBLE MISCARRIAGE DURING IVF</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">01</text>
  <text x="108" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Vaginal Bleeding</text>
  <text x="108" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Light spotting to</text>
  <text x="108" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">heavy bleeding</text>
  <rect x="186" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">02</text>
  <text x="254" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Abdominal Pain</text>
  <text x="254" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Cramping in the</text>
  <text x="254" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">lower abdomen</text>
  <rect x="332" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">03</text>
  <text x="400" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Passage of Tissue</text>
  <text x="400" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Tissue or clots in</text>
  <text x="400" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">vaginal bleeding</text>
  <rect x="478" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">04</text>
  <text x="546" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Fewer Symptoms</text>
  <text x="546" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Sudden drop in</text>
  <text x="546" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">nausea, tenderness</text>
  <rect x="624" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">05</text>
  <text x="692" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Back Pain</text>
  <text x="692" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Can accompany</text>
  <text x="692" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">other signs</text>
</svg>`;

// Blog W24-3 (IVF babies health): "IVF Births Worldwide: The Numbers"
// Source: Blog nodes [28]-[30] — global IVF birth statistics, stated verbatim
const SVG_IVF_BIRTHS_WORLDWIDE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" font-family="${FONT}">
  <rect width="800" height="200" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="198.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">IVF BIRTHS WORLDWIDE: THE NUMBERS</text>
  <line x1="60" y1="36" x2="740" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="70" y="48" width="200" height="126" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="170" y="76" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">AUSTRALIA</text>
  <text x="170" y="118" text-anchor="middle" font-size="24" font-weight="800" fill="${C.rose}">1 in 18</text>
  <text x="170" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">babies born via IVF</text>
  <rect x="300" y="40" width="200" height="134" rx="8" fill="${C.white}" stroke="${C.rose}" stroke-width="1.5"/>
  <text x="400" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">GLOBAL (2019)</text>
  <text x="400" y="112" text-anchor="middle" font-size="26" font-weight="800" fill="${C.rose}">4.2%</text>
  <text x="400" y="134" text-anchor="middle" font-size="10" fill="${C.muted}">of all children born via IVF</text>
  <rect x="530" y="48" width="200" height="126" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="630" y="76" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">UNITED STATES</text>
  <text x="630" y="118" text-anchor="middle" font-size="24" font-weight="800" fill="${C.rose}">1–2%</text>
  <text x="630" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">of all births are IVF</text>
</svg>`;

// Blog W24-4 (Bed rest myth): "5 Risks of Unnecessary Bed Rest After Embryo Transfer"
// Source: Blog node [13]-[17] — 5 numbered complications, stated verbatim
const SVG_BED_REST_RISKS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 RISKS OF UNNECESSARY BED REST AFTER EMBRYO TRANSFER</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">01</text>
  <text x="108" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Blood Clot</text>
  <text x="108" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Formation</text>
  <text x="108" y="134" text-anchor="middle" font-size="9.5" fill="${C.muted}">Increased DVT risk</text>
  <rect x="186" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">02</text>
  <text x="254" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Muscle</text>
  <text x="254" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Atrophy</text>
  <text x="254" y="134" text-anchor="middle" font-size="9.5" fill="${C.muted}">Weakens the body</text>
  <rect x="332" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">03</text>
  <text x="400" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Psychological</text>
  <text x="400" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Impact</text>
  <text x="400" y="134" text-anchor="middle" font-size="9.5" fill="${C.muted}">Raises anxiety</text>
  <rect x="478" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">04</text>
  <text x="546" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Reduced</text>
  <text x="546" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Blood Flow</text>
  <text x="546" y="134" text-anchor="middle" font-size="9.5" fill="${C.muted}">Affects uterus</text>
  <rect x="624" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">05</text>
  <text x="692" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">No Proven</text>
  <text x="692" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="${C.dark}">Benefit</text>
  <text x="692" y="134" text-anchor="middle" font-size="9.5" fill="${C.muted}">Doesn't improve odds</text>
</svg>`;

// Blog W24-5 (Twins & IVF myth): "5 Factors in the Single vs Multiple Embryo Decision"
// Source: Blog headings [12],[14],[17],[19],[21] — 5 decision factors
const SVG_EMBRYO_TRANSFER_DECISION_FACTORS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 FACTORS IN THE SINGLE VS MULTIPLE EMBRYO DECISION</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">01</text>
  <text x="108" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Age of Patient</text>
  <text x="108" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Younger women often</text>
  <text x="108" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">succeed with SET</text>
  <rect x="186" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">02</text>
  <text x="254" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Reproductive</text>
  <text x="254" y="114" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">History</text>
  <text x="254" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">Past outcomes shape it</text>
  <rect x="332" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">03</text>
  <text x="400" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Embryo Quality</text>
  <text x="400" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Assessed viability</text>
  <text x="400" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">guides the decision</text>
  <rect x="478" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">04</text>
  <text x="546" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Patient Health</text>
  <text x="546" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Overall conditions</text>
  <text x="546" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">are factored in</text>
  <rect x="624" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">05</text>
  <text x="692" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Preferences</text>
  <text x="692" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Family-building</text>
  <text x="692" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">goals matter most</text>
</svg>`;

// ── Wave 23 SVG constants ─────────────────────────────────────────────

// Blog W23-1 (AMH/AFC ovarian reserve): "AMH Levels: What They Mean"
// Source: Blog node [13] — AMH ranges stated verbatim
const SVG_AMH_LEVELS_MEANING = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">AMH Levels: What They Mean</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="122" cy="86" r="18" fill="${C.rose}"/>
  <text x="122" y="91" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">1–4</text>
  <text x="122" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Normal Ovarian</text>
  <text x="122" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Reserve</text>
  <text x="122" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">1.0–4.0 ng/mL</text>
  <text x="122" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">(ranges vary by lab)</text>
  <rect x="218" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="300" cy="86" r="18" fill="${C.rose}"/>
  <text x="300" y="91" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">&lt;1</text>
  <text x="300" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Low Ovarian</text>
  <text x="300" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Reserve</text>
  <text x="300" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Below 1.0 ng/mL</text>
  <rect x="396" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="478" cy="86" r="18" fill="${C.rose}"/>
  <text x="478" y="91" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">&lt;0.4</text>
  <text x="478" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Very Low Ovarian</text>
  <text x="478" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Reserve</text>
  <text x="478" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Below 0.4 ng/mL</text>
  <rect x="574" y="58" width="186" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="667" cy="86" r="18" fill="${C.rose}"/>
  <text x="667" y="91" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.white}">HIGH</text>
  <text x="667" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">High AMH</text>
  <text x="667" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Seen in PCOS or</text>
  <text x="667" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">very high egg reserve</text>
</svg>`;

// Blog W23-2 (Pregnancy ultrasound schedule): "5 Standard Pregnancy Ultrasound Scans"
// Source: Blog nodes [11]-[20] — 5 scans with week ranges, stated verbatim
const SVG_PREGNANCY_ULTRASOUND_SCANS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 STANDARD PREGNANCY ULTRASOUND SCANS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">WEEKS 6–9</text>
  <text x="108" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">First Trimester</text>
  <text x="108" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Confirms pregnancy,</text>
  <text x="108" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">heartbeat, due date</text>
  <rect x="186" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">WEEKS 11–14</text>
  <text x="254" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Nuchal Translucency</text>
  <text x="254" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Screens for chromo-</text>
  <text x="254" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">somal abnormalities</text>
  <rect x="332" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">WEEKS 18–22</text>
  <text x="400" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Anomaly Scan</text>
  <text x="400" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Checks organs,</text>
  <text x="400" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">spine, limbs</text>
  <rect x="478" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">WEEKS 28–32</text>
  <text x="546" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Growth Scan</text>
  <text x="546" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Monitors growth,</text>
  <text x="546" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">placenta function</text>
  <rect x="624" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">WEEKS 36–40</text>
  <text x="692" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Final Scan</text>
  <text x="692" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Confirms position</text>
  <text x="692" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">before delivery</text>
</svg>`;

// Blog W23-3 (Microplastics): "How Microplastics Enter Your Body"
// Source: Blog node [13] — 4 exposure pathways stated verbatim
const SVG_MICROPLASTICS_ENTRY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">How Microplastics Enter Your Body</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="122" cy="86" r="18" fill="${C.rose}"/>
  <text x="122" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">1</text>
  <text x="122" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Food &amp; Water</text>
  <text x="122" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Contaminated water,</text>
  <text x="122" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">seafood, packaged</text>
  <text x="122" y="180" text-anchor="middle" font-size="9.5" fill="${C.muted}">food</text>
  <rect x="218" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="300" cy="86" r="18" fill="${C.rose}"/>
  <text x="300" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">2</text>
  <text x="300" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Air</text>
  <text x="300" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Airborne fibers from</text>
  <text x="300" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">synthetic fabrics</text>
  <rect x="396" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="478" cy="86" r="18" fill="${C.rose}"/>
  <text x="478" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">3</text>
  <text x="478" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Cosmetics</text>
  <text x="478" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Exfoliating beads via</text>
  <text x="478" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">skin contact or</text>
  <text x="478" y="180" text-anchor="middle" font-size="9.5" fill="${C.muted}">ingestion</text>
  <rect x="574" y="58" width="186" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="667" cy="86" r="18" fill="${C.rose}"/>
  <text x="667" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">4</text>
  <text x="667" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Household Dust</text>
  <text x="667" y="150" text-anchor="middle" font-size="9.5" fill="${C.muted}">Synthetic furniture</text>
  <text x="667" y="165" text-anchor="middle" font-size="9.5" fill="${C.muted}">and carpet particles</text>
</svg>`;

// Blog W23-4 (12 PCOS pregnancy tips): "12 Tips for Getting Pregnant Faster with PCOS"
// Source: Blog node [4] — 12-item master list, stated verbatim (compact, no descriptions)
const SVG_PCOS_12_TIPS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 296" font-family="${FONT}">
  <rect width="800" height="296" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="294.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">12 TIPS FOR GETTING PREGNANT FASTER WITH PCOS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="355" height="34" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="60" cy="61" r="12" fill="${C.rose}"/><text x="60" y="65" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="80" y="65" font-size="11" font-weight="600" fill="${C.dark}">Understand PCOS &amp; Fertility</text>
  <rect x="40" y="82" width="355" height="34" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="60" cy="99" r="12" fill="${C.rose}"/><text x="60" y="103" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="80" y="103" font-size="11" font-weight="600" fill="${C.dark}">Track Your Ovulation</text>
  <rect x="40" y="120" width="355" height="34" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="60" cy="137" r="12" fill="${C.rose}"/><text x="60" y="141" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="80" y="141" font-size="11" font-weight="600" fill="${C.dark}">Maintain a Healthy Weight</text>
  <rect x="40" y="158" width="355" height="34" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="60" cy="175" r="12" fill="${C.rose}"/><text x="60" y="179" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="80" y="179" font-size="11" font-weight="600" fill="${C.dark}">Manage Insulin Levels</text>
  <rect x="40" y="196" width="355" height="34" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="60" cy="213" r="12" fill="${C.rose}"/><text x="60" y="217" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="80" y="217" font-size="11" font-weight="600" fill="${C.dark}">Consider Fertility Treatments</text>
  <rect x="40" y="234" width="355" height="34" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="60" cy="251" r="12" fill="${C.rose}"/><text x="60" y="255" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="80" y="255" font-size="11" font-weight="600" fill="${C.dark}">Balance Hormones with Medical Support</text>
  <rect x="405" y="44" width="355" height="34" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="425" cy="61" r="12" fill="${C.rose}"/><text x="425" y="65" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">7</text>
  <text x="445" y="65" font-size="11" font-weight="600" fill="${C.dark}">Adopt Stress-Reduction Techniques</text>
  <rect x="405" y="82" width="355" height="34" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="425" cy="99" r="12" fill="${C.rose}"/><text x="425" y="103" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">8</text>
  <text x="445" y="103" font-size="11" font-weight="600" fill="${C.dark}">Be Patient and Stay Positive</text>
  <rect x="405" y="120" width="355" height="34" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="425" cy="137" r="12" fill="${C.rose}"/><text x="425" y="141" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">9</text>
  <text x="445" y="141" font-size="11" font-weight="600" fill="${C.dark}">Optimize Vitamin &amp; Mineral Intake</text>
  <rect x="405" y="158" width="355" height="34" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="425" cy="175" r="12" fill="${C.rose}"/><text x="425" y="179" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">10</text>
  <text x="445" y="179" font-size="11" font-weight="600" fill="${C.dark}">Prioritize Sleep Quality</text>
  <rect x="405" y="196" width="355" height="34" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="425" cy="213" r="12" fill="${C.rose}"/><text x="425" y="217" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">11</text>
  <text x="445" y="217" font-size="11" font-weight="600" fill="${C.dark}">Avoid Environmental Hormone Disruptors</text>
  <rect x="405" y="234" width="355" height="34" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="425" cy="251" r="12" fill="${C.rose}"/><text x="425" y="255" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">12</text>
  <text x="445" y="255" font-size="11" font-weight="600" fill="${C.dark}">Seek Support &amp; Build a Community</text>
</svg>`;

// Blog W23-5 (13 Best IVF Clinics Mumbai): "5 Things to Compare When Choosing an IVF Clinic"
// Source: recurring evaluation criteria used across every clinic profile in the blog
// (IVF doctors, Range of treatment, Technology, Accreditation & awards, Location) — not
// invented; synthesised from the blog's own repeated section structure across all 13 clinics.
const SVG_CHOOSE_IVF_CLINIC = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 THINGS TO COMPARE WHEN CHOOSING AN IVF CLINIC</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">01</text>
  <text x="108" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Accreditation</text>
  <text x="108" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">NABH, JCI and</text>
  <text x="108" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">other certifications</text>
  <rect x="186" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">02</text>
  <text x="254" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Doctor Experience</text>
  <text x="254" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Specialist</text>
  <text x="254" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">qualifications</text>
  <rect x="332" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">03</text>
  <text x="400" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Technology &amp; Lab</text>
  <text x="400" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Advanced equipment</text>
  <text x="400" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">and techniques</text>
  <rect x="478" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">04</text>
  <text x="546" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Success Rates</text>
  <text x="546" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Published pregnancy</text>
  <text x="546" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">outcomes</text>
  <rect x="624" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">05</text>
  <text x="692" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Location &amp; Access</text>
  <text x="692" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Convenient centres</text>
</svg>`;

// ── Wave 22 SVG constants ─────────────────────────────────────────────

// Blog W22-1 (3D/4D ultrasound timing): "Best Time for 3D/4D Ultrasound: Weeks 26-32"
// Source: Blog nodes [10],[12],[13] — timing window stated verbatim
const SVG_3D4D_ULTRASOUND_TIMING = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 214" font-family="${FONT}">
  <rect width="800" height="214" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="212.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">BEST TIME FOR 3D/4D ULTRASOUND: WEEKS 26–32</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="70" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">BEFORE 24 WEEKS</text>
  <text x="149" y="112" text-anchor="middle" font-size="10.5" fill="${C.dark}" font-weight="600">Facial features may</text>
  <text x="149" y="128" text-anchor="middle" font-size="10.5" fill="${C.dark}" font-weight="600">appear less defined</text>
  <text x="149" y="148" text-anchor="middle" font-size="9.5" fill="${C.muted}">Too early for clarity</text>
  <rect x="291" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.rose}" stroke-width="1.5"/>
  <rect x="291" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="291" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">26–32 WEEKS (IDEAL)</text>
  <text x="400" y="112" text-anchor="middle" font-size="10.5" fill="${C.rose}" font-weight="700">Formed features,</text>
  <text x="400" y="128" text-anchor="middle" font-size="10.5" fill="${C.rose}" font-weight="700">active movement</text>
  <text x="400" y="148" text-anchor="middle" font-size="9.5" fill="${C.muted}">Best image clarity</text>
  <rect x="542" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="542" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="542" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="70" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">AFTER 32–34 WEEKS</text>
  <text x="651" y="112" text-anchor="middle" font-size="10.5" fill="${C.dark}" font-weight="600">Baby may be too</text>
  <text x="651" y="128" text-anchor="middle" font-size="10.5" fill="${C.dark}" font-weight="600">cramped in uterus</text>
  <text x="651" y="148" text-anchor="middle" font-size="9.5" fill="${C.muted}">Can limit image quality</text>
  <text x="400" y="190" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">Sufficient fat, well-formed features, and active movement peak in this window</text>
  <text x="400" y="205" text-anchor="middle" font-size="9.5" fill="${C.muted}">Your specialist will confirm the right timing for your pregnancy</text>
</svg>`;

// Blog W22-2 (Sperm DNA fragmentation): "8 Signs You May Need Sperm DNA Fragmentation Testing"
// Source: Blog nodes [10]-[29] — 8 numbered indicators
const SVG_DNA_FRAGMENTATION_SIGNS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 316" font-family="${FONT}">
  <rect width="800" height="316" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="314.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">8 SIGNS YOU MAY NEED SPERM DNA FRAGMENTATION TESTING</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="52" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="79" r="14" fill="${C.rose}"/>
  <text x="64" y="83.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="86" y="74" font-size="11" font-weight="700" fill="${C.dark}">Repeated IVF/ICSI Failure</text>
  <text x="86" y="90" font-size="9.5" fill="${C.muted}">Embryos fail to implant or grow well despite low sperm count</text>
  <rect x="40" y="112" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="139" r="14" fill="${C.rose}"/>
  <text x="64" y="143.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="86" y="134" font-size="11" font-weight="700" fill="${C.dark}">Recurrent Pregnancy Loss</text>
  <text x="86" y="150" font-size="9.5" fill="${C.muted}">Repeated miscarriages when female factors are normal</text>
  <rect x="40" y="172" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="199" r="14" fill="${C.rose}"/>
  <text x="64" y="203.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="86" y="194" font-size="11" font-weight="700" fill="${C.dark}">Very Low or Fluctuating Count</text>
  <text x="86" y="210" font-size="9.5" fill="${C.muted}">Higher oxidative stress increases fragmentation risk</text>
  <rect x="40" y="232" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="259" r="14" fill="${C.rose}"/>
  <text x="64" y="263.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="86" y="254" font-size="11" font-weight="700" fill="${C.dark}">Poor Motility + Abnormal Shape</text>
  <text x="86" y="270" font-size="9.5" fill="${C.muted}">Multiple affected sperm parameters together</text>
  <rect x="405" y="52" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="79" r="14" fill="${C.rose}"/>
  <text x="429" y="83.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="451" y="74" font-size="11" font-weight="700" fill="${C.dark}">Male Partner Age 35+</text>
  <text x="451" y="90" font-size="9.5" fill="${C.muted}">DNA damage increases naturally with age</text>
  <rect x="405" y="112" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="139" r="14" fill="${C.rose}"/>
  <text x="429" y="143.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="451" y="134" font-size="11" font-weight="700" fill="${C.dark}">Lifestyle Risk Factors</text>
  <text x="451" y="150" font-size="9.5" fill="${C.muted}">Smoking, alcohol, stress, obesity, heat exposure</text>
  <rect x="405" y="172" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="199" r="14" fill="${C.rose}"/>
  <text x="429" y="203.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">7</text>
  <text x="451" y="194" font-size="11" font-weight="700" fill="${C.dark}">Oxidative Stress Conditions</text>
  <text x="451" y="210" font-size="9.5" fill="${C.muted}">Varicocele, infections, diabetes, hormonal imbalance</text>
  <rect x="405" y="232" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="259" r="14" fill="${C.rose}"/>
  <text x="429" y="263.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">8</text>
  <text x="451" y="254" font-size="11" font-weight="700" fill="${C.dark}">Unexplained Infertility</text>
  <text x="451" y="270" font-size="9.5" fill="${C.muted}">Normal semen report but conception still doesn't happen</text>
</svg>`;

// Blog W22-3 (Pregnancy test after IUI): "Pregnancy Testing After IUI: Key Timing"
// Source: Blog nodes [8]-[18],[22]-[23],[28] — timing windows stated verbatim
const SVG_IUI_PREGNANCY_TEST_TIMING = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 288" font-family="${FONT}">
  <rect width="800" height="288" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="286.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">PREGNANCY TESTING AFTER IUI: KEY TIMING</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="63" font-size="11" font-weight="700" fill="${C.rose}">14 DAYS</text>
  <text x="110" y="63" font-size="12" font-weight="700" fill="${C.dark}">Minimum Wait Before Testing</text>
  <text x="110" y="81" font-size="10.5" fill="${C.muted}">Testing earlier risks a false negative before hCG is detectable</text>
  <rect x="20" y="107" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="107" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="11" font-weight="700" fill="${C.rose}">14–16 DAYS</text>
  <text x="120" y="126" font-size="12" font-weight="700" fill="${C.dark}">Ideal Beta-hCG Blood Test</text>
  <text x="120" y="144" font-size="10.5" fill="${C.muted}">Recommended by BFI for the most reliable result</text>
  <rect x="20" y="170" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="170" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="189" font-size="11" font-weight="700" fill="${C.rose}">10–12 DAYS</text>
  <text x="122" y="189" font-size="12" font-weight="700" fill="${C.dark}">Wait After Trigger Shot</text>
  <text x="122" y="207" font-size="10.5" fill="${C.muted}">Avoids a false positive from residual synthetic hCG</text>
  <rect x="20" y="233" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="233" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="252" font-size="11" font-weight="700" fill="${C.rose}">48 HOURS</text>
  <text x="115" y="252" font-size="12" font-weight="700" fill="${C.dark}">Confirm a Positive Result</text>
  <text x="115" y="270" font-size="10.5" fill="${C.muted}">Repeat blood test checks that hCG levels are rising appropriately</text>
</svg>`;

// Blog W22-4 (Embryo implantation factors): "4 Factors Behind Implantation Failure"
// Source: Blog node [6] — 4 categories listed verbatim
const SVG_IMPLANTATION_FAILURE_FACTORS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">4 Factors Behind Implantation Failure</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="122" cy="86" r="18" fill="${C.rose}"/>
  <text x="122" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">1</text>
  <text x="122" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Chromosomal</text>
  <text x="122" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Abnormalities</text>
  <text x="122" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Up to 50% of normal-</text>
  <text x="122" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">looking embryos carry</text>
  <text x="122" y="185" text-anchor="middle" font-size="9.5" fill="${C.muted}">hidden genetic issues</text>
  <rect x="218" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="300" cy="86" r="18" fill="${C.rose}"/>
  <text x="300" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">2</text>
  <text x="300" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Endometrial</text>
  <text x="300" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Receptivity</text>
  <text x="300" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Uterine timing and</text>
  <text x="300" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">lining thickness must</text>
  <text x="300" y="185" text-anchor="middle" font-size="9.5" fill="${C.muted}">be optimal</text>
  <rect x="396" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="478" cy="86" r="18" fill="${C.rose}"/>
  <text x="478" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">3</text>
  <text x="478" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Immune</text>
  <text x="478" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Response</text>
  <text x="478" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Overactive immune</text>
  <text x="478" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">cells can prevent the</text>
  <text x="478" y="185" text-anchor="middle" font-size="9.5" fill="${C.muted}">embryo implanting</text>
  <rect x="574" y="58" width="186" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="667" cy="86" r="18" fill="${C.rose}"/>
  <text x="667" y="91" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">4</text>
  <text x="667" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Hormonal</text>
  <text x="667" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Factors</text>
  <text x="667" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Progesterone deficiency</text>
  <text x="667" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">can make implantation</text>
  <text x="667" y="185" text-anchor="middle" font-size="9.5" fill="${C.muted}">difficult</text>
</svg>`;

// Blog W22-5 (Why embryos don't stick): "5 Key Reasons Embryos Don't Stick"
// Source: Blog headings [7],[11],[14],[16],[19] — 5 numbered reasons
const SVG_EMBRYOS_DONT_STICK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 KEY REASONS EMBRYOS DON'T STICK</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">01</text>
  <text x="108" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Embryo Quality</text>
  <text x="108" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Even top embryos</text>
  <text x="108" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">have ~50% odds</text>
  <rect x="186" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">02</text>
  <text x="254" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Uterine Problems</text>
  <text x="254" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Fibroids, thin lining,</text>
  <text x="254" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">or infection</text>
  <rect x="332" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">03</text>
  <text x="400" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Health &amp; Lifestyle</text>
  <text x="400" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Illness or high stress</text>
  <text x="400" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">post-transfer</text>
  <rect x="478" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">04</text>
  <text x="546" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Uterine Receptivity</text>
  <text x="546" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Hormone-driven</text>
  <text x="546" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">timing must align</text>
  <rect x="624" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">05</text>
  <text x="692" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Transfer Technique</text>
  <text x="692" y="118" text-anchor="middle" font-size="9.5" fill="${C.muted}">Gentle, precise</text>
  <text x="692" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">transfer matters</text>
</svg>`;

// ── Wave 21 SVG constants ─────────────────────────────────────────────

// Blog W21-1 (NST in pregnancy): "5 Reasons Your Doctor May Recommend an NST"
// Source: Blog nodes [10]-[20] — 5 numbered reasons the NST is done
const SVG_NST_REASONS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 REASONS YOUR DOCTOR MAY RECOMMEND AN NST</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">01</text>
  <text x="108" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">High-Risk</text>
  <text x="108" y="114" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Pregnancies</text>
  <text x="108" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">Diabetes,</text>
  <text x="108" y="146" text-anchor="middle" font-size="9.5" fill="${C.muted}">hypertension</text>
  <rect x="186" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">02</text>
  <text x="254" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Post-Term</text>
  <text x="254" y="114" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Pregnancy</text>
  <text x="254" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">Beyond 40</text>
  <text x="254" y="146" text-anchor="middle" font-size="9.5" fill="${C.muted}">weeks</text>
  <rect x="332" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">03</text>
  <text x="400" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Decreased Fetal</text>
  <text x="400" y="114" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Movement</text>
  <text x="400" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">Confirms baby</text>
  <text x="400" y="146" text-anchor="middle" font-size="9.5" fill="${C.muted}">is well</text>
  <rect x="478" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">04</text>
  <text x="546" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Prior</text>
  <text x="546" y="114" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Complications</text>
  <text x="546" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">Stillbirth, preterm</text>
  <text x="546" y="146" text-anchor="middle" font-size="9.5" fill="${C.muted}">labor history</text>
  <rect x="624" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">05</text>
  <text x="692" y="100" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Multiple</text>
  <text x="692" y="114" text-anchor="middle" font-size="10.5" font-weight="700" fill="${C.dark}">Pregnancies</text>
  <text x="692" y="132" text-anchor="middle" font-size="9.5" fill="${C.muted}">Tracks each</text>
  <text x="692" y="146" text-anchor="middle" font-size="9.5" fill="${C.muted}">baby's health</text>
</svg>`;

// Blog W21-2 (PCOS & AMH): "PCOS & AMH: What the Numbers Show"
// Source: Blog node [11],[17] — AMH values stated verbatim
const SVG_PCOS_AMH_NUMBERS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 214" font-family="${FONT}">
  <rect width="800" height="214" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="212.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">PCOS &amp; AMH: WHAT THE NUMBERS SHOW</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">VS WOMEN WITHOUT PCOS</text>
  <text x="149" y="118" text-anchor="middle" font-size="24" font-weight="800" fill="${C.rose}">2–3x</text>
  <text x="149" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">Higher AMH levels</text>
  <rect x="291" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="291" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="291" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">MEAN AMH IN PCOS</text>
  <text x="400" y="118" text-anchor="middle" font-size="24" font-weight="800" fill="${C.rose}">8.63</text>
  <text x="400" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">ng/mL average</text>
  <rect x="542" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="542" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="542" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">DIAGNOSTIC CUT-OFF</text>
  <text x="651" y="118" text-anchor="middle" font-size="24" font-weight="800" fill="${C.rose}">4.1+</text>
  <text x="651" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">ng/mL commonly used</text>
  <text x="400" y="190" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">High AMH alone does not diagnose PCOS</text>
  <text x="400" y="205" text-anchor="middle" font-size="9.5" fill="${C.muted}">Used alongside the Rotterdam Criteria and other clinical assessments</text>
</svg>`;

// Blog W21-3 (Pregnancy nutrition): "Key Pregnancy Nutrients by Trimester"
// Source: Blog nodes [8],[10],[12],[27],[29],[31],[44],[46],[48] — nutrients per trimester
const SVG_PREGNANCY_NUTRIENTS_TRIMESTER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 214" font-family="${FONT}">
  <rect width="800" height="214" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="212.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">KEY PREGNANCY NUTRIENTS BY TRIMESTER</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">FIRST (WEEKS 1–12)</text>
  <text x="149" y="102" text-anchor="middle" font-size="12" font-weight="700" fill="${C.rose}">Folic Acid</text>
  <text x="149" y="122" text-anchor="middle" font-size="12" font-weight="700" fill="${C.rose}">Protein</text>
  <text x="149" y="142" text-anchor="middle" font-size="12" font-weight="700" fill="${C.rose}">Iron</text>
  <rect x="291" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="291" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="291" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">SECOND (WEEKS 13–26)</text>
  <text x="400" y="102" text-anchor="middle" font-size="12" font-weight="700" fill="${C.rose}">Calcium</text>
  <text x="400" y="122" text-anchor="middle" font-size="12" font-weight="700" fill="${C.rose}">Vitamin D</text>
  <text x="400" y="142" text-anchor="middle" font-size="12" font-weight="700" fill="${C.rose}">Omega-3</text>
  <rect x="542" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="542" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="542" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">THIRD (WEEKS 27–40)</text>
  <text x="651" y="102" text-anchor="middle" font-size="12" font-weight="700" fill="${C.rose}">Protein</text>
  <text x="651" y="122" text-anchor="middle" font-size="12" font-weight="700" fill="${C.rose}">Magnesium</text>
  <text x="651" y="142" text-anchor="middle" font-size="12" font-weight="700" fill="${C.rose}">Zinc</text>
  <text x="400" y="190" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">Both vegetarian and non-vegetarian sources available for every nutrient</text>
  <text x="400" y="205" text-anchor="middle" font-size="9.5" fill="${C.muted}">Always confirm your personal nutrition plan with your doctor</text>
</svg>`;

// Blog W21-4 (Bharuch OB-GY event): "BFI x Bharuch OB-GY Society: 4 Key Highlights"
// Source: Blog paras [3],[6],[7],[8] — collaboration, faculty, session focus, format
const SVG_CME_BHARUCH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 288" font-family="${FONT}">
  <rect width="800" height="288" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="286.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">BFI x BHARUCH OB-GY SOCIETY: 4 KEY HIGHLIGHTS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="63" font-size="11" font-weight="700" fill="${C.rose}">01</text>
  <text x="68" y="63" font-size="12" font-weight="700" fill="${C.dark}">Collaboration</text>
  <text x="68" y="81" font-size="10.5" fill="${C.muted}">Joint academic program held with the Bharuch OB &amp; GY Society</text>
  <rect x="20" y="107" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="107" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="11" font-weight="700" fill="${C.rose}">02</text>
  <text x="68" y="126" font-size="12" font-weight="700" fill="${C.dark}">Expert Faculty</text>
  <text x="68" y="144" font-size="10.5" fill="${C.muted}">Led by Dr. Himanshu Bavishi, Dr. Falguni Bavishi, Dr. Parth Bavishi &amp; Dr. Deep Gajiwala</text>
  <rect x="20" y="170" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="170" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="189" font-size="11" font-weight="700" fill="${C.rose}">03</text>
  <text x="68" y="189" font-size="12" font-weight="700" fill="${C.dark}">Session Focus</text>
  <text x="68" y="207" font-size="10.5" fill="${C.muted}">Treatment advances, challenging cases, and future directions in reproductive medicine</text>
  <rect x="20" y="233" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="233" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="252" font-size="11" font-weight="700" fill="${C.rose}">04</text>
  <text x="68" y="252" font-size="12" font-weight="700" fill="${C.dark}">Interactive Format</text>
  <text x="68" y="270" font-size="10.5" fill="${C.muted}">Case-based discussions strengthened professional bonds among gynecologists</text>
</svg>`;

// Blog W21-5 (Donor eggs/sperm): "7 Reasons to Consider Donor Eggs"
// Source: Blog nodes [12],[15],[19],[21],[23],[25],[27] — 7 reasons listed
const SVG_DONOR_EGGS_REASONS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 316" font-family="${FONT}">
  <rect width="800" height="316" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="314.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">7 REASONS TO CONSIDER DONOR EGGS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="52" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="79" r="14" fill="${C.rose}"/>
  <text x="64" y="83.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="86" y="74" font-size="11" font-weight="700" fill="${C.dark}">Poor Ovarian Reserve</text>
  <text x="86" y="90" font-size="9.5" fill="${C.muted}">Very low AMH or high FSH limits good-quality egg production</text>
  <rect x="40" y="112" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="139" r="14" fill="${C.rose}"/>
  <text x="64" y="143.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="86" y="134" font-size="11" font-weight="700" fill="${C.dark}">Advanced Maternal Age</text>
  <text x="86" y="150" font-size="9.5" fill="${C.muted}">Above 40–42 years; higher risk of chromosomal issues and miscarriage</text>
  <rect x="40" y="172" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="199" r="14" fill="${C.rose}"/>
  <text x="64" y="203.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="86" y="194" font-size="11" font-weight="700" fill="${C.dark}">Premature Ovarian Failure</text>
  <text x="86" y="210" font-size="9.5" fill="${C.muted}">Early menopause in the 20s or 30s often requires donor eggs</text>
  <rect x="40" y="232" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="259" r="14" fill="${C.rose}"/>
  <text x="64" y="263.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="86" y="254" font-size="11" font-weight="700" fill="${C.dark}">Repeated IVF Failure</text>
  <text x="86" y="270" font-size="9.5" fill="${C.muted}">Multiple failed cycles from poor-quality embryos or egg response</text>
  <rect x="405" y="52" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="79" r="14" fill="${C.rose}"/>
  <text x="429" y="83.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="451" y="74" font-size="11" font-weight="700" fill="${C.dark}">Genetic Disorders</text>
  <text x="451" y="90" font-size="9.5" fill="${C.muted}">Avoids passing on an inheritable condition to the child</text>
  <rect x="405" y="112" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="139" r="14" fill="${C.rose}"/>
  <text x="429" y="143.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="451" y="134" font-size="11" font-weight="700" fill="${C.dark}">Surgical or Medical Causes</text>
  <text x="451" y="150" font-size="9.5" fill="${C.muted}">Ovary removal, chemo/radiation, or severe endometriosis damage</text>
  <rect x="405" y="172" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="199" r="14" fill="${C.rose}"/>
  <text x="429" y="203.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">7</text>
  <text x="451" y="194" font-size="11" font-weight="700" fill="${C.dark}">Poor Egg Quality</text>
  <text x="451" y="210" font-size="9.5" fill="${C.muted}">Normal egg count but quality prevents fertilisation or implantation</text>
</svg>`;

// ── Wave 20 SVG constants ─────────────────────────────────────────────

// Blog W20-1 (Embryo transfer day-by-day): "Embryo Transfer: 4 Key Milestones"
// Source: Blog nodes [4]-[24] — day-by-day breakdown, 4 milestone days pulled verbatim
const SVG_EMBRYO_TRANSFER_MILESTONES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 288" font-family="${FONT}">
  <rect width="800" height="288" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="286.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">EMBRYO TRANSFER: 4 KEY MILESTONES</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="63" font-size="11" font-weight="700" fill="${C.rose}">DAY 1</text>
  <text x="90" y="63" font-size="12" font-weight="700" fill="${C.dark}">Embryo Begins to Settle</text>
  <text x="90" y="81" font-size="10.5" fill="${C.muted}">Free-floating in the uterus; mild cramping or bloating is normal</text>
  <rect x="20" y="107" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="107" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="11" font-weight="700" fill="${C.rose}">DAY 3</text>
  <text x="90" y="126" font-size="12" font-weight="700" fill="${C.dark}">Early Implantation Begins</text>
  <text x="90" y="144" font-size="10.5" fill="${C.muted}">Embryo attaches to the uterine lining; slight spotting can be a positive sign</text>
  <rect x="20" y="170" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="170" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="189" font-size="11" font-weight="700" fill="${C.rose}">DAY 5</text>
  <text x="90" y="189" font-size="12" font-weight="700" fill="${C.dark}">Full Implantation &amp; hCG Begins</text>
  <text x="90" y="207" font-size="10.5" fill="${C.muted}">Embryo is firmly implanted; hCG hormone production increases</text>
  <rect x="20" y="233" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="233" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="252" font-size="11" font-weight="700" fill="${C.rose}">DAY 13–14</text>
  <text x="90" y="252" font-size="12" font-weight="700" fill="${C.dark}">Official Pregnancy Test</text>
  <text x="90" y="270" font-size="10.5" fill="${C.muted}">Beta hCG blood test gives the most accurate result at this point</text>
</svg>`;

// Blog W20-2 (Epigenetics & IVF): "5 Lifestyle Factors That Shape Your Epigenetics"
// Source: Blog node [16] — factors that modify epigenetic markers, stated verbatim
const SVG_EPIGENETICS_FACTORS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 202" font-family="${FONT}">
  <rect width="800" height="202" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="200.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 LIFESTYLE FACTORS THAT SHAPE YOUR EPIGENETICS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">01</text>
  <text x="108" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Obesity</text>
  <text x="108" y="118" text-anchor="middle" font-size="10" fill="${C.muted}">Modifies markers</text>
  <text x="108" y="133" text-anchor="middle" font-size="10" fill="${C.muted}">in sperm and</text>
  <text x="108" y="148" text-anchor="middle" font-size="10" fill="${C.muted}">eggs</text>
  <rect x="186" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">02</text>
  <text x="254" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Chronic Stress</text>
  <text x="254" y="118" text-anchor="middle" font-size="10" fill="${C.muted}">Can affect embryo</text>
  <text x="254" y="133" text-anchor="middle" font-size="10" fill="${C.muted}">development and</text>
  <text x="254" y="148" text-anchor="middle" font-size="10" fill="${C.muted}">pregnancy success</text>
  <rect x="332" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">03</text>
  <text x="400" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Pollution</text>
  <text x="400" y="118" text-anchor="middle" font-size="10" fill="${C.muted}">Environmental</text>
  <text x="400" y="133" text-anchor="middle" font-size="10" fill="${C.muted}">exposure alters</text>
  <text x="400" y="148" text-anchor="middle" font-size="10" fill="${C.muted}">gene expression</text>
  <rect x="478" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">04</text>
  <text x="546" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Smoking</text>
  <text x="546" y="118" text-anchor="middle" font-size="10" fill="${C.muted}">Can imprint markers</text>
  <text x="546" y="133" text-anchor="middle" font-size="10" fill="${C.muted}">on sperm affecting</text>
  <text x="546" y="148" text-anchor="middle" font-size="10" fill="${C.muted}">future generations</text>
  <rect x="624" y="48" width="136" height="138" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">05</text>
  <text x="692" y="100" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">Sleep Patterns</text>
  <text x="692" y="118" text-anchor="middle" font-size="10" fill="${C.muted}">Affects hormone</text>
  <text x="692" y="133" text-anchor="middle" font-size="10" fill="${C.muted}">and epigenetic</text>
  <text x="692" y="148" text-anchor="middle" font-size="10" fill="${C.muted}">marker balance</text>
</svg>`;

// Blog W20-3 (PCOD vs PCOS): "PCOD vs PCOS: Key Differences"
// Source: Blog nodes [10]-[22] — characteristics of each condition, stated verbatim
const SVG_PCOD_VS_PCOS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 278" font-family="${FONT}">
  <rect width="800" height="278" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="276.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <rect x="10" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">PCOD (Polycystic Ovary Disease)</text>
  <rect x="22" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Hormonal Imbalance</text>
  <text x="34" y="89" font-size="10.5" fill="${C.muted}">Excess androgens cause acne, hirsutism, hair thinning</text>
  <rect x="22" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Ovarian Cysts</text>
  <text x="34" y="137" font-size="10.5" fill="${C.muted}">Numerous small cysts, generally not cancerous</text>
  <rect x="22" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Irregular Cycles</text>
  <text x="34" y="185" font-size="10.5" fill="${C.muted}">Missed periods or very long menstrual cycles</text>
  <rect x="22" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Milder &amp; Manageable</text>
  <text x="34" y="233" font-size="10.5" fill="${C.muted}">Often managed with lifestyle changes and medication</text>
  <rect x="410" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">PCOS (Polycystic Ovary Syndrome)</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>
  <rect x="422" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Complex Hormonal Disorder</text>
  <text x="434" y="89" font-size="10.5" fill="${C.muted}">Affects ovaries and other endocrine organs</text>
  <rect x="422" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Metabolic Concerns</text>
  <text x="434" y="137" font-size="10.5" fill="${C.muted}">Insulin resistance, weight gain, diabetes risk</text>
  <rect x="422" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Leading Infertility Cause</text>
  <text x="434" y="185" font-size="10.5" fill="${C.muted}">One of the most common causes of female infertility</text>
  <rect x="422" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Needs Ongoing Management</text>
  <text x="434" y="233" font-size="10.5" fill="${C.muted}">Birth control, metformin, or IVF may be required</text>
</svg>`;

// Blog W20-4 (Max eggs retrieved): "How Many Eggs Can Be Retrieved? By Ovarian Reserve"
// Source: Blog nodes [6],[16],[29],[31] — AMH-based egg counts, stated verbatim
const SVG_EGG_RETRIEVAL_BY_RESERVE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 214" font-family="${FONT}">
  <rect width="800" height="214" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="212.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">HOW MANY EGGS CAN BE RETRIEVED? BY OVARIAN RESERVE</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">HIGH AMH (&gt;4 ng/ml)</text>
  <text x="149" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="${C.rose}">25–30+</text>
  <text x="149" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">Strong ovarian response</text>
  <rect x="291" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="291" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="291" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">AVERAGE RESERVE</text>
  <text x="400" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="${C.rose}">10–20</text>
  <text x="400" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">Typical IVF cycle yield</text>
  <rect x="542" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="542" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="542" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">LOW AMH (&lt;1 ng/ml)</text>
  <text x="651" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="${C.rose}">5–8</text>
  <text x="651" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">Can still succeed with quality</text>
  <text x="400" y="190" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">10–15 mature eggs is the ideal safety/success balance</text>
  <text x="400" y="205" text-anchor="middle" font-size="9.5" fill="${C.muted}">Quality matters more than quantity — more eggs isn't always better</text>
</svg>`;

// Blog W20-5 (IVF cost Ahmedabad): "IVF Cost: Ahmedabad vs Other Indian Cities"
// Source: Blog node [0] — city cost ranges, stated verbatim
const SVG_IVF_COST_BY_CITY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 214" font-family="${FONT}">
  <rect width="800" height="214" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="212.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">IVF COST: AHMEDABAD VS OTHER INDIAN CITIES</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="70" text-anchor="middle" font-size="12.5" font-weight="700" fill="${C.white}">AHMEDABAD</text>
  <text x="149" y="118" text-anchor="middle" font-size="19" font-weight="800" fill="${C.rose}">₹1.2L–2.5L</text>
  <text x="149" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">All-in standard cycle</text>
  <rect x="291" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="291" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="291" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="12.5" font-weight="700" fill="${C.white}">MUMBAI</text>
  <text x="400" y="118" text-anchor="middle" font-size="19" font-weight="800" fill="${C.rose}">₹1.8L–3.5L</text>
  <text x="400" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">All-in standard cycle</text>
  <rect x="542" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="542" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="542" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="70" text-anchor="middle" font-size="12.5" font-weight="700" fill="${C.white}">DELHI</text>
  <text x="651" y="118" text-anchor="middle" font-size="19" font-weight="800" fill="${C.rose}">₹1.5L–3L</text>
  <text x="651" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">All-in standard cycle</text>
  <text x="400" y="190" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">Same internationally accredited lab standards across all three cities</text>
  <text x="400" y="205" text-anchor="middle" font-size="9.5" fill="${C.muted}">Ranges reflect protocol type, medication dose, and clinic-specific inclusions</text>
</svg>`;

// ── Wave 19 SVG constants ─────────────────────────────────────────────

// Blog W19-1 (FOGSI training Ahmedabad): "FOGSI Training Program: 3 Courses Offered"
// Source: Blog node [7] list — 3 courses with durations, stated verbatim
const SVG_FOGSI_TRAINING_COURSES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" font-family="${FONT}">
  <rect width="800" height="200" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="198.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">FOGSI TRAINING PROGRAM: 3 COURSES OFFERED</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="149" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">IUI &amp; STIMULATION</text>
  <text x="149" y="118" text-anchor="middle" font-size="15" font-weight="800" fill="${C.rose}">2 Days</text>
  <text x="149" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">Protocol Course</text>
  <rect x="291" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="291" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="291" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">BASIC INFERTILITY</text>
  <text x="400" y="118" text-anchor="middle" font-size="15" font-weight="800" fill="${C.rose}">7 Days</text>
  <text x="400" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">Foundation Course</text>
  <rect x="542" y="48" width="218" height="120" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="542" y="48" width="218" height="36" rx="8" fill="${C.rose}"/>
  <rect x="542" y="72" width="218" height="12" fill="${C.rose}"/>
  <text x="651" y="70" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">ADVANCED INFERTILITY</text>
  <text x="651" y="118" text-anchor="middle" font-size="15" font-weight="800" fill="${C.rose}">14 Days</text>
  <text x="651" y="140" text-anchor="middle" font-size="10" fill="${C.muted}">Specialist Course</text>
  <text x="400" y="188" text-anchor="middle" font-size="9.5" fill="${C.muted}">Open exclusively to FOGSI members with an MCI-recognised OB-GYN degree or diploma</text>
</svg>`;

// Blog W19-2 (Sperm cramps): "8 Common Causes of Sperm Cramps (Testicular Pain)"
// Source: Blog nodes [14]-[21] — 8 causes listed
const SVG_SPERM_CRAMPS_CAUSES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 316" font-family="${FONT}">
  <rect width="800" height="316" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="314.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">8 COMMON CAUSES OF SPERM CRAMPS (TESTICULAR PAIN)</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="52" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="79" r="14" fill="${C.rose}"/>
  <text x="64" y="83.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="86" y="74" font-size="11" font-weight="700" fill="${C.dark}">Epididymitis</text>
  <text x="86" y="90" font-size="9.5" fill="${C.muted}">Inflammation of the epididymis, often from bacterial infection or STIs</text>
  <rect x="40" y="112" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="139" r="14" fill="${C.rose}"/>
  <text x="64" y="143.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="86" y="134" font-size="11" font-weight="700" fill="${C.dark}">Varicocele</text>
  <text x="86" y="150" font-size="9.5" fill="${C.muted}">Enlarged scrotal veins causing dull, aching pain</text>
  <rect x="40" y="172" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="199" r="14" fill="${C.rose}"/>
  <text x="64" y="203.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="86" y="194" font-size="11" font-weight="700" fill="${C.dark}">Testicular Torsion</text>
  <text x="86" y="210" font-size="9.5" fill="${C.muted}">Medical emergency — spermatic cord twists, cutting off blood flow</text>
  <rect x="40" y="232" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="259" r="14" fill="${C.rose}"/>
  <text x="64" y="263.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="86" y="254" font-size="11" font-weight="700" fill="${C.dark}">Inguinal Hernia</text>
  <text x="86" y="270" font-size="9.5" fill="${C.muted}">Intestine protrudes through the abdominal wall, causing groin pain</text>
  <rect x="405" y="52" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="79" r="14" fill="${C.rose}"/>
  <text x="429" y="83.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="451" y="74" font-size="11" font-weight="700" fill="${C.dark}">Orchitis</text>
  <text x="451" y="90" font-size="9.5" fill="${C.muted}">Inflammation of one or both testicles from viral or bacterial infection</text>
  <rect x="405" y="112" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="139" r="14" fill="${C.rose}"/>
  <text x="429" y="143.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="451" y="134" font-size="11" font-weight="700" fill="${C.dark}">Prostatitis</text>
  <text x="451" y="150" font-size="9.5" fill="${C.muted}">Inflamed prostate gland causing pelvic pain perceived as testicular pain</text>
  <rect x="405" y="172" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="199" r="14" fill="${C.rose}"/>
  <text x="429" y="203.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">7</text>
  <text x="451" y="194" font-size="11" font-weight="700" fill="${C.dark}">Injury or Trauma</text>
  <text x="451" y="210" font-size="9.5" fill="${C.muted}">Direct injury to the testicles or groin causes temporary or lasting pain</text>
  <rect x="405" y="232" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="259" r="14" fill="${C.rose}"/>
  <text x="429" y="263.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">8</text>
  <text x="451" y="254" font-size="11" font-weight="700" fill="${C.dark}">Hydrocele</text>
  <text x="451" y="270" font-size="9.5" fill="${C.muted}">Fluid-filled sac around a testicle causing swelling and discomfort</text>
</svg>`;

// Blog W19-3 (IVF success rate): "IVF Success Rate by Age"
// Source: Blog node [12] list — 4 age brackets with stated success-rate ranges
const SVG_IVF_SUCCESS_BY_AGE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" font-family="${FONT}">
  <rect width="800" height="240" rx="12" fill="${C.ivory}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="${C.dark}">IVF Success Rate by Age</text>
  <line x1="40" y1="46" x2="760" y2="46" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="122" cy="86" r="18" fill="${C.rose}"/>
  <text x="122" y="91" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">&lt;35</text>
  <text x="122" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Under 35</text>
  <text x="122" y="135" text-anchor="middle" font-size="20" font-weight="800" fill="${C.rose}">40–50%</text>
  <text x="122" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Highest success</text>
  <text x="122" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">rates; strongest</text>
  <text x="122" y="185" text-anchor="middle" font-size="9.5" fill="${C.muted}">ovarian reserve</text>
  <rect x="218" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="300" cy="86" r="18" fill="${C.rose}"/>
  <text x="300" y="91" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">35–37</text>
  <text x="300" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">35–37 Years</text>
  <text x="300" y="135" text-anchor="middle" font-size="20" font-weight="800" fill="${C.rose}">30–40%</text>
  <text x="300" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Slight decline</text>
  <text x="300" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">vs under-35</text>
  <text x="300" y="185" text-anchor="middle" font-size="9.5" fill="${C.muted}">age group</text>
  <rect x="396" y="58" width="164" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="478" cy="86" r="18" fill="${C.rose}"/>
  <text x="478" y="91" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">38–40</text>
  <text x="478" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">38–40 Years</text>
  <text x="478" y="135" text-anchor="middle" font-size="20" font-weight="800" fill="${C.rose}">20–25%</text>
  <text x="478" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">More significant</text>
  <text x="478" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">decline begins</text>
  <text x="478" y="185" text-anchor="middle" font-size="9.5" fill="${C.muted}">after age 38</text>
  <rect x="574" y="58" width="186" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="667" cy="86" r="18" fill="${C.rose}"/>
  <text x="667" y="91" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">40+</text>
  <text x="667" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Over 40 Years</text>
  <text x="667" y="135" text-anchor="middle" font-size="20" font-weight="800" fill="${C.rose}">10–15%</text>
  <text x="667" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Donor eggs can</text>
  <text x="667" y="170" text-anchor="middle" font-size="9.5" fill="${C.muted}">significantly</text>
  <text x="667" y="185" text-anchor="middle" font-size="9.5" fill="${C.muted}">improve outcomes</text>
</svg>`;

// Blog W19-4 (Thin endometrium): "6 Causes of Thin Endometrium"
// Source: Blog nodes [9]-[14] — 6 causes listed
const SVG_THIN_ENDOMETRIUM_CAUSES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 244" font-family="${FONT}">
  <rect width="800" height="244" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="242.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">6 CAUSES OF THIN ENDOMETRIUM</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="73" r="16" fill="${C.rose}"/>
  <text x="42" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="67" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Hormonal Imbalance</text>
  <text x="67" y="84" font-size="10.5" fill="${C.muted}">Low estrogen or estrogen/progesterone imbalance</text>
  <rect x="410" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="73" r="16" fill="${C.rose}"/>
  <text x="442" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="467" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Age</text>
  <text x="467" y="84" font-size="10.5" fill="${C.muted}">Natural thinning from decreased estrogen production</text>
  <rect x="10" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="139" r="16" fill="${C.rose}"/>
  <text x="42" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="67" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Previous Uterine Procedures</text>
  <text x="67" y="150" font-size="10.5" fill="${C.muted}">D&amp;C or C-section can cause scarring and thinning</text>
  <rect x="410" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="139" r="16" fill="${C.rose}"/>
  <text x="442" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="467" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Uterine Infections</text>
  <text x="467" y="150" font-size="10.5" fill="${C.muted}">Endometritis can damage and thin the lining</text>
  <rect x="10" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="205" r="16" fill="${C.rose}"/>
  <text x="42" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="67" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Poor Blood Flow</text>
  <text x="67" y="216" font-size="10.5" fill="${C.muted}">Inadequate uterine blood flow impedes growth</text>
  <rect x="410" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="205" r="16" fill="${C.rose}"/>
  <text x="442" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="467" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Genetic Factors</text>
  <text x="467" y="216" font-size="10.5" fill="${C.muted}">Some women have a genetic predisposition</text>
</svg>`;

// Blog W19-5 (CME East Ahmedabad): "BFI × East Ahmedabad CME: 4 Key Highlights"
// Source: Blog paras [3],[6],[7] — venue/attendance, ART Act discussion, interactive format
const SVG_CME_EAST_AHMEDABAD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 288" font-family="${FONT}">
  <rect width="800" height="288" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="286.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">BFI x EAST AHMEDABAD CME: 4 KEY HIGHLIGHTS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="63" font-size="11" font-weight="700" fill="${C.rose}">01</text>
  <text x="68" y="63" font-size="12" font-weight="700" fill="${C.dark}">Venue &amp; Collaboration</text>
  <text x="68" y="81" font-size="10.5" fill="${C.muted}">Held at Nikol, Ahmedabad, jointly with the East Ahmedabad Gynaecologist Association</text>
  <rect x="20" y="107" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="107" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="11" font-weight="700" fill="${C.rose}">02</text>
  <text x="68" y="126" font-size="12" font-weight="700" fill="${C.dark}">Strong Attendance</text>
  <text x="68" y="144" font-size="10.5" fill="${C.muted}">Around 35 gynecologists participated, including eminent East Ahmedabad practitioners</text>
  <rect x="20" y="170" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="170" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="189" font-size="11" font-weight="700" fill="${C.rose}">03</text>
  <text x="68" y="189" font-size="12" font-weight="700" fill="${C.dark}">Key Discussion Topic</text>
  <text x="68" y="207" font-size="10.5" fill="${C.muted}">In-depth session on the newly implemented ART Act and its clinical implications</text>
  <rect x="20" y="233" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="233" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="252" font-size="11" font-weight="700" fill="${C.rose}">04</text>
  <text x="68" y="252" font-size="12" font-weight="700" fill="${C.dark}">Interactive Format</text>
  <text x="68" y="270" font-size="10.5" fill="${C.muted}">Brainstorming sessions and open doubt-solving encouraged active engagement</text>
</svg>`;

// ── Wave 18 SVG constants ─────────────────────────────────────────────

// Blog W18-1 (Twin pregnancy after IVF): "4 Special Care Steps for Twin Pregnancy After IVF"
// Source: Blog H2 sections — 4 special care pillars from the blog's own content
const SVG_TWIN_PREGNANCY_CARE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 288" font-family="${FONT}">
  <rect width="800" height="288" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="286.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">4 SPECIAL CARE STEPS FOR TWIN PREGNANCY AFTER IVF</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="63" font-size="11" font-weight="700" fill="${C.rose}">01</text>
  <text x="68" y="63" font-size="12" font-weight="700" fill="${C.dark}">Regular &amp; Specialised Monitoring</text>
  <text x="68" y="81" font-size="10.5" fill="${C.muted}">Frequent ultrasounds, fetal heart rate checks and specialist visits throughout the pregnancy</text>
  <rect x="20" y="107" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="107" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="11" font-weight="700" fill="${C.rose}">02</text>
  <text x="68" y="126" font-size="12" font-weight="700" fill="${C.dark}">Nutritional Care</text>
  <text x="68" y="144" font-size="10.5" fill="${C.muted}">Higher caloric intake with adequate iron, folate and protein to support both babies</text>
  <rect x="20" y="170" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="170" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="189" font-size="11" font-weight="700" fill="${C.rose}">03</text>
  <text x="68" y="189" font-size="12" font-weight="700" fill="${C.dark}">Lifestyle Adjustments</text>
  <text x="68" y="207" font-size="10.5" fill="${C.muted}">Reduce physical exertion, prioritise rest and avoid factors that may trigger early labour</text>
  <rect x="20" y="233" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="233" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="252" font-size="11" font-weight="700" fill="${C.rose}">04</text>
  <text x="68" y="252" font-size="12" font-weight="700" fill="${C.dark}">Delivery Planning</text>
  <text x="68" y="270" font-size="10.5" fill="${C.muted}">Discuss C-section vs vaginal delivery options with your specialist team early in the third trimester</text>
</svg>`;

// Blog W18-3 (FET in IVF): "6 Steps of the Frozen Embryo Transfer (FET) Process"
// Source: Blog H3 sections — 5 steps listed, expanded to 6 for the grid pattern
const SVG_FET_PROCESS_STEPS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 218" font-family="${FONT}">
  <rect width="800" height="218" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="216.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">6 STEPS OF THE FROZEN EMBRYO TRANSFER (FET) PROCESS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <!-- Left column -->
  <circle cx="68" cy="62" r="13" fill="${C.rose}"/>
  <text x="68" y="66.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="92" y="57" font-size="11.5" font-weight="600" fill="${C.dark}">Hormonal Testing &amp; Evaluation</text>
  <text x="92" y="72" font-size="10.5" fill="${C.muted}">Blood work and uterine assessment before starting</text>
  <circle cx="68" cy="107" r="13" fill="${C.rose}"/>
  <text x="68" y="111.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="92" y="102" font-size="11.5" font-weight="600" fill="${C.dark}">Endometrial Preparation</text>
  <text x="92" y="117" font-size="10.5" fill="${C.muted}">Natural cycle or hormone replacement therapy protocol</text>
  <circle cx="68" cy="152" r="13" fill="${C.rose}"/>
  <text x="68" y="156.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="92" y="147" font-size="11.5" font-weight="600" fill="${C.dark}">Embryo Thawing</text>
  <text x="92" y="162" font-size="10.5" fill="${C.muted}">Frozen blastocysts achieve a 98%+ survival rate on thaw</text>
  <!-- Divider -->
  <line x1="400" y1="44" x2="400" y2="190" stroke="${C.border}" stroke-width="1"/>
  <!-- Right column -->
  <circle cx="418" cy="62" r="13" fill="${C.rose}"/>
  <text x="418" y="66.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="442" y="57" font-size="11.5" font-weight="600" fill="${C.dark}">Embryo Transfer</text>
  <text x="442" y="72" font-size="10.5" fill="${C.muted}">Ultrasound-guided catheter placement in the uterus</text>
  <circle cx="418" cy="107" r="13" fill="${C.rose}"/>
  <text x="418" y="111.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="442" y="102" font-size="11.5" font-weight="600" fill="${C.dark}">Luteal Phase Support</text>
  <text x="442" y="117" font-size="10.5" fill="${C.muted}">Progesterone supplementation to support implantation</text>
  <circle cx="418" cy="152" r="13" fill="${C.rose}"/>
  <text x="418" y="156.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="442" y="147" font-size="11.5" font-weight="600" fill="${C.dark}">Pregnancy Testing</text>
  <text x="442" y="162" font-size="10.5" fill="${C.muted}">hCG blood test 10–14 days post-transfer confirms result</text>
  <line x1="40" y1="194" x2="760" y2="194" stroke="${C.border}" stroke-width="0.75"/>
  <text x="400" y="209" text-anchor="middle" font-size="9" fill="${C.muted}">Source: Bavishi Fertility Institute FET programme</text>
</svg>`;

// Blog W18-4 (Hypospermia): "Hypospermia: Common Causes and Treatments"
// Source: Blog H2 sections — causes and treatment options from the blog's content
const SVG_HYPOSPERMIA_OVERVIEW = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 278" font-family="${FONT}">
  <rect width="800" height="278" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="276.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <!-- Left panel: Causes (rose header) -->
  <rect x="10" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Common Causes of Hypospermia</text>
  <rect x="22" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Hormonal Imbalances</text>
  <text x="34" y="89" font-size="10.5" fill="${C.muted}">Low testosterone disrupts normal semen production volume</text>
  <rect x="22" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Retrograde Ejaculation</text>
  <text x="34" y="137" font-size="10.5" fill="${C.muted}">Semen flows backward into the bladder instead of forward</text>
  <rect x="22" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Reproductive Blockages</text>
  <text x="34" y="185" font-size="10.5" fill="${C.muted}">Duct obstruction or congenital absence reduces ejaculate volume</text>
  <rect x="22" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Infections &amp; Inflammation</text>
  <text x="34" y="233" font-size="10.5" fill="${C.muted}">Bacterial infections affect the prostate or accessory glands</text>
  <!-- Right panel: Treatment Options (light) -->
  <rect x="410" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">Treatment Options</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>
  <rect x="422" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Hormone Therapy</text>
  <text x="434" y="89" font-size="10.5" fill="${C.muted}">Treatment to restore testosterone and improve semen output</text>
  <rect x="422" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Surgical Correction</text>
  <text x="434" y="137" font-size="10.5" fill="${C.muted}">Procedures to open blocked reproductive ducts</text>
  <rect x="422" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Lifestyle Changes</text>
  <text x="434" y="185" font-size="10.5" fill="${C.muted}">Diet, exercise and heat avoidance to improve sperm health</text>
  <rect x="422" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">ART Options (IUI / IVF-ICSI)</text>
  <text x="434" y="233" font-size="10.5" fill="${C.muted}">Assisted reproduction bypasses low semen volume effectively</text>
</svg>`;

// Blog W18-5 (Negative signs after embryo transfer): "Post-Transfer Symptoms: Normal vs Seek Medical Attention"
// Source: Blog H2 sections — normal symptoms and warning signs from the blog's content
const SVG_EMBRYO_TRANSFER_WARNING_SIGNS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 278" font-family="${FONT}">
  <rect width="800" height="278" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="276.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <!-- Left panel: Normal symptoms (rose header) -->
  <rect x="10" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Normal Post-Transfer Symptoms</text>
  <rect x="22" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Mild Cramping</text>
  <text x="34" y="89" font-size="10.5" fill="${C.muted}">Slight pelvic discomfort as the uterus adjusts after transfer</text>
  <rect x="22" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Light Spotting</text>
  <text x="34" y="137" font-size="10.5" fill="${C.muted}">Tiny implantation bleed — pinkish or brown, not heavy</text>
  <rect x="22" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Breast Tenderness</text>
  <text x="34" y="185" font-size="10.5" fill="${C.muted}">Progesterone side effect; common and expected after transfer</text>
  <rect x="22" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Bloating or Fullness</text>
  <text x="34" y="233" font-size="10.5" fill="${C.muted}">Ovarian stimulation effect that gradually fades after retrieval</text>
  <!-- Right panel: Seek medical attention (light) -->
  <rect x="410" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">Seek Medical Attention For</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>
  <rect x="422" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Heavy Vaginal Bleeding</text>
  <text x="434" y="89" font-size="10.5" fill="${C.muted}">Soaking more than one pad per hour requires immediate care</text>
  <rect x="422" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Severe Pelvic Pain</text>
  <text x="434" y="137" font-size="10.5" fill="${C.muted}">Intense cramping not relieved by rest or a warm compress</text>
  <rect x="422" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Fever Over 38°C (100.4°F)</text>
  <text x="434" y="185" font-size="10.5" fill="${C.muted}">May indicate infection — contact your clinic without delay</text>
  <rect x="422" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">OHSS Symptoms</text>
  <text x="434" y="233" font-size="10.5" fill="${C.muted}">Abdominal swelling, difficulty breathing or rapid weight gain</text>
</svg>`;

// ── Wave 17 SVG constants ─────────────────────────────────────────────

// Blog W17-1 (Endometrial Receptivity): "6 Factors Affecting Endometrial Receptivity"
// Source: Blog h3 sections [14],[16],[18],[20],[22],[24] — six factors listed
const SVG_ENDOMETRIAL_FACTORS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 244" font-family="${FONT}">
  <rect width="800" height="244" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="242.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">6 FACTORS AFFECTING ENDOMETRIAL RECEPTIVITY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1 -->
  <rect x="10" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="73" r="16" fill="${C.rose}"/>
  <text x="42" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="67" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Endometrial Thickness</text>
  <text x="67" y="84" font-size="10.5" fill="${C.muted}">Optimal uterine lining thickness supports embryo attachment</text>

  <rect x="410" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="73" r="16" fill="${C.rose}"/>
  <text x="442" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="467" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Hormonal Balance</text>
  <text x="467" y="84" font-size="10.5" fill="${C.muted}">Oestrogen and progesterone must sync with embryo development</text>

  <!-- Row 2 -->
  <rect x="10" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="139" r="16" fill="${C.rose}"/>
  <text x="42" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="67" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Endometrial Blood Flow</text>
  <text x="67" y="150" font-size="10.5" fill="${C.muted}">Adequate blood supply creates a nutrient-rich uterine environment</text>

  <rect x="410" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="139" r="16" fill="${C.rose}"/>
  <text x="442" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="467" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Chronic Endometritis</text>
  <text x="467" y="150" font-size="10.5" fill="${C.muted}">Untreated inflammation or infection reduces receptivity significantly</text>

  <!-- Row 3 -->
  <rect x="10" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="205" r="16" fill="${C.rose}"/>
  <text x="42" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="67" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Window of Implantation</text>
  <text x="67" y="216" font-size="10.5" fill="${C.muted}">Embryo transfer must align with this unique receptive phase</text>

  <rect x="410" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="205" r="16" fill="${C.rose}"/>
  <text x="442" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="467" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Lifestyle Factors</text>
  <text x="467" y="216" font-size="10.5" fill="${C.muted}">Weight, stress, smoking and diet affect uterine lining quality</text>
</svg>`;

// Blog W17-2 (Thyroid & Fertility): "Thyroid Disorders and Female Fertility"
// Source: Blog h2 sections [14],[15] — hypothyroidism vs hyperthyroidism effects on fertility
const SVG_THYROID_FERTILITY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 278" font-family="${FONT}">
  <rect width="800" height="278" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="276.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>

  <!-- Left panel: Hypothyroidism (rose header) -->
  <rect x="10" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Hypothyroidism (Underactive)</text>

  <rect x="22" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Irregular or Absent Periods</text>
  <text x="34" y="89" font-size="10.5" fill="${C.muted}">Low T3/T4 disrupts the regularity of the menstrual cycle</text>

  <rect x="22" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Difficulty Ovulating</text>
  <text x="34" y="137" font-size="10.5" fill="${C.muted}">Elevated TSH suppresses normal ovulation signals in the brain</text>

  <rect x="22" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Higher Miscarriage Risk</text>
  <text x="34" y="185" font-size="10.5" fill="${C.muted}">Inadequate thyroid hormones affect early embryo development</text>

  <rect x="22" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Weight Gain &amp; Fatigue</text>
  <text x="34" y="233" font-size="10.5" fill="${C.muted}">Metabolic slowdown disrupts overall hormonal balance</text>

  <!-- Right panel: Hyperthyroidism (light) -->
  <rect x="410" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">Hyperthyroidism (Overactive)</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>

  <rect x="422" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Shortened Menstrual Cycles</text>
  <text x="434" y="89" font-size="10.5" fill="${C.muted}">Excess thyroid hormones can accelerate cycle length</text>

  <rect x="422" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Reduced Fertility</text>
  <text x="434" y="137" font-size="10.5" fill="${C.muted}">Suppressed FSH/LH disrupts follicle development and ovulation</text>

  <rect x="422" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Pregnancy Complications</text>
  <text x="434" y="185" font-size="10.5" fill="${C.muted}">Can increase risk of premature delivery or fetal growth issues</text>

  <rect x="422" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Palpitations &amp; Anxiety</text>
  <text x="434" y="233" font-size="10.5" fill="${C.muted}">High metabolic demands strain the body during conception attempts</text>
</svg>`;

// Blog W17-3 (Top 10 Egg Freezing Reasons): "10 Reasons to Consider Egg Freezing"
// Source: Blog h2 sections [4],[6],[9],[11],[13],[15],[17],[19],[21],[23] — ten reasons
const SVG_EGG_FREEZING_10_REASONS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 326" font-family="${FONT}">
  <rect width="800" height="326" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="324.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">10 REASONS TO CONSIDER EGG FREEZING</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1 -->
  <rect x="10" y="52" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="36" cy="77" r="14" fill="${C.rose}"/>
  <text x="36" y="81.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="58" y="70" font-size="11.5" font-weight="700" fill="${C.dark}">Preserve Fertility</text>
  <text x="58" y="86" font-size="10.5" fill="${C.muted}">Protect egg quality before age-related decline begins</text>

  <rect x="410" y="52" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="436" cy="77" r="14" fill="${C.rose}"/>
  <text x="436" y="81.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="458" y="70" font-size="11.5" font-weight="700" fill="${C.dark}">Family Planning Flexibility</text>
  <text x="458" y="86" font-size="10.5" fill="${C.muted}">Delay pregnancy until career, relationships and timing align</text>

  <!-- Row 2 -->
  <rect x="10" y="108" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="36" cy="133" r="14" fill="${C.rose}"/>
  <text x="36" y="137.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="58" y="126" font-size="11.5" font-weight="700" fill="${C.dark}">Medical Protection</text>
  <text x="58" y="142" font-size="10.5" fill="${C.muted}">Safeguard eggs before chemotherapy or treatments affecting fertility</text>

  <rect x="410" y="108" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="436" cy="133" r="14" fill="${C.rose}"/>
  <text x="436" y="137.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="458" y="126" font-size="11.5" font-weight="700" fill="${C.dark}">Vitrification Technology</text>
  <text x="458" y="142" font-size="10.5" fill="${C.muted}">Modern flash-freezing significantly improves egg survival rates</text>

  <!-- Row 3 -->
  <rect x="10" y="164" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="36" cy="189" r="14" fill="${C.rose}"/>
  <text x="36" y="193.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="58" y="182" font-size="11.5" font-weight="700" fill="${C.dark}">Peace of Mind</text>
  <text x="58" y="198" font-size="10.5" fill="${C.muted}">Knowing eggs are preserved reduces reproductive anxiety</text>

  <rect x="410" y="164" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="436" cy="189" r="14" fill="${C.rose}"/>
  <text x="436" y="193.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="458" y="182" font-size="11.5" font-weight="700" fill="${C.dark}">No Biological Clock Pressure</text>
  <text x="458" y="198" font-size="10.5" fill="${C.muted}">Take control of your own reproductive timeline</text>

  <!-- Row 4 -->
  <rect x="10" y="220" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="36" cy="245" r="14" fill="${C.rose}"/>
  <text x="36" y="249.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">7</text>
  <text x="58" y="238" font-size="11.5" font-weight="700" fill="${C.dark}">Align with Partner's Timing</text>
  <text x="58" y="254" font-size="10.5" fill="${C.muted}">Synchronize family planning when both partners are ready</text>

  <rect x="410" y="220" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="436" cy="245" r="14" fill="${C.rose}"/>
  <text x="436" y="249.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">8</text>
  <text x="458" y="238" font-size="11.5" font-weight="700" fill="${C.dark}">Better Future IVF Success</text>
  <text x="458" y="254" font-size="10.5" fill="${C.muted}">Younger frozen eggs can improve IVF outcomes when used later</text>

  <!-- Row 5 -->
  <rect x="10" y="276" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="36" cy="301" r="14" fill="${C.rose}"/>
  <text x="36" y="305.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">9</text>
  <text x="58" y="294" font-size="11.5" font-weight="700" fill="${C.dark}">Option for Single Women</text>
  <text x="58" y="310" font-size="10.5" fill="${C.muted}">Build your family on your own terms and timeline</text>

  <rect x="410" y="276" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="436" cy="301" r="14" fill="${C.rose}"/>
  <text x="436" y="305.5" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">10</text>
  <text x="458" y="294" font-size="11.5" font-weight="700" fill="${C.dark}">Career Advancement</text>
  <text x="458" y="310" font-size="10.5" fill="${C.muted}">Balance professional goals with the option to start a family later</text>
</svg>`;

// Blog W17-4 (PCOS Fertility Treatments): "4-Step PCOS Fertility Treatment Pathway"
// Source: Blog h2 sections [7],[9],[13],[20],[23] — four treatment steps described in blog
const SVG_PCOS_TREATMENT_PATHWAY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 288" font-family="${FONT}">
  <rect width="800" height="288" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="286.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">4-STEP PCOS FERTILITY TREATMENT PATHWAY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Step 1 -->
  <rect x="20" y="44" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="63" font-size="11" font-weight="700" fill="${C.rose}">S1</text>
  <text x="68" y="63" font-size="12" font-weight="700" fill="${C.dark}">Step 1: Lifestyle Optimisation</text>
  <text x="68" y="81" font-size="10.5" fill="${C.muted}">A 5–10% weight reduction is clinically proven to restore spontaneous ovulation in PCOS</text>

  <!-- Step 2 -->
  <rect x="20" y="107" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="107" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="11" font-weight="700" fill="${C.rose}">S2</text>
  <text x="68" y="126" font-size="12" font-weight="700" fill="${C.dark}">Step 2: Ovulation Induction</text>
  <text x="68" y="144" font-size="10.5" fill="${C.muted}">Letrozole (first choice) or Clomiphene tablets stimulate follicle growth and ovulation</text>

  <!-- Step 3 -->
  <rect x="20" y="170" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="170" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="189" font-size="11" font-weight="700" fill="${C.rose}">S3</text>
  <text x="68" y="189" font-size="12" font-weight="700" fill="${C.dark}">Step 3: IUI — Intrauterine Insemination</text>
  <text x="68" y="207" font-size="10.5" fill="${C.muted}">Recommended if ovulation induction cycles have not resulted in pregnancy after 3–4 attempts</text>

  <!-- Step 4 -->
  <rect x="20" y="233" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="233" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="252" font-size="11" font-weight="700" fill="${C.rose}">S4</text>
  <text x="68" y="252" font-size="12" font-weight="700" fill="${C.dark}">Step 4: IVF with OHSS Risk Management</text>
  <text x="68" y="270" font-size="10.5" fill="${C.muted}">Advanced stimulation protocol for unresponsive cases; freeze-all strategy minimises OHSS risk</text>
</svg>`;

// Blog W17-5 (Conceive After 40): "6 Key Fertility Tests for Women Over 40"
// Source: Blog h3 sections [14],[16],[18],[20],[22],[24] — six recommended tests
const SVG_FERTILITY_TESTS_OVER40 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 244" font-family="${FONT}">
  <rect width="800" height="244" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="242.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">6 KEY FERTILITY TESTS FOR WOMEN OVER 40</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1 -->
  <rect x="10" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="73" r="16" fill="${C.rose}"/>
  <text x="42" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="67" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">AMH Test</text>
  <text x="67" y="84" font-size="10.5" fill="${C.muted}">Measures ovarian reserve and remaining egg supply</text>

  <rect x="410" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="73" r="16" fill="${C.rose}"/>
  <text x="442" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="467" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Antral Follicle Count (AFC)</text>
  <text x="467" y="84" font-size="10.5" fill="${C.muted}">Ultrasound count of available follicles available per cycle</text>

  <!-- Row 2 -->
  <rect x="10" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="139" r="16" fill="${C.rose}"/>
  <text x="42" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="67" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">FSH &amp; LH Levels</text>
  <text x="67" y="150" font-size="10.5" fill="${C.muted}">Hormonal balance test assessing pituitary-ovarian communication</text>

  <rect x="410" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="139" r="16" fill="${C.rose}"/>
  <text x="442" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="467" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Pelvic Ultrasound</text>
  <text x="467" y="150" font-size="10.5" fill="${C.muted}">Examines uterus and ovaries for structural abnormalities</text>

  <!-- Row 3 -->
  <rect x="10" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="205" r="16" fill="${C.rose}"/>
  <text x="42" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="67" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">HSG — Tube Patency Test</text>
  <text x="67" y="216" font-size="10.5" fill="${C.muted}">X-ray test to confirm that the fallopian tubes are open</text>

  <rect x="410" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="205" r="16" fill="${C.rose}"/>
  <text x="442" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="467" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Partner's Semen Analysis</text>
  <text x="467" y="216" font-size="10.5" fill="${C.muted}">Evaluates sperm count, motility and morphology</text>
</svg>`;

// ── Wave 16 SVG constants ─────────────────────────────────────────────

// Blog W16-1 (Sleep & IVF): "6 Tips for Better Sleep During IVF"
// Source: Blog h3 sections [31],[33],[35],[37],[39],[41] — six sleep tips
const SVG_SLEEP_IVF_TIPS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 244" font-family="${FONT}">
  <rect width="800" height="244" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="242.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">6 TIPS FOR BETTER SLEEP DURING IVF</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1 -->
  <rect x="10" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="73" r="16" fill="${C.rose}"/>
  <text x="42" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="67" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Regular Sleep Schedule</text>
  <text x="67" y="84" font-size="10.5" fill="${C.muted}">Sleep and wake at the same time daily to support your body clock</text>

  <rect x="410" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="73" r="16" fill="${C.rose}"/>
  <text x="442" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="467" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Sleep-Inducing Environment</text>
  <text x="467" y="84" font-size="10.5" fill="${C.muted}">Keep bedroom cool, dark and quiet; no screens before bed</text>

  <!-- Row 2 -->
  <rect x="10" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="139" r="16" fill="${C.rose}"/>
  <text x="42" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="67" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Relaxation Techniques</text>
  <text x="67" y="150" font-size="10.5" fill="${C.muted}">Yoga, meditation or breathing exercises reduce cortisol</text>

  <rect x="410" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="139" r="16" fill="${C.rose}"/>
  <text x="442" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="467" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Limit Stimulants</text>
  <text x="467" y="150" font-size="10.5" fill="${C.muted}">Avoid caffeine after 2 PM and alcohol close to bedtime</text>

  <!-- Row 3 -->
  <rect x="10" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="205" r="16" fill="${C.rose}"/>
  <text x="42" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="67" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Digital Detox</text>
  <text x="67" y="216" font-size="10.5" fill="${C.muted}">No screens 1–2 hours before bed; blue light blocks melatonin</text>

  <rect x="410" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="205" r="16" fill="${C.rose}"/>
  <text x="442" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="467" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Melatonin (with Doctor Guidance)</text>
  <text x="467" y="216" font-size="10.5" fill="${C.muted}">May be prescribed during IVF cycles to improve egg quality</text>
</svg>`;

// Blog W16-2 (DFI Test): "4 Reasons DFI Testing is a Game-Changer"
// Source: Blog h2 sections [4],[6],[9],[14] — DFI test value and interventions
const SVG_DFI_TEST_MATTERS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 288" font-family="${FONT}">
  <rect width="800" height="288" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="286.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">4 REASONS DFI TESTING IS A GAME-CHANGER FOR MALE FERTILITY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1 -->
  <rect x="20" y="44" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="63" font-size="11" font-weight="700" fill="${C.rose}">01</text>
  <text x="68" y="63" font-size="12" font-weight="700" fill="${C.dark}">Detects Hidden DNA Damage</text>
  <text x="68" y="81" font-size="10.5" fill="${C.muted}">Standard semen analysis can miss critical breaks in sperm DNA strands</text>

  <!-- Row 2 -->
  <rect x="20" y="107" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="107" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="11" font-weight="700" fill="${C.rose}">02</text>
  <text x="68" y="126" font-size="12" font-weight="700" fill="${C.dark}">Guides Treatment Selection</text>
  <text x="68" y="144" font-size="10.5" fill="${C.muted}">DFI score helps doctors choose the right path — IUI, IVF or ICSI</text>

  <!-- Row 3 -->
  <rect x="20" y="170" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="170" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="189" font-size="11" font-weight="700" fill="${C.rose}">03</text>
  <text x="68" y="189" font-size="12" font-weight="700" fill="${C.dark}">Identifies Lifestyle Root Causes</text>
  <text x="68" y="207" font-size="10.5" fill="${C.muted}">Heat, smoking and oxidative stress are key contributors to sperm DNA damage</text>

  <!-- Row 4 -->
  <rect x="20" y="233" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="233" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="252" font-size="11" font-weight="700" fill="${C.rose}">04</text>
  <text x="68" y="252" font-size="12" font-weight="700" fill="${C.dark}">Supports Better IVF Outcomes</text>
  <text x="68" y="270" font-size="10.5" fill="${C.muted}">Healthier sperm DNA leads to improved embryo development and pregnancy rates</text>
</svg>`;

// Blog W16-3 (IUI Do's & Don'ts): "Key Do's and Don'ts After IUI Treatment"
// Source: Blog h3 sections [9],[13],[17],[23] (do's) and [30],[33],[35],[38] (don'ts)
const SVG_IUI_DOS_DONTS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 278" font-family="${FONT}">
  <rect width="800" height="278" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="276.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>

  <!-- Left panel: Do's (rose header) -->
  <rect x="10" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Do's After IUI</text>

  <rect x="22" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Resume Light Activities</text>
  <text x="34" y="89" font-size="10.5" fill="${C.muted}">No bed rest needed; gentle walks and daily tasks are fine</text>

  <rect x="22" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Eat Fertility-Friendly Foods</text>
  <text x="34" y="137" font-size="10.5" fill="${C.muted}">Whole grains, leafy greens and omega-3 rich foods support implantation</text>

  <rect x="22" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Stay Well Hydrated</text>
  <text x="34" y="185" font-size="10.5" fill="${C.muted}">8–10 glasses of water daily to support uterine blood flow</text>

  <rect x="22" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Take Medications as Prescribed</text>
  <text x="34" y="233" font-size="10.5" fill="${C.muted}">Progesterone and supplements must be taken on schedule</text>

  <!-- Right panel: Don'ts (light) -->
  <rect x="410" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">Don'ts After IUI</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>

  <rect x="422" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Don't Test Too Early</text>
  <text x="434" y="89" font-size="10.5" fill="${C.muted}">Wait until Day 14; the hCG trigger shot can skew early results</text>

  <rect x="422" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Avoid High-Intensity Exercise</text>
  <text x="434" y="137" font-size="10.5" fill="${C.muted}">No running, weightlifting or aerobics in the first week post-IUI</text>

  <rect x="422" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">No Smoking or Alcohol</text>
  <text x="434" y="185" font-size="10.5" fill="${C.muted}">Both harm egg quality and can disrupt early implantation</text>

  <rect x="422" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Limit Caffeine Intake</text>
  <text x="434" y="233" font-size="10.5" fill="${C.muted}">Keep below 200 mg per day during the two-week wait</text>
</svg>`;

// Blog W16-4 (Implantation Signs): "6 Signs of Implantation to Look For"
// Source: Blog section [7] — implantation symptoms listed in the blog's own text
const SVG_IMPLANTATION_SIGNS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 244" font-family="${FONT}">
  <rect width="800" height="244" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="242.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">6 SIGNS OF IMPLANTATION TO LOOK FOR</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1 -->
  <rect x="10" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="73" r="16" fill="${C.rose}"/>
  <text x="42" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="67" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Light Cramping</text>
  <text x="67" y="84" font-size="10.5" fill="${C.muted}">Mild, brief cramps as the blastocyst attaches to the uterine lining</text>

  <rect x="410" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="73" r="16" fill="${C.rose}"/>
  <text x="442" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="467" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Implantation Bleeding</text>
  <text x="467" y="84" font-size="10.5" fill="${C.muted}">Pinkish or brownish spotting, lighter than a normal period</text>

  <!-- Row 2 -->
  <rect x="10" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="139" r="16" fill="${C.rose}"/>
  <text x="42" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="67" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Breast Tenderness</text>
  <text x="67" y="150" font-size="10.5" fill="${C.muted}">Swelling or sensitivity due to rising progesterone levels</text>

  <rect x="410" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="139" r="16" fill="${C.rose}"/>
  <text x="442" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="467" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Fatigue</text>
  <text x="467" y="150" font-size="10.5" fill="${C.muted}">Unusual tiredness as the body begins preparing for early pregnancy</text>

  <!-- Row 3 -->
  <rect x="10" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="205" r="16" fill="${C.rose}"/>
  <text x="42" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="67" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Frequent Urination</text>
  <text x="67" y="216" font-size="10.5" fill="${C.muted}">Increased urge to urinate as hormonal shifts begin post-implantation</text>

  <rect x="410" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="205" r="16" fill="${C.rose}"/>
  <text x="442" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="467" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Elevated Basal Temperature</text>
  <text x="467" y="216" font-size="10.5" fill="${C.muted}">BBT may remain consistently high after implantation occurs</text>
</svg>`;

// Blog W16-5 (Postpartum Journey): "4 Stages of Postpartum Recovery"
// Source: Blog para [5] — general healing timeline outline described in blog's own text
const SVG_POSTPARTUM_STAGES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 288" font-family="${FONT}">
  <rect width="800" height="288" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="286.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">4 STAGES OF POSTPARTUM RECOVERY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1 -->
  <rect x="20" y="44" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="63" font-size="11" font-weight="700" fill="${C.rose}">W1</text>
  <text x="68" y="63" font-size="12" font-weight="700" fill="${C.dark}">First Week</text>
  <text x="68" y="81" font-size="10.5" fill="${C.muted}">Rest and initial healing; lochia discharge and wound or perineal care begins</text>

  <!-- Row 2 -->
  <rect x="20" y="107" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="107" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="11" font-weight="700" fill="${C.rose}">W2</text>
  <text x="68" y="126" font-size="12" font-weight="700" fill="${C.dark}">Weeks 2–4</text>
  <text x="68" y="144" font-size="10.5" fill="${C.muted}">Gradual return to light activity; baby blues and emotional fluctuations are common</text>

  <!-- Row 3 -->
  <rect x="20" y="170" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="170" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="189" font-size="11" font-weight="700" fill="${C.rose}">W6</text>
  <text x="68" y="189" font-size="12" font-weight="700" fill="${C.dark}">Weeks 6–8</text>
  <text x="68" y="207" font-size="10.5" fill="${C.muted}">Postpartum follow-up checkup to assess physical recovery and emotional well-being</text>

  <!-- Row 4 -->
  <rect x="20" y="233" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="233" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="252" font-size="11" font-weight="700" fill="${C.rose}">M3</text>
  <text x="68" y="252" font-size="12" font-weight="700" fill="${C.dark}">Months 3–6</text>
  <text x="68" y="270" font-size="10.5" fill="${C.muted}">Hormones gradually stabilize; return to normal activities at your own pace</text>
</svg>`;

// ── Wave 15 SVG constants ─────────────────────────────────────────────

// Blog W15-1 (Embryo Freezing): "6 Steps of Embryo Freezing (Vitrification)"
// Source: Blog headings [3],[5],[9],[11],[14],[16] — six process steps
const SVG_EMBRYO_FREEZING_STEPS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 244" font-family="${FONT}">
  <rect width="800" height="244" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="242.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">6 STEPS OF EMBRYO FREEZING (VITRIFICATION)</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1 -->
  <rect x="10" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="73" r="16" fill="${C.rose}"/>
  <text x="42" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="67" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Egg Retrieval</text>
  <text x="67" y="84" font-size="10.5" fill="${C.muted}">Eggs collected via ultrasound-guided procedure</text>

  <rect x="410" y="44" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="73" r="16" fill="${C.rose}"/>
  <text x="442" y="78" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="467" y="67" font-size="11.5" font-weight="700" fill="${C.dark}">Fertilization in Lab</text>
  <text x="467" y="84" font-size="10.5" fill="${C.muted}">Sperm fertilises eggs; embryos begin developing</text>

  <!-- Row 2 -->
  <rect x="10" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="139" r="16" fill="${C.rose}"/>
  <text x="42" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="67" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Embryo Culture</text>
  <text x="67" y="150" font-size="10.5" fill="${C.muted}">Embryos grown 3–5 days to blastocyst stage</text>

  <rect x="410" y="110" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="139" r="16" fill="${C.rose}"/>
  <text x="442" y="144" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="467" y="133" font-size="11.5" font-weight="700" fill="${C.dark}">Vitrification</text>
  <text x="467" y="150" font-size="10.5" fill="${C.muted}">Flash-frozen at −196°C; prevents ice crystal damage</text>

  <!-- Row 3 -->
  <rect x="10" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="42" cy="205" r="16" fill="${C.rose}"/>
  <text x="42" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="67" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Cryo Storage</text>
  <text x="67" y="216" font-size="10.5" fill="${C.muted}">Safely stored in liquid nitrogen tanks long-term</text>

  <rect x="410" y="176" width="380" height="58" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="442" cy="205" r="16" fill="${C.rose}"/>
  <text x="442" y="210" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="467" y="199" font-size="11.5" font-weight="700" fill="${C.dark}">Thaw &amp; Embryo Transfer</text>
  <text x="467" y="216" font-size="10.5" fill="${C.muted}">Warmed embryo transferred to the uterus when ready</text>
</svg>`;

// Blog W15-2 (Celebrities Egg Freezing): "10 Key Benefits of Egg Freezing"
// Source: Blog h3 sections [11],[13],[16],[18],[20],[22],[24],[26],[28],[30]
const SVG_EGG_FREEZING_BENEFITS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 326" font-family="${FONT}">
  <rect width="800" height="326" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="324.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">10 KEY BENEFITS OF EGG FREEZING</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1 -->
  <rect x="10" y="52" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="36" cy="77" r="14" fill="${C.rose}"/>
  <text x="36" y="81.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">1</text>
  <text x="58" y="70" font-size="11.5" font-weight="700" fill="${C.dark}">Delayed Parenthood</text>
  <text x="58" y="86" font-size="10.5" fill="${C.muted}">Preserve fertility until you're ready to start a family</text>

  <rect x="410" y="52" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="436" cy="77" r="14" fill="${C.rose}"/>
  <text x="436" y="81.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">2</text>
  <text x="458" y="70" font-size="11.5" font-weight="700" fill="${C.dark}">Medical Safety Net</text>
  <text x="458" y="86" font-size="10.5" fill="${C.muted}">Protect eggs before cancer treatment or surgery</text>

  <!-- Row 2 -->
  <rect x="10" y="108" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="36" cy="133" r="14" fill="${C.rose}"/>
  <text x="36" y="137.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">3</text>
  <text x="58" y="126" font-size="11.5" font-weight="700" fill="${C.dark}">Reduced Age-Related Risk</text>
  <text x="58" y="142" font-size="10.5" fill="${C.muted}">Younger frozen eggs retain better quality over time</text>

  <rect x="410" y="108" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="436" cy="133" r="14" fill="${C.rose}"/>
  <text x="436" y="137.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">4</text>
  <text x="458" y="126" font-size="11.5" font-weight="700" fill="${C.dark}">Reproductive Control</text>
  <text x="458" y="142" font-size="10.5" fill="${C.muted}">Choose when and how you want to start your family</text>

  <!-- Row 3 -->
  <rect x="10" y="164" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="36" cy="189" r="14" fill="${C.rose}"/>
  <text x="36" y="193.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">5</text>
  <text x="58" y="182" font-size="11.5" font-weight="700" fill="${C.dark}">Better IVF Success</text>
  <text x="58" y="198" font-size="10.5" fill="${C.muted}">Younger frozen eggs can improve IVF outcomes later</text>

  <rect x="410" y="164" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="436" cy="189" r="14" fill="${C.rose}"/>
  <text x="436" y="193.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">6</text>
  <text x="458" y="182" font-size="11.5" font-weight="700" fill="${C.dark}">Peace of Mind</text>
  <text x="458" y="198" font-size="10.5" fill="${C.muted}">Reduces pressure from the ticking biological clock</text>

  <!-- Row 4 -->
  <rect x="10" y="220" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="36" cy="245" r="14" fill="${C.rose}"/>
  <text x="36" y="249.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">7</text>
  <text x="58" y="238" font-size="11.5" font-weight="700" fill="${C.dark}">Genetic Testing Option</text>
  <text x="58" y="254" font-size="10.5" fill="${C.muted}">Screen embryos before transfer using PGT</text>

  <rect x="410" y="220" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="436" cy="245" r="14" fill="${C.rose}"/>
  <text x="436" y="249.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">8</text>
  <text x="458" y="238" font-size="11.5" font-weight="700" fill="${C.dark}">For Single Women</text>
  <text x="458" y="254" font-size="10.5" fill="${C.muted}">Build your family on your own timeline and terms</text>

  <!-- Row 5 -->
  <rect x="10" y="276" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="36" cy="301" r="14" fill="${C.rose}"/>
  <text x="36" y="305.5" text-anchor="middle" font-size="11" font-weight="700" fill="${C.white}">9</text>
  <text x="58" y="294" font-size="11.5" font-weight="700" fill="${C.dark}">For Same-Sex Couples</text>
  <text x="58" y="310" font-size="10.5" fill="${C.muted}">Flexible family planning for diverse family types</text>

  <rect x="410" y="276" width="380" height="50" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="436" cy="301" r="14" fill="${C.rose}"/>
  <text x="436" y="305.5" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">10</text>
  <text x="458" y="294" font-size="11.5" font-weight="700" fill="${C.dark}">Lower Emotional Stress</text>
  <text x="458" y="310" font-size="10.5" fill="${C.muted}">Reduces fertility-related anxiety and time pressure</text>
</svg>`;

// Blog W15-3 (Surrogacy vs IVF): "IVF vs Surrogacy: Key Benefits Compared"
// Source: Blog h2 sections "Benefits of IVF" [26] and "Benefits of surrogacy" [28]
const SVG_SURROGACY_VS_IVF = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 278" font-family="${FONT}">
  <rect width="800" height="278" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="276.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>

  <!-- Left panel: IVF (rose header) -->
  <rect x="10" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">In Vitro Fertilisation (IVF)</text>

  <rect x="22" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">You Carry the Baby</text>
  <text x="34" y="89" font-size="10.5" fill="${C.muted}">Intended mother experiences the pregnancy herself</text>

  <rect x="22" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Genetic Connection</text>
  <text x="34" y="137" font-size="10.5" fill="${C.muted}">Both parents can be biologically linked to the baby</text>

  <rect x="22" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Simpler Legal Process</text>
  <text x="34" y="185" font-size="10.5" fill="${C.muted}">No surrogate contracts or complex court approvals</text>

  <rect x="22" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">More Accessible Cost</text>
  <text x="34" y="233" font-size="10.5" fill="${C.muted}">Generally lower overall cost than surrogacy</text>

  <!-- Right panel: Surrogacy (light) -->
  <rect x="410" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">Surrogacy</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>

  <rect x="422" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Surrogate Carries</text>
  <text x="434" y="89" font-size="10.5" fill="${C.muted}">For those medically unable to carry a pregnancy</text>

  <rect x="422" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">No Pregnancy Risk</text>
  <text x="434" y="137" font-size="10.5" fill="${C.muted}">Intended mother avoids pregnancy-related complications</text>

  <rect x="422" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Gestational Option</text>
  <text x="434" y="185" font-size="10.5" fill="${C.muted}">Surrogate has no genetic link to the baby</text>

  <rect x="422" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Supports Diverse Families</text>
  <text x="434" y="233" font-size="10.5" fill="${C.muted}">Ideal for same-sex couples and single parents</text>
</svg>`;

// Blog W15-4 (BFI Rajkot CME): "BFI Rajkot CME: 4 Key Highlights"
// Source: Blog paras [3],[5],[9],[11] — date, organiser, speakers, interactive sessions
const SVG_BFI_RAJKOT_CME = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 288" font-family="${FONT}">
  <rect width="800" height="288" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="286.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">BFI EDUCATIONAL PROGRAMME AT RAJKOT: KEY HIGHLIGHTS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>

  <!-- Row 1 -->
  <rect x="20" y="44" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="44" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="63" font-size="11" font-weight="700" fill="${C.rose}">01</text>
  <text x="68" y="63" font-size="12" font-weight="700" fill="${C.dark}">Date &amp; Venue</text>
  <text x="68" y="81" font-size="10.5" fill="${C.muted}">21st September 2025, Rajkot — a landmark knowledge-sharing event for gynaecologists</text>

  <!-- Row 2 -->
  <rect x="20" y="107" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="107" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="126" font-size="11" font-weight="700" fill="${C.rose}">02</text>
  <text x="68" y="126" font-size="12" font-weight="700" fill="${C.dark}">Organiser</text>
  <text x="68" y="144" font-size="10.5" fill="${C.muted}">Hosted in collaboration with the Rajkot Gynaecologist Doctors Association</text>

  <!-- Row 3 -->
  <rect x="20" y="170" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="170" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="189" font-size="11" font-weight="700" fill="${C.rose}">03</text>
  <text x="68" y="189" font-size="12" font-weight="700" fill="${C.dark}">Expert Speakers</text>
  <text x="68" y="207" font-size="10.5" fill="${C.muted}">Senior BFI specialists shared the latest advances in reproductive medicine and IVF</text>

  <!-- Row 4 -->
  <rect x="20" y="233" width="760" height="55" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="20" y="233" width="8" height="55" rx="3" fill="${C.rose}"/>
  <text x="38" y="252" font-size="11" font-weight="700" fill="${C.rose}">04</text>
  <text x="68" y="252" font-size="12" font-weight="700" fill="${C.dark}">Interactive Sessions</text>
  <text x="68" y="270" font-size="10.5" fill="${C.muted}">Live Q&amp;A and open discussions actively engaged the attending gynaecologists</text>
</svg>`;

// Blog W15-5 (Teratozoospermia): "Teratozoospermia: Causes & Treatments"
// Source: Blog h2 sections [4],[7],[14],[17] — causes and treatment options
const SVG_TERATOZOOSPERMIA_OVERVIEW = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 278" font-family="${FONT}">
  <rect width="800" height="278" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="276.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>

  <!-- Left panel: Common Causes (rose header) -->
  <rect x="10" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="10" y="10" width="380" height="46" rx="8" fill="${C.rose}"/>
  <rect x="10" y="44" width="380" height="12" fill="${C.rose}"/>
  <text x="200" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">Common Causes</text>

  <rect x="22" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Genetic Factors</text>
  <text x="34" y="89" font-size="10.5" fill="${C.muted}">Chromosomal abnormalities that disrupt sperm formation</text>

  <rect x="22" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">Infections</text>
  <text x="34" y="137" font-size="10.5" fill="${C.muted}">Viral or bacterial infections damage sperm development</text>

  <rect x="22" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">Lifestyle Factors</text>
  <text x="34" y="185" font-size="10.5" fill="${C.muted}">Smoking, alcohol and excess heat harm sperm morphology</text>

  <rect x="22" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="34" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Environmental Toxins</text>
  <text x="34" y="233" font-size="10.5" fill="${C.muted}">Chemical or radiation exposure affects sperm shape</text>

  <!-- Right panel: Treatment Options (light) -->
  <rect x="410" y="10" width="380" height="258" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="${C.dark}">Treatment Options</text>
  <line x1="418" y1="56" x2="784" y2="56" stroke="${C.border}" stroke-width="1"/>

  <rect x="422" y="68" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="73.5" font-size="11.5" font-weight="700" fill="${C.dark}">Lifestyle Changes</text>
  <text x="434" y="89" font-size="10.5" fill="${C.muted}">Healthy diet, exercise, avoid alcohol, smoking and heat</text>

  <rect x="422" y="116" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="121.5" font-size="11.5" font-weight="700" fill="${C.dark}">ICSI Procedure</text>
  <text x="434" y="137" font-size="10.5" fill="${C.muted}">A single healthy sperm injected directly into the egg</text>

  <rect x="422" y="164" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="169.5" font-size="11.5" font-weight="700" fill="${C.dark}">IVF with ICSI</text>
  <text x="434" y="185" font-size="10.5" fill="${C.muted}">Stimulation cycle combined with ICSI injection technique</text>

  <rect x="422" y="212" width="5" height="5" rx="1" fill="${C.rose}"/>
  <text x="434" y="217.5" font-size="11.5" font-weight="700" fill="${C.dark}">Medical Therapy</text>
  <text x="434" y="233" font-size="10.5" fill="${C.muted}">Antioxidants and hormonal treatments improve morphology</text>
</svg>`;

// ── Wave 14 SVG constants ─────────────────────────────────────────────

// Blog W14-1 (Laser-assisted hatching): "5 Cases Where LAH May Help"
// Source: Blog node [11] — 5 candidate categories listed
const SVG_LASER_HATCHING_CASES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 210" font-family="${FONT}">
  <rect width="800" height="210" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="208.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 CASES WHERE LASER-ASSISTED HATCHING MAY HELP</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="146" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">01</text>
  <text x="108" y="104" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Women Over 35</text>
  <text x="108" y="122" text-anchor="middle" font-size="10" fill="${C.muted}">Declining ovarian</text>
  <text x="108" y="137" text-anchor="middle" font-size="10" fill="${C.muted}">reserve may benefit</text>
  <text x="108" y="152" text-anchor="middle" font-size="10" fill="${C.muted}">from LAH</text>
  <rect x="186" y="48" width="136" height="146" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">02</text>
  <text x="254" y="104" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Repeated IVF Failure</text>
  <text x="254" y="122" text-anchor="middle" font-size="10" fill="${C.muted}">Previous cycles where</text>
  <text x="254" y="137" text-anchor="middle" font-size="10" fill="${C.muted}">implantation did</text>
  <text x="254" y="152" text-anchor="middle" font-size="10" fill="${C.muted}">not occur</text>
  <rect x="332" y="48" width="136" height="146" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">03</text>
  <text x="400" y="104" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Thick Zona Pellucida</text>
  <text x="400" y="122" text-anchor="middle" font-size="10" fill="${C.muted}">Embryos with</text>
  <text x="400" y="137" text-anchor="middle" font-size="10" fill="${C.muted}">unusually thick</text>
  <text x="400" y="152" text-anchor="middle" font-size="10" fill="${C.muted}">protein shells</text>
  <rect x="478" y="48" width="136" height="146" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">04</text>
  <text x="546" y="104" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Frozen Embryos</text>
  <text x="546" y="122" text-anchor="middle" font-size="10" fill="${C.muted}">Thawed embryos may</text>
  <text x="546" y="137" text-anchor="middle" font-size="10" fill="${C.muted}">develop a thicker</text>
  <text x="546" y="152" text-anchor="middle" font-size="10" fill="${C.muted}">zona after freezing</text>
  <rect x="624" y="48" width="136" height="146" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">05</text>
  <text x="692" y="104" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Poor Development</text>
  <text x="692" y="122" text-anchor="middle" font-size="10" fill="${C.muted}">Slow cleavage or</text>
  <text x="692" y="137" text-anchor="middle" font-size="10" fill="${C.muted}">low-quality embryos</text>
  <text x="692" y="152" text-anchor="middle" font-size="10" fill="${C.muted}">may be helped</text>
</svg>`;

// Blog W14-2 (BFI CME Bardoli): "4 Key Highlights of the BFI CME Program"
// Source: Blog nodes [4-16] — 4 section headings covering faculty, sessions, collaboration, knowledge
const SVG_BFI_CME_BARDOLI = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 288" font-family="${FONT}">
  <rect width="800" height="288" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="286.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">BFI CME BARDOLI: 4 KEY HIGHLIGHTS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="720" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="6" height="52" rx="3" fill="${C.rose}"/>
  <text x="60" y="63" font-size="10" font-weight="700" fill="${C.rose}">Highlight 1</text>
  <text x="60" y="79" font-size="11.5" font-weight="600" fill="${C.dark}">Esteemed Faculty</text>
  <text x="60" y="90" font-size="10" fill="${C.muted}">Led by Dr. Himanshu Bavishi and Dr. Deep Gajiwala with evidence-based presentations</text>
  <rect x="40" y="102" width="720" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="102" width="6" height="52" rx="3" fill="${C.rose}"/>
  <text x="60" y="121" font-size="10" font-weight="700" fill="${C.rose}">Highlight 2</text>
  <text x="60" y="137" font-size="11.5" font-weight="600" fill="${C.dark}">Interactive Learning Format</text>
  <text x="60" y="148" font-size="10" fill="${C.muted}">Case studies, practical Q&amp;A and peer-to-peer collaborative discussions</text>
  <rect x="40" y="160" width="720" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="160" width="6" height="52" rx="3" fill="${C.rose}"/>
  <text x="60" y="179" font-size="10" font-weight="700" fill="${C.rose}">Highlight 3</text>
  <text x="60" y="195" font-size="11.5" font-weight="600" fill="${C.dark}">Regional Medical Collaboration</text>
  <text x="60" y="206" font-size="10" fill="${C.muted}">Gynecologists from Bardoli and surrounding areas shared knowledge and best practices</text>
  <rect x="40" y="218" width="720" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="218" width="6" height="52" rx="3" fill="${C.rose}"/>
  <text x="60" y="237" font-size="10" font-weight="700" fill="${C.rose}">Highlight 4</text>
  <text x="60" y="253" font-size="11.5" font-weight="600" fill="${C.dark}">Commitment to Knowledge Sharing</text>
  <text x="60" y="264" font-size="10" fill="${C.muted}">Continuous professional development in evidence-based reproductive healthcare</text>
</svg>`;

// Blog W14-3 (Secondary infertility): "5 Common Causes of Secondary Infertility"
// Source: Blog node [13] — 5 causes listed with descriptions
const SVG_SECONDARY_INFERTILITY_CAUSES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 310" font-family="${FONT}">
  <rect width="800" height="310" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="308.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 COMMON CAUSES OF SECONDARY INFERTILITY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="67" r="14" fill="${C.rose}"/>
  <text x="68" y="71.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="92" y="63" font-size="11.5" font-weight="700" fill="${C.dark}">Age-related Decline</text>
  <text x="92" y="79" font-size="10" fill="${C.muted}">Egg quality and quantity reduce after 30, and more sharply after 35</text>
  <rect x="40" y="96" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="119" r="14" fill="${C.rose}"/>
  <text x="68" y="123.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="92" y="115" font-size="11.5" font-weight="700" fill="${C.dark}">Ovulation Disorders</text>
  <text x="92" y="131" font-size="10" fill="${C.muted}">PCOS, thyroid issues or high prolactin can disrupt regular ovulation</text>
  <rect x="40" y="148" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="171" r="14" fill="${C.rose}"/>
  <text x="68" y="175.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="92" y="167" font-size="11.5" font-weight="700" fill="${C.dark}">Uterine Conditions</text>
  <text x="92" y="183" font-size="10" fill="${C.muted}">Fibroids, endometrial polyps or adhesions make implantation difficult</text>
  <rect x="40" y="200" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="223" r="14" fill="${C.rose}"/>
  <text x="68" y="227.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="92" y="219" font-size="11.5" font-weight="700" fill="${C.dark}">Male Factor Infertility</text>
  <text x="92" y="235" font-size="10" fill="${C.muted}">Low sperm count, poor motility or morphology can develop over time</text>
  <rect x="40" y="252" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="275" r="14" fill="${C.rose}"/>
  <text x="68" y="279.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="92" y="271" font-size="11.5" font-weight="700" fill="${C.dark}">Lifestyle Influences</text>
  <text x="92" y="287" font-size="10" fill="${C.muted}">Obesity, smoking, alcohol and stress impact fertility in both partners</text>
</svg>`;

// Blog W14-4 (ICSI procedure steps): "6 Steps of the ICSI Procedure"
// Source: Blog nodes [8-21] — 4 steps read; steps 5-6 are standard ICSI process
const SVG_ICSI_STEPS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 244" font-family="${FONT}">
  <rect width="800" height="244" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="242.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">6 STEPS OF THE ICSI PROCEDURE</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="52" width="355" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="78" r="14" fill="${C.rose}"/>
  <text x="66" y="82.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="88" y="73" font-size="11" font-weight="700" fill="${C.dark}">Initial Consultation</text>
  <text x="88" y="89" font-size="9.5" fill="${C.muted}">Complete fertility assessment for both partners</text>
  <rect x="40" y="110" width="355" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="136" r="14" fill="${C.rose}"/>
  <text x="66" y="140.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="88" y="131" font-size="11" font-weight="700" fill="${C.dark}">Ovarian Stimulation</text>
  <text x="88" y="147" font-size="9.5" fill="${C.muted}">Hormone injections for 8–12 days; follicle growth monitored</text>
  <rect x="40" y="168" width="355" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="194" r="14" fill="${C.rose}"/>
  <text x="66" y="198.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="88" y="189" font-size="11" font-weight="700" fill="${C.dark}">Egg Retrieval</text>
  <text x="88" y="205" font-size="9.5" fill="${C.muted}">Day-care procedure under mild sedation; ultrasound guided</text>
  <rect x="405" y="52" width="355" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="431" cy="78" r="14" fill="${C.rose}"/>
  <text x="431" y="82.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="453" y="73" font-size="11" font-weight="700" fill="${C.dark}">Sperm Collection</text>
  <text x="453" y="89" font-size="9.5" fill="${C.muted}">Partner's sample prepared; or TESA/PESA if needed</text>
  <rect x="405" y="110" width="355" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="431" cy="136" r="14" fill="${C.rose}"/>
  <text x="431" y="140.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="453" y="131" font-size="11" font-weight="700" fill="${C.dark}">ICSI Microinjection</text>
  <text x="453" y="147" font-size="9.5" fill="${C.muted}">Single healthy sperm directly injected into mature egg</text>
  <rect x="405" y="168" width="355" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="431" cy="194" r="14" fill="${C.rose}"/>
  <text x="431" y="198.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="453" y="189" font-size="11" font-weight="700" fill="${C.dark}">Embryo Transfer</text>
  <text x="453" y="205" font-size="9.5" fill="${C.muted}">Fertilised embryo cultured 3–5 days then transferred</text>
</svg>`;

// Blog W14-5 (IUI procedure steps): "5 Steps of the IUI Procedure"
// Source: Blog nodes [11-23] — steps 1-5 of IUI process
const SVG_IUI_PROCEDURE_STEPS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 310" font-family="${FONT}">
  <rect width="800" height="310" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="308.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 STEPS OF THE IUI PROCEDURE</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="67" r="14" fill="${C.rose}"/>
  <text x="68" y="71.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="92" y="63" font-size="11.5" font-weight="700" fill="${C.dark}">Initial Consultation and Evaluation</text>
  <text x="92" y="79" font-size="10" fill="${C.muted}">Medical history, ultrasound, hormonal tests and semen analysis</text>
  <rect x="40" y="96" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="119" r="14" fill="${C.rose}"/>
  <text x="68" y="123.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="92" y="115" font-size="11.5" font-weight="700" fill="${C.dark}">Ovulation Monitoring and Cycle Planning</text>
  <text x="92" y="131" font-size="10" fill="${C.muted}">Follicular growth tracked via ultrasound and hormone levels</text>
  <rect x="40" y="148" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="171" r="14" fill="${C.rose}"/>
  <text x="68" y="175.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="92" y="167" font-size="11.5" font-weight="700" fill="${C.dark}">Triggering Ovulation</text>
  <text x="92" y="183" font-size="10" fill="${C.muted}">hCG trigger injection once follicle reaches optimal 18–20mm size</text>
  <rect x="40" y="200" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="223" r="14" fill="${C.rose}"/>
  <text x="68" y="227.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="92" y="219" font-size="11.5" font-weight="700" fill="${C.dark}">Semen Collection and Preparation</text>
  <text x="92" y="235" font-size="10" fill="${C.muted}">Sperm sample washed to concentrate healthiest most motile cells</text>
  <rect x="40" y="252" width="720" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="68" cy="275" r="14" fill="${C.rose}"/>
  <text x="68" y="279.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="92" y="271" font-size="11.5" font-weight="700" fill="${C.dark}">The IUI Procedure</text>
  <text x="92" y="287" font-size="10" fill="${C.muted}">Prepared sperm placed directly into the uterus via a thin catheter</text>
</svg>`;

// ── Wave 13 SVG constants ─────────────────────────────────────────────

// Blog W13-2 (Normal delivery tips): "6 Tips to Increase Your Chances of a Natural Birth"
// Source: Blog nodes [4-25] — 6 sections: understand body, prepare, nutrition, support, stimulation, mindset
const SVG_NATURAL_DELIVERY_TIPS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 242" font-family="${FONT}">
  <rect width="800" height="242" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="240.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">6 TIPS TO INCREASE YOUR CHANCES OF A NATURAL BIRTH</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="52" width="355" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="78" r="14" fill="${C.rose}"/>
  <text x="66" y="82.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="88" y="73" font-size="11" font-weight="700" fill="${C.dark}">Understand Your Body</text>
  <text x="88" y="89" font-size="9.5" fill="${C.muted}">Take prenatal yoga and know your body's limits</text>
  <rect x="40" y="110" width="355" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="136" r="14" fill="${C.rose}"/>
  <text x="66" y="140.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="88" y="131" font-size="11" font-weight="700" fill="${C.dark}">Prepare Your Body</text>
  <text x="88" y="147" font-size="9.5" fill="${C.muted}">Pelvic floor, perineal massage, fetal positioning</text>
  <rect x="40" y="168" width="355" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="194" r="14" fill="${C.rose}"/>
  <text x="66" y="198.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="88" y="189" font-size="11" font-weight="700" fill="${C.dark}">Nutrition and Hydration</text>
  <text x="88" y="205" font-size="9.5" fill="${C.muted}">Whole foods balanced diet; stay well hydrated</text>
  <rect x="405" y="52" width="355" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="431" cy="78" r="14" fill="${C.rose}"/>
  <text x="431" y="82.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="453" y="73" font-size="11" font-weight="700" fill="${C.dark}">Labour Support</text>
  <text x="453" y="89" font-size="9.5" fill="${C.muted}">Supportive care, birth plan and doula support</text>
  <rect x="405" y="110" width="355" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="431" cy="136" r="14" fill="${C.rose}"/>
  <text x="431" y="140.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="453" y="131" font-size="11" font-weight="700" fill="${C.dark}">Natural Stimulation</text>
  <text x="453" y="147" font-size="9.5" fill="${C.muted}">Evening primrose, acupuncture and gentle walking</text>
  <rect x="405" y="168" width="355" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="431" cy="194" r="14" fill="${C.rose}"/>
  <text x="431" y="198.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="453" y="189" font-size="11" font-weight="700" fill="${C.dark}">Mindset and Relaxation</text>
  <text x="453" y="205" font-size="9.5" fill="${C.muted}">Positive affirmations, breathing and meditation</text>
</svg>`;

// Blog W13-3 (PCOS diet tips): "9 PCOS Diet Tips to Support Natural Conception"
// Source: Blog node [8-9] — 9 diet tips listed
const SVG_PCOS_DIET_TIPS_9 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 326" font-family="${FONT}">
  <rect width="800" height="326" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="324.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">9 PCOS DIET TIPS FOR NATURAL CONCEPTION</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="52" width="355" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="74" r="12" fill="${C.rose}"/>
  <text x="64" y="78" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">1</text>
  <text x="84" y="69" font-size="11" font-weight="700" fill="${C.dark}">Low-GI Foods</text>
  <text x="84" y="85" font-size="9.5" fill="${C.muted}">Whole grains, legumes and non-starchy vegetables</text>
  <rect x="40" y="102" width="355" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="124" r="12" fill="${C.rose}"/>
  <text x="64" y="128" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">2</text>
  <text x="84" y="119" font-size="11" font-weight="700" fill="${C.dark}">Carbs + Protein Balance</text>
  <text x="84" y="135" font-size="9.5" fill="${C.muted}">Pair carbs with protein to reduce blood sugar spikes</text>
  <rect x="40" y="152" width="355" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="174" r="12" fill="${C.rose}"/>
  <text x="64" y="178" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">3</text>
  <text x="84" y="169" font-size="11" font-weight="700" fill="${C.dark}">Healthy Fats</text>
  <text x="84" y="185" font-size="9.5" fill="${C.muted}">Avocado, olive oil, nuts and omega-3 fatty acids</text>
  <rect x="40" y="202" width="355" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="224" r="12" fill="${C.rose}"/>
  <text x="64" y="228" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">4</text>
  <text x="84" y="219" font-size="11" font-weight="700" fill="${C.dark}">Increase Fiber</text>
  <text x="84" y="235" font-size="9.5" fill="${C.muted}">Supports digestion and improves insulin sensitivity</text>
  <rect x="40" y="252" width="355" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="274" r="12" fill="${C.rose}"/>
  <text x="64" y="278" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">5</text>
  <text x="84" y="269" font-size="11" font-weight="700" fill="${C.dark}">Avoid Processed Foods</text>
  <text x="84" y="285" font-size="9.5" fill="${C.muted}">Cut refined sugar, white bread and sweetened drinks</text>
  <rect x="405" y="52" width="355" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="74" r="12" fill="${C.rose}"/>
  <text x="429" y="78" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">6</text>
  <text x="449" y="69" font-size="11" font-weight="700" fill="${C.dark}">Stay Hydrated</text>
  <text x="449" y="85" font-size="9.5" fill="${C.muted}">Drink plenty of water for hormonal balance</text>
  <rect x="405" y="102" width="355" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="124" r="12" fill="${C.rose}"/>
  <text x="429" y="128" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">7</text>
  <text x="449" y="119" font-size="11" font-weight="700" fill="${C.dark}">Limit Dairy</text>
  <text x="449" y="135" font-size="9.5" fill="${C.muted}">Reduce if sensitive; opt for plant-based alternatives</text>
  <rect x="405" y="152" width="355" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="174" r="12" fill="${C.rose}"/>
  <text x="429" y="178" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">8</text>
  <text x="449" y="169" font-size="11" font-weight="700" fill="${C.dark}">Anti-Inflammatory Foods</text>
  <text x="449" y="185" font-size="9.5" fill="${C.muted}">Turmeric, ginger, berries and leafy greens</text>
  <rect x="405" y="202" width="355" height="44" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="224" r="12" fill="${C.rose}"/>
  <text x="429" y="228" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">9</text>
  <text x="449" y="219" font-size="11" font-weight="700" fill="${C.dark}">Supplements (with Doctor)</text>
  <text x="449" y="235" font-size="9.5" fill="${C.muted}">Inositol, Vitamin D and Omega-3 under guidance</text>
</svg>`;

// Blog W13-4 (Post-embryo transfer timeline): "Post-Embryo Transfer: 4 Key Milestones"
// Source: Blog nodes [7-22] — day-by-day biological story in 4 phases
const SVG_EMBRYO_TRANSFER_TIMELINE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 288" font-family="${FONT}">
  <rect width="800" height="288" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="286.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">POST-EMBRYO TRANSFER: 4 KEY MILESTONES</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="720" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="6" height="52" rx="3" fill="${C.rose}"/>
  <text x="60" y="63" font-size="10" font-weight="700" fill="${C.rose}">Days 1–3</text>
  <text x="60" y="79" font-size="11.5" font-weight="600" fill="${C.dark}">Embryo Hatches &amp; Settles</text>
  <text x="60" y="90" font-size="10" fill="${C.muted}">Zona pellucida dissolves; embryo floats freely in uterine cavity</text>
  <rect x="40" y="102" width="720" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="102" width="6" height="52" rx="3" fill="${C.rose}"/>
  <text x="60" y="121" font-size="10" font-weight="700" fill="${C.rose}">Days 4–5</text>
  <text x="60" y="137" font-size="11.5" font-weight="600" fill="${C.dark}">Implantation Occurs</text>
  <text x="60" y="148" font-size="10" fill="${C.muted}">Hatched embryo attaches to and burrows into the endometrial lining</text>
  <rect x="40" y="160" width="720" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="160" width="6" height="52" rx="3" fill="${C.rose}"/>
  <text x="60" y="179" font-size="10" font-weight="700" fill="${C.rose}">Days 6–9</text>
  <text x="60" y="195" font-size="11.5" font-weight="600" fill="${C.dark}">hCG Production Begins</text>
  <text x="60" y="206" font-size="10" fill="${C.muted}">Pregnancy hormone rises but may be too low for most home tests</text>
  <rect x="40" y="218" width="720" height="52" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="218" width="6" height="52" rx="3" fill="${C.rose}"/>
  <text x="60" y="237" font-size="10" font-weight="700" fill="${C.rose}">Days 10–14</text>
  <text x="60" y="253" font-size="11.5" font-weight="600" fill="${C.dark}">Official Blood Pregnancy Test</text>
  <text x="60" y="264" font-size="10" fill="${C.muted}">Beta hCG blood test gives a clear and reliable result</text>
</svg>`;

// ── Wave 12 SVG constants ─────────────────────────────────────────────

// Blog W12-1 (Asthenospermia + ART options): "5 ART Options for Asthenospermia"
// Source: Blog nodes [19-20] — IUI, IVF, ICSI, MACS, PICSI
const SVG_ART_OPTIONS_ASTHENOSPERMIA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 210" font-family="${FONT}">
  <rect width="800" height="210" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="208.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">5 ART OPTIONS FOR ASTHENOSPERMIA</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="146" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="40" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="108" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">01</text>
  <text x="108" y="104" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">IUI</text>
  <text x="108" y="122" text-anchor="middle" font-size="10" fill="${C.muted}">Washed sperm</text>
  <text x="108" y="137" text-anchor="middle" font-size="10" fill="${C.muted}">placed directly</text>
  <text x="108" y="152" text-anchor="middle" font-size="10" fill="${C.muted}">into uterus</text>
  <rect x="186" y="48" width="136" height="146" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="186" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="186" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="254" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">02</text>
  <text x="254" y="104" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">IVF</text>
  <text x="254" y="122" text-anchor="middle" font-size="10" fill="${C.muted}">Eggs retrieved</text>
  <text x="254" y="137" text-anchor="middle" font-size="10" fill="${C.muted}">and fertilised</text>
  <text x="254" y="152" text-anchor="middle" font-size="10" fill="${C.muted}">in the lab</text>
  <rect x="332" y="48" width="136" height="146" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="332" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="332" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="400" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">03</text>
  <text x="400" y="104" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">ICSI</text>
  <text x="400" y="122" text-anchor="middle" font-size="10" fill="${C.muted}">Single sperm</text>
  <text x="400" y="137" text-anchor="middle" font-size="10" fill="${C.muted}">injected directly</text>
  <text x="400" y="152" text-anchor="middle" font-size="10" fill="${C.muted}">into the egg</text>
  <rect x="478" y="48" width="136" height="146" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="478" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="478" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="546" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">04</text>
  <text x="546" y="104" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">MACS</text>
  <text x="546" y="122" text-anchor="middle" font-size="10" fill="${C.muted}">Sperm sorted by</text>
  <text x="546" y="137" text-anchor="middle" font-size="10" fill="${C.muted}">motility and</text>
  <text x="546" y="152" text-anchor="middle" font-size="10" fill="${C.muted}">DNA integrity</text>
  <rect x="624" y="48" width="136" height="146" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="624" y="48" width="136" height="36" rx="8" fill="${C.rose}"/>
  <rect x="624" y="72" width="136" height="12" fill="${C.rose}"/>
  <text x="692" y="70" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}">05</text>
  <text x="692" y="104" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">PICSI</text>
  <text x="692" y="122" text-anchor="middle" font-size="10" fill="${C.muted}">Healthiest sperm</text>
  <text x="692" y="137" text-anchor="middle" font-size="10" fill="${C.muted}">selected via</text>
  <text x="692" y="152" text-anchor="middle" font-size="10" fill="${C.muted}">hyaluronan binding</text>
</svg>`;

// Blog W12-2 (Pregnancy Signs): "12 Early Signs of Pregnancy"
// Source: Blog nodes [5-30] — 12 symptoms listed
const SVG_PREGNANCY_SIGNS_12 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" font-family="${FONT}">
  <rect width="800" height="380" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="378.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">12 EARLY SIGNS OF PREGNANCY</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="52" width="355" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="75" r="12" fill="${C.rose}"/>
  <text x="66" y="79" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">1</text>
  <text x="86" y="70" font-size="11" font-weight="700" fill="${C.dark}">Missed Period</text>
  <text x="86" y="86" font-size="9.5" fill="${C.muted}">Most common first sign of pregnancy</text>
  <rect x="40" y="104" width="355" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="127" r="12" fill="${C.rose}"/>
  <text x="66" y="131" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">2</text>
  <text x="86" y="122" font-size="11" font-weight="700" fill="${C.dark}">Nausea / Vomiting</text>
  <text x="86" y="138" font-size="9.5" fill="${C.muted}">Often called morning sickness</text>
  <rect x="40" y="156" width="355" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="179" r="12" fill="${C.rose}"/>
  <text x="66" y="183" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">3</text>
  <text x="86" y="174" font-size="11" font-weight="700" fill="${C.dark}">Fatigue</text>
  <text x="86" y="190" font-size="9.5" fill="${C.muted}">Extreme tiredness in early pregnancy</text>
  <rect x="40" y="208" width="355" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="231" r="12" fill="${C.rose}"/>
  <text x="66" y="235" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">4</text>
  <text x="86" y="226" font-size="11" font-weight="700" fill="${C.dark}">Breast Changes</text>
  <text x="86" y="242" font-size="9.5" fill="${C.muted}">Tenderness, swelling and darkening</text>
  <rect x="40" y="260" width="355" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="283" r="12" fill="${C.rose}"/>
  <text x="66" y="287" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">5</text>
  <text x="86" y="278" font-size="11" font-weight="700" fill="${C.dark}">Frequent Urination</text>
  <text x="86" y="294" font-size="9.5" fill="${C.muted}">Kidneys processing extra fluid volume</text>
  <rect x="40" y="312" width="355" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="66" cy="335" r="12" fill="${C.rose}"/>
  <text x="66" y="339" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">6</text>
  <text x="86" y="330" font-size="11" font-weight="700" fill="${C.dark}">Food Aversions / Cravings</text>
  <text x="86" y="346" font-size="9.5" fill="${C.muted}">Hormonal changes alter taste and smell</text>
  <rect x="405" y="52" width="355" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="431" cy="75" r="12" fill="${C.rose}"/>
  <text x="431" y="79" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">7</text>
  <text x="451" y="70" font-size="11" font-weight="700" fill="${C.dark}">Mood Swings</text>
  <text x="451" y="86" font-size="9.5" fill="${C.muted}">Rapid hormone fluctuations affect emotions</text>
  <rect x="405" y="104" width="355" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="431" cy="127" r="12" fill="${C.rose}"/>
  <text x="431" y="131" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">8</text>
  <text x="451" y="122" font-size="11" font-weight="700" fill="${C.dark}">Light Spotting / Cramping</text>
  <text x="451" y="138" font-size="9.5" fill="${C.muted}">May indicate implantation bleeding</text>
  <rect x="405" y="156" width="355" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="431" cy="179" r="12" fill="${C.rose}"/>
  <text x="431" y="183" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">9</text>
  <text x="451" y="174" font-size="11" font-weight="700" fill="${C.dark}">Bloating / Constipation</text>
  <text x="451" y="190" font-size="9.5" fill="${C.muted}">Progesterone slows digestion</text>
  <rect x="405" y="208" width="355" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="431" cy="231" r="12" fill="${C.rose}"/>
  <text x="431" y="235" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">10</text>
  <text x="451" y="226" font-size="11" font-weight="700" fill="${C.dark}">Dizziness</text>
  <text x="451" y="242" font-size="9.5" fill="${C.muted}">Blood pressure and volume changes</text>
  <rect x="405" y="260" width="355" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="431" cy="283" r="12" fill="${C.rose}"/>
  <text x="431" y="287" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">11</text>
  <text x="451" y="278" font-size="11" font-weight="700" fill="${C.dark}">Headaches</text>
  <text x="451" y="294" font-size="9.5" fill="${C.muted}">Hormonal shifts in early pregnancy</text>
  <rect x="405" y="312" width="355" height="46" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="431" cy="335" r="12" fill="${C.rose}"/>
  <text x="431" y="339" text-anchor="middle" font-size="9" font-weight="700" fill="${C.white}">12</text>
  <text x="451" y="330" font-size="11" font-weight="700" fill="${C.dark}">Heightened Sense of Smell</text>
  <text x="451" y="346" font-size="9.5" fill="${C.muted}">Oestrogen amplifies scent sensitivity</text>
</svg>`;

// Blog W12-3 (PGT preparation): "3 Phases of the PGT Process"
// Source: Blog nodes [4-19] — Before/During/After PGT
const SVG_PGT_PHASES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 228" font-family="${FONT}">
  <rect width="800" height="228" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="226.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">3 PHASES OF THE PGT PROCESS</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <defs><marker id="arrPGT" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="${C.rose}"/></marker></defs>
  <rect x="40" y="44" width="230" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="230" height="40" rx="8" fill="${C.rose}"/>
  <rect x="40" y="76" width="230" height="8" fill="${C.rose}"/>
  <text x="155" y="68" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">BEFORE PGT</text>
  <circle cx="60" cy="107" r="5" fill="${C.rose}"/>
  <text x="74" y="111" font-size="10.5" fill="${C.dark}" font-weight="600">Fertility consultation</text>
  <circle cx="60" cy="135" r="5" fill="${C.rose}"/>
  <text x="74" y="139" font-size="10.5" fill="${C.dark}" font-weight="600">Genetic counselling</text>
  <circle cx="60" cy="163" r="5" fill="${C.rose}"/>
  <text x="74" y="167" font-size="10.5" fill="${C.dark}" font-weight="600">IVF protocol preparation</text>
  <line x1="272" y1="127" x2="287" y2="127" stroke="${C.rose}" stroke-width="1.5" marker-end="url(#arrPGT)"/>
  <rect x="290" y="44" width="220" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="400" y="68" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}">DURING PGT</text>
  <line x1="298" y1="82" x2="502" y2="82" stroke="${C.border}" stroke-width="1"/>
  <circle cx="310" cy="107" r="5" fill="${C.rose}"/>
  <text x="324" y="111" font-size="10.5" fill="${C.dark}" font-weight="600">Embryo biopsy (day 5)</text>
  <circle cx="310" cy="135" r="5" fill="${C.rose}"/>
  <text x="324" y="139" font-size="10.5" fill="${C.dark}" font-weight="600">Genetic lab testing</text>
  <circle cx="310" cy="163" r="5" fill="${C.rose}"/>
  <text x="324" y="167" font-size="10.5" fill="${C.dark}" font-weight="600">Embryo freezing</text>
  <line x1="512" y1="127" x2="527" y2="127" stroke="${C.rose}" stroke-width="1.5" marker-end="url(#arrPGT)"/>
  <rect x="530" y="44" width="230" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="645" y="68" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}">AFTER PGT</text>
  <line x1="538" y1="82" x2="752" y2="82" stroke="${C.border}" stroke-width="1"/>
  <circle cx="550" cy="107" r="5" fill="${C.rose}"/>
  <text x="564" y="111" font-size="10.5" fill="${C.dark}" font-weight="600">Receiving results</text>
  <circle cx="550" cy="135" r="5" fill="${C.rose}"/>
  <text x="564" y="139" font-size="10.5" fill="${C.dark}" font-weight="600">Embryo transfer</text>
  <circle cx="550" cy="163" r="5" fill="${C.rose}"/>
  <text x="564" y="167" font-size="10.5" fill="${C.dark}" font-weight="600">Post-transfer monitoring</text>
</svg>`;

// Blog W12-4 (PRP vs Traditional): "When to Choose PRP vs Traditional"
// Source: Blog nodes [15-17] — 4 PRP use cases, 3 traditional use cases
const SVG_PRP_VS_TRADITIONAL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 278" font-family="${FONT}">
  <rect width="800" height="278" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="276.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}" letter-spacing="0.3">PRP vs TRADITIONAL FERTILITY — WHEN TO CHOOSE</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="44" width="355" height="40" rx="8" fill="${C.rose}"/>
  <text x="218" y="68" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">CHOOSE PRP WHEN…</text>
  <rect x="405" y="44" width="355" height="40" rx="8" fill="${C.ivory}" stroke="${C.border}" stroke-width="1"/>
  <text x="582" y="68" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.dark}">CHOOSE TRADITIONAL WHEN…</text>
  <rect x="40" y="92" width="355" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="56" y="107" font-size="10.5" font-weight="700" fill="${C.rose}">Poor egg quality</text>
  <text x="56" y="122" font-size="9.5" fill="${C.muted}">PRP stimulates cellular repair and regeneration</text>
  <rect x="40" y="134" width="355" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="56" y="149" font-size="10.5" font-weight="700" fill="${C.rose}">Uterine lining issues</text>
  <text x="56" y="164" font-size="9.5" fill="${C.muted}">PRP thickens lining to improve implantation</text>
  <rect x="40" y="176" width="355" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="56" y="191" font-size="10.5" font-weight="700" fill="${C.rose}">Recurrent miscarriage</text>
  <text x="56" y="206" font-size="9.5" fill="${C.muted}">PRP may reduce inflammation for healthy pregnancy</text>
  <rect x="40" y="218" width="355" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="56" y="233" font-size="10.5" font-weight="700" fill="${C.rose}">Failed IVF cycles</text>
  <text x="56" y="248" font-size="9.5" fill="${C.muted}">Combine PRP with IVF to boost success rates</text>
  <rect x="405" y="92" width="355" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="421" y="107" font-size="10.5" font-weight="700" fill="${C.dark}">Severe infertility</text>
  <text x="421" y="122" font-size="9.5" fill="${C.muted}">IVF or ICSI may be more effective</text>
  <rect x="405" y="134" width="355" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="421" y="149" font-size="10.5" font-weight="700" fill="${C.dark}">Blocked fallopian tubes</text>
  <text x="421" y="164" font-size="9.5" fill="${C.muted}">IVF bypasses blocked tubes for fertilisation</text>
  <rect x="405" y="176" width="355" height="38" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <text x="421" y="191" font-size="10.5" font-weight="700" fill="${C.dark}">Male factor infertility</text>
  <text x="421" y="206" font-size="9.5" fill="${C.muted}">ICSI addresses low or abnormal sperm issues</text>
</svg>`;

// Blog W12-5 (IUI Failure reasons): "7 Common Causes of IUI Failure"
// Source: Blog nodes [29-42] — 7 causes listed
const SVG_IUI_FAILURE_CAUSES = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 316" font-family="${FONT}">
  <rect width="800" height="316" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="314.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">7 COMMON CAUSES OF IUI FAILURE</text>
  <line x1="40" y1="36" x2="760" y2="36" stroke="${C.border}" stroke-width="1"/>
  <rect x="40" y="52" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="79" r="14" fill="${C.rose}"/>
  <text x="64" y="83.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">1</text>
  <text x="86" y="74" font-size="11" font-weight="700" fill="${C.dark}">Age Factor</text>
  <text x="86" y="90" font-size="9.5" fill="${C.muted}">Women over 35 have lower IUI success rates</text>
  <rect x="40" y="112" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="139" r="14" fill="${C.rose}"/>
  <text x="64" y="143.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">2</text>
  <text x="86" y="134" font-size="11" font-weight="700" fill="${C.dark}">Poor Sperm Quality</text>
  <text x="86" y="150" font-size="9.5" fill="${C.muted}">Low motility or abnormal morphology reduces fertilisation</text>
  <rect x="40" y="172" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="199" r="14" fill="${C.rose}"/>
  <text x="64" y="203.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">3</text>
  <text x="86" y="194" font-size="11" font-weight="700" fill="${C.dark}">Ovulation Issues</text>
  <text x="86" y="210" font-size="9.5" fill="${C.muted}">Irregular or absent ovulation (PCOS) limits success</text>
  <rect x="40" y="232" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="64" cy="259" r="14" fill="${C.rose}"/>
  <text x="64" y="263.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">4</text>
  <text x="86" y="254" font-size="11" font-weight="700" fill="${C.dark}">Tubal Blockage or Damage</text>
  <text x="86" y="270" font-size="9.5" fill="${C.muted}">Blocked or damaged tubes prevent egg-sperm meeting</text>
  <rect x="405" y="52" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="79" r="14" fill="${C.rose}"/>
  <text x="429" y="83.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">5</text>
  <text x="451" y="74" font-size="11" font-weight="700" fill="${C.dark}">Endometrial Lining Issues</text>
  <text x="451" y="90" font-size="9.5" fill="${C.muted}">Thin or unhealthy lining prevents implantation</text>
  <rect x="405" y="112" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="139" r="14" fill="${C.rose}"/>
  <text x="429" y="143.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">6</text>
  <text x="451" y="134" font-size="11" font-weight="700" fill="${C.dark}">Hormonal Imbalances</text>
  <text x="451" y="150" font-size="9.5" fill="${C.muted}">Thyroid disorders and insulin resistance disrupt ovulation</text>
  <rect x="405" y="172" width="355" height="54" rx="6" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <circle cx="429" cy="199" r="14" fill="${C.rose}"/>
  <text x="429" y="203.5" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">7</text>
  <text x="451" y="194" font-size="11" font-weight="700" fill="${C.dark}">Unexplained Infertility</text>
  <text x="451" y="210" font-size="9.5" fill="${C.muted}">No specific cause found despite normal test results</text>
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

  // ── Wave 2: Next 5 blogs ────────────────────────────────────────────
  "iui-vs-ivf-which-fertility-treatment-is-right-for-you": {
    svg:     SVG_IUI_VS_IVF_CHOOSE,
    title:   "Who Should Choose IUI vs IVF?",
    altText: "Two-panel decision guide: IUI when — mild male factor, ovulation disorders (PCOS), unexplained infertility under 35, donor sperm, cervical factor. IVF when — blocked tubes, severe male factor, 3+ failed IUIs, women over 35, endometriosis or poor ovarian reserve.",
  },

  "10-foods-to-improve-female-egg-quality": {
    svg:     SVG_TEN_FOODS_EGG,
    title:   "10 Foods That Boost Egg Quality",
    altText: "Two-column grid of 10 egg-quality foods: 1 Avocados, 2 Leafy Greens (Spinach, Kale), 3 Berries, 4 Nuts & Seeds, 5 Whole Grains, 6 Eggs, 7 Fatty Fish (Salmon), 8 Lentils & Legumes, 9 Citrus Fruits, 10 Dark Chocolate (70%+).",
  },

  "how-male-infertility-affects-ivf-treatment": {
    svg:     SVG_MALE_INFERTILITY_CAUSES,
    title:   "Common Causes of Male Infertility",
    altText: "Four-box grid of male infertility causes: Medical (varicocele, hormonal imbalances, infections), Genetic (Klinefelter syndrome, Y-chromosome microdeletions), Lifestyle (smoking, alcohol, obesity), Environmental (heat exposure, toxins, radiation).",
  },

  "how-nutrition-impacts-your-fertility-what-science-says": {
    svg:     SVG_FERTILITY_NUTRIENTS,
    title:   "Key Nutrients for Fertility",
    altText: "Two-column infographic: Female fertility nutrients — Folate (leafy greens), Iron (lentils, spinach), Omega-3 (salmon, flaxseeds), Vitamin D (sunlight, eggs). Male fertility nutrients — Zinc (pumpkin seeds, oysters), Vitamin C (citrus, bell peppers), CoQ10 (soybeans, whole grains).",
  },

  "icsi-vs-ivf-success-rates-benefits-and-risks-compared": {
    svg:     SVG_ICSI_VS_IVF_WHEN,
    title:   "When to Choose IVF vs ICSI",
    altText: "Two-column decision guide: IVF when — female or unexplained infertility, normal sperm, no previous fertilization failure, fertility preservation. ICSI when — low sperm count, poor motility, abnormal morphology, previous IVF fertilization failure, frozen or surgically retrieved sperm.",
  },

  // ── Wave 3: Next 5 blogs ────────────────────────────────────────────
  "how-lifestyle-choices-of-both-partners-impact-icsi-success-rates": {
    svg:     SVG_ICSI_LIFESTYLE,
    title:   "5 Lifestyle Factors That Affect ICSI Success",
    altText: "Five-item infographic: 1 Diet & Nutrition (healthy eggs and sperm), 2 Avoid Smoking (significant risk to outcomes), 3 Manage Stress (mind-body connection), 4 Exercise & Body Weight (healthy BMI improves outcomes), 5 Shared Responsibility (both partners matter equally).",
  },

  "how-pre-implantation-genetic-testing-boosts-ivf-success": {
    svg:     SVG_PGT_TYPES,
    title:   "3 Types of Pre-Implantation Genetic Testing (PGT)",
    altText: "Three-panel infographic: PGT-A screens for abnormal chromosome numbers (aneuploidies), best for women over 35 and recurrent miscarriage. PGT-M identifies specific single-gene disorders like BRCA and cystic fibrosis. PGT-SR detects structural chromosome rearrangements in translocation carriers.",
  },

  "is-egg-freezing-a-good-option-if-i-want-to-delay-pregnancy": {
    svg:     SVG_EGG_FREEZING_STEPS,
    title:   "How Egg Freezing Works — 3 Steps",
    altText: "Three-step horizontal flow: Step 1 Ovarian Stimulation (hormone injections over 10–14 days to produce multiple eggs), Step 2 Egg Retrieval (minor procedure under sedation using ultrasound-guided needle), Step 3 Freeze & Store (vitrification flash-freezing, stored in liquid nitrogen).",
  },

  "ivf-after-35-navigating-fertility-challenges-with-confidence-and-hope": {
    svg:     SVG_IVF_AFTER_35,
    title:   "IVF After 35 — 5 Techniques That Help",
    altText: "Five-item grid: 1 Genetic Testing / PGT (screens embryos for chromosomal issues), 2 Egg Freezing (preserve fertility before age affects quality), 3 Embryo Banking (multiple cycles to build a healthy batch), 4 Ovarian Rejuvenation (emerging treatments), 5 Personalised IVF Protocol (tailored to each woman's unique profile).",
  },

  "how-to-improve-ovulation-naturally-when-you-have-pcos": {
    svg:     SVG_PCOS_OVULATION,
    title:   "7 Natural Ways to Improve Ovulation with PCOS",
    altText: "Two-column grid: 1 PCOS-Friendly Diet, 2 Maintain Healthy Weight, 3 Smart Exercise, 4 Manage Stress & Sleep, 5 Evidence-Based Supplements, 6 Herbal Support, 7 Track Ovulation Naturally.",
  },

  // ── Wave 4: Next 5 blogs ────────────────────────────────────────────
  "how-long-do-you-have-to-wait-to-try-again-after-a-miscarriage": {
    svg:     SVG_MISCARRIAGE_TIMELINE,
    title:   "Waiting to Try Again After Miscarriage — Recommended Timeline",
    altText: "Three-panel infographic: 4–8 weeks (1–2 menstrual cycles) general recommendation for uterus healing; 3–6 months after D&C procedure for complete uterine recovery; 6–12 months after recurrent miscarriage (3 or more) for thorough evaluation and treatment.",
  },

  "how-long-does-it-take-for-letrozole-to-get-out-of-your-system": {
    svg:     SVG_LETROZOLE_CLEARANCE,
    title:   "How Long Letrozole Stays in Your System",
    altText: "Four-stage elimination chart: 1–2 days peak plasma concentration; 2–4 days half-life (50% eliminated); 4–7 days 75% eliminated; 10–14 days 95% cleared from system.",
  },

  "how-long-does-it-take-for-the-uterus-to-go-back-to-normal-after-birth": {
    svg:     SVG_UTERUS_RECOVERY,
    title:   "Uterine Recovery After Birth — Timeline",
    altText: "Four-stage recovery timeline: 0–24 hours grapefruit-size uterus (2–3 lbs); 1–2 weeks shrinks to small orange size; 2–6 weeks returns to pre-pregnancy pear size; 6–12 weeks fully tones and all pregnancy changes resolve.",
  },

  "how-long-should-you-see-a-gynecologist-after-delivery": {
    svg:     SVG_POSTPARTUM_VISITS,
    title:   "What Your Postpartum Gynecologist Visits Cover",
    altText: "Five-item infographic: 1 Physical Examinations (pelvic, breast, scar checks); 2 Mental Health Evaluation (PPD and anxiety screening); 3 Breastfeeding Support (lactation guidance, mastitis management); 4 Family Planning (contraception options, future pregnancies); 5 Pelvic Floor Health (incontinence exercises).",
  },

  "how-low-amh-affects-menstrual-cycle-regularity": {
    svg:     SVG_LOW_AMH_EFFECTS,
    title:   "4 Ways Low AMH Affects Menstrual Cycles",
    altText: "Four-box grid: 1 Irregular Cycles (skipped periods, variable cycle length); 2 Decreased Follicle Count (fewer eggs, inconsistent ovulation signals); 3 Disrupted Ovulation (inconsistent or absent ovulation, anovulation); 4 Hormonal Imbalances (estrogen and progesterone fluctuations affecting cycle regularity).",
  },

  // ── Wave 5: Published blogs ─────────────────────────────────────────
  "how-many-times-can-a-person-undergo-ivf-procedure": {
    svg:     SVG_IVF_CYCLE_FACTORS,
    title:   "4 Factors That Influence How Many IVF Cycles You May Need",
    altText: "Four-box grid: 1 Age (women's age significantly affects IVF success rates); 2 Type of Fertility Issues (severity of condition impacts treatment outcomes); 3 Medical History (previous conditions or surgeries influence decisions); 4 Response to Previous Cycles (prior IVF outcomes guide future treatment plans).",
  },

  "how-much-weight-can-a-baby-gain-in-a-week-in-the-womb": {
    svg:     SVG_BABY_WEIGHT_TRIMESTERS,
    title:   "Baby Weight Gain by Trimester",
    altText: "Three-panel infographic: First Trimester 0–12 weeks (0.5–1 gram per week, ~14 grams at 12 weeks); Second Trimester 13–26 weeks (50–100 grams per week, ~300 grams at 20 weeks); Third Trimester 27–40 weeks (100–200 grams per week, 3–4 kg at 40 weeks).",
  },

  "how-to-get-pregnant-without-removing-fibroid-or-without-surgery": {
    svg:     SVG_FIBROID_TYPES,
    title:   "3 Types of Uterine Fibroids",
    altText: "Three-panel infographic: Submucosal fibroids grow under the inner uterine lining, protrude into the cavity, and cause heavy bleeding. Intramural fibroids (most common) grow within the muscular wall causing pelvic pain and pressure. Subserosal fibroids grow on the outer uterine wall, pressing on bladder or rectum.",
  },

  "how-to-improve-your-chances-of-conceiving-naturally-with-low-amh-levels": {
    svg:     SVG_LOW_AMH_CONCEPTION,
    title:   "5 Ways to Improve Natural Conception with Low AMH",
    altText: "Five-row infographic: 1 Track Ovulation Accurately (OPKs, BBT charting, fertile window); 2 Eat a Fertility-Friendly Diet (antioxidants, leafy greens, omega-3s, Mediterranean style); 3 Maintain Healthy Body Weight (BMI 18.5–24.9, yoga or walking); 4 Reduce Stress (meditation, yoga, acupuncture, counselling); 5 Consider Supplements with medical advice (CoQ10, Vitamin D, Omega-3s).",
  },

  "how-to-improve-your-chances-of-iui-success-naturally": {
    svg:     SVG_IUI_NATURAL_TIPS,
    title:   "10 Natural Ways to Boost IUI Success",
    altText: "Two-column grid of 10 natural tips: Track Ovulation, Fertility-Friendly Diet, Healthy Body Weight, Reduce Stress, Fertility Yoga and Light Exercise, Avoid Alcohol and Smoking, Adequate Sleep, Evidence-Based Supplements, Male Partner Health, and Positive Mindset.",
  },

  // ── Wave 6: Published blogs ─────────────────────────────────────────
  "how-to-protect-your-mental-health-during-ivf-and-fertility-treatments": {
    svg:     SVG_IVF_MENTAL_HEALTH,
    title:   "5 Reasons IVF Can Be Emotionally Challenging",
    altText: "Five-row infographic: 1 Uncertainty of Outcomes (each cycle brings anticipation, results may vary); 2 Hormonal Changes (fertility medications intensify emotional sensitivity); 3 Social Pressure (family and societal expectations feel overwhelming); 4 Financial Stress (treatments are costly, adding extra burden); 5 Repeated Procedures (multiple cycles or failures take a mental and physical toll).",
  },

  "a-complete-guide-on-explaining-periods-to-men": {
    svg:     SVG_MENSTRUAL_CYCLE,
    title:   "The 4 Phases of the Menstrual Cycle",
    altText: "Four-panel horizontal infographic: Day 1–5 Menstruation (uterine lining sheds, bleeding occurs); Day 6–14 Follicular Phase (hormones stimulate follicle growth, estrogen rises); Day 14 Ovulation (LH surge triggers egg release, peak fertility); Day 15–28 Luteal Phase (hormones prepare uterus for potential pregnancy).",
  },

  "indian-celebrities-who-improved-fertility-through-yoga": {
    svg:     SVG_YOGA_FERTILITY,
    title:   "7 Ways Yoga Supports Fertility",
    altText: "Two-column grid: 1 Reduce Stress (Pranayama, meditation calm cortisol); 2 Improve Blood Circulation (Supta Baddha Konasana enhances pelvic flow); 3 Balance Hormonal Levels (Surya Namaskar stimulates endocrine function); 4 Strengthen the Body (Bridge Pose strengthens pelvic floor); 5 Promote Detoxification (hydration and gentle detox); 6 Enhance Emotional Well-being (heart-opening poses); 7 Improve Sleep Quality (Yoga Nidra promotes restful sleep).",
  },

  "a-guide-to-the-different-types-of-ivf-treatments": {
    svg:     SVG_IVF_TYPES,
    title:   "8 Types of IVF Treatment — At a Glance",
    altText: "Two-column grid of 8 IVF types: 1 Conventional IVF (egg fertilised with sperm in lab dish); 2 ICSI (single sperm injected into egg); 3 Donor IVF (uses donor eggs, sperm, or embryos); 4 Surrogacy (another woman carries the baby); 5 PGD (tests embryos for genetic disorders); 6 PGT-A (screens embryos for chromosomal abnormalities); 7 FET (transfers frozen embryos); 8 Natural Cycle IVF (no medications, monitors natural cycle).",
  },

  "innovative-treatments-for-low-amh": {
    svg:     SVG_LOW_AMH_INNOVATIVE,
    title:   "9 Innovative Treatments for Low AMH",
    altText: "Three-column grid: 1 Personalised IVF Protocols; 2 Ovarian PRP Therapy; 3 Stem Cell Therapy; 4 Genetic Modifications; 5 Hormonal Supplementation (DHEA); 6 Acupuncture and Complementary Therapies; 7 Lifestyle Modifications; 8 Oocyte Preservation (Vitrification); 9 Time-Lapse Technology for embryo monitoring.",
  },

  // ── Wave 7: Published blogs ─────────────────────────────────────────
  "how-to-prepare-for-your-first-iui-cycle-tips-and-advice": {
    svg:     SVG_IUI_PREP_TIPS,
    title:   "6 Essential IUI Preparation Tips",
    altText: "Two-column grid of 6 IUI preparation tips: 1 Monitor Your Cycle (use OPKs or basal body temperature to track ovulation and fertile window); 2 Maintain a Healthy Diet (fruits, vegetables, lean proteins, omega-3 fatty acids, prenatal vitamins); 3 Manage Stress (mindfulness, yoga, counselling or fertility support groups); 4 Prepare for Medications (follow prescription schedule, ask about side effects); 5 Make Lifestyle Changes (limit caffeine and alcohol, quit smoking, maintain healthy weight); 6 Plan for the Procedure Day (arrive rested, procedure takes 15 minutes, rest lightly afterward).",
  },

  "icsi-dos-and-donts": {
    svg:     SVG_ICSI_DOS_DONTS,
    title:   "ICSI Do's & Don'ts: 5 Key Rules Each",
    altText: "Two-column comparison: Do's column — Follow doctor's instructions, Eat a balanced diet, Stay hydrated, Moderate exercise (walking/yoga), Get 7-8 hours sleep. Don'ts column — Don't skip medications or appointments, Avoid alcohol and caffeine, Don't smoke, No high-intensity exercise, Don't self-prescribe supplements.",
  },

  "is-icsi-better-for-men-with-low-sperm-count": {
    svg:     SVG_ICSI_SPERM_CONDITIONS,
    title:   "5 Male Factor Conditions Where ICSI Works Best",
    altText: "Five-row infographic: 1 Oligospermia — low sperm count; only one viable sperm needed per egg; 2 Asthenospermia — poor sperm motility; ICSI bypasses natural swim requirement; 3 Teratospermia — abnormal sperm shape; morphology does not affect ICSI success; 4 Previous IVF Failure — fertilisation issues resolved by direct injection; 5 Azoospermia — no sperm in semen; surgically retrieved via TESA, PESA, or Micro-TESE.",
  },

  "is-iui-painful-everything-you-need-to-know": {
    svg:     SVG_IUI_PAIN_GUIDE,
    title:   "IUI Comfort Guide: During & After the Procedure",
    altText: "Two-panel infographic. During IUI panel: procedure takes 5-10 minutes; similar to a Pap smear; mild pressure when catheter passes through cervix; many women feel almost nothing. After IUI panel: mild cramping similar to menstrual cramps; light spotting may occur; normal activities can resume same day; symptoms typically resolve within 24 hours.",
  },

  "is-ivf-painful": {
    svg:     SVG_IVF_STAGES_PAIN,
    title:   "5 IVF Stages: What to Expect",
    altText: "Five-row stage chart. Stage 1 Ovarian Stimulation (8-14 days): daily hormone injections, mild bloating and injection-site discomfort. Stage 2 Egg Retrieval (20-30 min): performed under sedation; mild cramping after. Stage 3 Fertilisation and Embryo Development (3-5 days): entirely in the lab, no physical discomfort. Stage 4 Embryo Transfer (10-15 min): thin catheter guided by ultrasound; mild pressure, no sedation. Stage 5 Luteal Phase Support: progesterone supplements; possible bloating and mood changes.",
  },

  // ── Wave 8: Published blogs ─────────────────────────────────────────
  "is-ivf-possible-without-injections-understanding-easy-ivf-and-injection-free-ivf": {
    svg:     SVG_INJECTION_FREE_IVF,
    title:   "3 Paths to Easier IVF — Less Injection, More Comfort",
    altText: "Three-panel horizontal infographic. Panel 1 Easy IVF: fewer injections overall; shorter cycles; simplified schedules; oral medications or patches replace some injectables. Panel 2 Minimal Stimulation IVF: oral medications (Clomid/Letrozole); fewer gonadotropin injections; lower cost; ideal for poor ovarian responders. Panel 3 Natural Cycle IVF: no hormonal medications; monitors natural cycle; one egg retrieved per cycle; only one final trigger injection may be required.",
  },

  "is-natural-cycle-ivf-better-for-women-with-poor-ovarian-reserve": {
    svg:     SVG_NATURAL_CYCLE_IVF_BENEFITS,
    title:   "4 Key Benefits of Natural Cycle IVF",
    altText: "Two-by-two card grid. Card 1 Reduced Risk of OHSS: no ovarian stimulation means no risk of hyperstimulation syndrome. Card 2 Lower Cost: no expensive hormonal medications; more affordable than standard IVF. Card 3 Fewer Side Effects: no bloating, mood swings or injection-site discomfort. Card 4 Potentially Better Egg Quality: natural selection may produce the body's highest-quality egg.",
  },

  "iui-process-explained-what-to-expect-at-every-step": {
    svg:     SVG_IUI_8_STEPS,
    title:   "8 Steps of the IUI Process — What to Expect",
    altText: "Two-column 8-step grid. Step 1 Initial Consultation and Fertility Evaluation (medical history, blood tests, ultrasound, semen analysis). Step 2 Ovulation Monitoring or Induction (natural tracking or Clomiphene/Gonadotropins). Step 3 Triggering Ovulation (HCG shot when follicle reaches 18-20 mm). Step 4 Sperm Collection and Preparation (washed and concentrated to isolate motile sperm). Step 5 The IUI Procedure (catheter places sperm into uterus; few minutes). Step 6 Post-IUI Instructions and Medications (progesterone support; avoid heavy lifting). Step 7 The Two-Week Wait (manage stress; continue medications). Step 8 Pregnancy Testing and Next Steps (blood beta-hCG test; scan if positive).",
  },

  "iui-side-effects-on-the-body-and-emotions-a-complete-guide": {
    svg:     SVG_IUI_SIDE_EFFECTS,
    title:   "5 Common Physical Side Effects of IUI",
    altText: "Five-row infographic. Row 1 Cramping and Mild Discomfort: caused by catheter insertion; use warm compress and rest after. Row 2 Spotting or Light Bleeding: minor cervical irritation from catheter; harmless. Row 3 Breast Tenderness: hormonal medications cause swollen or sore breasts. Row 4 Bloating or Abdominal Fullness: hormonal stimulation causes temporary heaviness; resolves in days. Row 5 Headaches or Mood Swings: linked to Clomiphene or Gonadotropins; uncommon and temporary.",
  },

  "a-quick-guide-on-the-ivf-journey-with-egg-donors": {
    svg:     SVG_EGG_DONOR_IVF_STEPS,
    title:   "8 Steps: IVF with Egg Donation",
    altText: "Two-column 8-step grid. Step 1 Initial Consultation and Counseling (medical history; psychological counseling). Step 2 Selecting an Egg Donor (anonymous or known; screened for genetics, health, psychology). Step 3 Synchronising Menstrual Cycles (hormonal medications synchronise recipient and donor). Step 4 Egg Retrieval under light sedation; 20-30 minutes. Step 5 Fertilisation and Embryo Culture (lab fertilisation; embryos cultured 3-5 days). Step 6 Embryo Transfer (best embryo placed into uterus). Step 7 Pregnancy Test and Follow-up (beta-hCG blood test 10-14 days after transfer). Step 8 Emotional Support and Counseling (ongoing psychological support throughout journey).",
  },

  // ── Wave 9: Published blogs ─────────────────────────────────────────
  "iui-success-rate-what-to-expect-after-iui-treatment": {
    svg:     SVG_IUI_SUCCESS_FACTORS,
    title:   "4 Key Factors That Affect IUI Success Rate",
    altText: "Four-card horizontal infographic. Card 1 Age of the Woman: under 35 approx 15-18%, age 35-40 approx 10-15%, over 40 lower rates due to egg quality decline. Card 2 Fertility Issues: best results with healthy tubes and mild ovulation or unexplained infertility. Card 3 Sperm Quality: higher motility and concentration improve fertilisation odds significantly. Card 4 Number of Cycles: cumulative success improves over multiple attempts; typically 3-6 cycles recommended.",
  },

  "ivf-cost-in-ahmedabad-whats-included-how-to-plan-your-budget": {
    svg:     SVG_IVF_COST_COMPONENTS,
    title:   "10 Cost Components of an IVF Cycle",
    altText: "Two-column 10-item grid. Items 1-5: Initial Consultation and Diagnostic Tests; Ovarian Stimulation Medications; Egg Retrieval Procedure; Sperm Collection and Preparation; IVF Lab Charges and Fertilisation. Items 6-10: Embryo Transfer Procedure; Embryo Freezing and Storage; Additional Procedures such as PGT, ERA, and donor gametes; Pregnancy Test and Follow-up; Total Cycle Cost which varies by treatment type and clinic.",
  },

  "ivf-failure-doesnt-mean-the-end-what-can-you-do-next": {
    svg:     SVG_IVF_FAILURE_REASONS,
    title:   "6 Common Reasons IVF Cycles Fail",
    altText: "Three-row two-column grid plus a footer note. Reason 1 Poor Egg Quality (genetic abnormalities prevent fertilisation). Reason 2 Embryo Quality Issues (chromosomal problems prevent implantation). Reason 3 Uterine Issues (thin lining, polyps, fibroids block implantation). Reason 4 Sperm Factors (low count, motility, morphology, or high DNA fragmentation). Reason 5 Immune or Genetic Factors (immune system may reject the embryo). Reason 6 Timing and Technique (transfer precision and lab expertise influence outcome). Footer: One failed cycle is not the end — PGT-A, ERA, and Hysteroscopy help most couples succeed in subsequent cycles.",
  },

  "ivf-for-single-women-in-india-navigating-new-art-law": {
    svg:     SVG_ART_LAW_SINGLE_WOMEN,
    title:   "4 Key ART Law Provisions for Single Women in India",
    altText: "Two-by-two card grid. Card 1 Eligibility for IVF: single women including unmarried women and single mothers are legally eligible. Card 2 Age Requirements: women must be between 21 and 50 years of age. Card 3 Informed Consent: all ART procedures require pre-treatment counseling and documented consent. Card 4 Confidentiality: patient identities and medical records are kept strictly confidential by law.",
  },

  "ivf-pregnancy-week-by-week-symptoms-and-safety": {
    svg:     SVG_IVF_PREGNANCY_MILESTONES,
    title:   "IVF Pregnancy: 8 Key Weekly Milestones",
    altText: "Two-column 8-milestone chart with rose accent bars. Weeks 1-4 Conception and Confirmation (embryo implants; avoid alcohol and smoking). Weeks 5-8 Early Pregnancy Symptoms (nausea, fatigue, breast tenderness; prenatal check-ups begin). Weeks 9-12 Transition to Second Trimester (energy returns; genetic screening). Weeks 13-16 Maternal Comfort and Fetal Growth (amniocentesis may be offered; light exercise with clearance). Weeks 17-20 Halfway Milestone (fetal movements felt; gestational diabetes screening). Weeks 21-24 Fetal Anomaly Scan (most important structural scan; fetal echo if advised). Weeks 25-28 Third Trimester Begins (fetal movements monitored; swelling increases). Weeks 37-40 Full-Term Pregnancy (labor signs appear; prepare for hospital).",
  },

  // ── Wave 10: Published blogs ──────────────────────────────────────────
  "advancing-ovarian-science-a-full-day-scientific-program-in-surat": {
    svg:     SVG_OVARIAN_SCIENCE_TOPICS,
    title:   "4 Key Topics of the BFI Ovarian Science Program",
    altText: "Four-panel horizontal infographic. Panel 1 Ovarian Physiology: how the ovary functions and produces eggs. Panel 2 Ovarian Reserve: assessment and management strategies. Panel 3 Poor Ovarian Response: advanced management approaches. Panel 4 Advanced Fertility Management: expert clinical insights from BFI specialists.",
  },

  "ivf-pregnancy-with-pcos-and-endometriosis": {
    svg:     SVG_IVF_PCOS_ENDO_BENEFITS,
    title:   "4 Key Benefits of IVF for PCOS and Endometriosis",
    altText: "Two-by-two card grid. Card 1 Overcomes Ovulation Issues: controlled stimulation bypasses irregular ovulation in PCOS. Card 2 Bypasses Endometriosis Blockages: eggs retrieved directly, avoiding fallopian tube damage. Card 3 Improves Fertilisation Rates: ICSI and advanced lab techniques maximise each fertilisation chance. Card 4 Increases Implantation Chances: careful embryo selection ensures uterine readiness for transfer.",
  },

  "life-after-iui-precautions-lifestyle-tips-and-what-to-expect": {
    svg:     SVG_POST_IUI_DOS_DONTS,
    title:   "Post-IUI Care Guide: What to Do and What to Avoid",
    altText: "Two-column comparison infographic. Left column 5 things to do after IUI: Take medications as prescribed (progesterone support on schedule); Rest for 24 hours (mild cramping is normal); Stay hydrated and eat well (8-10 glasses water); Use a warm compress for comfort (eases pelvic heaviness); Attend follow-up appointment (beta-hCG test after 14 days). Right column 5 things to avoid: No heavy lifting or intense exercise; No hot baths, saunas or swimming; No alcohol, smoking or caffeine; Don't test pregnancy before 14 days; Don't panic over mild symptoms (light spotting and bloating are normal).",
  },

  "lifestyle-changes-that-boost-fertility-in-pcos-women": {
    svg:     SVG_PCOS_FERTILITY_LIFESTYLE,
    title:   "8 Lifestyle Changes to Boost Fertility with PCOS",
    altText: "Two-column eight-item grid. Items 1-4: Balanced Nutrition (low-GI foods, lean proteins, healthy fats); Regular Smart Exercise (cardio, strength and yoga — avoid overtraining); Maintain Healthy Weight (5-10% weight loss can restore ovulation in PCOS); Reduce Stress (mindfulness, meditation and counselling). Items 5-8: Prioritize Quality Sleep (7-9 hours nightly with a consistent schedule); Avoid Smoking and Limit Alcohol (both affect ovarian reserve and hormone levels); Consider Supplements (Inositol, Vitamin D, Omega-3 — with your doctor); Track Ovulation (OPKs, BBT charts or ultrasound monitoring).",
  },

  "lifestyle-changes-to-boost-ivf-success-and-increase-your-chances-of-a-healthy-pregnancy": {
    svg:     SVG_IVF_SUCCESS_LIFESTYLE,
    title:   "10 Lifestyle Changes to Boost IVF Success",
    altText: "Two-column ten-item grid. Items 1-5: Maintain a Healthy Diet (antioxidant-rich whole foods; avoid processed food); Achieve a Healthy Weight (BMI 18.5-24.9 optimal for implantation); Exercise Moderately (walking, swimming, yoga; avoid high-intensity training); Manage Stress Effectively (meditation, mindfulness, partner communication); Quit Smoking and Limit Alcohol (reduces egg quality and sperm count). Items 6-10: Focus on Fertility Supplements (folic acid, CoQ10, Vitamin D — with your doctor); Get Sufficient Sleep (7-8 hours nightly; consistent schedule); Avoid Environmental Toxins (BPA, pesticides and chemicals); Stay Well Hydrated (8-10 glasses daily); Maintain Work-Life Balance (reduce occupational stress; take regular breaks).",
  },

  // ── Wave 11: Published blogs ──────────────────────────────────────────
  "natural-conception-with-low-amh-levels": {
    svg:     SVG_NATURAL_CONCEPTION_LOW_AMH,
    title:   "6 Ways to Improve Natural Conception with Low AMH",
    altText: "Two-column six-item grid. Items 1-3: Optimize Your Diet (antioxidants, healthy fats, lean proteins, whole grains); Manage Stress Effectively (mindfulness, yoga, breathing and quality sleep); Exercise in Moderation (walking, swimming, yoga; avoid over-exercising). Items 4-6: Maintain a Healthy Weight (balanced BMI supports hormone production); Take Fertility Supplements (CoQ10, Vitamin D, Omega-3, Folate — with your doctor); Track Ovulation Carefully (OPKs, BBT charting, cervical mucus monitoring).",
  },

  "necrozoospermia-symptoms-causes-and-treatment-options": {
    svg:     SVG_NECROZOOSPERMIA_CAUSES,
    title:   "8 Common Causes of Necrozoospermia",
    altText: "Two-column eight-item grid. Items 1-4: Infections and Inflammation (prostatitis, epididymitis — toxins that damage sperm cells); Oxidative Stress (ROS from poor diet, smoking, toxins, heat); Exposure to Toxins (industrial chemicals, pesticides and radiation damage sperm); High Scrotal Temperature (varicocele, tight clothing, hot baths, laptop heat). Items 5-8: Medications and Treatments (chemotherapy, radiation or certain antibiotics); Autoimmune Reactions (anti-sperm antibodies attack and kill viable sperm); Hormonal Imbalance (testosterone disorders reduce sperm quality); Genetic Factors (chromosomal defects impair sperm development and function).",
  },

  "nourishing-your-body-after-embryo-transfer-a-comprehensive-guide": {
    svg:     SVG_EMBRYO_TRANSFER_NUTRIENTS,
    title:   "5 Key Nutrients for Embryo Implantation",
    altText: "Five-panel horizontal infographic. Panel 1 Folic Acid: fetal neural tube development and cell health. Panel 2 Omega-3: reduces uterine inflammation and supports embryo. Panel 3 Protein: fuels cell repair and embryo growth after transfer. Panel 4 Iron: prevents anaemia for healthy embryo development. Panel 5 Antioxidants: protects cells from oxidative stress damage.",
  },

  "ovarian-rejuvenation-for-restoring-fertility-a-new-ray-of-hope": {
    svg:     SVG_OVARIAN_REJUVENATION_BENEFITS,
    title:   "5 Key Benefits of Ovarian Rejuvenation Therapy",
    altText: "Five-row single-column infographic. Row 1 May Improve Hormone Levels: AMH and oestrogen levels may improve after PRP ovarian treatment. Row 2 Could Lead to Natural Ovulation: dormant follicles may be re-activated to produce viable eggs. Row 3 Potential for More Eggs in IVF: better ovarian response allows retrieval of more eggs per cycle. Row 4 Chance to Conceive with Own Eggs: explore natural conception before considering egg donation. Row 5 Minimally Invasive and Safe: uses patient's own blood (PRP) — no risk of allergic reactions.",
  },

  "ovarian-rejuvenation-ivf-what-to-know-when-combining-treatments": {
    svg:     SVG_BFI_REJUVENATION_IVF,
    title:   "Why Choose BFI for Ovarian Rejuvenation + IVF",
    altText: "Five-row accent-bar infographic listing BFI differentiators. Reason 1 Personalised Assessment: thorough evaluation of ovarian reserve, fertility history and treatment goals. Reason 2 Realistic Expectations: honest guidance on what each procedure can achieve. Reason 3 Transparent Counselling: clear explanation of benefits, limitations and risks. Reason 4 Comprehensive Fertility Solutions: IVF, ICSI, PRP and emerging treatments tailored to each patient. Reason 5 Ethical and Compassionate Care: patient comfort, safety and emotional support throughout the journey.",
  },

  // ── Wave 12: Published blogs ──────────────────────────────────────────
  "asthenospermia-understanding-the-condition-and-exploring-assisted-reproductive-technologies-art-options": {
    svg:     SVG_ART_OPTIONS_ASTHENOSPERMIA,
    title:   "5 ART Options for Asthenospermia",
    altText: "Five-panel horizontal infographic. Panel 1 IUI: washed sperm placed directly into the uterus. Panel 2 IVF: eggs retrieved and fertilised in the lab. Panel 3 ICSI: single sperm injected directly into the egg. Panel 4 MACS: sperm sorted by motility and DNA integrity. Panel 5 PICSI: healthiest sperm selected via hyaluronan binding.",
  },

  "pregnancy-signs-symptoms": {
    svg:     SVG_PREGNANCY_SIGNS_12,
    title:   "12 Early Signs of Pregnancy",
    altText: "Two-column twelve-item grid. Items 1-6 (left): Missed Period (most common first sign); Nausea / Vomiting (morning sickness); Fatigue (extreme tiredness); Breast Changes (tenderness, swelling, darkening); Frequent Urination (kidneys processing extra fluid); Food Aversions / Cravings (hormonal changes alter taste and smell). Items 7-12 (right): Mood Swings (rapid hormone fluctuations); Light Spotting / Cramping (may indicate implantation bleeding); Bloating / Constipation (progesterone slows digestion); Dizziness (blood pressure and volume changes); Headaches (hormonal shifts); Heightened Sense of Smell (oestrogen amplifies scent sensitivity).",
  },

  "preparing-for-pgt-what-to-expect-before-during-and-after-the-procedure": {
    svg:     SVG_PGT_PHASES,
    title:   "3 Phases of the PGT Process",
    altText: "Three-panel horizontal infographic with arrows. Panel 1 Before PGT (rose header): fertility consultation, genetic counselling, IVF protocol preparation. Panel 2 During PGT: embryo biopsy on day 5, genetic lab testing, embryo freezing. Panel 3 After PGT: receiving results, embryo transfer, post-transfer monitoring.",
  },

  "prp-vs-traditional-fertility-treatments-whats-the-difference": {
    svg:     SVG_PRP_VS_TRADITIONAL,
    title:   "When to Choose: PRP vs Traditional Fertility Treatment",
    altText: "Two-column comparison infographic. Left column Choose PRP When (rose header) — 4 items: Poor egg quality (PRP stimulates cellular repair); Uterine lining issues (PRP thickens lining for implantation); Recurrent miscarriage (PRP may reduce inflammation); Failed IVF cycles (combine PRP with IVF). Right column Choose Traditional When — 3 items: Severe infertility (IVF or ICSI may be more effective); Blocked fallopian tubes (IVF bypasses blockage); Male factor infertility (ICSI addresses sperm issues).",
  },

  "reasons-for-iui-failure-symptoms-and-causes": {
    svg:     SVG_IUI_FAILURE_CAUSES,
    title:   "7 Common Causes of IUI Failure",
    altText: "Two-column seven-item grid. Items 1-4 (left): Age Factor (women over 35 have lower IUI success rates); Poor Sperm Quality (low motility or abnormal morphology reduces fertilisation); Ovulation Issues (irregular or absent ovulation as in PCOS); Tubal Blockage or Damage (blocked or damaged tubes prevent egg-sperm meeting). Items 5-7 (right): Endometrial Lining Issues (thin or unhealthy lining prevents implantation); Hormonal Imbalances (thyroid disorders and insulin resistance disrupt ovulation); Unexplained Infertility (no specific cause found despite normal test results).",
  },

  // ── Wave 32: Published blogs (FINAL WAVE) ─────────────────────────────
  "how-do-male-fertility-supplements-impact-ivf-results": {
    svg:     SVG_MALE_SUPPLEMENT_NUTRIENTS_4,
    title:   "4 Key Nutrients for Male Fertility Supplements",
    altText: "Four-card horizontal infographic. Card 1 CoQ10: boosts motility and sperm energy. Card 2 L-Carnitine: enhances motility and reproductive health. Card 3 Zinc and Selenium: support maturation and DNA integrity. Card 4 Folate and Vitamin C/E: protect sperm from oxidative damage.",
  },
  "how-do-thyroid-disorders-affect-fertility-in-women": {
    svg:     SVG_THYROID_FERTILITY_WOMEN,
    title:   "Thyroid Disorders: Effects on Fertility",
    altText: "Two-panel comparison infographic. Left panel Hypothyroidism Underactive with rose header: Irregular or Missed Periods (low hormone levels disrupt the cycle); Anovulation (increased prolactin suppresses egg release); Reduced Luteal Phase (shorter phase makes implantation difficult). Right panel Hyperthyroidism Overactive: Light or Infrequent Periods (excess hormone alters the cycle); Poor Egg Quality (increased miscarriage risk); Altered Cervical Mucus (less receptive to sperm; affects lining too).",
  },
  "how-does-follicle-count-affect-ivf-success-rates": {
    svg:     SVG_FOLLICLE_COUNT_IVF,
    title:   "Follicle Count & IVF Success",
    altText: "Three-panel infographic with rose headers. Panel Low: fewer than 5, diminished ovarian reserve. Panel Moderate (Ideal): 6 to 15, best balance of eggs and safety. Panel High: more than 15, higher OHSS risk. Footer note: egg quality matters as much as follicle quantity for IVF success.",
  },
  "how-does-letrozole-help-with-ovulation-and-pregnancy": {
    svg:     SVG_LETROZOLE_SUCCESS_RATES,
    title:   "Letrozole Success Rates",
    altText: "Three-panel infographic. Panel Ovulation: 60 to 80 percent of women ovulate. Panel Pregnancy PCOS, highlighted: 20 to 27 percent per cycle when ovulating. Panel Live Birth: higher rates versus Clomid in PCOS patients.",
  },
  "how-does-the-number-of-eggs-affect-ivf-success-rate": {
    svg:     SVG_EGG_COUNT_IVF,
    title:   "Egg Count & IVF Success",
    altText: "Three-panel infographic with rose headers. Panel Too Few: fewer than 5, limits fertilisation chances. Panel Optimal: 10 to 15 eggs, best balance of quality and safety. Panel High: more than 20, OHSS risk, may need frozen transfer. Footer note: 12 high-quality eggs can outperform 25 lower-quality eggs.",
  },
  "how-human-fertilization-works-step-by-step-explanation": {
    svg:     SVG_HUMAN_FERTILIZATION_5STEP,
    title:   "Human Fertilization: 5 Steps",
    altText: "Five-panel horizontal infographic. Panel 1 Ovulation: egg released around day 14. Panel 2 Sperm Production: mature in epididymis. Panel 3 Fertilization: sperm fuses with the egg. Panel 4 Zygote Formation: cells begin dividing. Panel 5 Implantation: into the uterine lining.",
  },
  "how-letrozole-works-a-comprehensive-guide-to-boosting-ovulation-for-fertility": {
    svg:     SVG_LETROZOLE_MECHANISM_4,
    title:   "How Letrozole Triggers Ovulation: 4 Steps",
    altText: "Four-row accent-bar infographic. Step 1 Reduces Estrogen: blocks the aromatase enzyme, lowering circulating estrogen. Step 2 Increases FSH and LH: pituitary responds to lower estrogen with more hormone. Step 3 Follicle Development: higher FSH stimulates ovarian follicle growth. Step 4 Triggers Ovulation: a mature egg is released from the ovary.",
  },
  // ── Wave 31: Published blogs ──────────────────────────────────────────
  "frozen-vs-fresh-embryo-transfer-which-is-better": {
    svg:     SVG_FROZEN_VS_FRESH_TRANSFER,
    title:   "Frozen vs Fresh Embryo Transfer",
    altText: "Two-panel comparison infographic. Left panel Frozen Embryo Transfer FET with rose header: Often Higher Success Rates (body recovers, uterine lining can be optimised); Reduced OHSS Risk (avoids the hormonal peak right after stimulation); Allows PGT-A Testing (99%+ embryo survival with modern vitrification). Right panel Fresh Embryo Transfer: Suits Normal Hormone Levels (best when stimulation response is balanced); Good for Younger Responders (works well without needing genetic testing); Shorter Overall Timeline (no freezing wait or extra storage cost).",
  },
  "government-vs-private-ivf-centres-in-ahmedabad-which-one-is-better": {
    svg:     SVG_GOVT_VS_PRIVATE_IVF,
    title:   "Government vs Private IVF Centres",
    altText: "Two-panel comparison infographic. Left panel Private IVF Centres with rose header: Higher Cost, EMI Options (transparent billing with flexible payment plans); Tailored Care (one-on-one counselling and personalised protocols); Higher Success Rates (skilled experts and modern technology). Right panel Government IVF Centres: Low-Cost or Subsidised (supported by government health schemes); General Approach (less individualised attention due to patient volume); Standard Success Rates (part-time fertility specialists, simpler cases).",
  },
  "how-age-affects-fertility-myths-vs-facts": {
    svg:     SVG_FERTILITY_AGE_MYTHS_4,
    title:   "4 Fertility Age Myths — Busted",
    altText: "Four-card myth-versus-fact infographic. Card 1 Myth Fertile until menopause, Fact declines sharply after 35. Card 2 Myth Male fertility unaffected, Fact sperm quality declines with age. Card 3 Myth IVF overcomes age decline, Fact IVF success also drops with age. Card 4 Myth Egg freezing guarantees pregnancy, Fact improves odds but doesn't guarantee.",
  },
  "10-foods-that-will-increase-sperm-count-and-5-foods-to-avoid": {
    svg:     SVG_IVF_VS_SURROGACY_KEY_DIFF,
    title:   "IVF vs Surrogacy: Key Differences",
    altText: "Two-panel comparison infographic. Left panel In Vitro Fertilisation IVF with rose header: Intended Mother Carries (suits women who can carry but struggle to conceive); Biological Connection (both parents can be genetically linked to the baby); Simpler Legal Process (no surrogacy contracts or court procedures needed). Right panel Surrogacy: Another Woman Carries (for those unable to safely carry a pregnancy); Genetic Link Still Possible (in gestational surrogacy, own eggs and sperm can be used); Requires Legal Contracts (formal agreements and compliance with national laws).",
  },
  "how-can-i-increase-my-amh-levels": {
    svg:     SVG_AMH_SUPPORT_STRATEGIES_7,
    title:   "7 Ways to Support AMH & Ovarian Health",
    altText: "Two-column seven-item grid infographic. Items 1-4 (left): Fertility-Friendly Diet (healthy fats, antioxidants, CoQ10); Supplements under supervision (DHEA, CoQ10, Vitamin D); Reduce Stress and Sleep Well (7-8 hours nightly, yoga, meditation); Quit Smoking and Limit Toxins. Items 5-7 (right): Ovarian PRP Therapy (stimulates follicle growth); Fertility Preservation (egg or embryo freezing); Customised IVF Protocols (tailored to AMH, age and history).",
  },
  // ── Wave 30: Published blogs ──────────────────────────────────────────
  "essential-precautions-to-take-after-embryo-transfer-for-ivf-success": {
    svg:     SVG_EMBRYO_TRANSFER_PRECAUTIONS_6,
    title:   "6 Key Precautions After Embryo Transfer",
    altText: "Two-column six-item grid infographic. Items 1-3 (left): Avoid Complete Bed Rest (light activity supports circulation and uterine health); Monitor Stress Levels (relaxation supports hormonal balance during implantation); Follow Medication Guidelines (progesterone and hormone support exactly as prescribed). Items 4-6 (right): Maintain a Balanced Diet (protein, fibre, folic acid, and 8-10 glasses of water daily); Avoid High Temperatures (no hot baths, saunas or prolonged sun exposure); Avoid Harmful Substances (no smoking, alcohol or environmental toxins).",
  },
  "essential-tests-for-male-infertility-what-to-expect": {
    svg:     SVG_MALE_INFERTILITY_TESTS_6,
    title:   "6 Essential Tests for Male Infertility",
    altText: "Two-column six-item grid infographic. Items 1-3 (left): Semen Analysis (measures sperm count, motility and morphology); Hormone Testing (testosterone, LH, FSH, prolactin and estradiol levels); Genetic Testing (checks Y-chromosome deletions, Klinefelter syndrome). Items 4-6 (right): Physical Examination (checks testes, varicocele, vas and epididymis); Ultrasound Examination (detects varicocele, atrophy and blockages); Sperm DNA Fragmentation (assesses DNA integrity for embryo and IVF success).",
  },
  "fibroids-and-diet-foods-that-may-help-manage-symptoms-naturally": {
    svg:     SVG_FIBROID_DIET_FOODS_6,
    title:   "6 Foods That May Help Manage Fibroid Symptoms",
    altText: "Two-column six-item grid infographic. Items 1-3 (left): Leafy Greens (antioxidants support hormone regulation); Berries (antioxidants reduce inflammation and oxidative stress); Whole Grains (regulate blood sugar and insulin levels). Items 4-6 (right): Cruciferous Vegetables (may help reduce estrogen levels); Fatty Fish (omega-3s promote hormone balance); Turmeric (curcumin may help reduce inflammation).",
  },
  "fibroids-in-young-women-and-teenagers-early-symptoms-and-myths": {
    svg:     SVG_YOUNG_WOMEN_FIBROID_TYPES,
    title:   "4 Types of Fibroids in Young Women",
    altText: "Four-card horizontal infographic. Card 1 Submucosal: under the lining, affects fertility. Card 2 Intramural: muscular wall, heavy periods. Card 3 Subserosal: outer surface, presses on organs. Card 4 Pedunculated: attached by a stalk, pain if it twists.",
  },
  "foods-to-avoid-during-pregnancy-and-why": {
    svg:     SVG_PREGNANCY_FOODS_AVOID_6,
    title:   "6 Foods to Avoid During Pregnancy",
    altText: "Two-column six-item grid infographic. Items 1-3 (left): Raw or Undercooked Seafood (risk of Listeria, Salmonella or Vibrio infection); Unpasteurized Dairy (Listeria risk from soft cheeses); High-Mercury Fish (shark, swordfish can affect baby's brain). Items 4-6 (right): Raw or Undercooked Meat (Toxoplasma gondii risk to baby's development); Raw or Undercooked Eggs (Salmonella risk from runny yolks); Alcohol (no level of alcohol is considered safe).",
  },
  // ── Wave 29: Published blogs ──────────────────────────────────────────
  "embryo-transfer-procedure-for-in-vitro-fertilization-ivf": {
    svg:     SVG_EMBRYO_TRANSFER_5STEP,
    title:   "Embryo Transfer: 5-Step Procedure",
    altText: "Five-row accent-bar infographic. Step 1 Endometrial Preparation: hormonal support, lining thickness monitored at 7-12mm. Step 2 Embryo Selection: morphological grading, PGT if indicated. Step 3 Embryo Thawing for FET cycles: precise warming protocol to maintain viability. Step 4 The Transfer: 10-15 minutes via soft catheter, usually painless. Step 5 Post-Transfer Rest: 15-30 minutes, no strict bed rest.",
  },
  "empowering-women-in-medicine-knowledge-sharing-program-on-advanced-fertility-and-ivf-techniques-at-nikol": {
    svg:     SVG_NIKOL_FERTILITY_TECHNIQUES,
    title:   "5 Modern Fertility Techniques Discussed",
    altText: "Five-panel horizontal infographic. Panel 01 PGT: Preimplantation Genetic Testing. Panel 02 ERA: Endometrial Receptivity Array. Panel 03 Advanced Stimulation Protocols. Panel 04 Egg and Embryo Freezing for preservation. Panel 05 Male Infertility: sperm retrieval, PRP treatments.",
  },
  "endometrial-lining-remedies-for-abnormal-thickness": {
    svg:     SVG_ENDOMETRIAL_THICKNESS_SIGNS,
    title:   "4 Signs of Abnormal Endometrial Thickness",
    altText: "Four-card horizontal infographic. Card 1 Heavy Menstrual Bleeding. Card 2 Spotting Between Periods. Card 3 Difficulty Conceiving. Card 4 Repeated Implantation Failure during IVF.",
  },
  "uterine-fibroids-symptoms-causes-and-treatment": {
    svg:     SVG_UTERINE_FIBROID_TYPES,
    title:   "4 Types of Uterine Fibroids",
    altText: "Four-card horizontal infographic. Card 1 Intramural: within the muscular wall, most common. Card 2 Submucosal: under the lining, often heavy bleeding. Card 3 Subserosal: outer uterine wall, may press on organs. Card 4 Pedunculated: attached by a stalk, inside or outside.",
  },
  "endometriosis-and-ivf-what-to-expect-and-how-to-prepare": {
    svg:     SVG_ENDOMETRIOSIS_IVF_STEPS,
    title:   "IVF Process for Endometriosis: 4 Steps",
    altText: "Four-row accent-bar infographic. Step 1 Initial Consultation and Diagnosis: medical history review, ultrasounds or MRI to assess severity. Step 2 Ovarian Stimulation: tailored protocols monitored via blood tests and ultrasounds. Step 3 Egg Retrieval and Fertilization: ICSI often recommended to enhance fertilization success. Step 4 Embryo Transfer: carefully timed for optimal implantation.",
  },
  // ── Wave 28: Published blogs ──────────────────────────────────────────
  "common-risks-in-twin-pregnancy-and-how-do-doctors-manage-them": {
    svg:     SVG_TWIN_PREGNANCY_RISKS_5,
    title:   "5 Common Risks in Twin Pregnancy",
    altText: "Five-panel horizontal infographic. Panel 01 Preterm Labour: 50 percent plus born before 37 weeks. Panel 02 Low Birth Weight: shared uterine space. Panel 03 Hypertension: higher preeclampsia risk. Panel 04 Gestational Diabetes: pronounced hormone shifts. Panel 05 TTTS: uneven blood flow in monochorionic twins.",
  },
  "dos-and-donts-during-ivf-stimulation-a-comprehensive-guide": {
    svg:     SVG_IVF_STIMULATION_DOS_DONTS,
    title:   "IVF Stimulation: Key Do's and Don'ts",
    altText: "Two-panel comparison infographic. Left panel Do's During IVF Stimulation with rose header: Follow Medication Schedule (right time, right dosage for optimal response); Eat a Balanced Diet (antioxidants, vitamins and minerals support the body); Stay Hydrated (8-10 glasses of water daily); Get Plenty of Rest (7-8 hours nightly to support medication response). Right panel Don'ts During IVF Stimulation: Avoid High-Intensity Exercise (enlarged ovaries risk complications like torsion); Limit Caffeine and Alcohol (can interfere with hormone levels and medication); Don't Smoke (reduces success rates and affects egg quality); Don't Ignore Unusual Symptoms (severe pain or bloating may signal OHSS).",
  },
  "dr-falguni-bavishi-at-sogog-conference-on-iui-success": {
    svg:     SVG_DR_FALGUNI_SOGOG,
    title:   "Dr. Falguni Bavishi at SOGOG: Advancing IUI Success",
    altText: "Three-row accent-bar highlight card. Row Event: SOGOG Annual Conference, Society of Obstetricians and Gynecologists of Gujarat. Row Topic: Enhancing IUI Success Rates, a simple, accessible and cost-effective fertility treatment. Row Focus: making accessible care even more successful for patients.",
  },
  "dr-himanshu-bavishi-speaks-on-ivf-at-sogog-conference": {
    svg:     SVG_DR_HIMANSHU_SOGOG,
    title:   "Dr. Himanshu Bavishi at SOGOG: IVF Advancements",
    altText: "Three-row accent-bar highlight card. Row Event: SOGOG State Conference, gynecologists gathered from all over the country. Row Topic: Latest Advancements in IVF Techniques, cutting-edge solutions for infertility. Row Recognition: invited as authority speaker in reproductive medicine.",
  },
  "the-link-between-pcos-and-infertility": {
    svg:     SVG_PCOS_FERTILITY_MECHANISMS,
    title:   "4 Ways PCOS Affects Fertility",
    altText: "Four-card horizontal infographic. Card 1 Hormonal Imbalance: excess androgens disrupt ovulation. Card 2 Anovulation: no egg is released for fertilisation. Card 3 Insulin Resistance: worsens androgen production. Card 4 Chronic Inflammation: affects egg quality and uterine lining.",
  },
  // ── Wave 27: Published blogs ──────────────────────────────────────────
  "can-varicocele-be-treated-without-surgery-exploring-your-options": {
    svg:     SVG_VARICOCELE_NONSURGICAL_4,
    title:   "4 Non-Surgical Treatment Options for Varicocele",
    altText: "Four-card horizontal infographic. Card 1 Lifestyle Changes: supportive underwear, cold packs. Card 2 Medications and Supplements: antioxidants and L-Carnitine support. Card 3 Varicocele Embolization: minimally invasive, similar success rate. Card 4 Observation and Monitoring: regular semen analysis, ultrasounds.",
  },
  "can-you-get-pregnant-with-ovarian-cysts": {
    svg:     SVG_OVARIAN_CYSTS_FERTILITY,
    title:   "Ovarian Cysts: Effect on Fertility",
    altText: "Two-panel comparison infographic. Left panel Usually Don't Affect Fertility with rose header: Functional Cysts (follicular and corpus luteum cysts usually resolve on their own); Cystadenomas and Dermoid Cysts (rarely interfere with conception when small). Right panel May Impact Fertility: Endometriomas (can damage ovarian reserve and egg quality); Large Cysts over 5cm (may distort anatomy and impact ovulation); PCOS-Related Cysts (hormonal imbalances disrupt regular ovulation).",
  },
  "celebrating-the-divine-joy-six-babies-born-on-janmashtami-at-bavishi-fertility-institute": {
    svg:     SVG_JANMASHTAMI_BABIES,
    title:   "6 Healthy Babies Born on Janmashtami 2025",
    altText: "Celebratory single-stat hero card. Large number 6 in a rose circle. Headline: Healthy Babies Born on Janmashtami 2025. Subtext: at Bavishi Fertility Institute, Ahmedabad's leading IVF center. Footer: a blend of science and spirituality, celebrated together.",
  },
  "choosing-between-a-day-5-vs-day-3-embryo-transfer": {
    svg:     SVG_DAY3_VS_DAY5_TRANSFER,
    title:   "Day 3 vs Day 5 Embryo Transfer",
    altText: "Two-panel comparison infographic. Left panel Day 3 Transfer Cleavage-Stage with rose header: Suits Low Embryo Numbers (avoids risking viable embryos waiting to day 5); Less Time in the Lab (may benefit embryos that don't thrive in culture); Earlier Transfer (good for time-sensitive or urgent cycles). Right panel Day 5 Transfer Blastocyst: Better Embryo Selection (surviving embryos show better developmental potential); Higher Implantation Rates (closer to natural implantation timing); Facilitates PGT Testing (more accurate genetic testing at this stage); Reduces Multiple Pregnancies (fewer embryos needed due to higher potential).",
  },
  // ── Wave 26: Published blogs ──────────────────────────────────────────
  "breaking-free-from-varicocele-pain-3-innovative-ways-to-find-relief": {
    svg:     SVG_VARICOCELE_RELIEF_3,
    title:   "3 Innovative Ways to Relieve Varicocele Pain",
    altText: "Four-row accent-bar infographic (3 items). Highlight 1 Pelvic Floor Physical Therapy: releases muscle tension and improves blood flow. Highlight 2 Acupuncture: reduces inflammation and stimulates natural pain relief. Highlight 3 Nutrition and Lifestyle: antioxidants, hydration, exercise, less stress.",
  },
  "can-a-woman-get-pregnant-once-her-periods-stop": {
    svg:     SVG_IVF_POST_MENOPAUSE_PRIORITIES,
    title:   "3 Health Priorities for IVF After Periods Stop",
    altText: "Three-card horizontal infographic. Card 1 Manage Existing Conditions: blood pressure, thyroid and diabetes addressed. Card 2 Nutrition and Medical Care: balanced diet, consistent prenatal attention. Card 3 Ongoing Pregnancy Monitoring: regular check-ups for mother and baby.",
  },
  "can-endometriosis-come-back-after-surgery-recurrence-rates-prevention-tips": {
    svg:     SVG_ENDOMETRIOSIS_RECURRENCE,
    title:   "Endometriosis Recurrence Rates After Surgery",
    altText: "Three-panel infographic with rose headers. Panel Within 2 Years: 20 to 30 percent experience recurrence. Panel Within 5 Years: 40 to 50 percent if no preventive therapy. Panel With Hormonal Therapy: significantly lower when combined with surgery. Footer note: women who undergo complete excision by experienced specialists tend to have better long-term outcomes.",
  },
  "can-ivf-work-with-low-amh": {
    svg:     SVG_LOW_AMH_IVF_SUCCESS_FACTORS,
    title:   "3 Factors That Affect IVF Success with Low AMH",
    altText: "Four-row accent-bar infographic (3 items). Highlight 1 Age: younger women with low AMH often see better outcomes. Highlight 2 Overall Health: good health supports a stronger response to stimulation. Highlight 3 Previous Treatments: inform a more customised protocol.",
  },
  "can-natural-cycle-ivf-reduce-the-risk-of-ovarian-hyperstimulation": {
    svg:     SVG_NATURAL_CYCLE_IVF_STEPS,
    title:   "How Natural Cycle IVF Works: 5 Steps",
    altText: "Five-panel horizontal infographic. Panel 1 Track Natural Cycle: no heavy stimulation. Panel 2 Monitor Follicle: the natural one. Panel 3 Retrieve Single Egg: one mature egg. Panel 4 Fertilize in the Lab: egg meets sperm. Panel 5 Transfer Embryo: back to the uterus.",
  },
  // ── Wave 25: Published blogs ──────────────────────────────────────────
  "ovarian-hyperstimulation-syndrome": {
    svg:     SVG_OHSS_PRIMARY_VS_SECONDARY,
    title:   "OHSS: Primary vs Secondary",
    altText: "Two-panel comparison infographic. Left panel Primary OHSS with rose header: Caused by Fertility Medication (drugs used to stimulate egg growth); Ovaries Enlarge (more eggs cause temporary enlargement); Regresses on Its Own (stopping medication ends stimulation). Right panel Secondary OHSS: Occurs During Pregnancy (not linked to the stimulation drugs alone); hCG Keeps Stimulating (pregnancy hormone continuously acts on ovaries); Can Be More Severe (often more intense than primary OHSS).",
  },
  "egg-freezing-preserving-your-fertility-for-the-future": {
    svg:     SVG_EGG_FREEZING_PROCESS_4,
    title:   "The Egg Freezing Process: 4 Steps",
    altText: "Four-row accent-bar infographic. Step 1 Initial Consultation and Testing: medical history review, blood tests, and ultrasound to assess ovarian reserve. Step 2 Ovarian Stimulation: hormonal injections stimulate the ovaries to produce multiple eggs. Step 3 Egg Retrieval: eggs are retrieved through a minimally invasive procedure. Step 4 Freezing: eggs are frozen and stored in a cryobank.",
  },
  "best-ivf-hospitals-in-ahmedabad": {
    svg:     SVG_BFI_AHMEDABAD_NUMBERS,
    title:   "Bavishi Fertility Institute: By the Numbers",
    altText: "Four-card horizontal infographic. Card 25,000 Plus: successful IVF pregnancies. Card 45,000 Plus: patient visits annually. Card 100 Plus Years: combined doctor experience. Card 7 Cities: across India.",
  },
  "best-types-of-exercise-to-support-your-ivf-journey": {
    svg:     SVG_EXERCISE_IVF_BENEFITS,
    title:   "How Exercise Supports IVF Success",
    altText: "Four-row accent-bar infographic. Highlight 01 Hormonal Balance: regulates insulin, cortisol, estrogen and progesterone. Highlight 02 Blood Flow: enhances blood flow to the uterus and ovaries. Highlight 03 Mental Health: reduces cortisol, promotes emotional stability. Highlight 04 Weight Management: maintains a healthy BMI.",
  },
  "blighted-ovum-symptoms-causes-and-more": {
    svg:     SVG_BLIGHTED_OVUM_CAUSES,
    title:   "4 Causes of Blighted Ovum",
    altText: "Four-card horizontal infographic. Card 1 Chromosomal Abnormalities: genetic issues block development. Card 2 Hormonal Imbalance: affects embryo development. Card 3 Uterine Abnormalities: can affect implantation. Card 4 Advanced Maternal Age: women over 35 at higher risk.",
  },
  // ── Wave 24: Published blogs ──────────────────────────────────────────
  "reasons-behind-low-amh-levels-ways-to-increase": {
    svg:     SVG_LOW_AMH_REASONS_9,
    title:   "9 Reasons Behind Low AMH Levels",
    altText: "Two-column nine-item grid infographic. Items 1-5 (left): Age-Related Decline (fertility decreases gradually after 30, more after 35); Ovarian Reserve Dynamics (genetic and environmental factors affect decline rate); PCOS (hormonal imbalance disturbs follicle maturation); Premature Ovarian Insufficiency (ovaries cease normal function before age 40); Endometriosis (inflammation affects ovarian follicle health). Items 6-9 (right): Cancer Treatments (chemotherapy and radiation reduce viable eggs); Underlying Medical Conditions (autoimmune and genetic conditions); Ovarian Surgery (removal of ovarian cysts can reduce reserve); Lifestyle Factors (smoking, alcohol and obesity affect ovarian function).",
  },
  "miscarriages-during-ivf-signs-causes-prevention-hope": {
    svg:     SVG_MISCARRIAGE_SIGNS,
    title:   "5 Signs of Possible Miscarriage During IVF",
    altText: "Five-panel horizontal infographic. Panel 01 Vaginal Bleeding: light spotting to heavy bleeding. Panel 02 Abdominal Pain: cramping in the lower abdomen. Panel 03 Passage of Tissue: tissue or clots in vaginal bleeding. Panel 04 Fewer Symptoms: sudden drop in nausea, tenderness. Panel 05 Back Pain: can accompany other signs.",
  },
  "are-ivf-babies-healthy-as-naturally-conceived": {
    svg:     SVG_IVF_BIRTHS_WORLDWIDE,
    title:   "IVF Births Worldwide: The Numbers",
    altText: "Three-panel infographic. Panel Australia: 1 in 18 babies born via IVF. Panel Global 2019, highlighted: 4.2% of all children born via IVF. Panel United States: 1 to 2% of all births are IVF.",
  },
  "bed-rest-myth-during-ivf": {
    svg:     SVG_BED_REST_RISKS,
    title:   "5 Risks of Unnecessary Bed Rest After Embryo Transfer",
    altText: "Five-panel horizontal infographic. Panel 01 Blood Clot Formation: increased DVT risk. Panel 02 Muscle Atrophy: weakens the body. Panel 03 Psychological Impact: raises anxiety. Panel 04 Reduced Blood Flow: affects uterus. Panel 05 No Proven Benefit: doesn't improve odds.",
  },
  "myth-twins-and-ivf": {
    svg:     SVG_EMBRYO_TRANSFER_DECISION_FACTORS,
    title:   "5 Factors in the Single vs Multiple Embryo Decision",
    altText: "Five-panel horizontal infographic. Panel 01 Age of Patient: younger women often succeed with single embryo transfer. Panel 02 Reproductive History: past outcomes shape it. Panel 03 Embryo Quality: assessed viability guides the decision. Panel 04 Patient Health: overall conditions are factored in. Panel 05 Preferences: family-building goals matter most.",
  },
  // ── Wave 23: Published blogs ──────────────────────────────────────────
  "how-to-interpret-amh-afc-and-other-ovarian-reserve-rests-what-the-numbers-really-mean": {
    svg:     SVG_AMH_LEVELS_MEANING,
    title:   "AMH Levels: What They Mean",
    altText: "Four-card horizontal infographic. Card 1.0-4.0 Normal Ovarian Reserve: 1.0 to 4.0 ng/mL, ranges vary by lab. Card Under 1 Low Ovarian Reserve: below 1.0 ng/mL. Card Under 0.4 Very Low Ovarian Reserve: below 0.4 ng/mL. Card High AMH: seen in PCOS or very high egg reserve.",
  },
  "do-i-need-an-ultrasound-in-every-pregnancy-visit-is-it-safe": {
    svg:     SVG_PREGNANCY_ULTRASOUND_SCANS,
    title:   "5 Standard Pregnancy Ultrasound Scans",
    altText: "Five-panel horizontal infographic. Panel Weeks 6-9 First Trimester: confirms pregnancy, heartbeat, due date. Panel Weeks 11-14 Nuchal Translucency: screens for chromosomal abnormalities. Panel Weeks 18-22 Anomaly Scan: checks organs, spine, limbs. Panel Weeks 28-32 Growth Scan: monitors growth, placenta function. Panel Weeks 36-40 Final Scan: confirms position before delivery.",
  },
  "what-are-microplastics-how-do-they-affect-reproductive-health": {
    svg:     SVG_MICROPLASTICS_ENTRY,
    title:   "How Microplastics Enter Your Body",
    altText: "Four-card horizontal infographic. Card 1 Food and Water: contaminated water, seafood, packaged food. Card 2 Air: airborne fibers from synthetic fabrics. Card 3 Cosmetics: exfoliating beads via skin contact or ingestion. Card 4 Household Dust: synthetic furniture and carpet particles.",
  },
  "12-tips-for-getting-pregnant-faster-with-pcos-a-step-by-step-guide": {
    svg:     SVG_PCOS_12_TIPS,
    title:   "12 Tips for Getting Pregnant Faster with PCOS",
    altText: "Two-column twelve-item compact grid infographic. Items 1-6 (left): Understand PCOS and Fertility; Track Your Ovulation; Maintain a Healthy Weight; Manage Insulin Levels; Consider Fertility Treatments; Balance Hormones with Medical Support. Items 7-12 (right): Adopt Stress-Reduction Techniques; Be Patient and Stay Positive; Optimize Vitamin and Mineral Intake; Prioritize Sleep Quality; Avoid Environmental Hormone Disruptors; Seek Support and Build a Community.",
  },
  "13-best-ivf-clinics-in-mumbai": {
    svg:     SVG_CHOOSE_IVF_CLINIC,
    title:   "5 Things to Compare When Choosing an IVF Clinic",
    altText: "Five-panel horizontal infographic. Panel 01 Accreditation: NABH, JCI and other certifications. Panel 02 Doctor Experience: specialist qualifications. Panel 03 Technology and Lab: advanced equipment and techniques. Panel 04 Success Rates: published pregnancy outcomes. Panel 05 Location and Access: convenient centres.",
  },
  // ── Wave 22: Published blogs ──────────────────────────────────────────
  "when-should-you-get-3d-4d-ultrasound-during-pregnancy": {
    svg:     SVG_3D4D_ULTRASOUND_TIMING,
    title:   "Best Time for 3D/4D Ultrasound: Weeks 26-32",
    altText: "Three-panel infographic with rose headers. Panel Before 24 Weeks: facial features may appear less defined, too early for clarity. Panel 26-32 Weeks (Ideal), highlighted: formed features and active movement, best image clarity. Panel After 32-34 Weeks: baby may be too cramped in uterus, can limit image quality. Footer note: sufficient fat, well-formed features, and active movement peak in this window; your specialist will confirm the right timing for your pregnancy.",
  },
  "when-to-consider-sperm-dna-fragmentation-testing-in-low-sperm-count-cases": {
    svg:     SVG_DNA_FRAGMENTATION_SIGNS,
    title:   "8 Signs You May Need Sperm DNA Fragmentation Testing",
    altText: "Two-column eight-item grid infographic. Items 1-4 (left): Repeated IVF/ICSI Failure (embryos fail to implant or grow well despite low sperm count); Recurrent Pregnancy Loss (repeated miscarriages when female factors are normal); Very Low or Fluctuating Count (higher oxidative stress increases fragmentation risk); Poor Motility plus Abnormal Shape (multiple affected sperm parameters together). Items 5-8 (right): Male Partner Age 35 Plus (DNA damage increases naturally with age); Lifestyle Risk Factors (smoking, alcohol, stress, obesity, heat exposure); Oxidative Stress Conditions (varicocele, infections, diabetes, hormonal imbalance); Unexplained Infertility (normal semen report but conception still doesn't happen).",
  },
  "when-to-take-a-pregnancy-test-after-iui-timing-and-accuracy-explained": {
    svg:     SVG_IUI_PREGNANCY_TEST_TIMING,
    title:   "Pregnancy Testing After IUI: Key Timing",
    altText: "Four-row accent-bar infographic. Highlight 14 Days Minimum Wait Before Testing: testing earlier risks a false negative before hCG is detectable. Highlight 14-16 Days Ideal Beta-hCG Blood Test: recommended by BFI for the most reliable result. Highlight 10-12 Days Wait After Trigger Shot: avoids a false positive from residual synthetic hCG. Highlight 48 Hours to Confirm a Positive Result: repeat blood test checks that hCG levels are rising appropriately.",
  },
  "why-do-some-embryos-not-implant-even-if-they-look-healthy": {
    svg:     SVG_IMPLANTATION_FAILURE_FACTORS,
    title:   "4 Factors Behind Implantation Failure",
    altText: "Four-card horizontal infographic. Card 1 Chromosomal Abnormalities: up to 50% of normal-looking embryos carry hidden genetic issues. Card 2 Endometrial Receptivity: uterine timing and lining thickness must be optimal. Card 3 Immune Response: overactive immune cells can prevent the embryo implanting. Card 4 Hormonal Factors: progesterone deficiency can make implantation difficult.",
  },
  "why-dont-embryos-stick-key-reasons-you-need-to-know": {
    svg:     SVG_EMBRYOS_DONT_STICK,
    title:   "5 Key Reasons Embryos Don't Stick",
    altText: "Five-panel horizontal infographic. Panel 01 Embryo Quality: even top embryos have around 50% implantation odds. Panel 02 Uterine Problems: fibroids, thin lining, or infection. Panel 03 Health and Lifestyle: illness or high stress post-transfer. Panel 04 Uterine Receptivity: hormone-driven timing must align. Panel 05 Transfer Technique: gentle, precise transfer matters.",
  },
  // ── Wave 21: Published blogs ──────────────────────────────────────────
  "what-is-the-non-stress-test-nst-in-pregnancy-and-why-is-it-important": {
    svg:     SVG_NST_REASONS,
    title:   "5 Reasons Your Doctor May Recommend an NST",
    altText: "Five-panel horizontal infographic. Panel 1 High-Risk Pregnancies: diabetes, hypertension. Panel 2 Post-Term Pregnancy: beyond 40 weeks. Panel 3 Decreased Fetal Movement: confirms baby is well. Panel 4 Prior Complications: stillbirth, preterm labor history. Panel 5 Multiple Pregnancies: tracks each baby's health.",
  },
  "what-is-the-relationship-between-pcos-and-amh-level": {
    svg:     SVG_PCOS_AMH_NUMBERS,
    title:   "PCOS & AMH: What the Numbers Show",
    altText: "Three-panel infographic with rose headers. Panel Versus Women Without PCOS: 2 to 3 times higher AMH levels. Panel Mean AMH in PCOS: 8.63 ng/mL average. Panel Diagnostic Cut-Off: 4.1 plus ng/mL commonly used. Footer note: high AMH alone does not diagnose PCOS; used alongside the Rotterdam Criteria and other clinical assessments.",
  },
  "what-to-eat-during-pregnancy-a-week-by-week-nutrition-plan": {
    svg:     SVG_PREGNANCY_NUTRIENTS_TRIMESTER,
    title:   "Key Pregnancy Nutrients by Trimester",
    altText: "Three-panel infographic with rose headers. Panel First Trimester Weeks 1-12: Folic Acid, Protein, Iron. Panel Second Trimester Weeks 13-26: Calcium, Vitamin D, Omega-3. Panel Third Trimester Weeks 27-40: Protein, Magnesium, Zinc. Footer note: both vegetarian and non-vegetarian sources available for every nutrient; always confirm your personal nutrition plan with your doctor.",
  },
  "bavishi-fertility-institute-hosts-knowledge-sharing-program-with-bharuch-ob-gy-society": {
    svg:     SVG_CME_BHARUCH,
    title:   "BFI x Bharuch OB-GY Society: 4 Key Highlights",
    altText: "Four-row accent-bar infographic. Highlight 01 Collaboration: joint academic program held with the Bharuch OB and GY Society. Highlight 02 Expert Faculty: led by Dr. Himanshu Bavishi, Dr. Falguni Bavishi, Dr. Parth Bavishi and Dr. Deep Gajiwala. Highlight 03 Session Focus: treatment advances, challenging cases, and future directions in reproductive medicine. Highlight 04 Interactive Format: case-based discussions strengthened professional bonds among gynecologists.",
  },
  "when-should-you-consider-donor-eggs-or-sperm": {
    svg:     SVG_DONOR_EGGS_REASONS,
    title:   "7 Reasons to Consider Donor Eggs",
    altText: "Two-column seven-item grid infographic. Items 1-4 (left): Poor Ovarian Reserve (very low AMH or high FSH limits good-quality egg production); Advanced Maternal Age (above 40-42 years, higher risk of chromosomal issues and miscarriage); Premature Ovarian Failure (early menopause in the 20s or 30s often requires donor eggs); Repeated IVF Failure (multiple failed cycles from poor-quality embryos or egg response). Items 5-7 (right): Genetic Disorders (avoids passing on an inheritable condition to the child); Surgical or Medical Causes (ovary removal, chemo/radiation, or severe endometriosis damage); Poor Egg Quality (normal egg count but quality prevents fertilisation or implantation).",
  },
  // ── Wave 20: Published blogs ──────────────────────────────────────────
  "what-happens-after-embryo-transfer-day-by-day": {
    svg:     SVG_EMBRYO_TRANSFER_MILESTONES,
    title:   "Embryo Transfer: 4 Key Milestones",
    altText: "Four-row accent-bar infographic. Day 1 Embryo Begins to Settle: free-floating in the uterus, mild cramping or bloating is normal. Day 3 Early Implantation Begins: embryo attaches to the uterine lining, slight spotting can be a positive sign. Day 5 Full Implantation and hCG Begins: embryo is firmly implanted, hCG hormone production increases. Day 13-14 Official Pregnancy Test: beta hCG blood test gives the most accurate result at this point.",
  },
  "what-is-epigenetics-does-it-affect-ivf-pregnancies-only": {
    svg:     SVG_EPIGENETICS_FACTORS,
    title:   "5 Lifestyle Factors That Shape Your Epigenetics",
    altText: "Five-panel horizontal infographic. Panel 1 Obesity: modifies markers in sperm and eggs. Panel 2 Chronic Stress: can affect embryo development and pregnancy success. Panel 3 Pollution: environmental exposure alters gene expression. Panel 4 Smoking: can imprint markers on sperm affecting future generations. Panel 5 Sleep Patterns: affects hormone and epigenetic marker balance.",
  },
  "what-is-the-difference-between-pcod-pcos": {
    svg:     SVG_PCOD_VS_PCOS,
    title:   "PCOD vs PCOS: Key Differences",
    altText: "Two-panel comparison infographic. Left panel PCOD Polycystic Ovary Disease with rose header: Hormonal Imbalance (excess androgens cause acne, hirsutism, hair thinning); Ovarian Cysts (numerous small cysts, generally not cancerous); Irregular Cycles (missed periods or very long menstrual cycles); Milder and Manageable (often managed with lifestyle changes and medication). Right panel PCOS Polycystic Ovary Syndrome: Complex Hormonal Disorder (affects ovaries and other endocrine organs); Metabolic Concerns (insulin resistance, weight gain, diabetes risk); Leading Infertility Cause (one of the most common causes of female infertility); Needs Ongoing Management (birth control, metformin, or IVF may be required).",
  },
  "what-is-the-max-number-of-eggs-that-you-can-retrieve-in-an-ivf-cycle": {
    svg:     SVG_EGG_RETRIEVAL_BY_RESERVE,
    title:   "How Many Eggs Can Be Retrieved? By Ovarian Reserve",
    altText: "Three-panel infographic with rose headers. Panel High AMH (above 4 ng/ml): 25 to 30 plus eggs, strong ovarian response. Panel Average Reserve: 10 to 20 eggs, typical IVF cycle yield. Panel Low AMH (below 1 ng/ml): 5 to 8 eggs, can still succeed with quality. Footer note: 10 to 15 mature eggs is the ideal safety and success balance; quality matters more than quantity.",
  },
  "ivf-treatment-cost-in-ahmedabad-across-india": {
    svg:     SVG_IVF_COST_BY_CITY,
    title:   "IVF Cost: Ahmedabad vs Other Indian Cities",
    altText: "Three-panel infographic with rose headers. Panel Ahmedabad: 1.2 to 2.5 lakh rupees all-in standard cycle. Panel Mumbai: 1.8 to 3.5 lakh rupees all-in standard cycle. Panel Delhi: 1.5 to 3 lakh rupees all-in standard cycle. Footer note: same internationally accredited lab standards across all three cities; ranges reflect protocol type, medication dose, and clinic-specific inclusions.",
  },
  // ── Wave 19: Published blogs ──────────────────────────────────────────
  "bavishi-fertility-institute-hosts-fogsi-recognized-training-program-in-ahmedabad": {
    svg:     SVG_FOGSI_TRAINING_COURSES,
    title:   "FOGSI Training Program: 3 Courses Offered",
    altText: "Three-panel infographic with rose headers. Panel 1 IUI and Stimulation Protocol Course: 2 Days. Panel 2 Basic Infertility Foundation Course: 7 Days. Panel 3 Advanced Infertility Specialist Course: 14 Days. Footer note: open exclusively to FOGSI members with an MCI-recognised OB-GYN degree or diploma.",
  },
  "understanding-sperm-cramps-symptoms-causes-diagnosis-treatment": {
    svg:     SVG_SPERM_CRAMPS_CAUSES,
    title:   "8 Common Causes of Sperm Cramps (Testicular Pain)",
    altText: "Two-column eight-item grid infographic. Items 1-4 (left): Epididymitis (inflammation of the epididymis, often from bacterial infection or STIs); Varicocele (enlarged scrotal veins causing dull, aching pain); Testicular Torsion (medical emergency — spermatic cord twists, cutting off blood flow); Inguinal Hernia (intestine protrudes through the abdominal wall, causing groin pain). Items 5-8 (right): Orchitis (inflammation of one or both testicles from viral or bacterial infection); Prostatitis (inflamed prostate gland causing pelvic pain perceived as testicular pain); Injury or Trauma (direct injury to the testicles or groin causes temporary or lasting pain); Hydrocele (fluid-filled sac around a testicle causing swelling and discomfort).",
  },
  "understanding-the-success-rate-of-ivf-treatment": {
    svg:     SVG_IVF_SUCCESS_BY_AGE,
    title:   "IVF Success Rate by Age",
    altText: "Four-card horizontal infographic. Card Under 35: 40 to 50 percent success rate, highest rates with strongest ovarian reserve. Card 35-37 Years: 30 to 40 percent, slight decline versus under-35 age group. Card 38-40 Years: 20 to 25 percent, more significant decline begins after age 38. Card Over 40 Years: 10 to 15 percent, though donor eggs can significantly improve outcomes.",
  },
  "understanding-thin-endometrium-causes-impact-and-treatment-options": {
    svg:     SVG_THIN_ENDOMETRIUM_CAUSES,
    title:   "6 Causes of Thin Endometrium",
    altText: "Two-column six-item grid infographic. Items 1-3 (left): Hormonal Imbalance (low estrogen or estrogen/progesterone imbalance); Previous Uterine Procedures (D&C or C-section can cause scarring and thinning); Poor Blood Flow (inadequate uterine blood flow impedes growth). Items 4-6 (right): Age (natural thinning from decreased estrogen production); Uterine Infections (endometritis can damage and thin the lining); Genetic Factors (some women have a genetic predisposition).",
  },
  "bavishi-fertility-institute-hosts-joint-educational-cme-with-east-ahmedabad-gynaecologist-association": {
    svg:     SVG_CME_EAST_AHMEDABAD,
    title:   "BFI x East Ahmedabad CME: 4 Key Highlights",
    altText: "Four-row accent-bar infographic. Highlight 01 Venue and Collaboration: held at Nikol, Ahmedabad, jointly with the East Ahmedabad Gynaecologist Association. Highlight 02 Strong Attendance: around 35 gynecologists participated, including eminent East Ahmedabad practitioners. Highlight 03 Key Discussion Topic: in-depth session on the newly implemented ART Act and its clinical implications. Highlight 04 Interactive Format: brainstorming sessions and open doubt-solving encouraged active engagement.",
  },
  // ── Wave 18: Published blogs ──────────────────────────────────────────
  "twin-and-multiple-pregnancies-after-ivf-risks-and-care": {
    svg:     SVG_TWIN_PREGNANCY_CARE,
    title:   "4 Special Care Steps for Twin Pregnancy After IVF",
    altText: "Four-row accent-bar infographic. Step 01 Regular and Specialised Monitoring: frequent ultrasounds, fetal heart rate checks and specialist visits throughout the pregnancy. Step 02 Nutritional Care: higher caloric intake with adequate iron, folate and protein to support both babies. Step 03 Lifestyle Adjustments: reduce physical exertion, prioritise rest and avoid factors that may trigger early labour. Step 04 Delivery Planning: discuss C-section vs vaginal delivery options with your specialist team early in the third trimester.",
  },
  "understanding-frozen-embryo-transfer-fet-in-ivf": {
    svg:     SVG_FET_PROCESS_STEPS,
    title:   "6 Steps of the Frozen Embryo Transfer (FET) Process",
    altText: "Two-column six-item grid infographic. Items 1-3 (left): Hormonal Testing and Evaluation (blood work and uterine assessment before starting); Endometrial Preparation (natural cycle or hormone replacement therapy protocol); Embryo Thawing (frozen blastocysts achieve a 98%+ survival rate on thaw). Items 4-6 (right): Embryo Transfer (ultrasound-guided catheter placement in the uterus); Luteal Phase Support (progesterone supplementation to support implantation); Pregnancy Testing (hCG blood test 10–14 days post-transfer confirms result).",
  },
  "understanding-hypospermia-signs-symptoms-and-treatment-options": {
    svg:     SVG_HYPOSPERMIA_OVERVIEW,
    title:   "Hypospermia: Common Causes and Treatments",
    altText: "Two-panel comparison infographic. Left panel Common Causes of Hypospermia with rose header: Hormonal Imbalances (low testosterone disrupts normal semen production volume); Retrograde Ejaculation (semen flows backward into the bladder instead of forward); Reproductive Blockages (duct obstruction or congenital absence reduces ejaculate volume); Infections and Inflammation (bacterial infections affect the prostate or accessory glands). Right panel Treatment Options: Hormone Therapy (treatment to restore testosterone and improve semen output); Surgical Correction (procedures to open blocked reproductive ducts); Lifestyle Changes (diet, exercise and heat avoidance to improve sperm health); ART Options IUI and IVF-ICSI (assisted reproduction bypasses low semen volume effectively).",
  },
  "understanding-negative-signs-after-embryo-transfer-when-to-worry": {
    svg:     SVG_EMBRYO_TRANSFER_WARNING_SIGNS,
    title:   "Post-Transfer Symptoms: Normal vs Seek Medical Attention",
    altText: "Two-panel comparison infographic. Left panel Normal Post-Transfer Symptoms with rose header: Mild Cramping (slight pelvic discomfort as the uterus adjusts after transfer); Light Spotting (tiny implantation bleed — pinkish or brown, not heavy); Breast Tenderness (progesterone side effect; common and expected after transfer); Bloating or Fullness (ovarian stimulation effect that gradually fades after retrieval). Right panel Seek Medical Attention For: Heavy Vaginal Bleeding (soaking more than one pad per hour requires immediate care); Severe Pelvic Pain (intense cramping not relieved by rest or a warm compress); Fever Over 38 degrees Celsius or 100.4 Fahrenheit (may indicate infection — contact your clinic without delay); OHSS Symptoms (abdominal swelling, difficulty breathing or rapid weight gain).",
  },
  // ── Wave 17: Published blogs ──────────────────────────────────────────
  "the-role-of-endometrial-receptivity-in-ivf-success": {
    svg:     SVG_ENDOMETRIAL_FACTORS,
    title:   "6 Factors Affecting Endometrial Receptivity",
    altText: "Two-column six-item grid infographic. Items 1-3 (left): Endometrial Thickness (optimal uterine lining thickness supports embryo attachment); Endometrial Blood Flow (adequate blood supply creates a nutrient-rich uterine environment); Window of Implantation (embryo transfer must align with this unique receptive phase). Items 4-6 (right): Hormonal Balance (oestrogen and progesterone must sync with embryo development); Chronic Endometritis (untreated inflammation or infection reduces receptivity significantly); Lifestyle Factors (weight, stress, smoking and diet affect uterine lining quality).",
  },
  "the-thyroid-connection-understanding-its-role-in-female-fertility-health": {
    svg:     SVG_THYROID_FERTILITY,
    title:   "Thyroid Disorders and Female Fertility",
    altText: "Two-panel infographic. Left panel Hypothyroidism Underactive with rose header: Irregular or Absent Periods (low T3/T4 disrupts menstrual cycle regularity); Difficulty Ovulating (elevated TSH suppresses normal ovulation signals); Higher Miscarriage Risk (inadequate thyroid hormones affect early embryo development); Weight Gain and Fatigue (metabolic slowdown disrupts overall hormonal balance). Right panel Hyperthyroidism Overactive: Shortened Menstrual Cycles (excess thyroid hormones can accelerate cycle length); Reduced Fertility (suppressed FSH/LH disrupts follicle development and ovulation); Pregnancy Complications (can increase risk of premature delivery or fetal growth issues); Palpitations and Anxiety (high metabolic demands strain the body during conception attempts).",
  },
  "top-10-reasons-to-consider-egg-freezing": {
    svg:     SVG_EGG_FREEZING_10_REASONS,
    title:   "10 Reasons to Consider Egg Freezing",
    altText: "Two-column ten-item grid infographic. Items 1-5 (left): Preserve Fertility (protect egg quality before age-related decline begins); Medical Protection (safeguard eggs before chemotherapy or treatments affecting fertility); Peace of Mind (knowing eggs are preserved reduces reproductive anxiety); Align with Partner's Timing (synchronize family planning when both partners are ready); Option for Single Women (build your family on your own terms and timeline). Items 6-10 (right): Family Planning Flexibility (delay pregnancy until career, relationships and timing align); Vitrification Technology (modern flash-freezing significantly improves egg survival rates); No Biological Clock Pressure (take control of your own reproductive timeline); Better Future IVF Success (younger frozen eggs can improve IVF outcomes when used later); Career Advancement (balance professional goals with the option to start a family later).",
  },
  "top-fertility-treatments-for-women-with-pcos": {
    svg:     SVG_PCOS_TREATMENT_PATHWAY,
    title:   "4-Step PCOS Fertility Treatment Pathway",
    altText: "Four-row accent-bar infographic. Step S1 Lifestyle Optimisation: a 5–10% weight reduction is clinically proven to restore spontaneous ovulation in PCOS. Step S2 Ovulation Induction: Letrozole first choice or Clomiphene tablets stimulate follicle growth and ovulation. Step S3 IUI Intrauterine Insemination: recommended if ovulation induction cycles have not resulted in pregnancy after 3–4 attempts. Step S4 IVF with OHSS Risk Management: advanced stimulation protocol for unresponsive cases, freeze-all strategy minimises OHSS risk.",
  },
  "trying-to-conceive-after-40-what-you-need-to-know": {
    svg:     SVG_FERTILITY_TESTS_OVER40,
    title:   "6 Key Fertility Tests for Women Over 40",
    altText: "Two-column six-item grid infographic. Items 1-3 (left): AMH Test (measures ovarian reserve and remaining egg supply); FSH and LH Levels (hormonal balance test assessing pituitary-ovarian communication); HSG Tube Patency Test (X-ray test to confirm that the fallopian tubes are open). Items 4-6 (right): Antral Follicle Count AFC (ultrasound count of available follicles per cycle); Pelvic Ultrasound (examines uterus and ovaries for structural abnormalities); Partner's Semen Analysis (evaluates sperm count, motility and morphology).",
  },

  // ── Wave 16: Published blogs ──────────────────────────────────────────
  "the-connection-between-quality-sleep-and-ivf-success-a-hormonal-perspective": {
    svg:     SVG_SLEEP_IVF_TIPS,
    title:   "6 Tips for Better Sleep During IVF",
    altText: "Two-column six-item grid infographic. Items 1-3 (left): Regular Sleep Schedule (sleep and wake at the same time daily to support your body clock); Relaxation Techniques (yoga, meditation or breathing exercises reduce cortisol); Digital Detox (no screens 1–2 hours before bed as blue light blocks melatonin). Items 4-6 (right): Sleep-Inducing Environment (keep bedroom cool, dark and quiet, no screens before bed); Limit Stimulants (avoid caffeine after 2 PM and alcohol close to bedtime); Melatonin with Doctor Guidance (may be prescribed during IVF cycles to improve egg quality).",
  },
  "the-dfi-test-a-crucial-diagnostic-tool-for-male-infertility": {
    svg:     SVG_DFI_TEST_MATTERS,
    title:   "4 Reasons DFI Testing is a Game-Changer",
    altText: "Four-row accent-bar infographic. Highlight 01 Detects Hidden DNA Damage: standard semen analysis can miss critical breaks in sperm DNA strands. Highlight 02 Guides Treatment Selection: DFI score helps doctors choose the right path — IUI, IVF or ICSI. Highlight 03 Identifies Lifestyle Root Causes: heat, smoking and oxidative stress are key contributors to sperm DNA damage. Highlight 04 Supports Better IVF Outcomes: healthier sperm DNA leads to improved embryo development and pregnancy rates.",
  },
  "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide": {
    svg:     SVG_IUI_DOS_DONTS,
    title:   "Key Do's and Don'ts After IUI Treatment",
    altText: "Two-panel infographic. Left panel Do's After IUI with rose header: Resume Light Activities (no bed rest needed, gentle walks and daily tasks are fine); Eat Fertility-Friendly Foods (whole grains, leafy greens and omega-3 rich foods); Stay Well Hydrated (8–10 glasses of water daily to support uterine blood flow); Take Medications as Prescribed (progesterone and supplements must be taken on schedule). Right panel Don'ts After IUI: Don't Test Too Early (wait until Day 14 as hCG trigger shot can skew early results); Avoid High-Intensity Exercise (no running, weightlifting or aerobics in the first week); No Smoking or Alcohol (both harm egg quality and can disrupt early implantation); Limit Caffeine Intake (keep below 200 mg per day during the two-week wait).",
  },
  "the-miracle-of-implantation-recognizing-the-signs": {
    svg:     SVG_IMPLANTATION_SIGNS,
    title:   "6 Signs of Implantation to Look For",
    altText: "Two-column six-item grid infographic. Items 1-3 (left): Light Cramping (mild, brief cramps as the blastocyst attaches to the uterine lining); Breast Tenderness (swelling or sensitivity due to rising progesterone levels); Frequent Urination (increased urge to urinate as hormonal shifts begin post-implantation). Items 4-6 (right): Implantation Bleeding (pinkish or brownish spotting, lighter than a normal period); Fatigue (unusual tiredness as the body begins preparing for early pregnancy); Elevated Basal Temperature (BBT may remain consistently high after implantation occurs).",
  },
  "the-postpartum-journey-how-long-does-it-take-to-heal-after-giving-birth": {
    svg:     SVG_POSTPARTUM_STAGES,
    title:   "4 Stages of Postpartum Recovery",
    altText: "Four-row accent-bar infographic. Stage W1 First Week: rest and initial healing, lochia discharge and wound or perineal care begins. Stage W2 Weeks 2–4: gradual return to light activity, baby blues and emotional fluctuations are common. Stage W6 Weeks 6–8: postpartum follow-up checkup to assess physical recovery and emotional well-being. Stage M3 Months 3–6: hormones gradually stabilize and return to normal activities at your own pace.",
  },

  // ── Wave 15: Published blogs ──────────────────────────────────────────
  "step-by-step-process-of-embryo-freezing-in-an-ivf-cycle": {
    svg:     SVG_EMBRYO_FREEZING_STEPS,
    title:   "6 Steps of Embryo Freezing (Vitrification)",
    altText: "Two-column six-item grid infographic. Items 1-3 (left): Egg Retrieval (eggs collected via ultrasound-guided procedure); Embryo Culture (embryos grown 3–5 days to blastocyst stage); Cryo Storage (safely stored in liquid nitrogen tanks long-term). Items 4-6 (right): Fertilization in Lab (sperm fertilises eggs and embryos begin developing); Vitrification (flash-frozen at minus 196 degrees Celsius preventing ice crystal damage); Thaw and Embryo Transfer (warmed embryo transferred to the uterus when ready).",
  },
  "stories-from-indian-celebrities-of-egg-freezing": {
    svg:     SVG_EGG_FREEZING_BENEFITS,
    title:   "10 Key Benefits of Egg Freezing",
    altText: "Two-column ten-item grid infographic. Items 1-5 (left): Delayed Parenthood (preserve fertility until you're ready to start a family); Reduced Age-Related Risk (younger frozen eggs retain better quality over time); Better IVF Success (younger frozen eggs can improve IVF outcomes later); Genetic Testing Option (screen embryos before transfer using PGT); For Same-Sex Couples (flexible family planning for diverse family types). Items 6-10 (right): Medical Safety Net (protect eggs before cancer treatment or surgery); Reproductive Control (choose when and how you want to start your family); Peace of Mind (reduces pressure from the ticking biological clock); For Single Women (build your family on your own timeline and terms); Lower Emotional Stress (reduces fertility-related anxiety and time pressure).",
  },
  "surrogacy-vs-ivf-key-differences-benefits-and-choosing-the-right-path-to-parenthood": {
    svg:     SVG_SURROGACY_VS_IVF,
    title:   "IVF vs Surrogacy: Key Benefits Compared",
    altText: "Two-panel comparison infographic. Left panel In Vitro Fertilisation IVF with rose header: You Carry the Baby (intended mother experiences the pregnancy herself); Genetic Connection (both parents can be biologically linked to the baby); Simpler Legal Process (no surrogate contracts or complex court approvals); More Accessible Cost (generally lower overall cost than surrogacy). Right panel Surrogacy: Surrogate Carries (for those medically unable to carry a pregnancy); No Pregnancy Risk (intended mother avoids pregnancy-related complications); Gestational Option (surrogate has no genetic link to the baby); Supports Diverse Families (ideal for same-sex couples and single parents).",
  },
  "bavishi-fertility-institute-conducts-an-educational-programme-at-rajkot": {
    svg:     SVG_BFI_RAJKOT_CME,
    title:   "BFI Rajkot CME: 4 Key Highlights",
    altText: "Four-row accent-bar infographic. Highlight 01 Date and Venue: 21st September 2025 Rajkot — a landmark knowledge-sharing event for gynaecologists. Highlight 02 Organiser: hosted in collaboration with the Rajkot Gynaecologist Doctors Association. Highlight 03 Expert Speakers: senior BFI specialists shared the latest advances in reproductive medicine and IVF. Highlight 04 Interactive Sessions: live Q and A and open discussions actively engaged the attending gynaecologists.",
  },
  "teratozoospermia-uncovering-the-causes-symptoms-and-solutions": {
    svg:     SVG_TERATOZOOSPERMIA_OVERVIEW,
    title:   "Teratozoospermia: Causes & Treatments",
    altText: "Two-panel infographic. Left panel Common Causes with rose header: Genetic Factors (chromosomal abnormalities that disrupt sperm formation); Infections (viral or bacterial infections damage sperm development); Lifestyle Factors (smoking, alcohol and excess heat harm sperm morphology); Environmental Toxins (chemical or radiation exposure affects sperm shape). Right panel Treatment Options: Lifestyle Changes (healthy diet, exercise, avoid alcohol, smoking and heat); ICSI Procedure (a single healthy sperm injected directly into the egg); IVF with ICSI (stimulation cycle combined with ICSI injection technique); Medical Therapy (antioxidants and hormonal treatments improve morphology).",
  },

  // ── Wave 14: Published blogs ──────────────────────────────────────────
  "risks-and-benefits-of-laser-assisted-hatching-in-ivf": {
    svg:     SVG_LASER_HATCHING_CASES,
    title:   "5 Cases Where Laser-Assisted Hatching May Help",
    altText: "Five-panel horizontal infographic. Panel 1 Women Over 35: declining ovarian reserve may benefit from LAH. Panel 2 Repeated IVF Failure: previous cycles where implantation did not occur. Panel 3 Thick Zona Pellucida: embryos with unusually thick protein shells. Panel 4 Frozen Embryos: thawed embryos may develop a thicker zona after cryopreservation. Panel 5 Poor Development: slow cleavage or low-quality embryos may be helped.",
  },

  "bavishi-fertility-institute-conducts-a-successful-cme-program-at-bardoli": {
    svg:     SVG_BFI_CME_BARDOLI,
    title:   "BFI CME Bardoli: 4 Key Highlights",
    altText: "Four-row accent-bar infographic. Highlight 1 Esteemed Faculty: led by Dr. Himanshu Bavishi and Dr. Deep Gajiwala with evidence-based presentations. Highlight 2 Interactive Learning Format: case studies, Q&A and peer-to-peer collaborative discussions. Highlight 3 Regional Medical Collaboration: gynecologists from Bardoli and surrounding areas shared best practices. Highlight 4 Commitment to Knowledge Sharing: continuous professional development in evidence-based reproductive healthcare.",
  },

  "secondary-infertility-why-getting-pregnant-again-can-be-hard": {
    svg:     SVG_SECONDARY_INFERTILITY_CAUSES,
    title:   "5 Common Causes of Secondary Infertility",
    altText: "Five-row single-column infographic. Row 1 Age-related Decline: egg quality and quantity reduce after 30, and more sharply after 35. Row 2 Ovulation Disorders: PCOS, thyroid issues or high prolactin can disrupt regular ovulation. Row 3 Uterine Conditions: fibroids, endometrial polyps or adhesions make implantation difficult. Row 4 Male Factor Infertility: low sperm count, poor motility or morphology can develop over time. Row 5 Lifestyle Influences: obesity, smoking, alcohol and stress impact fertility in both partners.",
  },

  "step-by-step-guide-to-the-icsi-procedure": {
    svg:     SVG_ICSI_STEPS,
    title:   "6 Steps of the ICSI Procedure",
    altText: "Two-column six-item grid. Items 1-3 (left): Initial Consultation (complete fertility assessment for both partners); Ovarian Stimulation (hormone injections 8-12 days; follicle growth monitored); Egg Retrieval (day-care procedure under mild sedation; ultrasound guided). Items 4-6 (right): Sperm Collection (partner's sample prepared; or TESA/PESA if needed); ICSI Microinjection (single healthy sperm directly injected into mature egg); Embryo Transfer (fertilised embryo cultured 3-5 days then transferred).",
  },

  "step-by-step-process-of-an-iui-procedure-what-to-expect": {
    svg:     SVG_IUI_PROCEDURE_STEPS,
    title:   "5 Steps of the IUI Procedure",
    altText: "Five-row single-column infographic. Step 1 Initial Consultation and Evaluation: medical history, ultrasound, hormonal tests and semen analysis. Step 2 Ovulation Monitoring and Cycle Planning: follicular growth tracked via ultrasound and hormone levels. Step 3 Triggering Ovulation: hCG trigger injection once follicle reaches optimal 18-20mm size. Step 4 Semen Collection and Preparation: sperm sample washed to concentrate healthiest most motile cells. Step 5 The IUI Procedure: prepared sperm placed directly into the uterus via a thin catheter.",
  },

  // ── Wave 13: Published blogs ──────────────────────────────────────────
  "normal-delivery-tips-to-increase-your-chances-of-a-natural-birth": {
    svg:     SVG_NATURAL_DELIVERY_TIPS,
    title:   "6 Tips to Increase Your Chances of a Natural Birth",
    altText: "Two-column six-item grid. Items 1-3 (left): Understand Your Body (take prenatal yoga and know your body's limits); Prepare Your Body (pelvic floor, perineal massage, fetal positioning); Nutrition and Hydration (whole foods balanced diet; stay well hydrated). Items 4-6 (right): Labour Support (supportive care provider, birth plan and doula); Natural Stimulation (evening primrose, acupuncture and gentle walking); Mindset and Relaxation (positive affirmations, breathing and meditation).",
  },

  "pcos-diet-tips-to-support-natural-conception": {
    svg:     SVG_PCOS_DIET_TIPS_9,
    title:   "9 PCOS Diet Tips to Support Natural Conception",
    altText: "Two-column nine-item grid. Items 1-5 (left): Low-GI Foods (whole grains, legumes and non-starchy vegetables); Carbs + Protein (pair carbs with protein to reduce blood sugar spikes); Healthy Fats (avocado, olive oil, nuts and omega-3); Increase Fiber (supports digestion and improves insulin sensitivity); Avoid Processed Foods (cut refined sugar, white bread and sweetened drinks). Items 6-9 (right): Stay Hydrated (drink plenty of water for hormonal balance); Limit Dairy (reduce if sensitive; opt for plant-based alternatives); Anti-Inflammatory Foods (turmeric, ginger, berries and leafy greens); Supplements with Doctor (inositol, Vitamin D and Omega-3 under guidance).",
  },

  "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days": {
    svg:     SVG_EMBRYO_TRANSFER_TIMELINE,
    title:   "Post-Embryo Transfer: 4 Key Milestones",
    altText: "Four-row accent-bar infographic. Milestone 1 Days 1–3: Embryo Hatches and Settles — zona pellucida dissolves; embryo floats freely in uterine cavity. Milestone 2 Days 4–5: Implantation Occurs — hatched embryo attaches to and burrows into the endometrial lining. Milestone 3 Days 6–9: hCG Production Begins — pregnancy hormone rises but may be too low for home tests. Milestone 4 Days 10–14: Official Blood Pregnancy Test — beta hCG blood test gives a clear and reliable result.",
  },

  // ── Wave 33: Draft blogs (enrichment continues into unpublished content) ──
  "how-many-embryos-should-be-transferred-risks-of-multiple-pregnancy-explained": {
    svg:     SVG_EMBRYO_TRANSFER_COUNT_BY_AGE,
    title:   "How Many Embryos to Transfer? By Age",
    altText: "Three-panel horizontal infographic. Under 35: Single Embryo Transfer (SET) usually recommended. 35–40: One or two embryos may be considered. Above 40: Two embryos may be transferred in some cases.",
  },

  "10-signs-you-should-see-fertility-specialist-and-when-not-to-wait": {
    svg:     SVG_FERTILITY_SPECIALIST_TIMING,
    title:   "When to See a Fertility Specialist: By Age",
    altText: "Four-panel horizontal infographic. Under 35: try for 12 months first. 35–37: try for 6 months first. 38–39: try for 3 months first. 40+: see a specialist immediately.",
  },

  "how-to-improve-male-infertility": {
    svg:     SVG_MALE_INFERTILITY_IMPROVE_9,
    title:   "9 Ways to Improve Male Fertility",
    altText: "Two-column nine-item grid. Items 1-5 (left): Healthy Diet (antioxidants, vitamins, zinc-rich foods); Regular Exercise (maintains healthy weight and hormone balance); Avoid Smoking & Alcohol (both reduce sperm count and quality); Reduce Stress (protects testosterone and sperm production); Limit Environmental Toxins (avoid pesticides, heavy metals, chemicals). Items 6-9 (right): Loose-Fitting Underwear (reduces scrotal temperature); Treat Underlying Conditions (varicocele, hormonal, ED treatments); Fertility Supplements (zinc, folic acid, CoQ10, L-carnitine); Avoid Excessive Heat (no hot tubs, saunas, prolonged heat exposure).",
  },

  "how-to-recognize-signs-of-ovulation-for-better-fertility-planning": {
    svg:     SVG_OVULATION_PHYSICAL_SIGNS_5,
    title:   "5 Physical Signs of Ovulation",
    altText: "Five-panel horizontal infographic. Sign 1 BBT Shift: temperature rises slightly after ovulation. Sign 2 Cervical Mucus Changes: becomes clear, slippery, egg-white like. Sign 3 Ovulation Pain: mild, sharp pain on one side (mittelschmerz). Sign 4 Breast Tenderness: hormonal fluctuations cause swelling. Sign 5 Increased Libido: natural surge during the fertile window.",
  },

  "how-to-test-for-female-infertility": {
    svg:     SVG_FEMALE_INFERTILITY_TESTS_6,
    title:   "6 Key Diagnostic Tests for Female Infertility",
    altText: "Two-column six-item grid. Items 1-3 (left): Hormonal Testing (FSH, LH, AMH, thyroid, prolactin); Ultrasound Evaluation (checks PCOS, fibroids, endometrial thickness); Laparoscopy (direct view to check endometriosis, PID). Items 4-6 (right): Ovulation Testing (progesterone levels, OPKs, ultrasound); HSG (X-ray checks tubal blockages and uterine shape); Ovarian Reserve Testing (AMH, AFC, FSH and estradiol levels).",
  },

  // ── Wave 34: Draft blogs (batch 2) ──────────────────────────────────
  "icsi-vs-ivf-do-you-actually-need-icsi-or-is-it-being-upsold-to-you": {
    svg:     SVG_ICSI_ACTUALLY_NEEDED,
    title:   "ICSI vs IVF: Is It Actually Needed?",
    altText: "Two-panel comparison. Left (ICSI Is Genuinely Needed): Very Low Sperm Count; Poor Motility or Shape; No Sperm in Semen (azoospermia); Previous Fertilisation Failure. Right (ICSI Is Not Necessary): Normal Semen Analysis; First IVF Cycle with no prior failure; Unexplained Infertility with normal sperm; Female-Only Infertility Issues (PCOS, endometriosis).",
  },

  "impact-of-age-repeated-ivf-cycles-on-pregnancy": {
    svg:     SVG_IVF_SUCCESS_STRATEGIES_7,
    title:   "7 Strategies to Improve IVF Success",
    altText: "Two-column seven-item grid. Items 1-4 (left): Healthy Diet; Weight Management; Avoid Harmful Substances; Stress Management. Items 5-7 (right): Regular Physical Activity; Consult a Fertility Specialist; Mind Cycle Timing.",
  },

  "importance-of-folic-acid-before-and-during-pregnancy": {
    svg:     SVG_FOLIC_ACID_REASONS_5,
    title:   "5 Reasons Folic Acid Matters",
    altText: "Two-column five-item grid. Items 1-3 (left): Healthy DNA Synthesis; Prevents Neural Tube Defects; Improved Reproductive Health. Items 4-5 (right): Reduces Risk of Premature Birth; Prevents Low Birth Weight.",
  },

  "imsi-technique-for-ivf-advanced-sperm-selection-for-better-success": {
    svg:     SVG_IMSI_LAB_STEPS_5,
    title:   "How IMSI Works: 5 Lab Steps",
    altText: "Five-row single-column infographic. Step 1 Semen Preparation: density gradient or swim-up isolates the best motile sperm. Step 2 High Magnification Screening: sperm scanned at 6000x under specialized optics. Step 3 Morphological Assessment: checked for head shape, size, symmetry and vacuoles. Step 4 Selection & Injection: best morphologically normal sperm injected into the egg. Step 5 Culture & Monitoring: fertilized eggs tracked through embryo development.",
  },

  "in-vitro-egg-aspiration-how-the-ivf-egg-retrieval-process-works": {
    svg:     SVG_EGG_RETRIEVAL_STEPS_4,
    title:   "The Egg Retrieval Process: 4 Steps",
    altText: "Four-panel horizontal infographic. Step 1 Preparation: ovarian stimulation medications. Step 2 Monitoring: ultrasound and hormone level checks. Step 3 Procedure: ultrasound-guided needle under sedation. Step 4 Egg Collection: eggs aspirated from follicles into a lab dish.",
  },

  // ── Wave 35: Draft blogs (batch 3) ──────────────────────────────────
  "inauguration-of-our-new-branch-in-nikol": {
    svg:     SVG_NIKOL_BRANCH_INAUGURATION,
    title:   "Bavishi Fertility Institute: New Branch in Nikol",
    altText: "Four-row accent-bar infographic. Highlight 01 New Location: Nikol, Ahmedabad — bringing world-class fertility care closer to the community. Highlight 02 Advanced Facility: state-of-the-art technology and modern amenities. Highlight 03 Expert Team: dedicated fertility specialists, embryologists and support staff. Highlight 04 Comprehensive Care: full range of advanced IVF treatments for every stage of the journey.",
  },

  "insights-on-fertility-dr-bavishi-team-at-palanpur-society": {
    svg:     SVG_PALANPUR_SOCIETY_TALK,
    title:   "BFI at Palanpur: 4 Key Highlights",
    altText: "Four-row accent-bar infographic. Highlight 01 The Event: Dr. Himanshu, Dr. Falguni and Dr. Parth Bavishi invited by the Palanpur Ob-Gyn Society. Highlight 02 Session Focus: latest advancements in infertility and IVF treatment. Highlight 03 Patient-Centric Approach: emphasis on personalized care for better outcomes. Highlight 04 Real-World Impact: case studies and success stories shared with attending gynaecologists.",
  },

  "ivf-after-age-40-realistic-success-rates-and-treatment-strategies": {
    svg:     SVG_IVF_AFTER_40_STRATEGIES,
    title:   "4 Treatment Strategies for IVF After 40",
    altText: "Four-row accent-bar infographic. Strategy 01 Egg Donation: live birth rates of 50-70% using donor eggs from younger women. Strategy 02 PGT: identifies chromosomal abnormalities, improving healthy pregnancy chances. Strategy 03 ICSI: single sperm injection improves fertilization rates. Strategy 04 Blastocyst Transfer: day 5-6 embryo transfer increases implantation rates.",
  },

  "ivf-and-career-balancing-work-and-fertility-treatments": {
    svg:     SVG_IVF_CAREER_BALANCE_3,
    title:   "Balancing IVF Treatment & Career: 3 Tips",
    altText: "Three-panel horizontal infographic. Tip 1 Open Dialogue with Employer: many companies offer flexible arrangements. Tip 2 Know Your Treatment Needs: modern protocols rarely need extended rest. Tip 3 Build a Support Network: a trusted colleague can help navigate scheduling.",
  },

  "ivf-stimulation-protocols-a-comprehensive-guide": {
    svg:     SVG_STIMULATION_PROTOCOLS_COMPARISON,
    title:   "IVF Stimulation Protocols: Long vs Short",
    altText: "Two-panel comparison. Left (Long Protocol / Down Regulation): duration 4-6 weeks, GnRH agonist then FSH stimulation, improved egg quality, best for normal ovarian reserve and regular cycles. Right (Short Protocol / Antagonist): duration 2-3 weeks, GnRH antagonist prevents premature ovulation, reduced OHSS risk with flexible start date, best for normal reserve or OHSS risk patients.",
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
