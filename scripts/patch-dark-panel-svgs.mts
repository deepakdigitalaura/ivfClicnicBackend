/* Fix dark-panel infographics in already-live blogs (Waves 12, 15, 16).
 * These blogs already have the infographic block; we update svgContent in-place.
 *
 * Design change: dark (#1A1825) right-panel headers → light (white card + dark text),
 * per the site's brand guidelines: single rose accent, no dark/navy panels anywhere.
 *
 * Run:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=seh0zjkb NEXT_PUBLIC_SANITY_DATASET=production \
 *   SANITY_API_TOKEN=<token> npx tsx scripts/patch-dark-panel-svgs.mts
 */

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token     = process.env.SANITY_API_TOKEN!;
if (!projectId || !token) throw new Error("env vars required");

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false, token });

interface Block { type: string; fields?: Record<string, unknown>; children?: Block[] }

/** Fix a 2-panel comparison SVG where the RIGHT panel has a dark header.
 *  Pattern removed: two dark-filled rects + white-text title
 *  Pattern added:   plain dark-text title + neutral border line */
function fixTwoPanelDarkRight(svg: string, rightTitle: string): string {
  // Escape special regex chars in the title
  const esc = rightTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/'/g, "['’]");
  const pattern = new RegExp(
    `<rect x="410" y="10" width="380" height="46" rx="8" fill="#1A1825"/>\\s*` +
    `<rect x="410" y="44" width="380" height="12" fill="#1A1825"/>\\s*` +
    `<text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">${esc}</text>`
  );
  const replacement =
    `<text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#1A1825">${rightTitle}</text>\n  <line x1="418" y1="56" x2="784" y2="56" stroke="#E2DEED" stroke-width="1"/>`;
  const fixed = svg.replace(pattern, replacement);
  if (fixed === svg) throw new Error(`Pattern not found for right panel title: "${rightTitle}"`);
  return fixed;
}

/** Fix SVG_PGT_PHASES: 2 dark panels (DURING PGT + AFTER PGT) */
function fixPgtPhases(svg: string): string {
  svg = svg.replace(
    /<rect x="290" y="44" width="220" height="40" rx="8" fill="#1A1825"\/>[\s\S]*?<rect x="290" y="76" width="220" height="8" fill="#1A1825"\/>\s*<text x="400" y="68" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">DURING PGT<\/text>/,
    `<text x="400" y="68" text-anchor="middle" font-size="12" font-weight="700" fill="#1A1825">DURING PGT</text>\n  <line x1="298" y1="82" x2="502" y2="82" stroke="#E2DEED" stroke-width="1"/>`
  );
  svg = svg.replace(
    /<rect x="530" y="44" width="230" height="40" rx="8" fill="#1A1825"\/>[\s\S]*?<rect x="530" y="76" width="230" height="8" fill="#1A1825"\/>\s*<text x="645" y="68" text-anchor="middle" font-size="12" font-weight="700" fill="#FFFFFF">AFTER PGT<\/text>/,
    `<text x="645" y="68" text-anchor="middle" font-size="12" font-weight="700" fill="#1A1825">AFTER PGT</text>\n  <line x1="538" y1="82" x2="752" y2="82" stroke="#E2DEED" stroke-width="1"/>`
  );
  return svg;
}

/** Fix SVG_PRP_VS_TRADITIONAL: single dark column header → ivory */
function fixPrpVsTraditional(svg: string): string {
  const fixed = svg.replace(
    /<rect x="405" y="44" width="355" height="40" rx="8" fill="#1A1825"\/>[\s\S]*?<text x="582" y="68" text-anchor="middle" font-size="11\.5" font-weight="700" fill="#FFFFFF">CHOOSE TRADITIONAL WHEN[…\.]{1,3}<\/text>/,
    `<rect x="405" y="44" width="355" height="40" rx="8" fill="#FAF9F6" stroke="#E2DEED" stroke-width="1"/>\n  <text x="582" y="68" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1A1825">CHOOSE TRADITIONAL WHEN…</text>`
  );
  return fixed;
}

const TARGETS: {
  slug: string;
  infographicTitle: string;
  fixFn: (svg: string) => string;
}[] = [
  // Wave 12
  {
    slug: "preparing-for-pgt-what-to-expect-before-during-and-after-the-procedure",
    infographicTitle: "3 Phases of the PGT Process",
    fixFn: fixPgtPhases,
  },
  {
    slug: "prp-vs-traditional-fertility-treatments-whats-the-difference",
    infographicTitle: "When to Choose: PRP vs Traditional Fertility Treatment",
    fixFn: fixPrpVsTraditional,
  },
  // Wave 15
  {
    slug: "surrogacy-vs-ivf-key-differences-benefits-and-choosing-the-right-path-to-parenthood",
    infographicTitle: "IVF vs Surrogacy: Key Benefits Compared",
    fixFn: (svg) => fixTwoPanelDarkRight(svg, "Surrogacy"),
  },
  {
    slug: "teratozoospermia-uncovering-the-causes-symptoms-and-solutions",
    infographicTitle: "Teratozoospermia: Causes & Treatments",
    fixFn: (svg) => fixTwoPanelDarkRight(svg, "Treatment Options"),
  },
  // Wave 16
  {
    slug: "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide",
    infographicTitle: "Key Do’s and Don’ts After IUI Treatment",
    fixFn: (svg) => fixTwoPanelDarkRight(svg, "Don’ts After IUI"),
  },
];

async function main() {
  for (const { slug, infographicTitle, fixFn } of TARGETS) {
    console.log(`\n▶ Patching: ${slug}`);

    const doc = await client.fetch<{ _id: string; contentRaw: string } | null>(
      `*[_type=="blog" && slug==$slug && status=="published"][0]{_id,contentRaw}`,
      { slug }
    );
    if (!doc) { console.log("  ❌ Not found"); continue; }

    let children: Block[];
    try { children = (JSON.parse(doc.contentRaw) as { root: { children: Block[] } }).root.children; }
    catch { console.log("  ❌ Parse error"); continue; }

    // Find the infographic block by title
    const idx = children.findIndex(
      n => n.type === "block" && (n.fields?.blockType as string) === "infographic"
        && (n.fields?.title as string) === infographicTitle
    );
    if (idx === -1) {
      console.log(`  ❌ Infographic block "${infographicTitle}" not found`);
      continue;
    }

    const block = children[idx];
    const oldSvg = block.fields!.svgContent as string;

    let newSvg: string;
    try { newSvg = fixFn(oldSvg); }
    catch (e) { console.log(`  ❌ Fix failed: ${(e as Error).message}`); continue; }

    if (newSvg === oldSvg) { console.log("  ℹ No change needed (already fixed?)"); continue; }

    // Write back the corrected SVG
    const updated = [...children];
    updated[idx] = { ...block, fields: { ...block.fields!, svgContent: newSvg } };
    const newRoot = { root: { ...(JSON.parse(doc.contentRaw) as { root: object }).root, children: updated } };
    await client.patch(doc._id).set({ contentRaw: JSON.stringify(newRoot) }).commit();
    console.log(`  ✅ Patched (dark panel removed from "${infographicTitle}")`);
  }
  console.log("\n✅ Done — all live dark-panel infographics patched.");
}

main().catch(e => { console.error(e); process.exit(1); });
