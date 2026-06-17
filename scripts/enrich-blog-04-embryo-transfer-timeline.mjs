#!/usr/bin/env node
/* =============================================================================
 * enrich-blog-04-embryo-transfer-timeline.mjs
 * Enriches: post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days
 * Topic: Day-by-day timeline after embryo transfer
 * Intent: High specificity — someone who just had transfer, anxious, searching
 * Run: node scripts/enrich-blog-04-embryo-transfer-timeline.mjs
 * ============================================================================= */

const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

const SLUG = "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days";

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
const conclusionPanel = ({ headline, points }) => ({ type: "block", version: 2, fields: { id: uid(), blockType: "conclusionPanel", blockName: "", headline, points: points.map(({ icon, text }) => ({ id: uid(), icon: icon ?? null, text })) } });
const infographic = ({ title, svgContent, altText, caption }) => ({ type: "block", version: 2, fields: { id: uid(), blockType: "infographic", blockName: "", title: title ?? null, svgContent, altText, caption: caption ?? null } });
const inlineCta = ({ headline, subtext, buttons, accent }) => ({ type: "block", version: 2, fields: { id: uid(), blockType: "inlineCta", blockName: "", headline, subtext: subtext ?? null, accent: accent ?? "rose", buttons: buttons.map(({ label, url, variant }) => ({ id: uid(), label, url, variant: variant ?? "primary" })) } });
const externalImage = ({ url, alt, caption, credit }) => ({ type: "block", version: 2, fields: { id: uid(), blockType: "externalImage", blockName: "", url, alt, caption: caption ?? null, credit: credit ?? null } });

