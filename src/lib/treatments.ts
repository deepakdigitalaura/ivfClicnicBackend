/* =====================================================================
 * Treatment framework — data model + registry
 * ---------------------------------------------------------------------
 * Drives the reusable <TreatmentPage> template. A new treatment page =
 * one Treatment object; no bespoke JSX. This is what makes 100+ treatment
 * pages tractable while guaranteeing every one ships the same SEO/EEAT/GEO
 * surface: definitional intro, structured process, risks, FAQs, a named
 * medical reviewer, and real Doctor/Location internal links.
 *
 * TREATMENTS_REGISTRY is the lightweight name↔href map used for internal
 * linking from related-treatment chips and doctor pages. Entries whose page
 * is not built yet point at the treatments hub (planned), but the LINK
 * STRUCTURE is real today so crawl paths exist the moment a page lands.
 * ===================================================================== */

import type { LucideIcon } from "lucide-react";
import {
  ClipboardCheck, Syringe, Microscope, Dna, HeartPulse, ShieldCheck,
  FlaskConical, Sparkles, Award, Layers, Snowflake, Leaf, Baby,
  Zap, Magnet, Eye, Target, Activity, Filter, Droplets, Egg, ScanLine,
  Beaker, Stethoscope, ListChecks,
} from "lucide-react";
import { SITE, ORG_ID, WEBSITE_ID, abs, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { doctorBySlug, reviewerNode, physicianSchema } from "@/lib/doctors";

export type TreatmentRef = { slug: string; name: string; href: string };

/** name + canonical href for every treatment we link to. */
export const TREATMENTS_REGISTRY: Record<string, TreatmentRef> = {
  ivf: { slug: "ivf", name: "IVF", href: "/what-is-ivf" },
  icsi: { slug: "icsi", name: "ICSI", href: "/icsi-treatment-intracytoplasmic-sperm-injection" },
  iui: { slug: "iui", name: "IUI", href: "/intra-uterine-insemination-iui" },
  picsi: { slug: "picsi", name: "PICSI", href: "/physiological-intracytoplasmic-sperm-injection-picsi" },
  imsi: { slug: "imsi", name: "IMSI", href: "/intracytoplasmic-morphologically-selected-sperm-injection-imsi" },
  macs: { slug: "macs", name: "MACS", href: "/magnetic-activated-cell-sorting-macs" },
  "spindle-view-icsi": { slug: "spindle-view-icsi", name: "Spindle View ICSI", href: "/spindle-view-icsi" },
  "blastocyst-transfer": { slug: "blastocyst-transfer", name: "Blastocyst Transfer", href: "/blastocyst-culture-blastocyst-transfer" },
  "laser-hatching": { slug: "laser-hatching", name: "Laser Assisted Hatching", href: "/laser-assisted-hatching" },
  "ivf-failure": { slug: "ivf-failure", name: "IVF Failure", href: "/ivf-failure" },
  "egg-donation": { slug: "egg-donation", name: "Egg Donation", href: "/egg-donation" },
  "sperm-donation": { slug: "sperm-donation", name: "Sperm Donation", href: "/sperm-donation" },
  "embryo-donation": { slug: "embryo-donation", name: "Embryo Donation", href: "/embryo-donation" },
  "male-infertility": { slug: "male-infertility", name: "Male Infertility", href: "/#treatments" },
  "female-infertility": { slug: "female-infertility", name: "Female Infertility", href: "/#treatments" },
  "fertility-preservation": { slug: "fertility-preservation", name: "Fertility Preservation", href: "/#treatments" },
  endometriosis: { slug: "endometriosis", name: "Endometriosis", href: "/endometriosis" },
  azoospermia: { slug: "azoospermia", name: "Zero Sperm Count (Azoospermia)", href: "/azoospermia" },
  cryopreservation: { slug: "cryopreservation", name: "Cryopreservation", href: "/cryopreservation" },
  "recurrent-miscarriage": { slug: "recurrent-miscarriage", name: "Recurrent Miscarriage", href: "/#treatments" },
  // Male Infertility
  oligospermia: { slug: "oligospermia", name: "Low Sperm Count (Oligospermia)", href: "/oligospermia" },
  asthenospermia: { slug: "asthenospermia", name: "Low Sperm Motility (Asthenospermia)", href: "/asthenospermia" },
  "surgical-sperm-retrieval": { slug: "surgical-sperm-retrieval", name: "Surgical Sperm Retrieval", href: "/surgical-sperm-retrieval" },
  varicocele: { slug: "varicocele", name: "Varicocele", href: "/varicocele" },
  "erectile-dysfunction": { slug: "erectile-dysfunction", name: "Erectile Dysfunction", href: "/erectile-dysfunction" },
  // Female Infertility
  "conceive-naturally": { slug: "conceive-naturally", name: "Conceive Naturally", href: "/conceive-naturally" },
  "prp-infertility": { slug: "prp-infertility", name: "PRP Infertility", href: "/prp-infertility" },
  pcos: { slug: "pcos", name: "PCOS", href: "/pcos" },
  "ovarian-reserve": { slug: "ovarian-reserve", name: "Poor Ovarian Reserve / Low AMH", href: "/ovarian-reserve" },
  "ovarian-rejuvenation": { slug: "ovarian-rejuvenation", name: "Ovarian Rejuvenation", href: "/ovarian-rejuvenation" },
  fibroids: { slug: "fibroids", name: "Fibroids", href: "/fibroids" },
};

export const treatmentRef = (slug: string): TreatmentRef =>
  TREATMENTS_REGISTRY[slug] ?? { slug, name: slug, href: "/#treatments" };

/* ---------- Treatment cards (homepage-style card data) ----------
 * Icon + one-line description per treatment slug, so the homepage card design
 * can be reused anywhere a list of treatment slugs needs to render as cards
 * (e.g. the "Treatments offered" section on centre pages). */
export type TreatmentCardData = TreatmentRef & { icon: LucideIcon; desc: string };

const TREATMENT_CARD_META: Record<string, { icon: LucideIcon; desc: string }> = {
  ivf: { icon: FlaskConical, desc: "Advanced in-vitro fertilisation with ICSI for the best chance of success." },
  icsi: { icon: Microscope, desc: "A single healthy sperm injected directly into each mature egg." },
  iui: { icon: Activity, desc: "Intrauterine insemination for select fertility profiles." },
  picsi: { icon: Filter, desc: "Physiological sperm selection for healthier fertilisation." },
  imsi: { icon: Eye, desc: "High-magnification sperm selection for better embryos." },
  macs: { icon: Magnet, desc: "Magnetic sorting to select the healthiest sperm." },
  "spindle-view-icsi": { icon: ScanLine, desc: "Spindle imaging for precise, safer ICSI." },
  "blastocyst-transfer": { icon: Layers, desc: "Day-5 blastocyst culture for stronger implantation." },
  "laser-hatching": { icon: Zap, desc: "Laser-assisted hatching to aid embryo implantation." },
  "ivf-failure": { icon: ShieldCheck, desc: "Specialised work-up and a fresh plan after failed IVF." },
  "egg-donation": { icon: Egg, desc: "Carefully matched, fully-screened egg-donor programme." },
  "sperm-donation": { icon: Droplets, desc: "Screened, ethical donor-sperm programme." },
  "embryo-donation": { icon: Baby, desc: "A compassionate donor-embryo path to parenthood." },
  "male-infertility": { icon: Stethoscope, desc: "Comprehensive evaluation and treatment for male factors." },
  "female-infertility": { icon: HeartPulse, desc: "Personalised pathways for every female fertility concern." },
  "fertility-preservation": { icon: Snowflake, desc: "Egg, sperm and embryo freezing for the future." },
  pgt: { icon: Dna, desc: "Pre-implantation genetic testing for healthier embryos." },
  endometriosis: { icon: HeartPulse, desc: "Specialised endometriosis and fertility care." },
  azoospermia: { icon: Microscope, desc: "Sperm retrieval and ICSI for a zero sperm count." },
  oligospermia: { icon: Beaker, desc: "Diagnosis and treatment for a low sperm count." },
  asthenospermia: { icon: Activity, desc: "Improving and bypassing poor sperm motility." },
  "surgical-sperm-retrieval": { icon: Target, desc: "PESA, TESA & Micro-TESE sperm retrieval for ICSI." },
  varicocele: { icon: ShieldCheck, desc: "Microsurgical repair of fertility-affecting varicocele." },
  "erectile-dysfunction": { icon: HeartPulse, desc: "Confidential ED care with fertility support." },
  "conceive-naturally": { icon: Leaf, desc: "Timing, lifestyle and support to conceive naturally." },
  "prp-infertility": { icon: Droplets, desc: "Ovarian & endometrial PRP in selected cases." },
  pcos: { icon: Activity, desc: "Ovulation-focused care for PCOS fertility." },
  "ovarian-reserve": { icon: Egg, desc: "Tailored protocols for low AMH / low egg count." },
  "ovarian-rejuvenation": { icon: Sparkles, desc: "Ovarian PRP to support a very low reserve." },
  fibroids: { icon: ShieldCheck, desc: "Fertility-preserving treatment of uterine fibroids." },
  cryopreservation: { icon: Snowflake, desc: "Safe long-term freezing of eggs, sperm and embryos." },
  "recurrent-miscarriage": { icon: ShieldCheck, desc: "Evaluation and care for repeated pregnancy loss." },
};

/** Merge name/href + icon/description into one card-ready object for a slug. */
export const treatmentCardData = (slug: string): TreatmentCardData => {
  const ref = treatmentRef(slug);
  const meta = TREATMENT_CARD_META[slug];
  return {
    ...ref,
    icon: meta?.icon ?? Sparkles,
    desc: meta?.desc ?? `Expert ${ref.name} care at Bavishi Fertility Institute.`,
  };
};

/* ---------- Framework types ---------- */

export type Heading = { lead: string; em?: string };
export type IconCard = { icon: LucideIcon; t: string; d: string };

export type Treatment = {
  slug: string;
  href: string;
  name: string;
  shortName: string;
  alternateName?: string;
  breadcrumbName: string;
  meta: { title: string; description: string; ogImage: string };
  /** schema.org MedicalProcedure fields. */
  procedure: {
    procedureType?: string;
    bodyLocation?: string;
    howPerformed?: string;
    followup?: string;
  };
  lastReviewed: string;
  reviewerSlug: string;
  hero: { eyebrow: string; h1: string; h1Em: string; tagline: string; badges: string[]; image: string; imageAlt: string };
  whatIs: { heading: Heading; paragraphs: string[]; aside?: { title: string; body: string } };
  benefits: { heading: Heading; subtitle?: string; items: string[] };
  types?: { heading: Heading; subtitle?: string; items: IconCard[] };
  whoNeedsIt: { heading: Heading; subtitle?: string; items: string[] };
  process: { heading: Heading; subtitle?: string; steps: { icon: LucideIcon; n: string; t: string; d: string }[]; note?: string };
  timeline?: { heading: Heading; subtitle?: string; items: { day: string; t: string; d: string }[]; chips?: string[]; chipsNote?: string };
  video?: { id: string; title: string; description: string; eyebrow: string; heading: Heading };
  technology?: { heading: Heading; eyebrow?: string; subtitle?: string; items: IconCard[] };
  whyUs?: { heading: Heading; items: IconCard[] };
  success: { factors: string[]; note?: string };
  cost: { includes: string[] };
  risks: { heading: Heading; subtitle?: string; items: { t: string; d: string; help: string }[] };
  preparation?: { heading: Heading; subtitle?: string; items: string[] };
  faqs: { q: string; a: string }[];
  related: string[];
  cta: { heading: string; headingEm: string; subtitle?: string };
};

/* ===================================================================== */
/* IVF — the reference implementation of the framework                    */
/* ===================================================================== */

export const ivf: Treatment = {
  slug: "ivf",
  href: "/what-is-ivf",
  name: "IVF Treatment",
  shortName: "IVF",
  alternateName: "Test Tube Baby",
  breadcrumbName: "IVF Treatment",
  meta: {
    title: "IVF Treatment (In Vitro Fertilization) — Bavishi Fertility Institute",
    description:
      "What is IVF? Learn how In Vitro Fertilization works step by step, who needs it, success factors and costs. India's trusted IVF specialists since 1984 — 30,000+ pregnancies, Class 1000 labs.",
    ogImage: "/assets/hero-mother-baby1.png",
  },
  procedure: {
    procedureType: "https://schema.org/NoninvasiveProcedure",
    bodyLocation: "Uterus",
    howPerformed:
      "Eggs are retrieved from the ovaries after controlled stimulation, fertilised with sperm in the laboratory (usually by ICSI), cultured into embryos, and the best embryo is transferred into the uterus.",
    followup: "A Beta-HCG blood test is performed about 13–15 days after embryo transfer to confirm pregnancy.",
  },
  lastReviewed: "2026-06-01",
  reviewerSlug: "himanshu-bavishi",
  hero: {
    eyebrow: "Advanced IVF Treatment",
    h1: "IVF Treatment",
    h1Em: "In Vitro Fertilization at Bavishi Fertility Institute",
    tagline:
      "India's trusted IVF specialists since 1984 — 30,000+ successful pregnancies, Class 1000 IVF labs, and the Suraksha Kavach promise. Personalised, transparent and compassionate fertility care, every step of the way.",
    badges: ["30,000+ Pregnancies", "Since 1984", "Class 1000 Labs", "National Fertility Award 5×"],
    image: "/assets/ivf-icsi.png",
    imageAlt:
      "IVF / ICSI — sperm microinjection into an egg under the microscope at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "In Vitro Fertilization?" },
    paragraphs: [
      "In Vitro Fertilization (IVF) is an assisted-reproduction technique in which an egg is fertilised by sperm in a laboratory, and the resulting embryo is placed into the woman's uterus. \"In vitro\" means \"outside the body\" — so eggs are retrieved, fertilised and grown in the lab, and the best embryos are then transferred to achieve pregnancy.",
      "Popularly known as the \"test-tube baby\" technique, IVF is today one of the most successful fertility treatments in the world — more than 5 million healthy babies have been born through IVF, and that number is rising every year. It is the right choice when simpler treatments have not worked, or when specific medical conditions make natural conception difficult.",
    ],
    aside: {
      title: "About Bavishi Fertility Institute",
      body: "Bavishi Fertility Institute is one of India's leading fertility clinic chains, operating since 1984 with 15 centres across 8 cities. Bavishi Fertility Institute has achieved 30,000+ successful IVF pregnancies, holds the National Fertility Award for five consecutive years (2021–2025), and is FOGSI-certified — pioneering IVF clinic in India and running Class 1000 embryology labs.",
    },
  },
  benefits: {
    heading: { lead: "The advantages of", em: "IVF" },
    subtitle:
      "Beyond helping you conceive, IVF gives your specialist powerful tools to maximise your chances safely.",
    items: [
      "Know the number and quality of your embryos before transfer.",
      "Select and transfer only the best-quality embryo(s).",
      "Freeze surplus embryos for the future by vitrification (~100% survival).",
      "Apply advanced fertilisation techniques such as ICSI when needed.",
      "Carry out genetic testing (PGT) on embryos where indicated.",
    ],
  },
  types: {
    heading: { lead: "IVF and its", em: "related techniques" },
    subtitle:
      "Your treatment is tailored to your diagnosis — using the technique most likely to succeed for you.",
    items: [
      { icon: FlaskConical, t: "Conventional IVF", d: "Eggs and sperm are combined in the lab and fertilisation happens on its own." },
      { icon: Microscope, t: "ICSI", d: "A single healthy sperm is injected directly into each mature egg — used for all couples at Bavishi Fertility Institute." },
      { icon: Layers, t: "Blastocyst Transfer", d: "Embryos are grown to day 5–6 (blastocyst) before transfer, for stronger selection." },
      { icon: Snowflake, t: "Frozen Embryo Transfer", d: "Surplus embryos are vitrified and transferred in a later cycle, with close to 100% thaw survival." },
      { icon: Leaf, t: "Natural IVF Cycle", d: "Uses your body's natural cycle with minimal medication to retrieve a single egg." },
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who needs", em: "IVF treatment?" },
    subtitle:
      "Your specialist may recommend IVF in any of the following situations. A thorough evaluation always comes first, so your plan is tailored to you.",
    items: [
      "Blocked, damaged or absent fallopian tubes (including hydrosalpinx)",
      "Advanced endometriosis or chocolate cysts",
      "Low ovarian reserve, low egg count or advanced maternal age",
      "Low sperm count, low motility or a high percentage of abnormally-shaped sperm",
      "Severe male factor including azoospermia (needing TESA / PESA / Micro-TESE)",
      "Failed IUI or ovulation-induction cycles",
      "Unexplained infertility",
      "Need for donor eggs, donor sperm or surrogacy",
      "Prevention of inherited genetic disorders (e.g. thalassemia) via PGT",
    ],
  },
  process: {
    heading: { lead: "The IVF process at", em: "Bavishi Fertility Institute" },
    subtitle:
      "From your first consultation to your pregnancy test, every stage is handled with precision, safety and care.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Pre-treatment Evaluation", d: "Before starting, both partners are thoroughly evaluated to optimise the outcome — semen analysis and blood tests for the male partner, and consultation, 3D sonography, hormone tests and (if indicated) hysteroscopy for the female partner." },
      { icon: Syringe, n: "02", t: "Ovarian Stimulation", d: "After your period, a customised dose of gonadotropin hormones (FSH/HMG) is given as a small daily injection for about 7–12 days to grow multiple mature eggs, with regular ultrasound monitoring. A precise 'trigger' injection then matures the eggs for retrieval." },
      { icon: Microscope, n: "03", t: "Egg Retrieval & Fertilization", d: "34–36 hours after the trigger, eggs are retrieved through the vagina under short sedation — no cut, no stitch, and you go home in about 2 hours. The same day, the best sperm are selected and each mature egg is fertilised by ICSI in our Class 1000 IVF lab." },
      { icon: Dna, n: "04", t: "Embryo Culture & Transfer", d: "Embryos are grown in next-generation incubators that mimic the body. Two to six days later, the best-quality embryo(s) are gently transferred into the uterus. Surplus embryos can be frozen by vitrification — with close to 100% survival at Bavishi Fertility Institute." },
      { icon: HeartPulse, n: "05", t: "Pregnancy Test", d: "About 13–15 days after embryo transfer, a Beta-HCG blood test confirms pregnancy. From egg formation to transfer, the active treatment usually takes just 12–17 days." },
    ],
    note: "Active treatment — egg formation to embryo transfer — typically takes just 12–17 days.",
  },
  timeline: {
    heading: { lead: "Your IVF cycle,", em: "day by day" },
    subtitle:
      "From egg formation to embryo transfer, the active treatment usually takes just 12–17 days.",
    items: [
      { day: "Day 1–12", t: "Ovarian stimulation", d: "Daily hormone injections grow multiple eggs, with regular ultrasound monitoring." },
      { day: "Trigger", t: "Final maturation", d: "A precise trigger injection matures the eggs ahead of retrieval." },
      { day: "34–36 hrs later", t: "Egg retrieval", d: "Eggs are collected through the vagina under short sedation — no cut, no stitch." },
      { day: "Same day", t: "Fertilisation (ICSI)", d: "The best sperm are selected and injected into each mature egg." },
      { day: "Day 2–6", t: "Embryo culture & transfer", d: "The best embryo(s) are transferred; surplus embryos are frozen." },
      { day: "Day 13–15", t: "Pregnancy test", d: "A Beta-HCG blood test confirms pregnancy." },
    ],
    chips: [
      "Antagonist (Short) protocol",
      "Down-regulation (Long) protocol",
      "Flare protocol",
      "Dual stimulation protocol",
      "Minimum stimulation protocol",
    ],
    chipsNote:
      "Your stimulation is fully personalised — your specialist selects the protocol best suited to your body and history:",
  },
  video: {
    id: "owOgXgCQTX0",
    title: "Why IVF? — Dr. Himanshu Bavishi",
    description:
      "Dr. Himanshu Bavishi explains who IVF is for, how it works and what to expect — so you can take your next step with clarity and confidence.",
    eyebrow: "Watch & Learn",
    heading: { lead: "Why IVF?", em: "Explained by our experts" },
  },
  technology: {
    heading: { lead: "The science behind", em: "your success" },
    subtitle: "World-class infrastructure and embryology that protect your embryos at every step.",
    items: [
      { icon: FlaskConical, t: "Class 1000 IVF Lab", d: "Air purity 10× cleaner than the international Class 10,000 standard — protecting embryos at every moment." },
      { icon: Microscope, t: "Body-like Incubators", d: "Next-generation incubators recreate the body's exact environment to grow healthy embryos." },
      { icon: Snowflake, t: "Vitrification", d: "Ultra-fast freezing of surplus embryos with close to 100% survival on thawing." },
      { icon: Dna, t: "ICSI & PGT", d: "Microinjection for every couple, plus pre-implantation genetic testing where indicated." },
    ],
  },
  whyUs: {
    heading: { lead: "Why choose Bavishi Fertility Institute for", em: "your IVF?" },
    items: [
      { icon: FlaskConical, t: "Class 1000 IVF Labs", d: "Air purity 10× cleaner than the international Class 10,000 standard — protecting your embryos at every moment." },
      { icon: Microscope, t: "ICSI for All", d: "Microinjection for every couple gives the maximum chance of fertilisation and minimises the risk of total fertilisation failure." },
      { icon: Sparkles, t: "Customised Protocols", d: "Tailor-made stimulation and our 'trigger it right' strategy retrieve the best number of best-quality eggs, safely." },
      { icon: ShieldCheck, t: "Suraksha Kavach", d: "India's trusted IVF protection programme — financial assurance and peace of mind on your journey to parenthood." },
      { icon: Award, t: "Proven & Awarded", d: "30,000+ pregnancies since 1984 and the National Fertility Award for five consecutive years (2021–2025)." },
      { icon: HeartPulse, t: "One-Stop Care", d: "Tests, surgery, embryology and treatment under one roof — with safe-stimulation protocols designed to avoid severe OHSS." },
    ],
  },
  success: {
    factors: [
      "Woman's age",
      "Embryo quality",
      "Number of embryos transferred",
      "Previous fertility history",
      "Egg & sperm health",
      "Overall reproductive health",
    ],
    note: "Success rates vary by age, diagnosis and individual medical factors.",
  },
  cost: {
    includes: [
      "Detailed treatment plan",
      "Clear pricing breakdown",
      "No hidden charges",
      "Easy / interest-free EMI options",
      "Personalised consultation",
      "Suraksha Kavach eligibility guidance",
    ],
  },
  risks: {
    heading: { lead: "Honest about the risks — and", em: "how we manage them" },
    subtitle:
      "IVF is very safe in expert hands. Here's what to be aware of — and how Bavishi Fertility Institute keeps you protected at every step.",
    items: [
      { t: "Multiple pregnancy", d: "Transferring more than one embryo can lead to twins or triplets.", help: "We favour elective single-embryo transfer wherever it's appropriate." },
      { t: "Ovarian Hyperstimulation (OHSS)", d: "Fertility medicines can occasionally over-stimulate the ovaries.", help: "Safe-stimulation protocols — with zero severe OHSS in over 10 years." },
      { t: "Ectopic pregnancy", d: "Rarely, an embryo implants outside the uterus.", help: "Early monitoring and Beta-HCG follow-up to detect it promptly." },
      { t: "Egg-retrieval risks", d: "As with any procedure, minor risks exist.", help: "A short, sedated, no-cut/no-stitch procedure by experienced specialists." },
      { t: "Emotional well-being", d: "Treatment can be an emotional journey.", help: "Counselling and compassionate support at every step." },
      { t: "Cost considerations", d: "IVF is an investment in your family.", help: "Transparent pricing, interest-free EMI and the Suraksha Kavach package." },
    ],
  },
  preparation: {
    heading: { lead: "Simple ways to", em: "prepare for your cycle" },
    subtitle:
      "Small, healthy steps can support your treatment. Your specialist will personalise this guidance for you.",
    items: [
      "Eat a balanced diet rich in fruits, vegetables, whole grains and lean protein.",
      "Stay well hydrated throughout the day.",
      "Exercise regularly and maintain a healthy weight.",
      "Avoid smoking and excessive alcohol.",
      "Take supplements only as advised by your doctor.",
      "Complete your pre-treatment evaluations and follow your clinic's guidance.",
    ],
  },
  faqs: [
    { q: "What is IVF (In Vitro Fertilization)?", a: "IVF is an assisted-reproduction technique in which eggs are retrieved from the ovaries, fertilised by sperm in a laboratory, and the resulting embryo is transferred into the uterus to achieve pregnancy." },
    { q: "How long should a couple try before considering IVF?", a: "Generally about one year of trying if the woman is under 35, or six months if she is 35 or older. With known fertility issues — or if the woman is over 40 — it is wise to consult a specialist sooner." },
    { q: "What is the difference between IVF and ICSI?", a: "In conventional IVF, eggs and sperm are mixed in a dish. In ICSI, a single healthy sperm is injected directly into each egg. ICSI is preferred for male-factor infertility or previous fertilisation failure — at Bavishi Fertility Institute we use ICSI for all couples." },
    { q: "How does age affect IVF success?", a: "Age is the single biggest factor — younger women generally have higher success rates. For older patients, options such as donor eggs, previously-frozen embryos or advanced IVF techniques can improve the chances." },
    { q: "How long does one IVF cycle take?", a: "From the start of stimulation to embryo transfer, the active treatment usually takes about 12–17 days, plus the pre-treatment evaluation beforehand." },
    { q: "Is egg retrieval painful?", a: "No. Egg retrieval is a short, painless procedure done through the vagina under light sedation — with no cut and no stitch. Most patients go home within about two hours." },
    { q: "How much does IVF cost at Bavishi Fertility Institute?", a: "Cost depends on your diagnosis, the protocol and any add-ons such as ICSI, PGT or donor programmes. Bavishi Fertility Institute offers transparent pricing with no hidden costs, easy / interest-free EMI and the Suraksha Kavach package. Book a free consultation for a personalised estimate." },
    { q: "Does Bavishi Fertility Institute offer a money-back guarantee for IVF?", a: "Yes — through the Suraksha Kavach programme, which provides financial protection and assurance on your fertility journey. Speak to our team to see if you qualify." },
    { q: "Which is the best IVF centre in India?", a: "Bavishi Fertility Institute is one of India's most trusted IVF chains — operating since 1984 across 15 centres in 8 cities, with 30,000+ successful pregnancies and the National Fertility Award for five consecutive years." },
    { q: "What lifestyle changes should I make before starting IVF?", a: "Focus on a healthy lifestyle — a balanced diet, regular exercise, maintaining a healthy weight, and avoiding smoking and excessive alcohol. Your specialist will give you any additional, personalised advice during your consultation." },
    { q: "Are there any dietary recommendations during IVF?", a: "There are no strict restrictions, but a balanced diet rich in fruits, vegetables, whole grains and lean proteins is recommended, along with good hydration. Follow any specific guidance your clinic provides for your treatment." },
    { q: "What is embryo grading?", a: "Embryo grading assesses the quality of embryos based on their appearance and development. Higher-grade embryos are more likely to implant successfully, which is why our embryologists select the best-quality embryo(s) for transfer." },
    { q: "Can single individuals have a baby through IVF?", a: "Yes. IVF can be used by single individuals — with sperm collection for men, or donor sperm for women — and, where needed, a gestational carrier. Our team will explain the options available to you." },
  ],
  related: [
    "icsi", "iui", "picsi", "imsi", "macs", "spindle-view-icsi",
    "blastocyst-transfer", "laser-hatching", "ivf-failure",
    "male-infertility", "female-infertility", "fertility-preservation",
    "pgt", "egg-donation", "surrogacy", "recurrent-miscarriage",
  ],
  cta: {
    heading: "Ready to begin your",
    headingEm: "IVF journey?",
    subtitle: "Speak with our fertility experts today — confidential, compassionate and complimentary.",
  },
};

/* ===================================================================== */
/* Shared building blocks reused across treatment pages                   */
/* ===================================================================== */

const STD_COST = [
  "Detailed treatment plan",
  "Clear pricing breakdown",
  "No hidden charges",
  "Easy / interest-free EMI options",
  "Personalised consultation",
  "Suraksha Kavach eligibility guidance",
];

const STD_PREP = [
  "Eat a balanced diet rich in fruits, vegetables, whole grains and lean protein.",
  "Stay well hydrated and maintain a healthy weight.",
  "Exercise regularly, within your specialist's guidance.",
  "Avoid smoking, tobacco and excessive alcohol.",
  "Manage stress with adequate rest, yoga or counselling.",
  "Take medicines and supplements only as advised by your doctor.",
];

const WHY_BAVISHI_FERTILITY_INSTITUTE: IconCard[] = [
  { icon: FlaskConical, t: "Class 1000 IVF Labs", d: "Air purity 10× cleaner than the international Class 10,000 standard — protecting your embryos at every moment." },
  { icon: Microscope, t: "Skilled Embryology", d: "An in-house team of experienced embryologists performs every micro-manipulation with precision." },
  { icon: Award, t: "Proven & Awarded", d: "30,000+ pregnancies since 1984 and the National Fertility Award for five consecutive years (2021–2025)." },
  { icon: ShieldCheck, t: "Suraksha Kavach", d: "India's trusted IVF protection programme — financial assurance and peace of mind on your journey." },
  { icon: HeartPulse, t: "One-Stop Care", d: "Tests, surgery, embryology and treatment under one roof, with transparent, honest counselling." },
  { icon: Sparkles, t: "Personalised Plans", d: "Tailor-made protocols and add-on techniques recommended only when they genuinely help you." },
];

/* ===================================================================== */
/* 1. IVF Failure                                                         */
/* ===================================================================== */

