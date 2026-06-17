#!/usr/bin/env node
/* =============================================================================
 * enrich-blog-03-pcos-fertility.mjs
 * Enriches: top-fertility-treatments-for-women-with-pcos
 * Topic: Fertility treatments for PCOS
 * Intent: Educational + MOFU — woman with PCOS researching options
 * Run: node scripts/enrich-blog-03-pcos-fertility.mjs
 * ============================================================================= */

const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";
const AUTHOR_ID = 3;   // Dr. Parth Bavishi
const REVIEWER_ID = 2; // Dr. Himanshu Bavishi

const SLUG = "top-fertility-treatments-for-women-with-pcos";

const uid = () => Math.random().toString(36).slice(2, 10);

// ---------- Lexical node helpers ----------
const txt = (t, format = 0) => ({ type: "text", text: t, version: 1, detail: 0, format, mode: "normal", style: "" });
const bold = (t) => txt(t, 1);
const para = (...children) => ({ type: "paragraph", version: 1, format: "", indent: 0, direction: "ltr", textFormat: 0, textStyle: "", children: children.flat() });
const h2 = (t) => ({ type: "heading", tag: "h2", version: 1, format: "", indent: 0, direction: "ltr", children: [txt(t)] });
const h3 = (t) => ({ type: "heading", tag: "h3", version: 1, format: "", indent: 0, direction: "ltr", children: [txt(t)] });
const tip = (t) => ({ type: "quote", version: 1, format: "", indent: 0, direction: "ltr", children: [txt(t)] });
const link = (text, url) => ({ type: "link", version: 1, format: "", indent: 0, direction: "ltr", fields: { linkType: "custom", url, newTab: false }, children: [txt(text)] });
const li = (t) => ({ type: "listitem", version: 1, format: "", indent: 0, direction: "ltr", value: 1, children: [txt(t)] });
const ul = (...items) => ({ type: "list", version: 1, tag: "ul", listType: "bullet", format: "", indent: 0, direction: "ltr", start: 1, children: items.map(li) });

// ---------- Block helpers ----------
const statStrip = (items) => ({ type: "block", version: 2, fields: { id: uid(), blockType: "statStrip", blockName: "", items: items.map(({ value, label }) => ({ id: uid(), value, label })) } });
const comparisonTable = (rowHeader, columns, rows) => ({ type: "block", version: 2, fields: { id: uid(), blockType: "comparisonTable", blockName: "", rowHeader, columns: columns.map(h => ({ id: uid(), header: h })), rows: rows.map(({ label, cells }) => ({ id: uid(), rowLabel: label, cells: cells.map(v => ({ id: uid(), value: v })) })) } });
const highlightCard = ({ badge, tagline, icon, color, facts, bestSuitedFor }) => ({ type: "block", version: 2, fields: { id: uid(), blockType: "highlightCard", blockName: "", badge, tagline, icon, color, facts: (facts ?? []).map(({ label, value }) => ({ id: uid(), label, value })), bestSuitedFor } });
const decisionList = ({ heading, intro, items, note }) => ({ type: "block", version: 2, fields: { id: uid(), blockType: "decisionList", blockName: "", heading, intro, note: note ?? null, items: items.map(({ icon, situation, recommendation }) => ({ id: uid(), icon: icon ?? null, situation, recommendation })) } });
const conclusionPanel = ({ headline, points }) => ({ type: "block", version: 2, fields: { id: uid(), blockType: "conclusionPanel", blockName: "", headline, points: points.map(({ icon, text }) => ({ id: uid(), icon: icon ?? null, text })) } });
const infographic = ({ title, svgContent, altText, caption }) => ({ type: "block", version: 2, fields: { id: uid(), blockType: "infographic", blockName: "", title: title ?? null, svgContent, altText, caption: caption ?? null } });
const inlineCta = ({ headline, subtext, buttons, accent }) => ({ type: "block", version: 2, fields: { id: uid(), blockType: "inlineCta", blockName: "", headline, subtext: subtext ?? null, accent: accent ?? "rose", buttons: buttons.map(({ label, url, variant }) => ({ id: uid(), label, url, variant: variant ?? "primary" })) } });
const externalImage = ({ url, alt, caption, credit }) => ({ type: "block", version: 2, fields: { id: uid(), blockType: "externalImage", blockName: "", url, alt, caption: caption ?? null, credit: credit ?? null } });

