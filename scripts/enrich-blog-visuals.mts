/* =====================================================================
 * Blog Visual Enrichment Script
 * ---------------------------------------------------------------------
 * For each of the 5 target blogs:
 *  1. Searches Pexels for a per-plan-approved photo query
 *  2. Downloads best result, uploads to Sanity CDN (cdn.sanity.io)
 *  3. Updates the existing externalImage block URL in contentRaw
 *  4. Inserts any new plan-specified blocks (process-flow infographics, etc.)
 *  5. Sets heroImageUrl for the blog listing thumbnail
 *  6. Patches the Sanity document
 *
 * Run ONE blog at a time (--slug flag), then build between each:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=seh0zjkb NEXT_PUBLIC_SANITY_DATASET=production \
 *   SANITY_API_TOKEN=<token> PEXELS_API_KEY=<key> \
 *   npx tsx --tsconfig tsconfig.json scripts/enrich-blog-visuals.mts --slug prp-ovarian-rejuvenation-boosting-egg-quality-and-fertility
 * ===================================================================== */

import { createClient } from "next-sanity";
import https from "https";
import http from "http";
import { randomBytes } from "crypto";

// ── Env ──────────────────────────────────────────────────────────────
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
const pexelsKey = process.env.PEXELS_API_KEY;
if (!projectId || !token) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN required");
if (!pexelsKey) throw new Error("PEXELS_API_KEY required");

const slug = (process.argv.find(a => a.startsWith("--slug="))?.split("=")[1])
  ?? process.argv[process.argv.indexOf("--slug") + 1];
if (!slug) throw new Error("Pass --slug <blog-slug>");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

// ── Types ─────────────────────────────────────────────────────────────
type LexicalNode = Record<string, unknown>;
type LexicalRoot = { type: "root"; children: LexicalNode[]; direction: string; format: string; indent: number; version: number };
type EditorState = { root: LexicalRoot };

// ── Helpers ───────────────────────────────────────────────────────────
function nid(): string { return randomBytes(8).toString("hex"); }

function fetchUrl(url: string, headers: Record<string, string> = {}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const options = { headers };
    lib.get(url, options, (res) => {
      if ((res.statusCode ?? 0) >= 300 && (res.statusCode ?? 0) < 400 && res.headers.location) {
        fetchUrl(res.headers.location, headers).then(resolve, reject);
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (c) => chunks.push(c));
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
  const data = JSON.parse(buf.toString()) as { photos?: { id: number; src: { large2x: string; large: string }; photographer: string; url: string }[] };
  if (!data.photos?.length) return null;
  // Pick photo at index 1 (avoid the #1 most-used generic result)
  const photo = data.photos[Math.min(1, data.photos.length - 1)];
  return { url: photo.src.large, photographer: photo.photographer, pageUrl: photo.url };
}

async function uploadToCdn(imageUrl: string, filename: string): Promise<string> {
  console.log(`  Downloading ${imageUrl.slice(0, 70)}…`);
  const buf = await fetchUrl(imageUrl);
  console.log(`  Uploading ${Math.round(buf.length / 1024)}KB to Sanity CDN…`);
  const asset = await sanity.assets.upload("image", buf, { filename, contentType: "image/jpeg" });
  return asset.url;
}

function makeExternalImageBlock(url: string, alt: string, caption: string, credit: string): LexicalNode {
  return {
    type: "block",
    format: "",
    indent: 0,
    version: 1,
    children: [],
    fields: {
      id: nid(),
      blockName: "",
      blockType: "externalImage",
      url,
      alt,
      caption,
      credit,
    },
  };
}

function makeStatStripBlock(items: { value: string; label: string }[]): LexicalNode {
  return {
    type: "block",
    format: "",
    version: 2,
    fields: {
      id: nid(),
      blockName: "",
      blockType: "statStrip",
      items: items.map(it => ({ id: nid(), value: it.value, label: it.label })),
    },
  };
}

function makeComparisonTableBlock(
  rowHeader: string,
  columns: string[],
  rows: { label: string; cells: string[] }[]
): LexicalNode {
  return {
    type: "block",
    format: "",
    version: 2,
    fields: {
      id: nid(),
      blockName: "",
      blockType: "comparisonTable",
      rowHeader,
      columns: columns.map(h => ({ id: nid(), header: h })),
      rows: rows.map(r => ({
        id: nid(),
        rowLabel: r.label,
        cells: r.cells.map(v => ({ id: nid(), value: v })),
      })),
    },
  };
}

function makeInfographicBlock(title: string, svgContent: string, altText: string, caption?: string): LexicalNode {
  return {
    type: "block",
    format: "",
    indent: 0,
    version: 1,
    children: [],
    fields: {
      id: nid(),
      blockName: "",
      blockType: "infographic",
      title,
      svgContent,
      altText,
      caption: caption ?? "",
    },
  };
}

// Insert node after the first node whose heading text includes needleText (case-insensitive)
function insertAfterHeading(children: LexicalNode[], needleText: string, newNode: LexicalNode): boolean {
  const needle = needleText.toLowerCase();
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.type === "heading") {
      const text = ((node.children as LexicalNode[] | undefined) ?? [])
        .filter(c => c.type === "text")
        .map(c => String(c.text ?? ""))
        .join("")
        .toLowerCase();
      if (text.includes(needle)) {
        // Insert after the heading (skip any immediately-following lists/paragraphs? No — insert right after heading)
        children.splice(i + 1, 0, newNode);
        return true;
      }
    }
  }
  return false;
}

