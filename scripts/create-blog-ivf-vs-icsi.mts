/* =====================================================================
 * Create NEW blog: "IVF vs ICSI: Why We Use ICSI for All Patients — and
 * the Male Partner's Role" (from client Word doc). Category ICSI.
 * Light-rose SVG system, 3 infographics.
 *   _id: blog-pg-282  slug: ivf-vs-icsi-why-we-use-icsi-and-the-male-partners-role
 *
 * Run:
 *   npx tsx --env-file=.env.local --tsconfig tsconfig.json \
 *     scripts/create-blog-ivf-vs-icsi.mts [--dry-run]
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
/** Escape bare ampersands so the SVG is valid XML (librsvg) and HTML.
 *  NOTE: avoid literal < and > in SVG text — use "above"/"below" words instead. */
const esc = (s: string) => s.replace(/&(?!(amp|lt|gt|quot|apos|#\d+);)/g, "&amp;");

/* ── Infographic 1: Conventional IVF vs ICSI (row comparison) ──────── */
const cmpRows = [
  { label: "How the egg is fertilised", ivf: "50,000+ sperm placed around it", icsi: "One best sperm injected in" },
  { label: "Fertilisation per mature egg", ivf: "About 50–70%", icsi: "About 75–80%" },
  { label: "Sperm-binding surprises", ivf: "Total failure is possible", icsi: "That risk is bypassed" },
  { label: "Use at BFI today", ivf: "No longer used", icsi: "Standard for every IVF cycle" },
];
const cLX = 24, cLW = 232, cC1X = 268, cC1W = 288, cC2X = 568, cC2W = 308;
const cRowH = 54, cRowY0 = 138;
const cmpRowEls = cmpRows.map((r, i) => {
  const y = cRowY0 + i * cRowH;
  const bg = i % 2 === 1 ? `<rect x="${cLX}" y="${y}" width="${cC2X + cC2W - cLX}" height="${cRowH}" rx="8" fill="${C.tint}"/>` : "";
  const my = y + cRowH / 2 + 4;
  return `${bg}
    <text x="${cLX + 14}" y="${my}" font-size="13" font-weight="700" fill="${C.dark}">${r.label}</text>
    <text x="${cC1X + cC1W / 2}" y="${my}" text-anchor="middle" font-size="12.5" fill="${C.muted}">${r.ivf}</text>
    <text x="${cC2X + cC2W / 2}" y="${my}" text-anchor="middle" font-size="12.5" font-weight="600" fill="${C.dark}">${r.icsi}</text>`;
}).join("\n  ");
const SVG_COMPARE = esc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 372" ${FF}>
  <rect width="900" height="372" rx="16" fill="${C.ivory}"/>
  <text x="450" y="42" text-anchor="middle" font-size="19" font-weight="700" fill="${C.dark}">Conventional IVF vs ICSI</text>
  <text x="450" y="66" text-anchor="middle" font-size="12.5" fill="${C.muted}">Why ICSI has replaced conventional IVF as our standard</text>
  <rect x="${cC1X}" y="92" width="${cC1W}" height="34" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="${cC1X + cC1W / 2}" y="114" text-anchor="middle" font-size="13" font-weight="700" fill="${C.muted}">Conventional IVF</text>
  <rect x="${cC2X}" y="92" width="${cC2W}" height="34" rx="8" fill="${C.rose}"/>
  <text x="${cC2X + cC2W / 2}" y="114" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">ICSI at BFI</text>
  ${cmpRowEls}
</svg>`);

/* ── Infographic 2: The male partner's role (3-phase flow) ─────────── */
const phases = [
  { tag: "3 MONTHS BEFORE", lines: ["Build better sperm —", "advanced semen tests,", "no smoking/alcohol, CoQ10"] },
  { tag: "RETRIEVAL DAY", lines: ["Give the sample.", "For zero-sperm cases:", "TESA / PESA / Micro-TESE"] },
  { tag: "THE 2-WEEK WAIT", lines: ["Be the calm in the cycle —", "manage appointments,", "support, not Google"] },
];
const pW = 268, pGap = 24, pX0 = 24, pY = 100, pH = 168;
const phaseEls = phases.map((c, i) => {
  const x = pX0 + i * (pW + pGap);
  const cx = x + pW / 2;
  const lines = c.lines.map((ln, li) => `<text x="${cx}" y="${pY + 82 + li * 21}" text-anchor="middle" font-size="12.5" fill="${C.dark}">${ln}</text>`).join("\n    ");
  return `
    <rect x="${x}" y="${pY}" width="${pW}" height="${pH}" rx="12" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
    <text x="${cx}" y="${pY + 36}" text-anchor="middle" font-size="12" font-weight="700" fill="${C.rose}" letter-spacing="0.5">${c.tag}</text>
    <line x1="${x + 40}" y1="${pY + 48}" x2="${x + pW - 40}" y2="${pY + 48}" stroke="${C.border}" stroke-width="1"/>
    ${lines}`;
}).join("\n  ");
const phaseArrows = phases.slice(0, -1).map((_, i) => {
  const ax = pX0 + (i + 1) * pW + i * pGap + 6;
  return `<path d="M ${ax} ${pY + pH / 2} l 12 0 m -5 -5 l 5 5 l -5 5" stroke="${C.rose}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}).join("\n    ");
const SVG_MALE = esc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 306" ${FF}>
  <rect width="900" height="306" rx="16" fill="${C.ivory}"/>
  <text x="450" y="42" text-anchor="middle" font-size="19" font-weight="700" fill="${C.dark}">The Male Partner's Role — 50% of the Baby</text>
  <text x="450" y="66" text-anchor="middle" font-size="12.5" fill="${C.muted}">From sperm health to sample day to steady support</text>
  ${phaseEls}
    ${phaseArrows}
</svg>`);

/* ── Infographic 3: IUI or ICSI? (2-panel bullet lists) ───────────── */
const iuiIf = [
  "Young couple",
  "Tubes are open",
  "Ovulation is present",
  "Total motile count above 10 million",
];
const icsiIf = [
  "Blocked tubes",
  "Age above 35, or AMH below 1.2",
  "Severe male factor",
  "Failed IUI 3 times, or past fertilisation failure",
];
const panW = 414, panX1 = 24, panX2 = 462, hY = 92, hH = 40, bY0 = 152, bStep = 34;
function bullets(items: string[], x: number, tick: "check" | "cross") {
  return items.map((t, i) => {
    const y = bY0 + i * bStep;
    const mark = tick === "check"
      ? `<circle cx="${x + 30}" cy="${y - 4}" r="9" fill="${C.rose}"/><path d="M ${x + 26} ${y - 4} l 3 3 l 5 -6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<circle cx="${x + 30}" cy="${y - 4}" r="9" fill="none" stroke="${C.muted}" stroke-width="1.5"/><circle cx="${x + 30}" cy="${y - 4}" r="2.5" fill="${C.muted}"/>`;
    return `${mark}<text x="${x + 48}" y="${y}" font-size="12.5" fill="${C.dark}">${t}</text>`;
  }).join("\n  ");
}
const SVG_DECIDE = esc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 336" ${FF}>
  <rect width="900" height="336" rx="16" fill="${C.ivory}"/>
  <text x="450" y="42" text-anchor="middle" font-size="19" font-weight="700" fill="${C.dark}">IUI or ICSI? We Decide After Diagnosis</text>
  <text x="450" y="66" text-anchor="middle" font-size="12.5" fill="${C.muted}">We never assume — the right path depends on your reports</text>
  <rect x="${panX1}" y="${hY - 6}" width="${panW}" height="252" rx="12" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <rect x="${panX2}" y="${hY - 6}" width="${panW}" height="252" rx="12" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <rect x="${panX2}" y="${hY - 6}" width="${panW}" height="${hH}" rx="12" fill="${C.rose}"/>
  <rect x="${panX2}" y="${hY + 12}" width="${panW}" height="16" fill="${C.rose}"/>
  <rect x="${panX1}" y="${hY - 6}" width="${panW}" height="${hH}" rx="12" fill="${C.tint}"/>
  <rect x="${panX1}" y="${hY + 12}" width="${panW}" height="16" fill="${C.tint}"/>
  <text x="${panX1 + panW / 2}" y="${hY + 19}" text-anchor="middle" font-size="13.5" font-weight="700" fill="${C.muted}" letter-spacing="0.5">IUI MAY BE TRIED IF</text>
  <text x="${panX2 + panW / 2}" y="${hY + 19}" text-anchor="middle" font-size="13.5" font-weight="700" fill="${C.white}" letter-spacing="0.5">STRAIGHT TO ICSI IF</text>
  ${bullets(iuiIf, panX1, "cross")}
  ${bullets(icsiIf, panX2, "check")}