// ---------- SVG: PCOS Treatment Pathway ----------
const pcosTreatmentPathwaySVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 460" font-family="Inter,system-ui,sans-serif">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0a2e"/>
      <stop offset="100%" style="stop-color:#2d1245"/>
    </linearGradient>
  </defs>
  <rect width="800" height="460" fill="url(#bg)" rx="16"/>
  <text x="400" y="36" text-anchor="middle" font-size="17" font-weight="700" fill="#fff">PCOS Fertility Treatment Pathway</text>
  <text x="400" y="55" text-anchor="middle" font-size="11" fill="#c9b8d8">Most women with PCOS conceive with Step 1 or 2 — IVF is rarely needed</text>

  <!-- Step boxes -->
  <!-- Step 1 -->
  <rect x="30" y="74" width="160" height="130" rx="12" fill="#1f0d36" stroke="#C5A130" stroke-width="2"/>
  <rect x="30" y="74" width="160" height="34" rx="12" fill="#C5A130"/>
  <rect x="30" y="96" width="160" height="12" fill="#C5A130"/>
  <text x="110" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="#1a0a2e">STEP 1</text>
  <text x="110" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">Lifestyle</text>
  <text x="110" y="134" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">Optimisation</text>
  <text x="110" y="158" text-anchor="middle" font-size="10" fill="#e8d5f5">Weight: 5–10% loss</text>
  <text x="110" y="174" text-anchor="middle" font-size="10" fill="#e8d5f5">Restores ovulation</text>
  <text x="110" y="190" text-anchor="middle" font-size="10" fill="#C5A130">in ~50% of women</text>

  <!-- Arrow 1→2 -->
  <line x1="190" y1="139" x2="218" y2="139" stroke="#CF3A6A" stroke-width="2"/>
  <polygon points="218,134 228,139 218,144" fill="#CF3A6A"/>

  <!-- Step 2 -->
  <rect x="228" y="74" width="160" height="130" rx="12" fill="#1f0d36" stroke="#CF3A6A" stroke-width="2"/>
  <rect x="228" y="74" width="160" height="34" rx="12" fill="#CF3A6A"/>
  <rect x="228" y="96" width="160" height="12" fill="#CF3A6A"/>
  <text x="308" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">STEP 2</text>
  <text x="308" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">Ovulation</text>
  <text x="308" y="134" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">Induction</text>
  <text x="308" y="158" text-anchor="middle" font-size="10" fill="#e8d5f5">Letrozole (1st line)</text>
  <text x="308" y="174" text-anchor="middle" font-size="10" fill="#e8d5f5">Clomiphene</text>
  <text x="308" y="190" text-anchor="middle" font-size="10" fill="#CF3A6A">Ovulation in ~80%</text>

  <!-- Arrow 2→3 -->
  <line x1="388" y1="139" x2="416" y2="139" stroke="#CF3A6A" stroke-width="2"/>
  <polygon points="416,134 426,139 416,144" fill="#CF3A6A"/>

  <!-- Step 3 -->
  <rect x="426" y="74" width="160" height="130" rx="12" fill="#1f0d36" stroke="#3D1F56" stroke-width="2" style="stroke:#7b3fa0"/>
  <rect x="426" y="74" width="160" height="34" rx="12" fill="#7b3fa0"/>
  <rect x="426" y="96" width="160" height="12" fill="#7b3fa0"/>
  <text x="506" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">STEP 3</text>
  <text x="506" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">IUI</text>
  <text x="506" y="134" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">(Insemination)</text>
  <text x="506" y="158" text-anchor="middle" font-size="10" fill="#e8d5f5">Timed insemination</text>
  <text x="506" y="174" text-anchor="middle" font-size="10" fill="#e8d5f5">+ OI medications</text>
  <text x="506" y="190" text-anchor="middle" font-size="10" fill="#b8a0e0">15–22% per cycle</text>

  <!-- Arrow 3→4 -->
  <line x1="586" y1="139" x2="614" y2="139" stroke="#CF3A6A" stroke-width="2"/>
  <polygon points="614,134 624,139 614,144" fill="#CF3A6A"/>

  <!-- Step 4 -->
  <rect x="624" y="74" width="148" height="130" rx="12" fill="#1f0d36" stroke="#CF3A6A" stroke-width="2"/>
  <rect x="624" y="74" width="148" height="34" rx="12" fill="#3D1F56"/>
  <rect x="624" y="96" width="148" height="12" fill="#3D1F56"/>
  <text x="698" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="#CF3A6A">STEP 4</text>
  <text x="698" y="118" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">IVF</text>
  <text x="698" y="134" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">(If needed)</text>
  <text x="698" y="158" text-anchor="middle" font-size="10" fill="#e8d5f5">Low-dose protocol</text>
  <text x="698" y="174" text-anchor="middle" font-size="10" fill="#e8d5f5">OHSS monitoring</text>
  <text x="698" y="190" text-anchor="middle" font-size="10" fill="#CF3A6A">Up to 65% success</text>

  <!-- Success probability bar -->
  <text x="400" y="232" text-anchor="middle" font-size="12" font-weight="600" fill="#c9b8d8">Cumulative pregnancy rate by step reached</text>
  <rect x="40" y="244" width="720" height="16" rx="8" fill="#2d1245"/>
  <rect x="40" y="244" width="180" height="16" rx="8" fill="#C5A130"/>
  <rect x="220" y="244" width="200" height="16" rx="0" fill="#CF3A6A"/>
  <rect x="420" y="244" width="160" height="16" rx="0" fill="#7b3fa0"/>
  <rect x="580" y="244" width="180" height="16" rx="0" fill="#3D1F56" style="border-radius: 0 8px 8px 0"/>
  <text x="130" y="256" text-anchor="middle" font-size="9" fill="#1a0a2e" font-weight="700">~50% (lifestyle)</text>
  <text x="320" y="256" text-anchor="middle" font-size="9" fill="#fff" font-weight="700">~70% (+ OI)</text>
  <text x="500" y="256" text-anchor="middle" font-size="9" fill="#fff" font-weight="700">~80% (+ IUI)</text>
  <text x="670" y="256" text-anchor="middle" font-size="9" fill="#CF3A6A" font-weight="700">Over 90% (+ IVF)</text>

  <!-- OHSS warning -->
  <rect x="40" y="280" width="720" height="64" rx="10" fill="#2d0f1e" stroke="#CF3A6A" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="400" y="300" text-anchor="middle" font-size="12" font-weight="700" fill="#CF3A6A">⚠ OHSS Risk in PCOS — Important to Know</text>
  <text x="400" y="318" text-anchor="middle" font-size="11" fill="#e8d5f5">Women with PCOS are at higher risk of Ovarian Hyperstimulation Syndrome (OHSS) during IVF.</text>
  <text x="400" y="334" text-anchor="middle" font-size="11" fill="#e8d5f5">Low-dose protocols, freeze-all embryos, and close monitoring dramatically reduce this risk.</text>

  <!-- Bottom note -->
  <text x="400" y="374" text-anchor="middle" font-size="11" fill="#c9b8d8">Most women with PCOS DO NOT reach Step 4.</text>
  <text x="400" y="390" text-anchor="middle" font-size="11" fill="#c9b8d8">The journey is usually shorter than you fear — with the right first step.</text>
  <text x="400" y="418" text-anchor="middle" font-size="10" fill="#7b5fa0">Bavishi Fertility Institute · PCOS Fertility Clinic · Ahmedabad, Gujarat</text>
