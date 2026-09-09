#!/usr/bin/env node
/* =====================================================================
 * enrich-blog-nonhuman-images.mjs
 *
 * PURPOSE: Replace ALL human images in blog hero + externalImage blocks
 * with verified non-human medical/lab/science imagery from Pexels.
 * Also adds enrichment blocks (statStrip, highlightCard, comparisonTable,
 * conclusionPanel, externalImage, inlineCta) to any blog not yet enriched.
 *
 * WHAT IT TOUCHES:
 *   • heroImage  — if it's a known human Payload Media ID (158/159/160/162)
 *                  → replaced with a non-human Payload Media ID uploaded here
 *   • content.externalImage blocks — if URL contains a known human Pexels
 *     photo ID → replaced with a non-human Pexels URL
 *   • Blogs with NO statStrip block at all → full enrichment added
 *
 * SAFE:
 *   • --dry-run  prints what would change without writing anything
 *   • Idempotent: skips blogs already using only non-human images
 *   • Paced: 350 ms between posts to avoid 429s on Vercel/Supabase
 *
 * RUN (production):
 *   PAYLOAD_URL=https://ivf-clicnic-backend-weld.vercel.app \
 *   SEED_ADMIN_EMAIL=admin@bfi.com \
 *   SEED_ADMIN_PASSWORD=<password> \
 *   node scripts/enrich-blog-nonhuman-images.mjs
 *
 * RUN (dry-run):
 *   PAYLOAD_URL=... node scripts/enrich-blog-nonhuman-images.mjs --dry-run
 * ===================================================================== */

const BASE     = process.env.PAYLOAD_URL        ?? "http://localhost:3000";
const EMAIL    = process.env.SEED_ADMIN_EMAIL   ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "BfiPayload!2026";
const DRY_RUN  = process.argv.includes("--dry-run");

const log  = (msg) => console.log(`[nonhuman] ${msg}`);
const uid  = () => Math.random().toString(36).slice(2, 10);
const wait = (ms) => new Promise(r => setTimeout(r, ms));

/* ── Human Pexels photo IDs to detect & replace ─────────────────────
 * These are the Pexels photo ID numbers that appear in URLs used by
 * upload-hero-images.mjs and enrich-blog-bulk.mjs that show humans.
 * ──────────────────────────────────────────────────────────────────── */
const HUMAN_PEXELS_IDS = new Set([
  "5738735",  // Indian female doctor in lab
  "6129040",  // Doctor consulting patient
  "18277954", // Indian couple outdoors (pregnancy)
  "35441879", // Indian couple in traditional saree
  "8533045",  // Embryologist at microscope (shows person)
]);

/* ── Human Payload Media IDs ─────────────────────────────────────────
 * Pre-uploaded media IDs (from seed) that show humans:
 * 158 = Indian couple (Gujarat), 159 = Indian female doctor,
 * 160 = Doctor consultation, 162 = Indian couple in saree.
 * Media 161 = Lab microscope → NON-HUMAN, keep as-is.
 * ──────────────────────────────────────────────────────────────────── */
const HUMAN_MEDIA_IDS = new Set([158, 159, 160, 162]);

const isHumanPexelsUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  return [...HUMAN_PEXELS_IDS].some(id => url.includes(id));
};

/* ── Non-human Pexels images to upload as hero alternatives ──────────
 * All verified: no faces, no people — lab equipment / science only.
 * ──────────────────────────────────────────────────────────────────── */
