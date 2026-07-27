/* =====================================================================
 * Create NEW blog: "Why Dr. Himanshu Bavishi is the Best IVF Specialist
 * in Ahmedabad & India: The BAVISHI Difference" (from client Word doc).
 * Tone kept as written per user decision. Category Ahmedabad.
 * Light-rose SVG system, 3 infographics.
 *   _id: blog-pg-284  slug: why-dr-himanshu-bavishi-is-the-best-ivf-specialist-in-ahmedabad-and-india
 *
 * Run:
 *   npx tsx --env-file=.env.local --tsconfig tsconfig.json \
 *     scripts/create-blog-himanshu-bavishi.mts [--dry-run]
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

/* ── Infographic 1: World-class lab technology (accent-bar, 4) ─────── */
const labRows = [
  { title: "ISO 7 Cleanroom IVF Labs", desc: "HEPA filters, positive pressure and a VOC-free environment — international standards." },
  { title: "Time-Lapse EmbryoScope & GERI", desc: "A photo of your embryo every 10 minutes — best-embryo selection by data, not guesswork." },
  { title: "RI Witness System", desc: "Electronic witnessing at every step — no chance of a sample mix-up." },
  { title: "Advanced Andrology & PGT Lab", desc: "In-house sperm DNA testing, microfluidics and PGT-A for embryos." },
];
const lH = 66, lGap = 12, lY0 = 96, lX = 24, lW = 852;
const labEls = labRows.map((r, i) => {
  const y = lY0 + i * (lH + lGap);
  const cy = y + lH / 2;
  return `
    <rect x="${lX}" y="${y}" width="${lW}" height="${lH}" rx="12" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
    <rect x="${lX}" y="${y}" width="6" height="${lH}" rx="3" fill="${C.rose}"/>
    <circle cx="${lX + 46}" cy="${cy}" r="18" fill="${C.rose}"/>
    <text x="${lX + 46}" y="${cy + 5}" text-anchor="middle" font-size="15" font-weight="700" fill="${C.white}">${i + 1}</text>
    <text x="${lX + 82}" y="${cy - 6}" font-size="15" font-weight="700" fill="${C.dark}">${r.title}</text>
    <text x="${lX + 82}" y="${cy + 16}" font-size="12.5" fill="${C.muted}">${r.desc}</text>`;
}).join("\n  ");
const SVG_LABS = esc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 408" ${FF}>
  <rect width="900" height="408" rx="16" fill="${C.ivory}"/>
  <text x="450" y="42" text-anchor="middle" font-size="19" font-weight="700" fill="${C.dark}">World-Class IVF Labs — The Heart of Success</text>
  <text x="450" y="66" text-anchor="middle" font-size="12.5" fill="${C.muted}">IVF success is 70% lab quality — so BAVISHI invests in the best</text>
  ${labEls}
</svg>`);

/* ── Infographic 2: Transparent success rates (stat cards, 4) ──────── */
const rateCards = [
  { value: "55–65%", label: ["Overall IVF, per", "transfer (under 35)"] },
  { value: "70–75%", label: ["Donor-egg", "cycle"] },
  { value: "65–70%", label: ["PGT-A transfer,", "age 38–42"] },
  { value: "30,000+", label: ["Live births", "since 1999"] },
];
const rcW = 198, rcGap = 20, rcX0 = 24, rcY = 100, rcH = 132;
const rateEls = rateCards.map((c, i) => {
  const x = rcX0 + i * (rcW + rcGap);
  const cx = x + rcW / 2;
  const labels = c.label.map((ln, li) => `<text x="${cx}" y="${rcY + 86 + li * 19}" text-anchor="middle" font-size="12.5" fill="${C.muted}">${ln}</text>`).join("\n    ");
  return `
    <rect x="${x}" y="${rcY}" width="${rcW}" height="${rcH}" rx="12" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
    <rect x="${x}" y="${rcY}" width="${rcW}" height="5" rx="2.5" fill="${C.rose}"/>
    <text x="${cx}" y="${rcY + 58}" text-anchor="middle" font-size="30" font-weight="800" fill="${C.rose}">${c.value}</text>
    ${labels}`;
}).join("\n  ");
const SVG_RATES = esc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 272" ${FF}>
  <rect width="900" height="272" rx="16" fill="${C.ivory}"/>
  <text x="450" y="42" text-anchor="middle" font-size="19" font-weight="700" fill="${C.dark}">Transparent, Evidence-Based Success Rates</text>
  <text x="450" y="66" text-anchor="middle" font-size="12.5" fill="${C.muted}">Honest numbers, not marketing — success still depends on age, AMH & history</text>
  ${rateEls}
</svg>`);

