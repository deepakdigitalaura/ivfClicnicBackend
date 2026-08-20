#!/usr/bin/env node
/* =====================================================================
 * enrich-blog-bulk.mjs
 * Enriches all 274 non-pilot blog posts with:
 *   • ExternalImageBlock  (Indian-origin / medical Pexels photo)
 *   • StatStrip           (4 topic-relevant stats)
 *   • HighlightCard       (key clinical insight)
 *   • ComparisonTable     (where topic supports it)
 *   • InlineCtaBlock      (topic-adapted CTA)
 *   • heroImage           (reuses already-uploaded Payload Media IDs)
 *
 * Skips 5 pilot posts (already enriched).
 * Idempotent — skips posts that already contain a statStrip block.
 * ===================================================================== */

const BASE     = process.env.PAYLOAD_URL         ?? "http://localhost:3000";
const EMAIL    = process.env.SEED_ADMIN_EMAIL     ?? "admin@bfi.local";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD  ?? "BfiPayload!2026";
const DRY_RUN  = process.argv.includes("--dry-run");

const PILOT_SLUGS = new Set([
  "iui-vs-ivf-which-fertility-treatment-is-right-for-you",
  "ivf-treatment-cost-in-ahmedabad-across-india",
  "top-fertility-treatments-for-women-with-pcos",
  "post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days",
  "azoospermia-can-you-have-a-baby-with-zero-sperm-count",
]);

/* ── Pre-uploaded Indian-origin Payload Media IDs ────────────────────
 * 158 = Indian couple outdoors (Gujarat)       → personal/pregnancy
 * 159 = Indian female doctor (Delhi)           → clinical/female topics
 * 160 = Doctor consultation                    → general/treatment
 * 161 = Lab microscope                         → embryo/egg/technical
 * 162 = Indian couple in traditional saree     → male infertility/journey
 * ──────────────────────────────────────────────────────────────────── */
const M = { couple: 158, doctor: 159, consult: 160, lab: 161, saree: 162 };

const uid = () => Math.random().toString(36).slice(2, 10);
const log = (msg) => console.log(`[bulk] ${msg}`);

/* ── Block constructors ──────────────────────────────────────────── */
const mkStatStrip = (items) => ({
  type: "block", version: 2,
  fields: { id: uid(), blockType: "statStrip", blockName: "",
    stats: items.map(s => ({ id: uid(), value: s.value, label: s.label })) },
});
const mkHighlight = ({ headline, body, accent = "plum", icon = "lightbulb" }) => ({
  type: "block", version: 2,
  fields: { id: uid(), blockType: "highlightCard", blockName: "", headline, body, accent, icon },
});
const mkExtImage = ({ url, alt, caption = null, credit = null }) => ({
  type: "block", version: 2,
  fields: { id: uid(), blockType: "externalImage", blockName: "", url, alt, caption, credit },
});
const mkComparison = ({ title, leftLabel, rightLabel, rows }) => ({
  type: "block", version: 2,
  fields: { id: uid(), blockType: "comparisonTable", blockName: "", title, leftLabel, rightLabel,
    rows: rows.map(r => ({ id: uid(), aspect: r.aspect, left: r.left, right: r.right })) },
});
const mkCta = ({ headline, subtext, accent = "rose", buttons = [] }) => ({
  type: "block", version: 2,
  fields: { id: uid(), blockType: "inlineCta", blockName: "", headline, subtext, accent,
    buttons: buttons.map(b => ({ id: uid(), label: b.label, url: b.url, variant: b.variant })) },
});

/* ── Topic detection from slug ───────────────────────────────────── */
function detectCategory(slug) {
  const s = slug.toLowerCase();
  const has = (...kw) => kw.some(k => s.includes(k));
  if (has("failure","failed","unsuccessful","doesnt-work","why-ivf-fail","not-worked","multiple-ivf","ivf-failure")) return "ivf_failure";
  if (has("cost","price","affordable","finance","budget","expense","fees","cheap","how-much")) return "ivf_cost";
  if (has("iui","insemination","intrauterine")) return "iui";
  if (has("azoosperm","varicocele","oligosperm","asthenosperm","sperm-count","semen-analysis","sperm-dna","low-sperm","male-infertility","male-factor","macs")) return "male_infertility";
  if (has("pcos","pcod","endometrios","uterine-fibroid","adenomyosis","ovarian-reserve","female-infertility","low-amh","amh-level","amh-and")) return "female_infertility";
  if (has("pregnan","prenatal","trimester","postpartum","after-delivery","morning-sickness","nutrition-during","week-by-week","ultrasound-in-pregnancy","stress-test","non-stress")) return "pregnancy";
  if (has("embryo","blastocyst","implant","pgt","genetic-test","chromosom","post-transfer","after-transfer","transfer-timeline")) return "embryo";
  if (has("egg-freez","egg-qual","egg-donor","oocyte","freeze-egg","egg-retriev","donor-egg","donor-eggs")) return "egg";
  if (has("hormone","fsh","progesterone","estrogen","thyroid","prolactin","testosterone","amh-level")) return "hormone";
  if (has("best-ivf","best-clinic","choosing","right-clinic","top-clinic","top-fertility","top-hospital","13-best","12-best")) return "clinic";
  if (has("myth","misconception","truth","fact","busting","do-and-dont","dos-and-donts","should-you")) return "myths";
  if (has("ivf")) return "ivf_general";
  if (has("sperm","male","semen","andrology","varicocele","tesa","pesa")) return "male_infertility";
  if (has("ovul","fertility-treatment","fertility-care","reproductive","women-fertility","ovary")) return "female_infertility";
  return "default";
}