const UPLOAD_POOL = [
  {
    key: "microscope",
    url: "https://images.pexels.com/photos/8325982/pexels-photo-8325982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "High-precision optical microscope in a modern IVF laboratory — advanced embryology equipment at Bavishi Fertility Institute",
    filename: "bfi-lab-microscope.jpg",
  },
  {
    key: "testtubes",
    url: "https://images.pexels.com/photos/8940480/pexels-photo-8940480.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Clean glass test tubes in a fertility laboratory — diagnostic testing at Bavishi Fertility Institute Ahmedabad, Gujarat",
    filename: "bfi-lab-test-tubes.jpg",
  },
  {
    key: "centrifuge",
    url: "https://images.pexels.com/photos/6629397/pexels-photo-6629397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Modern laboratory centrifuge for fertility diagnostics — semen analysis and blood processing at BFI Ahmedabad",
    filename: "bfi-lab-centrifuge.jpg",
  },
  {
    key: "lens",
    url: "https://images.pexels.com/photos/9574512/pexels-photo-9574512.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Precision microscope lens in an IVF laboratory — embryology technology at Bavishi Fertility Institute Gujarat",
    filename: "bfi-lab-microscope-lens.jpg",
  },
  {
    key: "rack",
    url: "https://images.pexels.com/photos/7722535/pexels-photo-7722535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Blue-capped test tube rack in a fertility laboratory — medical diagnostics at Bavishi Fertility Institute",
    filename: "bfi-lab-tube-rack.jpg",
  },
];

/* ── Non-human externalImage content pool ────────────────────────────
 * Keyed by category; used to replace human externalImage URLs and to
 * supply new externalImage blocks for un-enriched blogs.
 * ──────────────────────────────────────────────────────────────────── */
const NON_HUMAN_EXT = {
  embryo: {
    url: "https://images.pexels.com/photos/8325982/pexels-photo-8325982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Advanced IVF laboratory microscope used for embryo assessment and grading at Bavishi Fertility Institute",
    caption: "Every embryo at BFI is assessed under high-magnification optics by a dedicated embryologist.",
    credit: "Photo: Pexels",
  },
  male: {
    url: "https://images.pexels.com/photos/8940480/pexels-photo-8940480.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Laboratory test tubes used for semen analysis and sperm preparation at Bavishi Fertility Institute Ahmedabad",
    caption: "Precise semen analysis and sperm preparation are the foundation of every male-factor treatment plan at BFI.",
    credit: "Photo: Pexels",
  },
  female: {
    url: "https://images.pexels.com/photos/6629397/pexels-photo-6629397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Modern centrifuge for blood and hormonal diagnostic testing at Bavishi Fertility Institute fertility laboratory",
    caption: "Hormonal profiling — AMH, FSH, LH, progesterone — provides the clinical foundation for every female fertility plan at BFI.",
    credit: "Photo: Pexels",
  },
  ivf: {
    url: "https://images.pexels.com/photos/9574512/pexels-photo-9574512.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "High-precision microscope lens in an IVF laboratory — the technology behind every fertilisation cycle at BFI Ahmedabad",
    caption: "IVF at BFI is underpinned by precision laboratory science — every step monitored, every embryo assessed.",
    credit: "Photo: Pexels",
  },
  pregnancy: {
    url: "https://images.pexels.com/photos/7722535/pexels-photo-7722535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Fertility laboratory diagnostic equipment — blood tests and hormonal monitoring supporting pregnancy care at BFI",
    caption: "Precision diagnostic monitoring supports healthy pregnancies at every stage of the BFI care pathway.",
    credit: "Photo: Pexels",
  },
  default: {
    url: "https://images.pexels.com/photos/8325982/pexels-photo-8325982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Modern IVF laboratory equipment at Bavishi Fertility Institute — precision science behind every fertility treatment",
    caption: "Precision laboratory science is the foundation of every evidence-based fertility treatment at BFI.",
    credit: "Photo: Pexels",
  },
};

/* ── Category detection from slug ────────────────────────────────── */
function detectCategory(slug = "") {
  const s = slug.toLowerCase();
  const has = (...kw) => kw.some(k => s.includes(k));
  if (has("embryo", "blastocyst", "implant", "pgt", "transfer", "post-transfer")) return "embryo";
  if (has("sperm", "azoosperm", "semen", "male", "tesa", "pesa", "macs", "imsi", "icsi", "dna-frag")) return "male";
  if (has("pcos", "endometrios", "uterine", "amh", "ovarian", "female", "egg", "oocyte", "prp", "era", "fibroid", "recurrent-mis", "unexplained")) return "female";
  if (has("pregnan", "postpartum", "trimester", "prenatal", "after-delivery", "exercising-after", "high-risk")) return "pregnancy";
  if (has("ivf", "iui", "stimulation", "protocol", "glue", "scratching", "embryo-glue")) return "ivf";
  return "default";
}

