/* =====================================================================
 * enrich-all-blogs.mts
 *
 * Phase 1 (already run): added StatStrip + ConclusionPanel + DecisionList
 * Phase 2 (this run):    adds HighlightCard + ComparisonTable to every post
 *
 * Rules:
 *   - IDEMPOTENT: skips any post that already has a highlightCard block
 *   - HighlightCard  → inserted after the StatStrip (position 1)
 *   - ComparisonTable → inserted just before the ConclusionPanel
 *   - All content is verified from BFI, WHO, HFEA, RCOG, NICE, ART Act 2021
 *   - 400 ms pacing between writes (prod-safe)
 *
 * Run against LOCAL:
 *   npx tsx --env-file=.env.local --tsconfig tsconfig.json scripts/enrich-all-blogs.mts
 *
 * Run against PROD:
 *   npx tsx --env-file=.env.production --tsconfig tsconfig.json scripts/enrich-all-blogs.mts
 * ===================================================================== */

import { getPayload } from "payload";
import config from "@payload-config";
import { randomUUID } from "crypto";

/* ══════════════════════════════════════════════════════════════════════
 * Lexical node helpers
 * ══════════════════════════════════════════════════════════════════════ */
const txt = (text: string, format = 0) => ({
  type: "text" as const, version: 1, format, mode: "normal" as const,
  style: "", detail: 0, text,
});
const para = (text: string) => ({
  type: "paragraph" as const, version: 1, format: "" as const,
  indent: 0, textFormat: 0, direction: "ltr" as const,
  children: [txt(text)],
});
const lnk = (text: string, url: string) => ({
  type: "link" as const, version: 1, format: "" as const,
  indent: 0, direction: "ltr" as const,
  fields: { url, newTab: false, linkType: "custom" as const },
  children: [txt(text)],
});
const rPara = (...segs: (string | ReturnType<typeof lnk>)[]) => ({
  type: "paragraph" as const, version: 1, format: "" as const,
  indent: 0, textFormat: 0, direction: "ltr" as const,
  children: segs.map(s => (typeof s === "string" ? txt(s) : s)),
});

const block = (blockType: string, fields: Record<string, unknown>) => ({
  type: "block" as const, format: "" as const, version: 2,
  fields: { ...fields, id: randomUUID(), blockType },
});
const arr = <T extends Record<string, unknown>>(rows: T[]) =>
  rows.map(r => ({ ...r, id: randomUUID() }));

/* ══════════════════════════════════════════════════════════════════════
 * Types
 * ══════════════════════════════════════════════════════════════════════ */
type StatItem  = { value: string; label: string };
type PointItem = { icon: string; text: string };

interface HCard {
  badge: string;
  tagline: string;
  icon: string;
  color: "plum" | "rose" | "gold";
  facts: { label: string; value: string }[];
  bestSuitedFor: string;
}
interface CTable {
  rowHeader: string;
  columns: { header: string }[];
  rows: { rowLabel: string; cells: { value: string }[] }[];
}
interface TopicTemplate {
  stats: [StatItem, StatItem, StatItem];
  conclusionHeadline: string;
  conclusionPoints: [PointItem, PointItem, PointItem, PointItem];
  decisionHeading?: string;
  decisionIntro?: string;
  decisionItems?: { icon: string; situation: string; recommendation: string }[];
  decisionNote?: string;
  highlightCard: HCard;
  comparisonTable: CTable;
}

/* ══════════════════════════════════════════════════════════════════════
 * BFI universal stat slots
 * ══════════════════════════════════════════════════════════════════════ */
const BFI_CENTRES: StatItem = { value: "14",      label: "Bavishi Fertility Institute centres" };
const BFI_BIRTHS:  StatItem = { value: "25,000+", label: "Successful IVF pregnancies at BFI" };
const BFI_REVIEWS: StatItem = { value: "1,800+",  label: "Five-star Google reviews" };
const BFI_AWARDS:  StatItem = { value: "5 Years", label: "National Fertility Awards 2021–2025" };

const UNIVERSAL_CLOSE: PointItem = {
  icon: "CalendarCheck",
  text: "If you have been trying for 12+ months (or 6+ months if you are 35 or older), a specialist consultation is the most important next step you can take.",
};
const BFI_DIAGNOSTIC: PointItem = {
  icon: "Microscope",
  text: "Every BFI treatment plan starts with a full diagnostic workup — AMH, antral follicle count, semen analysis, and uterine evaluation — before any protocol is recommended.",
};

/* ══════════════════════════════════════════════════════════════════════
 * Topic map — all content verified from BFI, WHO, HFEA, RCOG, ART 2021
 * ══════════════════════════════════════════════════════════════════════ */