export const ivfFailure: Treatment = {
  slug: "ivf-failure",
  href: "/ivf-failure",
  name: "IVF Failure — Diagnosis & Treatment",
  shortName: "IVF Failure",
  breadcrumbName: "IVF Failure",
  meta: {
    title: "IVF Failure — Causes & What to Do Next | Bavishi Fertility Institute",
    description:
      "Why does IVF fail, and what happens next? A systematic, stage-by-stage analysis of a failed IVF cycle at Bavishi Fertility Institute — embryo, uterine and maternal factors investigated honestly.",
    ogImage: "/assets/hero-mother-baby1.png",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Uterus",
    howPerformed:
      "A previous failed IVF cycle is divided into stages — stimulation, fertilisation, embryo development, implantation and maternal factors — and each is investigated thoroughly to identify the cause and refine the next plan.",
    followup: "A personalised next-cycle plan is prepared once the contributing factors are identified.",
  },
  lastReviewed: "2026-06-01",
  reviewerSlug: "himanshu-bavishi",
  hero: {
    eyebrow: "Advanced IVF Treatment",
    h1: "Failed IVF Cycle?",
    h1Em: "A systematic path forward at Bavishi Fertility Institute",
    tagline:
      "A failed cycle is not the end of the road. At Bavishi Fertility Institute we analyse each stage of the previous cycle to understand what happened — and then build a clearer, more personalised plan for your next attempt.",
    badges: ["Stage-by-stage analysis", "Since 1984", "Class 1000 Labs", "Advanced diagnostics"],
    image: "/assets/treatments/Ivf-Failure.png",
    imageAlt: "A hopeful couple — moving forward after a failed IVF cycle with Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "Understanding", em: "IVF failure" },
    paragraphs: [
      "Couples undergoing IVF have good chances of conceiving in each attempt, but a cycle can still fail. IVF success depends both on patient factors and on clinic factors — which is why a careful review of a failed cycle is so important before trying again.",
      "Studies suggest IVF failure is related to the embryo in around 70% of cases and to the uterus or other factors in around 30%. At Bavishi Fertility Institute we take a systematic approach: the failed cycle is broken into small stages and each one is investigated thoroughly so the next plan is built on evidence, not guesswork.",
    ],
    aside: {
      title: "A meticulous, honest review",
      body: "Rather than simply repeating the same cycle, our specialists divide a failed cycle into fragments — stimulation, fertilisation, embryo quality, the uterus and maternal factors — and study each one. Where appropriate, advanced techniques such as PICSI, Spindle View ICSI, blastocyst culture, PGT and the ERA test are used to address the specific problem found.",
    },
  },
  benefits: {
    heading: { lead: "What a systematic review", em: "gives you" },
    subtitle: "The goal is simple — understand why the last cycle did not work, and change only what needs to change.",
    items: [
      "A clear, stage-by-stage analysis of the previous cycle.",
      "Targeted use of advanced techniques only where they address a real problem.",
      "Better embryo selection through blastocyst culture and PGT, where indicated.",
      "Improved transfer timing using the ERA test, where indicated.",
      "Assessment of maternal factors such as thrombophilia and chromosomal issues.",
    ],
  },
  types: {
    heading: { lead: "Tools we use to", em: "investigate failure" },
    subtitle: "Each is applied selectively, based on what the analysis of your previous cycle reveals.",
    items: [
      { icon: Target, t: "PICSI", d: "Selects sperm able to naturally bind the egg's outer surface, for cases of poor fertilisation." },
      { icon: Eye, t: "Spindle View ICSI", d: "A Polscope assesses egg quality and helps achieve better fertilisation." },
      { icon: Layers, t: "Blastocyst Culture", d: "Extended culture to day 5–6 helps select the strongest embryos for transfer." },
      { icon: Dna, t: "PGT", d: "Screens embryos for genetic abnormalities that commonly cause failed implantation or miscarriage." },
      { icon: ScanLine, t: "ERA Test", d: "Studies the endometrium's gene expression to find the best time for embryo transfer." },
      { icon: Stethoscope, t: "Hysteroscopy", d: "Directly inspects the uterine cavity and endometrium for any correctable problem." },
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Common reasons for", em: "IVF failure" },
    subtitle: "Failure usually has an identifiable cause. A thorough review aims to find which factors applied in your case.",
    items: [
      "Genetic abnormalities in the embryos",
      "Poor embryo quality or arrested development",
      "Uterine abnormalities or endometrial receptivity issues",
      "Sub-optimal stimulation or very low egg yield",
      "Poor fertilisation despite ICSI",
      "Sperm DNA fragmentation",
      "Thrombophilia (blood-clotting disorders)",
      "Chromosomal imbalances in either parent",
      "Lifestyle and general health factors",
    ],
  },
  process: {
    heading: { lead: "How we analyse a", em: "failed cycle" },
    subtitle: "Each stage of the previous attempt is reviewed in turn, so nothing is missed.",
    steps: [
      { icon: Syringe, n: "01", t: "Stimulation review", d: "We assess the number and quality of eggs recovered, and whether a different protocol — long, short, microdose flare, minimum-stimulation, or dual stimulation 'DuoStim' — may suit you better." },
      { icon: Microscope, n: "02", t: "Fertilisation review", d: "Where fertilisation was poor, sperm DNA fragmentation testing, PICSI and Spindle View ICSI help identify and address the cause." },
      { icon: Layers, n: "03", t: "Embryo selection", d: "Blastocyst culture shows which embryos are genuinely strong, while PGT screens for the genetic abnormalities common even in good-looking embryos." },
      { icon: ScanLine, n: "04", t: "Uterine evaluation", d: "Hysteroscopy checks the uterine cavity and endometrium, and the ERA test helps determine the best time for transfer." },
      { icon: ListChecks, n: "05", t: "Maternal factors", d: "Blood tests for thrombophilia and chromosomal analysis of both partners complete the picture before the next plan is made." },
    ],
  },
  whyUs: {
    heading: { lead: "Why bring a failed cycle to", em: "Bavishi Fertility Institute" },
    items: WHY_BAVISHI_FERTILITY_INSTITUTE,
  },
  success: {
    factors: [
      "Cause identified in the previous cycle",
      "Embryo and egg quality",
      "Uterine and endometrial health",
      "Woman's age",
      "Maternal (thrombophilia / genetic) factors",
      "Adherence to the revised plan",
    ],
    note: "Outcomes depend on the underlying cause, age and individual medical factors. No clinic can guarantee success.",
  },
  cost: { includes: STD_COST },
  risks: {
    heading: { lead: "Things to", em: "keep in mind" },
    subtitle: "We believe in being honest about what repeat treatment involves.",
    items: [
      { t: "No guarantee of success", d: "Even with a thorough review and the right changes, a subsequent cycle may not succeed.", help: "We focus on identifying and correcting the specific factors found, rather than promising outcomes." },
      { t: "Emotional impact", d: "Repeated treatment can be emotionally demanding.", help: "Infertility counselling and compassionate support are offered at every step." },
      { t: "Cost of added techniques", d: "Advanced diagnostics and techniques add to the cost.", help: "Transparent pricing, interest-free EMI and Suraksha Kavach guidance — and we recommend add-ons only when indicated." },
      { t: "Over-treatment", d: "Not every add-on helps every patient.", help: "Each technique is used selectively, based on what your cycle analysis actually shows." },
    ],
  },
  preparation: {
    heading: { lead: "Preparing for your", em: "next cycle" },
    subtitle: "Small, healthy steps support your treatment. Your specialist will personalise this for you.",
    items: STD_PREP,
  },
  faqs: [
    { q: "What are the common reasons for IVF failure?", a: "IVF failure can be attributed to various factors including genetic abnormalities, uterine abnormalities, poor embryo quality, endometrial receptivity issues, lifestyle and health factors, and immunological issues." },
    { q: "How does Bavishi Fertility Institute investigate a failed cycle?", a: "Bavishi Fertility Institute investigates failed IVF cycles by meticulously analysing each stage of the cycle — from stimulation and fertilisation to embryo quality and implantation — so the next plan addresses the specific problem found." },
    { q: "Which techniques can improve egg and embryo quality?", a: "Depending on the findings, Bavishi Fertility Institute may use Spindle View ICSI, PICSI and Preimplantation Genetic Testing (PGT), along with blastocyst culture for better embryo selection." },
    { q: "How important is embryo transfer timing?", a: "The timing of embryo transfer is important for implantation. Where indicated, it can be refined using the Endometrial Receptivity Array (ERA) test." },
    { q: "What is the role of genetic testing?", a: "Genetic testing helps identify and select genetically normal embryos, which can reduce the risk of miscarriage and improve implantation rates." },
    { q: "When can couples start another IVF cycle?", a: "Couples can consider starting another cycle as soon as they are ready and the review of the previous cycle is complete." },
    { q: "How can counselling help after a failed cycle?", a: "Infertility counselling provides a safe space for expressing emotions and developing coping strategies during what can be a difficult time." },
    { q: "What is the Suraksha Kavach package?", a: "The Suraksha Kavach package offers comprehensive protection by including advanced techniques and treatments as standard. Speak to our team to see if you qualify." },
  ],
  related: ["icsi", "picsi", "spindle-view-icsi", "blastocyst-transfer", "ivf", "recurrent-miscarriage"],
  cta: {
    heading: "Ready for a clearer",
    headingEm: "next step?",
    subtitle: "Bring your previous reports to a confidential, complimentary review with our fertility experts.",
  },
};

/* ===================================================================== */
/* 2. IUI                                                                 */
/* ===================================================================== */

export const iui: Treatment = {
  slug: "iui",
  href: "/intra-uterine-insemination-iui",
  name: "IUI Treatment (Intrauterine Insemination)",
  shortName: "IUI",
  alternateName: "Artificial Insemination",
  breadcrumbName: "IUI",
  meta: {
    title: "IUI Treatment (Intrauterine Insemination) — Bavishi Fertility Institute",
    description:
      "What is IUI? Learn how intrauterine insemination works, who it suits, success rates and what to expect. A simple, less invasive fertility treatment at Bavishi Fertility Institute, trusted since 1984.",
    ogImage: "/assets/hero-mother-baby1.png",
  },
  procedure: {
    procedureType: "https://schema.org/NoninvasiveProcedure",
    bodyLocation: "Uterus",
    howPerformed:
      "Specially prepared (washed) sperm is placed directly into the uterus at the time of ovulation using a thin, soft cannula, to increase the chance of fertilisation.",
    followup: "A pregnancy (blood or urine) test is performed about two weeks after the procedure.",
  },
  lastReviewed: "2026-06-01",
  reviewerSlug: "himanshu-bavishi",
  hero: {
    eyebrow: "Advanced IVF Treatment",
    h1: "IUI Treatment",
    h1Em: "Intrauterine Insemination at Bavishi Fertility Institute",
    tagline:
      "A simple, less invasive and more affordable fertility treatment. At the time of ovulation, specially prepared sperm is placed directly into the uterus to improve the chance of conception.",
    badges: ["Simple & non-surgical", "Since 1984", "Less invasive than IVF", "Personalised care"],
    image: "/assets/treatments/IUI.png",
    imageAlt: "Intrauterine insemination (IUI) at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Intrauterine Insemination?" },
    paragraphs: [
      "Intrauterine Insemination (IUI) is the procedure of placing a prime lot of specially prepared sperm inside the uterus at the time of ovulation (egg release). By positioning sperm directly within the uterus, close to the openings of the fallopian tubes, IUI bypasses the cervical barriers and improves the chance of conception.",
      "IUI is one of the most commonly recommended first-line fertility treatments. It is simple, less invasive and less expensive than IVF, and is often suggested for couples with mild male-factor infertility, cervical factors, ovulation issues or unexplained infertility before more advanced treatment is considered.",
    ],
    aside: {
      title: "Simple, and gentle on you",
      body: "IUI is usually painless — most women describe only mild discomfort, similar to a Pap smear. You rest for about ten minutes afterwards and can resume normal activities the same day. Typically 3–6 cycles are tried, but your doctor will tailor the advice to your situation.",
    },
  },
  video: {
    id: "kY0ZPqmuALM",
    title: "What is IUI? — Dr. Falguni Bavishi",
    description:
      "Dr. Falguni Bavishi explains what IUI is, who it suits and how it works — so you can take your next step with clarity and confidence.",
    eyebrow: "Watch & Learn",
    heading: { lead: "What is IUI?", em: "Explained by our experts" },
  },
  benefits: {
    heading: { lead: "The advantages of", em: "IUI" },
    subtitle: "For the right couple, IUI is an easy and sensible first step.",
    items: [
      "It is simple and non-surgical.",
      "It is less expensive than ART / IVF.",
      "It improves the probability of pregnancy compared with natural intercourse.",
      "It can use the partner's fresh sample, a frozen sample, or donor sperm where needed.",
      "Normal activities — including travel — can be resumed straight away.",
    ],
  },
  types: {
    heading: { lead: "Types of", em: "IUI" },
    items: [
      { icon: Leaf, t: "Natural-cycle IUI", d: "Timed to your own natural ovulation, without stimulation medicines." },
      { icon: Syringe, t: "Medicated IUI", d: "With tablets or injections to encourage ovulation and improve egg availability." },
      { icon: Snowflake, t: "Frozen-sample IUI", d: "Using a previously frozen semen sample when the partner is unavailable." },
      { icon: Baby, t: "Donor-sperm IUI", d: "Using screened donor sperm, for example in cases of azoospermia or for single women." },
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who is", em: "IUI suitable for?" },
    subtitle: "Your specialist may suggest IUI in any of the following situations, after a proper evaluation.",
    items: [
      "Mild male-factor infertility — low count, reduced motility or abnormal morphology",
      "Low semen volume or viscous semen",
      "Use of frozen or donor semen samples",
      "Ejaculation or sexual-function difficulties, or an absent partner",
      "Poor cervical mucus or cervical / immunological factors",
      "Ovulation problems",
      "Unexplained infertility",
    ],
  },
  process: {
    heading: { lead: "The IUI process at", em: "Bavishi Fertility Institute" },
    subtitle: "A straightforward, same-day procedure with careful timing.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Cycle monitoring", d: "Where needed, tablets or injections encourage ovulation. Transvaginal ultrasound tracks the developing follicles." },
      { icon: Syringe, n: "02", t: "Ovulation trigger", d: "An hCG injection triggers final egg maturation and ovulation, so the timing of insemination is precise." },
      { icon: Filter, n: "03", t: "Sperm preparation", d: "On the day, the semen sample is washed in the lab to remove unwanted material and separate the best motile, normally-shaped sperm." },
      { icon: Activity, n: "04", t: "Insemination", d: "Using a self-retaining speculum and aseptic precautions, the prepared sperm is gently injected into the uterus through a thin, soft cannula." },
      { icon: HeartPulse, n: "05", t: "Rest & pregnancy test", d: "You rest for about ten minutes and resume normal activities. A pregnancy test follows about two weeks later." },
    ],
    note: "The IUI procedure itself typically takes only a short time; the visit is usually about 1–2 hours.",
  },
  whyUs: {
    heading: { lead: "Why choose Bavishi Fertility Institute for", em: "your IUI?" },
    items: WHY_BAVISHI_FERTILITY_INSTITUTE,
  },
  success: {
    factors: [
      "Woman's age",
      "The underlying fertility diagnosis",
      "Use of ovulation-induction medication",
      "Sperm quality",
      "Overall health and lifestyle",
      "Number of cycles attempted",
    ],
    note: "On average, the success rate for IUI is about 10–20% per cycle, and more than one cycle is often needed. Rates vary with age and diagnosis.",
  },
  cost: { includes: STD_COST },
  risks: {
    heading: { lead: "Honest about the", em: "limitations" },
    subtitle: "IUI is gentle and safe, but it is important to understand what it can and cannot do.",
    items: [
      { t: "Lower success than IVF", d: "IUI has a lower success chance per cycle than higher-technology ART such as IVF.", help: "If IUI is not successful after a few cycles, we discuss moving to IVF at the right time." },
      { t: "Fertilisation is not assured", d: "Fertilisation happens inside the body, so it cannot be seen or guaranteed, and embryo quality cannot be assessed.", help: "Careful timing and sperm preparation give each cycle its best chance." },
      { t: "Needs enough motile sperm", d: "IUI requires a reasonable number of motile sperm to be effective.", help: "A semen analysis beforehand helps decide whether IUI or ICSI is the better option for you." },
      { t: "Minor procedural risks", d: "There is an uncommon risk of mild infection or spotting.", help: "Strict aseptic technique keeps this risk very low." },
    ],
  },
  preparation: {
    heading: { lead: "Simple ways to", em: "prepare" },
    subtitle: "Healthy habits support your treatment; your specialist will personalise this guidance.",
    items: STD_PREP,
  },
  faqs: [
    { q: "How long does the IUI process take?", a: "The IUI visit typically takes about 1 to 2 hours from start to finish; the insemination itself takes only a few minutes." },
    { q: "What is the difference between IUI and IVF?", a: "In IUI, prepared sperm is placed into the uterus near the time of ovulation — suitable for mild male-factor or cervical issues. In IVF, eggs are retrieved and fertilised in the laboratory and the embryo is transferred — used for more complex cases such as blocked tubes or severe male infertility." },
    { q: "Is IUI painful?", a: "IUI is usually not painful. Most women experience only mild discomfort, often described as similar to a Pap smear." },
    { q: "How many IUI cycles should I try before IVF?", a: "Typically 3 to 6 cycles of IUI are suggested, but your doctor will tailor the advice based on your specific situation." },
    { q: "Can I have sex after an IUI procedure?", a: "Yes. There are generally no specific restrictions against sexual activity following the procedure." },
    { q: "Can I travel after IUI?", a: "Yes, you can travel after IUI, as the procedure does not require prolonged rest." },
    { q: "Can stress affect IUI success?", a: "Stress can affect fertility by influencing hormone levels. Relaxation techniques, yoga, meditation and counselling can help." },
    { q: "What happens if IUI fails?", a: "Your doctor may recommend repeating the procedure, adjusting medication, or moving to IVF, based on your medical history." },
  ],
  related: ["ivf", "icsi", "male-infertility", "female-infertility"],
  cta: {
    heading: "Considering",
    headingEm: "IUI?",
    subtitle: "Speak with our fertility experts to find out whether IUI is the right first step for you.",
  },
};

/* ===================================================================== */
/* 3. ICSI                                                                */
/* ===================================================================== */

export const icsi: Treatment = {
  slug: "icsi",
  href: "/icsi-treatment-intracytoplasmic-sperm-injection",
  name: "ICSI Treatment (Intracytoplasmic Sperm Injection)",
  shortName: "ICSI",
  alternateName: "Intracytoplasmic Sperm Injection",
  breadcrumbName: "ICSI",
  meta: {
    title: "ICSI Treatment (Intracytoplasmic Sperm Injection) — Bavishi Fertility Institute",
    description:
      "What is ICSI? Learn how a single sperm is injected into an egg to overcome male-factor infertility and fertilisation failure. Performed in Class 1000 labs at Bavishi Fertility Institute since 1984.",
    ogImage: "/assets/ivf-icsi.png",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Oocyte (egg)",
    howPerformed:
      "Under a microscope, an embryologist uses micromanipulation tools to inject a single selected sperm directly into the cytoplasm of each mature egg.",
    followup: "Fertilisation is checked 12–18 hours later; embryos are cultured and the best is transferred, with a pregnancy test about two weeks afterwards.",
  },
  lastReviewed: "2026-06-01",
  reviewerSlug: "himanshu-bavishi",
  hero: {
    eyebrow: "Advanced IVF Treatment",
    h1: "ICSI Treatment",
    h1Em: "Intracytoplasmic Sperm Injection at Bavishi Fertility Institute",
    tagline:
      "The technique where just one sperm is needed to fertilise one egg. ICSI overcomes male-factor infertility and previous fertilisation failure — performed in our Class 1000 labs by experienced embryologists.",
    badges: ["One sperm per egg", "Class 1000 Labs", "Since 1984", "Skilled embryology"],
    image: "/assets/treatments/ICSI.png",
    imageAlt: "ICSI — a single sperm being microinjected into an egg at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "ICSI?" },
    paragraphs: [
      "ICSI — Intra (inside), Cytoplasmic (the cytoplasm of the egg), Sperm (the male gamete), Injection — is a specialised advance within IVF. Where conventional IVF mixes eggs and sperm together and lets fertilisation happen on its own, ICSI injects a single selected sperm directly into each mature egg under microscopic guidance.",
      "Because only one healthy sperm is needed to fertilise one egg, ICSI is the game-changer for male-factor infertility and for couples who have had fertilisation failure before. Many well-equipped IVF clinics with skilled in-house embryologists, including Bavishi Fertility Institute, prefer ICSI for most couples to minimise the risk of total fertilisation failure.",
    ],
    aside: {
      title: "Precision you can rely on",
      body: "Our experienced embryologists perform ICSI using the latest-generation micromanipulation systems, with precision measured in microns. Each injected egg is then cultured in body-like incubators, and fertilisation is confirmed before the best embryo is selected for transfer.",
    },
  },
  video: {
    id: "3aO91ECJflY",
    title: "What is ICSI? — Dr. Aashita Jain",
    description:
      "Fertility expert Dr. Aashita Jain explains how ICSI works, who it helps and why it changed fertilisation in IVF — so you can take your next step with clarity and confidence.",
    eyebrow: "Watch & Learn",
    heading: { lead: "What is ICSI?", em: "Explained by our experts" },
  },
  benefits: {
    heading: { lead: "The advantages of", em: "ICSI" },
    subtitle: "ICSI gives the best chance of fertilisation in situations where conventional IVF may struggle.",
    items: [
      "Overcomes male-factor obstacles such as low count, poor motility or poor morphology.",
      "Only a single healthy sperm is needed, versus the millions required naturally.",
      "Works with frozen sperm and with sperm surgically retrieved from the testis or epididymis.",
      "Minimises the risk of total fertilisation failure, including in unexplained infertility.",
      "Can be combined with PGT to screen embryos for genetic disorders.",
    ],
  },
  types: {
    heading: { lead: "ICSI and its", em: "advanced variations" },
    subtitle: "When indicated, ICSI can be refined further to improve sperm or egg selection.",
    items: [
      { icon: Target, t: "PICSI", d: "Selects mature sperm by their natural ability to bind hyaluronic acid." },
      { icon: ScanLine, t: "IMSI", d: "Selects sperm under very high magnification to assess fine morphology." },
      { icon: Magnet, t: "MACS", d: "Magnetically separates apoptotic (damaged) sperm from healthy ones." },
      { icon: Eye, t: "Spindle View ICSI", d: "Uses a Polscope to visualise the egg's spindle and assess egg quality." },
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who needs", em: "ICSI?" },
    subtitle: "Your specialist may recommend ICSI in any of the following situations.",
    items: [
      "Low sperm concentration, poor motility or poor morphology",
      "Very limited quantity of sperm, or frozen sperm",
      "Sperm recovered surgically from the testis or epididymis",
      "Azoospermia (zero sperm in the ejaculate) or post-vasectomy status",
      "Previous fertilisation failure with conventional IVF",
      "Very few or poor-quality eggs, or advanced maternal age",
      "Unexplained infertility, to prevent fertilisation failure",
    ],
  },
  process: {
    heading: { lead: "The ICSI process at", em: "Bavishi Fertility Institute" },
    subtitle: "From evaluation to embryo transfer, every step is handled with precision and care.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Evaluation", d: "Both partners are assessed — semen analysis for the male partner, and hormone tests (FSH, LH, AMH), ultrasound and other investigations for the female partner." },
      { icon: Egg, n: "02", t: "Egg retrieval", d: "After controlled ovarian stimulation, eggs are retrieved through transvaginal ultrasound-guided aspiration under short sedation." },
      { icon: Filter, n: "03", t: "Sperm preparation", d: "The semen sample is processed to isolate the most motile, healthy sperm for injection." },
      { icon: Microscope, n: "04", t: "Microinjection", d: "A skilled embryologist injects a single sperm directly into the cytoplasm of each mature egg. Fertilisation is checked 12–18 hours later." },
      { icon: Dna, n: "05", t: "Culture & transfer", d: "Embryos are cultured for 3–5 days; the healthiest is transferred via a thin catheter, with progesterone support and a pregnancy test about two weeks later." },
    ],
  },
  technology: {
    heading: { lead: "The science behind", em: "your fertilisation" },
    subtitle: "World-class infrastructure and embryology that protect every egg and embryo.",
    items: [
      { icon: Microscope, t: "Micromanipulation Systems", d: "Latest-generation ICSI systems give precision measured in microns." },
      { icon: FlaskConical, t: "Class 1000 IVF Lab", d: "Air purity 10× cleaner than the international Class 10,000 standard." },
      { icon: Beaker, t: "Body-like Incubators", d: "Next-generation incubators recreate the body's exact environment for healthy embryos." },
      { icon: Snowflake, t: "Vitrification", d: "Ultra-fast freezing of surplus embryos with close to 100% survival on thawing." },
    ],
  },
  whyUs: {
    heading: { lead: "Why choose Bavishi Fertility Institute for", em: "your ICSI?" },
    items: WHY_BAVISHI_FERTILITY_INSTITUTE,
  },
  success: {
    factors: [
      "Woman's age",
      "Egg quality and number",
      "Sperm quality",
      "Embryologist skill and lab quality",
      "Embryo quality",
      "Adequate luteal-phase (progesterone) support",
    ],
    note: "Success rates vary by age, diagnosis and individual medical factors.",
  },
  cost: { includes: STD_COST },
  risks: {
    heading: { lead: "Honest about the risks — and", em: "how we manage them" },
    subtitle: "ICSI is very safe in expert hands. Here is what to be aware of.",
    items: [
      { t: "Ovarian Hyperstimulation (OHSS)", d: "Fertility medicines can occasionally over-stimulate the ovaries, causing bloating or discomfort.", help: "Safe-stimulation protocols are designed to avoid severe OHSS." },
      { t: "Multiple pregnancy", d: "Transferring more than one embryo can lead to twins or higher-order multiples.", help: "We favour elective single-embryo transfer wherever appropriate." },
      { t: "Birth defects", d: "The risk is slightly higher than with natural conception, though overall it remains low.", help: "PGT can be offered where indicated, and outcomes are discussed openly." },
      { t: "Egg-retrieval risks", d: "As with any procedure, minor risks such as infection exist.", help: "A short, sedated, no-cut/no-stitch procedure by experienced specialists." },
      { t: "Emotional & financial stress", d: "Treatment can be demanding on both fronts.", help: "Counselling, transparent pricing and interest-free EMI support you throughout." },
    ],
  },
  preparation: {
    heading: { lead: "Simple ways to", em: "prepare for ICSI" },
    subtitle: "Healthy habits support your treatment; your specialist will personalise this guidance.",
    items: STD_PREP,
  },
  faqs: [
    { q: "What is the difference between IVF and ICSI?", a: "IVF mixes sperm and eggs together in a dish to let fertilisation happen naturally. ICSI is a more specialised technique where a single sperm is injected directly into each egg — preferred for male-factor infertility or previous fertilisation failure." },
    { q: "Is ICSI suitable after a previous IVF failure?", a: "Yes, especially where male-factor issues are involved. ICSI provides a more targeted approach to fertilisation." },
    { q: "How does ICSI help with infertility?", a: "ICSI overcomes specific obstacles to fertilisation, and is particularly helpful for low count, poor motility or abnormal morphology." },
    { q: "Can ICSI be done with frozen eggs or sperm?", a: "Yes. The frozen specimens are thawed before proceeding with the injection." },
    { q: "How long does the ICSI process take?", a: "From ovarian stimulation to embryo transfer, the process typically takes about 4 to 6 weeks." },
    { q: "Can ICSI screen for genetic disorders?", a: "ICSI can be used alongside Preimplantation Genetic Testing (PGT) to screen embryos for genetic disorders." },
    { q: "How much does ICSI cost?", a: "Cost varies with the clinic, location and your specific needs. Bavishi Fertility Institute offers transparent pricing, interest-free EMI and the Suraksha Kavach package — book a consultation for a personalised estimate." },
  ],
  related: ["ivf", "picsi", "imsi", "macs", "spindle-view-icsi", "male-infertility", "azoospermia"],
  cta: {
    heading: "Ready to talk about",
    headingEm: "ICSI?",
    subtitle: "Speak with our fertility experts today — confidential, compassionate and complimentary.",
  },
};

/* ===================================================================== */
/* 4. PICSI                                                               */
/* ===================================================================== */

export const picsi: Treatment = {
  slug: "picsi",
  href: "/physiological-intracytoplasmic-sperm-injection-picsi",
  name: "PICSI (Physiological Intracytoplasmic Sperm Injection)",
  shortName: "PICSI",
  alternateName: "Physiological ICSI",
  breadcrumbName: "PICSI",
  meta: {
    title: "PICSI Treatment (Physiological ICSI) — Bavishi Fertility Institute",
    description:
      "What is PICSI? A physiological way to select mature sperm by hyaluronan binding, used in selected cases of high DNA fragmentation or repeated ICSI failure at Bavishi Fertility Institute.",
    ogImage: "/assets/ivf-icsi.png",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Oocyte (egg)",
    howPerformed:
      "Sperm are placed on a hyaluronan-coated dish; mature sperm that bind the hyaluronan are selected and injected individually into the egg, as in ICSI.",
    followup: "Fertilisation and embryo development are monitored, and the best embryo is transferred.",
  },
  lastReviewed: "2026-06-01",
  reviewerSlug: "parth-bavishi",
  hero: {
    eyebrow: "Advanced IVF Treatment",
    h1: "PICSI Treatment",
    h1Em: "Physiological ICSI at Bavishi Fertility Institute",
    tagline:
      "An advanced refinement of ICSI that selects sperm the way nature does — by their ability to bind hyaluronic acid. Used in selected cases to improve sperm selection and embryo quality.",
    badges: ["Physiological selection", "Class 1000 Labs", "Used selectively", "Skilled embryology"],
    image: "/assets/treatments/PICSI.png",
    imageAlt: "PICSI — physiological sperm selection by hyaluronan binding at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "PICSI?" },
    paragraphs: [
      "PICSI (Physiological Intracytoplasmic Sperm Injection) is a refinement of ICSI used in assisted reproduction. Instead of selecting sperm by appearance alone, PICSI uses hyaluronic acid — a substance naturally found in the layer surrounding the egg — to identify mature sperm.",
      "Only a mature, biochemically competent sperm carries the receptors needed to bind hyaluronic acid. Studies suggest that sperm which bind in this way tend to have better morphology, lower chromosomal abnormalities and improved DNA integrity, which is why PICSI is used to improve sperm selection in selected cases.",
    ],
    aside: {
      title: "An add-on, used wisely",
      body: "PICSI is not needed by every couple. No major professional body recommends its routine use for all patients. At Bavishi Fertility Institute it is offered selectively — where the history suggests it may genuinely help, such as high sperm DNA fragmentation or repeated ICSI failure.",
    },
  },
  benefits: {
    heading: { lead: "The potential benefits of", em: "PICSI" },
    subtitle: "Where it is indicated, PICSI aims to select better sperm and support healthier embryos.",
    items: [
      "Selects mature sperm with better DNA integrity.",
      "May improve the quality of the embryos available for transfer.",
      "Studies suggest higher pregnancy rates and lower miscarriage rates in selected cases.",
      "Adds a physiological selection step to the advantages already offered by ICSI.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who may benefit from", em: "PICSI?" },
    subtitle: "PICSI is specifically indicated where sperm quality is low or compromised.",
    items: [
      "A high percentage of DNA-fragmented sperm (elevated DFI)",
      "Women over the age of 38",
      "Previous failed ICSI fertilisation cycles",
      "Consistently low-quality embryo development",
      "A history of multiple miscarriages",
    ],
  },
  process: {
    heading: { lead: "How", em: "PICSI is performed" },
    subtitle: "A physiological selection step is added to the standard ICSI workflow.",
    steps: [
      { icon: Beaker, n: "01", t: "Hyaluronan dish", d: "A dish is coated with hyaluronan, the substance found in the cumulus cells surrounding the egg." },
      { icon: Filter, n: "02", t: "Semen processing", d: "The sample is processed to separate sperm from the seminal fluid." },
      { icon: Target, n: "03", t: "Sperm binding", d: "The processed sperm are placed on the hyaluronan-coated dish; mature, healthy sperm bind via their specific receptors." },
      { icon: Microscope, n: "04", t: "Identification", d: "Under the microscope, the bound sperm — those attached to the hyaluronan — are identified." },
      { icon: Syringe, n: "05", t: "Injection", d: "Each selected sperm is picked up with a fine needle and injected directly into the egg cytoplasm, as in ICSI." },
    ],
  },
  whyUs: {
    heading: { lead: "Why choose Bavishi Fertility Institute for", em: "PICSI?" },
    items: WHY_BAVISHI_FERTILITY_INSTITUTE,
  },
  success: {
    factors: [
      "Degree of sperm DNA fragmentation",
      "Woman's age and egg quality",
      "Underlying cause of previous failure",
      "Embryo quality",
      "Embryologist skill and lab quality",
      "Overall reproductive health",
    ],
    note: "PICSI does not guarantee pregnancy. Evidence is strongest in selected cases, and it is used as an add-on rather than for every couple.",
  },
  cost: { includes: STD_COST },
  risks: {
    heading: { lead: "Honest about the", em: "considerations" },
    subtitle: "PICSI is safe in expert hands, but it is not right for everyone.",
    items: [
      { t: "Not suitable for everyone", d: "PICSI may not help in severe male-factor infertility or extremely low sperm counts.", help: "Your specialist will advise whether PICSI, IMSI or standard ICSI suits your case." },
      { t: "Not a routine recommendation", d: "No major professional body recommends PICSI for all patients.", help: "We offer it selectively, only where the history suggests a likely benefit." },
      { t: "Added cost", d: "As an add-on technique, PICSI adds to the cost of treatment.", help: "Transparent pricing and interest-free EMI, with honest advice on whether it is worthwhile for you." },
      { t: "General ICSI risks", d: "As with any micromanipulation, rare complications such as damage to the egg can occur.", help: "Performed by experienced embryologists in our Class 1000 lab." },
    ],
  },
  faqs: [
    { q: "What is the difference between PICSI and ICSI?", a: "Standard ICSI selects sperm largely by appearance. PICSI adds a physiological step — selecting sperm by their natural ability to bind hyaluronic acid — on top of the advantages ICSI already offers." },
    { q: "Is PICSI supported by evidence?", a: "Several studies suggest PICSI can improve outcomes in selected cases, including higher pregnancy and lower miscarriage rates. However, no major professional body recommends its routine use in all patients." },
    { q: "Is PICSI safe?", a: "PICSI is considered safe when performed by experienced fertility professionals in accredited laboratories. As with any procedure, rare complications are possible." },
    { q: "Can PICSI help with sperm DNA fragmentation?", a: "Yes — PICSI is designed to select sperm with more intact DNA, which is why it is often considered when DNA fragmentation is high." },
    { q: "How long does PICSI take?", a: "The sperm preparation, incubation and selection steps generally take a few hours, within the same egg-retrieval cycle." },
    { q: "What lifestyle changes can help?", a: "A balanced diet, regular exercise, avoiding alcohol and tobacco, and managing stress can all support sperm health and overall fertility." },
  ],
  related: ["icsi", "imsi", "macs", "spindle-view-icsi", "ivf-failure", "ivf"],
  cta: {
    heading: "Wondering if",
    headingEm: "PICSI is right for you?",
    subtitle: "Speak with our specialists to understand whether this add-on would genuinely help your case.",
  },
};

/* ===================================================================== */
/* 5. IMSI                                                                */
/* ===================================================================== */

