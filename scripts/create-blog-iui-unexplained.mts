/* =====================================================================
 * Create NEW blog: "IUI for Unexplained Infertility" (from client Word doc).
 * Modelled on existing IUI blogs (blog-pg-116). Light-rose SVG system.
 *   _id: blog-pg-280  slug: iui-for-unexplained-infertility
 *
 * Run:
 *   npx tsx --env-file=.env.local --tsconfig tsconfig.json \
 *     scripts/create-blog-iui-unexplained.mts [--dry-run]
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

/* ── Light-rose 5-step IUI SVG infographic (locked design system) ──── */
const C = { ivory: "#FAF9F6", border: "#E2DEED", rose: "#CF3A6A", dark: "#1A1825", muted: "#6B6580", white: "#FFFFFF" };
const steps = [
  { n: "1", title: "Ovulation Monitoring", lines: ["Ultrasound from Day 2–3", "tracks your follicles.", "Mild support grows", "1–3 mature eggs."] },
  { n: "2", title: "Trigger Injection", lines: ["At 18–20 mm, an hCG", "trigger is given. The egg", "releases exactly", "36 hours later."] },
  { n: "3", title: "Sperm Washing", lines: ["Senior embryologists", "select the best-moving,", "lowest-DNA-damage", "sperm in the lab."] },
  { n: "4", title: "The IUI Procedure", lines: ["A soft catheter places", "washed sperm inside", "the uterus. Painless,", "over in 5–10 minutes."] },
  { n: "5", title: "After-Care", lines: ["Rest 15–20 min, then", "resume your day.", "Progesterone support;", "blood test on Day 14."] },
];
const cardW = 156, gap = 20, x0 = 20, cardY = 92, cardH = 208;
const cards = steps.map((s, i) => {
  const x = x0 + i * (cardW + gap);
  const cx = x + cardW / 2;
  const lineEls = s.lines
    .map((ln, li) => `<text x="${cx}" y="${cardY + 96 + li * 18}" text-anchor="middle" font-size="11" fill="${C.dark}">${ln}</text>`)
    .join("\n    ");
  return `
    <rect x="${x}" y="${cardY}" width="${cardW}" height="${cardH}" rx="12" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cardY + 30}" r="18" fill="${C.rose}"/>
    <text x="${cx}" y="${cardY + 36}" text-anchor="middle" font-size="17" font-weight="700" fill="${C.white}">${s.n}</text>
    <text x="${cx}" y="${cardY + 66}" text-anchor="middle" font-size="12.5" font-weight="700" fill="${C.rose}">${s.title}</text>
    ${lineEls}`;
});
// connector arrows between cards
const arrows = steps.slice(0, -1).map((_, i) => {
  const ax = x0 + (i + 1) * cardW + i * gap + 4;
  return `<path d="M ${ax} ${cardY + 30} l 12 0 m -5 -5 l 5 5 l -5 5" stroke="${C.rose}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}).join("\n    ");

const SVG_STEPS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 336" font-family="'Inter', system-ui, sans-serif">
  <rect width="900" height="336" rx="16" fill="${C.ivory}"/>
  <text x="450" y="40" text-anchor="middle" font-size="19" font-weight="700" fill="${C.dark}">The 5-Step IUI Cycle at Bavishi Fertility Institute</text>
  <text x="450" y="64" text-anchor="middle" font-size="12.5" fill="${C.muted}">A fully monitored protocol — we never do a "blind" IUI</text>
  ${cards.join("\n  ")}
    ${arrows}
</svg>`;

/* ── Infographic B: Trying naturally vs IUI at BFI (2-column comparison) ── */
const cmpRows = [
  { label: "Sperm reaching the egg", nat: "Only a tiny fraction survive", iui: "Millions placed past the cervix" },
  { label: "The cervix barrier", nat: "Must be crossed on its own", iui: "Bypassed completely" },
  { label: "Timing with ovulation", nat: "Left to chance", iui: "Timed to the hour" },
  { label: "Sperm quality", nat: "Mixed and unselected", iui: "Washed — best-moving picked" },
];
const cmpLX = 24, cmpLW = 226, cmpC1X = 262, cmpC1W = 286, cmpC2X = 560, cmpC2W = 316;
const cmpRowH = 54, cmpRowY0 = 138;
const cmpRowEls = cmpRows.map((r, i) => {
  const y = cmpRowY0 + i * cmpRowH;
  const bg = i % 2 === 1 ? `<rect x="${cmpLX}" y="${y}" width="${cmpC2X + cmpC2W - cmpLX}" height="${cmpRowH}" rx="8" fill="#F3F0F8"/>` : "";
  const my = y + cmpRowH / 2 + 4;
  return `${bg}
    <text x="${cmpLX + 14}" y="${my}" font-size="13" font-weight="700" fill="${C.dark}">${r.label}</text>
    <text x="${cmpC1X + cmpC1W / 2}" y="${my}" text-anchor="middle" font-size="12.5" fill="${C.muted}">${r.nat}</text>
    <text x="${cmpC2X + cmpC2W / 2}" y="${my}" text-anchor="middle" font-size="12.5" font-weight="600" fill="${C.dark}">${r.iui}</text>`;
}).join("\n  ");
const SVG_COMPARE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 372" font-family="'Inter', system-ui, sans-serif">
  <rect width="900" height="372" rx="16" fill="${C.ivory}"/>
  <text x="450" y="42" text-anchor="middle" font-size="19" font-weight="700" fill="${C.dark}">Why IUI Beats Trying on Your Own</text>
  <text x="450" y="66" text-anchor="middle" font-size="12.5" fill="${C.muted}">IUI puts more healthy sperm closer to the egg, at exactly the right time</text>
  <rect x="${cmpC1X}" y="92" width="${cmpC1W}" height="34" rx="8" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <text x="${cmpC1X + cmpC1W / 2}" y="114" text-anchor="middle" font-size="13" font-weight="700" fill="${C.muted}">Trying Naturally</text>
  <rect x="${cmpC2X}" y="92" width="${cmpC2W}" height="34" rx="8" fill="${C.rose}"/>
  <text x="${cmpC2X + cmpC2W / 2}" y="114" text-anchor="middle" font-size="13" font-weight="700" fill="${C.white}">IUI at BFI</text>
  ${cmpRowEls}
</svg>`;

/* ── Infographic C: The BFI lab advantage (accent-bar list) ── */
const labRows = [
  { n: "1", title: "Dedicated Andrology Lab", desc: "Density gradient + microfluidics select the lowest-DNA-damage sperm." },
  { n: "2", title: "CASA Technology", desc: "Computer analysis gives the exact count of Grade-A sperm we place inside." },
  { n: "3", title: "Sterile IUI Suite", desc: "A Laminar Air Flow theatre brings infection risk to nearly zero." },
  { n: "4", title: "Imported Soft Catheters", desc: "No cramping or injury — plus in-house hormone testing to time it precisely." },
];
const labCardH = 62, labGap = 10, labY0 = 96, labX = 24, labW = 852;
const labEls = labRows.map((r, i) => {
  const y = labY0 + i * (labCardH + labGap);
  const cy = y + labCardH / 2;
  return `
    <rect x="${labX}" y="${y}" width="${labW}" height="${labCardH}" rx="12" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
    <rect x="${labX}" y="${y}" width="6" height="${labCardH}" rx="3" fill="${C.rose}"/>
    <circle cx="${labX + 44}" cy="${cy}" r="17" fill="${C.rose}"/>
    <text x="${labX + 44}" y="${cy + 5}" text-anchor="middle" font-size="15" font-weight="700" fill="${C.white}">${r.n}</text>
    <text x="${labX + 78}" y="${cy - 6}" font-size="14.5" font-weight="700" fill="${C.dark}">${r.title}</text>
    <text x="${labX + 78}" y="${cy + 15}" font-size="12.5" fill="${C.muted}">${r.desc}</text>`;
}).join("\n  ");
const SVG_LAB = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 384" font-family="'Inter', system-ui, sans-serif">
  <rect width="900" height="384" rx="16" fill="${C.ivory}"/>
  <text x="450" y="42" text-anchor="middle" font-size="19" font-weight="700" fill="${C.dark}">The BFI Lab Advantage</text>
  <text x="450" y="66" text-anchor="middle" font-size="12.5" fill="${C.muted}">Any clinic can offer IUI — your result is decided in the lab</text>
  ${labEls}
</svg>`;

/* ── Build content ────────────────────────────────────────────────── */
const children: unknown[] = [];

children.push(
  block("statStrip", {
    items: [
      { id: wid(), value: "5–10 min", label: "Length of the IUI procedure" },
      { id: wid(), value: "1–3", label: "Mature eggs we aim for" },
      { id: wid(), value: "Day 14", label: "When the pregnancy test is done" },
      { id: wid(), value: "2–3", label: "IUI cycles we try before IVF (under 35)" },
    ],
  }),
  block("highlightCard", {
    badge: "IUI at BFI",
    icon: "Stethoscope",
    color: "rose",
    tagline: "A gentle first-line treatment — backed by a world-class andrology lab.",
    facts: [
      { id: wid(), label: "Anaesthesia needed", value: "None" },
      { id: wid(), label: "Recovery / bed rest", value: "None" },
      { id: wid(), label: "Sperm selection", value: "Density gradient + microfluidics" },
      { id: wid(), label: "Centres across India", value: "10" },
    ],
    bestSuitedFor: "Couples under 35 with unexplained infertility, open tubes and normal ovulation — where placing healthy sperm closer to the egg, at exactly the right time, has a real chance to work before moving to IVF.",
  }),
);

// Intro
children.push(
  para("When every report comes back normal but pregnancy still isn't happening, the diagnosis is often unexplained infertility. It is one of the most frustrating results to hear — nothing is obviously wrong, yet the outcome you want keeps slipping away."),
  para("For many couples in this situation, IUI (Intrauterine Insemination) is the first treatment we recommend at Bavishi Fertility Institute. It is simple, gentle and far less invasive than IVF. Here is exactly what IUI is, how we perform it, and why our approach makes the difference between a procedure and a result."),
);

// What is IUI
children.push(
  heading("h2", "What is IUI?"),
  para("IUI stands for Intrauterine Insemination. It is a fertility treatment in which we collect the husband's semen sample, process it in our lab to select the best-quality, fast-moving sperm, and then place those sperm directly inside the woman's uterus around the time of ovulation."),
  para([T("The goal is simple: "), T("put healthy sperm closer to the egg, at the right time.", true), T(" In natural conception, many sperm are lost along the journey through the cervix and vagina. IUI helps them bypass that journey so that more healthy sperm reach the fallopian tube, where the egg is waiting.")]),
  para("IUI is a gentle, outpatient procedure. There are no cuts, no stitches and no anaesthesia. The entire process takes about 5–10 minutes, and you go home the same day."),
  block("infographic", {
    title: "Trying Naturally vs IUI at BFI",
    svgContent: SVG_COMPARE,
    altText: "Comparison of trying to conceive naturally versus IUI at Bavishi Fertility Institute across four factors. Sperm reaching the egg: naturally only a tiny fraction survive, with IUI millions are placed past the cervix. The cervix barrier: naturally it must be crossed on its own, with IUI it is bypassed completely. Timing with ovulation: naturally left to chance, with IUI timed to the hour. Sperm quality: naturally mixed and unselected, with IUI washed and best-moving sperm are picked.",
    caption: "IUI helps healthy sperm bypass the journey through the cervix and vagina, so more of them reach the fallopian tube where the egg is waiting.",
  }),
);

// How performed
children.push(
  heading("h2", "How IUI is performed at Bavishi Fertility Institute"),
  para("Every IUI cycle at BFI follows a strict, monitored protocol. We do not do \"blind\" IUI. Here is the step-by-step process."),
  block("infographic", {
    title: "The 5-Step IUI Cycle",
    svgContent: SVG_STEPS,
    altText: "Five-step timeline of the IUI cycle at Bavishi Fertility Institute: Step 1 ovulation monitoring by ultrasound from Day 2 to 3 growing one to three mature eggs; Step 2 an hCG trigger injection at 18 to 20 millimetres, with the egg released 36 hours later; Step 3 lab sperm washing to select the best-moving sperm; Step 4 the painless 5 to 10 minute catheter procedure; Step 5 after-care with 15 to 20 minutes rest, progesterone support and a blood pregnancy test on Day 14.",
    caption: "From your first scan to your pregnancy test, the same senior doctor and team manage your cycle.",
  }),
  heading("h3", "Step 1: Ovulation monitoring"),
  para("From Day 2 or 3 of your period, we begin tracking your follicles by ultrasound to see how your eggs are growing. For unexplained infertility, we often use mild tablets or low-dose injections to help you produce 1–3 mature eggs instead of just one. This improves your chances while keeping the risk of twins low."),
  heading("h3", "Step 2: Trigger injection"),
  para("Once the lead follicle reaches 18–20 mm, we give a \"trigger\" injection of hCG. This makes the egg release from the ovary exactly 36 hours later — and we schedule your IUI precisely around that timing."),
  heading("h3", "Step 3: Semen collection and advanced sperm washing"),
  para("On the morning of the IUI, the husband gives a semen sample at our centre, and it goes straight to our andrology lab. Using a careful multi-step process, we remove dead sperm, debris and seminal fluid, and select only the sperm with the best movement and shape. This step is critical to success."),
  heading("h3", "Step 4: The IUI procedure"),
  para("You lie down just as you would for a routine check-up. We gently pass a very thin, soft catheter through the cervix into the uterus and slowly place the washed sperm inside. You won't feel pain — only mild discomfort, similar to a Pap smear. It is over in minutes."),
  heading("h3", "Step 5: After-care"),
  para("You rest for 15–20 minutes and then go home. There is no need for bed rest — you can resume work, walking and your daily routine the same day. We start progesterone support to help the uterine lining, and a blood pregnancy test is done after 14 days."),
);

// What makes it different
children.push(
  heading("h2", "What makes IUI at BFI different"),
  para("Any clinic can offer IUI. At BFI, your success depends on the strength of our lab, our technology and our decision-making. Here is what sets us apart."),
  block("infographic", {
    title: "The BFI Lab Advantage",
    svgContent: SVG_LAB,
    altText: "Four reasons IUI works better at Bavishi Fertility Institute. One, a dedicated andrology lab where density gradient and microfluidics select the lowest-DNA-damage sperm. Two, CASA technology giving the exact count of Grade-A sperm placed inside. Three, a sterile IUI suite with Laminar Air Flow bringing infection risk to nearly zero. Four, imported soft catheters that avoid cramping or injury, plus in-house hormone testing to time the procedure precisely.",
    caption: "Your IUI result is decided in the lab. This is where BFI is different from a routine clinic.",
  }),
  heading("h3", "World-class lab facilities"),
  list("ul", [
    [T("Dedicated andrology lab: ", true), T("sperm washing is done by senior embryologists using advanced methods like density gradient and microfluidics to pick sperm with the lowest DNA damage.")],
    [T("CASA technology: ", true), T("Computer-Assisted Semen Analysis measures exact sperm count, movement and speed, so we know precisely how many Grade-A sperm we are placing inside — no guesswork.")],
    [T("Sterile IUI suite: ", true), T("your procedure is done in a temperature-controlled room with Laminar Air Flow, similar to an operation theatre, bringing infection risk to nearly zero.")],
  ]),
  heading("h3", "The best instruments and protocols"),
  list("ul", [
    [T("Imported soft catheters ", true), T("that avoid any injury or cramping to the uterus, which can otherwise affect implantation.")],
    [T("In-house hormone testing: ", true), T("LH and Estradiol results in about an hour, so we can time your IUI to the exact hour of ovulation.")],
    [T("3D/4D Colour Doppler monitoring: ", true), T("we don't just measure follicle size — we check blood flow, because a follicle with good blood flow carries a healthier egg.")],
  ]),
  heading("h3", "A diagnosis-first philosophy"),
  para("Before we even suggest IUI, we complete your basic fertility workup — tube test, AMH, 3D sonography and an advanced semen test for the husband. We recommend IUI only when it has a real chance to work for you. If your reports show IUI is unlikely to succeed, we tell you on Day 1 and guide you to the right treatment instead. We will not put you through repeated IUI cycles when success is unlikely."),
  heading("h3", "One team, full support"),
  para("From your first scan to your pregnancy test, the same senior doctor and team manage your cycle — you are not handed to different people on different days. We also have an in-house urologist for male factor, so any sperm issues are corrected before your IUI."),
);

// Why IUI for unexplained
children.push(
  heading("h2", "Why IUI for unexplained infertility?"),
  para("In unexplained infertility, all the basic tests are normal but pregnancy simply doesn't happen. IUI helps because it places a higher number of healthy sperm closer to the egg and times it perfectly with ovulation. For couples under 35, 2–3 cycles of IUI at a good centre offer a genuine chance of pregnancy before moving to IVF."),
  quote("IUI is a simple treatment, but its success depends on the lab behind it. Your job is to stay healthy and positive — our job is to give you the best possible cycle with honest guidance."),
);

// Conclusion + CTA
children.push(
  block("conclusionPanel", {
    headline: "The BFI promise on IUI",
    points: [
      { id: wid(), icon: "ClipboardCheck", text: "We diagnose first. We recommend IUI only when it has a real chance to work — and tell you honestly if it doesn't." },
      { id: wid(), icon: "Microscope", text: "Your result is decided in the lab. Advanced sperm washing, CASA and a sterile suite give every cycle its best shot." },
      { id: wid(), icon: "CalendarCheck", text: "Timing is everything. In-house hormone testing lets us schedule your IUI to the hour of ovulation." },
      { id: wid(), icon: "Users", text: "One senior team manages you from first scan to pregnancy test — with an in-house urologist for any male-factor issue." },
      { id: wid(), icon: "HeartPulse", text: "For couples under 35 with unexplained infertility, 2–3 well-run IUI cycles are a sensible first step before IVF." },
    ],
  }),
  block("inlineCta", {
    accent: "rose",
    headline: "Been told it's \"unexplained\"? Let's take a proper look.",
    subtext: "Bring your past reports or start fresh with us. We'll do a complete checkup for both partners and tell you honestly whether IUI is the right first step for you.",
    buttons: [
      { id: wid(), label: "Book a Consultation", url: "https://wa.me/919099020202", variant: "primary" },
      { id: wid(), label: "About IUI at BFI", url: "/intra-uterine-insemination-iui", variant: "secondary" },
    ],
  }),
);

const contentRaw = JSON.stringify({
  root: { type: "root", format: "", indent: 0, version: 1, direction: "ltr", children },
});

const now = new Date().toISOString();
const doc = {
  _id: "blog-pg-280",
  _type: "blog",
  pgId: 280,
  title: "IUI for Unexplained Infertility: How It Works and Why It's the Right First Step",
  slug: "iui-for-unexplained-infertility",
  excerpt:
    "When every report is normal but pregnancy isn't happening, the answer is often unexplained infertility. Here's what IUI is, how we perform it at Bavishi Fertility Institute, and why our lab-led, diagnosis-first approach makes the difference.",
  status: "published",
  heroImageUrl: null as string | null,
  heroImageAlt: "A couple in consultation with their fertility specialist at Bavishi Fertility Institute, reviewing their IUI plan",
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
  categoryTitle: "IUI",
  categorySlug: "iui",
  readMins: "6",
  publishedAt: now,
  lastUpdatedAt: now,
  treatmentSlugs: ["iui"],
  locationSlugs: null,
  faqs: [
    { question: "Is IUI painful?", answer: "No. IUI is a gentle outpatient procedure with no cuts, stitches or anaesthesia. Most patients feel only mild discomfort similar to a Pap smear, and the whole procedure is over in about 5–10 minutes." },
    { question: "Do I need bed rest after IUI?", answer: "No. You rest for 15–20 minutes at the centre and can then resume work, walking and your normal routine the same day. Bed rest does not improve IUI success." },
    { question: "How many IUI cycles should we try before IVF?", answer: "For couples under 35 with unexplained infertility, open tubes and normal ovulation, we usually recommend 2–3 well-monitored IUI cycles before considering IVF. If your reports suggest IUI is unlikely to work, we say so on Day 1 and guide you to the right treatment." },
    { question: "When is the pregnancy test done after IUI?", answer: "A blood pregnancy test (beta hCG) is done about 14 days after the IUI. Testing earlier can give misleading results, so we ask you to wait for the scheduled test." },
    { question: "Is IUI a good option for unexplained infertility?", answer: "Yes, it is often the ideal first step. In unexplained infertility all basic tests are normal, and IUI helps by placing more healthy sperm closer to the egg at exactly the right time — offering a real chance of pregnancy before moving to more intensive treatment." },
  ],
  seoMetaTitle: "IUI for Unexplained Infertility — How It Works | Bavishi Fertility Institute",
  seoMetaDescription:
    "Diagnosed with unexplained infertility? Learn how IUI works, the 5-step monitored protocol at Bavishi Fertility Institute, and why our lab-led, diagnosis-first approach gives your cycle its best chance.",
  seoOgTitle: null,
  seoOgDescription: null,
  seoOgImageUrl: null,
};

async function main() {
  // guard against slug collision on a different id
  const clash = await sanity.fetch(
    `*[_type=="blog" && slug==$s && _id!=$id]{_id}`,
    { s: doc.slug, id: doc._id },
  );
  if (clash.length) throw new Error(`Slug already used by ${JSON.stringify(clash)}`);

  const blockCount = children.filter((n) => (n as { type?: string }).type === "block").length;
  const infoCount = children.filter(
    (n) => (n as { fields?: { blockType?: string } }).fields?.blockType === "infographic",
  ).length;
  console.log(`content nodes: ${children.length}, blocks: ${blockCount}, infographics: ${infoCount}, contentRaw chars: ${contentRaw.length}`);
  if (DRY) {
    const { writeFileSync } = await import("node:fs");
    writeFileSync("scratch_blogzips/steps.svg", SVG_STEPS);
    writeFileSync("scratch_blogzips/compare.svg", SVG_COMPARE);
    writeFileSync("scratch_blogzips/lab.svg", SVG_LAB);
    console.log("[dry-run] wrote 3 SVGs to scratch_blogzips/");
    console.log("[dry-run] would createOrReplace", doc._id, doc.slug);
    return;
  }

  // Upload hero image to Sanity assets → CDN url (matches existing new-blog heroes)
  const { readFileSync } = await import("node:fs");
  const heroPath = "public/blog-media/specific blog images/IUI for Unexplained Infertility How It Works and Why It's the Right First Step.png";
  const asset = await sanity.assets.upload("image", readFileSync(heroPath), {
    filename: "iui-for-unexplained-infertility-hero.png",
  });
  doc.heroImageUrl = asset.url;
  console.log(`[ok] hero uploaded → ${asset.url}`);

  await sanity.createOrReplace(doc);
  console.log(`[ok] created ${doc._id} → /blogs/${doc.slug}`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
