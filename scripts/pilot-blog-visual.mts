/* =====================================================================
 * PILOT v3 — rich text + visual blocks + treatment links + conclusion
 * panel + author/reviewer attribution for blog #16.
 *
 * Changes from v2:
 *  - All HighlightCards → color: "rose" (pink only, no plum/gold)
 *  - Internal treatment links in key paragraphs (Lexical link nodes)
 *  - New ConclusionPanel block before conclusion text
 *  - blog.author → Dr. Parth Bavishi (ID 3)
 *  - blog.reviewedBy → Dr. Himanshu Bavishi (ID 2)
 *  - Dr. Himanshu Bavishi credentials/role updated
 *
 * LOCAL DB only.
 * Run: npx tsx --env-file=.env.local --tsconfig tsconfig.json scripts/pilot-blog-visual.mts
 * ===================================================================== */
import { getPayload } from "payload";
import config from "@payload-config";
import { randomUUID } from "crypto";

const SLUG = "a-guide-to-the-different-types-of-ivf-treatments";

/* ══════════════════════════════════════════════════════════════════════
 * Lexical node builders
 * ══════════════════════════════════════════════════════════════════════ */
const txt = (text: string, format = 0) => ({
  type: "text" as const,
  version: 1,
  format,
  mode: "normal" as const,
  style: "",
  detail: 0,
  text,
});

/** Internal / external link node */
const lnk = (text: string, url: string) => ({
  type: "link" as const,
  version: 1,
  format: "" as const,
  indent: 0,
  direction: "ltr" as const,
  fields: { url, newTab: false, linkType: "custom" as const },
  children: [txt(text)],
});

/** Plain paragraph (single text node) */
const para = (text: string) => ({
  type: "paragraph" as const,
  version: 1,
  format: "" as const,
  indent: 0,
  textFormat: 0,
  direction: "ltr" as const,
  children: [txt(text)],
});

/** Rich paragraph — mix of text strings and link nodes */
const rPara = (...segs: (string | ReturnType<typeof lnk>)[]) => ({
  type: "paragraph" as const,
  version: 1,
  format: "" as const,
  indent: 0,
  textFormat: 0,
  direction: "ltr" as const,
  children: segs.map(s => (typeof s === "string" ? txt(s) : s)),
});

const h2 = (text: string) => ({
  type: "heading" as const,
  tag: "h2" as const,
  version: 1,
  format: "" as const,
  indent: 0,
  direction: "ltr" as const,
  children: [txt(text)],
});

const h3 = (text: string) => ({
  type: "heading" as const,
  tag: "h3" as const,
  version: 1,
  format: "" as const,
  indent: 0,
  direction: "ltr" as const,
  children: [txt(text)],
});

const ul = (items: string[]) => ({
  type: "list" as const,
  tag: "ul" as const,
  version: 1,
  listType: "bullet" as const,
  start: 1,
  format: "" as const,
  indent: 0,
  direction: "ltr" as const,
  children: items.map((text, i) => ({
    type: "listitem" as const,
    version: 1,
    value: i + 1,
    format: 0,
    indent: 0,
    direction: "ltr" as const,
    children: [txt(text)],
  })),
});

const block = (blockType: string, fields: Record<string, unknown>) => ({
  type: "block" as const,
  format: "" as const,
  version: 2,
  fields: { ...fields, id: randomUUID(), blockType },
});

const arr = <T extends Record<string, unknown>>(rows: T[]) =>
  rows.map(r => ({ ...r, id: randomUUID() }));

/* ══════════════════════════════════════════════════════════════════════
 * Treatment page URL helper
 * ══════════════════════════════════════════════════════════════════════ */
const t = (slug: string) => `/treatments/${slug}`;

/* ══════════════════════════════════════════════════════════════════════
 * Visual blocks
 * ══════════════════════════════════════════════════════════════════════ */
const statStrip = block("statStrip", {
  items: arr([
    { value: "8",  label: "Types of IVF compared in this guide" },
    { value: "4",  label: "Key factors that decide your best fit" },
    { value: "30,000+", label: "Babies born at Bavishi Fertility Institute" },
  ]),
});