export const imsi: Treatment = {
  slug: "imsi",
  href: "/intracytoplasmic-morphologically-selected-sperm-injection-imsi",
  name: "IMSI (Intracytoplasmic Morphologically Selected Sperm Injection)",
  shortName: "IMSI",
  alternateName: "Morphologically Selected Sperm Injection",
  breadcrumbName: "IMSI",
  meta: {
    title: "IMSI Treatment (Morphologically Selected Sperm Injection) — Bavishi Fertility Institute",
    description:
      "What is IMSI? A high-magnification refinement of ICSI to select structurally normal sperm, used in selected male-factor cases at Bavishi Fertility Institute.",
    ogImage: "/assets/ivf-icsi.png",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Oocyte (egg)",
    howPerformed:
      "Sperm are examined under very high magnification using specialised optics to select those with normal fine morphology, which are then injected into the egg as in ICSI.",
    followup: "Fertilisation and embryo development are monitored, and the best embryo is transferred.",
  },
  lastReviewed: "2026-06-01",
  reviewerSlug: "parth-bavishi",
  hero: {
    eyebrow: "Advanced IVF Treatment",
    h1: "IMSI Treatment",
    h1Em: "Morphologically Selected Sperm Injection at Bavishi Fertility Institute",
    tagline:
      "A high-magnification refinement of ICSI. By examining sperm in far greater detail, IMSI helps the embryologist select the most structurally normal sperm for fertilisation.",
    badges: ["High-magnification selection", "Class 1000 Labs", "Used selectively", "Skilled embryology"],
    image: "/assets/treatments/IMSI.png",
    imageAlt: "IMSI — high-magnification sperm selection at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "IMSI?" },
    paragraphs: [
      "IMSI (Intracytoplasmic Morphologically Selected Sperm Injection) uses specialised lenses and software to magnify sperm far more than in conventional ICSI. This lets the embryologist examine the fine structure of each sperm and choose those that look most normal.",
      "Selection happens in two stages — first at standard magnification, as in ICSI, and then under very high magnification to identify structurally normal sperm for fertilisation. Because the assessment is detailed and subjective, the experience of the embryologist is central to the technique.",
    ],
    aside: {
      title: "An add-on for selected cases",
      body: "IMSI is typically considered for male-factor infertility with poor sperm morphology, or after previous ICSI cycles with poor results. It is not necessary for every couple, and at Bavishi Fertility Institute it is recommended only where it is likely to help.",
    },
  },
  benefits: {
    heading: { lead: "The potential benefits of", em: "IMSI" },
    subtitle: "Where indicated, IMSI aims to improve sperm selection in difficult male-factor cases.",
    items: [
      "Enhanced sperm selection — choosing sperm of the highest morphological quality.",
      "May reduce the chance of selecting structurally abnormal sperm.",
      "May improve fertilisation rates and embryo quality in male-factor cases.",
      "Builds directly on the proven ICSI technique.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who may benefit from", em: "IMSI?" },
    subtitle: "IMSI is generally recommended in specific situations rather than for all couples.",
    items: [
      "Low sperm morphology — a high number of abnormally-shaped sperm",
      "Generally low sperm quality",
      "Previous ICSI cycles with poor fertilisation or embryo quality",
      "Male-factor infertility where finer sperm selection may help",
    ],
  },
  process: {
    heading: { lead: "How", em: "IMSI is performed" },
    subtitle: "A high-magnification selection step is added to the standard ICSI workflow.",
    steps: [
      { icon: Filter, n: "01", t: "Sperm preparation", d: "The semen sample is collected and prepared following the routine IVF-ICSI protocol." },
      { icon: Egg, n: "02", t: "Egg retrieval", d: "Eggs are retrieved from the ovaries through a short, ultrasound-guided procedure." },
      { icon: Microscope, n: "03", t: "Initial selection", d: "Sperm are first selected at standard magnification, in larger numbers than finally needed." },
      { icon: ScanLine, n: "04", t: "High-magnification assessment", d: "Selected sperm are examined under very high magnification to identify those with normal fine morphology." },
      { icon: Syringe, n: "05", t: "Injection & culture", d: "The chosen sperm are injected into the eggs, and the resulting embryos are cultured for several days before transfer." },
    ],
  },
  whyUs: {
    heading: { lead: "Why choose Bavishi Fertility Institute for", em: "IMSI?" },
    items: WHY_BAVISHI_FERTILITY_INSTITUTE,
  },
  success: {
    factors: [
      "Degree of sperm morphological abnormality",
      "Embryologist experience and judgement",
      "Woman's age and egg quality",
      "Underlying cause of infertility",
      "Embryo quality",
      "Lab quality and conditions",
    ],
    note: "IMSI does not guarantee pregnancy; success depends on the underlying causes of infertility and individual factors.",
  },
  cost: { includes: STD_COST },
  risks: {
    heading: { lead: "Honest about the", em: "considerations" },
    subtitle: "IMSI is safe in experienced hands, but it has limitations.",
    items: [
      { t: "Operator-dependent", d: "IMSI assessment is detailed and subjective, so results depend heavily on embryologist experience.", help: "Performed by our experienced in-house embryology team." },
      { t: "Higher cost", d: "IMSI costs more than conventional IVF / ICSI and is not available everywhere.", help: "Transparent pricing and interest-free EMI, with honest advice on whether it is worthwhile." },
      { t: "Longer time outside the body", d: "Sperm remain outside the body for longer during selection, which may, in theory, affect fertilising capacity.", help: "Strictly controlled lab conditions minimise any such effect." },
      { t: "Not for everyone", d: "IMSI is most relevant to specific male-factor cases.", help: "We recommend it only where finer sperm selection is likely to help." },
    ],
  },
  faqs: [
    { q: "Is IMSI safe?", a: "Yes — IMSI is considered safe when performed by experienced specialists, though, as with any procedure, potential risks should be discussed with your doctor." },
    { q: "Is IMSI suitable for all cases?", a: "IMSI is typically recommended for male-factor infertility, recurrent IVF failures, or previous poor embryo quality, rather than for every couple." },
    { q: "Does IMSI guarantee success?", a: "No. IMSI does not guarantee pregnancy; success depends on the underlying causes of infertility and several individual factors." },
    { q: "What is the difference between IMSI and ICSI?", a: "IMSI is a form of ICSI that uses much higher magnification to assess sperm structure in detail before injection, so the embryologist can select the most normal-looking sperm." },
    { q: "Are there any side effects?", a: "No specific adverse effects have been shown, although sperm being outside the body for longer during selection may, in theory, reduce fertilising capacity. This is minimised by careful lab conditions." },
    { q: "How long does IMSI take?", a: "The procedure takes a few hours overall, covering sperm selection, egg retrieval and, subsequently, embryo transfer." },
    { q: "How should I prepare?", a: "Maintain a healthy diet, avoid alcohol and tobacco, manage stress and follow prescribed medications. A short period of abstinence before giving the semen sample may improve morphology." },
  ],
  related: ["icsi", "picsi", "macs", "spindle-view-icsi", "male-infertility", "ivf"],
  cta: {
    heading: "Wondering if",
    headingEm: "IMSI could help?",
    subtitle: "Speak with our specialists to understand whether high-magnification selection suits your case.",
  },
};

/* ===================================================================== */
/* 6. MACS                                                                */
/* ===================================================================== */

export const macs: Treatment = {
  slug: "macs",
  href: "/magnetic-activated-cell-sorting-macs",
  name: "MACS (Magnetic-Activated Cell Sorting)",
  shortName: "MACS",
  alternateName: "Magnetic-Activated Cell Sorting",
  breadcrumbName: "MACS",
  meta: {
    title: "MACS Treatment (Magnetic-Activated Cell Sorting) — Bavishi Fertility Institute",
    description:
      "What is MACS? A sperm-selection technique that separates apoptotic (damaged) sperm from healthy ones. An honest look at where it may help — and the evidence — at Bavishi Fertility Institute.",
    ogImage: "/assets/ivf-icsi.png",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Semen sample (laboratory)",
    howPerformed:
      "Apoptotic (damaged) sperm are labelled with magnetic nanoparticles and held in a magnetic column, while intact, healthy sperm pass through and are collected for use in IVF or ICSI.",
    followup: "Selected sperm are used in the same treatment cycle; there is no procedure performed on the patient.",
  },
  lastReviewed: "2026-06-01",
  reviewerSlug: "parth-bavishi",
  hero: {
    eyebrow: "Advanced IVF Treatment",
    h1: "MACS Treatment",
    h1Em: "Magnetic-Activated Cell Sorting at Bavishi Fertility Institute",
    tagline:
      "A laboratory technique that separates apoptotic (damaged) sperm from healthy ones before fertilisation. Done entirely on the semen sample, with nothing performed on the patient.",
    badges: ["Lab-based selection", "No patient procedure", "Used selectively", "Skilled embryology"],
    image: "/assets/treatments/MACS.png",
    imageAlt: "MACS — magnetic sorting of sperm cells in the laboratory at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "MACS?" },
    paragraphs: [
      "MACS (Magnetic-Activated Cell Sorting) separates apoptotic — that is, damaged or dying — sperm cells from healthy ones. The damaged sperm are labelled with magnetic nanoparticles and captured in a column, while intact, live sperm pass through and are collected for fertilisation by IVF or ICSI.",
      "MACS is performed entirely on the semen sample in the laboratory — there is no procedure on the patient. It is considered as an add-on to improve the quality of sperm selected, particularly where sperm DNA damage is a concern.",
    ],
    aside: {
      title: "An honest note on the evidence",
      body: "It is important to be transparent: recent meta-analysis data suggest that MACS does not improve embryo implantation, and most current evidence does not show an added advantage of MACS over routine IVF and ICSI. At Bavishi Fertility Institute we discuss this openly, and only consider MACS where it may be appropriate for your specific situation.",
    },
  },
  benefits: {
    heading: { lead: "The intended benefits of", em: "MACS" },
    subtitle: "Where it is considered, MACS aims to refine the quality of the sperm used.",
    items: [
      "Removes apoptotic (damaged) sperm from the sample before fertilisation.",
      "Selects sperm with potentially better DNA integrity.",
      "Can be combined with ICSI, IMSI or conventional IVF.",
      "Performed on the semen sample only — no procedure on the patient.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who might", em: "MACS be considered for?" },
    subtitle: "MACS is most relevant where sperm quality, rather than count, is the concern.",
    items: [
      "Men with high sperm DNA fragmentation",
      "High levels of sperm apoptosis",
      "Low sperm motility related to sperm quality",
      "Couples seeking to refine sperm selection within an IVF / ICSI cycle",
    ],
  },
  process: {
    heading: { lead: "How", em: "MACS is performed" },
    subtitle: "A simple laboratory sorting step, added to the semen-preparation workflow.",
    steps: [
      { icon: Droplets, n: "01", t: "Sample preparation", d: "The semen sample is prepared in the laboratory; no procedure is needed on the patient." },
      { icon: Target, n: "02", t: "Magnetic labelling", d: "Apoptotic (damaged) sperm are tagged with magnetic nanoparticles that bind to markers on their surface." },
      { icon: Magnet, n: "03", t: "Magnetic separation", d: "The sample passes through a magnetic column; tagged, damaged sperm are held back while healthy sperm flow through." },
      { icon: Filter, n: "04", t: "Collection", d: "The intact, healthy sperm are collected from the column for use in fertilisation." },
      { icon: Microscope, n: "05", t: "Fertilisation", d: "The selected sperm are used for ICSI, IMSI or conventional IVF as planned for your cycle." },
    ],
  },
  whyUs: {
    heading: { lead: "Why choose Bavishi Fertility Institute for", em: "MACS" },
    items: WHY_BAVISHI_FERTILITY_INSTITUTE,
  },
  success: {
    factors: [
      "Degree of sperm DNA damage",
      "Overall sperm and egg quality",
      "Woman's age",
      "The fertilisation method used alongside MACS",
      "Embryo quality",
      "Lab quality and conditions",
    ],
    note: "Most recent data do not show an added advantage of MACS over routine IVF and ICSI. It does not increase sperm count or motility, and outcomes depend on many individual factors.",
  },
  cost: { includes: STD_COST },
  risks: {
    heading: { lead: "Honest about the", em: "considerations" },
    subtitle: "We believe you should know the evidence before choosing an add-on.",
    items: [
      { t: "Limited evidence of benefit", d: "Recent meta-analysis data suggest MACS does not improve implantation, and most current data show no added advantage over routine IVF and ICSI.", help: "We share this evidence openly and recommend MACS only where it may genuinely apply." },
      { t: "Added cost", d: "MACS adds to the cost of treatment.", help: "Transparent pricing and interest-free EMI, with honest guidance on value." },
      { t: "Does not improve count or motility", d: "MACS is about sperm quality selection, not improving sperm numbers or movement.", help: "Your specialist will explain what MACS can and cannot do for your case." },
      { t: "Not always appropriate", d: "MACS has limited applicability in many cases.", help: "We assess whether it is worthwhile rather than applying it routinely." },
    ],
  },
  faqs: [
    { q: "Does MACS improve sperm count or motility?", a: "No. MACS does not directly increase sperm count or motility. It is used to improve the quality of the sperm selected for fertilisation by removing apoptotic (damaged) sperm." },
    { q: "Is there a recovery process after MACS?", a: "There is no procedure on the patient — MACS is performed on the semen sample — so there is nothing to recover from." },
    { q: "How long does the MACS procedure take?", a: "The laboratory sorting typically takes a few hours, depending on the specific protocols used." },
    { q: "Does MACS improve success rates?", a: "The evidence is limited. Most recent data do not show an added advantage of MACS over routine IVF and ICSI, which is why we use it selectively and explain the evidence honestly." },
    { q: "Can MACS be combined with ICSI or IMSI?", a: "Yes. MACS can be used alongside ICSI, IMSI or conventional IVF as part of the same treatment cycle." },
  ],
  related: ["icsi", "imsi", "picsi", "male-infertility", "ivf"],
  cta: {
    heading: "Want an honest view on",
    headingEm: "MACS?",
    subtitle: "Speak with our specialists about whether this add-on is worthwhile for your specific case.",
  },
};

/* ===================================================================== */
/* 7. Spindle View ICSI                                                   */
/* ===================================================================== */

export const spindleViewIcsi: Treatment = {
  slug: "spindle-view-icsi",
  href: "/spindle-view-icsi",
  name: "Spindle View ICSI (Polscope)",
  shortName: "Spindle View ICSI",
  alternateName: "Polscope ICSI",
  breadcrumbName: "Spindle View ICSI",
  meta: {
    title: "Spindle View ICSI (Polscope) — Bavishi Fertility Institute",
    description:
      "What is Spindle View ICSI? Using a Polscope to visualise the egg's meiotic spindle for better fertilisation and egg-quality assessment, in selected cases at Bavishi Fertility Institute.",
    ogImage: "/assets/ivf-icsi.png",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Oocyte (egg)",
    howPerformed:
      "A polarised microscope (Polscope) visualises the meiotic spindle inside the egg, so the embryologist can assess egg quality and align the egg to avoid spindle damage during ICSI.",
    followup: "Fertilisation and embryo development are monitored, and the best embryo is transferred.",
  },
  lastReviewed: "2026-06-01",
  reviewerSlug: "himanshu-bavishi",
  hero: {
    eyebrow: "Advanced IVF Treatment",
    h1: "Spindle View ICSI",
    h1Em: "Polscope-guided ICSI at Bavishi Fertility Institute",
    tagline:
      "An advanced form of ICSI that lets the embryologist see the egg's meiotic spindle. This helps achieve better fertilisation and gives a more detailed assessment of egg quality.",
    badges: ["Polscope-guided", "Better egg assessment", "Used selectively", "Skilled embryology"],
    image: "/assets/treatments/Spindle-Icsi.png",
    imageAlt: "Spindle View ICSI — visualising the egg's meiotic spindle with a Polscope at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Spindle View ICSI?" },
    paragraphs: [
      "In patients showing poor fertilisation with IVF or conventional ICSI, Spindle View ICSI helps to achieve better fertilisation. It also provides a more detailed analysis of egg quality.",
      "The technique uses a specialised polarised microscope, or Polscope, to visualise the meiotic spindle inside the egg during its final maturation. Seeing the spindle lets the embryologist align the egg for injection so the spindle is not damaged — something conventional ICSI cannot do, as it relies only on the position of the polar body as a marker.",
    ],
    aside: {
      title: "Especially useful when eggs are few",
      body: "When egg numbers are very low, making the most of each egg matters. By assessing spindle length and area, and aligning the egg to protect the spindle during injection, Spindle View ICSI helps maximise the chance of fertilisation and can also inform decisions about egg quality.",
    },
  },
  benefits: {
    heading: { lead: "The benefits of", em: "Spindle View ICSI" },
    subtitle: "Where indicated, it supports better fertilisation and clearer egg assessment.",
    items: [
      "Improves fertilisation by visualising and aligning the meiotic spindle.",
      "Allows assessment of egg quality through spindle length and area.",
      "Reduces the risk of mechanical damage to the spindle during injection.",
      "Helps make the most of each egg when egg numbers are limited.",
      "Supports better-informed decisions, including about donor options where relevant.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who may benefit from", em: "Spindle View ICSI?" },
    subtitle: "Three groups of patients tend to benefit most.",
    items: [
      "Patients with poor fertilisation in previous IVF or conventional ICSI cycles",
      "Patients who develop poor-quality embryos with IVF",
      "Patients with very few eggs or very low AMH levels",
    ],
  },
  process: {
    heading: { lead: "How", em: "Spindle View ICSI works" },
    subtitle: "A visualisation step is added to the standard ICSI workflow.",
    steps: [
      { icon: Egg, n: "01", t: "Egg assessment", d: "Each mature egg is examined under the Polscope, which reveals the meiotic spindle that is invisible under an ordinary microscope." },
      { icon: Eye, n: "02", t: "Spindle visualisation", d: "The embryologist studies the spindle's position, length and area as an indicator of egg quality." },
      { icon: Target, n: "03", t: "Alignment", d: "The egg is aligned so the injection avoids the spindle, rather than relying on the polar body as an approximate marker." },
      { icon: Syringe, n: "04", t: "Injection", d: "A single sperm is injected with the spindle protected, supporting better fertilisation." },
      { icon: Dna, n: "05", t: "Culture & transfer", d: "Fertilised eggs are cultured into embryos, and the best embryo is selected for transfer." },
    ],
  },
  whyUs: {
    heading: { lead: "Why choose Bavishi Fertility Institute for", em: "Spindle View ICSI" },
    items: WHY_BAVISHI_FERTILITY_INSTITUTE,
  },
  success: {
    factors: [
      "Egg quality and maturity",
      "Woman's age and ovarian reserve",
      "Sperm quality",
      "Embryologist skill and lab quality",
      "Underlying cause of previous failure",
      "Embryo quality",
    ],
    note: "Success rates vary with individual factors. Studies suggest spindle-aligned injection can improve fertilisation rates in selected patients.",
  },
  cost: { includes: STD_COST },
  risks: {
    heading: { lead: "Honest about the", em: "considerations" },
    subtitle: "The technique is generally safe; here is what to keep in mind.",
    items: [
      { t: "Added cost", d: "Spindle View ICSI can cost more because of the specialised Polscope technology involved.", help: "Transparent pricing and interest-free EMI, with advice on whether it suits your case." },
      { t: "Most useful in selected cases", d: "The benefit is greatest in specific situations, such as poor fertilisation or very few eggs.", help: "We recommend it where it is likely to help, not for every cycle." },
      { t: "General ICSI risks", d: "As with any micromanipulation, rare complications can occur.", help: "Polscope technology actually minimises the risk of damaging the meiotic spindle during injection." },
    ],
  },
  faqs: [
    { q: "What is the difference between conventional ICSI and Spindle View ICSI?", a: "Conventional ICSI relies on the polar body as a marker for the spindle's location, whereas Spindle View ICSI uses a Polscope to visualise the actual meiotic spindle, reducing the risk of damage." },
    { q: "How is Spindle View ICSI performed?", a: "A specialised polarised microscope visualises the meiotic spindle in the egg, and the embryologist aligns the spindle to avoid damaging it during sperm injection." },
    { q: "Who is an ideal candidate?", a: "Ideal candidates include patients with poor fertilisation in previous IVF cycles, poor-quality embryos, or a low ovarian reserve." },
    { q: "Can Spindle View ICSI improve embryo quality?", a: "By helping keep the meiotic spindle intact during ICSI, the technique can support better-quality embryos in suitable cases." },
    { q: "What are the success rates?", a: "Success rates vary with individual factors, but studies show patients undergoing spindle-aligned injection can experience better fertilisation rates." },
  ],
  related: ["icsi", "picsi", "imsi", "ivf-failure", "ivf"],
  cta: {
    heading: "Curious about",
    headingEm: "Spindle View ICSI?",
    subtitle: "Speak with our specialists to understand whether Polscope-guided ICSI fits your treatment.",
  },
};

/* ===================================================================== */
/* 8. Blastocyst Culture & Transfer                                       */
/* ===================================================================== */

export const blastocystTransfer: Treatment = {
  slug: "blastocyst-transfer",
  href: "/blastocyst-culture-blastocyst-transfer",
  name: "Blastocyst Culture & Transfer",
  shortName: "Blastocyst Transfer",
  alternateName: "Blastocyst Culture",
  breadcrumbName: "Blastocyst Transfer",
  meta: {
    title: "Blastocyst Culture & Transfer — Bavishi Fertility Institute",
    description:
      "What is blastocyst culture? Growing embryos to day 5–6 helps select the strongest for transfer and supports single-embryo transfer. Performed in Class 1000 labs at Bavishi Fertility Institute.",
    ogImage: "/assets/ivf-icsi.png",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Uterus",
    howPerformed:
      "Embryos are cultured in the laboratory to the blastocyst stage (day 5–6); the strongest are then selected and transferred into the uterus, often as a single embryo.",
    followup: "A pregnancy test is performed about 10–14 days after blastocyst transfer.",
  },
  lastReviewed: "2026-06-01",
  reviewerSlug: "himanshu-bavishi",
  hero: {
    eyebrow: "Advanced IVF Treatment",
    h1: "Blastocyst Culture & Transfer",
    h1Em: "Stronger embryo selection at Bavishi Fertility Institute",
    tagline:
      "By growing embryos to day 5–6 — the blastocyst stage — only the strongest continue to develop. This supports better selection and makes single-embryo transfer possible.",
    badges: ["Day 5–6 culture", "Better selection", "Fewer multiples", "Class 1000 Labs"],
    image: "/assets/treatments/Blastocyst Transfer.png",
    imageAlt: "Blastocyst culture and transfer — a day-5 embryo at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is a", em: "blastocyst?" },
    paragraphs: [
      "Not all embryos that look good on day 2 or 3 will continue to develop. If they are cultured for a few more days, only the genuinely good-quality embryos go on to reach the blastocyst stage — the embryo at day 5–6 of development.",
      "In natural conception, an embryo reaches the uterus at the blastocyst stage, about 4–6 days after fertilisation. Culturing embryos to this stage in the laboratory therefore mimics nature and lets the embryologist select the strongest embryo for transfer. In general, about 30–60% of embryos develop into blastocysts, depending on age and other factors.",
    ],
    aside: {
      title: "Recommended where selection is possible",
      body: "Blastocyst culture is recommended for women undergoing IVF wherever selection of an embryo is possible. It is particularly valuable when planning a single pregnancy, after multiple failed cycles, or with a history of miscarriage — and it is required for techniques such as PGT.",
    },
  },
  video: {
    id: "J96ic-QUZxU",
    title: "Blastocyst Culture — Dr. Lekshmy Rana",
    description:
      "Fertility expert Dr. Lekshmy Rana explains blastocyst culture — how growing embryos to day 5–6 helps select the strongest embryo for transfer.",
    eyebrow: "Watch & Learn",
    heading: { lead: "What is blastocyst culture?", em: "Explained by our experts" },
  },
  benefits: {
    heading: { lead: "The advantages of", em: "blastocyst transfer" },
    subtitle: "Reaching the blastocyst stage strengthens both selection and safety.",
    items: [
      "Increased chance of implantation — blastocysts are more likely to implant.",
      "Improved selection of healthy embryos, as they have developed further.",
      "Fewer embryos need to be transferred, reducing the risk of multiple pregnancy.",
      "Makes elective single-embryo transfer realistic while maintaining pregnancy rates.",
      "Enables Preimplantation Genetic Testing (PGT) where indicated.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who is", em: "blastocyst transfer for?" },
    subtitle: "It is recommended broadly where embryo selection is possible, and especially for:",
    items: [
      "Women undergoing IVF where selection between embryos is possible",
      "A history of multiple failed IVF cycles",
      "Those planning to conceive a single pregnancy",
      "A history of miscarriage",
      "Cycles where PGT is planned",
    ],
  },
  process: {
    heading: { lead: "How", em: "blastocyst culture works" },
    subtitle: "Embryos are grown a few days longer so the strongest reveal themselves.",
    steps: [
      { icon: Microscope, n: "01", t: "Fertilisation", d: "Eggs are fertilised by IVF or ICSI and the resulting embryos begin to develop in the lab." },
      { icon: Beaker, n: "02", t: "Extended culture", d: "Embryos are cultured in body-like incubators to day 5–6, rather than transferring on day 2–3." },
      { icon: Layers, n: "03", t: "Blastocyst selection", d: "The embryos that reach the blastocyst stage are graded, and the strongest is selected for transfer." },
      { icon: HeartPulse, n: "04", t: "Transfer", d: "Usually a single blastocyst is transferred into the uterus; surplus blastocysts can be frozen by vitrification." },
      { icon: ClipboardCheck, n: "05", t: "Pregnancy test", d: "A pregnancy test follows about 10–14 days later, once the embryo has had time to implant." },
    ],
    note: "In general, about 30–60% of embryos develop into blastocysts, depending on age and other factors.",
  },
  whyUs: {
    heading: { lead: "Why choose Bavishi Fertility Institute for", em: "blastocyst transfer" },
    items: WHY_BAVISHI_FERTILITY_INSTITUTE,
  },
  success: {
    factors: [
      "Woman's age",
      "Embryo quality and morphology",
      "Number of embryos transferred",
      "Uterine lining health",
      "Underlying medical conditions",
      "Overall reproductive health",
    ],
    note: "Success rates vary with individual factors, but blastocyst transfer is generally associated with higher implantation than earlier-stage transfer in suitable patients.",
  },
  cost: { includes: STD_COST },
  risks: {
    heading: { lead: "Honest about the", em: "considerations" },
    subtitle: "Blastocyst culture has clear advantages, but a few points are worth understanding.",
    items: [
      { t: "Not all embryos reach blastocyst", d: "Only about 30–60% of embryos develop to the blastocyst stage, so some cycles yield fewer embryos to transfer or freeze.", help: "Our Class 1000 lab and body-like incubators give embryos the best environment to develop." },
      { t: "Miscarriage risk remains", d: "Even when a blastocyst implants, a risk of miscarriage still exists.", help: "Where indicated, PGT can help select genetically normal embryos." },
      { t: "Extra cost", d: "Blastocyst culture is a more complex procedure and usually carries an additional cost.", help: "Transparent pricing and interest-free EMI, with clear guidance on what is included." },
    ],
  },
  preparation: {
    heading: { lead: "Supporting your", em: "transfer" },
    subtitle: "Simple, healthy steps before and after transfer; your specialist will personalise this.",
    items: STD_PREP,
  },
  faqs: [
    { q: "How many embryos reach the blastocyst stage?", a: "In general, about 30–60% of embryos develop into blastocysts, depending on age and other individual factors." },
    { q: "Is blastocyst transfer more successful?", a: "Success rates vary with individual factors, but blastocyst transfer is generally associated with higher implantation than earlier-stage embryo transfer in suitable patients." },
    { q: "Is there an extra cost for blastocyst culture?", a: "Yes, there is usually an additional cost, because culturing embryos to the blastocyst stage is a more complex procedure." },
    { q: "How long until I know if I am pregnant?", a: "It usually takes about 10–14 days after blastocyst transfer to get a definitive answer, as the embryo needs time to implant and produce detectable pregnancy hormones." },
    { q: "What if my embryos do not reach the blastocyst stage?", a: "Options include repeating IVF with adjustments, transferring earlier-stage (day 3) embryos, using advanced fertilisation techniques, genetic testing, or considering donor eggs or embryos." },
    { q: "What are the alternatives to blastocyst transfer?", a: "Alternatives include transferring cleavage-stage (day 3) embryos, using frozen blastocysts from previous cycles, advanced fertilisation techniques such as PICSI or Spindle View ICSI, or donor eggs or embryos." },
  ],
  related: ["ivf", "icsi", "laser-hatching", "ivf-failure", "spindle-view-icsi"],
  cta: {
    heading: "Want stronger",
    headingEm: "embryo selection?",
    subtitle: "Speak with our fertility experts about whether blastocyst culture is right for your cycle.",
  },
};

/* ===================================================================== */
/* 9. Laser-Assisted Hatching                                            */
/* ===================================================================== */

export const laserHatching: Treatment = {
  slug: "laser-hatching",
  href: "/laser-assisted-hatching",
  name: "Laser-Assisted Hatching",
  shortName: "Laser Hatching",
  alternateName: "Assisted Hatching",
  breadcrumbName: "Laser Assisted Hatching",
  meta: {
    title: "Laser-Assisted Hatching (LAH) — Bavishi Fertility Institute",
    description:
      "What is laser-assisted hatching? An FDA-approved laser creates a small opening in the embryo's outer shell to support implantation, in selected IVF cases at Bavishi Fertility Institute.",
    ogImage: "/assets/ivf-icsi.png",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Embryo (zona pellucida)",
    howPerformed:
      "On the day of embryo transfer, a dedicated FDA-approved laser makes a small, precise opening in the zona pellucida — the embryo's outer shell — away from the genetic material, to assist hatching and implantation.",
    followup: "The embryo is then transferred by the standard procedure; a pregnancy test follows about two weeks later.",
  },
  lastReviewed: "2026-06-01",
  reviewerSlug: "himanshu-bavishi",
  hero: {
    eyebrow: "Advanced IVF Treatment",
    h1: "Laser-Assisted Hatching",
    h1Em: "Supporting implantation at Bavishi Fertility Institute",
    tagline:
      "Before an embryo can implant, it must break out of its outer shell. A dedicated FDA-approved laser makes a tiny, precise opening to assist this natural hatching in selected cases.",
    badges: ["FDA-approved laser", "Computer-guided precision", "Lab-only", "Used selectively"],
    image: "/assets/treatments/Laser-Hatching.png",
    imageAlt: "Laser-assisted hatching — a precise opening in the embryo's zona pellucida at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "laser-assisted hatching?" },
    paragraphs: [
      "Every embryo is surrounded by an outer protective covering called the zona pellucida. To implant, the embryo must break out of this shell, come out of it, and establish direct contact with the endometrium — a process called embryo hatching.",
      "Laser-Assisted Hatching (LAH) uses a dedicated, FDA-approved laser to make a small opening in the zona pellucida, assisting the embryo's natural hatching just before implantation. It is performed entirely in the IVF lab on the embryo, with no procedure on the patient.",
    ],
    aside: {
      title: "Precise, and gentle on the embryo",
      body: "The opening is made with computer-guided, micrometre-level precision, using the minimum energy needed and choosing a zone away from the embryo's genetic material. Current research and clinical experience suggest LAH does not increase the risk of birth defects or congenital abnormalities.",
    },
  },
  video: {
    id: "XBKvNWan2HU",
    title: "What is Laser-Assisted Hatching? — Dr. Suman Singh",
    description:
      "Fertility expert Dr. Suman Singh explains laser-assisted hatching — what it is, who it is for, and its benefits and considerations.",
    eyebrow: "Watch & Learn",
    heading: { lead: "What is laser hatching?", em: "Explained by our experts" },
  },
  benefits: {
    heading: { lead: "The benefits of", em: "laser-assisted hatching" },
    subtitle: "By easing hatching, LAH can support implantation in suitable cases.",
    items: [
      "Provides a mechanical advantage for the embryo to hatch.",
      "Encourages earlier embryo–endometrium contact.",
      "May help speed the natural reactions between embryo and endometrium.",
      "May improve implantation and pregnancy rates where the zona is a barrier.",
      "Required before blastomere biopsy for PGT testing.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who may benefit from", em: "LAH?" },
    subtitle: "LAH is particularly considered in the following situations.",
    items: [
      "Advanced maternal age",
      "Frozen-thawed embryos",
      "A thick zona pellucida, or expected zona thickening from in-vitro culture",
      "Previous IVF cycle failures",
      "When PGT (embryo biopsy) is planned",
      "Selected IVF patients where assisted hatching may help",
    ],
  },
  process: {
    heading: { lead: "How", em: "LAH is performed" },
    subtitle: "A quick, precise lab step on the day of transfer — nothing is done to the patient.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "On transfer day", d: "LAH is carried out in the IVF lab on the day of embryo transfer, on day 3 or day 5 (blastocyst) embryos as indicated." },
      { icon: Target, n: "02", t: "Zone selection", d: "A site on the zona pellucida is chosen away from the embryo's genetic material to keep the embryo safe." },
      { icon: Zap, n: "03", t: "Laser opening", d: "A dedicated FDA-approved laser, computer-guided to micrometre accuracy, makes a small opening using minimum energy." },
      { icon: HeartPulse, n: "04", t: "Embryo transfer", d: "The embryo is then transferred into the uterus by the standard IVF procedure, with a pregnancy test about two weeks later." },
    ],
    note: "The procedure takes only a few minutes per embryo and is done entirely in the lab, on the same day as the embryo transfer.",
  },
  whyUs: {
    heading: { lead: "Why choose Bavishi Fertility Institute for", em: "laser hatching" },
    items: WHY_BAVISHI_FERTILITY_INSTITUTE,
  },
  success: {
    factors: [
      "Embryo quality",
      "Zona pellucida thickness",
      "Woman's age",
      "Uterine receptivity",
      "Whether the embryo is fresh or frozen-thawed",
      "Overall reproductive health",
    ],
    note: "LAH does not guarantee pregnancy; success also depends on embryo quality and uterine receptivity. It is most useful when the zona is a likely barrier.",
  },
  cost: { includes: STD_COST },
  risks: {
    heading: { lead: "Honest about the", em: "considerations" },
    subtitle: "LAH is safe in expert hands; here is what to keep in mind.",
    items: [
      { t: "Specialised equipment & skill", d: "LAH requires expensive, dedicated equipment and highly skilled embryologists.", help: "Bavishi Fertility Institute offers LAH with the necessary expertise and dedicated laser systems." },
      { t: "Uncommon embryo risks", d: "There is an uncommon chance of embryo damage, or of monozygotic (identical) twinning.", help: "Computer-guided precision and minimum laser energy keep this risk very low." },
      { t: "Added cost", d: "LAH adds a small extra cost to the IVF cycle.", help: "Transparent pricing and interest-free EMI, applied only where LAH is indicated." },
      { t: "Not a guarantee", d: "LAH can improve implantation chances but does not guarantee pregnancy.", help: "We recommend it selectively, where the zona is likely to be a barrier." },
    ],
  },
  faqs: [
    { q: "Is LAH safe for all embryo types?", a: "LAH is generally safe for all embryo types, including donor embryos, as long as they are of good quality and suitable for implantation." },
    { q: "Does LAH increase the risk of birth defects?", a: "Current research and clinical experience suggest that LAH does not increase the risk of birth defects or congenital abnormalities." },
    { q: "How long does the procedure take?", a: "It typically takes only a few minutes per embryo and is done on the same day as the embryo transfer." },
    { q: "Can LAH be performed on day-5 blastocysts?", a: "Yes. LAH can be performed on both day-3 and day-5 (blastocyst) embryos, depending on the clinical indication." },
    { q: "Do I need any special preparation?", a: "No special preparation is needed by the patient, as the procedure is performed entirely in the lab on the embryos." },
    { q: "Can LAH be combined with other techniques?", a: "Yes. LAH is often used alongside advanced techniques such as ICSI and PGT-A to support implantation." },
    { q: "Does LAH guarantee pregnancy?", a: "No. While LAH can improve implantation chances, it does not guarantee pregnancy. Success also depends on embryo quality and uterine receptivity." },
  ],
  related: ["blastocyst-transfer", "icsi", "ivf", "ivf-failure", "spindle-view-icsi"],
  cta: {
    heading: "Wondering if",
    headingEm: "laser hatching could help?",
    subtitle: "Speak with our specialists about whether assisted hatching is right for your embryos.",
  },
};