// Replace the URL of the FIRST externalImage block found
function updateExternalImageBlock(
  children: LexicalNode[],
  url: string,
  alt: string,
  caption: string,
  credit: string
): boolean {
  for (const node of children) {
    if (node.type === "block" && (node.fields as Record<string, unknown>)?.blockType === "externalImage") {
      const fields = node.fields as Record<string, unknown>;
      fields.url = url;
      fields.alt = alt;
      fields.caption = caption;
      fields.credit = credit;
      return true;
    }
  }
  return false;
}

// ── SVG Templates ─────────────────────────────────────────────────────

const SVG_PRP_HOW_IT_WORKS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220" font-family="Inter,system-ui,sans-serif">
  <defs>
    <linearGradient id="prpBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0a2e"/>
      <stop offset="100%" style="stop-color:#2d1245"/>
    </linearGradient>
    <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#C5A130"/>
    </marker>
  </defs>
  <rect width="800" height="220" fill="url(#prpBg)" rx="14"/>
  <!-- Title -->
  <text x="400" y="28" text-anchor="middle" font-size="13" font-weight="700" fill="#C5A130" letter-spacing="1">HOW PRP OVARIAN REJUVENATION WORKS</text>
  <!-- Divider -->
  <line x1="60" y1="38" x2="740" y2="38" stroke="#7b5fa0" stroke-width="0.5"/>
  <!-- Step circles -->
  <circle cx="160" cy="110" r="44" fill="#CF3A6A" opacity="0.15"/>
  <circle cx="160" cy="110" r="36" fill="#CF3A6A"/>
  <text x="160" y="104" text-anchor="middle" font-size="11" font-weight="700" fill="white">STEP</text>
  <text x="160" y="122" text-anchor="middle" font-size="22" font-weight="800" fill="white">1</text>
  <circle cx="400" cy="110" r="44" fill="#C5A130" opacity="0.15"/>
  <circle cx="400" cy="110" r="36" fill="#C5A130"/>
  <text x="400" y="104" text-anchor="middle" font-size="11" font-weight="700" fill="white">STEP</text>
  <text x="400" y="122" text-anchor="middle" font-size="22" font-weight="800" fill="white">2</text>
  <circle cx="640" cy="110" r="44" fill="#3D1F56" opacity="0.3"/>
  <circle cx="640" cy="110" r="36" fill="#7b5fa0"/>
  <text x="640" y="104" text-anchor="middle" font-size="11" font-weight="700" fill="white">STEP</text>
  <text x="640" y="122" text-anchor="middle" font-size="22" font-weight="800" fill="white">3</text>
  <!-- Arrows -->
  <line x1="204" y1="110" x2="356" y2="110" stroke="#C5A130" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="444" y1="110" x2="596" y2="110" stroke="#C5A130" stroke-width="2" marker-end="url(#arrow)"/>
  <!-- Labels below -->
  <text x="160" y="168" text-anchor="middle" font-size="12" font-weight="600" fill="#e8d5f5">Blood Drawn</text>
  <text x="160" y="184" text-anchor="middle" font-size="11" fill="#9b8ab0">&amp; PRP Extracted</text>
  <text x="400" y="168" text-anchor="middle" font-size="12" font-weight="600" fill="#e8d5f5">Injected into Ovaries</text>
  <text x="400" y="184" text-anchor="middle" font-size="11" fill="#9b8ab0">under Ultrasound Guidance</text>
  <text x="640" y="168" text-anchor="middle" font-size="12" font-weight="600" fill="#e8d5f5">Growth Factors</text>
  <text x="640" y="184" text-anchor="middle" font-size="11" fill="#9b8ab0">Stimulate Regeneration</text>
  <!-- Footer -->
  <text x="400" y="210" text-anchor="middle" font-size="9" fill="#9b8ab0">Bavishi Fertility Institute · ivfclinic.com</text>