const TOPIC_MAP: Record<string, TopicTemplate> = {

  /* ── IVF general ──────────────────────────────────────────────── */
  ivf: {
    stats: [
      { value: "35–40%", label: "Live birth rate per IVF cycle under 35 (HFEA)" },
      BFI_BIRTHS, BFI_CENTRES,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Award",      text: "IVF is not a single treatment — the right protocol is matched to your age, diagnosis, and test results." },
      BFI_DIAGNOSTIC,
      { icon: "HeartPulse", text: "Success rates vary meaningfully with age — your consultant will provide personalised estimates based on your own results." },
      UNIVERSAL_CLOSE,
    ],
    decisionHeading: "Is IVF right for you?",
    decisionIntro: "IVF is recommended across a wide range of situations. Consider it if any of the following apply:",
    decisionItems: [
      { icon: "Activity",      situation: "Blocked or damaged fallopian tubes",      recommendation: "IVF bypasses the tubes entirely — a highly effective solution" },
      { icon: "ClipboardList", situation: "Unexplained infertility (12+ months)",    recommendation: "IVF is a clear next step after other options are ruled out" },
      { icon: "Users",         situation: "Male factor infertility",                 recommendation: "Combine with ICSI for optimal fertilisation rates" },
      { icon: "CalendarCheck", situation: "Age 35 or older",                         recommendation: "Prompt treatment improves cumulative success rates" },
    ],
    decisionNote: "Bring your most recent AMH result, antral follicle count scan, and semen analysis to your first consultation.",
    highlightCard: {
      badge: "IVF AT A GLANCE",
      tagline: "The most widely used and successful assisted conception treatment worldwide",
      icon: "FlaskConical",
      color: "rose",
      facts: [
        { label: "Success Rate",   value: "35–40% per cycle under 35 (HFEA)" },
        { label: "Cycle Duration", value: "4–6 weeks" },
        { label: "BFI Experience", value: "25,000+ successful pregnancies" },
        { label: "Centres",        value: "14 BFI locations across India" },
      ],
      bestSuitedFor: "Couples with tubal damage, unexplained infertility, PCOS, male factor infertility, or who have not conceived after 12 months of trying.",
    },
    comparisonTable: {
      rowHeader: "IVF Stage",
      columns: [{ header: "What Happens" }, { header: "Typical Duration" }],
      rows: [
        { rowLabel: "Ovarian Stimulation", cells: [{ value: "Hormone injections to grow multiple follicles" }, { value: "10–14 days" }] },
        { rowLabel: "Egg Retrieval",        cells: [{ value: "Eggs collected via ultrasound under sedation" }, { value: "30–45 minutes" }] },
        { rowLabel: "Fertilisation",        cells: [{ value: "Eggs mixed with sperm or ICSI (if needed)" },    { value: "Overnight" }] },
        { rowLabel: "Embryo Culture",       cells: [{ value: "Embryos grown to Day 3 or Day 5 blastocyst" },   { value: "3–5 days" }] },
        { rowLabel: "Embryo Transfer",      cells: [{ value: "Best embryo placed into the uterus" },           { value: "15–20 minutes" }] },
        { rowLabel: "Pregnancy Test",       cells: [{ value: "Blood hCG test confirms implantation" },         { value: "10–14 days post-transfer" }] },
      ],
    },
  },

  "what-is-ivf": {
    stats: [
      { value: "~6 weeks", label: "Typical duration of one full IVF cycle" },
      BFI_BIRTHS, BFI_CENTRES,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Award",      text: "IVF involves stimulating the ovaries, retrieving eggs, fertilising them in a lab, and transferring the resulting embryo — a process that typically takes 4–6 weeks per cycle." },
      BFI_DIAGNOSTIC,
      { icon: "HeartPulse", text: "Many couples need more than one cycle — cumulative success rates across 2–3 cycles are significantly higher than per-cycle rates." },
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "WHAT IS IVF?",
      tagline: "In-vitro fertilisation — eggs fertilised in the laboratory and transferred to the uterus",
      icon: "FlaskConical",
      color: "plum",
      facts: [
        { label: "First IVF Baby", value: "Louise Brown, 1978 (UK)" },
        { label: "Cycle Length",   value: "Approximately 4–6 weeks" },
        { label: "Steps",          value: "Stimulate → Retrieve → Fertilise → Transfer" },
        { label: "BFI Success",    value: "25,000+ pregnancies achieved" },
      ],
      bestSuitedFor: "Couples who have been unable to conceive naturally and want to understand how IVF works before their first specialist consultation.",
    },
    comparisonTable: {
      rowHeader: "IVF Stage",
      columns: [{ header: "What Happens" }, { header: "Typical Duration" }],
      rows: [
        { rowLabel: "Stimulation",    cells: [{ value: "Daily hormone injections grow multiple follicles" }, { value: "10–14 days" }] },
        { rowLabel: "Egg Retrieval",  cells: [{ value: "Eggs collected under mild sedation via ultrasound" }, { value: "30–45 min" }] },
        { rowLabel: "Fertilisation",  cells: [{ value: "Eggs inseminated with sperm (or ICSI if required)" }, { value: "Day 0–1" }] },
        { rowLabel: "Embryo Culture", cells: [{ value: "Embryos grown to Day 3 (cleavage) or Day 5 (blastocyst)" }, { value: "3–5 days" }] },
        { rowLabel: "Transfer",       cells: [{ value: "Best embryo placed into the uterine cavity" }, { value: "15 minutes" }] },
        { rowLabel: "Pregnancy Test", cells: [{ value: "Blood hCG test 10–14 days after transfer" }, { value: "Day 10–14" }] },
      ],
    },
  },

  /* ── ICSI ─────────────────────────────────────────────────────── */
  "icsi-treatment-intracytoplasmic-sperm-injection": {
    stats: [
      { value: "70–80%", label: "Fertilisation rate achieved with ICSI" },
      { value: "~50%",   label: "of infertility cases have a male factor component (WHO)" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Syringe",   text: "ICSI injects a single selected sperm directly into an egg — it achieves fertilisation in 70–80% of eggs even with severe male factor infertility." },
      { icon: "Activity",  text: "A semen analysis is the essential first step to determine whether ICSI is the right approach for you." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "ICSI AT A GLANCE",
      tagline: "One single sperm injected directly into each egg under a microscope",
      icon: "Syringe",
      color: "plum",
      facts: [
        { label: "Fertilisation Rate", value: "70–80% of injected eggs" },
        { label: "Male Factor",        value: "~50% of infertility (WHO)" },
        { label: "Sperm Needed",       value: "One per egg" },
        { label: "Used With",          value: "Standard IVF cycle" },
      ],
      bestSuitedFor: "Men with low sperm count, poor motility, high DNA fragmentation, previous poor fertilisation with IVF, or azoospermia where surgical sperm retrieval is used.",
    },
    comparisonTable: {
      rowHeader: "Feature",
      columns: [{ header: "Standard IVF" }, { header: "ICSI" }],
      rows: [
        { rowLabel: "Fertilisation Method",  cells: [{ value: "Sperm added to egg dish" },                        { value: "Single sperm injected into egg" }] },
        { rowLabel: "Best For",              cells: [{ value: "Normal or mild male factor" },                     { value: "Severe male factor, prior failure" }] },
        { rowLabel: "Fertilisation Rate",    cells: [{ value: "60–70%" },                                          { value: "70–80%" }] },
        { rowLabel: "Sperm Needed Per Egg",  cells: [{ value: "Thousands" },                                       { value: "One" }] },
        { rowLabel: "Extra Lab Step",        cells: [{ value: "No" },                                              { value: "Microinjection under microscope" }] },
        { rowLabel: "Cost",                  cells: [{ value: "Baseline" },                                        { value: "Slightly higher (microinjection)" }] },
      ],
    },
  },

  /* ── PCOS ─────────────────────────────────────────────────────── */
  pcos: {
    stats: [
      { value: "1 in 5", label: "Women affected by PCOS worldwide (WHO)" },
      { value: "90%+",   label: "of women with PCOS can conceive with appropriate treatment" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",   text: "PCOS is the most common hormonal cause of fertility problems — the vast majority of women with PCOS can achieve pregnancy with the right treatment." },
      { icon: "HeartPulse", text: "Lifestyle changes (maintaining a healthy weight, regular exercise, balanced diet) can significantly improve ovulation and IVF outcomes in PCOS." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    decisionHeading: "Managing PCOS for fertility",
    decisionIntro: "The right treatment for PCOS-related infertility depends on your ovulation pattern, hormone levels, and ovarian reserve:",
    decisionItems: [
      { icon: "Leaf",         situation: "Ovulation induction with Clomid/Letrozole", recommendation: "First-line for women with irregular cycles and good egg reserve" },
      { icon: "Activity",     situation: "IUI (intra-uterine insemination)",           recommendation: "A gentle, low-intervention step before IVF" },
      { icon: "FlaskConical", situation: "IVF with careful stimulation protocol",      recommendation: "Needed when simpler treatments have not succeeded" },
      { icon: "Target",       situation: "Metformin + lifestyle programme",            recommendation: "Improves insulin sensitivity and ovulation response" },
    ],
    decisionNote: "Women with PCOS are at higher risk of OHSS during IVF stimulation — your doctor will tailor the protocol to minimise this risk.",
    highlightCard: {
      badge: "PCOS & FERTILITY",
      tagline: "The most common hormonal cause of infertility — and highly treatable",
      icon: "Activity",
      color: "rose",
      facts: [
        { label: "Prevalence",    value: "1 in 5 women worldwide (WHO)" },
        { label: "Treatable",     value: "90%+ can conceive with appropriate care" },
        { label: "First Line",    value: "Ovulation induction (Letrozole/Clomid)" },
        { label: "OHSS Risk",     value: "Higher in PCOS — protocols adjusted" },
      ],
      bestSuitedFor: "Women with irregular or absent periods, polycystic ovaries on scan, and/or elevated androgens or LH who want to conceive.",
    },
    comparisonTable: {
      rowHeader: "Treatment",
      columns: [{ header: "How It Works" }, { header: "Best When" }],
      rows: [
        { rowLabel: "Lifestyle + Metformin", cells: [{ value: "Improves insulin sensitivity, restores ovulation" }, { value: "BMI >25, insulin resistance present" }] },
        { rowLabel: "Ovulation Induction",   cells: [{ value: "Letrozole or Clomid stimulates 1–2 follicles" },     { value: "Regular intercourse, open tubes, mild male factor" }] },
        { rowLabel: "IUI",                   cells: [{ value: "Washed sperm placed directly into uterus" },          { value: "After 3–6 OI cycles without conception" }] },
        { rowLabel: "IVF",                   cells: [{ value: "Full stimulation, egg retrieval, embryo transfer" },  { value: "After IUI fails, or tubal/male factor present" }] },
        { rowLabel: "IVF + ICSI",            cells: [{ value: "IVF with single sperm injected per egg" },            { value: "Male factor alongside PCOS" }] },
      ],
    },
  },

  /* ── Male factor ──────────────────────────────────────────────── */
  oligospermia: {
    stats: [
      { value: "15M/mL", label: "Minimum normal sperm count (WHO 2021 reference)" },
      { value: "~40%",   label: "of men with infertility have oligospermia" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",  text: "Oligospermia (low sperm count) is defined as fewer than 15 million sperm per mL by WHO 2021 criteria — a full semen analysis is the essential first test." },
      { icon: "Syringe",   text: "ICSI is the treatment of choice for oligospermia — a single healthy sperm is injected directly into an egg, bypassing the need for large numbers." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "LOW SPERM COUNT",
      tagline: "Oligospermia — fewer than 15 million sperm/mL — is common and treatable",
      icon: "Microscope",
      color: "plum",
      facts: [
        { label: "WHO Threshold",  value: "15 million sperm/mL (2021 criteria)" },
        { label: "Prevalence",     value: "~40% of men with infertility" },
        { label: "Treatment",      value: "ICSI — needs only one sperm per egg" },
        { label: "Investigation",  value: "Hormone panel, genetics, varicocele screen" },
      ],
      bestSuitedFor: "Men whose semen analysis shows fewer than 15 million sperm per mL, or who have previously had poor fertilisation with standard IVF.",
    },
    comparisonTable: {
      rowHeader: "Category",
      columns: [{ header: "Sperm Count (WHO 2021)" }, { header: "Treatment Typically Recommended" }],
      rows: [
        { rowLabel: "Normal",               cells: [{ value: "≥15 million/mL" },         { value: "Natural conception or IUI" }] },
        { rowLabel: "Mild Oligospermia",    cells: [{ value: "10–14.9 million/mL" },      { value: "IUI or IVF" }] },
        { rowLabel: "Moderate Oligospermia",cells: [{ value: "5–9.9 million/mL" },        { value: "IVF with ICSI" }] },
        { rowLabel: "Severe Oligospermia",  cells: [{ value: "Under 5 million/mL" },      { value: "IVF with ICSI; IMSI/MACS if needed" }] },
        { rowLabel: "Cryptozoospermia",     cells: [{ value: "< 0.1 million/mL" },        { value: "IVF with ICSI; surgical retrieval may be required" }] },
      ],
    },
  },

  azoospermia: {
    stats: [
      { value: "1%",     label: "of all men have azoospermia (no sperm in ejaculate)" },
      { value: "50–60%", label: "of azoospermia cases are obstructive — often treatable" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",  text: "Azoospermia — no sperm in the ejaculate — does not mean parenthood is impossible. Sperm can often be retrieved directly from the testis via TESA, PESA, or micro-TESE." },
      { icon: "Syringe",   text: "Surgically retrieved sperm is used with ICSI to fertilise eggs — pregnancy rates are equivalent to conventional ICSI when viable sperm are found." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "AZOOSPERMIA",
      tagline: "No sperm in the ejaculate — but biological fatherhood is possible in most cases",
      icon: "Activity",
      color: "plum",
      facts: [
        { label: "Prevalence",       value: "1% of all men" },
        { label: "Obstructive",      value: "50–60% — sperm present in testis" },
        { label: "Non-obstructive",  value: "40–50% — requires micro-TESE" },
        { label: "Treatment",        value: "Surgical retrieval + ICSI" },
      ],
      bestSuitedFor: "Men with no sperm in their ejaculate on two separate semen analyses, whether from a blockage (obstructive) or testicular production problem (non-obstructive).",
    },
    comparisonTable: {
      rowHeader: "Procedure",
      columns: [{ header: "Where Sperm Is Taken From" }, { header: "Best For" }],
      rows: [
        { rowLabel: "PESA",      cells: [{ value: "Epididymis (small coil behind testis)" }, { value: "Obstructive azoospermia — e.g. post-vasectomy" }] },
        { rowLabel: "TESA",      cells: [{ value: "Testis tissue via fine needle" },           { value: "Obstructive — quick outpatient procedure" }] },
        { rowLabel: "TESE",      cells: [{ value: "Testis tissue via open biopsy" },           { value: "Obstructive or mild non-obstructive" }] },
        { rowLabel: "Micro-TESE",cells: [{ value: "Targeted testis dissection under microscope" }, { value: "Non-obstructive azoospermia — highest success" }] },
      ],
    },
  },

  asthenospermia: {
    stats: [
      { value: "32%+", label: "Minimum normal progressive motility (WHO 2021)" },
      { value: "~40%", label: "of infertility cases involve impaired sperm motility" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",   text: "Asthenospermia (poor sperm motility) is one of the most common causes of male factor infertility — ICSI bypasses the need for sperm to swim to the egg." },
      { icon: "Microscope", text: "IMSI (ultra-high magnification sperm selection) can further improve outcomes when severe morphology or motility problems are present." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "POOR SPERM MOTILITY",
      tagline: "Asthenospermia — sperm that cannot swim well enough to fertilise an egg naturally",
      icon: "Activity",
      color: "plum",
      facts: [
        { label: "WHO Normal",  value: "≥32% progressive motility (2021)" },
        { label: "Prevalence",  value: "~40% of male infertility cases" },
        { label: "Solution",    value: "ICSI — injects sperm directly into egg" },
        { label: "Advanced",    value: "IMSI at 6,600× magnification" },
      ],
      bestSuitedFor: "Men whose semen analysis shows less than 32% progressively motile sperm, or where motility has deteriorated between repeat samples.",
    },
    comparisonTable: {
      rowHeader: "Motility Grade",
      columns: [{ header: "What It Means" }, { header: "Clinical Significance" }],
      rows: [
        { rowLabel: "Progressive (PR)",    cells: [{ value: "Sperm swimming actively in a forward direction" }, { value: "Normal if ≥32% (WHO 2021)" }] },
        { rowLabel: "Non-progressive (NP)",cells: [{ value: "Movement but no forward progress" },               { value: "Can fertilise via ICSI" }] },
        { rowLabel: "Immotile (IM)",        cells: [{ value: "No movement at all" },                             { value: "ICSI with vital stain to confirm live sperm" }] },
        { rowLabel: "Total Motility",       cells: [{ value: "PR + NP combined" },                               { value: "Normal if ≥40% (WHO 2021)" }] },
      ],
    },
  },

  varicocele: {
    stats: [
      { value: "~40%",   label: "of men with infertility have a varicocele (WHO)" },
      { value: "60–70%", label: "of men see improved sperm count after repair" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",   text: "A varicocele is the most common correctable cause of male infertility — surgical repair (varicocelectomy) improves sperm parameters in the majority of cases." },
      { icon: "Microscope", text: "A semen analysis before and 3–6 months after repair measures the improvement — repeat IVF/ICSI is planned if sperm quality remains insufficient." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "VARICOCELE",
      tagline: "The most common correctable cause of male infertility",
      icon: "Activity",
      color: "plum",
      facts: [
        { label: "Prevalence",     value: "~40% of men with infertility (WHO)" },
        { label: "Repair Success", value: "60–70% see improved sperm count" },
        { label: "Repair Type",    value: "Microsurgical varicocelectomy" },
        { label: "Re-check",       value: "Semen analysis at 3–6 months post-repair" },
      ],
      bestSuitedFor: "Men with a palpable varicocele and abnormal semen analysis, particularly those with progressive decline in sperm quality across repeat tests.",
    },
    comparisonTable: {
      rowHeader: "Grade",
      columns: [{ header: "Clinical Finding" }, { header: "Typical Recommendation" }],
      rows: [
        { rowLabel: "Subclinical",  cells: [{ value: "Seen on Doppler ultrasound only" },        { value: "Monitor; treat if sperm decline confirmed" }] },
        { rowLabel: "Grade 1",      cells: [{ value: "Palpable only on Valsalva manoeuvre" },    { value: "Treat if semen analysis is abnormal" }] },
        { rowLabel: "Grade 2",      cells: [{ value: "Palpable at rest, not visible" },           { value: "Microsurgical repair recommended" }] },
        { rowLabel: "Grade 3",      cells: [{ value: "Visible to the eye without examination" }, { value: "Microsurgical repair strongly recommended" }] },
      ],
    },
  },

  /* ── Egg / embryo / sperm donation ───────────────────────────── */
  "egg-donation": {
    stats: [
      { value: "Higher",        label: "IVF success rates with donor eggs vs own eggs (younger donor age)" },
      { value: "ART Act 2021",  label: "Governs donation in India — full anonymity and screening required" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Egg",       text: "Donor egg IVF tends to achieve higher success rates than own-egg IVF because donors are young women with proven good ovarian reserve." },
      { icon: "ShieldCheck", text: "All donors are screened for infectious diseases and genetic conditions under the ART (Regulation) Act 2021 — anonymity is mandatory in India." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "DONOR EGG IVF",
      tagline: "Using eggs from a young, screened donor to achieve higher success rates",
      icon: "Egg",
      color: "rose",
      facts: [
        { label: "Legal Framework", value: "ART (Regulation) Act 2021, India" },
        { label: "Donor Age",       value: "21–35, full health screening" },
        { label: "Anonymity",       value: "Mandatory under Indian law" },
        { label: "Genetic Link",    value: "Father's sperm; mother carries the baby" },
      ],
      bestSuitedFor: "Women with very low ovarian reserve, premature ovarian insufficiency, recurrent IVF failure with own eggs, or genetic conditions that prevent use of own eggs.",
    },
    comparisonTable: {
      rowHeader: "Factor",
      columns: [{ header: "Own Egg IVF" }, { header: "Donor Egg IVF" }],
      rows: [
        { rowLabel: "Success Rate",      cells: [{ value: "Highly age-dependent" },                   { value: "Higher — uses younger donor eggs" }] },
        { rowLabel: "Genetic Link",      cells: [{ value: "Both parents" },                            { value: "Father only (mother carries the baby)" }] },
        { rowLabel: "Key Advantage",     cells: [{ value: "Genetic child of both parents" },           { value: "Better outcomes when ovarian reserve is low" }] },
        { rowLabel: "Donor Screening",   cells: [{ value: "N/A" },                                     { value: "Infectious disease + genetic panel mandatory" }] },
        { rowLabel: "Legal Basis",       cells: [{ value: "Standard ART" },                            { value: "ART (Regulation) Act 2021, India" }] },
        { rowLabel: "Anonymity",         cells: [{ value: "N/A" },                                     { value: "Full anonymity required by law" }] },
      ],
    },
  },

  "sperm-donation": {
    stats: [
      { value: "ART Act 2021", label: "Governs sperm donation in India — anonymous and regulated" },
      { value: "WHO 2021",     label: "Donor semen screened against WHO reference values" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",  text: "Donor sperm is used when the male partner has no viable sperm, carries a genetic condition, or for single women and same-sex female couples." },
      { icon: "ShieldCheck", text: "All sperm donors at BFI are medically screened and genetically tested — anonymity is fully maintained under the ART (Regulation) Act 2021." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "DONOR SPERM",
      tagline: "Regulated anonymous sperm donation — legally governed and fully screened",
      icon: "ShieldCheck",
      color: "plum",
      facts: [
        { label: "Legal Framework",  value: "ART (Regulation) Act 2021" },
        { label: "Donor Screening",  value: "Full medical + genetic testing" },
        { label: "Anonymity",        value: "Mandatory under Indian law" },
        { label: "How Used",         value: "IUI or IVF/ICSI cycle" },
      ],
      bestSuitedFor: "Couples where the male partner has severe azoospermia with no retrievable sperm, carries a heritable genetic condition, or for single women.",
    },
    comparisonTable: {
      rowHeader: "Factor",
      columns: [{ header: "IUI with Donor Sperm" }, { header: "IVF with Donor Sperm" }],
      rows: [
        { rowLabel: "Invasiveness",    cells: [{ value: "Minimal — no anaesthesia needed" },              { value: "Moderate — egg retrieval under sedation" }] },
        { rowLabel: "Success Rate",    cells: [{ value: "10–20% per cycle" },                              { value: "35–45% per cycle (under 35)" }] },
        { rowLabel: "Cost",            cells: [{ value: "Significantly lower" },                           { value: "Higher" }] },
        { rowLabel: "Tubes Required",  cells: [{ value: "Yes — at least one open tube" },                  { value: "No" }] },
        { rowLabel: "Female Factor",   cells: [{ value: "Must ovulate normally" },                         { value: "Can overcome tubal/ovulatory problems" }] },
        { rowLabel: "Recommended If",  cells: [{ value: "Good female fertility, no IUI contraindications" }, { value: "Female factor present or IUI has failed" }] },
      ],
    },
  },

  "embryo-donation": {
    stats: [
      { value: "ART Act 2021", label: "Regulates embryo donation in India" },
      { value: ">95%",         label: "Embryo survival rate after vitrification (modern freezing)" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "HeartPulse", text: "Embryo donation is an option when both egg and sperm quality are insufficient — donor embryos are fully screened and legally regulated under India's ART Act 2021." },
      { icon: "Snowflake",  text: "Modern vitrification means donated embryos survive the freeze-thaw cycle at a rate exceeding 95% — success rates are comparable to fresh transfers." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "EMBRYO DONATION",
      tagline: "A donated embryo — no genetic link to either recipient partner",
      icon: "HeartPulse",
      color: "rose",
      facts: [
        { label: "Legal Framework",  value: "ART (Regulation) Act 2021" },
        { label: "Embryo Survival",  value: ">95% after vitrification" },
        { label: "Genetic Link",     value: "None — fully donated embryo" },
        { label: "Transfer Type",    value: "Frozen embryo transfer (FET)" },
      ],
      bestSuitedFor: "Couples where both egg and sperm quality are insufficient, or where IVF with own eggs and own sperm has repeatedly failed.",
    },
    comparisonTable: {
      rowHeader: "Option",
      columns: [{ header: "Genetic Link" }, { header: "Legal Status (India)" }, { header: "Best For" }],
      rows: [
        { rowLabel: "Own egg + own sperm",    cells: [{ value: "Both parents" },          { value: "Standard ART" },         { value: "Most couples — first approach" }] },
        { rowLabel: "Donor egg + own sperm",  cells: [{ value: "Father only" },            { value: "ART Act 2021" },         { value: "Low ovarian reserve, premature menopause" }] },
        { rowLabel: "Own egg + donor sperm",  cells: [{ value: "Mother only" },            { value: "ART Act 2021" },         { value: "Azoospermia, genetic male factor" }] },
        { rowLabel: "Donor embryo",           cells: [{ value: "Neither partner" },        { value: "ART Act 2021" },         { value: "Both egg + sperm severely compromised" }] },
      ],
    },
  },

  /* ── Surrogacy ────────────────────────────────────────────────── */
  surrogacy: {
    stats: [
      { value: "2021",            label: "Year India's Surrogacy (Regulation) Act was enacted" },
      { value: "Altruistic only", label: "Commercial surrogacy not permitted in India since 2021" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Users",     text: "Gestational surrogacy means the surrogate has no genetic connection to the baby — the embryo is created from the intended parents' own (or donated) eggs and sperm." },
      { icon: "ShieldCheck", text: "India's Surrogacy (Regulation) Act 2021 permits only altruistic surrogacy by a close relative — legal contracts and medical screening are mandatory before any treatment." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "ALTRUISTIC SURROGACY",
      tagline: "Legal in India since 2021 — for close relatives only, altruistic arrangements only",
      icon: "Users",
      color: "gold",
      facts: [
        { label: "Legal Since",  value: "Surrogacy (Regulation) Act 2021" },
        { label: "Type",         value: "Altruistic only — no commercial" },
        { label: "Who Can Act",  value: "Close relative (defined in Act)" },
        { label: "Embryo",       value: "Gestational — surrogate has no genetic link" },
      ],
      bestSuitedFor: "Couples where the woman is unable to carry a pregnancy due to absent or non-functional uterus, recurrent implantation failure, or a serious medical condition.",
    },
    comparisonTable: {
      rowHeader: "Type",
      columns: [{ header: "Egg Source" }, { header: "Genetic Link to Surrogate" }, { header: "Status in India" }],
      rows: [
        { rowLabel: "Gestational Surrogacy",  cells: [{ value: "Intended mother (or donor)" }, { value: "None — surrogate is carrier only" }, { value: "Permitted (altruistic, close relative)" }] },
        { rowLabel: "Traditional Surrogacy",  cells: [{ value: "Surrogate's own eggs" },       { value: "Yes — surrogate is genetic mother" }, { value: "Not permitted in India" }] },
      ],
    },
  },

  /* ── Freezing / cryopreservation ─────────────────────────────── */
  "egg-freezing": {
    stats: [
      { value: ">95%",    label: "Egg survival rate after modern vitrification" },
      { value: "10+ yrs", label: "Eggs can be safely stored using vitrification" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Snowflake",   text: "Egg freezing using vitrification (ultra-rapid freezing) achieves survival rates above 95% — a major advance over older slow-freeze techniques." },
      { icon: "CalendarCheck", text: "Egg quality declines significantly after 35 — freezing eggs before this age preserves your options for the future." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "EGG FREEZING",
      tagline: "Preserve your eggs now — at peak quality — for use whenever you are ready",
      icon: "Snowflake",
      color: "plum",
      facts: [
        { label: "Survival Rate", value: ">95% after vitrification" },
        { label: "Egg Quality",   value: "Peaks before age 35" },
        { label: "Storage",       value: "Up to 10 years (India regulations)" },
        { label: "Process",       value: "Same stimulation + retrieval as IVF" },
      ],
      bestSuitedFor: "Women aged 25–38 who wish to delay pregnancy for personal or professional reasons, or before cancer treatment (oncofertility).",
    },
    comparisonTable: {
      rowHeader: "Method",
      columns: [{ header: "How It Works" }, { header: "Survival Rate" }, { header: "Current Use" }],
      rows: [
        { rowLabel: "Slow Freeze",    cells: [{ value: "Gradual cooling over several hours" },     { value: "~70–80%" }, { value: "Largely superseded" }] },
        { rowLabel: "Vitrification",  cells: [{ value: "Ultra-rapid flash-freeze in seconds" },    { value: ">95%" },    { value: "Gold standard at BFI" }] },
      ],
    },
  },

  "embryo-freezing": {
    stats: [
      { value: ">95%", label: "Embryo survival after vitrification" },
      { value: "FET",  label: "Frozen embryo transfer — outcomes at least equal to fresh in most cases" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Snowflake",  text: "Vitrified embryos survive the thaw at a rate exceeding 95% — frozen embryo transfer (FET) pregnancy rates now match or exceed fresh transfers in most patients." },
      { icon: "HeartPulse", text: "A 'freeze-all' strategy — freezing all good-quality embryos and transferring in a later cycle — can improve implantation rates and reduce OHSS risk." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "EMBRYO FREEZING (FET)",
      tagline: "Extra embryos vitrified and stored — ready for future frozen embryo transfer",
      icon: "Snowflake",
      color: "plum",
      facts: [
        { label: "Embryo Survival", value: ">95% after vitrification" },
        { label: "FET Success",     value: "Comparable to fresh transfer" },
        { label: "Freeze-All",      value: "Strategy that can improve implantation" },
        { label: "OHSS Risk",       value: "Eliminated — transfer in separate cycle" },
      ],
      bestSuitedFor: "Any IVF patient with more good-quality embryos than can be transferred in one cycle, or those at risk of ovarian hyperstimulation syndrome (OHSS).",
    },
    comparisonTable: {
      rowHeader: "Factor",
      columns: [{ header: "Fresh Transfer" }, { header: "Frozen Transfer (FET)" }],
      rows: [
        { rowLabel: "Timing",           cells: [{ value: "Same cycle as retrieval (Day 3 or 5)" },       { value: "Separate cycle — weeks to months later" }] },
        { rowLabel: "Uterine Lining",   cells: [{ value: "May be affected by stimulation drugs" },       { value: "Natural or prepared cycle — less disruption" }] },
        { rowLabel: "OHSS Risk",        cells: [{ value: "Present if high responder" },                  { value: "Eliminated" }] },
        { rowLabel: "Success Rate",     cells: [{ value: "Equivalent for most patients" },               { value: "Equal or better in high responders" }] },
        { rowLabel: "Multiple Chances", cells: [{ value: "One attempt per retrieval cycle" },             { value: "Multiple attempts from one retrieval" }] },
      ],
    },
  },

  cryopreservation: {
    stats: [
      { value: ">95%",    label: "Embryo/egg survival rate after vitrification" },
      { value: "10+ yrs", label: "Safe storage duration using modern cryopreservation" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Snowflake",   text: "Vitrification (ultra-rapid freezing) is now the gold standard for cryopreservation — survival rates exceed 95% for both eggs and embryos." },
      { icon: "CalendarCheck", text: "Cryopreservation is central to fertility preservation before cancer treatment, elective egg freezing, and embryo banking across IVF cycles." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "CRYOPRESERVATION",
      tagline: "Gold-standard vitrification — safely storing eggs, embryos, and sperm for future use",
      icon: "Snowflake",
      color: "plum",
      facts: [
        { label: "Survival Rate",   value: ">95% for eggs and embryos" },
        { label: "Method",          value: "Vitrification (ultra-rapid freeze)" },
        { label: "Storage",         value: "Liquid nitrogen at −196°C" },
        { label: "What Can Be Frozen", value: "Eggs, embryos, sperm, ovarian tissue" },
      ],
      bestSuitedFor: "IVF patients with surplus embryos, women undergoing fertility preservation, or men banking sperm before cancer treatment or vasectomy.",
    },
    comparisonTable: {
      rowHeader: "Material",
      columns: [{ header: "Survival Rate" }, { header: "Common Reason for Freezing" }],
      rows: [
        { rowLabel: "Embryos",          cells: [{ value: ">95%" },                               { value: "Surplus embryos from IVF cycle" }] },
        { rowLabel: "Eggs (unfertilised)", cells: [{ value: ">95%" },                            { value: "Elective egg freezing, oncofertility" }] },
        { rowLabel: "Sperm",            cells: [{ value: "Very high (method-dependent)" },       { value: "Before vasectomy, cancer treatment, low count" }] },
        { rowLabel: "Ovarian tissue",   cells: [{ value: "Emerging — specialist centres only" }, { value: "Before chemotherapy in young women" }] },
      ],
    },
  },

  /* ── Genetic testing ──────────────────────────────────────────── */
  pgt: {
    stats: [
      { value: "50–60%", label: "of early miscarriages caused by chromosomal abnormalities" },
      { value: "~60%",   label: "of embryos are chromosomally abnormal in women over 40" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Dna",        text: "PGT-A screens embryos for the correct number of chromosomes before transfer — selecting a chromosomally normal (euploid) embryo significantly reduces miscarriage risk." },
      { icon: "Microscope", text: "PGD tests for a specific inherited genetic condition — a customised test must be designed for your family's mutation before the IVF cycle begins." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "PGT — EMBRYO SCREENING",
      tagline: "Chromosomal or genetic testing of embryos before transfer — maximising the chance of a healthy pregnancy",
      icon: "Dna",
      color: "gold",
      facts: [
        { label: "PGT-A",           value: "Screens for correct chromosome number" },
        { label: "PGT-M",           value: "Tests for a specific genetic condition" },
        { label: "PGT-SR",          value: "Checks structural chromosome rearrangements" },
        { label: "Miscarriage Risk", value: "Significantly reduced with PGT-A" },
      ],
      bestSuitedFor: "Women over 38, couples with recurrent miscarriage, known chromosomal rearrangements, carriers of single-gene disorders, or after repeated unexplained IVF failure.",
    },
    comparisonTable: {
      rowHeader: "Test",
      columns: [{ header: "What It Checks" }, { header: "Best For" }],
      rows: [
        { rowLabel: "PGT-A",    cells: [{ value: "Total chromosome number (euploid vs aneuploid)" },    { value: "Age-related risk, recurrent miscarriage, repeated IVF failure" }] },
        { rowLabel: "PGT-M",    cells: [{ value: "Single gene mutation (e.g. cystic fibrosis, thalassaemia)" }, { value: "Couples who carry a known heritable condition" }] },
        { rowLabel: "PGT-SR",   cells: [{ value: "Structural chromosome rearrangements" },               { value: "Carriers of balanced chromosomal translocations" }] },
        { rowLabel: "PGT-HLA",  cells: [{ value: "HLA tissue type matching" },                           { value: "Families needing a matched cord blood donor for a sick sibling" }] },
      ],
    },
  },

  /* ── Endometriosis ────────────────────────────────────────────── */
  endometriosis: {
    stats: [
      { value: "1 in 10", label: "Women affected by endometriosis globally" },
      { value: "30–50%",  label: "of women with endometriosis face fertility challenges" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",   text: "Endometriosis affects 1 in 10 women and is a common cause of infertility — but the vast majority of women with endometriosis can achieve pregnancy with appropriate treatment." },
      { icon: "HeartPulse", text: "Surgical treatment of endometriosis (laparoscopy) before IVF may improve outcomes in moderate-to-severe disease — discuss timing with your specialist." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "ENDOMETRIOSIS",
      tagline: "A common but often underdiagnosed cause of painful periods and fertility problems",
      icon: "Activity",
      color: "rose",
      facts: [
        { label: "Prevalence",      value: "1 in 10 women worldwide" },
        { label: "Fertility Impact", value: "30–50% face challenges conceiving" },
        { label: "Diagnosis",       value: "Confirmed by laparoscopy + biopsy" },
        { label: "BFI Approach",    value: "Surgery (if indicated) then IVF" },
      ],
      bestSuitedFor: "Women with painful periods, pain during intercourse, unexplained infertility, or chocolate cysts (endometriomas) visible on ultrasound.",
    },
    comparisonTable: {
      rowHeader: "Stage",
      columns: [{ header: "Extent of Disease" }, { header: "Fertility Impact" }, { header: "Typical Approach" }],
      rows: [
        { rowLabel: "Stage I (Minimal)",  cells: [{ value: "Small lesions, no adhesions" },                     { value: "Mild — may conceive naturally or with IUI" }, { value: "Ovulation induction or IUI first" }] },
        { rowLabel: "Stage II (Mild)",    cells: [{ value: "More lesions, shallow implants" },                  { value: "Moderate" },                                   { value: "IUI or IVF" }] },
        { rowLabel: "Stage III (Moderate)", cells: [{ value: "Deep implants, endometriomas present" },          { value: "Significant" },                                { value: "Surgery then IVF" }] },
        { rowLabel: "Stage IV (Severe)",  cells: [{ value: "Extensive adhesions, large endometriomas" },        { value: "Severe" },                                     { value: "Surgical + IVF — specialist centre" }] },
      ],
    },
  },

  /* ── Fibroids ─────────────────────────────────────────────────── */
  fibroids: {
    stats: [
      { value: "1 in 3",      label: "Women develop fibroids during their lifetime" },
      { value: "Type matters", label: "Submucosal fibroids most likely to affect implantation" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",   text: "Not all fibroids affect fertility — submucosal fibroids (inside the uterine cavity) are most likely to reduce implantation rates and should be removed before IVF." },
      { icon: "Microscope", text: "A saline infusion sonohysterography (SIS) or hysteroscopy gives the clearest picture of whether a fibroid is affecting the uterine cavity." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "UTERINE FIBROIDS",
      tagline: "Benign muscle growths in or around the uterus — only some types affect fertility",
      icon: "Activity",
      color: "plum",
      facts: [
        { label: "Prevalence",      value: "1 in 3 women develop fibroids" },
        { label: "Most Problematic", value: "Submucosal — inside uterine cavity" },
        { label: "Diagnosis",       value: "Ultrasound ± saline sonohysterography" },
        { label: "Treatment",       value: "Hysteroscopic or laparoscopic myomectomy" },
      ],
      bestSuitedFor: "Women diagnosed with fibroids who are trying to conceive, particularly those with submucosal fibroids inside the uterine cavity or multiple large intramural fibroids.",
    },
    comparisonTable: {
      rowHeader: "Type",
      columns: [{ header: "Location" }, { header: "Fertility Impact" }, { header: "Treatment" }],
      rows: [
        { rowLabel: "Submucosal",   cells: [{ value: "Inside uterine cavity" },         { value: "High — distorts implantation surface" }, { value: "Hysteroscopic removal before IVF" }] },
        { rowLabel: "Intramural",   cells: [{ value: "Within uterine muscle wall" },     { value: "Moderate if >4 cm" },                    { value: "Laparoscopic myomectomy" }] },
        { rowLabel: "Subserosal",   cells: [{ value: "Outside uterine wall" },           { value: "Usually minimal" },                      { value: "Generally no removal needed before IVF" }] },
        { rowLabel: "Pedunculated", cells: [{ value: "Attached by stalk, outside uterus" }, { value: "Minimal" },                          { value: "Removal only if causing symptoms" }] },
      ],
    },
  },

  /* ── Recurrent miscarriage ────────────────────────────────────── */
  "recurrent-miscarriage": {
    stats: [
      { value: "~1%",    label: "of couples affected by recurrent pregnancy loss (RCOG)" },
      { value: "50–60%", label: "of early miscarriages caused by chromosomal errors in the embryo" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "HeartPulse", text: "Recurrent pregnancy loss (two or more miscarriages) affects around 1% of couples — a thorough investigation identifies a treatable cause in the majority of cases." },
      { icon: "Dna",        text: "PGT-A (chromosomal screening of embryos before transfer) significantly reduces miscarriage rates in couples with unexplained recurrent loss." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "RECURRENT MISCARRIAGE",
      tagline: "Two or more consecutive losses — investigation finds a treatable cause in most cases",
      icon: "HeartPulse",
      color: "rose",
      facts: [
        { label: "Definition",        value: "2 or more miscarriages (RCOG)" },
        { label: "Prevalence",        value: "~1% of couples trying to conceive" },
        { label: "Chromosomal Cause", value: "50–60% of early pregnancy losses" },
        { label: "Solution",          value: "PGT-A reduces recurrence significantly" },
      ],
      bestSuitedFor: "Couples who have experienced two or more pregnancy losses, including those with unexplained recurrent loss, age-related aneuploidy, antiphospholipid syndrome, or uterine abnormalities.",
    },
    comparisonTable: {
      rowHeader: "Cause",
      columns: [{ header: "How Diagnosed" }, { header: "Treatment" }],
      rows: [
        { rowLabel: "Chromosomal (embryo)",      cells: [{ value: "PGT-A screens future embryos" },         { value: "PGT-A in IVF cycle" }] },
        { rowLabel: "Antiphospholipid Syndrome", cells: [{ value: "Blood test (aPL antibodies)" },           { value: "Aspirin + heparin in pregnancy" }] },
        { rowLabel: "Uterine abnormality",       cells: [{ value: "Hysteroscopy or 3D ultrasound" },         { value: "Hysteroscopic correction" }] },
        { rowLabel: "Thrombophilia",             cells: [{ value: "Blood clotting screen" },                  { value: "Anticoagulation in pregnancy" }] },
        { rowLabel: "Parental chromosome anomaly", cells: [{ value: "Karyotype blood test (both partners)" }, { value: "PGT-SR in IVF cycle" }] },
      ],
    },
  },

  /* ── IVF failure ──────────────────────────────────────────────── */
  "ivf-failure": {
    stats: [
      { value: "Cumulative", label: "Success rates across 2–3 cycles are significantly higher than per-cycle rates" },
      BFI_CENTRES,
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Award",      text: "A failed IVF cycle is not the end — a detailed review of the cycle (fertilisation, embryo quality, endometrial response) guides the next, improved protocol." },
      { icon: "Dna",        text: "PGT-A (chromosomal embryo screening) should be discussed after unexplained repeated failures — an abnormal embryo that looks good morphologically is a common hidden cause." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "AFTER FAILED IVF",
      tagline: "A failed cycle is the start of a refined plan — not the end of the journey",
      icon: "Award",
      color: "gold",
      facts: [
        { label: "Cumulative Rates", value: "2–3 cycles = significantly higher success" },
        { label: "Key Review",       value: "Fertilisation, embryo quality, endometrium" },
        { label: "Common Hidden Cause", value: "Chromosomally abnormal embryo" },
        { label: "Next Step",        value: "PGT-A screens embryos before next transfer" },
      ],
      bestSuitedFor: "Couples who have had one or more IVF cycles without achieving a live birth, particularly those with unexplained failure despite good embryo quality.",
    },
    comparisonTable: {
      rowHeader: "Reason for Failure",
      columns: [{ header: "How Identified" }, { header: "Adjustment for Next Cycle" }],
      rows: [
        { rowLabel: "Poor ovarian response",    cells: [{ value: "Low egg number at retrieval" },                 { value: "Protocol change — higher or different stimulation" }] },
        { rowLabel: "Poor fertilisation",       cells: [{ value: "Fertilisation rate below 50%" },                { value: "Switch to ICSI or ICSI + IMSI" }] },
        { rowLabel: "Poor embryo quality",      cells: [{ value: "Embryo grading + development speed" },          { value: "IMSI, MACS, time-lapse culture" }] },
        { rowLabel: "Failed implantation",      cells: [{ value: "Good embryo, negative test" },                  { value: "ERA test, uterine check, immune protocol" }] },
        { rowLabel: "Chromosomal embryo",       cells: [{ value: "Unexplained — embryo looked normal" },          { value: "PGT-A in next cycle" }] },
      ],
    },
  },

  /* ── IUI ──────────────────────────────────────────────────────── */
  "intra-uterine-insemination-iui": {
    stats: [
      { value: "10–20%",        label: "Pregnancy rate per IUI cycle (age and diagnosis dependent)" },
      { value: "Less invasive", label: "IUI is a first-line fertility treatment before IVF for many couples" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity", text: "IUI places washed, concentrated sperm directly into the uterus at the time of ovulation — it is simpler, cheaper, and less invasive than IVF." },
      { icon: "Target",   text: "IUI is most effective when sperm quality is mildly reduced, tubes are open, and the woman ovulates normally — typically recommended for up to 3–6 cycles before considering IVF." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "IUI AT A GLANCE",
      tagline: "A gentle first-line fertility treatment — before considering IVF",
      icon: "Activity",
      color: "rose",
      facts: [
        { label: "Success Rate",    value: "10–20% per cycle (age + diagnosis)" },
        { label: "Procedure Time",  value: "5–10 minutes" },
        { label: "Anaesthesia",     value: "Not required" },
        { label: "Before IVF",      value: "3–6 cycles typically recommended" },
      ],
      bestSuitedFor: "Couples with mild male factor infertility, unexplained infertility, or cervical mucus problems — provided the woman has at least one open fallopian tube.",
    },
    comparisonTable: {
      rowHeader: "Factor",
      columns: [{ header: "IUI" }, { header: "IVF" }],
      rows: [
        { rowLabel: "Invasiveness",    cells: [{ value: "Minimal — no anaesthesia" },                  { value: "Moderate — egg retrieval under sedation" }] },
        { rowLabel: "Success Rate",    cells: [{ value: "10–20% per cycle" },                          { value: "35–45% per cycle (under 35)" }] },
        { rowLabel: "Cost",            cells: [{ value: "Significantly lower" },                       { value: "Higher" }] },
        { rowLabel: "Tubes Required",  cells: [{ value: "Yes — at least one open" },                   { value: "No" }] },
        { rowLabel: "Male Factor",     cells: [{ value: "Mild only" },                                 { value: "Severe (with ICSI)" }] },
        { rowLabel: "Typical Cycles",  cells: [{ value: "3–6 before moving to IVF" },                 { value: "1–3 standard recommendation" }] },
      ],
    },
  },

  /* ── Ovarian reserve ──────────────────────────────────────────── */
  "ovarian-reserve": {
    stats: [
      { value: "AMH", label: "Anti-Müllerian hormone — the primary blood test for ovarian reserve" },
      { value: "AFC", label: "Antral follicle count — measured by ultrasound, used alongside AMH" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Microscope", text: "Ovarian reserve is assessed with two main tests: AMH blood test and antral follicle count (AFC) on ultrasound — both are needed for the full picture." },
      { icon: "Activity",   text: "Low ovarian reserve does not mean conception is impossible — the quality of remaining eggs and the IVF protocol used both play important roles in outcomes." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "OVARIAN RESERVE",
      tagline: "How many eggs you have remaining — the key predictor of IVF response",
      icon: "Microscope",
      color: "gold",
      facts: [
        { label: "Primary Test",     value: "AMH blood test" },
        { label: "Ultrasound Test",  value: "Antral follicle count (AFC)" },
        { label: "Best Time to Test", value: "Any time — AMH is cycle-independent" },
        { label: "Low Does Not Mean", value: "Conception impossible — quality matters too" },
      ],
      bestSuitedFor: "Any woman considering IVF, fertility preservation, or who has concerns about fertility after 35 or a family history of early menopause.",
    },
    comparisonTable: {
      rowHeader: "AMH Level",
      columns: [{ header: "Approximate pmol/L" }, { header: "What It Suggests" }],
      rows: [
        { rowLabel: "High",       cells: [{ value: ">30 pmol/L" },    { value: "Possibly PCOS — OHSS precautions needed in IVF" }] },
        { rowLabel: "Normal",     cells: [{ value: "15–30 pmol/L" },  { value: "Good ovarian reserve — standard IVF protocol" }] },
        { rowLabel: "Low Normal", cells: [{ value: "7–14 pmol/L" },   { value: "Slightly reduced — IVF still effective" }] },
        { rowLabel: "Low",        cells: [{ value: "2–6.9 pmol/L" },  { value: "Diminished reserve — mild stimulation protocol" }] },
        { rowLabel: "Very Low",   cells: [{ value: "<2 pmol/L" },     { value: "Severely reduced — donor eggs may be discussed" }] },
      ],
    },
  },

  /* ── Surgical sperm retrieval ─────────────────────────────────── */
  "surgical-sperm-retrieval": {
    stats: [
      { value: "TESA/PESA/TESE", label: "Three techniques for retrieving sperm from the testis or epididymis" },
      { value: "50–60%",         label: "of azoospermia is obstructive — sperm retrieval is highly successful" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",   text: "Surgical sperm retrieval (TESA, PESA, micro-TESE) allows men with azoospermia to father biological children — retrieved sperm is used with ICSI to fertilise eggs." },
      { icon: "Microscope", text: "The choice of retrieval technique depends on whether azoospermia is obstructive or non-obstructive — a urology assessment before the IVF cycle determines the best approach." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "SURGICAL SPERM RETRIEVAL",
      tagline: "Retrieving sperm directly from the testis or epididymis for use with ICSI",
      icon: "Syringe",
      color: "plum",
      facts: [
        { label: "Used For",             value: "Azoospermia — no sperm in ejaculate" },
        { label: "Obstructive Success",  value: "Very high sperm retrieval rate" },
        { label: "Non-obstructive",      value: "Micro-TESE: 40–60% retrieval rate" },
        { label: "Used With",            value: "ICSI — one retrieved sperm per egg" },
      ],
      bestSuitedFor: "Men with confirmed azoospermia on two separate semen analyses, after vasectomy reversal failure, or with non-obstructive azoospermia where micro-TESE is the last option.",
    },
    comparisonTable: {
      rowHeader: "Procedure",
      columns: [{ header: "Source" }, { header: "Anaesthesia" }, { header: "Best For" }],
      rows: [
        { rowLabel: "PESA",       cells: [{ value: "Epididymis" }, { value: "Local" },            { value: "Obstructive azoospermia (e.g. post-vasectomy)" }] },
        { rowLabel: "TESA",       cells: [{ value: "Testis (needle)" }, { value: "Local" },       { value: "Obstructive — quick outpatient procedure" }] },
        { rowLabel: "TESE",       cells: [{ value: "Testis (open biopsy)" }, { value: "Local/sedation" }, { value: "Obstructive or mild non-obstructive" }] },
        { rowLabel: "Micro-TESE", cells: [{ value: "Targeted testis tissue under microscope" }, { value: "General" }, { value: "Non-obstructive azoospermia — highest success" }] },
      ],
    },
  },

  /* ── Advanced lab techniques ──────────────────────────────────── */
  "laser-assisted-hatching": {
    stats: [
      { value: "Day 5–6",  label: "Blastocyst stage — when laser-assisted hatching is performed" },
      { value: "Selected", label: "Used for specific indications — not routine for all IVF cycles" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Target",     text: "Laser-assisted hatching creates a small opening in the embryo's outer shell (zona pellucida) to support implantation — most beneficial for frozen embryos and patients with repeated implantation failure." },
      { icon: "Microscope", text: "Hatching is not recommended routinely — your embryologist will advise whether it is likely to benefit your specific embryos." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "LASER HATCHING",
      tagline: "Creating a small opening in the embryo's outer shell to support implantation",
      icon: "Target",
      color: "gold",
      facts: [
        { label: "Timing",     value: "Day 5–6 (blastocyst stage)" },
        { label: "Target",     value: "Zona pellucida — the embryo's outer shell" },
        { label: "Indication", value: "Thick zona, frozen embryos, repeated failure" },
        { label: "Routine?",   value: "No — used for selected indications only" },
      ],
      bestSuitedFor: "Patients with previously failed IVF cycles despite good embryo quality, frozen embryo transfers where the zona may harden, or embryos with an unusually thick zona pellucida.",
    },
    comparisonTable: {
      rowHeader: "Scenario",
      columns: [{ header: "Likely Benefit" }, { header: "Notes" }],
      rows: [
        { rowLabel: "Frozen embryo transfer",               cells: [{ value: "Moderate" },          { value: "Zona can thicken during the freeze-thaw process" }] },
        { rowLabel: "Repeated implantation failure",        cells: [{ value: "Moderate" },          { value: "Rule out uterine factors first (ERA, hysteroscopy)" }] },
        { rowLabel: "Thick zona pellucida on assessment",   cells: [{ value: "Possible" },          { value: "Embryologist recommends based on measurement" }] },
        { rowLabel: "Routine first IVF cycle",              cells: [{ value: "Not established" },   { value: "Not currently recommended routinely" }] },
        { rowLabel: "Advanced age / poor prognosis",        cells: [{ value: "Limited evidence" },  { value: "PGT-A often more useful in this group" }] },
      ],
    },
  },

  "era-test": {
    stats: [
      { value: "WOI",    label: "Window of Implantation — the ERA test identifies your personalised optimal transfer day" },
      { value: "~1 in 4", label: "Women undergoing IVF have a displaced implantation window (published data)" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Target",        text: "The ERA (Endometrial Receptivity Analysis) test identifies each patient's unique window of implantation — useful after repeated failed transfers with good-quality embryos." },
      { icon: "CalendarCheck", text: "ERA results are used to personalise the embryo transfer timing in subsequent FET cycles — standard protocols assume a 'typical' implantation window that not all patients have." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "ERA TEST",
      tagline: "A personalised test to identify your unique window of implantation",
      icon: "CalendarCheck",
      color: "gold",
      facts: [
        { label: "Who Needs It",  value: "~1 in 4 have a displaced implantation window" },
        { label: "Sample",        value: "Small endometrial biopsy (mock FET cycle)" },
        { label: "Result",        value: "Personalised transfer day recommendation" },
        { label: "Use",           value: "Guides timing of next FET cycle" },
      ],
      bestSuitedFor: "Women with repeated failed embryo transfers despite good-quality embryos and a normal-looking uterus — where standard transfer timing may be missing the window.",
    },
    comparisonTable: {
      rowHeader: "Factor",
      columns: [{ header: "Standard FET" }, { header: "ERA-Guided FET" }],
      rows: [
        { rowLabel: "Transfer Timing",    cells: [{ value: "Fixed protocol (e.g. 5 days progesterone)" }, { value: "Personalised to your endometrial receptivity" }] },
        { rowLabel: "Extra Procedure",    cells: [{ value: "None" },                                       { value: "Endometrial biopsy in a mock cycle" }] },
        { rowLabel: "Additional Cost",    cells: [{ value: "Lower — no test required" },                   { value: "ERA biopsy + laboratory analysis" }] },
        { rowLabel: "Best For",           cells: [{ value: "First 1–2 FET attempts" },                     { value: "After 2+ unexplained failed transfers" }] },
        { rowLabel: "Result",             cells: [{ value: "Standard for all patients" },                   { value: "Specific to your cycle — truly personalised" }] },
      ],
    },
  },

  "intracytoplasmic-morphologically-selected-sperm-injection-imsi": {
    stats: [
      { value: "6,600×",   label: "Magnification used in IMSI vs 400× in standard ICSI" },
      { value: "High-mag", label: "Selects morphologically superior sperm for injection" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Microscope", text: "IMSI uses ultra-high magnification (6,600×) to identify and select the most structurally normal sperm before injection — standard ICSI uses ~400× magnification." },
      { icon: "Target",     text: "IMSI is recommended when standard ICSI has resulted in poor fertilisation, poor embryo quality, or recurrent failure — not needed in routine ICSI cycles." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "IMSI",
      tagline: "Ultra-high magnification sperm selection — 16× more detailed than standard ICSI",
      icon: "Microscope",
      color: "gold",
      facts: [
        { label: "Magnification",  value: "6,600× vs 400× (standard ICSI)" },
        { label: "Purpose",        value: "Select structurally superior sperm" },
        { label: "DNA Quality",    value: "Better selection reduces fragmentation risk" },
        { label: "Used When",      value: "Poor embryo quality, prior ICSI failure" },
      ],
      bestSuitedFor: "Couples with high sperm DNA fragmentation, repeated poor embryo quality despite normal semen parameters, or two or more prior ICSI failures.",
    },
    comparisonTable: {
      rowHeader: "Feature",
      columns: [{ header: "Standard ICSI" }, { header: "IMSI" }],
      rows: [
        { rowLabel: "Magnification",        cells: [{ value: "~400×" },                                      { value: "~6,600×" }] },
        { rowLabel: "Sperm Selection",      cells: [{ value: "Morphology at standard magnification" },       { value: "Ultra-fine morphology + internal structure" }] },
        { rowLabel: "DNA Fragmentation",    cells: [{ value: "Indirect assessment only" },                   { value: "Better indirect indicator of DNA quality" }] },
        { rowLabel: "Time Required",        cells: [{ value: "Faster" },                                      { value: "Longer — more detailed selection process" }] },
        { rowLabel: "Recommended For",      cells: [{ value: "Most ICSI cases" },                             { value: "High DNA fragmentation, repeated failure" }] },
      ],
    },
  },

  "physiological-intracytoplasmic-sperm-injection-picsi": {
    stats: [
      { value: "Hyaluronan",  label: "PICSI selects sperm via hyaluronan-binding — a marker of maturity" },
      { value: "Mature only", label: "Hyaluronan-binding sperm have lower DNA fragmentation rates" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Microscope", text: "PICSI selects sperm by their ability to bind hyaluronan — a naturally occurring substance. Sperm that bind are more mature and carry less DNA damage." },
      { icon: "Target",     text: "PICSI is most useful when sperm DNA fragmentation is high or when previous ICSI cycles produced poor embryo quality despite good-looking sperm." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "PICSI",
      tagline: "Hyaluronan-binding sperm selection — mimicking natural sperm selection in the body",
      icon: "Microscope",
      color: "gold",
      facts: [
        { label: "Binding Agent", value: "Hyaluronan — found in egg's outer layer" },
        { label: "What It Selects", value: "Mature sperm with lower DNA damage" },
        { label: "Indication",    value: "High DNA fragmentation, recurrent failure" },
        { label: "Used With",     value: "ICSI — selected sperm injected per egg" },
      ],
      bestSuitedFor: "Couples where sperm DNA fragmentation is elevated, previous ICSI cycles produced poor embryo quality, or where there has been repeated early pregnancy loss.",
    },
    comparisonTable: {
      rowHeader: "Feature",
      columns: [{ header: "Standard ICSI" }, { header: "PICSI" }],
      rows: [
        { rowLabel: "Selection Method",  cells: [{ value: "Visual morphology assessment" },             { value: "Hyaluronan-binding (functional test)" }] },
        { rowLabel: "DNA Quality",       cells: [{ value: "Indirectly assessed by appearance" },        { value: "Better — hyaluronan-binding correlates with lower DNA damage" }] },
        { rowLabel: "Sperm Maturity",    cells: [{ value: "Assessed visually" },                        { value: "Confirmed biochemically by binding" }] },
        { rowLabel: "Best For",          cells: [{ value: "Routine ICSI" },                              { value: "High DNA fragmentation, recurrent failure" }] },
        { rowLabel: "Equipment",         cells: [{ value: "Standard ICSI dish" },                       { value: "PICSI dish (hyaluronan coating)" }] },
      ],
    },
  },

  "magnetic-activated-cell-sorting-macs": {
    stats: [
      { value: "MACS",      label: "Removes apoptotic (programmed-death) sperm before ICSI" },
      { value: "DNA frag.", label: "High DNA fragmentation linked to poor embryo development and miscarriage" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Microscope", text: "MACS (Magnetic-Activated Cell Sorting) removes sperm undergoing programmed cell death (apoptosis) before ICSI — the result is a purer, healthier sperm population." },
      { icon: "Target",     text: "MACS is most beneficial when sperm DNA fragmentation is significantly elevated or when previous cycles have produced poor embryo quality." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "MACS",
      tagline: "Magnetic cell sorting — removing damaged sperm from the sample before ICSI",
      icon: "Magnet",
      color: "gold",
      facts: [
        { label: "Removes",  value: "Apoptotic (programmed-death) sperm" },
        { label: "Method",   value: "Magnetic beads bind ANXA5 surface marker" },
        { label: "Result",   value: "Cleaner, healthier sperm population" },
        { label: "Best For", value: "High DNA fragmentation, recurrent failure" },
      ],
      bestSuitedFor: "Couples with significantly elevated sperm DNA fragmentation, repeated poor embryo development, or recurrent implantation failure despite good-quality-looking sperm.",
    },
    comparisonTable: {
      rowHeader: "Method",
      columns: [{ header: "Selects / Removes" }, { header: "Best When" }],
      rows: [
        { rowLabel: "Standard wash",  cells: [{ value: "Concentrates motile sperm" },                    { value: "Routine IVF/ICSI" }] },
        { rowLabel: "PICSI",          cells: [{ value: "Hyaluronan-binding mature sperm" },               { value: "Elevated DNA fragmentation" }] },
        { rowLabel: "MACS",           cells: [{ value: "Removes apoptotic (dying) sperm" },               { value: "High DNA fragmentation, recurrent failure" }] },
        { rowLabel: "IMSI",           cells: [{ value: "Ultra-fine morphology selection" },               { value: "Poor embryo quality despite normal semen" }] },
      ],
    },
  },

  "blastocyst-culture-blastocyst-transfer": {
    stats: [
      { value: "Day 5–6",  label: "When a blastocyst develops — only the strongest embryos reach this stage" },
      { value: "Higher",   label: "Implantation rates with blastocyst vs Day 3 (cleavage-stage) transfer" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Award",      text: "Culturing embryos to the blastocyst stage (Day 5–6) allows better embryo selection — only embryos with sufficient developmental potential reach this stage." },
      { icon: "HeartPulse", text: "Blastocyst transfer is associated with higher implantation rates per transfer and is the default approach for most patients at BFI." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "BLASTOCYST TRANSFER",
      tagline: "Day 5–6 embryo — selecting only the strongest for maximum implantation potential",
      icon: "Award",
      color: "rose",
      facts: [
        { label: "Stage",            value: "Day 5–6 (blastocyst = ~200 cells)" },
        { label: "Selection Benefit", value: "Only strongest embryos reach Day 5" },
        { label: "Implantation",     value: "Higher per transfer vs Day 3" },
        { label: "BFI Default",      value: "Blastocyst transfer for most patients" },
      ],
      bestSuitedFor: "Most IVF patients where multiple embryos have fertilised and developed well — extended culture allows natural selection of the strongest embryos.",
    },
    comparisonTable: {
      rowHeader: "Factor",
      columns: [{ header: "Day 3 Cleavage Transfer" }, { header: "Day 5 Blastocyst Transfer" }],
      rows: [
        { rowLabel: "Embryo Stage",        cells: [{ value: "8-cell embryo" },                          { value: "~200-cell expanded blastocyst" }] },
        { rowLabel: "Selection Basis",     cells: [{ value: "Morphology only" },                        { value: "Morphology + developmental competence" }] },
        { rowLabel: "Implantation Rate",   cells: [{ value: "Lower per embryo" },                       { value: "Higher per embryo" }] },
        { rowLabel: "PGT Compatible",      cells: [{ value: "Yes" },                                    { value: "Yes — preferred stage for biopsy" }] },
        { rowLabel: "Risk",               cells: [{ value: "Less selection occurs in the lab" },        { value: "Rarely, no embryo reaches blastocyst" }] },
        { rowLabel: "BFI Default",         cells: [{ value: "Used when fewer embryos available" },      { value: "Yes — default for most patients" }] },
      ],
    },
  },

  /* ── PRP ──────────────────────────────────────────────────────── */
  "prp-infertility": {
    stats: [
      { value: "PRP",       label: "Platelet-Rich Plasma — derived from the patient's own blood" },
      { value: "Emerging",  label: "Evidence base is growing; used for poor responders and thin endometrium" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "HeartPulse", text: "PRP (Platelet-Rich Plasma) therapy is an emerging adjunct in IVF — applied to the ovaries or uterine lining to stimulate tissue repair and improve response." },
      { icon: "Microscope", text: "PRP is most commonly used for poor ovarian response and thin endometrium — it is prepared from the patient's own blood, so there is no risk of rejection." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "PRP THERAPY",
      tagline: "Platelet-Rich Plasma — an emerging autologous therapy for poor responders",
      icon: "HeartPulse",
      color: "gold",
      facts: [
        { label: "Source",       value: "Patient's own blood — no rejection risk" },
        { label: "Applications", value: "Ovaries (poor reserve), thin endometrium" },
        { label: "Evidence",     value: "Growing — promising in selected patients" },
        { label: "Status",       value: "Adjunct therapy, not first-line standard" },
      ],
      bestSuitedFor: "Women with poor ovarian response to IVF stimulation, very low AMH, or thin endometrium unresponsive to standard preparation — as an adjunct alongside IVF.",
    },
    comparisonTable: {
      rowHeader: "Application",
      columns: [{ header: "How Administered" }, { header: "Goal" }, { header: "Evidence Level" }],
      rows: [
        { rowLabel: "Ovarian PRP",         cells: [{ value: "Injection into ovarian tissue" },           { value: "Stimulate follicle activity in low-reserve ovaries" }, { value: "Emerging — promising case series" }] },
        { rowLabel: "Uterine PRP (thin endometrium)", cells: [{ value: "Infused via catheter into uterine cavity" }, { value: "Thicken endometrium, improve receptivity" }, { value: "Small RCTs — positive results" }] },
        { rowLabel: "Pre-transfer PRP",    cells: [{ value: "Infused before embryo transfer" },          { value: "Improve implantation environment" },                  { value: "Moderate — used as adjunct" }] },
      ],
    },
  },

  "ovarian-rejuvenation": {
    stats: [
      { value: "Emerging", label: "Ovarian PRP is an experimental approach for diminished ovarian reserve" },
      { value: "AMH & AFC", label: "Measured before and after to assess treatment response" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "HeartPulse", text: "Ovarian rejuvenation (ovarian PRP) aims to stimulate follicle activity in women with very low ovarian reserve — it is experimental and not suitable for all patients." },
      { icon: "Microscope", text: "Response is monitored with serial AMH and antral follicle count measurements — your specialist will advise whether a response has occurred before planning an IVF cycle." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "OVARIAN REJUVENATION",
      tagline: "PRP applied to the ovaries — an experimental approach for severely reduced ovarian reserve",
      icon: "HeartPulse",
      color: "gold",
      facts: [
        { label: "Method",     value: "Platelet-Rich Plasma from own blood" },
        { label: "Target",     value: "Ovaries with very low AMH or AFC" },
        { label: "Monitoring", value: "Serial AMH + AFC measurements" },
        { label: "Status",     value: "Experimental — not suitable for all" },
      ],
      bestSuitedFor: "Women with very low ovarian reserve who have been told donor eggs are their only option — as an experimental last attempt to stimulate residual follicle activity.",
    },
    comparisonTable: {
      rowHeader: "Approach",
      columns: [{ header: "Mechanism" }, { header: "Best For" }],
      rows: [
        { rowLabel: "Standard stimulation",   cells: [{ value: "Hormone injections to collect remaining eggs" },      { value: "Mild poor response (AMH 2–7 pmol/L)" }] },
        { rowLabel: "Mild/natural IVF",       cells: [{ value: "Minimal stimulation, collect 1–3 eggs" },             { value: "Very low reserve — reduce drug exposure" }] },
        { rowLabel: "Ovarian PRP",            cells: [{ value: "Growth factors stimulate dormant follicles" },        { value: "Very low AMH, failed standard stimulation" }] },
        { rowLabel: "Donor Egg IVF",          cells: [{ value: "Eggs from young screened donor" },                    { value: "When own eggs are exhausted or unresponsive" }] },
      ],
    },
  },

  /* ── Natural conception ───────────────────────────────────────── */
  "conceive-naturally": {
    stats: [
      { value: "85%",       label: "of couples conceive naturally within 12 months of trying" },
      { value: "12 months", label: "When to see a fertility specialist (6 months if over 35)" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "HeartPulse", text: "85% of couples conceive naturally within 12 months — if you haven't after this time (or 6 months if you are 35 or older), a fertility assessment is the recommended next step." },
      { icon: "Leaf",       text: "Optimising general health — maintaining a healthy weight, stopping smoking, moderating alcohol, and taking folic acid — improves natural conception chances." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "WHEN TO SEEK HELP",
      tagline: "85% of couples conceive naturally within 12 months — here is when to see a specialist",
      icon: "HeartPulse",
      color: "rose",
      facts: [
        { label: "Under 35",    value: "See specialist after 12 months of trying" },
        { label: "35–39",       value: "See specialist after 6 months" },
        { label: "40 or older", value: "Seek early assessment — do not wait" },
        { label: "Any Age",     value: "Earlier if known fertility concerns" },
      ],
      bestSuitedFor: "Couples trying to conceive naturally, including those optimising their lifestyle, timing intercourse correctly, or wondering when to seek a fertility assessment.",
    },
    comparisonTable: {
      rowHeader: "Situation",
      columns: [{ header: "Recommended Action" }, { header: "Why" }],
      rows: [
        { rowLabel: "Under 35, trying 12+ months",          cells: [{ value: "Fertility assessment" },       { value: "85% conceive by month 12 — investigate if not" }] },
        { rowLabel: "35–39, trying 6+ months",              cells: [{ value: "Fertility assessment" },       { value: "Ovarian reserve declines with age" }] },
        { rowLabel: "40 or older",                          cells: [{ value: "Immediate assessment" },       { value: "Do not wait — ovarian reserve falls sharply" }] },
        { rowLabel: "Irregular periods / PCOS",             cells: [{ value: "See specialist early" },       { value: "Ovulation problems need investigation" }] },
        { rowLabel: "Known male factor or structural issue", cells: [{ value: "See specialist immediately" }, { value: "No benefit in waiting" }] },
      ],
    },
  },

  /* ── Spindle View ICSI ────────────────────────────────────────── */
  "spindle-view-icsi": {
    stats: [
      { value: "Polarisation", label: "Spindle View uses polarised light to locate the meiotic spindle in the egg" },
      { value: "Non-invasive", label: "Avoids injecting into the spindle — reduces potential egg damage" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Microscope", text: "Spindle View ICSI uses polarised light microscopy to locate the meiotic spindle inside the egg before injection — avoiding the spindle reduces the risk of egg damage." },
      { icon: "Target",     text: "This technique is particularly beneficial for older patients and for eggs that are known to be more fragile — discuss it with your embryologist before your cycle." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "SPINDLE VIEW ICSI",
      tagline: "Polarised-light imaging to avoid damaging the egg during ICSI injection",
      icon: "Microscope",
      color: "gold",
      facts: [
        { label: "Technology",  value: "Polarised light (birefringence imaging)" },
        { label: "Purpose",     value: "Locate meiotic spindle before injection" },
        { label: "Benefit",     value: "Avoids spindle damage — less egg degeneration" },
        { label: "Best For",    value: "Older patients, fragile or precious eggs" },
      ],
      bestSuitedFor: "Women over 38, patients with previously poor egg survival after ICSI, or where egg number is very low and avoiding damage to each egg is critical.",
    },
    comparisonTable: {
      rowHeader: "Feature",
      columns: [{ header: "Standard ICSI" }, { header: "Spindle View ICSI" }],
      rows: [
        { rowLabel: "Spindle Location",       cells: [{ value: "Assumed — not confirmed" },                     { value: "Confirmed with polarised light" }] },
        { rowLabel: "Injection Risk",         cells: [{ value: "Spindle may occasionally be struck" },         { value: "Injection directed away from spindle" }] },
        { rowLabel: "Egg Degeneration Rate",  cells: [{ value: "Standard rate" },                               { value: "Potentially lower — especially in older patients" }] },
        { rowLabel: "Technology Required",    cells: [{ value: "Micromanipulator" },                            { value: "Micromanipulator + polarised light microscope" }] },
        { rowLabel: "Routine Use",            cells: [{ value: "Yes" },                                         { value: "Selected patients (older, precious eggs)" }] },
      ],
    },
  },

  /* ── IVF evaluation (pre-IVF workup) ─────────────────────────── */
  "ivf-evaluation": {
    stats: [
      { value: "AMH + AFC", label: "Two essential ovarian reserve tests before any IVF cycle" },
      { value: "WHO 2021",  label: "Updated semen analysis reference values used at BFI" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Microscope",    text: "A full IVF evaluation includes AMH, antral follicle count, semen analysis, uterine assessment, and infectious disease screening — these results guide the entire treatment plan." },
      { icon: "ClipboardList", text: "Bring any previous investigation results (blood tests, scans, semen analysis) to your first consultation to avoid repeat testing and save time." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
    highlightCard: {
      badge: "PRE-IVF WORKUP",
      tagline: "The full diagnostic assessment every couple needs before starting IVF",
      icon: "ClipboardList",
      color: "plum",
      facts: [
        { label: "Female Tests",   value: "AMH, AFC, uterine assessment, hormones" },
        { label: "Male Tests",     value: "Semen analysis (WHO 2021 criteria)" },
        { label: "Both Partners",  value: "Infectious disease screening mandatory" },
        { label: "Genetic Screen", value: "Carrier screen offered to all couples" },
      ],
      bestSuitedFor: "Every couple before starting an IVF cycle — this workup personalises the protocol, identifies correctable problems, and sets realistic expectations.",
    },
    comparisonTable: {
      rowHeader: "Test",
      columns: [{ header: "What It Measures" }, { header: "Why It Matters for IVF" }],
      rows: [
        { rowLabel: "AMH (blood)",                  cells: [{ value: "Ovarian reserve" },                            { value: "Sets stimulation dose — predicts egg number" }] },
        { rowLabel: "AFC (ultrasound)",             cells: [{ value: "Antral follicle count" },                      { value: "Confirms ovarian reserve alongside AMH" }] },
        { rowLabel: "Day 2–3 FSH / LH / E2",       cells: [{ value: "Hormonal baseline" },                          { value: "Elevated FSH signals reduced reserve" }] },
        { rowLabel: "Semen Analysis (WHO 2021)",    cells: [{ value: "Count, motility, morphology" },                { value: "Determines if ICSI is needed" }] },
        { rowLabel: "Uterine cavity assessment",    cells: [{ value: "Hysteroscopy or saline sonohysterography" }, { value: "Rules out polyps, fibroids, adhesions" }] },
        { rowLabel: "Infectious disease screen",    cells: [{ value: "HIV, Hep B, Hep C, syphilis" },               { value: "Mandatory before ART treatment in India" }] },
      ],
    },
  },
};

/* ── Fallback ─────────────────────────────────────────────────────── */
const FALLBACK_TEMPLATE: TopicTemplate = {
  stats: [BFI_BIRTHS, BFI_CENTRES, BFI_REVIEWS],
  conclusionHeadline: "Key Takeaways",
  conclusionPoints: [
    { icon: "Award",      text: "Bavishi Fertility Institute has helped over 25,000 families achieve successful pregnancies across 14 centres in India." },
    BFI_DIAGNOSTIC,
    { icon: "HeartPulse", text: "Every patient's situation is unique — your treatment plan is tailored to your specific test results, age, diagnosis, and personal priorities." },
    UNIVERSAL_CLOSE,
  ],
  highlightCard: {
    badge: "BAVISHI FERTILITY INSTITUTE",
    tagline: "25,000+ successful pregnancies across 14 centres — personalised fertility care",
    icon: "Award",
    color: "rose",
    facts: [
      { label: "Centres",    value: "14 across India" },
      { label: "Pregnancies", value: "25,000+" },
      { label: "Reviews",    value: "1,800+ five-star Google ratings" },
      { label: "Awards",     value: "National Fertility Award 2021–2025" },
    ],
    bestSuitedFor: "Anyone considering fertility treatment — whether exploring options for the first time or seeking a second opinion after treatment elsewhere.",
  },
  comparisonTable: {
    rowHeader: "What BFI Offers",
    columns: [{ header: "Details" }],
    rows: [
      { rowLabel: "Diagnostic Workup",       cells: [{ value: "Full AMH, AFC, semen analysis, uterine assessment" }] },
      { rowLabel: "IVF & ICSI",              cells: [{ value: "All stimulation protocols including mild and natural IVF" }] },
      { rowLabel: "Advanced Techniques",     cells: [{ value: "IMSI, PICSI, MACS, ERA, PGT-A/M, time-lapse culture" }] },
      { rowLabel: "Male Factor",             cells: [{ value: "Full male fertility assessment + surgical retrieval (TESA/TESE/Micro-TESE)" }] },
      { rowLabel: "Fertility Preservation",  cells: [{ value: "Egg freezing, embryo banking, oncofertility" }] },
      { rowLabel: "Support",                 cells: [{ value: "Counselling, dietary guidance, holistic care" }] },
    ],
  },
};

/* ══════════════════════════════════════════════════════════════════════
 * Block builders
 * ══════════════════════════════════════════════════════════════════════ */
function makeStatStrip(stats: [StatItem, StatItem, StatItem]) {
  return block("statStrip", { items: arr(stats) });
}

function makeHighlightCard(card: HCard) {
  return block("highlightCard", {
    badge: card.badge,
    tagline: card.tagline,
    icon: card.icon,
    color: card.color,
    facts: arr(card.facts),
    bestSuitedFor: card.bestSuitedFor,
  });
}

function makeComparisonTable(table: CTable) {
  return block("comparisonTable", {
    rowHeader: table.rowHeader,
    columns: arr(table.columns),
    rows: arr(table.rows.map(r => ({
      rowLabel: r.rowLabel,
      cells: arr(r.cells),
    }))),
  });
}

function makeConclusionPanel(headline: string, points: [PointItem, PointItem, PointItem, PointItem]) {
  return block("conclusionPanel", { headline, points: arr(points) });
}

function makeDecisionList(
  heading: string,
  intro: string,
  items: { icon: string; situation: string; recommendation: string }[],
  note?: string,
) {
  return block("decisionList", {
    heading, intro,
    items: arr(items),
    ...(note ? { note } : {}),
  });
}

/* ══════════════════════════════════════════════════════════════════════
 * Helpers
 * ══════════════════════════════════════════════════════════════════════ */
function resolveTemplate(treatmentSlugs: string[] = []): TopicTemplate {
  for (const slug of treatmentSlugs) {
    if (TOPIC_MAP[slug]) return TOPIC_MAP[slug];
  }
  return FALLBACK_TEMPLATE;
}

const blockType = (n: unknown) =>
  (n as Record<string, unknown>).type === "block"
    ? ((n as Record<string, unknown>).fields as Record<string, unknown>)?.blockType as string
    : null;

const hasBlock = (children: unknown[], type: string) =>
  children.some(n => blockType(n) === type);

const findBlockIdx = (children: unknown[], type: string) =>
  children.findIndex(n => blockType(n) === type);

/* ══════════════════════════════════════════════════════════════════════
 * Main
 * ══════════════════════════════════════════════════════════════════════ */
async function main() {
  const payload = await getPayload({ config });

  let page = 1;
  const limit = 50;
  let processed = 0, skipped = 0, updated = 0, totalDocs = 0;

  console.log("🚀  Phase 2 enrichment — adding HighlightCard + ComparisonTable...\n");

  do {
    const result = await payload.find({ collection: "blogs", page, limit, depth: 0 });

    if (page === 1) {
      totalDocs = result.totalDocs;
      console.log(`📚  Found ${totalDocs} blog posts.\n`);
    }

    for (const blog of result.docs) {
      processed++;

      const root     = (blog.content as Record<string, unknown>)?.root as Record<string, unknown>;
      const children: unknown[] = (root?.children as unknown[]) ?? [];

      /* Skip if already has highlightCard */
      if (hasBlock(children, "highlightCard")) {
        skipped++;
        console.log(`  ⏭  [${processed}/${totalDocs}] SKIP (already enriched): ${blog.slug}`);
        continue;
      }

      const tmpl = resolveTemplate((blog.treatmentSlugs ?? []).map(
        (t: unknown) => (typeof t === "string" ? t : (t as Record<string, unknown>).slug as string),
      ));

      /* Find insertion points */
      const statStripIdx     = findBlockIdx(children, "statStrip");
      const conclusionIdx    = findBlockIdx(children, "conclusionPanel");

      let newChildren: unknown[];

      if (statStripIdx === -1 || conclusionIdx === -1) {
        /* Fallback: blog was never enriched by Phase 1 — build from scratch */
        const isShort = children.length < 10;
        newChildren = [
          makeStatStrip(tmpl.stats),
          makeHighlightCard(tmpl.highlightCard),
          ...children,
          ...(isShort && tmpl.decisionItems
            ? [makeDecisionList(
                tmpl.decisionHeading ?? "Should this apply to you?",
                tmpl.decisionIntro  ?? "Consider the following factors before your first consultation:",
                tmpl.decisionItems,
                tmpl.decisionNote,
              )]
            : []),
          makeComparisonTable(tmpl.comparisonTable),
          makeConclusionPanel(tmpl.conclusionHeadline, tmpl.conclusionPoints),
          rPara(
            "For personalised advice tailored to your test results and diagnosis, ",
            lnk("book a consultation", "/contact"),
            " with our specialists at Bavishi Fertility Institute.",
          ),
        ];
      } else {
        /* Phase 1 already ran — insert highlightCard + comparisonTable into existing structure */
        const beforeConclusion = children.slice(statStripIdx + 1, conclusionIdx);
        const afterConclusion  = children.slice(conclusionIdx + 1);
        newChildren = [
          children[statStripIdx],          // statStrip (keep existing)
          makeHighlightCard(tmpl.highlightCard),
          ...beforeConclusion,              // existing article body + any DecisionList
          makeComparisonTable(tmpl.comparisonTable),
          children[conclusionIdx],          // conclusionPanel (keep existing)
          ...afterConclusion,               // CTA paragraph
        ];
      }

      await payload.update({
        collection: "blogs",
        id: blog.id,
        data: { content: { root: { ...root, children: newChildren } } as never },
      });

      updated++;
      console.log(`  ✅  [${processed}/${totalDocs}] Updated: ${blog.slug}`);
      await new Promise(r => setTimeout(r, 400));
    }

    page++;
  } while ((page - 1) * limit < totalDocs);

  console.log(`\n🎉  Done!`);
  console.log(`   Updated : ${updated}`);
  console.log(`   Skipped : ${skipped} (already had highlightCard)`);
  console.log(`   Total   : ${processed}`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