const comparisonTable = block("comparisonTable", {
  rowHeader: "Type",
  columns: arr([{ header: "What it involves" }, { header: "Best suited for" }]),
  rows: arr([
    { rowLabel: "Conventional IVF",  cells: arr([{ value: "Fertilising eggs with sperm in a lab dish" },          { value: "Couples with a range of fertility issues" }]) },
    { rowLabel: "ICSI",              cells: arr([{ value: "Injecting a single sperm directly into an egg" },      { value: "Male factor infertility, poor sperm quality" }]) },
    { rowLabel: "Donor IVF",         cells: arr([{ value: "Using donor eggs, sperm, or embryos" },                { value: "Poor egg/sperm quality, genetic disorders" }]) },
    { rowLabel: "Surrogacy",         cells: arr([{ value: "A surrogate carries the pregnancy" },                   { value: "Uterine factors, high-risk pregnancies" }]) },
    { rowLabel: "PGD",               cells: arr([{ value: "Testing embryos for inherited genetic disorders" },     { value: "Couples with known genetic conditions" }]) },
    { rowLabel: "PGT-A",             cells: arr([{ value: "Screening embryos for chromosomal abnormalities" },    { value: "Improving odds of a successful pregnancy" }]) },
    { rowLabel: "FET",               cells: arr([{ value: "Transferring previously frozen embryos" },             { value: "Couples with spare embryos from an earlier cycle" }]) },
    { rowLabel: "Natural Cycle IVF", cells: arr([{ value: "Egg retrieval without fertility medications" },         { value: "Those who want to avoid stimulation drugs" }]) },
  ]),
});

const decisionList = block("decisionList", {
  heading: "Choosing the right IVF treatment for you",
  intro: "When selecting an IVF treatment, these four factors matter most — bring them to your first consultation:",
  items: arr([
    { icon: "CalendarCheck", situation: "Your age",           recommendation: "Plays a major role in success rates" },
    { icon: "Activity",      situation: "Fertility diagnosis", recommendation: "Type & severity shape which protocol fits" },
    { icon: "ClipboardList", situation: "Medical history",    recommendation: "Past conditions and surgeries can guide the choice" },
    { icon: "Target",        situation: "Budget",             recommendation: "Costs vary significantly between approaches" },
  ]),
  note: "Bring your most recent fertility test results (AMH, AFC, semen analysis) and a list of any previous treatments to your first consultation.",
});

const conclusionPanel = block("conclusionPanel", {
  headline: "Key Takeaways",
  points: arr([
    { icon: "Award",         text: "There is no single 'best' IVF treatment — the right protocol is the one matched to your test results, age, and specific diagnosis." },
    { icon: "Microscope",    text: "Every BFI plan starts with a full diagnostic workup: AMH, antral follicle count, semen analysis, and uterine evaluation." },
    { icon: "HeartPulse",    text: "Many successful outcomes combine two or three approaches — for example, ICSI + PGT-A + FET in sequence." },
    { icon: "CalendarCheck", text: "If you have been trying for 12+ months (or 6+ months if you are 35+), a specialist consultation is the most important next step you can take." },
  ]),
});

/* ══════════════════════════════════════════════════════════════════════
 * All HighlightCards — ROSE (pink) only
 * ══════════════════════════════════════════════════════════════════════ */
const card = (badge: string, tagline: string, icon: string, bestSuitedFor: string) =>
  block("highlightCard", { badge, tagline, icon, color: "rose", bestSuitedFor });

/* ══════════════════════════════════════════════════════════════════════
 * Full content children
 * ══════════════════════════════════════════════════════════════════════ */
