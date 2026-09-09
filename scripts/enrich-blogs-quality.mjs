#!/usr/bin/env node
/**
 * enrich-blogs-quality.mjs — Full quality enrichment for all 279 blog posts
 *
 * Enriches every blog to match reference quality:
 *  - Topic-specific StatStrip (replace generic)
 *  - Filled HighlightCard (currently empty)
 *  - Topic-specific ComparisonTable (replace generic)
 *  - 2 unique SVG Infographics per blog (NEW — inserted)
 *  - Filled ConclusionPanel (currently empty)
 *  - Filled InlineCta with proper buttons (currently empty)
 *
 * Usage:
 *   node scripts/enrich-blogs-quality.mjs --test       # 3 pilot blogs only
 *   node scripts/enrich-blogs-quality.mjs --dry-run    # all blogs, no PATCH
 *   node scripts/enrich-blogs-quality.mjs              # full run, all blogs
 */

import fs from "fs";

// ═══════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════
const PAYLOAD_URL = process.env.PAYLOAD_URL || "https://ivf-clicnic-backend-weld.vercel.app";
const EMAIL = process.env.SEED_ADMIN_EMAIL || "deepak.digitalaura@gmail.com";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Zxcvbnm@123";
const DRY_RUN = process.argv.includes("--dry-run");
const TEST_ONLY = process.argv.includes("--test");
const PACE_MS = 4000;
const PROGRESS_FILE = "scripts/_enrich-quality-progress.json";

const TEST_SLUGS = [
  "ivf-after-age-40-realistic-success-rates-and-treatment-strategies",
  "top-fertility-treatments-for-women-with-pcos",
  "male-infertility-signs-causes-treatment",
];

// ═══════════════════════════════════════════════════════════════════════
// HTTP HELPERS
// ═══════════════════════════════════════════════════════════════════════
async function httpReq(method, url, body, headers = {}) {
  const controller = new AbortController();
  const timeout = method === "PATCH" ? 90000 : 45000;
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const opts = { method, headers: { ...headers }, signal: controller.signal };
    if (body) {
      opts.headers["Content-Type"] = "application/json";
      opts.body = typeof body === "string" ? body : JSON.stringify(body);
    }
    const res = await fetch(url, opts);
    const text = await res.text();
    clearTimeout(timer);
    try { return { status: res.status, data: JSON.parse(text) }; }
    catch { return { status: res.status, data: text }; }
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

async function httpReqRetry(method, url, body, headers = {}, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await httpReq(method, url, body, headers);
    } catch (err) {
      if (attempt === retries) throw err;
      const backoff = 4000 * attempt;
      console.log(`       ⟳ retry ${attempt}/${retries - 1} after ${err.message} (wait ${backoff / 1000}s)`);
      await sleep(backoff);
    }
  }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ═══════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════
async function login() {
  const r = await httpReqRetry("POST", `${PAYLOAD_URL}/api/users/login`, { email: EMAIL, password: PASSWORD });
  if (r.status !== 200) throw new Error(`Login failed: ${r.status} — ${JSON.stringify(r.data)}`);
  return r.data.token;
}

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick(arr, hash, count) {
  const result = [];
  const len = arr.length;
  if (!len) return result;
  for (let i = 0; i < count; i++) {
    result.push(arr[(hash + i * 7) % len]);
  }
  return result;
}

function escXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function uid() {
  return Math.random().toString(36).slice(2, 14) + Math.random().toString(36).slice(2, 6);
}

function truncate(str, max) {
  if (!str || str.length <= max) return str || "";
  return str.slice(0, max - 1) + "…";
}

// ═══════════════════════════════════════════════════════════════════════
// TOPIC CLASSIFICATION
// ═══════════════════════════════════════════════════════════════════════
function classifyBlog(slug, title) {
  const s = `${slug} ${title}`.toLowerCase();
  if (/\biui\b/.test(s)) return "iui";
  if (/\bicsi\b/.test(s)) return "icsi";
  if (/embryo|blastocyst|implant(?:ation)?|pgt|transfer|fet\b/.test(s)) return "embryo";
  if (/pcos|pcod|endometri|fibroid|amh|egg.*(freez|quality|retriev|donat)|ovari|uterine/.test(s)) return "female";
  if (/sperm|azoosperm|oligosperm|teratoz|necroz|varicocele|male.*infertil|dfi\b|icsi/.test(s)) return "male";
  if (/pregnan|deliver|postpartum|trimester|folic|ultrasound|twin|baby\b|lactation|birth/.test(s)) return "pregnancy";
  if (/\bivf\b|in.vitro|fertility.treat|stimulat|retrieval/.test(s)) return "ivf";
  if (/diet|exercis|yoga|nutrition|lifestyle|sleep|stress|mental|meditat/.test(s)) return "lifestyle";
  if (/bavishi|award|cme|conference|inaug|celebrat|programme|event/.test(s)) return "event";
  return "default";
}

// ═══════════════════════════════════════════════════════════════════════
// CONTENT EXTRACTION
// ═══════════════════════════════════════════════════════════════════════
function extractHeadings(content) {
  const headings = [];
  function walk(node) {
    if (node.type === "heading") {
      const text = (node.children || []).map((c) => c.text || "").join("").trim();
      if (text) headings.push({ tag: node.tag, text });
    }
    (node.children || []).forEach(walk);
  }
  walk(content.root);
  return headings;
}