// ---------- SVG: Day-by-Day Timeline Strip ----------
const transferTimelineSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 380" font-family="Inter,system-ui,sans-serif">
  <defs>
    <linearGradient id="bgT" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0a2e"/>
      <stop offset="100%" style="stop-color:#2d1245"/>
    </linearGradient>
    <linearGradient id="timelineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3D1F56"/>
      <stop offset="40%" style="stop-color:#CF3A6A"/>
      <stop offset="70%" style="stop-color:#C5A130"/>
      <stop offset="100%" style="stop-color:#4CAF50"/>
    </linearGradient>
  </defs>
  <rect width="900" height="380" fill="url(#bgT)" rx="16"/>
  <text x="450" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="#fff">What Happens Day-by-Day After Embryo Transfer</text>
  <text x="450" y="52" text-anchor="middle" font-size="11" fill="#c9b8d8">Day 1 through Day 14 — the biology of implantation and early pregnancy</text>

  <!-- Timeline spine -->
  <rect x="40" y="80" width="820" height="8" rx="4" fill="url(#timelineGrad)"/>

  <!-- Day nodes -->
  <!-- Day 1 -->
  <circle cx="83" cy="84" r="10" fill="#3D1F56" stroke="#7b5fa0" stroke-width="2"/>
  <text x="83" y="89" text-anchor="middle" font-size="8" font-weight="700" fill="#fff">1</text>
  <rect x="43" y="102" width="80" height="80" rx="8" fill="#1f0d36" stroke="#3D1F56" stroke-width="1"/>
  <text x="83" y="118" text-anchor="middle" font-size="9" font-weight="700" fill="#7b5fa0">DAY 1</text>
  <text x="83" y="132" text-anchor="middle" font-size="9" fill="#e8d5f5">Embryo floats</text>
  <text x="83" y="145" text-anchor="middle" font-size="9" fill="#e8d5f5">freely in</text>
  <text x="83" y="158" text-anchor="middle" font-size="9" fill="#e8d5f5">the uterus</text>
  <text x="83" y="174" text-anchor="middle" font-size="8" fill="#9b8ab0">Rest day ✓</text>

  <!-- Day 2-3 -->
  <circle cx="185" cy="84" r="10" fill="#3D1F56" stroke="#7b5fa0" stroke-width="2"/>
  <text x="185" y="89" text-anchor="middle" font-size="8" font-weight="700" fill="#fff">2–3</text>
  <rect x="145" y="102" width="80" height="80" rx="8" fill="#1f0d36" stroke="#3D1F56" stroke-width="1"/>
  <text x="185" y="118" text-anchor="middle" font-size="9" font-weight="700" fill="#7b5fa0">DAYS 2–3</text>
  <text x="185" y="132" text-anchor="middle" font-size="9" fill="#e8d5f5">Hatching:</text>
  <text x="185" y="145" text-anchor="middle" font-size="9" fill="#e8d5f5">embryo sheds</text>
  <text x="185" y="158" text-anchor="middle" font-size="9" fill="#e8d5f5">zona pellucida</text>
  <text x="185" y="174" text-anchor="middle" font-size="8" fill="#9b8ab0">Mild cramps OK</text>

  <!-- Day 4-5 -->
  <circle cx="307" cy="84" r="12" fill="#CF3A6A" stroke="#ff7aa0" stroke-width="2"/>
  <text x="307" y="89" text-anchor="middle" font-size="8" font-weight="700" fill="#fff">4–5</text>
  <rect x="263" y="102" width="88" height="88" rx="8" fill="#2d0f1e" stroke="#CF3A6A" stroke-width="2"/>
  <text x="307" y="118" text-anchor="middle" font-size="9" font-weight="700" fill="#CF3A6A">DAYS 4–5 ★</text>
  <text x="307" y="132" text-anchor="middle" font-size="9" fill="#fff">IMPLANTATION</text>
  <text x="307" y="145" text-anchor="middle" font-size="9" fill="#e8d5f5">Embryo attaches</text>
  <text x="307" y="158" text-anchor="middle" font-size="9" fill="#e8d5f5">to uterine lining</text>
  <text x="307" y="172" text-anchor="middle" font-size="8" fill="#CF3A6A">Light spotting</text>
  <text x="307" y="183" text-anchor="middle" font-size="8" fill="#CF3A6A">is normal</text>

  <!-- Day 6-7 -->
  <circle cx="430" cy="84" r="10" fill="#5a2f7a" stroke="#9b6fc0" stroke-width="2"/>
  <text x="430" y="89" text-anchor="middle" font-size="8" font-weight="700" fill="#fff">6–7</text>
  <rect x="390" y="102" width="80" height="80" rx="8" fill="#1f0d36" stroke="#5a2f7a" stroke-width="1"/>
  <text x="430" y="118" text-anchor="middle" font-size="9" font-weight="700" fill="#b8a0e0">DAYS 6–7</text>
  <text x="430" y="132" text-anchor="middle" font-size="9" fill="#e8d5f5">hCG hormone</text>
  <text x="430" y="145" text-anchor="middle" font-size="9" fill="#e8d5f5">production</text>
  <text x="430" y="158" text-anchor="middle" font-size="9" fill="#e8d5f5">begins</text>
  <text x="430" y="174" text-anchor="middle" font-size="8" fill="#9b8ab0">Still below test threshold</text>

  <!-- Day 8-9 -->
  <circle cx="550" cy="84" r="10" fill="#5a2f7a" stroke="#9b6fc0" stroke-width="2"/>
  <text x="550" y="89" text-anchor="middle" font-size="8" font-weight="700" fill="#fff">8–9</text>
  <rect x="510" y="102" width="80" height="80" rx="8" fill="#1f0d36" stroke="#5a2f7a" stroke-width="1"/>
  <text x="550" y="118" text-anchor="middle" font-size="9" font-weight="700" fill="#b8a0e0">DAYS 8–9</text>
  <text x="550" y="132" text-anchor="middle" font-size="9" fill="#e8d5f5">hCG rises</text>
  <text x="550" y="145" text-anchor="middle" font-size="9" fill="#e8d5f5">rapidly;</text>
  <text x="550" y="158" text-anchor="middle" font-size="9" fill="#e8d5f5">some feel</text>
  <text x="550" y="174" text-anchor="middle" font-size="8" fill="#9b8ab0">breast tenderness</text>

  <!-- Day 10-11 -->
  <circle cx="665" cy="84" r="12" fill="#C5A130" stroke="#d4b84a" stroke-width="2"/>
  <text x="665" y="89" text-anchor="middle" font-size="8" font-weight="700" fill="#1a0a2e">10–11</text>
  <rect x="621" y="102" width="88" height="88" rx="8" fill="#2d1a00" stroke="#C5A130" stroke-width="2"/>
  <text x="665" y="118" text-anchor="middle" font-size="9" font-weight="700" fill="#C5A130">DAYS 10–11 ★</text>
  <text x="665" y="132" text-anchor="middle" font-size="9" fill="#fff">hCG detectable</text>
  <text x="665" y="145" text-anchor="middle" font-size="9" fill="#e8d5f5">in blood test</text>
  <text x="665" y="158" text-anchor="middle" font-size="9" fill="#e8d5f5">Earliest reliable</text>
  <text x="665" y="172" text-anchor="middle" font-size="8" fill="#C5A130">beta hCG point</text>
  <text x="665" y="183" text-anchor="middle" font-size="8" fill="#C5A130">(blood, not urine)</text>

  <!-- Day 12-14 -->
  <circle cx="820" cy="84" r="14" fill="#4CAF50" stroke="#6fcf74" stroke-width="2"/>
  <text x="820" y="89" text-anchor="middle" font-size="8" font-weight="700" fill="#fff">12–14</text>
  <rect x="773" y="102" width="88" height="88" rx="8" fill="#0d2e0d" stroke="#4CAF50" stroke-width="2"/>
  <text x="817" y="118" text-anchor="middle" font-size="9" font-weight="700" fill="#4CAF50">DAYS 12–14 ✓</text>
  <text x="817" y="132" text-anchor="middle" font-size="9" fill="#fff">Official</text>
  <text x="817" y="145" text-anchor="middle" font-size="9" fill="#e8d5f5">pregnancy test</text>
  <text x="817" y="158" text-anchor="middle" font-size="9" fill="#e8d5f5">Beta hCG blood</text>
  <text x="817" y="172" text-anchor="middle" font-size="8" fill="#4CAF50">test day ✓</text>

  <!-- Legend -->
  <rect x="40" y="212" width="820" height="50" rx="8" fill="#1f0d36" stroke="#3D1F56" stroke-width="1"/>
  <circle cx="70" cy="237" r="6" fill="#CF3A6A"/>
  <text x="82" y="241" font-size="10" fill="#e8d5f5">Key implantation window (Days 4–5)</text>
  <circle cx="270" cy="237" r="6" fill="#C5A130"/>
  <text x="282" y="241" font-size="10" fill="#e8d5f5">Earliest blood hCG detection (Days 10–11)</text>
  <circle cx="510" cy="237" r="6" fill="#4CAF50"/>
  <text x="522" y="241" font-size="10" fill="#e8d5f5">Official BFT blood test day (Days 12–14)</text>
  <text x="450" y="256" text-anchor="middle" font-size="9" fill="#9b8ab0">★ These are biologically driven events — there is nothing you do or don't do that changes them.</text>

  <!-- Bottom guidance -->
  <text x="450" y="300" text-anchor="middle" font-size="12" font-weight="600" fill="#CF3A6A">Do NOT test early — a negative on Day 8 means nothing. Wait for Day 12 blood test.</text>
  <text x="450" y="320" text-anchor="middle" font-size="11" fill="#c9b8d8">Home urine tests can show false negatives until Day 12–14 due to hCG levels still rising.</text>
  <text x="450" y="348" text-anchor="middle" font-size="10" fill="#7b5fa0">Bavishi Fertility Institute · Post-Transfer Support · Ahmedabad, Gujarat</text>
