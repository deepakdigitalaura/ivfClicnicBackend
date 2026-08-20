/* =====================================================================
 * Create NEW blog: "Food for Better Egg Quality: How Sugar Affects Your
 * Eggs" (from client Word doc). Modelled on blog 1 + existing egg-quality
 * blogs (category female-infertility). Light-rose SVG system, 3 infographics.
 *   _id: blog-pg-281  slug: food-for-better-egg-quality-how-sugar-affects-your-eggs
 *
 * Run:
 *   npx tsx --env-file=.env.local --tsconfig tsconfig.json \
 *     scripts/create-blog-food-egg-quality.mts [--dry-run]
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
/** Escape bare ampersands so the SVG is valid XML (librsvg) and HTML. */
const esc = (s: string) => s.replace(/&(?!(amp|lt|gt|quot|apos|#\d+);)/g, "&amp;");

/* ── Infographic A: Your 3-Month Egg Window (flow, last card = outcome) ── */
const winCards = [
  { tag: "3 MONTHS BEFORE", lines: ["The egg starts", "getting ready"], out: false },
  { tag: "2 MONTHS BEFORE", lines: ["Your food & habits", "shape its quality"], out: false },
  { tag: "1 MONTH BEFORE", lines: ["Final maturation", "of the egg"], out: false },
  { tag: "OVULATION", lines: ["A stronger egg", "is released"], out: true },
];
const wcW = 198, wcGap = 20, wcX0 = 24, wcY = 100, wcH = 150;
const winEls = winCards.map((c, i) => {
  const x = wcX0 + i * (wcW + wcGap);
  const cx = x + wcW / 2;
  const fill = c.out ? C.rose : C.white;
  const tagFill = c.out ? C.white : C.rose;
  const lineFill = c.out ? C.white : C.dark;
  const lines = c.lines.map((ln, li) => `<text x="${cx}" y="${wcY + 78 + li * 20}" text-anchor="middle" font-size="12.5" fill="${lineFill}">${ln}</text>`).join("\n    ");
  return `
    <rect x="${x}" y="${wcY}" width="${wcW}" height="${wcH}" rx="12" fill="${fill}" stroke="${c.out ? C.rose : C.border}" stroke-width="1.5"/>
    <text x="${cx}" y="${wcY + 34}" text-anchor="middle" font-size="11" font-weight="700" fill="${tagFill}" letter-spacing="0.5">${c.tag}</text>
    <line x1="${x + 40}" y1="${wcY + 46}" x2="${x + wcW - 40}" y2="${wcY + 46}" stroke="${c.out ? "#FFFFFF66" : C.border}" stroke-width="1"/>
    ${lines}`;
}).join("\n  ");
const winArrows = winCards.slice(0, -1).map((_, i) => {
  const ax = wcX0 + (i + 1) * wcW + i * wcGap + 4;
  return `<path d="M ${ax} ${wcY + wcH / 2} l 12 0 m -5 -5 l 5 5 l -5 5" stroke="${C.rose}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}).join("\n    ");
const SVG_WINDOW = esc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 288" ${FF}>
  <rect width="900" height="288" rx="16" fill="${C.ivory}"/>
  <text x="450" y="42" text-anchor="middle" font-size="19" font-weight="700" fill="${C.dark}">Your 3-Month Egg Window</text>
  <text x="450" y="66" text-anchor="middle" font-size="12.5" fill="${C.muted}">The egg you release this month has been maturing for the last 3 months</text>
  ${winEls}
    ${winArrows}
</svg>`);

/* ── Infographic B: How daily sugar harms your eggs (accent-bar, 3) ── */
const sugarRows = [
  { n: "1", title: "It ages your eggs faster", desc: "Sugar sticks to the egg and damages it from inside — like rust on iron." },
  { n: "2", title: "It disturbs your hormones", desc: "Especially with PCOS, it can stop ovulation and lower egg quality." },
  { n: "3", title: "It creates inflammation", desc: "Swelling in the body reaches the ovaries and harms the eggs." },
];
const sgH = 66, sgGap = 12, sgY0 = 100, sgX = 24, sgW = 852;
const sugarEls = sugarRows.map((r, i) => {
  const y = sgY0 + i * (sgH + sgGap);
  const cy = y + sgH / 2;
  return `
    <rect x="${sgX}" y="${y}" width="${sgW}" height="${sgH}" rx="12" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
    <rect x="${sgX}" y="${y}" width="6" height="${sgH}" rx="3" fill="${C.rose}"/>
    <circle cx="${sgX + 46}" cy="${cy}" r="18" fill="${C.rose}"/>
    <text x="${sgX + 46}" y="${cy + 5}" text-anchor="middle" font-size="15" font-weight="700" fill="${C.white}">${r.n}</text>
    <text x="${sgX + 82}" y="${cy - 6}" font-size="15" font-weight="700" fill="${C.dark}">${r.title}</text>
    <text x="${sgX + 82}" y="${cy + 16}" font-size="12.5" fill="${C.muted}">${r.desc}</text>`;
}).join("\n  ");
const SVG_SUGAR = esc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 336" ${FF}>
  <rect width="900" height="336" rx="16" fill="${C.ivory}"/>
  <text x="450" y="42" text-anchor="middle" font-size="19" font-weight="700" fill="${C.dark}">How Daily Sugar Harms Your Eggs</text>
  <text x="450" y="66" text-anchor="middle" font-size="12.5" fill="${C.muted}">Too much sugar every day, over months — not one sweet once a week</text>
  ${sugarEls}
</svg>`);

/* ── Infographic C: Eat More vs Eat Less (2-panel bullet lists) ────── */
const eatMore = [
  "Colourful vegetables & fruit, daily",
  "Nuts & seeds — soaked almonds, walnuts",
  "Protein every meal — dal, paneer, curd, egg",
  "Jowar, bajra, ragi; brown rice, daliya",
  "Ghee or olive oil — 1–2 tsp daily",
];
const eatLess = [
  "Added sugar, cold drinks, daily sweets",
  "Maida — white bread, naan, bakery items",
  "Fried food — puri, pakoda, chips",
  "Alcohol & smoking — stop completely",
];
const panW = 414, panX1 = 24, panX2 = 462, hY = 92, hH = 40, bY0 = 150, bStep = 33;
function bullets(items: string[], x: number, tick: "check" | "cross") {
  return items.map((t, i) => {
    const y = bY0 + i * bStep;
    const mark = tick === "check"
      ? `<circle cx="${x + 30}" cy="${y - 4}" r="9" fill="${C.rose}"/><path d="M ${x + 26} ${y - 4} l 3 3 l 5 -6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<circle cx="${x + 30}" cy="${y - 4}" r="9" fill="none" stroke="${C.muted}" stroke-width="1.5"/><path d="M ${x + 26} ${y - 8} l 8 8 m 0 -8 l -8 8" stroke="${C.muted}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    return `${mark}<text x="${x + 48}" y="${y}" font-size="12.5" fill="${C.dark}">${t}</text>`;
  }).join("\n  ");
}
const SVG_EAT = esc(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 366" ${FF}>
  <rect width="900" height="366" rx="16" fill="${C.ivory}"/>
  <text x="450" y="42" text-anchor="middle" font-size="19" font-weight="700" fill="${C.dark}">Eat More vs Eat Less for Healthier Eggs</text>
  <text x="450" y="66" text-anchor="middle" font-size="12.5" fill="${C.muted}">No costly foods — just change your regular ghar-ka-khana for 3 months</text>
  <rect x="${panX1}" y="${hY - 6}" width="${panW}" height="286" rx="12" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <rect x="${panX2}" y="${hY - 6}" width="${panW}" height="286" rx="12" fill="${C.white}" stroke="${C.border}" stroke-width="1.5"/>
  <rect x="${panX1}" y="${hY - 6}" width="${panW}" height="${hH}" rx="12" fill="${C.rose}"/>
  <rect x="${panX1}" y="${hY + 12}" width="${panW}" height="16" fill="${C.rose}"/>
  <text x="${panX1 + panW / 2}" y="${hY + 19}" text-anchor="middle" font-size="14" font-weight="700" fill="${C.white}" letter-spacing="0.5">EAT MORE</text>
  <rect x="${panX2}" y="${hY - 6}" width="${panW}" height="${hH}" rx="12" fill="${C.tint}"/>
  <rect x="${panX2}" y="${hY + 12}" width="${panW}" height="16" fill="${C.tint}"/>
  <text x="${panX2 + panW / 2}" y="${hY + 19}" text-anchor="middle" font-size="14" font-weight="700" fill="${C.muted}" letter-spacing="0.5">EAT LESS</text>
  ${bullets(eatMore, panX1, "check")}
  ${bullets(eatLess, panX2, "cross")}
</svg>`);

/* ── Build content ────────────────────────────────────────────────── */
const children: unknown[] = [];

children.push(
  block("statStrip", {
    items: [
      { id: wid(), value: "3 months", label: "How long an egg takes to mature" },
      { id: wid(), value: "5", label: "Simple food changes that help" },
      { id: wid(), value: "3", label: "Ways daily sugar harms eggs" },
      { id: wid(), value: "1–2 tsp", label: "Healthy fat like ghee, daily" },
    ],
  }),
  block("highlightCard", {
    badge: "Egg Quality & Diet",
    icon: "Egg",
    color: "rose",
    tagline: "What you eat for the next 3 months can make your eggs healthier.",
    facts: [
      { id: wid(), label: "Best window to start", value: "3 months before" },
      { id: wid(), label: "Biggest culprit", value: "Daily sugar" },
      { id: wid(), label: "Costly foods needed", value: "None" },
      { id: wid(), label: "BFI first step", value: "Test, then decide" },
    ],
    bestSuitedFor: "Women who are trying to conceive and want to give their eggs the best possible start — through simple, everyday food changes, guided by proper testing rather than guesswork.",
  }),
);

children.push(
  para("If you're trying for a baby, what you eat over the next three months can genuinely make your eggs healthier. It sounds surprising, but the science is simple — and so are the changes. Here's how food affects your eggs, why daily sugar is the biggest culprit, and exactly what to eat instead."),
);

// Section 1
children.push(
  heading("h2", "Your eggs and food — the simple truth"),
  para("You are born with all the eggs you will ever have. But the egg your body releases this month has actually been getting ready for the last three months."),
  para([T("In those three months, your food, sleep and stress can make that egg strong or weak. "), T("Strong eggs mean better chances of pregnancy.", true), T(" Weak eggs may not fertilise well. That three-month window is where your daily choices matter most.")]),
  block("infographic", {
    title: "Your 3-Month Egg Window",
    svgContent: SVG_WINDOW,
    altText: "A timeline showing that the egg released at ovulation has been maturing for three months. Three months before ovulation the egg starts getting ready; two months before, your food and habits shape its quality; one month before is its final maturation; at ovulation a stronger egg is released.",
    caption: "This is why we ask you to focus on food and lifestyle for three months — you are shaping the egg long before it is released.",
  }),
);

// Section 2
children.push(
  heading("h2", "Does sugar damage your eggs? Yes — if you eat too much, every day"),
  para("Eating a lot of sugar every single day harms your eggs. When you have sweets, cold drinks, white bread or maida daily, your blood sugar rises very fast, and your body then makes extra insulin to handle it. Too much sugar and too much insulin, month after month, does three things:"),
  block("infographic", {
    title: "How Daily Sugar Harms Your Eggs",
    svgContent: SVG_SUGAR,
    altText: "Three ways daily sugar harms your eggs. One, it ages your eggs faster because sugar sticks to the egg and damages it from inside, like rust on iron. Two, it disturbs your hormones, and especially with PCOS it can stop ovulation and lower egg quality. Three, it creates inflammation, and the swelling in the body reaches the ovaries and harms the eggs.",
    caption: "It is daily sugar that does the damage over time — not one small sweet once a week.",
  }),
  quote("One small sweet once a week is completely fine. The problem is daily sugar — 3–4 spoons in tea many times a day, cold drinks, dessert after every meal, biscuits with chai. That is what hurts eggs over months."),
);

// Section 3
children.push(
  heading("h2", "What to eat for healthier eggs — 5 simple changes"),
  para("You don't need costly or special foods. Just change your regular ghar-ka-khana for three months, and give your eggs the nutrients they need while keeping your blood sugar steady."),
  block("infographic", {
    title: "Eat More vs Eat Less for Healthier Eggs",
    svgContent: SVG_EAT,
    altText: "A two-panel guide. Eat more of these: colourful vegetables and fruit daily; nuts and seeds such as soaked almonds and walnuts; protein at every meal like dal, paneer, curd and egg; jowar, bajra, ragi, brown rice and daliya; and ghee or olive oil, one to two teaspoons daily. Eat less of these: added sugar, cold drinks and daily sweets; maida such as white bread, naan and bakery items; fried food like puri, pakoda and chips; and alcohol and smoking, which you should stop completely.",
    caption: "Eat more of the left column, less of the right — consistently, for about three months.",
  }),
  heading("h3", "Eat more of these"),
  list("ul", [
    [T("Colourful vegetables and fruit: ", true), T("green palak, red tomato, purple beetroot, orange carrot, plus one fruit like pomegranate or orange daily. Antioxidants protect eggs from damage.")],
    [T("Nuts and seeds: ", true), T("a small handful daily of soaked almonds, walnuts, and pumpkin or sunflower seeds — the good fats your eggs need.")],
    [T("Protein every time you eat: ", true), T("include dal, paneer, curd, eggs, chicken or fish in every major meal.")],
    [T("Better roti and rice: ", true), T("jowar, bajra or ragi roti instead of only wheat; brown rice or daliya over white rice. These keep blood sugar steady.")],
    [T("Healthy fat: ", true), T("1–2 spoons of ghee or olive oil daily. Don't eat 'fat-free' food — eggs need healthy fat to grow.")],
  ]),
  heading("h3", "Eat less of these"),
  list("ul", [
    [T("Added sugar: ", true), T("stop cold drinks completely, reduce sugar in tea and coffee, and avoid daily sweets.")],
    [T("Maida: ", true), T("cut down white bread, naan, pizza and bakery items — they raise blood sugar very fast.")],
    [T("Fried food: ", true), T("limit puri, pakoda, vada and chips, which cause swelling in the body.")],
    [T("Alcohol and smoking: ", true), T("stop both completely — they directly damage eggs.")],
  ]),
);

// Section 4
children.push(
  heading("h2", "Why we test first at Bavishi Fertility Institute"),
  para("At BFI, we don't believe treatment is always the first step — and we don't believe diet alone solves everything. The right answer depends on your reports. So we test properly first:"),
  list("ul", [
    [T("We check your ", false), T("AMH, vitamins, thyroid, insulin and sugar", true), T(" levels.")],
    [T("We check your husband's ", false), T("semen, including the DNA health of the sperm", true), T(".")],
    [T("We do a ", false), T("sonography", true), T(" to see your ovaries and uterus.")],
  ]),
  para("Only after these tests do we tell you whether food and lifestyle are enough, or whether you also need medical help such as IUI or ICSI. We don't guess, and we don't follow one rule for all patients — we find what suits your body."),
);

// Conclusion + CTA
children.push(
  block("conclusionPanel", {
    headline: "The bottom line on food and egg quality",
    points: [
      { id: wid(), icon: "Clock", text: "Your eggs mature over three months — so the food changes you make today shape the egg you release later." },
      { id: wid(), icon: "Droplets", text: "Too much daily sugar weakens eggs over time. Cut cold drinks, daily sweets and maida first." },
      { id: wid(), icon: "Leaf", text: "Eat colourful vegetables, nuts, protein and jowar/bajra for three months to help your eggs grow stronger." },
      { id: wid(), icon: "ClipboardCheck", text: "Food is one part. Age, AMH and other medical issues matter too — which is why we test first." },
      { id: wid(), icon: "HeartPulse", text: "Healthy eggs are the first step to a healthy pregnancy, and that starts with knowing your own body." },
    ],
  }),
  block("inlineCta", {
    accent: "rose",
    headline: "Want to know if food alone is enough for you?",
    subtext: "Visit Bavishi Fertility Institute for a complete fertility checkup for both partners. We'll test first, then tell you honestly whether changing your food is enough — or whether you need treatment alongside it.",
    buttons: [
      { id: wid(), label: "Book a Consultation", url: "https://wa.me/919099020202", variant: "primary" },
      { id: wid(), label: "Explore Fertility Treatments", url: "/treatments", variant: "secondary" },
    ],
  }),
);

const contentRaw = JSON.stringify({
  root: { type: "root", format: "", indent: 0, version: 1, direction: "ltr", children },
});

const now = new Date().toISOString();
const doc = {
  _id: "blog-pg-281",
  _type: "blog",
  pgId: 281,
  title: "Food for Better Egg Quality: How Sugar Affects Your Eggs",
  slug: "food-for-better-egg-quality-how-sugar-affects-your-eggs",
  excerpt:
    "The egg you release this month has been maturing for three months — so your food matters. Here's how daily sugar weakens eggs, the 5 simple changes that help, and why we test first at Bavishi Fertility Institute.",
  status: "published",
  heroImageUrl: null as string | null,
  heroImageAlt: "Healthy fertility-friendly foods for better egg quality — colourful vegetables, nuts, seeds and whole grains",
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
  categoryTitle: "Female Infertility",
  categorySlug: "female-infertility",
  readMins: "6",
  publishedAt: now,
  lastUpdatedAt: now,
  treatmentSlugs: null,
  locationSlugs: null,
  faqs: [
    { question: "How long does it take to improve egg quality with diet?", answer: "About three months. The egg you release in any given month has been maturing for roughly 90 days, so the food, sleep and lifestyle changes you make now affect the eggs you release about three months later. Consistency over that window matters more than any single 'superfood'." },
    { question: "Does sugar really affect egg quality?", answer: "Yes, when eaten in excess every day. Constant high sugar and high insulin age the egg through glycation (sugar sticking to and damaging the egg), disturb your hormones — especially with PCOS — and cause inflammation that reaches the ovaries. One small sweet once a week is fine; it's the daily sugar that does the damage." },
    { question: "Do I need expensive supplements or special foods?", answer: "No. Simple, everyday ghar-ka-khana works well — colourful vegetables and fruit, nuts and seeds, protein at every meal, jowar/bajra/ragi and brown rice, and a little ghee or olive oil. Any supplements should be based on your test results, not guesswork, so we advise them only after checking your levels." },
    { question: "Is diet alone enough to get pregnant?", answer: "For some women, yes; for others, no. Diet is one important part, but age, AMH, thyroid, insulin and other medical factors also matter. That's why we test first — then tell you honestly whether food and lifestyle are enough, or whether you also need treatment such as IUI or ICSI." },
    { question: "What should I cut out first for better egg quality?", answer: "Start with cold drinks (stop completely), daily sweets and maida (white bread, naan, bakery items), and fried food. Alcohol and smoking should be stopped entirely, as they directly damage eggs." },
  ],
  seoMetaTitle: "Food for Better Egg Quality: How Sugar Affects Your Eggs | Bavishi Fertility Institute",
  seoMetaDescription:
    "Trying to conceive? Learn how daily sugar weakens your eggs, the 5 simple food changes that improve egg quality in 3 months, and why Bavishi Fertility Institute tests first before advising treatment.",
  seoOgTitle: null,
  seoOgDescription: null,
  seoOgImageUrl: null,
};

const HERO_PATH = "public/blog-media/specific blog images/Food for Better Egg Quality How Sugar Affects Your Eggs.png";

async function main() {
  const clash = await sanity.fetch(`*[_type=="blog" && slug==$s && _id!=$id]{_id}`, { s: doc.slug, id: doc._id });
  if (clash.length) throw new Error(`Slug already used by ${JSON.stringify(clash)}`);

  const blockCount = children.filter((n) => (n as { type?: string }).type === "block").length;
  const infoCount = children.filter((n) => (n as { fields?: { blockType?: string } }).fields?.blockType === "infographic").length;
  console.log(`content nodes: ${children.length}, blocks: ${blockCount}, infographics: ${infoCount}, contentRaw chars: ${contentRaw.length}`);

  if (DRY) {
    const { writeFileSync } = await import("node:fs");
    writeFileSync("scratch_blogzips/egg-window.svg", SVG_WINDOW);
    writeFileSync("scratch_blogzips/egg-sugar.svg", SVG_SUGAR);
    writeFileSync("scratch_blogzips/egg-eat.svg", SVG_EAT);
    console.log("[dry-run] wrote 3 SVGs to scratch_blogzips/");
    console.log("[dry-run] would createOrReplace", doc._id, doc.slug);
    return;
  }

  const { readFileSync, existsSync } = await import("node:fs");
  if (existsSync(HERO_PATH)) {
    const asset = await sanity.assets.upload("image", readFileSync(HERO_PATH), { filename: "food-for-better-egg-quality-hero.png" });
    doc.heroImageUrl = asset.url;
    console.log(`[ok] hero uploaded → ${asset.url}`);
  } else {
    console.log(`[warn] hero not found at "${HERO_PATH}" — publishing WITHOUT hero (gradient fallback). Add the image and re-run.`);
  }

  await sanity.createOrReplace(doc);
  console.log(`[ok] created ${doc._id} → /blogs/${doc.slug}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