</svg>`;

const SVG_DIET_WEIGHT_GAIN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 230" font-family="Inter,system-ui,sans-serif">
  <defs>
    <linearGradient id="dietBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0a2e"/>
      <stop offset="100%" style="stop-color:#2d1245"/>
    </linearGradient>
  </defs>
  <rect width="800" height="230" fill="url(#dietBg)" rx="14"/>
  <text x="400" y="28" text-anchor="middle" font-size="13" font-weight="700" fill="#C5A130" letter-spacing="1">RECOMMENDED WEIGHT GAIN BY TRIMESTER</text>
  <line x1="60" y1="38" x2="740" y2="38" stroke="#7b5fa0" stroke-width="0.5"/>
  <!-- Bars (horizontal) -->
  <!-- T1 -->
  <rect x="100" y="60" width="90" height="42" rx="6" fill="#CF3A6A"/>
  <text x="145" y="76" text-anchor="middle" font-size="10" font-weight="600" fill="white">FIRST</text>
  <text x="145" y="90" text-anchor="middle" font-size="10" fill="white">TRIMESTER</text>
  <text x="145" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="#C5A130">1–2</text>
  <text x="145" y="140" text-anchor="middle" font-size="13" fill="#e8d5f5">kg</text>
  <text x="145" y="160" text-anchor="middle" font-size="10" fill="#9b8ab0">Week 1–12</text>
  <!-- T2 -->
  <rect x="340" y="60" width="120" height="42" rx="6" fill="#7b5fa0"/>
  <text x="400" y="76" text-anchor="middle" font-size="10" font-weight="600" fill="white">SECOND</text>
  <text x="400" y="90" text-anchor="middle" font-size="10" fill="white">TRIMESTER</text>
  <text x="400" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="#C5A130">4–5</text>
  <text x="400" y="140" text-anchor="middle" font-size="13" fill="#e8d5f5">kg</text>
  <text x="400" y="160" text-anchor="middle" font-size="10" fill="#9b8ab0">Week 13–27</text>
  <!-- T3 -->
  <rect x="600" y="52" width="140" height="50" rx="6" fill="#C5A130"/>
  <text x="670" y="70" text-anchor="middle" font-size="10" font-weight="600" fill="white">THIRD</text>
  <text x="670" y="84" text-anchor="middle" font-size="10" fill="white">TRIMESTER</text>
  <text x="670" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="#3D1F56">5–6</text>
  <text x="670" y="140" text-anchor="middle" font-size="13" fill="#3D1F56">kg</text>
  <text x="670" y="160" text-anchor="middle" font-size="10" fill="#9b8ab0">Week 28–Delivery</text>
  <!-- Connectors -->
  <line x1="190" y1="81" x2="340" y2="81" stroke="#C5A130" stroke-width="1.5" stroke-dasharray="4,3"/>
  <line x1="460" y1="81" x2="600" y2="81" stroke="#C5A130" stroke-width="1.5" stroke-dasharray="4,3"/>
  <!-- Total -->
  <rect x="250" y="185" width="300" height="32" rx="8" fill="#3D1F56" opacity="0.8"/>
  <text x="400" y="205" text-anchor="middle" font-size="12" fill="#C5A130" font-weight="600">Total healthy gain: 10–13 kg (varies by pre-pregnancy BMI)</text>
  <!-- Footer -->
  <text x="400" y="222" text-anchor="middle" font-size="9" fill="#9b8ab0">Bavishi Fertility Institute · ivfclinic.com</text>
</svg>`;

