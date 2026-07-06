/* =====================================================================
 * Blog Visual Retroactive Fix Script
 * ---------------------------------------------------------------------
 * Run one blog at a time:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=seh0zjkb NEXT_PUBLIC_SANITY_DATASET=production \
 *   SANITY_API_TOKEN=<token> PEXELS_API_KEY=<key> \
 *   npx tsx --tsconfig tsconfig.json scripts/fix-blog-visuals.mts --slug <slug>
 *
 * Per-blog fixes:
 *   ALL 5 blogs:  remove "Complete Guide" block (redundant w/ TOC) + "Key Numbers" block (redundant w/ stat strip)
 *   PRP:          rebuild 3-step SVG (light design) + replace centrifuge photo
 *   Thyroid:      replace blood-vials photo with non-clinical
 *   Diet:         rebuild weight-gain SVG (light design)
 *   High-Risk:    rebuild 4-phase SVG (light design)
 * ===================================================================== */

import { createClient } from "next-sanity";
import https from "https";
import http from "http";

// ── Env ──────────────────────────────────────────────────────────────
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token     = process.env.SANITY_API_TOKEN;
const pexelsKey = process.env.PEXELS_API_KEY;
if (!projectId || !token) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN required");
// pexelsKey only required when newPhoto config is set — checked lazily in main()

const slug = (process.argv.find(a => a.startsWith("--slug="))?.split("=")[1])
  ?? process.argv[process.argv.indexOf("--slug") + 1];
if (!slug) throw new Error("Pass --slug <blog-slug>");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

// ── Helpers ───────────────────────────────────────────────────────────
type LexicalNode = Record<string, unknown>;

