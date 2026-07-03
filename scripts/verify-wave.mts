import { createClient } from "next-sanity";
const sanity = createClient({ projectId: "seh0zjkb", dataset: "production", apiVersion: "2024-01-01", useCdn: false, token: process.env.SANITY_API_TOKEN });

const slugs = process.argv.slice(2);
const docs = await sanity.fetch<{_id:string;slug:string;contentRaw:string}[]>(
  `*[_type=="blog" && slug in $slugs]{_id,slug,contentRaw}`, { slugs }
);

type Block = { type: string; fields?: Record<string, unknown> };
let allGood = true;
for (const d of docs) {
  let children: Block[];
  try { children = (JSON.parse(d.contentRaw) as { root: { children: Block[] } }).root.children; }
  catch (e) { console.log(`${d.slug}: PARSE ERROR`); allGood = false; continue; }
  const infographics = children.filter(n => n.type === "block" && n.fields?.blockType === "infographic");
  const images = children.filter(n => n.type === "block" && n.fields?.blockType === "externalImage");
  const redundant = infographics.filter(n => {
    const t = ((n.fields?.title as string) ?? "").toLowerCase();
    return t.includes("complete guide") || t.includes("step-by-step") || t.includes("key number") || t.includes("key recommendation") || t.includes("key aspect");
  });
  const badSvg = infographics.filter(n => {
    const svg = (n.fields?.svgContent as string) ?? "";
    return !svg.trim().startsWith("<svg") || !svg.trim().endsWith("</svg>");
  });
  const ok = images.length === 0 && redundant.length === 0 && badSvg.length === 0;
  if (!ok) allGood = false;
  console.log(`${d.slug}: images=${images.length} redundantBlocks=${redundant.length} malformedSvg=${badSvg.length} ${ok ? "OK" : "PROBLEM"}`);
}
console.log(allGood ? "\n✅ ALL CLEAN" : "\n❌ ISSUES FOUND");