</svg>`;

// ---------- SVG: Embryo Development Stages ----------
const embryoDevelopmentSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 280" font-family="Inter,system-ui,sans-serif">
  <defs>
    <linearGradient id="bgE" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0a2e"/>
      <stop offset="100%" style="stop-color:#2d1245"/>
    </linearGradient>
  </defs>
  <rect width="800" height="280" fill="url(#bgE)" rx="16"/>
  <text x="400" y="30" text-anchor="middle" font-size="15" font-weight="700" fill="#fff">Embryo Development After IVF — Day 0 to Day 5</text>
  <text x="400" y="48" text-anchor="middle" font-size="10" fill="#c9b8d8">What happens in the embryology lab before your embryo is transferred</text>

  <!-- Day 0: Fertilised egg (zygote) -->
  <circle cx="80" cy="148" r="32" fill="none" stroke="#C5A130" stroke-width="2"/>
  <circle cx="80" cy="148" r="20" fill="#2d1a00" stroke="#C5A130" stroke-width="1"/>
  <circle cx="74" cy="142" r="7" fill="#C5A130" opacity="0.7"/>
  <circle cx="87" cy="154" r="7" fill="#C5A130" opacity="0.5"/>
  <text x="80" y="195" text-anchor="middle" font-size="10" font-weight="700" fill="#C5A130">Day 0</text>
  <text x="80" y="208" text-anchor="middle" font-size="9" fill="#e8d5f5">Zygote</text>
  <text x="80" y="220" text-anchor="middle" font-size="9" fill="#e8d5f5">(fertilised)</text>

  <!-- Arrow -->
  <line x1="118" y1="148" x2="148" y2="148" stroke="#CF3A6A" stroke-width="1.5"/>
  <polygon points="148,144 156,148 148,152" fill="#CF3A6A"/>

  <!-- Day 2: 4-cell -->
  <circle cx="200" cy="148" r="32" fill="none" stroke="#7b3fa0" stroke-width="2"/>
  <circle cx="191" cy="139" r="10" fill="#3D1F56" stroke="#7b3fa0" stroke-width="1"/>
  <circle cx="209" cy="139" r="10" fill="#3D1F56" stroke="#7b3fa0" stroke-width="1"/>
  <circle cx="191" cy="157" r="10" fill="#3D1F56" stroke="#7b3fa0" stroke-width="1"/>
  <circle cx="209" cy="157" r="10" fill="#3D1F56" stroke="#7b3fa0" stroke-width="1"/>
  <text x="200" y="195" text-anchor="middle" font-size="10" font-weight="700" fill="#b8a0e0">Day 2</text>
  <text x="200" y="208" text-anchor="middle" font-size="9" fill="#e8d5f5">4-Cell</text>
  <text x="200" y="220" text-anchor="middle" font-size="9" fill="#e8d5f5">embryo</text>

  <!-- Arrow -->
  <line x1="238" y1="148" x2="268" y2="148" stroke="#CF3A6A" stroke-width="1.5"/>
  <polygon points="268,144 276,148 268,152" fill="#CF3A6A"/>

  <!-- Day 3: 8-cell (transfer option) -->
  <circle cx="320" cy="148" r="32" fill="none" stroke="#CF3A6A" stroke-width="2.5"/>
  <circle cx="310" cy="138" r="8" fill="#2d0f1e" stroke="#CF3A6A" stroke-width="1"/>
  <circle cx="330" cy="138" r="8" fill="#2d0f1e" stroke="#CF3A6A" stroke-width="1"/>
  <circle cx="308" cy="150" r="8" fill="#2d0f1e" stroke="#CF3A6A" stroke-width="1"/>
  <circle cx="332" cy="150" r="8" fill="#2d0f1e" stroke="#CF3A6A" stroke-width="1"/>
  <circle cx="313" cy="162" r="8" fill="#2d0f1e" stroke="#CF3A6A" stroke-width="1"/>
  <circle cx="328" cy="162" r="8" fill="#2d0f1e" stroke="#CF3A6A" stroke-width="1"/>
  <text x="320" y="195" text-anchor="middle" font-size="10" font-weight="700" fill="#CF3A6A">Day 3 ★</text>
  <text x="320" y="208" text-anchor="middle" font-size="9" fill="#e8d5f5">8-Cell</text>
  <text x="320" y="220" text-anchor="middle" font-size="9" fill="#CF3A6A">Transfer option</text>

  <!-- Arrow -->
  <line x1="358" y1="148" x2="388" y2="148" stroke="#CF3A6A" stroke-width="1.5"/>
  <polygon points="388,144 396,148 388,152" fill="#CF3A6A"/>

  <!-- Day 4: Morula -->
  <circle cx="440" cy="148" r="32" fill="none" stroke="#5a2f7a" stroke-width="2"/>
  <circle cx="440" cy="148" r="22" fill="#2d1245"/>
  <circle cx="434" cy="143" r="6" fill="#5a2f7a" opacity="0.8"/>
  <circle cx="447" cy="142" r="6" fill="#5a2f7a" opacity="0.8"/>
  <circle cx="440" cy="152" r="6" fill="#5a2f7a" opacity="0.8"/>
  <circle cx="431" cy="153" r="5" fill="#5a2f7a" opacity="0.6"/>
  <circle cx="450" cy="153" r="5" fill="#5a2f7a" opacity="0.6"/>
  <text x="440" y="195" text-anchor="middle" font-size="10" font-weight="700" fill="#b8a0e0">Day 4</text>
  <text x="440" y="208" text-anchor="middle" font-size="9" fill="#e8d5f5">Morula</text>
  <text x="440" y="220" text-anchor="middle" font-size="9" fill="#e8d5f5">(compacting)</text>

  <!-- Arrow -->
  <line x1="478" y1="148" x2="508" y2="148" stroke="#CF3A6A" stroke-width="1.5"/>
  <polygon points="508,144 516,148 508,152" fill="#CF3A6A"/>

  <!-- Day 5: Blastocyst (preferred) -->
  <circle cx="565" cy="148" r="38" fill="none" stroke="#C5A130" stroke-width="3"/>
  <circle cx="565" cy="148" r="26" fill="#2d1a00" stroke="#C5A130" stroke-width="1"/>
  <ellipse cx="552" cy="145" rx="14" ry="10" fill="#C5A130" opacity="0.4"/>
  <circle cx="572" cy="148" r="6" fill="#C5A130" opacity="0.8"/>
  <circle cx="558" cy="152" r="5" fill="#C5A130" opacity="0.6"/>
  <text x="565" y="202" text-anchor="middle" font-size="10" font-weight="700" fill="#C5A130">Day 5 ★★</text>
  <text x="565" y="215" text-anchor="middle" font-size="9" fill="#fff">Blastocyst</text>
  <text x="565" y="227" text-anchor="middle" font-size="9" fill="#C5A130">Best for transfer</text>

  <!-- Arrow -->
  <line x1="609" y1="148" x2="638" y2="148" stroke="#CF3A6A" stroke-width="1.5"/>
  <polygon points="638,144 646,148 638,152" fill="#CF3A6A"/>

  <!-- Day 6: Hatching blastocyst -->
  <circle cx="700" cy="148" r="36" fill="none" stroke="#4CAF50" stroke-width="2.5" stroke-dasharray="8,4"/>
  <circle cx="700" cy="148" r="24" fill="#0d2e0d" stroke="#4CAF50" stroke-width="1"/>
  <ellipse cx="688" cy="144" rx="12" ry="9" fill="#4CAF50" opacity="0.4"/>
  <circle cx="706" cy="148" r="6" fill="#4CAF50" opacity="0.7"/>
  <text x="700" y="202" text-anchor="middle" font-size="10" font-weight="700" fill="#4CAF50">Day 6</text>
  <text x="700" y="215" text-anchor="middle" font-size="9" fill="#e8d5f5">Hatching</text>
  <text x="700" y="227" text-anchor="middle" font-size="9" fill="#4CAF50">Implantation ↓</text>

  <!-- Bottom note -->
  <text x="400" y="258" text-anchor="middle" font-size="10" fill="#9b8ab0">★ Day 3 transfers and Day 5 (blastocyst) transfers follow different implantation timelines — see table below.</text>
</svg>`;

