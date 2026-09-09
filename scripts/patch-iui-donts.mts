import { createClient } from "next-sanity";
const client = createClient({ projectId: "seh0zjkb", dataset: "production", apiVersion: "2024-01-01", useCdn: false, token: process.env.SANITY_API_TOKEN! });

const SLUG = "the-essential-dos-and-donts-after-iui-treatment-a-complete-guide";

interface Block { type: string; fields?: Record<string, unknown>; children?: Block[] }

const doc = await client.fetch<{ _id: string; contentRaw: string }>(
  `*[_type=="blog" && slug==$slug][0]{_id,contentRaw}`, { slug: SLUG }
);
const parsed = JSON.parse(doc.contentRaw) as { root: { children: Block[] } };
const children = parsed.root.children;

// Find the infographic block that has the dark #1A1825 right-panel header
const idx = children.findIndex(
  n => n.type === "block"
    && n.fields?.blockType === "infographic"
    && typeof n.fields?.svgContent === "string"
    && (n.fields.svgContent as string).includes("Don")
    && (n.fields.svgContent as string).includes("#1A1825")
);
if (idx === -1) throw new Error("IUI dos/donts infographic not found");

const block = children[idx];
console.log("Found block, title:", JSON.stringify(block.fields!.title));

const oldSvg = block.fields!.svgContent as string;

const newSvg = oldSvg.replace(
  /<rect x="410" y="10" width="380" height="46" rx="8" fill="#1A1825"\/>[\s\S]*?<rect x="410" y="44" width="380" height="12" fill="#1A1825"\/>\s*<text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#FFFFFF">Don[’']ts After IUI<\/text>/,
  `<text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#1A1825">Don’ts After IUI</text>\n  <line x1="418" y1="56" x2="784" y2="56" stroke="#E2DEED" stroke-width="1"/>`
);

if (newSvg === oldSvg) {
  // Try broader match
  const broader = oldSvg.replace(
    /<rect x="410" y="10" width="380" height="46" rx="8" fill="#1A1825"\/>([\s\S]*?)<text x="600" y="38"[^>]*fill="#FFFFFF">([^<]+)<\/text>/,
    (_m, _g1, title) => `<text x="600" y="38" text-anchor="middle" font-size="13" font-weight="700" fill="#1A1825">${title}</text>\n  <line x1="418" y1="56" x2="784" y2="56" stroke="#E2DEED" stroke-width="1"/>`
  );
  if (broader === oldSvg) throw new Error("No pattern matched");
  const updated = [...children];
  updated[idx] = { ...block, fields: { ...block.fields!, svgContent: broader } };
  const newContent = { root: { ...parsed.root, children: updated } };
  await client.patch(doc._id).set({ contentRaw: JSON.stringify(newContent) }).commit();
  console.log("✅ Patched (broader match) — dark panel removed from IUI dos/donts");
} else {
  const updated = [...children];
  updated[idx] = { ...block, fields: { ...block.fields!, svgContent: newSvg } };
  const newContent = { root: { ...parsed.root, children: updated } };
  await client.patch(doc._id).set({ contentRaw: JSON.stringify(newContent) }).commit();
  console.log("✅ Patched — dark panel removed from IUI dos/donts");
}
