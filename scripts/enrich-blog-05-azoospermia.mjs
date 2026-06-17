#!/usr/bin/env node
/* =============================================================================
 * enrich-blog-05-azoospermia.mjs
 * Enriches: azoospermia-can-you-have-a-baby-with-zero-sperm-count
 * Topic: Azoospermia — zero sperm count, can you have a baby?
 * Intent: Emotional BOFU — man/couple just received azoospermia diagnosis
 * Run: node scripts/enrich-blog-05-azoospermia.mjs
 * ============================================================================= */

const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

const SLUG = "azoospermia-can-you-have-a-baby-with-zero-sperm-count";

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

// ---------- SVG: Obstructive vs Non-Obstructive Azoospermia ----------
const azoospermiaSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 440" font-family="Inter,system-ui,sans-serif">
  <defs>
    <linearGradient id="bgA" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0a2e"/>
      <stop offset="100%" style="stop-color:#2d1245"/>
    </linearGradient>
    <linearGradient id="obG" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#C5A130"/>
      <stop offset="100%" style="stop-color:#d4b84a"/>
    </linearGradient>
    <linearGradient id="nonG" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#CF3A6A"/>
      <stop offset="100%" style="stop-color:#e05c85"/>
    </linearGradient>
  </defs>
  <rect width="800" height="440" fill="url(#bgA)" rx="16"/>
  <text x="400" y="34" text-anchor="middle" font-size="17" font-weight="700" fill="#fff">Azoospermia: The Two Types Explained</text>
  <text x="400" y="52" text-anchor="middle" font-size="11" fill="#c9b8d8">Understanding your type is the first step to knowing your treatment options</text>

  <!-- Left: Obstructive -->
  <rect x="30" y="66" width="360" height="330" rx="12" fill="#1f0d36" stroke="#C5A130" stroke-width="1.5"/>
  <rect x="30" y="66" width="360" height="40" rx="12" fill="url(#obG)"/>
  <rect x="30" y="90" width="360" height="16" fill="url(#obG)"/>
  <text x="210" y="92" text-anchor="middle" font-size="14" font-weight="700" fill="#1a0a2e">OBSTRUCTIVE AZOOSPERMIA</text>

  <!-- Anatomy diagram - left -->
  <!-- Testis -->
  <ellipse cx="130" cy="180" rx="40" ry="35" fill="#2d1a00" stroke="#C5A130" stroke-width="2"/>
  <text x="130" y="176" text-anchor="middle" font-size="9" fill="#C5A130">TESTIS</text>
  <text x="130" y="188" text-anchor="middle" font-size="8" fill="#e8d5f5">Sperm produced</text>
  <text x="130" y="199" text-anchor="middle" font-size="8" fill="#4CAF50">✓ normally</text>

  <!-- Blocked vas deferens -->
  <line x1="170" y1="175" x2="240" y2="175" stroke="#C5A130" stroke-width="3"/>
  <rect x="228" y="163" width="24" height="24" rx="4" fill="#CF3A6A"/>
  <text x="240" y="178" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">✗</text>
  <text x="240" y="210" text-anchor="middle" font-size="8" fill="#CF3A6A">BLOCKAGE</text>
  <text x="240" y="222" text-anchor="middle" font-size="8" fill="#e8d5f5">(vas deferens,</text>
  <text x="240" y="234" text-anchor="middle" font-size="8" fill="#e8d5f5">epididymis, or</text>
  <text x="240" y="246" text-anchor="middle" font-size="8" fill="#e8d5f5">ejaculatory duct)</text>

  <!-- Sperm blocked indicator -->
  <line x1="310" y1="175" x2="355" y2="175" stroke="#3D1F56" stroke-width="3" stroke-dasharray="6,4"/>
  <text x="355" y="170" font-size="18" fill="#3D1F56">→</text>

  <!-- Stats block -->
  <rect x="46" y="268" width="328" height="78" rx="8" fill="#2d1a00" stroke="#C5A130" stroke-width="1"/>
  <text x="210" y="286" text-anchor="middle" font-size="11" font-weight="700" fill="#C5A130">Key Facts — Obstructive</text>
  <text x="210" y="302" text-anchor="middle" font-size="10" fill="#e8d5f5">Sperm are being made — they just can't get out</text>
  <text x="210" y="318" text-anchor="middle" font-size="10" fill="#C5A130">Sperm retrieval success rate: Over 90%</text>
  <text x="210" y="332" text-anchor="middle" font-size="10" fill="#e8d5f5">Common causes: vasectomy, CBAVD, infection, injury</text>

  <!-- Right: Non-Obstructive -->
  <rect x="410" y="66" width="360" height="330" rx="12" fill="#1f0d36" stroke="#CF3A6A" stroke-width="1.5"/>
  <rect x="410" y="66" width="360" height="40" rx="12" fill="url(#nonG)"/>
  <rect x="410" y="90" width="360" height="16" fill="url(#nonG)"/>
  <text x="590" y="92" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">NON-OBSTRUCTIVE AZOOSPERMIA</text>

  <!-- Anatomy diagram - right -->
  <!-- Testis with impaired production -->
  <ellipse cx="510" cy="180" rx="40" ry="35" fill="#2d0f1e" stroke="#CF3A6A" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="510" y="170" text-anchor="middle" font-size="9" fill="#CF3A6A">TESTIS</text>
  <text x="510" y="183" text-anchor="middle" font-size="8" fill="#e8d5f5">Reduced or</text>
  <text x="510" y="194" text-anchor="middle" font-size="8" fill="#e8d5f5">absent sperm</text>
  <text x="510" y="205" text-anchor="middle" font-size="8" fill="#CF3A6A">production</text>

  <!-- Path - open but no sperm -->
  <line x1="550" y1="175" x2="700" y2="175" stroke="#5a2f7a" stroke-width="3" stroke-dasharray="4,4"/>
  <text x="638" y="170" text-anchor="middle" font-size="9" fill="#7b5fa0">path open</text>
  <text x="638" y="183" text-anchor="middle" font-size="9" fill="#7b5fa0">no sperm</text>

  <!-- Focal sperm indicator -->
  <circle cx="510" cy="235" r="8" fill="#C5A130" opacity="0.6"/>
  <text x="510" y="239" text-anchor="middle" font-size="7" fill="#1a0a2e">focal</text>
  <text x="540" y="235" text-anchor="middle" font-size="8" fill="#C5A130">Focal sperm</text>
  <text x="540" y="246" text-anchor="middle" font-size="8" fill="#e8d5f5">may exist in</text>
  <text x="540" y="257" text-anchor="middle" font-size="8" fill="#e8d5f5">testicular tissue</text>

  <!-- Stats block -->
  <rect x="426" y="268" width="328" height="78" rx="8" fill="#2d0f1e" stroke="#CF3A6A" stroke-width="1"/>
  <text x="590" y="286" text-anchor="middle" font-size="11" font-weight="700" fill="#CF3A6A">Key Facts — Non-Obstructive</text>
  <text x="590" y="302" text-anchor="middle" font-size="10" fill="#e8d5f5">Sperm production is impaired or absent in ejaculate</text>
  <text x="590" y="318" text-anchor="middle" font-size="10" fill="#C5A130">micro-TESE sperm retrieval success: ~50–60%</text>
  <text x="590" y="332" text-anchor="middle" font-size="10" fill="#e8d5f5">Causes: hormonal, genetic (Klinefelter's), testicular failure</text>

  <!-- Bottom outcome -->
  <rect x="40" y="408" width="720" height="22" rx="8" fill="#3D1F56"/>
  <text x="400" y="423" text-anchor="middle" font-size="11" font-weight="600" fill="#fff">Both types have treatment paths. Most men with azoospermia can father biological children.</text>
</svg>`;

// ---------- SVG: Sperm Retrieval Methods ----------
const spermRetrievalSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" font-family="Inter,system-ui,sans-serif">
  <defs>
    <linearGradient id="bgSR" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0a2e"/>
      <stop offset="100%" style="stop-color:#2d1245"/>
    </linearGradient>
  </defs>
  <rect width="800" height="360" fill="url(#bgSR)" rx="16"/>
  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">Surgical Sperm Retrieval Methods</text>
  <text x="400" y="48" text-anchor="middle" font-size="10" fill="#c9b8d8">PESA · TESA · MESA · micro-TESE — understanding your options</text>

  <!-- PESA -->
  <rect x="20" y="60" width="175" height="220" rx="10" fill="#1f0d36" stroke="#C5A130" stroke-width="1.5"/>
  <rect x="20" y="60" width="175" height="32" rx="10" fill="#C5A130"/>
  <rect x="20" y="78" width="175" height="14" fill="#C5A130"/>
  <text x="107" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="#1a0a2e">PESA</text>
  <text x="107" y="105" text-anchor="middle" font-size="10" fill="#c9b8d8">Percutaneous</text>
  <text x="107" y="118" text-anchor="middle" font-size="10" fill="#c9b8d8">Epididymal Sperm</text>
  <text x="107" y="131" text-anchor="middle" font-size="10" fill="#c9b8d8">Aspiration</text>
  <line x1="40" y1="143" x2="175" y2="143" stroke="#3D1F56" stroke-width="1"/>
  <text x="107" y="160" text-anchor="middle" font-size="10" fill="#e8d5f5">Needle aspiration</text>
  <text x="107" y="174" text-anchor="middle" font-size="10" fill="#e8d5f5">from epididymis</text>
  <text x="107" y="190" text-anchor="middle" font-size="10" fill="#e8d5f5">No incision</text>
  <text x="107" y="206" text-anchor="middle" font-size="10" fill="#e8d5f5">Day procedure</text>
  <text x="107" y="224" text-anchor="middle" font-size="9" font-weight="700" fill="#C5A130">Obstructive AZ</text>
  <text x="107" y="238" text-anchor="middle" font-size="9" fill="#C5A130">Success: Over 90%</text>
  <text x="107" y="254" text-anchor="middle" font-size="9" fill="#e8d5f5">Lowest invasiveness</text>
  <text x="107" y="267" text-anchor="middle" font-size="9" fill="#e8d5f5">Best first choice</text>

  <!-- TESA -->
  <rect x="205" y="60" width="175" height="220" rx="10" fill="#1f0d36" stroke="#7b3fa0" stroke-width="1.5"/>
  <rect x="205" y="60" width="175" height="32" rx="10" fill="#7b3fa0"/>
  <rect x="205" y="78" width="175" height="14" fill="#7b3fa0"/>
  <text x="292" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">TESA</text>
  <text x="292" y="105" text-anchor="middle" font-size="10" fill="#c9b8d8">Testicular Sperm</text>
  <text x="292" y="118" text-anchor="middle" font-size="10" fill="#c9b8d8">Aspiration</text>
  <line x1="225" y1="130" x2="365" y2="130" stroke="#3D1F56" stroke-width="1"/>
  <text x="292" y="148" text-anchor="middle" font-size="10" fill="#e8d5f5">Needle aspiration</text>
  <text x="292" y="162" text-anchor="middle" font-size="10" fill="#e8d5f5">directly from</text>
  <text x="292" y="176" text-anchor="middle" font-size="10" fill="#e8d5f5">testis</text>
  <text x="292" y="192" text-anchor="middle" font-size="10" fill="#e8d5f5">No incision</text>
  <text x="292" y="208" text-anchor="middle" font-size="10" fill="#e8d5f5">Day procedure</text>
  <text x="292" y="224" text-anchor="middle" font-size="9" font-weight="700" fill="#b8a0e0">Mild NOA / OA</text>
  <text x="292" y="238" text-anchor="middle" font-size="9" fill="#b8a0e0">Success: ~50–60%</text>
  <text x="292" y="252" text-anchor="middle" font-size="9" fill="#e8d5f5">Minimally invasive</text>
  <text x="292" y="265" text-anchor="middle" font-size="9" fill="#e8d5f5">Good first option NOA</text>

  <!-- MESA -->
  <rect x="390" y="60" width="175" height="220" rx="10" fill="#1f0d36" stroke="#CF3A6A" stroke-width="1.5"/>
  <rect x="390" y="60" width="175" height="32" rx="10" fill="#CF3A6A"/>
  <rect x="390" y="78" width="175" height="14" fill="#CF3A6A"/>
  <text x="477" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">MESA</text>
  <text x="477" y="105" text-anchor="middle" font-size="10" fill="#c9b8d8">Microsurgical</text>
  <text x="477" y="118" text-anchor="middle" font-size="10" fill="#c9b8d8">Epididymal Sperm</text>
  <text x="477" y="131" text-anchor="middle" font-size="10" fill="#c9b8d8">Aspiration</text>
  <line x1="410" y1="143" x2="550" y2="143" stroke="#3D1F56" stroke-width="1"/>
  <text x="477" y="160" text-anchor="middle" font-size="10" fill="#e8d5f5">Open microsurgery</text>
  <text x="477" y="174" text-anchor="middle" font-size="10" fill="#e8d5f5">under microscope</text>
  <text x="477" y="190" text-anchor="middle" font-size="10" fill="#e8d5f5">Epididymis directly</text>
  <text x="477" y="206" text-anchor="middle" font-size="10" fill="#e8d5f5">visualised</text>
  <text x="477" y="224" text-anchor="middle" font-size="9" font-weight="700" fill="#CF3A6A">Obstructive AZ</text>
  <text x="477" y="238" text-anchor="middle" font-size="9" fill="#CF3A6A">Highest yield OA</text>
  <text x="477" y="252" text-anchor="middle" font-size="9" fill="#e8d5f5">Best for banking</text>
  <text x="477" y="265" text-anchor="middle" font-size="9" fill="#e8d5f5">multiple samples</text>

  <!-- micro-TESE -->
  <rect x="575" y="60" width="205" height="220" rx="10" fill="#1f0d36" stroke="#4CAF50" stroke-width="2"/>
  <rect x="575" y="60" width="205" height="32" rx="10" fill="#3D1F56" stroke="#4CAF50" stroke-width="2"/>
  <rect x="575" y="78" width="205" height="14" fill="#3D1F56"/>
  <text x="677" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="#4CAF50">micro-TESE ★</text>
  <text x="677" y="105" text-anchor="middle" font-size="10" fill="#c9b8d8">Microsurgical</text>
  <text x="677" y="118" text-anchor="middle" font-size="10" fill="#c9b8d8">Testicular Sperm</text>
  <text x="677" y="131" text-anchor="middle" font-size="10" fill="#c9b8d8">Extraction</text>
  <line x1="595" y1="143" x2="765" y2="143" stroke="#3D1F56" stroke-width="1"/>
  <text x="677" y="160" text-anchor="middle" font-size="10" fill="#e8d5f5">Operating microscope</text>
  <text x="677" y="174" text-anchor="middle" font-size="10" fill="#e8d5f5">maps seminiferous</text>
  <text x="677" y="188" text-anchor="middle" font-size="10" fill="#e8d5f5">tubules for sperm</text>
  <text x="677" y="202" text-anchor="middle" font-size="10" fill="#e8d5f5">pockets</text>
  <text x="677" y="220" text-anchor="middle" font-size="9" font-weight="700" fill="#4CAF50">Non-Obstructive AZ</text>
  <text x="677" y="234" text-anchor="middle" font-size="9" fill="#4CAF50">Retrieval rate: ~50–60%</text>
  <text x="677" y="248" text-anchor="middle" font-size="9" fill="#e8d5f5">Gold standard for NOA</text>
  <text x="677" y="262" text-anchor="middle" font-size="9" fill="#4CAF50">Best technology available</text>

  <!-- Bottom bar -->
  <rect x="20" y="295" width="760" height="50" rx="8" fill="#1f0d36" stroke="#3D1F56" stroke-width="1"/>
  <text x="400" y="314" text-anchor="middle" font-size="11" font-weight="600" fill="#fff">After retrieval: sperm are used in IVF+ICSI — each viable sperm can fertilise one egg.</text>
  <text x="400" y="330" text-anchor="middle" font-size="10" fill="#c9b8d8">Bavishi Fertility Institute offers all four retrieval methods. The right choice depends on your azoospermia type.</text>
  <text x="400" y="344" text-anchor="middle" font-size="9" fill="#7b5fa0">★ micro-TESE requires specialised microsurgical training — confirm your surgeon's experience before proceeding.</text>
</svg>`;

// ---------- Content ----------
const content = {
  root: {
    type: "root", format: "", indent: 0, version: 1, direction: "ltr",
    children: [
      // Direct answer — #1 priority for this audience
      para(
        bold("Yes — most men with azoospermia (zero sperm count) can father biological children."),
        txt(" This is the most important thing to know, and it is true for the majority of men who receive this diagnosis. Azoospermia is not infertility — it is a specific, diagnosable condition with well-established surgical and reproductive medicine treatments. At Bavishi Fertility Institute, our andrologists and embryologists work together to find and use sperm that exists where the semen analysis cannot detect it.")
      ),
      para(
        txt("If you are reading this because you or your partner just received an azoospermia diagnosis, take a breath. The diagnosis is shocking. But it is also one of the most treatable conditions in male infertility. This guide explains exactly what it means, what the treatment options are, and what your realistic chances are of having a biological child.")
      ),

      externalImage({
        url: "https://images.pexels.com/photos/35441879/pexels-photo-35441879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: "Indian couple in traditional attire with mehndi celebrating pregnancy — the achievable outcome for most men diagnosed with azoospermia",
        caption: "For most men with azoospermia, this moment is genuinely within reach. The path is longer, but the destination is the same.",
        credit: "Photo: Pexels (India)",
      }),

      statStrip([
        { value: "40%",  label: "Azoospermia cases are obstructive (highest success)" },
        { value: "90%",  label: "Sperm retrieval success — obstructive type" },
        { value: "50%",  label: "Sperm retrieval success — non-obstructive type" },
        { value: "60%",  label: "IVF+ICSI success rate with retrieved sperm" },
      ]),

      h2("What Is Azoospermia?"),
      para(
        txt("Azoospermia means no sperm are detectable in a semen sample after two separate analyses. It is found in approximately 1% of all men and 10–15% of men investigated for infertility. The diagnosis sounds final — but it categorically is not. The reason it is not final is this: "),
        bold("in most men with azoospermia, sperm are still being produced somewhere in the reproductive system."),
        txt(" The challenge is finding and retrieving them.")
      ),
      para(
        txt("There are two fundamentally different types of azoospermia, and your treatment path depends entirely on which one you have.")
      ),

      h2("Obstructive vs Non-Obstructive Azoospermia"),
      infographic({
        title: "Azoospermia: Obstructive vs Non-Obstructive",
        svgContent: azoospermiaSVG,
        altText: "Side-by-side comparison of obstructive azoospermia (sperm produced normally but blocked from ejaculate) and non-obstructive azoospermia (impaired sperm production in the testis)",
        caption: "The type you have determines which sperm retrieval procedure is best suited — and what success rate you can realistically expect.",
      }),

      h3("Obstructive Azoospermia (OA) — the 'plumbing' problem"),
      para(
        txt("In obstructive azoospermia, "),
        bold("the testes are producing sperm normally"),
        txt(", but a blockage in the reproductive tract prevents sperm from reaching the ejaculate. The blockage may be in the epididymis, vas deferens, or ejaculatory duct. Causes include vasectomy, congenital bilateral absence of the vas deferens (CBAVD, associated with CFTR gene mutations), past infection (epididymo-orchitis), or surgical injury.")
      ),
      para(
        txt("For obstructive azoospermia, sperm retrieval success rates are "),
        bold("over 90%"),
        txt(" — because sperm are abundantly present in the epididymis and testis. PESA or MESA procedures retrieve sufficient sperm for IVF+ICSI in almost all cases.")
      ),

      h3("Non-Obstructive Azoospermia (NOA) — the 'production' problem"),
      para(
        txt("In non-obstructive azoospermia, sperm production is impaired or absent in the testicles themselves. Causes include Klinefelter syndrome (XXY chromosomes), Y-chromosome microdeletions, hormonal disorders (hypogonadism), testicular failure from chemotherapy or radiation, cryptorchidism (undescended testis), or idiopathic causes (no identifiable reason). The path is open; there is simply no sperm travelling through it.")
      ),
      para(
        txt("The critical nuance: even in NOA, "),
        bold("focal areas of sperm production may still exist within the testicular tissue"),
        txt(". Micro-TESE — microsurgical testicular sperm extraction — uses an operating microscope to identify these pockets of activity within the testis. In approximately 50–60% of NOA cases, viable sperm are found. This is remarkable for a condition previously considered untreatable.")
      ),

      h2("Treatment Options: From Diagnosis to Fatherhood"),
      para(
        txt("The treatment for azoospermia always involves two components: ")
      ),
      ul(
        "A surgical sperm retrieval procedure (to find and collect sperm from the reproductive tract or testis)",
        "IVF with ICSI (intracytoplasmic sperm injection) — because retrieved sperm are used individually to fertilise each egg directly"
      ),
      para(
        txt("The choice of retrieval procedure depends on whether you have obstructive or non-obstructive azoospermia, and where in the reproductive system sperm are most likely to be found.")
      ),

      h2("Sperm Retrieval Procedures: PESA, TESA, MESA, micro-TESE"),
      infographic({
        title: "Surgical Sperm Retrieval: All Four Methods Explained",
        svgContent: spermRetrievalSVG,
        altText: "Visual comparison of four sperm retrieval methods — PESA, TESA, MESA, and micro-TESE — showing invasiveness, success rates, and which type of azoospermia each is suited for",
        caption: "micro-TESE requires a microsurgically trained urologist. Ask your clinic specifically about their surgeon's experience with this procedure.",
      }),

      comparisonTable(
        "Procedure",
        ["What It Is", "Best For", "Success Rate", "Key Advantage"],
        [
          { label: "PESA", cells: ["Needle aspiration from epididymis — no incision", "Obstructive AZ: vasectomy, CBAVD, past infection", "Over 90% (OA)", "Fastest, least invasive, day procedure"] },
          { label: "TESA", cells: ["Fine needle aspiration directly from testis", "Mild NOA or OA when PESA insufficient", "~50–60% NOA / ~90% OA", "Minimally invasive; good first option for NOA"] },
          { label: "MESA", cells: ["Open microsurgery — epididymis visualised under microscope", "OA when large sperm yield needed (sperm banking)", "Highest yield for OA", "Best when banking sperm for multiple IVF cycles"] },
          { label: "micro-TESE", cells: ["Microsurgery maps tubules to find focal sperm pockets", "Non-obstructive AZ: Klinefelter, Y-deletion, testicular failure", "~50–60% NOA", "Gold standard for NOA — finds sperm invisible to naked eye"] },
        ]
      ),

      h2("How IVF + ICSI Turns Retrieved Sperm Into Pregnancy"),
      para(
        txt("Whether sperm are retrieved by PESA, TESA, MESA, or micro-TESE, the next step is always IVF with ICSI. A single viable sperm is injected directly into each mature egg using a microscopic needle (intracytoplasmic sperm injection). This technique was developed specifically to overcome severe male factor infertility — it requires only one functional sperm per egg, not the millions needed for natural conception.")
      ),
      para(
        txt("Fertilisation rates using ICSI with surgically retrieved sperm are comparable to ICSI using ejaculated sperm — typically 65–75% of injected eggs fertilise successfully. The resulting embryos are cultured to blastocyst stage and transferred to the partner's uterus. Success rates of "),
        bold("50–60% per transfer"),
        txt(" are routinely achieved at accredited centres when good-quality blastocysts are available.")
      ),

      decisionList({
        heading: "Which Sperm Retrieval Method Is Right for You?",
        intro: "Your urologist and andrologist will guide you through this, but here is the clinical logic that drives the decision.",
        items: [
          { icon: "Filter", situation: "Obstructive AZ: vasectomy reversal not desired, or vasectomy over 10 years ago", recommendation: "PESA is the first choice — fast, minimally invasive, over 90% success. Sperm can be frozen for multiple cycles. MESA if large banking is planned." },
          { icon: "FlaskConical", situation: "Obstructive AZ: congenital bilateral absence of vas deferens (CBAVD)", recommendation: "PESA or MESA. CBAVD is associated with CFTR mutations (cystic fibrosis gene) — genetic testing of both partners is important before proceeding." },
          { icon: "Microscope", situation: "Non-obstructive AZ: Klinefelter syndrome (XXY)", recommendation: "micro-TESE by a microsurgically trained urologist. Sperm are found in approximately 50% of Klinefelter cases. Testosterone therapy before micro-TESE may improve retrieval rates." },
          { icon: "Dna", situation: "Non-obstructive AZ: Y-chromosome microdeletion", recommendation: "micro-TESE if AZFc or AZFb deletion only — retrieval is sometimes possible. AZFa deletion is associated with near-zero success and donor sperm should be discussed." },
          { icon: "Target", situation: "NOA with unknown cause (idiopathic)", recommendation: "Hormonal optimisation first (FSH, Clomid, or aromatase inhibitors may improve sperm production). Then micro-TESE. ~50% of idiopathic NOA cases yield sperm." },
          { icon: "Activity", situation: "Post-chemotherapy or post-radiation azoospermia", recommendation: "If sperm were banked before treatment — excellent. If not, TESA or micro-TESE after 2 years recovery (spermatogenesis may gradually recover). FSH and inhibin-B levels guide prognosis." },
        ],
        note: "Y-chromosome microdeletion testing and karyotype analysis are strongly recommended before any sperm retrieval in non-obstructive azoospermia — these results affect both treatment planning and the genetic health of any children conceived.",
      }),

      h2("What This Diagnosis Means for Your Relationship"),
      para(
        txt("Receiving an azoospermia diagnosis is a profound shock — not just medically, but emotionally and relationally. For many men, fertility is bound up in identity in ways that are rarely discussed openly. For many couples, it lands differently than expected: one partner may grieve differently, one may leap to solutions while the other needs time to process.")
      ),
      para(
        txt("A few things that genuinely help:")
      ),
      ul(
        "Name what you are feeling — to yourself and, when you can, to your partner. Shame thrives in silence. Azoospermia is a medical diagnosis, not a character failure.",
        "Agree on a pace together. One of you may want to move quickly to treatment; the other may need more time. Both responses are valid. Finding a shared pace prevents resentment.",
        "Seek information from specialists, not search engines. The gap between what Dr. Google implies and what a skilled microsurgical urologist can actually achieve with micro-TESE is enormous.",
        "Consider counselling — fertility counsellors trained in male factor infertility are rare but invaluable. Ask your clinic for a referral.",
        "Know that many men who sat where you are sitting now are fathers today. The number is higher than you might think."
      ),
      tip("The worst thing about an azoospermia diagnosis is not the medical reality — it is the way it is often delivered: a lab report in the mail, a brief phone call, a form letter. You deserve a proper consultation with a specialist who can put your specific results in context. That is a second opinion, and you are entitled to it."),

      inlineCta({
        headline: "Get a second opinion — many azoospermia diagnoses have treatable causes",
        subtext: "A semen analysis showing zero sperm is the beginning of the investigation, not the end. At BFI, our andrologist will review your FSH, testosterone, karyotype, and Y-deletion results to give you a complete picture — and a realistic path forward.",
        accent: "rose",
        buttons: [
          { label: "Book an Azoospermia Consultation", url: "/treatments/azoospermia", variant: "primary" },
          { label: "Male Infertility Services", url: "/treatments/male-infertility", variant: "secondary" },
        ],
      }),

      h2("Hormone Treatment Before Sperm Retrieval — Can It Help?"),
      para(
        txt("For men with NOA caused by hormonal issues (hypogonadotropic hypogonadism), medical treatment with FSH and hCG injections can "),
        bold("restore sperm production completely"),
        txt(" in some cases — making surgical retrieval unnecessary. This is one of the most satisfying outcomes in male infertility medicine and should be ruled out with a full endocrine workup before any surgical procedure.")
      ),
      para(
        txt("For men with NOA from other causes, preliminary treatment with Clomid, aromatase inhibitors (anastrozole), or antioxidants is sometimes used to optimise the testicular environment before micro-TESE, with evidence of modestly improved retrieval rates in some studies. This is typically a 3–6 month preparation.")
      ),

      highlightCard({
        badge: "Azoospermia & Male Infertility",
        tagline: "Bavishi Fertility Institute's male fertility team includes experienced andrologists and microsurgically trained urologists — all four sperm retrieval procedures are available at our Ahmedabad centre.",
        icon: "Microscope",
        color: "plum",
        facts: [
          { label: "Retrieval procedures available", value: "PESA, TESA, MESA, micro-TESE" },
          { label: "OA sperm retrieval success", value: "Over 90%" },
          { label: "NOA sperm retrieval success", value: "~50–60%" },
          { label: "IVF+ICSI success with retrieved sperm", value: "Up to 60%" },
        ],
        bestSuitedFor: "Men with azoospermia who want a complete, compassionate assessment — from hormonal workup through sperm retrieval planning and IVF+ICSI with their partner.",
      }),

      h2("Frequently Asked Questions About Azoospermia"),
      para(txt("For the most common questions, see the FAQ section below. For questions specific to your results, book a consultation — your FSH level, testicular volume, and genetics all matter to the answer.")),

      para(
        txt("For comprehensive information on azoospermia treatment at BFI, visit our "),
        link("azoospermia treatment page", "/treatments/azoospermia"),
        txt(". For the broader spectrum of male infertility conditions, see our "),
        link("male infertility services", "/treatments/male-infertility"),
        txt(". For information on surgical sperm retrieval procedures in detail, visit our "),
        link("surgical sperm retrieval guide", "/treatments/surgical-sperm-retrieval"),
        txt(".")
      ),

      conclusionPanel({
        headline: "Azoospermia is a diagnosis with real, proven solutions — and you are not alone.",
        points: [
          { icon: "Microscope", text: "Obstructive azoospermia: sperm retrieval succeeds in over 90% of cases with PESA or MESA. This is highly treatable." },
          { icon: "Dna", text: "Non-obstructive azoospermia: micro-TESE finds viable sperm in approximately 50–60% of cases — even in conditions once considered permanent." },
          { icon: "FlaskConical", text: "Retrieved sperm + IVF+ICSI delivers success rates of 50–60% per transfer. One sperm is enough." },
          { icon: "Activity", text: "For hormone-caused NOA, medical treatment alone can restore sperm production — surgery may not even be needed." },
          { icon: "HeartPulse", text: "The emotional weight of this diagnosis is real. A good specialist will treat you as a whole person, not just a test result — and give you an honest, specific picture of your own chances." },
        ],
      }),

      inlineCta({
        headline: "Your zero sperm count is the beginning of the conversation, not the end.",
        subtext: "Book a specialist azoospermia assessment at Bavishi Fertility Institute. Our andrologist will review your full picture — hormones, genetics, and anatomy — and give you a clear, honest prognosis and treatment plan.",
        accent: "rose",
        buttons: [
          { label: "Book Azoospermia Assessment", url: "/treatments/azoospermia", variant: "primary" },
          { label: "Call Our Male Fertility Team", url: "tel:+919099020202", variant: "secondary" },
        ],
      }),
    ],
  },
};

// ---------- FAQs ----------
const faqs = [
  {
    question: "Can a man with zero sperm count have a biological child?",
    answer: "Yes — most men with azoospermia can father biological children. With obstructive azoospermia, sperm retrieval succeeds in over 90% of cases. With non-obstructive azoospermia, micro-TESE finds viable sperm in approximately 50–60% of cases. Retrieved sperm are used with IVF+ICSI, achieving pregnancy rates of 50–60% per transfer at accredited centres.",
  },
  {
    question: "Is zero sperm count permanent?",
    answer: "Not necessarily. For men with obstructive azoospermia, sperm production is normal and retrieval is almost always successful. For men with NOA caused by hormonal imbalance (hypogonadotropic hypogonadism), medical treatment can restore sperm production completely. For other causes of NOA, micro-TESE can find sperm in ~50–60% of men. Even conditions once thought permanent — like Klinefelter syndrome — now have documented successful fatherhood through micro-TESE.",
  },
  {
    question: "What is the difference between obstructive and non-obstructive azoospermia?",
    answer: "Obstructive azoospermia (OA): sperm are produced normally in the testes but cannot reach the ejaculate due to a blockage in the epididymis, vas deferens, or ejaculatory duct. Non-obstructive azoospermia (NOA): sperm production itself is impaired or absent. OA has a higher sperm retrieval success rate (over 90%) than NOA (~50–60% with micro-TESE).",
  },
  {
    question: "What is micro-TESE and how is it different from TESA?",
    answer: "TESA is a needle aspiration directly from the testis — quick, minimally invasive, and appropriate for obstructive azoospermia or mild NOA. micro-TESE uses an operating microscope to examine testicular tissue directly, identifying pockets of active spermatogenesis in tubules that appear larger or more vascularised. It requires a skilled microsurgical urologist, is more complex, but finds sperm in cases where simple aspiration would miss them. It is the gold standard for non-obstructive azoospermia.",
  },
  {
    question: "What causes non-obstructive azoospermia?",
    answer: "Common causes include: Klinefelter syndrome (XXY chromosomes — most common genetic cause), Y-chromosome microdeletions (AZFa, AZFb, AZFc region deletions), prior chemotherapy or radiation, undescended testis (cryptorchidism), hypogonadotropic hypogonadism (hormonal failure), and idiopathic causes (no identifiable reason, approximately 30–40% of NOA cases).",
  },
  {
    question: "How successful is IVF with surgically retrieved sperm?",
    answer: "When good-quality sperm are retrieved and used in IVF+ICSI, fertilisation rates are 65–75% of injected eggs. Pregnancy rates per transfer are 50–60% for women under 35 using blastocyst transfers. The female partner's age, egg quality, and uterine factors are as important as sperm quality in determining the overall success rate.",
  },
  {
    question: "Should I get a second opinion on my azoospermia diagnosis?",
    answer: "Strongly yes — particularly if you received the diagnosis from a general urologist or through a lab report alone without specialist consultation. The workup for azoospermia requires evaluation of FSH, LH, testosterone, prolactin, karyotype, Y-chromosome microdeletion testing, and testicular ultrasound. Many first diagnoses are incomplete. A reproductive urologist or andrologist should review all results before any conclusion is drawn about treatability.",
  },
  {
    question: "What is the emotional impact of azoospermia on men and relationships?",
    answer: "Profound, and often underestimated. Many men describe feelings of shock, grief, shame, and a sense of failure — even though azoospermia is a medical condition, not a personal failing. Relationships are tested differently: one partner may focus on solutions while the other grieves. Open communication, a shared pace, and access to a fertility counsellor trained in male factor infertility are all genuinely helpful. Many couples who have been through this describe it as ultimately strengthening their relationship — though that takes time.",
  },
];

// ---------- Excerpt & SEO ----------
const excerpt = "Most men with azoospermia (zero sperm count) can father biological children. Obstructive azoospermia has over 90% sperm retrieval success; non-obstructive has ~50–60% with micro-TESE. This guide explains both types, all retrieval procedures, and what IVF+ICSI success rates realistically look like.";

const readMins = 13;

const seo = {
  metaTitle: "Azoospermia: Can You Have a Baby with Zero Sperm Count? | Bavishi Fertility Institute",
  metaDescription: "YES — most men with azoospermia can father biological children. Learn about PESA, TESA, MESA, micro-TESE sperm retrieval and IVF+ICSI success rates. Expert guide from BFI Ahmedabad.",
  keywords: "azoospermia treatment, zero sperm count baby, micro-TESE azoospermia, PESA TESA male infertility, non obstructive azoospermia, obstructive azoospermia, azoospermia IVF ICSI, male infertility Ahmedabad",
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
  console.log(`[enrich-05] Connecting to ${BASE}...`);
  const token = await login();
  const auth = { Authorization: `JWT ${token}` };
  console.log("[enrich-05] Login OK");
  const { AUTHOR_ID, REVIEWER_ID } = await lookupAuthors(auth);
  const blog = await findBlog(SLUG, auth);
  if (!blog) { console.error(`[enrich-05] Not found: ${SLUG}`); process.exit(1); }
  console.log(`[enrich-05] Found id=${blog.id} — patching...`);
  await patchBlog(blog.id, { content, faqs, excerpt, readMins, seo, author: AUTHOR_ID, reviewedBy: REVIEWER_ID, heroImage: null, _status: "published" }, auth);
  console.log(`[enrich-05] ✓ Done! ${BASE}/blog/${SLUG}`);
};

run().catch(e => { console.error("[enrich-05] FAILED:", e.message); process.exit(1); });