function fetchUrl(url: string, headers: Record<string, string> = {}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    (lib.get as typeof https.get)(url, { headers }, (res) => {
      if ((res.statusCode ?? 0) >= 300 && res.headers.location) {
        fetchUrl(res.headers.location, headers).then(resolve, reject);
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function pexelsSearch(query: string): Promise<{ url: string; photographer: string; pageUrl: string } | null> {
  const q = encodeURIComponent(query);
  const buf = await fetchUrl(
    `https://api.pexels.com/v1/search?query=${q}&per_page=5&orientation=landscape&size=medium`,
    { Authorization: pexelsKey! }
  );
  const data = JSON.parse(buf.toString()) as { photos?: { src: { large: string }; photographer: string; url: string }[] };
  if (!data.photos?.length) return null;
  const photo = data.photos[Math.min(1, data.photos.length - 1)];
  return { url: photo.src.large, photographer: photo.photographer, pageUrl: photo.url };
}

async function uploadToCdn(imageUrl: string, filename: string): Promise<string> {
  console.log(`  ↓ Downloading ${imageUrl.slice(0, 70)}…`);
  const buf = await fetchUrl(imageUrl);
  console.log(`  ↑ Uploading ${Math.round(buf.length / 1024)}KB to Sanity CDN…`);
  const asset = await sanity.assets.upload("image", buf, { filename, contentType: "image/jpeg" });
  return asset.url;
}

function getBlockType(node: LexicalNode): string | null {
  if (node.type !== "block") return null;
  return ((node.fields as Record<string, unknown>)?.blockType as string) ?? null;
}

function getBlockTitle(node: LexicalNode): string | null {
  if (node.type !== "block") return null;
  return ((node.fields as Record<string, unknown>)?.title as string) ?? null;
}

function removeBlocksByTitle(children: LexicalNode[], titleContains: string): number {
  const needle = titleContains.toLowerCase();
  let removed = 0;
  for (let i = children.length - 1; i >= 0; i--) {
    const title = getBlockTitle(children[i]);
    if (title && title.toLowerCase().includes(needle)) {
      console.log(`  ✂ Removed block: "${title}" at [${i}]`);
      children.splice(i, 1);
      removed++;
    }
  }
  return removed;
}

function updateInfographicSvg(children: LexicalNode[], titleContains: string, newSvg: string): boolean {
  const needle = titleContains.toLowerCase();
  for (const node of children) {
    if (getBlockType(node) === "infographic") {
      const fields = node.fields as Record<string, unknown>;
      const t = String(fields.title ?? "").toLowerCase();
      if (t.includes(needle)) {
        fields.svgContent = newSvg;
        console.log(`  ✏ Updated SVG: "${fields.title}" (${newSvg.length} bytes)`);
        return true;
      }
    }
  }
  return false;
}

function updateExternalImageBlock(
  children: LexicalNode[], url: string, alt: string, caption: string, credit: string
): boolean {
  for (const node of children) {
    if (getBlockType(node) === "externalImage") {
      const f = node.fields as Record<string, unknown>;
      f.url = url; f.alt = alt; f.caption = caption; f.credit = credit;
      return true;
    }
  }
  return false;
}

// ── Design system constants (from src/styles.css) ──────────────────
const C = {
  ivory:    "#FAF9F6",
  border:   "#E2DEED",
  rose:     "#CF3A6A",  // --primary / "Book Appointment" button
  roseMid:  "#E07098",  // rose tint 2 (80% lightness relative to rose)
  roseSoft: "#F4C0D0",  // rose tint 1 (very light)
  dark:     "#1A1825",  // --foreground charcoal
  muted:    "#6B6580",  // muted foreground
  white:    "#FFFFFF",
  line:     "#DDD8EA",
};
const FONT = "'Inter', system-ui, sans-serif";

// ── Redesigned SVGs (light design, single rose accent, dark text) ─────

const SVG_PRP_PROCESS_LIGHT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" font-family="${FONT}">
  <rect width="800" height="200" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="198.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">HOW PRP OVARIAN REJUVENATION WORKS — 3 STEPS</text>
  <line x1="60" y1="36" x2="740" y2="36" stroke="${C.border}" stroke-width="1"/>
  <defs><marker id="arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="${C.rose}"/></marker></defs>
  <!-- Circles -->
  <circle cx="160" cy="102" r="34" fill="${C.rose}"/>
  <text x="160" y="96" text-anchor="middle" font-size="9.5" font-weight="600" fill="${C.white}">STEP</text>
  <text x="160" y="114" text-anchor="middle" font-size="20" font-weight="800" fill="${C.white}">1</text>
  <circle cx="400" cy="102" r="34" fill="${C.rose}"/>
  <text x="400" y="96" text-anchor="middle" font-size="9.5" font-weight="600" fill="${C.white}">STEP</text>
  <text x="400" y="114" text-anchor="middle" font-size="20" font-weight="800" fill="${C.white}">2</text>
  <circle cx="640" cy="102" r="34" fill="${C.rose}"/>
  <text x="640" y="96" text-anchor="middle" font-size="9.5" font-weight="600" fill="${C.white}">STEP</text>
  <text x="640" y="114" text-anchor="middle" font-size="20" font-weight="800" fill="${C.white}">3</text>
  <!-- Connectors -->
  <line x1="196" y1="102" x2="358" y2="102" stroke="${C.rose}" stroke-width="1.5" marker-end="url(#arr)" stroke-dasharray="4,3"/>
  <line x1="436" y1="102" x2="598" y2="102" stroke="${C.rose}" stroke-width="1.5" marker-end="url(#arr)" stroke-dasharray="4,3"/>
  <!-- Labels -->
  <text x="160" y="153" text-anchor="middle" font-size="11.5" font-weight="600" fill="${C.dark}">Blood Drawn</text>
  <text x="160" y="169" text-anchor="middle" font-size="10.5" fill="${C.muted}">&amp; PRP Extracted</text>
  <text x="400" y="153" text-anchor="middle" font-size="11.5" font-weight="600" fill="${C.dark}">Injected into Ovaries</text>
  <text x="400" y="169" text-anchor="middle" font-size="10.5" fill="${C.muted}">under Ultrasound Guidance</text>
  <text x="640" y="153" text-anchor="middle" font-size="11.5" font-weight="600" fill="${C.dark}">Growth Factors</text>
  <text x="640" y="169" text-anchor="middle" font-size="10.5" fill="${C.muted}">Stimulate Regeneration</text>
  <text x="400" y="193" text-anchor="middle" font-size="9" fill="${C.muted}">Source: Bavishi Fertility Institute clinical protocol</text>
</svg>`;

const SVG_DIET_WEIGHT_GAIN_LIGHT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 210" font-family="${FONT}">
  <rect width="800" height="210" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="208.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">RECOMMENDED WEIGHT GAIN BY TRIMESTER</text>
  <line x1="60" y1="36" x2="740" y2="36" stroke="${C.border}" stroke-width="1"/>
  <!-- T1 column -->
  <rect x="70" y="52" width="170" height="108" rx="8" fill="${C.roseSoft}" stroke="${C.rose}" stroke-width="1"/>
  <text x="155" y="76" text-anchor="middle" font-size="10" font-weight="700" fill="${C.rose}">FIRST TRIMESTER</text>
  <text x="155" y="92" text-anchor="middle" font-size="9.5" fill="${C.muted}">Week 1–12</text>
  <text x="155" y="125" text-anchor="middle" font-size="30" font-weight="800" fill="${C.rose}">1–2</text>
  <text x="155" y="143" text-anchor="middle" font-size="12" fill="${C.dark}">kg</text>
  <!-- T2 column -->
  <rect x="310" y="44" width="180" height="116" rx="8" fill="${C.roseMid}" stroke="${C.rose}" stroke-width="1"/>
  <text x="400" y="68" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">SECOND TRIMESTER</text>
  <text x="400" y="84" text-anchor="middle" font-size="9.5" fill="${C.white}" opacity="0.85">Week 13–27</text>
  <text x="400" y="117" text-anchor="middle" font-size="30" font-weight="800" fill="${C.white}">4–5</text>
  <text x="400" y="135" text-anchor="middle" font-size="12" fill="${C.white}">kg</text>
  <!-- T3 column -->
  <rect x="558" y="36" width="175" height="124" rx="8" fill="${C.rose}"/>
  <text x="646" y="60" text-anchor="middle" font-size="10" font-weight="700" fill="${C.white}">THIRD TRIMESTER</text>
  <text x="646" y="76" text-anchor="middle" font-size="9.5" fill="${C.white}" opacity="0.85">Week 28–Delivery</text>
  <text x="646" y="109" text-anchor="middle" font-size="30" font-weight="800" fill="${C.white}">5–6</text>
  <text x="646" y="127" text-anchor="middle" font-size="12" fill="${C.white}">kg</text>
  <!-- Note -->
  <text x="400" y="183" text-anchor="middle" font-size="10.5" font-weight="600" fill="${C.dark}">Total healthy gain: 10–13 kg</text>
  <text x="400" y="198" text-anchor="middle" font-size="9.5" fill="${C.muted}">Varies by pre-pregnancy BMI — confirm targets with your doctor</text>
</svg>`;

const SVG_HIGHRISK_PHASES_LIGHT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 250" font-family="${FONT}">
  <rect width="800" height="250" fill="${C.ivory}" rx="12"/>
  <rect x="0.75" y="0.75" width="798.5" height="248.5" fill="none" stroke="${C.border}" stroke-width="1.5" rx="12"/>
  <text x="400" y="27" text-anchor="middle" font-size="12" font-weight="700" fill="${C.dark}" letter-spacing="0.5">HIGH-RISK PREGNANCY CARE — 4 MANAGEMENT PHASES</text>
  <line x1="60" y1="36" x2="740" y2="36" stroke="${C.border}" stroke-width="1"/>
  <defs><marker id="arrHR" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="${C.rose}"/></marker></defs>
  <!-- Phase boxes -->
  <!-- Phase 1 -->
  <rect x="28" y="52" width="160" height="156" rx="8" fill="${C.white}" stroke="${C.rose}" stroke-width="1.5"/>
  <circle cx="108" cy="78" r="18" fill="${C.rose}"/>
  <text x="108" y="84" text-anchor="middle" font-size="15" font-weight="800" fill="${C.white}">1</text>
  <text x="108" y="106" text-anchor="middle" font-size="11" font-weight="700" fill="${C.rose}">Preconception</text>
  <text x="108" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.rose}">&amp; Early Care</text>
  <text x="108" y="141" text-anchor="middle" font-size="9.5" fill="${C.muted}">Optimise blood sugar,</text>
  <text x="108" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">BP &amp; thyroid before</text>
  <text x="108" y="169" text-anchor="middle" font-size="9.5" fill="${C.muted}">conception</text>
  <!-- Arrow 1→2 -->
  <line x1="190" y1="130" x2="210" y2="130" stroke="${C.rose}" stroke-width="1.5" marker-end="url(#arrHR)"/>
  <!-- Phase 2 -->
  <rect x="212" y="52" width="160" height="156" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="292" cy="78" r="18" fill="${C.rose}"/>
  <text x="292" y="84" text-anchor="middle" font-size="15" font-weight="800" fill="${C.white}">2</text>
  <text x="292" y="106" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Maternal</text>
  <text x="292" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Monitoring</text>
  <text x="292" y="141" text-anchor="middle" font-size="9.5" fill="${C.muted}">BP, blood sugar &amp;</text>
  <text x="292" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">thyroid function tests;</text>
  <text x="292" y="169" text-anchor="middle" font-size="9.5" fill="${C.muted}">weight &amp; urine checks</text>
  <!-- Arrow 2→3 -->
  <line x1="374" y1="130" x2="394" y2="130" stroke="${C.rose}" stroke-width="1.5" marker-end="url(#arrHR)"/>
  <!-- Phase 3 -->
  <rect x="396" y="52" width="160" height="156" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="476" cy="78" r="18" fill="${C.rose}"/>
  <text x="476" y="84" text-anchor="middle" font-size="15" font-weight="800" fill="${C.white}">3</text>
  <text x="476" y="106" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Fetal</text>
  <text x="476" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Monitoring</text>
  <text x="476" y="141" text-anchor="middle" font-size="9.5" fill="${C.muted}">Growth ultrasounds,</text>
  <text x="476" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">Doppler studies &amp;</text>
  <text x="476" y="169" text-anchor="middle" font-size="9.5" fill="${C.muted}">biophysical profiles</text>
  <!-- Arrow 3→4 -->
  <line x1="558" y1="130" x2="578" y2="130" stroke="${C.rose}" stroke-width="1.5" marker-end="url(#arrHR)"/>
  <!-- Phase 4 -->
  <rect x="580" y="52" width="160" height="156" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <circle cx="660" cy="78" r="18" fill="${C.rose}"/>
  <text x="660" y="84" text-anchor="middle" font-size="15" font-weight="800" fill="${C.white}">4</text>
  <text x="660" y="106" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Delivery</text>
  <text x="660" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="${C.dark}">Planning</text>
  <text x="660" y="141" text-anchor="middle" font-size="9.5" fill="${C.muted}">Timing by maternal &amp;</text>
  <text x="660" y="155" text-anchor="middle" font-size="9.5" fill="${C.muted}">fetal health; planned</text>
  <text x="660" y="169" text-anchor="middle" font-size="9.5" fill="${C.muted}">induction or C-section</text>
  <!-- Bottom note -->
  <rect x="140" y="228" width="520" height="14" rx="4" fill="${C.rose}" opacity="0.08"/>
  <text x="400" y="239" text-anchor="middle" font-size="9.5" fill="${C.rose}" font-weight="600">With proper management, most women with high-risk conditions achieve healthy outcomes</text>
</svg>`;

// ── Per-blog fix config ───────────────────────────────────────────────
interface FixConfig {
  // Blocks to remove by title substring
  removeBlocks: string[];
  // SVG updates: [titleSubstring, newSvg]
  svgUpdates?: Array<[string, string]>;
  // Photo replacement
  newPhoto?: {
    query: string;
    alt: string;
    caption: string;
  };
}

const FIX_CONFIGS: Record<string, FixConfig> = {
  "prp-ovarian-rejuvenation-boosting-egg-quality-and-fertility": {
    removeBlocks: ["complete guide", "key numbers"],
    svgUpdates: [["how prp ovarian rejuvenation works", SVG_PRP_PROCESS_LIGHT]],
    newPhoto: {
      query: "warm fertility clinic consultation doctor patient discussion",
      alt: "A fertility specialist in a warm consultation with a patient — BFI's individualized approach to PRP ovarian rejuvenation",
      caption: "Every PRP ovarian rejuvenation journey starts with a personalised consultation to assess candidacy and create a treatment plan.",
    },
  },

  "ivf-for-women-with-thyroid-disorders-what-patients-should-know": {
    removeBlocks: ["step-by-step process", "key numbers"],
    newPhoto: {
      query: "doctor patient consultation warm thyroid health discussion",
      alt: "A doctor and patient in a calm discussion about thyroid health management during IVF treatment",
      caption: "Managing thyroid disorders during IVF requires close collaboration between your endocrinologist and fertility specialist.",
    },
  },

  "complete-pregnancy-diet-chart-by-trimester-what-to-eat-in-the-first-second-third-trimester": {
    removeBlocks: ["complete guide", "key numbers"],
    svgUpdates: [["recommended weight gain by trimester", SVG_DIET_WEIGHT_GAIN_LIGHT]],
  },

  "the-emotional-rollercoaster-of-ivf-why-mental-health-support-is-essential": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },

  "high-risk-pregnancy-due-to-diabetes-bp-thyroid-disorders": {
    removeBlocks: ["complete guide", "key numbers"],
    svgUpdates: [["high-risk pregnancy care", SVG_HIGHRISK_PHASES_LIGHT]],
  },

  // ── Wave 2: Next 5 blogs ────────────────────────────────────────────
  // blog-pg-1: no Complete Guide / Key Numbers detected — only replace-photo needed
  "10-foods-to-improve-female-egg-quality": {
    removeBlocks: ["complete guide", "key numbers"],
  },

  "how-male-infertility-affects-ivf-treatment": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },

  "how-nutrition-impacts-your-fertility-what-science-says": {
    removeBlocks: ["complete guide", "key numbers"],
  },

  "icsi-vs-ivf-success-rates-benefits-and-risks-compared": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },

  // ── Wave 3: Next 5 blogs ────────────────────────────────────────────
  "how-lifestyle-choices-of-both-partners-impact-icsi-success-rates": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },

  "how-pre-implantation-genetic-testing-boosts-ivf-success": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },

  "is-egg-freezing-a-good-option-if-i-want-to-delay-pregnancy": {
    removeBlocks: ["complete guide", "key numbers"],
  },

  "ivf-after-35-navigating-fertility-challenges-with-confidence-and-hope": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },

  "how-to-improve-ovulation-naturally-when-you-have-pcos": {
    removeBlocks: ["complete guide", "key numbers"],
  },

  // ── Wave 4: Next 5 blogs ────────────────────────────────────────────
  "how-long-do-you-have-to-wait-to-try-again-after-a-miscarriage": {
    removeBlocks: ["complete guide", "key numbers"],
  },

  "how-long-does-it-take-for-letrozole-to-get-out-of-your-system": {
    removeBlocks: ["complete guide", "key numbers"],
  },

  "how-long-does-it-take-for-the-uterus-to-go-back-to-normal-after-birth": {
    removeBlocks: ["complete guide", "key numbers"],
  },

  "how-long-should-you-see-a-gynecologist-after-delivery": {
    removeBlocks: ["complete guide", "key numbers"],
  },

  "how-low-amh-affects-menstrual-cycle-regularity": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },

  // ── Wave 5: Published blogs ─────────────────────────────────────────
  "how-many-times-can-a-person-undergo-ivf-procedure": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },

  "how-much-weight-can-a-baby-gain-in-a-week-in-the-womb": {
    removeBlocks: ["complete guide", "key numbers"],
  },

  "how-to-get-pregnant-without-removing-fibroid-or-without-surgery": {
    removeBlocks: ["complete guide", "key numbers"],
  },

  "how-to-improve-your-chances-of-conceiving-naturally-with-low-amh-levels": {
    removeBlocks: ["complete guide", "key numbers"],
  },

  "how-to-improve-your-chances-of-iui-success-naturally": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },

  // ── Wave 6: Published blogs ─────────────────────────────────────────
  "how-to-protect-your-mental-health-during-ivf-and-fertility-treatments": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },

  "a-complete-guide-on-explaining-periods-to-men": {
    removeBlocks: ["complete guide", "key numbers"],
  },

  "indian-celebrities-who-improved-fertility-through-yoga": {
    removeBlocks: ["complete guide", "key numbers"],
  },

  "a-guide-to-the-different-types-of-ivf-treatments": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },

  "innovative-treatments-for-low-amh": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },

  // ── Wave 7: Published blogs ─────────────────────────────────────────
  "how-to-prepare-for-your-first-iui-cycle-tips-and-advice": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "icsi-dos-and-donts": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "is-icsi-better-for-men-with-low-sperm-count": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "is-iui-painful-everything-you-need-to-know": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "is-ivf-painful": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },

  // ── Wave 8: Published blogs ─────────────────────────────────────────
  "is-ivf-possible-without-injections-understanding-easy-ivf-and-injection-free-ivf": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "is-natural-cycle-ivf-better-for-women-with-poor-ovarian-reserve": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "iui-process-explained-what-to-expect-at-every-step": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "iui-side-effects-on-the-body-and-emotions-a-complete-guide": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "a-quick-guide-on-the-ivf-journey-with-egg-donors": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },

  // ── Wave 9: Published blogs ─────────────────────────────────────────
  "iui-success-rate-what-to-expect-after-iui-treatment": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "ivf-cost-in-ahmedabad-whats-included-how-to-plan-your-budget": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "ivf-failure-doesnt-mean-the-end-what-can-you-do-next": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "ivf-for-single-women-in-india-navigating-new-art-law": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "ivf-pregnancy-week-by-week-symptoms-and-safety": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 10 ──────────────────────────────────────────────────────────
  "advancing-ovarian-science-a-full-day-scientific-program-in-surat": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "ivf-pregnancy-with-pcos-and-endometriosis": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "life-after-iui-precautions-lifestyle-tips-and-what-to-expect": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "lifestyle-changes-that-boost-fertility-in-pcos-women": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "lifestyle-changes-to-boost-ivf-success-and-increase-your-chances-of-a-healthy-pregnancy": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 11 ──────────────────────────────────────────────────────────
  "natural-conception-with-low-amh-levels": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "necrozoospermia-symptoms-causes-and-treatment-options": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "nourishing-your-body-after-embryo-transfer-a-comprehensive-guide": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "ovarian-rejuvenation-for-restoring-fertility-a-new-ray-of-hope": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "ovarian-rejuvenation-ivf-what-to-know-when-combining-treatments": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 32 (FINAL WAVE) ─────────────────────────────────────────────
  "how-do-male-fertility-supplements-impact-ivf-results": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "how-do-thyroid-disorders-affect-fertility-in-women": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "how-does-follicle-count-affect-ivf-success-rates": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "how-does-letrozole-help-with-ovulation-and-pregnancy": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "how-does-the-number-of-eggs-affect-ivf-success-rate": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "how-human-fertilization-works-step-by-step-explanation": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "how-letrozole-works-a-comprehensive-guide-to-boosting-ovulation-for-fertility": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 31 ──────────────────────────────────────────────────────────
  "frozen-vs-fresh-embryo-transfer-which-is-better": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "government-vs-private-ivf-centres-in-ahmedabad-which-one-is-better": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "how-age-affects-fertility-myths-vs-facts": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "10-foods-that-will-increase-sperm-count-and-5-foods-to-avoid": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "how-can-i-increase-my-amh-levels": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 30 ──────────────────────────────────────────────────────────
  "essential-precautions-to-take-after-embryo-transfer-for-ivf-success": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "essential-tests-for-male-infertility-what-to-expect": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "fibroids-and-diet-foods-that-may-help-manage-symptoms-naturally": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "fibroids-in-young-women-and-teenagers-early-symptoms-and-myths": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "foods-to-avoid-during-pregnancy-and-why": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  // ── Wave 29 ──────────────────────────────────────────────────────────
  "embryo-transfer-procedure-for-in-vitro-fertilization-ivf": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "empowering-women-in-medicine-knowledge-sharing-program-on-advanced-fertility-and-ivf-techniques-at-nikol": {
    removeBlocks: ["key aspects", "key numbers"],
  },
  "endometrial-lining-remedies-for-abnormal-thickness": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "uterine-fibroids-symptoms-causes-and-treatment": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "endometriosis-and-ivf-what-to-expect-and-how-to-prepare": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 28 ──────────────────────────────────────────────────────────
  "common-risks-in-twin-pregnancy-and-how-do-doctors-manage-them": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "dos-and-donts-during-ivf-stimulation-a-comprehensive-guide": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "dr-falguni-bavishi-at-sogog-conference-on-iui-success": {
    removeBlocks: ["key aspects", "key numbers"],
  },
  "dr-himanshu-bavishi-speaks-on-ivf-at-sogog-conference": {
    removeBlocks: ["key aspects", "key numbers"],
  },
  "the-link-between-pcos-and-infertility": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 27 ──────────────────────────────────────────────────────────
  "can-varicocele-be-treated-without-surgery-exploring-your-options": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "can-you-get-pregnant-with-ovarian-cysts": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "celebrating-the-divine-joy-six-babies-born-on-janmashtami-at-bavishi-fertility-institute": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "choosing-between-a-day-5-vs-day-3-embryo-transfer": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "cme-program-on-infertility-management-successfully-conducted-at-idar": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 26 ──────────────────────────────────────────────────────────
  "breaking-free-from-varicocele-pain-3-innovative-ways-to-find-relief": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "can-a-woman-get-pregnant-once-her-periods-stop": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "can-endometriosis-come-back-after-surgery-recurrence-rates-prevention-tips": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "can-ivf-work-with-low-amh": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "can-natural-cycle-ivf-reduce-the-risk-of-ovarian-hyperstimulation": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 25 ──────────────────────────────────────────────────────────
  "ovarian-hyperstimulation-syndrome": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "egg-freezing-preserving-your-fertility-for-the-future": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "best-ivf-hospitals-in-ahmedabad": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "best-types-of-exercise-to-support-your-ivf-journey": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "blighted-ovum-symptoms-causes-and-more": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 24 ──────────────────────────────────────────────────────────
  "reasons-behind-low-amh-levels-ways-to-increase": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "miscarriages-during-ivf-signs-causes-prevention-hope": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "are-ivf-babies-healthy-as-naturally-conceived": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "bed-rest-myth-during-ivf": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "myth-twins-and-ivf": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 23 ──────────────────────────────────────────────────────────
  "how-to-interpret-amh-afc-and-other-ovarian-reserve-rests-what-the-numbers-really-mean": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "do-i-need-an-ultrasound-in-every-pregnancy-visit-is-it-safe": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "what-are-microplastics-how-do-they-affect-reproductive-health": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "12-tips-for-getting-pregnant-faster-with-pcos-a-step-by-step-guide": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "13-best-ivf-clinics-in-mumbai": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 22 ──────────────────────────────────────────────────────────
  "when-should-you-get-3d-4d-ultrasound-during-pregnancy": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "when-to-consider-sperm-dna-fragmentation-testing-in-low-sperm-count-cases": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "when-to-take-a-pregnancy-test-after-iui-timing-and-accuracy-explained": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "why-do-some-embryos-not-implant-even-if-they-look-healthy": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "why-dont-embryos-stick-key-reasons-you-need-to-know": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 21 ──────────────────────────────────────────────────────────
  "what-is-the-non-stress-test-nst-in-pregnancy-and-why-is-it-important": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "what-is-the-relationship-between-pcos-and-amh-level": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "what-to-eat-during-pregnancy-a-week-by-week-nutrition-plan": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "bavishi-fertility-institute-hosts-knowledge-sharing-program-with-bharuch-ob-gy-society": {
    removeBlocks: ["key aspects", "key numbers"],
  },
  "when-should-you-consider-donor-eggs-or-sperm": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 20 ──────────────────────────────────────────────────────────
  "what-happens-after-embryo-transfer-day-by-day": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "what-is-epigenetics-does-it-affect-ivf-pregnancies-only": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "what-is-the-difference-between-pcod-pcos": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "what-is-the-max-number-of-eggs-that-you-can-retrieve-in-an-ivf-cycle": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ivf-treatment-cost-in-ahmedabad-across-india: NOT in FIX_CONFIGS — no redundant blocks, replace-only
  // ── Wave 19 ──────────────────────────────────────────────────────────
  "bavishi-fertility-institute-hosts-fogsi-recognized-training-program-in-ahmedabad": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "understanding-sperm-cramps-symptoms-causes-diagnosis-treatment": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "understanding-the-success-rate-of-ivf-treatment": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "understanding-thin-endometrium-causes-impact-and-treatment-options": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "bavishi-fertility-institute-hosts-joint-educational-cme-with-east-ahmedabad-gynaecologist-association": {
    removeBlocks: ["key aspects", "key numbers"],
  },
  // ── Wave 18 ──────────────────────────────────────────────────────────
  "twin-and-multiple-pregnancies-after-ivf-risks-and-care": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "twin-pregnancy-delivery-options-normal-delivery-vs-c-section": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "understanding-frozen-embryo-transfer-fet-in-ivf": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "understanding-hypospermia-signs-symptoms-and-treatment-options": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "understanding-negative-signs-after-embryo-transfer-when-to-worry": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 17 ──────────────────────────────────────────────────────────
  "the-role-of-endometrial-receptivity-in-ivf-success": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "the-thyroid-connection-understanding-its-role-in-female-fertility-health": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "top-10-reasons-to-consider-egg-freezing": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "trying-to-conceive-after-40-what-you-need-to-know": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 16 ──────────────────────────────────────────────────────────
  "the-connection-between-quality-sleep-and-ivf-success-a-hormonal-perspective": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "the-dfi-test-a-crucial-diagnostic-tool-for-male-infertility": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "the-miracle-of-implantation-recognizing-the-signs": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "the-postpartum-journey-how-long-does-it-take-to-heal-after-giving-birth": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 15 ──────────────────────────────────────────────────────────
  "step-by-step-process-of-embryo-freezing-in-an-ivf-cycle": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "stories-from-indian-celebrities-of-egg-freezing": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "surrogacy-vs-ivf-key-differences-benefits-and-choosing-the-right-path-to-parenthood": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "bavishi-fertility-institute-conducts-an-educational-programme-at-rajkot": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "teratozoospermia-uncovering-the-causes-symptoms-and-solutions": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 14 ──────────────────────────────────────────────────────────
  "risks-and-benefits-of-laser-assisted-hatching-in-ivf": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "bavishi-fertility-institute-conducts-a-successful-cme-program-at-bardoli": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "secondary-infertility-why-getting-pregnant-again-can-be-hard": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "step-by-step-guide-to-the-icsi-procedure": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "step-by-step-process-of-an-iui-procedure-what-to-expect": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 13 ──────────────────────────────────────────────────────────
  "advantages-and-disadvantages-of-pgt": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "normal-delivery-tips-to-increase-your-chances-of-a-natural-birth": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "pcos-diet-tips-to-support-natural-conception": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "pros-and-cons-of-using-donor-eggs": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 12 ──────────────────────────────────────────────────────────
  "asthenospermia-understanding-the-condition-and-exploring-assisted-reproductive-technologies-art-options": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "pregnancy-signs-symptoms": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "preparing-for-pgt-what-to-expect-before-during-and-after-the-procedure": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "prp-vs-traditional-fertility-treatments-whats-the-difference": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "reasons-for-iui-failure-symptoms-and-causes": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 33: Draft blogs ─────────────────────────────────────────────
  "how-many-embryos-should-be-transferred-risks-of-multiple-pregnancy-explained": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "10-signs-you-should-see-fertility-specialist-and-when-not-to-wait": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "how-to-improve-male-infertility": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "how-to-recognize-signs-of-ovulation-for-better-fertility-planning": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "how-to-test-for-female-infertility": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 34: Draft blogs (batch 2) ───────────────────────────────────
  "icsi-vs-ivf-do-you-actually-need-icsi-or-is-it-being-upsold-to-you": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "impact-of-age-repeated-ivf-cycles-on-pregnancy": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "importance-of-folic-acid-before-and-during-pregnancy": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "imsi-technique-for-ivf-advanced-sperm-selection-for-better-success": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "in-vitro-egg-aspiration-how-the-ivf-egg-retrieval-process-works": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 35: Draft blogs (batch 3) ───────────────────────────────────
  "inauguration-of-our-new-branch-in-nikol": {
    removeBlocks: ["key aspects", "key numbers"],
  },
  "insights-on-fertility-dr-bavishi-team-at-palanpur-society": {
    removeBlocks: ["key aspects", "key numbers"],
  },
  "ivf-after-age-40-realistic-success-rates-and-treatment-strategies": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "ivf-and-career-balancing-work-and-fertility-treatments": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "ivf-stimulation-protocols-a-comprehensive-guide": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 36: Draft blogs (batch 4) ───────────────────────────────────
  "lifestyle-diet-rest-tips-for-high-risk-pregnancy": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "male-infertility-treatment-options-in-ahmedabad-what-you-should-know": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "oncofertility-preserving-fertility-before-cancer-treatment": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "ovarian-cysts-symptoms-causes-treatment-diagnosis": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "ovarian-follicles-the-tiny-heroes-of-fertility": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 37: Draft blogs (batch 5) ───────────────────────────────────
  "parenting-after-ivf-unique-challenges-and-rewards": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "personalized-ivf-the-future-of-fertility-treatment": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "personalized-medicine-how-ivf-treatment-is-customized": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "pgt-and-its-role-in-preventing-recurrent-miscarriages": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "pgt-for-couples-with-recurrent-ivf-failure-or-miscarriages-does-it-help": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 38: Draft blogs (batch 6) ───────────────────────────────────
  // NOTE: azoospermia-can-you-have-a-baby-with-zero-sperm-count has NO redundant blocks (already has 2 good infographics) — replace-only, no fix-blog-visuals run needed.
  "postpartum-mental-health-recognizing-baby-blues-and-postpartum-depression": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "pregnancy-complications": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "preparing-for-your-first-ivf-cycle-tips-and-advice": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "preserving-hope-ivf-and-fertility-preservation-for-cancer-patients": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 39: Draft blogs (batch 7) ───────────────────────────────────
  "questions-to-ask-ivf-specialist-at-1st-visit": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "r-j-lajja-of-my-fm-taking-interview-of-dr-parth-bavishi": {
    removeBlocks: ["key aspects", "key numbers"],
  },
  "rebuilding-families-fertility-treatment-options-for-cancer-survivors": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "recurrent-miscarriage-why-does-it-keep-happening-and-what-can-you-do": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "role-of-exercise-in-ivf-success": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 40: Draft blogs (batch 8) ───────────────────────────────────
  "silent-endometriosis-can-you-have-it-without-symptoms": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "success-rate-of-ivf-treatments-in-ahmedabad-what-to-expect-in-2025": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "team-excellence-and-innovation-at-bavishi-fertility-institute": {
    removeBlocks: ["key aspects", "key numbers"],
  },
  "understanding-varicocele-how-serious-is-the-diagnosis": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "the-hidden-threat-to-fertility-how-obesity-affects-your-chances": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 41: Draft blogs (batch 9) ───────────────────────────────────
  "the-journey-to-blastocyst-stage-and-implantation-understanding-your-chances-and-how-bavishi-fertility-institutes-can-help": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "the-match-system-revolutionizing-ivf-with-unparalleled-accuracy-and-safety": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "the-miracle-of-bonding-connecting-with-your-baby-before-birth": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "bavishi-fertility-institute-expands-to-bhavnagar-with-state-of-the-art-ai-enabled-ivf-and-womens-hospital": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "the-power-of-egg-freezing-empowering-choices-for-the-modern-generation": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 42: Draft blogs (batch 10) ──────────────────────────────────
  "the-relationship-between-egg-freezing-and-future-ivf-success-rates": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "the-role-of-nutrition-in-boosting-ivf-success": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "the-ultimate-guide-to-diet-in-lactation-nourishing-your-body-and-baby": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "the-unseen-struggle-understanding-male-infertility": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "thyroid-disorders-in-early-pregnancy": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 43: Draft blogs (batch 11) ──────────────────────────────────
  "bavishi-fertility-institute-honoured-at-times-healthcare-leaders-awards-2025": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "twin-pregnancy-understanding-common-risks-and-how-doctors-manage-them": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "understanding-endometrial-thickness-a-key-factor-in-female-fertility": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "understanding-reality-behind-ivf-success-rates": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "understanding-sperm-dna-fragmentation-causes-treatment-and-ivf-options": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 44: Draft blogs (batch 12) ──────────────────────────────────
  "understanding-the-reasons-for-ivf-failure": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "unexplained-infertility-when-tests-are-normal-but-you-still-cant-conceive": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "unlocking-hope-getting-pregnant-with-pcos-and-irregular-periods": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "unlocking-the-puzzle-of-recurrent-ivf-failure-endometriosis-and-uterine-factors": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "what-to-expect-during-each-stage-of-ivf": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 45: Draft blogs (batch 13) ──────────────────────────────────
  "when-can-you-start-exercising-after-delivery": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "when-is-macs-most-useful-indications-ideal-candidates-limitations": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "when-is-the-right-time-to-freeze-your-eggs": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "who-should-consider-a-blastocyst-transfer-in-ivf": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "why-are-couples-from-other-cities-choosing-ahmedabad-for-ivf-treatment": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 46: Draft blogs (batch 14) ──────────────────────────────────
  "bavishi-fertility-institute-most-trusted-fertility-chain-hospital-in-gujarat": {
    removeBlocks: ["key aspects", "key numbers"],
  },
  "celebrated-republic-day-with-hope-and-happiness-at-bavishi-fertility-institute": {
    removeBlocks: ["key aspects", "key numbers"],
  },
  "ivf-babies-meet-in-vadodara-a-momentous-event-creating-awareness": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "questions-to-discuss-with-doctor-during-multiple-ivf-cycles": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "male-infertility-signs-causes-treatment": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 47: Draft blogs (batch 15) ──────────────────────────────────
  "bavishi-fertility-institute-nikol-ahmedabad-celebrates-its-first-anniversary": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "factors-to-consider-right-clinic-for-ivf-journey": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "checking-if-ivf-is-the-last-option-to-conceive": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "ivf-failure-treatment-is-possible": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "complications-of-delaying-your-ivf-journey": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 48: Draft blogs (batch 16) ──────────────────────────────────
  "ectopic-pregnancy": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "do-and-dont-for-fertility": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "bavishi-fertility-institute-recognized-as-the-leading-ivf-chain-of-gujarat-by-radio-city": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "bavishi-fertility-institute-wins-ivf-chain-of-the-year-west-for-5th-time": {
    removeBlocks: ["key aspects", "key numbers"],
  },
  "bavishi-fertility-institute-wins-patient-centric-hospital-award": {
    removeBlocks: ["key aspects", "key numbers"],
  },
  // ── Wave 49: Draft blogs (batch 17) ──────────────────────────────────
  "blastocyst-transfer-in-special-situations-pcos-poor-responders-recurrent-ivf-failure-endometriosis-uterine-factors": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "boosting-implantation-success-the-power-of-embryo-glue": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "boosting-male-fertility-tips-to-improve-sperm-quality": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
  "boosting-your-ivf-success-a-comprehensive-guide-for-couples": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "building-families-with-hope-the-power-of-assisted-reproductive-technology": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 50: Draft blogs (batch 18) ──────────────────────────────────
  "how-to-choose-the-best-ivf-clinic-in-ahmedabad": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "celebrating-6-years-of-care-compassion-and-miracles-at-bavishi-fertility-institute-vadodara": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "cracking-opens-the-possibilities-how-laser-assisted-hatching-is-changing-the-game-for-ivf-patients": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "decoding-your-semen-analysis-report-a-simple-guide": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "demystifying-ivf-facts-and-myths": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  // ── Wave 51: Draft blogs (batch 19) ──────────────────────────────────
  "does-stress-affect-ivf-success": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "dr-parth-bavishi-honoured-with-the-prestigious-achiever-award-at-fertivision-2025": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "dr-parth-bavishi-wins-bharat-excellence-award-for-ivf": {
    removeBlocks: ["key aspects", "key numbers"],
  },
  "egg-freezing-vs-embryo-freezing-making-the-right-choice-for-your-fertility-journey": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "egg-freezing-your-fertility-time-capsule": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 52: Draft blogs (batch 20) ──────────────────────────────────
  "egg-quality-vs-egg-quantity-what-really-matters": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "embracing-positivity-activities-to-nurture-your-journey-to-motherhood-after-embryo-transfer": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "embryo-glue-a-game-changer-in-ivf-success-rates": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "endometrial-scratching-before-ivf-evidence-benefits-and-risks": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "endometriosis-and-gut-health-the-hidden-connection": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  // ── Wave 53: Draft blogs (batch 21) ──────────────────────────────────
  "endometriosis-and-menopause-what-to-expect-and-how-to-manage-symptoms": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "era-test-explained-does-it-really-improve-egg-quality": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "fertility-ovulation-facts-to-help-you-get-pregnant": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "fibroids-and-ivf-should-you-remove-them-before-treatment": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "dr-nilesh-jains-expert-guidance-on-fertility-treatments-in-mumbai": {
    removeBlocks: ["key aspects", "key numbers"],
  },
  // ── Wave 54: Draft blogs (batch 22) ──────────────────────────────────
  "finding-fertility-options-with-low-amh-a-detailed-guide": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "from-diagnosis-to-conception-managing-pcos-for-a-healthy-pregnancy": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "from-ivf-to-motherhood-the-journey-of-hope-and-happiness": {
    removeBlocks: ["step-by-step process", "key numbers"],
  },
  "genetic-testing-before-and-during-pregnancy-a-comprehensive-guide": {
    removeBlocks: ["complete guide", "key numbers"],
  },
  "high-risk-pregnancy-a-guide-to-lifestyle-diet-and-rest-tips": {
    removeBlocks: ["key recommendations", "key numbers"],
  },
};

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  const cfg = FIX_CONFIGS[slug];
  if (!cfg) {
    console.error(`No fix config for: ${slug}`);
    console.error("Available:", Object.keys(FIX_CONFIGS).join("\n  "));
    process.exit(1);
  }

  console.log(`\n▶ Fixing blog: ${slug}`);

  const doc = await sanity.fetch<{ _id: string; contentRaw: string }>(
    `*[_type=="blog"&&slug=="${slug}"][0]{_id,contentRaw}`
  );
  if (!doc?._id) throw new Error(`Blog not found in Sanity: ${slug}`);
  console.log(`  Found: ${doc._id}`);

  const es = JSON.parse(doc.contentRaw) as { root: { children: LexicalNode[] } };
  const children = es.root.children;

  // 1. Remove redundant blocks
  let totalRemoved = 0;
  for (const titlePart of cfg.removeBlocks) {
    totalRemoved += removeBlocksByTitle(children, titlePart);
  }
  if (totalRemoved === 0) console.log("  ℹ No redundant blocks found (may already be removed)");

  // 2. Update SVG designs
  if (cfg.svgUpdates) {
    for (const [titlePart, newSvg] of cfg.svgUpdates) {
      const ok = updateInfographicSvg(children, titlePart, newSvg);
      console.log(ok ? `  ✓ SVG rebuilt: "${titlePart}"` : `  ⚠ SVG not found: "${titlePart}"`);
    }
  }

  // 3. Replace photo
  if (cfg.newPhoto) {
    if (!pexelsKey) throw new Error("PEXELS_API_KEY required for newPhoto config");
    const { query, alt, caption } = cfg.newPhoto;
    console.log(`\n📷 Searching Pexels: "${query}"`);
    const photo = await pexelsSearch(query);
    if (!photo) throw new Error("Pexels: no results for: " + query);
    console.log(`  Selected photo by ${photo.photographer}`);
    const cdnUrl = await uploadToCdn(photo.url, `blog-${slug}-photo-v2.jpg`);
    console.log(`  ✓ CDN: ${cdnUrl}`);
    const ok = updateExternalImageBlock(
      children, cdnUrl, alt, caption,
      `Photo: Pexels / ${photo.photographer} (${photo.pageUrl})`
    );
    console.log(ok ? "  ✓ externalImage block updated" : "  ⚠ No externalImage block found");
  }

  // 4. Patch Sanity
  const newContentRaw = JSON.stringify(es);
  await sanity.patch(doc._id).set({ contentRaw: newContentRaw }).commit();
  console.log(`\n✅ Patched ${doc._id} (${newContentRaw.length} bytes)`);
  console.log("Next: npm run build — then run the next slug.\n");
}

main().catch(e => { console.error("❌", e); process.exit(1); });
