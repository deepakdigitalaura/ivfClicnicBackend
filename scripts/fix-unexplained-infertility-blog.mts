/* =====================================================================
 * One-off structural + content fix for:
 *   unexplained-infertility-when-tests-are-normal-but-you-still-cant-conceive
 *
 * Root cause: this blog's Lexical content was authored with raw "• "
 * bullet characters typed inside paragraph/listitem text instead of real
 * list nodes, and pipe-delimited "Test | X | Y" text instead of a real
 * comparisonTable block. Where it *did* use real list nodes, the bullet
 * character was ALSO typed at the front of the text, so the renderer's
 * own <li> marker plus the literal "• " produced double bullets. A few
 * sections were also left as compressed outline notes ("Includes key
 * questions on: • X. • Y.") instead of full reader-facing sentences.
 *
 * This script rebuilds the affected nodes in place:
 *   - stat trio (paras)      -> statStrip block
 *   - bold sub-heading para  -> real h3
 *   - "Key Causes:" para     -> intro para + bullet list
 *   - pipe-table paras       -> comparisonTable block
 *   - list items w/ "• "     -> stripped text (real list marker only)
 *   - split glued ERA/Hysteroscopy list item into two items
 *   - "Step N:" paras        -> ordered list
 *   - "For X:" bullet paras  -> intro para + bullet list (x3)
 *   - outline-note paras     -> full expanded bullet lists
 *   - truncated CTA headline -> clean headline
 * ===================================================================== */

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;
if (!projectId || !token) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN required");

const sanity = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

const SLUG = "unexplained-infertility-when-tests-are-normal-but-you-still-cant-conceive";
const DRY_RUN = process.argv.includes("--dry-run");

type LexicalNode = Record<string, any>;

// ── Builders ──────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 14) + Math.random().toString(36).slice(2, 6);
const uuid = () => crypto.randomUUID();

function text(t: string, opts: { bold?: boolean } = {}): LexicalNode {
  return { mode: "normal", text: t, type: "text", style: "", detail: 0, format: opts.bold ? 1 : 0, version: 1 };
}
function linebreak(): LexicalNode {
  return { type: "linebreak", version: 1 };
}
function link(url: string, t: string, opts: { bold?: boolean; newTab?: boolean } = {}): LexicalNode {
  return {
    type: "link",
    fields: { url, newTab: !!opts.newTab, linkType: "custom" },
    format: "", indent: 0, version: 1,
    children: [text(t, opts)],
    direction: "ltr",
  };
}
function paragraph(children: LexicalNode[]): LexicalNode {
  return { type: "paragraph", format: "", indent: 0, version: 1, children, direction: "ltr", textStyle: "", textFormat: 0 };
}
function heading(tag: "h2" | "h3", t: string): LexicalNode {
  return { tag, type: "heading", format: "", indent: 0, version: 1, children: [text(t)], direction: "ltr" };
}
function listItem(children: LexicalNode[], value: number): LexicalNode {
  return { type: "listitem", value, format: "", indent: 0, version: 1, children, direction: "ltr" };
}
function bulletList(items: LexicalNode[][]): LexicalNode {
  return {
    tag: "ul", type: "list", start: 1, format: "", indent: 0, version: 1,
    children: items.map((kids, idx) => listItem(kids, idx + 1)),
    listType: "bullet", direction: "ltr",
  };
}
function numberList(items: LexicalNode[][]): LexicalNode {
  return {
    tag: "ol", type: "list", start: 1, format: "", indent: 0, version: 1,
    children: items.map((kids, idx) => listItem(kids, idx + 1)),
    listType: "number", direction: "ltr",
  };
}
function statStripBlock(items: { value: string; label: string }[]): LexicalNode {
  return {
    type: "block",
    fields: { id: uuid(), items: items.map((it) => ({ id: uid(), ...it })), blockType: "statStrip" },
    format: "", version: 2,
  };
}
function comparisonTableBlock(rowHeader: string, columns: string[], rows: [string, ...string[]][]): LexicalNode {
  return {
    type: "block",
    fields: {
      id: uuid(),
      rowHeader,
      columns: columns.map((header) => ({ id: uid(), header })),
      rows: rows.map(([rowLabel, ...cells]) => ({ id: uid(), rowLabel, cells: cells.map((value) => ({ id: uid(), value })) })),
      blockName: "",
      blockType: "comparisonTable",
    },
    format: "", version: 2,
  };
}

/** Strip a leading literal "• " (or bare "•") bullet char + leading space from a listitem's first text child. */
function stripListBullets(list: LexicalNode): LexicalNode {
  for (const item of list.children) {
    const first = item.children?.[0];
    if (first?.type === "text") {
      first.text = first.text.replace(/^\s*•\s*/, "").replace(/^\s+/, "");
    }
  }
  return list;
}