/* ── Block constructors ──────────────────────────────────────────── */
const mkStatStrip = (items) => ({
  type: "block", version: 2,
  fields: { id: uid(), blockType: "statStrip", blockName: "",
    items: items.map(({ value, label }) => ({ id: uid(), value, label })) },
});

const mkHighlightCard = ({ badge, tagline, icon = "Microscope", color = "plum", facts = [], bestSuitedFor }) => ({
  type: "block", version: 2,
  fields: { id: uid(), blockType: "highlightCard", blockName: "", badge, tagline, icon, color,
    facts: facts.map(({ label, value }) => ({ id: uid(), label, value })), bestSuitedFor },
});

const mkComparisonTable = (rowHeader, columns, rows) => ({
  type: "block", version: 2,
  fields: { id: uid(), blockType: "comparisonTable", blockName: "", rowHeader,
    columns: columns.map(h => ({ id: uid(), header: h })),
    rows: rows.map(({ label, cells }) => ({ id: uid(), rowLabel: label, cells: cells.map(v => ({ id: uid(), value: v })) })) },
});

const mkExternalImage = ({ url, alt, caption = null, credit = null }) => ({
  type: "block", version: 2,
  fields: { id: uid(), blockType: "externalImage", blockName: "", url, alt, caption, credit },
});

const mkInlineCta = ({ headline, subtext = null, accent = "rose", buttons = [] }) => ({
  type: "block", version: 2,
  fields: { id: uid(), blockType: "inlineCta", blockName: "", headline, subtext, accent,
    buttons: buttons.map(({ label, url, variant = "primary" }) => ({ id: uid(), label, url, variant })) },
});

const mkConclusionPanel = ({ headline, points = [] }) => ({
  type: "block", version: 2,
  fields: { id: uid(), blockType: "conclusionPanel", blockName: "", headline,
    points: points.map(({ icon = null, text }) => ({ id: uid(), icon, text })) },
});