/* ===================================================================== */
/* Egg Donation (Oocyte Donation)                                         */
/* ===================================================================== */

export const eggDonation: Treatment = {
  slug: "egg-donation",
  href: "/egg-donation",
  name: "Egg Donation Treatment",
  shortName: "Egg Donation",
  alternateName: "Oocyte Donation",
  breadcrumbName: "Egg Donation",
  meta: {
    title: "Egg Donation Treatment (Oocyte Donation) — Bavishi Fertility Institute",
    description:
      "What is egg donation? How oocyte donation works, who needs it, donor screening and success factors. Young screened donors, Class 1000 labs, India's trusted fertility specialists since 1984.",
    ogImage: "/assets/donor services/Egg-donation.png",
  },
  procedure: {
    procedureType: "https://schema.org/NoninvasiveProcedure",
    bodyLocation: "Uterus",
    howPerformed:
      "Eggs are retrieved from a healthy, screened young donor after controlled stimulation, fertilised with the partner's sperm by ICSI in the laboratory, cultured into embryos, and the best embryo is transferred into the recipient's uterus.",
    followup: "A Beta-HCG blood test is performed about 13–15 days after embryo transfer to confirm pregnancy.",
  },
  lastReviewed: "2026-06-01",
  reviewerSlug: "falguni-bavishi",
  hero: {
    eyebrow: "Donor Programme",
    h1: "Egg Donation Treatment",
    h1Em: "Oocyte Donation at Bavishi Fertility Institute",
    tagline:
      "When your own eggs can no longer help you conceive, eggs from a healthy, screened young donor can. India's trusted fertility specialists since 1984 — Class 1000 IVF labs, rigorously screened donors, and compassionate, fully confidential care.",
    badges: ["Young Screened Donors", "Since 1984", "Class 1000 Labs", "ART Act Compliant"],
    image: "/assets/donor services/Egg-donation.png",
    imageAlt: "Egg donation (oocyte donation) at Bavishi Fertility Institute — a hopeful mother-to-be",
  },
  whatIs: {
    heading: { lead: "What is", em: "Egg Donation?" },
    paragraphs: [
      "Egg donation — also called oocyte donation — is an assisted-reproduction technique in which the eggs come from a healthy, screened young donor instead of the patient. The donor's eggs are fertilised in the laboratory with the partner's sperm, and the resulting embryo is transferred to the recipient's uterus. The recipient carries and delivers the pregnancy herself.",
      "It is recommended when a woman cannot conceive with her own eggs — for example after menopause, with very low ovarian reserve or poor egg quality, after repeated IVF failure, or when there is a risk of passing on a genetic condition. Because the eggs come from young donors, donor-egg treatment offers some of the highest success rates in fertility care.",
    ],
    aside: {
      title: "About Bavishi Fertility Institute",
      body: "Bavishi Fertility Institute is one of India's leading fertility clinic chains, operating since 1984 with 15 centres across 8 cities. Bavishi Fertility Institute has achieved 30,000+ successful IVF pregnancies, holds the National Fertility Award for five consecutive years (2021–2025), and is FOGSI-certified — running Class 1000 embryology labs and well-regulated, ethical donor programmes.",
    },
  },
  benefits: {
    heading: { lead: "The advantages of", em: "Egg Donation" },
    subtitle: "Because the eggs come from young, fertile donors, donor-egg treatment offers real, tangible advantages.",
    items: [
      "Eggs come from young, fertile donors — so pregnancy chances are high.",
      "Lower miscarriage risk compared with using older eggs.",
      "Reduced risk of age-related genetic problems in the child.",
      "You carry and deliver the pregnancy yourself — full motherhood bonding.",
      "Your partner contributes genetically through his sperm.",
      "Surplus good-quality embryos can be frozen for future attempts.",
      "The entire treatment is kept completely confidential.",
    ],
  },
  types: {
    heading: { lead: "Types of", em: "Egg Donation" },
    subtitle: "Egg donation can be arranged in the way that suits you best.",
    items: [
      { icon: Eye, t: "Anonymous Donation", d: "The donor's identity is not disclosed. Matching is done by our team on physical and medical characteristics." },
      { icon: Sparkles, t: "Known Donation", d: "A donor known to you — such as a friend or family member — donates eggs, with the same full screening and consent." },
      { icon: Snowflake, t: "Fresh or Frozen Eggs", d: "Treatment can use fresh donor eggs or vitrified (frozen) eggs from our donor bank for immediate use." },
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who needs", em: "Egg Donation?" },
    subtitle: "Egg donation is recommended when conceiving with your own eggs is no longer possible.",
    items: [
      "Menopause — natural, or following medical or surgical treatment.",
      "Ovaries removed, damaged or diseased, or no response to previous stimulation.",
      "Poor egg quality or quantity — advanced age, very low AMH or poor ovarian reserve.",
      "Repeated, unexplained IVF failure or failure to form good-quality embryos.",
      "Recurrent implantation failure despite good-quality embryo transfers.",
      "Risk of passing on a hereditary genetic condition through the eggs.",
      "After chemotherapy or radiotherapy that has affected egg supply.",
    ],
  },
  process: {
    heading: { lead: "How egg donation", em: "works" },
    subtitle: "A clear, supported pathway from first consultation to embryo transfer.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Consultation & Planning", d: "Your specialist reviews your history, confirms egg donation is right for you, and explains every step." },
      { icon: Sparkles, n: "02", t: "Donor Matching", d: "A healthy, screened young donor is matched to you on physical and medical characteristics." },
      { icon: Activity, n: "03", t: "Cycle Synchronisation", d: "The donor's and your cycles are synchronised with medication while your uterine lining is prepared." },
      { icon: Egg, n: "04", t: "Egg Retrieval", d: "The donor's eggs are collected in a short, day-care ovum pick-up procedure." },
      { icon: Microscope, n: "05", t: "Fertilisation (ICSI)", d: "The eggs are fertilised with your partner's sperm in the laboratory and cultured into embryos." },
      { icon: Baby, n: "06", t: "Embryo Transfer", d: "The best embryo is transferred into your uterus; surplus embryos can be frozen for the future." },
    ],
    note: "Most donor-egg cycles span a few weeks from matching to transfer.",
  },
  technology: {
    eyebrow: "Donor Screening",
    heading: { lead: "Every donor,", em: "rigorously screened" },
    subtitle: "Donors are young, married women with at least one healthy child, under 30, and cleared on every screen below.",
    items: [
      { icon: Stethoscope, t: "Medical Screening", d: "Complete medical, family and personal history, physical examination and an exhaustive health check-up." },
      { icon: Dna, t: "Genetic Screening", d: "Detailed family-history review and screening for common genetic conditions, with further testing available on request." },
      { icon: HeartPulse, t: "Psychological Evaluation", d: "An in-depth personal interview by our in-house team to confirm understanding of the process and informed, balanced consent." },
      { icon: Activity, t: "Health Assessment", d: "Blood counts, blood sugar, liver and kidney function, infection (STD) screening and a 3D ultrasound of ovarian reserve." },
    ],
  },
  whyUs: {
    heading: { lead: "Why choose", em: "Bavishi Fertility Institute for egg donation" },
    items: [
      { icon: Award, t: "Trusted Since 1984", d: "30,000+ successful pregnancies and the National Fertility Award five years running (2021–2025)." },
      { icon: FlaskConical, t: "Class 1000 IVF Labs", d: "Advanced embryology labs and ICSI expertise for the best chance with every donor egg." },
      { icon: ShieldCheck, t: "Rigorously Screened Donors", d: "Young donors cleared on medical, genetic, psychological and health screening before matching." },
      { icon: Layers, t: "Fresh or Frozen Donors", d: "Access to fresh donors and a vitrified donor-egg bank for immediate treatment." },
      { icon: Eye, t: "Complete Confidentiality", d: "Your treatment and donor matching are handled with total privacy at every step." },
      { icon: ListChecks, t: "Ethical & ART-Compliant", d: "Donor insurance, consent and documentation handled in line with India's ART Act." },
    ],
  },
  success: {
    factors: [
      "Recipient's age and overall health",
      "Uterine receptivity and lining",
      "Partner's sperm quality",
      "Embryo quality",
      "Number of embryos transferred",
      "Lifestyle factors such as smoking and stress",
    ],
    note: "Because donor eggs come from young, screened donors, donor-egg cycles are among the higher-success fertility treatments — but outcomes still depend on the factors above and can never be guaranteed.",
  },
  cost: {
    includes: [
      "Specialist consultation and treatment planning",
      "Full donor screening and matching",
      "Cycle-synchronisation medication",
      "Egg retrieval and ICSI fertilisation",
      "Embryo culture and transfer",
      "Donor insurance as required by law",
    ],
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    subtitle: "Honest guidance so you can decide with complete clarity.",
    items: [
      { t: "A genetic link to consider", d: "The child will not inherit the recipient's genes, though the partner contributes through his sperm and the mother carries and delivers the baby.", help: "Detailed counselling helps couples make an informed, confident decision before starting." },
      { t: "Procedure & medication", d: "Hormonal medication and the minor egg-retrieval procedure carry the usual small risks for the donor.", help: "Donors are monitored closely throughout, with insurance arranged as required by law." },
      { t: "Legal & consent", d: "Egg donation has legal requirements that vary by region.", help: "Bavishi Fertility Institute follows India's ART Act and completes the required donor insurance, affidavits and consents." },
    ],
  },
  faqs: [
    { q: "Are \"ovum donation\" and \"egg donation\" the same?", a: "Yes. \"Ovum\" is simply another word for egg, so the two terms describe exactly the same process." },
    { q: "What types of egg donation are available?", a: "Anonymous donation, where the donor's identity is not disclosed, and known donation, where a friend or family member donates. Eggs may be fresh or frozen." },
    { q: "Who can be an egg donor at Bavishi Fertility Institute?", a: "Healthy, married young women under 30 who already have at least one healthy living child and pass full medical, genetic and psychological screening." },
    { q: "Will the baby be genetically related to me?", a: "The baby will not inherit your genes, since the eggs come from a donor, but your partner contributes genetically through his sperm, and you carry and deliver the baby yourself." },
    { q: "How are the donor eggs fertilised?", a: "They are fertilised with your partner's sperm in the laboratory, usually using ICSI, and grown into embryos before transfer." },
    { q: "Is egg donation safe?", a: "It is generally considered safe. As with any medical treatment there are small risks, such as medication reactions or pregnancy-related complications, which our team monitors closely." },
    { q: "What are the success rates with donor eggs?", a: "Because donor eggs come from young donors, success rates are relatively high, but they still depend on factors such as your age, uterine health, sperm quality and embryo quality. No clinic can guarantee pregnancy." },
    { q: "Is egg donation legal in India?", a: "Yes. It is regulated under the ART Act. Recipients arrange insurance for the donor and sign the required consent covering the donor's medical care." },
    { q: "Can surplus embryos be frozen?", a: "Yes. Good-quality embryos that are not transferred can be vitrified (frozen) for future attempts." },
    { q: "Will my treatment be kept confidential?", a: "Yes. The entire process — including donor matching — is handled with complete confidentiality." },
  ],
  related: ["ivf", "icsi", "ivf-failure", "embryo-donation", "fertility-preservation"],
  cta: {
    heading: "Considering",
    headingEm: "egg donation?",
    subtitle: "Speak with our specialists about whether donor eggs are right for you — honestly and confidentially.",
  },
};

/* ===================================================================== */
/* Sperm Donation                                                         */
/* ===================================================================== */

export const spermDonation: Treatment = {
  slug: "sperm-donation",
  href: "/sperm-donation",
  name: "Sperm Donation Treatment",
  shortName: "Sperm Donation",
  alternateName: "Donor Sperm Treatment",
  breadcrumbName: "Sperm Donation",
  meta: {
    title: "Donor Sperm Treatment (Sperm Donation) — Bavishi Fertility Institute",
    description:
      "What is sperm donation? How donor sperm is used in IUI and IVF–ICSI, who needs it, donor screening and success factors. Large screened donor pool, no waiting, trusted since 1984.",
    ogImage: "/assets/donor services/Sperm-dontation.png",
  },
  procedure: {
    procedureType: "https://schema.org/NoninvasiveProcedure",
    bodyLocation: "Uterus",
    howPerformed:
      "Screened donor sperm is used to fertilise the female partner's eggs — either by intrauterine insemination (IUI) or by IVF with ICSI in the laboratory — and the resulting pregnancy is carried by the female partner.",
    followup: "A pregnancy (Beta-HCG) test is performed about two weeks after insemination or embryo transfer.",
  },
  lastReviewed: "2026-06-01",
  reviewerSlug: "parth-bavishi",
  hero: {
    eyebrow: "Donor Programme",
    h1: "Donor Sperm Treatment",
    h1Em: "at Bavishi Fertility Institute",
    tagline:
      "When the partner's sperm cannot be used, carefully screened donor sperm offers a clear path to parenthood — through IUI or IVF–ICSI. A large pool of screened frozen donors means minimal waiting, with complete confidentiality.",
    badges: ["Large Screened Donor Pool", "No Waiting Time", "Since 1984", "ART Act Compliant"],
    image: "/assets/donor services/Sperm-dontation.png",
    imageAlt: "Sperm donation (donor sperm treatment) at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Sperm Donation?" },
    paragraphs: [
      "Sperm donation is the use of carefully screened donor sperm to achieve pregnancy — through intrauterine insemination (IUI) or through IVF with ICSI. The donor sperm fertilises the female partner's eggs, and the pregnancy is carried by the female partner herself.",
      "It is considered when the male partner has no usable sperm — such as azoospermia where surgical retrieval is not possible — or has severe male-factor infertility, a high risk of transmitting a genetic condition, or for single women choosing parenthood. At Bavishi Fertility Institute a large pool of frozen, screened donor sperm means minimal waiting.",
    ],
    aside: {
      title: "About Bavishi Fertility Institute",
      body: "Bavishi Fertility Institute is one of India's leading fertility clinic chains, operating since 1984 with 15 centres across 8 cities. Bavishi Fertility Institute has achieved 30,000+ successful IVF pregnancies, holds the National Fertility Award for five consecutive years (2021–2025), and is FOGSI-certified — with a large, well-regulated donor-sperm programme.",
    },
  },
  benefits: {
    heading: { lead: "The advantages of", em: "Sperm Donation" },
    subtitle: "Donor sperm opens a reliable route to parenthood when the partner's sperm cannot be used.",
    items: [
      "Sperm from young, screened donors with excellent semen quality.",
      "High pregnancy chances even in severe male-factor infertility.",
      "A pathway to parenthood when the partner's sperm cannot be used.",
      "The female partner carries and delivers the pregnancy herself.",
      "A large pool of frozen donor sperm means minimal waiting.",
      "Donors matched on physical and background characteristics where possible.",
      "Treatment is kept completely confidential.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who needs", em: "Sperm Donation?" },
    subtitle: "Donor sperm is considered when the partner's own sperm cannot achieve a pregnancy.",
    items: [
      "Azoospermia — no sperm in the ejaculate — where surgical retrieval isn't possible or affordable.",
      "Severe male-factor infertility — very low count, motility or abnormal morphology.",
      "100% non-motile sperm or high sperm-DNA fragmentation.",
      "Repeated poor fertilisation or embryo formation in previous IVF cycles.",
      "Risk of transmitting a hereditary genetic condition through the sperm.",
      "Single women choosing to become parents.",
    ],
  },
  process: {
    heading: { lead: "How sperm donation", em: "works" },
    subtitle: "A straightforward, supported pathway tailored to your situation.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Consultation & Counselling", d: "Your specialist reviews your history, confirms donor sperm is the right option, and explains every step." },
      { icon: Sparkles, n: "02", t: "Donor Selection & Matching", d: "A screened donor is matched on characteristics such as height, build, complexion, ethnicity and education." },
      { icon: FlaskConical, n: "03", t: "Semen Preparation", d: "Frozen donor semen is thawed and prepared in the laboratory for insemination or fertilisation." },
      { icon: Syringe, n: "04", t: "IUI or IVF–ICSI", d: "Prepared donor sperm is used for intrauterine insemination, or to fertilise eggs by IVF with ICSI." },
      { icon: Baby, n: "05", t: "Pregnancy Test", d: "A pregnancy test confirms the outcome about two weeks after insemination or embryo transfer." },
    ],
    note: "The right method — IUI or IVF–ICSI — depends on the female partner's fertility assessment.",
  },
  technology: {
    eyebrow: "Donor Screening",
    heading: { lead: "Every donor,", em: "rigorously screened" },
    subtitle: "Only young donors with normal screening are recruited, and every sample is quarantined and re-checked.",
    items: [
      { icon: Stethoscope, t: "Medical Screening", d: "Complete medical, family and personal history, physical examination and an exhaustive health check-up." },
      { icon: Dna, t: "Genetic Screening", d: "Detailed family-history review and screening for common genetic conditions, with further testing available on request." },
      { icon: HeartPulse, t: "Psychological Evaluation", d: "An in-depth personal interview by our in-house team to confirm understanding of the process and informed consent." },
      { icon: Activity, t: "Health Assessment", d: "Semen analysis plus blood counts, blood sugar, liver and kidney function and infection (STD) screening." },
    ],
  },
  whyUs: {
    heading: { lead: "Why choose", em: "Bavishi Fertility Institute for sperm donation" },
    items: [
      { icon: Award, t: "Trusted Since 1984", d: "30,000+ successful pregnancies and the National Fertility Award five years running (2021–2025)." },
      { icon: Layers, t: "Large Donor Pool", d: "A large bank of frozen, screened donor sperm ready for use — no long waiting times." },
      { icon: ShieldCheck, t: "Rigorously Screened Donors", d: "Donors cleared on medical, genetic and psychological screening, with semen analysis and infection testing." },
      { icon: Sparkles, t: "Careful Matching", d: "Matched on height, build, complexion, eye colour, ethnicity and education wherever possible." },
      { icon: Eye, t: "Complete Confidentiality", d: "Your treatment and donor matching are handled with total privacy at every step." },
      { icon: ListChecks, t: "Ethical & ART-Compliant", d: "A regulated, ethical process under India's ART Act, protecting the rights of everyone involved." },
    ],
  },
  success: {
    factors: [
      "Female partner's age and overall health",
      "Egg quality and quantity",
      "Embryo quality",
      "Method used — IUI versus IVF–ICSI",
      "Number of embryos transferred",
      "Clinic experience and laboratory quality",
    ],
    note: "Reported success varies widely from case to case and is generally higher for younger women. Your specialist will explain realistic expectations for your situation — outcomes cannot be guaranteed.",
  },
  cost: {
    includes: [
      "Specialist consultation and counselling",
      "Donor selection, screening and matching",
      "Frozen donor-sperm sample and preparation",
      "IUI or IVF–ICSI procedure",
      "Pregnancy test and follow-up",
      "Consent and documentation as required by law",
    ],
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    subtitle: "Honest guidance so you can decide with complete clarity.",
    items: [
      { t: "A genetic link to consider", d: "The child will not inherit the male partner's genes, though the female partner contributes through her eggs and carries the pregnancy.", help: "Counselling helps both partners reach a confident, informed decision before starting." },
      { t: "Emotional readiness", d: "Using donor sperm is an emotional decision for many couples and individuals.", help: "In-house psychological evaluation and counselling support you throughout." },
      { t: "Legal & consent", d: "Donor sperm treatment is regulated and requires proper consent.", help: "Bavishi Fertility Institute follows India's ART Act, ensuring an ethical process that protects all parties' rights." },
    ],
  },
  faqs: [
    { q: "What is sperm donation?", a: "It is the use of screened donor sperm to achieve pregnancy, either through intrauterine insemination (IUI) or through IVF with ICSI." },
    { q: "When is donor sperm needed?", a: "For azoospermia where sperm cannot be retrieved, severe male-factor infertility, a high risk of transmitting a genetic condition, or for single women choosing parenthood." },
    { q: "How are sperm donors screened?", a: "Donors undergo medical, genetic and psychological evaluation along with semen analysis and infection screening before their sperm is used." },
    { q: "How are donors matched to us?", a: "We match on characteristics such as height, build, complexion, eye colour, ethnicity and education wherever possible." },
    { q: "Is there a waiting time for a donor?", a: "No. Bavishi Fertility Institute maintains a large pool of frozen, screened donor sperm ready for use." },
    { q: "Will the baby be genetically related to us?", a: "The baby will not inherit the male partner's genes, but the female partner contributes through her eggs and carries the pregnancy herself." },
    { q: "Is sperm donation legal in India?", a: "Yes. It is regulated by the ART (Assisted Reproductive Technology) Act, which protects the rights of everyone involved." },
    { q: "What are the success rates with donor sperm?", a: "Success varies from case to case and is generally higher for younger women. It depends on the female partner's age and health, egg and embryo quality and the technique used. Outcomes cannot be guaranteed." },
    { q: "Can we try with the partner's own sperm first?", a: "Yes. Where the partner's sperm is usable, techniques such as ICSI, IMSI or PICSI, or surgical retrieval (PESA/TESA/TESE), are considered before donor sperm." },
    { q: "Is the process confidential?", a: "Yes. Donor-sperm treatment is kept completely confidential." },
  ],
  related: ["iui", "icsi", "ivf", "azoospermia", "embryo-donation"],
  cta: {
    heading: "Exploring",
    headingEm: "donor sperm options?",
    subtitle: "Talk to our specialists about whether donor sperm is right for you — honestly and confidentially.",
  },
};

/* ===================================================================== */
/* Embryo Donation                                                        */
/* ===================================================================== */

export const embryoDonation: Treatment = {
  slug: "embryo-donation",
  href: "/embryo-donation",
  name: "Embryo Donation Treatment",
  shortName: "Embryo Donation",
  alternateName: "Donor Embryo Treatment",
  breadcrumbName: "Embryo Donation",
  meta: {
    title: "Embryo Donation Treatment (Donor Embryo) — Bavishi Fertility Institute",
    description:
      "What is embryo donation? How donor-embryo treatment works when both eggs and sperm are needed, who needs it, donor screening and success factors. Trusted fertility specialists since 1984.",
    ogImage: "/assets/donor services/Embryo-dontation.png",
  },
  procedure: {
    procedureType: "https://schema.org/NoninvasiveProcedure",
    bodyLocation: "Uterus",
    howPerformed:
      "Embryos created from donor eggs and donor sperm are cultured in the IVF laboratory; after the recipient's uterus is prepared, the best embryo is transferred and the recipient carries the pregnancy.",
    followup: "A Beta-HCG blood test is performed about 13–15 days after embryo transfer to confirm pregnancy.",
  },
  lastReviewed: "2026-06-01",
  reviewerSlug: "himanshu-bavishi",
  hero: {
    eyebrow: "Donor Programme",
    h1: "Embryo Donation Treatment",
    h1Em: "Donor Embryos at Bavishi Fertility Institute",
    tagline:
      "When both eggs and sperm are needed, embryo donation offers a single, compassionate path to pregnancy. Embryos created from young, screened donors — and you carry and deliver your baby yourself.",
    badges: ["Screened Donor Embryos", "Carry Your Own Pregnancy", "Since 1984", "ART Act Compliant"],
    image: "/assets/donor services/Embryo-dontation.png",
    imageAlt: "Embryo donation (donor embryo treatment) at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Embryo Donation?" },
    paragraphs: [
      "Embryo donation is a treatment in which embryos created from donor eggs and donor sperm are transferred into the recipient's uterus. It is the right option when both partners need donor gametes — the woman cannot produce viable eggs and the man cannot provide usable sperm — yet the woman has a healthy uterus and can carry a pregnancy.",
      "The procedure mirrors standard IVF: the uterus is prepared, a screened donor embryo is transferred, and the recipient carries and delivers the baby herself. It is often a simpler and more affordable route than arranging separate egg- and sperm-donor programmes.",
    ],
    aside: {
      title: "About Bavishi Fertility Institute",
      body: "Bavishi Fertility Institute is one of India's leading fertility clinic chains, operating since 1984 with 15 centres across 8 cities. Bavishi Fertility Institute has achieved 30,000+ successful IVF pregnancies, holds the National Fertility Award for five consecutive years (2021–2025), and is FOGSI-certified — with well-regulated egg, sperm and embryo donor programmes.",
    },
  },
  benefits: {
    heading: { lead: "The advantages of", em: "Embryo Donation" },
    subtitle: "A single donor pathway when both eggs and sperm are needed.",
    items: [
      "A pathway to pregnancy when both eggs and sperm are needed.",
      "Embryos created from young, screened, genetically tested donors.",
      "You carry and deliver the pregnancy yourself.",
      "Often simpler and more affordable than two separate donor programmes.",
      "Ready donor embryos mean minimal waiting.",
      "The entire treatment is kept completely confidential.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who needs", em: "Embryo Donation?" },
    subtitle: "Embryo donation is considered when both eggs and sperm need to come from donors.",
    items: [
      "Both partners need donor gametes — donor eggs and donor sperm.",
      "The woman has a healthy uterus and can carry a pregnancy but cannot produce viable eggs.",
      "Poor egg quality combined with severe male-factor infertility or azoospermia.",
      "Repeated IVF failures with own or single-donor gametes.",
      "Couples who prefer a ready donor-embryo pathway.",
    ],
  },
  process: {
    heading: { lead: "How embryo donation", em: "works" },
    subtitle: "A clear, supported pathway — much like a frozen embryo transfer.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Consultation & Counselling", d: "Your specialist confirms embryo donation is right for you and obtains informed consent from both partners." },
      { icon: Sparkles, n: "02", t: "Embryo Selection & Matching", d: "A screened donor embryo is matched to you from embryos created with donor eggs and donor sperm." },
      { icon: Activity, n: "03", t: "Uterine Preparation", d: "Your uterine lining is prepared with medication to create the ideal environment for implantation." },
      { icon: Baby, n: "04", t: "Embryo Transfer", d: "The selected donor embryo is transferred into your uterus in a simple, painless procedure." },
      { icon: HeartPulse, n: "05", t: "Pregnancy Test", d: "A Beta-HCG blood test about two weeks later confirms the outcome." },
    ],
    note: "Because the embryos are ready, treatment focuses on preparing your uterus for transfer.",
  },
  technology: {
    eyebrow: "Donor Screening",
    heading: { lead: "Every donor,", em: "rigorously screened" },
    subtitle: "Both egg and sperm donors are young, screened and cleared on every check below before embryos are created.",
    items: [
      { icon: Stethoscope, t: "Medical Screening", d: "Complete medical, family and personal history, physical examination and an exhaustive health check-up." },
      { icon: Dna, t: "Genetic Screening", d: "Detailed family-history review and screening for common genetic conditions, with further testing available on request." },
      { icon: HeartPulse, t: "Psychological Evaluation", d: "In-depth personal interviews by our in-house team to confirm understanding and informed consent." },
      { icon: Activity, t: "Health Assessment", d: "Blood counts, blood sugar, liver and kidney function, infection (STD) screening and relevant ultrasound or semen analysis." },
    ],
  },
  whyUs: {
    heading: { lead: "Why choose", em: "Bavishi Fertility Institute for embryo donation" },
    items: [
      { icon: Award, t: "Trusted Since 1984", d: "30,000+ successful pregnancies and the National Fertility Award five years running (2021–2025)." },
      { icon: FlaskConical, t: "Class 1000 IVF Labs", d: "Advanced embryology labs where donor embryos are cultured and transferred with precision." },
      { icon: ShieldCheck, t: "Screened Donor Embryos", d: "Embryos from healthy, genetically tested and medically screened egg and sperm donors." },
      { icon: Layers, t: "Ready Donor Pathway", d: "An established donor programme means donor embryos are generally available without long waits." },
      { icon: Eye, t: "Complete Confidentiality", d: "Your treatment and donor matching are handled with total privacy at every step." },
      { icon: ListChecks, t: "Ethical & ART-Compliant", d: "Informed consent from both partners and full compliance with India's ART Act." },
    ],
  },
  success: {
    factors: [
      "Recipient's age and uterine health",
      "Quality of the donor embryos",
      "Endometrial (uterine lining) receptivity",
      "Number of embryos transferred",
      "Overall health and lifestyle",
      "Clinic experience and laboratory quality",
    ],
    note: "Embryo-donation outcomes are individual and depend on the factors above. Your specialist will explain realistic expectations for your situation — pregnancy can never be guaranteed.",
  },
  cost: {
    includes: [
      "Specialist consultation and counselling",
      "Informed-consent and documentation process",
      "Donor-embryo selection and matching",
      "Uterine-preparation medication",
      "Embryo transfer procedure",
      "Pregnancy test and follow-up",
    ],
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    subtitle: "Honest guidance so you can decide with complete clarity.",
    items: [
      { t: "No genetic link to either parent", d: "Because both gametes are from donors, the baby will not inherit either partner's genes.", help: "In-depth counselling helps both partners decide with confidence; the mother still carries and delivers the baby." },
      { t: "Emotional readiness", d: "Choosing donor embryos is a significant, emotional decision for many couples.", help: "Counselling for both partners is part of the process before treatment begins." },
      { t: "Legal & consent", d: "Embryo donation requires proper consent and is regulated.", help: "Bavishi Fertility Institute obtains informed consent from both partners and follows India's ART Act in full." },
    ],
  },
  faqs: [
    { q: "What is embryo donation?", a: "It is a treatment where embryos created from donor eggs and donor sperm are transferred into the recipient's uterus." },
    { q: "Who needs embryo donation?", a: "Couples who need both donor eggs and donor sperm, where the woman has a healthy uterus and can carry a pregnancy." },
    { q: "How is it different from egg or sperm donation?", a: "Egg or sperm donation replaces only one gamete; embryo donation uses donor eggs and donor sperm together." },
    { q: "Will the baby be genetically related to us?", a: "No. The baby will not inherit either partner's genes, but the mother carries and delivers the baby herself." },
    { q: "How are the donor embryos screened?", a: "They are created from young egg and sperm donors who pass full medical, genetic and psychological screening." },
    { q: "Is there a waiting time?", a: "Bavishi Fertility Institute's established donor programme means donor embryos are generally available without long waits." },
    { q: "Does the procedure differ from normal IVF?", a: "No. The uterus is prepared, a donor embryo is transferred, and a pregnancy test follows — much like a frozen embryo transfer." },
    { q: "Is embryo donation legal in India?", a: "Yes. It requires informed consent from both partners and follows the ART Act." },
    { q: "What are the chances of success?", a: "Success depends on the recipient's uterine health and age, embryo quality and other factors. Outcomes are individual and cannot be guaranteed." },
    { q: "Is the treatment confidential?", a: "Yes. The entire process is handled with complete confidentiality." },
  ],
  related: ["egg-donation", "sperm-donation", "ivf", "ivf-failure", "icsi"],
  cta: {
    heading: "Is",
    headingEm: "embryo donation right for you?",
    subtitle: "Speak with our specialists about the donor-embryo pathway — compassionately and in complete confidence.",
  },
};