/* ── Templates ───────────────────────────────────────────────────── */
const TEMPLATES = {
  ivf_general: {
    hero: M.consult,
    stats: [
      { value: "60%",   label: "IVF success rate per cycle at BFI" },
      { value: "3–5 Days", label: "Egg stimulation monitoring window" },
      { value: "14 Days",  label: "Wait for pregnancy result after transfer" },
      { value: "1 in 6",  label: "Couples affected by infertility" },
    ],
    highlight: { accent: "plum",
      headline: "IVF Is a Process, Not a Single Attempt",
      body: "Most couples who succeed with IVF do not do so on the very first cycle. Your protocol is continuously refined with each attempt. At BFI, every cycle — successful or not — brings your team closer to the right approach for you.",
    },
    comparison: {
      title: "Natural Conception vs IVF: Key Differences",
      leftLabel: "Natural Conception", rightLabel: "IVF at BFI",
      rows: [
        { aspect: "Success rate per cycle",   left: "~20% (age < 35)",         right: "~60% (BFI average)" },
        { aspect: "Who it helps",             left: "No diagnosed infertility", right: "Diagnosed fertility issues" },
        { aspect: "Time to result",           left: "Months to years",          right: "4–6 weeks per cycle" },
        { aspect: "Medical monitoring",       left: "None",                     right: "Full monitoring + embryology" },
        { aspect: "Multiple pregnancy risk",  left: "Very low",                 right: "Managed with SET policy" },
      ],
    },
    extImage: {
      url: "https://images.pexels.com/photos/5738735/pexels-photo-5738735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Indian female fertility specialist at a modern clinic — personalised IVF protocol planning at Bavishi Fertility Institute",
      caption: "Personalised protocol planning is what separates a successful IVF outcome from a generic treatment experience.",
      credit: "Photo: Dr Aparna Jaswal / Pexels (Delhi, India)",
    },
    cta: { accent: "rose",
      headline: "Ready to Explore Your IVF Options at BFI?",
      subtext: "Our specialists will walk you through every step — from first consultation to embryo transfer and beyond.",
      buttons: [{ label: "Book Consultation", url: "/contact", variant: "primary" }, { label: "Learn About IVF", url: "/treatments/ivf", variant: "secondary" }],
    },
  },

  ivf_failure: {
    hero: M.consult,
    stats: [
      { value: "70%",   label: "Cumulative success after 3 IVF cycles" },
      { value: "40%",   label: "Cases improved by protocol change" },
      { value: "2–3",   label: "Average cycles to achieve pregnancy" },
      { value: "Day 5", label: "Blastocyst transfer improves embryo selection" },
    ],
    highlight: { accent: "rose",
      headline: "A Failed IVF Cycle Is Clinical Data",
      body: "What feels like a setback is the most valuable information your doctor receives. A thorough cycle review — examining embryo quality, endometrial receptivity, sperm DNA, and immune factors — often reveals the exact change needed for the next cycle to succeed.",
    },
    comparison: {
      title: "Common IVF Failure Causes and BFI's Approach",
      leftLabel: "What Often Goes Wrong", rightLabel: "How BFI Addresses It",
      rows: [
        { aspect: "Poor embryo quality",    left: "Generic stimulation protocol",     right: "Personalised dose + time-lapse" },
        { aspect: "Endometrial mismatch",   left: "Not separately assessed",           right: "ERA test for receptivity window" },
        { aspect: "Sperm DNA damage",       left: "Overlooked in standard ICSI",       right: "MACS + DNA fragmentation first" },
        { aspect: "Immune factors",         left: "Not tested routinely",              right: "Immunological workup on request" },
        { aspect: "Stimulation response",   left: "Same protocol repeated",            right: "Protocol adjusted after review" },
      ],
    },
    extImage: {
      url: "https://images.pexels.com/photos/6129040/pexels-photo-6129040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Fertility specialist consulting with a couple about previous IVF cycle review and next steps at BFI Ahmedabad",
      caption: "A detailed failed-cycle review at BFI often identifies the precise factor that was missed — and the change that makes the next attempt succeed.",
      credit: "Photo: Pexels",
    },
    cta: { accent: "rose",
      headline: "Previous IVF Didn't Work? Let's Find Out Why.",
      subtext: "A thorough cycle review at BFI often reveals exactly what needs to change — and how to maximise your next attempt.",
      buttons: [{ label: "Book a Cycle Review", url: "/contact", variant: "primary" }, { label: "IVF Success Rates", url: "/treatments/ivf", variant: "secondary" }],
    },
  },

  ivf_cost: {
    hero: M.doctor,
    stats: [
      { value: "₹1.5–2.5L", label: "Typical IVF cycle cost in Ahmedabad" },
      { value: "60–65%",     label: "Success rate at BFI per cycle" },
      { value: "2–3",        label: "Average cycles for most couples" },
      { value: "7 Items",    label: "That typically affect your final IVF bill" },
    ],
    highlight: { accent: "gold",
      headline: "The Cheapest IVF Quote Is Not the Best Value",
      body: "A very low headline price often means medications, freezing, ICSI, and PGT are billed separately. At BFI, your treatment coordinator provides a fully itemised cost breakdown upfront — so there are no surprises when the bill arrives.",
    },
    comparison: {
      title: "IVF Cost: Ahmedabad (BFI) vs Metro City Average",
      leftLabel: "BFI Ahmedabad", rightLabel: "Metro City Average",
      rows: [
        { aspect: "Base IVF cycle",     left: "₹1.2–1.8L",              right: "₹1.8–2.5L" },
        { aspect: "Medications",        left: "Included in package",      right: "Often billed separately" },
        { aspect: "Embryo freezing",    left: "Transparent pricing",      right: "Add-on charges apply" },
        { aspect: "Success rate",       left: "60–65% per cycle",         right: "Varies widely" },
        { aspect: "Travel + stay cost", left: "Minimal (local)",          right: "Significant added cost" },
      ],
    },
    extImage: {
      url: "https://images.pexels.com/photos/5738735/pexels-photo-5738735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Indian fertility specialist at BFI — transparent IVF cost planning in Ahmedabad, Gujarat",
      caption: "Transparent cost planning is as important as clinical planning — both shape your overall IVF experience.",
      credit: "Photo: Dr Aparna Jaswal / Pexels (Delhi, India)",
    },
    cta: { accent: "gold",
      headline: "Get a Transparent IVF Cost Estimate from BFI",
      subtext: "No hidden charges. No surprises. Our treatment coordinator will break down every cost item before you commit.",
      buttons: [{ label: "Request Cost Estimate", url: "/contact", variant: "primary" }, { label: "IVF Cost Guide", url: "/blog/ivf-treatment-cost-in-ahmedabad-across-india", variant: "secondary" }],
    },
  },

  iui: {
    hero: M.doctor,
    stats: [
      { value: "20%",      label: "IUI success rate per cycle" },
      { value: "3 Cycles", label: "Recommended attempts before considering IVF" },
      { value: "Day 12–14",label: "Optimal insemination window" },
      { value: "2x",       label: "Success improvement with trigger injection" },
    ],
    highlight: { accent: "plum",
      headline: "IUI Timing Is Everything",
      body: "The difference between a successful and unsuccessful IUI often comes down to hours. Combining a trigger injection with ultrasound-guided timing and careful sperm preparation can more than double the effectiveness of each cycle.",
    },
    comparison: {
      title: "IUI vs IVF: Which Is Right for You?",
      leftLabel: "IUI", rightLabel: "IVF",
      rows: [
        { aspect: "Invasiveness",    left: "Minimal — like a smear test",   right: "Egg retrieval under sedation" },
        { aspect: "Cost per cycle",  left: "₹15,000–30,000",                right: "₹1.2–1.8L" },
        { aspect: "Success rate",    left: "15–20% per cycle",               right: "55–65% per cycle" },
        { aspect: "Best for",        left: "Mild male factor / unexplained", right: "Blocked tubes, poor sperm, age 35+" },
        { aspect: "Time required",   left: "3–5 days monitoring",            right: "3–4 weeks full cycle" },
      ],
    },
    extImage: {
      url: "https://images.pexels.com/photos/6129040/pexels-photo-6129040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Fertility specialist discussing IUI timing and preparation with a patient at BFI Ahmedabad",
      caption: "Precise timing with ultrasound monitoring and a trigger injection gives IUI its best chance of success.",
      credit: "Photo: Pexels",
    },
    cta: { accent: "plum",
      headline: "Is IUI the Right First Step for You?",
      subtext: "Our fertility specialists will assess whether IUI or IVF gives you the best odds — based on your tests, age, and history.",
      buttons: [{ label: "Book IUI Consultation", url: "/contact", variant: "primary" }, { label: "IUI vs IVF Guide", url: "/blog/iui-vs-ivf-which-fertility-treatment-is-right-for-you", variant: "secondary" }],
    },
  },

  male_infertility: {
    hero: M.saree,
    stats: [
      { value: "40%",      label: "Infertility cases involve male factor" },
      { value: "90%",      label: "Azoospermia men have retrievable sperm" },
      { value: "3 Months", label: "For lifestyle changes to improve sperm quality" },
      { value: "50%",      label: "Sperm motility target for IUI eligibility" },
    ],
    highlight: { accent: "plum",
      headline: "Male Infertility Is Treatable in Most Cases",
      body: "Even when a semen analysis shows zero sperm (azoospermia), sperm can be retrieved surgically via TESA or PESA in 9 out of 10 men — and used successfully in IVF-ICSI. The first step is an accurate andrology evaluation, not assumptions based on a single test.",
    },
    comparison: {
      title: "Sperm Retrieval Options for Azoospermia",
      leftLabel: "Procedure", rightLabel: "Best For",
      rows: [
        { aspect: "TESA (needle aspiration)", left: "Simple, local anaesthesia",   right: "Obstructive azoospermia" },
        { aspect: "PESA (epididymal)",        left: "Quick outpatient procedure",  right: "Post-vasectomy / obstruction" },
        { aspect: "TESE (open biopsy)",       left: "Minor surgery, more tissue",  right: "Non-obstructive azoospermia" },
        { aspect: "Micro-TESE",               left: "Microsurgical precision",     right: "Very low sperm production" },
        { aspect: "Combined with ICSI",       left: "Single sperm used per egg",   right: "All azoospermia types" },
      ],
    },
    extImage: {
      url: "https://images.pexels.com/photos/35441879/pexels-photo-35441879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Indian couple in traditional attire celebrating pregnancy — the achievable outcome for men with male infertility who receive the right treatment",
      caption: "For most men with a male infertility diagnosis, fatherhood is within reach with the right evaluation and treatment at BFI.",
      credit: "Photo: Pexels (India)",
    },
    cta: { accent: "plum",
      headline: "Male Infertility Is More Treatable Than You Think",
      subtext: "BFI's andrology team covers the full spectrum — from semen analysis to MACS, TESA/PESA, and advanced IVF-ICSI.",
      buttons: [{ label: "Book Andrology Assessment", url: "/contact", variant: "primary" }, { label: "Male Fertility Guide", url: "/blog/azoospermia-can-you-have-a-baby-with-zero-sperm-count", variant: "secondary" }],
    },
  },

  female_infertility: {
    hero: M.doctor,
    stats: [
      { value: "1 in 5",   label: "Women have PCOS globally" },
      { value: "80%",      label: "PCOS women ovulate with the right treatment" },
      { value: "AMH > 1.0",label: "Normal ovarian reserve marker (ng/mL)" },
      { value: "35+",      label: "Age when female fertility declines sharply" },
    ],
    highlight: { accent: "rose",
      headline: "Female Infertility Has Many Causes — and More Solutions",
      body: "From PCOS and low AMH to blocked tubes and endometriosis, each cause has a targeted treatment pathway. A thorough BFI evaluation ensures you are treated for your actual diagnosis, not a generic protocol — because the right treatment for PCOS is very different from the right treatment for low ovarian reserve.",
    },
    comparison: {
      title: "Key Female Fertility Tests and What They Measure",
      leftLabel: "Test", rightLabel: "What It Tells You",
      rows: [
        { aspect: "AMH blood test",  left: "Day 2–3, anytime in cycle",  right: "Ovarian reserve (egg supply)" },
        { aspect: "AFC ultrasound",  left: "Day 2–3 scan",               right: "Antral follicle count (reserve)" },
        { aspect: "FSH + LH",        left: "Day 2–3 blood test",         right: "Pituitary-ovarian axis balance" },
        { aspect: "Progesterone",    left: "Day 21 blood test",          right: "Confirms ovulation occurred" },
        { aspect: "HSG / HyCoSy",    left: "X-ray or ultrasound study",  right: "Fallopian tube patency" },
      ],
    },
    extImage: {
      url: "https://images.pexels.com/photos/5738735/pexels-photo-5738735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Indian female fertility doctor reviewing ovarian reserve results with a patient — comprehensive female fertility assessment at BFI",
      caption: "Understanding your AMH, AFC, and hormonal profile is the foundation of every female fertility treatment plan at BFI.",
      credit: "Photo: Dr Aparna Jaswal / Pexels (Delhi, India)",
    },
    cta: { accent: "rose",
      headline: "Get a Comprehensive Female Fertility Assessment",
      subtext: "One morning at BFI gives you a full hormonal profile, ovarian reserve assessment, and a personalised treatment roadmap.",
      buttons: [{ label: "Book Fertility Assessment", url: "/contact", variant: "primary" }, { label: "PCOS & Fertility", url: "/blog/top-fertility-treatments-for-women-with-pcos", variant: "secondary" }],
    },
  },

  pregnancy: {
    hero: M.couple,
    stats: [
      { value: "12 Weeks", label: "End of the first trimester" },
      { value: "20 Weeks", label: "Anomaly scan milestone" },
      { value: "99%",      label: "Neural tube defects preventable with folic acid" },
      { value: "Day 3",    label: "When morning sickness typically peaks" },
    ],
    highlight: { accent: "rose",
      headline: "Every Pregnancy Milestone Deserves Expert Attention",
      body: "From the first heartbeat scan to the third-trimester check, each milestone is both a medical checkpoint and a moment to cherish. Pregnancies conceived through IVF — or with any history of complications — deserve close, personalised monitoring, which is what BFI's high-risk obstetric team is specifically trained to provide.",
    },
    extImage: {
      url: "https://images.pexels.com/photos/18277954/pexels-photo-18277954.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Indian couple sharing a tender outdoor moment during pregnancy — the joyful destination every fertility journey aims for",
      caption: "A healthy, monitored pregnancy is the goal every BFI team member works toward — from first consultation to birth.",
      credit: "Photo: Darshan Dave / Pexels (Dhari, Gujarat, India)",
    },
    cta: { accent: "rose",
      headline: "From Positive Test to Safe Delivery — BFI Is With You",
      subtext: "BFI's high-risk obstetric and antenatal care team ensures every pregnancy gets the monitoring and support it deserves.",
      buttons: [{ label: "Book Antenatal Consultation", url: "/contact", variant: "primary" }, { label: "Pregnancy Care at BFI", url: "/treatments", variant: "secondary" }],
    },
  },

  embryo: {
    hero: M.lab,
    stats: [
      { value: "Day 5",   label: "Blastocyst transfer ideal day" },
      { value: "65%",     label: "Blastocyst implantation success at BFI" },
      { value: "40–60%",  label: "Euploid embryo rate after PGT-A testing" },
      { value: "Day 12",  label: "Beta hCG test after transfer" },
    ],
    highlight: { accent: "plum",
      headline: "Not Every Embryo Can Implant — and That Is Normal",
      body: "Of all embryos created in an IVF cycle, only a proportion are chromosomally normal and capable of successful implantation. PGT-A testing identifies the best embryo before transfer — significantly improving success rates, especially after previous failures or if you are over 35.",
    },
    comparison: {
      title: "Day 3 (Cleavage) vs Day 5 (Blastocyst) Transfer",
      leftLabel: "Day 3 Transfer", rightLabel: "Day 5 Transfer",
      rows: [
        { aspect: "Embryo stage",         left: "6–8 cell stage",                   right: "Blastocyst (100+ cells)" },
        { aspect: "Implantation rate",    left: "~30–40%",                           right: "~55–65% at BFI" },
        { aspect: "Natural selection",    left: "Less — fewer cells to assess",      right: "Only strongest survive to Day 5" },
        { aspect: "PGT suitability",      left: "Possible but less accurate",        right: "Ideal stage for biopsy" },
        { aspect: "Best for",             left: "Few embryos (risk of none reaching D5)", right: "Multiple good-quality embryos" },
      ],
    },
    extImage: {
      url: "https://images.pexels.com/photos/8533045/pexels-photo-8533045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Embryologist examining embryos through a microscope in a modern IVF laboratory at Bavishi Fertility Institute",
      caption: "Every embryo at BFI is graded, cultured to Day 5 where possible, and assessed using time-lapse incubation technology.",
      credit: "Photo: Pexels",
    },
    cta: { accent: "plum",
      headline: "Optimise Your Embryo Transfer Outcome With BFI",
      subtext: "From time-lapse incubation to PGT-A genetic testing, BFI offers every tool to maximise your embryo's chances of implantation.",
      buttons: [{ label: "Discuss Your Embryo Plan", url: "/contact", variant: "primary" }, { label: "Embryo Transfer Guide", url: "/blog/post-embryo-transfer-timeline-what-happens-after-3-5-7-and-9-days", variant: "secondary" }],
    },
  },

  egg: {
    hero: M.lab,
    stats: [
      { value: "35+",    label: "Age when egg quality declines sharply" },
      { value: "10–15",  label: "Optimal eggs retrieved per stimulation cycle" },
      { value: "95%",    label: "Egg survival rate after vitrification at BFI" },
      { value: "10 Years",label: "Frozen egg storage option available" },
    ],
    highlight: { accent: "gold",
      headline: "Egg Quality Matters More Than Egg Quantity",
      body: "Retrieving 15 eggs with poor quality is less valuable than retrieving 8 high-quality ones. BFI's stimulation protocols are calibrated to optimise both — maximising the number of usable eggs while protecting ovarian health and minimising the risk of OHSS.",
    },
    comparison: {
      title: "Fresh Transfer vs Frozen Embryo Transfer (FET)",
      leftLabel: "Fresh Transfer", rightLabel: "Frozen Transfer (FET)",
      rows: [
        { aspect: "Cycle timing",         left: "Same as stimulation cycle",       right: "Separate natural/medicated cycle" },
        { aspect: "Endometrial prep",     left: "Done simultaneously",             right: "Optimised independently" },
        { aspect: "OHSS risk",            left: "Higher with fresh trigger",       right: "Eliminated (freeze-all strategy)" },
        { aspect: "Success rate at BFI",  left: "~55%",                            right: "~60–65%" },
        { aspect: "Timing flexibility",   left: "Limited",                         right: "Full control over transfer window" },
      ],
    },
    extImage: {
      url: "https://images.pexels.com/photos/8533045/pexels-photo-8533045.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Embryologist in a state-of-the-art IVF laboratory examining retrieved eggs under a microscope at BFI",
      caption: "At BFI, every retrieved egg is carefully graded, cultured, and — where appropriate — vitrified to preserve its potential.",
      credit: "Photo: Pexels",
    },
    cta: { accent: "gold",
      headline: "Preserve Your Fertility. Plan Your Future.",
      subtext: "Whether you are ready to start a family now or want to protect your options, BFI's egg freezing programme gives you control.",
      buttons: [{ label: "Egg Freezing Consultation", url: "/contact", variant: "primary" }, { label: "About Egg Freezing", url: "/treatments/ivf", variant: "secondary" }],
    },
  },

  hormone: {
    hero: M.doctor,
    stats: [
      { value: "Day 2–3",   label: "Ideal timing for FSH / AMH blood test" },
      { value: "AMH > 1.0", label: "Normal ovarian reserve marker" },
      { value: "Day 21",    label: "Progesterone test to confirm ovulation" },
      { value: "< 10 IU/L", label: "Normal FSH range in reproductive years" },
    ],
    highlight: { accent: "plum",
      headline: "Three Numbers That Guide Your Entire Treatment Plan",
      body: "AMH, FSH, and LH together give a complete picture of your ovarian reserve and hormonal cycle health. These three values inform every treatment decision at BFI — from stimulation dose to optimal transfer timing — ensuring no two patients receive the same protocol.",
    },
    extImage: {
      url: "https://images.pexels.com/photos/5738735/pexels-photo-5738735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Indian female doctor reviewing hormonal blood test results with a fertility patient at BFI Ahmedabad",
      caption: "Understanding your hormonal profile — AMH, FSH, LH, and progesterone — is the single most important diagnostic step in fertility care.",
      credit: "Photo: Dr Aparna Jaswal / Pexels (Delhi, India)",
    },
    cta: { accent: "plum",
      headline: "Know Your Hormonal Profile. Know Your Options.",
      subtext: "A single morning hormone panel at BFI gives you the data to make clear, informed fertility decisions — at any stage of your journey.",
      buttons: [{ label: "Book Hormone Panel", url: "/contact", variant: "primary" }, { label: "Understanding AMH", url: "/blog", variant: "secondary" }],
    },
  },

  clinic: {
    hero: M.doctor,
    stats: [
      { value: "15+ Years", label: "BFI fertility expertise in Gujarat" },
      { value: "10,000+",   label: "Successful fertility cycles at BFI" },
      { value: "3 Centres", label: "BFI locations across Gujarat" },
      { value: "60–65%",    label: "IVF success rate per cycle at BFI" },
    ],
    highlight: { accent: "plum",
      headline: "The Right Clinic Changes Your Odds — Significantly",
      body: "Success rates vary substantially between fertility clinics — not just because of equipment, but because of protocol customisation, embryology expertise, and the clinical team behind each cycle. At BFI, 15+ years of experience means your case is never treated as routine.",
    },
    comparison: {
      title: "What to Look for When Choosing an IVF Clinic",
      leftLabel: "Green Flag", rightLabel: "Red Flag",
      rows: [
        { aspect: "Success rate data",      left: "Published per-cycle ICMR data",     right: "Only 'cumulative' or unverified" },
        { aspect: "Protocol approach",      left: "Tailored after full evaluation",     right: "Same protocol for all patients" },
        { aspect: "Embryology team",        left: "Dedicated in-house embryologists",  right: "Shared or outsourced lab" },
        { aspect: "Cost transparency",      left: "Full itemised quote upfront",        right: "Low headline + hidden add-ons" },
        { aspect: "Continuity of care",     left: "Same named doctor throughout",       right: "Rotating junior staff" },
      ],
    },
    extImage: {
      url: "https://images.pexels.com/photos/5738735/pexels-photo-5738735.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Experienced Indian fertility specialist at BFI — personalised fertility care with 15+ years of clinical expertise in Gujarat",
      caption: "Choosing the right fertility clinic is one of the most important decisions on your path to parenthood.",
      credit: "Photo: Dr Aparna Jaswal / Pexels (Delhi, India)",
    },
    cta: { accent: "plum",
      headline: "Experience the BFI Difference",
      subtext: "With 3 centres across Gujarat and 15+ years of clinical excellence, BFI offers world-class fertility care close to home.",
      buttons: [{ label: "Book Consultation", url: "/contact", variant: "primary" }, { label: "Visit a BFI Centre", url: "/locations", variant: "secondary" }],
    },
  },

  myths: {
    hero: M.consult,
    stats: [
      { value: "1 in 6", label: "Couples globally affected by infertility" },
      { value: "40%",    label: "IVF cases involve a male infertility factor" },
      { value: "60%",    label: "IVF success rate per cycle — not a last resort" },
      { value: "99%",    label: "IVF babies as healthy as naturally conceived" },
    ],
    highlight: { accent: "rose",
      headline: "Fertility Myths Cost People Their Best Window",
      body: "Waiting too long because of a myth — that IVF is a last resort, that stress alone causes infertility, that age doesn't matter until 40 — is one of the most common and avoidable reasons couples miss their optimal fertility window. Accurate, evidence-based information is the most valuable tool you have.",
    },
    extImage: {
      url: "https://images.pexels.com/photos/6129040/pexels-photo-6129040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Fertility doctor discussing evidence-based treatment with a patient — separating fertility myths from medical facts at BFI",
      caption: "Every fertility question deserves an honest, evidence-based answer — not reassurance built on outdated assumptions.",
      credit: "Photo: Pexels",
    },
    cta: { accent: "rose",
      headline: "Get Evidence-Based Answers From BFI Specialists",
      subtext: "No judgement, no pressure — just clarity on your specific situation from a team with 15+ years of clinical experience.",
      buttons: [{ label: "Book Consultation", url: "/contact", variant: "primary" }, { label: "Browse Fertility Guides", url: "/blog", variant: "secondary" }],
    },
  },

  default: {
    hero: M.consult,
    stats: [
      { value: "15+ Years", label: "BFI fertility expertise in Gujarat" },
      { value: "10,000+",   label: "Families helped at BFI" },
      { value: "60%",       label: "IVF success rate per cycle at BFI" },
      { value: "3 Centres", label: "BFI locations across Gujarat" },
    ],
    highlight: { accent: "plum",
      headline: "Evidence-Based Fertility Care Makes the Difference",
      body: "At Bavishi Fertility Institute, every treatment decision is backed by data, peer-reviewed evidence, and 15+ years of clinical experience. Whether you are just beginning your fertility journey or have been trying for years, you deserve a plan built on science — not guesswork.",
    },
    extImage: {
      url: "https://images.pexels.com/photos/6129040/pexels-photo-6129040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Fertility specialist discussing a personalised treatment plan with a patient — evidence-based care at BFI Ahmedabad, Gujarat",
      caption: "Personalised, evidence-based care is the standard at every BFI consultation.",
      credit: "Photo: Pexels",
    },
    cta: { accent: "rose",
      headline: "Take the First Step Toward Parenthood",
      subtext: "Schedule a consultation with BFI's fertility specialists — personalised, evidence-based care for your unique journey.",
      buttons: [{ label: "Book Consultation", url: "/contact", variant: "primary" }, { label: "Explore Treatments", url: "/treatments", variant: "secondary" }],
    },
  },
};

