#!/usr/bin/env node
/* =============================================================================
 * enrich-blog-02-ivf-cost-ahmedabad.mjs
 * Enriches: ivf-treatment-cost-in-ahmedabad-across-india
 * Topic: IVF cost in Ahmedabad and across India
 * Intent: BOFU — ready to commit but anxious about money
 * Run: node scripts/enrich-blog-02-ivf-cost-ahmedabad.mjs
 * ============================================================================= */

const BASE = process.env.PAYLOAD_URL ?? "http://localhost:3000";
const EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";

const SLUG = "ivf-treatment-cost-in-ahmedabad-across-india";

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

// ---------- SVG: IVF Cost Breakdown ----------
const costBreakdownSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420" font-family="Inter,system-ui,sans-serif">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2d1245;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#CF3A6A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e05c85;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#C5A130;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d4b84a;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="plumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3D1F56;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#5a2f7a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="420" fill="url(#bgGrad)" rx="16"/>

  <!-- Title -->
  <text x="400" y="38" text-anchor="middle" font-size="18" font-weight="700" fill="#ffffff">IVF Cost in Ahmedabad — What's Included vs What's Extra</text>
  <text x="400" y="58" text-anchor="middle" font-size="12" fill="#c9b8d8">Bavishi Fertility Institute · 14 Centres across Gujarat</text>

  <!-- Divider line -->
  <line x1="40" y1="72" x2="760" y2="72" stroke="#5a2f7a" stroke-width="1"/>

  <!-- LEFT: Included box -->
  <rect x="30" y="84" width="355" height="290" rx="12" fill="#1f0d36" stroke="#CF3A6A" stroke-width="1.5"/>
  <rect x="30" y="84" width="355" height="38" rx="12" fill="url(#roseGrad)"/>
  <rect x="30" y="104" width="355" height="18" fill="url(#roseGrad)"/>
  <text x="207" y="108" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">✓ TYPICALLY INCLUDED</text>

  <!-- Included items -->
  <g fill="#e8d5f5" font-size="12">
    <circle cx="52" cy="142" r="4" fill="#CF3A6A"/>
    <text x="64" y="146">Ovarian stimulation monitoring (scans + blood work)</text>
    <circle cx="52" cy="168" r="4" fill="#CF3A6A"/>
    <text x="64" y="172">Egg retrieval procedure (OPU)</text>
    <circle cx="52" cy="194" r="4" fill="#CF3A6A"/>
    <text x="64" y="198">Embryologist fees + lab consumables</text>
    <circle cx="52" cy="220" r="4" fill="#CF3A6A"/>
    <text x="64" y="224">Embryo culture (Day 3 or Day 5)</text>
    <circle cx="52" cy="246" r="4" fill="#CF3A6A"/>
    <text x="64" y="250">Embryo transfer procedure</text>
    <circle cx="52" cy="272" r="4" fill="#CF3A6A"/>
    <text x="64" y="276">Anaesthesiologist fees for OPU</text>
    <circle cx="52" cy="298" r="4" fill="#CF3A6A"/>
    <text x="64" y="302">Initial consultation + baseline investigations</text>
    <circle cx="52" cy="324" r="4" fill="#CF3A6A"/>
    <text x="64" y="328">Beta hCG pregnancy test (post-transfer)</text>
  </g>

  <!-- Price banner -->
  <rect x="42" y="346" width="331" height="20" rx="6" fill="#3D1F56"/>
  <text x="207" y="360" text-anchor="middle" font-size="12" font-weight="700" fill="#C5A130">Base cycle: ₹1.2 L – ₹1.8 L</text>

  <!-- RIGHT: Extra costs box -->
  <rect x="415" y="84" width="355" height="290" rx="12" fill="#1f0d36" stroke="#C5A130" stroke-width="1.5"/>
  <rect x="415" y="84" width="355" height="38" rx="12" fill="url(#goldGrad)"/>
  <rect x="415" y="104" width="355" height="18" fill="url(#goldGrad)"/>
  <text x="592" y="108" text-anchor="middle" font-size="13" font-weight="700" fill="#1a0a2e">+ COMMONLY ADDS TO COST</text>

  <!-- Extra items -->
  <g fill="#e8d5f5" font-size="12">
    <circle cx="437" cy="142" r="4" fill="#C5A130"/>
    <text x="449" y="146">Gonadotropin medications (₹40K–₹80K)</text>
    <circle cx="437" cy="168" r="4" fill="#C5A130"/>
    <text x="449" y="172">ICSI (intracytoplasmic sperm injection) +₹20K–₹30K</text>
    <circle cx="437" cy="194" r="4" fill="#C5A130"/>
    <text x="449" y="198">PGT-A / PGT-M (genetic testing) +₹40K–₹80K</text>
    <circle cx="437" cy="220" r="4" fill="#C5A130"/>
    <text x="449" y="224">Embryo freezing (vitrification) +₹15K–₹25K</text>
    <circle cx="437" cy="246" r="4" fill="#C5A130"/>
    <text x="449" y="250">Frozen embryo transfer (FET) +₹30K–₹50K</text>
    <circle cx="437" cy="272" r="4" fill="#C5A130"/>
    <text x="449" y="276">Donor eggs or donor sperm +₹30K–₹80K</text>
    <circle cx="437" cy="298" r="4" fill="#C5A130"/>
    <text x="449" y="302">Surgical sperm retrieval (TESA/PESA) +₹20K–₹40K</text>
    <circle cx="437" cy="324" r="4" fill="#C5A130"/>
    <text x="449" y="328">Endometrial receptivity assay (ERA) +₹15K–₹30K</text>
  </g>

  <!-- Price banner -->
  <rect x="427" y="346" width="331" height="20" rx="6" fill="#3D1F56"/>
  <text x="592" y="360" text-anchor="middle" font-size="12" font-weight="700" fill="#CF3A6A">Advanced protocols: ₹2.0 L – ₹3.5 L</text>

  <!-- Bottom note -->
  <text x="400" y="398" text-anchor="middle" font-size="11" fill="#9b8ab0">All figures are indicative. Ask for a written itemised estimate before you commit.</text>