/* ── Per-category enrichment templates ───────────────────────────── */
const TEMPLATES = {
  embryo: {
    stats: [
      { value: "Day 5",  label: "Blastocyst transfer — optimal stage" },
      { value: "65%",    label: "Blastocyst implantation rate at BFI" },
      { value: "40–60%", label: "Euploid embryo rate after PGT-A" },
      { value: "Day 12", label: "Beta hCG test after transfer" },
    ],
    highlight: { badge: "EMBRYO SCIENCE", tagline: "What the lab sees — and how it shapes your outcome", icon: "Microscope", color: "plum",
      facts: [{ label: "Optimal transfer stage", value: "Day 5 blastocyst" }, { label: "PGT-A improves success", value: "Up to 20% more" }],
      bestSuitedFor: "Couples who want to understand the biology behind embryo selection, blastocyst culture, and the two-week wait — so the science replaces anxiety with understanding." },
    comparison: { rowHeader: "Factor", columns: ["Day 3 Transfer", "Day 5 Blastocyst"],
      rows: [
        { label: "Embryo stage", cells: ["8-cell cleavage", "100+ cell blastocyst"] },
        { label: "Implantation rate", cells: ["~30–40%", "~55–65%"] },
        { label: "PGT-A suitability", cells: ["Possible, less accurate", "Ideal stage"] },
        { label: "Natural selection", cells: ["Less — fewer cells assessed", "Only strongest reach Day 5"] },
        { label: "Best for", cells: ["Few embryos", "Multiple good-quality embryos"] },
      ]},
    cta: { headline: "Questions about your embryo transfer?", subtext: "Our specialists explain every step — from embryo grading to transfer day and beyond.", accent: "plum",
      buttons: [{ label: "Book Consultation", url: "/contact", variant: "primary" }, { label: "IVF at BFI", url: "/treatments/ivf", variant: "secondary" }] },
    conclusion: { headline: "Key takeaways from this article",
      points: [
        { text: "Blastocyst (Day 5) transfers have higher implantation rates than Day 3 transfers." },
        { text: "PGT-A testing identifies chromosomally normal embryos before transfer." },
        { text: "Implantation occurs 1–3 days after a blastocyst transfer — nothing you do speeds this up." },
        { text: "The official blood pregnancy test is Day 12–14; avoid home tests before then." },
      ]},
  },

  male: {
    stats: [
      { value: "40%",      label: "Infertility cases involve male factor" },
      { value: "90%",      label: "Azoospermia men with retrievable sperm" },
      { value: "3 Months", label: "For lifestyle changes to improve sperm" },
      { value: "1 in 20",  label: "Men have very low sperm count" },
    ],
    highlight: { badge: "MALE FERTILITY", tagline: "Diagnosing and treating male factor — the complete BFI approach", icon: "Microscope", color: "plum",
      facts: [{ label: "Male-factor infertility rate", value: "40% of cases" }, { label: "TESA retrieval success", value: ">90% in obstructive" }],
      bestSuitedFor: "Men who have received an abnormal semen analysis, or couples where the male partner has not yet been evaluated — because male and female factors contribute equally to infertility." },
    comparison: { rowHeader: "Technique", columns: ["When Used", "Success Rate"],
      rows: [
        { label: "IUI", cells: ["Mild male factor, motility > 5M", "15–20% per cycle"] },
        { label: "IVF-ICSI", cells: ["Severe oligospermia, low motility", "55–65% per cycle at BFI"] },
        { label: "TESA + ICSI", cells: ["Obstructive azoospermia", "> 90% sperm retrieval"] },
        { label: "Micro-TESE + ICSI", cells: ["Non-obstructive azoospermia", "30–60% sperm retrieval"] },
        { label: "MACS / PICSI", cells: ["High DNA fragmentation", "Improved embryo quality"] },
      ]},
    cta: { headline: "Male infertility is treatable in most cases", subtext: "BFI's andrology team evaluates every case — from semen analysis to MACS, TESA, and advanced IVF-ICSI.", accent: "plum",
      buttons: [{ label: "Book Andrology Assessment", url: "/contact", variant: "primary" }, { label: "Male Fertility Guide", url: "/treatments", variant: "secondary" }] },
    conclusion: { headline: "Key takeaways from this article",
      points: [
        { text: "Male factor contributes to 40% of infertility cases — always evaluate both partners." },
        { text: "Even zero sperm count (azoospermia) allows fatherhood via TESA/PESA + IVF-ICSI in most cases." },
        { text: "MACS and PICSI select sperm with less DNA damage — improving embryo quality." },
        { text: "Sperm quality responds to lifestyle changes within 3 months — start early." },
      ]},
  },

  female: {
    stats: [
      { value: "1 in 5",   label: "Women globally have PCOS" },
      { value: "80%",      label: "PCOS women ovulate with right treatment" },
      { value: "AMH>1.0",  label: "Normal ovarian reserve (ng/mL)" },
      { value: "35+",      label: "Age when female fertility declines sharply" },
    ],
    highlight: { badge: "FEMALE FERTILITY", tagline: "Understanding your diagnostic profile — the foundation of effective care", icon: "Activity", color: "rose",
      facts: [{ label: "Key diagnostic tests", value: "AMH, AFC, FSH, LH" }, { label: "Age threshold for urgency", value: "35+ years" }],
      bestSuitedFor: "Women who want to understand what their test results mean, which conditions affect fertility, and what treatment options are available — before stepping into a clinic." },
    comparison: { rowHeader: "Test", columns: ["What It Measures", "When to Do It"],
      rows: [
        { label: "AMH", cells: ["Ovarian reserve (egg supply)", "Any day of cycle"] },
        { label: "AFC ultrasound", cells: ["Antral follicle count", "Day 2–3 of cycle"] },
        { label: "FSH + LH", cells: ["Pituitary-ovarian balance", "Day 2–3 of cycle"] },
        { label: "Progesterone", cells: ["Confirms ovulation occurred", "Day 21"] },
        { label: "HSG / HyCoSy", cells: ["Fallopian tube patency", "Day 7–10 of cycle"] },
      ]},
    cta: { headline: "Get a comprehensive female fertility assessment at BFI", subtext: "One morning gives you a full hormonal profile, ovarian reserve, and a personalised treatment roadmap.", accent: "rose",
      buttons: [{ label: "Book Fertility Assessment", url: "/contact", variant: "primary" }, { label: "Treatments at BFI", url: "/treatments", variant: "secondary" }] },
    conclusion: { headline: "Key takeaways from this article",
      points: [
        { text: "AMH and AFC together give the most accurate picture of your ovarian reserve." },
        { text: "PCOS is treatable — 80% of women ovulate with the right protocol." },
        { text: "Fertility begins declining meaningfully after 35; consult a specialist sooner rather than later." },
        { text: "A complete diagnostic workup (AMH, AFC, HSG, hormones) must precede any treatment decision." },
      ]},
  },

  pregnancy: {
    stats: [
      { value: "12 Weeks", label: "End of the first trimester" },
      { value: "20 Weeks", label: "Anomaly scan milestone" },
      { value: "99%",      label: "Neural tube defects preventable with folic acid" },
      { value: "6–8 Weeks",label: "First heartbeat scan timing" },
    ],
    highlight: { badge: "PREGNANCY CARE", tagline: "From positive test to safe delivery — evidence-based support", icon: "HeartPulse", color: "rose",
      facts: [{ label: "IVF pregnancy monitoring", value: "Closer + more frequent" }, { label: "Folic acid dose", value: "400 mcg daily" }],
      bestSuitedFor: "Pregnant women — especially those who conceived through IVF or with any history of complications — who want clear, reassuring, and medically accurate guidance at every milestone." },
    cta: { headline: "From positive test to safe delivery — BFI is with you", subtext: "BFI's antenatal team provides close monitoring and personalised support for every pregnancy.", accent: "rose",
      buttons: [{ label: "Book Antenatal Consultation", url: "/contact", variant: "primary" }, { label: "Pregnancy Care at BFI", url: "/treatments", variant: "secondary" }] },
    conclusion: { headline: "Key takeaways from this article",
      points: [
        { text: "Start folic acid (400 mcg/day) before pregnancy and continue through the first trimester." },
        { text: "The anomaly scan at 18–20 weeks checks for structural abnormalities in detail." },
        { text: "IVF pregnancies benefit from closer monitoring — do not skip any scheduled scans." },
        { text: "Any heavy bleeding, severe pain, or sudden symptom change should be reported immediately." },
      ]},
  },

  ivf: {
    stats: [
      { value: "60%",      label: "IVF success rate per cycle at BFI" },
      { value: "3–5 Days", label: "Egg stimulation monitoring window" },
      { value: "14 Days",  label: "Wait for pregnancy result after transfer" },
      { value: "1 in 6",   label: "Couples affected by infertility globally" },
    ],
    highlight: { badge: "IVF AT BFI", tagline: "Every cycle is a learning experience — even if it takes more than one", icon: "Microscope", color: "plum",
      facts: [{ label: "Success rate per cycle", value: "~60% at BFI" }, { label: "Consecutive National Awards", value: "2021–2025" }],
      bestSuitedFor: "Anyone considering IVF for the first time, or exploring their options after a previous failed cycle — because the right information is the foundation of the right decision." },
    comparison: { rowHeader: "Factor", columns: ["Natural Conception", "IVF at BFI"],
      rows: [
        { label: "Success per cycle", cells: ["~20% (age < 35)", "~60% at BFI"] },
        { label: "Medical monitoring", cells: ["None", "Daily / every 2 days"] },
        { label: "Embryo selection", cells: ["Not possible", "Graded, PGT-A available"] },
        { label: "Time to result", cells: ["Months to years", "4–6 weeks per cycle"] },
        { label: "Multiple pregnancy", cells: ["Very rare", "Managed with SET policy"] },
      ]},
    cta: { headline: "Ready to explore your IVF options at BFI?", subtext: "Our specialists will walk you through every step — from first consultation to embryo transfer and beyond.", accent: "rose",
      buttons: [{ label: "Book Consultation", url: "/contact", variant: "primary" }, { label: "Learn About IVF", url: "/treatments/ivf", variant: "secondary" }] },
    conclusion: { headline: "Key takeaways from this article",
      points: [
        { text: "IVF at BFI achieves ~60% success per cycle — among the highest in Gujarat." },
        { text: "Every protocol is personalised after a full diagnostic workup — not a standard template." },
        { text: "A failed cycle is clinical data: it informs what changes for the next attempt." },
        { text: "BFI has helped over 25,000 families across 14 centres with 5 consecutive National Awards." },
      ]},
  },

  default: {
    stats: [
      { value: "25,000+",  label: "Successful pregnancies at BFI" },
      { value: "14",       label: "BFI centres across Gujarat" },
      { value: "60%",      label: "IVF success rate per cycle at BFI" },
      { value: "1,800+",   label: "Five-star Google reviews" },
    ],
    highlight: { badge: "EVIDENCE-BASED CARE", tagline: "Personalised fertility care — every patient's situation is unique", icon: "Microscope", color: "plum",
      facts: [{ label: "Years of expertise", value: "15+" }, { label: "National Fertility Awards", value: "2021–2025" }],
      bestSuitedFor: "Anyone starting their fertility journey or seeking a second opinion — who wants evidence-based, personalised care rather than a one-size-fits-all protocol." },
    cta: { headline: "Take the first step toward parenthood", subtext: "Schedule a consultation with BFI's fertility specialists — personalised, evidence-based care for your unique journey.", accent: "rose",
      buttons: [{ label: "Book Consultation", url: "/contact", variant: "primary" }, { label: "Explore Treatments", url: "/treatments", variant: "secondary" }] },
    conclusion: { headline: "Key takeaways from this article",
      points: [
        { text: "BFI has helped over 25,000 families across 14 centres in Gujarat." },
        { text: "Every treatment plan starts with a full diagnostic workup — AMH, AFC, semen analysis, uterine assessment." },
        { text: "Fertility consultation is recommended after 12 months of trying (6 months if age 35+)." },
        { text: "BFI holds the National Fertility Award for 5 consecutive years (2021–2025)." },
      ]},
  },
};