/* =====================================================================
 * Factory + shared content for the condition/sub-treatment pages.
 * `defineTreatment` fills the boilerplate-but-required fields (href,
 * breadcrumb, review date, reviewer, cost) so each page object only carries
 * its distinctive medical content — keeping authoring lean and consistent.
 * ===================================================================== */
const BFI_ASIDE = {
  title: "About Bavishi Fertility Institute",
  body: "Bavishi Fertility Institute is one of India's leading fertility clinic chains, operating since 1984 with 15 centres across 8 cities. Bavishi Fertility Institute has achieved 30,000+ successful IVF pregnancies, holds the National Fertility Award for five consecutive years (2021–2025), and is FOGSI-certified — running Class 1000 embryology labs.",
};

const DEFAULT_COST = {
  includes: [
    "Specialist consultation and evaluation",
    "Required diagnostic tests and monitoring",
    "The recommended treatment or procedure",
    "Medications as per your protocol",
    "Follow-up review and guidance",
  ],
};

type TreatmentSeed = Omit<Treatment, "href" | "breadcrumbName" | "lastReviewed" | "reviewerSlug" | "cost"> &
  Partial<Pick<Treatment, "href" | "breadcrumbName" | "lastReviewed" | "reviewerSlug" | "cost">>;

function defineTreatment(s: TreatmentSeed): Treatment {
  return {
    ...s,
    href: s.href ?? `/${s.slug}`,
    breadcrumbName: s.breadcrumbName ?? s.shortName,
    lastReviewed: s.lastReviewed ?? "2026-06-01",
    reviewerSlug: s.reviewerSlug ?? "himanshu-bavishi",
    cost: s.cost ?? DEFAULT_COST,
  };
}

/* ===================================================================== */
/* MALE INFERTILITY                                                       */
/* ===================================================================== */

export const oligospermia = defineTreatment({
  slug: "oligospermia",
  name: "Low Sperm Count (Oligospermia) Treatment",
  shortName: "Low Sperm Count",
  alternateName: "Oligospermia",
  reviewerSlug: "parth-bavishi",
  meta: {
    title: "Low Sperm Count (Oligospermia) Treatment — Bavishi Fertility Institute",
    description:
      "What causes a low sperm count (oligospermia), how it is diagnosed and treated — from lifestyle and medical therapy to IUI, IVF and ICSI. Expert male-fertility care since 1984.",
    ogImage: "/assets/conditions/oligospermia.png",
  },
  procedure: {
    procedureType: "https://schema.org/TherapeuticProcedure",
    bodyLocation: "Testes",
    howPerformed:
      "Oligospermia is confirmed on semen analysis, then treated by correcting the underlying cause (lifestyle, hormonal or surgical) and, where needed, by assisted reproduction such as IUI, IVF or ICSI.",
    followup: "A repeat semen analysis after about three months reflects a full sperm-production cycle.",
  },
  hero: {
    eyebrow: "Male Infertility",
    h1: "Low Sperm Count",
    h1Em: "(Oligospermia) Treatment",
    tagline:
      "A low sperm count is one of the most common — and most treatable — causes of male infertility. With accurate diagnosis and the right plan, most couples can still conceive.",
    badges: ["Andrology Specialists", "Advanced Semen Lab", "Since 1984", "IUI · IVF · ICSI"],
    image: "/assets/conditions/oligospermia.png",
    imageAlt: "Low sperm count (oligospermia) treatment at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Oligospermia?" },
    paragraphs: [
      "Oligospermia means a lower-than-normal number of sperm in the semen — generally fewer than 15 million sperm per millilitre. It is one of the commonest causes of male-factor infertility and is confirmed on a semen analysis.",
      "A low count reduces, but rarely removes, the chance of natural conception. Depending on the cause and severity, treatment ranges from lifestyle and medical therapy to assisted reproduction such as IUI, IVF or ICSI — where even a few healthy sperm can fertilise an egg.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "Why treat", em: "a low sperm count" },
    subtitle: "Finding and correcting the cause restores the best possible chance of conceiving.",
    items: [
      "An accurate cause is identified, not just the low number.",
      "Reversible causes — infection, hormones, varicocele, lifestyle — can be corrected.",
      "Many couples conceive naturally once the count improves.",
      "When needed, IUI, IVF or ICSI overcome a persistently low count.",
      "ICSI needs only a single healthy sperm per egg.",
      "A clear, honest plan with realistic expectations.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "When to", em: "get evaluated" },
    subtitle: "A semen analysis is the first step whenever male-factor infertility is suspected.",
    items: [
      "No pregnancy after a year of regular, unprotected intercourse.",
      "A previous semen report showing a low sperm count.",
      "A history of undescended testes, mumps, injury or testicular surgery.",
      "A visible or suspected varicocele (enlarged scrotal veins).",
      "Hormonal symptoms — low libido, reduced facial/body hair.",
      "Exposure to heat, smoking, alcohol, steroids or certain medication.",
    ],
  },
  process: {
    heading: { lead: "How we", em: "evaluate & treat" },
    subtitle: "A structured pathway from diagnosis to the right treatment for you.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Consultation & History", d: "A detailed history, examination and review of any earlier reports." },
      { icon: Beaker, n: "02", t: "Semen Analysis", d: "An accurate count, motility and morphology assessment in our andrology lab." },
      { icon: Stethoscope, n: "03", t: "Cause Work-up", d: "Hormone tests, scrotal ultrasound and infection screening as required." },
      { icon: Leaf, n: "04", t: "Targeted Treatment", d: "Lifestyle, medical or surgical correction of the cause where possible." },
      { icon: FlaskConical, n: "05", t: "Assisted Reproduction", d: "IUI, IVF or ICSI when the count remains low despite treatment." },
    ],
    note: "Sperm take about three months to mature, so improvements are reassessed after a full cycle.",
  },
  success: {
    factors: [
      "The cause and severity of the low count",
      "Sperm motility and morphology, not just number",
      "The female partner's age and fertility",
      "How well reversible factors are corrected",
      "The treatment chosen — natural, IUI, IVF or ICSI",
    ],
    note: "Outcomes vary from case to case; your specialist will explain realistic expectations. No clinic can guarantee a pregnancy.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Cause may persist", d: "Some causes of a low count are partly genetic and cannot be fully reversed.", help: "Where the count stays low, ICSI lets us fertilise eggs with very few sperm." },
      { t: "Time to improve", d: "Sperm production takes about three months, so results are not immediate.", help: "We reassess after a full cycle rather than changing the plan too soon." },
      { t: "Assisted-reproduction risks", d: "IUI, IVF and ICSI carry their own small, well-managed risks.", help: "Each step is explained and monitored so you can decide with full clarity." },
    ],
  },
  faqs: [
    { q: "What counts as a low sperm count?", a: "Generally fewer than 15 million sperm per millilitre of semen, confirmed on a semen analysis. Counts can vary, so the test is often repeated." },
    { q: "Can I still have a baby with a low sperm count?", a: "Often yes. Many couples conceive naturally once the count improves, and assisted reproduction such as IUI, IVF or ICSI can help when it does not." },
    { q: "What causes a low sperm count?", a: "Common causes include varicocele, infection, hormonal problems, undescended testes, certain medication, and lifestyle factors such as smoking, alcohol, heat and stress." },
    { q: "Can a low sperm count be increased naturally?", a: "Treating infection or a varicocele, balancing hormones and improving lifestyle can raise the count in many men. Results take about three months." },
    { q: "When is ICSI needed?", a: "When the count or motility is very low, ICSI injects a single healthy sperm directly into each egg, so even a small number of sperm can achieve fertilisation." },
  ],
  related: ["asthenospermia", "azoospermia", "icsi", "iui", "ivf"],
  cta: {
    heading: "Worried about a",
    headingEm: "low sperm count?",
    subtitle: "Book a confidential consultation with our andrology specialists for an accurate diagnosis and a clear plan.",
  },
});

export const asthenospermia = defineTreatment({
  slug: "asthenospermia",
  name: "Low Sperm Motility (Asthenospermia) Treatment",
  shortName: "Low Sperm Motility",
  alternateName: "Asthenospermia",
  reviewerSlug: "parth-bavishi",
  meta: {
    title: "Low Sperm Motility (Asthenospermia) Treatment — Bavishi Fertility Institute",
    description:
      "Asthenospermia (poor sperm motility) explained — causes, diagnosis and treatment, from correcting the cause to IUI, IVF and ICSI. Expert male-fertility care since 1984.",
    ogImage: "/assets/conditions/asthenospermia.png",
  },
  procedure: {
    procedureType: "https://schema.org/TherapeuticProcedure",
    bodyLocation: "Testes",
    howPerformed:
      "Poor sperm motility is identified on semen analysis and treated by correcting the cause where possible, with IUI, IVF or ICSI used to overcome reduced movement.",
    followup: "A repeat semen analysis after about three months assesses the response.",
  },
  hero: {
    eyebrow: "Male Infertility",
    h1: "Low Sperm Motility",
    h1Em: "(Asthenospermia) Treatment",
    tagline:
      "When sperm cannot swim well, they struggle to reach and fertilise the egg. Identifying why — and using the right technique — restores the chance of conception.",
    badges: ["Andrology Specialists", "Advanced Semen Lab", "Since 1984", "IVF · ICSI"],
    image: "/assets/conditions/asthenospermia.png",
    imageAlt: "Low sperm motility (asthenospermia) treatment at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Asthenospermia?" },
    paragraphs: [
      "Asthenospermia means reduced sperm motility — too few sperm move forward well enough to reach and fertilise an egg. It is diagnosed when fewer than about 40% of sperm are motile (or under 32% move progressively) on a semen analysis.",
      "Poor motility often occurs alongside a low count or abnormal shape. Where the cause can be treated it is corrected first; otherwise IVF and especially ICSI bypass the problem by placing a healthy sperm directly inside the egg.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "Why treat", em: "poor sperm motility" },
    subtitle: "The right diagnosis turns a frustrating report into a workable plan.",
    items: [
      "Reversible causes — infection, varicocele, lifestyle, oxidative stress — are identified.",
      "Antioxidant and medical therapy can improve movement in many men.",
      "Laboratory sperm preparation selects the most motile sperm.",
      "IUI concentrates motile sperm closer to the egg.",
      "ICSI needs only a single healthy sperm and removes the motility barrier entirely.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "When to", em: "get evaluated" },
    subtitle: "Have a semen analysis whenever male-factor infertility is a possibility.",
    items: [
      "A semen report showing reduced or sluggish sperm motility.",
      "No pregnancy after a year of regular, unprotected intercourse.",
      "A varicocele or a history of genital infection.",
      "Smoking, alcohol, heat exposure or anabolic-steroid use.",
      "High oxidative stress or raised sperm-DNA fragmentation.",
    ],
  },
  process: {
    heading: { lead: "How we", em: "evaluate & treat" },
    subtitle: "From accurate testing to the technique that fits your result.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Consultation & History", d: "A detailed history, examination and review of earlier semen reports." },
      { icon: Beaker, n: "02", t: "Semen Analysis", d: "Motility graded precisely alongside count and morphology in our lab." },
      { icon: Stethoscope, n: "03", t: "Cause Work-up", d: "Infection screen, scrotal ultrasound, hormones and DNA-fragmentation testing as needed." },
      { icon: Leaf, n: "04", t: "Medical Therapy", d: "Antioxidants, infection treatment or varicocele correction where indicated." },
      { icon: FlaskConical, n: "05", t: "IUI / IVF / ICSI", d: "Sperm preparation with IUI, or IVF–ICSI when motility stays low." },
    ],
    note: "Because sperm mature over roughly three months, response is reassessed after a full cycle.",
  },
  success: {
    factors: [
      "How low the motility is, and any associated count/shape issues",
      "Whether the cause is reversible",
      "Sperm-DNA integrity",
      "The female partner's age and fertility",
      "The technique used — IUI, IVF or ICSI",
    ],
    note: "Results differ from couple to couple and cannot be guaranteed; your specialist will set realistic expectations.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Motility may not fully normalise", d: "Some causes of poor motility are only partly treatable.", help: "ICSI removes the need for sperm to swim, so low motility no longer blocks fertilisation." },
      { t: "Results take time", d: "Improvements follow a full sperm-production cycle of about three months.", help: "We reassess after a cycle rather than switching plans prematurely." },
      { t: "Procedure-related risks", d: "IUI, IVF and ICSI each carry small, well-managed risks.", help: "Every step is explained and closely monitored." },
    ],
  },
  faqs: [
    { q: "What is asthenospermia?", a: "It is reduced sperm motility — too few sperm move well enough to reach the egg, usually defined as under ~40% motile or under ~32% progressively motile on a semen analysis." },
    { q: "Can poor sperm motility be improved?", a: "Often yes — treating infection or a varicocele, antioxidants and a healthier lifestyle can help. Improvements take around three months." },
    { q: "Can I conceive with low motility?", a: "Yes. Sperm preparation with IUI, or IVF with ICSI, can achieve pregnancy even when motility is low." },
    { q: "How is ICSI helpful here?", a: "ICSI injects one healthy sperm directly into each egg, so the sperm does not need to swim — making motility largely irrelevant to fertilisation." },
    { q: "Does motility change between tests?", a: "Yes, it can vary with illness, abstinence time and lab handling, so the test is often repeated for accuracy." },
  ],
  related: ["oligospermia", "azoospermia", "icsi", "imsi", "ivf"],
  cta: {
    heading: "Concerned about",
    headingEm: "sperm motility?",
    subtitle: "Our andrology team will pinpoint the cause and recommend the technique most likely to work for you.",
  },
});

export const azoospermia = defineTreatment({
  slug: "azoospermia",
  name: "Zero Sperm Count (Azoospermia) Treatment",
  shortName: "Azoospermia",
  alternateName: "Zero Sperm Count",
  reviewerSlug: "parth-bavishi",
  meta: {
    title: "Azoospermia (Zero Sperm Count) Treatment — Bavishi Fertility Institute",
    description:
      "Azoospermia — no sperm in the ejaculate — explained. Obstructive vs non-obstructive types, surgical sperm retrieval (PESA/TESA/Micro-TESE) and ICSI. Expert care since 1984.",
    ogImage: "/assets/conditions/azoospermia.png",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Testes / Epididymis",
    howPerformed:
      "Azoospermia is classified as obstructive or non-obstructive after evaluation; sperm are recovered surgically (PESA, TESA or Micro-TESE) where possible and used to fertilise eggs by ICSI.",
    followup: "Recovered sperm can be used fresh or frozen for ICSI; a pregnancy test follows embryo transfer.",
  },
  hero: {
    eyebrow: "Male Infertility",
    h1: "Zero Sperm Count",
    h1Em: "(Azoospermia) Treatment",
    tagline:
      "No sperm in the ejaculate does not always mean no biological child. In many men, sperm can be found in the testes and used with ICSI to achieve a pregnancy.",
    badges: ["Surgical Sperm Retrieval", "Micro-TESE", "Since 1984", "ICSI"],
    image: "/assets/conditions/azoospermia.png",
    imageAlt: "Azoospermia (zero sperm count) treatment at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Azoospermia?" },
    paragraphs: [
      "Azoospermia means no sperm are found in the ejaculate. It is confirmed when two separate semen samples, examined after centrifugation, show no sperm at all. It affects about 1% of men and up to 10–15% of infertile men.",
      "There are two main types. Obstructive azoospermia means sperm are produced normally but cannot get out due to a blockage. Non-obstructive azoospermia means production itself is very low. In both, sperm can often be retrieved directly from the testes or epididymis and used with ICSI.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "Why specialised", em: "azoospermia care matters" },
    subtitle: "The right work-up tells us whether — and how — your own sperm can be used.",
    items: [
      "Accurate obstructive vs non-obstructive diagnosis guides the whole plan.",
      "Microsurgical retrieval (Micro-TESE) finds sperm in difficult cases.",
      "Even a few sperm are enough for ICSI.",
      "Retrieved sperm can be frozen for future cycles.",
      "Donor sperm remains a supported option when retrieval is not possible.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who this", em: "is for" },
    subtitle: "Men whose semen analysis shows no sperm, after confirmation.",
    items: [
      "Two semen analyses confirming no sperm in the ejaculate.",
      "A history of undescended testes, mumps, chemotherapy or radiation.",
      "Previous vasectomy or a suspected blockage in the sperm pathway.",
      "Hormonal or genetic causes of low sperm production.",
      "Couples wishing to use the man's own sperm where possible.",
    ],
  },
  process: {
    heading: { lead: "How azoospermia", em: "is managed" },
    subtitle: "Careful diagnosis first, then the least-invasive route to usable sperm.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Evaluation", d: "History, examination, hormone profile and genetic tests to classify the type." },
      { icon: ScanLine, n: "02", t: "Imaging", d: "Scrotal and trans-rectal ultrasound to look for blockages or other causes." },
      { icon: Target, n: "03", t: "Surgical Retrieval", d: "PESA, TESA or microsurgical Micro-TESE to recover sperm from the epididymis or testes." },
      { icon: Microscope, n: "04", t: "ICSI", d: "Retrieved sperm are injected directly into the eggs in the laboratory." },
      { icon: Snowflake, n: "05", t: "Freezing", d: "Surplus sperm or embryos are frozen for future attempts." },
    ],
    note: "When retrieval is not possible, screened donor sperm offers a reliable alternative.",
  },
  success: {
    factors: [
      "Obstructive versus non-obstructive type",
      "The underlying cause and any genetic factor",
      "Whether viable sperm are retrieved",
      "The female partner's age and egg quality",
      "Embryo quality and the laboratory",
    ],
    note: "Retrieval and pregnancy rates vary widely with the cause; your specialist will give an honest, individualised assessment. Outcomes cannot be guaranteed.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Sperm may not be found", d: "In some non-obstructive cases no sperm can be retrieved despite microsurgery.", help: "We discuss this honestly beforehand, with donor sperm as a planned alternative." },
      { t: "Minor surgical risks", d: "Retrieval is a minor procedure with small risks of bruising or discomfort.", help: "It is performed under anaesthesia by experienced surgeons and monitored closely." },
      { t: "Genetic considerations", d: "Some causes are genetic and may be relevant to a son's future fertility.", help: "Genetic counselling and testing are offered as part of the work-up." },
    ],
  },
  video: {
    id: "qdT9bMuYqfE",
    title: "Azoospermia क्या है? — Dr. Himanshu Bavishi",
    description:
      "Dr. Himanshu Bavishi explains what azoospermia (zero sperm count / NIL count) is, why it happens and how it can be treated — so you understand your options clearly.",
    eyebrow: "Watch & Learn",
    heading: { lead: "Zero Sperm Count — Azoospermia", em: "NIL count" },
  },
  faqs: [
    { q: "Does azoospermia mean I can never have a child?", a: "No. In many men sperm can be retrieved directly from the testes or epididymis and used with ICSI. Where it cannot, donor sperm is an option." },
    { q: "What is the difference between obstructive and non-obstructive azoospermia?", a: "Obstructive means sperm are made normally but blocked from getting out; non-obstructive means production itself is very low. The treatment differs accordingly." },
    { q: "What is Micro-TESE?", a: "Microsurgical testicular sperm extraction — using an operating microscope to locate and retrieve the small pockets of sperm production in non-obstructive azoospermia." },
    { q: "Is sperm retrieval painful?", a: "It is done under anaesthesia, so it is not painful during the procedure. Mild soreness afterwards settles quickly." },
    { q: "Can retrieved sperm be frozen?", a: "Yes. Surplus sperm are frozen so they can be used for future ICSI cycles without repeating surgery." },
  ],
  related: ["surgical-sperm-retrieval", "oligospermia", "icsi", "sperm-donation", "ivf"],
  cta: {
    heading: "A diagnosis of",
    headingEm: "azoospermia?",
    subtitle: "Speak with our andrology specialists about surgical sperm retrieval and ICSI — there are often more options than you think.",
  },
});

export const surgicalSpermRetrieval = defineTreatment({
  slug: "surgical-sperm-retrieval",
  name: "Surgical Sperm Retrieval (PESA / TESA / TESE / Micro-TESE)",
  shortName: "Surgical Sperm Retrieval",
  alternateName: "PESA / TESA / TESE / Micro-TESE",
  reviewerSlug: "parth-bavishi",
  meta: {
    title: "Surgical Sperm Retrieval — PESA, TESA, TESE & Micro-TESE — Bavishi Fertility Institute",
    description:
      "Surgical sperm retrieval explained — PESA, TESA, TESE and microsurgical Micro-TESE for azoospermia, used with ICSI. Experienced andrology surgeons, trusted since 1984.",
    ogImage: "/assets/conditions/surgical-sperm-retrieval.png",
  },
  procedure: {
    procedureType: "https://schema.org/SurgicalProcedure",
    bodyLocation: "Testes / Epididymis",
    howPerformed:
      "Sperm are recovered directly from the epididymis (PESA) or testes (TESA, TESE, Micro-TESE) using a needle or microsurgery, then used to fertilise eggs by ICSI.",
    followup: "Retrieved sperm are used fresh or frozen for ICSI; recovery is quick with minimal downtime.",
  },
  hero: {
    eyebrow: "Male Infertility",
    h1: "Surgical Sperm Retrieval",
    h1Em: "(PESA / TESA / Micro-TESE)",
    tagline:
      "When there is no sperm in the ejaculate, these minor procedures recover sperm directly from the testes or epididymis — so your own sperm can still be used with ICSI.",
    badges: ["Microsurgery", "Day-care Procedure", "Since 1984", "ICSI-ready"],
    image: "/assets/conditions/surgical-sperm-retrieval.png",
    imageAlt: "Surgical sperm retrieval (PESA, TESA, Micro-TESE) at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Surgical Sperm Retrieval?" },
    paragraphs: [
      "Surgical sperm retrieval is a group of minor procedures that collect sperm directly from the male reproductive tract when none can be obtained from the ejaculate — most often in azoospermia. The recovered sperm are then used to fertilise eggs through ICSI.",
      "The right technique depends on the cause. PESA and TESA use a fine needle; TESE takes a small tissue sample; and Micro-TESE uses an operating microscope to find sperm in the most difficult, non-obstructive cases.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "The advantages of", em: "surgical retrieval" },
    subtitle: "A short procedure that can make a biological child possible.",
    items: [
      "Lets couples use the man's own sperm rather than a donor.",
      "Minimally invasive, usually day-care, with quick recovery.",
      "Micro-TESE maximises the chance of finding sperm in difficult cases.",
      "Retrieved sperm can be frozen for future ICSI cycles.",
      "Performed by experienced andrology surgeons under anaesthesia.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who needs", em: "this procedure" },
    subtitle: "Mainly men with azoospermia, after a full evaluation.",
    items: [
      "Obstructive azoospermia — including after vasectomy or a blockage.",
      "Non-obstructive azoospermia with very low sperm production.",
      "Failed ejaculation or absence of the vas deferens.",
      "Ejaculate that repeatedly contains no, or no usable, sperm.",
      "Couples planning ICSI who wish to use the man's own sperm.",
    ],
  },
  process: {
    heading: { lead: "How it", em: "works" },
    subtitle: "A short, well-planned procedure timed with the IVF cycle.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Assessment", d: "Evaluation confirms the type of azoospermia and the best retrieval method." },
      { icon: Syringe, n: "02", t: "PESA / TESA", d: "A fine needle aspirates sperm from the epididymis or testis under anaesthesia." },
      { icon: Target, n: "03", t: "TESE / Micro-TESE", d: "A small biopsy, or microscope-guided extraction, recovers sperm in harder cases." },
      { icon: Microscope, n: "04", t: "ICSI", d: "Recovered sperm are injected directly into the partner's eggs." },
      { icon: Snowflake, n: "05", t: "Freezing", d: "Extra sperm are frozen so future cycles need no repeat surgery." },
    ],
    note: "Retrieval is often timed with the female partner's egg collection so fresh sperm can be used.",
  },
  success: {
    factors: [
      "Obstructive versus non-obstructive azoospermia",
      "The retrieval technique used",
      "Whether viable sperm are found and their quality",
      "The female partner's age and egg quality",
      "Laboratory and embryology expertise",
    ],
    note: "Retrieval rates are high in obstructive cases and more variable in non-obstructive ones; your surgeon will give a realistic, individualised estimate. Success cannot be guaranteed.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "No sperm found", d: "In some non-obstructive cases, no sperm are recovered despite microsurgery.", help: "This is discussed in advance, with donor sperm planned as a backup." },
      { t: "Minor surgical effects", d: "Temporary swelling, bruising or discomfort can follow the procedure.", help: "These are minor and settle within a few days with simple care." },
      { t: "Timing & coordination", d: "Retrieval must align with the IVF cycle, or sperm are frozen.", help: "Our team coordinates the timing precisely with your treatment plan." },
    ],
  },
  faqs: [
    { q: "Which retrieval method will I need?", a: "It depends on the cause. PESA/TESA (needle) suit obstructive cases; TESE and Micro-TESE (microsurgery) are used for non-obstructive azoospermia. Your evaluation guides the choice." },
    { q: "Is the procedure painful?", a: "It is performed under anaesthesia, so it is not painful during the procedure. Mild soreness afterwards settles within a few days." },
    { q: "What is Micro-TESE?", a: "Microsurgical TESE uses an operating microscope to identify the tiny areas of active sperm production, giving the best chance of finding sperm in difficult cases." },
    { q: "Can the sperm be frozen?", a: "Yes. Surplus sperm are frozen so future ICSI cycles do not need another procedure." },
    { q: "Is retrieved sperm as good for ICSI?", a: "Yes. ICSI needs only a single viable sperm per egg, so surgically retrieved sperm work well for fertilisation." },
  ],
  related: ["azoospermia", "oligospermia", "icsi", "sperm-donation", "ivf"],
  cta: {
    heading: "Need",
    headingEm: "sperm retrieval?",
    subtitle: "Our andrology surgeons will advise the safest, most effective technique for your situation.",
  },
});

export const varicocele = defineTreatment({
  slug: "varicocele",
  name: "Varicocele Treatment & Microsurgery",
  shortName: "Varicocele",
  alternateName: "Varicocele Micro-Surgery",
  reviewerSlug: "parth-bavishi",
  meta: {
    title: "Varicocele Treatment & Microsurgery — Bavishi Fertility Institute",
    description:
      "Varicocele and male infertility — how enlarged scrotal veins affect sperm, when treatment helps, and microsurgical varicocelectomy. Expert andrology care since 1984.",
    ogImage: "/assets/conditions/varicocele.png",
  },
  procedure: {
    procedureType: "https://schema.org/SurgicalProcedure",
    bodyLocation: "Scrotum / Spermatic cord",
    howPerformed:
      "A varicocele is diagnosed by examination and scrotal ultrasound; when treatment is indicated, the enlarged veins are tied off through microsurgical varicocelectomy to improve sperm quality.",
    followup: "Semen analysis is repeated about three months after surgery to assess improvement.",
  },
  hero: {
    eyebrow: "Male Infertility",
    h1: "Varicocele Treatment",
    h1Em: "& Microsurgery",
    tagline:
      "A varicocele — enlarged veins in the scrotum — is one of the commonest and most correctable causes of male infertility. Microsurgery can improve sperm quality and natural fertility.",
    badges: ["Microsurgical Repair", "Day-care Surgery", "Since 1984", "Fertility-focused"],
    image: "/assets/conditions/varicocele.png",
    imageAlt: "Varicocele treatment and microsurgery at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is a", em: "Varicocele?" },
    paragraphs: [
      "A varicocele is an enlargement of the veins within the scrotum, similar to a varicose vein in the leg. It is found in about 15% of all men and in up to 40% of men with infertility, and it can raise testicular temperature and impair sperm production.",
      "Not every varicocele needs treatment. When it is linked to a low sperm count, poor motility, abnormal shape or testicular discomfort, microsurgical varicocelectomy can improve sperm quality and, in many couples, the chance of natural conception.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "The advantages of", em: "varicocele repair" },
    subtitle: "Correcting a significant varicocele addresses a treatable, underlying cause.",
    items: [
      "Can improve sperm count, motility and morphology.",
      "May raise the chance of natural conception.",
      "Can reduce dragging scrotal pain or discomfort.",
      "Microsurgery offers high success with low recurrence.",
      "Often improves outcomes in subsequent IUI or IVF cycles.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who may", em: "benefit" },
    subtitle: "Treatment is considered when a varicocele is affecting fertility or comfort.",
    items: [
      "A palpable varicocele with abnormal semen parameters.",
      "Male infertility with no other clear cause.",
      "Progressively worsening sperm quality on repeat tests.",
      "Testicular pain or a feeling of heaviness.",
      "Reduced testicular size on the affected side.",
    ],
  },
  process: {
    heading: { lead: "How it", em: "is treated" },
    subtitle: "Careful selection, then precise microsurgical correction.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Evaluation", d: "Examination plus scrotal Doppler ultrasound to confirm and grade the varicocele." },
      { icon: Beaker, n: "02", t: "Semen Analysis", d: "Sperm parameters are measured to decide whether repair is likely to help." },
      { icon: Target, n: "03", t: "Microsurgical Varicocelectomy", d: "The affected veins are tied off through a small incision under magnification." },
      { icon: Leaf, n: "04", t: "Recovery", d: "A quick, day-care recovery with simple aftercare and minimal downtime." },
      { icon: FlaskConical, n: "05", t: "Reassessment", d: "Repeat semen analysis at three months guides the next step if needed." },
    ],
    note: "Microsurgery preserves the artery and lymphatics, lowering the risk of recurrence and complications.",
  },
  success: {
    factors: [
      "Varicocele grade and whether it is one- or two-sided",
      "Baseline sperm parameters",
      "The female partner's age and fertility",
      "Surgical technique — microsurgery gives the best results",
      "Time allowed for sperm to recover after surgery",
    ],
    note: "Many men see improved sperm parameters after microsurgery, though results vary and a pregnancy cannot be guaranteed.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Not everyone improves", d: "Sperm quality improves in many, but not all, men after repair.", help: "We select patients carefully so surgery is offered when it is most likely to help." },
      { t: "Recurrence or hydrocele", d: "There is a small chance of recurrence or fluid collection.", help: "Microsurgical technique keeps these risks low by sparing the artery and lymphatics." },
      { t: "Results take time", d: "Improvement follows a full sperm cycle of about three months.", help: "We reassess after a cycle before deciding on any further treatment." },
    ],
  },
  faqs: [
    { q: "Does every varicocele need surgery?", a: "No. Treatment is advised mainly when a varicocele is linked to abnormal semen parameters, infertility or pain. Small, symptomless varicoceles often need no treatment." },
    { q: "Will surgery improve my fertility?", a: "Microsurgical repair improves sperm count, motility or morphology in many men and can raise the chance of natural conception, though results vary." },
    { q: "What is microsurgical varicocelectomy?", a: "A precise, microscope-assisted operation that ties off the enlarged veins while preserving the testicular artery and lymphatics, giving high success and low recurrence." },
    { q: "How long is recovery?", a: "It is a day-care procedure. Most men return to routine activities within a few days, avoiding strenuous activity for a short period." },
    { q: "When will I know if it worked?", a: "A repeat semen analysis at about three months — a full sperm-production cycle — shows the improvement." },
  ],
  related: ["oligospermia", "asthenospermia", "azoospermia", "icsi", "ivf"],
  cta: {
    heading: "Diagnosed with a",
    headingEm: "varicocele?",
    subtitle: "Find out whether microsurgical repair can improve your fertility — book a consultation with our andrology team.",
  },
});

