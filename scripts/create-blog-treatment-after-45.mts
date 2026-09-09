/* =====================================================================
 * Create NEW blog: "How to Choose the Right Treatment After 45 — BFI's
 * Approach" (from client Word doc). Category IVF. Light-rose SVG system,
 * 3 infographics.
 *   _id: blog-pg-283  slug: how-to-choose-the-right-treatment-after-45
 *
 * Run:
 *   npx tsx --env-file=.env.local --tsconfig tsconfig.json \
 *     scripts/create-blog-treatment-after-45.mts [--dry-run]
 * ===================================================================== */
import { createClient } from "next-sanity";

const DRY = process.argv.includes("--dry-run");
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN!,
});

/* ── Lexical node helpers ─────────────────────────────────────────── */
let uid = 0;
const id = () => `n${(uid++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
type TextRun = { text: string; bold?: boolean };
const T = (text: string, bold = false): TextRun => ({ text, bold });
function textNode(r: TextRun) {
  return { mode: "normal", text: r.text, type: "text", style: "", detail: 0, format: r.bold ? 1 : 0, version: 1 };
}
function para(runs: string | TextRun[]) {
  const arr = typeof runs === "string" ? [T(runs)] : runs;
  return { type: "paragraph", format: "", indent: 0, version: 1, children: arr.map(textNode), direction: "ltr", textStyle: "", textFormat: 0 };
}
function heading(tag: "h2" | "h3", text: string) {
  return { type: "heading", tag, format: "", indent: 0, version: 1, children: [textNode(T(text))], direction: "ltr" };
}
function listItem(runs: string | TextRun[], value: number) {
  const arr = typeof runs === "string" ? [T(runs)] : runs;
  return { type: "listitem", format: "", indent: 0, version: 1, value, children: arr.map(textNode), direction: "ltr" };
}
function list(tag: "ul" | "ol", items: (string | TextRun[])[]) {
  return { type: "list", tag, listType: tag === "ol" ? "number" : "bullet", start: 1, format: "", indent: 0, version: 1, direction: "ltr", children: items.map((it, i) => listItem(it, i + 1)) };
}
function quote(text: string) {
  return { type: "quote", format: "", indent: 0, version: 1, children: [textNode(T(text))], direction: "ltr" };
}
function block(blockType: string, fields: Record<string, unknown>) {
  return { type: "block", version: 2, fields: { id: id(), blockName: "", blockType, ...fields } };
}
const wid = () => id();

/* ── Design tokens (locked light-rose system) ─────────────────────── */
const C = { ivory: "#FAF9F6", border: "#E2DEED", rose: "#CF3A6A", dark: "#1A1825", muted: "#6B6580", white: "#FFFFFF", tint: "#F3F0F8" };
const FF = `font-family="'Inter', system-ui, sans-serif"`;
/** Escape bare ampersands (XML). Avoid literal <,> in SVG text — use words. */
const esc = (s: string) => s.replace(/&(?!(amp|lt|gt|quot|apos|#\d+);)/g, "&amp;");

/* ── Infographic A: Treatment options after 45 (accent-bar, situation→path) ── */
const optRows = [
  { situation: "AMH is decent and you're still ovulating", path: "1–2 cycles of ICSI with your own eggs + PGT-A testing of embryos" },
  { situation: "AMH is very low or FSH is high", path: "Donor-egg ICSI — the most successful option after 45" },
  { situation: "Fibroids, polyps or a thin lining", path: "Treat the uterus first; surrogacy if it cannot carry safely" },
  { situation: "BP, diabetes or a heart issue", path: "Physician first, then care by our high-risk pregnancy team" },
];
const oH = 66, oGap = 12, oY0 = 96, oX = 24, oW = 852;
const optEls = optRows.map((r, i) => {
  const y = oY0 + i * (oH + oGap);
  const cy = y + oH / 2;
  return `
    <rect x="${oX}" y="${y}" width="${oW}" height="${oH}" rx="12" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
    <rect x="${oX}" y="${y}" width="6" height="${oH}" rx="3" fill="${C.rose}"/>
    <text x="${oX + 28}" y="${cy - 6}" font-size="14" font-weight="700" fill="${C.dark}">If: ${r.situation}</text>
    <text x="${oX + 28}" y="${cy + 16}" font-size="12.5" fill="${C.muted}">&#8594; ${r.path}</text>`;
}).join("\n  ");
const SVG_OPTIONS = esc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 408" ${FF}>
  <rect width="900" height="408" rx="16" fill="${C.ivory}"/>
  <text x="450" y="42" text-anchor="middle" font-size="19" font-weight="700" fill="${C.dark}">Treatment Options After 45 — Based on Your Reports</text>
  <text x="450" y="66" text-anchor="middle" font-size="12.5" fill="${C.muted}">We test first, then choose the path with the highest chance</text>
  ${optEls}