/* ── Build enriched content: inject blocks into existing Lexical doc ─ */
function buildEnrichedContent(existingContent, tpl, extImg) {
  const children = existingContent?.root?.children ?? [];

  const hasStatStrip = children.some(n => n.type === "block" && n.fields?.blockType === "statStrip");
  const hasExtImg    = children.some(n => n.type === "block" && n.fields?.blockType === "externalImage");
  const hasCta       = children.some(n => n.type === "block" && n.fields?.blockType === "inlineCta");
  const hasConclusion= children.some(n => n.type === "block" && n.fields?.blockType === "conclusionPanel");
  const hasHighlight = children.some(n => n.type === "block" && n.fields?.blockType === "highlightCard");
  const hasComparison= children.some(n => n.type === "block" && n.fields?.blockType === "comparisonTable");

  // If fully enriched (has statStrip + non-human externalImage) → no content change needed
  if (hasStatStrip && hasExtImg) {
    return null; // caller still checks heroImage
  }

  const newChildren = [...children];
  const n = newChildren.length;

  // Insert position for ExternalImage: after first paragraph-ish node
  const firstPara = newChildren.findIndex(node => node.type !== "block");
  const posImg = firstPara >= 0
    ? Math.max(firstPara, Math.min(Math.floor(n * 0.20), n - 1))
    : Math.min(1, n - 1);

  // Build blocks to prepend (before existing content) and append (end)
  const prepend = [];
  const append  = [];

  if (!hasStatStrip) prepend.push(mkStatStrip(tpl.stats));
  if (!hasHighlight && tpl.highlight) prepend.push(mkHighlightCard(tpl.highlight));

  if (!hasExtImg) newChildren.splice(posImg + 1 + prepend.length, 0, mkExternalImage(extImg));

  if (!hasComparison && tpl.comparison) {
    const midpoint = Math.floor(newChildren.length / 2);
    newChildren.splice(midpoint, 0, mkComparisonTable(tpl.comparison.rowHeader, tpl.comparison.columns, tpl.comparison.rows));
  }

  if (!hasConclusion && tpl.conclusion) append.push(mkConclusionPanel(tpl.conclusion));
  if (!hasCta && tpl.cta) append.push(mkInlineCta(tpl.cta));

  const finalChildren = [...prepend, ...newChildren, ...append];
  return { root: { ...existingContent.root, children: finalChildren } };
}