export const erectileDysfunction = defineTreatment({
  slug: "erectile-dysfunction",
  name: "Erectile Dysfunction Treatment",
  shortName: "Erectile Dysfunction",
  alternateName: "ED",
  reviewerSlug: "parth-bavishi",
  meta: {
    title: "Erectile Dysfunction Treatment — Bavishi Fertility Institute",
    description:
      "Erectile dysfunction and fertility — causes, evaluation and treatment options, plus how couples can still conceive through assisted reproduction. Confidential care since 1984.",
    ogImage: "/assets/conditions/erectile-dysfunction.png",
  },
  procedure: {
    procedureType: "https://schema.org/TherapeuticProcedure",
    bodyLocation: "Male reproductive system",
    howPerformed:
      "Erectile dysfunction is evaluated for medical and psychological causes and treated with lifestyle, medical or counselling support; where conception is the goal, IUI or IVF–ICSI can be used.",
    followup: "Treatment response is reviewed periodically, with fertility support arranged in parallel where needed.",
  },
  hero: {
    eyebrow: "Male Infertility",
    h1: "Erectile Dysfunction",
    h1Em: "Treatment",
    tagline:
      "Erectile dysfunction is common, treatable and rarely a barrier to parenthood. With the right support — and assisted reproduction when needed — couples can still conceive.",
    badges: ["Confidential Care", "Holistic Evaluation", "Since 1984", "Fertility Support"],
    image: "/assets/conditions/erectile-dysfunction.png",
    imageAlt: "Erectile dysfunction treatment and fertility support at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Erectile Dysfunction?" },
    paragraphs: [
      "Erectile dysfunction (ED) is the persistent difficulty in getting or keeping an erection firm enough for intercourse. It is very common, increases with age, and often has a mix of physical and psychological causes such as diabetes, blood-pressure problems, hormonal issues, stress or anxiety.",
      "When a couple is trying to conceive, ED can interfere with timed intercourse. The condition itself is highly treatable, and where natural intercourse remains difficult, fertility techniques such as IUI or IVF–ICSI provide a reliable route to pregnancy.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "Why seek", em: "treatment" },
    subtitle: "Addressing ED supports both wellbeing and the path to parenthood.",
    items: [
      "Identifies and treats underlying medical causes such as diabetes or hormones.",
      "Improves confidence, relationships and quality of life.",
      "Restores natural intercourse in many men.",
      "Allows timed intercourse for couples trying to conceive.",
      "Where needed, IUI or IVF–ICSI bypass the difficulty entirely.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who should", em: "be evaluated" },
    subtitle: "Evaluation is worthwhile whenever ED is persistent or affecting conception.",
    items: [
      "Ongoing difficulty getting or maintaining an erection.",
      "Difficulty with timed intercourse while trying to conceive.",
      "Diabetes, high blood pressure or heart disease.",
      "Stress, anxiety, depression or relationship strain.",
      "Low libido or other symptoms suggesting low testosterone.",
    ],
  },
  process: {
    heading: { lead: "How we", em: "help" },
    subtitle: "A sensitive, confidential evaluation and a plan that fits your goals.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Confidential Consultation", d: "A discreet discussion of history, lifestyle and any conception goals." },
      { icon: Stethoscope, n: "02", t: "Evaluation", d: "Checks for diabetes, blood pressure, hormones and other contributing factors." },
      { icon: Leaf, n: "03", t: "Treatment", d: "Lifestyle changes, medical therapy and counselling tailored to the cause." },
      { icon: HeartPulse, n: "04", t: "Psychological Support", d: "Stress and relationship support where these contribute to ED." },
      { icon: FlaskConical, n: "05", t: "Fertility Support", d: "Timed intercourse, IUI or IVF–ICSI when conception is the goal." },
    ],
    note: "Care is always confidential, and fertility treatment can run alongside ED treatment when time matters.",
  },
  success: {
    factors: [
      "The underlying cause and how well it is controlled",
      "Overall health and lifestyle",
      "Psychological and relationship factors",
      "The female partner's age when conception is the goal",
      "Whether assisted reproduction is also used",
    ],
    note: "Most men improve with appropriate treatment, and couples have reliable fertility options regardless. Individual outcomes vary.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "An underlying condition", d: "ED can be an early sign of diabetes or heart disease.", help: "Our evaluation screens for these so they can be treated for your overall health." },
      { t: "Medication side-effects", d: "Some ED medicines have side-effects or interact with other drugs.", help: "Treatment is prescribed and reviewed by a specialist to keep it safe." },
      { t: "Emotional impact", d: "ED can affect confidence and relationships.", help: "Counselling and partner support are part of holistic care." },
    ],
  },
  faqs: [
    { q: "Can I father a child if I have erectile dysfunction?", a: "Yes. ED is usually treatable, and even when natural intercourse stays difficult, IUI or IVF with ICSI offer reliable routes to pregnancy." },
    { q: "What causes erectile dysfunction?", a: "Often a combination of physical causes (diabetes, blood pressure, hormones, blood-flow problems) and psychological ones such as stress and anxiety." },
    { q: "Is erectile dysfunction treatable?", a: "In most men, yes — through lifestyle changes, treating the underlying cause, medical therapy and counselling where needed." },
    { q: "Is the consultation confidential?", a: "Completely. ED is a common medical condition and is handled with full privacy and sensitivity." },
    { q: "How does ED affect fertility treatment?", a: "If collecting a sperm sample or timed intercourse is difficult, our team arranges supportive options so treatment can proceed smoothly." },
  ],
  related: ["oligospermia", "asthenospermia", "iui", "icsi", "ivf"],
  cta: {
    heading: "Looking for",
    headingEm: "discreet help with ED?",
    subtitle: "Talk to our specialists in confidence about treatment and, where relevant, your options for conceiving.",
  },
});

/* ===================================================================== */
/* FEMALE INFERTILITY                                                     */
/* ===================================================================== */

export const conceiveNaturally = defineTreatment({
  slug: "conceive-naturally",
  name: "Conceive Naturally — Natural Fertility Care",
  shortName: "Conceive Naturally",
  alternateName: "Natural Conception Support",
  reviewerSlug: "falguni-bavishi",
  meta: {
    title: "Conceive Naturally — Natural Fertility Care — Bavishi Fertility Institute",
    description:
      "Improve your chances of conceiving naturally — fertile-window timing, lifestyle, simple evaluation and ovulation support, before considering advanced treatment. Trusted since 1984.",
    ogImage: "/assets/conditions/conceive-naturally.png",
  },
  procedure: {
    procedureType: "https://schema.org/TherapeuticProcedure",
    bodyLocation: "Female reproductive system",
    howPerformed:
      "A basic fertility evaluation identifies simple, correctable factors; couples are then supported with fertile-window timing, lifestyle optimisation and, where needed, ovulation induction before advanced treatment.",
    followup: "Progress is reviewed over a few cycles before stepping up to IUI or IVF if required.",
  },
  hero: {
    eyebrow: "Female Infertility",
    h1: "Conceive",
    h1Em: "Naturally",
    tagline:
      "Many couples can conceive naturally with the right timing, simple evaluation and small lifestyle changes — before any advanced treatment is needed. We help you start there.",
    badges: ["Fertility Evaluation", "Ovulation Support", "Since 1984", "Personalised Plan"],
    image: "/assets/conditions/conceive-naturally.png",
    imageAlt: "Natural conception and fertility care at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "Conceiving", em: "naturally" },
    paragraphs: [
      "Natural conception means achieving pregnancy through intercourse, without assisted-reproduction procedures. For many couples it simply needs accurate timing around the fertile window, a healthy lifestyle and the correction of small, common issues.",
      "A simple evaluation can confirm that ovulation, tubes and sperm are healthy, and pick up easily-treatable factors such as irregular cycles or a thyroid imbalance. Only when natural conception is unlikely do we move, step by step, towards IUI or IVF.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "Why start", em: "naturally" },
    subtitle: "The simplest, least-invasive route is always explored first.",
    items: [
      "Identifies whether natural conception is realistic for you.",
      "Pinpoints the fertile window for well-timed intercourse.",
      "Corrects simple factors — cycles, thyroid, weight, vitamin levels.",
      "Ovulation support for irregular cycles where needed.",
      "Avoids unnecessary procedures and cost.",
      "A clear point to step up to IUI or IVF if it is needed.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who this", em: "is for" },
    subtitle: "Couples beginning their journey, or wanting to optimise natural fertility first.",
    items: [
      "Couples trying to conceive for under a year with no known problem.",
      "Irregular or unpredictable menstrual cycles.",
      "Uncertainty about timing the fertile window.",
      "A wish to optimise health before pregnancy.",
      "Mild, potentially reversible fertility factors.",
    ],
  },
  process: {
    heading: { lead: "How we", em: "help you" },
    subtitle: "A gentle, structured start to your fertility journey.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Consultation", d: "A review of your history, cycles and general health for both partners." },
      { icon: Stethoscope, n: "02", t: "Basic Evaluation", d: "Simple checks of ovulation, hormones, tubes and a semen analysis." },
      { icon: Leaf, n: "03", t: "Lifestyle & Timing", d: "Guidance on the fertile window, nutrition, weight and supplements." },
      { icon: Activity, n: "04", t: "Ovulation Support", d: "Gentle ovulation induction or correction of issues such as thyroid where needed." },
      { icon: FlaskConical, n: "05", t: "Step Up If Needed", d: "A clear move to IUI or IVF if natural conception does not happen." },
    ],
    note: "We never over-treat — advanced options are recommended only when they are genuinely needed.",
  },
  success: {
    factors: [
      "The woman's age",
      "Regular ovulation and healthy fallopian tubes",
      "Sperm quality",
      "Accurate fertile-window timing",
      "General health and lifestyle",
    ],
    note: "Natural-conception chances depend heavily on age and the absence of significant problems. Your specialist will give honest guidance on how long to try before stepping up.",
  },
  risks: {
    heading: { lead: "What to", em: "keep in mind" },
    items: [
      { t: "Age and time matter", d: "Fertility declines with age, so trying naturally for too long can reduce options.", help: "We advise a sensible time-frame and when to move to active treatment." },
      { t: "A hidden cause", d: "Some causes of infertility are not obvious without testing.", help: "A simple evaluation rules out problems that natural timing alone cannot fix." },
      { t: "Managing expectations", d: "Natural conception is not guaranteed even when everything looks normal.", help: "We set realistic expectations and a clear plan B from the outset." },
    ],
  },
  faqs: [
    { q: "How long should we try naturally before seeing a doctor?", a: "Generally one year if the woman is under 35, or six months if she is 35 or older — sooner if there are known issues like irregular cycles or previous surgery." },
    { q: "When am I most fertile?", a: "In the few days leading up to and including ovulation. Tracking cycles, ovulation kits or a scan can help identify this fertile window." },
    { q: "Can lifestyle really improve fertility?", a: "Yes. Healthy weight, balanced nutrition, not smoking, limiting alcohol and managing stress all support natural conception for both partners." },
    { q: "Do I need tests to conceive naturally?", a: "A simple evaluation is worthwhile to confirm ovulation, healthy tubes and normal sperm, and to catch easily-treated issues early." },
    { q: "What if natural conception doesn't work?", a: "We step up gradually — ovulation support, then IUI, then IVF — choosing only what your situation actually needs." },
  ],
  related: ["pcos", "ovarian-reserve", "iui", "ivf", "female-infertility"],
  cta: {
    heading: "Want to",
    headingEm: "conceive naturally?",
    subtitle: "Start with a simple evaluation and a personalised plan — book a consultation with our fertility specialists.",
  },
});

export const prpInfertility = defineTreatment({
  slug: "prp-infertility",
  name: "PRP (Platelet-Rich Plasma) Therapy in Infertility",
  shortName: "PRP Infertility",
  alternateName: "Platelet-Rich Plasma Therapy",
  reviewerSlug: "falguni-bavishi",
  meta: {
    title: "PRP (Platelet-Rich Plasma) Therapy in Infertility — Bavishi Fertility Institute",
    description:
      "PRP therapy in fertility — ovarian PRP for low ovarian reserve and endometrial PRP for thin lining or repeated implantation failure. How it works, who may benefit, since 1984.",
    ogImage: "/assets/conditions/prp-infertility.png",
  },
  procedure: {
    procedureType: "https://schema.org/TherapeuticProcedure",
    bodyLocation: "Ovary / Uterus",
    howPerformed:
      "Platelet-rich plasma prepared from the patient's own blood is injected into the ovaries (to support reserve) or the uterine cavity (to improve a thin lining), aiming to enhance the local environment for conception.",
    followup: "Response is assessed over the following weeks with hormone tests or lining scans.",
  },
  hero: {
    eyebrow: "Female Infertility",
    h1: "PRP Therapy",
    h1Em: "in Infertility",
    tagline:
      "Platelet-rich plasma uses your body's own growth factors to support a low ovarian reserve or a thin uterine lining — an emerging option in carefully selected cases.",
    badges: ["Autologous (Your Own Blood)", "Ovarian & Endometrial PRP", "Since 1984", "Selective Use"],
    image: "/assets/conditions/prp-infertility.png",
    imageAlt: "PRP (platelet-rich plasma) therapy in infertility at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "PRP Therapy?" },
    paragraphs: [
      "Platelet-rich plasma (PRP) is prepared by concentrating the platelets from a small sample of your own blood. These platelets are rich in growth factors that can help stimulate tissue repair and regeneration.",
      "In fertility, PRP is used in two ways: ovarian PRP, injected into the ovaries to try to improve a low ovarian reserve, and endometrial PRP, instilled into the uterine cavity to improve a thin lining or in repeated implantation failure. It is an emerging therapy offered in carefully selected cases alongside standard treatment.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "Potential advantages of", em: "PRP" },
    subtitle: "A minimally-invasive option using your body's own growth factors.",
    items: [
      "Uses your own blood, so there is no risk of rejection or allergy.",
      "Ovarian PRP may support follicle activity in low reserve.",
      "Endometrial PRP may improve a persistently thin lining.",
      "May help selected cases of repeated implantation failure.",
      "A minimally-invasive, day-care procedure.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who may", em: "be considered" },
    subtitle: "PRP is selective — recommended only where evidence suggests it may help.",
    items: [
      "Low ovarian reserve or poor response to stimulation.",
      "A persistently thin endometrial lining despite standard treatment.",
      "Repeated implantation failure after good-quality embryo transfers.",
      "Women wishing to explore options before considering donor eggs.",
      "Selected cases as an adjunct to IVF, after counselling.",
    ],
  },
  process: {
    heading: { lead: "How PRP", em: "is done" },
    subtitle: "A short, same-day procedure prepared from your own blood.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Assessment", d: "Evaluation confirms whether PRP is a reasonable option for your case." },
      { icon: Droplets, n: "02", t: "Blood Sample", d: "A small blood sample is taken, just like a routine blood test." },
      { icon: Filter, n: "03", t: "PRP Preparation", d: "The sample is processed to concentrate the platelet-rich plasma." },
      { icon: Target, n: "04", t: "Injection / Instillation", d: "PRP is placed into the ovaries or uterine cavity as planned." },
      { icon: ScanLine, n: "05", t: "Review", d: "Hormone tests or lining scans assess the response before the next step." },
    ],
    note: "PRP is offered transparently as an adjunct — results vary and it is not a guaranteed solution.",
  },
  success: {
    factors: [
      "The indication — ovarian reserve versus endometrial lining",
      "Age and baseline ovarian function",
      "The underlying cause of a thin lining or implantation failure",
      "Use alongside an appropriately planned IVF cycle",
      "Individual biological response",
    ],
    note: "Evidence for PRP is still evolving and responses vary widely. We discuss what is and is not known honestly, so you can decide with realistic expectations.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "An emerging therapy", d: "Evidence for PRP is still developing and benefit is not guaranteed.", help: "We offer it transparently in selected cases, never as a replacement for proven treatment." },
      { t: "Minor procedure effects", d: "Mild discomfort, spotting or cramping can follow the procedure.", help: "These are usually minor and settle quickly with simple care." },
      { t: "Variable response", d: "Some women respond while others see little change.", help: "We reassess objectively and adjust the plan rather than repeating indefinitely." },
    ],
  },
  video: {
    id: "Y8hL5jK6cxI",
    title: "PRP — Platelet-Rich Plasma therapy in infertility",
    description:
      "Our experts explain how platelet-rich plasma (PRP) therapy works in fertility — ovarian PRP for low reserve and endometrial PRP for a thin lining — and who may benefit.",
    eyebrow: "Watch & Learn",
    heading: { lead: "PRP — Platelet Rich Plasma therapy", em: "in infertility" },
  },
  faqs: [
    { q: "What is PRP therapy in fertility?", a: "It uses platelet-rich plasma from your own blood, rich in growth factors, injected into the ovaries (for low reserve) or uterus (for a thin lining) to try to improve the chance of conception." },
    { q: "Is PRP safe?", a: "Because PRP is made from your own blood, there is no risk of rejection or allergy. The procedure itself is minimally invasive with only minor, short-lived side-effects." },
    { q: "Does PRP guarantee pregnancy?", a: "No. PRP is an emerging therapy with variable results, offered as an adjunct in selected cases. We explain realistic expectations clearly before proceeding." },
    { q: "Who is PRP suitable for?", a: "It is mainly considered for low ovarian reserve, a thin endometrial lining or repeated implantation failure, after a full assessment." },
    { q: "Is PRP a substitute for IVF?", a: "No. It is used alongside standard fertility treatment such as IVF, not instead of it." },
  ],
  related: ["ovarian-reserve", "ovarian-rejuvenation", "ivf-failure", "ivf", "female-infertility"],
  cta: {
    heading: "Curious about",
    headingEm: "PRP therapy?",
    subtitle: "Speak with our specialists about whether PRP could play a role in your fertility plan — honestly assessed.",
  },
});

export const pcos = defineTreatment({
  slug: "pcos",
  name: "PCOS (Polycystic Ovary Syndrome) & Fertility",
  shortName: "PCOS",
  alternateName: "Polycystic Ovary Syndrome",
  reviewerSlug: "falguni-bavishi",
  meta: {
    title: "PCOS (Polycystic Ovary Syndrome) Treatment & Fertility — Bavishi Fertility Institute",
    description:
      "PCOS and fertility — symptoms, diagnosis and treatment, from lifestyle and ovulation induction to IUI and IVF. PCOS is one of the most treatable causes of infertility. Since 1984.",
    ogImage: "/assets/conditions/pcos.png",
  },
  procedure: {
    procedureType: "https://schema.org/TherapeuticProcedure",
    bodyLocation: "Ovaries",
    howPerformed:
      "PCOS is managed with weight and lifestyle support, insulin-sensitising and ovulation-inducing medication, and, where needed, IUI or IVF with careful protocols to avoid overstimulation.",
    followup: "Cycles are monitored by scan and hormone tests to confirm ovulation and guide treatment.",
  },
  hero: {
    eyebrow: "Female Infertility",
    h1: "PCOS",
    h1Em: "& Fertility",
    tagline:
      "Polycystic ovary syndrome is the commonest hormonal cause of infertility — and one of the most treatable. With the right plan, most women with PCOS go on to conceive.",
    badges: ["Hormone Specialists", "Ovulation Induction", "Since 1984", "IUI · IVF"],
    image: "/assets/conditions/pcos.png",
    imageAlt: "PCOS (polycystic ovary syndrome) treatment and fertility care at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "PCOS?" },
    paragraphs: [
      "Polycystic ovary syndrome (PCOS) is a common hormonal condition in which the ovaries contain many small follicles and ovulation becomes irregular or absent. It often causes irregular periods, difficulty conceiving, weight gain, acne and excess hair growth.",
      "PCOS is the most common cause of ovulatory infertility — but it is highly treatable. With weight and lifestyle support, ovulation-inducing medication and, where needed, IUI or IVF, the great majority of women with PCOS are able to conceive.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "Why treating", em: "PCOS works" },
    subtitle: "PCOS responds well to a structured, step-by-step approach.",
    items: [
      "Restores regular ovulation in most women.",
      "Lifestyle and weight changes alone can re-start cycles.",
      "Ovulation-induction medication is simple and effective.",
      "IUI and IVF achieve high success when needed.",
      "Careful protocols reduce the risk of overstimulation.",
      "Also improves periods, skin and long-term health.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Signs you", em: "may have PCOS" },
    subtitle: "PCOS is diagnosed from a combination of symptoms, scans and hormone tests.",
    items: [
      "Irregular, infrequent or absent menstrual periods.",
      "Difficulty conceiving due to irregular ovulation.",
      "Weight gain or difficulty losing weight.",
      "Excess facial or body hair, acne or oily skin.",
      "A scan showing multiple small follicles on the ovaries.",
    ],
  },
  process: {
    heading: { lead: "How PCOS", em: "is treated" },
    subtitle: "A stepwise plan, starting with the simplest effective option.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Diagnosis", d: "History, ultrasound and hormone tests confirm PCOS and rule out other causes." },
      { icon: Leaf, n: "02", t: "Lifestyle & Metabolic Care", d: "Weight, nutrition and insulin-sensitising support to restore ovulation." },
      { icon: Activity, n: "03", t: "Ovulation Induction", d: "Tablets or gentle injections to trigger regular ovulation, monitored by scan." },
      { icon: Syringe, n: "04", t: "IUI", d: "Insemination timed to ovulation when natural timing is not enough." },
      { icon: FlaskConical, n: "05", t: "IVF", d: "IVF with safe protocols for those who need it, minimising overstimulation." },
    ],
    note: "Because PCOS ovaries can over-respond, we use careful, OHSS-aware stimulation protocols.",
  },
  success: {
    factors: [
      "Age and weight",
      "How regularly ovulation can be restored",
      "Insulin resistance and metabolic health",
      "Partner's sperm quality",
      "The treatment step used — natural, IUI or IVF",
    ],
    note: "Most women with PCOS conceive with appropriate treatment, often without IVF. Timelines vary, and outcomes cannot be guaranteed.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Ovarian overstimulation", d: "PCOS ovaries can over-respond to fertility medication (OHSS).", help: "We use safe, individualised protocols and close monitoring to prevent severe OHSS." },
      { t: "Higher miscarriage / metabolic risk", d: "PCOS can carry a slightly higher miscarriage and gestational-diabetes risk.", help: "Pre-pregnancy weight and metabolic care reduce these risks substantially." },
      { t: "Patience needed", d: "It can take a few cycles to find the right ovulation dose.", help: "We adjust carefully and monitor each cycle rather than rushing." },
    ],
  },
  video: {
    id: "cGkVVs8I4ZU",
    title: "PCOS Treatment — Expert Fertility Care",
    description:
      "Our experts explain PCOS (polycystic ovary syndrome) and fertility — what causes it, how it affects conception and the treatment options, from lifestyle changes and ovulation induction to IUI and IVF.",
    eyebrow: "Watch & Learn",
    heading: { lead: "PCOS Treatment", em: "Expert Fertility Care" },
  },
  faqs: [
    { q: "Can I get pregnant with PCOS?", a: "Yes. PCOS is one of the most treatable causes of infertility, and most women conceive with lifestyle changes, ovulation induction or, when needed, IUI or IVF." },
    { q: "Does losing weight help PCOS fertility?", a: "Often significantly. Even a modest 5–10% weight loss can restore regular ovulation and improve the response to treatment." },
    { q: "What is ovulation induction?", a: "Medication — usually tablets or gentle injections — that encourages the ovaries to release an egg, monitored by ultrasound to time conception." },
    { q: "Is IVF safe with PCOS?", a: "Yes, with care. PCOS ovaries can over-respond, so we use specific, OHSS-aware protocols and close monitoring to keep IVF safe." },
    { q: "Will PCOS affect my pregnancy?", a: "PCOS slightly raises some risks such as gestational diabetes, which is why pre-pregnancy health optimisation and good antenatal care matter." },
  ],
  related: ["ovarian-reserve", "conceive-naturally", "iui", "ivf", "female-infertility"],
  cta: {
    heading: "Trying to conceive",
    headingEm: "with PCOS?",
    subtitle: "PCOS is highly treatable — book a consultation for a clear, personalised fertility plan.",
  },
});

export const ovarianReserve = defineTreatment({
  slug: "ovarian-reserve",
  name: "Poor Ovarian Reserve / Low AMH Treatment",
  shortName: "Poor Ovarian Reserve",
  alternateName: "Low Egg Count / Low AMH",
  reviewerSlug: "falguni-bavishi",
  meta: {
    title: "Poor Ovarian Reserve / Low AMH Treatment — Bavishi Fertility Institute",
    description:
      "Low ovarian reserve and low AMH explained — what the numbers mean, how it is assessed, and tailored IVF protocols that make the most of the eggs you have. Trusted since 1984.",
    ogImage: "/assets/conditions/ovarian-reserve.png",
  },
  procedure: {
    procedureType: "https://schema.org/TherapeuticProcedure",
    bodyLocation: "Ovaries",
    howPerformed:
      "Ovarian reserve is assessed with AMH and antral-follicle count; treatment uses individualised stimulation protocols to recover the best eggs, with options including egg accumulation, mild IVF and donor eggs.",
    followup: "Response is tracked cycle by cycle to refine the protocol.",
  },
  hero: {
    eyebrow: "Female Infertility",
    h1: "Poor Ovarian Reserve",
    h1Em: "/ Low AMH",
    tagline:
      "A low egg count or low AMH means fewer eggs — not no chance. Tailored protocols help us recover and use the best eggs you have, with honest guidance throughout.",
    badges: ["Individualised Protocols", "Egg Accumulation", "Since 1984", "Class 1000 Labs"],
    image: "/assets/conditions/ovarian-reserve.png",
    imageAlt: "Poor ovarian reserve / low AMH treatment at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Poor Ovarian Reserve?" },
    paragraphs: [
      "Ovarian reserve refers to the number and quality of eggs remaining in the ovaries. A poor or diminished reserve — often reflected by a low AMH and a low antral-follicle count — means fewer eggs are available, which can make conception harder and reduce the response to IVF stimulation.",
      "A low reserve does not mean pregnancy is impossible. With individualised stimulation, strategies such as egg accumulation over several gentle cycles, and realistic counselling, many women conceive with their own eggs — and donor eggs remain a highly successful option when needed.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "How specialised", em: "care helps" },
    subtitle: "The right protocol makes the most of every available egg.",
    items: [
      "Individualised stimulation tuned to your reserve.",
      "Egg or embryo accumulation across gentle cycles.",
      "Advanced labs that protect every precious egg and embryo.",
      "Honest assessment of own-egg versus donor-egg chances.",
      "Earlier, focused treatment that does not waste time.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who this", em: "is for" },
    subtitle: "Women whose tests or history suggest a reduced egg supply.",
    items: [
      "A low AMH or low antral-follicle count on testing.",
      "A poor egg yield in a previous IVF cycle.",
      "Age over 35, or a family history of early menopause.",
      "Previous ovarian surgery, chemotherapy or radiation.",
      "Difficulty conceiving with signs of reduced reserve.",
    ],
  },
  process: {
    heading: { lead: "How we", em: "treat low reserve" },
    subtitle: "Careful assessment, then a protocol built around your biology.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Assessment", d: "AMH, antral-follicle count and history to gauge your reserve." },
      { icon: Target, n: "02", t: "Tailored Stimulation", d: "An individualised protocol chosen to recover the best-quality eggs." },
      { icon: Layers, n: "03", t: "Egg / Embryo Accumulation", d: "Collecting and freezing across cycles to build a usable pool." },
      { icon: Microscope, n: "04", t: "IVF–ICSI", d: "Careful fertilisation and culture in our Class 1000 laboratory." },
      { icon: Egg, n: "05", t: "Donor-egg Option", d: "A highly successful alternative discussed honestly where appropriate." },
    ],
    note: "We focus on egg quality and the right protocol, not just chasing higher numbers.",
  },
  success: {
    factors: [
      "Age, which strongly affects egg quality",
      "AMH and antral-follicle count",
      "The stimulation protocol used",
      "Whether eggs/embryos are accumulated",
      "Laboratory and embryology quality",
    ],
    note: "Low reserve generally lowers per-cycle chances with your own eggs, though good pregnancies still happen — and donor eggs offer high success. We give honest, individual estimates.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Fewer eggs per cycle", d: "Low reserve often means fewer eggs and sometimes cancelled cycles.", help: "Accumulation strategies and tailored protocols make the most of each attempt." },
      { t: "Time sensitivity", d: "Reserve and egg quality decline with age, so delay can reduce options.", help: "We recommend timely, focused treatment rather than prolonged waiting." },
      { t: "Considering donor eggs", d: "For some, donor eggs offer the most realistic chance.", help: "This is discussed sensitively and only when it is genuinely in your interest." },
    ],
  },
  video: {
    id: "GG5lDKS35OY",
    title: "Low AMH Treatment — Dr. Himanshu Bavishi",
    description:
      "Dr. Himanshu Bavishi clears up 5 common myths about low AMH, poor ovarian reserve and low egg count — what the numbers really mean and what your options are.",
    eyebrow: "Watch & Learn",
    heading: { lead: "Low AMH / Poor Ovarian Reserve", em: "Low Egg Count" },
  },
  faqs: [
    { q: "What does a low AMH mean?", a: "AMH reflects the number of eggs remaining. A low value suggests a reduced ovarian reserve, which can affect natural conception and the response to IVF — but it does not measure egg quality or rule out pregnancy." },
    { q: "Can I conceive with low ovarian reserve?", a: "Often yes, especially when egg quality is reasonable. Tailored stimulation and strategies like egg accumulation help, and donor eggs are a successful option if needed." },
    { q: "Does low AMH mean early menopause?", a: "Not necessarily. It indicates a smaller egg pool, but the timeline varies. Your specialist will interpret it alongside your age and other tests." },
    { q: "Can low reserve be increased?", a: "The number of eggs cannot truly be increased, but the right protocol can recover more of the eggs you have, and overall health supports egg quality." },
    { q: "Is donor egg my only option?", a: "No. Donor eggs are one option, but many women with low reserve conceive with their own eggs using individualised treatment. We assess this honestly with you." },
  ],
  related: ["ovarian-rejuvenation", "prp-infertility", "egg-donation", "ivf", "female-infertility"],
  cta: {
    heading: "Concerned about a",
    headingEm: "low egg count?",
    subtitle: "Get an honest assessment of your ovarian reserve and a protocol built around it — book a consultation.",
  },
});