/* ── Infographic 3: 10 BAVISHI centres (chip grid) ─────────────────── */
type Chip = { label: string };
function chipRow(labels: string[], y: number) {
  // flow chips left-to-right within x 24..876, wrapping rows
  const maxX = 876, x0 = 24, ch = 34, gap = 12, rowGap = 12;
  let cx = x0, cy = y;
  const out: string[] = [];
  for (const label of labels) {
    const w = Math.round(label.length * 7.4) + 40;
    if (cx + w > maxX) { cx = x0; cy += ch + rowGap; }
    out.push(`
    <rect x="${cx}" y="${cy}" width="${w}" height="${ch}" rx="17" fill="${C.tint}" stroke="${C.rose}" stroke-width="1.2"/>
    <circle cx="${cx + 17}" cy="${cy + ch / 2}" r="3.5" fill="${C.rose}"/>
    <text x="${cx + 28}" y="${cy + ch / 2 + 4.5}" font-size="12.5" font-weight="600" fill="${C.dark}">${label}</text>`);
    cx += w + gap;
  }
  return { svg: out.join("\n  "), endY: cy + ch };
}
const ahm = chipRow(["Paldi (Main)", "SBR – Sindhu Bhawan", "Nikol"], 116);
const other = chipRow(["Bhavnagar", "Surat", "Vadodara", "Anand", "Varanasi", "Mumbai", "Bhuj"], ahm.endY + 52);
const cityH = other.endY + 24;
const SVG_CENTRES = esc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 ${cityH}" ${FF}>
  <rect width="900" height="${cityH}" rx="16" fill="${C.ivory}"/>
  <text x="450" y="42" text-anchor="middle" font-size="19" font-weight="700" fill="${C.dark}">10 BAVISHI Centres Across India</text>
  <text x="450" y="66" text-anchor="middle" font-size="12.5" fill="${C.muted}">Same protocols, same lab standards, same ethics — everywhere</text>
  <text x="24" y="104" font-size="12" font-weight="700" fill="${C.rose}" letter-spacing="0.5">IN AHMEDABAD — 3 BRANCHES</text>
  ${ahm.svg}
  <text x="24" y="${ahm.endY + 40}" font-size="12" font-weight="700" fill="${C.rose}" letter-spacing="0.5">OTHER CITIES</text>
  ${other.svg}