/* ── Replace human externalImage URLs within existing Lexical doc ──── */
function replaceHumanExtImages(existingContent, extImg) {
  const children = existingContent?.root?.children ?? [];
  let changed = false;

  const newChildren = children.map(node => {
    if (node.type === "block" && node.fields?.blockType === "externalImage") {
      if (isHumanPexelsUrl(node.fields.url)) {
        changed = true;
        return {
          ...node,
          fields: {
            ...node.fields,
            url:     extImg.url,
            alt:     extImg.alt,
            caption: extImg.caption ?? null,
            credit:  extImg.credit  ?? null,
          },
        };
      }
    }
    return node;
  });

  if (!changed) return null;
  return { root: { ...existingContent.root, children: newChildren } };
}

/* ── API helpers ─────────────────────────────────────────────────── */
async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed ${res.status}: ${await res.text()}`);
  const { token } = await res.json();
  return { Authorization: `JWT ${token}` };
}

async function uploadMedia(imgKey, img, auth) {
  log(`  Uploading hero image: ${imgKey} …`);

  // Download from Pexels
  const dlRes = await fetch(img.url);
  if (!dlRes.ok) throw new Error(`Download failed for ${img.key}: ${dlRes.status}`);
  const blob = await dlRes.blob();
  log(`  Downloaded ${(blob.size / 1024).toFixed(0)} KB`);

  // Upload to Payload Media
  const form = new FormData();
  form.append("file", blob, img.filename);
  form.append("_payload", JSON.stringify({ alt: img.alt }));

  const upRes = await fetch(`${BASE}/api/media`, { method: "POST", headers: auth, body: form });
  if (!upRes.ok) throw new Error(`Upload failed: ${await upRes.text()}`);
  const data = await upRes.json();
  const id = data.doc?.id ?? data.id;
  if (!id) throw new Error("No media ID returned from upload");
  log(`  ✓ Uploaded → Media ID ${id}`);
  return id;
}

async function fetchAllBlogs(auth) {
  const all = [];
  let page = 1;
  while (true) {
    const url = `${BASE}/api/blogs?limit=50&page=${page}&depth=0`;
    const res = await fetch(url, { headers: auth });
    if (!res.ok) throw new Error(`fetchAllBlogs page ${page}: ${res.status}`);
    const data = await res.json();
    all.push(...(data.docs ?? []));
    if (!data.hasNextPage) break;
    page++;
    await wait(200);
  }
  return all;
}

async function fetchBlogFull(id, auth) {
  const res = await fetch(`${BASE}/api/blogs/${id}?depth=0`, { headers: auth });
  if (!res.ok) throw new Error(`Fetch blog ${id}: ${res.status}`);
  return res.json();
}

async function patchBlog(id, payload, auth) {
  const res = await fetch(`${BASE}/api/blogs/${id}`, {
    method: "PATCH",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PATCH ${id}: ${err.slice(0, 200)}`);
  }
  return res.json();
}

