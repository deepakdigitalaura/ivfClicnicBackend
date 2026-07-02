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
  <rect x="290" y="44" width="220" height="40" rx="8" fill="${C.dark}"/>
  <rect x="290" y="76" width="220" height="8" fill="${C.dark}"/>
  <text x="400" y="68" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">DURING PGT</text>
  <circle cx="310" cy="107" r="5" fill="${C.rose}"/>
  <text x="324" y="111" font-size="10.5" fill="${C.dark}" font-weight="600">Embryo biopsy (day 5)</text>
  <circle cx="310" cy="135" r="5" fill="${C.rose}"/>
  <text x="324" y="139" font-size="10.5" fill="${C.dark}" font-weight="600">Genetic lab testing</text>
  <circle cx="310" cy="163" r="5" fill="${C.rose}"/>
  <text x="324" y="167" font-size="10.5" fill="${C.dark}" font-weight="600">Embryo freezing</text>
  <line x1="512" y1="127" x2="527" y2="127" stroke="${C.rose}" stroke-width="1.5" marker-end="url(#arrPGT)"/>
  <rect x="530" y="44" width="230" height="166" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1"/>
  <rect x="530" y="44" width="230" height="40" rx="8" fill="${C.dark}"/>
  <rect x="530" y="76" width="230" height="8" fill="${C.dark}"/>
  <text x="645" y="68" text-anchor="middle" font-size="12" font-weight="700" fill="${C.white}">AFTER PGT</text>
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
  <rect x="405" y="44" width="355" height="40" rx="8" fill="${C.dark}"/>
  <text x="582" y="68" text-anchor="middle" font-size="11.5" font-weight="700" fill="${C.white}">CHOOSE TRADITIONAL WHEN…</text>
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
    altText: "Three-panel horizontal infographic with arrows. Panel 1 Before PGT (rose header): fertility consultation, genetic counselling, IVF protocol preparation. Panel 2 During PGT (dark header): embryo biopsy on day 5, genetic lab testing, embryo freezing. Panel 3 After PGT (dark header): receiving results, embryo transfer, post-transfer monitoring.",
  },

  "prp-vs-traditional-fertility-treatments-whats-the-difference": {
    svg:     SVG_PRP_VS_TRADITIONAL,
    title:   "When to Choose: PRP vs Traditional Fertility Treatment",
    altText: "Two-column comparison infographic. Left column Choose PRP When (rose header) — 4 items: Poor egg quality (PRP stimulates cellular repair); Uterine lining issues (PRP thickens lining for implantation); Recurrent miscarriage (PRP may reduce inflammation); Failed IVF cycles (combine PRP with IVF). Right column Choose Traditional When (dark header) — 3 items: Severe infertility (IVF or ICSI may be more effective); Blocked fallopian tubes (IVF bypasses blockage); Male factor infertility (ICSI addresses sperm issues).",
  },

  "reasons-for-iui-failure-symptoms-and-causes": {
    svg:     SVG_IUI_FAILURE_CAUSES,
    title:   "7 Common Causes of IUI Failure",
    altText: "Two-column seven-item grid. Items 1-4 (left): Age Factor (women over 35 have lower IUI success rates); Poor Sperm Quality (low motility or abnormal morphology reduces fertilisation); Ovulation Issues (irregular or absent ovulation as in PCOS); Tubal Blockage or Damage (blocked or damaged tubes prevent egg-sperm meeting). Items 5-7 (right): Endometrial Lining Issues (thin or unhealthy lining prevents implantation); Hormonal Imbalances (thyroid disorders and insulin resistance disrupt ovulation); Unexplained Infertility (no specific cause found despite normal test results).",
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
