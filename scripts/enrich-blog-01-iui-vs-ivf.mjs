#!/usr/bin/env node
/* =====================================================================
 * Blog enrichment — Post #1: IUI vs IVF
 * ---------------------------------------------------------------------
 * Full content rewrite targeting:
 *   - AEO / AIO answer-first structure (AI Overview / featured snippet)
 *   - EEAT + YMYL: author credentials, medical reviewer, cited stats
 *   - Local SEO: Ahmedabad, Gujarat, Bavishi clinic mentions
 *   - BOFU + MOFU + Educational intent in one article
 *   - 3 SVG infographics, comparison table, decision lists, stat strip
 *   - Topic-specific HighlightCard (not the generic clinic card)
 *   - 8 FAQs from People Also Ask + LLM query research
 *   - Internal links to /treatments/iui, /treatments/ivf, /treatments/pcos etc.
 *   - 2 mid-article CTAs via InlineCtaBlock
 *
 * Run: node scripts/enrich-blog-01-iui-vs-ivf.mjs
 * Review result at: http://localhost:3000/blog/iui-vs-ivf-which-fertility-treatment-is-right-for-you
 * ===================================================================== */

const BASE    = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL   = process.env.SEED_ADMIN_EMAIL    ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";
const SLUG = "iui-vs-ivf-which-fertility-treatment-is-right-for-you";

const uid = () => Math.random().toString(36).slice(2, 10);

/* ── Lexical node helpers ─────────────────────────────────────────── */
const txt   = (t, format = 0) => ({ type: "text", text: t, version: 1, detail: 0, format, mode: "normal", style: "" });
const bold  = (t) => txt(t, 1);
const italic = (t) => txt(t, 2);

const para  = (...children) => ({
  type: "paragraph", version: 1, format: "", indent: 0, direction: "ltr", textFormat: 0, textStyle: "",
  children: children.flat(),
});
const h2    = (t) => ({ type: "heading", tag: "h2", version: 1, format: "", indent: 0, direction: "ltr", children: [txt(t)] });
const h3    = (t) => ({ type: "heading", tag: "h3", version: 1, format: "", indent: 0, direction: "ltr", children: [txt(t)] });
const tip   = (t) => ({ type: "quote",     version: 1, format: "", indent: 0, direction: "ltr", children: [txt(t)] });

const link  = (text, url) => ({
  type: "link", version: 1, format: "", indent: 0, direction: "ltr",
  fields: { linkType: "custom", url, newTab: false },
  children: [txt(text)],
});

const li    = (t) => ({ type: "listitem", version: 1, format: "", indent: 0, direction: "ltr", value: 1, children: [txt(t)] });
const ul    = (...items) => ({ type: "list", version: 1, tag: "ul", listType: "bullet", format: "", indent: 0, direction: "ltr", start: 1, children: items.map(li) });
const ol    = (...items) => ({ type: "list", version: 1, tag: "ol", listType: "number", format: "", indent: 0, direction: "ltr", start: 1, children: items.map((t,i) => ({...li(t), value: i+1})) });

/* ── Block helpers ────────────────────────────────────────────────── */
const statStrip = (items) => ({
  type: "block", version: 2,
  fields: {
    id: uid(), blockType: "statStrip", blockName: "",
    items: items.map(({value, label}) => ({ id: uid(), value, label })),
  },
});

const comparisonTable = (rowHeader, columns, rows) => ({
  type: "block", version: 2,
  fields: {
    id: uid(), blockType: "comparisonTable", blockName: "",
    rowHeader,
    columns: columns.map(header => ({ id: uid(), header })),
    rows: rows.map(({label, cells}) => ({
      id: uid(), rowLabel: label,
      cells: cells.map(value => ({ id: uid(), value })),
    })),
  },
});

const highlightCard = ({badge, tagline, icon, color, facts, bestSuitedFor}) => ({
  type: "block", version: 2,
  fields: {
    id: uid(), blockType: "highlightCard", blockName: "",
    badge, tagline, icon, color,
    facts: (facts ?? []).map(({label, value}) => ({ id: uid(), label, value })),
    bestSuitedFor,
  },
});

const decisionList = ({heading, intro, items, note}) => ({
  type: "block", version: 2,
  fields: {
    id: uid(), blockType: "decisionList", blockName: "",
    heading, intro, note: note ?? null,
    items: items.map(({icon, situation, recommendation}) => ({ id: uid(), icon: icon ?? null, situation, recommendation })),
  },
});

const conclusionPanel = ({headline, points}) => ({
  type: "block", version: 2,
  fields: {
    id: uid(), blockType: "conclusionPanel", blockName: "",
    headline,
    points: points.map(({icon, text}) => ({ id: uid(), icon: icon ?? null, text })),
  },
});

const infographic = ({title, svgContent, altText, caption}) => ({
  type: "block", version: 2,
  fields: {
    id: uid(), blockType: "infographic", blockName: "",
    title: title ?? null, svgContent, altText, caption: caption ?? null,
  },
});

const inlineCta = ({headline, subtext, buttons, accent}) => ({
  type: "block", version: 2,
  fields: {
    id: uid(), blockType: "inlineCta", blockName: "",
    headline, subtext: subtext ?? null, accent: accent ?? "rose",
    buttons: buttons.map(({label, url, variant}) => ({ id: uid(), label, url, variant: variant ?? "primary" })),
  },
});

const externalImage = ({url, alt, caption, credit}) => ({
  type: "block", version: 2,
  fields: { id: uid(), blockType: "externalImage", blockName: "", url, alt, caption: caption ?? null, credit: credit ?? null },
});

/* ══════════════════════════════════════════════════════════════════
 * SVG INFOGRAPHICS
 * ══════════════════════════════════════════════════════════════════ */