</svg>`);

/* ── Infographic B: Prep for a healthy pregnancy after 45 (2-panel) ── */
const doList = [
  "Protein ~1.2 g/kg body weight, daily",
  "Low-GI carbs — jowar, bajra, brown rice",
  "Folate 5 mg, starting 3 months before",
  "30-min walk + prenatal yoga; sleep 8 hrs",
];
const avoidList = [
  "White rice, maida, sugar (miscarriage risk)",
  "Alcohol, smoking, packaged food",
  "Papaya, pineapple, ajinomoto in pregnancy",
  "Excess salt, pickles, papad (BP risk)",
];
const panW = 414, panX1 = 24, panX2 = 462, hY = 92, hH = 40, bY0 = 152, bStep = 36;
function bullets(items: string[], x: number, tick: "check" | "cross") {
  return items.map((t, i) => {
    const y = bY0 + i * bStep;
    const mark = tick === "check"
      ? `<circle cx="${x + 30}" cy="${y - 4}" r="9" fill="${C.rose}"/><path d="M ${x + 26} ${y - 4} l 3 3 l 5 -6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<circle cx="${x + 30}" cy="${y - 4}" r="9" fill="none" stroke="${C.muted}" stroke-width="1.5"/><path d="M ${x + 26} ${y - 8} l 8 8 m 0 -8 l -8 8" stroke="${C.muted}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    return `${mark}<text x="${x + 48}" y="${y}" font-size="12.5" fill="${C.dark}">${t}</text>`;
  }).join("\n  ");
}
const SVG_PREP = esc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 348" ${FF}>
  <rect width="900" height="348" rx="16" fill="${C.ivory}"/>
  <text x="450" y="42" text-anchor="middle" font-size="19" font-weight="700" fill="${C.dark}">Prep for a Healthy Pregnancy After 45</text>
  <text x="450" y="66" text-anchor="middle" font-size="12.5" fill="${C.muted}">Start 3 months before — diet and lifestyle cut your risks by half</text>
  <rect x="${panX1}" y="${hY - 6}" width="${panW}" height="264" rx="12" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <rect x="${panX2}" y="${hY - 6}" width="${panW}" height="264" rx="12" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <rect x="${panX1}" y="${hY - 6}" width="${panW}" height="${hH}" rx="12" fill="${C.rose}"/>
  <rect x="${panX1}" y="${hY + 12}" width="${panW}" height="16" fill="${C.rose}"/>
  <text x="${panX1 + panW / 2}" y="${hY + 19}" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}" letter-spacing="0.5">DO</text>
  <rect x="${panX2}" y="${hY - 6}" width="${panW}" height="${hH}" rx="12" fill="${C.tint}"/>
  <rect x="${panX2}" y="${hY + 12}" width="${panW}" height="16" fill="${C.tint}"/>
  <text x="${panX2 + panW / 2}" y="${hY + 19}" text-anchor="middle" font-size="14" font-weight="700" fill="${C.muted}" letter-spacing="0.5">AVOID</text>
  ${bullets(doList, panX1, "check")}
  ${bullets(avoidList, panX2, "cross")}