const CHILDREN = [

  /* ── Introduction ─────────────────────────────────────────────── */
  rPara(
    lnk("IVF", t("ivf")),
    " — In Vitro Fertilisation — is not a single treatment. It is an umbrella term for a family of assisted reproductive technologies, each designed for a different clinical situation. Knowing which type applies to you is one of the first, most important steps on your fertility journey.",
  ),
  para("This guide explains eight distinct IVF approaches in plain language — from the most widely used conventional protocol to more specialised options like genetic testing, donor gametes, and natural-cycle IVF. Read it before your consultation so you can ask better questions, understand your doctor's recommendations, and make more confident decisions about your care."),

  statStrip,
  comparisonTable,

  /* ══════════════════════════════════════════════════════════════════
   * 1 — Conventional IVF
   * ══════════════════════════════════════════════════════════════════ */
  h2("1. Conventional IVF"),

  rPara(
    "Conventional ",
    lnk("IVF", t("ivf")),
    " is the most widely performed fertility treatment in the world, and for good reason — it is effective across a broad range of fertility problems and forms the technical foundation on which all other IVF variations are built. The process works by stimulating the ovaries with hormone injections to produce multiple eggs at once, then retrieving those eggs, combining them with sperm in a laboratory dish, and transferring the resulting embryo into the uterus.",
  ),
  para("A full conventional IVF cycle typically takes four to six weeks. You will begin with 10–14 days of daily hormone injections (which you self-administer at home after a short training session) to stimulate the ovaries. During this time you will attend the clinic every few days for ultrasound monitoring to track follicle development. Once follicles reach the target size, a trigger injection is given exactly 36 hours before egg retrieval — a brief procedure carried out under light sedation in our theatre. Fertilisation happens in the laboratory overnight, and your specialist will call you the following morning with a fertilisation report."),
  rPara(
    "Success rates vary with age. For women under 35, conventional IVF achieves a live birth rate of approximately 35–40% per cycle. This falls progressively from the mid-30s onwards, largely because egg quality declines with age. Your consultant will give you personalised success-rate estimates based on your specific test results. Conventional IVF is often a first-line treatment for ",
    lnk("unexplained infertility", t("ivf")),
    ", ",
    lnk("PCOS", t("pcos")),
    ", ",
    lnk("endometriosis", t("endometriosis")),
    ", and blocked fallopian tubes.",
  ),
  ul([
    "Blocked or damaged fallopian tubes (IVF bypasses the tubes entirely)",
    "Unexplained infertility where natural conception has not occurred",
    "Polycystic ovary syndrome (PCOS) with irregular or absent ovulation",
    "Mild male factor infertility (mildly low sperm count or motility)",
    "Endometriosis affecting egg quality or tubal function",
    "Advanced maternal age where prompt treatment is time-sensitive",
  ]),
  card(
    "Conventional IVF",
    "The standard starting point",
    "FlaskConical",
    "Couples with a range of fertility issues who do not need specialised sperm-injection or genetic-testing techniques. The most accessible entry point to assisted reproduction.",
  ),

  /* ══════════════════════════════════════════════════════════════════
   * 2 — ICSI
   * ══════════════════════════════════════════════════════════════════ */
  h2("2. ICSI (Intracytoplasmic Sperm Injection)"),

  rPara(
    lnk("ICSI", t("icsi")),
    " was developed in 1992 and transformed the treatment of male factor infertility, which accounts for roughly half of all infertility cases. Rather than mixing eggs and sperm and allowing fertilisation to happen naturally in a dish, an embryologist uses a microscopic glass needle to inject a single carefully selected sperm directly into the centre of an egg. The rest of the IVF process — stimulation, egg retrieval, embryo culture, and transfer — is identical to conventional IVF.",
  ),
  rPara(
    "ICSI is recommended whenever there is a problem with sperm that would make natural fertilisation in a dish unreliable or impossible. This includes a very low sperm count (",
    lnk("oligospermia", t("oligospermia")),
    "), poor motility (",
    lnk("asthenospermia", t("asthenospermia")),
    "), the complete absence of sperm in the ejaculate (",
    lnk("azoospermia", t("azoospermia")),
    " — where sperm is surgically retrieved from the testis), or when a previous IVF cycle resulted in unexpectedly poor or failed fertilisation.",
  ),
  para("ICSI consistently achieves fertilisation rates of 70–80% of injected eggs — significantly higher than conventional insemination in cases of severe male factor infertility. Pregnancy and live birth rates are equivalent to conventional IVF when sperm quality is good, and far superior when it is not."),
  ul([
    "Low sperm count (fewer than 15 million sperm per mL by WHO criteria)",
    "Zero sperm count in the ejaculate, with sperm retrieved via TESA, PESA, or TESE",
    "Poor sperm motility or severely abnormal morphology",
    "Previous IVF cycle with failed or very poor fertilisation (under 30%)",
    "Anti-sperm antibodies detected in semen",
    "Use of cryopreserved (frozen) sperm, where post-thaw quality may be reduced",
  ]),
  card(
    "ICSI (Intracytoplasmic Sperm Injection)",
    "One sperm, directly injected",
    "Syringe",
    "Men with low sperm count, poor motility, or abnormal morphology. Also used after failed fertilisation in a previous IVF cycle, or when sperm is surgically retrieved.",
  ),

  /* ══════════════════════════════════════════════════════════════════
   * 3 — Donor IVF
   * ══════════════════════════════════════════════════════════════════ */
  h2("3. Donor IVF"),

  rPara(
    "Donor IVF uses ",
    lnk("donated eggs", t("egg-donation")),
    ", ",
    lnk("donor sperm", t("sperm-donation")),
    ", or donated embryos when a partner's own gametes cannot produce viable embryos. This may be due to very poor egg or sperm quality, an extremely low quantity of eggs remaining (diminished ovarian reserve), absent or non-functional gametes, or an inherited genetic condition that the couple does not wish to pass on.",
  ),
  para("When donor eggs are used, the donor — a healthy, young woman who has been screened for infectious diseases and genetic conditions — undergoes ovarian stimulation and egg retrieval. Her eggs are fertilised in the laboratory with the intended father's sperm (or donor sperm if required), and the resulting embryo is transferred into the intended mother's prepared uterus. The recipient mother carries the pregnancy and gives birth. Success rates with donor IVF tend to be higher than own-egg IVF because egg donors are young individuals with proven good egg reserve."),
  para("In India, the ICMR guidelines and the ART (Regulation) Act 2021 govern all aspects of gamete donation, including mandatory anonymity, medical screening, and the regulated role of ART banks. Our team will walk you through the full legal and medical process before any treatment begins."),
  ul([
    "Premature ovarian insufficiency (POI) or early menopause",
    "Severely diminished ovarian reserve — very few or no eggs remaining",
    "Repeated IVF failure despite good protocols using own eggs",
    "Genetic disorders that one or both partners carry and do not wish to transmit",
    "Same-sex male couples or single men building a family (requires a gestational surrogate)",
    "Recurrent miscarriage attributed to egg-quality problems",
  ]),
  card(
    "Donor IVF",
    "Using donor eggs, sperm or embryos",
    "Egg",
    "Couples facing poor egg quality or very low egg reserve, men with severe male factor infertility, those carrying inheritable genetic conditions, or same-sex couples building a family.",
  ),

  /* ══════════════════════════════════════════════════════════════════
   * 4 — Surrogacy
   * ══════════════════════════════════════════════════════════════════ */
  h2("4. Surrogacy"),

  para("Surrogacy is an arrangement in which another woman — the surrogate — carries a pregnancy to term on behalf of the intended parent or parents. In gestational surrogacy, which is the form used in clinical practice today, the surrogate has no genetic connection to the baby. The embryo is created from the intended parents' own eggs and sperm (or from donors), then transferred into the surrogate's uterus via IVF. She carries the pregnancy and delivers the baby, but is not the child's biological mother."),
  para("The Surrogacy (Regulation) Act 2021 in India now restricts surrogacy to altruistic arrangements only — commercial surrogacy is no longer permitted. A close relative of the intended couple may act as surrogate under specific conditions. Our medical and legal team will guide you through the framework, the eligibility criteria, the medical and psychological screening required, and the legal contracts that must be in place before any medical treatment begins."),
  para("From a medical standpoint, gestational surrogacy follows a straightforward two-track process. The intended mother (or egg donor) undergoes ovarian stimulation and egg retrieval. An embryo is created in the laboratory and, once the surrogate's endometrium has been medically prepared, the highest-quality embryo is transferred. The surrogate is monitored through early pregnancy by our team, then hands over care to her own obstetrician for the remainder of the pregnancy."),
  ul([
    "Absent uterus — congenital absence (MRKH syndrome) or following hysterectomy",
    "Severe uterine abnormality that cannot be surgically corrected",
    "Medical conditions that make carrying a pregnancy dangerous for the intended mother",
    "Repeated implantation failure despite multiple transfers of good-quality embryos",
    "Recurrent pregnancy loss attributed to uterine factors",
  ]),
  card(
    "Surrogacy",
    "Another woman carries the pregnancy",
    "Users",
    "Couples where the intended mother cannot safely carry a pregnancy — due to absent or abnormal uterus, serious medical illness, or repeated implantation failure with no uterine cause identified.",
  ),

  /* ══════════════════════════════════════════════════════════════════
   * 5 — PGD
   * ══════════════════════════════════════════════════════════════════ */
  h2("5. PGD (Preimplantation Genetic Diagnosis)"),

  rPara(
    "Preimplantation Genetic Diagnosis (PGD) allows embryos created during an ",
    lnk("IVF", t("ivf")),
    " cycle to be tested for a specific inherited genetic condition before any are transferred to the uterus. Once embryos reach the blastocyst stage on day 5 or 6, a skilled embryologist removes a small number of cells from the outer layer without damaging the embryo. Those cells are sent to a specialist genetics laboratory for analysis, and only embryos confirmed to be free of the condition are selected for transfer.",
  ),
  para("PGD is used when one or both intended parents are known carriers of a specific genetic mutation: conditions caused by a single gene fault such as cystic fibrosis, sickle cell anaemia, beta-thalassaemia, spinal muscular atrophy, Huntington's disease, or BRCA1/BRCA2 hereditary cancer mutations. It is also used for chromosomal rearrangements (translocations) that cause recurrent miscarriage."),
  rPara(
    "Before your IVF cycle can begin, a customised genetic test must be designed for your family's specific mutation. This preparation usually takes four to eight weeks and requires input from a clinical geneticist. It allows couples at risk to have genetically healthy children without requiring ",
    lnk("invasive prenatal testing", t("ivf")),
    " and the possibility of termination after a positive prenatal result.",
  ),
  ul([
    "Autosomal recessive conditions: cystic fibrosis, sickle cell anaemia, beta-thalassaemia",
    "Autosomal dominant conditions: Huntington's disease, myotonic dystrophy, BRCA1/BRCA2",
    "X-linked conditions: Duchenne muscular dystrophy, haemophilia, fragile X syndrome",
    "Chromosomal translocations or inversions carried by one or both parents",
    "Couples who have had a previously affected child or pregnancy and wish to prevent recurrence",
  ]),
  card(
    "PGD (Preimplantation Genetic Diagnosis)",
    "Genetic testing before transfer",
    "Dna",
    "Couples who are known carriers of a specific inherited genetic condition and want to transfer only embryos confirmed to be free of that condition — preventing transmission to their child.",
  ),

  /* ══════════════════════════════════════════════════════════════════
   * 6 — PGT-A
   * ══════════════════════════════════════════════════════════════════ */
  h2("6. PGT-A (Preimplantation Genetic Testing for Aneuploidy)"),

  rPara(
    "PGT-A screens ",
    lnk("IVF", t("ivf")),
    " embryos for the correct number of chromosomes before transfer. Healthy human embryos should carry 46 chromosomes — 23 pairs. Aneuploidy (having too few or too many) is the single leading cause of failed implantation, early miscarriage, and chromosomally abnormal pregnancies such as trisomy 21 (Down syndrome). Aneuploidy rates in embryos rise steeply with maternal age.",
  ),
  para("During a PGT-A cycle, embryos are grown to the blastocyst stage and a trophectoderm biopsy is performed. The biopsied cells are analysed using next-generation sequencing (NGS) — technology capable of simultaneously scanning all 24 chromosome types. Embryos with the correct chromosome count (euploid) are selected for transfer. This typically requires a 'freeze-all' strategy in which all biopsied embryos are vitrified while awaiting results (five to seven working days), then a selected euploid embryo is transferred in a subsequent FET cycle."),
  rPara(
    "Clinical evidence consistently shows that transferring a single confirmed euploid embryo significantly reduces miscarriage rates and improves the cumulative live birth rate per egg retrieval — particularly for women over 37 and for those with ",
    lnk("recurrent miscarriage", t("recurrent-miscarriage")),
    " or unexplained implantation failure.",
  ),
  ul([
    "Women aged 37 and above, where age-related aneuploidy rates are clinically significant",
    "Recurrent miscarriage — two or more pregnancy losses",
    "Two or more failed IVF transfers despite apparently good-quality embryos",
    "Previous pregnancy or child affected by a chromosomal condition",
    "Couples choosing single embryo transfer (SET) who want the highest possible confidence",
  ]),
  card(
    "PGT-A (Preimplantation Genetic Testing for Aneuploidy)",
    "Screening for chromosomal health",
    "Microscope",
    "Women over 37, couples with recurrent miscarriage or repeated failed transfers, and anyone who wants to maximise the chance of a successful single embryo transfer by confirming chromosomal normality first.",
  ),

  /* ══════════════════════════════════════════════════════════════════
   * 7 — FET
   * ══════════════════════════════════════════════════════════════════ */
  h2("7. FET (Frozen Embryo Transfer)"),

  rPara(
    "Frozen Embryo Transfer (FET) involves thawing and transferring embryos that were ",
    lnk("cryopreserved", t("cryopreservation")),
    " during a previous IVF cycle. Vitrification — the ultra-rapid flash-freezing technique now used as standard — has transformed cryopreservation. Embryo survival rates after thawing now exceed 95%, and pregnancy rates with frozen embryos are at least equivalent to, and in many clinical contexts higher than, fresh embryo transfers.",
  ),
  para("An FET cycle requires no ovarian stimulation and no egg retrieval. The uterine lining is prepared with oestrogen over approximately two to three weeks, then progesterone is introduced to replicate the natural implantation window. Ultrasound monitoring confirms the endometrium has reached the right thickness and texture. On the optimal day of preparation, the selected embryo is thawed and transferred. The transfer itself is brief and typically painless."),
  para("In some IVF cycles, a deliberate 'freeze-all' strategy is recommended — all good-quality embryos are vitrified rather than proceeding to a fresh transfer — to prevent ovarian hyperstimulation syndrome (OHSS) in high-responders, to allow PGT-A results to return, or when the endometrium was not at its best at the time of egg retrieval. FET cycles following a freeze-all strategy often show improved implantation rates."),
  ul([
    "Surplus embryos vitrified from a previous fresh IVF or ICSI cycle",
    "A freeze-all strategy was used to prevent OHSS, await PGT-A results, or optimise the lining",
    "Embryo banking across multiple cycles (common for fertility preservation)",
    "Hormonal levels or uterine lining conditions were suboptimal at egg retrieval",
    "Subsequent attempts after a previous fresh cycle",
  ]),
  card(
    "FET (Frozen Embryo Transfer)",
    "Transferring previously frozen embryos",
    "Snowflake",
    "Couples who have completed a fresh IVF cycle and have good-quality vitrified embryos remaining. Also used after a planned freeze-all strategy for OHSS prevention, genetic testing, or endometrial optimisation.",
  ),

  /* ══════════════════════════════════════════════════════════════════
   * 8 — Natural Cycle IVF
   * ══════════════════════════════════════════════════════════════════ */
  h2("8. Natural Cycle IVF"),

  rPara(
    "Natural cycle ",
    lnk("IVF", t("ivf")),
    " works with the body's own hormonal rhythm rather than overriding it with stimulation medications. Instead of injecting hormones to produce multiple eggs, the team monitors the natural menstrual cycle closely — using blood tests and ultrasound — to identify when the single follicle the body naturally selects each month reaches maturity. That follicle's single egg is retrieved, fertilised in the laboratory, and if a viable embryo develops, it is transferred back into the uterus.",
  ),
  para("The main advantages of natural cycle IVF are well defined. Because no stimulation medications are used, there is no risk of ovarian hyperstimulation syndrome (OHSS) and very few side effects. The procedure is simpler, kinder on the body, and considerably cheaper per cycle. The significant trade-off is that only one egg — and therefore at most one embryo — is available per cycle. If fertilisation fails, or the embryo does not develop to transfer quality, the attempt cannot be repeated until the next natural cycle."),
  para("Natural cycle IVF is most appropriate for women who respond very poorly to stimulation (producing only one or two eggs even with maximal stimulation), those with specific medical conditions that contraindicate hormone use, and those who have a strong ethical, religious, or personal preference for a minimal-intervention approach."),
  ul([
    "Very low ovarian reserve — AMH below 0.5 ng/mL and minimal antral follicles",
    "Poor or absent response to stimulation drugs in one or more previous cycles",
    "History of OHSS and unwillingness to risk recurrence",
    "Medical contraindications to the use of ovarian stimulation hormones",
    "Strong ethical, religious, or personal objection to producing multiple embryos",
    "Willingness to undergo multiple shorter, gentler cycles as an alternative to one intensive cycle",
  ]),
  card(
    "Natural Cycle IVF",
    "No fertility medications",
    "Leaf",
    "Women who produce only one or two eggs even with stimulation, those who want to avoid stimulation drugs entirely, or patients for whom a gentler multi-attempt approach is preferred over a single intensive cycle.",
  ),

  /* ══════════════════════════════════════════════════════════════════
   * Other options
   * ══════════════════════════════════════════════════════════════════ */
  h3("Other IVF options"),
  rPara(
    "Beyond the eight main protocols above, your fertility specialist may discuss adjunct technologies. ",
    lnk("Laser-assisted hatching", t("laser-hatching")),
    " makes a microscopic opening in the embryo's outer shell to support implantation. ERA (Endometrial Receptivity Analysis) identifies each patient's precise window of implantation for individualised transfer timing. ",
    lnk("IMSI", t("imsi")),
    " uses ultra-high magnification during ICSI to select the most morphologically perfect sperm. ",
    lnk("Fertility preservation", t("fertility-preservation")),
    " (egg or embryo freezing) is used by those who want to bank eggs before cancer treatment or before age reduces egg quality. Your consultant will discuss which, if any, additions are warranted in your specific situation.",
  ),

  /* ══════════════════════════════════════════════════════════════════
   * Choosing section
   * ══════════════════════════════════════════════════════════════════ */
  h2("Choosing the right IVF treatment"),
  decisionList,

  /* ══════════════════════════════════════════════════════════════════
   * Conclusion — graphical panel + text
   * ══════════════════════════════════════════════════════════════════ */
  h2("Conclusion"),
  conclusionPanel,

  para("Choosing the right IVF treatment is one of the most consequential decisions you will make on your fertility journey — and it is one you should never have to make alone or without expert guidance. As this guide shows, each of the eight approaches has clearly defined clinical indications, and for many couples the ideal protocol combines elements of two or three of them: for example, ICSI combined with PGT-A followed by FET, or donor IVF with a gestational surrogate."),
  rPara(
    "At Bavishi Fertility Institute, every treatment plan begins with a thorough diagnostic assessment: AMH level, antral follicle count, full semen analysis, uterine evaluation, and — where relevant — genetic carrier screening. We have helped over 30,000 families have children across our 14+ centres. Our commitment is to honest, evidence-based communication about realistic success rates, and to keeping every appropriate option available to you as your treatment evolves.",
  ),
  rPara(
    "If you have been trying to conceive for more than a year without success — or for more than six months if you are 35 or older — ",
    lnk("book a specialist consultation", "/contact"),
    ". Bring any investigation results you already have: blood tests, ultrasound reports, semen analysis. Our team will give you a clear, personalised picture of where to start and what your realistic chances of success look like with each option.",
  ),
];