/* --- Hero Banner: IUI vs IVF Split Illustration -------------------- */
const SVG_HERO_BANNER = `<svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" style="font-family:system-ui,-apple-system,sans-serif;width:100%;max-width:800px;">
  <!-- Background -->
  <defs>
    <linearGradient id="bgL" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3D1F56"/>
      <stop offset="100%" stop-color="#5A2878"/>
    </linearGradient>
    <linearGradient id="bgR" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#CF3A6A"/>
      <stop offset="100%" stop-color="#9B2A5E"/>
    </linearGradient>
  </defs>

  <!-- Left panel: IUI -->
  <rect x="0" y="0" width="390" height="280" rx="16" fill="url(#bgL)"/>
  <!-- Decorative blobs -->
  <circle cx="30" cy="30" r="60" fill="white" opacity="0.05"/>
  <circle cx="360" cy="260" r="80" fill="white" opacity="0.04"/>

  <!-- IUI Label -->
  <rect x="24" y="24" width="80" height="24" rx="12" fill="white" opacity="0.2"/>
  <text x="64" y="40" text-anchor="middle" fill="white" font-size="11" font-weight="700" letter-spacing="1">IUI</text>

  <!-- IUI Icon: uterus outline with arrow (stylised) -->
  <!-- Body of uterus -->
  <ellipse cx="180" cy="130" rx="45" ry="38" fill="none" stroke="white" stroke-width="3" opacity="0.9"/>
  <!-- Tubes -->
  <path d="M135 120 Q100 100 85 90 Q78 82 82 74" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.8"/>
  <path d="M225 120 Q260 100 275 90 Q282 82 278 74" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.8"/>
  <!-- Ovaries -->
  <ellipse cx="76" cy="70" rx="12" ry="9" fill="none" stroke="#C5A130" stroke-width="2"/>
  <ellipse cx="284" cy="70" rx="12" ry="9" fill="none" stroke="#C5A130" stroke-width="2"/>
  <!-- Cervix -->
  <rect x="170" y="168" width="20" height="30" rx="10" fill="none" stroke="white" stroke-width="2.5" opacity="0.8"/>
  <!-- Arrow going IN (IUI) -->
  <line x1="180" y1="240" x2="180" y2="205" stroke="#C5A130" stroke-width="3" stroke-linecap="round"/>
  <polygon points="173,210 180,196 187,210" fill="#C5A130"/>
  <text x="180" y="258" text-anchor="middle" fill="#C5A130" font-size="9" font-weight="600" letter-spacing="0.5">SPERM PLACED IN UTERUS</text>

  <!-- IUI description -->
  <text x="180" y="48" text-anchor="middle" fill="white" font-size="13" font-weight="700">Intrauterine Insemination</text>
  <text x="180" y="65" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="10">Fertilisation happens naturally inside</text>

  <!-- Stats -->
  <text x="56" y="195" text-anchor="middle" fill="white" font-size="15" font-weight="700">10–20%</text>
  <text x="56" y="208" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="8.5">success/cycle</text>
  <text x="310" y="195" text-anchor="middle" fill="white" font-size="15" font-weight="700">1–2 wks</text>
  <text x="310" y="208" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="8.5">duration</text>

  <!-- Divider -->
  <line x1="395" y1="20" x2="395" y2="260" stroke="white" stroke-width="1" opacity="0.2" stroke-dasharray="6,4"/>
  <text x="395" y="148" text-anchor="middle" fill="white" font-size="11" font-weight="800" opacity="0.35">VS</text>

  <!-- Right panel: IVF -->
  <rect x="410" y="0" width="390" height="280" rx="16" fill="url(#bgR)"/>
  <circle cx="790" cy="30" r="60" fill="white" opacity="0.05"/>
  <circle cx="430" cy="270" r="80" fill="white" opacity="0.04"/>

  <!-- IVF Label -->
  <rect x="696" y="24" width="80" height="24" rx="12" fill="white" opacity="0.2"/>
  <text x="736" y="40" text-anchor="middle" fill="white" font-size="11" font-weight="700" letter-spacing="1">IVF</text>

  <!-- IVF Icon: petri dish + egg + sperm -->
  <!-- Petri dish -->
  <ellipse cx="600" cy="155" rx="55" ry="35" fill="none" stroke="white" stroke-width="3" opacity="0.9"/>
  <ellipse cx="600" cy="155" rx="40" ry="22" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
  <!-- Egg inside dish -->
  <circle cx="600" cy="152" r="14" fill="#C5A130" opacity="0.9"/>
  <circle cx="600" cy="152" r="8" fill="white" opacity="0.6"/>
  <!-- Sperm approaching -->
  <path d="M560 148 Q572 145 580 150" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>
  <circle cx="558" cy="148" r="3" fill="white" opacity="0.8"/>
  <path d="M632 148 Q620 145 612 150" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>
  <circle cx="634" cy="148" r="3" fill="white" opacity="0.8"/>
  <path d="M600 118 Q597 130 600 138" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>
  <circle cx="600" cy="116" r="3" fill="white" opacity="0.8"/>

  <!-- LAB label -->
  <text x="600" y="205" text-anchor="middle" fill="#C5A130" font-size="9" font-weight="600" letter-spacing="1">FERTILISED IN LABORATORY</text>

  <!-- Arrow going OUT (transfer) -->
  <line x1="600" y1="220" x2="600" y2="240" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <polygon points="594,236 600,248 606,236" fill="white" opacity="0.5"/>
  <text x="600" y="262" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-size="8.5">then transferred to uterus</text>

  <!-- IVF description -->
  <text x="600" y="48" text-anchor="middle" fill="white" font-size="13" font-weight="700">In Vitro Fertilisation</text>
  <text x="600" y="65" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="10">Eggs retrieved, fertilised outside the body</text>

  <!-- Stats -->
  <text x="470" y="120" text-anchor="middle" fill="white" font-size="15" font-weight="700">40–60%</text>
  <text x="470" y="133" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="8.5">success/cycle</text>
  <text x="730" y="120" text-anchor="middle" fill="white" font-size="15" font-weight="700">2–3 wks</text>
  <text x="730" y="133" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-size="8.5">duration</text>
</svg>`;