</svg>`);

/* ── Build content ────────────────────────────────────────────────── */
const children: unknown[] = [];

children.push(
  block("statStrip", {
    items: [
      { id: wid(), value: "25+ yrs", label: "IVF experience since 1999" },
      { id: wid(), value: "30,000+", label: "IVF babies delivered" },
      { id: wid(), value: "10", label: "BAVISHI centres" },
      { id: wid(), value: "15+", label: "Personalised IVF protocols" },
    ],
  }),
  block("highlightCard", {
    badge: "Dr. Himanshu Bavishi",
    icon: "Award",
    color: "rose",
    tagline: "Owner & Director, Bavishi Fertility Institute — 25+ years, 30,000+ IVF babies.",
    facts: [
      { id: wid(), label: "Role", value: "Director & IVF Specialist" },
      { id: wid(), label: "Qualifications", value: "MBBS, DGO + intl. training" },
      { id: wid(), label: "Trained in", value: "Germany & Singapore" },
      { id: wid(), label: "Also serves as", value: "National & intl. faculty" },
    ],
    bestSuitedFor: "Couples who want an experienced, ethical IVF specialist — someone who tells you honestly whether IUI, surgery or even natural conception is possible before suggesting IVF, backed by world-class labs.",
  }),
);

children.push(
  para("Choosing the right IVF doctor is the biggest decision in your fertility journey. In Ahmedabad and across India, thousands of couples trust one name — Dr. Himanshu Bavishi, Owner & Director of Bavishi Fertility Institute."),
  para([T("With 25+ years of experience and 30,000+ IVF babies, he has set the benchmark for ethical, advanced and result-oriented fertility care. ", true), T("Here's the BAVISHI difference.")]),
);

// Section 1
children.push(
  heading("h2", "Who is Dr. Himanshu Bavishi? — experience that matters"),
  list("ul", [
    [T("25+ years of dedicated IVF practice: ", true), T("Dr. Bavishi began his IVF journey in 1999 — one of the earliest IVF specialists in Gujarat, who has seen the technology evolve from the very beginning and helped shape it in Western India.")],
    [T("30,000+ IVF babies delivered: ", true), T("not just a number — 30,000 families who came with hope and went home with a baby, across the simplest to the most complex cases: repeated IVF failures, low AMH, severe male factor, donor cycles and high-risk pregnancies.")],
    [T("Academic & international training: ", true), T("MBBS, DGO, and advanced training in Assisted Reproductive Technology from Germany and Singapore. He is invited as faculty at national and international IVF conferences to train other doctors.")],
    [T("A diagnosis-first approach: ", true), T("his core principle is \"Don't do IVF because you can. Do it because the patient needs it.\" He is known for honest counselling — telling patients if IUI, surgery or even natural conception is possible before suggesting IVF.")],
  ]),
);

// Section 2
children.push(
  heading("h2", "The BAVISHI difference: world-class IVF labs"),
  para("Dr. Bavishi's vision reflects in every part of Bavishi Fertility Institute. IVF success is roughly 70% lab quality — which is why the lab is where BAVISHI invests the most."),
  block("infographic", {
    title: "World-Class IVF Labs",
    svgContent: SVG_LABS,
    altText: "Bavishi Fertility Institute's world-class IVF labs. One, ISO 7 cleanroom IVF labs with HEPA filters, positive pressure and a VOC-free environment to international standards. Two, Time-Lapse EmbryoScope and GERI incubators that take a photo of the embryo every 10 minutes for best-embryo selection by data. Three, the RI Witness electronic witnessing system at every step so there is no chance of a sample mix-up. Four, an advanced andrology and PGT lab with in-house sperm DNA testing, microfluidics and PGT-A.",
    caption: "Embryos are sensitive — these labs are built to protect them and to select the best embryo by data.",
  }),
  heading("h3", "Unmatchable techniques & technology"),
  list("ul", [
    [T("Personalised IVF protocols: ", true), T("no 'one protocol for all' — stimulation is designed around your AMH, age and past response, with 15+ protocols for different cases.")],
    [T("ERA, ALICE & EMMA tests: ", true), T("for repeated implantation failure, we test the uterine lining's receptivity and infection, then transfer only when the uterus is 'ready.'")],
    [T("Micro-TESE for zero sperm: ", true), T("microscopic surgery to find sperm in the testis for men with no sperm in semen — sperm retrieved in 60%+ of cases.")],
    [T("Fertility preservation: ", true), T("egg, sperm and embryo freezing with vitrification and 95%+ survival — for cancer patients and women delaying pregnancy.")],
  ]),
  heading("h3", "A team that cares — not just machines"),
  list("ul", [
    [T("Senior embryologists: ", true), T("the lab is led by ESHRE-certified embryologists with 15+ years' experience who handle your embryos themselves.")],
    [T("Dedicated high-risk pregnancy unit: ", true), T("from positive test to delivery, in-house obstetricians, physicians and dieticians manage you — IVF pregnancy after 40 is routine here.")],
    [T("In-house counselling & support: ", true), T("full-time counsellors for stress management, because IVF is emotional as well as medical.")],
  ]),
);

// Section 3 success rates
children.push(
  heading("h2", "Transparent, evidence-based success rates"),
  para("We believe success rates should be honest, not marketing. Here are ours."),
  block("infographic", {
    title: "Our Success Rates",
    svgContent: SVG_RATES,
    altText: "Bavishi Fertility Institute's success rates. Overall IVF success is 55 to 65 percent per embryo transfer for women under 35. Donor-egg cycles are 70 to 75 percent per cycle. PGT-A tested embryo transfers are 65 to 70 percent for women aged 38 to 42. And there have been over 30,000 live births since 1999.",
    caption: "Comparable to top US and Europe clinics — but success still depends on your age, AMH and medical history.",
  }),
  quote("Success rates vary based on individual medical conditions. A detailed consultation with Dr. Himanshu Bavishi is necessary to understand your personal prognosis — he explains your real chance in the first meeting itself. No false promises."),
);

// Section 4 branches
children.push(
  heading("h2", "10 BAVISHI centres — care near you"),
  para("To make world-class IVF accessible, Bavishi Fertility Institute has centres across Gujarat and beyond."),
  block("infographic", {
    title: "BAVISHI Centres Across India",
    svgContent: SVG_CENTRES,
    altText: "Bavishi Fertility Institute has 10 centres. In Ahmedabad there are three branches: Paldi (the main centre), SBR at Sindhu Bhawan, and Nikol. Other cities are Bhavnagar, Surat, Vadodara, Anand, Varanasi, Mumbai and Bhuj.",
    caption: "All branches follow the same protocols, lab standards and ethics — your reports and plan are reviewed centrally, so you get BAVISHI quality at every location.",
  }),
);

// Section 5 why patients choose
children.push(
  heading("h2", "Why patients across India choose Dr. Himanshu Bavishi"),
  list("ul", [
    [T("He treats the couple, not the reports: ", true), T("he sits for 30–45 minutes in the first visit, studies past failures, orders only the tests needed, and explains why pregnancy hasn't happened. Patients say, \"the first doctor who actually listened.\"")],
    [T("No over-treatment: ", true), T("if your AMH is good and tubes are open, he'll try IUI first; if you're 42 with low AMH, he'll honestly advise donor egg. He saves your time and money.")],
    [T("Handles complicated cases: ", true), T("failed 5–6 IVFs elsewhere, severe PCOS, thin lining, zero sperm — these are the cases referred to him from all over India.")],
    [T("Ethical & transparent: ", true), T("fixed-cost IVF packages, no hidden charges, no 'add-on' pressure — what you pay is explained on Day 1.")],
    [T("Available & accessible: ", true), T("despite 25 years' experience, he still does consultations, scans and pickups himself, and patients have access to the team for emergencies.")],
  ]),
);

// Conclusion + CTA
children.push(
  block("conclusionPanel", {
    headline: "The BAVISHI promise — more than just IVF",
    points: [
      { id: wid(), icon: "Microscope", text: "We invest in technology before it becomes common in India, and train our team to international standards." },
      { id: wid(), icon: "Stethoscope", text: "We keep expanding across 10 centres, so you don't have to travel far for quality care." },
      { id: wid(), icon: "ClipboardCheck", text: "We tell you the truth — even if it's not what you want to hear — with a diagnosis-first, no-over-treatment approach." },
      { id: wid(), icon: "Award", text: "30,000+ babies, multiple centres, 25 years, one name you can trust." },
      { id: wid(), icon: "Sparkles", text: "Because at BAVISHI, we don't just do IVF — we create families." },
    ],
  }),
  block("inlineCta", {
    accent: "rose",
    headline: "Struggling with infertility? Don't lose hope — meet Dr. Himanshu Bavishi.",
    subtext: "Get a clear diagnosis, understand your real chances, and start treatment with the best lab and doctor by your side. Book your consultation at your nearest BAVISHI centre.",
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
  _id: "blog-pg-284",
  _type: "blog",
  pgId: 284,
  title: "Why Dr. Himanshu Bavishi is the Best IVF Specialist in Ahmedabad & India: The BAVISHI Difference",
  slug: "why-dr-himanshu-bavishi-is-the-best-ivf-specialist-in-ahmedabad-and-india",
  excerpt:
    "With 25+ years of experience and 30,000+ IVF babies, Dr. Himanshu Bavishi has set the benchmark for ethical, advanced and result-oriented fertility care. Here's the BAVISHI difference — the doctor, the labs, the success rates and the 10 centres across India.",
  status: "published",
  heroImageUrl: null as string | null,
  heroImageAlt: "Dr. Himanshu Bavishi, Director & IVF Specialist at Bavishi Fertility Institute",
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
  reviewerSlug: null,
  reviewerName: null,
  reviewerRole: null,
  reviewerCredentials: null,
  reviewerAvatarUrl: null,
  categoryTitle: "Ahmedabad",
  categorySlug: "ahmedabad",
  readMins: "8",
  publishedAt: now,
  lastUpdatedAt: now,
  treatmentSlugs: ["ivf", "icsi"],
  locationSlugs: null,
  faqs: [
    { question: "How experienced is Dr. Himanshu Bavishi?", answer: "Dr. Himanshu Bavishi has 25+ years of dedicated IVF practice, having started in 1999 as one of the earliest IVF specialists in Gujarat. He has delivered 30,000+ IVF babies and is invited as faculty at national and international IVF conferences." },
    { question: "What is Dr. Bavishi's approach to IVF?", answer: "Diagnosis-first. His core principle is 'Don't do IVF because you can. Do it because the patient needs it.' He counsels honestly — telling patients if IUI, surgery or even natural conception is possible before suggesting IVF — and avoids over-treatment." },
    { question: "What are the success rates at Bavishi Fertility Institute?", answer: "Overall IVF success is 55–65% per embryo transfer for women under 35; donor-egg cycles are 70–75%; and PGT-A tested embryo transfers are 65–70% for women aged 38–42, with 30,000+ live births since 1999. Success rates vary with individual medical conditions, so a detailed consultation is needed to understand your personal prognosis." },
    { question: "How many BAVISHI centres are there, and where?", answer: "There are 10 centres. In Ahmedabad there are 3 branches — Paldi (main), SBR at Sindhu Bhawan, and Nikol — plus centres in Bhavnagar, Surat, Vadodara, Anand, Varanasi, Mumbai and Bhuj. All follow the same protocols, lab standards and ethics." },
    { question: "What makes the BAVISHI lab different?", answer: "ISO 7 cleanroom IVF labs, Time-Lapse EmbryoScope and GERI incubators for data-based embryo selection, the RI Witness electronic witnessing system to prevent sample mix-ups, and an advanced andrology and PGT lab with in-house sperm DNA testing and PGT-A." },
  ],
  seoMetaTitle: "Why Dr. Himanshu Bavishi is the Best IVF Specialist in Ahmedabad & India",
  seoMetaDescription:
    "25+ years, 30,000+ IVF babies, 10 centres and world-class labs — discover the BAVISHI difference and why couples across India trust Dr. Himanshu Bavishi for ethical, advanced IVF care.",
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
    writeFileSync("scratch_blogzips/hb-labs.svg", SVG_LABS);
    writeFileSync("scratch_blogzips/hb-rates.svg", SVG_RATES);
    writeFileSync("scratch_blogzips/hb-centres.svg", SVG_CENTRES);
    console.log("[dry-run] wrote 3 SVGs to scratch_blogzips/");
    console.log("[dry-run] would createOrReplace", doc._id, doc.slug);
    return;
  }

  const { readFileSync, readdirSync } = await import("node:fs");
  const files = readdirSync(HERO_DIR);
  const heroFile = files.find((f) => /himanshu|Best IVF Specialist/i.test(f) && /\.(png|jpg|jpeg|webp)$/i.test(f));
  if (heroFile) {
    const asset = await sanity.assets.upload("image", readFileSync(HERO_DIR + heroFile), { filename: "himanshu-bavishi-hero.png" });
    doc.heroImageUrl = asset.url;
    console.log(`[ok] hero uploaded from "${heroFile}" → ${asset.url}`);
  } else {
    console.log(`[warn] no hero found in ${HERO_DIR} matching himanshu/best-ivf-specialist — publishing WITHOUT hero (gradient fallback).`);
  }

  await sanity.createOrReplace(doc);
  console.log(`[ok] created ${doc._id} → /blogs/${doc.slug}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