</svg>`);

/* ── Infographic C: Risks after 45 & how we lower them (row comparison) ── */
const riskRows = [
  { label: "Miscarriage", risk: "50%+ with own eggs", fix: "10–15% with donor + PGT-A" },
  { label: "Down syndrome", risk: "~1 in 30 at age 45", fix: "Same as a 30-year-old*" },
  { label: "BP & diabetes", risk: "3–4× more common", fix: "Controlled with monitoring" },
  { label: "Delivery", risk: "~80% C-section", fix: "Managed by high-risk team" },
];
const rLX = 24, rC1X = 236, rC1W = 300, rC2X = 548, rC2W = 328;
const rRowH = 54, rRowY0 = 138;
const riskEls = riskRows.map((r, i) => {
  const y = rRowY0 + i * rRowH;
  const bg = i % 2 === 1 ? `<rect x="${rLX}" y="${y}" width="${rC2X + rC2W - rLX}" height="${rRowH}" rx="8" fill="${C.tint}"/>` : "";
  const my = y + rRowH / 2 + 4;
  return `${bg}
    <text x="${rLX + 14}" y="${my}" font-size="13" font-weight="700" fill="${C.dark}">${r.label}</text>
    <text x="${rC1X + rC1W / 2}" y="${my}" text-anchor="middle" font-size="12.5" fill="${C.muted}">${r.risk}</text>
    <text x="${rC2X + rC2W / 2}" y="${my}" text-anchor="middle" font-size="12.5" font-weight="600" fill="${C.dark}">${r.fix}</text>`;
}).join("\n  ");
const SVG_RISKS = esc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 392" ${FF}>
  <rect width="900" height="392" rx="16" fill="${C.ivory}"/>
  <text x="450" y="42" text-anchor="middle" font-size="19" font-weight="700" fill="${C.dark}">Risks After 45 — and How We Lower Them</text>
  <text x="450" y="66" text-anchor="middle" font-size="12.5" fill="${C.muted}">Higher risks, but manageable with the right plan</text>
  <rect x="${rC1X}" y="92" width="${rC1W}" height="34" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="${rC1X + rC1W / 2}" y="114" text-anchor="middle" font-size="13" font-weight="700" fill="${C.muted}">Risk after 45</text>
  <rect x="${rC2X}" y="92" width="${rC2W}" height="34" rx="8" fill="${C.rose}"/>
  <text x="${rC2X + rC2W / 2}" y="114" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">How we lower it</text>
  ${riskEls}
  <text x="450" y="378" text-anchor="middle" font-size="11" fill="${C.muted}">* With PGT-A tested embryos or donor eggs.</text>
</svg>`);

/* ── Build content ────────────────────────────────────────────────── */
const children: unknown[] = [];

children.push(
  block("statStrip", {
    items: [
      { id: wid(), value: "3 months", label: "Prep before pregnancy" },
      { id: wid(), value: "Under 5%", label: "Own-egg chance/cycle if AMH is very low" },
      { id: wid(), value: "10–15%", label: "Miscarriage risk with donor eggs + PGT-A" },
      { id: wid(), value: "BMI 19–25", label: "Healthy weight target before pregnancy" },
    ],
  }),
  block("highlightCard", {
    badge: "Pregnancy After 45",
    icon: "CalendarCheck",
    color: "rose",
    tagline: "Pregnancy after 45 is possible — but it needs planning, not guesswork.",
    facts: [
      { id: wid(), label: "Our first step", value: "Test, then decide" },
      { id: wid(), label: "Key lab for 40+", value: "PGT-A" },
      { id: wid(), label: "Pregnancy care", value: "High-risk unit" },
      { id: wid(), label: "If own eggs won't work", value: "Screened donor program" },
    ],
    bestSuitedFor: "Women aged 45+ who want a clear, honest plan — a full fertility and pregnancy-safety checkup that tells you whether your own eggs can work, or whether donor eggs are safer, with a team that manages you from conception to delivery.",
  }),
);

children.push(
  para([T("At Bavishi Fertility Institute, we don't say \"IVF is for everyone\" or \"donor egg is your only option.\" "), T("We test first, then decide.", true), T(" After 45, time is critical — so the goal is to move to the treatment with the highest chance, fastest, and to keep both mother and baby safe.")]),
);

// Step 1
children.push(
  heading("h2", "Step 1: Complete testing for both partners"),
  para("Before any decision, we build a full picture of your fertility and your overall health."),
  list("ul", [
    [T("For you: ", true), T("AMH, FSH, LH and Estradiol on Day 2–3 to check ovarian reserve, plus thyroid, prolactin, Vitamin D, B12, HbA1c (sugar), BP, ECG and a 3D sonography of the uterus.")],
    [T("For your husband: ", true), T("semen analysis plus a DNA fragmentation test — male age affects embryo quality too.")],
    [T("Uterus check: ", true), T("a hysteroscopy if needed to confirm the uterus is normal. Fibroids, polyps or a thin lining must be treated first.")],
  ]),
);