/* ══════════════════════════════════════════════════════════════════════
 * Main — update blog content + author attribution
 * ══════════════════════════════════════════════════════════════════════ */
async function main() {
  const payload = await getPayload({ config });

  /* ── Update Dr. Himanshu Bavishi's author record ── */
  await payload.update({
    collection: "authors",
    id: 2,
    data: {
      credentials: "MBBS, MD (Obstetrics & Gynaecology), DNB",
      role: "Director & IVF Specialist",
    },
  });
  console.log("✅ Updated Dr. Himanshu Bavishi author record.");

  /* ── Find and update the blog ── */
  const existing = await payload.find({
    collection: "blogs",
    where: { slug: { equals: SLUG } },
    limit: 1,
  });
  const doc = existing.docs[0];
  if (!doc) throw new Error(`Blog not found: ${SLUG}`);

  const existingRoot = (doc.content as Record<string, unknown>).root as Record<string, unknown>;

  await payload.update({
    collection: "blogs",
    id: doc.id,
    data: {
      content: { root: { ...existingRoot, children: CHILDREN } } as never,
      author: 3,       // Dr. Parth Bavishi
      reviewedBy: 2,   // Dr. Himanshu Bavishi
    },
  });

  console.log(`✅ Blog #${doc.id} updated — author: Dr. Parth Bavishi, reviewer: Dr. Himanshu Bavishi.`);
  console.log(`   View at: http://localhost:3000/blog/${SLUG}`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