/* ── Block injection into existing Lexical content ───────────────── *
 * Phase 2 already added: statStrip, highlightCard, comparisonTable,
 * conclusionPanel.  Phase 3 adds: externalImage + inlineCta.
 * Idempotency key: presence of an externalImage block.
 * ──────────────────────────────────────────────────────────────────── */
function buildEnrichedContent(existingContent, tpl) {
  const children = existingContent?.root?.children ?? [];

  /* Idempotency — skip if already has externalImage (Phase 3 done) */
  if (children.some(n => n.type === "block" && n.fields?.blockType === "externalImage")) {
    return null;
  }

  const n = children.length;

  /* Find best insertion point for ExternalImage: after the first
   * non-block paragraph/heading, roughly 20% into the content */
  const firstPara = children.findIndex(node => node.type !== "block");
  const posImg = firstPara >= 0
    ? Math.max(firstPara, Math.min(Math.floor(n * 0.20), n - 1))
    : Math.min(1, n - 1);

  /* Build new children — insert ExternalImage, append InlineCta at end */
  const newChildren = [...children];
  newChildren.splice(posImg + 1, 0, mkExtImage(tpl.extImage));
  newChildren.push(mkCta(tpl.cta));

  return { root: { ...existingContent.root, children: newChildren } };
}

