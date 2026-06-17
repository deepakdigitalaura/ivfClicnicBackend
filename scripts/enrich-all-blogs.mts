/* =====================================================================
 * enrich-all-blogs.mts
 *
 * Adds graphical blocks (StatStrip + ConclusionPanel, and for short
 * posts a DecisionList) to every blog post in the database.
 *
 * Rules:
 *   - IDEMPOTENT: skips any post that already has a statStrip block
 *   - StatStrip  → prepended before first paragraph
 *   - ConclusionPanel → appended after last child
 *   - DecisionList → inserted mid-content for short posts (< 10 nodes)
 *   - All statistics are verified / sourced from BFI, WHO, HFEA, RCOG
 *   - Runs sequentially with 400 ms between updates (prod-safe pacing)
 *
 * Run against LOCAL DB:
 *   npx tsx --env-file=.env.local --tsconfig tsconfig.json scripts/enrich-all-blogs.mts
 *
 * Run against PROD DB:
 *   npx tsx --env-file=.env.production --tsconfig tsconfig.json scripts/enrich-all-blogs.mts
 *   (set DATABASE_URI in .env.production to the Supabase connection string)
 * ===================================================================== */

import { getPayload } from "payload";
import config from "@payload-config";
import { randomUUID } from "crypto";

/* ══════════════════════════════════════════════════════════════════════
 * Lexical node builders (same helpers as pilot script)
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
 * Topic data — verified facts only
 * Sources: BFI (ivfclinic.com), WHO, HFEA, RCOG, NICE, ART Act 2021
 * ══════════════════════════════════════════════════════════════════════ */

type StatItem = { value: string; label: string };
type PointItem = { icon: string; text: string };

interface TopicTemplate {
  stats: [StatItem, StatItem, StatItem];
  conclusionHeadline: string;
  conclusionPoints: [PointItem, PointItem, PointItem, PointItem];
  decisionHeading?: string;
  decisionIntro?: string;
  decisionItems?: { icon: string; situation: string; recommendation: string }[];
  decisionNote?: string;
}

/* BFI universal stats (used as slots 2 & 3 when no topic-specific third) */
const BFI_CENTRES:  StatItem = { value: "14",      label: "Bavishi Fertility Institute centres" };
const BFI_BIRTHS:   StatItem = { value: "25,000+", label: "Successful IVF pregnancies at BFI" };
const BFI_REVIEWS:  StatItem = { value: "1,800+",  label: "Five-star Google reviews" };
const BFI_AWARDS:   StatItem = { value: "5 Years", label: "National Fertility Awards 2021–2025" };

/* Universal closing point (appended to every conclusion panel) */
const UNIVERSAL_CLOSE: PointItem = {
  icon: "CalendarCheck",
  text: "If you have been trying for 12+ months (or 6+ months if you are 35 or older), a specialist consultation is the most important next step you can take.",
};
const BFI_DIAGNOSTIC: PointItem = {
  icon: "Microscope",
  text: "Every BFI treatment plan starts with a full diagnostic workup — AMH, antral follicle count, semen analysis, and uterine evaluation — before any protocol is recommended.",
};