</svg>`;

// ---------- Content ----------
const content = {
  root: {
    type: "root", format: "", indent: 0, version: 1, direction: "ltr",
    children: [
      // Direct answer
      para(
        bold("In Ahmedabad, a standard IVF cycle costs between ₹1.2 lakh and ₹2.5 lakh all-in"),
        txt(" — making it significantly more affordable than Mumbai (₹1.8L–₹3.5L) or Delhi (₹1.5L–₹3L) while offering the same internationally accredited lab standards. At Bavishi Fertility Institute's 14 centres across Gujarat, the price you are quoted upfront covers the core cycle with no surprise bills after egg retrieval.")
      ),
      para(
        txt("This guide breaks down exactly what's included in that number, what legitimately adds to it, and what questions to ask any clinic before you hand over a rupee.")
      ),

      externalImage({
        url: "https://images.pexels.com/photos/5738735/pexels-photo-5738735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: "Indian female doctor in a modern clinic in Delhi — expert fertility guidance to navigate IVF costs in Ahmedabad",
        caption: "Understanding what your IVF quote actually covers is the single most important step before committing.",
        credit: "Photo: Dr Aparna Jaswal / Pexels (Delhi, India)",
      }),

      statStrip([
        { value: "₹1.2L",  label: "Base IVF cycle in Ahmedabad" },
        { value: "65%",    label: "Success rate per cycle (under 35)" },
        { value: "7 Items", label: "Typically included in base price" },
        { value: "2 Cycles", label: "Average cycles to live birth" },
      ]),

      h2("IVF Cost Breakdown: What's Included vs What's Extra"),
      para(
        txt("The single biggest source of anxiety around IVF cost is not the number itself — it's uncertainty about what that number actually covers. Ask any clinic for a "),
        bold("written itemised estimate"),
        txt(" before signing anything. Here is what a transparent quote should include.")
      ),

      infographic({
        title: "IVF Cost Breakdown — Included vs Extra",
        svgContent: costBreakdownSVG,
        altText: "Diagram showing what is typically included in an IVF base price versus costs that commonly add on, such as medications, ICSI, and genetic testing",
        caption: "Bavishi Fertility Institute provides a written itemised cost estimate at your first consultation — no surprises after egg retrieval.",
      }),

      h2("Why IVF Cost Varies: The Real Drivers"),
      para(
        txt("Two couples walking into the same clinic can receive quotes that differ by ₹80,000 or more. The difference is almost always one of these four factors:")
      ),
      ul(
        "Protocol type: Minimal stimulation (mini-IVF) costs less in medications but suits fewer patients. Conventional stimulation is the standard.",
        "ICSI: If the male partner has any sperm quality issue — even borderline — most embryologists recommend ICSI to ensure fertilisation. It adds ₹20K–₹30K.",
        "Medications: Gonadotropin injections are the largest variable cost. High responders use less; low responders (poor ovarian reserve) may use significantly more.",
        "Embryo freezing and FET: If you have surplus good-quality embryos, freezing them and doing a Frozen Embryo Transfer in a later cycle increases the total cost but dramatically improves your cumulative success rate."
      ),

      h2("IVF Cost Comparison: Ahmedabad vs Other Indian Cities"),
      comparisonTable(
        "Option",
        ["Base Cycle Cost", "Medications Estimate", "ICSI Add-on", "Typical All-In Range"],
        [
          { label: "Government hospital (e.g. Civil)", cells: ["₹40K–₹80K", "₹30K–₹60K", "₹15K–₹20K", "₹85K–₹1.6L"] },
          { label: "Ahmedabad private clinic", cells: ["₹1.2L–₹1.8L", "₹40K–₹80K", "₹20K–₹30K", "₹1.6L–₹2.8L"] },
          { label: "Mumbai private clinic", cells: ["₹1.8L–₹2.5L", "₹50K–₹90K", "₹25K–₹35K", "₹2.5L–₹4.0L"] },
          { label: "Delhi private clinic", cells: ["₹1.5L–₹2.2L", "₹45K–₹85K", "₹20K–₹30K", "₹2.0L–₹3.5L"] },
          { label: "Bangalore private clinic", cells: ["₹1.6L–₹2.3L", "₹45K–₹85K", "₹20K–₹30K", "₹2.2L–₹3.8L"] },
        ]
      ),
      para(
        txt("Government hospitals offer the lowest headline cost, but waiting lists can be 6–18 months and specialised services like PGT or donor egg IVF are often unavailable. The ₹50K–₹80K premium at an accredited private centre in Ahmedabad buys you shorter wait times, dedicated embryologist attention, and a higher success rate that typically more than offsets the difference when measured per live birth.")
      ),

      h2("Basic vs Advanced IVF Protocols: What Do You Actually Need?"),
      comparisonTable(
        "Protocol",
        ["Best For", "What's Added", "Approximate Extra Cost", "Success Rate Impact"],
        [
          { label: "Standard IVF", cells: ["Most couples under 38", "Base package only", "—", "Baseline"] },
          { label: "IVF + ICSI", cells: ["Male factor / low fertilisation history", "Microinjection of sperm", "+₹20K–₹30K", "Higher fertilisation rate"] },
          { label: "IVF + PGT-A", cells: ["Recurrent miscarriage / advanced age", "Genetic testing of embryos", "+₹40K–₹80K", "Fewer miscarriages, higher implantation"] },
          { label: "IVF + Freeze-all + FET", cells: ["OHSS risk, thin lining, poor timing", "Vitrification + FET later", "+₹45K–₹70K", "Often higher than fresh transfer"] },
          { label: "Donor Egg IVF", cells: ["Very low AMH / menopause / failed cycles", "Donor coordination + extra meds", "+₹60K–₹1.2L", "Up to 70% per transfer"] },
        ]
      ),

      h2("What's Typically Included in an IVF Package"),
      h3("Core cycle components you should expect"),
      ul(
        "Baseline investigations: Day 2 AFC scan, AMH, FSH, LH, estradiol, semen analysis",
        "All monitoring scans during stimulation (typically 4–6 ultrasounds)",
        "Blood tests for hormone monitoring (E2, LH surge check)",
        "Egg retrieval (OPU) procedure including anaesthesiologist fees",
        "Embryologist fees and laboratory consumables",
        "Embryo culture through Day 3 or Day 5 (blastocyst)",
        "Embryo transfer procedure",
        "Luteal phase support prescription (progesterone)",
        "Post-transfer beta hCG blood test"
      ),

      h2("Hidden Costs to Watch Out For"),
      tip("Red flag: a clinic quotes ₹80,000 for 'IVF' but has not mentioned medications, ICSI, anaesthesia, or the pregnancy test. Always ask: 'Is this the total cost including everything until the pregnancy test?' Get the answer in writing."),
      para(
        txt("Legitimate additional costs that are NOT 'hidden' — they depend on your specific case:")
      ),
      ul(
        "Medications: The single largest variable. Ask for a medication protocol estimate at the same time as the procedure quote.",
        "Repeat cycles: If the first cycle does not result in pregnancy, you will need another. Budget for at least 2 cycles emotionally and financially.",
        "Cryopreservation annual storage fee: After the first year, most clinics charge ₹5K–₹15K/year per straw to store frozen embryos.",
        "Travel and accommodation: If you travel to Ahmedabad from another district, factor in 8–12 trips over a 3-week cycle.",
        "Time off work: Egg retrieval requires 1–2 rest days; transfer requires 1 day. Plan for this."
      ),

      inlineCta({
        headline: "Get a transparent, itemised cost estimate",
        subtext: "Tell us your test results and we'll give you a written breakdown — procedure, medications, and total — before you commit to anything.",
        accent: "rose",
        buttons: [
          { label: "Request My Cost Estimate", url: "/locations/ahmedabad", variant: "primary" },
          { label: "Learn About IVF", url: "/treatments/ivf", variant: "secondary" },
        ],
      }),

      h2("Does Insurance Cover IVF in India?"),
      para(
        txt("As of 2025, most Indian health insurance plans do not cover IVF. A few group corporate plans and some specialised maternity riders now include ₹50,000–₹1,50,000 in fertility treatment cover — check your policy documents specifically for 'infertility treatment' or 'ART' cover. The Government of India's "),
        bold("Pradhan Mantri Jan Arogya Yojana (PMJAY)"),
        txt(" does not yet cover IVF, though pilot programmes exist in some states.")
      ),

      h2("How Many Cycles Will I Need?"),
      para(
        txt("This is the question no clinic can answer with certainty, but the data gives useful guidance. For women under 35 with good ovarian reserve, the live birth rate per cycle at an accredited centre is 55–65%. By the third cycle (cumulative), over 80% of eligible patients achieve a pregnancy. For women over 40, the per-cycle rate drops to 15–25% with own eggs, which is why egg donation or PGT-A is often discussed earlier.")
      ),
      decisionList({
        heading: "How to Budget Across Multiple Cycles",
        intro: "Think in terms of cumulative success rather than single-cycle cost.",
        items: [
          { icon: "Target", situation: "Under 35, good reserve, first IVF attempt", recommendation: "Budget for 1–2 cycles. With blastocyst culture and ICSI, most couples succeed within this range." },
          { icon: "ClipboardList", situation: "35–38 years or prior failed cycle", recommendation: "Budget for 2–3 cycles. Consider freeze-all + FET on cycle 2 if fresh transfer is suboptimal." },
          { icon: "Microscope", situation: "Over 40 or very low AMH (<0.5)", recommendation: "Discuss donor egg IVF as a parallel option. Per-cycle cost is higher but success rate per transfer can reach 65–70%." },
          { icon: "ShieldCheck", situation: "Recurrent miscarriage (2+ losses)", recommendation: "PGT-A genetic testing adds ₹40K–₹80K but can prevent multiple failed transfers and heartbreak." },
        ],
        note: "Ask your doctor for a personalised prognosis score — not just a protocol, but a real estimate of how many cycles they expect you'll need given your specific test results.",
      }),

      highlightCard({
        badge: "Cost Transparency Promise",
        tagline: "At Bavishi Fertility Institute, the price you see is the price you pay — medications included in the estimate, zero surprise bills after egg retrieval.",
        icon: "ShieldCheck",
        color: "rose",
        facts: [
          { label: "Centres in Gujarat", value: "14" },
          { label: "Base IVF cycle from", value: "₹1.2 Lakh" },
          { label: "Written cost estimate", value: "Before you commit" },
          { label: "EMI / payment plans", value: "Available" },
        ],
        bestSuitedFor: "Couples who want complete financial transparency before starting IVF — and a clinic that has served over 5,000 families across Ahmedabad and Gujarat.",
      }),

      h2("IVF Cost at Bavishi Fertility Institute, Ahmedabad"),
      para(
        txt("BFI's 14 centres across Gujarat — including locations in Ahmedabad, Vadodara, Surat, Rajkot, and beyond — follow a transparent pricing model. Your first consultation includes a detailed assessment and a written cost breakdown covering:"),
      ),
      ul(
        "Procedure cost (including OPU, embryology, ET)",
        "Estimated medication cost based on your AMH and AFC",
        "ICSI recommendation (if applicable) and its cost",
        "Whether genetic testing or freeze-all is recommended — and why",
        "EMI and payment plan options"
      ),
      para(
        txt("If you are coming from outside Ahmedabad, our coordinators help you plan your cycle calendar to minimise trips — most monitoring can be done at your nearest BFI centre, with you travelling to Ahmedabad only for OPU and ET.")
      ),

      para(
        txt("For more on the IVF procedure itself, see our guide on "),
        link("IVF treatment", "/treatments/ivf"),
        txt(". If ICSI has been recommended, read "),
        link("what ICSI involves and when it's needed", "/treatments/icsi"),
        txt(". To find your nearest centre, visit our "),
        link("Ahmedabad location page", "/locations/ahmedabad"),
        txt(".")
      ),

      inlineCta({
        headline: "Ready to know your exact IVF cost?",
        subtext: "Book a consultation at any of our 14 Gujarat centres. You'll leave with a written itemised estimate — procedure, medications, and timeline — so you can plan with confidence.",
        accent: "rose",
        buttons: [
          { label: "Book a Consultation", url: "/locations/ahmedabad", variant: "primary" },
          { label: "Call Our Cost Advisor", url: "tel:+919099020202", variant: "secondary" },
        ],
      }),
    ],
  },
};

// ---------- FAQs ----------
const faqs = [
  {
    question: "What is the total cost of IVF in Ahmedabad including medications?",
    answer: "A complete IVF cycle in Ahmedabad — procedure plus medications — typically costs between ₹1.6 lakh and ₹2.8 lakh. The base procedure costs ₹1.2L–₹1.8L; gonadotropin medications add ₹40,000–₹80,000 depending on your ovarian response. At BFI, you receive a written estimate covering both before you start.",
  },
  {
    question: "Why is IVF cheaper in Ahmedabad than in Mumbai or Delhi?",
    answer: "Lower real-estate and operational costs in Ahmedabad translate to lower clinic overheads, and these savings are passed on to patients. Lab quality and ICSI/blastocyst success rates at accredited Ahmedabad centres are comparable to metro cities. You get the same international standard of embryology at a 25–40% lower price.",
  },
  {
    question: "Is ICSI included in the IVF package?",
    answer: "Usually not — ICSI is an add-on procedure that costs ₹20,000–₹30,000 extra. However, most embryologists recommend ICSI for any male factor issue or if you have had poor fertilisation in a previous cycle. Ask your clinic upfront whether they recommend ICSI for your case and get the cost in writing.",
  },
  {
    question: "Does health insurance cover IVF treatment in India?",
    answer: "Most standard Indian health insurance plans do not cover IVF. A small number of corporate group plans and specialist maternity riders include ₹50K–₹1.5L in fertility cover. Check your policy for 'infertility treatment' or 'assisted reproduction'. PMJAY (Ayushman Bharat) does not currently cover IVF.",
  },
  {
    question: "What are the hidden costs in IVF that no one tells you about?",
    answer: "The main surprises are: (1) medications — often not included in headline quotes; (2) ICSI if needed; (3) embryo freezing and annual cryo-storage fees; (4) FET (frozen embryo transfer) cost if your fresh transfer fails; (5) repeat cycle costs. Ask for a written all-inclusive estimate before signing anything.",
  },
  {
    question: "How many IVF cycles does a person typically need?",
    answer: "For women under 35 with good ovarian reserve, most couples succeed within 1–2 cycles. By the third cycle, cumulative live birth rates exceed 80% at accredited centres. For women over 40 or with low AMH, 2–4 cycles (or discussion of donor eggs) is more typical. Your doctor should give you a personalised prognosis based on your AMH, AFC, and age.",
  },
  {
    question: "Is IVF at a government hospital cheaper and equally effective?",
    answer: "Government IVF is cheaper (₹85K–₹1.6L all-in) but comes with significant trade-offs: waiting lists of 6–18 months, limited access to blastocyst culture or ICSI, and no donor-egg or PGT-A programmes at most centres. For patients who need these advanced protocols, the cost difference rarely justifies the wait or the compromise in success rate.",
  },
  {
    question: "Can I pay for IVF in instalments or on EMI?",
    answer: "Yes. Bavishi Fertility Institute offers payment plans and EMI options through partner financial services. Discuss this at your first consultation — our team will help you structure a payment plan so that cost is not a barrier to starting treatment.",
  },
];

// ---------- Excerpt & SEO ----------
const excerpt = "In Ahmedabad, a complete IVF cycle costs ₹1.6L–₹2.8L all-in — significantly less than Mumbai or Delhi. This guide breaks down exactly what's included, what costs extra, and how to get a transparent itemised quote from Bavishi Fertility Institute's 14 Gujarat centres.";

const readMins = 9;

const seo = {
  metaTitle: "IVF Cost in Ahmedabad 2025 — Complete Breakdown | Bavishi Fertility Institute",
  metaDescription: "IVF in Ahmedabad costs ₹1.6L–₹2.8L all-in. See exactly what's included, what's extra (ICSI, PGT, meds), and how Ahmedabad compares to Mumbai & Delhi. Get a written itemised quote at BFI.",
  keywords: "IVF cost Ahmedabad, IVF treatment price Gujarat, IVF cost India 2025, how much does IVF cost, IVF package Ahmedabad, Bavishi Fertility Institute cost",
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
  console.log(`[enrich-02] Connecting to ${BASE}...`);
  const token = await login();
  const auth = { Authorization: `JWT ${token}` };
  console.log("[enrich-02] Login OK");
  const { AUTHOR_ID, REVIEWER_ID } = await lookupAuthors(auth);
  const blog = await findBlog(SLUG, auth);
  if (!blog) { console.error(`[enrich-02] Not found: ${SLUG}`); process.exit(1); }
  console.log(`[enrich-02] Found id=${blog.id} — patching...`);
  await patchBlog(blog.id, { content, faqs, excerpt, readMins, seo, author: AUTHOR_ID, reviewedBy: REVIEWER_ID, heroImage: null, _status: "published" }, auth);
  console.log(`[enrich-02] ✓ Done! ${BASE}/blog/${SLUG}`);
};

run().catch(e => { console.error("[enrich-02] FAILED:", e.message); process.exit(1); });