// Step 2
children.push(
  heading("h2", "Step 2: Treatment options based on your reports"),
  para("Your reports — not your age alone — decide the plan. Here's how we match treatment to what we find."),
  block("infographic", {
    title: "Treatment Options After 45",
    svgContent: SVG_OPTIONS,
    altText: "How Bavishi Fertility Institute chooses treatment after 45, based on your reports. If AMH is decent and you are still ovulating, we consider one to two cycles of ICSI with your own eggs plus PGT-A testing of embryos. If AMH is very low or FSH is high, we consider donor-egg ICSI, the most successful option after 45. If there are fibroids, polyps or a thin lining, we treat the uterus first, and consider surrogacy if it cannot carry safely. If there is BP, diabetes or a heart issue, we involve a physician first and then care for you with our high-risk pregnancy team.",
    caption: "After 45 we don't waste time with IUI or 'try naturally for 6 months.' We move to the treatment with the highest chance, fastest.",
  }),
);

// Step 3 diet & lifestyle
children.push(
  heading("h2", "Diet and lifestyle: your 3-month prep"),
  para("Your diet now supports two things: egg and embryo quality before pregnancy, and your baby's growth during pregnancy. Starting about three months before, these changes genuinely reduce your risks."),
  block("infographic", {
    title: "Prep for a Healthy Pregnancy After 45",
    svgContent: SVG_PREP,
    altText: "A two-panel prep guide for a healthy pregnancy after 45. Do: eat about 1.2 grams of protein per kilogram of body weight daily; choose low-GI carbs like jowar, bajra and brown rice; take folate 5 milligrams starting three months before; and do a 30-minute walk plus prenatal yoga while sleeping eight hours. Avoid: white rice, maida and sugar because of miscarriage risk; alcohol, smoking and packaged food; papaya, pineapple and ajinomoto during pregnancy; and excess salt, pickles and papad because of BP risk.",
    caption: "Diet and lifestyle are not optional after 45 — they can reduce your risks by roughly half.",
  }),
  heading("h3", "Before pregnancy: 3-month prep"),
  list("ul", [
    [T("Protein ~1.2 g/kg: ", true), T("eggs, dal, paneer, curd, chicken, fish — extra protein supports embryo development.")],
    [T("Low-GI carbs only: ", true), T("jowar, bajra, ragi roti; brown rice, quinoa, daliya. Stop white rice, maida and sugar — high sugar means high miscarriage risk after 40.")],
    [T("Healthy fats and colour: ", true), T("ghee, walnuts, almonds, flax seeds, olive oil; plus palak, beetroot, carrot, tomato, pomegranate and orange for antioxidants that protect egg DNA.")],
    [T("Folate 5 mg: ", true), T("a higher dose than younger women, started 3 months before, to prevent birth defects.")],
  ]),
  heading("h3", "During pregnancy: first-trimester focus"),
  list("ul", [
    [T("Small, frequent meals ", true), T("every 2–3 hours to manage nausea; dry khakhra, roasted chana, fruit.")],
    [T("Extra iron and calcium ", true), T("(palak, dates, rajma, sesame) plus prescribed supplements — anemia risk is higher after 40.")],
    [T("Hydration: ", true), T("2.5–3 litres of water daily; dehydration can cause preterm contractions.")],
    [T("Avoid ", true), T("papaya, pineapple and ajinomoto, and control salt to protect against high BP.")],
  ]),
  heading("h3", "Lifestyle essentials"),
  para("Keep your BMI in the 19–25 range, walk 30 minutes daily with prenatal yoga, sleep 8 hours, and manage stress through counselling or meditation. Expect more scans and blood tests than a 25-year-old — NT scan, anomaly scan, growth scans, sugar and BP checks — and never self-medicate; ask us before taking anything."),
);

// Step 4 risks
children.push(
  heading("h2", "Risks to know — so you can prevent them"),
  para("We tell every patient this honestly. After 45 these risks are higher, but they are manageable with good care."),
  block("infographic", {
    title: "Risks After 45 and How We Lower Them",
    svgContent: SVG_RISKS,
    altText: "Risks after 45 and how Bavishi Fertility Institute lowers them. Miscarriage risk is over 50 percent with your own eggs, dropping to 10 to 15 percent with donor eggs plus PGT-A. Down syndrome risk is about 1 in 30 at age 45, but with PGT-A tested embryos or donor eggs it is the same as a 30-year-old. BP and diabetes are 3 to 4 times more common but are controlled with monitoring. Delivery is by C-section in about 80 percent of cases, managed by the high-risk team.",
    caption: "The good news: with a high-risk pregnancy specialist, diet control and regular monitoring, most women 45+ deliver healthy babies.",
  }),
);