// ── Section builders ────────────────────────────────────────────────
const statStrip = statStripBlock([
  { value: "1 in 6", label: "Couples affected by infertility worldwide" },
  { value: "15–30%", label: "Cases diagnosed as unexplained infertility" },
  { value: "85%+", label: "Success rates with advanced fertility treatments" },
]);

const problemHeading = heading("h3", "The problem With “Normal”");

const keyCausesIntro = paragraph([text("Key Causes:", { bold: true })]);
const keyCausesList = bulletList([
  [text("Subtle egg quality issues (aneuploidy)")],
  [text("Sperm DNA fragmentation.")],
  [text("Endometrial receptivity dysfunction.")],
  [text("Silent/"), link("/endometriosis", "minimal endometriosis"), text(".")],
  [text("Immunological factors.")],
  [text("Poor embryo development.")],
  [text("Luteal phase defect.")],
  [text("Oxidative stress.")],
  [text("Genetic/epigenetic factors.")],
]);

const diagnosticTable = comparisonTableBlock("Test", ["What It Measures", "What It Misses"], [
  ["Semen Analysis", "Count, motility, morphology", "DNA fragmentation, functional capacity"],
  ["Day 21 Progesterone", "Ovulation", "Luteal adequacy, egg quality"],
  ["AMH / AFC", "Ovarian reserve", "Egg chromosomal quality"],
  ["HSG", "Tube blockage", "Subtle scarring"],
  ["FSH/LH", "Hormonal signals", "Subtle dysregulation"],
  ["Ultrasound", "Structure", "Receptivity, micro-polyps"],
  ["TSH", "Thyroid function", "Subclinical effects"],
]);

const treatmentSteps = numberList([
  [text("Step 1: Expectant Management", { bold: true }), text(" — 25–35% success over 3 years")],
  [text("Step 2: Ovulation Induction (OI)", { bold: true }), text(" — 5–7% per cycle")],
  [text("Step 3: ", { bold: true }), link("/intra-uterine-insemination-iui", "IUI", { bold: true }), text(" — 10–15% per cycle")],
  [text("Step 4: ", { bold: true }), link("/what-is-ivf", "IVF", { bold: true }), text(" + if required ICSI — 50–65% per cycle (<35 years)")],
]);

const lifestyleBoth = [
  paragraph([text("For both partners:", { bold: true })]),
  bulletList([
    [text("Healthy BMI.")],
    [text("Quit smoking.")],
    [text("Limit alcohol.")],
    [text("Manage stress.")],
    [text("Good sleep.")],
    [text("Reduce toxins.")],
    [text("CoQ10 supplementation.")],
  ]),
];
const lifestyleMen = [
  paragraph([text("For men:", { bold: true })]),
  bulletList([
    [text("Avoid heat exposure.")],
    [text("Nutritional supplements.")],
    [text("Treat varicocele.")],
  ]),
];
const lifestyleWomen = [
  paragraph([text("For women:", { bold: true })]),
  bulletList([
    [text("Folic acid.")],
    [text("Vitamin D.")],
    [text("Mediterranean diet.")],
    [text("Avoid excessive exercise.")],
  ]),
];

const questionsIntro = paragraph([text("Bring these questions to your next appointment:")]);
const questionsList = bulletList([
  [text("What is my sperm DNA fragmentation index (DFI), and could it be affecting fertilization?")],
  [text("Should I have an "), link("https://ivfclinic.com/era-test/", "ERA test", { newTab: true }), text(" done before my next embryo transfer to check endometrial receptivity?")],
  [text("Given our history, what would you change about our IVF stimulation or transfer strategy?")],
  [text("Would PGT-A genetic testing of our embryos help explain why previous cycles haven’t worked?")],
  [text("Are there lifestyle changes — for either of us — that could meaningfully improve our chances?")],
]);

const secondOpinionIntro = paragraph([text("Consider a second opinion if:")]);
const secondOpinionList = bulletList([
  [text("You’ve completed a full unexplained-infertility workup and still have no diagnosis.")],
  [text("You’ve had "), link("/ivf-failure", "failed IUI/IVF cycles"), text(" with no explanation for why they didn’t work.")],
  [text("You’ve experienced recurrent miscarriage alongside unexplained infertility.")],
  [text("Your current clinic hasn’t offered advanced testing such as DFI, ERA, or PGT-A.")],
]);