/* --- IUI 3-Step Process Diagram ------------------------------------ */
const SVG_IUI_PROCESS = `<svg viewBox="0 0 720 190" xmlns="http://www.w3.org/2000/svg" style="font-family:system-ui,-apple-system,sans-serif;width:100%;max-width:720px;">
  <!-- Background -->
  <rect width="720" height="190" rx="16" fill="#f9f7fc"/>

  <!-- Step 1: Ovulation Monitoring -->
  <circle cx="130" cy="82" r="56" fill="#3D1F56"/>
  <text x="130" y="72" text-anchor="middle" fill="#C5A130" font-size="9" font-weight="700" letter-spacing="1">STEP 1</text>
  <text x="130" y="88" text-anchor="middle" fill="white" font-size="11" font-weight="600">Ovulation</text>
  <text x="130" y="103" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="10">Monitoring</text>
  <!-- step label -->
  <text x="130" y="158" text-anchor="middle" fill="#3D1F56" font-size="9" opacity="0.65">Hormone tests &amp; ultrasound</text>

  <!-- Arrow 1→2 -->
  <line x1="190" y1="82" x2="248" y2="82" stroke="#CF3A6A" stroke-width="2.5" stroke-dasharray="5,3"/>
  <polygon points="248,77 260,82 248,87" fill="#CF3A6A"/>

  <!-- Step 2: Sperm Preparation -->
  <circle cx="320" cy="82" r="56" fill="#CF3A6A"/>
  <text x="320" y="72" text-anchor="middle" fill="white" font-size="9" font-weight="700" letter-spacing="1" opacity="0.75">STEP 2</text>
  <text x="320" y="88" text-anchor="middle" fill="white" font-size="11" font-weight="600">Sperm</text>
  <text x="320" y="103" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="10">Preparation</text>
  <text x="320" y="158" text-anchor="middle" fill="#3D1F56" font-size="9" opacity="0.65">Washed &amp; concentrated sample</text>

  <!-- Arrow 2→3 -->
  <line x1="380" y1="82" x2="438" y2="82" stroke="#CF3A6A" stroke-width="2.5" stroke-dasharray="5,3"/>
  <polygon points="438,77 450,82 438,87" fill="#CF3A6A"/>

  <!-- Step 3: Insemination -->
  <circle cx="520" cy="82" r="56" fill="#C5A130"/>
  <text x="520" y="72" text-anchor="middle" fill="#3D1F56" font-size="9" font-weight="700" letter-spacing="1">STEP 3</text>
  <text x="520" y="88" text-anchor="middle" fill="#3D1F56" font-size="11" font-weight="600">Insemination</text>
  <text x="520" y="103" text-anchor="middle" fill="rgba(61,31,86,0.75)" font-size="10">Into uterus</text>
  <text x="520" y="158" text-anchor="middle" fill="#3D1F56" font-size="9" opacity="0.65">Painless, 5-min procedure</text>

  <!-- Duration badge -->
  <rect x="590" y="64" width="115" height="36" rx="18" fill="#3D1F56" opacity="0.08"/>
  <text x="647" y="79" text-anchor="middle" fill="#3D1F56" font-size="9" font-weight="700" opacity="0.7">TOTAL DURATION</text>
  <text x="647" y="93" text-anchor="middle" fill="#3D1F56" font-size="10" font-weight="600">1–2 weeks</text>

  <!-- Bottom note -->
  <text x="360" y="178" text-anchor="middle" fill="#3D1F56" font-size="9" opacity="0.5">Outpatient procedure · No anaesthesia · No hospital stay</text>
</svg>`;

/* --- IVF 5-Step Process Diagram ------------------------------------ */
const SVG_IVF_PROCESS = `<svg viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" style="font-family:system-ui,-apple-system,sans-serif;width:100%;max-width:760px;">
  <rect width="760" height="210" rx="16" fill="#f9f7fc"/>

  <!-- Step nodes (5 nodes, spacing ~138px) -->
  <!-- Step 1 -->
  <circle cx="72" cy="88" r="50" fill="#3D1F56"/>
  <text x="72" y="79" text-anchor="middle" fill="#C5A130" font-size="8" font-weight="700" letter-spacing="1">STEP 1</text>
  <text x="72" y="93" text-anchor="middle" fill="white" font-size="10" font-weight="600">Ovarian</text>
  <text x="72" y="106" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="9">Stimulation</text>
  <text x="72" y="155" text-anchor="middle" fill="#3D1F56" font-size="8" opacity="0.6">8–14 days</text>

  <line x1="124" y1="88" x2="158" y2="88" stroke="#CF3A6A" stroke-width="2" stroke-dasharray="4,3"/>
  <polygon points="158,84 167,88 158,92" fill="#CF3A6A"/>

  <!-- Step 2 -->
  <circle cx="210" cy="88" r="50" fill="#5A2878"/>
  <text x="210" y="79" text-anchor="middle" fill="#C5A130" font-size="8" font-weight="700" letter-spacing="1">STEP 2</text>
  <text x="210" y="93" text-anchor="middle" fill="white" font-size="10" font-weight="600">Egg</text>
  <text x="210" y="106" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="9">Retrieval</text>
  <text x="210" y="155" text-anchor="middle" fill="#3D1F56" font-size="8" opacity="0.6">Day 1 procedure</text>

  <line x1="262" y1="88" x2="296" y2="88" stroke="#CF3A6A" stroke-width="2" stroke-dasharray="4,3"/>
  <polygon points="296,84 305,88 296,92" fill="#CF3A6A"/>

  <!-- Step 3 -->
  <circle cx="348" cy="88" r="50" fill="#9B2A5E"/>
  <text x="348" y="79" text-anchor="middle" fill="white" font-size="8" font-weight="700" letter-spacing="1" opacity="0.8">STEP 3</text>
  <text x="348" y="93" text-anchor="middle" fill="white" font-size="10" font-weight="600">Fertilisation</text>
  <text x="348" y="106" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="9">In lab</text>
  <text x="348" y="155" text-anchor="middle" fill="#3D1F56" font-size="8" opacity="0.6">IVF or ICSI</text>

  <line x1="400" y1="88" x2="434" y2="88" stroke="#CF3A6A" stroke-width="2" stroke-dasharray="4,3"/>
  <polygon points="434,84 443,88 434,92" fill="#CF3A6A"/>

  <!-- Step 4 -->
  <circle cx="486" cy="88" r="50" fill="#CF3A6A"/>
  <text x="486" y="79" text-anchor="middle" fill="white" font-size="8" font-weight="700" letter-spacing="1" opacity="0.8">STEP 4</text>
  <text x="486" y="93" text-anchor="middle" fill="white" font-size="10" font-weight="600">Embryo</text>
  <text x="486" y="106" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="9">Culture</text>
  <text x="486" y="155" text-anchor="middle" fill="#3D1F56" font-size="8" opacity="0.6">3–5 days</text>

  <line x1="538" y1="88" x2="572" y2="88" stroke="#CF3A6A" stroke-width="2" stroke-dasharray="4,3"/>
  <polygon points="572,84 581,88 572,92" fill="#CF3A6A"/>

  <!-- Step 5 -->
  <circle cx="624" cy="88" r="50" fill="#C5A130"/>
  <text x="624" y="79" text-anchor="middle" fill="#3D1F56" font-size="8" font-weight="700" letter-spacing="1">STEP 5</text>
  <text x="624" y="93" text-anchor="middle" fill="#3D1F56" font-size="10" font-weight="600">Embryo</text>
  <text x="624" y="106" text-anchor="middle" fill="rgba(61,31,86,0.75)" font-size="9">Transfer</text>
  <text x="624" y="155" text-anchor="middle" fill="#3D1F56" font-size="8" opacity="0.6">Day 3 or Day 5</text>

  <!-- Duration -->
  <text x="380" y="188" text-anchor="middle" fill="#3D1F56" font-size="9" opacity="0.5">Total IVF cycle: 2–3 weeks · Pregnancy test: 2 weeks after transfer</text>
  <text x="380" y="200" text-anchor="middle" fill="#3D1F56" font-size="9" opacity="0.45">Available at all 14 Bavishi Fertility Institute centres across India</text>
</svg>`;