// Step 5 why BFI
children.push(
  heading("h2", "Why choose BFI after 45"),
  list("ul", [
    [T("Honest diagnosis: ", true), T("we tell you clearly if your own eggs can work, or if donor eggs are safer — no false hopes, no time wasted.")],
    [T("PGT-A lab: ", true), T("we test embryos for chromosomes, which is essential after 40 to reduce miscarriage.")],
    [T("High-risk pregnancy unit: ", true), T("from conception to delivery, our obstetric team, physician and dietician manage you.")],
    [T("Screened donor program and emotional support: ", true), T("rigorous donor screening with feature matching, and counsellors with you at every step.")],
  ]),
);

// Conclusion + CTA
children.push(
  block("conclusionPanel", {
    headline: "The BFI message for you",
    points: [
      { id: wid(), icon: "CalendarCheck", text: "Pregnancy after 45 is possible, but it needs planning — don't compare yourself with a 30-year-old." },
      { id: wid(), icon: "ClipboardCheck", text: "We choose treatment based on your tests: own eggs + PGT-A if reports allow, donor eggs if they give the best chance." },
      { id: wid(), icon: "HeartPulse", text: "Control BP, sugar and weight before pregnancy. A healthy mother means a healthy baby." },
      { id: wid(), icon: "Leaf", text: "Diet and lifestyle are not optional — started early, they reduce your risks by about half." },
      { id: wid(), icon: "ShieldCheck", text: "Don't wait and Google, and don't believe 'miracle' stories online — come in for a proper checkup." },
    ],
  }),
  block("inlineCta", {
    accent: "rose",
    headline: "45+ and want a baby? Start with a proper checkup.",
    subtext: "Come to Bavishi Fertility Institute for a complete 'Fertility + Pregnancy Safety Checkup.' We'll check your eggs, uterus and overall health, then give you a clear plan — with your own eggs, or with donor eggs if that's safest.",
    buttons: [
      { id: wid(), label: "Book a Consultation", url: "https://wa.me/919099020202", variant: "primary" },
      { id: wid(), label: "About IVF at BFI", url: "/what-is-ivf", variant: "secondary" },
    ],
  }),
);

const contentRaw = JSON.stringify({
  root: { type: "root", format: "", indent: 0, version: 1, direction: "ltr", children },
});

const now = new Date().toISOString();
const doc = {
  _id: "blog-pg-283",
  _type: "blog",
  pgId: 283,
  title: "How to Choose the Right Treatment After 45 — BFI's Approach",
  slug: "how-to-choose-the-right-treatment-after-45",
  excerpt:
    "Pregnancy after 45 is possible, but it needs planning. Here's how Bavishi Fertility Institute tests first and then chooses between your own eggs with PGT-A or donor eggs — plus the diet, lifestyle and risk management that make it safe.",
  status: "published",
  heroImageUrl: null as string | null,
  heroImageAlt: "A woman over 45 discussing her fertility and pregnancy-safety plan with her specialist at Bavishi Fertility Institute",
  heroTextDark: false,
  heroImagePosition: "center center",
  contentRaw,
  authorSlug: "parth-bavishi-author",
  authorName: "Dr. Parth Bavishi",
  authorRole: "Co-director & IVF Specialist",
  authorCredentials: "MBBS, MD (Obstetrics & Gynaecology)",
  authorAvatarUrl: "https://h2qr1wdfdqrccu6j.public.blob.vercel-storage.com/parth.webp",
  authorBioText:
    "Dr. Parth Bavishi holds an MD in Obstetrics and Gynaecology and brings over 12 years of specialist experience as Co-director and IVF Specialist at Bavishi Fertility Institute — a group of fertility centres across India committed to helping couples realise their dream of parenthood. His clinical focus is on complex and challenging cases, including male-factor infertility and repeated IVF failure. He has received specialised infertility training at Bavishi Fertility Institute, the Diamond Institute (USA) and the HART Institute (Japan), and is the author of 'Your Miracle in Making: A Couple's Guide to Pregnancy.'",
  reviewerSlug: "dr-himanshu-bavishi",
  reviewerName: "Dr. Himanshu Bavishi",
  reviewerRole: "Director & IVF Specialist",
  reviewerCredentials: "MBBS, MD (Obstetrics & Gynaecology), DNB",
  reviewerAvatarUrl: null,
  categoryTitle: "IVF",
  categorySlug: "ivf",
  readMins: "8",
  publishedAt: now,
  lastUpdatedAt: now,
  treatmentSlugs: ["ivf", "icsi", "egg-donation", "pgt"],
  locationSlugs: null,
  faqs: [
    { question: "Can I get pregnant after 45 with my own eggs?", answer: "Sometimes, yes — it depends on your reports, not just your age. If your AMH is decent and you are still ovulating, we may try 1–2 cycles of ICSI with your own eggs plus PGT-A testing of embryos. If AMH is very low or FSH is high, the chance per cycle with your own eggs is under 5%, and donor-egg ICSI becomes the most successful option." },
    { question: "Why is PGT-A so important after 45?", answer: "After 45, most miscarriages happen because of chromosome problems in the embryo. PGT-A checks that an embryo has the correct chromosomes before transfer, which is why it is essentially standard after 40 — it reduces miscarriage risk and, with tested embryos or donor eggs, brings the Down syndrome risk down to that of a 30-year-old." },
    { question: "Is it safe to be pregnant after 45?", answer: "Risks such as miscarriage, high BP, gestational diabetes and C-section are higher after 45, but they are manageable. With a high-risk pregnancy specialist, diet and weight control, and regular monitoring, most women 45+ deliver healthy babies. That's why we manage your health before and throughout pregnancy." },
    { question: "How early should I start preparing my diet and lifestyle?", answer: "About three months before trying, because that is roughly how long eggs and embryo quality take to respond. Focus on protein, low-GI carbs, healthy fats, antioxidants and folate 5 mg, keep your BMI between 19 and 25, and stop alcohol, smoking and packaged food. Good preparation can cut your risks by about half." },
    { question: "Should I try IUI or wait a few months after 45?", answer: "No. After 45, time is critical, so we don't recommend IUI or 'trying naturally for six months.' We complete testing quickly and move straight to the treatment with the highest chance of success and the greatest safety for mother and baby." },
  ],
  seoMetaTitle: "How to Choose the Right Treatment After 45 | Bavishi Fertility Institute",
  seoMetaDescription:
    "Pregnancy after 45? Learn how Bavishi Fertility Institute tests first, then chooses between own eggs with PGT-A or donor eggs, plus the diet, lifestyle and risk management that keep mother and baby safe.",
  seoOgTitle: null,
  seoOgDescription: null,
  seoOgImageUrl: null,
};