export const ovarianRejuvenation = defineTreatment({
  slug: "ovarian-rejuvenation",
  name: "Ovarian Rejuvenation Therapy",
  shortName: "Ovarian Rejuvenation",
  alternateName: "Ovarian PRP",
  reviewerSlug: "falguni-bavishi",
  meta: {
    title: "Ovarian Rejuvenation Therapy — Bavishi Fertility Institute",
    description:
      "Ovarian rejuvenation explained — an emerging option using ovarian PRP to support follicle activity in low reserve or early menopause. Who may benefit, honestly assessed. Since 1984.",
    ogImage: "/assets/conditions/ovarian-rejuvenation.png",
  },
  procedure: {
    procedureType: "https://schema.org/TherapeuticProcedure",
    bodyLocation: "Ovaries",
    howPerformed:
      "Ovarian rejuvenation typically uses platelet-rich plasma (PRP) injected into the ovaries to try to reactivate dormant follicles, offered as an adjunct in carefully selected cases.",
    followup: "Hormone tests (AMH, FSH) and follicle scans assess any response over the following weeks.",
  },
  hero: {
    eyebrow: "Female Infertility",
    h1: "Ovarian",
    h1Em: "Rejuvenation",
    tagline:
      "An emerging therapy that uses your own platelet-rich plasma to try to reactivate ovarian activity — offered selectively, with honest expectations, for low reserve or early menopause.",
    badges: ["Ovarian PRP", "Autologous", "Since 1984", "Selective Use"],
    image: "/assets/conditions/ovarian-rejuvenation.png",
    imageAlt: "Ovarian rejuvenation therapy at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Ovarian Rejuvenation?" },
    paragraphs: [
      "Ovarian rejuvenation is an emerging technique that aims to reactivate the ovaries in women with a very low reserve or early menopause. The commonest method injects platelet-rich plasma (PRP) — concentrated growth factors from the woman's own blood — into the ovaries.",
      "The goal is to encourage dormant follicles to develop, potentially improving hormone levels and the chance of obtaining eggs. The evidence is still developing, so we offer it transparently in selected cases, alongside — not instead of — proven fertility treatment.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "Potential advantages of", em: "ovarian rejuvenation" },
    subtitle: "A minimally-invasive option for carefully selected women.",
    items: [
      "Uses your own blood, so no rejection or allergy risk.",
      "May support follicle activity in very low reserve.",
      "Could improve hormone profile in selected cases.",
      "An option to explore before committing to donor eggs.",
      "A minimally-invasive day-care procedure.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who may", em: "be considered" },
    subtitle: "Selective use, after full counselling about uncertain benefit.",
    items: [
      "Very low ovarian reserve or repeatedly poor IVF response.",
      "Early menopause or premature ovarian insufficiency.",
      "Perimenopausal women wishing to explore own-egg options.",
      "Women preferring to try before moving to donor eggs.",
      "Selected cases as an adjunct to IVF, after counselling.",
    ],
  },
  process: {
    heading: { lead: "How it", em: "is done" },
    subtitle: "A short, same-day procedure prepared from your own blood.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Assessment & Counselling", d: "Honest discussion of likely benefit and realistic expectations." },
      { icon: Droplets, n: "02", t: "Blood Sample", d: "A small blood sample is drawn, like a routine blood test." },
      { icon: Filter, n: "03", t: "PRP Preparation", d: "Platelet-rich plasma is concentrated from your sample." },
      { icon: Target, n: "04", t: "Ovarian Injection", d: "PRP is injected into the ovaries under ultrasound guidance." },
      { icon: ScanLine, n: "05", t: "Reassessment", d: "AMH, FSH and scans review any response before the next step." },
    ],
    note: "If there is a response, an IVF cycle is planned to make use of any available eggs.",
  },
  success: {
    factors: [
      "Age and the degree of ovarian decline",
      "Whether any residual follicles remain",
      "Baseline hormone levels",
      "Combination with a well-timed IVF cycle",
      "Individual biological response",
    ],
    note: "Ovarian rejuvenation is experimental and results are inconsistent. We are upfront that it may not work, and never present it as a guaranteed solution.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Unproven benefit", d: "Evidence is limited and a response cannot be promised.", help: "We offer it transparently and only when it is a reasonable thing to try." },
      { t: "Minor procedure effects", d: "Mild discomfort or spotting can follow the injection.", help: "These are usually minor and settle quickly." },
      { t: "Avoiding false hope", d: "It is important not to delay more reliable options.", help: "We set clear timelines and keep donor eggs openly on the table." },
    ],
  },
  video: {
    id: "699oPX9OOnY",
    title: "Ovarian Rejuvenation — Dr. Himanshu Bavishi",
    description:
      "Dr. Himanshu Bavishi explains ovarian rejuvenation — how it aims to reactivate dormant follicles in women with very low reserve or early menopause, and who it may help.",
    eyebrow: "Watch & Learn",
    heading: { lead: "Ovarian", em: "Rejuvenation" },
  },
  faqs: [
    { q: "What is ovarian rejuvenation?", a: "An emerging therapy, usually ovarian PRP, that aims to reactivate dormant follicles in women with very low reserve or early menopause, to try to improve hormone levels and egg availability." },
    { q: "Does it really work?", a: "Results are inconsistent and the evidence is still developing. Some women show a response; many do not. We are honest about this before you decide." },
    { q: "Is it safe?", a: "PRP uses your own blood, so there is no rejection risk, and the procedure is minimally invasive with only minor side-effects." },
    { q: "Who should consider it?", a: "Mainly women with very low reserve, early menopause or repeated poor IVF response who wish to explore own-egg options before donor eggs." },
    { q: "Is it a substitute for IVF or donor eggs?", a: "No. It is an adjunct that may be tried first; IVF and donor eggs remain the more reliable routes and are kept openly in the plan." },
  ],
  related: ["ovarian-reserve", "prp-infertility", "egg-donation", "ivf", "female-infertility"],
  cta: {
    heading: "Exploring",
    headingEm: "ovarian rejuvenation?",
    subtitle: "Get an honest, specialist view on whether it is worth trying in your case — book a consultation.",
  },
});

export const fibroids = defineTreatment({
  slug: "fibroids",
  name: "Fibroids & Fertility Treatment",
  shortName: "Fibroids",
  alternateName: "Uterine Fibroids",
  reviewerSlug: "janki-bavishi",
  meta: {
    title: "Fibroids & Fertility — Uterine Fibroid Treatment — Bavishi Fertility Institute",
    description:
      "Uterine fibroids and fertility — which fibroids affect conception, how they are diagnosed, and fertility-preserving treatment including minimally-invasive myomectomy. Since 1984.",
    ogImage: "/assets/conditions/fibroids.png",
  },
  procedure: {
    procedureType: "https://schema.org/SurgicalProcedure",
    bodyLocation: "Uterus",
    howPerformed:
      "Fibroids affecting fertility are assessed by ultrasound and hysteroscopy; those distorting the cavity are removed with fertility-preserving, minimally-invasive myomectomy (hysteroscopic or laparoscopic).",
    followup: "The uterine cavity is reassessed before planning conception or IVF.",
  },
  hero: {
    eyebrow: "Female Infertility",
    h1: "Fibroids",
    h1Em: "& Fertility",
    tagline:
      "Not all fibroids affect fertility — but those that distort the uterine cavity can. Fertility-preserving surgery removes the problem while protecting your chance of pregnancy.",
    badges: ["Reproductive Surgery", "Fertility-preserving", "Since 1984", "Minimally Invasive"],
    image: "/assets/conditions/fibroids.png",
    imageAlt: "Uterine fibroids and fertility treatment at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What are", em: "Fibroids?" },
    paragraphs: [
      "Fibroids are common, non-cancerous growths of muscle in the wall of the uterus. They are very common and often cause no problems, but depending on their size and position they can cause heavy periods, pain and, in some cases, difficulty conceiving or carrying a pregnancy.",
      "Whether a fibroid affects fertility depends mainly on its location. Those bulging into the uterine cavity (submucosal) matter most, as they can interfere with implantation. Our reproductive surgeons remove only the fibroids that need removing, using fertility-preserving, minimally-invasive techniques.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "Why fertility-focused", em: "fibroid care matters" },
    subtitle: "The goal is to protect the uterus, not just remove fibroids.",
    items: [
      "Treats only the fibroids that actually affect fertility.",
      "Fertility-preserving, minimally-invasive surgery.",
      "Restores a normal uterine cavity for implantation.",
      "Can reduce heavy bleeding, pain and pressure symptoms.",
      "May improve natural-conception and IVF success.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "When fibroids", em: "need treatment" },
    subtitle: "Treatment is guided by the fibroid's size, number and position.",
    items: [
      "A fibroid distorting the uterine cavity (submucosal).",
      "Infertility or recurrent miscarriage with no other cause.",
      "Heavy or prolonged periods causing anaemia.",
      "Pelvic pain, pressure or a noticeably enlarged uterus.",
      "Large fibroids before planning pregnancy or IVF.",
    ],
  },
  process: {
    heading: { lead: "How fibroids", em: "are treated" },
    subtitle: "Accurate mapping first, then targeted, fertility-sparing treatment.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Evaluation", d: "History, examination and ultrasound to map size, number and position." },
      { icon: ScanLine, n: "02", t: "Cavity Assessment", d: "Hysteroscopy or saline scan to see which fibroids affect the cavity." },
      { icon: Target, n: "03", t: "Hysteroscopic Myomectomy", d: "Cavity fibroids removed through the cervix, with no abdominal incision." },
      { icon: ShieldCheck, n: "04", t: "Laparoscopic Myomectomy", d: "Wall fibroids removed via keyhole surgery, preserving the uterus." },
      { icon: FlaskConical, n: "05", t: "Conception Plan", d: "Natural conception or IVF planned once the cavity has healed." },
    ],
    note: "Many fibroids need only monitoring — surgery is advised only when fertility or symptoms justify it.",
  },
  success: {
    factors: [
      "Fibroid size, number and especially position",
      "Whether the cavity was distorted before surgery",
      "Age and other fertility factors",
      "Healing of the uterus after surgery",
      "Surgical technique and expertise",
    ],
    note: "Removing cavity-distorting fibroids can improve fertility outcomes, though results depend on other factors and cannot be guaranteed.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Not all fibroids need surgery", d: "Many fibroids do not affect fertility and are best left alone.", help: "We operate selectively, only when a fibroid is genuinely relevant." },
      { t: "Surgical risks & healing", d: "Myomectomy is surgery, and the uterus needs time to heal.", help: "Minimally-invasive technique and planned recovery keep risks low before conception." },
      { t: "Possible recurrence", d: "New fibroids can sometimes form later.", help: "We plan conception within a sensible window after surgery." },
    ],
  },
  video: {
    id: "CG-T8lGxMY8",
    title: "Fibroids: Diagnosis and Management — Dr. Surabhi Vegad",
    description:
      "Dr. Surabhi Vegad explains fibroids — how they are diagnosed and managed, when they affect fertility and the treatment options available.",
    eyebrow: "Watch & Learn",
    heading: { lead: "Fibroids", em: "Diagnosis & Management" },
  },
  faqs: [
    { q: "Do fibroids always cause infertility?", a: "No. Many fibroids cause no fertility problems. It mainly depends on their position — those bulging into the uterine cavity are the most likely to affect conception." },
    { q: "Which fibroids need removal before pregnancy?", a: "Chiefly submucosal fibroids that distort the cavity, and sometimes large intramural fibroids, especially with infertility or recurrent miscarriage." },
    { q: "Is fibroid surgery fertility-preserving?", a: "Yes. Myomectomy removes the fibroids while preserving the uterus, using minimally-invasive hysteroscopic or laparoscopic techniques where possible." },
    { q: "How long after surgery can I try to conceive?", a: "It depends on the fibroid and the repair, but the uterus is usually given a few months to heal. Your surgeon will advise a safe window." },
    { q: "Can I do IVF with fibroids?", a: "Often yes, but cavity-distorting fibroids are usually treated first to give the embryo the best chance of implanting." },
  ],
  related: ["endometriosis", "ivf-failure", "ivf", "iui", "female-infertility"],
  cta: {
    heading: "Fibroids affecting",
    headingEm: "your fertility?",
    subtitle: "Find out whether your fibroids need treatment with a fertility-focused assessment — book a consultation.",
  },
});

export const endometriosis = defineTreatment({
  slug: "endometriosis",
  name: "Endometriosis & Fertility Treatment",
  shortName: "Endometriosis",
  reviewerSlug: "janki-bavishi",
  meta: {
    title: "Endometriosis & Fertility Treatment — Bavishi Fertility Institute",
    description:
      "Endometriosis and infertility — symptoms, diagnosis and fertility-focused treatment, from laparoscopic surgery to IVF. Compassionate, expert reproductive care since 1984.",
    ogImage: "/assets/conditions/endometriosis.png",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Pelvis / Uterus",
    howPerformed:
      "Endometriosis is assessed clinically and by ultrasound/laparoscopy; fertility is supported through laparoscopic treatment of disease where appropriate and, frequently, IVF, which is often the most effective route to pregnancy.",
    followup: "A conception plan — natural, IUI or IVF — is set according to stage and other factors.",
  },
  hero: {
    eyebrow: "Female Infertility",
    h1: "Endometriosis",
    h1Em: "& Fertility",
    tagline:
      "Endometriosis can cause pain and affect fertility — but with the right combination of surgery and IVF, many women with endometriosis go on to have a baby.",
    badges: ["Reproductive Surgery", "Endometriosis & IVF", "Since 1984", "Compassionate Care"],
    image: "/assets/conditions/endometriosis.png",
    imageAlt: "Endometriosis and fertility treatment at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Endometriosis?" },
    paragraphs: [
      "Endometriosis is a condition where tissue similar to the lining of the uterus grows outside it — on the ovaries, fallopian tubes and pelvic lining. It can cause painful periods, pelvic pain, pain during intercourse and, in many women, difficulty conceiving.",
      "Endometriosis affects fertility in several ways — distorting pelvic anatomy, affecting egg quality and the tubes, and creating inflammation. Treatment is individualised: laparoscopic surgery helps in selected cases, and IVF is often the most effective route to pregnancy.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "Why specialised", em: "endometriosis care helps" },
    subtitle: "Balancing symptom relief, fertility and timing is key.",
    items: [
      "An accurate diagnosis and staging of the disease.",
      "Fertility-focused decisions on surgery versus going straight to IVF.",
      "Laparoscopic treatment that protects ovarian reserve.",
      "IVF protocols designed for endometriosis.",
      "Relief of pain alongside the fertility plan.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Signs of", em: "endometriosis" },
    subtitle: "Endometriosis is suspected from symptoms and confirmed by imaging or laparoscopy.",
    items: [
      "Painful, heavy periods that disrupt daily life.",
      "Chronic pelvic pain or pain during intercourse.",
      "Difficulty conceiving with no other clear cause.",
      "An ovarian endometrioma (chocolate cyst) on a scan.",
      "A family history of endometriosis.",
    ],
  },
  process: {
    heading: { lead: "How we", em: "treat it" },
    subtitle: "A plan that balances fertility, pain and time.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Evaluation", d: "History, examination and ultrasound to assess the disease and reserve." },
      { icon: ScanLine, n: "02", t: "Diagnosis & Staging", d: "Imaging and, where needed, laparoscopy to confirm and stage endometriosis." },
      { icon: Target, n: "03", t: "Laparoscopic Surgery", d: "Careful, fertility-sparing treatment of disease in selected cases." },
      { icon: HeartPulse, n: "04", t: "Ovarian-reserve Care", d: "Protecting egg supply, with freezing considered before extensive surgery." },
      { icon: FlaskConical, n: "05", t: "IVF", d: "Often the most effective route to pregnancy, with tailored protocols." },
    ],
    note: "We weigh surgery against ovarian reserve carefully — sometimes proceeding straight to IVF is the better choice.",
  },
  success: {
    factors: [
      "The stage and extent of endometriosis",
      "Ovarian reserve and egg quality",
      "Age and tubal status",
      "Whether surgery or direct IVF is chosen",
      "Partner's sperm quality",
    ],
    note: "Many women with endometriosis conceive, often with IVF. Outcomes depend on stage and other factors and cannot be guaranteed.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Surgery and ovarian reserve", d: "Repeated or extensive ovarian surgery can lower egg reserve.", help: "We operate conservatively and may advise IVF or egg freezing first." },
      { t: "Recurrence", d: "Endometriosis can return after treatment.", help: "We plan conception within the most favourable window after treatment." },
      { t: "Pain versus fertility goals", d: "The best plan for pain is not always the best for fertility.", help: "We tailor the balance to your priorities and timeline." },
    ],
  },
  video: {
    id: "XRq8a-jSDDA",
    title: "Endometriosis and Chocolate Cyst — Dr. Binal Shah",
    description:
      "Dr. Binal Shah explains endometriosis and chocolate cysts — what they are, how they affect fertility and the treatment options available.",
    eyebrow: "Watch & Learn",
    heading: { lead: "Endometriosis", em: "and Chocolate Cyst" },
  },
  faqs: [
    { q: "Can I get pregnant with endometriosis?", a: "Yes. Many women with endometriosis conceive — naturally in milder cases, and with IVF, which is often the most effective treatment, in more significant disease." },
    { q: "Should I have surgery or go straight to IVF?", a: "It depends on the stage, your ovarian reserve, pain and age. Sometimes surgery helps; often, especially with reduced reserve, going directly to IVF is better. We advise individually." },
    { q: "Does endometriosis affect egg quality?", a: "It can, and ovarian endometriomas and surgery can reduce egg reserve, which is why we protect the ovaries and sometimes recommend egg freezing." },
    { q: "Is IVF effective for endometriosis?", a: "Yes. IVF bypasses several ways endometriosis affects fertility and is frequently the most successful route to pregnancy." },
    { q: "Will treating endometriosis cure my pain?", a: "Treatment often improves pain, though endometriosis can recur. Pain control and fertility are planned together according to your priorities." },
  ],
  related: ["fibroids", "ovarian-reserve", "ivf-failure", "ivf", "female-infertility"],
  cta: {
    heading: "Endometriosis and",
    headingEm: "trying to conceive?",
    subtitle: "Get a fertility-focused plan that balances your symptoms and your chance of pregnancy — book a consultation.",
  },
});

/* ===================================================================== */
/* FERTILITY PRESERVATION                                                 */
/* ===================================================================== */

export const cryopreservation = defineTreatment({
  slug: "cryopreservation",
  name: "Cryopreservation (Fertility Preservation)",
  shortName: "Cryopreservation",
  alternateName: "Fertility Freezing",
  reviewerSlug: "parth-bavishi",
  meta: {
    title: "Cryopreservation — Egg, Sperm & Embryo Freezing — Bavishi Fertility Institute",
    description:
      "Cryopreservation explained — vitrification of eggs, sperm and embryos to preserve fertility for medical or personal reasons. Class 1000 labs, high survival rates, since 1984.",
    ogImage: "/assets/about-clinic.jpg",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Reproductive cells / embryos",
    howPerformed:
      "Eggs, sperm or embryos are frozen by vitrification — an ultra-rapid technique that prevents ice-crystal damage — and stored safely in liquid nitrogen for future use.",
    followup: "Stored samples are thawed and used in a future IUI, IVF or frozen-embryo-transfer cycle when needed.",
  },
  hero: {
    eyebrow: "Fertility Preservation",
    h1: "Cryopreservation",
    h1Em: "(Fertility Preservation)",
    tagline:
      "Freeze your eggs, sperm or embryos today to protect your chance of parenthood tomorrow — whether for medical reasons or to plan your family on your own timeline.",
    badges: ["Vitrification", "High Survival Rates", "Since 1984", "Class 1000 Labs"],
    image: "/assets/about-clinic.jpg",
    imageAlt: "Cryopreservation (egg, sperm and embryo freezing) at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Cryopreservation?" },
    paragraphs: [
      "Cryopreservation is the freezing and long-term storage of reproductive cells — eggs, sperm or embryos — so they can be used to achieve a pregnancy in the future. Modern vitrification freezes cells so rapidly that damaging ice crystals do not form, giving excellent survival rates on thawing.",
      "People choose to preserve fertility for many reasons: before cancer treatment, before fertility-reducing surgery, to delay parenthood for personal or professional reasons, or to store surplus embryos from an IVF cycle. Stored samples remain viable for many years.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "Why preserve", em: "your fertility" },
    subtitle: "Cryopreservation keeps your future options open.",
    items: [
      "Protects fertility before chemotherapy, radiation or surgery.",
      "Lets you plan parenthood on your own timeline.",
      "Vitrification gives high survival rates on thawing.",
      "Stores surplus IVF embryos for later attempts.",
      "Frozen embryo transfers can be as successful as fresh.",
      "Samples remain viable for many years in secure storage.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who should", em: "consider it" },
    subtitle: "Cryopreservation suits a wide range of medical and personal situations.",
    items: [
      "Before cancer treatment that can harm fertility.",
      "Before surgery that may reduce ovarian or testicular function.",
      "Women wishing to delay childbearing while preserving younger eggs.",
      "Men who will be unavailable on the day of an IVF procedure.",
      "Couples with surplus good-quality embryos after IVF.",
    ],
  },
  process: {
    heading: { lead: "How freezing", em: "works" },
    subtitle: "A safe, well-established process from collection to storage.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Consultation", d: "We discuss your goals and which cells to preserve — eggs, sperm or embryos." },
      { icon: Egg, n: "02", t: "Collection", d: "Egg retrieval after stimulation, a sperm sample, or embryos created by IVF." },
      { icon: Snowflake, n: "03", t: "Vitrification", d: "Cells are flash-frozen by vitrification to avoid ice-crystal damage." },
      { icon: ShieldCheck, n: "04", t: "Secure Storage", d: "Samples are stored safely in monitored liquid-nitrogen tanks." },
      { icon: FlaskConical, n: "05", t: "Future Use", d: "Thawed and used in IUI, IVF or a frozen-embryo transfer when you are ready." },
    ],
    note: "Storage is reviewed periodically, and samples can be kept for many years.",
  },
  success: {
    factors: [
      "Age at the time of freezing (especially for eggs)",
      "The number of eggs or embryos stored",
      "Cell quality before freezing",
      "Laboratory and vitrification expertise",
      "Uterine health at the time of future transfer",
    ],
    note: "Survival after thawing is high with vitrification, but a future pregnancy depends on many factors and cannot be guaranteed. Younger age at freezing improves outcomes.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Not a guarantee", d: "Freezing preserves cells but does not guarantee a future baby.", help: "We give realistic, age-based expectations so you can plan with clarity." },
      { t: "Some loss on thawing", d: "Not every frozen cell survives the freeze–thaw process.", help: "Vitrification gives high survival, and we advise on numbers to store accordingly." },
      { t: "Ongoing storage", d: "Stored samples need continued, secure storage over time.", help: "Our monitored facility and clear storage agreements keep samples safe." },
    ],
  },
  faqs: [
    { q: "What can be frozen?", a: "Eggs, sperm and embryos can all be cryopreserved. Which is right for you depends on your situation, relationship status and goals." },
    { q: "What is vitrification?", a: "An ultra-rapid freezing method that turns cells to a glass-like state without forming ice crystals, giving much higher survival rates than older slow-freezing." },
    { q: "How long can samples be stored?", a: "For many years. Cells frozen by vitrification remain viable over long periods when stored correctly in liquid nitrogen." },
    { q: "Is frozen as good as fresh?", a: "For embryos, frozen-embryo transfers can be as successful as fresh. Egg and sperm outcomes depend on age and quality at freezing." },
    { q: "Who should freeze their fertility?", a: "Anyone facing fertility-reducing treatment or surgery, those wishing to delay parenthood, and couples with surplus embryos after IVF." },
  ],
  related: ["egg-freezing", "sperm-freezing", "embryo-freezing", "ivf", "fertility-preservation"],
  cta: {
    heading: "Thinking about",
    headingEm: "preserving your fertility?",
    subtitle: "Talk to our specialists about freezing eggs, sperm or embryos and protecting your future options.",
  },
});

export const embryoFreezing = defineTreatment({
  slug: "embryo-freezing",
  name: "Embryo Freezing (Embryo Cryopreservation)",
  shortName: "Embryo Freezing",
  alternateName: "Embryo Cryopreservation",
  reviewerSlug: "falguni-bavishi",
  meta: {
    title: "Embryo Freezing (Embryo Cryopreservation) — Bavishi Fertility Institute",
    description:
      "Embryo freezing explained — how surplus IVF embryos are vitrified and stored for frozen-embryo transfer, who benefits, and success factors. High survival rates, since 1984.",
    ogImage: "/assets/about-clinic.jpg",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Embryos",
    howPerformed:
      "Good-quality embryos from an IVF cycle are frozen by vitrification and stored, then thawed and transferred to the uterus in a later frozen-embryo-transfer (FET) cycle.",
    followup: "A pregnancy test follows the frozen-embryo transfer about two weeks later.",
  },
  hero: {
    eyebrow: "Fertility Preservation",
    h1: "Embryo",
    h1Em: "Freezing",
    tagline:
      "Surplus embryos from an IVF cycle can be safely frozen and stored — giving you further chances of pregnancy without repeating full stimulation and egg collection.",
    badges: ["Vitrification", "Frozen-Embryo Transfer", "Since 1984", "High Survival"],
    image: "/assets/about-clinic.jpg",
    imageAlt: "Embryo freezing (embryo cryopreservation) at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Embryo Freezing?" },
    paragraphs: [
      "Embryo freezing is the cryopreservation of embryos created during IVF. After fertilisation, good-quality embryos that are not transferred in the fresh cycle are frozen by vitrification and stored for future use.",
      "It is one of the most established and successful forms of fertility preservation. A frozen-embryo transfer (FET) in a later cycle can be as successful as a fresh transfer, and lets couples try for further pregnancies — or a sibling — without repeating stimulation and egg retrieval.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "The advantages of", em: "embryo freezing" },
    subtitle: "More chances of pregnancy from a single IVF cycle.",
    items: [
      "Extra attempts without repeating full IVF stimulation.",
      "Frozen-embryo transfers can match fresh-cycle success.",
      "Allows a planned, optimal transfer in a natural-like cycle.",
      "Lets the body recover before transfer, reducing OHSS risk.",
      "Enables PGT, where the embryo is frozen while results return.",
      "Supports planning for a future sibling.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who benefits", em: "from it" },
    subtitle: "Embryo freezing is part of most modern IVF journeys.",
    items: [
      "Couples with surplus good-quality embryos after IVF.",
      "Those advised a freeze-all cycle to avoid OHSS.",
      "Anyone undergoing PGT, where embryos are frozen pending results.",
      "Couples wishing to space pregnancies or plan a sibling.",
      "Before treatment or surgery that may affect fertility.",
    ],
  },
  process: {
    heading: { lead: "How it", em: "works" },
    subtitle: "From IVF to storage and a future frozen transfer.",
    steps: [
      { icon: FlaskConical, n: "01", t: "IVF & Fertilisation", d: "Eggs are collected and fertilised, and embryos are cultured in the lab." },
      { icon: Microscope, n: "02", t: "Embryo Selection", d: "Good-quality embryos suitable for freezing are identified." },
      { icon: Snowflake, n: "03", t: "Vitrification", d: "Selected embryos are flash-frozen to preserve them safely." },
      { icon: ShieldCheck, n: "04", t: "Secure Storage", d: "Embryos are stored in monitored liquid-nitrogen tanks." },
      { icon: Baby, n: "05", t: "Frozen-Embryo Transfer", d: "Thawed and transferred in a prepared cycle when you are ready." },
    ],
    note: "FET timing can be optimised to the lining, often improving the chance of implantation.",
  },
  success: {
    factors: [
      "Embryo quality and stage at freezing",
      "The woman's age when the embryos were created",
      "Endometrial preparation for the transfer",
      "Laboratory and vitrification expertise",
      "Overall uterine and general health",
    ],
    note: "Vitrified embryos have high survival rates and FET success can equal fresh transfer, though a pregnancy still cannot be guaranteed.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Some loss on thawing", d: "A small proportion of embryos may not survive thawing.", help: "Vitrification gives high survival, and surviving embryos are assessed before transfer." },
      { t: "No guarantee of pregnancy", d: "A frozen embryo is a chance of pregnancy, not a certainty.", help: "We give realistic expectations based on embryo quality and your age." },
      { t: "Storage decisions", d: "Stored embryos involve ongoing storage and future choices.", help: "Clear consent and storage agreements cover these from the start." },
    ],
  },
  faqs: [
    { q: "How long can embryos stay frozen?", a: "For many years. Vitrified embryos remain viable over long periods when stored correctly, with no clear reduction in quality over time." },
    { q: "Is a frozen-embryo transfer as good as fresh?", a: "Yes — frozen-embryo transfers can be as successful as, and sometimes more successful than, fresh transfers, because the lining can be optimally prepared." },
    { q: "Do all embryos survive freezing?", a: "Most do. Vitrification gives high survival rates, though a small number may not survive thawing." },
    { q: "Why might a freeze-all cycle be advised?", a: "To avoid OHSS, to allow PGT results, or to transfer into a better-prepared lining — all of which can improve safety and success." },
    { q: "Can frozen embryos be used for a sibling later?", a: "Yes. Many couples return to use their stored embryos to try for a second child without repeating a full IVF cycle." },
  ],
  related: ["cryopreservation", "egg-freezing", "ivf", "pgt", "fertility-preservation"],
  cta: {
    heading: "Considering",
    headingEm: "embryo freezing?",
    subtitle: "Learn how freezing your embryos can give you more chances from one IVF cycle — book a consultation.",
  },
});

export const spermFreezing = defineTreatment({
  slug: "sperm-freezing",
  name: "Sperm Freezing (Sperm Banking)",
  shortName: "Sperm Freezing",
  alternateName: "Sperm Banking / Sperm Cryopreservation",
  reviewerSlug: "parth-bavishi",
  meta: {
    title: "Sperm Freezing (Sperm Banking) — Bavishi Fertility Institute",
    description:
      "Sperm freezing explained — preserving sperm before cancer treatment, surgery or vasectomy, or as a backup for IVF. Simple, safe and long-lasting. Trusted since 1984.",
    ogImage: "/assets/about-clinic.jpg",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Sperm",
    howPerformed:
      "A semen sample is analysed, frozen by cryopreservation and stored in liquid nitrogen, then thawed for use in IUI or IVF–ICSI in the future.",
    followup: "Stored sperm is thawed and used in a future fertility-treatment cycle as required.",
  },
  hero: {
    eyebrow: "Fertility Preservation",
    h1: "Sperm Freezing",
    h1Em: "(Sperm Banking)",
    tagline:
      "A simple, reliable way to preserve fertility — before cancer treatment or surgery, or as a backup for IVF — so your sperm is ready whenever you need it.",
    badges: ["Simple & Quick", "Long-term Storage", "Since 1984", "IUI · IVF–ICSI"],
    image: "/assets/about-clinic.jpg",
    imageAlt: "Sperm freezing (sperm banking) at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Sperm Freezing?" },
    paragraphs: [
      "Sperm freezing, or sperm banking, is the collection, freezing and storage of a man's sperm so it can be used to achieve a pregnancy in the future. It is a simple, quick and well-established method of preserving male fertility.",
      "Men freeze sperm before cancer treatment or surgery that can affect fertility, before a vasectomy, when sperm counts are declining, or as a backup so a sample is always available on the day of an IVF or IUI procedure. Frozen sperm remains usable for many years.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "Why bank", em: "your sperm" },
    subtitle: "A small step now that protects your options later.",
    items: [
      "Preserves fertility before chemotherapy, radiation or surgery.",
      "A reliable backup for IVF and IUI cycles.",
      "Useful when sperm counts are low or declining.",
      "Avoids the pressure of producing a sample on the day.",
      "Simple, quick and minimally invasive.",
      "Stored samples remain usable for many years.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who should", em: "consider it" },
    subtitle: "Sperm banking suits many medical and practical situations.",
    items: [
      "Before cancer treatment or fertility-affecting surgery.",
      "Before a vasectomy, as a safeguard.",
      "Men with a low or falling sperm count.",
      "Those who may be travelling or unavailable for an IVF cycle.",
      "Before surgical sperm retrieval, to store surplus sperm.",
    ],
  },
  process: {
    heading: { lead: "How it", em: "works" },
    subtitle: "A straightforward, same-day process.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Consultation & Screening", d: "A brief consultation and routine infection screening before storage." },
      { icon: Beaker, n: "02", t: "Sample & Analysis", d: "A semen sample is provided and analysed for count and quality." },
      { icon: Snowflake, n: "03", t: "Freezing", d: "The sample is cryopreserved and divided into storage vials." },
      { icon: ShieldCheck, n: "04", t: "Secure Storage", d: "Vials are stored safely in monitored liquid-nitrogen tanks." },
      { icon: FlaskConical, n: "05", t: "Future Use", d: "Thawed and used for IUI or IVF–ICSI whenever needed." },
    ],
    note: "Where possible, banking before cancer treatment is arranged quickly so it does not delay care.",
  },
  success: {
    factors: [
      "Sperm count and quality before freezing",
      "The number of vials stored",
      "The fertility treatment used later (IUI vs IVF–ICSI)",
      "The female partner's age and fertility",
      "Laboratory and storage standards",
    ],
    note: "Sperm survives freezing well, and even samples with a low count can be used effectively with ICSI. A future pregnancy still depends on many factors.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Some loss on thawing", d: "Motility can drop a little after thawing.", help: "We store enough vials and can use ICSI, which needs very few sperm." },
      { t: "Time before treatment", d: "Banking is best done before fertility-reducing treatment starts.", help: "We arrange urgent storage quickly so it does not delay cancer care." },
      { t: "Ongoing storage", d: "Stored sperm needs continued secure storage.", help: "Clear storage agreements and a monitored facility keep samples safe." },
    ],
  },
  faqs: [
    { q: "Why should I freeze my sperm?", a: "Common reasons are before cancer treatment or surgery that can affect fertility, before a vasectomy, a declining sperm count, or as a backup for IVF/IUI." },
    { q: "How long can sperm be stored?", a: "For many years. Properly frozen sperm remains viable over long periods in liquid-nitrogen storage." },
    { q: "Does freezing affect sperm quality?", a: "Motility can fall slightly after thawing, but stored sperm works well for IUI and especially IVF–ICSI, which needs only a few healthy sperm." },
    { q: "Is sperm banking before cancer treatment urgent?", a: "Ideally it is done before chemotherapy or radiation begins. We arrange storage quickly so it does not delay your cancer treatment." },
    { q: "Can low-count samples be banked?", a: "Yes. Even low-count samples are worth freezing, as ICSI can achieve fertilisation with very few sperm." },
  ],
  related: ["cryopreservation", "azoospermia", "surgical-sperm-retrieval", "ivf", "fertility-preservation"],
  cta: {
    heading: "Need to",
    headingEm: "bank your sperm?",
    subtitle: "Arrange simple, secure sperm freezing — book a confidential appointment with our team.",
  },
});