/* --- IUI vs IVF Success Rate Bar Chart ----------------------------- */
const SVG_SUCCESS_RATES = `<svg viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg" style="font-family:system-ui,-apple-system,sans-serif;width:100%;max-width:680px;">
  <rect width="680" height="320" rx="16" fill="#f9f7fc"/>

  <!-- Title -->
  <text x="340" y="30" text-anchor="middle" fill="#3D1F56" font-size="13" font-weight="700">Success Rate Per Cycle: IUI vs IVF by Age Group</text>
  <text x="340" y="46" text-anchor="middle" fill="#3D1F56" font-size="10" opacity="0.55">Clinical data ranges — individual results vary; based on published ART registry data</text>

  <!-- Legend -->
  <rect x="200" y="58" width="12" height="12" rx="3" fill="#3D1F56"/>
  <text x="218" y="69" fill="#3D1F56" font-size="10" font-weight="600">IUI</text>
  <rect x="270" y="58" width="12" height="12" rx="3" fill="#CF3A6A"/>
  <text x="288" y="69" fill="#3D1F56" font-size="10" font-weight="600">IVF</text>

  <!-- Y-axis labels -->
  <text x="50" y="91" text-anchor="end" fill="#3D1F56" font-size="9" opacity="0.6">60%</text>
  <text x="50" y="128" text-anchor="end" fill="#3D1F56" font-size="9" opacity="0.6">45%</text>
  <text x="50" y="165" text-anchor="end" fill="#3D1F56" font-size="9" opacity="0.6">30%</text>
  <text x="50" y="202" text-anchor="end" fill="#3D1F56" font-size="9" opacity="0.6">15%</text>
  <text x="50" y="239" text-anchor="end" fill="#3D1F56" font-size="9" opacity="0.6">0%</text>

  <!-- Gridlines -->
  <line x1="55" y1="88" x2="645" y2="88" stroke="#3D1F56" stroke-width="0.5" opacity="0.1"/>
  <line x1="55" y1="125" x2="645" y2="125" stroke="#3D1F56" stroke-width="0.5" opacity="0.1"/>
  <line x1="55" y1="162" x2="645" y2="162" stroke="#3D1F56" stroke-width="0.5" opacity="0.1"/>
  <line x1="55" y1="199" x2="645" y2="199" stroke="#3D1F56" stroke-width="0.5" opacity="0.1"/>
  <line x1="55" y1="236" x2="645" y2="236" stroke="#3D1F56" stroke-width="1" opacity="0.15"/>

  <!-- X-axis: age groups (5 groups, starting ~90px, spacing ~112px) -->
  <!--
    Chart area: x from 55 to 645 (590px). 5 groups → 118px each.
    Each group has 2 bars (width 28px each) + 8px gap + 54px padding.
    Bar height scale: 60% = 148px (from y=236 up), so 1% = 2.47px
    IUI bar: plum, IVF bar: rose

    Groups: <30, 30–34, 35–37, 38–40, 41+
    Data:   IUI: 20%, 15%, 10%, 7%, 4%
            IVF: 52%, 45%, 37%, 25%, 13%
  -->

  <!-- Group 1: Under 30 -->
  <!-- IUI 20% = 49px -->
  <rect x="78" y="187" width="28" height="49" rx="4" fill="#3D1F56" opacity="0.85"/>
  <text x="92" y="183" text-anchor="middle" fill="#3D1F56" font-size="8.5" font-weight="600">20%</text>
  <!-- IVF 52% = 129px -->
  <rect x="112" y="107" width="28" height="129" rx="4" fill="#CF3A6A"/>
  <text x="126" y="103" text-anchor="middle" fill="#CF3A6A" font-size="8.5" font-weight="600">52%</text>
  <text x="113" y="252" text-anchor="middle" fill="#3D1F56" font-size="9" opacity="0.7">Under 30</text>

  <!-- Group 2: 30–34 -->
  <!-- IUI 15% = 37px -->
  <rect x="196" y="199" width="28" height="37" rx="4" fill="#3D1F56" opacity="0.85"/>
  <text x="210" y="195" text-anchor="middle" fill="#3D1F56" font-size="8.5" font-weight="600">15%</text>
  <!-- IVF 45% = 111px -->
  <rect x="230" y="125" width="28" height="111" rx="4" fill="#CF3A6A"/>
  <text x="244" y="121" text-anchor="middle" fill="#CF3A6A" font-size="8.5" font-weight="600">45%</text>
  <text x="231" y="252" text-anchor="middle" fill="#3D1F56" font-size="9" opacity="0.7">30–34</text>

  <!-- Group 3: 35–37 -->
  <!-- IUI 10% = 25px -->
  <rect x="314" y="211" width="28" height="25" rx="4" fill="#3D1F56" opacity="0.85"/>
  <text x="328" y="207" text-anchor="middle" fill="#3D1F56" font-size="8.5" font-weight="600">10%</text>
  <!-- IVF 37% = 91px -->
  <rect x="348" y="145" width="28" height="91" rx="4" fill="#CF3A6A"/>
  <text x="362" y="141" text-anchor="middle" fill="#CF3A6A" font-size="8.5" font-weight="600">37%</text>
  <text x="349" y="252" text-anchor="middle" fill="#3D1F56" font-size="9" opacity="0.7">35–37</text>

  <!-- Group 4: 38–40 -->
  <!-- IUI 7% = 17px -->
  <rect x="432" y="219" width="28" height="17" rx="4" fill="#3D1F56" opacity="0.85"/>
  <text x="446" y="215" text-anchor="middle" fill="#3D1F56" font-size="8.5" font-weight="600">7%</text>
  <!-- IVF 25% = 62px -->
  <rect x="466" y="174" width="28" height="62" rx="4" fill="#CF3A6A"/>
  <text x="480" y="170" text-anchor="middle" fill="#CF3A6A" font-size="8.5" font-weight="600">25%</text>
  <text x="467" y="252" text-anchor="middle" fill="#3D1F56" font-size="9" opacity="0.7">38–40</text>

  <!-- Group 5: 41+ -->
  <!-- IUI 4% = 10px -->
  <rect x="550" y="226" width="28" height="10" rx="4" fill="#3D1F56" opacity="0.85"/>
  <text x="564" y="222" text-anchor="middle" fill="#3D1F56" font-size="8.5" font-weight="600">4%</text>
  <!-- IVF 13% = 32px -->
  <rect x="584" y="204" width="28" height="32" rx="4" fill="#CF3A6A"/>
  <text x="598" y="200" text-anchor="middle" fill="#CF3A6A" font-size="8.5" font-weight="600">13%</text>
  <text x="585" y="252" text-anchor="middle" fill="#3D1F56" font-size="9" opacity="0.7">41+</text>

  <!-- X axis label -->
  <text x="340" y="270" text-anchor="middle" fill="#3D1F56" font-size="10" opacity="0.55" font-weight="600">Age Group</text>

  <!-- Key insight callout -->
  <rect x="100" y="282" width="480" height="28" rx="10" fill="#3D1F56" opacity="0.07"/>
  <text x="340" y="300" text-anchor="middle" fill="#3D1F56" font-size="10" font-weight="600" opacity="0.75">IVF success rates are 2–4× higher than IUI across all age groups — the gap widens after 35</text>
</svg>`;

