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
    removeBlocks: ["key numbers"],
  },
  "icsi-dos-and-donts": {
    removeBlocks: ["key numbers"],
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