// ---------- Content ----------
const content = {
  root: {
    type: "root", format: "", indent: 0, version: 1, direction: "ltr",
    children: [
      // Direct answer
      para(
        bold("Implantation — when the embryo attaches to your uterine lining — typically happens on Days 3–5 after a Day 5 (blastocyst) transfer, or Days 5–7 after a Day 3 transfer."),
        txt(" The earliest a blood pregnancy test (beta hCG) can reliably detect a positive result is Day 10–12 after transfer. The official test day your clinic schedules is almost always Day 12–14. There is nothing you can do to speed this up, and testing earlier only causes unnecessary distress from false negatives.")
      ),
      para(
        txt("If you've just had your embryo transfer and you're reading this at 2am wondering what's happening inside your body — this guide is for you. Every day has a biological story, and knowing it can replace anxiety with understanding.")
      ),

      externalImage({
        url: "https://images.pexels.com/photos/8533045/pexels-photo-8533045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: "Embryologist examining embryos through a laboratory microscope — the science behind IVF embryo selection and transfer",
        caption: "An embryologist selects the highest-quality blastocyst for transfer. The lab work happens before your two-week wait begins.",
        credit: "Photo: Pexels",
      }),

      statStrip([
        { value: "Day 3–5",  label: "When implantation begins" },
        { value: "Day 10–11", label: "hCG detectable in blood" },
        { value: "Day 12–14", label: "Official pregnancy test day" },
        { value: "65%",      label: "Success rate (blastocyst, under 35)" },
      ]),

      h2("Day-by-Day Timeline: What's Happening Inside"),
      infographic({
        title: "Post-Embryo Transfer Day-by-Day Timeline",
        svgContent: transferTimelineSVG,
        altText: "Timeline strip showing what happens biologically on each day after embryo transfer — from Day 1 floating through implantation on Days 4-5 to the official pregnancy test on Days 12-14",
        caption: "The two-week wait feels endless, but every day has a biological purpose. Nothing you do or don't do changes this sequence.",
      }),

      h2("The Full Day-by-Day Biological Story"),

      h3("Day 1: The embryo settles in"),
      para(
        txt("Immediately after transfer, your embryo sits in the uterine cavity, suspended in culture medium. It does "),
        bold("not"),
        txt(" implant on Day 1 — it floats freely, still enclosed in its protective shell (zona pellucida). Your uterus is not indifferent to it; the endometrial lining continues producing the receptive signals that began with your progesterone support. Rest is advised on transfer day, but strict bed rest is not supported by evidence.")
      ),

      h3("Days 2–3: Hatching"),
      para(
        txt("The embryo begins to 'hatch' out of the zona pellucida — a process called zona hatching. This is necessary before implantation can occur; the embryo must be free from its shell to make contact with the endometrium. Some embryos are assisted with a laser 'assisted hatching' in the lab before transfer, which slightly accelerates this process.")
      ),
      para(
        txt("Mild cramping in Days 2–3 is normal and often reported. It does not mean anything has gone wrong — it can reflect uterine activity or the progesterone support you're taking.")
      ),

      h3("Days 4–5: Implantation — the most important moment"),
      para(
        txt("This is the moment that determines whether pregnancy occurs. The now-hatched embryo "),
        bold("contacts and adheres to the endometrial lining"),
        txt(", then begins to burrow into it — a process called invasion. Implantation triggers a cascade of hormonal changes and begins the formation of the placenta.")
      ),
      para(
        txt("Light spotting (implantation bleeding) is experienced by around 25–30% of women during this window. It is typically pink or light brown, very light, and lasts 1–2 days. It does not predict success or failure. Heavy bleeding or bright red blood should be reported to your clinic.")
      ),
      tip("Implantation bleeding is easily confused with the start of a period — but it is typically much lighter in colour and quantity. If you are unsure, note the colour (brown/pink = more likely implantation; bright red = call your clinic)."),

      h3("Days 6–7: hCG production begins"),
      para(
        txt("Once implanted, the embryo's outer layer (trophoblast) begins producing human chorionic gonadotropin (hCG) — the pregnancy hormone. In the first days, levels are too low to detect on either a blood test or a home urine test. hCG doubles approximately every 48–72 hours in a healthy early pregnancy.")
      ),

      h3("Days 8–9: hCG rising, but still below test threshold"),
      para(
        txt("hCG is rising exponentially, but at Days 8–9, many home urine tests will still show a negative result — because urine hCG lags behind blood hCG by 1–2 days, and the sensitivity threshold of most home tests is 20–25 mIU/mL. Some women notice early symptoms (breast tenderness, nausea, fatigue) during this window — these are driven by the progesterone support as much as by hCG.")
      ),

      h3("Days 10–11: Earliest reliable blood hCG detection"),
      para(
        txt("By Day 10–11, a quantitative serum beta hCG blood test can reliably detect pregnancy. "),
        bold("This is not the same as the official test day — that is Days 12–14."),
        txt(" Some patients opt for an early blood test at Day 10 to reduce anxiety, but the result must be interpreted carefully: a low positive is not a negative result; hCG simply needs time to rise to confidently detectable levels. If your clinic offers an early beta, discuss what the result means before testing.")
      ),

      h3("Days 12–14: The official blood pregnancy test"),
      para(
        txt("This is the day your embryology team scheduled your beta hCG test for a reason: at Day 12–14, hCG levels are high enough to give a clear, unambiguous result. A positive confirms clinical pregnancy. Your clinic will tell you the exact number and schedule a follow-up test 48 hours later to confirm that hCG is rising appropriately (doubling every 48–72 hours indicates a healthy pregnancy).")
      ),

      h2("Day 3 Transfer vs Day 5 (Blastocyst) Transfer: Different Timelines"),
      comparisonTable(
        "Milestone",
        ["Day 3 (Cleavage) Transfer", "Day 5 (Blastocyst) Transfer"],
        [
          { label: "Embryo stage at transfer", cells: ["8-cell cleavage embryo", "Expanded or hatching blastocyst"] },
          { label: "Hatching in uterus", cells: ["Days 1–2 post-transfer", "Already hatching or hatched at transfer"] },
          { label: "Implantation window", cells: ["Days 3–5 post-transfer", "Days 1–3 post-transfer"] },
          { label: "hCG first detectable (blood)", cells: ["Days 10–12 post-transfer", "Days 8–10 post-transfer"] },
          { label: "Official beta hCG test", cells: ["Day 14–15 post-transfer", "Day 12–14 post-transfer"] },
          { label: "Success rate (under 35)", cells: ["~40–50% per transfer", "~55–65% per transfer"] },
          { label: "When recommended", cells: ["Fewer embryos, slow development, poor blastocyst formation", "Standard; more embryos available; allows selection of best"] },
        ]
      ),
      para(
        txt("If you had a Day 3 transfer, shift all the dates in this guide forward by approximately 2 days. Your implantation window is later, your hCG detection is later, and your official test day is 2 days later than a Day 5 patient.")
      ),

      h2("Normal Symptoms During the Two-Week Wait"),
      h3("Symptoms you may experience (all normal)"),
      ul(
        "Mild cramping or pelvic pressure — common throughout; does not predict outcome",
        "Light spotting, pink or brown (Days 4–7) — possible implantation bleeding",
        "Breast tenderness — from progesterone support medication, not necessarily pregnancy",
        "Bloating — from the ovarian stimulation and progesterone",
        "Fatigue — extremely common; rest is a good idea regardless",
        "Mild nausea — possible from progesterone pessaries or early hCG",
        "Emotional sensitivity — entirely expected; be kind to yourself"
      ),

      h3("When to call your clinic — don't wait"),
      ul(
        "Heavy bright red vaginal bleeding (more than a light period)",
        "Severe cramping or abdominal pain that is not relieved by rest",
        "High fever (over 38°C) or signs of infection",
        "Signs of OHSS: severe bloating, difficulty breathing, reduced urine output (if you had egg retrieval recently)",
        "Sudden absence of ALL symptoms after having had some — while symptom fluctuation is normal, discuss concerns"
      ),

      h2("What To Do and What To Avoid"),
      h3("What helps"),
      ul(
        "Take your prescribed progesterone (pessaries, injections, or gel) exactly as directed — this is the most important thing",
        "Stay gently active: light walking is fine and beneficial; do not stay in bed unless your doctor says so",
        "Eat normally — no evidence that any specific food helps or harms implantation",
        "Stay hydrated — especially important if you had egg retrieval recently",
        "Do things you enjoy: work, gentle socialising, distraction is genuinely helpful"
      ),

      h3("What to avoid"),
      ul(
        "Avoid strenuous exercise, heavy lifting, and high-impact activity for the first 5 days",
        "Avoid baths, swimming pools, and steam rooms (showers are fine)",
        "Avoid alcohol and smoking throughout the two-week wait",
        "Do not stop progesterone without your doctor's instruction — even if you get a negative test",
        "Avoid home urine pregnancy tests before Day 10 — they cause unnecessary distress and are unreliable this early"
      ),

      h2("Embryo Development Stages — What the Embryologists See"),
      infographic({
        title: "Embryo Development: Day 0 to Day 6",
        svgContent: embryoDevelopmentSVG,
        altText: "Visual diagram of embryo development stages from fertilised egg (zygote) on Day 0 through 4-cell, 8-cell, morula, blastocyst, and hatching blastocyst stages",
        caption: "Day 5 blastocysts have higher implantation rates than Day 3 embryos because they have undergone more selection — only the strongest embryos reach blastocyst stage.",
      }),

      highlightCard({
        badge: "Post-Transfer Support",
        tagline: "Your Bavishi Fertility Institute team is available throughout the two-week wait. Any symptom concerns — call us. We have heard every question before, and no question is too small.",
        icon: "HeartPulse",
        color: "rose",
        facts: [
          { label: "Transfer success rate (under 35)", value: "Up to 65%" },
          { label: "Official test day", value: "Day 12–14" },
          { label: "Nurse helpline", value: "Available 7 days" },
          { label: "Centres in Gujarat", value: "14" },
        ],
        bestSuitedFor: "Patients who want clear, evidence-based information during the two-week wait — and a team that is genuinely available when questions arise at any hour.",
      }),

      h2("The Two-Week Wait: An Honest Emotional Guide"),
      para(
        txt("The two-week wait after embryo transfer is one of the most emotionally intense experiences in the IVF journey. You have done everything right. The embryo has been placed. And now — you wait. You cannot control what happens next, and that is profoundly difficult.")
      ),
      para(
        txt("A few truths that may help:")
      ),
      ul(
        "Nothing you do during the two-week wait can dislodge a well-placed embryo. It is not fragile. You will not 'shake it loose' by walking, working, or having an emotion.",
        "Symptom-watching is a trap. The progesterone you are taking mimics every early pregnancy symptom. Having no symptoms does not mean a negative result. Having strong symptoms does not guarantee a positive.",
        "It is normal to feel hope and dread simultaneously. You are allowed to feel both.",
        "Distraction is a legitimate coping strategy — work, gentle exercise, films, time with people who are not obsessively asking how you're feeling.",
        "If the result is negative, you will grieve — and you will need support. Tell someone close to you what is happening, if you can."
      ),
      tip("Many BFI patients find it helpful to write down the things they are grateful for each evening during the two-week wait — not as a manifestation exercise, but simply to have something to focus the mind on other than symptom analysis."),

      inlineCta({
        headline: "Questions after your transfer? Our nurses are here.",
        subtext: "WhatsApp or call our nurse helpline with any post-transfer question — symptoms, medication queries, or just reassurance. We are here for you throughout the two-week wait.",
        accent: "rose",
        buttons: [
          { label: "WhatsApp Our Nursing Team", url: "https://wa.me/919099020202", variant: "primary" },
          { label: "About IVF at BFI", url: "/treatments/ivf", variant: "secondary" },
        ],
      }),

      para(
        txt("For a full overview of the IVF process, visit our "),
        link("IVF treatment guide", "/treatments/ivf"),
        txt(". If you had a blastocyst transfer, read more about "),
        link("blastocyst culture and transfer", "/treatments/blastocyst-transfer"),
        txt(" at BFI.")
      ),

      conclusionPanel({
        headline: "The two-week wait is the hardest part — but you are not alone in it.",
        points: [
          { icon: "CalendarCheck", text: "Implantation happens on Days 3–5 after a blastocyst transfer. It is complete and silent — no sensation will tell you it worked." },
          { icon: "Activity", text: "hCG is detectable in blood from Day 10–11. The official test day (Day 12–14) gives the most reliable result." },
          { icon: "HeartPulse", text: "Cramping, spotting, and breast tenderness are all normal. Heavy bleeding or severe pain should be reported immediately." },
          { icon: "ShieldCheck", text: "Take your progesterone. Do not stop. Even if you see a negative test — check with your clinic before stopping support medication." },
          { icon: "Sparkles", text: "You have done everything you can. The rest is biology doing its extraordinary work. We are with you every step." },
        ],
      }),
    ],
  },
};