/* ── Main ────────────────────────────────────────────────────────── */
async function run() {
  log(`Connecting to ${BASE} …`);
  if (DRY_RUN) log("⚠  DRY RUN — reads everything, writes nothing");

  const auth = await login();
  log("Login OK\n");

  /* ── Step 1: Upload non-human hero images to Payload Media ──────── */
  log("=== STEP 1: Uploading non-human hero images ===");
  const mediaIds = {};

  if (!DRY_RUN) {
    for (const img of UPLOAD_POOL) {
      try {
        mediaIds[img.key] = await uploadMedia(img.key, img, auth);
        await wait(500);
      } catch (err) {
        log(`  ✗ Failed to upload ${img.key}: ${err.message}`);
        // Fall back to Media ID 161 (existing lab microscope) for this key
        mediaIds[img.key] = 161;
      }
    }
  } else {
    // Dry run: use placeholder IDs
    UPLOAD_POOL.forEach(img => { mediaIds[img.key] = `DRY_${img.key}`; });
  }

  log(`Hero image IDs: ${JSON.stringify(mediaIds)}\n`);

  /* Category → hero image key mapping */
  const heroKey = {
    embryo:   "microscope",
    male:     "lens",
    female:   "centrifuge",
    pregnancy:"rack",
    ivf:      "testtubes",
    default:  "microscope",
  };

  /* ── Step 2: Fetch all blog posts ──────────────────────────────── */
  log("=== STEP 2: Fetching all blog posts ===");
  const allBlogs = await fetchAllBlogs(auth);
  log(`Found ${allBlogs.length} blog posts total\n`);

  /* ── Step 3: Process each blog ─────────────────────────────────── */
  log("=== STEP 3: Processing blogs ===");
  let enriched = 0, imgReplaced = 0, heroReplaced = 0, skipped = 0, errors = 0;

  for (let i = 0; i < allBlogs.length; i++) {
    const meta = allBlogs[i];
    const num  = `[${i + 1}/${allBlogs.length}]`;

    try {
      const blog     = await fetchBlogFull(meta.id, auth);
      const category = detectCategory(blog.slug ?? "");
      const tpl      = TEMPLATES[category];
      const extImg   = NON_HUMAN_EXT[category];
      const hKey     = heroKey[category] ?? "microscope";
      const newHeroId = mediaIds[hKey] ?? mediaIds.microscope;

      const patch = {};
      const reasons = [];

      /* ── A: Hero image ─────────────────────────────────────────── */
      const currentHeroId = typeof blog.heroImage === "object"
        ? blog.heroImage?.id
        : blog.heroImage;

      if (!blog.heroImage || HUMAN_MEDIA_IDS.has(Number(currentHeroId))) {
        patch.heroImage = newHeroId;
        reasons.push(`heroImage ${currentHeroId ?? "null"} → ${newHeroId}`);
        heroReplaced++;
      }

      /* ── B: Replace human externalImage URLs in content ─────────── */
      if (blog.content) {
        const hasHumanExt = (blog.content.root?.children ?? []).some(
          n => n.type === "block" && n.fields?.blockType === "externalImage"
             && isHumanPexelsUrl(n.fields.url)
        );

        if (hasHumanExt) {
          const fixedContent = replaceHumanExtImages(blog.content, extImg);
          if (fixedContent) {
            patch.content = fixedContent;
            reasons.push("replaced human externalImage URLs");
            imgReplaced++;
          }
        }

        /* ── C: Add missing enrichment blocks ───────────────────── */
        if (!patch.content) {
          const enrichedContent = buildEnrichedContent(blog.content, tpl, extImg);
          if (enrichedContent) {
            patch.content = enrichedContent;
            reasons.push("added missing enrichment blocks");
            enriched++;
          }
        }
      }

      /* Skip if nothing to change */
      if (Object.keys(patch).length === 0) {
        log(`  ↩ ${num} SKIP (already clean): ${blog.slug}`);
        skipped++;
        continue;
      }

      if (!DRY_RUN) {
        await patchBlog(blog.id, patch, auth);
      }

      log(`  ✓ ${num} [${category}] ${blog.slug}`);
      log(`       → ${reasons.join("; ")}`);

    } catch (err) {
      log(`  ✗ ${num} ERROR: ${meta.slug ?? meta.id} — ${err.message}`);
      errors++;
    }

    await wait(350); // pace requests to avoid 429
  }

  /* ── Summary ─────────────────────────────────────────────────── */
  log(`\n${"─".repeat(60)}`);
  log(`✅ Done!${DRY_RUN ? " (DRY RUN — no changes written)" : ""}`);
  log(`   Hero images replaced  : ${heroReplaced}`);
  log(`   Ext-image URLs fixed   : ${imgReplaced}`);
  log(`   Enrichment blocks added: ${enriched}`);
  log(`   Skipped (already OK)   : ${skipped}`);
  log(`   Errors                 : ${errors}`);
  log(`   Total blogs processed  : ${allBlogs.length}`);
}

run().catch(err => {
  console.error("[nonhuman] FATAL:", err.message);
  process.exit(1);
});