</svg>`;

// ---------- SVG: PCOS Decision Flowchart ----------
const pcosDecisionFlowchartSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" font-family="Inter,system-ui,sans-serif">
  <defs>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0a2e"/>
      <stop offset="100%" style="stop-color:#2d1245"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bg2)" rx="16"/>
  <text x="400" y="34" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">PCOS Treatment Decision Flowchart</text>

  <!-- Start node -->
  <rect x="300" y="50" width="200" height="40" rx="20" fill="#C5A130"/>
  <text x="400" y="75" text-anchor="middle" font-size="12" font-weight="700" fill="#1a0a2e">Diagnosed with PCOS?</text>

  <!-- Arrow down -->
  <line x1="400" y1="90" x2="400" y2="110" stroke="#CF3A6A" stroke-width="2"/>
  <polygon points="395,110 405,110 400,120" fill="#CF3A6A"/>

  <!-- Diamond: Trying to conceive? -->
  <polygon points="400,122 480,158 400,194 320,158" fill="#3D1F56" stroke="#CF3A6A" stroke-width="1.5"/>
  <text x="400" y="154" text-anchor="middle" font-size="10" fill="#fff">Trying to</text>
  <text x="400" y="168" text-anchor="middle" font-size="10" fill="#fff">conceive?</text>

  <!-- Yes path (left) -->
  <line x1="320" y1="158" x2="220" y2="158" stroke="#C5A130" stroke-width="2"/>
  <polygon points="220,153 210,158 220,163" fill="#C5A130"/>
  <text x="265" y="150" text-anchor="middle" font-size="10" fill="#C5A130">YES</text>

  <!-- No path (right) -->
  <line x1="480" y1="158" x2="580" y2="158" stroke="#7b5fa0" stroke-width="2"/>
  <polygon points="580,153 590,158 580,163" fill="#7b5fa0"/>
  <text x="535" y="150" text-anchor="middle" font-size="10" fill="#7b5fa0">NO</text>

  <!-- No branch box -->
  <rect x="590" y="138" width="170" height="40" rx="8" fill="#2d1245" stroke="#7b5fa0" stroke-width="1"/>
  <text x="675" y="155" text-anchor="middle" font-size="10" fill="#c9b8d8">Manage symptoms:</text>
  <text x="675" y="168" text-anchor="middle" font-size="10" fill="#c9b8d8">OCP, Metformin, diet</text>

  <!-- Yes — BMI check -->
  <rect x="100" y="138" width="120" height="40" rx="8" fill="#1f0d36" stroke="#C5A130" stroke-width="1.5"/>
  <text x="160" y="155" text-anchor="middle" font-size="10" fill="#C5A130">Check BMI</text>
  <text x="160" y="168" text-anchor="middle" font-size="10" fill="#e8d5f5">BMI &gt; 25?</text>

  <!-- Arrow down from BMI -->
  <line x1="160" y1="178" x2="160" y2="216" stroke="#CF3A6A" stroke-width="2"/>
  <polygon points="155,216 165,216 160,226" fill="#CF3A6A"/>

  <!-- Lifestyle box -->
  <rect x="80" y="226" width="160" height="44" rx="8" fill="#C5A130"/>
  <text x="160" y="245" text-anchor="middle" font-size="11" font-weight="700" fill="#1a0a2e">Start: Lifestyle</text>
  <text x="160" y="260" text-anchor="middle" font-size="10" fill="#1a0a2e">Diet + exercise first</text>

  <!-- Arrow down -->
  <line x1="160" y1="270" x2="160" y2="294" stroke="#CF3A6A" stroke-width="2"/>
  <polygon points="155,294 165,294 160,304" fill="#CF3A6A"/>

  <!-- Diamond: Ovulating? -->
  <polygon points="160,306 220,332 160,358 100,332" fill="#3D1F56" stroke="#CF3A6A" stroke-width="1.5"/>
  <text x="160" y="328" text-anchor="middle" font-size="9" fill="#fff">Ovulating</text>
  <text x="160" y="342" text-anchor="middle" font-size="9" fill="#fff">after 3 months?</text>

  <!-- Yes → TI -->
  <line x1="220" y1="332" x2="290" y2="332" stroke="#C5A130" stroke-width="2"/>
  <polygon points="290,327 300,332 290,337" fill="#C5A130"/>
  <text x="255" y="324" text-anchor="middle" font-size="9" fill="#C5A130">YES</text>
  <rect x="300" y="318" width="130" height="28" rx="6" fill="#1f0d36" stroke="#C5A130" stroke-width="1"/>
  <text x="365" y="336" text-anchor="middle" font-size="10" fill="#C5A130">Try timed intercourse</text>

  <!-- No → Letrozole -->
  <line x1="100" y1="332" x2="40" y2="332" stroke="#CF3A6A" stroke-width="2"/>
  <line x1="40" y1="332" x2="40" y2="392" stroke="#CF3A6A" stroke-width="2"/>
  <polygon points="35,392 45,392 40,402" fill="#CF3A6A"/>
  <text x="68" y="324" text-anchor="middle" font-size="9" fill="#CF3A6A">NO</text>
  <rect x="10" y="402" width="140" height="40" rx="8" fill="#CF3A6A"/>
  <text x="80" y="419" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">Letrozole / OI</text>
  <text x="80" y="433" text-anchor="middle" font-size="10" fill="#ffe0ec">Ovulation induction</text>

  <!-- IUI box -->
  <rect x="280" y="390" width="150" height="44" rx="8" fill="#1f0d36" stroke="#7b3fa0" stroke-width="1.5"/>
  <text x="355" y="409" text-anchor="middle" font-size="11" font-weight="700" fill="#b8a0e0">IUI</text>
  <text x="355" y="424" text-anchor="middle" font-size="10" fill="#c9b8d8">If OI + TI fails after 3–4 cycles</text>

  <!-- IVF box -->
  <rect x="500" y="390" width="150" height="44" rx="8" fill="#1f0d36" stroke="#CF3A6A" stroke-width="1.5"/>
  <text x="575" y="409" text-anchor="middle" font-size="11" font-weight="700" fill="#CF3A6A">IVF</text>
  <text x="575" y="424" text-anchor="middle" font-size="10" fill="#c9b8d8">Tubes blocked / IUI failed</text>

  <!-- Arrows to IUI and IVF -->
  <line x1="160" y1="442" x2="160" y2="462" stroke="#CF3A6A" stroke-width="1.5"/>
  <line x1="160" y1="462" x2="355" y2="462" stroke="#CF3A6A" stroke-width="1.5"/>
  <line x1="355" y1="462" x2="355" y2="434" stroke="#CF3A6A" stroke-width="1.5"/>
  <polygon points="350,434 360,434 355,424" fill="#CF3A6A"/>

  <line x1="430" y1="412" x2="500" y2="412" stroke="#7b3fa0" stroke-width="1.5" stroke-dasharray="4,3"/>
  <polygon points="500,407 510,412 500,417" fill="#7b3fa0"/>

  <text x="400" y="482" text-anchor="middle" font-size="10" fill="#7b5fa0">The right path depends on your individual test results — always start with a full PCOS fertility assessment.</text>
</svg>`;