// ---------- FAQs ----------
const faqs = [
  {
    question: "When does implantation happen after embryo transfer?",
    answer: "For a Day 5 (blastocyst) transfer, implantation typically begins on Days 1–3 after transfer (which corresponds to Days 6–8 of embryo development). For a Day 3 transfer, implantation begins around Days 3–5 after transfer. Implantation is a process, not a single moment — it takes 3–4 days from initial contact to full invasion of the endometrium.",
  },
  {
    question: "What are normal symptoms after embryo transfer?",
    answer: "Normal symptoms include mild pelvic cramping or pressure, light spotting (especially Days 3–7), breast tenderness, bloating, fatigue, and mild nausea. Most of these are caused by the progesterone medication you're taking, not necessarily early pregnancy. Importantly, having no symptoms does not mean a negative result — many successful pregnancies have no symptoms at all during the two-week wait.",
  },
  {
    question: "When can I take a pregnancy test after embryo transfer?",
    answer: "Your clinic will schedule an official blood (beta hCG) test on Day 12–14 after transfer. Blood tests can sometimes detect hCG as early as Day 10. Home urine tests should not be used before Day 10–12 as they are unreliable this early and will cause unnecessary distress from false negatives. Wait for the blood test your clinic scheduled.",
  },
  {
    question: "Is cramping after embryo transfer a sign of implantation?",
    answer: "Cramping is extremely common after embryo transfer and does not reliably indicate either implantation or failure. The transfer procedure itself, progesterone pessaries, and normal uterine activity all cause cramping. Light implantation spotting (pink/brown) accompanied by mild cramps between Days 3–7 is a possible (but not definitive) sign of implantation.",
  },
  {
    question: "Can I exercise or do normal activities after embryo transfer?",
    answer: "Light activity is fine and encouraged — gentle walking, normal daily life, work. There is no evidence that bed rest improves success rates after embryo transfer, and prolonged bed rest can actually increase anxiety. Avoid strenuous exercise, heavy lifting, high-impact activity, and swimming for the first 5 days. After Day 5, your usual gentle exercise routine is generally safe — check with your clinic.",
  },
  {
    question: "What happens if I test early and get a negative result?",
    answer: "A negative home urine test before Day 10 means almost nothing — hCG levels may simply not have risen high enough to trigger the test yet. Many women who eventually test positive on Day 12 have tested negative on Day 8 or 9. Testing early increases anxiety without providing useful information. Please wait for the blood test your clinic has scheduled.",
  },
  {
    question: "What does a Day 3 vs Day 5 embryo transfer timeline difference mean for testing?",
    answer: "If you had a Day 3 transfer, shift all dates in this guide forward by approximately 2 days. Implantation happens slightly later (Days 3–5 post-transfer), hCG is detectable slightly later (Days 10–12), and the official test day is typically Day 14–15 rather than Day 12–14. Your clinic will schedule your test accordingly.",
  },
  {
    question: "Is light spotting after embryo transfer normal?",
    answer: "Yes — light spotting is experienced by 25–30% of women after embryo transfer. It can be caused by the transfer procedure itself (Day 1), implantation bleeding (Days 3–7), or progesterone pessaries. Implantation spotting is typically light pink or brown, very light in flow, and lasts 1–2 days. Heavy bleeding, bright red blood, or soaking a pad should be reported to your clinic immediately.",
  },
];