const HERO_DIR = "public/blog-media/specific blog images/";

async function main() {
  const clash = await sanity.fetch(`*[_type=="blog" && slug==$s && _id!=$id]{_id}`, { s: doc.slug, id: doc._id });
  if (clash.length) throw new Error(`Slug already used by ${JSON.stringify(clash)}`);

  const blockCount = children.filter((n) => (n as { type?: string }).type === "block").length;
  const infoCount = children.filter((n) => (n as { fields?: { blockType?: string } }).fields?.blockType === "infographic").length;
  console.log(`content nodes: ${children.length}, blocks: ${blockCount}, infographics: ${infoCount}, contentRaw chars: ${contentRaw.length}`);

  if (DRY) {
    const { writeFileSync } = await import("node:fs");
    writeFileSync("scratch_blogzips/a45-options.svg", SVG_OPTIONS);
    writeFileSync("scratch_blogzips/a45-prep.svg", SVG_PREP);
    writeFileSync("scratch_blogzips/a45-risks.svg", SVG_RISKS);
    console.log("[dry-run] wrote 3 SVGs to scratch_blogzips/");
    console.log("[dry-run] would createOrReplace", doc._id, doc.slug);
    return;
  }

  // Hero: match any file in HERO_DIR that starts with "How to Choose the Right Treatment After 45"
  const { readFileSync, readdirSync } = await import("node:fs");
  const files = readdirSync(HERO_DIR);
  const heroFile = files.find((f) => (/^How to Choose the Right Treatment After 45/i.test(f) || /mid-40s sitting in a bright, modern fertility clinic/i.test(f)) && /\.(png|jpg|jpeg|webp)$/i.test(f));
  if (heroFile) {
    const asset = await sanity.assets.upload("image", readFileSync(HERO_DIR + heroFile), { filename: "treatment-after-45-hero.png" });
    doc.heroImageUrl = asset.url;
    console.log(`[ok] hero uploaded from "${heroFile}" → ${asset.url}`);
  } else {
    console.log(`[warn] no hero found in ${HERO_DIR} matching "How to Choose the Right Treatment After 45*" — publishing WITHOUT hero (gradient fallback).`);
  }

  await sanity.createOrReplace(doc);
  console.log(`[ok] created ${doc._id} → /blogs/${doc.slug}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