</svg>`);

/* ── Build content ────────────────────────────────────────────────── */
const children: unknown[] = [];

children.push(
  block("statStrip", {
    items: [
      { id: wid(), value: "75–80%", label: "ICSI fertilisation per mature egg" },
      { id: wid(), value: "5000+", label: "ICSI cycles done at BFI" },
      { id: wid(), value: "50%", label: "Of the baby is the male partner" },
      { id: wid(), value: "74 days", label: "Time the body takes to build sperm" },
    ],
  }),
  block("highlightCard", {
    badge: "ICSI at BFI",
    icon: "Microscope",
    color: "rose",
    tagline: "We've moved past conventional IVF — ICSI gives more predictable results.",
    facts: [
      { id: wid(), label: "Fertilisation method", value: "ICSI for every cycle" },
      { id: wid(), label: "Embryologist experience", value: "10+ yrs, 5000+ cycles" },
      { id: wid(), label: "Sperm selection", value: "IMSI + MACS" },
      { id: wid(), label: "Male-factor unit", value: "In-house" },
    ],
    bestSuitedFor: "Couples who want fertilisation to be one less variable — with an ICSI-only lab, advanced sperm selection, and an in-house male-infertility unit that corrects sperm issues before the cycle.",
  }),
);

children.push(
  para("When couples ask us, \"Do we need IVF or ICSI?\", our answer at Bavishi Fertility Institute is clear: once we decide on IVF-level treatment, we fertilise every egg with ICSI. Conventional IVF is an older technique, and fertilisation outcomes are consistently better with ICSI."),
  para([T("That doesn't mean ICSI is automatically \"right for everyone\" everywhere. "), T("But at BFI, with our lab expertise and patient outcomes, ICSI has replaced conventional IVF as the standard.", true), T(" Here's why — and what the male partner's role looks like in an ICSI cycle.")]),
);

// Section 1
children.push(
  heading("h2", "Why we use ICSI, not conventional IVF"),
  para([T("Conventional IVF places 50,000+ sperm around each egg and waits for one to fertilise it naturally. "), T("ICSI is different: our embryologist selects the single best sperm and injects it directly into each mature egg.", true), T(" Here is why we moved away from conventional IVF.")]),
  block("infographic", {
    title: "Conventional IVF vs ICSI",
    svgContent: SVG_COMPARE,
    altText: "Comparison of conventional IVF and ICSI at Bavishi Fertility Institute. How the egg is fertilised: conventional IVF places over fifty thousand sperm around it, ICSI injects one best sperm directly in. Fertilisation per mature egg: about 50 to 70 percent with conventional IVF versus about 75 to 80 percent with ICSI. Sperm-binding surprises: total fertilisation failure is possible with conventional IVF, while ICSI bypasses that risk. Use at BFI today: conventional IVF is no longer used, ICSI is standard for every IVF cycle.",
    caption: "Even with a 'normal' semen report, conventional IVF can fail due to egg-sperm binding issues you cannot predict. ICSI removes that risk.",
  }),
  list("ul", [
    [T("Higher, more predictable fertilisation: ", true), T("ICSI gives 75–80% fertilisation per mature egg at BFI, versus 50–70% with conventional IVF — no 'total fertilisation failure' surprises.")],
    [T("Removes binding uncertainty: ", true), T("even a 'normal' semen report can hide DNA fragmentation or egg-sperm interaction problems. ICSI bypasses that.")],
    [T("Better across diagnoses: ", true), T("blocked tubes, endometriosis, PCOS, unexplained — fertilisation becomes one less variable to worry about.")],
    [T("Matches modern standards: ", true), T("most top labs worldwide now do 80–90% ICSI.")],
  ]),
  quote("ICSI needs advanced lab skill — results depend on the hand doing it. Our senior embryologists have 10+ years and 5,000+ ICSI cycles, which is why we can offer ICSI as the default."),
);

// Section 2
children.push(
  heading("h2", "The male partner's role: it's 50% of the baby"),
  para("ICSI makes sperm selection critical, which puts the male partner at the centre of the cycle — not on the sidelines. Here is what that role looks like, before and during treatment."),
  block("infographic", {
    title: "The Male Partner's Role",
    svgContent: SVG_MALE,
    altText: "The male partner's role across an ICSI cycle, in three phases. Three months before: build better sperm through advanced semen tests, stopping smoking and alcohol, and taking CoQ10. On egg-retrieval day: give the sample, and for zero-sperm cases the team performs TESA, PESA or Micro-TESE. During the two-week wait: be the calm in the cycle by managing appointments and giving support rather than searching online.",
    caption: "Sperm takes about 74 days to make — which is why the three months before the cycle matter so much.",
  }),
  heading("h3", "3 months before: build better sperm"),
  list("ul", [
    [T("Advanced semen tests ", true), T("including DNA fragmentation (DFI). If DFI is high, three months of antioxidants can change outcomes.")],
    [T("Lifestyle overhaul: ", true), T("sperm takes about 74 days to make — no smoking, no alcohol, no hot tubs, no tight underwear; add CoQ10, zinc and Vitamin E.")],
    [T("Varicocele check ", true), T("by scrotal Doppler; if present, surgical correction before ICSI improves success.")],
  ]),
  heading("h3", "Egg-retrieval day: your main medical role"),
  list("ul", [
    [T("Give the sample ", true), T("after 2–5 days abstinence. If there's anxiety, we plan a backup — a frozen sample in advance.")],
    [T("Zero-sperm cases: ", true), T("for azoospermia we do TESA, PESA or Micro-TESE the same day to retrieve sperm from the testis — our urologist is in-house.")],
    [T("Best sperm picked: ", true), T("our embryologist uses IMSI and MACS to select sperm with the lowest DNA damage for injection.")],
  ]),
  heading("h3", "Day 1 to the pregnancy test: your emotional role"),
  para("Your partner will have 8–10 days of injections and scans — help manage appointments, medicines and mood swings. Then comes the two-week wait, where stress can affect implantation. Be the calm in the cycle: plan distractions, not Google searches."),
);

// Section 3
children.push(
  heading("h2", "IUI or ICSI? We diagnose first, then decide"),
  para("We do not believe IUI is for everyone — or that IVF is. Whether you need IUI or IVF/ICSI at all depends on diagnosis. So we complete a full workup first: 3D ultrasound, AMH, HSG for the tubes and a hormone profile for her; semen analysis, DFI and Doppler for him."),
  block("infographic", {
    title: "IUI or ICSI — How We Decide",
    svgContent: SVG_DECIDE,
    altText: "How Bavishi Fertility Institute decides between IUI and ICSI after diagnosis. IUI may be tried if the couple is young, the tubes are open, ovulation is present, and the total motile sperm count is above 10 million. We go straight to ICSI if there are blocked tubes, the woman is above 35 or AMH is below 1.2, there is severe male factor, or there have been three failed IUI cycles or a past fertilisation failure.",
    caption: "Because ICSI gives us control over fertilisation, we do not offer conventional IVF insemination — every egg retrieved at BFI is fertilised by ICSI.",
  }),
);

// Section 4
children.push(
  heading("h2", "Why choose BFI for ICSI in Ahmedabad"),
  list("ul", [
    [T("An ICSI-only lab: ", true), T("our entire workflow, quality control and embryologist training are optimised for ICSI — it's our baseline, not an add-on.")],
    [T("Advanced sperm selection: ", true), T("IMSI at 6000x magnification, MACS for DNA-fragmented sperm, and microfluidics — we don't inject just any sperm.")],
    [T("In-house male infertility unit: ", true), T("from varicocele surgery to Micro-TESE, no referrals needed.")],
    [T("Transparent data and no blind protocols: ", true), T("we track fertilisation, blastocyst and live-birth rates, and still personalise your stimulation and transfer timing.")],
  ]),
);

// Conclusion + CTA
children.push(
  block("conclusionPanel", {
    headline: "The BFI promise on ICSI",
    points: [
      { id: wid(), icon: "Microscope", text: "We use ICSI for every IVF patient because it gives higher, more predictable fertilisation — not because it's fancier." },
      { id: wid(), icon: "Users", text: "The male partner is 50% of the baby — sperm health, sample day and steady support all matter." },
      { id: wid(), icon: "ClipboardCheck", text: "We diagnose first. IUI, ICSI or neither is decided by your reports, never assumed." },
      { id: wid(), icon: "FlaskConical", text: "Our whole lab is optimised for ICSI — IMSI, MACS and microfluidics select the best sperm." },
      { id: wid(), icon: "HeartPulse", text: "Your time and emotional energy matter — we do what gives the highest chance, fastest." },
    ],
  }),
  block("inlineCta", {
    accent: "rose",
    headline: "Not sure if you need IVF, ICSI — or just IUI?",
    subtext: "Come to Bavishi Fertility Institute for a complete fertility workup for both partners. We'll tell you honestly whether IUI can work, or if you need to move to ICSI — with a lab that has done 5,000+ ICSI cycles.",
    buttons: [
      { id: wid(), label: "Book a Consultation", url: "https://wa.me/919099020202", variant: "primary" },
      { id: wid(), label: "About ICSI at BFI", url: "/icsi-treatment-intracytoplasmic-sperm-injection", variant: "secondary" },
    ],
  }),
);

const contentRaw = JSON.stringify({
  root: { type: "root", format: "", indent: 0, version: 1, direction: "ltr", children },
});

const now = new Date().toISOString();
const doc = {
  _id: "blog-pg-282",
  _type: "blog",
  pgId: 282,
  title: "IVF vs ICSI: Why We Use ICSI for All Patients — and the Male Partner's Role",
  slug: "ivf-vs-icsi-why-we-use-icsi-and-the-male-partners-role",
  excerpt:
    "Conventional IVF or ICSI? At Bavishi Fertility Institute we fertilise every egg with ICSI — here's why, plus what the male partner does across the cycle and how we decide between IUI and ICSI.",
  status: "published",
  heroImageUrl: null as string | null,
  heroImageAlt: "An embryologist performing ICSI — injecting a single selected sperm into a mature egg under the microscope at Bavishi Fertility Institute",
  heroTextDark: false,
  heroImagePosition: "center center",
  contentRaw,
  authorSlug: "parth-bavishi-author",
  authorName: "Dr. Parth Bavishi",
  authorRole: "Co-director & IVF Specialist",
  authorCredentials: "MBBS, MD (Obstetrics & Gynaecology)",
  authorAvatarUrl: "https://h2qr1wdfdqrccu6j.public.blob.vercel-storage.com/parth.webp",
  authorBioText:
    "Dr. Parth Bavishi holds an MD in Obstetrics and Gynaecology and brings over 12 years of specialist experience as Co-director and IVF Specialist at Bavishi Fertility Institute — a group of fertility centres across India committed to helping couples realise their dream of parenthood. His clinical focus is on complex and challenging cases, including male-factor infertility, poor sperm quality, high sperm DNA fragmentation and repeated IVF failure. He has received specialised infertility training at Bavishi Fertility Institute, the Diamond Institute (USA) and the HART Institute (Japan), and is the author of 'Your Miracle in Making: A Couple's Guide to Pregnancy.'",
  reviewerSlug: "dr-himanshu-bavishi",
  reviewerName: "Dr. Himanshu Bavishi",
  reviewerRole: "Director & IVF Specialist",
  reviewerCredentials: "MBBS, MD (Obstetrics & Gynaecology), DNB",
  reviewerAvatarUrl: null,
  categoryTitle: "ICSI",
  categorySlug: "icsi",
  readMins: "7",
  publishedAt: now,
  lastUpdatedAt: now,
  treatmentSlugs: ["ivf", "icsi"],
  locationSlugs: null,
  faqs: [
    { question: "What is the difference between IVF and ICSI?", answer: "In conventional IVF, tens of thousands of sperm are placed around each egg in a dish and one fertilises it on its own. In ICSI (Intracytoplasmic Sperm Injection), the embryologist selects a single best sperm and injects it directly into each mature egg. ICSI gives more control over fertilisation." },
    { question: "Why does Bavishi Fertility Institute use ICSI for all IVF patients?", answer: "Because it gives higher and more predictable fertilisation — about 75–80% per mature egg at BFI versus 50–70% with conventional IVF — and removes the risk of 'total fertilisation failure' from unpredictable egg-sperm binding issues. Our lab is optimised entirely for ICSI, with senior embryologists who have done 5,000+ cycles." },
    { question: "Do I need ICSI if my semen report is normal?", answer: "Even a 'normal' semen report can hide problems such as high DNA fragmentation or egg-sperm interaction issues that cause conventional IVF to fail. Because ICSI bypasses those risks, we use it for every IVF cycle rather than gambling on conventional insemination." },
    { question: "What does the male partner do during an ICSI cycle?", answer: "A lot. For three months before, he builds better sperm through testing and lifestyle changes (sperm takes about 74 days to make). On retrieval day he gives the sample — or, for zero-sperm cases, undergoes TESA/PESA/Micro-TESE. Through the injections and the two-week wait, his steady emotional support genuinely matters — the male partner is 50% of the baby." },
    { question: "Can sperm be used if there is none in the semen?", answer: "Yes. For azoospermia (no sperm in the ejaculate), our in-house urologist performs TESA, PESA or Micro-TESE on the same day to retrieve sperm directly from the testis, which is then used for ICSI." },
  ],
  seoMetaTitle: "IVF vs ICSI: Why We Use ICSI for All Patients | Bavishi Fertility Institute",
  seoMetaDescription:
    "IVF or ICSI? Bavishi Fertility Institute fertilises every egg with ICSI for higher, more predictable results. Learn why, the male partner's role across the cycle, and how we decide between IUI and ICSI.",
  seoOgTitle: null,
  seoOgDescription: null,
  seoOgImageUrl: null,
};

const HERO_PATH = "public/blog-media/specific blog images/IVF vs ICSI Why We Use ICSI for All Patients — and the Male Partner's Role.png";

async function main() {
  const clash = await sanity.fetch(`*[_type=="blog" && slug==$s && _id!=$id]{_id}`, { s: doc.slug, id: doc._id });
  if (clash.length) throw new Error(`Slug already used by ${JSON.stringify(clash)}`);

  const blockCount = children.filter((n) => (n as { type?: string }).type === "block").length;
  const infoCount = children.filter((n) => (n as { fields?: { blockType?: string } }).fields?.blockType === "infographic").length;
  console.log(`content nodes: ${children.length}, blocks: ${blockCount}, infographics: ${infoCount}, contentRaw chars: ${contentRaw.length}`);

  if (DRY) {
    const { writeFileSync } = await import("node:fs");
    writeFileSync("scratch_blogzips/icsi-compare.svg", SVG_COMPARE);
    writeFileSync("scratch_blogzips/icsi-male.svg", SVG_MALE);
    writeFileSync("scratch_blogzips/icsi-decide.svg", SVG_DECIDE);
    console.log("[dry-run] wrote 3 SVGs to scratch_blogzips/");
    console.log("[dry-run] would createOrReplace", doc._id, doc.slug);
    return;
  }

  const { readFileSync, existsSync } = await import("node:fs");
  if (existsSync(HERO_PATH)) {
    const asset = await sanity.assets.upload("image", readFileSync(HERO_PATH), { filename: "ivf-vs-icsi-hero.png" });
    doc.heroImageUrl = asset.url;
    console.log(`[ok] hero uploaded → ${asset.url}`);
  } else {
    console.log(`[warn] hero not found at "${HERO_PATH}" — publishing WITHOUT hero (gradient fallback). Add the image and re-run.`);
  }

  await sanity.createOrReplace(doc);
  console.log(`[ok] created ${doc._id} → /blogs/${doc.slug}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