// ---------- Content ----------
const content = {
  root: {
    type: "root", format: "", indent: 0, version: 1, direction: "ltr",
    children: [
      // Direct answer first
      para(
        bold("PCOS is the most treatable cause of female infertility, and most women with PCOS can conceive with their own eggs."),
        txt(" The key insight: PCOS causes irregular ovulation, not absent fertility — and with the right treatment ladder, ovulation can almost always be restored or bypassed. Studies show that over 90% of women with PCOS who receive appropriate treatment achieve pregnancy.")
      ),
      para(
        txt("Whether you're reading this just after a diagnosis or after a year of trying, this guide lays out every treatment option in the order your doctor would recommend — from lifestyle changes (which work more often than people expect) through to IVF (which is rarely where the story starts).")
      ),

      externalImage({
        url: "https://images.pexels.com/photos/7659861/pexels-photo-7659861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: "Doctor consulting with a female patient — personalised PCOS fertility treatment begins with a full hormone and ovulation assessment",
        caption: "Every PCOS case is different. Your treatment ladder starts with a thorough assessment, not a generic prescription.",
        credit: "Photo: Pexels",
      }),

      statStrip([
        { value: "1 in 5",   label: "Indian women affected by PCOS" },
        { value: "80%",      label: "Ovulate with first-line treatment" },
        { value: "90%",      label: "Achieve pregnancy with full pathway" },
        { value: "Step 1",   label: "Where most PCOS success stories begin" },
      ]),

      h2("Why PCOS Affects Fertility"),
      para(
        txt("PCOS — Polycystic Ovary Syndrome — disrupts the hormonal signals that coordinate ovulation. High levels of LH, excess androgens, and insulin resistance together prevent follicles from maturing and releasing an egg on a regular schedule. Without ovulation (anovulation), conception cannot occur naturally.")
      ),
      para(
        txt("The good news: this is a "),
        bold("functional problem, not a structural one"),
        txt(". The ovaries contain eggs — often many more than average (the 'polycystic' appearance). The challenge is simply triggering them to ovulate at the right time, which is something modern reproductive medicine does very well.")
      ),

      h2("The PCOS Treatment Pathway — Step by Step"),
      infographic({
        title: "PCOS Fertility Treatment Pathway",
        svgContent: pcosTreatmentPathwaySVG,
        altText: "Diagram showing the PCOS fertility treatment ladder from lifestyle optimisation through ovulation induction, IUI, to IVF — with cumulative pregnancy rates at each step",
        caption: "Most women with PCOS succeed at Step 1 or 2. IVF is reserved for cases where simpler treatments have not worked or tubes are blocked.",
      }),

      h2("Step 1: Lifestyle Optimisation — The Most Underrated Fertility Treatment"),
      para(
        txt("For women with PCOS who are overweight or obese (BMI over 25), a "),
        bold("5–10% reduction in body weight"),
        txt(" is clinically proven to restore spontaneous ovulation in approximately 50% of cases — without any medication. This is not a platitude; it is backed by a consistent body of randomised trial evidence.")
      ),
      ul(
        "Low glycaemic index (GI) diet reduces insulin resistance — the root driver of PCOS hormonal disruption",
        "150+ minutes of moderate exercise per week reduces androgen levels and LH excess",
        "Metformin is sometimes prescribed alongside lifestyle changes to improve insulin sensitivity",
        "Even a 3-month lifestyle program before fertility treatment improves ovarian response and egg quality"
      ),
      tip("If your BMI is over 25 and you have PCOS, starting with a 3-month structured weight management programme before any fertility drugs is not delaying treatment — it is improving its outcome. Ask your BFI specialist for a referral to our fertility nutrition counsellor."),

      h2("Step 2: Ovulation Induction with Letrozole or Clomiphene"),
      para(
        txt("When lifestyle changes alone are insufficient — or when the patient's BMI is normal — ovulation induction (OI) with oral medications is the first medical intervention. These tablets are taken for 5 days early in the cycle and monitored with ultrasound to confirm follicle growth and ovulation.")
      ),
      h3("Letrozole (aromatase inhibitor) — current first choice"),
      para(
        txt("Letrozole has largely replaced clomiphene as the first-line treatment for PCOS-related infertility. A large RCT (Legro et al., NEJM 2014) demonstrated higher live birth rates with letrozole than clomiphene (27.5% vs 19.1% per cycle) with a lower multiple pregnancy rate. It works by temporarily lowering oestrogen, prompting the pituitary to release FSH and stimulate a dominant follicle.")
      ),
      h3("Clomiphene — still widely used"),
      para(
        txt("Clomiphene (Clomid) has a 40-year track record in PCOS. It induces ovulation in approximately 75–80% of PCOS patients and results in pregnancy in 30–40% of women within 6 cycles. Its main limitations are anti-oestrogenic effects on cervical mucus and endometrium, which can reduce success rates after the first 3–4 cycles.")
      ),

      comparisonTable(
        "Treatment",
        ["How It Works", "Pregnancy Rate / Cycle", "Main Advantage", "Main Limitation"],
        [
          { label: "Letrozole", cells: ["Blocks oestrogen → triggers FSH surge", "~15–20%", "Better live birth rates, lower multiple pregnancy risk", "Off-label use; requires monitoring"] },
          { label: "Clomiphene (Clomid)", cells: ["Blocks oestrogen receptors → FSH release", "~12–18%", "Well-studied, inexpensive, widely available", "Anti-oestrogenic effect on endometrium after several cycles"] },
          { label: "IUI (with OI)", cells: ["OI + sperm placed directly in uterus", "~15–22%", "Helps mild male factor too; next step if OI alone fails", "Requires open tubes; 3–4 cycles typical"] },
          { label: "IVF (low-dose)", cells: ["Controlled stimulation + egg retrieval + ET", "~50–65% per transfer", "Highest success; bypasses anovulation completely", "More invasive, higher cost, OHSS risk"] },
        ]
      ),

      h2("Step 3: IUI — Intrauterine Insemination"),
      para(
        txt("If ovulation induction with timed intercourse does not result in pregnancy after 3–4 cycles, or if there is a mild male factor issue, "),
        link("IUI (intrauterine insemination)", "/treatments/iui"),
        txt(" is the logical next step. The procedure involves placing a washed, concentrated sperm sample directly into the uterus at the time of ovulation — improving the odds of sperm reaching the egg.")
      ),
      ul(
        "IUI is done as a clinic procedure in under 10 minutes — no anaesthesia, no recovery time",
        "Success rate per cycle is 15–22% for PCOS patients with patent tubes",
        "Most doctors recommend 3–4 IUI cycles before stepping up to IVF",
        "Tubal patency must be confirmed before IUI (HSG or laparoscopy)"
      ),

      h2("Step 4: IVF for PCOS — When It's Needed and How It's Done Differently"),
      para(
        txt("IVF is indicated for PCOS patients who have not responded to OI + IUI, have blocked tubes, or have a significant male factor that makes IUI inappropriate. The good news: PCOS patients typically respond "),
        bold("very well"),
        txt(" to IVF stimulation — often producing more eggs than average, which means more embryos to work with.")
      ),
      para(
        txt("The challenge — and the reason PCOS patients need a specialist protocol — is the elevated risk of "),
        bold("Ovarian Hyperstimulation Syndrome (OHSS)"),
        txt(", a potentially dangerous overresponse to fertility medications. At BFI, PCOS patients undergoing IVF receive:")
      ),
      ul(
        "Low-dose gonadotropin protocols (antagonist protocol) to reduce OHSS risk",
        "Careful follicle monitoring (typically every 2–3 days during stimulation)",
        "Freeze-all strategy: all good embryos are frozen, transfer happens in a subsequent cycle — this essentially eliminates severe OHSS risk",
        "Trigger shot choice: GnRH agonist trigger (not hCG) for high-responders to further reduce OHSS"
      ),
      tip("If a clinic does not mention OHSS risk management when discussing IVF for PCOS, ask about it directly. A 'freeze-all' strategy is now standard practice for PCOS patients at leading centres."),

      inlineCta({
        headline: "Not sure which PCOS treatment is right for you?",
        subtext: "Book a fertility assessment at Bavishi Fertility Institute. We will review your AMH, AFC, BMI, and cycle history and map out the most direct path to pregnancy.",
        accent: "rose",
        buttons: [
          { label: "Book PCOS Fertility Assessment", url: "/treatments/pcos", variant: "primary" },
          { label: "Learn About IUI", url: "/treatments/iui", variant: "secondary" },
        ],
      }),

      h2("When to Escalate: PCOS Treatment Decision Guide"),
      decisionList({
        heading: "When to Move to the Next Step",
        intro: "This ladder is a guide — your doctor may recommend skipping steps based on your test results, age, or time already spent trying.",
        items: [
          { icon: "Leaf", situation: "PCOS diagnosed, BMI over 25, under 35, trying less than 6 months", recommendation: "Start with 3 months of structured lifestyle intervention (diet + exercise + Metformin if indicated). Up to 50% of patients ovulate spontaneously after meaningful weight loss." },
          { icon: "Droplets", situation: "BMI normal, or lifestyle program completed without ovulation restoration", recommendation: "Start letrozole (preferred) or clomiphene for up to 6 monitored cycles. Ultrasound scan to confirm follicle growth." },
          { icon: "Target", situation: "OI cycles producing ovulation but not pregnancy after 4–6 cycles, or mild male factor", recommendation: "Move to IUI (3–4 cycles). Confirm tubal patency with HSG first. IUI success rates in ovulatory PCOS patients are 15–22% per cycle." },
          { icon: "Zap", situation: "IUI failed, tubes blocked, significant male factor, or age over 37 wanting faster resolution", recommendation: "IVF with PCOS-specific low-dose protocol and freeze-all strategy. Success rates of 50–65% per transfer at accredited centres." },
          { icon: "ShieldCheck", situation: "Previous OHSS episode or very high AFC (over 25 follicles)", recommendation: "Freeze-all IVF with GnRH agonist trigger. Discuss this explicitly with your embryologist — do not accept a standard protocol." },
        ],
        note: "Women over 35 should move through this ladder faster. If you are 37+, your doctor may reasonably recommend skipping IUI and proceeding to IVF after 2–3 failed OI cycles.",
      }),

      h2("OHSS: The Most Important Risk for PCOS Patients to Understand"),
      para(
        txt("Ovarian Hyperstimulation Syndrome (OHSS) occurs when the ovaries overrespond to fertility medications, producing too many follicles and releasing fluid into the abdomen. PCOS patients are at higher risk because they typically have a large number of antral follicles (AFC often over 20).")
      ),
      para(
        txt("Mild OHSS (bloating, discomfort) is common and resolves in 1–2 weeks. Severe OHSS is rare but can require hospitalisation. The single most effective prevention at BFI is the "),
        bold("freeze-all strategy"),
        txt(": stimulate, retrieve eggs, fertilise — then freeze all embryos and transfer in a subsequent cycle after the ovaries have settled. This approach makes severe OHSS effectively impossible.")
      ),

      highlightCard({
        badge: "PCOS Fertility Specialist",
        tagline: "Bavishi Fertility Institute has treated thousands of women with PCOS across 14 Gujarat centres — with OHSS rates well below national averages through our freeze-all protocol.",
        icon: "Egg",
        color: "rose",
        facts: [
          { label: "PCOS patients treated", value: "Thousands" },
          { label: "Success with Step 1–2", value: "~70% of PCOS patients" },
          { label: "OHSS prevention protocol", value: "Freeze-all standard" },
          { label: "Centres in Gujarat", value: "14" },
        ],
        bestSuitedFor: "Women with PCOS who want a personalised treatment ladder — starting with the simplest effective approach and only escalating when genuinely needed.",
      }),

      h2("PCOS and Fertility — The Bigger Picture"),
      para(
        txt("It is worth repeating: PCOS does not mean infertility. It means your fertility needs a more intentional approach. The vast majority of women with PCOS who seek treatment at a specialised centre go on to have the family they hoped for. The treatment pathway is well-established, and each step has a clear success rate.")
      ),
      para(
        txt("For detailed information on PCOS management, visit our "),
        link("PCOS treatment page", "/treatments/pcos"),
        txt(". To understand IUI as a treatment, read our "),
        link("guide to intrauterine insemination", "/treatments/iui"),
        txt(". For women who reach the IVF stage, our "),
        link("IVF treatment page", "/treatments/ivf"),
        txt(" explains exactly what to expect.")
      ),

      infographic({
        title: "PCOS Fertility Treatment Decision Flowchart",
        svgContent: pcosDecisionFlowchartSVG,
        altText: "Flowchart guiding a woman with PCOS through treatment decisions — from BMI and lifestyle assessment through ovulation induction, IUI, and IVF",
        caption: "Use this flowchart as a conversation guide with your specialist — the right path depends on your individual test results.",
      }),

      conclusionPanel({
        headline: "PCOS is not a barrier to motherhood — it is a diagnosis with excellent treatment options.",
        points: [
          { icon: "Leaf", text: "Start with lifestyle: 5–10% weight loss restores ovulation in ~50% of PCOS patients with BMI over 25." },
          { icon: "Droplets", text: "Letrozole is the most effective first medication — 80% ovulation rate, better live birth rates than clomiphene." },
          { icon: "Target", text: "IUI bridges the gap between oral medications and IVF — 15–22% per cycle with normal tubes." },
          { icon: "Zap", text: "If IVF is needed, a PCOS-specific low-dose freeze-all protocol keeps OHSS risk minimal and success rates high." },
          { icon: "HeartPulse", text: "Over 90% of women with PCOS who pursue the full treatment pathway achieve a pregnancy. You are very likely in that number." },
        ],
      }),

      inlineCta({
        headline: "Ready to map your PCOS fertility journey?",
        subtext: "Book a specialist assessment at Bavishi Fertility Institute. Our PCOS team will review your results and give you a clear, personalised treatment plan — starting with the simplest step that gives you the best chance.",
        accent: "rose",
        buttons: [
          { label: "Book PCOS Assessment", url: "/treatments/pcos", variant: "primary" },
          { label: "Find Your Nearest Centre", url: "/locations/ahmedabad", variant: "secondary" },
        ],
      }),
    ],
  },
};