// ---------- Excerpt & SEO ----------
const excerpt = "Implantation begins 3–5 days after a blastocyst transfer. The earliest blood pregnancy test is Day 10–11; the official test is Day 12–14. This guide walks you through every day of the two-week wait — the biology, normal symptoms, and what your embryo is actually doing.";

const readMins = 12;

const seo = {
  metaTitle: "Post-Embryo Transfer Timeline: Day-by-Day Guide | Bavishi Fertility Institute",
  metaDescription: "What happens day by day after embryo transfer? Implantation on Days 3–5, hCG detectable Day 10–11, official test Day 12–14. Complete two-week wait guide by BFI specialists.",
  keywords: "embryo transfer timeline, what happens after embryo transfer, implantation after IVF, two week wait IVF, beta hCG after transfer, embryo transfer day by day, IVF two week wait symptoms",
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

const lookupAuthors = async (auth) => {
  const res = await fetch(`${BASE}/api/authors?limit=50&depth=0`, { headers: auth });
  const data = await res.json();
  const parth    = data.docs?.find(a => a.name === "Dr. Parth Bavishi");
  const himanshu = data.docs?.find(a => a.name === "Dr. Himanshu Bavishi");
  if (!parth || !himanshu) throw new Error("Author not found in DB");
  return { AUTHOR_ID: parth.id, REVIEWER_ID: himanshu.id };
};

const run = async () => {
  console.log(`[enrich-04] Connecting to ${BASE}...`);
  const token = await login();
  const auth = { Authorization: `JWT ${token}` };
  console.log("[enrich-04] Login OK");
  const { AUTHOR_ID, REVIEWER_ID } = await lookupAuthors(auth);
  const blog = await findBlog(SLUG, auth);
  if (!blog) { console.error(`[enrich-04] Not found: ${SLUG}`); process.exit(1); }
  console.log(`[enrich-04] Found id=${blog.id} — patching...`);
  await patchBlog(blog.id, { content, faqs, excerpt, readMins, seo, author: AUTHOR_ID, reviewedBy: REVIEWER_ID, heroImage: null, _status: "published" }, auth);
  console.log(`[enrich-04] ✓ Done! ${BASE}/blog/${SLUG}`);
};

run().catch(e => { console.error("[enrich-04] FAILED:", e.message); process.exit(1); });