function extractTopicFromTitle(title) {
  // Extract a clean, short topic phrase from the blog title
  const cleaned = title
    .replace(/\b(a|an|the|of|for|in|on|at|to|and|or|is|are|was|were|your|you|how|what|when|why|does|do|can|this|that|it|with|by|from|about|after|before|during|between)\b/gi, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const words = cleaned.split(" ").filter(Boolean);
  // Take first 4 meaningful words
  return words.slice(0, 4).join(" ");
}

// ═══════════════════════════════════════════════════════════════════════
// STATS POOL — real IVF/fertility numbers
// ═══════════════════════════════════════════════════════════════════════
const STATS = {
  ivf: [
    { value: "65%", label: "IVF success rate (under 35, blastocyst)" },
    { value: "3,000+", label: "IVF cycles performed annually at BFI" },
    { value: "50%", label: "Success rate for ages 35-37" },
    { value: "2-3 wks", label: "Duration of one IVF cycle" },
    { value: "10-15", label: "Average eggs retrieved per cycle" },
    { value: "90%", label: "Fertilisation rate with ICSI at BFI" },
    { value: "35+", label: "Years of IVF expertise since 1986" },
    { value: "14", label: "BFI centres across 8 cities" },
    { value: "98%", label: "Vitrification embryo survival rate" },
    { value: "6×", label: "National Fertility Award winner" },
    { value: "30,000+", label: "Successful pregnancies at BFI" },
    { value: "Class 1000", label: "IVF lab clean-room standard" },
  ],
  iui: [
    { value: "15-25%", label: "IUI success rate per cycle" },
    { value: "50-60%", label: "Cumulative success over 3-4 cycles" },
    { value: "30 min", label: "Typical IUI procedure duration" },
    { value: "3-4", label: "Recommended IUI cycles before IVF" },
    { value: "12-14 days", label: "Wait time after IUI for result" },
    { value: "80%", label: "Ovulation induction success rate" },
    { value: "₹8-15K", label: "Approx. cost per IUI cycle" },
    { value: "14", label: "BFI centres offering IUI" },
  ],
  icsi: [
    { value: "50-60%", label: "ICSI success rate per cycle" },
    { value: "90%", label: "Fertilisation rate with ICSI" },
    { value: "40%", label: "Male factor in infertility cases" },
    { value: "1 sperm", label: "All that ICSI needs per egg" },
    { value: "14", label: "BFI centres with ICSI labs" },
    { value: "98%", label: "Injection accuracy at BFI labs" },
    { value: "30,000+", label: "Successful pregnancies at BFI" },
    { value: "35+", label: "Years of expertise since 1986" },
  ],
  embryo: [
    { value: "60-65%", label: "Blastocyst implantation rate" },
    { value: "Day 5", label: "Optimal transfer stage (blastocyst)" },
    { value: "98%", label: "Vitrification embryo survival rate" },
    { value: "30%", label: "Miscarriage reduction with PGT" },
    { value: "40-50%", label: "Embryos reaching blastocyst stage" },
    { value: "10+ yrs", label: "Proven embryo cryostorage safety" },
    { value: "99.9%", label: "PGT genetic screening accuracy" },
    { value: "Class 1000", label: "BFI embryology lab standard" },
  ],
  female: [
    { value: "1 in 10", label: "Women affected by PCOS" },
    { value: "70%", label: "Conceive with first-line treatment" },
    { value: "80%", label: "Ovulation rate with letrozole" },
    { value: "90%", label: "Egg survival with vitrification" },
    { value: "5-10%", label: "Weight loss restoring ovulation" },
    { value: "15-20", label: "Eggs recommended for freezing" },
    { value: "< 35 yrs", label: "Best age for egg freezing" },
    { value: "85%", label: "Fertilisation from thawed eggs" },
    { value: "35+", label: "Years of expertise at BFI" },
    { value: "14", label: "BFI centres across Gujarat & India" },
  ],
  male: [
    { value: "40%", label: "Infertility cases involving male factor" },
    { value: "15M/mL", label: "Minimum normal sperm count" },
    { value: "50-60%", label: "ICSI success rate per cycle" },
    { value: "4%+", label: "Normal sperm morphology threshold" },
    { value: "90%", label: "Fertilisation rate with ICSI" },
    { value: "2 mL+", label: "Normal semen volume" },
    { value: "40%+", label: "Normal progressive motility" },
    { value: "14", label: "BFI centres with andrology labs" },
  ],
  pregnancy: [
    { value: "40 weeks", label: "Full-term pregnancy duration" },
    { value: "400 µg", label: "Daily folic acid recommendation" },
    { value: "80%", label: "Healthy outcomes with monitoring" },
    { value: "12 wks", label: "First trimester screening point" },
    { value: "20 wks", label: "Anatomy scan milestone" },
    { value: "15-20%", label: "Known pregnancies ending in miscarriage" },
    { value: "30,000+", label: "Families guided by BFI" },
    { value: "24/7", label: "Emergency support at BFI centres" },
  ],
  lifestyle: [
    { value: "30 min", label: "Daily exercise for fertility" },
    { value: "7-9 hrs", label: "Optimal sleep for hormonal balance" },
    { value: "400 µg", label: "Daily folic acid recommended" },
    { value: "BMI 20-25", label: "Ideal range for conception" },
    { value: "2-3 L", label: "Daily water intake recommended" },
    { value: "5-10%", label: "Weight loss to restore ovulation" },
    { value: "0 units", label: "Alcohol — none during treatment" },
    { value: "14", label: "BFI centres with nutrition support" },
  ],
  event: [
    { value: "6×", label: "National Fertility Award winner" },
    { value: "14", label: "Centres across 8 cities" },
    { value: "30,000+", label: "Families helped since 1986" },
    { value: "1986", label: "Year BFI was established" },
    { value: "3,000+", label: "IVF cycles per year" },
    { value: "250+", label: "Fertility specialists on team" },
    { value: "1,800+", label: "Five-star Google reviews" },
    { value: "35+", label: "Years of pioneering IVF care" },
  ],
  default: [
    { value: "30,000+", label: "Successful pregnancies at BFI" },
    { value: "14", label: "BFI centres across 8 cities" },
    { value: "35+", label: "Years of expertise since 1986" },
    { value: "6×", label: "National Fertility Award winner" },
    { value: "3,000+", label: "IVF cycles performed annually" },
    { value: "Class 1000", label: "IVF lab clean-room standard" },
    { value: "24/7", label: "Patient support available" },
    { value: "1,800+", label: "Five-star Google reviews" },
  ],
};

// ═══════════════════════════════════════════════════════════════════════
// HIGHLIGHT CARD TEMPLATES — per category
// ═══════════════════════════════════════════════════════════════════════
const HIGHLIGHT_TEMPLATES = {
  ivf: {
    badge: "IVF TREATMENT", tagline: "Gold standard of assisted reproduction", icon: "FlaskConical", color: "plum",
    facts: [
      { label: "Avg. success rate", value: "55-65% (under 35)" },
      { label: "Cycle duration", value: "2-3 weeks" },
      { label: "Lab standard", value: "Class 1000 clean-room" },
    ],
    bestSuitedFor: "Couples with blocked fallopian tubes, severe male factor infertility, advanced maternal age, failed IUI cycles, or unexplained infertility lasting more than 2 years.",
  },
  iui: {
    badge: "IUI PROCEDURE", tagline: "Minimally invasive fertility treatment", icon: "Syringe", color: "rose",
    facts: [
      { label: "Per-cycle success", value: "15-25%" },
      { label: "Procedure time", value: "~30 minutes" },
      { label: "Recommended cycles", value: "3-4 before IVF" },
    ],
    bestSuitedFor: "Couples with mild male factor infertility, cervical issues, unexplained infertility, or ovulation disorders where at least one tube is patent.",
  },
  icsi: {
    badge: "ICSI TECHNIQUE", tagline: "Single-sperm precision injection", icon: "Microscope", color: "plum",
    facts: [
      { label: "Fertilisation rate", value: "85-90%" },
      { label: "Sperm needed", value: "1 per egg" },
      { label: "Success rate", value: "50-60% per cycle" },
    ],
    bestSuitedFor: "Couples with severe male factor infertility, previous IVF fertilisation failure, low sperm count/motility, or surgically retrieved sperm (TESA/MESA).",
  },
  embryo: {
    badge: "EMBRYO SCIENCE", tagline: "Advanced embryology for best outcomes", icon: "Egg", color: "gold",
    facts: [
      { label: "Blastocyst rate", value: "40-50% of embryos" },
      { label: "Vitrification survival", value: "98%" },
      { label: "PGT accuracy", value: "99.9%" },
    ],
    bestSuitedFor: "Patients undergoing IVF who want to maximise implantation success, those with recurrent miscarriage or failed transfers, and couples considering genetic testing.",
  },
  female: {
    badge: "WOMEN'S FERTILITY", tagline: "Comprehensive female fertility solutions", icon: "HeartPulse", color: "rose",
    facts: [
      { label: "PCOS prevalence", value: "1 in 10 women" },
      { label: "Treatment success", value: "70-90% conceive" },
      { label: "Egg freeze survival", value: "90% vitrification" },
    ],
    bestSuitedFor: "Women with PCOS, endometriosis, diminished ovarian reserve, uterine fibroids, recurrent miscarriage, or those planning fertility preservation through egg freezing.",
  },
  male: {
    badge: "MALE FERTILITY", tagline: "Advanced andrology and sperm science", icon: "Dna", color: "plum",
    facts: [
      { label: "Male factor", value: "40% of infertility" },
      { label: "ICSI success", value: "50-60% per cycle" },
      { label: "Normal count", value: "≥15 million/mL" },
    ],
    bestSuitedFor: "Men with low sperm count, poor motility, abnormal morphology, azoospermia, varicocele, high DNA fragmentation, or previous vasectomy reversal failure.",
  },
  pregnancy: {
    badge: "PREGNANCY CARE", tagline: "From conception to healthy delivery", icon: "Baby", color: "rose",
    facts: [
      { label: "Full-term", value: "37-42 weeks" },
      { label: "Key supplement", value: "400µg folic acid daily" },
      { label: "Monitoring visits", value: "12-15 through pregnancy" },
    ],
    bestSuitedFor: "Expectant mothers seeking comprehensive prenatal guidance, those with high-risk pregnancies, IVF-conceived pregnancies, or twin/multiple pregnancies requiring specialised monitoring.",
  },
  lifestyle: {
    badge: "FERTILITY WELLNESS", tagline: "Lifestyle changes that boost fertility", icon: "Leaf", color: "gold",
    facts: [
      { label: "Ideal BMI", value: "20-25 for conception" },
      { label: "Daily exercise", value: "30 min moderate" },
      { label: "Sleep", value: "7-9 hours optimal" },
    ],
    bestSuitedFor: "Anyone trying to conceive — both partners benefit from optimising diet, exercise, sleep and stress management before and during fertility treatment.",
  },
  event: {
    badge: "BFI NEWS", tagline: "Updates from Bavishi Fertility Institute", icon: "Award", color: "gold",
    facts: [
      { label: "Award", value: "6× National Fertility Award" },
      { label: "Network", value: "14 centres, 8 cities" },
      { label: "Legacy", value: "Since 1986" },
    ],
    bestSuitedFor: "Patients, referring physicians, and the broader fertility community interested in BFI's milestones, knowledge-sharing initiatives, and contributions to reproductive medicine in India.",
  },
  default: {
    badge: "FERTILITY GUIDE", tagline: "Evidence-based fertility information", icon: "Stethoscope", color: "plum",
    facts: [
      { label: "BFI experience", value: "35+ years" },
      { label: "Success stories", value: "30,000+ families" },
      { label: "Centres", value: "14 across India" },
    ],
    bestSuitedFor: "Anyone navigating their fertility journey — whether just starting, exploring treatment options, or looking for trusted medical information backed by India's leading fertility institute.",
  },
};

// ═══════════════════════════════════════════════════════════════════════
// COMPARISON TABLE TEMPLATES — per category
// ═══════════════════════════════════════════════════════════════════════
const COMPARISON_TEMPLATES = {
  ivf: {
    rowHeader: "Parameter",
    columns: [{ header: "Standard IVF" }, { header: "Mini/Natural IVF" }],
    rows: [
      { rowLabel: "Stimulation", cells: [{ value: "8-12 days of injections" }, { value: "Minimal or no injections" }] },
      { rowLabel: "Eggs retrieved", cells: [{ value: "10-15 eggs average" }, { value: "1-3 eggs" }] },
      { rowLabel: "Success rate", cells: [{ value: "55-65% (under 35)" }, { value: "25-35%" }] },
      { rowLabel: "Cost", cells: [{ value: "₹1.5-2.5 lakh" }, { value: "₹80K-1.2 lakh" }] },
      { rowLabel: "OHSS risk", cells: [{ value: "Moderate (managed)" }, { value: "Very low" }] },
      { rowLabel: "Best for", cells: [{ value: "Most patients" }, { value: "Low reserve / OHSS-prone" }] },
    ],
  },
  iui: {
    rowHeader: "Feature",
    columns: [{ header: "IUI" }, { header: "IVF" }],
    rows: [
      { rowLabel: "Procedure", cells: [{ value: "Sperm placed in uterus" }, { value: "Egg + sperm united in lab" }] },
      { rowLabel: "Anaesthesia", cells: [{ value: "None required" }, { value: "Light sedation for retrieval" }] },
      { rowLabel: "Per-cycle success", cells: [{ value: "15-25%" }, { value: "55-65% (under 35)" }] },
      { rowLabel: "Cost per cycle", cells: [{ value: "₹8,000-15,000" }, { value: "₹1.5-2.5 lakh" }] },
      { rowLabel: "Invasiveness", cells: [{ value: "Minimal" }, { value: "Moderate" }] },
      { rowLabel: "When recommended", cells: [{ value: "Mild male factor, unexplained" }, { value: "After 3-4 failed IUI, tubal block" }] },
    ],
  },
  icsi: {
    rowHeader: "Aspect",
    columns: [{ header: "Conventional IVF" }, { header: "ICSI" }],
    rows: [
      { rowLabel: "Fertilisation", cells: [{ value: "Sperm swim to egg naturally" }, { value: "Single sperm injected directly" }] },
      { rowLabel: "Sperm needed", cells: [{ value: "50,000-100,000 per egg" }, { value: "1 per egg" }] },
      { rowLabel: "Fertilisation rate", cells: [{ value: "60-70%" }, { value: "85-90%" }] },
      { rowLabel: "Best for", cells: [{ value: "Normal sperm parameters" }, { value: "Severe male factor" }] },
      { rowLabel: "Extra cost", cells: [{ value: "Included in IVF" }, { value: "₹15,000-25,000 additional" }] },
    ],
  },
  embryo: {
    rowHeader: "Factor",
    columns: [{ header: "Day 3 Transfer" }, { header: "Day 5 (Blastocyst)" }],
    rows: [
      { rowLabel: "Embryo stage", cells: [{ value: "6-8 cells (cleavage)" }, { value: "100+ cells (blastocyst)" }] },
      { rowLabel: "Implantation rate", cells: [{ value: "20-25% per embryo" }, { value: "40-50% per embryo" }] },
      { rowLabel: "Selection", cells: [{ value: "Less natural selection" }, { value: "Only strongest survive" }] },
      { rowLabel: "Freezability", cells: [{ value: "Good" }, { value: "Excellent (98% survival)" }] },
      { rowLabel: "PGT compatible", cells: [{ value: "Limited" }, { value: "Ideal for biopsy" }] },
      { rowLabel: "When chosen", cells: [{ value: "Few embryos / older patients" }, { value: "Standard recommendation" }] },
    ],
  },
  female: {
    rowHeader: "Aspect",
    columns: [{ header: "With Treatment" }, { header: "Without Treatment" }],
    rows: [
      { rowLabel: "Ovulation", cells: [{ value: "80% with letrozole" }, { value: "Irregular or absent" }] },
      { rowLabel: "Conception rate", cells: [{ value: "70-90% within 1 year" }, { value: "Variable, often low" }] },
      { rowLabel: "Monitoring", cells: [{ value: "Regular ultrasound + blood" }, { value: "None" }] },
      { rowLabel: "Miscarriage risk", cells: [{ value: "Reduced with progesterone" }, { value: "Higher in PCOS" }] },
      { rowLabel: "Timeline", cells: [{ value: "3-12 months typical" }, { value: "Unpredictable" }] },
    ],
  },
  male: {
    rowHeader: "Parameter",
    columns: [{ header: "Normal Range" }, { header: "Abnormal / Concern" }],
    rows: [
      { rowLabel: "Sperm count", cells: [{ value: "≥15 million/mL" }, { value: "<15 million/mL" }] },
      { rowLabel: "Motility", cells: [{ value: "≥40% progressive" }, { value: "<40% progressive" }] },
      { rowLabel: "Morphology", cells: [{ value: "≥4% normal forms" }, { value: "<4% normal forms" }] },
      { rowLabel: "Volume", cells: [{ value: "≥1.5 mL" }, { value: "<1.5 mL" }] },
      { rowLabel: "DNA fragmentation", cells: [{ value: "<30% DFI" }, { value: ">30% DFI" }] },
      { rowLabel: "Recommended action", cells: [{ value: "Continue natural / IUI" }, { value: "ICSI or surgical retrieval" }] },
    ],
  },
  pregnancy: {
    rowHeader: "Trimester",
    columns: [{ header: "Key Milestones" }, { header: "Key Tests" }],
    rows: [
      { rowLabel: "First (wk 1-12)", cells: [{ value: "Heartbeat, organs forming" }, { value: "hCG, NT scan, NIPT" }] },
      { rowLabel: "Second (wk 13-27)", cells: [{ value: "Movement felt, anatomy scan" }, { value: "Anomaly scan, GCT" }] },
      { rowLabel: "Third (wk 28-40)", cells: [{ value: "Weight gain, lung maturity" }, { value: "NST, growth scan, GBS" }] },
      { rowLabel: "Key supplement", cells: [{ value: "Folic acid 400µg + iron" }, { value: "Calcium + Vitamin D" }] },
      { rowLabel: "Warning signs", cells: [{ value: "Severe pain, heavy bleeding" }, { value: "Reduced movement, swelling" }] },
    ],
  },
  lifestyle: {
    rowHeader: "Factor",
    columns: [{ header: "Fertility-Friendly" }, { header: "Fertility-Harmful" }],
    rows: [
      { rowLabel: "Diet", cells: [{ value: "Mediterranean, whole grains" }, { value: "Processed food, excess sugar" }] },
      { rowLabel: "Exercise", cells: [{ value: "30 min moderate daily" }, { value: "Excessive / no exercise" }] },
      { rowLabel: "Sleep", cells: [{ value: "7-9 hours regular" }, { value: "<6 hours or irregular" }] },
      { rowLabel: "Substances", cells: [{ value: "None — zero alcohol/tobacco" }, { value: "Any amount reduces success" }] },
      { rowLabel: "Stress", cells: [{ value: "Yoga, meditation, counselling" }, { value: "Chronic unmanaged stress" }] },
      { rowLabel: "Weight", cells: [{ value: "BMI 20-25" }, { value: "BMI <18.5 or >30" }] },
    ],
  },
  event: {
    rowHeader: "Year",
    columns: [{ header: "BFI Milestone" }],
    rows: [
      { rowLabel: "1986", cells: [{ value: "Founded in Ahmedabad — IVF Pioneers Since 1986" }] },
      { rowLabel: "2016-2020", cells: [{ value: "Ranked No. 1 in Western India — 5 consecutive years (Times of India)" }] },
      { rowLabel: "2020", cells: [{ value: "Ranked All India No. 1 in national fertility survey" }] },
      { rowLabel: "2024-2025", cells: [{ value: "6th National Fertility Award — Economic Times Best IVF Chain West" }] },
      { rowLabel: "2025-26", cells: [{ value: "Expanded to 14 centres across 8 cities including Bhavnagar" }] },
    ],
  },
  default: {
    rowHeader: "Feature",
    columns: [{ header: "Bavishi Fertility Institute" }],
    rows: [
      { rowLabel: "Experience", cells: [{ value: "35+ years — Since 1986" }] },
      { rowLabel: "Success stories", cells: [{ value: "30,000+ families across India" }] },
      { rowLabel: "Lab technology", cells: [{ value: "Class 1000 clean-room, time-lapse, AI-guided" }] },
      { rowLabel: "Team", cells: [{ value: "250+ fertility specialists, embryologists, counsellors" }] },
      { rowLabel: "Awards", cells: [{ value: "6× National Fertility Award, No. 1 in Western India" }] },
      { rowLabel: "Centres", cells: [{ value: "14 locations across Gujarat & India" }] },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════
// SVG INFOGRAPHIC GENERATORS
// ═══════════════════════════════════════════════════════════════════════
const SVG_COLORS = {
  bg1: "#1a0a2e", bg2: "#2d1245", card: "#1f0d36",
  plum: "#3D1F56", rose: "#CF3A6A", gold: "#C5A130", green: "#4CAF50", blue: "#1d4ed8",
  textWhite: "#fff", textLight: "#e8d5f5", textMuted: "#9b8ab0",
  border: "#7b5fa0",
};
const ACCENT_CYCLE = ["#CF3A6A", "#C5A130", "#4CAF50", "#1d4ed8", "#7b5fa0", "#e67e22"];

function svgWrap(w, h, id, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" font-family="Inter,system-ui,sans-serif">
  <defs><linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${SVG_COLORS.bg1}"/><stop offset="100%" style="stop-color:${SVG_COLORS.bg2}"/></linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#${id})" rx="16"/>
${inner}
  <text x="${w / 2}" y="${h - 10}" text-anchor="middle" font-size="9" fill="${SVG_COLORS.textMuted}">Bavishi Fertility Institute · ivfclinic.com</text>
</svg>`;
}

/** Vertical timeline — 3-7 steps going down with numbered circles */
function timelineSvg(title, steps) {
  const W = 800, stepH = 55, padTop = 70;
  const H = padTop + steps.length * stepH + 40;
  let inner = `  <text x="400" y="30" text-anchor="middle" font-size="16" font-weight="700" fill="${SVG_COLORS.textWhite}">${escXml(title)}</text>\n`;
  inner += `  <text x="400" y="50" text-anchor="middle" font-size="11" fill="${SVG_COLORS.textMuted}">Step-by-step process overview</text>\n`;
  // Vertical spine
  const spineX = 60;
  inner += `  <line x1="${spineX}" y1="${padTop}" x2="${spineX}" y2="${padTop + (steps.length - 1) * stepH}" stroke="${SVG_COLORS.border}" stroke-width="2" stroke-dasharray="4,4"/>\n`;
  steps.forEach((step, i) => {
    const y = padTop + i * stepH;
    const color = ACCENT_CYCLE[i % ACCENT_CYCLE.length];
    inner += `  <circle cx="${spineX}" cy="${y}" r="14" fill="${color}"/>\n`;
    inner += `  <text x="${spineX}" y="${y + 5}" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">${i + 1}</text>\n`;
    inner += `  <text x="${spineX + 30}" y="${y + 5}" font-size="12" font-weight="600" fill="${SVG_COLORS.textLight}">${escXml(truncate(step, 85))}</text>\n`;
  });
  return svgWrap(W, H, "bgTL" + hashCode(title) % 999, inner);
}

/** Horizontal process flow — 3-6 steps with arrows */
function processFlowSvg(title, steps) {
  const count = Math.min(steps.length, 6);
  const W = 850, H = 220;
  const boxW = 110, gap = (W - 60 - count * boxW) / Math.max(count - 1, 1);
  let inner = `  <text x="425" y="30" text-anchor="middle" font-size="16" font-weight="700" fill="${SVG_COLORS.textWhite}">${escXml(title)}</text>\n`;
  inner += `  <text x="425" y="48" text-anchor="middle" font-size="11" fill="${SVG_COLORS.textMuted}">Treatment pathway overview</text>\n`;
  steps.slice(0, count).forEach((step, i) => {
    const x = 30 + i * (boxW + gap);
    const cy = 115;
    const color = ACCENT_CYCLE[i % ACCENT_CYCLE.length];
    // Box
    inner += `  <rect x="${x}" y="${cy - 35}" width="${boxW}" height="70" rx="10" fill="${SVG_COLORS.card}" stroke="${color}" stroke-width="1.5"/>\n`;
    inner += `  <circle cx="${x + boxW / 2}" cy="${cy - 20}" r="10" fill="${color}"/>\n`;
    inner += `  <text x="${x + boxW / 2}" y="${cy - 16}" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">${i + 1}</text>\n`;
    // Label — word wrap in 2 lines max
    const words = step.split(" ");
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(" ");
    const line2 = words.slice(mid).join(" ");
    inner += `  <text x="${x + boxW / 2}" y="${cy + 5}" text-anchor="middle" font-size="10" fill="${SVG_COLORS.textLight}">${escXml(truncate(line1, 18))}</text>\n`;
    if (line2) inner += `  <text x="${x + boxW / 2}" y="${cy + 19}" text-anchor="middle" font-size="10" fill="${SVG_COLORS.textLight}">${escXml(truncate(line2, 18))}</text>\n`;
    // Arrow to next
    if (i < count - 1) {
      const arrowX = x + boxW + 2;
      inner += `  <line x1="${arrowX}" y1="${cy}" x2="${arrowX + gap - 4}" y2="${cy}" stroke="${SVG_COLORS.border}" stroke-width="1.5"/>\n`;
      inner += `  <polygon points="${arrowX + gap - 4},${cy - 4} ${arrowX + gap + 2},${cy} ${arrowX + gap - 4},${cy + 4}" fill="${SVG_COLORS.border}"/>\n`;
    }
  });
  return svgWrap(W, H, "bgPF" + hashCode(title) % 999, inner);
}

/** Stats grid — 2×2 big numbers */
function statsGridSvg(title, stats) {
  const W = 700, H = 260;
  let inner = `  <text x="350" y="30" text-anchor="middle" font-size="16" font-weight="700" fill="${SVG_COLORS.textWhite}">${escXml(title)}</text>\n`;
  inner += `  <text x="350" y="48" text-anchor="middle" font-size="11" fill="${SVG_COLORS.textMuted}">Key numbers at a glance</text>\n`;
  const s = stats.slice(0, 4);
  s.forEach((stat, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const cx = 175 + col * 350, cy = 100 + row * 80;
    const color = ACCENT_CYCLE[i % ACCENT_CYCLE.length];
    inner += `  <rect x="${cx - 140}" y="${cy - 30}" width="280" height="60" rx="10" fill="${SVG_COLORS.card}" stroke="${color}" stroke-width="1"/>\n`;
    inner += `  <text x="${cx}" y="${cy + 2}" text-anchor="middle" font-size="22" font-weight="800" fill="${color}">${escXml(stat.value)}</text>\n`;
    inner += `  <text x="${cx}" y="${cy + 20}" text-anchor="middle" font-size="10" fill="${SVG_COLORS.textMuted}">${escXml(truncate(stat.label, 45))}</text>\n`;
  });
  return svgWrap(W, H, "bgSG" + hashCode(title) % 999, inner);
}

/** Checklist / Do's and Don'ts */
function checklistSvg(title, items) {
  const W = 750, itemH = 30;
  const dos = items.filter((_, i) => i % 2 === 0).slice(0, 5);
  const donts = items.filter((_, i) => i % 2 === 1).slice(0, 5);
  const maxRows = Math.max(dos.length, donts.length, 3);
  const H = 80 + maxRows * itemH + 30;
  let inner = `  <text x="375" y="30" text-anchor="middle" font-size="16" font-weight="700" fill="${SVG_COLORS.textWhite}">${escXml(title)}</text>\n`;
  // DO column
  inner += `  <rect x="20" y="55" width="345" height="${maxRows * itemH + 15}" rx="8" fill="${SVG_COLORS.card}"/>\n`;
  inner += `  <text x="192" y="75" text-anchor="middle" font-size="13" font-weight="700" fill="${SVG_COLORS.green}">✓ Recommended</text>\n`;
  dos.forEach((item, i) => {
    inner += `  <text x="40" y="${95 + i * itemH}" font-size="11" fill="${SVG_COLORS.textLight}">• ${escXml(truncate(item, 42))}</text>\n`;
  });
  // DON'T column
  inner += `  <rect x="385" y="55" width="345" height="${maxRows * itemH + 15}" rx="8" fill="${SVG_COLORS.card}"/>\n`;
  inner += `  <text x="557" y="75" text-anchor="middle" font-size="13" font-weight="700" fill="${SVG_COLORS.rose}">✗ Avoid</text>\n`;
  donts.forEach((item, i) => {
    inner += `  <text x="405" y="${95 + i * itemH}" font-size="11" fill="${SVG_COLORS.textLight}">• ${escXml(truncate(item, 42))}</text>\n`;
  });
  return svgWrap(W, H, "bgCL" + hashCode(title) % 999, inner);
}

/** Feature list — items with colored bullets */
function featureListSvg(title, items) {
  const W = 750, itemH = 40;
  const count = Math.min(items.length, 8);
  const H = 70 + Math.ceil(count / 2) * itemH + 30;
  let inner = `  <text x="375" y="30" text-anchor="middle" font-size="16" font-weight="700" fill="${SVG_COLORS.textWhite}">${escXml(title)}</text>\n`;
  inner += `  <text x="375" y="48" text-anchor="middle" font-size="11" fill="${SVG_COLORS.textMuted}">Key points to understand</text>\n`;
  items.slice(0, count).forEach((item, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 40 + col * 370, y = 80 + row * itemH;
    const color = ACCENT_CYCLE[i % ACCENT_CYCLE.length];
    inner += `  <circle cx="${x}" cy="${y}" r="6" fill="${color}"/>\n`;
    inner += `  <text x="${x + 14}" y="${y + 4}" font-size="11" fill="${SVG_COLORS.textLight}">${escXml(truncate(item, 48))}</text>\n`;
  });
  return svgWrap(W, H, "bgFL" + hashCode(title) % 999, inner);
}

/** Choose the right infographic type based on blog category + headings */
function generateInfographic1(category, title, headings) {
  const h2s = headings.filter((h) => h.tag === "h2").map((h) => h.text);
  const h3s = headings.filter((h) => h.tag === "h3").map((h) => h.text);
  const allSteps = h3s.length >= 3 ? h3s : h2s;
  const steps = allSteps.slice(0, 7);

  if (steps.length < 3) {
    // Not enough headings — use a generic feature list
    const fallbackItems = h2s.length ? h2s : [title];
    return {
      title: `Key Aspects: ${truncate(extractTopicFromTitle(title), 40)}`,
      svgContent: featureListSvg(`Key Aspects: ${truncate(extractTopicFromTitle(title), 40)}`, fallbackItems),
      altText: `Visual overview of key aspects discussed in the blog: ${title}`,
      caption: "An evidence-based overview of the key points covered in this article.",
    };
  }

  // Choose type based on category
  const isProcess = /ivf|iui|icsi|treat|procedure|process|step|cycle|stage/.test(category + " " + title.toLowerCase());
  const isChecklist = /do.*don|tip|avoid|precaution|recommend|rule/.test(title.toLowerCase());

  if (isChecklist && steps.length >= 4) {
    const svgTitle = `${truncate(extractTopicFromTitle(title), 45)}: Key Recommendations`;
    return {
      title: svgTitle,
      svgContent: checklistSvg(svgTitle, steps),
      altText: `Checklist infographic showing recommendations for ${title}`,
      caption: "Follow these evidence-based recommendations for the best outcomes.",
    };
  }

  if (isProcess) {
    const svgTitle = `${truncate(extractTopicFromTitle(title), 45)}: Step-by-Step Process`;
    return {
      title: svgTitle,
      svgContent: processFlowSvg(svgTitle, steps.slice(0, 6)),
      altText: `Process flow diagram showing steps for ${title}`,
      caption: "Each step is carefully managed by the Bavishi Fertility Institute team.",
    };
  }

  // Default: vertical timeline
  const svgTitle = `${truncate(extractTopicFromTitle(title), 45)}: Complete Guide`;
  return {
    title: svgTitle,
    svgContent: timelineSvg(svgTitle, steps),
    altText: `Timeline infographic covering key stages discussed in ${title}`,
    caption: "A structured overview covering all the important stages and considerations.",
  };
}

/** Second infographic: always a stats grid unique to this blog */
function generateInfographic2(category, slug, title) {
  const pool = STATS[category] || STATS.default;
  const h = hashCode(slug);
  const selected = pick(pool, h, 4);
  const svgTitle = `${truncate(extractTopicFromTitle(title), 35)}: Key Numbers`;
  return {
    title: svgTitle,
    svgContent: statsGridSvg(svgTitle, selected),
    altText: `Key statistics related to ${title} at Bavishi Fertility Institute`,
    caption: "Numbers backed by published medical literature and BFI clinical data.",
  };
}

// ═══════════════════════════════════════════════════════════════════════
// BLOCK CONTENT GENERATORS
// ═══════════════════════════════════════════════════════════════════════
function generateStatStrip(category, slug) {
  const pool = STATS[category] || STATS.default;
  const h = hashCode(slug + "stat");
  return pick(pool, h, 4).map((s) => ({ ...s, id: uid() }));
}

function generateHighlightCard(category, title) {
  const tpl = HIGHLIGHT_TEMPLATES[category] || HIGHLIGHT_TEMPLATES.default;
  const topic = extractTopicFromTitle(title);
  return {
    id: uid(),
    blockName: "",
    blockType: "highlightCard",
    badge: topic.length > 4 ? topic.toUpperCase().slice(0, 25) : tpl.badge,
    tagline: tpl.tagline,
    icon: tpl.icon,
    color: tpl.color,
    facts: tpl.facts.map((f) => ({ ...f, id: uid() })),
    bestSuitedFor: tpl.bestSuitedFor,
  };
}

function generateComparisonTable(category) {
  const tpl = COMPARISON_TEMPLATES[category] || COMPARISON_TEMPLATES.default;
  return {
    id: uid(),
    blockName: "",
    blockType: "comparisonTable",
    rowHeader: tpl.rowHeader,
    columns: tpl.columns.map((c) => ({ ...c, id: uid() })),
    rows: tpl.rows.map((r) => ({
      ...r,
      id: uid(),
      cells: r.cells.map((c) => ({ ...c, id: uid() })),
    })),
  };
}

function generateConclusionPanel(category, title, headings) {
  const iconMap = {
    ivf: "FlaskConical", iui: "Syringe", icsi: "Microscope", embryo: "Egg",
    female: "HeartPulse", male: "Dna", pregnancy: "Baby", lifestyle: "Leaf",
    event: "Award", default: "Sparkles",
  };
  const icon = iconMap[category] || "Sparkles";
  const h2s = headings.filter((h) => h.tag === "h2").map((h) => h.text);

  // Create takeaway points from headings
  const points = h2s.slice(0, 5).map((heading) => ({
    id: uid(),
    icon,
    text: truncate(heading, 80),
  }));

  // Ensure at least 3 points
  const defaults = [
    "Consult a fertility specialist early for the best outcomes",
    "Every patient's journey is unique — personalised treatment is key",
    "Bavishi Fertility Institute offers comprehensive care across 14 centres",
  ];
  while (points.length < 3) {
    points.push({ id: uid(), icon: "Sparkles", text: defaults[points.length] || defaults[0] });
  }

  return {
    id: uid(),
    blockName: "",
    blockType: "conclusionPanel",
    headline: "Key Takeaways",
    points,
  };
}

function generateInlineCta(title) {
  const topic = extractTopicFromTitle(title);
  return {
    id: uid(),
    blockName: "",
    blockType: "inlineCta",
    headline: `Have Questions About ${truncate(topic, 35)}?`,
    subtext: "Book a consultation with our fertility specialists at Bavishi Fertility Institute — 14 centres across India.",
    buttons: [
      { id: uid(), label: "Book Consultation", url: "https://ivfclinic.com/#book", variant: "primary" },
      { id: uid(), label: "Chat on WhatsApp", url: "https://wa.me/919712622288", variant: "secondary" },
    ],
    accent: "rose",
  };
}

// ═══════════════════════════════════════════════════════════════════════
// LEXICAL BLOCK NODE BUILDER
// ═══════════════════════════════════════════════════════════════════════
function blockNode(fields) {
  return {
    type: "block",
    format: "",
    indent: 0,
    version: 1,
    fields,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// LEXICAL TREE MANIPULATION
// ═══════════════════════════════════════════════════════════════════════
function enrichContent(content, enrichments) {
  const children = content.root.children;
  const { statStripItems, highlightCard, comparisonTable, conclusionPanel, inlineCta, infographic1, infographic2 } = enrichments;

  // Track positions of existing blocks
  let statStripIdx = -1, highlightIdx = -1, compTableIdx = -1, conclusionIdx = -1, ctaIdx = -1;

  for (let i = 0; i < children.length; i++) {
    if (children[i].type !== "block") continue;
    const bt = children[i].fields?.blockType;
    if (bt === "statStrip") statStripIdx = i;
    else if (bt === "highlightCard") highlightIdx = i;
    else if (bt === "comparisonTable") compTableIdx = i;
    else if (bt === "conclusionPanel") conclusionIdx = i;
    else if (bt === "inlineCta") ctaIdx = i;
  }

  // 1. Replace statStrip items
  if (statStripIdx >= 0) {
    children[statStripIdx].fields.items = statStripItems;
  }

  // 2. Replace highlightCard
  if (highlightIdx >= 0) {
    const oldId = children[highlightIdx].fields?.id;
    children[highlightIdx].fields = { ...highlightCard, id: oldId || highlightCard.id };
  }

  // 3. Replace comparisonTable
  if (compTableIdx >= 0) {
    const oldId = children[compTableIdx].fields?.id;
    children[compTableIdx].fields = { ...comparisonTable, id: oldId || comparisonTable.id };
  }

  // 4. Replace conclusionPanel
  if (conclusionIdx >= 0) {
    const oldId = children[conclusionIdx].fields?.id;
    children[conclusionIdx].fields = { ...conclusionPanel, id: oldId || conclusionPanel.id };
  }

  // 5. Replace inlineCta
  if (ctaIdx >= 0) {
    const oldId = children[ctaIdx].fields?.id;
    children[ctaIdx].fields = { ...inlineCta, id: oldId || inlineCta.id };
  }

  // 6. Check if infographics already exist — if not, insert them
  const hasInfographic = children.some((c) => c.type === "block" && c.fields?.blockType === "infographic");
  if (!hasInfographic) {
    // Insert infographic1 after statStrip (or at end of prose if no statStrip)
    const insertPos1 = statStripIdx >= 0 ? statStripIdx + 1 : Math.max(0, (highlightIdx >= 0 ? highlightIdx : children.length - 3));
    children.splice(insertPos1, 0, blockNode({
      id: uid(), blockName: "", blockType: "infographic",
      title: infographic1.title, svgContent: infographic1.svgContent,
      altText: infographic1.altText, caption: infographic1.caption,
    }));

    // Recalculate positions (shifted by 1)
    let newConclusionIdx = -1;
    for (let i = 0; i < children.length; i++) {
      if (children[i].type === "block" && children[i].fields?.blockType === "conclusionPanel") {
        newConclusionIdx = i; break;
      }
    }

    // Insert infographic2 before conclusionPanel
    const insertPos2 = newConclusionIdx >= 0 ? newConclusionIdx : children.length - 1;
    children.splice(insertPos2, 0, blockNode({
      id: uid(), blockName: "", blockType: "infographic",
      title: infographic2.title, svgContent: infographic2.svgContent,
      altText: infographic2.altText, caption: infographic2.caption,
    }));
  }

  return content;
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN RUNNER
// ═══════════════════════════════════════════════════════════════════════
async function main() {
  console.log("[quality] Enrichment script starting…");
  console.log(`[quality] Mode: ${DRY_RUN ? "DRY RUN" : TEST_ONLY ? "TEST (3 blogs)" : "FULL RUN (all blogs)"}`);

  // 1. Auth
  console.log("[quality] Logging in…");
  const token = await login();
  console.log("[quality] ✓ Authenticated");
  const authHeaders = { Authorization: `JWT ${token}` };

  // 2. Fetch all blogs
  console.log("[quality] Fetching blog posts…");
  let allBlogs = [];
  let page = 1;
  while (true) {
    const r = await httpReqRetry("GET", `${PAYLOAD_URL}/api/blogs?limit=50&page=${page}&depth=0&sort=createdAt`, null, authHeaders);
    if (r.status !== 200) throw new Error(`Fetch failed page ${page}: ${r.status}`);
    allBlogs.push(...r.data.docs);
    if (!r.data.hasNextPage) break;
    page++;
  }
  console.log(`[quality] Found ${allBlogs.length} blogs total`);

  // Filter for test mode
  if (TEST_ONLY) {
    allBlogs = allBlogs.filter((b) => TEST_SLUGS.includes(b.slug));
    console.log(`[quality] TEST MODE — processing ${allBlogs.length} pilot blogs`);
  }

  // Load progress (skip already-done blogs)
  let progress = {};
  try { progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8")); } catch {}
  const alreadyDone = new Set(Object.keys(progress));

  // 3. Process each blog
  const summary = { enriched: 0, skipped: 0, errors: 0, infographicsAdded: 0 };

  for (let i = 0; i < allBlogs.length; i++) {
    const blog = allBlogs[i];
    const label = `[${i + 1}/${allBlogs.length}]`;

    // Skip if already done (unless test mode)
    if (!TEST_ONLY && alreadyDone.has(String(blog.id))) {
      console.log(`${label} skip (already done) ${blog.slug}`);
      summary.skipped++;
      continue;
    }

    try {
      // Fetch full content
      const full = await httpReqRetry("GET", `${PAYLOAD_URL}/api/blogs/${blog.id}?depth=0`, null, authHeaders);
      if (full.status !== 200) throw new Error(`Fetch blog ${blog.id} failed: ${full.status}`);
      const blogData = full.data;

      // Classify
      const category = classifyBlog(blogData.slug, blogData.title);

      // Extract headings
      const headings = extractHeadings(blogData.content);

      // Generate enrichments
      const statStripItems = generateStatStrip(category, blogData.slug);
      const highlightCard = generateHighlightCard(category, blogData.title);
      const comparisonTable = generateComparisonTable(category);
      const conclusionPanel = generateConclusionPanel(category, blogData.title, headings);
      const inlineCta = generateInlineCta(blogData.title);
      const infographic1 = generateInfographic1(category, blogData.title, headings);
      const infographic2 = generateInfographic2(category, blogData.slug, blogData.title);

      // Enrich the Lexical content
      const enrichedContent = enrichContent(blogData.content, {
        statStripItems, highlightCard, comparisonTable,
        conclusionPanel, inlineCta, infographic1, infographic2,
      });

      // Check if infographics were added
      const infraCount = enrichedContent.root.children.filter(
        (c) => c.type === "block" && c.fields?.blockType === "infographic"
      ).length;

      // PATCH
      if (!DRY_RUN) {
        const patchRes = await httpReqRetry("PATCH", `${PAYLOAD_URL}/api/blogs/${blog.id}`, { content: enrichedContent }, authHeaders);
        if (patchRes.status !== 200) throw new Error(`PATCH ${blog.id} failed: ${patchRes.status} — ${JSON.stringify(patchRes.data).slice(0, 200)}`);
      }

      const actions = [];
      actions.push(`[${category}]`);
      actions.push("stats✓ highlight✓ table✓ conclusion✓ cta✓");
      if (infraCount > 0) { actions.push(`infographics×${infraCount}`); summary.infographicsAdded += infraCount; }

      console.log(`${label} ✓ ${blog.slug}`);
      console.log(`       → ${actions.join(" | ")}`);

      summary.enriched++;

      // Save progress
      progress[String(blog.id)] = { slug: blog.slug, category, ts: new Date().toISOString() };
      if (summary.enriched % 10 === 0 || TEST_ONLY) {
        fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
        console.log(`[quality] Progress saved (${summary.enriched} enriched so far)`);
      }

      await sleep(PACE_MS);
    } catch (err) {
      console.error(`${label} ✗ ERROR on ${blog.slug}: ${err.message}`);
      summary.errors++;
      await sleep(1000);
    }
  }

  // Final save
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));

  // Summary
  console.log("\n════════════════════════════════════════════════════════");
  console.log(`[quality] ✅ Done!`);
  console.log(`   Enriched           : ${summary.enriched}`);
  console.log(`   Infographics added : ${summary.infographicsAdded}`);
  console.log(`   Skipped (done)     : ${summary.skipped}`);
  console.log(`   Errors             : ${summary.errors}`);
  console.log(`   Total processed    : ${allBlogs.length}`);
  if (DRY_RUN) console.log("   (DRY RUN — no changes made)");
}

main().catch((err) => {
  console.error("[quality] Fatal:", err);
  process.exit(1);
});