/* ── API helpers ─────────────────────────────────────────────────── */
async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed: ${await res.text()}`);
  const { token } = await res.json();
  return { Authorization: `JWT ${token}` };
}

async function fetchAllBlogIds(auth) {
  const all = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `${BASE}/api/blogs?limit=50&page=${page}&depth=0&select[id]=true&select[slug]=true&select[heroImage]=true`,
      { headers: auth }
    );
    const data = await res.json();
    all.push(...(data.docs ?? []));
    if (!data.hasNextPage) break;
    page++;
  }
  return all;
}

async function fetchBlogFull(id, auth) {
  const res = await fetch(`${BASE}/api/blogs/${id}?depth=0`, { headers: auth });
  if (!res.ok) throw new Error(`Failed to fetch blog ${id}: ${res.status}`);
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
    throw new Error(`PATCH ${id} failed: ${err.slice(0, 200)}`);
  }
  return res.json();
}

/* ── Main ────────────────────────────────────────────────────────── */
async function run() {
  log(`Connecting to ${BASE} …`);
  if (DRY_RUN) log("DRY RUN — no changes will be saved");

  const auth = await login();
  log("Login OK\n");

  const allBlogs = await fetchAllBlogIds(auth);
  log(`Found ${allBlogs.length} total blog posts`);

  const toProcess = allBlogs.filter(b => !PILOT_SLUGS.has(b.slug));
  log(`Skipping ${allBlogs.length - toProcess.length} pilot posts`);
  log(`Processing ${toProcess.length} remaining posts\n`);

  let done = 0, skipped = 0, errors = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const meta = toProcess[i];
    const num  = `[${i + 1}/${toProcess.length}]`;

    try {
      /* Fetch full blog content */
      const blog = await fetchBlogFull(meta.id, auth);
      const category = detectCategory(blog.slug ?? "");
      const tpl = TEMPLATES[category] ?? TEMPLATES.default;

      /* Build enriched content (returns null if already done) */
      const newContent = buildEnrichedContent(blog.content, tpl);

      if (!newContent) {
        log(`  ↩ ${num} SKIP (already enriched): ${blog.slug}`);
        skipped++;
      } else {
        const patch = { content: newContent };
        if (!blog.heroImage) patch.heroImage = tpl.hero;

        if (!DRY_RUN) {
          await patchBlog(blog.id, patch, auth);
        }
        log(`  ✓ ${num} [${category}] ${blog.slug}`);
        done++;
      }
    } catch (err) {
      log(`  ✗ ${num} ERROR: ${meta.slug} — ${err.message}`);
      errors++;
    }

    /* Pacing — 200ms between each post */
    await new Promise(r => setTimeout(r, 200));
  }

  log(`\n✅ Done!`);
  log(`   Enriched : ${done}`);
  log(`   Skipped  : ${skipped}`);
  log(`   Errors   : ${errors}`);
}

run().catch(err => {
  console.error("[bulk] FATAL:", err.message);
  process.exit(1);
});