/* ══════════════════════════════════════════════════════════════════
 * FULL ARTICLE CONTENT (Lexical JSON)
 * ══════════════════════════════════════════════════════════════════ */
const content = {
  root: {
    type: "root", format: "", indent: 0, version: 1, direction: "ltr",
    children: [

      /* ─── TOPIC HERO ILLUSTRATION (replaces dull stock photo) ─── */
      infographic({
        title: null,
        svgContent: SVG_HERO_BANNER,
        altText: "IUI vs IVF comparison — IUI places sperm directly in the uterus; IVF fertilises eggs in a laboratory before transferring the best embryo.",
        caption: null,
      }),

      /* ─── ANSWER-FIRST INTRO (AEO / featured snippet target) ─── */
      para(
        bold("Short answer: "),
        txt("IUI (Intrauterine Insemination) and IVF (In Vitro Fertilisation) are both proven fertility treatments — but they suit different situations. IUI is the simpler, less invasive, lower-cost first step, best for mild male factor infertility, ovulation problems, or unexplained infertility in women under 35. IVF offers significantly higher success rates and is the right choice when IUI hasn't worked, fallopian tubes are blocked, sperm quality is severely affected, or you are over 35 and time is a factor. Most couples benefit from an honest evaluation before choosing — not every case needs IVF."),
      ),

      externalImage({
        url: "https://images.pexels.com/photos/18277954/pexels-photo-18277954.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: "Indian couple sharing a tender outdoor moment during pregnancy — the destination that both IUI and IVF work toward",
        caption: "Every fertility journey — whether IUI or IVF — leads to this moment.",
        credit: "Photo: Darshan Dave / Pexels (Dhari, Gujarat, India)",
      }),

      statStrip([
        { value: "20%",        label: "IUI success rate per cycle" },
        { value: "60%",        label: "IVF success rate per cycle" },
        { value: "3x Cheaper", label: "IUI vs IVF cost" },
        { value: "3 Cycles",   label: "IUI attempts before considering IVF" },
      ]),

      /* ─── WHAT IS IUI ─── */
      h2("What Is IUI (Intrauterine Insemination)?"),
      para(
        txt("IUI is a fertility procedure where washed, concentrated sperm is placed directly into the uterus around the time of ovulation — bypassing the cervix to shorten the distance sperm must travel. It is done as an outpatient procedure, takes about 5 minutes, and requires no anaesthesia. A typical IUI cycle spans 1–2 weeks from the first monitoring scan to the procedure itself."),
      ),
      para(
        txt("IUI works best when at least one fallopian tube is open, ovulation is occurring (naturally or with mild stimulation), and sperm quality is reasonable — a total motile sperm count (TMSC) of at least 5–10 million after washing. It is also the standard first-line treatment for "),
        link("unexplained infertility", "/treatments/iui"),
        txt(", single women using donor sperm, and same-sex couples."),
      ),
      ul(
        "Mild male factor infertility (low count, motility issues)",
        "Ovulation disorders (PCOS, irregular cycles) — with or without medication",
        "Unexplained infertility in women under 35",
        "Single women or same-sex couples using donor sperm",
        "Cervical factor infertility (hostile cervical mucus)",
      ),

      infographic({
        title: "IUI — How It Works (3 Steps)",
        svgContent: SVG_IUI_PROCESS,
        altText: "IUI three-step process: Step 1 Ovulation Monitoring, Step 2 Sperm Preparation, Step 3 Intrauterine Insemination",
        caption: "IUI is a simple outpatient procedure — no anaesthesia, no hospital stay, completed in under 5 minutes.",
      }),

      /* ─── WHAT IS IVF ─── */
      h2("What Is IVF (In Vitro Fertilisation)?"),
      para(
        txt("IVF is a multi-step process where eggs are retrieved from the ovaries, fertilised with sperm in a laboratory, and the resulting embryo is transferred into the uterus. A single IVF cycle takes 2–3 weeks from stimulation to transfer, followed by a 2-week wait before the pregnancy test. IVF gives doctors precise control over fertilisation and embryo quality — which is why success rates are significantly higher than IUI."),
      ),
      para(
        txt("At Bavishi Fertility Institute, IVF is often combined with "),
        link("ICSI (Intracytoplasmic Sperm Injection)", "/treatments/icsi"),
        txt(" for male factor cases, and "),
        link("blastocyst transfer", "/treatments/blastocyst-transfer"),
        txt(" to select the strongest embryos. Genetic testing (PGT) can be added for couples with recurrent miscarriage or known genetic concerns."),
      ),
      ul(
        "Blocked or damaged fallopian tubes (most common IVF indication)",
        "Severe male factor infertility — low count, zero motility, azoospermia",
        "Failed 3 or more IUI cycles",
        "Women over 35 — especially if trying for 6+ months without success",
        "Endometriosis affecting the tubes or ovarian reserve",
        "Poor ovarian reserve (low AMH / low AFC)",
        "Recurrent miscarriage where embryo testing (PGT) is needed",
      ),

      infographic({
        title: "IVF — How It Works (5 Steps)",
        svgContent: SVG_IVF_PROCESS,
        altText: "IVF five-step process: Ovarian Stimulation, Egg Retrieval, Fertilisation in lab, Embryo Culture for 3-5 days, Embryo Transfer",
        caption: "One IVF cycle takes 2–3 weeks. The pregnancy test is done 14 days after embryo transfer.",
      }),

      /* ─── COMPARISON TABLE ─── */
      h2("IUI vs IVF — Side-by-Side Comparison"),
      para(txt("Here's an honest head-to-head of both treatments to help you and your partner understand what each involves:")),

      comparisonTable(
        "Factor",
        ["IUI", "IVF"],
        [
          { label: "Where fertilisation happens", cells: ["Inside the body (natural)", "In the laboratory"] },
          { label: "Invasiveness",                cells: ["Minimal — no sedation needed", "Moderate — egg retrieval under sedation"] },
          { label: "Success rate per cycle",      cells: ["10–20% (age-dependent)", "40–60% (age-dependent)"] },
          { label: "Duration",                    cells: ["1–2 weeks per cycle", "2–3 weeks per cycle"] },
          { label: "Typical cost (India)",        cells: ["₹10,000–₹25,000 per cycle", "₹1.2L–₹2.5L per cycle"] },
          { label: "Requires open fallopian tube",cells: ["Yes — at least one", "No — bypasses tubes completely"] },
          { label: "Sperm quality needed",        cells: ["TMSC ≥ 5–10 million", "Even a few motile sperm (with ICSI)"] },
          { label: "Suitable for severe MFI",     cells: ["No", "Yes (with ICSI)"] },
          { label: "Embryo selection possible",   cells: ["No", "Yes (blastocyst, PGT)"] },
          { label: "Recommended tries",           cells: ["Up to 3 cycles", "Evaluate after each cycle"] },
        ],
      ),

      /* ─── WHEN TO CHOOSE IUI ─── */
      h2("When Should You Choose IUI First?"),
      para(txt("IUI is the right starting point in several well-defined situations. It avoids the cost and complexity of IVF when the chances of success with a simpler treatment are reasonable — particularly for younger patients with no major structural issues.")),

      decisionList({
        heading: "Choose IUI if your situation matches:",
        intro: "These are evidence-based indicators that IUI gives you a meaningful chance of success.",
        items: [
          { icon: "HeartPulse",   situation: "Mild male factor: TMSC between 5–20 million after washing", recommendation: "IUI is appropriate first step" },
          { icon: "CalendarCheck",situation: "Unexplained infertility in a woman under 35 with open tubes", recommendation: "Start with 3 IUI cycles" },
          { icon: "Zap",          situation: "Ovulation problems (PCOS, irregular cycles) with otherwise normal fertility", recommendation: "IUI with ovulation induction" },
          { icon: "Users",        situation: "Single woman or same-sex couple using donor sperm", recommendation: "IUI is the standard first treatment" },
        ],
        note: "If you are over 37, it is reasonable to discuss skipping IUI and moving directly to IVF — time is a significant factor in fertility treatment.",
      }),

      tip("IUI is three to four times less expensive than IVF per cycle. If your diagnosis supports it, trying IUI first is medically justified and financially sensible. Most couples who conceive with IUI do so within the first 3 cycles."),

      /* ─── WHEN TO CHOOSE IVF ─── */
      h2("When Should You Move Directly to IVF?"),
      para(txt("IVF is the medically preferred option — not just a fallback — in situations where IUI is unlikely to succeed. Choosing IVF in these cases avoids delays that reduce your chances over time.")),

      decisionList({
        heading: "IVF is recommended if:",
        intro: null,
        items: [
          { icon: "Target",     situation: "Fallopian tubes are blocked or absent", recommendation: "IVF is the only option" },
          { icon: "Microscope", situation: "Severe male factor — TMSC under 5 million, or azoospermia", recommendation: "IVF with ICSI" },
          { icon: "Activity",   situation: "Three or more failed IUI cycles with good sperm and ovulation", recommendation: "Move to IVF" },
          { icon: "Clock",      situation: "Age 38 or above and trying for 6+ months", recommendation: "IVF without delay" },
          { icon: "Dna",        situation: "Endometriosis affecting tubes or low ovarian reserve (low AMH)", recommendation: "IVF with personalised protocol" },
        ],
        note: null,
      }),

      /* ─── MID-CONTENT CTA (MOFU) ─── */
      inlineCta({
        headline: "Not sure whether IUI or IVF is right for your case?",
        subtext: "Our fertility specialists in Ahmedabad review your reports and give you an honest recommendation — not the most expensive option.",
        buttons: [
          { label: "Book Consultation",  url: "/#book",   variant: "primary" },
          { label: "WhatsApp a Specialist",   url: "https://wa.me/919825600900", variant: "secondary" },
        ],
        accent: "rose",
      }),

      /* ─── SUCCESS RATES ─── */
      h2("IUI vs IVF Success Rates — What the Numbers Actually Mean"),
      para(txt("Success rates depend heavily on age, diagnosis, and clinic quality. As a general benchmark based on published ART registry data: IUI achieves a 10–20% pregnancy rate per cycle in women under 35, falling to 4–7% over age 38. IVF achieves 40–55% per cycle under 35, declining to 13–25% between ages 38–42. The gap between IUI and IVF widens significantly after age 35 — which is one of the strongest arguments for moving to IVF earlier if you are in that age group.")),
      para(
        txt("At Bavishi Fertility Institute, our IVF success rates across 14 centres in India consistently exceed the national average — driven by blastocyst culture, AI-assisted embryo selection, and individualised stimulation protocols. We also offer "),
        link("natural cycle IVF", "/treatments/ivf"),
        txt(" and "),
        link("mild stimulation IVF", "/treatments/ivf"),
        txt(" for patients who want fewer injections or have low ovarian reserve."),
      ),

      infographic({
        title: "IUI vs IVF Success Rates by Age Group",
        svgContent: SVG_SUCCESS_RATES,
        altText: "Bar chart comparing IUI and IVF success rates per cycle by age group. IVF is 2-4x higher across all ages; the gap widens after 35.",
        caption: "Source: Published ART registry data (ICMR / ESHRE). Individual results vary by diagnosis and clinic.",
      }),

      /* ─── LOCAL SEO SECTION ─── */
      h2("IUI and IVF Treatment at Bavishi Fertility Institute, Ahmedabad"),
      para(
        txt("Bavishi Fertility Institute is the leading IVF chain in Gujarat, with centres in Ahmedabad (Nikol, Bopal, Satellite, Memnagar), Surat, Vadodara, Bhavnagar, Anand, Bhuj, Mumbai, and Varanasi. For couples in Ahmedabad deciding between "),
        link("IUI treatment", "/treatments/iui"),
        txt(" and "),
        link("IVF treatment", "/treatments/ivf"),
        txt(", our specialists offer a same-week evaluation that includes a semen analysis, AMH test, and pelvic ultrasound — so you have a clear picture of which treatment path gives you the best chance before you spend anything."),
      ),
      para(
        txt("We follow a strict no-unnecessary-IVF policy: if IUI is clinically appropriate for your case, we'll recommend it. If your reports indicate IVF is the right choice, we'll explain exactly why — with the data. This philosophy has earned us the National Fertility Award from 2021 to 2025 and 1,800+ five-star Google ratings across our centres."),
      ),

      highlightCard({
        badge: "IUI & IVF AT BAVISHI",
        tagline: "Honest treatment recommendations — we recommend IUI when it's appropriate, IVF when it's necessary.",
        icon: "Microscope",
        color: "rose",
        facts: [
          { label: "IVF Success Rate",    value: "40–60% per cycle" },
          { label: "Centres",             value: "14 across India" },
          { label: "Free Initial Consult", value: "Same-week appointment" },
          { label: "Award",               value: "National Fertility 2021–25" },
        ],
        bestSuitedFor: "Couples in Ahmedabad or Gujarat deciding between IUI and IVF who want an evidence-based recommendation from experienced fertility specialists — not a sales pitch.",
      }),

      /* ─── CONCLUSION PANEL ─── */
      h2("Key Takeaways: IUI vs IVF"),
      conclusionPanel({
        headline: "What to Remember",
        points: [
          { icon: "ShieldCheck",  text: "IUI is the right first step for mild male factor, ovulation issues, or unexplained infertility under 35" },
          { icon: "Activity",     text: "IVF success rates are 2–4× higher than IUI — the advantage increases after age 35" },
          { icon: "Clock",        text: "Age 38+? Don't spend time on multiple IUI cycles — IVF is typically more efficient" },
          { icon: "Target",       text: "Blocked tubes, severe male factor, or endometriosis = IVF is your only realistic option" },
          { icon: "Award",        text: "A proper evaluation (AMH, semen analysis, scan) determines the right path — not guesswork" },
          { icon: "Sparkles",     text: "Both IUI and IVF are available at all 14 Bavishi Fertility Institute centres" },
        ],
      }),

      /* ─── BOTTOM-OF-FUNNEL CTA ─── */
      inlineCta({
        headline: "Ready to find out which treatment is right for you?",
        subtext: "Book a consultation at Bavishi Fertility Institute — bring your latest reports and get a clear, honest plan.",
        buttons: [
          { label: "Book Consultation in Ahmedabad", url: "/#book",                          variant: "primary" },
          { label: "Call Us",                             url: "tel:+919825600900",                variant: "secondary" },
        ],
        accent: "plum",
      }),

    ],
  },
};