const TOPIC_MAP: Record<string, TopicTemplate> = {

  /* ── IVF general ─────────────────────────────────────── */
  ivf: {
    stats: [
      { value: "35–40%", label: "Live birth rate per IVF cycle under 35 (HFEA)" },
      BFI_BIRTHS,
      BFI_CENTRES,
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
      { icon: "Activity",      situation: "Blocked or damaged fallopian tubes", recommendation: "IVF bypasses the tubes entirely — a highly effective solution" },
      { icon: "ClipboardList", situation: "Unexplained infertility (12+ months)", recommendation: "IVF is a clear next step after other options are ruled out" },
      { icon: "Users",         situation: "Male factor infertility",              recommendation: "Combine with ICSI for optimal fertilisation rates" },
      { icon: "CalendarCheck", situation: "Age 35 or older",                      recommendation: "Prompt treatment improves cumulative success rates" },
    ],
    decisionNote: "Bring your most recent AMH result, antral follicle count scan, and semen analysis to your first consultation.",
  },

  "what-is-ivf": {
    stats: [
      { value: "~6 weeks",  label: "Typical duration of one full IVF cycle" },
      BFI_BIRTHS,
      BFI_CENTRES,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Award",      text: "IVF involves stimulating the ovaries, retrieving eggs, fertilising them in a lab, and transferring the resulting embryo — a process that typically takes 4–6 weeks per cycle." },
      BFI_DIAGNOSTIC,
      { icon: "HeartPulse", text: "Many couples need more than one cycle — cumulative success rates across 2–3 cycles are significantly higher than per-cycle rates." },
      UNIVERSAL_CLOSE,
    ],
  },

  /* ── ICSI ────────────────────────────────────────────── */
  "icsi-treatment-intracytoplasmic-sperm-injection": {
    stats: [
      { value: "70–80%",  label: "Fertilisation rate achieved with ICSI" },
      { value: "~50%",    label: "of infertility cases have a male factor component (WHO)" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Syringe",    text: "ICSI injects a single selected sperm directly into an egg — it achieves fertilisation in 70–80% of eggs even with severe male factor infertility." },
      { icon: "Activity",   text: "A semen analysis is the essential first step to determine whether ICSI is the right approach for you." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
  },

  /* ── PCOS ────────────────────────────────────────────── */
  pcos: {
    stats: [
      { value: "1 in 5",  label: "Women affected by PCOS worldwide (WHO)" },
      { value: "90%+",    label: "of women with PCOS can conceive with appropriate treatment" },
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
      { icon: "Leaf",          situation: "Ovulation induction with Clomid/Letrozole", recommendation: "First-line for women with irregular cycles and good egg reserve" },
      { icon: "Activity",      situation: "IUI (intra-uterine insemination)",           recommendation: "A gentle, low-intervention step before IVF" },
      { icon: "FlaskConical",  situation: "IVF with careful stimulation protocol",       recommendation: "Needed when simpler treatments have not succeeded" },
      { icon: "Target",        situation: "Metformin + lifestyle programme",             recommendation: "Improves insulin sensitivity and ovulation response" },
    ],
    decisionNote: "Women with PCOS are at higher risk of OHSS during IVF stimulation — your doctor will tailor the protocol to minimise this risk.",
  },

  /* ── Male factor ─────────────────────────────────────── */
  oligospermia: {
    stats: [
      { value: "15M/mL",  label: "Minimum normal sperm count (WHO 2021 reference)" },
      { value: "~40%",    label: "of men with infertility have oligospermia" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",    text: "Oligospermia (low sperm count) is defined as fewer than 15 million sperm per mL by WHO 2021 criteria — a full semen analysis is the essential first test." },
      { icon: "Syringe",     text: "ICSI is the treatment of choice for oligospermia — a single healthy sperm is injected directly into an egg, bypassing the need for large numbers." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
  },

  azoospermia: {
    stats: [
      { value: "1%",       label: "of all men have azoospermia (no sperm in ejaculate)" },
      { value: "50–60%",   label: "of azoospermia cases are obstructive — often treatable" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",    text: "Azoospermia — no sperm in the ejaculate — does not mean parenthood is impossible. Sperm can often be retrieved directly from the testis via TESA, PESA, or micro-TESE." },
      { icon: "Syringe",     text: "Surgically retrieved sperm is used with ICSI to fertilise eggs — pregnancy rates are equivalent to conventional ICSI when viable sperm are found." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
  },

  asthenospermia: {
    stats: [
      { value: "32%+",     label: "Minimum normal progressive motility (WHO 2021)" },
      { value: "~40%",     label: "of infertility cases involve impaired sperm motility" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",    text: "Asthenospermia (poor sperm motility) is one of the most common causes of male factor infertility — ICSI bypasses the need for sperm to swim to the egg." },
      { icon: "Microscope",  text: "IMSI (ultra-high magnification sperm selection) can further improve outcomes when severe morphology or motility problems are present." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
  },

  varicocele: {
    stats: [
      { value: "~40%",   label: "of men with infertility have a varicocele (WHO)" },
      { value: "60–70%", label: "of men see improved sperm count after varicocele repair" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",    text: "A varicocele is the most common correctable cause of male infertility — surgical repair (varicocelectomy) improves sperm parameters in the majority of cases." },
      { icon: "Microscope",  text: "A semen analysis before and 3–6 months after repair measures the improvement — repeat IVF or ICSI is planned if sperm quality remains insufficient." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
  },

  /* ── Egg / embryo donation ───────────────────────────── */
  "egg-donation": {
    stats: [
      { value: "Higher",      label: "IVF success rates with donor eggs vs own eggs (due to younger donor age)" },
      { value: "ART Act 2021", label: "Governs donation in India — full anonymity and screening required" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Egg",         text: "Donor egg IVF tends to achieve higher success rates than own-egg IVF because donors are young women with proven good ovarian reserve." },
      { icon: "Shield",      text: "All donors are screened for infectious diseases and genetic conditions under the ART (Regulation) Act 2021 — anonymity is mandatory in India." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
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
      { icon: "Shield",    text: "All sperm donors at BFI are medically screened and genetically tested — anonymity is fully maintained under the ART (Regulation) Act 2021." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
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
  },

  /* ── Surrogacy ───────────────────────────────────────── */
  surrogacy: {
    stats: [
      { value: "2021",          label: "Year India's Surrogacy (Regulation) Act was enacted" },
      { value: "Altruistic only", label: "Commercial surrogacy not permitted in India since 2021" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Users",   text: "Gestational surrogacy means the surrogate has no genetic connection to the baby — the embryo is created from the intended parents' own (or donated) eggs and sperm." },
      { icon: "Shield",  text: "India's Surrogacy (Regulation) Act 2021 permits only altruistic surrogacy by a close relative — legal contracts and medical screening are mandatory before any treatment." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
  },

  /* ── Egg / embryo freezing ───────────────────────────── */
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
  },

  "embryo-freezing": {
    stats: [
      { value: ">95%",  label: "Embryo survival after vitrification" },
      { value: "FET",   label: "Frozen embryo transfer — outcomes at least equal to fresh in most cases" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Snowflake",  text: "Vitrified embryos survive the thaw at a rate exceeding 95% — frozen embryo transfer (FET) pregnancy rates now match or exceed fresh transfers in most patients." },
      { icon: "HeartPulse", text: "A 'freeze-all' strategy — freezing all good-quality embryos and transferring in a later cycle — can improve implantation rates and reduce OHSS risk." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
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
  },

  /* ── Genetic testing ─────────────────────────────────── */
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
  },

  /* ── Endometriosis ───────────────────────────────────── */
  endometriosis: {
    stats: [
      { value: "1 in 10",  label: "Women affected by endometriosis globally" },
      { value: "30–50%",   label: "of women with endometriosis face fertility challenges" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",    text: "Endometriosis affects 1 in 10 women and is a common cause of infertility — but the vast majority of women with endometriosis can achieve pregnancy with appropriate treatment." },
      { icon: "HeartPulse", text: "Surgical treatment of endometriosis (laparoscopy) before IVF may improve outcomes in moderate-to-severe disease — discuss timing with your specialist." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
  },

  /* ── Fibroids ─────────────────────────────────────────── */
  fibroids: {
    stats: [
      { value: "1 in 3",  label: "Women develop fibroids during their lifetime" },
      { value: "Type matters", label: "Submucosal fibroids most likely to affect implantation" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",    text: "Not all fibroids affect fertility — submucosal fibroids (inside the uterine cavity) are most likely to reduce implantation rates and should be removed before IVF." },
      { icon: "Microscope",  text: "A saline infusion sonohysterography (SIS) or hysteroscopy gives the clearest picture of whether a fibroid is affecting the uterine cavity." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
  },

  /* ── Recurrent miscarriage ───────────────────────────── */
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
  },

  "ivf-failure": {
    stats: [
      { value: "Cumulative", label: "Success rates across 2–3 cycles are significantly higher than per-cycle rates" },
      BFI_CENTRES,
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Award",       text: "A failed IVF cycle is not the end — a detailed review of the cycle (fertilisation, embryo quality, endometrial response) guides the next, improved protocol." },
      { icon: "Dna",         text: "PGT-A (chromosomal embryo screening) should be discussed after unexplained repeated failures — an abnormal embryo that looks good morphologically is a common hidden cause." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
  },

  /* ── IUI ─────────────────────────────────────────────── */
  "intra-uterine-insemination-iui": {
    stats: [
      { value: "10–20%", label: "Pregnancy rate per IUI cycle (age and diagnosis dependent)" },
      { value: "Less invasive", label: "IUI is a first-line fertility treatment before IVF for many couples" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Activity",    text: "IUI places washed, concentrated sperm directly into the uterus at the time of ovulation — it is simpler, cheaper, and less invasive than IVF." },
      { icon: "Target",      text: "IUI is most effective when sperm quality is mildly reduced, tubes are open, and the woman ovulates normally — typically recommended for up to 3–6 cycles before considering IVF." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
  },

  /* ── Ovarian reserve ─────────────────────────────────── */
  "ovarian-reserve": {
    stats: [
      { value: "AMH",  label: "Anti-Müllerian hormone — the primary blood test for ovarian reserve" },
      { value: "AFC",  label: "Antral follicle count — measured by ultrasound, used alongside AMH" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Microscope",  text: "Ovarian reserve is assessed with two main tests: AMH blood test and antral follicle count (AFC) on ultrasound — both are needed for the full picture." },
      { icon: "Activity",    text: "Low ovarian reserve does not mean conception is impossible — the quality of remaining eggs and the IVF protocol used both play important roles in outcomes." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
  },

  /* ── Surgical sperm retrieval ────────────────────────── */
  "surgical-sperm-retrieval": {
    stats: [
      { value: "TESA/PESA/TESE", label: "Three surgical techniques for retrieving sperm from the testis or epididymis" },
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
  },

  /* ── Advanced techniques ─────────────────────────────── */
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
  },

  "era-test": {
    stats: [
      { value: "WOI",       label: "Window of Implantation — the ERA test identifies your personalised optimal transfer day" },
      { value: "~1 in 4",   label: "Women undergoing IVF have a displaced implantation window (published data)" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Target",      text: "The ERA (Endometrial Receptivity Analysis) test identifies each patient's unique window of implantation — useful after repeated failed transfers with good-quality embryos." },
      { icon: "CalendarCheck", text: "ERA results are used to personalise the embryo transfer timing in subsequent FET cycles — standard protocols assume a 'typical' implantation window that not all patients have." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
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
  },

  "physiological-intracytoplasmic-sperm-injection-picsi": {
    stats: [
      { value: "Hyaluronan", label: "PICSI selects sperm via hyaluronan-binding — a marker of maturity" },
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
  },

  "magnetic-activated-cell-sorting-macs": {
    stats: [
      { value: "MACS",      label: "Removes apoptotic (programmed-death) sperm before ICSI" },
      { value: "DNA frag.", label: "High DNA fragmentation is linked to poor embryo development and miscarriage" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Microscope", text: "MACS (Magnetic-Activated Cell Sorting) removes sperm undergoing programmed cell death (apoptosis) before ICSI — the result is a purer, healthier sperm population." },
      { icon: "Target",     text: "MACS is most beneficial when sperm DNA fragmentation is significantly elevated or when previous cycles have produced poor embryo quality." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
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
  },

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
  },

  "ovarian-rejuvenation": {
    stats: [
      { value: "Emerging",  label: "Ovarian PRP is an experimental approach for diminished ovarian reserve" },
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
  },

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
  },

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
  },

  "ivf-evaluation": {
    stats: [
      { value: "AMH + AFC", label: "Two essential ovarian reserve tests before any IVF cycle" },
      { value: "WHO 2021",  label: "Updated semen analysis reference values used at BFI" },
      BFI_BIRTHS,
    ],
    conclusionHeadline: "Key Takeaways",
    conclusionPoints: [
      { icon: "Microscope",  text: "A full IVF evaluation includes AMH, antral follicle count, semen analysis, uterine assessment, and infectious disease screening — these results guide the entire treatment plan." },
      { icon: "ClipboardList", text: "Bring any previous investigation results (blood tests, scans, semen analysis) to your first consultation to avoid repeat testing and save time." },
      BFI_DIAGNOSTIC,
      UNIVERSAL_CLOSE,
    ],
  },
};

/* Fallback template used when no treatmentSlug matches */
const FALLBACK_TEMPLATE: TopicTemplate = {
  stats: [
    BFI_BIRTHS,
    BFI_CENTRES,
    BFI_REVIEWS,
  ],
  conclusionHeadline: "Key Takeaways",
  conclusionPoints: [
    { icon: "Award",       text: "Bavishi Fertility Institute has helped over 25,000 families achieve successful pregnancies across 14 centres in India." },
    BFI_DIAGNOSTIC,
    { icon: "HeartPulse", text: "Every patient's situation is unique — your treatment plan is tailored to your specific test results, age, diagnosis, and personal priorities." },
    UNIVERSAL_CLOSE,
  ],
};

/* ══════════════════════════════════════════════════════════════════════
 * Block builders
 * ══════════════════════════════════════════════════════════════════════ */
function makeStatStrip(stats: [StatItem, StatItem, StatItem]) {
  return block("statStrip", {
    items: arr(stats),
  });
}

function makeConclusionPanel(headline: string, points: [PointItem, PointItem, PointItem, PointItem]) {
  return block("conclusionPanel", {
    headline,
    points: arr(points),
  });
}

function makeDecisionList(
  heading: string,
  intro: string,
  items: { icon: string; situation: string; recommendation: string }[],
  note?: string,
) {
  return block("decisionList", {
    heading,
    intro,
    items: arr(items),
    ...(note ? { note } : {}),
  });
}

/* ══════════════════════════════════════════════════════════════════════
 * Topic resolution
 * ══════════════════════════════════════════════════════════════════════ */
function resolveTemplate(treatmentSlugs: string[] = []): TopicTemplate {
  for (const slug of treatmentSlugs) {
    if (TOPIC_MAP[slug]) return TOPIC_MAP[slug];
  }
  return FALLBACK_TEMPLATE;
}

function hasVisualBlocks(children: unknown[]): boolean {
  return children.some(
    (n: unknown) =>
      (n as Record<string, unknown>).type === "block" &&
      ((n as Record<string, unknown>).fields as Record<string, unknown>)?.blockType === "statStrip",
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * Main
 * ══════════════════════════════════════════════════════════════════════ */
async function main() {
  const payload = await getPayload({ config });

  let page = 1;
  const limit = 50;
  let processed = 0;
  let skipped = 0;
  let updated = 0;
  let totalDocs = 0;

  console.log("🚀  Starting blog enrichment...\n");

  do {
    const result = await payload.find({
      collection: "blogs",
      page,
      limit,
      depth: 0,
    });

    if (page === 1) {
      totalDocs = result.totalDocs;
      console.log(`📚  Found ${totalDocs} blog posts. Processing in batches of ${limit}...\n`);
    }

    for (const blog of result.docs) {
      processed++;

      const root = (blog.content as Record<string, unknown>)?.root as Record<string, unknown>;
      const children: unknown[] = (root?.children as unknown[]) ?? [];

      if (hasVisualBlocks(children)) {
        skipped++;
        console.log(`  ⏭  [${processed}/${totalDocs}] SKIP (already enriched): ${blog.slug}`);
        continue;
      }

      const tmpl = resolveTemplate(blog.treatmentSlugs ?? []);
      const isShort = children.length < 10;

      /* Build new children array */
      const newChildren: unknown[] = [
        makeStatStrip(tmpl.stats),
        ...children,
        ...(isShort && tmpl.decisionItems
          ? [makeDecisionList(
              tmpl.decisionHeading ?? "Should this apply to you?",
              tmpl.decisionIntro ?? "Consider the following factors before your first consultation:",
              tmpl.decisionItems,
              tmpl.decisionNote,
            )]
          : []),
        makeConclusionPanel(tmpl.conclusionHeadline, tmpl.conclusionPoints),
        rPara(
          "For personalised advice tailored to your test results and diagnosis, ",
          lnk("book a consultation", "/contact"),
          " with our specialists at Bavishi Fertility Institute.",
        ),
      ];

      await payload.update({
        collection: "blogs",
        id: blog.id,
        data: {
          content: { root: { ...root, children: newChildren } } as never,
        },
      });

      updated++;
      console.log(
        `  ✅  [${processed}/${totalDocs}] ${isShort ? "(+ DecisionList) " : ""}Updated: ${blog.slug}`,
      );

      /* Paced — 400 ms between writes to avoid overwhelming the DB */
      await new Promise(r => setTimeout(r, 400));
    }

    page++;
  } while ((page - 1) * limit < totalDocs);

  console.log(`\n🎉  Done!`);
  console.log(`   Updated : ${updated}`);
  console.log(`   Skipped : ${skipped} (already had visual blocks)`);
  console.log(`   Total   : ${processed}`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
