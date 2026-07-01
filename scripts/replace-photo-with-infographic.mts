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