// ---------- FAQs ----------
const faqs = [
  {
    question: "Can I get pregnant naturally if I have PCOS?",
    answer: "Yes — some women with PCOS ovulate occasionally and can conceive naturally, especially if their cycles are irregular rather than absent. However, if you have been trying for 12 months under 35 (or 6 months over 35) without success, it is time to seek a specialist assessment. PCOS-related anovulation is very treatable.",
  },
  {
    question: "What is the best fertility treatment for PCOS?",
    answer: "It depends on your weight, ovulation status, tube health, and male partner's sperm. The recommended ladder is: lifestyle changes → letrozole (ovulation induction) → IUI → IVF. Most women with PCOS succeed at the first or second step. Letrozole is currently the first-choice medication, backed by the strongest clinical evidence.",
  },
  {
    question: "Does losing weight help PCOS fertility?",
    answer: "Significantly, yes — for women with PCOS and a BMI over 25. A 5–10% reduction in body weight reduces insulin resistance, lowers androgen levels, and restores regular ovulation in approximately 50% of women. Even modest weight loss before starting fertility medications improves their effectiveness.",
  },
  {
    question: "How many IUI cycles should I try for PCOS before moving to IVF?",
    answer: "Most reproductive endocrinologists recommend 3–4 IUI cycles before moving to IVF, assuming the tubes are patent and sperm parameters are reasonable. Success rates are 15–22% per IUI cycle for PCOS patients, so cumulative success over 4 cycles is around 50–60%.",
  },
  {
    question: "Is PCOS patients at higher risk of OHSS during IVF?",
    answer: "Yes — because PCOS ovaries contain many antral follicles, they can overrespond to stimulation medications and develop OHSS. This risk is effectively managed at specialist centres through low-dose protocols, careful monitoring, and a freeze-all strategy (freezing all embryos for transfer in a subsequent cycle). Ask your clinic specifically about their OHSS prevention protocol for PCOS patients.",
  },
  {
    question: "Does PCOS affect egg quality?",
    answer: "PCOS itself does not reduce egg quality. The concern with PCOS is quantity of follicles and timing of ovulation, not egg quality. However, the elevated androgens associated with PCOS can impair follicle environment — which is one reason lifestyle intervention and Metformin (to improve insulin sensitivity) improve IVF outcomes in PCOS patients.",
  },
  {
    question: "Is letrozole or clomiphene better for PCOS fertility treatment?",
    answer: "Current evidence favours letrozole. A landmark 2014 NEJM trial showed letrozole produced higher live birth rates (27.5% vs 19.1% per cycle) with a lower multiple pregnancy rate than clomiphene in PCOS patients. Most fertility specialists now recommend letrozole as first-line. However, clomiphene is still widely used and effective.",
  },
  {
    question: "How long does it typically take to get pregnant with PCOS?",
    answer: "For women who respond to lifestyle changes or letrozole, pregnancy often occurs within 3–6 months of starting treatment. Women who progress to IUI and IVF may take 6–18 months total. The important message is that the vast majority of PCOS patients — over 90% in research studies — achieve pregnancy when they follow the treatment pathway with a specialist.",
  },
];