const SVG_HIGHRISK_MANAGEMENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 280" font-family="Inter,system-ui,sans-serif">
  <defs>
    <linearGradient id="hrBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0a2e"/>
      <stop offset="100%" style="stop-color:#2d1245"/>
    </linearGradient>
    <marker id="arrowHR" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#C5A130"/>
    </marker>
  </defs>
  <rect width="800" height="280" fill="url(#hrBg)" rx="14"/>
  <text x="400" y="26" text-anchor="middle" font-size="13" font-weight="700" fill="#C5A130" letter-spacing="1">HIGH-RISK PREGNANCY CARE — 4 PHASES</text>
  <line x1="60" y1="36" x2="740" y2="36" stroke="#7b5fa0" stroke-width="0.5"/>
  <!-- Phase boxes -->
  <!-- Phase 1 -->
  <rect x="30" y="55" width="160" height="160" rx="10" fill="#CF3A6A" opacity="0.12"/>
  <rect x="30" y="55" width="160" height="160" rx="10" fill="none" stroke="#CF3A6A" stroke-width="1.5"/>
  <circle cx="110" cy="80" r="18" fill="#CF3A6A"/>
  <text x="110" y="86" text-anchor="middle" font-size="14" font-weight="800" fill="white">1</text>
  <text x="110" y="107" text-anchor="middle" font-size="11" font-weight="700" fill="#e8d5f5">Preconception</text>
  <text x="110" y="121" text-anchor="middle" font-size="11" font-weight="700" fill="#e8d5f5">&amp; Early Care</text>
  <text x="110" y="143" text-anchor="middle" font-size="9.5" fill="#9b8ab0">Optimize blood sugar,</text>
  <text x="110" y="157" text-anchor="middle" font-size="9.5" fill="#9b8ab0">BP &amp; thyroid before</text>
  <text x="110" y="171" text-anchor="middle" font-size="9.5" fill="#9b8ab0">conception</text>
  <!-- Arrow 1→2 -->
  <line x1="192" y1="135" x2="218" y2="135" stroke="#C5A130" stroke-width="2" marker-end="url(#arrowHR)"/>
  <!-- Phase 2 -->
  <rect x="220" y="55" width="160" height="160" rx="10" fill="#7b5fa0" opacity="0.12"/>
  <rect x="220" y="55" width="160" height="160" rx="10" fill="none" stroke="#7b5fa0" stroke-width="1.5"/>
  <circle cx="300" cy="80" r="18" fill="#7b5fa0"/>
  <text x="300" y="86" text-anchor="middle" font-size="14" font-weight="800" fill="white">2</text>
  <text x="300" y="107" text-anchor="middle" font-size="11" font-weight="700" fill="#e8d5f5">Maternal</text>
  <text x="300" y="121" text-anchor="middle" font-size="11" font-weight="700" fill="#e8d5f5">Monitoring</text>
  <text x="300" y="143" text-anchor="middle" font-size="9.5" fill="#9b8ab0">BP, blood sugar &amp;</text>
  <text x="300" y="157" text-anchor="middle" font-size="9.5" fill="#9b8ab0">thyroid function tests;</text>
  <text x="300" y="171" text-anchor="middle" font-size="9.5" fill="#9b8ab0">weight &amp; urine checks</text>
  <!-- Arrow 2→3 -->
  <line x1="382" y1="135" x2="408" y2="135" stroke="#C5A130" stroke-width="2" marker-end="url(#arrowHR)"/>
  <!-- Phase 3 -->
  <rect x="410" y="55" width="160" height="160" rx="10" fill="#C5A130" opacity="0.12"/>
  <rect x="410" y="55" width="160" height="160" rx="10" fill="none" stroke="#C5A130" stroke-width="1.5"/>
  <circle cx="490" cy="80" r="18" fill="#C5A130"/>
  <text x="490" y="86" text-anchor="middle" font-size="14" font-weight="800" fill="white">3</text>
  <text x="490" y="107" text-anchor="middle" font-size="11" font-weight="700" fill="#e8d5f5">Fetal</text>
  <text x="490" y="121" text-anchor="middle" font-size="11" font-weight="700" fill="#e8d5f5">Monitoring</text>
  <text x="490" y="143" text-anchor="middle" font-size="9.5" fill="#9b8ab0">Growth ultrasounds,</text>
  <text x="490" y="157" text-anchor="middle" font-size="9.5" fill="#9b8ab0">Doppler studies &amp;</text>
  <text x="490" y="171" text-anchor="middle" font-size="9.5" fill="#9b8ab0">biophysical profiles</text>
  <!-- Arrow 3→4 -->
  <line x1="572" y1="135" x2="598" y2="135" stroke="#C5A130" stroke-width="2" marker-end="url(#arrowHR)"/>
  <!-- Phase 4 -->
  <rect x="600" y="55" width="160" height="160" rx="10" fill="#CF3A6A" opacity="0.12"/>
  <rect x="600" y="55" width="160" height="160" rx="10" fill="none" stroke="#CF3A6A" stroke-width="1.5"/>
  <circle cx="680" cy="80" r="18" fill="#CF3A6A"/>
  <text x="680" y="86" text-anchor="middle" font-size="14" font-weight="800" fill="white">4</text>
  <text x="680" y="107" text-anchor="middle" font-size="11" font-weight="700" fill="#e8d5f5">Delivery</text>
  <text x="680" y="121" text-anchor="middle" font-size="11" font-weight="700" fill="#e8d5f5">Planning</text>
  <text x="680" y="143" text-anchor="middle" font-size="9.5" fill="#9b8ab0">Timing by maternal &amp;</text>
  <text x="680" y="157" text-anchor="middle" font-size="9.5" fill="#9b8ab0">fetal health; planned</text>
  <text x="680" y="171" text-anchor="middle" font-size="9.5" fill="#9b8ab0">induction or C-section</text>
  <!-- Bottom note -->
  <rect x="150" y="238" width="500" height="28" rx="7" fill="#3D1F56" opacity="0.8"/>
  <text x="400" y="256" text-anchor="middle" font-size="11" fill="#C5A130" font-weight="600">With proper care, most women with high-risk conditions achieve healthy outcomes</text>
  <!-- Footer -->
  <text x="400" y="272" text-anchor="middle" font-size="9" fill="#9b8ab0">Bavishi Fertility Institute · ivfclinic.com</text>