export const eggFreezing = defineTreatment({
  slug: "egg-freezing",
  name: "Egg Freezing (Oocyte Cryopreservation)",
  shortName: "Egg Freezing",
  alternateName: "Oocyte Cryopreservation",
  reviewerSlug: "falguni-bavishi",
  meta: {
    title: "Egg Freezing (Oocyte Cryopreservation) — Bavishi Fertility Institute",
    description:
      "Egg freezing explained — preserving younger, healthier eggs for medical or personal reasons through vitrification. How it works, the best age, and success factors. Since 1984.",
    ogImage: "/assets/about-clinic.jpg",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Oocytes (eggs)",
    howPerformed:
      "After ovarian stimulation, mature eggs are collected and frozen by vitrification, then thawed, fertilised by ICSI and transferred as embryos in a future cycle.",
    followup: "Frozen eggs are thawed and used in a future IVF cycle when the woman is ready.",
  },
  hero: {
    eyebrow: "Fertility Preservation",
    h1: "Egg Freezing",
    h1Em: "(Oocyte Cryopreservation)",
    tagline:
      "Freeze younger, healthier eggs now to keep your options open for later — whether for medical reasons or to give yourself time on your own terms.",
    badges: ["Vitrification", "Freeze Younger Eggs", "Since 1984", "Class 1000 Labs"],
    image: "/assets/about-clinic.jpg",
    imageAlt: "Egg freezing (oocyte cryopreservation) at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Egg Freezing?" },
    paragraphs: [
      "Egg freezing, or oocyte cryopreservation, is the collection and freezing of a woman's eggs so they can be used to attempt a pregnancy in the future. Because egg quality declines with age, freezing eggs while younger preserves a better chance for later.",
      "Women freeze eggs for medical reasons — such as before cancer treatment — or for personal reasons, to give themselves time before starting a family. When she is ready, the eggs are thawed, fertilised by ICSI, and the resulting embryos are transferred.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "The advantages of", em: "egg freezing" },
    subtitle: "Preserving younger eggs preserves future possibilities.",
    items: [
      "Stores eggs at their current, younger quality.",
      "Keeps the option of a biological child open for later.",
      "Protects fertility before cancer treatment or surgery.",
      "Vitrification gives high egg-survival rates.",
      "No need for a partner or donor sperm at the time of freezing.",
      "Reduces time pressure on major life decisions.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who should", em: "consider it" },
    subtitle: "Egg freezing suits both medical and personal circumstances.",
    items: [
      "Before cancer treatment that can damage the ovaries.",
      "Women wishing to delay childbearing for personal or career reasons.",
      "A declining ovarian reserve or family history of early menopause.",
      "Before surgery that may reduce ovarian function.",
      "Single women who want to preserve their options.",
    ],
  },
  process: {
    heading: { lead: "How it", em: "works" },
    subtitle: "A short IVF-style cycle to collect and freeze eggs.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Assessment", d: "AMH, antral-follicle count and counselling on likely egg numbers." },
      { icon: Syringe, n: "02", t: "Ovarian Stimulation", d: "About two weeks of injections to grow multiple eggs, monitored by scan." },
      { icon: Egg, n: "03", t: "Egg Retrieval", d: "Mature eggs are collected in a short procedure under sedation." },
      { icon: Snowflake, n: "04", t: "Vitrification", d: "Mature eggs are flash-frozen and stored safely." },
      { icon: Microscope, n: "05", t: "Future Use", d: "Thawed, fertilised by ICSI and transferred as embryos when ready." },
    ],
    note: "Freezing more eggs, and at a younger age, improves the chance of a future baby.",
  },
  success: {
    factors: [
      "Age at the time of freezing — the single biggest factor",
      "The number of mature eggs frozen",
      "Egg quality and survival on thawing",
      "Laboratory and vitrification expertise",
      "Uterine health at the time of future transfer",
    ],
    note: "Younger age and more eggs improve the odds, but egg freezing preserves a chance — not a guarantee — of a future pregnancy. We give honest, age-based estimates.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Not a guarantee", d: "Frozen eggs improve future chances but cannot promise a baby.", help: "We give realistic, age-based numbers and may advise freezing more eggs." },
      { t: "Stimulation effects", d: "The stimulation cycle carries a small risk of OHSS and minor side-effects.", help: "Safe, individualised protocols and monitoring keep this risk low." },
      { t: "Best done younger", d: "Eggs frozen at an older age have lower success.", help: "We advise on the ideal timing so the eggs you store give the best chance." },
    ],
  },
  faqs: [
    { q: "What is the best age to freeze eggs?", a: "Earlier is better — ideally in your late twenties to early thirties — because egg quality and quantity decline with age. Freezing younger eggs gives the best future chance." },
    { q: "How many eggs should I freeze?", a: "It varies with age, but more eggs improve the odds. After assessing your reserve, your specialist will advise a target number, sometimes over more than one cycle." },
    { q: "Is egg freezing painful?", a: "The injections cause minimal discomfort and egg retrieval is done under sedation, so it is not painful. Mild bloating afterwards settles quickly." },
    { q: "How are frozen eggs used later?", a: "They are thawed, fertilised with sperm by ICSI, and the resulting embryos are transferred to the uterus in an IVF cycle." },
    { q: "Do frozen eggs survive well?", a: "Vitrification gives high egg-survival rates, though not every egg survives or fertilises — which is why the number frozen matters." },
  ],
  related: ["cryopreservation", "embryo-freezing", "ovarian-reserve", "ivf", "fertility-preservation"],
  cta: {
    heading: "Thinking about",
    headingEm: "freezing your eggs?",
    subtitle: "Get an honest assessment of your reserve and what egg freezing could mean for you — book a consultation.",
  },
});

/* ===================================================================== */
/* IVF FAILURE SOLUTIONS                                                  */
/* ===================================================================== */

export const ivfEvaluation = defineTreatment({
  slug: "ivf-evaluation",
  name: "IVF Failure Evaluation",
  shortName: "IVF Evaluation",
  alternateName: "Failed IVF Work-up",
  reviewerSlug: "himanshu-bavishi",
  meta: {
    title: "IVF Failure Evaluation — Why IVF Failed & What Next — Bavishi Fertility Institute",
    description:
      "A thorough evaluation after failed IVF — analysing eggs, sperm, embryos, the uterus and implantation to find the real reason, and building a smarter next plan. Trusted since 1984.",
    ogImage: "/assets/about-clinic.jpg",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Reproductive system",
    howPerformed:
      "Every stage of the previous cycle — stimulation, egg and sperm quality, fertilisation, embryo development, the uterus and implantation — is systematically reviewed to identify why IVF failed and what to change.",
    followup: "A personalised next-cycle plan is built from the findings.",
  },
  hero: {
    eyebrow: "IVF Failure Solutions",
    h1: "IVF Failure",
    h1Em: "Evaluation",
    tagline:
      "A failed cycle is not the end — it is information. A meticulous evaluation of every step tells us why IVF did not work, so the next attempt is smarter, not just another try.",
    badges: ["Root-cause Analysis", "Personalised Re-plan", "Since 1984", "Second-opinion Friendly"],
    image: "/assets/about-clinic.jpg",
    imageAlt: "IVF failure evaluation at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is an", em: "IVF Failure Evaluation?" },
    paragraphs: [
      "An IVF failure evaluation is a systematic review of a previous unsuccessful cycle to find out exactly where, and why, it did not succeed. Rather than simply repeating the same treatment, it examines each stage — stimulation and egg yield, sperm and fertilisation, embryo quality, the uterine lining and implantation.",
      "By pinpointing the real reason — whether egg or sperm quality, embryo genetics, a uterine factor or an implantation problem — we can change the right things for the next attempt. This is the foundation of treating recurrent IVF failure successfully.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "Why a proper", em: "evaluation matters" },
    subtitle: "Understanding the cause turns repeated attempts into a targeted plan.",
    items: [
      "Identifies the actual reason the cycle failed.",
      "Avoids blindly repeating the same treatment.",
      "Targets the specific weak link — eggs, sperm, embryo or uterus.",
      "Guides the use of PGT, ERA and other add-ons only when needed.",
      "Provides an honest, second-opinion perspective.",
      "Rebuilds confidence with a clear, individualised plan.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who should", em: "have one" },
    subtitle: "Anyone whose IVF has not worked, especially more than once.",
    items: [
      "One or more failed IVF or ICSI cycles.",
      "Good-quality embryos that did not implant.",
      "Recurrent implantation failure or recurrent miscarriage.",
      "Unexpectedly poor egg yield or fertilisation.",
      "Couples seeking a second opinion before trying again.",
    ],
  },
  process: {
    heading: { lead: "How we", em: "evaluate" },
    subtitle: "A structured review of every stage of your previous cycle.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Cycle Review", d: "We study your previous records — protocol, response, embryos and reports." },
      { icon: Beaker, n: "02", t: "Egg & Sperm Factors", d: "Assessment of ovarian reserve, sperm quality and DNA fragmentation." },
      { icon: Microscope, n: "03", t: "Embryo Factors", d: "Embryo quality, development and the possible role of genetics (PGT)." },
      { icon: ScanLine, n: "04", t: "Uterine & Implantation", d: "Hysteroscopy, lining assessment and ERA where repeated failure suggests it." },
      { icon: ListChecks, n: "05", t: "New Personalised Plan", d: "A tailored next-cycle strategy that changes the factors that matter." },
    ],
    note: "Add-ons such as PGT or ERA are recommended only where the evaluation shows they will help.",
  },
  success: {
    factors: [
      "How clearly a cause can be identified",
      "Egg, sperm and embryo quality",
      "Uterine and implantation factors",
      "The woman's age",
      "How well the new plan addresses the findings",
    ],
    note: "A focused evaluation improves the odds of the next cycle for many couples, but it cannot guarantee success. We are always honest about realistic chances.",
  },
  risks: {
    heading: { lead: "What to", em: "keep in mind" },
    items: [
      { t: "Not every cause is found", d: "Sometimes no single clear reason emerges despite full testing.", help: "Even then, optimising every modifiable factor improves the next attempt." },
      { t: "Avoiding unnecessary add-ons", d: "Not every couple needs PGT, ERA or immune tests.", help: "We recommend add-ons selectively, based on evidence and your findings." },
      { t: "Emotional toll", d: "Repeated failure is hard, and another cycle is a big decision.", help: "We counsel honestly and never push treatment that is unlikely to help." },
    ],
  },
  faqs: [
    { q: "Why did my IVF cycle fail?", a: "IVF can fail for many reasons — egg or sperm quality, embryo genetics, the uterine lining or implantation. A structured evaluation of your cycle is designed to identify which applies to you." },
    { q: "Should I just try IVF again?", a: "Not without understanding why the last cycle failed. Repeating the same treatment without changes often repeats the result. An evaluation tells us what to change." },
    { q: "What tests are involved?", a: "It can include a review of past records, ovarian-reserve and sperm tests, sperm-DNA fragmentation, hysteroscopy, and selectively PGT or ERA — guided by your history." },
    { q: "Do I need PGT or an ERA test?", a: "Only if indicated. These are valuable in the right cases — for example recurrent failure or implantation problems — and are recommended selectively, not routinely." },
    { q: "Can I come for just a second opinion?", a: "Absolutely. Many couples come for an honest second opinion and an independent evaluation before deciding on their next step." },
  ],
  related: ["ivf-failure", "era-test", "pgt", "ivf", "icsi"],
  cta: {
    heading: "IVF didn't work?",
    headingEm: "Let's find out why.",
    subtitle: "Book a detailed IVF-failure evaluation and get a clear, honest plan for your next step.",
  },
});

export const eraTest = defineTreatment({
  slug: "era-test",
  name: "ERA Test (Endometrial Receptivity Analysis)",
  shortName: "ERA Test",
  alternateName: "Endometrial Receptivity Analysis",
  reviewerSlug: "falguni-bavishi",
  meta: {
    title: "ERA Test (Endometrial Receptivity Analysis) — Bavishi Fertility Institute",
    description:
      "The ERA test explained — how endometrial receptivity analysis personalises embryo-transfer timing to find your window of implantation, especially after repeated failure. Since 1984.",
    ogImage: "/assets/about-clinic.jpg",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalTest",
    bodyLocation: "Endometrium",
    howPerformed:
      "A small endometrial biopsy is taken in a mock cycle and analysed for the expression of receptivity genes, identifying the personalised window of implantation for embryo transfer.",
    followup: "The frozen-embryo transfer is then timed to the personalised window the ERA identifies.",
  },
  hero: {
    eyebrow: "IVF Failure Solutions",
    h1: "ERA Test",
    h1Em: "(Endometrial Receptivity Analysis)",
    tagline:
      "Even a perfect embryo needs the right moment to implant. The ERA test finds your personal window of implantation, so the transfer is timed precisely for you.",
    badges: ["Personalised Timing", "For Recurrent Failure", "Since 1984", "Genomic Test"],
    image: "/assets/about-clinic.jpg",
    imageAlt: "ERA test (endometrial receptivity analysis) at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is the", em: "ERA Test?" },
    paragraphs: [
      "The Endometrial Receptivity Analysis (ERA) is a genomic test that determines the best time to transfer an embryo. The uterine lining is only receptive to an embryo during a short window of implantation, and in some women this window is shifted earlier or later than the standard transfer day.",
      "By analysing the activity of receptivity-related genes in a small endometrial biopsy taken during a mock cycle, the ERA identifies each woman's personalised window of implantation. The embryo transfer is then timed to that window — particularly useful after good embryos have repeatedly failed to implant.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "The advantages of", em: "the ERA test" },
    subtitle: "Personalised transfer timing for selected couples.",
    items: [
      "Identifies a displaced window of implantation.",
      "Personalises the day of embryo transfer.",
      "Can help when good embryos repeatedly fail to implant.",
      "Avoids transferring into a non-receptive lining.",
      "Adds precision to a frozen-embryo-transfer plan.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who may", em: "benefit" },
    subtitle: "The ERA is selective — most useful in implantation failure.",
    items: [
      "Repeated implantation failure despite good-quality embryos.",
      "Failed transfers of euploid (PGT-tested) embryos.",
      "Unexplained failure of well-planned frozen transfers.",
      "Couples wanting to optimise timing before a precious transfer.",
      "Selected cases identified during an IVF-failure evaluation.",
    ],
  },
  process: {
    heading: { lead: "How the", em: "ERA works" },
    subtitle: "A mock cycle and biopsy that guide the real transfer.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Assessment", d: "We confirm the ERA is appropriate, usually after repeated implantation failure." },
      { icon: Activity, n: "02", t: "Mock Cycle", d: "The lining is prepared exactly as it would be for an embryo transfer." },
      { icon: Target, n: "03", t: "Endometrial Biopsy", d: "A small lining sample is taken at the planned transfer timing." },
      { icon: Dna, n: "04", t: "Gene Analysis", d: "Receptivity-gene activity is analysed to find your window of implantation." },
      { icon: Baby, n: "05", t: "Timed Transfer", d: "The frozen-embryo transfer is timed precisely to your personal window." },
    ],
    note: "The ERA needs a dedicated mock cycle, so it is planned before the transfer cycle, not during it.",
  },
  success: {
    factors: [
      "Whether implantation failure is truly due to timing",
      "Accurate replication of the tested protocol at transfer",
      "Embryo quality (timing helps only good embryos)",
      "Uterine health overall",
      "Correct interpretation and application of the result",
    ],
    note: "The ERA helps the subset of couples whose failures are due to a displaced window. It is not needed by everyone, and it cannot overcome other causes of failure.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Not for everyone", d: "Most couples have a normal window and do not need an ERA.", help: "We recommend it selectively, mainly in genuine recurrent implantation failure." },
      { t: "An extra cycle & cost", d: "The ERA requires a separate mock cycle before transfer.", help: "We only advise it when the likely benefit justifies the time and cost." },
      { t: "Minor biopsy discomfort", d: "The biopsy can cause brief cramping or spotting.", help: "It is quick and done in the clinic with simple aftercare." },
    ],
  },
  faqs: [
    { q: "What does the ERA test do?", a: "It analyses receptivity genes in the uterine lining to find your personalised window of implantation, so an embryo can be transferred at exactly the right time." },
    { q: "Who needs an ERA test?", a: "Mainly women with repeated implantation failure despite good-quality embryos, including failed transfers of genetically-tested embryos." },
    { q: "Is the ERA done in the transfer cycle?", a: "No. It uses a separate mock cycle that mimics the transfer, so the lining can be biopsied without using an embryo. The real transfer follows later." },
    { q: "Will the ERA guarantee success?", a: "No. It helps when failure is caused by a displaced window of implantation, but it cannot fix other causes such as embryo or uterine problems." },
    { q: "Is the biopsy painful?", a: "It usually causes only brief cramping, similar to a smear test, and is done quickly in the clinic." },
  ],
  related: ["ivf-failure", "ivf-evaluation", "pgt", "ivf", "blastocyst-transfer"],
  cta: {
    heading: "Embryos that",
    headingEm: "won't implant?",
    subtitle: "Ask our specialists whether an ERA test could personalise your transfer timing — book a consultation.",
  },
});

export const pgt = defineTreatment({
  slug: "pgt",
  name: "Preimplantation Genetic Testing (PGT)",
  shortName: "PGT",
  alternateName: "Preimplantation Genetic Testing",
  reviewerSlug: "parth-bavishi",
  meta: {
    title: "Preimplantation Genetic Testing (PGT-A / PGT-M / PGT-SR) — Bavishi Fertility Institute",
    description:
      "PGT explained — testing IVF embryos for chromosomal and genetic conditions before transfer, to improve success and reduce miscarriage. PGT-A, PGT-M and PGT-SR, since 1984.",
    ogImage: "/assets/about-clinic.jpg",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalTest",
    bodyLocation: "Embryos",
    howPerformed:
      "A few cells are biopsied from each blastocyst-stage embryo and tested for chromosomal number (PGT-A), a specific inherited condition (PGT-M) or structural rearrangements (PGT-SR); only healthy embryos are transferred.",
    followup: "Embryos are frozen while results return, then a healthy embryo is transferred.",
  },
  hero: {
    eyebrow: "IVF Failure Solutions",
    h1: "Preimplantation",
    h1Em: "Genetic Testing (PGT)",
    tagline:
      "PGT screens IVF embryos for chromosomal and genetic problems before transfer — helping select the healthiest embryo, improving success and reducing the risk of miscarriage.",
    badges: ["PGT-A · PGT-M · PGT-SR", "Healthy-embryo Selection", "Since 1984", "Class 1000 Labs"],
    image: "/assets/about-clinic.jpg",
    imageAlt: "Preimplantation genetic testing (PGT) at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "PGT?" },
    paragraphs: [
      "Preimplantation Genetic Testing (PGT) is the genetic analysis of embryos created through IVF, before they are transferred to the uterus. A few cells are gently biopsied from each blastocyst and tested, so that only healthy embryos are selected for transfer.",
      "There are three types: PGT-A checks for the correct number of chromosomes (the commonest cause of failed implantation and miscarriage); PGT-M tests for a specific inherited single-gene disease; and PGT-SR detects chromosomal structural rearrangements. PGT improves the chance of choosing an embryo that can lead to a healthy baby.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "The advantages of", em: "PGT" },
    subtitle: "Selecting the healthiest embryo before transfer.",
    items: [
      "Improves implantation rates per transfer.",
      "Reduces the risk of miscarriage from chromosomal errors.",
      "Avoids passing on a known inherited genetic condition.",
      "Supports single-embryo transfer, reducing twins.",
      "Shortens time to pregnancy by avoiding doomed transfers.",
      "Offers reassurance for older couples or those with prior loss.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who may", em: "benefit" },
    subtitle: "PGT is valuable in specific, well-defined situations.",
    items: [
      "Advanced maternal age, where chromosomal errors are commoner.",
      "Recurrent miscarriage or recurrent implantation failure.",
      "A known inherited single-gene disorder in the family.",
      "A parent carrying a chromosomal rearrangement (translocation).",
      "A wish to maximise success per transfer and avoid twins.",
    ],
  },
  process: {
    heading: { lead: "How PGT", em: "works" },
    subtitle: "Integrated into an IVF cycle, with testing before transfer.",
    steps: [
      { icon: FlaskConical, n: "01", t: "IVF & Blastocyst Culture", d: "Eggs are collected, fertilised by ICSI and grown to blastocyst stage." },
      { icon: Microscope, n: "02", t: "Embryo Biopsy", d: "A few cells are gently removed from each blastocyst by skilled embryologists." },
      { icon: Snowflake, n: "03", t: "Freeze & Test", d: "Embryos are vitrified while the biopsy is genetically analysed." },
      { icon: Dna, n: "04", t: "Genetic Analysis", d: "PGT-A, PGT-M or PGT-SR identifies the chromosomally/genetically healthy embryos." },
      { icon: Baby, n: "05", t: "Healthy-embryo Transfer", d: "A single healthy embryo is transferred in a later frozen cycle." },
    ],
    note: "Because results take time, PGT cycles use a freeze-all approach with a later frozen-embryo transfer.",
  },
  success: {
    factors: [
      "The reason for testing and the embryos available",
      "Egg and embryo quality (PGT selects, it cannot create)",
      "The woman's age",
      "Uterine receptivity at transfer",
      "Laboratory and genetics expertise",
    ],
    note: "PGT improves the chance per transfer by selecting healthy embryos, but it depends on having suitable embryos and cannot guarantee a pregnancy.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Needs good embryos", d: "PGT selects among embryos but cannot improve a poor cohort.", help: "We advise honestly whether PGT is likely to help in your case." },
      { t: "No suitable embryo", d: "Sometimes testing finds no chromosomally normal embryo to transfer.", help: "This is difficult but important information for planning the next step." },
      { t: "Biopsy & cost", d: "PGT adds a biopsy, the freeze-all approach and extra cost.", help: "We recommend it selectively, where the benefit justifies it." },
    ],
  },
  faqs: [
    { q: "What is the difference between PGT-A, PGT-M and PGT-SR?", a: "PGT-A checks the number of chromosomes; PGT-M tests for a specific inherited single-gene disease; PGT-SR detects structural chromosomal rearrangements such as translocations." },
    { q: "Does PGT improve IVF success?", a: "In the right couples, yes — by selecting a chromosomally normal embryo it improves implantation per transfer and lowers miscarriage risk, though it cannot guarantee pregnancy." },
    { q: "Is the embryo biopsy safe?", a: "Performed by experienced embryologists at the blastocyst stage, it is considered safe and does not harm the baby's development." },
    { q: "Will PGT mean I always have an embryo to transfer?", a: "Not always. Sometimes no chromosomally normal embryo is found, which is valuable information even though it is hard news." },
    { q: "Do I need a frozen transfer with PGT?", a: "Usually yes. Embryos are frozen while results return, then a tested, healthy embryo is transferred in a later cycle." },
  ],
  related: ["ivf-failure", "ivf-evaluation", "era-test", "ivf", "icsi"],
  cta: {
    heading: "Considering",
    headingEm: "genetic testing of embryos?",
    subtitle: "Find out whether PGT is right for your situation — book a consultation with our specialists.",
  },
});

export const surrogacy = defineTreatment({
  slug: "surrogacy",
  name: "Surrogacy Treatment",
  shortName: "Surrogacy",
  alternateName: "Gestational Surrogacy",
  reviewerSlug: "falguni-bavishi",
  meta: {
    title: "Surrogacy Treatment — Gestational Surrogacy — Bavishi Fertility Institute",
    description:
      "Gestational surrogacy explained — when it is needed, how the process works, and India's legal framework under the Surrogacy Act. Ethical, fully-supported care since 1984.",
    ogImage: "/assets/about-clinic.jpg",
  },
  procedure: {
    procedureType: "https://schema.org/MedicalProcedure",
    bodyLocation: "Uterus (gestational carrier)",
    howPerformed:
      "An embryo created from the intended parents' (or donor) eggs and sperm by IVF is transferred to a gestational surrogate, who carries and delivers the baby; the surrogate has no genetic link to the child.",
    followup: "Pregnancy is monitored with full antenatal care through to delivery.",
  },
  hero: {
    eyebrow: "IVF Failure Solutions",
    h1: "Surrogacy",
    h1Em: "Treatment",
    tagline:
      "When carrying a pregnancy is not possible, gestational surrogacy offers a path to parenthood — handled ethically, legally and with complete support at every step.",
    badges: ["Gestational Surrogacy", "Surrogacy Act Compliant", "Since 1984", "Full Support"],
    image: "/assets/about-clinic.jpg",
    imageAlt: "Surrogacy treatment at Bavishi Fertility Institute",
  },
  whatIs: {
    heading: { lead: "What is", em: "Surrogacy?" },
    paragraphs: [
      "In gestational surrogacy, an embryo created through IVF — using the intended parents' or donor eggs and sperm — is carried by another woman, the gestational surrogate. She carries and delivers the baby but has no genetic relationship to the child.",
      "Surrogacy is considered when a woman cannot carry a pregnancy herself — for example after hysterectomy, with a severe uterine problem, or where pregnancy would be medically dangerous. In India it is governed by the Surrogacy (Regulation) Act, and we support intended parents through the entire medical and legal process.",
    ],
    aside: BFI_ASIDE,
  },
  benefits: {
    heading: { lead: "How surrogacy", em: "helps" },
    subtitle: "A route to a genetically-related child when carrying is not possible.",
    items: [
      "Parenthood when the uterus is absent or pregnancy is unsafe.",
      "A genetic link where the parents' own eggs/sperm are used.",
      "Care coordinated medically and legally under the Act.",
      "Rigorous surrogate screening and support.",
      "Full antenatal care through to a safe delivery.",
    ],
  },
  whoNeedsIt: {
    heading: { lead: "Who may", em: "need surrogacy" },
    subtitle: "Surrogacy is for those who cannot safely carry a pregnancy.",
    items: [
      "Absence of the uterus (congenital or after hysterectomy).",
      "A severely damaged uterus or unresponsive thin lining.",
      "Repeated IVF failure or pregnancy loss due to a uterine factor.",
      "A medical condition that makes pregnancy dangerous.",
      "Eligible intended parents as defined under the Surrogacy Act.",
    ],
  },
  process: {
    heading: { lead: "How surrogacy", em: "works" },
    subtitle: "A carefully coordinated medical and legal journey.",
    steps: [
      { icon: ClipboardCheck, n: "01", t: "Eligibility & Counselling", d: "We confirm medical need and eligibility under the Surrogacy Act, with counselling." },
      { icon: ListChecks, n: "02", t: "Legal Process", d: "The required approvals, consents and documentation are completed." },
      { icon: ShieldCheck, n: "03", t: "Surrogate Screening", d: "The gestational surrogate is medically and psychologically screened." },
      { icon: FlaskConical, n: "04", t: "IVF & Embryo Transfer", d: "An embryo from the parents' or donor gametes is transferred to the surrogate." },
      { icon: Baby, n: "05", t: "Pregnancy & Delivery", d: "Full antenatal care supports the surrogate through to a safe delivery." },
    ],
    note: "Surrogacy in India is altruistic and tightly regulated; we follow the law fully at every stage.",
  },
  success: {
    factors: [
      "Embryo quality from the intended parents or donors",
      "The intended mother's (or egg donor's) age",
      "The surrogate's uterine health",
      "Sperm quality",
      "Laboratory and clinical expertise",
    ],
    note: "Surrogacy success depends mainly on embryo quality and the surrogate's uterine health. As with all fertility treatment, an outcome cannot be guaranteed.",
  },
  risks: {
    heading: { lead: "Risks &", em: "considerations" },
    items: [
      { t: "Legal & eligibility rules", d: "Surrogacy is tightly regulated, with specific eligibility criteria.", help: "We guide you through the Surrogacy Act requirements and paperwork fully." },
      { t: "Emotional complexity", d: "Surrogacy is an emotional journey for parents and surrogate alike.", help: "Counselling and ongoing support are built into the process." },
      { t: "Pregnancy risks", d: "As in any pregnancy, complications can occur for the surrogate.", help: "Comprehensive antenatal care monitors and protects her health throughout." },
    ],
  },
  faqs: [
    { q: "What is gestational surrogacy?", a: "An embryo created by IVF from the intended parents' or donor eggs and sperm is carried by a surrogate, who has no genetic link to the baby she delivers." },
    { q: "When is surrogacy needed?", a: "Mainly when a woman cannot safely carry a pregnancy — for example absence of the uterus, a severely damaged uterus, or a medical condition that makes pregnancy dangerous." },
    { q: "Is surrogacy legal in India?", a: "Yes, under the Surrogacy (Regulation) Act, which permits altruistic surrogacy with specific eligibility and legal requirements. We follow these fully." },
    { q: "Will the baby be genetically ours?", a: "If the intended parents' own eggs and sperm are used, yes. Donor eggs or sperm are used only where medically needed. The surrogate is never genetically related to the baby." },
    { q: "Who can be a surrogate?", a: "A surrogate must meet the medical and legal criteria defined under the Act and passes thorough medical and psychological screening before proceeding." },
  ],
  related: ["ivf-failure", "egg-donation", "embryo-donation", "ivf", "ivf-evaluation"],
  cta: {
    heading: "Exploring",
    headingEm: "surrogacy?",
    subtitle: "Speak with our team about whether surrogacy is right for you and how the process works — confidentially and clearly.",
  },
});

export const TREATMENTS: Treatment[] = [
  ivf,
  ivfFailure,
  iui,
  icsi,
  picsi,
  imsi,
  macs,
  spindleViewIcsi,
  blastocystTransfer,
  laserHatching,
  eggDonation,
  spermDonation,
  embryoDonation,
  // Male Infertility
  oligospermia,
  asthenospermia,
  azoospermia,
  surgicalSpermRetrieval,
  varicocele,
  erectileDysfunction,
  // Female Infertility
  conceiveNaturally,
  prpInfertility,
  pcos,
  ovarianReserve,
  ovarianRejuvenation,
  fibroids,
  endometriosis,
  // Fertility Preservation
  cryopreservation,
];
export const treatmentBySlug = (slug: string) => TREATMENTS.find((t) => t.slug === slug);

/* ---------- Structured data for a treatment page ----------
 * Returns the per-page @graph nodes. Combined with the sitewide
 * #organization + #website (emitted in layout), this gives every treatment
 * page a complete, connected medical entity graph:
 *   MedicalWebPage ─reviewedBy→ Physician ─worksFor→ #organization
 *   MedicalProcedure ─provider→ #organization
 *   FAQPage / VideoObject / BreadcrumbList                                   */
/** The plain-data subset treatmentGraph() reads — no icon-bearing fields — so a
 *  CMS-resolved `ResolvedTreatment` (Wave 4.4) can be passed here as well as a
 *  code `Treatment`. Both are structurally assignable. */
export type TreatmentGraphInput = Pick<
  Treatment,
  "href" | "name" | "alternateName" | "meta" | "procedure" | "breadcrumbName" | "lastReviewed" | "reviewerSlug" | "faqs" | "video"
>;

export function treatmentGraph(t: TreatmentGraphInput): Record<string, unknown>[] {
  const url = abs(t.href);
  const reviewer = doctorBySlug(t.reviewerSlug);

  const nodes: Record<string, unknown>[] = [
    {
      "@type": "MedicalWebPage",
      "@id": `${url}#webpage`,
      url,
      name: t.meta.title,
      description: t.meta.description,
      about: { "@type": "MedicalProcedure", name: t.name },
      lastReviewed: t.lastReviewed,
      isPartOf: { "@id": WEBSITE_ID },
      ...(reviewer ? { reviewedBy: reviewerNode(reviewer) } : {}),
    },
    {
      "@type": "MedicalProcedure",
      name: t.name,
      ...(t.alternateName ? { alternateName: t.alternateName } : {}),
      ...(t.procedure.procedureType ? { procedureType: t.procedure.procedureType } : {}),
      ...(t.procedure.howPerformed ? { howPerformed: t.procedure.howPerformed } : {}),
      ...(t.procedure.followup ? { followup: t.procedure.followup } : {}),
      ...(t.procedure.bodyLocation ? { bodyLocation: t.procedure.bodyLocation } : {}),
      provider: { "@id": ORG_ID },
    },
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Treatments", url: "/#treatments" },
      { name: t.breadcrumbName, url: t.href },
    ]),
    faqSchema(t.faqs),
  ];

  if (t.video) {
    nodes.push({
      "@type": "VideoObject",
      name: t.video.title,
      description: t.video.description,
      thumbnailUrl: `https://img.youtube.com/vi/${t.video.id}/hqdefault.jpg`,
      uploadDate: "2023-01-01",
      contentUrl: `https://www.youtube.com/watch?v=${t.video.id}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${t.video.id}`,
      publisher: { "@id": ORG_ID },
    });
  }

  // Include the reviewer's full Physician node so the reviewedBy reference
  // resolves to a complete entity on the same page.
  if (reviewer) nodes.push(physicianSchema(reviewer));

  return nodes;
}