/* ══════════════════════════════════════════════════════════════════
 * FAQs (People Also Ask + LLM query research)
 * ══════════════════════════════════════════════════════════════════ */
const faqs = [
  {
    question: "What is the main difference between IUI and IVF?",
    answer: "In IUI, sperm is placed directly into the uterus and fertilisation happens naturally inside the body. In IVF, eggs are retrieved from the ovaries, fertilised with sperm in a laboratory, and the best embryo is transferred to the uterus. IVF bypasses the fallopian tubes entirely and gives doctors control over fertilisation and embryo selection, which is why its success rates are 2–4 times higher than IUI.",
  },
  {
    question: "How many IUI cycles should I try before moving to IVF?",
    answer: "Most fertility specialists recommend up to 3 IUI cycles before moving to IVF — if your diagnosis supports IUI in the first place. If you are over 37, have already had 2–3 failed IUI cycles, or your reports show low ovarian reserve or severe male factor infertility, your doctor may recommend skipping IUI and proceeding directly to IVF to avoid losing time.",
  },
  {
    question: "What is the success rate of IUI compared to IVF?",
    answer: "IUI achieves a 10–20% pregnancy rate per cycle in women under 35, declining to 4–7% after age 38. IVF achieves 40–55% per cycle under 35, and 13–25% between ages 38–42. Over three cycles, cumulative IUI success reaches 30–40% for the right candidates — still lower than a single IVF cycle for most patients. Age and diagnosis are the biggest factors in both cases.",
  },
  {
    question: "Is IUI less painful than IVF?",
    answer: "Yes. IUI is similar to a cervical smear — a thin catheter is passed through the cervix to deposit the sperm sample. Most women experience mild cramping during or after the procedure, but it requires no sedation or anaesthesia. IVF involves an egg retrieval procedure under light sedation, which is more involved. The stimulation injections for IVF are also an additional consideration.",
  },
  {
    question: "Is IVF or IUI better for PCOS?",
    answer: "For most women with PCOS, IUI with ovulation induction (using tablets or low-dose injections) is a reasonable first-line treatment — especially under age 35 with no other infertility factors. If IUI fails after 3 cycles, or if the PCOS is severe with additional factors like low AMH or male factor infertility, IVF is recommended. PCOS patients respond well to IVF stimulation but need careful monitoring to avoid OHSS (ovarian hyperstimulation syndrome).",
  },
  {
    question: "What if IUI fails three times?",
    answer: "Three failed IUI cycles with good sperm quality and confirmed ovulation is the standard threshold for moving to IVF. Your fertility specialist should review why IUI didn't work — possible reasons include unexplained implantation failure, subtle sperm DNA damage, or mild endometriosis not picked up earlier. IVF with ICSI and blastocyst transfer addresses most of these issues and gives a higher per-cycle success rate.",
  },
  {
    question: "How much does IUI cost compared to IVF in Ahmedabad?",
    answer: "In Ahmedabad, IUI typically costs ₹10,000–₹25,000 per cycle including monitoring and the procedure. IVF costs range from ₹1.2 lakh to ₹2.5 lakh per cycle, depending on the protocol used, medications, and whether ICSI or PGT is added. At Bavishi Fertility Institute, we provide transparent, itemised quotes before you start any treatment so there are no surprises.",
  },
  {
    question: "Can IVF work when IUI has failed multiple times?",
    answer: "Yes — IVF often succeeds in patients who have had multiple failed IUI cycles. The reason is that IVF bypasses the fertilisation step entirely and allows embryo selection, which addresses issues like subtle sperm-egg interaction problems that IUI cannot overcome. A review of previous IUI cycles, updated semen analysis, and sometimes an ERA test (Endometrial Receptivity Analysis) or sperm DNA fragmentation test can identify the reason for previous failure and improve IVF outcomes.",
  },
];