</svg>`;

// ── Per-blog configuration ────────────────────────────────────────────
interface BlogConfig {
  photoQuery: string;
  photoAlt: string;
  photoCaption: string;
  thumbnailQuery: string;
  thumbnailAlt: string;
  extraBlocks?: Array<{
    afterHeading: string;  // heading text to insert after
    node: LexicalNode;
  }>;
  newComparisonTable?: {
    afterHeading: string;
    rowHeader: string;
    columns: string[];
    rows: { label: string; cells: string[] }[];
    altLabel?: string;
  };
}

const BLOG_CONFIGS: Record<string, BlogConfig> = {
  "prp-ovarian-rejuvenation-boosting-egg-quality-and-fertility": {
    photoQuery: "centrifuge separating blood plasma laboratory",
    photoAlt: "Centrifuge machine separating blood plasma — the first step in PRP preparation for ovarian rejuvenation",
    photoCaption: "PRP therapy uses the patient's own blood: after centrifugation, the golden plasma layer is extracted and prepared for injection.",
    thumbnailQuery: "blood plasma vial golden laboratory",
    thumbnailAlt: "PRP ovarian rejuvenation treatment at Bavishi Fertility Institute",
    extraBlocks: [
      {
        afterHeading: "how does prp ovarian rejuvenation work",
        node: makeInfographicBlock(
          "How PRP Ovarian Rejuvenation Works — 3 Steps",
          SVG_PRP_HOW_IT_WORKS,
          "Three-step process diagram: Step 1 — Blood drawn and PRP extracted; Step 2 — PRP injected into ovaries under ultrasound guidance; Step 3 — Growth factors stimulate ovarian regeneration and egg quality improvement.",
          "Source: Bavishi Fertility Institute clinical protocol"
        ),
      },
    ],
    newComparisonTable: {
      afterHeading: "success stories",
      rowHeader: "Patient",
      columns: ["Condition", "Protocol", "Outcome"],
      rows: [
        { label: "38-year-old", cells: ["Diminished ovarian reserve", "PRP therapy + IVF", "Achieved pregnancy with own eggs"] },
        { label: "42-year-old", cells: ["Poor egg quality", "PRP treatment + IVF", "Successful pregnancy with own eggs"] },
        { label: "35-year-old", cells: ["PCOS", "PRP therapy + ICSI", "Achieved pregnancy"] },
      ],
      altLabel: "success-stories-table",
    },
  },

  "ivf-for-women-with-thyroid-disorders-what-patients-should-know": {
    photoQuery: "thyroid function blood test vials laboratory diagnostic",
    photoAlt: "Blood test vials for thyroid function screening — TSH monitoring is central to IVF success for thyroid disorder patients",
    photoCaption: "Thyroid function testing (TSH level monitoring) is required before and throughout every IVF cycle for women with thyroid disorders.",
    thumbnailQuery: "thyroid blood test medical laboratory",
    thumbnailAlt: "IVF treatment for women with thyroid disorders at Bavishi Fertility Institute",
  },

  "complete-pregnancy-diet-chart-by-trimester-what-to-eat-in-the-first-second-third-trimester": {
    photoQuery: "Indian poha breakfast bowl traditional morning",
    photoAlt: "A bowl of vegetable poha — one of the recommended first-trimester breakfast options in the Indian pregnancy diet plan",
    photoCaption: "Vegetable poha: a light, iron-rich breakfast recommended during the first trimester — easy to digest and quick to prepare.",
    thumbnailQuery: "Indian thali plate balanced meal nutrition",
    thumbnailAlt: "Complete pregnancy diet chart by trimester at Bavishi Fertility Institute",
    extraBlocks: [
      {
        afterHeading: "weight gain guidelines by trimester",
        node: makeInfographicBlock(
          "Recommended Weight Gain by Trimester",
          SVG_DIET_WEIGHT_GAIN,
          "Three-stage infographic showing recommended pregnancy weight gain: First trimester 1–2 kg (Week 1–12), Second trimester 4–5 kg (Week 13–27), Third trimester 5–6 kg (Week 28–Delivery). Total healthy gain: 10–13 kg, varies by pre-pregnancy BMI.",
          "Weight ranges vary based on pre-pregnancy BMI — consult your doctor for personalised targets."
        ),
      },
    ],
  },

  "the-emotional-rollercoaster-of-ivf-why-mental-health-support-is-essential": {
    photoQuery: "yoga meditation candles calm mindfulness room",
    photoAlt: "Yoga mat and candles in a calm room — representing the mindfulness and relaxation support offered during IVF treatment",
    photoCaption: "Mindfulness techniques including yoga and meditation are part of BFI's mental health support programme for IVF patients.",
    thumbnailQuery: "journaling notebook pen morning light calm",
    thumbnailAlt: "Mental health support during IVF treatment at Bavishi Fertility Institute",
  },

  "high-risk-pregnancy-due-to-diabetes-bp-thyroid-disorders": {
    photoQuery: "blood pressure cuff monitor automatic wrist clinical",
    photoAlt: "Automatic blood pressure monitor — regular BP monitoring is a key part of managing hypertension during high-risk pregnancy",
    photoCaption: "Blood pressure is checked frequently throughout a high-risk pregnancy — one of 12–15 monitoring visits recommended.",
    thumbnailQuery: "blood pressure glucometer thyroid medical instruments clinical",
    thumbnailAlt: "High-risk pregnancy care for diabetes, BP and thyroid disorders at Bavishi Fertility Institute",
    extraBlocks: [
      {
        afterHeading: "how high-risk pregnancies are managed",
        node: makeInfographicBlock(
          "High-Risk Pregnancy Care — 4 Management Phases",
          SVG_HIGHRISK_MANAGEMENT,
          "Four-phase management process for high-risk pregnancies: Phase 1 — Preconception and Early Care (optimize blood sugar, BP, thyroid); Phase 2 — Maternal Monitoring (BP, blood sugar, thyroid function, weight, urine); Phase 3 — Advanced Fetal Monitoring (growth ultrasounds, Doppler studies, biophysical profiles); Phase 4 — Delivery Planning (timing by maternal and fetal health, planned induction or C-section).",
          "Source: Bavishi Fertility Institute high-risk pregnancy care protocol"
        ),
      },
    ],
  },
};

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  const cfg = BLOG_CONFIGS[slug];
  if (!cfg) {
    console.error(`No config found for slug: ${slug}`);
    console.error("Available:", Object.keys(BLOG_CONFIGS).join("\n  "));
    process.exit(1);
  }

  console.log(`\n▶ Enriching blog: ${slug}`);

  // 1. Fetch current contentRaw from Sanity
  const doc = await sanity.fetch<{ _id: string; contentRaw: string; heroImageUrl?: string }>(
    `*[_type=="blog"&&slug=="${slug}"][0]{_id,contentRaw,heroImageUrl}`
  );
  if (!doc?._id) throw new Error(`Blog not found in Sanity: ${slug}`);
  console.log(`  Found Sanity doc: ${doc._id}`);

  const editorState: EditorState = JSON.parse(doc.contentRaw);
  const children = editorState.root.children;

  // 2. Source + rehost the per-blog photo
  console.log(`\n📷 Searching Pexels: "${cfg.photoQuery}"`);
  const photo = await pexelsSearch(cfg.photoQuery);
  if (!photo) throw new Error("Pexels returned no results for: " + cfg.photoQuery);
  console.log(`  Selected photo by ${photo.photographer}: ${photo.url.slice(0, 70)}`);
  const photoCdnUrl = await uploadToCdn(photo.url, `blog-${slug}-photo.jpg`);
  console.log(`  ✓ Hosted at: ${photoCdnUrl}`);

  // 3. Update existing externalImage block
  const updatedExt = updateExternalImageBlock(
    children,
    photoCdnUrl,
    cfg.photoAlt,
    cfg.photoCaption,
    `Photo: Pexels / ${photo.photographer} (${photo.pageUrl})`
  );
  console.log(updatedExt ? "  ✓ Updated existing externalImage block" : "  ⚠ No existing externalImage block found — inserting new one");
  if (!updatedExt) {
    // No existing externalImage — append one before the first H2
    const firstH2 = children.findIndex(n => n.type === "heading" && (n as Record<string,unknown>).tag === "h2");
    if (firstH2 >= 0) {
      children.splice(firstH2 + 1, 0, makeExternalImageBlock(photoCdnUrl, cfg.photoAlt, cfg.photoCaption, `Photo: Pexels / ${photo.photographer}`));
    }
  }

  // 4. Insert any extra blocks (process-flow infographics etc.)
  if (cfg.extraBlocks) {
    for (const extra of cfg.extraBlocks) {
      // Check if we already inserted this block type+title to avoid duplicates
      const alreadyExists = children.some(n => {
        if (n.type !== "block") return false;
        const f = n.fields as Record<string, unknown>;
        return f.blockType === (extra.node.fields as Record<string,unknown>).blockType
          && f.title === (extra.node.fields as Record<string,unknown>).title;
      });
      if (alreadyExists) {
        console.log(`  ⚠ Block "${(extra.node.fields as Record<string,unknown>).title}" already exists — skipping`);
        continue;
      }
      const inserted = insertAfterHeading(children, extra.afterHeading, extra.node);
      console.log(inserted
        ? `  ✓ Inserted "${(extra.node.fields as Record<string,unknown>).title}" after heading "${extra.afterHeading}"`
        : `  ⚠ Could not find heading "${extra.afterHeading}" — block not inserted`);
    }
  }

  // 5. Insert new comparison table if specified (blog 1 success stories)
  if (cfg.newComparisonTable) {
    const ct = cfg.newComparisonTable;
    const label = ct.altLabel ?? "plan-comparison-table";
    const alreadyExists = children.some(n => {
      if (n.type !== "block") return false;
      const f = n.fields as Record<string, unknown>;
      // Check if there's already a comparisonTable with same rowHeader and 3 rows
      return f.blockType === "comparisonTable" && f.rowHeader === ct.rowHeader;
    });
    if (alreadyExists) {
      console.log(`  ⚠ Comparison table (rowHeader="${ct.rowHeader}") already exists — skipping`);
    } else {
      const tableNode = makeComparisonTableBlock(ct.rowHeader, ct.columns, ct.rows);
      const inserted = insertAfterHeading(children, ct.afterHeading, tableNode);
      console.log(inserted
        ? `  ✓ Inserted ${label} after heading "${ct.afterHeading}"`
        : `  ⚠ Could not find heading "${ct.afterHeading}" for ${label}`);
    }
  }

  // 6. Source + rehost thumbnail photo
  console.log(`\n🖼  Sourcing thumbnail: "${cfg.thumbnailQuery}"`);
  const thumb = await pexelsSearch(cfg.thumbnailQuery);
  let thumbUrl = doc.heroImageUrl ?? null;
  if (thumb) {
    const thumbCdnUrl = await uploadToCdn(thumb.url, `blog-${slug}-thumb.jpg`);
    thumbUrl = thumbCdnUrl;
    console.log(`  ✓ Thumbnail at: ${thumbCdnUrl}`);
  } else {
    console.log("  ⚠ No Pexels result for thumbnail query — keeping existing heroImageUrl");
  }

  // 7. Patch Sanity
  const newContentRaw = JSON.stringify(editorState);
  const patch = sanity.patch(doc._id)
    .set({ contentRaw: newContentRaw })
    .setIfMissing({ heroImageAlt: cfg.thumbnailAlt });
  if (thumbUrl) patch.set({ heroImageUrl: thumbUrl });

  await patch.commit();
  console.log(`\n✅ Patched Sanity doc ${doc._id} successfully`);
  console.log(`   contentRaw: ${newContentRaw.length} bytes`);
  if (thumbUrl) console.log(`   heroImageUrl: ${thumbUrl}`);
  console.log("\nNext: npm run build — verify it passes before running the next blog.\n");
}

main().catch(e => { console.error("❌", e); process.exit(1); });