// ---------- Excerpt & SEO ----------
const excerpt = "PCOS is the most treatable cause of female infertility. Most women with PCOS can conceive with their own eggs using a step-by-step treatment ladder: lifestyle changes, letrozole, IUI, and (rarely) IVF. This guide covers every option with the evidence behind each step.";

const readMins = 11;

const seo = {
  metaTitle: "Fertility Treatments for PCOS — Complete Guide 2025 | Bavishi Fertility Institute",
  metaDescription: "PCOS is treatable. Learn the step-by-step fertility treatment ladder — lifestyle, letrozole, IUI, IVF — with success rates for each. PCOS specialists at 14 Gujarat centres.",
  keywords: "PCOS fertility treatment, PCOS and pregnancy, letrozole PCOS, IUI for PCOS, IVF PCOS, PCOS ovulation induction, PCOS Ahmedabad, polycystic ovary fertility",
};

// ---------- API helpers ----------
const login = async () => {
  const res = await fetch(`${BASE}/api/users/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: EMAIL, password: PASSWORD }) });
  if (!res.ok) throw new Error(`Login failed ${res.status}`);
  return (await res.json()).token;
};
const findBlog = async (slug, auth) => {
  const res = await fetch(`${BASE}/api/blogs?where[slug][equals]=${encodeURIComponent(slug)}&depth=0&limit=1&draft=true`, { headers: auth });
  const data = await res.json();
  return data.docs?.[0] ?? null;
};
const patchBlog = async (id, payload, auth) => {
  const res = await fetch(`${BASE}/api/blogs/${id}?draft=false`, { method: "PATCH", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = await res.json();
  if (!res.ok) { console.error("PATCH error:", JSON.stringify(data, null, 2)); throw new Error(`PATCH failed ${res.status}`); }
  return data;
};

const run = async () => {
  console.log(`[enrich-03] Connecting to ${BASE}...`);
  const token = await login();
  const auth = { Authorization: `JWT ${token}` };
  console.log("[enrich-03] Login OK");
  const blog = await findBlog(SLUG, auth);
  if (!blog) { console.error(`[enrich-03] Not found: ${SLUG}`); process.exit(1); }
  console.log(`[enrich-03] Found id=${blog.id} — patching...`);
  await patchBlog(blog.id, { content, faqs, excerpt, readMins, seo, author: AUTHOR_ID, reviewedBy: REVIEWER_ID, heroImage: null, _status: "published" }, auth);
  console.log(`[enrich-03] ✓ Done! ${BASE}/blog/${SLUG}`);
};

run().catch(e => { console.error("[enrich-03] FAILED:", e.message); process.exit(1); });