const successIntro = paragraph([text("Examples of couples succeeding with:")]);
const successList = bulletList([
  [text("IVF + PGT-A — selecting a chromosomally normal (euploid) embryo for transfer after standard cycles failed for no clear reason.")],
  [text("Treating sperm DNA fragmentation — addressing a hidden male-factor cause that a normal semen analysis had missed.")],
]);

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  const doc = await sanity.fetch<{ _id: string; contentRaw: string }>(
    `*[_type=="blog"&&slug=="${SLUG}"][0]{_id,contentRaw}`
  );
  if (!doc?._id) throw new Error(`Blog not found: ${SLUG}`);
  console.log(`Found: ${doc._id}`);

  const es = JSON.parse(doc.contentRaw) as { root: { children: LexicalNode[] } };
  const children = es.root.children;

  const INSERT_BEFORE: Record<number, LexicalNode[]> = {
    4: [statStrip],
    15: [problemHeading],
    22: [keyCausesIntro, keyCausesList],
    24: [diagnosticTable],
    29: [treatmentSteps],
    34: [...lifestyleBoth, ...lifestyleMen, ...lifestyleWomen],
    40: [questionsIntro, questionsList],
    42: [secondOpinionIntro, secondOpinionList],
    44: [successIntro, successList],
  };
  const DELETE = new Set([4, 5, 6, 15, 22, 24, 25, 29, 30, 31, 32, 34, 35, 36, 40, 42, 44]);

  // Build the new list[27]: split the glued "ERA / Hysteroscopy" item into two.
  const eraLink = link("https://ivfclinic.com/era-test/", "Endometrial Receptivity Array. (ERA)", { newTab: true });
  const newList27 = bulletList([
    [text("Sperm DNA Fragmentation Test. (DFI)")],
    [eraLink],
    [text("Hysteroscopy or Laparoscopy")],
    [text("PGT-A (Genetic testing of embryos)")],
    [text("Endometrial infection testing.")],
    [text("Reproductive Immunology Panel.")],
    [text("Karyotyping")],
    [text("Endometrial Microbiome Testing.")],
  ]);

  const next: LexicalNode[] = [];
  for (let i = 0; i < children.length; i++) {
    if (INSERT_BEFORE[i]) next.push(...INSERT_BEFORE[i]);
    if (DELETE.has(i)) continue;

    if (i === 12 || i === 17 || i === 38) {
      next.push(stripListBullets(children[i]));
      continue;
    }
    if (i === 27) {
      next.push(newList27);
      continue;
    }
    if (i === 50) {
      const panel = children[i];
      const newPoints = [
        "Unexplained infertility means the cause is undetectable with standard tests — not that nothing is wrong.",
        "Normal semen analysis, ovulation, tubes, and uterine cavity don’t rule out fertilization or embryo-quality issues.",
        "Hidden causes — egg quality, sperm DNA fragmentation, endometrial receptivity, immune factors — are often treatable once identified.",
        "Standard tests measure quantity and structure; they miss function, chromosomal quality, and subclinical inflammation.",
        "Advanced tests like DFI, ERA, and PGT-A can uncover what routine testing misses and guide the next treatment step.",
      ];
      panel.fields.points = panel.fields.points.map((p: any, idx: number) => ({ ...p, text: newPoints[idx] ?? p.text }));
      next.push(panel);
      continue;
    }
    if (i === 52) {
      const cta = children[i];
      cta.fields.headline = "Have Questions About Unexplained Infertility?";
      next.push(cta);
      continue;
    }

    next.push(children[i]);
  }

  console.log(`Original children: ${children.length} -> New children: ${next.length}`);

  es.root.children = next;
  const newContentRaw = JSON.stringify(es);

  if (DRY_RUN) {
    console.log("DRY RUN — not writing. New length:", newContentRaw.length);
    next.forEach((c: any, i: number) => {
      let summary = c.type;
      if (c.type === "block") summary += ` [${c.fields?.blockType}]`;
      if (c.type === "heading") summary += ` (${c.tag}) "${(c.children || []).map((cc: any) => cc.text).join("")}"`;
      if (c.type === "list") summary += ` (${c.listType}) items=${(c.children || []).length}`;
      if (c.type === "paragraph") {
        const t = (c.children || []).map((cc: any) => (cc.type === "text" ? cc.text : cc.type === "link" ? `[LINK:${(cc.children||[]).map((x:any)=>x.text).join("")}]` : "")).join("");
        summary += ` "${t.slice(0, 120)}"`;
      }
      console.log(`[${i}] ${summary}`);
    });
    return;
  }

  await sanity.patch(doc._id).set({ contentRaw: newContentRaw }).commit();
  console.log(`✅ Patched ${doc._id} (${newContentRaw.length} bytes)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