/* ══════════════════════════════════════════════════════════════════
 * SEO metadata
 * ══════════════════════════════════════════════════════════════════ */
const seo = {
  metaTitle: "IUI vs IVF: Which Fertility Treatment Is Right for You? | Bavishi Fertility Institute",
  metaDescription: "IUI vs IVF — success rates, costs, who each suits, and how to choose. Expert guidance from fertility specialists at Bavishi Fertility Institute, Ahmedabad. Consultation available.",
};

const excerpt = "IUI and IVF are both proven fertility treatments — but they suit different situations. Here's an honest comparison of success rates, costs, and who each treatment is right for, reviewed by our specialists in Ahmedabad.";

const readMins = 9;

/* ══════════════════════════════════════════════════════════════════
 * API helpers
 * ══════════════════════════════════════════════════════════════════ */
const login = async () => {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.token;
};

const findBlog = async (slug, auth) => {
  const res = await fetch(
    `${BASE}/api/blogs?where[slug][equals]=${encodeURIComponent(slug)}&depth=0&limit=1&draft=true`,
    { headers: auth },
  );
  const data = await res.json();
  return data.docs?.[0] ?? null;
};

const patchBlog = async (id, payload, auth) => {
  const res = await fetch(`${BASE}/api/blogs/${id}?draft=false`, {
    method: "PATCH",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("PATCH error:", JSON.stringify(data, null, 2));
    throw new Error(`PATCH failed HTTP ${res.status}`);
  }
  return data;
};

/* ══════════════════════════════════════════════════════════════════
 * Run
 * ══════════════════════════════════════════════════════════════════ */
const lookupAuthors = async (auth) => {
  const res = await fetch(`${BASE}/api/authors?limit=50&depth=0`, { headers: auth });
  const data = await res.json();
  const parth    = data.docs?.find(a => a.name === "Dr. Parth Bavishi");
  const himanshu = data.docs?.find(a => a.name === "Dr. Himanshu Bavishi");
  if (!parth || !himanshu) throw new Error("Author not found in DB — check names");
  return { AUTHOR_ID: parth.id, REVIEWER_ID: himanshu.id };
};

const run = async () => {
  console.log(`[enrich-01] Connecting to ${BASE} ...`);
  const token = await login();
  const auth  = { Authorization: `JWT ${token}` };
  console.log("[enrich-01] Login OK");

  const { AUTHOR_ID, REVIEWER_ID } = await lookupAuthors(auth);

  const blog = await findBlog(SLUG, auth);
  if (!blog) {
    console.error(`[enrich-01] Blog not found: ${SLUG}`);
    console.error("[enrich-01] Make sure the post has been imported and the dev server is running.");
    process.exit(1);
  }
  console.log(`[enrich-01] Found blog id=${blog.id} — patching ...`);

  await patchBlog(blog.id, {
    content,
    faqs,
    excerpt,
    readMins,
    seo,
    author: AUTHOR_ID,
    reviewedBy: REVIEWER_ID,
    heroImage: null,
    _status: "published",
  }, auth);

  console.log(`[enrich-01] ✓ Done! Review at: ${BASE}/blog/${SLUG}`);
};

run().catch((e) => {
  console.error("[enrich-01] FAILED:", e.message);
  process.exit(1);
});
